import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  Home, CreditCard, ArrowRightLeft, User, LogOut, 
  Gamepad2, Shield, Menu, X, Briefcase, HelpCircle, FileText, Sun, Moon
} from 'lucide-react';

export const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('vovabank_theme') as 'dark' | 'light' || 'dark';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('vovabank_theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const NavItem = ({ to, icon: Icon, label }: any) => (
    <NavLink 
      to={to} 
      onClick={() => setIsMobileMenuOpen(false)}
      className={({ isActive }) => 
        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
          isActive 
            ? 'bg-blue-600/10 text-blue-500 border border-blue-600/20' 
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/50 dark:hover:bg-white/5'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon size={18} className={`z-10 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} />
          <span className="z-10 text-sm font-medium">{label}</span>
          {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>}
        </>
      )}
    </NavLink>
  );

  return (
    <div className="min-h-screen flex font-sans selection:bg-blue-500/30 overflow-hidden">
      
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-72 h-screen fixed left-0 top-0 z-50 glass-panel border-r border-border border-y-0 border-l-0 bg-white/50 dark:bg-black/40 backdrop-blur-xl">
        <div className="flex items-center justify-between p-8 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/20"></div>
               V
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight font-['JetBrains_Mono']">VovaBank</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Premium</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          <p className="px-4 mb-2 text-[10px] uppercase text-slate-500 font-bold tracking-widest mt-2">Finance</p>
          <NavItem to="/dashboard" icon={Home} label="Головна" />
          <NavItem to="/cards" icon={CreditCard} label="Гаманець" />
          <NavItem to="/transfers" icon={ArrowRightLeft} label="Перекази" />
          
          <p className="px-4 mb-2 text-[10px] uppercase text-slate-500 font-bold tracking-widest mt-6">Activities</p>
          <NavItem to="/work" icon={Briefcase} label="Робота" />
          <NavItem to="/casino" icon={Gamepad2} label="Казино" />
          
          <p className="px-4 mb-2 text-[10px] uppercase text-slate-500 font-bold tracking-widest mt-6">Account</p>
          <NavItem to="/profile" icon={User} label="Профіль" />
          {user?.role === 'ADMIN' && (
             <NavItem to="/admin" icon={Shield} label="Адмін Панель" />
          )}

          <p className="px-4 mb-2 text-[10px] uppercase text-slate-500 font-bold tracking-widest mt-6">Support</p>
          <NavItem to="/support" icon={HelpCircle} label="Підтримка" />
          <NavItem to="/terms" icon={FileText} label="Умови" />
          <NavItem to="/privacy" icon={Shield} label="Конфіденційність" />
        </nav>

        <div className="p-4 mt-auto space-y-3">
          <button 
             onClick={toggleTheme}
             className="w-full flex items-center justify-between px-4 py-2 rounded-xl bg-slate-200/50 dark:bg-white/5 border border-border text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-white/10 transition-colors"
          >
             <span>Режим: {theme === 'dark' ? 'Темний' : 'Світлий'}</span>
             {theme === 'dark' ? <Moon size={14}/> : <Sun size={14}/>}
          </button>

          <div className="p-3 rounded-xl border border-border bg-white/40 dark:bg-white/5 backdrop-blur-md">
             <div className="flex items-center gap-3 mb-3">
                 <img src={user?.avatarUrl} className="w-8 h-8 rounded-lg object-cover bg-slate-800" alt="avatar" />
                 <div className="overflow-hidden">
                    <p className="text-xs font-bold truncate">{user?.fullName}</p>
                    <p className="text-[10px] text-slate-500 truncate font-mono">{user?.balance.toFixed(0)} ₴</p>
                 </div>
             </div>
             <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 dark:text-red-400 rounded-lg text-xs font-medium transition-colors border border-red-500/10"
              >
                <LogOut size={12} />
                <span>Вийти</span>
              </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full glass-panel z-40 px-4 py-3 flex justify-between items-center transition-all bg-white/80 dark:bg-black/80">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">V</div>
          <span className="font-bold text-lg font-['JetBrains_Mono']">VovaBank</span>
        </div>
        <div className="flex gap-2">
          <button onClick={toggleTheme} className="text-slate-500 dark:text-slate-300 p-2 active:scale-95 transition-transform bg-slate-200/50 dark:bg-white/5 rounded-lg border border-border">
             {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-500 dark:text-slate-300 p-2 active:scale-95 transition-transform bg-slate-200/50 dark:bg-white/5 rounded-lg border border-border">
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-white dark:bg-black z-30 pt-24 px-6 space-y-2 md:hidden animate-fade-in overflow-y-auto pb-10">
          <NavItem to="/dashboard" icon={Home} label="Головна" />
          <NavItem to="/cards" icon={CreditCard} label="Гаманець" />
          <NavItem to="/transfers" icon={ArrowRightLeft} label="Перекази" />
          <NavItem to="/work" icon={Briefcase} label="Робота" />
          <NavItem to="/casino" icon={Gamepad2} label="Казино" />
          <NavItem to="/profile" icon={User} label="Профіль" />
          <NavItem to="/support" icon={HelpCircle} label="Підтримка" />
          
          <div className="border-t border-border my-6"></div>
          <button onClick={handleLogout} className="w-full text-left flex items-center gap-3 px-4 py-4 text-red-500 bg-red-500/5 hover:bg-red-500/10 rounded-2xl border border-red-500/10">
            <LogOut size={20} /> Вийти з системи
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 md:ml-72 p-4 md:p-8 pt-24 md:pt-8 max-w-7xl mx-auto w-full z-10 relative overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};