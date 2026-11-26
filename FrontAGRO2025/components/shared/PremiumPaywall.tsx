
import React from 'react';
import { Lock, Star } from 'lucide-react';
import { useGlobal } from '../../store/GlobalStore';
import { usePremium } from '../../contexts/PremiumContext';
import { AppLanguage } from '../../types';

interface PaywallProps {
    title?: string;
    description?: string;
}

export const PremiumPaywall: React.FC<PaywallProps> = ({ title, description }) => {
    const { t, language } = useGlobal();
    const { openPremiumModal } = usePremium();

    // Localized teaser content logic
    const getTeaserContent = () => {
        const lang = language || AppLanguage.EN;
        if (lang === AppLanguage.UZ) {
            return {
                title: title || "AgronomAI Premium",
                desc: description || "Cheksiz imkoniyatlar bilan hosildorlikni oshiring va agronom maslahatini oling."
            };
        }
        if (lang === AppLanguage.RU) {
             return {
                title: title || "AgronomAI Premium",
                desc: description || "Разблокируйте полный потенциал вашей фермы с помощью передовых технологий."
            };
        }
        return {
            title: title || "AgronomAI Premium",
            desc: description || "Unlock the full potential of your farm with advanced AI analysis and expert consulting."
        };
    };

    const content = getTeaserContent();

    return (
        <>
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-xl border border-amber-100 p-8 text-center m-4">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-500"></div>
                
                <div className="mb-6 relative">
                    <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto">
                         <Lock className="w-10 h-10 text-amber-500" />
                    </div>
                    <div className="absolute -top-1 -right-2">
                        <Star className="w-6 h-6 text-yellow-400 fill-yellow-400 animate-pulse" />
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2">{content.title}</h2>
                <p className="text-gray-500 mb-8 leading-relaxed max-w-xs mx-auto">{content.desc}</p>

                <button 
                    onClick={openPremiumModal}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-amber-500/20 hover:shadow-xl hover:scale-[1.02] transition-all"
                >
                    {t('upgrade')}
                </button>

                <p className="mt-4 text-[10px] text-gray-400 uppercase tracking-widest">
                    Khorezm Agro-Suite v2.0
                </p>
            </div>
        </>
    );
};
