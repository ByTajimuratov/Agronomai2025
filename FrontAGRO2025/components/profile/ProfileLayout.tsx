
import React, { useState } from 'react';
import { useGlobal } from '../../store/GlobalStore';
import { ImageUpload } from '../shared/ImageUpload';
import { KhorezmDistrict } from '../../types';
import { User, Lock, Save, ChevronRight, Shield, Bell, LogOut, CreditCard } from 'lucide-react';

export const ProfileLayout: React.FC = () => {
    const { t, user, updateUserProfile, changePassword, setUser } = useGlobal();
    const [activeTab, setActiveTab] = useState<'info' | 'security'>('info');

    // Form States
    const [name, setName] = useState(user?.name || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [district, setDistrict] = useState(user?.district || '');
    const [isSaving, setIsSaving] = useState(false);

    // Security States
    const [currentPass, setCurrentPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');

    if (!user) return null;

    const handleInfoSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        await updateUserProfile({ name, phone, district });
        setIsSaving(false);
    };

    const handleSecuritySave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPass !== confirmPass) {
            alert("New passwords do not match");
            return;
        }
        const success = await changePassword(currentPass, newPass);
        if (success) {
            setCurrentPass('');
            setNewPass('');
            setConfirmPass('');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* ID Card Header */}
            <div className="relative bg-white pb-8 mb-4">
                {/* Color Banner */}
                <div className="h-32 bg-gradient-to-r from-emerald-800 to-emerald-600 w-full"></div>
                
                <div className="px-4 -mt-12 flex flex-col items-center">
                    <div className="relative">
                         <ImageUpload currentImage={user.photoUrl} onImageSelected={(base64) => updateUserProfile({ photoUrl: base64 })} />
                    </div>
                    
                    <h2 className="text-xl font-bold text-gray-900 mt-3">{user.name}</h2>
                    <p className="text-sm text-gray-500 font-medium">{user.email}</p>
                    
                    <div className="flex gap-2 mt-3">
                         <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                             {user.district || 'Khorezm'}
                         </span>
                         <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                             user.tier === 'Premium' 
                             ? 'bg-amber-50 text-amber-700 border-amber-200' 
                             : 'bg-gray-50 text-gray-600 border-gray-200'
                         }`}>
                             {user.tier}
                         </span>
                    </div>
                </div>
            </div>

            {/* Stats Row */}
            <div className="px-4 mb-6">
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex justify-around divide-x">
                    <div className="text-center px-2">
                        <p className="text-gray-400 text-[10px] font-bold uppercase">Analysis</p>
                        <p className="text-lg font-bold text-gray-800">{user.analysisCount}</p>
                    </div>
                    <div className="text-center px-2">
                        <p className="text-gray-400 text-[10px] font-bold uppercase">Market</p>
                        <p className="text-lg font-bold text-gray-800">2</p>
                    </div>
                    <div className="text-center px-2">
                        <p className="text-gray-400 text-[10px] font-bold uppercase">Tickets</p>
                        <p className="text-lg font-bold text-gray-800">0</p>
                    </div>
                </div>
            </div>

            {/* Tab Switcher */}
            <div className="px-4 mb-4">
                <div className="bg-gray-200 p-1 rounded-xl flex">
                    <button 
                        onClick={() => setActiveTab('info')}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'info' ? 'bg-white shadow text-gray-800' : 'text-gray-500'}`}
                    >
                        Personal Info
                    </button>
                    <button 
                        onClick={() => setActiveTab('security')}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'security' ? 'bg-white shadow text-gray-800' : 'text-gray-500'}`}
                    >
                        Security
                    </button>
                </div>
            </div>

            {/* Settings Content */}
            <div className="px-4">
                {activeTab === 'info' ? (
                    <form onSubmit={handleInfoSave} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                            <input 
                                type="text" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none transition-colors"
                            />
                        </div>
                        <div>
                             <label className="block text-xs font-bold text-gray-500 uppercase mb-1">District</label>
                             <select 
                                value={district}
                                onChange={(e) => setDistrict(e.target.value)}
                                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none transition-colors"
                             >
                                {Object.values(KhorezmDistrict).map(d => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                             </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone</label>
                            <input 
                                type="tel" 
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none transition-colors"
                            />
                        </div>
                        <button 
                            type="submit"
                            disabled={isSaving}
                            className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold mt-2 shadow-lg shadow-emerald-600/20 active:scale-95 transition-all"
                        >
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleSecuritySave} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-100 rounded-xl mb-2">
                            <Shield className="w-5 h-5 text-amber-600" />
                            <p className="text-xs text-amber-800 font-medium">Secure password required.</p>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('currentPassword')}</label>
                            <input 
                                type="password" 
                                value={currentPass}
                                onChange={(e) => setCurrentPass(e.target.value)}
                                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('newPassword')}</label>
                            <input 
                                type="password" 
                                value={newPass}
                                onChange={(e) => setNewPass(e.target.value)}
                                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Confirm</label>
                            <input 
                                type="password" 
                                value={confirmPass}
                                onChange={(e) => setConfirmPass(e.target.value)}
                                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none"
                            />
                        </div>
                        <button type="submit" className="w-full bg-slate-800 text-white py-3 rounded-xl font-bold mt-2 shadow-lg active:scale-95 transition-all">
                            Update Password
                        </button>
                    </form>
                )}
            </div>
            
            <div className="px-4 mt-6">
                <button onClick={() => setUser(null)} className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-2xl text-red-500 font-bold hover:bg-red-50 transition-colors">
                    <span className="flex items-center gap-2"><LogOut className="w-5 h-5" /> {t('signOut')}</span>
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};
