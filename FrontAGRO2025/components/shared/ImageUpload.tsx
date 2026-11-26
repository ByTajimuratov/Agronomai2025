
import React, { useRef, useState } from 'react';
import { Camera, UploadCloud, X } from 'lucide-react';
import { useGlobal } from '../../store/GlobalStore';

interface ImageUploadProps {
    currentImage?: string;
    onImageSelected: (base64: string) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ currentImage, onImageSelected }) => {
    const { t, addToast } = useGlobal();
    const [preview, setPreview] = useState<string | null>(currentImage || null);
    const [isCompressing, setIsCompressing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate Type
        if (!file.type.startsWith('image/')) {
            addToast("Only image files are allowed", 'error');
            return;
        }

        setIsCompressing(true);

        try {
            const compressedBase64 = await compressImage(file);
            setPreview(compressedBase64);
            onImageSelected(compressedBase64);
        } catch (error) {
            addToast("Failed to process image", 'error');
        } finally {
            setIsCompressing(false);
        }
    };

    const compressImage = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 800; // Resize to max 800px width
                    const scaleSize = MAX_WIDTH / img.width;
                    canvas.width = MAX_WIDTH;
                    canvas.height = img.height * scaleSize;

                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
                    
                    // Compress to JPEG with 0.7 quality
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                    resolve(dataUrl);
                };
                img.onerror = (err) => reject(err);
            };
            reader.onerror = (err) => reject(err);
        });
    };

    return (
        <div className="relative group cursor-pointer w-32 h-32 mx-auto" onClick={() => fileInputRef.current?.click()}>
            <div className={`w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg relative ${isCompressing ? 'opacity-50' : ''}`}>
                {preview ? (
                    <img src={preview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-agrogreen-100 flex items-center justify-center text-agrogreen-600">
                        <span className="text-2xl font-bold">UP</span>
                    </div>
                )}
            </div>
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-8 h-8 text-white" />
            </div>

            {isCompressing && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-agrogreen-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange} 
            />
            
            <div className="absolute bottom-0 right-0 bg-agrogreen-600 p-2 rounded-full border-2 border-white shadow-sm">
                <UploadCloud className="w-4 h-4 text-white" />
            </div>
        </div>
    );
};
