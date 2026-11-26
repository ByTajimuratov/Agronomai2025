
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useActivity, Activity } from '../../contexts/ActivityContext';
import { ChevronLeft, Bot, ScanLine, ShoppingBag, Clock, Trash2, ChevronRight, X, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const RecentActivities: React.FC = () => {
    const navigate = useNavigate();
    const { activities, clearActivities } = useActivity();
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

    const getIcon = (type: string) => {
        switch(type) {
            case 'gpt': return <Bot className="w-5 h-5 text-purple-600" />;
            case 'scan': return <ScanLine className="w-5 h-5 text-emerald-600" />;
            case 'market': return <ShoppingBag className="w-5 h-5 text-amber-600" />;
            default: return <Clock className="w-5 h-5 text-gray-600" />;
        }
    };

    const getBgColor = (type: string) => {
        switch(type) {
            case 'gpt': return 'bg-purple-50 border-purple-100';
            case 'scan': return 'bg-emerald-50 border-emerald-100';
            case 'market': return 'bg-amber-50 border-amber-100';
            default: return 'bg-gray-50 border-gray-100';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white sticky top-0 z-10 px-4 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                        <ChevronLeft className="w-6 h-6 text-gray-700" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-900">Oxirgi amallar</h1>
                </div>
                {activities.length > 0 && (
                    <button onClick={clearActivities} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-5 h-5" />
                    </button>
                )}
            </div>

            <div className="p-4">
                {activities.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                        <Clock className="w-16 h-16 mb-4 text-gray-200" />
                        <p className="font-medium">Hozircha tarix bo'sh.</p>
                        <p className="text-xs text-gray-400 mt-1">Faoliyatingiz shu yerda saqlanadi.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {activities.map((item) => (
                            <div 
                                key={item.id}
                                onClick={() => setSelectedActivity(item)}
                                className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors active:scale-[0.99]"
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${getBgColor(item.type)}`}>
                                    {getIcon(item.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-gray-800 text-sm truncate pr-2">{item.title}</h4>
                                        <span className="text-[10px] text-gray-400 whitespace-nowrap">
                                            {formatDistanceToNow(item.timestamp, { addSuffix: true }).replace('about ', '')}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center mt-0.5">
                                        <p className="text-xs text-gray-500 capitalize">{item.type.replace('_', ' ')} Activity</p>
                                        {item.details && (
                                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                                                Ko'rish
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-300" />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* DETAILS MODAL */}
            {selectedActivity && (
                <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white w-full max-w-lg md:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 md:zoom-in-95 flex flex-col max-h-[85vh]">
                        <div className="flex justify-between items-center p-4 border-b border-gray-100">
                            <h3 className="font-bold text-gray-800">Activity Details</h3>
                            <button onClick={() => setSelectedActivity(null)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                                <X className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto bg-gray-50/50">
                            {/* GPT VIEW */}
                            {selectedActivity.type === 'gpt' && selectedActivity.details && (
                                <div className="space-y-4">
                                    <div className="flex gap-3 justify-end">
                                        <div className="bg-emerald-600 text-white p-3 rounded-2xl rounded-tr-none max-w-[85%] text-sm shadow-sm">
                                            {selectedActivity.details.question}
                                        </div>
                                        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                                            <User className="w-4 h-4 text-emerald-700" />
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
                                            <Bot className="w-4 h-4 text-purple-700" />
                                        </div>
                                        <div className="bg-white border border-gray-200 text-gray-800 p-4 rounded-2xl rounded-tl-none max-w-[90%] text-sm shadow-sm leading-relaxed whitespace-pre-wrap">
                                            {selectedActivity.details.answer}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* SCAN VIEW */}
                            {selectedActivity.type === 'scan' && selectedActivity.details && (
                                <div className="space-y-4">
                                    {selectedActivity.details.imagePreview && (
                                        <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                                            <img 
                                                src={selectedActivity.details.imagePreview} 
                                                alt="Scanned Leaf" 
                                                className="w-full h-48 object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                        <h4 className="font-bold text-gray-900 mb-2 flex items-center justify-between">
                                            <span>Result</span>
                                            <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                                                {selectedActivity.details.confidence}% Confidence
                                            </span>
                                        </h4>
                                        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                                            {selectedActivity.details.report || selectedActivity.details.disease}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* FALLBACK VIEW */}
                            {(!selectedActivity.details) && (
                                <div className="text-center py-10 text-gray-400">
                                    <p>No detailed data available for this activity.</p>
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-t border-gray-100 bg-white">
                            <button 
                                onClick={() => {
                                    navigate(selectedActivity.route);
                                    setSelectedActivity(null);
                                }}
                                className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800"
                            >
                                Go to Feature
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
