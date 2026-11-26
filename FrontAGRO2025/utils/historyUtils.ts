
export interface ActivityLog {
    id: string;
    type: 'scan' | 'market' | 'chat' | 'system' | 'login';
    action: string;
    detail: string;
    timestamp: number;
}

const HISTORY_KEY = 'agronomai_user_history_v1';

export const logUserAction = (
    type: ActivityLog['type'], 
    action: string, 
    detail: string = ''
) => {
    try {
        const newLog: ActivityLog = {
            id: Date.now().toString(),
            type,
            action,
            detail,
            timestamp: Date.now()
        };

        const existing = localStorage.getItem(HISTORY_KEY);
        const history: ActivityLog[] = existing ? JSON.parse(existing) : [];
        
        // Prepend new log and limit to 50 items
        const updated = [newLog, ...history].slice(0, 50);
        
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    } catch (error) {
        console.error("Failed to log activity:", error);
    }
};

export const getUserHistory = (): ActivityLog[] => {
    try {
        const existing = localStorage.getItem(HISTORY_KEY);
        return existing ? JSON.parse(existing) : [];
    } catch (error) {
        console.error("Failed to retrieve history:", error);
        return [];
    }
};

export const clearUserHistory = () => {
    localStorage.removeItem(HISTORY_KEY);
};
