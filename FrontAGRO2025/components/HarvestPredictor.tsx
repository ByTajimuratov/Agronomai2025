
import React, { useState } from 'react';
import { useGlobal } from '../store/GlobalStore';
import { useHarvestPrediction } from '../features/harvest/useHarvestPrediction';
import { CropType } from '../types';
import { Sprout, ThermometerSun, Loader2, BarChart3 } from 'lucide-react';
import { FeatureGuard } from './common/FeatureGuard';

export const HarvestPredictor: React.FC = () => {
  const { t } = useGlobal();
  const { loading, result, calculateHarvest, crops } = useHarvestPrediction();

  const [selectedCrop, setSelectedCrop] = useState<CropType>(CropType.COTTON_KHOREZM_12);
  const [sowingDate, setSowingDate] = useState('');

  return (
    <FeatureGuard featureId="calendar">
        <div className="p-4 pb-24">
        <div className="flex items-center gap-3 mb-6">
            <div className="bg-agrogreen-100 p-3 rounded-xl">
                <BarChart3 className="w-6 h-6 text-agrogreen-700" />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-gray-900">{t('harvestPredictor')}</h2>
                <p className="text-xs text-gray-500">{t('gddExplanation')}</p>
            </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-6">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{t('selectCrop')}</label>
                    <div className="grid grid-cols-1 gap-2">
                        <select 
                            className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 outline-none focus:ring-2 focus:ring-agrogreen-500"
                            value={selectedCrop}
                            onChange={(e) => setSelectedCrop(e.target.value as CropType)}
                        >
                            {crops.map(c => (
                                <option key={c.id} value={c.name}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{t('sowingDate')}</label>
                    <input 
                        type="date" 
                        className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 outline-none focus:ring-2 focus:ring-agrogreen-500"
                        value={sowingDate}
                        onChange={(e) => setSowingDate(e.target.value)}
                    />
                </div>

                <button 
                    onClick={() => sowingDate && calculateHarvest(selectedCrop, sowingDate)}
                    disabled={loading || !sowingDate}
                    className="w-full bg-agrogreen-600 text-white py-4 rounded-xl font-bold shadow-md hover:bg-agrogreen-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sprout className="w-5 h-5" />}
                    {t('calculate')}
                </button>
            </div>
        </div>

        {result && (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-in slide-in-from-bottom-4 duration-700">
                <div className="bg-gray-900 p-6 text-white">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">{t('estHarvest')}</p>
                            <h3 className="text-3xl font-mono font-bold text-green-400">{result.harvestDate}</h3>
                        </div>
                        <div className="text-right">
                            <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">{t('daysRemaining')}</p>
                            <h3 className="text-2xl font-bold">{result.daysRemaining > 0 ? result.daysRemaining : 'Done'}</h3>
                        </div>
                    </div>
                    
                    {/* Visual Gauge */}
                    <div className="relative pt-6 pb-2">
                        <div className="h-3 bg-gray-700 rounded-full w-full overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-green-500 to-yellow-400 transition-all duration-1000 ease-out"
                                style={{ width: `${result.progress}%` }}
                            ></div>
                        </div>
                        {/* Pins */}
                        <div className="absolute top-1 left-0 -translate-x-1/2 flex flex-col items-center">
                            <div className="w-3 h-3 bg-gray-500 rounded-full border-2 border-gray-900"></div>
                            <span className="text-[10px] text-gray-400 mt-1">Sowing</span>
                        </div>
                        <div 
                            className="absolute top-0 -translate-x-1/2 flex flex-col items-center transition-all duration-1000"
                            style={{ left: `${result.progress}%` }}
                        >
                            <div className="w-4 h-4 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] border-2 border-green-500 mb-1"></div>
                            <span className="bg-green-600 text-white text-[10px] px-2 py-0.5 rounded-full">Today</span>
                        </div>
                        <div className="absolute top-1 right-0 translate-x-1/2 flex flex-col items-center">
                            <div className="w-3 h-3 bg-yellow-400 rounded-full border-2 border-gray-900"></div>
                            <span className="text-[10px] text-yellow-400 mt-1">Harvest</span>
                        </div>
                    </div>
                </div>
                
                <div className="p-4 grid grid-cols-2 divide-x">
                    <div className="px-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                            <ThermometerSun className="w-5 h-5 text-amber-500" />
                            <span className="text-2xl font-bold text-gray-800">{result.accumulatedGDD}</span>
                            <span className="text-[10px] text-gray-500 uppercase">{t('accumulatedGdd')}</span>
                        </div>
                    </div>
                    <div className="px-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                            <div className="w-5 h-5 rounded-full border-2 border-green-500 flex items-center justify-center">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            </div>
                            <span className="text-2xl font-bold text-gray-800">{Math.round(result.progress)}%</span>
                            <span className="text-[10px] text-gray-500 uppercase">{t('maturityProgress')}</span>
                        </div>
                    </div>
                </div>
            </div>
        )}
        </div>
    </FeatureGuard>
  );
};
