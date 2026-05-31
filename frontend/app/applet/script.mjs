import { execSync } from 'child_process';
try {
  console.log(execSync('git log -p src/components/Home.tsx').toString());
} catch (e) {
  console.error(e.message);
}
