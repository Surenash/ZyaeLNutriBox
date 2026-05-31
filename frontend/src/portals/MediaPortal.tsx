import { useState, useEffect } from 'react';
import { Newspaper, PenTool, Image, Globe, CheckCircle, Loader2, Edit3, Trash2, X } from 'lucide-react';
import '../../assets/Media.css'; // Make sure path is correct

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8080';

const getUserId = () => {
  return localStorage.getItem('token') || '';
};

export function MediaPortal() {
  const [activeTab, setActiveTab] = useState<'compose' | 'published'>('compose');

  const handleLogout = () => { 
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/login'; 
  };

  return (
    <div className="media-page-container">
      {/* Sidebar */}
      <aside className="media-sidebar hidden md:flex">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="bg-emerald-600 p-2 rounded-xl">
            <Newspaper className="w-5 h-5 text-white" />
          </div>
          <span className="font-black text-lg tracking-tight text-slate-900">ZyaeL Media</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveTab('compose')} className={`media-nav-btn ${activeTab === 'compose' ? 'active' : ''}`}>
            <PenTool className="w-5 h-5" /> Compose Article
          </button>
          <button onClick={() => setActiveTab('published')} className={`media-nav-btn ${activeTab === 'published' ? 'active' : ''}`}>
            <Globe className="w-5 h-5" /> Published Feed
          </button>
        </nav>
        <div className="p-4 border-t border-slate-100">
          <button onClick={handleLogout} className="w-full text-xs font-bold text-slate-400 hover:text-slate-900 uppercase tracking-widest text-center py-2">Sign Out</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="media-main-content">
        <div className="max-w-4xl mx-auto">
          {activeTab === 'compose' && <ComposeArticleView />}
          {activeTab === 'published' && <PublishedArticlesView />}
        </div>
      </main>
    </div>
  );
}

// --- COMPOSE VIEW ---
function ComposeArticleView() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({ headline: '', content: '', source: '', link: '', imageUrl: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const payload = {
      headline: formData.headline,
      content: formData.content,
      source: formData.source || null,
      link: formData.link || null,
      imageUrl: formData.imageUrl || null
    };

    try {
      const res = await fetch(`${API_BASE}/api/articles/?user_id=${getUserId()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.detail || "Failed to publish article. Ensure you have Admin/Media privileges.");
      } else {
        setSuccess(true);
        setFormData({ headline: '', content: '', source: '', link: '', imageUrl: '' });
        setTimeout(() => setSuccess(false), 5000);
      }
    } catch (err) {
      alert("Network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="media-card">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-emerald-100 p-2.5 rounded-xl text-emerald-600"><Edit3 className="w-6 h-6" /></div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Draft New Article</h2>
      </div>

      {success && (
        <div className="mb-8 bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-xl flex items-center gap-3 font-bold">
          <CheckCircle className="w-5 h-5" /> Article published successfully to the Public Feed!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Headline</label>
          <input type="text" required value={formData.headline} onChange={e => setFormData({...formData, headline: e.target.value})} className="media-input text-lg font-bold" placeholder="Catchy title goes here..." />
        </div>
        
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Article Body</label>
          <textarea required value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="media-input h-64 resize-none leading-relaxed" placeholder="Write the full article content here..."></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2"><Image className="w-4 h-4"/> Cover Image URL</label>
            <input type="text" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="media-input" placeholder="https://images.unsplash.com/..." />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Author / Source</label>
            <input type="text" value={formData.source} onChange={e => setFormData({...formData, source: e.target.value})} className="media-input" placeholder="e.g. ZyaeL Nutrition Team" />
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex justify-end">
          <button type="submit" disabled={loading} className="media-btn-primary">
            {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Publishing...</> : 'Publish to Feed'}
          </button>
        </div>
      </form>
    </div>
  );
}

// --- PUBLISHED FEED VIEW (Now With Edit & Delete) ---
function PublishedArticlesView() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingArticle, setEditingArticle] = useState<any>(null);

  const fetchArticles = () => {
    fetch(`${API_BASE}/api/articles/`)
      .then(res => res.json())
      .then(data => { setArticles(data || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article from the public feed?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/articles/${id}?user_id=${getUserId()}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json();
        alert(err.detail);
        return;
      }
      fetchArticles(); // Refresh list
    } catch (e) {
      alert("Failed to delete article.");
    }
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const payload = {
      headline: formData.get('headline'),
      content: formData.get('content'),
      source: formData.get('source') || null,
      imageUrl: formData.get('imageUrl') || null,
    };

    try {
      const res = await fetch(`${API_BASE}/api/articles/${editingArticle.id}?user_id=${getUserId()}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) {
        const err = await res.json();
        alert(err.detail);
      } else {
        setEditingArticle(null); // Close modal
        fetchArticles(); // Refresh list
      }
    } catch (err) {
      alert("Failed to update article");
    }
  };

  if (loading) return <div className="text-center py-20 font-bold text-slate-400 animate-pulse">Syncing public feed...</div>;

  return (
    <div className="space-y-6 relative">
      <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-8">Published Articles</h2>
      
      {articles.length === 0 ? (
        <div className="media-card text-center py-16 text-slate-500 font-bold">No articles have been published yet.</div>
      ) : (
        articles.map(article => (
          <div key={article.id} className="media-card flex flex-col md:flex-row gap-6 items-start">
            <div className="w-full md:w-48 h-32 shrink-0 bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
              <img src={article.imageUrl || "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2653&auto=format&fit=crop"} className="w-full h-full object-cover" alt="Cover" />
            </div>
            <div className="flex-1 w-full">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <span>{new Date(article.publishedDate).toLocaleDateString()}</span>
                  {article.source && <><span className="w-1 h-1 bg-slate-300 rounded-full"></span><span className="text-emerald-600">{article.source}</span></>}
                </div>
                {/* ACTION BUTTONS */}
                <div className="flex gap-3">
                  <button onClick={() => setEditingArticle(article)} className="text-slate-400 hover:text-emerald-600 transition-colors"><Edit3 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(article.id)} className="text-slate-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">{article.headline}</h3>
              <p className="text-sm text-slate-500 line-clamp-2">{article.content}</p>
            </div>
          </div>
        ))
      )}

      {/* EDIT MODAL */}
      {editingArticle && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Edit Article</h3>
                <button onClick={() => setEditingArticle(null)} className="text-slate-400 hover:text-slate-900"><X className="w-5 h-5"/></button>
              </div>
              <form onSubmit={handleEditSave} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Headline</label>
                    <input type="text" name="headline" required defaultValue={editingArticle.headline} className="media-input" />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Article Content</label>
                    <textarea name="content" required defaultValue={editingArticle.content} className="media-input h-48 leading-relaxed resize-none"></textarea>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Image URL</label>
                      <input type="text" name="imageUrl" defaultValue={editingArticle.imageUrl} className="media-input text-sm" />
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Source</label>
                      <input type="text" name="source" defaultValue={editingArticle.source} className="media-input text-sm" />
                   </div>
                 </div>
                 <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-slate-100">
                    <button type="button" onClick={() => setEditingArticle(null)} className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50">Cancel</button>
                    <button type="submit" className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-900/20 hover:bg-emerald-700">Save Changes</button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}