
import { useGlobal } from '../store/GlobalStore';
import { useSubscription } from '../features/subscription/useSubscription';
import { useCoins } from '../contexts/CoinContext';

export const useFeatureAccess = (featureId: string) => {
    const { user } = useGlobal();
    const { isPremium } = useSubscription(user);
    const { isFeatureUnlocked } = useCoins();

    // 1. Check Coin Unlock (Timestamp based)
    const unlockedViaCoins = isFeatureUnlocked(featureId);

    // 2. Grant access if Premium OR Unlocked via Coins
    // This is the SINGLE point of logic for the entire app.
    const hasAccess = isPremium || unlockedViaCoins;

    return { 
        hasAccess, 
        isPremium, 
        unlockedViaCoins 
    };
};
