
import React, { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Newspaper, ShoppingCart, LogOut, Menu, X, MailQuestion, Settings, User as UserIcon, Megaphone } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Protection Logic
  useEffect(() => {
    const isAdmin = sessionStorage.getItem('isAdmin');
    if (!isAdmin) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('isAdmin');
    // Redirect strictly to the Authentication Page (Root '/' renders Auth when not logged in)
    navigate('/'); 
  };

  const navItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Overview' },
    { path: '/admin/market', icon: ShoppingCart, label: 'Market Control' },
    { path: '/admin/news', icon: Newspaper, label: 'News CMS' },
    { path: '/admin/ads', icon: Megaphone, label: 'Ads Manager' },
    { path: '/admin/support', icon: MailQuestion, label: 'Support Inbox' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans">
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-slate-900 text-slate-300 transform transition-transform duration-300 ease-in-out flex flex-col shadow-2xl
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo Area */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/50 text-white font-bold text-xl">
                A
            </div>
            <div>
                <h2 className="text-white font-bold tracking-tight text-lg leading-none">AgronomAI</h2>
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Admin Panel</span>
            </div>
          </div>
          <button onClick={() => setIsMobileOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Main Menu</p>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium
                ${isActive 
                    ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-600/20' 
                    : 'hover:bg-white/5 hover:text-white'}
              `}
            >
              <item.icon className={`w-5 h-5 ${window.location.pathname === item.path ? 'text-emerald-500' : 'text-slate-400'}`} />
              {item.label}
            </NavLink>
          ))}

          <div className="pt-6">
            <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">System</p>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white text-sm font-medium transition-colors">
                <Settings className="w-5 h-5" /> Settings
            </button>
          </div>
        </nav>

        {/* User Profile & Logout Section */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
            <div className="flex items-center gap-3 mb-4 px-2">
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 border border-slate-600">
                    <UserIcon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">Administrator</p>
                    <p className="text-xs text-slate-500 truncate">admin@agronom.ai</p>
                </div>
            </div>
            <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-500/10 text-red-400 hover:bg-red-50 hover:text-white rounded-lg transition-all text-sm font-bold border border-red-500/20 hover:border-red-500"
            >
                <LogOut className="w-4 h-4" /> Log Out
            </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
             <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">A</div>
                <span className="font-bold text-gray-800">AgronomAI</span>
             </div>
             <button onClick={() => setIsMobileOpen(true)} className="p-2 bg-gray-100 rounded-md">
                 <Menu className="w-6 h-6 text-gray-600" />
             </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto bg-gray-100 p-6 lg:p-10">
             <div className="max-w-7xl mx-auto">
                <Outlet />
             </div>
        </div>
      </main>
    </div>
  );
};
