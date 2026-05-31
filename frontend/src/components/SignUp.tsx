import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { User, Truck, Stethoscope } from 'lucide-react';

// Dynamically pull from .env, fallback to localhost if missing
const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8080'; 

export function SignUp() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Hold all data across steps
  const [formData, setFormData] = useState({
    role: 'CUSTOMER', // Default
    name: '',
    email: '',
    password: '',
    goal: '',
    diets: [] as string[]
  });

  const handleDietToggle = (diet: string) => {
    setFormData((prev) => ({
      ...prev,
      diets: prev.diets.includes(diet)
        ? prev.diets.filter((d) => d !== diet)
        : [...prev.diets, diet]
    }));
  };

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // If they are a Customer, they have 4 steps. Staff only have 2 steps.
    const maxSteps = formData.role === 'CUSTOMER' ? 4 : 2;

    if (step < maxSteps) {
      setStep(step + 1);
    } else {
      // Final Step reached -> Fire API logic
      setLoading(true);
      setError('');
      
      try {
        // 1. Register the User with chosen role
        const registerRes = await fetch(`${API_BASE}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            username: formData.email.split('@')[0], // Fallback username required by backend
            fullName: formData.name,
            password: formData.password,
            confirmPassword: formData.password, 
            role: formData.role
          })
        });

        if (!registerRes.ok) {
          const err = await registerRes.json();
          throw new Error(err.detail || 'Failed to create account');
        }

        const newUser = await registerRes.json();
        const userId = newUser.userId;

        // 2. Log them in to get the token
        const loginRes = await fetch(`${API_BASE}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier: formData.email, password: formData.password })
        });
        
        const loginData = await loginRes.json();
        localStorage.setItem('token', loginData.userId); // Store userId for MVP mock routing

        // 3. If Customer, save Goals and Diets
        if (formData.role === 'CUSTOMER') {
          await fetch(`${API_BASE}/api/customer/profile?user_id=${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fitnessGoals: formData.goal ? [formData.goal] : [],
              allergies: formData.diets
            })
          });
        }

        // 4. Redirect based on role
        if (formData.role === 'CUSTOMER') navigate('/customer');
        if (formData.role === 'DRIVER') navigate('/delivery');
        if (formData.role === 'NUTRITIONIST') navigate('/nutritionist');

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const roleOptions = [
    { id: 'CUSTOMER', label: 'Customer', icon: User, desc: 'Get customized meal plans' },
    { id: 'DRIVER', label: 'Delivery Partner', icon: Truck, desc: 'Deliver fresh meals daily' },
    { id: 'NUTRITIONIST', label: 'Nutritionist', icon: Stethoscope, desc: 'Manage patient diets' }
  ];

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-lg">Z</div>
          <span className="font-bold text-2xl tracking-tight text-neutral-900">ZyaeL <span className="text-emerald-600">NutriBox</span></span>
        </Link>
        <h2 className="text-3xl font-bold tracking-tight text-neutral-900">
          Create your account
        </h2>
        <p className="mt-2 text-neutral-600">
          Step {step} of {formData.role === 'CUSTOMER' ? '4' : '2'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-neutral-100 sm:rounded-2xl sm:px-10 overflow-hidden">
          
          {error && (
            <div className="mb-4 p-3 rounded-md bg-red-50 text-red-600 text-sm border border-red-100">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleNext}>
            <AnimatePresence mode="wait">
              
              {/* STEP 1: CHOOSE ROLE */}
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-neutral-900 mb-4">How will you be using ZyaeL?</h3>
                    <div className="space-y-3">
                      {roleOptions.map((role) => {
                        const Icon = role.icon;
                        const isSelected = formData.role === role.id;
                        return (
                          <div 
                            key={role.id} 
                            onClick={() => setFormData({...formData, role: role.id})}
                            className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer border-2 transition-all ${isSelected ? 'border-emerald-600 bg-emerald-50' : 'border-neutral-200 hover:border-emerald-200 hover:bg-neutral-50'}`}
                          >
                            <div className={`p-2 rounded-lg ${isSelected ? 'bg-emerald-600 text-white' : 'bg-neutral-100 text-neutral-500'}`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div>
                               <p className={`font-bold ${isSelected ? 'text-emerald-900' : 'text-neutral-900'}`}>{role.label}</p>
                               <p className="text-xs text-neutral-500">{role.desc}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: CREDENTIALS */}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-900">Full Name</label>
                      <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 focus:ring-emerald-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-900">Email address</label>
                      <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 focus:ring-emerald-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-900">Password</label>
                      <input type="password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 focus:ring-emerald-500" />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: GOALS (CUSTOMER ONLY) */}
              {step === 3 && formData.role === 'CUSTOMER' && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-neutral-900">What is your primary goal?</h3>
                    <div className="space-y-2">
                      {['Weight Loss', 'Muscle Gain', 'Maintenance', 'Medical/Dietary Needs'].map((goal) => (
                        <label key={goal} className="flex items-center p-3 border border-neutral-200 rounded-lg cursor-pointer hover:bg-neutral-50">
                          <input type="radio" name="goal" required checked={formData.goal === goal} onChange={() => setFormData({...formData, goal})} className="h-4 w-4 text-emerald-600 focus:ring-emerald-500" />
                          <span className="ml-3 text-neutral-900">{goal}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: DIETS (CUSTOMER ONLY) */}
              {step === 4 && formData.role === 'CUSTOMER' && (
                <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-neutral-900">Dietary Restrictions</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {['Vegetarian', 'Vegan', 'Keto', 'Paleo', 'Gluten-Free', 'Dairy-Free', 'Nut Allergy', 'None'].map((diet) => (
                        <label key={diet} className="flex items-center p-3 border border-neutral-200 rounded-lg cursor-pointer hover:bg-neutral-50">
                          <input type="checkbox" checked={formData.diets.includes(diet)} onChange={() => handleDietToggle(diet)} className="h-4 w-4 text-emerald-600 rounded focus:ring-emerald-500" />
                          <span className="ml-2 text-sm text-neutral-900">{diet}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>

            <div className="flex gap-3 mt-8">
              {step > 1 && (
                <button type="button" onClick={() => setStep(step - 1)} disabled={loading} className="flex-1 py-2 px-4 border border-neutral-300 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                  Back
                </button>
              )}
              <button type="submit" disabled={loading} className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700">
                {loading ? 'Processing...' : (step === 1 ? 'Continue' : ((step === 2 && formData.role !== 'CUSTOMER') || step === 4 ? 'Complete Registration' : 'Next Step'))}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-neutral-500">Already have an account? </span>
            <Link to="/login" className="font-medium text-emerald-600 hover:text-emerald-500">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}