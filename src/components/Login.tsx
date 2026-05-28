import { useState } from 'react';
import { Link } from 'react-router-dom';

export function Login({ portalName, onLogin }: { portalName: string; onLogin: () => void }) {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-2xl mb-4">
          Z
        </div>
        <h2 className="text-center text-3xl font-bold tracking-tight text-neutral-900 mb-2">
          {portalName}
        </h2>
        <p className="text-center text-sm text-neutral-500">
          Sign in to access your portal space
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-neutral-200">
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700">Email address</label>
              <div className="mt-1">
                <input id="email" name="email" type="email" defaultValue="demo@zyael.com" required className="block w-full appearance-none rounded-md border border-neutral-300 px-3 py-2 placeholder-neutral-400 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700">Password</label>
              <div className="mt-1">
                <input id="password" name="password" type="password" defaultValue="password" required className="block w-full appearance-none rounded-md border border-neutral-300 px-3 py-2 placeholder-neutral-400 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm" />
              </div>
            </div>

            <div>
              <button type="submit" className="flex w-full items-center justify-center rounded-md border border-transparent bg-emerald-600 py-2.5 px-4 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors">
                Sign In
              </button>
            </div>
          </form>
          
          <div className="mt-6 border-t border-neutral-100 pt-6 flex flex-col items-center gap-3">
            <div className="text-sm">
              <span className="text-neutral-500">Don't have an account? </span>
              <Link to="/signup" className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors">
                Sign up
              </Link>
            </div>
            <div className="text-sm">
              <Link to="/" className="font-medium text-neutral-500 hover:text-neutral-900 transition-colors flex items-center gap-1">
                &larr; Back to Landing Page
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
