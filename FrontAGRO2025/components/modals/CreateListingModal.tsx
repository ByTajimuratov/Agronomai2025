import React, { useState, useRef, useEffect } from 'react';
import { X, Camera, DollarSign, Tag, MapPin, AlignLeft, Package, Loader2 } from 'lucide-react';
import { createProduct } from '../../services/marketService';

// Xorazm tumanlari ro'yxati
const XORAZM_LOCATIONS = [
    "Urganch shahri", "Xiva shahri", "Urganch tumani", "Xiva tumani", 
    "Shovot tumani", "Gurlan tumani", "Qo'shko'pir tumani", "Bog'ot tumani", 
    "Yangiarik tumani", "Yangibozor tumani", "Xazorasp tumani", "Tuproqqal'a tumani"
];

export const CreateListingModal: React.FC<{isOpen: boolean, onClose: () => void, onSuccess?: () => void}> = ({ isOpen, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    
    // Boshlang'ich holat (Bo'sh forma)
    const initialState = {
        title: '',
        price: '',
        category: 'Texnika',
        description: '',
        location: XORAZM_LOCATIONS[0], // Birinchisini tanlab qo'yamiz
    };

    const [formData, setFormData] = useState(initialState);

    // Oyna yopilganda yoki ochilganda ma'lumotlarni tozalash mantiqi
    useEffect(() => {
        if (!isOpen) {
            setFormData(initialState);
            setPreview(null);
            setImageFile(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setPreview(URL.createObjectURL(file)); 
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!imageFile) return alert("Iltimos, rasm yuklang!");
        
        setLoading(true);
        try {
            const token = localStorage.getItem('token') || "";
            const data = new FormData();
            data.append('title', formData.title);
            data.append('price', formData.price);
            data.append('category', formData.category);
            data.append('description', formData.description);
            data.append('location', formData.location); // Tanlangan tuman
            data.append('image', imageFile); 

            await createProduct(data, token);
            alert("E'lon muvaffaqiyatli joylashtirildi!");
            
            onClose(); // Oynani yopish (useEffect o'zi hamma narsani tozalaydi)
            if (onSuccess) onSuccess();
        } catch (error) {
            alert("Xatolik yuz berdi!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
            <div className="bg-white w-full max-w-lg rounded-t-[32px] sm:rounded-[32px] p-6 shadow-2xl flex flex-col max-h-[90vh] animate-in slide-in-from-bottom duration-300">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-extrabold text-gray-900">Yangi e'lon joylash</h3>
                    <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"><X /></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-1 pb-4 custom-scrollbar">
                    
                    {/* Rasm qismi */}
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="relative w-full aspect-video bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center cursor-pointer overflow-hidden group hover:border-emerald-400 transition-all"
                    >
                        {preview ? (
                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex flex-col items-center text-gray-400">
                                <div className="p-3 bg-white rounded-2xl shadow-sm mb-2 group-hover:scale-110 transition-transform">
                                    <Camera className="w-8 h-8 text-emerald-500" />
                                </div>
                                <span className="text-sm font-bold">Rasm yuklash yoki rasmga olish</span>
                            </div>
                        )}
                        <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                    </div>

                    {/* Mahsulot nomi */}
                    <div className="space-y-3">
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 mb-1 block">Sarlavha</label>
                            <input required placeholder="Masalan: Qizil pomidor" className="w-full p-4 bg-gray-50 rounded-2xl outline-none border border-transparent focus:border-emerald-500 transition-all"
                                value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                            {/* Narxi */}
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 mb-1 block">Narxi (so'm)</label>
                                <input required type="number" placeholder="15 000" className="w-full p-4 bg-gray-50 rounded-2xl outline-none border border-transparent focus:border-emerald-500 transition-all"
                                    value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                            </div>
                            
                            {/* Kategoriya */}
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 mb-1 block">Kategoriya</label>
                                <select className="w-full p-4 bg-gray-50 rounded-2xl outline-none border border-transparent focus:border-emerald-500 cursor-pointer"
                                    value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                                    <option>Texnika</option>
                                    <option>O'g'itlar</option>
                                    <option>Urug'lar</option>
                                    <option>Asboblar</option>
                                </select>
                            </div>
                        </div>

                        {/* TUMANLAR RO'YXATI */}
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 mb-1 block">Xorazmning qaysi hududidan?</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-4 w-5 h-5 text-emerald-500" />
                                <select 
                                    className="w-full p-4 pl-12 bg-gray-50 rounded-2xl outline-none border border-transparent focus:border-emerald-500 cursor-pointer appearance-none"
                                    value={formData.location} 
                                    onChange={e => setFormData({...formData, location: e.target.value})}
                                >
                                    {XORAZM_LOCATIONS.map(loc => (
                                        <option key={loc} value={loc}>{loc}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Tavsif */}
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 mb-1 block">Batafsil tavsif</label>
                            <textarea placeholder="Mahsulot holati, navi va boshqalar haqida..." rows={2} className="w-full p-4 bg-gray-50 rounded-2xl outline-none border border-transparent focus:border-emerald-500 resize-none transition-all"
                                value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                        </div>
                    </div>

                    {/* Yuborish tugmasi */}
                    <button type="submit" disabled={loading} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-emerald-200 hover:bg-emerald-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                        {loading ? <Loader2 className="animate-spin w-6 h-6" /> : "E'lonni joylashtirish"}
                    </button>
                </form>
            </div>
        </div>
    );
};