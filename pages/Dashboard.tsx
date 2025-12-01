import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/storage';
import { Transaction, Card } from '../types';
import { Button, BankCard } from '../components/UI';
import { ArrowUpRight, ArrowDownLeft, Wallet, Briefcase, TrendingUp, Send, Plus, RefreshCw, MapPin, Bell, Gamepad2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const { user, refreshUser } = useAuth();
  const [cards, setCards] = useState<Card[]>([]);
  const [history, setHistory] = useState<Transaction[]>([]);

  useEffect(() => {
    if (user) {
      setCards(StorageService.getUserCards(user.id));
      setHistory(StorageService.getHistory(user.id).slice(0, 5));
    }
  }, [user]);

  const refreshData = () => {
    refreshUser();
    if(user) {
        setCards(StorageService.getUserCards(user.id));
        setHistory(StorageService.getHistory(user.id).slice(0, 5));
    }
  }

  return (
    <div className="space-y-10 pb-10 max-w-6xl mx-auto animate-fade-in">
      
      {/* Header with Greeting and Quick Stats */}
      <div className="flex flex-col lg:flex-row justify-between items-end gap-6">
        <div>
          <h2 className="text-4xl font-bold mb-2 tracking-tight">
             Привіт, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">{user?.fullName.split(' ')[0]}</span>
          </h2>
          <div className="flex items-center gap-3 text-slate-500 text-sm">
             <div className="px-3 py-1 bg-slate-200 dark:bg-slate-800 rounded-full border border-border flex items-center gap-2">
                 <MapPin size={12} className="text-blue-500"/> 
                 <span>{user?.location || 'Україна'}</span>
             </div>
             <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
             <span>ID: <span className="font-mono opacity-70">#{user?.id.slice(0,6)}</span></span>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="glass-panel p-1 rounded-2xl flex items-center shadow-xl flex-1 lg:flex-none">
                <div className="px-6 py-3">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Загальний баланс</p>
                    <p className="text-3xl font-bold tracking-tight font-mono text-foreground">
                       {user?.balance.toLocaleString('uk-UA', { minimumFractionDigits: 2 })} <span className="text-slate-500 text-xl">₴</span>
                    </p>
                </div>
                <button onClick={refreshData} className="w-12 h-full flex items-center justify-center border-l border-border text-slate-400 hover:text-blue-500 hover:bg-slate-500/10 rounded-r-xl transition-all">
                    <RefreshCw size={18} />
                </button>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Cards (2/3 width) */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="flex justify-between items-center px-2">
            <h3 className="text-xl font-bold flex items-center gap-2">
               Ваші Картки <span className="text-xs bg-slate-200 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full">{cards.length}</span>
            </h3>
            <Link to="/cards" className="text-sm font-medium text-blue-500 hover:text-blue-400 transition-colors flex items-center gap-1 group">
                Керування <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"/>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cards.slice(0, 2).map(card => (
              <BankCard key={card.id} card={card} />
            ))}
            
            <Link to="/cards" className="group min-h-[220px] h-full border-2 border-dashed border-border hover:border-blue-500/50 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:text-blue-500 hover:bg-blue-500/5 transition-all cursor-pointer gap-4 backdrop-blur-sm">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-all shadow-lg">
                    <Plus size={28} />
                </div>
                <span className="font-medium tracking-wide">Відкрити картку</span>
            </Link>
          </div>

          <div className="glass-panel rounded-3xl p-8 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Останні транзакції</h3>
              <Link to="/profile" className="text-sm text-slate-500 hover:text-foreground transition-colors">Вся історія</Link>
            </div>
            <div className="space-y-3">
              {history.map(tx => (
                <div key={tx.id} className="flex justify-between items-center p-4 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-2xl transition-all border border-transparent hover:border-border group">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl transition-colors ${
                        tx.type === 'SALARY' ? 'bg-emerald-500/10 text-emerald-500' :
                        tx.type === 'GAME' ? 'bg-purple-500/10 text-purple-500' :
                        tx.toUserId === user?.id ? 'bg-blue-500/10 text-blue-500' : 
                        'bg-slate-200 dark:bg-slate-800 text-slate-500'
                    }`}>
                      {tx.type === 'SALARY' ? <Briefcase size={20} /> :
                       tx.type === 'GAME' ? <TrendingUp size={20} /> :
                       tx.toUserId === user?.id ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                    </div>
                    <div>
                      <p className="font-medium group-hover:text-blue-500 transition-colors">{tx.description}</p>
                      <p className="text-xs text-slate-500 font-mono">{new Date(tx.date).toLocaleDateString()} • {new Date(tx.date).toLocaleTimeString().slice(0,5)}</p>
                    </div>
                  </div>
                  <span className={`font-bold font-mono text-lg tracking-tight ${tx.toUserId === user?.id || (tx.type === 'GAME' && tx.description.includes('Виграш')) ? 'text-emerald-500' : 'text-slate-500'}`}>
                    {(tx.toUserId === user?.id || (tx.type === 'GAME' && tx.description.includes('Виграш'))) ? '+' : '-'}{Math.abs(tx.amount).toFixed(2)}
                  </span>
                </div>
              ))}
              {history.length === 0 && (
                  <div className="text-center py-12 text-slate-500">
                      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-3">
                          <RefreshCw className="opacity-20" size={32}/>
                      </div>
                      <p>Транзакцій ще немає</p>
                  </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Actions & Widgets */}
        <div className="space-y-6">
           
           <div className="glass-panel p-6 rounded-3xl">
              <h3 className="font-bold mb-4 flex items-center gap-2"><Send size={16} className="text-blue-500"/> Швидкий доступ</h3>
              <div className="grid grid-cols-2 gap-3">
                 <Link to="/transfers" className="bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 active:scale-95 group">
                    <Send size={24} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform"/>
                    <span className="text-xs font-bold uppercase tracking-wider">Переказ</span>
                 </Link>
                 <Link to="/work" className="bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-white p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all active:scale-95 group">
                    <Briefcase size={24} className="text-emerald-500 group-hover:scale-110 transition-transform"/>
                    <span className="text-xs font-bold uppercase tracking-wider">Робота</span>
                 </Link>
                 <Link to="/casino" className="col-span-2 relative overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white p-4 rounded-2xl flex items-center justify-between px-6 transition-all shadow-lg active:scale-95 group">
                    <div className="flex flex-col z-10">
                        <span className="text-lg font-bold">Casino</span>
                        <span className="text-[10px] text-purple-200 uppercase">Jackpot: 1M ₴</span>
                    </div>
                    <Gamepad2 size={28} className="text-purple-200 group-hover:rotate-12 transition-transform z-10" />
                    <div className="absolute right-0 top-0 w-24 h-full bg-white/10 skew-x-12 group-hover:translate-x-2 transition-transform"></div>
                 </Link>
              </div>
           </div>

           <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-indigo-600 to-blue-700 shadow-2xl group cursor-pointer hover:-translate-y-1 transition-transform duration-300">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-[40px] -mr-12 -mt-12"></div>
                <div className="relative z-10">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 text-white shadow-inner border border-white/10">
                        <Briefcase size={24} />
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-2">Вакансії</h4>
                    <p className="text-indigo-100 text-sm mb-6 leading-relaxed">
                        Потрібні співробітники. Зарплата від 15 ₴ до 2000 ₴.
                    </p>
                    <Link to="/work" className="inline-flex items-center gap-2 bg-white text-blue-600 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors shadow-lg">
                        Почати кар'єру <ArrowUpRight size={16} />
                    </Link>
                </div>
           </div>
        </div>
      </div>
    </div>
  );
};