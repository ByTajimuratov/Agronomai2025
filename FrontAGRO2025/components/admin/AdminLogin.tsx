
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // In a real Vite app, we use import.meta.env.VITE_ADMIN_PASSCODE
  // For this demo, we fallback to the hardcoded AGRO2025 if env is missing.
  const SECRET_KEY = 'AGRO2025'; 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passcode === SECRET_KEY) {
      sessionStorage.setItem('isAdmin', 'true');
      navigate('/admin/dashboard');
    } else {
      setError('Invalid Access Key. Incident reported.');
      setPasscode('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl border border-slate-700">
            <ShieldCheck className="w-10 h-10 text-agrogreen-500" />
          </div>
          <h1 className="text-3xl font-bold text-white font-mono tracking-tighter">AGRONOM.AI</h1>
          <p className="text-slate-400 text-sm uppercase tracking-[0.2em] mt-2">Administrative Access</p>
        </div>

        <div className="bg-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Access Key</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                <input 
                  type="password" 
                  value={passcode}
                  onChange={(e) => { setPasscode(e.target.value); setError(''); }}
                  className="w-full bg-slate-900 border border-slate-600 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-agrogreen-500 focus:ring-1 focus:ring-agrogreen-500 transition-all font-mono"
                  placeholder="ENTER-PASSCODE"
                  autoFocus
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 bg-red-900/20 p-3 rounded-lg border border-red-900/50">
                <AlertCircle className="w-4 h-4" />
                <span className="text-xs font-mono">{error}</span>
              </div>
            )}

            <button 
              type="submit" 
              className="w-full bg-agrogreen-600 hover:bg-agrogreen-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-agrogreen-900/20"
            >
              AUTHENTICATE <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
        
        <div className="text-center mt-8">
            <p className="text-slate-600 text-xs font-mono">SECURE CONNECTION • v2.4.0</p>
        </div>
      </div>
    </div>
  );
};