import React, { useState, useRef } from 'react';
import { Camera, Upload, X, RefreshCw, Loader2, AlertTriangle, CheckCircle, Scan, BrainCircuit } from 'lucide-react';
// Biz yozgan servisni ulaymiz
import { analyzeLeafImage } from '../services/geminiService';
import { useGlobal } from '../store/GlobalStore';

export const LeafAnalysis: React.FC = () => {
  const { language } = useGlobal();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State (Holatlar)
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 1. Rasmni tanlash va ekranga chiqarish
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Fayl hajmini tekshirish (5MB dan oshmasligi kerak)
      if (file.size > 5 * 1024 * 1024) {
          alert("Rasm hajmi 5MB dan kichik bo'lishi kerak!");
          return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null); // Eski natijani tozalash
        setError(null);  // Eski xatoni tozalash
      };
      reader.readAsDataURL(file);
    }
  };

  // 2. Backendga yuborish va Tahlil qilish
  const handleAnalyze = async () => {
    if (!image) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Backendga so'rov yuborish
      const analysisResult = await analyzeLeafImage(image, language || 'uz');
      
      if (analysisResult) {
          setResult(analysisResult);
      } else {
          setError("Tahlil natijasi bo'sh keldi.");
      }
    } catch (err) {
      console.error(err);
      setError("Server bilan bog'lanishda xatolik yuz berdi. Internetni tekshiring.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Yangitdan boshlash
  const resetAnalysis = () => {
    setImage(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 p-4">
      {/* Header */}
      <h1 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center gap-2">
        <div className="p-2 bg-emerald-100 rounded-lg">
            <BrainCircuit className="w-6 h-6 text-emerald-600" />
        </div>
        Barg Diagnostikasi
      </h1>

      <div className="bg-white rounded-3xl shadow-lg shadow-emerald-900/10 border border-gray-100 overflow-hidden relative">
        
        {/* Rasm Yuklash Qismi */}
        {!image ? (
          <div 
            className="p-10 text-center cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-emerald-200 animate-pulse">
              <Camera className="w-10 h-10 text-emerald-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Rasmni yuklang</h3>
            <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">
                Kasallikni aniqlash uchun o'simlik bargini yaqindan va tiniq rasmga oling.
            </p>
            
            <button className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-emerald-500/20 active:scale-95 transition-transform">
                <Upload className="w-5 h-5 inline-block mr-2" />
                Rasmni Tanlash
            </button>
          </div>
        ) : (
          <div className="relative group">
            <img src={image} alt="Uploaded leaf" className="w-full h-80 object-cover" />
            
            {/* O'chirish tugmasi */}
            {!loading && !result && (
                <button 
                    onClick={resetAnalysis}
                    className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full backdrop-blur-md hover:bg-red-500 transition-colors z-10"
                >
                    <X className="w-5 h-5" />
                </button>
            )}

            {/* Loading Animatsiyasi */}
            {loading && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white z-20">
                    <div className="relative">
                        <Scan className="w-16 h-16 text-emerald-400 animate-pulse" />
                        <Loader2 className="w-16 h-16 text-white animate-spin absolute top-0 left-0 opacity-50" />
                    </div>
                    <p className="font-bold mt-4 text-lg tracking-wide animate-pulse">AI Tahlil Qilmoqda...</p>
                    <p className="text-sm text-emerald-200 mt-1">Iltimos kuting</p>
                </div>
            )}
          </div>
        )}

        <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*"
            onChange={handleImageSelect}
        />

        {/* Xatolik Xabari */}
        {error && (
            <div className="p-4 bg-red-50 border-t border-red-100 flex items-center gap-3 text-red-700">
                <AlertTriangle className="w-6 h-6 shrink-0" />
                <p className="text-sm font-medium">{error}</p>
            </div>
        )}

        {/* Analiz Tugmasi (Agar rasm bor va hali natija yo'q bo'lsa) */}
        {image && !loading && !result && (
            <div className="p-6 bg-white border-t border-gray-100">
                <button 
                    onClick={handleAnalyze}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                    <BrainCircuit className="w-6 h-6" /> Tahlilni Boshlash
                </button>
            </div>
        )}

        {/* Natija Oynasi */}
        {result && (
            <div className="p-6 bg-emerald-50/30 border-t border-emerald-100 animate-in slide-in-from-bottom-10 duration-500">
                <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                    <h3 className="text-xl font-bold text-gray-900">Tahlil Natijasi</h3>
                </div>
                
                <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                    {/* Markdown belgilarni (**) olib tashlash */}
                    {result.replace(/\*\*/g, '')}
                </div>

                <div className="mt-6">
                    <button 
                        onClick={resetAnalysis}
                        className="w-full border-2 border-emerald-600 text-emerald-700 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"
                    >
                        <RefreshCw className="w-5 h-5" /> Boshqa bargni tekshirish
                    </button>
                </div>
            </div>
        )}

      </div>
      
      {/* Maslahat */}
      {!image && (
        <div className="mt-6 bg-yellow-50 p-4 rounded-2xl border border-yellow-100 flex gap-3 items-start">
            <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
            <div className="text-xs text-yellow-800">
                <p className="font-bold mb-1">Eslatma:</p>
                Aniqroq natija olish uchun rasm yorug' joyda olingan bo'lishi va bargdagi kasallik yaqqol ko'rinishi kerak.
            </div>
        </div>
      )}
    </div>
  );
};