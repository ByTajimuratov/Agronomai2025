import React, { useEffect, useState } from 'react';
import { useGlobal } from '../store/GlobalStore';
import { WeatherDetailsModal } from './modals/WeatherDetailsModal';
import { SubscriptionModal } from './SubscriptionModal';
import { Wind, Bell, MapPin, ScanLine, MessageCircle, ShoppingBag, ArrowRight, Droplets, Sprout, ChevronRight, Calendar, Lock, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const HomeDashboard: React.FC = () => {
    const { user } = useGlobal();
    const navigate = useNavigate();
    
    // --- STATE-LAR ---
    const [weather, setWeather] = useState<any>(null);
    const [crops, setCrops] = useState<any[]>([]); 
    const [news, setNews] = useState<any[]>([]);   
    const [loading, setLoading] = useState(true);

    const [showWeatherModal, setShowWeatherModal] = useState(false);
    const [showPremiumModal, setShowPremiumModal] = useState(false);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                // Ob-havo
                const weatherRes = await fetch('http://localhost:5000/api/weather');
                if (weatherRes.ok) setWeather(await weatherRes.json());

                // Yangiliklar
                const newsRes = await fetch('http://localhost:5000/api/news');
                if (newsRes.ok) {
                    const newsData = await newsRes.json();
                    setNews(newsData.slice(0, 3)); // Dashboardda faqat oxirgi 3 tasini ko'rsatamiz
                }

                // Ekinlar
                if (user?._id || user?.id) {
                    const userId = user._id || user.id;
                    const token = localStorage.getItem('token');
                    if (token) {
                        const cropsRes = await fetch(`http://localhost:5000/api/calendar/list?userId=${userId}`, {
                            headers: { 'Authorization': `Bearer ${token}` }
                        });
                        if (cropsRes.ok) setCrops(await cropsRes.json());
                    }
                }

            } catch (error) {
                console.error("Dashboard yuklashda xato:", error);
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, [user]);

    const handleWeatherClick = () => {
        if (user?.tier === 'Premium') {
            setShowWeatherModal(true);
        } else {
            setShowPremiumModal(true);
        }
    };

    const userName = user?.name || "Mehmon";
    const userInitial = userName.charAt(0).toUpperCase();

    return (
        <div className="p-5 pb-32 space-y-8 min-h-screen bg-gray-50">
            {/* Header Section */}
            <header className="flex justify-between items-center pt-2">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center text-white font-bold shadow-md text-xl">
                            {userInitial}
                        </div>
                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-bold tracking-wide mb-0.5">Xush kelibsiz,</p>
                        <h1 className="text-xl font-extrabold text-gray-900 leading-none">{userName}</h1>
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                    <button className="p-2.5 bg-white rounded-full shadow-sm border border-gray-100 relative hover:bg-gray-50 transition-colors active:scale-95 group">
                        <Bell className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
                        <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white animate-pulse"></span>
                    </button>
                </div>
            </header>

            {/* Weather Widget (O'zgarishsiz qoldi) */}
            <div 
                onClick={handleWeatherClick}
                className="relative w-full h-44 rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/20 group cursor-pointer active:scale-98 transition-transform duration-200 bg-gradient-to-br from-blue-600 to-blue-800"
            >
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                {loading ? (
                    <div className="flex items-center justify-center h-full text-white"><Loader2 className="animate-spin" /></div>
                ) : weather ? (
                    <div className="relative z-10 p-6 text-white h-full flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-1.5 opacity-90 text-xs font-bold tracking-wide mb-1 bg-black/10 w-fit px-2 py-1 rounded-lg backdrop-blur-sm">
                                    <MapPin className="w-3 h-3" /> {weather.city}, UZ
                                </div>
                                <h2 className="text-5xl font-bold tracking-tighter">{weather.temp}°</h2>
                                <p className="text-white/90 font-medium text-sm capitalize">{weather.description}</p>
                            </div>
                            {user?.tier !== 'Premium' && (
                                <div className="bg-black/20 p-2 rounded-full backdrop-blur-md">
                                    <Lock className="w-4 h-4 text-white/80" />
                                </div>
                            )}
                        </div>
                        <div className="flex justify-between items-end">
                            <div className="flex gap-4">
                                <div className="flex items-center gap-1.5"><Droplets className="w-4 h-4 text-white/70" /> <span className="text-xs font-bold">{weather.humidity}%</span></div>
                                <div className="flex items-center gap-1.5"><Wind className="w-4 h-4 text-white/70" /> <span className="text-xs font-bold">{weather.windSpeed} km/h</span></div>
                            </div>
                            <div className="bg-white/20 p-1.5 rounded-full backdrop-blur-sm"><ChevronRight className="w-5 h-5 text-white" /></div>
                        </div>
                    </div>
                ) : <div className="p-6 text-white">Ob-havo yuklanmadi</div>}
            </div>

            {/* Quick Actions (O'zgarishsiz qoldi) */}
            <section>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 ml-1">Tezkor Amallar</h3>
                <div className="grid grid-cols-3 gap-4">
                    <Link to="/analysis" className="group flex flex-col items-center justify-center gap-3 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all active:scale-95">
                        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center shadow-inner"><ScanLine className="w-6 h-6 text-emerald-600" /></div>
                        <span className="text-xs font-bold text-gray-600 text-center">Ekinni Tekshirish</span>
                    </Link>
                    <Link to="/chat" className="group flex flex-col items-center justify-center gap-3 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all active:scale-95">
                        <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center shadow-inner"><MessageCircle className="w-6 h-6 text-purple-600" /></div>
                        <span className="text-xs font-bold text-gray-600 text-center">AI Agronom</span>
                    </Link>
                    <Link to="/market" className="group flex flex-col items-center justify-center gap-3 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all active:scale-95">
                        <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center shadow-inner"><ShoppingBag className="w-6 h-6 text-amber-600" /></div>
                        <span className="text-xs font-bold text-gray-600 text-center">Bozor</span>
                    </Link>
                </div>
            </section>

            {/* Mening Ekinlarim */}
            {crops.length > 0 && (
                <section>
                    <div className="flex justify-between items-center mb-4 px-1">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Mening Ekinlarim</h3>
                        <Link to="/calendar" className="text-xs font-bold text-emerald-600 flex items-center gap-1 hover:underline">
                            Barchasi <ChevronRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-4 -mx-5 px-5 scrollbar-hide no-scrollbar">
                        {crops.map(crop => (
                            <div key={crop._id} onClick={() => navigate('/calendar')} className="min-w-[150px] bg-white p-4 rounded-2xl border border-gray-100 shadow-sm active:scale-95 transition-all cursor-pointer hover:border-emerald-200">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shrink-0"><Sprout className="w-4 h-4" /></div>
                                    <span className="text-xs font-bold text-gray-800 line-clamp-1 capitalize">{crop.cropName}</span>
                                </div>
                                <div className="mt-2 text-[10px] font-bold text-gray-400 text-right">Ekildi: {new Date(crop.plantingDate).toLocaleDateString()}</div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* 🔥 YANGI: SO'NGGI YANGILIKLAR BO'LIMI 🔥 */}
            <section>
                <div className="flex justify-between items-center mb-4 px-1">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">So'nggi Yangiliklar</h3>
                    <Link to="/news" className="text-xs font-bold text-emerald-600 flex items-center gap-1 hover:underline">
                        Barchasi <ChevronRight className="w-3 h-3" />
                    </Link>
                </div>

                <div className="space-y-4">
                    {news.map((item: any) => (
                        <div 
                            key={item._id} 
                            onClick={() => navigate('/news')}
                            className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex gap-4 active:scale-95 transition-all cursor-pointer hover:border-emerald-200"
                        >
                            <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0">
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex flex-col justify-between py-1">
                                <div>
                                    <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-tight">
                                        {item.category || 'Maslahat'}
                                    </span>
                                    <h4 className="text-sm font-bold text-gray-900 line-clamp-2 mt-1 leading-tight">
                                        {item.title}
                                    </h4>
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(item.date).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    ))}

                    {news.length === 0 && !loading && (
                        <div className="text-center py-6 bg-white rounded-2xl border border-dashed border-gray-200">
                            <p className="text-xs font-bold text-gray-400">Hozircha yangiliklar yo'q</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Modals */}
            <WeatherDetailsModal isOpen={showWeatherModal} onClose={() => setShowWeatherModal(false)} />
            <SubscriptionModal isOpen={showPremiumModal} onClose={() => setShowPremiumModal(false)} onUpgrade={() => setShowPremiumModal(false)} />
        </div>
    );
};