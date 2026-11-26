
import React, { useState, useEffect } from 'react';
import { useCoins } from '../../contexts/CoinContext';
import { useGlobal } from '../../store/GlobalStore';
import { useAdCampaigns, AdCampaign } from '../../hooks/useAdCampaigns';
import { X, Coins, Play, CheckCircle, CreditCard } from 'lucide-react';
import { PaymentModal } from './PaymentModal';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const CoinStoreModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const { balance, addCoins } = useCoins();
    const { addToast, formatMoney } = useGlobal();
    const { ads } = useAdCampaigns();
    const [activeTab, setActiveTab] = useState<'buy' | 'earn'>('earn');
    
    // Ad Player State
    const [activeAd, setActiveAd] = useState<AdCampaign | null>(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isAdCompleted, setIsAdCompleted] = useState(false);

    // Payment State
    const [selectedPackage, setSelectedPackage] = useState<{amount: number, price: number} | null>(null);

    // Timer Logic
    useEffect(() => {
        let timer: ReturnType<typeof setInterval>;
        if (activeAd && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (activeAd && timeLeft === 0 && !isAdCompleted) {
            setIsAdCompleted(true);
        }
        return () => clearInterval(timer);
    }, [activeAd, timeLeft, isAdCompleted]);

    const handleWatchAd = (ad: AdCampaign) => {
        setActiveAd(ad);
        setTimeLeft(ad.duration);
        setIsAdCompleted(false);
    };

    const handleClaimReward = () => {
        if (!activeAd || !isAdCompleted) return;
        console.log("Claiming reward:", activeAd.reward);
        addCoins(activeAd.reward); 
        alert(`Tabriklaymiz! Siz ${activeAd.reward} tanga ishladingiz!`); 
        setActiveAd(null);
        setIsAdCompleted(false);
    };

    const handleCloseAd = () => {
        setActiveAd(null);
        setIsAdCompleted(false);
    };

    // --- Payment Handling ---
    const handleSelectPackage = (amount: number, price: number) => {
        setSelectedPackage({ amount, price });
    };

    const handlePaymentSuccess = (amount: number) => {
        addCoins(amount);
        setSelectedPackage(null);
        addToast(`Successfully purchased ${amount} Coins!`, 'success');
        onClose();
    };

    if (!isOpen) return null;

    // --- RENDER: AD OVERLAY ---
    if (activeAd) {
        return (
            <div className="fixed inset-0 z-[110] bg-black flex flex-col items-center justify-center text-white">
                <button
                    onClick={handleCloseAd}
                    className="absolute top-5 right-5 z-50 bg-black/40 rounded-full p-2 hover:bg-black/60 transition-colors backdrop-blur-sm"
                >
                    <X className="w-8 h-8 text-white" />
                </button>

                <div className="absolute top-5 left-5 z-20">
                    {isAdCompleted ? (
                        <button 
                            onClick={handleClaimReward}
                            className="bg-emerald-500 text-white px-6 py-3 rounded-full font-bold shadow-lg animate-bounce flex items-center gap-2 border-2 border-white"
                        >
                            <CheckCircle className="w-5 h-5" /> Claim +{activeAd.reward}
                        </button>
                    ) : (
                        <div className="w-12 h-12 rounded-full border-4 border-gray-600 flex items-center justify-center font-mono font-bold text-xl bg-black/50 backdrop-blur">
                            {timeLeft}
                        </div>
                    )}
                </div>

                <div className="absolute inset-0 z-0 opacity-80">
                    <img src={activeAd.imageUrl} alt="Ad" className="w-full h-full object-cover" />
                </div>

                <div className="absolute bottom-10 left-0 right-0 p-6 z-10 bg-gradient-to-t from-black/90 to-transparent">
                    <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Sponsored by {activeAd.sponsor}</p>
                    <h2 className="text-3xl font-bold mb-2">{activeAd.title}</h2>
                    <div className="h-1 w-full bg-gray-700 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-emerald-500 transition-all duration-1000 ease-linear"
                            style={{ width: `${((activeAd.duration - timeLeft) / activeAd.duration) * 100}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        );
    }

    // --- RENDER: STORE MODAL ---
    return (
        <>
            <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
                <div className="bg-white w-full max-w-md md:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden h-[85vh] md:h-auto flex flex-col">
                    
                    {/* Header */}
                    <div className="bg-amber-50 p-6 border-b border-amber-100 flex justify-between items-start">
                        <div>
                            <h3 className="text-2xl font-bold text-amber-900 flex items-center gap-2">
                                <Coins className="w-6 h-6 text-amber-500 fill-amber-500" /> Coin Store
                            </h3>
                            <p className="text-amber-700 text-sm font-medium mt-1">Balance: <span className="font-bold text-lg">{balance}</span></p>
                        </div>
                        <button onClick={onClose} className="p-2 bg-white/50 rounded-full hover:bg-white transition-colors text-amber-800">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex p-2 bg-white border-b border-gray-100">
                        <button 
                            onClick={() => setActiveTab('earn')}
                            className={`flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'earn' ? 'bg-emerald-50 text-emerald-700 shadow-sm ring-1 ring-emerald-200' : 'text-gray-500'}`}
                        >
                            <Play className="w-4 h-4" /> Ishlash (Earn)
                        </button>
                        <button 
                            onClick={() => setActiveTab('buy')}
                            className={`flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'buy' ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-200' : 'text-gray-500'}`}
                        >
                            <CreditCard className="w-4 h-4" /> Sotib olish (Buy)
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                        
                        {activeTab === 'earn' ? (
                            <div className="space-y-3">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1 mb-2">Available Campaigns</p>
                                {ads.map(ad => (
                                    <div key={ad.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex items-center justify-between hover:border-emerald-300 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden relative">
                                                <img src={ad.imageUrl} alt="" className="w-full h-full object-cover opacity-80" />
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                                    <Play className="w-5 h-5 text-white fill-white" />
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 text-sm">{ad.title}</h4>
                                                <p className="text-[10px] text-gray-500 font-medium bg-gray-100 px-1.5 py-0.5 rounded w-fit mt-1">{ad.duration} seconds</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => handleWatchAd(ad)}
                                            className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 hover:bg-emerald-700 flex items-center gap-1"
                                        >
                                            +{ad.reward} <Coins className="w-3 h-3 text-yellow-300 fill-yellow-300" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { amount: 100, price: 12000, label: "Starter" },
                                    { amount: 500, price: 55000, label: "Farmer" },
                                    { amount: 1200, price: 120000, label: "Pro" },
                                    { amount: 5000, price: 450000, label: "Tycoon", best: true },
                                ].map((pkg, i) => (
                                    <button 
                                        key={i}
                                        onClick={() => handleSelectPackage(pkg.amount, pkg.price)}
                                        className={`relative bg-white p-4 rounded-2xl shadow-sm border hover:shadow-md transition-all text-center flex flex-col items-center group ${pkg.best ? 'border-amber-400 ring-1 ring-amber-100' : 'border-gray-200'}`}
                                    >
                                        {pkg.best && <span className="absolute -top-2.5 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">BEST VALUE</span>}
                                        <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mb-2 text-amber-500 group-hover:scale-110 transition-transform">
                                            <Coins className="w-6 h-6 fill-amber-500" />
                                        </div>
                                        <h4 className="font-bold text-gray-900 text-lg">{pkg.amount}</h4>
                                        <p className="text-xs text-gray-400 font-medium mb-3">{pkg.label}</p>
                                        <div className="w-full py-2 bg-blue-600 text-white rounded-lg text-xs font-bold group-hover:bg-blue-700 transition-colors">
                                            {formatMoney(pkg.price)}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Payment Modal Overlay */}
            <PaymentModal 
                isOpen={!!selectedPackage} 
                onClose={() => setSelectedPackage(null)} 
                packageDetails={selectedPackage}
                onSuccess={handlePaymentSuccess}
            />
        </>
    );
};
