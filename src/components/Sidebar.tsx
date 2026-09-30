import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Package,
  Settings,
  LogOut,
  Sprout,
  Mail,
  Bell,
  Landmark,
  Newspaper,
} from 'lucide-react';

const navItems = [
  { to: '/app', label: 'Panel', icon: LayoutDashboard, end: true },
  { to: '/app/products', label: 'Ürünler', icon: Package, end: false },
  { to: '/app/supports', label: 'Destekler', icon: Landmark, end: false },
  { to: '/app/news', label: 'Haberler', icon: Newspaper, end: false },
  { to: '/app/settings', label: 'Abonelikler', icon: Settings, end: false },
];

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <aside className="w-64 bg-white border-r border-stone-200 flex flex-col h-full">
      <div className="px-6 py-5 border-b border-stone-200">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center shadow-sm">
            <Sprout className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-base font-bold text-stone-800 leading-tight">TarımBorsa</h1>
            <p className="text-xs text-stone-500">Fiyat Takip Sistemi</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-green-50 text-green-700'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                }`
              }
            >
              <Icon className="w-[18px] h-[18px]" strokeWidth={2} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-stone-200 space-y-1">
        <div className="flex items-center gap-3 px-3 py-2 text-xs text-stone-500">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
            <Mail className="w-4 h-4 text-green-700" />
          </div>
          <span className="truncate">{user?.email}</span>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-stone-600 hover:bg-red-50 hover:text-red-700 transition-all"
        >
          <LogOut className="w-[18px] h-[18px]" strokeWidth={2} />
          Çıkış Yap
        </button>
      </div>
    </aside>
  );
}
