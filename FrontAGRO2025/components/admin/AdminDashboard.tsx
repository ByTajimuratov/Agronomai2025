import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, ShoppingBag, TrendingUp, Activity, ArrowUpRight, MoreHorizontal, DollarSign, Loader2 } from 'lucide-react';
// Backend servisni ulaymiz
import { fetchAdminStats } from '../../services/adminService';

// Grafik ranglari
const COLORS = ['#059669', '#d97706', '#2563eb', '#db2777'];

// Vaqtincha grafik ma'lumotlari (buni ham keyin backenddan olsa bo'ladi)
const growthData = [
  { name: 'Jan', users: 10, revenue: 100 },
  { name: 'Feb', users: 25, revenue: 200 },
  { name: 'Mar', users: 40, revenue: 450 },
  { name: 'Apr', users: 60, revenue: 800 },
  { name: 'May', users: 90, revenue: 1200 },
  { name: 'Jun', users: 120, revenue: 2400 },
];

const pieData = [
  { name: 'Texnika', value: 45 },
  { name: 'Bug\'doy', value: 25 },
  { name: 'Paxta', value: 20 },
  { name: 'Boshqa', value: 10 },
];

export const AdminDashboard: React.FC = () => {
  // 1. Statistika uchun State
  const [stats, setStats] = useState({
      users: 0,
      products: 0,
      tickets: 0,
      revenue: 0
  });
  const [loading, setLoading] = useState(true);

  // 2. Backenddan ma'lumot yuklash
  useEffect(() => {
    const loadStats = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const data = await fetchAdminStats(token);
                // Agar backenddan bo'sh kelsa, 0 qo'yamiz
                setStats({
                    users: data.users || 0,
                    products: data.products || 0,
                    tickets: data.tickets || 0,
                    revenue: data.revenue || 0
                });
            }
        } catch (error) {
            console.error("Admin stats xatosi:", error);
        } finally {
            setLoading(false);
        }
    };
    loadStats();
  }, []);

  if (loading) {
      return (
          <div className="flex h-screen items-center justify-center bg-gray-50">
              <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
          </div>
      );
  }

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-500">Xush kelibsiz! Bugun Xorazmda nimalar bo'layotganini ko'ring.</p>
        </div>
        <div className="flex gap-3">
             <span className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-medium shadow-sm">
                Oxirgi 30 kun
             </span>
             <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium shadow-lg hover:bg-slate-800 transition-colors">
                Hisobotni Yuklash
             </button>
        </div>
      </div>

      {/* KPI Cards (Haqiqiy raqamlar bilan) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <KPICard title="Jami Foydalanuvchilar" value={stats.users.toLocaleString()} change="+1 yangi" icon={Users} color="blue" />
         <KPICard title="Oylik Tushum" value={`${stats.revenue.toLocaleString()} UZS`} change="+8.2%" icon={DollarSign} color="emerald" />
         <KPICard title="Faol E'lonlar" value={stats.products.toLocaleString()} change="+2 yangi" icon={ShoppingBag} color="amber" />
         <KPICard title="Ochiq Murojaatlar" value={stats.tickets.toLocaleString()} change="Barqaror" icon={Activity} color="purple" isBad={stats.tickets > 5} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
         {/* Main Line Chart */}
         <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
             <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-lg text-slate-800">Foydalanuvchilar O'sishi</h3>
                 <button className="p-2 hover:bg-gray-100 rounded-full">
                     <MoreHorizontal className="w-5 h-5 text-gray-400" />
                 </button>
             </div>
             <div className="flex-1 w-full min-h-0">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={growthData}>
                        <defs>
                            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#059669" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                        <Tooltip 
                            contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                        />
                        <Area type="monotone" dataKey="users" stroke="#059669" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                    </AreaChart>
                 </ResponsiveContainer>
             </div>
         </div>

         {/* Pie Chart */}
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
            <h3 className="font-bold text-lg text-slate-800 mb-4">Ekinlar Taqsimoti</h3>
            <div className="flex-1 min-h-0 relative">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                 </ResponsiveContainer>
                 {/* Centered Text Overlay */}
                 <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                     <span className="text-3xl font-bold text-slate-800">{stats.products}</span>
                     <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">Tovarlar</span>
                 </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
                {pieData.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs font-medium text-slate-600">
                        <span className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[index]}}></span>
                        {entry.name} ({entry.value}%)
                    </div>
                ))}
            </div>
         </div>
      </div>

      {/* Recent Activity Table (Static for now, can be connected to Logs) */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-800">Oxirgi Tizim Faolligi</h3>
              <button className="text-emerald-600 text-sm font-bold hover:text-emerald-700">Hammasini ko'rish</button>
          </div>
          <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                      <tr>
                          <th className="px-6 py-4">Foydalanuvchi</th>
                          <th className="px-6 py-4">Harakat</th>
                          <th className="px-6 py-4">Vaqt</th>
                          <th className="px-6 py-4">Holat</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                      {[
                          { user: 'Ilhom T.', action: 'Tizimga kirdi (Login)', time: 'Hozirgina', status: 'Success' },
                          { user: 'Ilhom T.', action: 'Chatda savol berdi', time: '2 daqiqa oldin', status: 'Success' },
                          { user: 'Admin', action: 'Bozorga tovar qo\'shdi', time: '1 soat oldin', status: 'Review' },
                      ].map((row, i) => (
                          <tr key={i} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-4 font-medium text-slate-900">{row.user}</td>
                              <td className="px-6 py-4 text-slate-600">{row.action}</td>
                              <td className="px-6 py-4 text-slate-500">{row.time}</td>
                              <td className="px-6 py-4">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      row.status === 'Success' ? 'bg-green-100 text-green-800' :
                                      row.status === 'Review' ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-red-100 text-red-800'
                                  }`}>
                                      {row.status}
                                  </span>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </div>
    </div>
  );
};

const KPICard = ({ title, value, change, icon: Icon, color, isBad = false }: any) => {
    const isPositive = change.startsWith('+') || change === 'Barqaror';
    const colorClasses: Record<string, string> = {
        blue: 'bg-blue-50 text-blue-600',
        emerald: 'bg-emerald-50 text-emerald-600',
        amber: 'bg-amber-50 text-amber-600',
        purple: 'bg-purple-50 text-purple-600'
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
                    isBad 
                    ? 'bg-slate-100 text-slate-600' 
                    : (isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700')
                }`}>
                    {isPositive ? <TrendingUp className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3 rotate-90" />}
                    {change}
                </div>
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-1">{value}</h3>
            <p className="text-sm font-medium text-slate-500">{title}</p>
        </div>
    );
}