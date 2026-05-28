import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ArrowRight } from 'lucide-react';

export const articles = [
  {
    id: 1,
    title: "How to Identify Your Daily Calorie Needs Based on Your Goals",
    description: "Understanding your daily calorie needs is a key step in achieving your health and fitness goals, whether you are trying to lose weight, gain muscle, or maintain your current physique.",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2653&auto=format&fit=crop",
    date: "Oct 12, 2026",
    readTime: "5 min read"
  },
  {
    id: 2,
    title: "How Sarah Lost 20lbs in 3 Months Without Giving Up Pizza",
    description: "Sarah had tried every fad diet under the sun. It wasn't until she discovered flexible dieting and macro balancing that she finally found a sustainable way to lose weight and keep it off.",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2670&auto=format&fit=crop",
    date: "Oct 25, 2026",
    readTime: "4 min read"
  },
  {
    id: 3,
    title: "From Lethargic to Marathon Ready: John's Journey with Macro Balancing",
    description: "John always felt tired, especially during his afternoon slumps. By optimizing his macronutrient intake, he not only skyrocketed his energy levels but also trained for his first marathon.",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=2670&auto=format&fit=crop",
    date: "Nov 02, 2026",
    readTime: "6 min read"
  }
];

export function NewsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-black text-xl text-slate-900 tracking-tight">Nutrition News</span>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Latest Articles</h1>
          <p className="text-lg text-slate-500 font-medium">Stay updated with the latest in nutrition and wellness.</p>
        </div>

        <div className="space-y-8">
          {articles.map((article, idx) => (
            <motion.article 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={article.id}
              onClick={() => navigate(`/news/${article.id}`)}
              className="bg-white rounded-[32px] overflow-hidden border border-slate-200 shadow-xl shadow-slate-200/40 flex flex-col md:flex-row group cursor-pointer hover:border-emerald-200 transition-colors"
            >
              <div className="w-full md:w-2/5 aspect-video md:aspect-auto relative overflow-hidden">
                <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                  <span>{article.date}</span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                  <span>{article.readTime}</span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight group-hover:text-emerald-700 transition-colors">{article.title}</h2>
                <p className="text-slate-500 font-medium leading-relaxed mb-6 flex-1">
                  {article.description}
                </p>
                <div className="mt-auto">
                  <button className="inline-flex items-center px-6 py-3 rounded-xl border-2 border-emerald-600 text-emerald-600 font-black uppercase text-xs tracking-widest hover:bg-emerald-50 transition-colors">
                    Read Article <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </main>
    </div>
  );
}
