import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AppLanguage, User, MarketItem, NewsArticle, Toast, SavedCrop } from '../types';
import { translations } from '../i18n/translations'; 

type GlobalStateContextType = {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  t: (key: string) => string;
  user: User | null;
  setUser: (user: User | null) => void;
  updateUserProfile: (data: any) => Promise<boolean>;
  changePassword: (oldPass: string, newPass: string) => Promise<boolean>;
  formatMoney: (amount: number) => string;
  formatDateLoc: (date: number | Date) => string;
  
  // 🔥 BOZOR UCHUN YANGI FUNKSIYA
  placeOrder: (productId: string, sellerId: string) => Promise<boolean>; 
  
  isOffline: boolean;
  marketItems: MarketItem[];
  news: NewsArticle[];
  myCrops: SavedCrop[];
  toasts: Toast[]; 
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
};

const GlobalContext = createContext<GlobalStateContextType | undefined>(undefined);

const API_URL = 'http://localhost:5000/api';

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  const [language, setLanguageState] = useState<AppLanguage>(() => {
    return (localStorage.getItem('language') as AppLanguage) || AppLanguage.UZ;
  });

  const [user, setUserState] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [toasts, setToasts] = useState<Toast[]>([]);
  const [news] = useState<NewsArticle[]>([]);
  const [marketItems] = useState<MarketItem[]>([]);
  const [myCrops] = useState<SavedCrop[]>([]);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleStatus = () => setIsOffline(!navigator.onLine);
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);
    return () => {
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
    };
  }, []);

  // ✅ TUZATILDI: Login/Update qilinganda hamma ma'lumotlarni saqlab qolish logikasi
  const setUser = useCallback((newUser: any) => {
    if (newUser) {
      // Backend 'username' yuboradi, biz UI uchun 'name' maydonini to'ldiramiz
      // Shuningdek phone va district maydonlari borligini tekshiramiz
      const mappedUser = {
        ...newUser,
        name: newUser.name || newUser.username || "Ism kiritilmagan",
        phone: newUser.phone || "",
        district: newUser.district || "",
        avatar: newUser.avatar || newUser.photoUrl || "",
        tier: newUser.tier || "Free"
      };
      
      setUserState(mappedUser);
      localStorage.setItem('user', JSON.stringify(mappedUser));
    } else if (newUser === null) {
      // Faqatgina ataylab Logout qilinganda ma'lumotlarni o'chiramiz
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUserState(null);
    }
  }, []);

  const setLanguage = useCallback((lang: AppLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  }, []);

  const t = useCallback((key: string) => {
    const currentLang = language || AppLanguage.UZ;
    const translation = (translations as any)[currentLang]?.[key];
    return translation || key;
  }, [language]);

  const formatMoney = useCallback((amount: number) => {
    return new Intl.NumberFormat('uz-UZ').format(amount) + " UZS";
  }, []);

  const formatDateLoc = useCallback((date: number | Date) => {
    return new Date(date).toLocaleDateString(language === AppLanguage.EN ? 'en-US' : 'ru-RU');
  }, [language]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 3000);
  }, [removeToast]);

  // ================= BACKEND BILAN ISHLOVCHI FUNKSIYALAR =================

  // ✅ TUZATILDI: Profil yangilashda barcha ma'lumotlarni yuborish
  const updateUserProfile = async (formData: any) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        addToast("Tizimga kirilmagan", "error");
        return false;
      }

      // Backend uchun 'name'ni 'username'ga o'girib yuboramiz
      const dataToSend = {
        ...formData,
        username: formData.username || formData.name
      };

      const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend)
      });

      const data = await response.json();

      if (response.ok) {
        // Muhim: data.user bo'lsa shuni, bo'lmasa data'ning o'zini setUser'ga beramiz
        setUser(data.user || data);
        addToast("Profil muvaffaqiyatli saqlandi", "success");
        return true;
      }
      
      addToast(data.error || data.message || "Xatolik yuz berdi", "error");
      return false;
    } catch (error) {
      console.error("Profil yangilashda xatolik:", error);
      addToast("Server xatosi", "error");
      return false;
    }
  };

  // 2. Parol o'zgartirish
  const changePassword = async (oldPassword: string, newPassword: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return false;

      const response = await fetch(`${API_URL}/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ oldPassword, newPassword })
      });
      const data = await response.json();
      if (response.ok) {
        addToast("Parol yangilandi", "success");
        return true;
      }
      addToast(data.error || data.message || "Xatolik", "error");
      return false;
    } catch (error) {
      addToast("Xatolik yuz berdi", "error");
      return false;
    }
  };

  // 3. BOZOR: BUYURTMA BERISH
  const placeOrder = async (productId: string, sellerId: string) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        addToast("Iltimos, avval tizimga kiring", "error");
        return false;
      }

      const response = await fetch(`${API_URL}/market/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId, sellerId })
      });

      const data = await response.json();

      if (response.ok) {
        addToast("Buyurtmangiz muvaffaqiyatli yuborildi!", "success");
        return true;
      } else {
        addToast(data.error || "Buyurtma berishda xatolik yuz berdi", "error");
        return false;
      }
    } catch (error) {
      addToast("Server bilan aloqa uzildi", "error");
      return false;
    }
  };

  return (
    <GlobalContext.Provider value={{ 
      language, setLanguage, t, user, setUser, 
      updateUserProfile, changePassword, formatMoney, formatDateLoc,
      placeOrder,
      isOffline, marketItems, news, myCrops, toasts, addToast, removeToast
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (!context) throw new Error("useGlobal must be used within GlobalProvider");
  return context;
};