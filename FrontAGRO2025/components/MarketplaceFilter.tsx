import React from 'react';
import { useGlobal } from '../store/GlobalStore';
import { Tractor, Sprout, Hammer, Wheat, Filter } from 'lucide-react';

interface Props {
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
}

export const MarketplaceFilter: React.FC<Props> = ({ activeCategory, onCategoryChange }) => {
  const { t } = useGlobal();

  // Backenddagi kategoriya nomlari bilan bir xil bo'lishi shart!
  const categories = [
      { id: 'All', label: 'Hammasi', icon: Filter },
      { id: 'Texnika', label: 'Texnika', icon: Tractor },
      { id: "O'g'itlar", label: "O'g'itlar", icon: Sprout },
      { id: "Urug'lar", label: "Urug'lar", icon: Wheat },
      { id: 'Asbob-uskunalar', label: 'Asboblar', icon: Hammer },
  ];

  return (
    <div className="mb-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
            {categories.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.id;
                
                return (
                    <button
                        key={cat.id}
                        onClick={() => onCategoryChange(cat.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${
                            isActive 
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/30' 
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                        <Icon className="w-4 h-4" />
                        {/* Tarjima bo'lsa tarjima qiladi, bo'lmasa labelni chiqaradi */}
                        {t(`cat_${cat.id}`) !== `cat_${cat.id}` ? t(`cat_${cat.id}`) : cat.label}
                    </button>
                );
            })}
        </div>
    </div>
  );
};