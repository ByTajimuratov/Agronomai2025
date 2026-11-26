
import React, { createContext, useContext, useState, useEffect } from 'react';

export type ActivityType = 'gpt' | 'scan' | 'market';

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  timestamp: number;
  route: string;
  details?: any; // Stores dynamic payload (e.g., Q&A, Scan Result)
}

interface ActivityContextType {
  activities: Activity[];
  logActivity: (type: ActivityType, title: string, route: string, details?: any) => void;
  clearActivities: () => void;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

const ACTIVITY_STORAGE_KEY = 'agronom_user_activity_v3'; // Bumped version

export const ActivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activities, setActivities] = useState<Activity[]>(() => {
    const stored = localStorage.getItem(ACTIVITY_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    try {
        localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(activities));
    } catch (e) {
        console.error("Storage quota exceeded, clearing old activities");
        // Fallback: keep only last 5 if quota full
        const minimal = activities.slice(0, 5);
        localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(minimal));
    }
  }, [activities]);

  const logActivity = (type: ActivityType, title: string, route: string, details?: any) => {
    const newActivity: Activity = {
      id: Date.now().toString(),
      type,
      title,
      timestamp: Date.now(),
      route,
      details
    };

    setActivities(prev => {
      // Add new item to top, keep only last 20 to save LocalStorage space
      const updated = [newActivity, ...prev].slice(0, 20);
      return updated;
    });
  };

  const clearActivities = () => {
    setActivities([]);
    localStorage.removeItem(ACTIVITY_STORAGE_KEY);
  };

  return (
    <ActivityContext.Provider value={{ activities, logActivity, clearActivities }}>
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivity = () => {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error("useActivity must be used within an ActivityProvider");
  }
  return context;
};
