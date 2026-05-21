const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add support for CSS files
config.resolver.sourceExts.push('css');

// Configure for monorepo - STRICTLY prioritize local node_modules first
// Also include parent node_modules for packages that are deduped (like react-native-web)
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),  // Local node_modules FIRST (highest priority)
  path.resolve(__dirname, '..', 'node_modules'),  // Parent node_modules (for deduped packages)
];

// Explicit aliasing to force React 19 from local node_modules
// react-native-web can come from parent node_modules (deduped)
const fs = require('fs');
const localReactNativeWeb = path.resolve(__dirname, 'node_modules/react-native-web');
const parentReactNativeWeb = path.resolve(__dirname, '..', 'node_modules/react-native-web');
const reactNativeWebPath = fs.existsSync(localReactNativeWeb) ? localReactNativeWeb : parentReactNativeWeb;

config.resolver.alias = {
  'react': path.resolve(__dirname, 'node_modules/react'),
  'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
  'react/jsx-runtime': path.resolve(__dirname, 'node_modules/react/jsx-runtime'),
  'react/jsx-dev-runtime': path.resolve(__dirname, 'node_modules/react/jsx-dev-runtime'),
  'react-native-web': reactNativeWebPath,
  'react-native-web/dist/index': path.resolve(reactNativeWebPath, 'dist/index'),
  'react-native-web/dist/exports/NativeEventEmitter': path.resolve(reactNativeWebPath, 'dist/exports/NativeEventEmitter'),
};

// Block parent node_modules to prevent React version conflicts
// Note: react-native-web is allowed from parent node_modules since it's deduped there
config.resolver.blockList = [
  /node_modules\/.*\/node_modules\/react/,
  // Block React from root node_modules (but allow react-native-web)
  new RegExp(path.resolve(__dirname, '..', 'node_modules', 'react').replace(/\\/g, '\\\\') + '.*'),
  new RegExp(path.resolve(__dirname, '..', 'node_modules', 'react-dom').replace(/\\/g, '\\\\') + '.*'),
];

// Custom resolver to handle all react-native-web subpaths dynamically
// This ensures react-native-web is resolved from local or parent node_modules
// Handles both file and directory-based exports (e.g., NativeEventEmitter/index.js)
const originalResolveRequest = config.resolver.resolveRequest;
const localNodeModules = path.resolve(__dirname, 'node_modules');
const parentNodeModules = path.resolve(__dirname, '..', 'node_modules');
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Intercept all react-native-web imports and redirect to local or parent node_modules
  if (moduleName && moduleName.startsWith('react-native-web')) {
    const fs = require('fs');
    // Try local first, then parent
    const searchPaths = [localNodeModules, parentNodeModules];
    
    for (const searchPath of searchPaths) {
      // Try the exact path first (e.g., react-native-web/dist/exports/NativeEventEmitter)
      let exactPath = path.resolve(searchPath, moduleName);
      
      // First check if it's a directory - if so, look for index.js inside
      try {
        const stats = fs.statSync(exactPath);
        if (stats.isDirectory()) {
          // It's a directory, check for index.js inside
          const indexPath = path.resolve(exactPath, 'index.js');
          if (fs.existsSync(indexPath)) {
            return {
              filePath: indexPath,
              type: 'sourceFile',
            };
          }
        }
      } catch (e) {
        // Path doesn't exist as directory, continue to file checks
      }
      
      // Try as a file with various extensions
      const extensions = ['.js', '.ts', '.tsx', '.jsx', ''];
      for (const ext of extensions) {
        const testPath = exactPath + ext;
        if (fs.existsSync(testPath) && fs.statSync(testPath).isFile()) {
          return {
            filePath: testPath,
            type: 'sourceFile',
          };
        }
      }
    }
  }
  
  // Use default resolver for other modules
  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

// Ensure project root is correctly set
config.projectRoot = __dirname;
// Include parent node_modules in watchFolders so Metro can watch deduped packages like react-native-web
config.watchFolders = [
  __dirname,
  path.resolve(__dirname, '..', 'node_modules'),
];

// Exclude problematic paths from watching (native modules that may not exist)
config.watcher = {
  ...config.watcher,
  ignored: [
    /node_modules\/.*\/node_modules\/.*/,
    /.*lightningcss.*/,
    /.*\.native\./,
  ],
};

// Configure NativeWind
module.exports = withNativeWind(config, { input: './global.css' });
