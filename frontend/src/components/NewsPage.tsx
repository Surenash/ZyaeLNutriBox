import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ArrowRight, Newspaper } from 'lucide-react';
import '../../assets/NewsPage.css'; // Ensure path is correct

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8080';
const defaultFallbackImage = "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2653&auto=format&fit=crop";

export function NewsPage() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/articles/`)
      .then(res => res.json())
      .then(data => {
        setArticles(data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch articles", err);
        setLoading(false);
      });
  }, []);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = defaultFallbackImage;
  };

  // Helper to calculate reading time (assuming ~200 words per minute)
  const calculateReadTime = (content: string) => {
    if (!content) return "1 min read";
    const words = content.trim().split(/\s+/).length;
    const time = Math.ceil(words / 200);
    return `${time} min read`;
  };

  return (
    <div className="news-page-container">
      <nav className="news-navbar">
        <div className="news-nav-content">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-black text-xl text-slate-900 tracking-tight">Nutrition News</span>
        </div>
      </nav>

      <main className="news-main">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Latest Articles</h1>
          <p className="text-lg text-slate-500 font-medium">Stay updated with the latest in nutrition and wellness.</p>
        </div>

        {loading ? (
          <div className="text-center py-20 font-bold text-slate-400 animate-pulse">Loading latest news...</div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20 bg-white border-2 border-dashed border-slate-200 rounded-[32px]">
            <Newspaper className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-bold">No articles published yet. Check back soon!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {articles.map((article, idx) => (
              <motion.article 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={article.id}
                onClick={() => navigate(`/news/${article.id}`)}
                className="news-article-card group"
              >
                <div className="news-article-image-wrapper">
                  <img 
                    src={article.imageUrl || defaultFallbackImage} 
                    alt={article.headline} 
                    onError={handleImageError}
                    className="news-article-image" 
                  />
                </div>
                <div className="news-article-content">
                  <div className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                    <span>{new Date(article.publishedDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span>{calculateReadTime(article.content)}</span>
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight group-hover:text-emerald-700 transition-colors">{article.headline}</h2>
                  <p className="text-slate-500 font-medium leading-relaxed mb-6 flex-1">
                    {article.content.length > 150 ? article.content.substring(0, 150) + "..." : article.content}
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
        )}
      </main>
    </div>
  );
}