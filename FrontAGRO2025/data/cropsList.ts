
import { GrowthStage, CropData } from '../types';

// --- Schedules ---

// 1. Cereal Schedule (Wheat/Barley)
const CEREAL_SCHEDULE: GrowthStage[] = [
    {
        stageName: { uz: "Ekish va Unib chiqish", ru: "Посев и Всходы", en: "Sowing & Germination" },
        dayStart: 0,
        dayEnd: 10,
        tasks: [
            { 
                id: 't_sow', 
                type: 'check', 
                title: { uz: "Ekish chuqurligini tekshirish", ru: "Проверка глубины посева", en: "Check sowing depth" },
                description: { uz: "Urug'lar 3-5 sm chuqurlikda ekanligiga ishonch hosil qiling.", ru: "Убедитесь, что семена на глубине 3-5 см.", en: "Ensure seeds are at 3-5cm depth." }
            },
            { 
                id: 't_water_init', 
                type: 'water', 
                title: { uz: "Namlikni saqlash suvi", ru: "Влагозарядковый полив", en: "Moisture retention watering" },
                description: { uz: "Tuproq namligi unib chiqish uchun yetarli bo'lishi kerak.", ru: "Влажность почвы должна быть достаточной для всходов.", en: "Soil moisture must be sufficient for germination." }
            }
        ]
    },
    {
        stageName: { uz: "Tup olish", ru: "Кущение", en: "Tillering" },
        dayStart: 20,
        dayEnd: 45,
        tasks: [
            { 
                id: 't_fert_n', 
                type: 'fertilizer', 
                title: { uz: "Azotli o'g'itlash (1-bosqich)", ru: "Азотная подкормка (1 этап)", en: "Nitrogen Fertilization (Stage 1)" },
                description: { uz: "Gektariga 150kg selitra.", ru: "150 кг селитры на гектар.", en: "150kg Ammonium Nitrate per hectare." }
            }
        ]
    }
];

// 2. Cotton Schedule (Paxta)
const COTTON_SCHEDULE: GrowthStage[] = [
    {
        stageName: { uz: "Ekish davri", ru: "Период посева", en: "Sowing Period" },
        dayStart: 0,
        dayEnd: 5,
        tasks: [
            { 
                id: 'c_sow_temp', 
                type: 'check', 
                title: { uz: "Tuproq haroratini o'lchash", ru: "Измерение температуры почвы", en: "Check soil temperature" },
                description: { uz: "Tuproq harorati 14°C dan yuqori bo'lishi shart.", ru: "Температура почвы должна быть выше 14°C.", en: "Soil temp must be above 14°C." }
            },
            { 
                id: 'c_water_pre', 
                type: 'water', 
                title: { uz: "Ekish oldi sug'orish", ru: "Предпосевной полив", en: "Pre-sowing irrigation" },
                description: { uz: "Sho'r yuvish tugaganligini tekshiring.", ru: "Проверьте завершение промывки солей.", en: "Verify salt leaching is complete." }
            }
        ]
    },
    {
        stageName: { uz: "Maysalash", ru: "Всходы", en: "Germination" },
        dayStart: 6,
        dayEnd: 15,
        tasks: [
            { 
                id: 'c_crust', 
                type: 'check', 
                title: { uz: "Qatqaloqqa qarshi kurash", ru: "Борьба с коркой", en: "Soil crust prevention" },
                description: { uz: "Yomg'irdan so'ng yengil kultivatsiya qiling.", ru: "Легкая культивация после дождя.", en: "Light cultivation after rain." }
            }
        ]
    },
    {
        stageName: { uz: "Shonalash", ru: "Бутонизация", en: "Budding" },
        dayStart: 35,
        dayEnd: 55,
        tasks: [
            { 
                id: 'c_pest_1', 
                type: 'analysis', 
                title: { uz: "Barg tahlili (AI)", ru: "Анализ листьев (AI)", en: "Leaf Analysis (AI)" },
                description: { uz: "Shira va o'rgimchak kanani aniqlash uchun rasmga oling.", ru: "Сфотографируйте для выявления тли и клещей.", en: "Scan for aphids and mites." }
            }
        ]
    }
];

// 3. Tomato Schedule
const TOMATO_SCHEDULE: GrowthStage[] = [
    {
        stageName: { uz: "Ko'chat o'tqazish", ru: "Высадка рассады", en: "Transplanting" },
        dayStart: 0,
        dayEnd: 3,
        tasks: [
            { 
                id: 'tm_water', 
                type: 'water', 
                title: { uz: "Tutib olish suvi", ru: "Полив для приживления", en: "Establishment watering" },
                description: { uz: "Ko'chat ildizi yaxshi o'rnashishi uchun.", ru: "Для хорошего укоренения рассады.", en: "For root establishment." }
            }
        ]
    }
];

export const CROPS_LIST: CropData[] = [
  {
    id: 'cotton_khorezm127',
    category: 'technical',
    label: { uz: 'Paxta (Xorazm-127)', ru: 'Хлопок (Хорезм-127)', en: 'Cotton (Khorezm-127)' },
    avgDays: 140, baseTemp: 14, allowedMonths: [2, 3, 4],
    growthSchedule: COTTON_SCHEDULE
  },
  {
    id: 'wheat_winter',
    category: 'grains',
    label: { uz: 'Kuzgi Bug\'doy', ru: 'Озимая Пшеница', en: 'Winter Wheat' },
    avgDays: 240, baseTemp: 4, allowedMonths: [8, 9, 10],
    growthSchedule: CEREAL_SCHEDULE
  },
  {
    id: 'barley',
    category: 'grains',
    label: { uz: 'Arpa', ru: 'Ячмень', en: 'Barley' },
    avgDays: 90, baseTemp: 4, allowedMonths: [2, 8, 9],
    growthSchedule: CEREAL_SCHEDULE // Uses same logic as wheat
  },
  {
    id: 'tomato_pink',
    category: 'vegetables',
    label: { uz: 'Pomidor (Pushti)', ru: 'Помидоры (Розовые)', en: 'Tomato (Pink)' },
    avgDays: 100, baseTemp: 12, allowedMonths: [2, 3, 4],
    growthSchedule: TOMATO_SCHEDULE
  },
  // Fallbacks for others to prevent errors
  {
    id: 'rice_laser',
    category: 'grains',
    label: { uz: 'Guruch (Lazerniy)', ru: 'Рис (Лазер)', en: 'Rice (Laser)' },
    avgDays: 115, baseTemp: 13, allowedMonths: [4, 5, 6],
    growthSchedule: []
  }
];
