
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronDown, HelpCircle, BookOpen } from 'lucide-react';

export const UserManualPage: React.FC = () => {
    const navigate = useNavigate();
    const [openId, setOpenId] = useState<string | null>(null);

    const faq = [
        {
            id: '1',
            q: "Barg tahlili qanday ishlaydi?",
            a: "Barg tahlili sun'iy intellekt (AI) yordamida ishlaydi. 'Barg Tahlili' bo'limiga o'tib, kasallangan o'simlik bargini rasmga oling. Bizning tizim 5 soniya ichida kasallikni aniqlaydi va davolash choralarini tavsiya qiladi."
        },
        {
            id: '2',
            q: "Premium nima beradi?",
            a: "Premium obuna sizga cheksiz barg tahlillarini, 24/7 agronom maslahatini (Chat), Xorazm hududi uchun maxsus sho'rlanish xaritalarini va batafsil ob-havo ma'lumotlarini taqdim etadi."
        },
        {
            id: '3',
            q: "Sotuvchi bilan qanday bog'lanaman?",
            a: "Bozor bo'limida mahsulotni tanlang. 'Sotuvchi bilan aloqa' tugmasini bosing. Siz to'g'ridan-to'g'ri qo'ng'iroq qilishingiz yoki Telegram orqali yozishingiz mumkin."
        },
        {
            id: '4',
            q: "Escrow to'lov tizimi xavfsizmi?",
            a: "Ha, juda xavfsiz. Siz to'lov qilganingizda, pul AgronomAI hisobida saqlanadi. Mahsulotni olib, tasdiqlaganingizdan keyingina pul sotuvchiga o'tkaziladi."
        },
        {
            id: '5',
            q: "Ilovadan oflayn foydalansa bo'ladimi?",
            a: "Ha, ilova qisman oflayn ishlaydi. Siz yuklangan yangiliklarni o'qishingiz va saqlangan ma'lumotlarni ko'rishingiz mumkin, ammo AI tahlili uchun internet kerak."
        }
    ];

    const toggle = (id: string) => {
        setOpenId(openId === id ? null : id);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="bg-white sticky top-0 z-10 px-4 py-4 border-b border-gray-100 flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                    <ChevronLeft className="w-6 h-6 text-gray-700" />
                </button>
                <h1 className="text-xl font-bold text-gray-900">Qo'llanma (FAQ)</h1>
            </div>

            <div className="p-4 max-w-lg mx-auto space-y-4">
                <div className="bg-emerald-50 rounded-2xl p-6 flex flex-col items-center text-center border border-emerald-100 mb-6">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                        <BookOpen className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h2 className="font-bold text-gray-800 text-lg">Yordam Markazi</h2>
                    <p className="text-sm text-gray-500 mt-2">Eng ko'p beriladigan savollarga javoblar.</p>
                </div>

                {faq.map((item) => (
                    <div key={item.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                        <button 
                            onClick={() => toggle(item.id)}
                            className="w-full flex items-center justify-between p-4 text-left font-bold text-gray-800 hover:bg-gray-50 transition-colors"
                        >
                            <span className="flex items-center gap-3">
                                <HelpCircle className="w-5 h-5 text-emerald-500" />
                                {item.q}
                            </span>
                            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${openId === item.id ? 'rotate-180' : ''}`} />
                        </button>
                        
                        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openId === item.id ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="p-4 pt-0 text-sm text-gray-600 leading-relaxed bg-gray-50 border-t border-gray-100">
                                {item.a}
                            </div>
                        </div>
                    </div>
                ))}

                <div className="mt-8 text-center">
                    <p className="text-xs text-gray-400 mb-2">Savolingizga javob topmadingizmi?</p>
                    <button 
                        onClick={() => navigate('/support')}
                        className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-gray-800 transition-colors"
                    >
                        Operator bilan bog'lanish
                    </button>
                </div>
            </div>
        </div>
    );
};
