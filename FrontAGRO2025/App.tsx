import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { WifiOff, MapPinOff, Globe, ChevronRight } from 'lucide-react';

// --- COMPONENTS & STORES ---
import { LeafAnalysis } from './components/LeafAnalysis';
import { Marketplace } from './components/Marketplace';
import { AIChat } from './components/AIChat';
import { Auth } from './components/Auth';
import { SmartCalendar } from './components/SmartCalendar';
import { HarvestPredictor } from './components/HarvestPredictor';
import { HomeDashboard } from './components/HomeDashboard';
import { NewsFeedPage } from './components/NewsFeedPage';
import { BottomNav } from './components/BottomNav';

// --- PROFILE & SUPPORT ---
import { SettingsPage } from './components/profile/SettingsPage';
import { ActivityHistoryPage } from './components/profile/ActivityHistoryPage';
import { RecentActivities } from './components/profile/RecentActivities';
import { SavedItemsPage } from './components/profile/SavedItemsPage';
import { UserManualPage } from './components/profile/UserManualPage';
import { SupportCenter } from './components/support/SupportCenter';
import { ToastContainer } from './components/shared/ToastContainer';

// --- ADMIN COMPONENTS ---
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { NewsManager } from './components/admin/NewsManager';
import { MarketModeration } from './components/admin/MarketModeration';
import { AdminSupportInbox } from './components/admin/AdminSupportInbox';
import { AdsManager } from './components/admin/AdsManager';

// --- CONTEXTS & HOOKS ---
import { GlobalProvider, useGlobal } from './store/GlobalStore';
import { PremiumProvider } from './contexts/PremiumContext';
import { CoinProvider } from './contexts/CoinContext';
import { ActivityProvider } from './contexts/ActivityContext';
import { useKhorezmLocation } from './features/geo/useKhorezmLocation';
import { AppLanguage } from './types';

// --- HELPER COMPONENTS ---

// 1. Splash Screen (Yuklanish ekrani)
const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onFinish, 2500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 bg-emerald-800 flex flex-col items-center justify-center z-50 text-white bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
      <div className="animate-bounce mb-4 p-5 bg-white rounded-3xl shadow-2xl">
         <LeafAnalysisIcon className="w-24 h-24 text-emerald-600" />
      </div>
      <h1 className="text-5xl font-bold tracking-tight animate-pulse font-sans">AgronomAI</h1>
      <p className="text-emerald-200 mt-3 text-sm font-medium tracking-widest uppercase">Super App for Farmers</p>
    </div>
  );
};

// 2. Language Selection (Til tanlash)
const LanguageSelectScreen = () => {
  const { setLanguage } = useGlobal();
  const languages = [
      { code: AppLanguage.UZ, label: 'Oʻzbekcha', flag: '🇺🇿' },
      { code: AppLanguage.RU, label: 'Русский', flag: '🇷🇺' },
      { code: AppLanguage.EN, label: 'English', flag: '🇺🇸' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
        <Globe className="w-8 h-8 text-emerald-600" />
      </div>
      <h2 className="text-3xl font-bold mb-2 text-center text-gray-900">Select Language</h2>
      <p className="text-gray-500 mb-10 text-center">Tilni tanlang / Выберите язык</p>
      <div className="space-y-4 w-full max-w-xs">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className="w-full p-5 bg-white border border-gray-200 rounded-2xl text-lg font-bold hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/10 transition-all flex justify-between items-center group"
          >
            <span className="flex items-center gap-4">
                <span className="text-2xl">{lang.flag}</span>
                {lang.label}
            </span>
            <ChevronRight className="text-gray-300 group-hover:text-emerald-500" />
          </button>
        ))}
      </div>
    </div>
  );
};

// 3. Offline Banner
const OfflineBanner = () => {
    const { isOffline, t } = useGlobal();
    if (!isOffline) return null;
    return (
        <div className="bg-slate-900 text-white text-xs py-2 px-4 text-center fixed top-0 w-full z-[60] flex items-center justify-center gap-2 font-bold">
            <WifiOff className="w-3 h-3" /> {t('offline')}
        </div>
    );
};

// 4. Geo Block Modal (Xorazmdan tashqarida bo'lsa)
const GeoBlockModal = ({ retry }: { retry: () => void }) => {
    const { t } = useGlobal();
    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6 backdrop-blur-md">
            <div className="bg-white rounded-3xl p-8 max-w-sm text-center shadow-2xl">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPinOff className="w-10 h-10 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('accessRestricted')}</h2>
                <p className="text-gray-500 mb-8 leading-relaxed">{t('outsideKhorezm')}</p>
                <button onClick={retry} className="bg-gray-900 text-white px-8 py-4 rounded-xl font-bold w-full hover:bg-gray-800 transition-colors">
                    {t('retry')}
                </button>
            </div>
        </div>
    );
};

