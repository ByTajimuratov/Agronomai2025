
import React, { useState } from 'react';
import { X, Mail, ArrowRight, Loader2, CheckCircle, KeyRound } from 'lucide-react';
import { useGlobal } from '../../store/GlobalStore';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const ForgotPasswordModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const { language } = useGlobal();
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');

        // Simulate API Call
        setTimeout(() => {
            setStatus('success');
        }, 2000);
    };

    const handleClose = () => {
        setStatus('idle');
        setEmail('');
        onClose();
    };

    // Simple localization based on the requested text
    const isUz = language === 'uz';

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 relative">
                
                {/* Close Button */}
                <button 
                    onClick={handleClose} 
                    className="absolute top-4 right-4 p-2 bg-gray-50 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-8">
                    {status === 'success' ? (
                        <div className="flex flex-col items-center text-center py-4 animate-in slide-in-from-right duration-300">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
                                <CheckCircle className="w-10 h-10 text-green-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                {isUz ? "Havola yuborildi!" : "Link Sent!"}
                            </h3>
                            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                                {isUz 
                                    ? `Biz ${email} manziliga tiklash havolasini yubordik. Iltimos, pochtangizni tekshiring.` 
                                    : `We sent a recovery link to ${email}. Please check your inbox.`}
                            </p>
                            <button 
                                onClick={handleClose}
                                className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors"
                            >
                                {isUz ? "Yopish" : "Close"}
                            </button>
                        </div>
                    ) : (
                        <div className="animate-in slide-in-from-left duration-300">
                            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 text-emerald-600 border border-emerald-100">
                                <KeyRound className="w-7 h-7" />
                            </div>
                            
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                {isUz ? "Parolni tiklash" : "Reset Password"}
                            </h3>
                            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                                {isUz 
                                    ? "Elektron pochtangizni kiriting, biz sizga tiklash havolasini yuboramiz." 
                                    : "Enter your email address and we'll send you a link to reset your password."}
                            </p>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-6">
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                        <input 
                                            type="email" 
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="name@example.com"
                                            className="w-full pl-12 p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all font-medium"
                                        />
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={status === 'loading' || !email}
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 active:scale-95"
                                >
                                    {status === 'loading' ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" /> 
                                            {isUz ? "Yuborilmoqda..." : "Sending..."}
                                        </>
                                    ) : (
                                        <>
                                            {isUz ? "Yuborish" : "Send Link"} 
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
