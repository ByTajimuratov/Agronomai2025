
import React, { useState, useEffect } from 'react';
import { useGlobal } from '../store/GlobalStore';
import { AppLanguage, CropData } from '../types';
import { Sprout, Calendar, Trash2, CheckCircle, Plus, X, ArrowRight, Search, Loader2, Bot } from 'lucide-react';
import { differenceInCalendarDays, addDays } from 'date-fns';
import { generateGrowthPlan } from '../services/geminiService';

const STORAGE_KEY = 'agronomai_my_crop_v3';

interface SavedCropState {
  cropData: CropData;
  sowingDate: string;
}

export const MyCropsTracker: React.FC = () => {
  const { t, language, formatDateLoc, addToast } = useGlobal();
  const [savedCrop, setSavedCrop] = useState<SavedCropState | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [cropName, setCropName] = useState('');
  const [formDate, setFormDate] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSavedCrop(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse saved crop", e);
      }
    }
  }, []);

  const getCropName = (crop: CropData) => {
    const lang = language || AppLanguage.EN;
    return crop.label[lang];
  };

  const handleSave = async () => {
    if (!cropName || !formDate) return;
    
    setIsLoading(true);
    try {
        const cropData = await generateGrowthPlan(cropName);
        if (cropData) {
            const newState = { cropData, sowingDate: formDate };
            setSavedCrop(newState);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
            setIsModalOpen(false);
            setCropName('');
        } else {
            addToast("Could not generate plan. Try another crop name.", "error");
        }
    } catch (e) {
        addToast("Error connecting to AI service.", "error");
    } finally {
        setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (confirm(t('confirmReset'))) {
      setSavedCrop(null);
      localStorage.removeItem(STORAGE_KEY);
      setCropName('');
      setFormDate('');
    }
  };

  // --- CARD COMPONENT ---
  const CropCard = () => {
      if (!savedCrop) return null;
      const { cropData, sowingDate } = savedCrop;

      const sowingDateObj = new Date(sowingDate);
      const today = new Date();
      const harvestDateObj = addDays(sowingDateObj, cropData.avgDays);
      const daysPassed = differenceInCalendarDays(today, sowingDateObj);
      const progress = Math.min(100, Math.max(0, (daysPassed / cropData.avgDays) * 100));
      const isReady = progress >= 100;

      return (
        <div className="min-w-[280px] bg-white rounded-2xl p-5 shadow-sm border border-emerald-100 relative overflow-hidden group">
            <div className="flex justify-between items-start mb-3 relative z-10">
                <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <Sprout className="w-5 h-5" />
                     </div>
                     <div>
                        <h4 className="font-bold text-gray-900">{getCropName(cropData)}</h4>
                        <p className="text-xs text-gray-500">Sown: {formatDateLoc(sowingDateObj)}</p>
                     </div>
                </div>
                <button onClick={handleReset} className="text-gray-300 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            <div className="relative z-10">
                <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-gray-600">{daysPassed} {t('daysPassed')}</span>
                    <span className={isReady ? 'text-green-600' : 'text-emerald-600'}>{Math.round(progress)}%</span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                        className={`h-full rounded-full transition-all duration-1000 ${isReady ? 'bg-green-500' : 'bg-emerald-500'}`} 
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs font-medium text-gray-500 bg-gray-50 p-2 rounded-lg">
                    <CheckCircle className={`w-3 h-3 ${isReady ? 'text-green-500' : 'text-gray-400'}`} />
                    {isReady ? t('readyHarvest') : `${t('estHarvest')}: ${formatDateLoc(harvestDateObj)}`}
                </div>
            </div>
            
            {/* Decor */}
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-emerald-50 to-green-100 rounded-full opacity-50 blur-xl group-hover:opacity-70 transition-opacity"></div>
        </div>
      );
  };

  const AddCropCard = () => (
      <button 
        onClick={() => setIsModalOpen(true)}
        className="min-w-[100px] h-full min-h-[160px] bg-white rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all shadow-sm"
      >
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-white">
            <Plus className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold">{t('addMyCrop')}</span>
      </button>
  );

  return (
    <>
        {/* Horizontal Carousel */}
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
            {savedCrop ? <CropCard /> : <AddCropCard />}
            {savedCrop && (
                <div className="min-w-[260px] bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-5 text-white flex flex-col justify-center relative overflow-hidden">
                    <h4 className="font-bold text-lg relative z-10">Premium Stats</h4>
                    <p className="text-xs text-gray-400 relative z-10 mb-3">Detailed soil analysis & yield prediction.</p>
                    <button className="bg-white/10 backdrop-blur text-xs font-bold py-2 px-4 rounded-lg border border-white/20 relative z-10 w-fit">Upgrade</button>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl"></div>
                </div>
            )}
        </div>

        {/* Add Crop Modal */}
        {isModalOpen && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
                    <button 
                        onClick={() => setIsModalOpen(false)}
                        className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                    >
                        <X className="w-4 h-4 text-gray-600" />
                    </button>

                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Sprout className="w-8 h-8 text-emerald-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">{t('addMyCrop')}</h2>
                        <p className="text-sm text-gray-500">Track growth and get harvest dates.</p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Crop Name</label>
                            <div className="relative">
                                <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                <input 
                                    className="w-full pl-12 p-4 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none font-medium placeholder-gray-400"
                                    placeholder="e.g. Garlic, Wheat..."
                                    value={cropName}
                                    onChange={(e) => setCropName(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                            <p className="text-[10px] text-emerald-600 mt-1 ml-1 flex items-center gap-1">
                                <Bot className="w-3 h-3" /> AI generated schedule
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
                                    max={new Date().toISOString().split('T')[0]}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <button 
                            onClick={handleSave}
                            disabled={!cropName || !formDate || isLoading}
                            className="w-full py-4 rounded-xl bg-emerald-600 text-white font-bold text-lg shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" /> Generating...
                                </>
                            ) : (
                                <>
                                    {t('startTracking')} <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        )}
    </>
  );
};
