
import { useGlobal } from '../store/GlobalStore';
import { CloudSnow, CloudRain, Sun, Leaf } from 'lucide-react';

export type SeasonType = 'winter' | 'spring' | 'summer' | 'autumn';

export const useSeason = () => {
    const { t } = useGlobal();
    const month = new Date().getMonth(); // 0-11

    let season: SeasonType = 'winter';
    let themeGradient = 'bg-gradient-to-br from-blue-700 via-blue-800 to-slate-900';
    let icon = CloudSnow;
    let greetingKey = 'season_winter_greet';

    // Logic for Khorezm Seasons
    if (month >= 2 && month <= 4) {
        season = 'spring';
        themeGradient = 'bg-gradient-to-br from-emerald-500 via-green-600 to-teal-700';
        icon = Leaf;
        greetingKey = 'season_spring_greet';
    } else if (month >= 5 && month <= 7) {
        season = 'summer';
        themeGradient = 'bg-gradient-to-br from-amber-400 via-orange-500 to-red-500';
        icon = Sun;
        greetingKey = 'season_summer_greet';
    } else if (month >= 8 && month <= 10) {
        season = 'autumn';
        themeGradient = 'bg-gradient-to-br from-yellow-600 via-amber-700 to-brown-800'; // Note: Tailwind default colors might not have 'brown', usually amber-900
        themeGradient = 'bg-gradient-to-br from-amber-600 via-orange-700 to-stone-800';
        icon = CloudRain;
        greetingKey = 'season_autumn_greet';
    }

    return {
        season,
        themeGradient,
        Icon: icon,
        greeting: t(greetingKey)
    };
};
