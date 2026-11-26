
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Heart, ShoppingBag, Newspaper, MapPin, ArrowRight } from 'lucide-react';
import { useGlobal } from '../../store/GlobalStore';

export const SavedItemsPage: React.FC = () => {
    const navigate = useNavigate();
    const { marketItems, news, formatMoney } = useGlobal();
    const [activeTab, setActiveTab] = useState<'news' | 'market'>('market');

    // Mock filtering logic - normally we would have a savedIds array
    const savedMarketItems = marketItems.slice(0, 2); 
    const savedNews = news.slice(0, 2);

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white sticky top-0 z-10 px-4 pt-4 pb-2 border-b border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                    <button onClick={() => navigate(-1)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                        <ChevronLeft className="w-6 h-6 text-gray-700" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-900">Saqlanganlar</h1>
                </div>

                {/* Tabs */}
                <div className="flex p-1 bg-gray-100 rounded-xl">
                    <button 
                        onClick={() => setActiveTab('market')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'market' ? 'bg-white shadow text-emerald-800' : 'text-gray-500'}`}
                    >
                        <ShoppingBag className="w-4 h-4" /> Bozor
                    </button>
                    <button 
                        onClick={() => setActiveTab('news')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'news' ? 'bg-white shadow text-emerald-800' : 'text-gray-500'}`}
                    >
                        <Newspaper className="w-4 h-4" /> Yangiliklar
                    </button>
                </div>
            </div>

            <div className="p-4">
                {activeTab === 'market' ? (
                    <div className="grid grid-cols-1 gap-4">
                        {savedMarketItems.map(item => (
                            <div key={item.id} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex gap-4 relative overflow-hidden group">
                                <img src={item.imageUrl} alt="" className="w-24 h-24 rounded-xl object-cover bg-gray-100" />
                                <div className="flex-1 py-1 flex flex-col justify-center">
                                    <h4 className="font-bold text-gray-900 text-sm line-clamp-1">{item.title}</h4>
                                    <p className="text-emerald-600 font-bold text-lg">{formatMoney(item.price)}</p>
                                    <div className="flex items-center gap-1 text-gray-400 text-xs mt-1">
                                        <MapPin className="w-3 h-3" /> {item.location}
                                    </div>
                                    <button className="mt-2 bg-gray-900 text-white text-xs font-bold py-2 px-4 rounded-lg w-fit hover:bg-gray-800">
                                        Sotib olish
                                    </button>
                                </div>
                                <button className="absolute top-3 right-3 p-2 bg-red-50 text-red-500 rounded-full hover:bg-red-100 transition-colors">
                                    <Heart className="w-4 h-4 fill-red-500" />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                         {savedNews.map(article => (
                            <div key={article.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex gap-4">
                                    <img src={article.image} alt="" className="w-20 h-20 rounded-xl object-cover" />
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-sm line-clamp-2 mb-1">{article.title}</h4>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase">{article.date}</p>
                                    </div>
                                </div>
                                <div className="mt-3 flex justify-between items-center border-t border-gray-50 pt-2">
                                    <button className="text-red-500 text-xs font-bold flex items-center gap-1">
                                        <Heart className="w-3 h-3 fill-red-500" /> O'chirish
                                    </button>
                                    <button className="text-emerald-600 text-xs font-bold flex items-center gap-1">
                                        O'qish <ArrowRight className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                         ))}
                    </div>
                )}

                {/* Empty State */}
                {((activeTab === 'market' && savedMarketItems.length === 0) || (activeTab === 'news' && savedNews.length === 0)) && (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                        <Heart className="w-16 h-16 mb-4 text-gray-200 fill-gray-100" />
                        <p className="font-medium">Hozircha hech narsa saqlanmagan.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
