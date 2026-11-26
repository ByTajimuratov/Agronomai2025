
import React from 'react';
import { useCoins } from '../../contexts/CoinContext';
import { usePremium } from '../../contexts/PremiumContext';
import { Coins, Crown, X, Clock } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    featureId: string;
    onUnlock: () => void;
    cost?: number;
}

export const UnlockFeatureModal: React.FC<Props> = ({ isOpen, onClose, featureId, onUnlock, cost = 200 }) => {
    const { balance, unlockFeature } = useCoins();
    const { openPremiumModal } = usePremium();

    if (!isOpen) return null;

    const handleUnlock = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        // CRITICAL SAFETY: Stop all event propagation and default behaviors
        e.preventDefault();
        e.stopPropagation();

        console.log("Unlock clicked. Current path:", window.location.pathname);

        // Pure logic call - no navigation
        const success = unlockFeature(featureId, cost);
        
        if (success) {
            console.log("Unlock successful. Closing modal.");
            // Just trigger callbacks. Do NOT navigate.
            onUnlock();
            onClose();
        }
    };

    const handlePremiumClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onClose();
        openPremiumModal();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white w-full max-w-md md:rounded-3xl rounded-t-3xl shadow-2xl p-6 animate-in slide-in-from-bottom-10 md:zoom-in-95">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Premium Feature</h3>
                    <button 
                        type="button"
                        onClick={onClose} 
                        className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                    To access this feature, you can either upgrade to Premium or use your virtual coins for a temporary pass.
                </p>

                <div className="space-y-4">
                    {/* Option A: Premium */}
                    <button 
                        type="button"
                        onClick={handlePremiumClick}
                        className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-white p-4 rounded-2xl shadow-lg flex items-center justify-between group active:scale-98 transition-all"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                <Crown className="w-6 h-6 text-white fill-white" />
                            </div>
                            <div className="text-left">
                                <h4 className="font-bold text-lg">Full Premium</h4>
                                <p className="text-xs text-amber-100">Unlimited Access</p>
                            </div>
                        </div>
                        <span className="bg-white text-amber-600 text-xs font-bold px-3 py-1.5 rounded-lg">Best Value</span>
                    </button>

                    <div className="flex items-center gap-2 my-2">
                        <div className="h-px bg-gray-200 flex-1"></div>
                        <span className="text-xs font-bold text-gray-400 uppercase">Or</span>
                        <div className="h-px bg-gray-200 flex-1"></div>
                    </div>

                    {/* Option B: Coins (DIV implementation to prevent form submit) */}
                    <div 
                        role="button"
                        tabIndex={0}
                        onClick={balance >= cost ? handleUnlock : undefined}
                        className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between group transition-all select-none ${
                            balance >= cost 
                            ? 'border-emerald-500 bg-emerald-50 hover:bg-emerald-100 cursor-pointer active:scale-98' 
                            : 'border-gray-200 bg-gray-50 opacity-70 cursor-not-allowed'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${balance >= cost ? 'bg-emerald-200' : 'bg-gray-200'}`}>
                                <Clock className={`w-6 h-6 ${balance >= cost ? 'text-emerald-700' : 'text-gray-500'}`} />
                            </div>
                            <div className="text-left">
                                <h4 className="font-bold text-gray-800">Unlock for 24h</h4>
                                <p className={`text-xs font-bold ${balance >= cost ? 'text-emerald-600' : 'text-red-500'}`}>
                                    Balance: {balance} 🪙
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                            <span className="font-bold text-gray-900">{cost}</span>
                            <Coins className="w-4 h-4 text-amber-500 fill-amber-500" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
