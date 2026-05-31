import { Link } from 'react-router-dom';
import { Leaf, ArrowRight, ShieldCheck, HeartPulse } from 'lucide-react';
import { motion } from 'motion/react';

export function Home() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
              Z
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">ZyaeL <span className="text-emerald-600 font-medium">NutriBox</span></span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/management" className="text-sm font-medium text-slate-500 hover:text-slate-900">
              Staff Portal
            </Link>
            <Link to="/customer" className="text-sm font-medium text-slate-900 hover:text-emerald-600">
              Sign In
            </Link>
            <Link to="/signup" className="text-sm font-medium bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center max-w-3xl mx-auto">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6"
            >
              Nutrition crafted for your precise <span className="text-emerald-600">biological needs.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-slate-600 mb-10"
            >
              Stop guessing. Get scientifically-backed meals delivered straight to your door, perfectly portioned for your fitness and health goals.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center gap-4"
            >
              <Link to="/signup" className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-emerald-700 transition-colors">
                Start Your Journey <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </section>

        <section className="bg-white py-24 border-t border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-600">
                  <HeartPulse className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Tailored Health</h3>
                <p className="text-slate-600">Consult with professional nutritionists to craft a plan that matches your bloodwork and biometrics.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-orange-600">
                  <Leaf className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Fresh Ingredients</h3>
                <p className="text-slate-600">Locally sourced, organic produce and premium proteins prepared daily in our cloud kitchen.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Guaranteed Results</h3>
                <p className="text-slate-600">Track your macros, adjust your meals synchronously, and watch your body naturally transform.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
