
import { SubscriptionTier, User } from '../../types';

interface SubscriptionState {
  isPremium: boolean;
  canAnalyze: boolean;
  canAccessWeather: boolean;
  canAccessChat: boolean;
  remainingFreeAnalysis: number;
}

export const useSubscription = (user: User | null): SubscriptionState => {
  if (!user) {
    return {
      isPremium: false,
      canAnalyze: false,
      canAccessWeather: false,
      canAccessChat: false,
      remainingFreeAnalysis: 0
    };
  }

  const isPremium = user.tier === SubscriptionTier.PREMIUM;
  const remainingFreeAnalysis = Math.max(0, 4 - user.analysisCount);

  return {
    isPremium,
    canAnalyze: isPremium || remainingFreeAnalysis > 0,
    canAccessWeather: isPremium,
    canAccessChat: isPremium, // Chat is premium only
    remainingFreeAnalysis
  };
};
