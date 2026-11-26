
import React from 'react';
import { useGlobal } from '../../store/GlobalStore';
import { AppLanguage } from '../../types';
import { Check, Globe, X } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const LanguageBottomSheet: React.FC<Props> = ({ isOpen, onClose }) => {
    const { language, setLanguage } = useGlobal();

    if (!isOpen) return null;

    const languages = [
        { code: AppLanguage.UZ, label: "O'zbekcha", flag: "🇺🇿" },
        { code: AppLanguage.RU, label: "Русский", flag: "🇷🇺" },
        { code: AppLanguage.EN, label: "English", flag: "🇺🇸" }
    ];

    const handleSelect = (code: AppLanguage) => {
        setLanguage(code);
        setTimeout(onClose, 300); // Small delay for visual feedback
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-end justify-center">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            ></div>

            {/* Sheet */}
            <div className="bg-white w-full max-w-md rounded-t-3xl shadow-2xl relative z-10 animate-in slide-in-from-bottom duration-300 flex flex-col max-h-[80vh]">
                <div className="p-4 flex items-center justify-center relative border-b border-gray-100">
                    <div className="w-12 h-1.5 bg-gray-300 rounded-full absolute top-3"></div>
                    <h3 className="text-lg font-bold text-gray-900 mt-4 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-emerald-600" />
                        Select Language / Tilni Tanlang
                    </h3>
                    <button 
                        onClick={onClose}
                        className="absolute right-4 top-5 p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="p-6 space-y-3 pb-10">
                    {languages.map((lang) => {
                        const isSelected = language === lang.code;
                        return (
                            <button
                                key={lang.code}
                                onClick={() => handleSelect(lang.code)}
                                className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                                    isSelected 
                                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-md' 
                                    : 'border-gray-100 bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                <div className="flex items-center gap-4">
                                    <span className="text-3xl drop-shadow-sm">{lang.flag}</span>
                                    <span className="font-bold text-lg">{lang.label}</span>
                                </div>
                                {isSelected && (
                                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-sm">
                                        <Check className="w-5 h-5 stroke-[3]" />
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
