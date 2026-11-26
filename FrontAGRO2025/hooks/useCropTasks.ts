
import { useMemo } from 'react';
import { differenceInCalendarDays } from 'date-fns';
import { CropData } from '../types';
import { useGlobal } from '../store/GlobalStore';
import { AppLanguage } from '../types';

export const useCropTasks = (cropData: CropData, sowingDateString: string) => {
    const { language } = useGlobal();
    const currentLang = language || AppLanguage.EN;

    // 2. Calculate State
    const calculation = useMemo(() => {
        if (!cropData || !sowingDateString) return null;

        const sowingDate = new Date(sowingDateString);
        const today = new Date();
        
        // Day Calculation
        const daysElapsed = differenceInCalendarDays(today, sowingDate);
        const isFuture = daysElapsed < 0;

        // 3. Find Active Stage
        // Logic: Stage is active if Today is between Start and End (Inclusive)
        const currentStage = cropData.growthSchedule?.find(
            stage => daysElapsed >= stage.dayStart && daysElapsed <= stage.dayEnd
        );

        // 4. Progress
        const totalDays = cropData.avgDays || 100;
        const progress = Math.min(100, Math.max(0, (daysElapsed / totalDays) * 100));

        return {
            daysElapsed,
            isFuture,
            currentStage,
            currentTasks: currentStage?.tasks || [], 
            progress,
            totalDays
        };
    }, [cropData, sowingDateString]);

    return {
        cropData,
        ...calculation
    };
};