// Icon Helper
const LeafAnalysisIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.77 10-10 10Z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </svg>
);

// --- MAIN APP LOGIC ---

const AppFlow = () => {
    const { language, user, setUser } = useGlobal();
    const [loading, setLoading] = useState(true);
    
    // Khorezm Protocol
    const { retry, error } = useKhorezmLocation();

    // Dastur yuklanganda LocalStorage ni tekshirish
    useEffect(() => {
        const initApp = async () => {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');
            
            // Agar token bor lekin user state bo'sh bo'lsa, uni tiklaymiz
            if (token && storedUser && !user) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (e) {
                    // Xato bo'lsa tozalab tashlaymiz
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            }
            
            // Splash screen uchun vaqt
            setTimeout(() => setLoading(false), 2000);
        };
        initApp();
    }, []);

    if (loading) return <SplashScreen onFinish={() => {}} />;

    // Agar til tanlanmagan bo'lsa
    if (!language) {
        return <LanguageSelectScreen />;
    }

    // Himoyalangan Route (Login qilmaganlarni kiritmaydi)
    const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
        if (!user) {
            return <Auth onLogin={setUser} />;
        }
        
        // Agar Xorazmda bo'lmasa (GeoBlock)
        if (error) {
            return <GeoBlockModal retry={retry} />;
        }

        return (
            <div className="min-h-screen bg-gray-50 font-sans text-slate-900 pb-24">
                {children}
                <BottomNav />
            </div>
        );
    };

    return (
        <Router>
             <OfflineBanner />
             <ToastContainer />
             
             <Routes>
                {/* --- Public/User Routes --- */}
                <Route path="/" element={
                    <ProtectedRoute>
                        <HomeDashboard />
                    </ProtectedRoute>
                } />
                
                {/* Asosiy Funksiyalar */}
                <Route path="/analysis" element={
                    <ProtectedRoute>
                        <LeafAnalysis />
                    </ProtectedRoute>
                } />
                
                <Route path="/market" element={
                    <ProtectedRoute>
                        <Marketplace />
                    </ProtectedRoute>
                } />
                
                <Route path="/chat" element={
                    <ProtectedRoute>
                        <AIChat />
                    </ProtectedRoute>
                } />
                
                <Route path="/calendar" element={
                    <ProtectedRoute>
                        <SmartCalendar />
                    </ProtectedRoute>
                } />
                
                <Route path="/harvest" element={
                    <ProtectedRoute>
                        <HarvestPredictor />
                    </ProtectedRoute>
                } />
                
                <Route path="/news" element={
                    <ProtectedRoute>
                        <NewsFeedPage />
                    </ProtectedRoute>
                } />
                
                {/* Profil va Sozlamalar */}
                <Route path="/profile" element={
                    <ProtectedRoute>
                        <SettingsPage />
                    </ProtectedRoute>
                } />
                
                <Route path="/history" element={
                    <ProtectedRoute>
                        <ActivityHistoryPage />
                    </ProtectedRoute>
                } />
                
                <Route path="/recent-actions" element={
                    <ProtectedRoute>
                        <RecentActivities />
                    </ProtectedRoute>
                } />
                
                <Route path="/saved" element={
                    <ProtectedRoute>
                        <SavedItemsPage />
                    </ProtectedRoute>
                } />
                
                <Route path="/manual" element={
                    <ProtectedRoute>
                        <UserManualPage />
                    </ProtectedRoute>
                } />
                
                <Route path="/support" element={
                    <ProtectedRoute>
                        <SupportCenter />
                    </ProtectedRoute>
                } />

                {/* --- ADMIN ROUTELARI --- */}
                <Route path="/admin/login" element={<AdminLogin />} />
                
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="news" element={<NewsManager />} />
                    <Route path="market" element={<MarketModeration />} />
                    <Route path="ads" element={<AdsManager />} />
                    <Route path="support" element={<AdminSupportInbox />} />
                </Route>

                {/* Noma'lum sahifa bo'lsa Bosh sahifaga yo'naltirish */}
                <Route path="*" element={<Navigate to="/" />} />

             </Routes>
        </Router>
    );
};

// --- APP ENTRY POINT ---
export default function App() {
  return (
      <GlobalProvider>
          <PremiumProvider>
              <CoinProvider>
                  <ActivityProvider>
                      <AppFlow />
                  </ActivityProvider>
              </CoinProvider>
          </PremiumProvider>
      </GlobalProvider>
  );
}