import { MarketItem, MarketCategory, KhorezmDistrict, NewsArticle } from '../types';

export const INITIAL_MARKET_ITEMS: MarketItem[] = [
  {
    id: '1',
    title: 'Cotton Seeds (Khorezm-12)',
    price: 4500,
    currency: 'UZS/kg',
    category: MarketCategory.SEEDS,
    imageUrl: 'https://picsum.photos/300/200?random=1',
    location: KhorezmDistrict.SHAVAT,
    sellerName: 'AgroSeeds Shavat',
    sellerContact: { phone: '+998901234567', telegram: 'agroseeds' },
    verified: true,
    datePosted: '2023-10-01'
  },
  {
    id: '2',
    title: 'Ammonium Nitrate (Azot)',
    price: 120000,
    currency: 'UZS/bag',
    category: MarketCategory.FERTILIZER,
    imageUrl: 'https://picsum.photos/300/200?random=2',
    location: KhorezmDistrict.URGENCH_CITY,
    sellerName: 'Urgench Chim',
    sellerContact: { phone: '+998912345678' },
    verified: true,
    datePosted: '2023-10-05'
  },
  {
    id: '3',
    title: 'Used Tractor MTZ-80',
    price: 85000000,
    currency: 'UZS',
    category: MarketCategory.MACHINERY,
    imageUrl: 'https://picsum.photos/300/200?random=3',
    location: KhorezmDistrict.GURLEN,
    sellerName: 'Gurlen Mash',
    sellerContact: { phone: '+998931112233', telegram: 'tractor_uz' },
    verified: false,
    datePosted: '2023-10-08'
  },
  {
    id: '4',
    title: 'Drip Irrigation Pipe',
    price: 1200,
    currency: 'UZS/m',
    category: MarketCategory.TOOLS,
    imageUrl: 'https://picsum.photos/300/200?random=4',
    location: KhorezmDistrict.YANGIARYK,
    sellerName: 'WaterMaster',
    sellerContact: { phone: '+998998887766' },
    verified: true,
    datePosted: '2023-10-10'
  }
];

export const INITIAL_NEWS: NewsArticle[] = [
    {
        id: '1',
        title: 'Subsidies for Drip Irrigation Increased',
        content: 'The government has announced a 30% subsidy increase for farmers installing drip irrigation systems in Khorezm region to combat salinity.',
        date: '2023-10-12',
        image: 'https://picsum.photos/400/200?random=10',
        author: 'Ministry of Agriculture'
    },
    {
        id: '2',
        title: 'New Cotton Variety "Xorazm-127" Released',
        content: 'Scientists have developed a new salt-tolerant cotton variety specifically for the Amudarya districts.',
        date: '2023-10-08',
        image: 'https://picsum.photos/400/200?random=11',
        author: 'Agro Science Center'
    }
];