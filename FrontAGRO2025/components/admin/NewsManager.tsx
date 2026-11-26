
import React, { useState } from 'react';
import { useGlobal } from '../../store/GlobalStore';
import { Plus, Trash2, Calendar, Image as ImageIcon, X } from 'lucide-react';
import { NewsArticle } from '../../types';

export const NewsManager: React.FC = () => {
  const { news, addNews, deleteNews } = useGlobal();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');

  const handleAdd = (e: React.FormEvent) => {
      e.preventDefault();
      const newArticle: NewsArticle = {
          id: Date.now().toString(),
          title,
          content,
          image: image || 'https://picsum.photos/400/200',
          date: new Date().toISOString().split('T')[0],
          author: 'Admin'
      };
      addNews(newArticle);
      setIsModalOpen(false);
      setTitle('');
      setContent('');
      setImage('');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">News Manager</h2>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-agrogreen-600 hover:bg-agrogreen-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium shadow-sm"
          >
              <Plus className="w-4 h-4" /> Add News
          </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map(article => (
              <div key={article.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
                  <div className="h-40 overflow-hidden relative">
                      <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2">
                           <button 
                            onClick={() => deleteNews(article.id)}
                            className="bg-white/90 text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors shadow-sm"
                           >
                               <Trash2 className="w-4 h-4" />
                           </button>
                      </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                          <Calendar className="w-3 h-3" /> {article.date}
                      </div>
                      <h3 className="font-bold text-slate-800 mb-2 line-clamp-2">{article.title}</h3>
                      <p className="text-slate-500 text-sm line-clamp-3 mb-4">{article.content}</p>
                      <div className="mt-auto text-xs text-slate-400 uppercase tracking-wider">
                          By {article.author}
                      </div>
                  </div>
              </div>
          ))}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
              <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                      <h3 className="text-lg font-bold text-slate-800">Post New Article</h3>
                      <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                          <X className="w-6 h-6" />
                      </button>
                  </div>
                  <form onSubmit={handleAdd} className="p-6 space-y-4">
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                          <input 
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-agrogreen-500 outline-none" 
                            placeholder="e.g., New subsidy for cotton"
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
                          <div className="flex gap-2">
                              <div className="bg-slate-100 p-3 rounded-lg text-slate-400">
                                  <ImageIcon className="w-5 h-5" />
                              </div>
                              <input 
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                                className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-agrogreen-500 outline-none" 
                                placeholder="https://..."
                              />
                          </div>
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
                          <textarea 
                            required
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={4}
                            className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-agrogreen-500 outline-none" 
                            placeholder="Write the news body here..."
                          />
                      </div>
                      <div className="pt-2">
                          <button type="submit" className="w-full bg-agrogreen-600 text-white py-3 rounded-xl font-bold hover:bg-agrogreen-700 transition-colors">
                              Publish Article
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};