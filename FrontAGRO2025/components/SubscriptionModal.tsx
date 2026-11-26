import React, { useState, useEffect } from 'react';
import { useGlobal } from '../store/GlobalStore';
import { Check, X, Star, ShieldCheck, Zap, CreditCard, Loader2, ArrowLeft, Calendar, Lock } from 'lucide-react';
import { SubscriptionTier, AppLanguage } from '../types';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onUpgrade: () => void;
}

type ModalStep = 'selection' | 'payment' | 'processing' | 'success';

// Marketing Copy Dictionary
const paywallContent = {
    [AppLanguage.EN]: {
        subtitle: "Unlock full potential with advanced AI tools.",
        features: [
            { icon: Zap, text: "Unlimited Leaf Diagnosis", sub: "Instant AI results" },
            { icon: ShieldCheck, text: "Consultant Access", sub: "Direct chat with experts" },
            { icon: Star, text: "Salinity & Soil Maps", sub: "Precision satellite data" },
        ],
        plans: {
            monthly: { label: "Monthly", sub: "Cancel anytime" },
            yearly: { label: "Yearly", sub: "Save 20%" }
        },
        buttons: { select: "Select Plan", pay: "Pay Now", processing: "Processing..." },
        payment: { title: "Payment Details", cardLabel: "Card Number", dateLabel: "Expiry Date", placeholder: "8600 ... (Uzcard/Humo)" },
        success: { title: "Payment Successful!", sub: "Welcome to AgronomAI Premium." }
    },
    [AppLanguage.UZ]: {
        subtitle: "Cheksiz imkoniyatlar bilan hosildorlikni oshiring.",
        features: [
            { icon: Zap, text: "Cheksiz Barg Tahlili", sub: "Tezkor AI natijalari" },
            { icon: ShieldCheck, text: "Agronom bilan suhbat", sub: "Ekspertlar bilan aloqa" },
            { icon: Star, text: "Tuproq sho'rlanish xaritasi", sub: "Sun'iy yo'ldosh ma'lumotlari" },
        ],
        plans: {
            monthly: { label: "Oylik", sub: "Istalgan vaqtda bekor qilish" },
            yearly: { label: "Yillik", sub: "20% tejab qoling" }
        },
        buttons: { select: "Tanlash", pay: "To'lash", processing: "To'lanmoqda..." },
        payment: { title: "To'lov ma'lumotlari", cardLabel: "Karta raqami", dateLabel: "Amal qilish muddati", placeholder: "8600 ... (Uzcard/Humo)" },
        success: { title: "To'lov muvaffaqiyatli!", sub: "AgronomAI Premium-ga xush kelibsiz." }
    },
    [AppLanguage.RU]: {
        subtitle: "Раскройте полный потенциал с AI инструментами.",
        features: [
            { icon: Zap, text: "Безлимитный анализ листьев", sub: "Мгновенные результаты" },
            { icon: ShieldCheck, text: "Чат с агрономом", sub: "Связь с экспертами" },
            { icon: Star, text: "Карты засоленности", sub: "Спутниковые данные" },
        ],
        plans: {
            monthly: { label: "Ежемесячно", sub: "Отмена в любое время" },
            yearly: { label: "Ежегодно", sub: "Скидка 20%" }
        },
        buttons: { select: "Выбрать", pay: "Оплатить", processing: "Обработка..." },
        payment: { title: "Детали оплаты", cardLabel: "Номер карты", dateLabel: "Срок действия", placeholder: "8600 ... (Uzcard/Humo)" },
        success: { title: "Оплата прошла успешно!", sub: "Добро пожаловать в AgronomAI Premium." }
    }
};

