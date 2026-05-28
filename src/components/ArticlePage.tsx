import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Calendar, Clock, User, Share2 } from 'lucide-react';

const articlesData = [
  {
    id: 1,
    title: "How to Identify Your Daily Calorie Needs Based on Your Goals",
    description: "Understanding your daily calorie needs is a key step in achieving your health and fitness goals, whether you are trying to lose weight, gain muscle, or maintain your current physique.",
    content: "Calculating your daily calorie needs starts with understanding your Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE). Your BMR is the number of calories your body needs to maintain basic physiological functions like breathing and circulation while at rest. Once you have your BMR, you multiply it by an activity factor to get your TDEE, which represents the total calories you burn in a typical day.\n\nTo lose weight, you generally need to consume fewer calories than your TDEE (caloric deficit). A deficit of 500 calories per day usually leads to about 1 pound of weight loss per week. For muscle gain, you need a caloric surplus, typically 250-500 calories above your TDEE, combined with progressive resistance training. If your goal is maintenance, you simply aim to consume calories equal to your TDEE.\n\nRemember, quality matters just as much as quantity. While a calorie deficit is required for weight loss, the source of those calories will dictate your energy levels, satiety, and body composition changes.",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2653&auto=format&fit=crop",
    date: "Oct 12, 2026",
    readTime: "5 min read",
    author: "Dr. Alex Chen",
    category: "Nutrition Basics"
  },
  {
    id: 2,
    title: "How Sarah Lost 20lbs in 3 Months Without Giving Up Pizza",
    description: "Sarah had tried every fad diet under the sun. It wasn't until she discovered flexible dieting and macro balancing that she finally found a sustainable way to lose weight and keep it off.",
    content: "For years, Sarah fell into the classic yo-yo dieting trap. She would restrict herself heavily Monday through Thursday, only to binge on her favorite foods over the weekend, undoing all her hard work. She believed that foods like pizza and pasta were inherently 'bad' and had to be completely eliminated to see results.\n\nWhen Sarah started our flexible nutrition program, the first thing we did was reintroduce her favorite foods in moderation. We taught her how to budget her macronutrients (protein, carbs, and fats) so that she could enjoy a slice of pizza on Friday night without blowing her weekly caloric goals. By focusing on an 80/20 approach—80% whole, nutrient-dense foods and 20% treats—Sarah eliminated the feeling of deprivation.\n\nOver the course of three months, Sarah steadily lost 20lbs. More importantly, her relationship with food completely transformed. She now understands that no single food causes weight gain in isolation, and consistency matters far more than perfection. She is now maintaining her weight loss effortlessly without giving up the foods she loves.",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2670&auto=format&fit=crop",
    date: "Oct 25, 2026",
    readTime: "4 min read",
    author: "Emma Richards",
    category: "Success Stories"
  },
  {
    id: 3,
    title: "From Lethargic to Marathon Ready: John's Journey with Macro Balancing",
    description: "John always felt tired, especially during his afternoon slumps. By optimizing his macronutrient intake, he not only skyrocketed his energy levels but also trained for his first marathon.",
    content: "When John first came to us, his primary complaint wasn't his weight—it was his energy. Despite sleeping 8 hours a night, he relied on multiple cups of coffee just to make it through the workday. His diet consisted primarily of refined carbohydrates and very little protein or healthy fats. This caused massive spikes and crashes in his blood sugar levels, leading to chronic fatigue.\n\nWe overhauled John's diet by balancing his meals. We increased his protein intake to stabilize his blood sugar and introduced healthy fats like avocados and nuts to provide sustained energy. We also timed his carbohydrate intake around his workouts, ensuring his body had the fuel it needed when it was most active.\n\nThe results were astounding. Within two weeks, John's afternoon slumps disappeared. He had so much extra energy that he began running. Six months later, John successfully completed his first marathon. His story is a powerful reminder that food is not just about weight—it's about fueling the life you want to live.",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=2670&auto=format&fit=crop",
    date: "Nov 02, 2026",
    readTime: "6 min read",
    author: "Dr. Alex Chen",
    category: "Success Stories"
  }
];

export function ArticlePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<any>(null);

  useEffect(() => {
    if (id) {
      const foundArticle = articlesData.find(a => a.id === parseInt(id));
      if (foundArticle) {
        setArticle(foundArticle);
      } else {
        navigate('/news');
      }
    }
  }, [id, navigate]);

  if (!article) return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-slate-500 tracking-widest uppercase">Loading Article...</div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex justify-between items-center">
          <button onClick={() => navigate('/news')} className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-600 font-bold uppercase tracking-widest text-xs">
            <ChevronLeft className="w-5 h-5" /> Back to News
          </button>
          <button onClick={() => alert("Link copied to clipboard!")} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600">
             <Share2 className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="bg-white rounded-[32px] overflow-hidden border border-slate-200 shadow-xl shadow-slate-200/40"
        >
          <div className="w-full aspect-[21/9] relative overflow-hidden">
             <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
          </div>
          
          <div className="p-8 md:p-12">
            <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
              <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full">{article.category}</span>
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {article.date}</span>
              <span className="w-1 h-1 bg-slate-300 rounded-full hidden sm:block"></span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {article.readTime}</span>
              <span className="w-1 h-1 bg-slate-300 rounded-full hidden sm:block"></span>
              <span className="flex items-center gap-1"><User className="w-4 h-4" /> {article.author}</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-8 tracking-tight leading-tight">{article.title}</h1>
            
            <div className="prose prose-slate prose-lg max-w-none text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">
              {article.content}
            </div>
            
            <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
               <div className="font-bold text-slate-700 text-sm">Did you find this article helpful?</div>
               <div className="flex gap-2">
                 <button onClick={() => alert("Thanks for your feedback!")} className="px-6 py-2 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 font-bold uppercase tracking-widest text-xs transition-colors">Yes</button>
                 <button onClick={() => alert("Thanks for your feedback!")} className="px-6 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 font-bold uppercase tracking-widest text-xs transition-colors">No</button>
               </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
