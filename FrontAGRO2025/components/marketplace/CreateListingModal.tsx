
import React, { useState } from 'react';
import { useGlobal } from '../../store/GlobalStore';
import { MarketCategory, MarketItem, KhorezmDistrict } from '../../types';
import { ImageUpload } from '../shared/ImageUpload';
import { X, Save, MapPin, Tag, DollarSign, Package, Plus, Trash2 } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const CreateListingModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const { user, addMarketItem, t } = useGlobal();
    
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState<MarketCategory>(MarketCategory.MACHINERY);
    const [description, setDescription] = useState('');
    const [mainImage, setMainImage] = useState('');
    const [additionalImages, setAdditionalImages] = useState<string[]>([]);
    const [location, setLocation] = useState(user?.district || KhorezmDistrict.URGENCH_CITY);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen || !user) return null;

    const handleAddAdditionalImage = (base64: string) => {
        if (additionalImages.length < 3) {
            setAdditionalImages([...additionalImages, base64]);
        }
    };

    const removeAdditionalImage = (index: number) => {
        setAdditionalImages(additionalImages.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        const newItem: MarketItem = {
            id: Date.now().toString(),
            title,
            price: Number(price.replace(/,/g, '')),
            currency: 'UZS',
            category,
            description,
            imageUrl: mainImage || 'https://picsum.photos/300/200',
            images: [mainImage, ...additionalImages].filter(Boolean),
            location: location,
            sellerName: user.name,
            sellerId: user.id,
            sellerContact: { phone: user.phone || '+998900000000' },
            verified: false,
            datePosted: new Date().toISOString().split('T')[0]
        };

        addMarketItem(newItem);
        setIsSubmitting(false);
        onClose();
        
        // Reset form
        setTitle('');
        setPrice('');
        setDescription('');
        setMainImage('');
        setAdditionalImages([]);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white w-full max-w-md md:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 md:zoom-in-95 h-[90vh] md:h-auto flex flex-col">
                <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-white sticky top-0 z-10">
                    <h3 className="text-xl font-bold text-gray-900">{t('marketplace')} - Sell</h3>
                    <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                <div className="overflow-y-auto p-6 flex-1 bg-gray-50/50">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Image Uploader Section */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-gray-500 uppercase block">Product Images</label>
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {/* Main Image */}
                                <div className="shrink-0">
                                    <ImageUpload 
                                        currentImage={mainImage} 
                                        onImageSelected={setMainImage} 
                                    />
                                    <p className="text-[10px] text-center mt-1 font-bold text-emerald-600">Main</p>
                                </div>
                                
                                {/* Additional Images */}
                                {additionalImages.map((img, idx) => (
                                    <div key={idx} className="relative w-32 h-32 shrink-0 rounded-full overflow-hidden border-2 border-gray-200">
                                        <img src={img} alt="Additional" className="w-full h-full object-cover" />
                                        <button 
                                            type="button"
                                            onClick={() => removeAdditionalImage(idx)}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}

                                {/* Add Button */}
                                {additionalImages.length < 3 && (
                                    <div className="w-32 h-32 shrink-0 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                                        <div className="relative w-full h-full">
                                            <div className="absolute inset-0 opacity-0 z-10">
                                                <ImageUpload onImageSelected={handleAddAdditionalImage} />
                                            </div>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                                <Plus className="w-8 h-8 text-gray-400" />
                                                <span className="text-[10px] text-gray-400 font-bold uppercase mt-1">Add Photo</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Title</label>
                            <div className="relative">
                                <Package className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                <input 
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. 50kg Selitra"
                                    className="w-full pl-10 p-3 bg-white rounded-xl border border-gray-200 focus:border-emerald-500 outline-none shadow-sm"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Price (UZS)</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                    <input 
                                        type="number"
                                        required
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        placeholder="0"
                                        className="w-full pl-10 p-3 bg-white rounded-xl border border-gray-200 focus:border-emerald-500 outline-none shadow-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Category</label>
                                <div className="relative">
                                    <Tag className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                    <select 
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value as MarketCategory)}
                                        className="w-full pl-10 p-3 bg-white rounded-xl border border-gray-200 focus:border-emerald-500 outline-none appearance-none shadow-sm"
                                    >
                                        {Object.values(MarketCategory).map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Location</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                <select 
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full pl-10 p-3 bg-white rounded-xl border border-gray-200 focus:border-emerald-500 outline-none appearance-none shadow-sm"
                                >
                                    {Object.values(KhorezmDistrict).map(d => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                             <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Description</label>
                             <textarea 
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                className="w-full p-3 bg-white rounded-xl border border-gray-200 focus:border-emerald-500 outline-none resize-none shadow-sm"
                                placeholder="Details about the condition, quantity..."
                             />
                        </div>

                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold shadow-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {isSubmitting ? 'Posting...' : (
                                <>
                                    <Save className="w-5 h-5" /> Post Listing
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