export const SubscriptionModal: React.FC<Props> = ({ isOpen, onClose, onUpgrade }) => {
    // setUser ni ham olib kelamiz (agar GlobalStore da bo'lsa), bo'lmasa pastda window.location ishlatamiz
    const { language, formatMoney, setUser } = useGlobal();
    const [step, setStep] = useState<ModalStep>('selection');
    const [selectedPlanPrice, setSelectedPlanPrice] = useState<number>(50000);
    
    // Form State
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');

    const content = paywallContent[language || AppLanguage.EN];

    // Reset state when opening
    useEffect(() => {
        if (isOpen) {
            setStep('selection');
            setCardNumber('');
            setExpiry('');
        }
    }, [isOpen]);

    const handleCardInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length > 16) val = val.slice(0, 16);
        // Add spaces every 4 digits
        const formatted = val.replace(/(\d{4})(?=\d)/g, '$1 ');
        setCardNumber(formatted);
    };

    const handleExpiryInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length > 4) val = val.slice(0, 4);
        if (val.length >= 2) {
            val = val.slice(0, 2) + '/' + val.slice(2);
        }
        setExpiry(val);
    };

    // --- ASOSIY O'ZGARISH: Backendga ulanish ---
    const handlePayment = async () => {
        if (cardNumber.replace(/\s/g, '').length < 16 || expiry.length < 5) return;

        setStep('processing');
        
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert("Iltimos, avval tizimga kiring!");
                setStep('selection');
                return;
            }

            // 1. Backendga so'rov yuborish
            const response = await fetch('https://agronomai2025.onrender.com/api/auth/upgrade', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    plan: selectedPlanPrice === 50000 ? 'monthly' : 'yearly',
                    price: selectedPlanPrice
                })
            });

            const data = await response.json();

            if (data.success) {
                // 2. Muvaffaqiyatli bo'lsa
                
                // LocalStorage ni yangilash (user tier: Premium)
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // Global State ni yangilash (agar funksiya bo'lsa)
                if (setUser) {
                    setUser(data.user);
                }

                setStep('success');
                
                // 3. Yopish va Yangilash
                setTimeout(() => {
                    onUpgrade(); // Ota komponentga xabar berish
                    onClose();   // Modalni yopish
                    
                    // Agar setUser bo'lmasa, sahifani yangilashga majburmiz
                    if (!setUser) {
                        window.location.reload();
                    }
                }, 2000);
            } else {
                alert("Xatolik: " + (data.error || "To'lov amalga oshmadi"));
                setStep('payment');
            }

        } catch (error) {
            console.error("Payment Error:", error);
            alert("Server bilan bog'lanishda xatolik yuz berdi.");
            setStep('payment');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/80 backdrop-blur-sm p-0 md:p-4 animate-in fade-in duration-300">
            <div className="bg-slate-900 w-full max-w-md md:rounded-3xl rounded-t-3xl overflow-hidden shadow-2xl relative min-h-[500px] md:h-auto flex flex-col animate-in slide-in-from-bottom-10 border border-white/10">
                
                {/* Background FX */}
                <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-amber-500/20 to-slate-900 pointer-events-none"></div>
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-500/30 rounded-full blur-3xl pointer-events-none"></div>

                {/* Close Button */}
                <button onClick={onClose} className="absolute top-5 right-5 p-2 bg-white/10 rounded-full hover:bg-white/20 text-white z-20 backdrop-blur-md transition-colors">
                    <X className="w-5 h-5" />
                </button>

                {/* --- VIEW 1: SELECTION --- */}
                {step === 'selection' && (
                    <div className="p-8 flex-1 overflow-y-auto relative z-10 animate-in slide-in-from-right duration-300">
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-amber-300 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20 rotate-3">
                                <Star className="w-8 h-8 text-white fill-white" />
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold text-center text-white mb-2 tracking-tight">AgronomAI <span className="text-amber-400">Premium</span></h2>
                        <p className="text-center text-slate-400 text-sm mb-8 leading-relaxed max-w-xs mx-auto">
                            {content.subtitle}
                        </p>

                        {/* Features */}
                        <div className="space-y-4 mb-8">
                            {content.features.map((feat, i) => (
                                <div key={i} className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-2xl border border-white/5 hover:bg-slate-800/80 transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400">
                                        <feat.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-sm">{feat.text}</h4>
                                        <p className="text-slate-500 text-xs">{feat.sub}</p>
                                    </div>
                                    <Check className="w-5 h-5 text-green-500 ml-auto" />
                                </div>
                            ))}
                        </div>

                        {/* Pricing Cards */}
                        <div className="grid grid-cols-1 gap-3">
                             <button 
                                onClick={() => { setSelectedPlanPrice(50000); setStep('payment'); }} 
                                className="group relative p-5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 border border-amber-400 text-left shadow-xl shadow-amber-900/20 transform transition-transform active:scale-95"
                             >
                                <div className="absolute -top-3 left-4 bg-white text-amber-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide shadow-sm">
                                    Popular
                                </div>
                                <div className="flex justify-between items-center text-white">
                                    <div>
                                        <p className="font-bold text-lg">{content.plans.monthly.label}</p>
                                        <p className="text-amber-100 text-xs">{content.plans.monthly.sub}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold">{formatMoney(50000)}</p>
                                    </div>
                                </div>
                            </button>

                            <button 
                                onClick={() => { setSelectedPlanPrice(600000); setStep('payment'); }} 
                                className="p-4 rounded-2xl bg-slate-800 border border-slate-700 text-left flex justify-between items-center hover:bg-slate-700 transition-colors active:scale-95"
                            >
                                <div>
                                    <p className="text-white font-bold">{content.plans.yearly.label}</p>
                                    <p className="text-slate-400 text-xs">{content.plans.yearly.sub}</p>
                                </div>
                                <p className="text-white font-bold">{formatMoney(600000)}</p>
                            </button>
                        </div>
                    </div>
                )}

                {/* --- VIEW 2: PAYMENT FORM --- */}
                {step === 'payment' && (
                    <div className="p-8 flex-1 flex flex-col relative z-10 animate-in slide-in-from-right duration-300">
                        <button onClick={() => setStep('selection')} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors">
                             <ArrowLeft className="w-4 h-4" /> Back
                        </button>

                        <h2 className="text-2xl font-bold text-white mb-6">{content.payment.title}</h2>
                        
                        {/* Amount Badge */}
                        <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5 mb-6 flex justify-between items-center">
                            <span className="text-slate-400 text-sm">Total Amount:</span>
                            <span className="text-xl font-bold text-amber-400">{formatMoney(selectedPlanPrice)}</span>
                        </div>

                        {/* Card Inputs */}
                        <div className="space-y-4 mb-8">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">{content.payment.cardLabel}</label>
                                <div className="relative">
                                    <CreditCard className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                                    <input 
                                        type="text" 
                                        value={cardNumber}
                                        onChange={handleCardInput}
                                        placeholder={content.payment.placeholder}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-mono tracking-wide"
                                        maxLength={19}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">{content.payment.dateLabel}</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                                    <input 
                                        type="text" 
                                        value={expiry}
                                        onChange={handleExpiryInput}
                                        placeholder="MM/YY"
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-mono tracking-wide"
                                        maxLength={5}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto">
                            <button 
                                onClick={handlePayment}
                                className="w-full bg-amber-500 hover:bg-amber-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                <Lock className="w-5 h-5" /> {content.buttons.pay}
                            </button>
                        </div>
                    </div>
                )}

                {/* --- VIEW 3: PROCESSING & SUCCESS --- */}
                {(step === 'processing' || step === 'success') && (
                    <div className="p-8 flex-1 flex flex-col items-center justify-center relative z-10 text-center animate-in zoom-in duration-300">
                        {step === 'processing' ? (
                            <>
                                <div className="w-20 h-20 rounded-full border-4 border-slate-700 border-t-amber-500 animate-spin mb-6"></div>
                                <h3 className="text-xl font-bold text-white animate-pulse">{content.buttons.processing}</h3>
                            </>
                        ) : (
                            <div className="animate-in zoom-in spin-in-90 duration-500">
                                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-green-500/40">
                                    <Check className="w-12 h-12 text-white stroke-[3]" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">{content.success.title}</h3>
                                <p className="text-slate-400">{content.success.sub}</p>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
};