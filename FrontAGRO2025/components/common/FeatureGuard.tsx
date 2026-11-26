
import React, { useState } from 'react';
import { useFeatureAccess } from '../../hooks/useFeatureAccess';
import { UnlockFeatureModal } from '../modals/UnlockFeatureModal';
import { Lock, Crown } from 'lucide-react';
import { FeatureLock } from '../FeatureLock';

interface FeatureGuardProps {
    featureId: 'calendar' | 'gpt' | 'analysis'; // Restricted types to match FeatureLock
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export const FeatureGuard: React.FC<FeatureGuardProps> = ({ featureId, children, fallback }) => {
    const { hasAccess } = useFeatureAccess(featureId);
    
    // 1. If user has access (Premium or Coins), render content immediately.
    // This relies on the Optimistic Update in CoinContext to flip 'hasAccess' to true instantly.
    if (hasAccess) {
        return <>{children}</>;
    }

    // 2. If blocked, show Lock Screen (In-Place, NO REDIRECTS)
    // If a custom fallback is provided, use it. Otherwise, use the standard FeatureLock UI.
    if (fallback) return <>{fallback}</>;

    return <FeatureLock feature={featureId} />;
};
