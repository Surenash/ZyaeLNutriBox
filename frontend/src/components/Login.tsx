import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8080'; 

export function Login({ portalName, onLogin }: { portalName: string; onLogin: () => void }) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: email, password }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'Invalid email or password');
      }

      const data = await response.json();
      
      // Clean the role string completely
      const userRole = String(data.role || '').trim().toUpperCase();
      // Extract the User ID and make it uppercase to be safe
      const userId = String(data.userId || '').trim().toUpperCase();

      localStorage.setItem('token', data.userId);
      localStorage.setItem('role', userRole);
      
      onLogin(); 

      // --- SMART ROUTING ---
      // 1. FIRST, check if this is a Media Team member based on their ID prefix
      if (userId.startsWith('MEDI')) {
        navigate('/media');
      } 
      // 2. Otherwise, route based on their Role
      else if (userRole.includes('ADMIN') && !userRole.includes('KITCHEN')) {
        navigate('/admin');
      } else if (userRole.includes('KITCHEN')) {
        navigate('/kitchen');
      } else if (userRole.includes('NUTR')) {
        navigate('/nutritionist');
      } else if (userRole.includes('DRIV') || userRole.includes('DELIVERY')) {
        navigate('/delivery');
      } else {
        navigate('/customer'); // Safe default
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-2xl mb-4">Z</div>
        <h2 className="text-center text-3xl font-bold tracking-tight text-neutral-900 mb-2">{portalName}</h2>
        <p className="text-center text-sm text-neutral-500">Sign in to access your portal space</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-neutral-200">
          {error && <div className="mb-4 p-3 rounded-md bg-red-50 text-red-600 text-sm border border-red-100">{error}</div>}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-neutral-700">Email / Username</label>
              <input name="email" type="text" required className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none sm:text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700">Password</label>
              <input name="password" type="password" required className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none sm:text-sm" />
            </div>
            <button type="submit" disabled={loading} className="flex w-full items-center justify-center rounded-md bg-emerald-600 py-2.5 px-4 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 transition-colors disabled:opacity-70">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          
          <div className="mt-6 border-t border-neutral-100 pt-6 flex flex-col items-center gap-3">
            <div className="text-sm">
              <span className="text-neutral-500">Don't have an account? </span>
              <Link to="/signup" className="font-medium text-emerald-600 hover:text-emerald-500">Sign up</Link>
            </div>
            <div className="text-sm">
              <Link to="/" className="font-medium text-neutral-500 hover:text-neutral-900">&larr; Back to Landing Page</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}