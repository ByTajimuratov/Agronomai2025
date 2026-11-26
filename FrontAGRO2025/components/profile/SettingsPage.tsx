
import React, { useState, useRef, useEffect } from 'react';
import { useGlobal } from '../../store/GlobalStore';
import { usePremium } from '../../contexts/PremiumContext';
import { EditProfileModal } from './EditProfileModal';
import { LanguageBottomSheet } from './LanguageBottomSheet';
import { useNavigate } from 'react-router-dom';
import { logUserAction } from '../../utils/historyUtils'; // Legacy utility usage can remain for system logs or be migrated
import { 
    ChevronRight, 
    Crown, 
    History, 
    Heart, 
    Globe, 
    Moon, 
    Sun,
    Headphones, 
    HelpCircle, 
    Pencil,
    LogOut
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
    const { user, t, setUser, addToast } = useGlobal();
    const { openPremiumModal } = usePremium();
    const navigate = useNavigate();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isLangModalOpen, setIsLangModalOpen] = useState(false);
    
    // Theme State
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
    });

    const [tapCount, setTapCount] = useState(0);
    const tapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const handleThemeToggle = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        // Log system action (using legacy utility or new context if we migrated it entirely, here keeping legacy for now to avoid breaking imports)
        logUserAction(
            'system', 
            newTheme === 'dark' ? 'Enabled Dark Mode' : 'Enabled Light Mode', 
            'User changed app appearance settings.'
        );
        addToast(newTheme === 'dark' ? "Dark mode enabled" : "Light mode enabled", 'info');
    };

    const handleVersionTap = () => {
        setTapCount(prev => {
            if (prev === 0) {
                if (tapTimeoutRef.current) clearTimeout(tapTimeoutRef.current);
                tapTimeoutRef.current = setTimeout(() => { setTapCount(0); }, 2000);
            }
            const newCount = prev + 1;
            if (newCount === 3) addToast(t('secretCode'), 'info');
            if (newCount >= 5) {
                if (tapTimeoutRef.current) clearTimeout(tapTimeoutRef.current);
                navigate('/admin');
                return 0;
            }
            return newCount;
        });
    };

    if (!user) return null;

    const GroupItem = ({ icon: Icon, label, onClick, color = "text-gray-600 dark:text-gray-400", toggle }: { icon: any, label: string, onClick?: () => void, color?: string, toggle?: boolean }) => (
        <button 
            onClick={onClick}
            className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 last:border-0 active:bg-gray-50 dark:active:bg-slate-700 transition-colors first:rounded-t-2xl last:rounded-b-2xl group"
        >
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-gray-50 dark:bg-slate-700 group-active:bg-white dark:group-active:bg-slate-600 transition-colors`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{label}</span>
            </div>
            {toggle ? (
                <div className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${theme === 'dark' ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-slate-600'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow-sm transition-all duration-300 ${theme === 'dark' ? 'left-5' : 'left-0.5'}`}></div>
                </div>
            ) : (
                <ChevronRight className="w-4 h-4 text-gray-300 dark:text-slate-600" />
            )}
        </button>
    );

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-slate-900 pb-32 transition-colors duration-300">
            <div className="max-w-2xl mx-auto pt-6 px-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 px-1">{t('profile')}</h1>

                <button 
                    onClick={() => setIsEditModalOpen(true)}
                    className="w-full bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-sm border border-gray-200/50 dark:border-slate-700 flex items-center gap-4 mb-6 transition-transform active:scale-[0.98]"
                >
                    <div className="relative">
                        {user.photoUrl ? (
                            <img src={user.photoUrl} alt="User" className="w-16 h-16 rounded-full object-cover shadow-md" />
                        ) : (
                            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md">
                               {user?.name ? user.name.substring(0, 2).toUpperCase() : "AG"}
                            </div>
                        )}
                        <div className="absolute bottom-0 right-0 bg-white dark:bg-slate-600 rounded-full p-1 shadow-sm">
                             <Pencil className="w-3 h-3 text-gray-600 dark:text-white" />
                        </div>
                    </div>
                    <div className="text-left flex-1">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user?.name || "Ism kiritilmagan"}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{user.phone || user.email}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 dark:text-slate-600" />
                </button>

                {user.tier !== 'Premium' && (
                    <div 
                        onClick={openPremiumModal}
                        className="bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 rounded-3xl p-5 mb-8 shadow-lg shadow-amber-500/20 text-white relative overflow-hidden cursor-pointer group"
                    >
                        <div className="relative z-10 flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <Crown className="w-5 h-5 fill-white text-white" />
                                    <span className="font-bold text-sm uppercase tracking-wider opacity-90">Premium</span>
                                </div>
                                <h3 className="text-2xl font-bold mb-1">{t('upgrade')}</h3>
                                <p className="text-amber-100 text-sm font-medium">{t('settings_premium_subtext')}</p>
                            </div>
                            <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                                <ChevronRight className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="absolute -right-4 -bottom-10 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
                    </div>
                )}

                <div className="space-y-6">
                    <div>
                        <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase ml-4 mb-2">{t('settings_activity_header')}</h4>
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200/60 dark:border-slate-700 overflow-hidden">
                             {/* Link to the new RecentActivities page */}
                             <GroupItem icon={History} label={t('settings_activity_recent')} onClick={() => navigate('/recent-actions')} color="text-blue-500" />
                             <GroupItem icon={Heart} label={t('settings_activity_saved')} onClick={() => navigate('/saved')} color="text-red-500" />
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase ml-4 mb-2">{t('settings_app_header')}</h4>
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200/60 dark:border-slate-700 overflow-hidden">
                             <GroupItem icon={Globe} label={t('settings_language')} onClick={() => setIsLangModalOpen(true)} color="text-indigo-500" />
                             <GroupItem 
                                icon={theme === 'dark' ? Moon : Sun} 
                                label={theme === 'dark' ? t('settings_dark_mode') : t('settings_light_mode')} 
                                onClick={handleThemeToggle} 
                                color="text-purple-500" 
                                toggle={true}
                             />
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase ml-4 mb-2">{t('settings_support_header')}</h4>
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200/60 dark:border-slate-700 overflow-hidden">
                             <GroupItem icon={Headphones} label={t('settings_support_contact')} onClick={() => navigate('/support')} color="text-emerald-600" />
                             <GroupItem icon={HelpCircle} label={t('settings_support_manual')} onClick={() => navigate('/manual')} color="text-orange-500" />
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center pb-6">
                    <button 
                        onClick={() => {
                            setUser(null);
                        }}
                        className="text-red-500 font-bold text-sm py-2 px-4 rounded-lg hover:bg-red-50 dark:hover:bg-slate-800 transition-colors mb-2 flex items-center justify-center gap-2 mx-auto"
                    >
                        <LogOut className="w-4 h-4" /> {t('signOut')}
                    </button>
                    <p 
                        onClick={handleVersionTap}
                        className="text-xs text-gray-400 dark:text-gray-600 select-none cursor-default active:text-gray-500 transition-colors"
                    >
                        {t('settings_version')}
                    </p>
                </div>
            </div>

            <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
            <LanguageBottomSheet isOpen={isLangModalOpen} onClose={() => setIsLangModalOpen(false)} />
        </div>
    );
};
