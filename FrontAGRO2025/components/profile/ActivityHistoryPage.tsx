
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobal } from '../../store/GlobalStore';
import { getUserHistory, clearUserHistory, ActivityLog } from '../../utils/historyUtils';
import { 
    ChevronLeft, 
    ScanLine, 
    ShoppingBag, 
    MessageCircle, 
    LogIn, 
    Sprout, 
    Calendar, 
    Trash2,
    Settings,
    Info
} from 'lucide-react';

export const ActivityHistoryPage: React.FC = () => {
    const navigate = useNavigate();
    const { t, formatDateLoc } = useGlobal();
    const [history, setHistory] = useState<ActivityLog[]>([]);

    useEffect(() => {
        const data = getUserHistory();
        setHistory(data);
    }, []);

    const handleClear = () => {
        if (confirm("Are you sure you want to clear your activity history?")) {
            clearUserHistory();
            setHistory([]);
        }
    };

    // Helper to get style config based on type
    const getTypeConfig = (type: ActivityLog['type']) => {
        switch (type) {
            case 'scan':
                return { icon: ScanLine, color: 'text-blue-500 bg-blue-50 border-blue-100' };
            case 'market':
                return { icon: ShoppingBag, color: 'text-amber-500 bg-amber-50 border-amber-100' };
            case 'chat':
                return { icon: MessageCircle, color: 'text-purple-500 bg-purple-50 border-purple-100' };
            case 'system':
                return { icon: Settings, color: 'text-gray-500 bg-gray-50 border-gray-200' };
            case 'login':
                return { icon: LogIn, color: 'text-emerald-500 bg-emerald-50 border-emerald-100' };
            default:
                return { icon: Info, color: 'text-gray-500 bg-gray-50 border-gray-200' };
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-20 transition-colors duration-300">
            {/* Header */}
            <div className="bg-white dark:bg-slate-800 sticky top-0 z-10 px-4 py-4 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-2 bg-gray-100 dark:bg-slate-700 rounded-full hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors">
                        <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t('history_title')}</h1>
                </div>
                {history.length > 0 && (
                    <button onClick={handleClear} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
                        <Trash2 className="w-5 h-5" />
                    </button>
                )}
            </div>

            <div className="p-6 max-w-lg mx-auto">
                {history.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Calendar className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">{t('history_empty')}</p>
                    </div>
                ) : (
                    <div className="relative border-l-2 border-gray-200 dark:border-slate-700 ml-4 space-y-8">
                        {history.map((item, index) => {
                            const { icon: Icon, color } = getTypeConfig(item.type);
                            const dateStr = formatDateLoc(item.timestamp);
                            const timeStr = new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                            return (
                                <div key={item.id} className="relative pl-8 group animate-in slide-in-from-bottom-2" style={{ animationDelay: `${index * 50}ms` }}>
                                    {/* Dot on timeline */}
                                    <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 shadow-sm ring-1 ring-gray-200 dark:ring-slate-700 ${index === 0 ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-slate-600'}`}></div>
                                    
                                    <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm flex gap-4 items-start group-hover:shadow-md transition-all">
                                        <div className={`p-3 rounded-xl shrink-0 border ${color} bg-opacity-20 dark:bg-opacity-10`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-gray-800 dark:text-white text-sm">{item.action}</h4>
                                                <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold bg-gray-50 dark:bg-slate-700 px-2 py-1 rounded-full whitespace-nowrap">
                                                    {timeStr}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium line-clamp-2">{item.detail}</p>
                                            <p className="text-[10px] text-gray-400 dark:text-gray-600 mt-2">{dateStr}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {history.length > 0 && (
                    <div className="mt-8 text-center">
                        <button className="text-emerald-600 dark:text-emerald-400 font-bold text-sm flex items-center justify-center gap-2 hover:bg-emerald-50 dark:hover:bg-slate-800 px-4 py-2 rounded-lg transition-colors mx-auto">
                            <Calendar className="w-4 h-4" /> {t('history_load_more')}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
