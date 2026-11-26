import React, { useState, useEffect } from 'react';
import { Search, MapPin, Phone, Filter, Plus, Loader2 } from 'lucide-react';
import { useGlobal } from '../store/GlobalStore'; 
import { useSearchParams } from 'react-router-dom';
import { MarketplaceFilter } from './MarketplaceFilter'; 
import { fetchProducts } from '../services/marketService';

// HAQIQIY MODALLARNI IMPORT QILAMIZ
import { CreateListingModal } from './modals/CreateListingModal';
import { CheckoutFlow } from './marketplace/CheckoutFlow';

// Backend URL manzili
const BACKEND_URL = "http://localhost:5000";
const PLACEHOLDER_IMAGE = "https://placehold.co/400x300?text=Rasm+Yoq";

export const Marketplace: React.FC = () => {
  // GlobalStore'dan kerakli funksiyalarni olamiz
  const { t, formatMoney } = useGlobal();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const categoryParam = searchParams.get('category') || 'All';
  const [searchTerm, setSearchTerm] = useState('');
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [checkoutItem, setCheckoutItem] = useState<any | null>(null);

  const loadData = async () => {
    try {
        setLoading(true);
        const data = await fetchProducts();
        setProducts(data);
    } catch (error) {
        console.error("Tovarlarni yuklashda xatolik:", error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [categoryParam]);

  const filteredItems = products.filter(item => 
    (categoryParam === 'All' || item.category === categoryParam) &&
    (item.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
     item.name?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCategoryChange = (cat: string) => {
      setSearchParams({ category: cat });
  };

  // 🔥 1. TELEFON QILISH FUNKSIYASI (Haqiqiy)
  const handleContact = (phone: string) => {
     if (phone) {
        window.location.href = `tel:${phone}`;
     } else {
        alert("Sotuvchi raqami ko'rsatilmagan");
     }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 pt-4 pb-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">{t('marketplace') || 'Bozor'}</h2>
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <Filter className="w-5 h-5 text-gray-600" />
            </div>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input 
                type="text" 
                placeholder={t('search') || 'Qidirish...'} 
                className="w-full pl-10 pr-4 py-3 bg-gray-100 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <MarketplaceFilter 
            activeCategory={categoryParam} 
            onCategoryChange={handleCategoryChange} 
          />
      </div>

      <div className="p-4">
          {loading ? (
              <div className="flex justify-center items-center py-20">
                  <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
              </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {filteredItems.map(item => (
                <div key={item._id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-lg transition-all group">
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                        <img 
                            src={item.image 
                                ? (item.image.startsWith('http') ? item.image : `${BACKEND_URL}${item.image}`) 
                                : PLACEHOLDER_IMAGE} 
                            alt={item.title} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                            onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE; }}
                        />
                        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-lg">
                            {item.category}
                        </div>
                    </div>
                    
                    <div className="p-4 flex-1 flex flex-col">
                        <h3 className="font-bold text-sm text-gray-900 leading-tight mb-1 line-clamp-1">{item.title || item.name}</h3>
                        
                        {/* 🔥 formatMoney dan foydalanamiz */}
                        <p className="text-emerald-700 font-black text-base mb-2">
                            {formatMoney(item.price)}
                        </p>
                        
                        <div className="flex items-center text-[10px] text-gray-400 mb-4">
                            <MapPin className="w-3 h-3 mr-1" />
                            {item.location || 'Xorazm viloyati'}
                        </div>

                        <div className="mt-auto flex gap-2">
                            {/* 🔥 Telefon tugmasi ulandi */}
                            <button 
                                onClick={() => handleContact(item.sellerPhone || "+998901234567")}
                                className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                            >
                                <Phone className="w-4 h-4" />
                            </button>
                            
                            {/* 🔥 CheckoutFlow ochish ulandi */}
                            <button 
                                onClick={() => setCheckoutItem(item)}
                                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
                            >
                                Sotib olish
                            </button>
                        </div>
                    </div>
                </div>
                ))}
            </div>
          )}
      </div>

      {/* FAB Button */}
      <button 
          onClick={() => setIsSellModalOpen(true)}
          className="fixed bottom-24 right-4 w-14 h-14 bg-emerald-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-emerald-700 hover:scale-110 transition-all z-30 group"
      >
          <Plus className="w-6 h-6 transition-transform group-hover:rotate-90" />
      </button>

      <CreateListingModal 
        isOpen={isSellModalOpen} 
        onClose={() => setIsSellModalOpen(false)} 
        onSuccess={() => { loadData(); setIsSellModalOpen(false); }}
      />

      {/* 🔥 HAQIQIY CHECKOUT FLOW MODALINI CHAQIRAMIZ */}
      {checkoutItem && (
        <CheckoutFlow 
            item={{
                id: checkoutItem._id,
                title: checkoutItem.title || checkoutItem.name,
                price: checkoutItem.price,
                imageUrl: checkoutItem.image.startsWith('http') ? checkoutItem.image : `${BACKEND_URL}${checkoutItem.image}`,
                sellerId: checkoutItem.sellerId,
                sellerName: checkoutItem.sellerName || "Sotuvchi"
            }} 
            isOpen={!!checkoutItem} 
            onClose={() => setCheckoutItem(null)} 
        />
      )}
    </div>
  );
};