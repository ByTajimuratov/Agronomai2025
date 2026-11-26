import React, { useState } from 'react';
import { useGlobal } from '../../store/GlobalStore';
import { MarketItem, OrderStatus } from '../../types';
import { X, CreditCard, Banknote, ShieldCheck, Lock, Loader2, CheckCircle } from 'lucide-react';

interface Props {
    item: MarketItem;
    isOpen: boolean;
    onClose: () => void;
}

export const CheckoutFlow: React.FC<Props> = ({ item, isOpen, onClose }) => {
    // createOrder o'rniga biz yaratgan placeOrder funksiyasini olamiz
    const { user, placeOrder, formatMoney, addToast } = useGlobal();
    const [method, setMethod] = useState<'card' | 'cash'>('card');
    const [step, setStep] = useState<'method' | 'processing' | 'success'>('method');
    
    // Card Form
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');

    if (!isOpen || !user) return null;

    // --- ASOSIY O'ZGARISH: Haqiqiy buyurtma berish ---
    const handleConfirm = async () => {
        // Karta ma'lumotlarini tekshirish (agar karta tanlangan bo'lsa)
        if (method === 'card' && (cardNumber.replace(/\s/g, '').length < 16 || expiry.length < 5)) {
            addToast("Karta ma'lumotlarini to'liq kiriting", "error");
            return;
        }

        setStep('processing');
        
        // GlobalStore dagi haqiqiy API funksiyasini chaqiramiz
        // item.id va item.sellerId ma'lumotlarini yuboramiz
        const success = await placeOrder(item.id, item.sellerId || 'system');
        
        if (success) {
            setStep('success');
            // 2.5 soniyadan keyin oynani yopish
            setTimeout(onClose, 2500);
        } else {
            // Xato bo'lsa orqaga qaytaramiz
            setStep('method');
        }
    };

    const handleCardInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length > 16) val = val.slice(0, 16);
        setCardNumber(val.replace(/(\d{4})(?=\d)/g, '$1 '));
    };

    const handleExpiryInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length > 4) val = val.slice(0, 4);
        if (val.length >= 2) val = val.slice(0, 2) + '/' + val.slice(2);
        setExpiry(val);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white w-full max-w-md md:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 flex flex-col min-h-[500px]">
                
                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900">Xavfsiz To'lov</h3>
                    <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                <div className="flex-1 p-6">
                    {step === 'method' && (
                        <div className="space-y-6">
                            {/* Mahsulot qisqacha ma'lumoti */}
                            <div className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <img src={item.imageUrl} alt="" className="w-16 h-16 rounded-xl object-cover shadow-sm" />
                                <div>
                                    <h4 className="font-bold text-gray-900 line-clamp-1">{item.title}</h4>
                                    <p className="text-emerald-600 font-bold">{formatMoney(item.price)}</p>
                                    <p className="text-xs text-gray-400">{item.sellerName || 'AgronomAI Sotuvchi'}</p>
                                </div>
                            </div>

                            {/* To'lov usullari */}
                            <div className="flex bg-gray-100 p-1.5 rounded-xl">
                                <button 
                                    onClick={() => setMethod('card')}
                                    className={`flex-1 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${method === 'card' ? 'bg-white shadow-md text-gray-900 ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    <CreditCard className="w-4 h-4" /> Karta (UzCard)
                                </button>
                                <button 
                                    onClick={() => setMethod('cash')}
                                    className={`flex-1 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${method === 'cash' ? 'bg-white shadow-md text-gray-900 ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    <Banknote className="w-4 h-4" /> Naqd
                                </button>
                            </div>

                            {method === 'card' ? (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-2">
                                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex gap-3">
                                        <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
                                        <div>
                                            <h5 className="font-bold text-emerald-800 text-sm">Escrow Himoyasi</h5>
                                            <p className="text-xs text-emerald-700 leading-relaxed mt-1">
                                                Mablag'ingiz <b>AgronomAI</b> tizimida xavfsiz saqlanadi. Mahsulotni olganingizni tasdiqlagach, sotuvchiga o'tkaziladi.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Karta raqami</label>
                                            <div className="relative">
                                                <CreditCard className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                                <input 
                                                    value={cardNumber}
                                                    onChange={handleCardInput}
                                                    placeholder="8600 0000 0000 0000"
                                                    className="w-full pl-12 p-3 bg-white rounded-xl border border-gray-200 outline-none focus:border-emerald-500 font-mono shadow-sm"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="flex-1">
                                                 <label className="text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Muddati</label>
                                                 <input 
                                                    value={expiry}
                                                    onChange={handleExpiryInput}
                                                    placeholder="MM/YY"
                                                    className="w-full p-3 bg-white rounded-xl border border-gray-200 outline-none focus:border-emerald-500 font-mono text-center shadow-sm"
                                                 />
                                            </div>
                                            <div className="flex-1">
                                                 <label className="text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Jami</label>
                                                 <div className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 font-bold text-gray-700 text-center text-sm">
                                                     {formatMoney(item.price)}
                                                 </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4 animate-in fade-in slide-in-from-left-2">
                                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3">
                                        <Banknote className="w-6 h-6 text-amber-600 shrink-0" />
                                        <div>
                                            <h5 className="font-bold text-amber-800 text-sm">Naqd To'lov</h5>
                                            <p className="text-xs text-amber-700 leading-relaxed mt-1">
                                                To'lov mahsulot yetib borganda qo'lingizga topshiriladi. Sotuvchi siz bilan bog'lanadi.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-xl border border-dashed border-gray-300 bg-gray-50 text-center">
                                        <p className="text-gray-500 text-[10px] mb-1 uppercase font-bold">Yetkazib berish manzili:</p>
                                        <p className="font-bold text-gray-800 text-sm">{user.district || 'Xorazm viloyati'}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {step === 'processing' && (
                        <div className="h-full flex flex-col items-center justify-center">
                            <Loader2 className="w-16 h-16 text-emerald-600 animate-spin mb-4" />
                            <p className="font-bold text-gray-800 text-lg">Buyurtma yuborilmoqda...</p>
                            <p className="text-gray-400 text-sm text-center">Xavfsiz bog'lanish o'rnatilmoqda</p>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="h-full flex flex-col items-center justify-center text-center animate-in zoom-in duration-300">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                                <CheckCircle className="w-10 h-10 text-green-600 stroke-[3]" />
                            </div>
                            <h4 className="text-2xl font-bold text-gray-900 mb-2">Buyurtma Qabul Qilindi!</h4>
                            <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
                                {method === 'card' 
                                 ? "Mablag'ingiz xavfsiz muzlatildi. Sotuvchi mahsulotni yuborishi kutilmoqda."
                                 : "Sotuvchi xabardor qilindi. Mahsulot kelganda naqd to'lovni tayyorlang."}
                            </p>
                        </div>
                    )}
                </div>

                {step === 'method' && (
                    <div className="p-6 border-t border-gray-100 bg-gray-50">
                        <button 
                            onClick={handleConfirm}
                            className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 active:scale-95"
                        >
                            <Lock className="w-4 h-4" /> {method === 'card' ? `To'lash: ${formatMoney(item.price)}` : 'Buyurtmani Tasdiqlash'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};