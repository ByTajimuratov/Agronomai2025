
import { AppLanguage } from '../types';

export const translations = {
  [AppLanguage.EN]: {
    // Auth & Onboarding
    welcome: "Welcome to AgronomAI",
    tagline: "Precision Farming for Khorezm",
    login: "Log In",
    register: "Register",
    email: "Email",
    phone: "Phone Number",
    password: "Password",
    or: "OR",
    continueGoogle: "Continue with Google",
    continueFacebook: "Continue with Facebook",
    
    // General UI
    home: "Home",
    analysis: "Leaf Doctor",
    chat: "Agro-GPT",
    market: "Market",
    profile: "Settings",
    calendar: "Smart Calendar",
    search: "Search...",
    viewAll: "View All",
    
    // Status
    offline: "You are offline. Using cached data.",
    locationError: "Location unavailable",
    retry: "Retry",
    accessRestricted: "Region Restricted",
    outsideKhorezm: "Service available only in Khorezm region.",
    
    // Features
    leafAnalysis: "Leaf Diagnosis",
    takePhoto: "Take Photo",
    diagnosing: "AI Diagnosing...",
    marketplace: "Khorezm Bazaar",
    plantingAdvice: "Planting Advice",
    getLocation: "Get Local Advice",
    analyzingLocation: "Analyzing soil data...",
    quickActions: "Quick Actions",
    checkPlant: "Check Plant",
    askAI: "Ask Expert",
    latestNews: "Latest News",
    signOut: "Sign Out",
    
    // Weather
    weather_forecast: "5-Day Forecast (Khorezm)",
    humidity: "Humidity",
    wind: "Wind",
    precip: "Precip",
    agronomy_tip: "Agronomy Tip",
    tip_content: "High temperatures expected tomorrow. Ideally, irrigate cotton fields in the late evening to minimize evaporation.",

    // Seasons
    season_winter_greet: "Winter Agrotechnics Time",
    season_spring_greet: "Planting Season Started!",
    season_summer_greet: "Irrigation Control is Key",
    season_autumn_greet: "Harvest Time",
    
    // Planting Validation
    validation_off_season: "Off-Season Planting",
    validation_warning: "is not typically planted in this month in Khorezm.",
    validation_suggestion: "Consider Greenhouse crops instead:",
    month_names: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],

    // Premium
    upgrade: "Upgrade to Premium",
    premiumDesc: "Get unlimited AI analysis, salinity maps, and expert forecasts.",
    premiumFeature: "Premium Feature",
    manageSub: "Manage Subscription",
    freeLimit: "Free limit reached. Upgrade for more.",
    
    // NEW FEATURE LOCK KEYS
    features: {
        lock_btn: "Upgrade to Premium",
        calendar: {
            title: "Smart Harvest Calendar",
            desc: "Unlock precise planting dates optimized for saline soil and Khorezm climate."
        },
        gpt: {
            title: "Agro-GPT Consultant",
            desc: "Unlimited chat access with AI Agronomist is available only for Premium members."
        },
        analysis: {
            title: "Unlimited Analysis",
            desc: "Get unlimited leaf diagnosis and detailed treatment plans."
        }
    },
    
    // Units & Time
    daily: "Daily",
    monthly: "Monthly",
    yearly: "Yearly",
    days: "days",
    
    // Admin
    adminLogin: "Admin Access",
    secretCode: "Secret Code",
    stats: "Stats",
    users: "Users",
    revenue: "Revenue",

    // Market Categories
    cat_machinery: "Machinery & Tractors",
    cat_fertilizer: "Fertilizers & Chemicals",
    cat_seeds: "Seeds & Seedlings",
    cat_tools: "Tools & Equipment",
    cat_livestock: "Livestock",
    contactSeller: "Contact Seller",
    call: "Call",
    telegram: "Telegram",

    // Harvest Predictor
    harvestPredictor: "Harvest Predictor",
    gddCalc: "GDD Calculator",
    selectCrop: "Select Crop",
    sowingDate: "Sowing Date",
    calculate: "Calculate Maturity",
    estHarvest: "Est. Harvest Date",
    daysRemaining: "Days Remaining",
    accumulatedGdd: "Accumulated Heat Units (GDD)",
    maturityProgress: "Maturity Progress",
    gddExplanation: "Based on Khorezm historical climate data.",

    // My Crops Tracker
    myFarm: "My Farm",
    addMyCrop: "Add Active Crop",
    startTracking: "Start Tracking",
    select: "Select",
    confirmReset: "Are you sure you want to delete this crop tracker?",
    readyHarvest: "Ready for Harvest",
    daysPassed: "days passed",

    // Support & Profile
    support: "Customer Support",
    createTicket: "Create Ticket",
    subject: "Subject",
    category: "Category",
    message: "Message",
    technical: "Technical Issue",
    suggestion: "Suggestion",
    complaint: "Complaint",
    partnership: "Partnership",
    submitTicket: "Submit Ticket",
    ticketHistory: "Ticket History",
    personalInfo: "Personal Info",
    security: "Security",
    changePassword: "Change Password",
    currentPassword: "Current Password",
    newPassword: "New Password",
    saveChanges: "Save Changes",
    uploadPhoto: "Update Photo",
    maxSize: "Max 500KB",
    adminSupportInbox: "Support Inbox",
    resolve: "Resolve",
    status: "Status",
    pending: "Pending",
    resolved: "Resolved",
    in_progress: "In Progress",

    // Settings & History (NEW)
    settings_premium_subtext: "Unlimited Analysis & Weather",
    settings_activity_header: "ACTIVITY",
    settings_activity_recent: "Recent Actions",
    settings_activity_saved: "Saved Items",
    settings_app_header: "APP SETTINGS",
    settings_language: "Change Language",
    settings_dark_mode: "Dark Mode",
    settings_light_mode: "Light Mode",
    settings_support_header: "SUPPORT",
    settings_support_contact: "Contact Support",
    settings_support_manual: "User Manual (FAQ)",
    settings_version: "AgronomAI v1.2.0 (Khorezm)",
    history_title: "Activity History",
    history_empty: "No recent activity found.",
    history_clear: "Clear History",
    history_load_more: "Load Previous Month"
  },
  [AppLanguage.UZ]: {
    // Auth & Onboarding
    welcome: "AgronomAI-ga xush kelibsiz",
    tagline: "Xorazm dehqonchiligi uchun aniq yechimlar",
    login: "Kirish",
    register: "Ro‘yxatdan o‘tish",
    email: "Elektron pochta",
    phone: "Telefon raqami",
    password: "Parol",
    or: "YOKI",
    continueGoogle: "Google orqali",
    continueFacebook: "Facebook orqali",
    
    // General UI
    home: "Bosh sahifa",
    analysis: "Barg Tahlili",
    chat: "Agro-GPT",
    market: "Bozor",
    profile: "Sozlamalar",
    calendar: "Aqlli Taqvim",
    search: "Qidirish...",
    viewAll: "Barchasi",
    
    // Status
    offline: "Internet yo‘q. Oflayn rejim.",
    locationError: "Joylashuv aniqlanmadi",
    retry: "Qayta urinish",
    accessRestricted: "Hudud cheklangan",
    outsideKhorezm: "Ilova faqat Xorazm viloyatida ishlaydi.",
    
    // Features
    leafAnalysis: "Barg Diagnostikasi",
    takePhoto: "Rasmga olish",
    diagnosing: "AI Tahlil qilmoqda...",
    marketplace: "Xorazm Bozori",
    plantingAdvice: "Ekish Maslahatlari",
    getLocation: "Joylashuv bo‘yicha",
    analyzingLocation: "Tuproq tahlili...",
    quickActions: "Tezkor Amallar",
    checkPlant: "Ekinni Tekshirish",
    askAI: "Ekspert",
    latestNews: "So‘nggi yangiliklar",
    signOut: "Chiqish",
    
    // Weather
    weather_forecast: "5 Kunlik Ob-havo (Xorazm)",
    humidity: "Namlik",
    wind: "Shamol",
    precip: "Yog'in",
    agronomy_tip: "Agronom Maslahati",
    tip_content: "Ertaga havo issiq bo'lishi kutilmoqda. Suv bug'lanishini kamaytirish uchun paxta dalalarini kechki payt sug'orish tavsiya etiladi.",

    // Seasons
    season_winter_greet: "Qishgi agrotexnika vaqtida!",
    season_spring_greet: "Ekish mavsumi boshlandi!",
    season_summer_greet: "Sug'orish nazorati muhim",
    season_autumn_greet: "Hosilni yig'ish payti",

    // Planting Validation
    validation_off_season: "Mavsumga mos emas",
    validation_warning: "Xorazm sharoitida bu oyda ekilmaydi.",
    validation_suggestion: "Issiqxona ekinlarini tavsiya qilamiz:",
    month_names: ["Yan", "Fev", "Mar", "Apr", "May", "Iyun", "Iyul", "Avg", "Sen", "Okt", "Noy", "Dek"],

    // Premium
    upgrade: "Premiumga o‘tish",
    premiumDesc: "Cheksiz tahlil, sho‘r yuvish xaritalari va ob-havo prognozi.",
    premiumFeature: "Premium Imkoniyat",
    manageSub: "Obuna Sozlamalari",
    freeLimit: "Limit tugadi. Premiumga o‘ting.",
    
    // NEW FEATURE LOCK KEYS
    features: {
        lock_btn: "Premiumga o'tish",
        calendar: {
            title: "Aqlli Hosil Taqvimi",
            desc: "Sho'r tuproq va Xorazm iqlimiga moslashgan aniq ekish muddatlarini bilish uchun Premium oling."
        },
        gpt: {
            title: "Agro-GPT Maslahatchi",
            desc: "Sun'iy intellekt agronom bilan cheksiz suhbatlashish imkoniyati faqat Premium a'zolar uchun."
        },
        analysis: {
            title: "Cheksiz Tahlil",
            desc: "Cheksiz barg diagnostikasi va batafsil davolash rejalarini oling."
        }
    },
    
    // Units & Time
    daily: "Kunlik",
    monthly: "Oylik",
    yearly: "Yillik",
    days: "kun",
    
    // Admin
    adminLogin: "Admin Kirish",
    secretCode: "Maxfiy Kod",
    stats: "Statistika",
    users: "Foydalanuvchilar",
    revenue: "Tushum",

    // Market Categories
    cat_machinery: "Texnika va Traktorlar",
    cat_fertilizer: "O'g'itlar va Kimyoviy moddalar",
    cat_seeds: "Urug'lar va Ko'chatlar",
    cat_tools: "Asbob-uskunalar",
    cat_livestock: "Chorvachilik",
    contactSeller: "Sotuvchi bilan aloqa",
    call: "Qo'ng'iroq",
    telegram: "Telegram",

    // Harvest Predictor
    harvestPredictor: "Hosili Bashorati",
    gddCalc: "Foydali Harorat Yig'indisi (GDD)",
    selectCrop: "Ekin turini tanlang",
    sowingDate: "Ekish sanasi",
    calculate: "Hisoblash",
    estHarvest: "Kutilayotgan hosil sanasi",
    daysRemaining: "Qolgan kunlar",
    accumulatedGdd: "Yig'ilgan harorat (GDD)",
    maturityProgress: "Yetilish jarayoni",
    gddExplanation: "Xorazm iqlim ma'lumotlariga asoslangan.",

    // My Crops Tracker
    myFarm: "Mening Fermam",
    addMyCrop: "Ekin qo'shish",
    startTracking: "Kuzatishni boshlash",
    select: "Tanlang",
    confirmReset: "Haqiqatan ham bu ekinni o‘chirib tashlamoqchimisiz?",
    readyHarvest: "Hosilga tayyor",
    daysPassed: "kun o'tdi",

    // Support & Profile
    support: "Qo'llab-quvvatlash xizmati",
    createTicket: "Murojaat yaratish",
    subject: "Mavzu",
    category: "Toifa",
    message: "Xabar",
    technical: "Texnik muammo",
    suggestion: "Taklif",
    complaint: "Shikoyat",
    partnership: "Hamkorlik",
    submitTicket: "Yuborish",
    ticketHistory: "Murojaatlar tarixi",
    personalInfo: "Shaxsiy ma'lumotlar",
    security: "Xavfsizlik",
    changePassword: "Parolni o'zgartirish",
    currentPassword: "Joriy parol",
    newPassword: "Yangi parol",
    saveChanges: "Saqlash",
    uploadPhoto: "Rasmni yangilash",
    maxSize: "Maks 500KB",
    adminSupportInbox: "Murojaatlar qutisi",
    resolve: "Hal qilish",
    status: "Holat",
    pending: "Kutilmoqda",
    resolved: "Hal qilindi",
    in_progress: "Jarayonda",

    // Settings & History (NEW)
    settings_premium_subtext: "Cheksiz tahlil va Ob-havo",
    settings_activity_header: "FAOLIYAT",
    settings_activity_recent: "Oxirgi amallar",
    settings_activity_saved: "Saqlanganlar",
    settings_app_header: "ILOVA SOZLAMALARI",
    settings_language: "Tilni o'zgartirish",
    settings_dark_mode: "Tungi rejim",
    settings_light_mode: "Kunduzgi rejim",
    settings_support_header: "YORDAM",
    settings_support_contact: "Qo'llab-quvvatlash xizmati",
    settings_support_manual: "Qo'llanma (FAQ)",
    settings_version: "AgronomAI v1.2.0 (Xorazm)",
    history_title: "Faoliyat Tarixi",
    history_empty: "Oxirgi amallar mavjud emas.",
    history_clear: "Tarixni tozalash",
    history_load_more: "O'tgan oyni yuklash"
  },
  [AppLanguage.RU]: {
    // Auth & Onboarding
    welcome: "Добро пожаловать в AgronomAI",
    tagline: "Точное земледелие для Хорезма",
    login: "Войти",
    register: "Регистрация",
    email: "Email",
    phone: "Телефон",
    password: "Пароль",
    or: "ИЛИ",
    continueGoogle: "Через Google",
    continueFacebook: "Через Facebook",
    
    // General UI
    home: "Главная",
    analysis: "Доктор Листьев",
    chat: "Agro-GPT",
    market: "Базар",
    profile: "Настройки",
    calendar: "Календарь",
    search: "Поиск...",
    viewAll: "Все",
    
    // Status
    offline: "Нет сети. Офлайн режим.",
    locationError: "Ошибка геолокации",
    retry: "Повторить",
    accessRestricted: "Доступ ограничен",
    outsideKhorezm: "Сервис доступен только в Хорезме.",
    
    // Features
    leafAnalysis: "Диагностика",
    takePhoto: "Сделать фото",
    diagnosing: "AI Диагностика...",
    marketplace: "Агрорынок",
    plantingAdvice: "Советы по посадке",
    getLocation: "По локации",
    analyzingLocation: "Анализ почвы...",
    quickActions: "Действия",
    checkPlant: "Проверить",
    askAI: "Спросить AI",
    latestNews: "Последние новости",
    signOut: "Выход",
    
    // Weather
    weather_forecast: "Прогноз на 5 дней (Хорезм)",
    humidity: "Влажность",
    wind: "Ветер",
    precip: "Осадки",
    agronomy_tip: "Совет Агронома",
    tip_content: "Ожидается высокая температура. Рекомендуется поливать хлопковые поля поздно вечером, чтобы минимизировать испарение.",

    // Seasons
    season_winter_greet: "Время зимней агротехники!",
    season_spring_greet: "Посевной сезон начался!",
    season_summer_greet: "Контроль полива важен",
    season_autumn_greet: "Время сбора урожая",

    // Planting Validation
    validation_off_season: "Не сезон",
    validation_warning: "Эта культура обычно не сажается в этом месяце в Хорезме.",
    validation_suggestion: "Рассмотрите тепличные культуры:",
    month_names: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],

    // Premium
    upgrade: "Купить Premium",
    premiumDesc: "Безлимитный анализ, карты засоленности и прогноз.",
    premiumFeature: "Premium функция",
    manageSub: "Управление",
    freeLimit: "Лимит исчерпан. Нужен Premium.",
    
    // NEW FEATURE LOCK KEYS
    features: {
        lock_btn: "Перейти на Premium",
        calendar: {
            title: "Умный Календарь",
            desc: "Откройте точные даты посева, оптимизированные для засоленных почв и климата Хорезма."
        },
        gpt: {
            title: "Agro-GPT Консультант",
            desc: "Безлимитный чат с ИИ-агрономом доступен только для Premium пользователей."
        },
        analysis: {
            title: "Безлимитный Анализ",
            desc: "Получите безлимитную диагностику листьев и детальные планы лечения."
        }
    },
    
    // Units & Time
    daily: "Сутки",
    monthly: "Месяц",
    yearly: "Год",
    days: "дней",
    
    // Admin
    adminLogin: "Вход Админа",
    secretCode: "Код доступа",
    stats: "Статистика",
    users: "Фермеры",
    revenue: "Доход",

    // Market Categories
    cat_machinery: "Техника и Тракторы",
    cat_fertilizer: "Удобрения и Химикаты",
    cat_seeds: "Семена и Саженцы",
    cat_tools: "Инструменты",
    cat_livestock: "Животноводство",
    contactSeller: "Связаться с продавцом",
    call: "Позвонить",
    telegram: "Telegram",

    // Harvest Predictor
    harvestPredictor: "Прогноз Урожая",
    gddCalc: "Калькулятор GDD",
    selectCrop: "Выберите культуру",
    sowingDate: "Дата посева",
    calculate: "Рассчитать",
    estHarvest: "Ожидаемая дата сбора",
    daysRemaining: "Осталось дней",
    accumulatedGdd: "Накопленные температуры (GDD)",
    maturityProgress: "Прогресс созревания",
    gddExplanation: "Основано на климатических данных Хорезма.",

    // My Crops Tracker
    myFarm: "Моя ферма",
    addMyCrop: "Добавить культуру",
    startTracking: "Начать отслеживание",
    select: "Выберите",
    confirmReset: "Вы уверены, что хотите удалить эту культуру?",
    readyHarvest: "Готов к сбору",
    daysPassed: "дней прошло",

    // Support & Profile
    support: "Служба поддержки",
    createTicket: "Создать тикет",
    subject: "Тема",
    category: "Категория",
    message: "Сообщение",
    technical: "Техническая проблема",
    suggestion: "Предложение",
    complaint: "Жалоба",
    partnership: "Сотрудничество",
    submitTicket: "Отправить",
    ticketHistory: "История тикетов",
    personalInfo: "Личные данные",
    security: "Безопасность",
    changePassword: "Сменить пароль",
    currentPassword: "Текущий пароль",
    newPassword: "Новый пароль",
    saveChanges: "Сохранить",
    uploadPhoto: "Загрузить фото",
    maxSize: "Макс 500КБ",
    adminSupportInbox: "Входящие тикеты",
    resolve: "Решить",
    status: "Статус",
    pending: "В ожидании",
    resolved: "Решено",
    in_progress: "В процессе",

    // Settings & History (NEW)
    settings_premium_subtext: "Безлимитный анализ и погода",
    settings_activity_header: "АКТИВНОСТЬ",
    settings_activity_recent: "Последние действия",
    settings_activity_saved: "Сохраненные",
    settings_app_header: "НАСТРОЙКИ ПРИЛОЖЕНИЯ",
    settings_language: "Изменить язык",
    settings_dark_mode: "Ночной режим",
    settings_light_mode: "Дневной режим",
    settings_support_header: "ПОДДЕРЖКА",
    settings_support_contact: "Служба поддержки",
    settings_support_manual: "Инструкция (FAQ)",
    settings_version: "AgronomAI v1.2.0 (Хорезм)",
    history_title: "История активности",
    history_empty: "Нет недавней активности.",
    history_clear: "Очистить историю",
    history_load_more: "Загрузить прошлый месяц"
  }
};

export type TranslationKey = keyof typeof translations[AppLanguage.EN];
