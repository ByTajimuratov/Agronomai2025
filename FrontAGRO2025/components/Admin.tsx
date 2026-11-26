
import React, { useState } from 'react';
import { useGlobal } from '../store/GlobalStore';
import { Users, DollarSign, Activity, Lock, Delete } from 'lucide-react';
import { KhorezmDistrict } from '../types';

export const Admin: React.FC = () => {
  const { t } = useGlobal();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handlePinPress = (num: string) => {
    if (pin.length < 6) {
        setPin(prev => prev + num);
        setError('');
    }
  };

  const handleDelete = () => {
      setPin(prev => prev.slice(0, -1));
  };

  const handleSubmit = () => {
      if (pin === '199109') { // Independence Day code
          setIsAuthenticated(true);
      } else {
          setError('INVALID PIN');
          setPin('');
      }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6">
        <div className="mb-8 text-center">
            <Lock className="w-12 h-12 text-red-500 mx-auto mb-2" />
            <h2 className="text-white text-xl font-mono tracking-widest">ADMIN XORAZM CONTROL</h2>
        </div>

        <div className="bg-slate-800 p-6 rounded-2xl w-full max-w-xs border border-slate-700 shadow-2xl">
          <div className="mb-6 h-12 bg-slate-900 rounded-lg border border-slate-600 flex items-center justify-center text-white text-2xl font-mono tracking-[1em]">
              {pin.split('').map(() => '•').join('')}
          </div>
          {error && <p className="text-red-500 text-xs text-center mb-4 font-mono">{error}</p>}
          
          <div className="grid grid-cols-3 gap-3">
              {[1,2,3,4,5,6,7,8,9].map(n => (
                  <button key={n} onClick={() => handlePinPress(n.toString())} className="h-14 rounded-lg bg-slate-700 text-white text-xl font-bold active:bg-slate-600 transition-colors shadow-md border-b-4 border-slate-900 active:border-b-0 active:mt-1">
                      {n}
                  </button>
              ))}
              <button className="h-14 flex items-center justify-center rounded-lg bg-red-900/50 text-red-400" onClick={handleDelete}><Delete className="w-6 h-6" /></button>
              <button onClick={() => handlePinPress('0')} className="h-14 rounded-lg bg-slate-700 text-white text-xl font-bold active:bg-slate-600 border-b-4 border-slate-900 active:border-b-0 active:mt-1">0</button>
              <button onClick={handleSubmit} className="h-14 rounded-lg bg-green-600 text-white text-xl font-bold active:bg-green-700 border-b-4 border-green-800 active:border-b-0 active:mt-1">GO</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <header className="bg-slate-900 text-white p-6 pb-12">
        <div className="flex justify-between items-center">
            <h1 className="text-xl font-mono font-bold text-green-400">XORAZM_GRID_V1</h1>
            <div className="px-2 py-1 bg-green-900 text-green-400 border border-green-700 rounded text-[10px] font-bold animate-pulse">SYSTEM SECURE</div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 -mt-8">
        {/* Heatmap Simulation */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
            <h3 className="text-xs font-bold text-gray-500 uppercase mb-4">District Activity Heatmap</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {Object.values(KhorezmDistrict).map(d => (
                    <div key={d} className="flex justify-between items-center p-2 bg-gray-50 rounded border">
                        <span className="text-xs font-bold text-gray-700">{d}</span>
                        <div className={`w-3 h-3 rounded-full ${Math.random() > 0.5 ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                    </div>
                ))}
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-800 text-white p-6 rounded-xl shadow-lg flex items-center gap-4">
             <Users className="w-8 h-8 text-blue-400" />
             <div>
               <p className="text-slate-400 text-xs">ACTIVE FARMERS</p>
               <h3 className="text-2xl font-bold font-mono">1,240</h3>
             </div>
          </div>
          <div className="bg-slate-800 text-white p-6 rounded-xl shadow-lg flex items-center gap-4">
             <DollarSign className="w-8 h-8 text-green-400" />
             <div>
               <p className="text-slate-400 text-xs">MRR (UZS)</p>
               <h3 className="text-2xl font-bold font-mono">8.5M</h3>
             </div>
          </div>
          <div className="bg-slate-800 text-white p-6 rounded-xl shadow-lg flex items-center gap-4">
             <Activity className="w-8 h-8 text-purple-400" />
             <div>
               <p className="text-slate-400 text-xs">AI REQUESTS (24H)</p>
               <h3 className="text-2xl font-bold font-mono">3,892</h3>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
