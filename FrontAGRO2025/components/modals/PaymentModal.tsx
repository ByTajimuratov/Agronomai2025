
import React, { useState } from 'react';
import { useGlobal } from '../../store/GlobalStore';
import { X, CreditCard, Lock, Calendar, Loader2, CheckCircle, ShieldCheck } from 'lucide-react';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    packageDetails: { amount: number; price: number } | null;
    onSuccess: (amount: number) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, packageDetails, onSuccess }) => {
    const { formatMoney } = useGlobal();
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');
    const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');

    if (!isOpen || !packageDetails) return null;

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

    const handlePay = (e: React.FormEvent) => {
        e.preventDefault();
        if (cardNumber.length < 19 || expiry.length < 5 || cvc.length < 3) return;

        setStatus('processing');

        // Simulate API Payment
        setTimeout(() => {
            setStatus('success');
            // Delay to show success animation before closing
            setTimeout(() => {
                onSuccess(packageDetails.amount);
                // Reset form
                setCardNumber('');
                setExpiry('');
                setCvc('');
                setStatus('idle');
            }, 1500);
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 relative">
                
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors z-10"
                >
                    <X className="w-5 h-5 text-gray-600" />
                </button>

                {status === 'success' ? (
                    <div className="p-10 flex flex-col items-center justify-center text-center min-h-[400px]">
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-200 animate-in zoom-in duration-500">
                            <CheckCircle className="w-12 h-12 text-green-600 stroke-[3]" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
                        <p className="text-gray-500 font-medium">
                            <span className="text-emerald-600 font-bold">+{packageDetails.amount} Coins</span> added to your wallet.
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col h-full">
                        {/* Header */}
                        <div className="bg-slate-900 p-6 text-white">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-white/10 rounded-lg">
                                    <CreditCard className="w-6 h-6 text-emerald-400" />
                                </div>
                                <h3 className="text-xl font-bold">Secure Checkout</h3>
                            </div>
                            <div className="flex justify-between items-end border-t border-white/10 pt-4 mt-2">
                                <div>
                                    <p className="text-slate-400 text-xs uppercase tracking-wider">Item</p>
                                    <p className="font-bold text-white">{packageDetails.amount} Virtual Coins</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-slate-400 text-xs uppercase tracking-wider">Total</p>
                                    <p className="font-mono font-bold text-emerald-400 text-xl">{formatMoney(packageDetails.price)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handlePay} className="p-6 space-y-5 bg-gray-50">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Card Number</label>
                                <div className="relative group">
                                    <CreditCard className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                    <input 
                                        value={cardNumber}
                                        onChange={handleCardInput}
                                        placeholder="8600 0000 0000 0000"
                                        maxLength={19}
                                        className="w-full pl-12 p-3.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-mono text-gray-800 shadow-sm transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Expiry</label>
                                    <div className="relative group">
                                        <Calendar className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                        <input 
                                            value={expiry}
                                            onChange={handleExpiryInput}
                                            placeholder="MM/YY"
                                            maxLength={5}
                                            className="w-full pl-12 p-3.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-mono text-gray-800 shadow-sm transition-all"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">CVC</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                        <input 
                                            type="password"
                                            value={cvc}
                                            onChange={(e) => setCvc(e.target.value.slice(0,3))}
                                            placeholder="123"
                                            maxLength={3}
                                            className="w-full pl-12 p-3.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-mono text-gray-800 shadow-sm transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 justify-center text-xs text-gray-400 py-1">
                                <ShieldCheck className="w-3 h-3" />
                                <span>Payments are secured by MockPay</span>
                            </div>

                            <button 
                                type="submit"
                                disabled={status === 'processing' || cardNumber.length < 19}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                {status === 'processing' ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                                    </>
                                ) : (
                                    <>
                                        Pay Now <Lock className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};
