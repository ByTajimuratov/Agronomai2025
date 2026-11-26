
import React from 'react';
import { X, AlertTriangle, ShieldCheck, Activity, ChevronRight, Users } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useAlerts } from '../../features/alerts/useAlerts';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const AlertsModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const { stats, alerts, totalScans, region } = useAlerts();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white w-full max-w-lg md:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 md:zoom-in-95 h-[90vh] md:h-auto flex flex-col">
                
                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-white">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-red-500" /> Kasallik Radari
                        </h3>
                        <p className="text-xs text-gray-500 font-medium mt-0.5">{region} • Haftalik Tahlil</p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-0 bg-gray-50/50">
                    
                    {/* Section A: The Radar (Chart) */}
                    <div className="bg-white p-6 pb-2 mb-4 shadow-sm border-b border-gray-100">
                        <div className="h-[220px] w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={stats}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {stats.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                        itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                    />
                                    <Legend 
                                        verticalAlign="bottom" 
                                        height={36} 
                                        iconType="circle"
                                        formatter={(value, entry: any) => <span className="text-xs font-bold text-gray-600 ml-1">{value}</span>}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            
                            {/* Center Label */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                                <span className="text-3xl font-bold text-gray-800">{totalScans}</span>
                                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Scans</span>
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-center gap-2 text-xs text-gray-500 bg-gray-50 py-2 rounded-lg mt-2 mb-2">
                            <Users className="w-3 h-3" />
                            <span>{totalScans.toLocaleString()} ta fermerlar ma'lumotlari asosida</span>
                        </div>
                    </div>

                    {/* Section B: Actionable Advice */}
                    <div className="p-5 space-y-4">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Xavfli Vaziyatlar</h4>
                        
                        {alerts.map(alert => (
                            <div key={alert.id} className="bg-white rounded-2xl p-4 shadow-sm border-l-4 border-red-500 relative overflow-hidden">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h5 className="font-bold text-gray-900 text-sm">{alert.disease}</h5>
                                            <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                                {alert.percentage}% Tarqalish
                                            </span>
                                        </div>
                                    </div>
                                    <AlertTriangle className="w-5 h-5 text-red-500" />
                                </div>
                                
                                <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                                    {alert.advice}
                                </p>

                                <div className="bg-red-50 rounded-xl p-3 flex gap-3 items-start">
                                    <ShieldCheck className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                                    <div>
                                        <span className="text-[10px] font-bold text-red-800 uppercase block mb-1">Tavsiya (Prevention)</span>
                                        <p className="text-xs font-bold text-red-700">
                                            {alert.action}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <button className="w-full py-3 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-1">
                            Batafsil ma'lumot o'qish <ChevronRight className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
