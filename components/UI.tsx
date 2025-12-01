import React, { useState } from 'react';
import { Card as CardType, Notification } from '../types';
import { X, CheckCircle, AlertCircle, Info, Wifi, Copy, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// --- Notifications ---
export const NotificationContainer = () => {
  const { notifications, removeNotification } = useAuth();
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none">
      {notifications.map(n => (
        <div key={n.id} className="pointer-events-auto animate-slide-in-right transform transition-all duration-300">
          <div className={`
            flex items-center gap-3 p-4 rounded-xl shadow-2xl border backdrop-blur-md
            ${n.type === 'success' ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-100' : ''}
            ${n.type === 'error' ? 'bg-red-950/90 border-red-500/30 text-red-100' : ''}
            ${n.type === 'info' ? 'bg-blue-950/90 border-blue-500/30 text-blue-100' : ''}
          `}>
            {n.type === 'success' && <CheckCircle size={20} />}
            {n.type === 'error' && <AlertCircle size={20} />}
            {n.type === 'info' && <Info size={20} />}
            <p className="text-sm font-medium flex-1">{n.message}</p>
            <button onClick={() => removeNotification(n.id)} className="opacity-60 hover:opacity-100">
              <X size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// --- Basic UI ---

export const Button: React.FC<any> = ({ children, onClick, variant = 'primary', className = '', disabled = false, ...props }) => {
  const baseStyle = "px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 active:scale-95";
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed",
    secondary: "bg-slate-700 hover:bg-slate-600 text-slate-200 disabled:opacity-50",
    danger: "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/20 disabled:opacity-50",
    success: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 disabled:opacity-50",
    ghost: "bg-transparent hover:bg-slate-800 text-slate-300"
  };
  
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${variants[variant as keyof typeof variants]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const Input: React.FC<any> = ({ label, type = "text", value, onChange, placeholder, className = "", ...props }) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    {label && <label className="text-xs font-medium text-slate-400 ml-1 uppercase tracking-wide">{label}</label>}
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600"
      {...props}
    />
  </div>
);

export const Select: React.FC<any> = ({ label, value, onChange, options, className = "" }) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
     {label && <label className="text-xs font-medium text-slate-400 ml-1 uppercase tracking-wide">{label}</label>}
     <div className="relative">
       <select
         value={value}
         onChange={onChange}
         className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 appearance-none"
       >
         {options.map((opt: any) => (
           <option key={opt.value} value={opt.value} className="bg-slate-900">{opt.label}</option>
         ))}
       </select>
       <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
     </div>
  </div>
);

// --- Advanced Bank Card (Pure Black Premium) ---

export const BankCard: React.FC<{ card: CardType; showDetails?: boolean }> = ({ card }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const { notify } = useAuth();

  const handleCopy = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text.replace(/\s/g, ''));
    notify('info', 'Номер скопійовано');
  };

  return (
    <div 
      className="perspective-1000 w-full aspect-[1.586] cursor-pointer group select-none"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        
        {/* FRONT */}
        <div className={`absolute w-full h-full backface-hidden rounded-2xl p-6 text-white shadow-2xl overflow-hidden bg-[#0a0a0a] border border-white/5 ${card.isBlocked ? 'grayscale opacity-75' : ''}`}>
           {/* Subtle Texture */}
           <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
           {/* Premium Shine */}
           <div className="absolute -inset-[100%] top-0 block h-[200%] w-[200%] -rotate-45 translate-x-[-100%] animate-shine bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"></div>

           <div className="flex justify-between items-start h-full flex-col z-10 relative">
             <div className="flex justify-between w-full items-center">
               <span className="font-bold text-lg tracking-wider flex items-center gap-2">
                 VovaBank
               </span>
               <span className="text-xs opacity-60 font-medium tracking-widest uppercase">{card.tier}</span>
             </div>
             
             <div className="my-auto flex items-center gap-4">
               <div className="w-12 h-9 bg-gradient-to-br from-yellow-100/80 to-yellow-600/80 rounded-md flex items-center justify-center shadow-inner">
                 <div className="w-8 h-5 border border-black/30 rounded-[2px]"></div>
               </div>
               <Wifi className="rotate-90 opacity-50" size={24} />
             </div>

             <div className="w-full">
               <div className="flex items-center gap-3">
                 <div className="font-mono text-xl md:text-2xl tracking-widest drop-shadow-md text-slate-100">{card.number}</div>
                 <button onClick={(e) => handleCopy(e, card.number)} className="p-1 hover:bg-white/10 rounded transition-colors opacity-50 hover:opacity-100">
                    <Copy size={14} />
                 </button>
               </div>
               <div className="flex justify-between items-end mt-4">
                 <div className="flex flex-col">
                   <span className="text-[8px] uppercase opacity-50 tracking-widest">Valid Thru</span>
                   <span className="font-mono text-sm">{card.expiry}</span>
                 </div>
                 <div className="flex items-center gap-2">
                     <span className="text-lg font-bold italic opacity-80">{card.type}</span>
                     {card.isBlocked && <span className="text-red-400 font-bold uppercase text-[10px] border border-red-500/50 px-1.5 py-0.5 rounded">Blocked</span>}
                 </div>
               </div>
             </div>
           </div>
        </div>

        {/* BACK - Minimalist */}
        <div className={`absolute w-full h-full backface-hidden rotate-y-180 rounded-2xl bg-[#0a0a0a] text-white shadow-2xl overflow-hidden border border-white/5`}>
          <div className="w-full h-12 bg-black mt-6"></div>
          <div className="p-6">
            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center gap-2">
                 <span className="text-[8px] uppercase opacity-40">Authorized Signature</span>
                 <div className="w-32 h-8 bg-white/10 rounded-sm"></div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[8px] uppercase opacity-40 mr-1">CVV</span>
                <span className="font-mono text-slate-900 bg-white px-3 py-1 rounded text-sm font-bold shadow-inner">
                    {card.cvv}
                </span>
              </div>
            </div>
            
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                 <div className="text-[8px] text-slate-600 uppercase tracking-widest">
                     Premium Banking
                 </div>
                 <div className="text-[8px] text-slate-600">
                     vovabank.ua
                 </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl animate-scale-in overflow-hidden">
        <div className="flex justify-between items-center p-5 border-b border-slate-800 bg-slate-800/30">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto">
           {children}
        </div>
      </div>
    </div>
  );
};