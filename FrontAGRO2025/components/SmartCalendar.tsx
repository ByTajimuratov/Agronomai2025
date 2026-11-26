import React, { useState, useEffect } from 'react';
import { Calendar, Sprout, Plus, Trash2, Check, Droplets, Bug, AlertCircle, Clock, Loader2, CalendarCheck } from 'lucide-react';

// --- Helper: Task Icon ---
const TaskIcon = ({ type }: { type: string }) => {
    const t = type.toLowerCase();
    if (t.includes('sug') || t.includes('water')) return <Droplets className="w-4 h-4 text-blue-500" />;
    if (t.includes('oziq') || t.includes('o\'g\'it') || t.includes('fert')) return <Bug className="w-4 h-4 text-red-500" />;
    if (t.includes('ekish') || t.includes('plant')) return <Sprout className="w-4 h-4 text-emerald-500" />;
    return <AlertCircle className="w-4 h-4 text-amber-500" />;
};

// --- Component: Single Crop Card ---
const SmartCropCard: React.FC<{ 
    crop: any, 
    onRemove: (id: string) => void,
    onToggleTask: (cropId: string, taskId: string, currentStatus: boolean) => void 
}> = ({ crop, onRemove, onToggleTask }) => {
    
    const formatDate = (dateString: string) => {
        if (!dateString) return "Noma'lum";
        return new Date(dateString).toLocaleDateString('uz-UZ', { month: 'long', day: 'numeric', year: 'numeric' });
    };

    const today = new Date();
    const plantingDate = new Date(crop.plantingDate);
    const dayDiff = Math.floor((today.getTime() - plantingDate.getTime()) / (1000 * 3600 * 24));

    const tasks = crop.schedule || [];

    return (
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 relative overflow-hidden mb-4 transition-all hover:shadow-md">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                 <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100 shadow-sm">
                         <Sprout className="w-6 h-6" />
                      </div>
                      <div>
                         <h4 className="font-bold text-gray-900 text-lg leading-tight capitalize">{crop.cropName}</h4>
                         <div className="flex flex-col gap-1 mt-1.5">
                             <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                                <Clock className="w-3.5 h-3.5" />
                                <span>Ekish: {formatDate(crop.plantingDate)} ({dayDiff} kun)</span>
                             </div>
                             {crop.estimatedHarvestDate && (
                                 <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md w-fit">
                                    <CalendarCheck className="w-3.5 h-3.5" />
                                    <span>Hosil: {formatDate(crop.estimatedHarvestDate)}</span>
                                 </div>
                             )}
                         </div>
                      </div>
                 </div>
                 
                 {/* O'chirish tugmasi */}
                 <button 
                    onClick={(e) => {
                        e.stopPropagation(); // Muhim: Card bosilib ketmasligi uchun
                        if(window.confirm(`${crop.cropName}ni o'chirmoqchimisiz?`)) {
                            onRemove(crop._id);
                        }
                    }} 
                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors bg-gray-50 rounded-full cursor-pointer z-10"
                 >
                     <Trash2 className="w-5 h-5" />
                 </button>
            </div>

            {/* Task List */}
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <div className="flex justify-between items-center mb-3 border-b border-gray-200 pb-2">
                    <h5 className="font-bold text-gray-700 text-sm">Vazifalar</h5>
                </div>

                <div className="space-y-3">
                    {tasks.map((task: any) => (
                        <div 
                            key={task._id} 
                            onClick={() => onToggleTask(crop._id, task._id, task.completed)}
                            className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                                task.completed 
                                ? 'bg-emerald-50 border-emerald-200 opacity-70' 
                                : 'bg-white border-gray-200 hover:border-emerald-300 shadow-sm'
                            }`}
                        >
                            {/* Checkbox (Yumaloq zona) */}
                            <div className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                                task.completed 
                                ? 'bg-emerald-500 border-emerald-500' 
                                : 'border-gray-300 bg-white group-hover:border-emerald-400'
                            }`}>
                                {task.completed && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                            </div>

                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <span className={`text-sm font-bold ${task.completed ? 'text-emerald-800 line-through' : 'text-gray-800'}`}>
                                        {task.title}
                                    </span>
                                    <div className="bg-gray-50 p-1 rounded ml-2">
                                        <TaskIcon type={task.title} />
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                    {task.description}
                                </p>
                                <p className="text-[10px] text-emerald-600 font-bold mt-1">
                                    {task.dayOffset}-kun
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- Modal ---
const AddCropModal = ({ isOpen, onClose, onAdd }: any) => {
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const userStr = localStorage.getItem('user');
            if (!token || !userStr) return alert("Avval tizimga kiring!");
            
            const user = JSON.parse(userStr);
            const userId = user._id || user.id;

            const res = await fetch('http://localhost:5000/api/calendar/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ userId, cropName: name, plantingDate: date })
            });

            if (!res.ok) throw new Error("Xatolik");
            const newCrop = await res.json();
            
            onAdd(newCrop);
            onClose();
            setName('');
            setDate('');
        } catch (error) {
            alert("Reja tuzishda xatolik.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-6 w-full max-w-md animate-in zoom-in-95 shadow-2xl">
                <h3 className="text-xl font-bold mb-4">Yangi Ekin Qo'shish</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-bold text-gray-700 mb-1">Ekin Nomi</label>
                        <input type="text" className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Masalan: Pomidor" />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-700 mb-1">Ekish Sanasi</label>
                        <input type="date" className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none" value={date} onChange={(e) => setDate(e.target.value)} required />
                    </div>
                    <div className="flex gap-3">
                        <button type="button" onClick={onClose} className="flex-1 py-3 bg-gray-100 rounded-xl font-bold text-gray-600">Bekor qilish</button>
                        <button type="submit" disabled={loading} className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold flex items-center justify-center gap-2">
                            {loading ? <Loader2 className="animate-spin" /> : "Reja Tuzish (AI)"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Main Container ---
export const SmartCalendar: React.FC = () => {
  const [myCrops, setMyCrops] = useState<any[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Ekinlarni yuklash
  useEffect(() => {
    const fetchCrops = async () => {
        try {
            const token = localStorage.getItem('token');
            const userStr = localStorage.getItem('user');
            if (token && userStr) {
                const user = JSON.parse(userStr);
                const userId = user._id || user.id;
                
                const res = await fetch(`http://localhost:5000/api/calendar/list?userId=${userId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) setMyCrops(await res.json());
            }
        } catch (error) { console.error(error); } 
        finally { setLoading(false); }
    };
    fetchCrops();
  }, []);

  // --- 1. Ekinni O'chirish ---
  const handleRemove = async (id: string) => {
      console.log("O'chirilmoqda ID:", id);
      
      // Ekranda darhol o'chirish (Optimistik UI)
      const prevCrops = [...myCrops];
      setMyCrops(prev => prev.filter(c => c._id !== id));

      try {
          const token = localStorage.getItem('token');
          const res = await fetch(`http://localhost:5000/api/calendar/${id}`, {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (!res.ok) {
              throw new Error("Server xatosi");
          }
      } catch (e) { 
          alert("O'chirishda xatolik");
          setMyCrops(prevCrops); // Xato bo'lsa qaytarish
      }
  };

  // --- 2. Vazifani Bajarish ---
  const handleToggleTask = async (cropId: string, taskId: string, currentStatus: boolean) => {
      console.log("Task bosildi:", cropId, taskId);

      // Ekranda darhol yangilash (Optimistik UI)
      setMyCrops(prevCrops => prevCrops.map(crop => {
          if (crop._id === cropId) {
              return {
                  ...crop,
                  schedule: crop.schedule.map((task: any) => 
                      task._id === taskId ? { ...task, completed: !currentStatus } : task
                  )
              };
          }
          return crop;
      }));

      // Serverga yuborish
      try {
          const token = localStorage.getItem('token');
          await fetch(`http://localhost:5000/api/calendar/${cropId}/task/${taskId}`, {
              method: 'PUT',
              headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}` 
              },
              body: JSON.stringify({ completed: !currentStatus })
          });
      } catch (e) {
          console.error("Xatolik:", e);
      }
  };

  return (
    <div className="p-4 pb-24 min-h-screen bg-gray-50">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-emerald-900 flex items-center gap-2">
                <Calendar className="w-6 h-6" /> Aqlli Taqvim
            </h2>
            <button onClick={() => setIsAddModalOpen(true)} className="bg-emerald-600 text-white p-2 rounded-full shadow-lg">
                <Plus className="w-6 h-6" />
            </button>
        </div>

        {loading ? (
            <div className="text-center py-20"><Loader2 className="w-10 h-10 animate-spin mx-auto text-emerald-600" /></div>
        ) : myCrops.length === 0 ? (
            <div className="bg-white rounded-3xl border-2 border-dashed border-gray-200 p-10 text-center flex flex-col items-center">
                <Sprout className="w-16 h-16 mx-auto mb-2 text-gray-300" />
                <p className="text-gray-500 mb-4">Sizda hali ekinlar yo'q.</p>
                <button onClick={() => setIsAddModalOpen(true)} className="bg-emerald-600 text-white px-6 py-2 rounded-xl">Ekin Qo'shish</button>
            </div>
        ) : (
            <div>
                {myCrops.map(crop => (
                    <SmartCropCard 
                        key={crop._id} 
                        crop={crop} 
                        onRemove={handleRemove}
                        onToggleTask={handleToggleTask}
                    />
                ))}
            </div>
        )}

        <AddCropModal 
            isOpen={isAddModalOpen} 
            onClose={() => setIsAddModalOpen(false)} 
            onAdd={(newCrop: any) => setMyCrops([newCrop, ...myCrops])}
        />
    </div>
  );
};