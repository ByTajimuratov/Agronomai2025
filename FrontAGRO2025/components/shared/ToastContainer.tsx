import React from 'react';
import { useGlobal } from '../../store/GlobalStore'; // Yo'lni tekshiring
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
    const { toasts, removeToast } = useGlobal();

    if (!toasts || toasts.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
            {toasts.map(toast => (
                <div 
                    key={toast.id}
                    className={`pointer-events-auto flex items-center gap-3 min-w-[300px] p-4 rounded-xl shadow-xl border bg-white animate-in slide-in-from-right-5 fade-in duration-300 ${
                        toast.type === 'success' ? 'border-green-200' :
                        toast.type === 'error' ? 'border-red-200' :
                        'border-blue-200'
                    }`}
                >
                    {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
                    {toast.type === 'error' && <XCircle className="w-5 h-5 text-red-500" />}
                    {toast.type === 'info' && <Info className="w-5 h-5 text-blue-500" />}
                    
                    <p className="text-sm font-medium flex-1 text-gray-800">{toast.message}</p>
                    
                    <button onClick={() => removeToast(toast.id)} className="text-gray-400 hover:text-gray-600">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ))}
        </div>
    );
};