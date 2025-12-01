import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Input } from '../components/UI';
import { ShieldCheck, UserPlus, LogIn, ArrowLeft } from 'lucide-react';

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await login(username, password);
      } else {
        if (!fullName) throw new Error("Введіть повне ім'я");
        await register(username, password, fullName);
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <Link to="/" className="absolute top-8 left-8 text-slate-400 hover:text-white flex items-center gap-2 transition-colors z-20">
         <ArrowLeft size={20} /> На головну
      </Link>
      
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5"></div>
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10 animate-scale-in">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-blue-500/20">
            V
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-center text-white mb-2 tracking-tight">
          {isLogin ? 'Особистий кабінет' : 'Новий клієнт'}
        </h2>
        <p className="text-center text-slate-400 mb-8 text-sm">
          {isLogin ? 'Введіть дані для входу' : 'Заповніть анкету для реєстрації'}
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm text-center animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <Input 
              label="Повне Ім'я" 
              placeholder="Іван Петренко" 
              value={fullName} 
              onChange={(e: any) => setFullName(e.target.value)} 
            />
          )}
          <Input 
            label="Логін" 
            placeholder="Ваш логін" 
            value={username} 
            onChange={(e: any) => setUsername(e.target.value)} 
          />
          <Input 
            label="Пароль" 
            type="password" 
            placeholder="••••••••" 
            value={password} 
            onChange={(e: any) => setPassword(e.target.value)} 
          />
          
          <Button variant="primary" className="w-full mt-2 py-3.5 text-lg shadow-blue-500/25" type="submit">
            {isLogin ? <><LogIn size={20} /> Увійти</> : <><UserPlus size={20} /> Створити рахунок</>}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(''); }} 
            className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            {isLogin ? 'Ще немає картки? ' : 'Вже маєте акаунт? '}
            <span className="text-blue-400 underline decoration-blue-400/30 underline-offset-4">{isLogin ? 'Зареєструватися' : 'Увійти'}</span>
          </button>
        </div>
        
        <div className="mt-8 flex items-center justify-center gap-2 text-slate-600 text-[10px] uppercase tracking-widest">
          <ShieldCheck size={12} />
          <span>VovaBank Secure Login</span>
        </div>
      </div>
    </div>
  );
};