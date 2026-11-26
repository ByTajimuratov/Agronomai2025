
import React, { useState } from 'react';
import { useGlobal } from '../store/GlobalStore';
import { usePremium } from '../contexts/PremiumContext';
import { Lock, Calendar, Bot, ScanLine, Unlock } from 'lucide-react';
import { UnlockFeatureModal } from './modals/UnlockFeatureModal';

interface Props {
    feature: 'calendar' | 'gpt' | 'analysis';
}

export const FeatureLock: React.FC<Props> = ({ feature }) => {
    const { t } = useGlobal();
    const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);

    // NOTE: Removed local "unlocked" state logic. 
    // This component should ONLY render the lock screen.
    // If the feature is unlocked, the parent FeatureGuard will unmount this component entirely.

    // Map feature to icon
    const getIcon = () => {
        switch (feature) {
            case 'calendar': return Calendar;
            case 'gpt': return Bot;
            case 'analysis': return ScanLine;
            default: return Lock;
        }
    };

    const Icon = getIcon();

    return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center pb-24">
            <div className="relative bg-white/50 backdrop-blur-lg p-8 rounded-3xl shadow-xl border border-white/40 max-w-sm w-full overflow-hidden">
                {/* Glassmorphism Effects */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-agrogreen-600"></div>
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-yellow-400/20 rounded-full blur-3xl pointer-events-none"></div>

                {/* Icon */}
                <div className="relative mb-6 mx-auto w-20 h-20">
                    <div className="absolute inset-0 bg-agrogreen-100 rounded-full animate-pulse"></div>
                    <div className="relative w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm border border-agrogreen-100">
                        <Icon className="w-10 h-10 text-agrogreen-600" />
                    </div>
                    <div className="absolute -top-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                        <Lock className="w-4 h-4 text-amber-500" />
                    </div>
                </div>

                {/* Text Content */}
                <h2 className="text-2xl font-bold text-gray-800 mb-3">
                    {/* @ts-ignore - Dynamic keys handled in translations */}
                    {t(`features.${feature}.title` as any)}
                </h2>
                <p className="text-gray-600 mb-8 text-sm leading-relaxed">
                    {/* @ts-ignore - Dynamic keys handled in translations */}
                    {t(`features.${feature}.desc` as any)}
                </p>

                {/* Action Button */}
                <button 
                    onClick={() => setIsUnlockModalOpen(true)}
                    className="w-full bg-gradient-to-r from-agrogreen-600 to-emerald-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-emerald-600/30 hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 group"
                >
                    <Unlock className="w-5 h-5 text-emerald-200" />
                    Unlock Options
                </button>
            </div>

            <UnlockFeatureModal 
                isOpen={isUnlockModalOpen}
                onClose={() => setIsUnlockModalOpen(false)}
                featureId={feature}
                onUnlock={() => {
                    setIsUnlockModalOpen(false);
                    // No navigation needed. State update in CoinContext will trigger FeatureGuard to switch views.
                }} 
            />
        </div>
    );
};
