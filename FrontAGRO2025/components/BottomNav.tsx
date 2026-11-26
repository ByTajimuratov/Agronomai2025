
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, ScanLine, ShoppingBag, MessageCircle, Calendar, User, Settings } from 'lucide-react';
import { useGlobal } from '../store/GlobalStore';

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const { t } = useGlobal();

  const navItems = [
    { path: '/', icon: Home, label: t('home') },
    { path: '/analysis', icon: ScanLine, label: t('analysis') },
    { path: '/chat', icon: MessageCircle, label: t('chat') },
    { path: '/calendar', icon: Calendar, label: t('calendar') },
    { path: '/market', icon: ShoppingBag, label: t('market') },
    { path: '/profile', icon: User, label: t('profile') },
  ];

  return (
    <div className="fixed bottom-5 left-3 right-3 z-40 flex justify-center">
      {/* Floating Dock Container */}
      <nav className="bg-white/95 backdrop-blur-xl border border-white/40 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-1.5 flex items-center justify-between w-full max-w-lg transition-all duration-300">
        
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                relative flex items-center justify-center rounded-full transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
                ${isActive 
                  ? 'bg-emerald-600 text-white px-4 py-3 shadow-lg shadow-emerald-500/30' 
                  : 'text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 w-10 h-10 sm:w-12 sm:h-12'
                }
              `}
            >
              <Icon 
                className={`
                   transition-all duration-300
                   ${isActive ? 'w-5 h-5' : 'w-6 h-6'}
                `} 
                strokeWidth={isActive ? 2.5 : 2}
              />
              
              {/* Text Label with Max-Width Transition */}
              <span 
                className={`
                  overflow-hidden whitespace-nowrap font-bold text-xs transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
                  ${isActive ? 'max-w-[120px] ml-2 opacity-100' : 'max-w-0 opacity-0'}
                `}
              >
                {item.label}
              </span>

              {/* Active Indicator Dot (Optional Flair) */}
              {isActive && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-400 rounded-full opacity-0"></span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
