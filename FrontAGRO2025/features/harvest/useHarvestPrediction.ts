
import { useState } from 'react';
import { CropType, CropGDDData } from '../../types';
import { useGlobal } from '../../store/GlobalStore';

// Static Crop Data for Khorezm
const CROP_DB: Record<CropType, CropGDDData> = {
    [CropType.COTTON_KHOREZM_12]: {
        id: 'c1', name: CropType.COTTON_KHOREZM_12, baseTemp: 15, maturityGDD: 2400, optimalSowingWindow: 'April 10 - April 30'
    },
    [CropType.RICE_LAZERNIY]: {
        id: 'r1', name: CropType.RICE_LAZERNIY, baseTemp: 12, maturityGDD: 1400, optimalSowingWindow: 'June 1 - June 20'
    },
    [CropType.MELON_GURLAN]: {
        id: 'm1', name: CropType.MELON_GURLAN, baseTemp: 10, maturityGDD: 1100, optimalSowingWindow: 'April 15 - May 10'
    },
    [CropType.WHEAT_KUMA]: {
        id: 'w1', name: CropType.WHEAT_KUMA, baseTemp: 5, maturityGDD: 1900, optimalSowingWindow: 'October 1 - October 20'
    },
    [CropType.TOMATO_YUSUP]: {
        id: 't1', name: CropType.TOMATO_YUSUP, baseTemp: 10, maturityGDD: 1350, optimalSowingWindow: 'March 20 - April 10'
    }
};

// Mock Climate Data Generator for Khorezm (Approximate)
const getDailyTemp = (dayOfYear: number): { max: number, min: number } => {
    // Khorezm is hot. 
    // Peak ~Day 200 (July). Max 38C, Min 24C.
    // Winter ~Day 15 (Jan). Max 5C, Min -5C.
    const ampMax = (38 - 5) / 2;
    const meanMax = (38 + 5) / 2;
    const ampMin = (24 - (-5)) / 2;
    const meanMin = (24 + (-5)) / 2;

    const max = meanMax + ampMax * Math.sin(((dayOfYear - 100) / 365) * 2 * Math.PI);
    const min = meanMin + ampMin * Math.sin(((dayOfYear - 100) / 365) * 2 * Math.PI);
    
    return { max, min };
};

export const useHarvestPrediction = () => {
    const { formatDateLoc } = useGlobal();
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{
        harvestDate: string;
        harvestDateObj: Date;
        accumulatedGDD: number;
        progress: number; // 0-100
        daysRemaining: number;
    } | null>(null);

    const calculateHarvest = async (cropType: CropType, sowingDateStr: string) => {
        setLoading(true);
        
        // Simulate calculation delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const crop = CROP_DB[cropType];
        const sowingDate = new Date(sowingDateStr);
        let currentGDD = 0;
        let daysPassed = 0;
        const today = new Date();
        
        // Clone date to iterate
        let simDate = new Date(sowingDate);

        // Iterate forward until GDD met
        while (currentGDD < crop.maturityGDD && daysPassed < 300) { // Cap at 300 days to prevent loops
            const start = new Date(sowingDate.getFullYear(), 0, 0);
            const diff = simDate.getTime() - start.getTime();
            const oneDay = 1000 * 60 * 60 * 24;
            const dayOfYear = Math.floor(diff / oneDay);

            const { max, min } = getDailyTemp(dayOfYear);
            
            // GDD Formula: ((Max + Min) / 2) - Base
            let dailyGDD = ((max + min) / 2) - crop.baseTemp;
            if (dailyGDD < 0) dailyGDD = 0; // No growth if too cold

            currentGDD += dailyGDD;
            daysPassed++;
            simDate.setDate(simDate.getDate() + 1);
        }

        const harvestDate = simDate;
        const msPerDay = 1000 * 60 * 60 * 24;
        const daysRemaining = Math.ceil((harvestDate.getTime() - today.getTime()) / msPerDay);
        
        // Calculate progress based on TODAY
        let todayGDD = 0;
        let checkDate = new Date(sowingDate);
        while (checkDate < today && checkDate < harvestDate) {
             const start = new Date(sowingDate.getFullYear(), 0, 0);
             const diff = checkDate.getTime() - start.getTime();
             const dayOfYear = Math.floor(diff / msPerDay);
             const { max, min } = getDailyTemp(dayOfYear);
             let dailyGDD = ((max + min) / 2) - crop.baseTemp;
             if (dailyGDD < 0) dailyGDD = 0;
             todayGDD += dailyGDD;
             checkDate.setDate(checkDate.getDate() + 1);
        }
        
        const progress = Math.min(100, Math.max(0, (todayGDD / crop.maturityGDD) * 100));

        setResult({
            harvestDate: formatDateLoc(harvestDate),
            harvestDateObj: harvestDate,
            accumulatedGDD: Math.round(todayGDD),
            progress,
            daysRemaining
        });
        setLoading(false);
    };

    return {
        loading,
        result,
        calculateHarvest,
        crops: Object.values(CROP_DB)
    };
};
