
import { useState, useEffect } from 'react';

export interface AdCampaign {
    id: number;
    title: string;
    sponsor: string;
    reward: number;
    duration: number; // seconds
    imageUrl: string;
}

const ADS_STORAGE_KEY = 'agronom_ads_v1';

const DEFAULT_ADS: AdCampaign[] = [
    {
        id: 1,
        title: "New Nitrogen Fertilizer",
        sponsor: "AgroKimyo",
        reward: 50,
        duration: 5,
        imageUrl: "https://picsum.photos/800/1200?random=99"
    },
    {
        id: 2,
        title: "John Deere Tractors 2025",
        sponsor: "AgroTech Mash",
        reward: 100,
        duration: 8,
        imageUrl: "https://picsum.photos/800/1200?random=98"
    }
];

export const useAdCampaigns = () => {
    const [ads, setAds] = useState<AdCampaign[]>(() => {
        const stored = localStorage.getItem(ADS_STORAGE_KEY);
        return stored ? JSON.parse(stored) : DEFAULT_ADS;
    });

    useEffect(() => {
        localStorage.setItem(ADS_STORAGE_KEY, JSON.stringify(ads));
    }, [ads]);

    const addAd = (ad: Omit<AdCampaign, 'id'>) => {
        const newAd = { ...ad, id: Date.now() };
        setAds(prev => [newAd, ...prev]);
    };

    const deleteAd = (id: number) => {
        setAds(prev => prev.filter(ad => ad.id !== id));
    };

    return { ads, addAd, deleteAd };
};
