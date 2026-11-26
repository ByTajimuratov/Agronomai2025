
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useGlobal } from '../store/GlobalStore';

interface CoinContextType {
  balance: number;
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  unlockFeature: (featureId: string, cost: number) => boolean;
  isFeatureUnlocked: (featureId: string) => boolean;
}

const CoinContext = createContext<CoinContextType | undefined>(undefined);

const COIN_STORAGE_KEY = 'agronom_coins_v1';
const UNLOCKED_FEATURES_KEY = 'agronom_unlocked_features_v1';

export const CoinProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { addToast } = useGlobal();
  
  // Balance State
  const [balance, setBalance] = useState<number>(() => {
    const stored = localStorage.getItem(COIN_STORAGE_KEY);
    return stored ? parseInt(stored, 10) : 0;
  });

  // Unlocked Features State: Record<FeatureID, ExpiryTimestamp>
  const [unlockedFeatures, setUnlockedFeatures] = useState<Record<string, number>>(() => {
      const stored = localStorage.getItem(UNLOCKED_FEATURES_KEY);
      return stored ? JSON.parse(stored) : {};
  });

  // Persistence for Unlocked Features
  useEffect(() => {
      localStorage.setItem(UNLOCKED_FEATURES_KEY, JSON.stringify(unlockedFeatures));
  }, [unlockedFeatures]);

  // Persistence for Balance (Backup)
  useEffect(() => {
    localStorage.setItem(COIN_STORAGE_KEY, balance.toString());
  }, [balance]);

  const addCoins = (amount: number) => {
    console.log("DEBUG: Adding coins:", amount);
    setBalance((prev) => {
        const newBalance = prev + amount;
        // Force immediate save to prevent race conditions
        localStorage.setItem(COIN_STORAGE_KEY, newBalance.toString());
        return newBalance;
    });
  };

  const spendCoins = (amount: number): boolean => {
    if (balance >= amount) {
      setBalance((prev) => {
          const newBalance = prev - amount;
          localStorage.setItem(COIN_STORAGE_KEY, newBalance.toString());
          return newBalance;
      });
      return true;
    }
    addToast("Mablag' yetarli emas! (Insufficient Coins)", 'error');
    return false;
  };

  // PART 2: Granular Unlock Logic - OPTIMISTIC UI UPDATE
  const unlockFeature = (featureId: string, cost: number): boolean => {
      // 1. Check if already unlocked
      if (isFeatureUnlocked(featureId)) return true;

      // 2. Check Balance & Deduct
      if (balance >= cost) {
          const expiry = Date.now() + (24 * 60 * 60 * 1000);

          // CRITICAL: Update React State IMMEDIATELY (Optimistic Update)
          setUnlockedFeatures(prev => {
              const updated = { ...prev, [featureId]: expiry };
              return updated;
          });

          setBalance((prev) => {
              const newBalance = prev - cost;
              return newBalance;
          });
          
          addToast("Feature unlocked for 24 hours!", 'success');
          return true;
      } else {
          addToast("Not enough coins to unlock this feature.", 'error');
          return false;
      }
  };

  const isFeatureUnlocked = (featureId: string): boolean => {
      const expiry = unlockedFeatures[featureId];
      if (!expiry) return false;
      if (Date.now() > expiry) return false;
      return true;
  };

  return (
    <CoinContext.Provider value={{ balance, addCoins, spendCoins, unlockFeature, isFeatureUnlocked }}>
      {children}
    </CoinContext.Provider>
  );
};

export const useCoins = () => {
  const context = useContext(CoinContext);
  if (!context) {
    throw new Error("useCoins must be used within a CoinProvider");
  }
  return context;
};
