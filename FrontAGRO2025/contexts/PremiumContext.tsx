
import React, { createContext, useContext, useState } from 'react';
import { SubscriptionModal } from '../components/SubscriptionModal';
import { useGlobal } from '../store/GlobalStore';
import { SubscriptionTier } from '../types';

interface PremiumContextType {
  openPremiumModal: () => void;
  closePremiumModal: () => void;
}

const PremiumContext = createContext<PremiumContextType | undefined>(undefined);

export const PremiumProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, setUser } = useGlobal();

  const openPremiumModal = () => setIsOpen(true);
  const closePremiumModal = () => setIsOpen(false);

  const handleUpgrade = () => {
    if (user) {
      setUser({ ...user, tier: SubscriptionTier.PREMIUM });
      closePremiumModal();
    }
  };

  return (
    <PremiumContext.Provider value={{ openPremiumModal, closePremiumModal }}>
      {children}
      <SubscriptionModal
        isOpen={isOpen}
        onClose={closePremiumModal}
        onUpgrade={handleUpgrade}
      />
    </PremiumContext.Provider>
  );
};

export const usePremium = () => {
  const context = useContext(PremiumContext);
  if (!context) {
    throw new Error("usePremium must be used within a PremiumProvider");
  }
  return context;
};
