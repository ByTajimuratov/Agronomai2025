import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobal } from '../store/GlobalStore';
import { ChevronLeft, Calendar, Tag, ArrowRight } from 'lucide-react';
import { NewsArticle } from '../types';
import axios from 'axios';

export const NewsFeedPage: React.FC = () => {
    const { news: globalNews } = useGlobal();
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState('All');
    const [backendNews, setBackendNews] = useState<NewsArticle[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const filters = ['All', 'Maslahat', 'Texnologiya', 'Eksport', 'Suv', 'Subsidiyalar'];

    // Zaxira rasm (Agar asosiy rasm yuklanmasa shuni ko'rsatadi)
    const fallbackImage = "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1000&auto=format&fit=crop";

    // --- BACKENDDAN YANGILIKLARNI OLISH ---
    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/news');
                const formattedNews = response.data.map((item: any) => ({
                    id: item._id,
                    title: item.title,
                    content: item.content,
                    date: new Date(item.date).toLocaleDateString('uz-UZ'),
                    image: item.image,
                    author: 'Agronom AI',
                    category: item.category || 'Yangilik'
                }));
                setBackendNews(formattedNews);
            } catch (error) {
                console.error("Yangiliklarni yuklashda xato:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNews();
    }, []);

    // Faqat haqiqiy yangiliklarni birlashtiramiz (Inglizcha mock data o'chirildi)
    const allNews = [...backendNews, ...globalNews];

    // Filtrlash mantiqi
    const filteredNews = activeFilter === 'All' 
        ? allNews 
        : allNews.filter(n => 
            (n.category && n.category.toLowerCase().includes(activeFilter.toLowerCase())) || 
            n.title.toLowerCase().includes(activeFilter.toLowerCase())
        );

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 py-4">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6 text-gray-700" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-900">Agro Yangiliklar</h1>
                </div>
                
                {/* Filter Chips */}
                <div className="mt-4 flex gap-2 overflow-x-auto pb-1 scrollbar-hide no-scrollbar">
                    {filters.map(filter => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${
                                activeFilter === filter 
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' 
                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Section */}
            <div className="p-4 space-y-5">
                {isLoading ? (
                    <div className="flex justify-center py-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                    </div>
                ) : filteredNews.map(article => (
                    <div key={article.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all group">
                        {/* Rasm qismi */}
                        <div className="relative h-52 overflow-hidden bg-gray-200">
                            <img 
                                src={article.image} 
                                alt={article.title} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                                // Rasm yuklanmay qolsa ishlaydi:
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = fallbackImage;
                                }}
                            />
                            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent"></div>
                            <div className="absolute bottom-4 left-4 flex items-center gap-2">
                                <span className="px-3 py-1 bg-emerald-600 text-white text-[10px] font-black rounded-lg uppercase tracking-wider">
                                    {article.category || 'Yangilik'}
                                </span>
                                <span className="text-[11px] text-white/90 font-bold flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5" /> {article.date}
                                </span>
                            </div>
                        </div>
                        
                        {/* Matn qismi */}
                        <div className="p-5">
                            <h3 className="text-lg font-black text-gray-900 mb-2 leading-tight group-hover:text-emerald-700 transition-colors">
                                {article.title}
                            </h3>
                            <p className="text-sm text-gray-500 line-clamp-3 mb-5 leading-relaxed font-medium">
                                {article.content}
                            </p>
                            
                            <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                                        <Tag className="w-3 h-3 text-emerald-600" />
                                    </div>
                                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{article.author}</span>
                                </div>
                                <button className="text-emerald-600 text-xs font-black flex items-center gap-1 group-hover:gap-2 transition-all">
                                    BATAFSIL <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Hech narsa topilmasa */}
                {!isLoading && filteredNews.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Tag className="w-10 h-10 text-gray-200" />
                        </div>
                        <p className="text-gray-400 font-bold">Hozircha bu turdagi yangiliklar yo'q.</p>
                    </div>
                )}
            </div>
        </div>
    );
};