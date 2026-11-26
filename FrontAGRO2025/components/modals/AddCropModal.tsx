
import React, { useState, useEffect } from 'react';
import { useGlobal } from '../../store/GlobalStore';
import { AppLanguage } from '../../types';
import { X, Calendar, ArrowRight, Bot, Loader2, Search, Sprout, AlertCircle } from 'lucide-react';
import { generateGrowthPlan } from '../../services/geminiService';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const AddCropModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const { t, addCrop, addToast } = useGlobal();
    
    // Form State
    const [cropName, setCropName] = useState('');
    const [formDate, setFormDate] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // Reset when opening
    useEffect(() => {
        if(isOpen) {
            setCropName('');
            setFormDate(new Date().toISOString().split('T')[0]); // Default to today
            setIsLoading(false);
        }
    }, [isOpen]);

    const handleSubmit = async () => {
        if (!cropName || !formDate) return;

        setIsLoading(true);
        
        try {
            // 1. Generate Custom Plan via Gemini
            const generatedCropData = await generateGrowthPlan(cropName);
            
            if (generatedCropData) {
                // 2. Save to Store
                addCrop(generatedCropData, formDate);
                onClose();
            } else {
                addToast("Failed to generate plan. Try a different name.", 'error');
            }
        } catch (error) {
            addToast("Connection error. Please try again.", 'error');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white w-full max-w-md rounded-t-3xl md:rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-10 md:zoom-in-95 flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">{t('addMyCrop')}</h3>
                    <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Input Section */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Crop Name</label>
                            <div className="relative">
                                <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                <input 
                                    type="text"
                                    className="w-full pl-12 p-4 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none font-medium placeholder-gray-400"
                                    placeholder="e.g. Strawberry, Basil, Corn..."
                                    value={cropName}
                                    onChange={(e) => setCropName(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                            <p className="text-[10px] text-emerald-600 mt-2 ml-1 flex items-center gap-1">
                                <Bot className="w-3 h-3" /> AI will generate a custom schedule for Khorezm.
                            </p>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('sowingDate')}</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                                <input 
                                    type="date" 
                                    className="w-full pl-12 p-4 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
                                    value={formDate}
                                    onChange={(e) => setFormDate(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                    </div>

                    {/* AI Loading State */}
                    {isLoading ? (
                        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 text-center animate-pulse">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                                <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
                            </div>
                            <h4 className="font-bold text-emerald-800 text-sm">Analyzing Crop...</h4>
                            <p className="text-xs text-emerald-600 mt-1">Generating localized growth plan for Khorezm soil.</p>
                        </div>
                    ) : (
                        <button 
                            onClick={handleSubmit}
                            disabled={!cropName || !formDate}
                            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 active:scale-95"
                        >
                            Generate & Track <ArrowRight className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
