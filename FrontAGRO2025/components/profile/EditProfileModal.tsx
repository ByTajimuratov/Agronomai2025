import React, { useState, useEffect } from 'react';
import { User, KhorezmDistrict } from '../../types';
import { useGlobal } from '../../store/GlobalStore';
import { ImageUpload } from '../shared/ImageUpload';
import { X, Save, User as UserIcon, Phone, MapPin, Shield, Loader2 } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const EditProfileModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const { user, updateUserProfile, changePassword, t, addToast } = useGlobal();
    
    // BARCHA HOOKLAR return null DAN TEPADA BO'LISHI SHART
    const [activeTab, setActiveTab] = useState<'details' | 'security'>('details');
    const [loading, setLoading] = useState(false);
    
    // Details State
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [district, setDistrict] = useState('');
    
    // Security State
    const [oldPass, setOldPass] = useState('');
    const [newPass, setNewPass] = useState('');

    // Modal ochilganda user ma'lumotlarini inputlarga to'ldirish
    useEffect(() => {
        if (isOpen && user) {
            setName(user.name || user.username || '');
            setPhone(user.phone || '');
            setDistrict(user.district || '');
        }
    }, [isOpen, user]);

    // SHU QATORNI HOOKLARDAN PASTGA TUSHIRDIK ✅
    if (!isOpen || !user) return null;

    // 1. Profil ma'lumotlarini saqlash
    const handleSaveDetails = async () => {
        if (!name.trim()) return addToast("Ism bo'sh bo'lishi mumkin emas", "error");
        
        setLoading(true);
        const success = await updateUserProfile({ 
            username: name, 
            phone, 
            district 
        });
        setLoading(false);
        
        if (success) onClose();
    };

    // 2. Parolni yangilash
    const handleSaveSecurity = async () => {
        if (!oldPass || !newPass) return addToast("Barcha maydonlarni to'ldiring", "error");
        if (newPass.length < 6) return addToast("Yangi parol kamida 6 ta belgi bo'lishi kerak", "error");

        setLoading(true);
        const success = await changePassword(oldPass, newPass);
        setLoading(false);

        if (success) {
            setOldPass('');
            setNewPass('');
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800">Profilni tahrirlash</h3>
                    <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="px-6 pt-4">
                    <div className="flex bg-gray-100 p-1 rounded-2xl">
                        <button 
                            onClick={() => setActiveTab('details')}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'details' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Ma'lumotlar
                        </button>
                        <button 
                            onClick={() => setActiveTab('security')}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'security' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Xavfsizlik
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    {activeTab === 'details' ? (
                        <div className="space-y-6">
                            <div className="flex justify-center">
                                <ImageUpload 
                                    currentImage={user.avatar || user.photoUrl} 
                                    onImageSelected={(base64) => updateUserProfile({ avatar: base64 })} 
                                />
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase mb-1.5 ml-1 block">To'liq ism</label>
                                    <div className="relative">
                                        <UserIcon className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                        <input 
                                            value={name} 
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Ismingizni kiriting"
                                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-2xl border border-gray-100 outline-none focus:border-emerald-500 focus:bg-white transition-all font-medium"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase mb-1.5 ml-1 block">Tuman</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                        <select 
                                            value={district} 
                                            onChange={(e) => setDistrict(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-2xl border border-gray-100 outline-none focus:border-emerald-500 focus:bg-white transition-all font-medium appearance-none"
                                        >
                                            <option value="" disabled>Tumanni tanlang</option>
                                            {Object.values(KhorezmDistrict).map(d => (
                                                <option key={d} value={d}>{d}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase mb-1.5 ml-1 block">Telefon raqam</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                        <input 
                                            value={phone} 
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="+998 90 123 45 67"
                                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-2xl border border-gray-200 outline-none focus:border-emerald-500 focus:bg-white transition-all font-medium"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <button 
                                onClick={handleSaveDetails} 
                                disabled={loading}
                                className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:shadow-emerald-300 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                Saqlash
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                             <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-center gap-3">
                                <div className="p-2 bg-white rounded-xl shadow-sm">
                                    <Shield className="w-5 h-5 text-amber-600" />
                                </div>
                                <p className="text-xs font-semibold text-amber-800 leading-tight">
                                    Hisobingizni kuchli parol bilan himoyalang. Kamida 6 ta belgi bo'lishi tavsiya etiladi.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase mb-1.5 ml-1 block">Joriy parol</label>
                                    <input 
                                        type="password"
                                        value={oldPass} 
                                        onChange={(e) => setOldPass(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3.5 bg-gray-50 rounded-2xl border border-gray-200 outline-none focus:border-emerald-500 focus:bg-white transition-all font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase mb-1.5 ml-1 block">Yangi parol</label>
                                    <input 
                                        type="password"
                                        value={newPass} 
                                        onChange={(e) => setNewPass(e.target.value)}
                                        placeholder="Yangi parolni kiriting"
                                        className="w-full px-4 py-3.5 bg-gray-50 rounded-2xl border border-gray-200 outline-none focus:border-emerald-500 focus:bg-white transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <button 
                                onClick={handleSaveSecurity} 
                                disabled={loading}
                                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Parolni yangilash"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};