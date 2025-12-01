import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/storage';
import { Button, Input } from '../components/UI';
import { CreditCard, CheckCircle, AlertCircle } from 'lucide-react';

export const Transfers = () => {
  const { user, refreshUser } = useAuth();
  const [cardNumber, setCardNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const parts = [];
    for (let i = 0; i < v.length; i += 4) {
      parts.push(v.substr(i, 4));
    }
    return parts.length > 1 ? parts.join(' ') : value;
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.length <= 19) {
      setCardNumber(formatCardNumber(val));
    }
  };

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setStatus('idle');
    setMsg('');

    try {
      StorageService.transfer(user.id, cardNumber, Number(amount), description || 'Переказ коштів');
      refreshUser();
      setStatus('success');
      setMsg('Переказ успішно виконано!');
      setAmount('');
      setCardNumber('');
      setDescription('');
    } catch (err: any) {
      setStatus('error');
      setMsg(err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6">Переказ на картку</h2>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
        {/* Card Visualization Input */}
        <div className="mb-8 relative">
           <div className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-xl p-6 h-48 flex flex-col justify-between border border-slate-600">
              <div className="flex justify-between items-start">
                  <span className="text-slate-400 uppercase text-xs tracking-wider">Номер картки отримувача</span>
                  <CreditCard className="text-slate-500" />
              </div>
              <input 
                type="text" 
                value={cardNumber}
                onChange={handleCardChange}
                placeholder="0000 0000 0000 0000"
                className="bg-transparent border-b-2 border-slate-500 focus:border-blue-500 outline-none text-2xl font-mono text-white placeholder-slate-600 w-full pb-2 transition-colors"
              />
           </div>
        </div>

        <form onSubmit={handleTransfer} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Сума (UAH)"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e: any) => setAmount(e.target.value)}
              className="text-lg"
            />
            <Input 
              label="Призначення платежу"
              placeholder="Наприклад: За обід"
              value={description}
              onChange={(e: any) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between pt-4">
             <div className="text-sm text-slate-400">
               Комісія: <span className="text-white font-bold">0 ₴</span>
             </div>
             <Button type="submit" variant="primary" className="px-8 py-3 text-lg shadow-blue-900/20">
               Надіслати кошти
             </Button>
          </div>
        </form>

        {status === 'success' && (
          <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-emerald-400 animate-fade-in">
            <CheckCircle />
            <span>{msg}</span>
          </div>
        )}
        
        {status === 'error' && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 animate-fade-in">
            <AlertCircle />
            <span>{msg}</span>
          </div>
        )}
      </div>

      <div className="mt-8 text-center text-slate-500 text-sm">
        <p>Ліміт на транзакцію: 29,999 ₴</p>
        <p>Гроші зараховуються миттєво</p>
      </div>
    </div>
  );
};