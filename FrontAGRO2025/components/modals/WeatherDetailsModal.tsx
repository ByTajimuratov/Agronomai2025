import React, { useEffect, useState } from 'react';
import { useGlobal } from '../../store/GlobalStore';
import { X, Sun, CloudSun, CloudRain, Wind, Droplets, Thermometer, CloudSnow, CloudLightning, Cloud, Loader2, ArrowDown, ArrowUp } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

// Backenddan keladigan ma'lumot turi
interface DailyWeather {
    date: string;
    maxTemp: number;
    minTemp: number;
    description: string;
    icon: string;
}

export const WeatherDetailsModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const { t } = useGlobal();
    const [forecast, setForecast] = useState<DailyWeather[]>([]);
    const [loading, setLoading] = useState(true);

    // 1. Backenddan ma'lumot olish
    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            fetch('http://localhost:5000/api/weather/forecast')
                .then(res => res.json())
                .then(data => setForecast(data))
                .catch(err => console.error("Prognoz xatosi:", err))
                .finally(() => setLoading(false));
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // 2. Ikonkani tanlash logikasi
    const getWeatherIcon = (desc: string) => {
        const d = desc.toLowerCase();
        if (d.includes('yomg')) return CloudRain;
        if (d.includes('qor')) return CloudSnow;
        if (d.includes('momaqaldiroq')) return CloudLightning;
        if (d.includes('bulut')) return Cloud;
        if (d.includes('tuman')) return Wind;
        return Sun; // Odatiy holat (Ochiq havo)
    };

    // 3. Sanani chiroyli qilish (Masalan: "Seshanba")
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        // Bugungi kun ekanligini tekshirish
        const today = new Date().toISOString().split('T')[0];
        if (dateStr === today) return "Bugun";
        
        return new Intl.DateTimeFormat('uz-UZ', { weekday: 'long' }).format(date);
    };

    // Bugungi (yoki birinchi kun) ob-havo
    const todayWeather = forecast[0]; 
    const TodayIcon = todayWeather ? getWeatherIcon(todayWeather.description) : Sun;

    return (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white w-full max-w-md md:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 md:zoom-in-95 h-[85vh] md:h-auto flex flex-col">
                
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">5 Kunlik Prognoz</h3>
                        <p className="text-xs text-gray-500 font-medium mt-0.5">Xorazm • Jonli ma'lumot</p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
                    
                    {loading ? (
                        <div className="flex justify-center items-center h-40">
                            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                        </div>
                    ) : forecast.length > 0 ? (
                        <>
                            {/* Current Weather Hero (Bugungi kun) */}
                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg mb-6 flex items-center justify-between">
                                <div>
                                    <div className="flex items-start gap-1">
                                        <h2 className="text-5xl font-bold tracking-tighter">{todayWeather.maxTemp}</h2>
                                        <span className="text-xl font-medium mt-1">°C</span>
                                    </div>
                                    <p className="text-blue-100 font-medium mt-1 capitalize">{todayWeather.description}</p>
                                    <div className="flex gap-4 mt-4 text-sm font-medium text-blue-50">
                                        <span className="flex items-center gap-1"><ArrowDown className="w-4 h-4" /> {todayWeather.minTemp}°</span>
                                        <span className="flex items-center gap-1"><ArrowUp className="w-4 h-4" /> {todayWeather.maxTemp}°</span>
                                    </div>
                                </div>
                                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm shadow-inner border border-white/10">
                                    <TodayIcon className="w-14 h-14 text-yellow-300" />
                                </div>
                            </div>

                            {/* Agronomy Tip (Maslahat) */}
                            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 mb-6 flex gap-3">
                                <div className="mt-1">
                                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                                        <Thermometer className="w-4 h-4" />
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-emerald-800 text-sm">Agronom Maslahati</h4>
                                    <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
                                        {todayWeather.maxTemp > 35 
                                            ? "Havo juda issiq. Ekinlarni kechki payt sug'orish tavsiya etiladi."
                                            : todayWeather.description.includes("yomg") 
                                                ? "Yomg'ir kutilmoqda. Dori sepishni keyinga qoldiring."
                                                : "Havo mo'tadil. Agrotexnik tadbirlar uchun qulay vaqt."}
                                    </p>
                                </div>
                            </div>

                            {/* 5-Day List */}
                            <div className="space-y-3">
                                {forecast.map((day, idx) => {
                                    const Icon = getWeatherIcon(day.description);
                                    const isToday = idx === 0;
                                    return (
                                        <div key={idx} className={`flex items-center justify-between p-3 rounded-xl border ${isToday ? 'bg-white border-blue-200 shadow-sm' : 'bg-white border-gray-100'}`}>
                                            <div className="flex items-center gap-4">
                                                <span className={`text-sm font-bold w-20 capitalize ${isToday ? 'text-blue-600' : 'text-gray-600'}`}>
                                                    {formatDate(day.date)}
                                                </span>
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-2">
                                                        <Icon className={`w-5 h-5 ${day.description.includes('yomg') ? 'text-blue-400' : 'text-amber-400'}`} />
                                                        <span className="text-xs font-medium text-gray-500 capitalize">{day.description}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-2 font-mono text-sm">
                                                <span className="font-bold text-gray-900">{day.maxTemp}°</span>
                                                <span className="text-gray-400">/ {day.minTemp}°</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-10 text-gray-500">Ma'lumot topilmadi.</div>
                    )}
                </div>
            </div>
        </div>
    );
};