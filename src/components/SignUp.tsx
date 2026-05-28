import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export function SignUp() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      navigate('/customer');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-lg">
            Z
          </div>
          <span className="font-bold text-2xl tracking-tight text-neutral-900">ZyaeL <span className="text-emerald-600">NutriBox</span></span>
        </Link>
        <h2 className="text-3xl font-bold tracking-tight text-neutral-900">
          Create your account
        </h2>
        <p className="mt-2 text-neutral-600">
          Step {step} of 3
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-neutral-100 sm:rounded-2xl sm:px-10">
          <form className="space-y-6" onSubmit={handleNext}>
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-neutral-900">Full Name</label>
                    <input id="name" type="text" required className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-neutral-900">Email address</label>
                    <input id="email" type="email" required className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-neutral-900">Password</label>
                    <input id="password" type="password" required className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-neutral-900">What is your primary goal?</h3>
                  <div className="space-y-2">
                    {['Weight Loss', 'Muscle Gain', 'Maintenance', 'Medical/Dietary Needs'].map((goal) => (
                      <label key={goal} className="flex items-center p-3 border border-neutral-200 rounded-lg cursor-pointer hover:bg-neutral-50">
                        <input type="radio" name="goal" className="h-4 w-4 text-emerald-600 border-neutral-300 focus:ring-emerald-500" required />
                        <span className="ml-3 text-neutral-900">{goal}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-neutral-900">Dietary Restrictions</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {['Vegetarian', 'Vegan', 'Keto', 'Paleo', 'Gluten-Free', 'Dairy-Free', 'Nut Allergy', 'None'].map((diet) => (
                      <label key={diet} className="flex items-center p-3 border border-neutral-200 rounded-lg cursor-pointer hover:bg-neutral-50">
                        <input type="checkbox" className="h-4 w-4 text-emerald-600 rounded border-neutral-300 focus:ring-emerald-500" />
                        <span className="ml-2 text-sm text-neutral-900">{diet}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            <div className="flex gap-3">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="flex-1 py-2 px-4 border border-neutral-300 rounded-lg shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                className="flex-1 flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700"
              >
                {step < 3 ? 'Next Step' : 'Complete Registration'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-neutral-500">Already have an account? </span>
            <Link to="/customer" className="font-medium text-emerald-600 hover:text-emerald-500">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
