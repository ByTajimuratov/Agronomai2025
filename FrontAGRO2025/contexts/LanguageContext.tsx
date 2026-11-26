import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppLanguage } from '../types';

// Translation Dictionary
const translations = {
  [AppLanguage.EN]: {
    welcome: "Welcome to AgronomAI",
    tagline: "Smart Farming for Everyone",
    login: "Log In",
    register: "Register",
    email: "Email",
    phone: "Phone Number",
    password: "Password",
    or: "OR",
    continueGoogle: "Continue with Google",
    continueFacebook: "Continue with Facebook",
    home: "Home",
    analysis: "Analysis",
    chat: "AI Chat",
    market: "Market",
    profile: "Profile",
    calendar: "Smart Calendar",
    upgrade: "Upgrade to Premium",
    premiumDesc: "Unlock unlimited analysis, weather insights, and AI consultant.",
    daily: "Daily",
    monthly: "Monthly",
    yearly: "Yearly",
    uzs: "UZS",
    leafAnalysis: "AI Leaf Analysis",
    takePhoto: "Tap to capture or upload",
    monthlyUsage: "Monthly Usage",
    diagnosing: "Analyzing plant health...",
    marketplace: "Marketplace",
    search: "Search items...",
    smartAgronomist: "Smart Agronomist",
    premiumFeature: "Premium Feature",
    adminLogin: "Admin Access",
    secretCode: "Secret Code",
    accessDenied: "Access Denied",
    stats: "System Statistics",
    users: "Total Users",
    revenue: "Revenue",
    plantingAdvice: "Planting Advice",
    getLocation: "Get Location-Based Advice",
    analyzingLocation: "Analyzing local climate...",
    myFarm: "My Farm",
    quickActions: "Quick Actions",
    checkPlant: "Check Plant",
    askAI: "Ask AI",
    latestNews: "Latest News",
    signOut: "Sign Out",
    manageSub: "Manage Subscription",
    freeLimit: "Free limit reached (4/month). Please upgrade.",
    uploadError: "Could not analyze. Try again.",
    adminDashboard: "Admin Dashboard"
  },
  [AppLanguage.UZ]: {
    welcome: "AgronomAI-ga xush kelibsiz",
    tagline: "Hamma uchun aqlli dehqonchilik",
    login: "Kirish",
    register: "Ro‘yxatdan o‘tish",
    email: "Elektron pochta",
    phone: "Telefon raqami",
    password: "Parol",
    or: "YOKI",
    continueGoogle: "Google orqali davom etish",
    continueFacebook: "Facebook orqali davom etish",
    home: "Bosh sahifa",
    analysis: "Tahlil",
    chat: "AI Chat",
    market: "Bozor",
    profile: "Profil",
    calendar: "Aqlli Taqvim",
    upgrade: "Premiumga o‘tish",
    premiumDesc: "Cheksiz tahlillar, ob-havo ma'lumotlari va AI maslahatchisiga ega bo'ling.",
    daily: "Kunlik",
    monthly: "Oylik",
    yearly: "Yillik",
    uzs: "SO'M",
    leafAnalysis: "Barg Tahlili",
    takePhoto: "Rasmga olish yoki yuklash",
    monthlyUsage: "Oylik foydalanish",
    diagnosing: "O‘simlik salomatligi tahlil qilinmoqda...",
    marketplace: "Qishloq xo‘jaligi bozori",
    search: "Qidirish...",
    smartAgronomist: "Aqlli Agronom",
    premiumFeature: "Premium Imkoniyat",
    adminLogin: "Admin Kirish",
    secretCode: "Maxfiy Kod",
    accessDenied: "Kirish taqiqlandi",
    stats: "Tizim statistikasi",
    users: "Jami foydalanuvchilar",
    revenue: "Daromad",
    plantingAdvice: "Ekish bo‘yicha maslahatlar",
    getLocation: "Joylashuv bo‘yicha maslahat olish",
    analyzingLocation: "Mahalliy iqlim tahlil qilinmoqda...",
    myFarm: "Mening Fermam",
    quickActions: "Tezkor amallar",
    checkPlant: "O‘simlikni tekshirish",
    askAI: "AIdan so‘rash",
    latestNews: "So‘nggi yangiliklar",
    signOut: "Chiqish",
    manageSub: "Obunani boshqarish",
    freeLimit: "Bepul limit tugadi (oyiga 4 ta). Iltimos, Premiumga o'ting.",
    uploadError: "Tahlil qilib bo'lmadi. Qayta urinib ko'ring.",
    adminDashboard: "Admin Paneli"
  },
  [AppLanguage.RU]: {
    welcome: "Добро пожаловать в AgronomAI",
    tagline: "Умное фермерство для всех",
    login: "Войти",
    register: "Регистрация",
    email: "Электронная почта",
    phone: "Номер телефона",
    password: "Пароль",
    or: "ИЛИ",
    continueGoogle: "Продолжить с Google",
    continueFacebook: "Продолжить с Facebook",
    home: "Главная",
    analysis: "Анализ",
    chat: "AI Чат",
    market: "Рынок",
    profile: "Профиль",
    calendar: "Умный календарь",
    upgrade: "Перейти на Premium",
    premiumDesc: "Получите безлимитный анализ, прогноз погоды и AI-консультанта.",
    daily: "Ежедневно",
    monthly: "Ежемесячно",
    yearly: "Ежегодно",
    uzs: "СУМ",
    leafAnalysis: "Анализ листьев",
    takePhoto: "Снять или загрузить фото",
    monthlyUsage: "Использование в месяц",
    diagnosing: "Анализ здоровья растения...",
    marketplace: "Агрорынок",
    search: "Поиск товаров...",
    smartAgronomist: "Умный Агроном",
    premiumFeature: "Premium функция",
    adminLogin: "Вход для админа",
    secretCode: "Секретный код",
    accessDenied: "Доступ запрещен",
    stats: "Статистика системы",
    users: "Всего пользователей",
    revenue: "Выручка",
    plantingAdvice: "Советы по посадке",
    getLocation: "Получить совет по геолокации",
    analyzingLocation: "Анализ местного климата...",
    myFarm: "Моя ферма",
    quickActions: "Быстрые действия",
    checkPlant: "Проверить растение",
    askAI: "Спросить AI",
    latestNews: "Последние новости",
    signOut: "Выйти",
    manageSub: "Управление подпиской",
    freeLimit: "Бесплатный лимит исчерпан (4/мес). Перейдите на Premium.",
    uploadError: "Не удалось проанализировать. Попробуйте снова.",
    adminDashboard: "Панель администратора"
  }
};

type LanguageContextType = {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  t: (key: keyof typeof translations[AppLanguage.EN]) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode, initialLanguage?: AppLanguage }> = ({ children, initialLanguage }) => {
  const [language, setLanguage] = useState<AppLanguage>(initialLanguage || AppLanguage.EN);

  const t = (key: keyof typeof translations[AppLanguage.EN]) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
