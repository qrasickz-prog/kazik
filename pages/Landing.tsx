import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Globe, CreditCard, ArrowRight, Check } from 'lucide-react';
import { Button } from '../components/UI';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-xl font-bold shadow-lg shadow-blue-600/20">V</div>
            <span className="text-xl font-bold tracking-tight">VovaBank</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-slate-300 hover:text-white font-medium transition-colors">Вхід</Link>
            <Link to="/login">
              <Button variant="primary" className="px-6">Стати клієнтом</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative">
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Банкінг <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">Нового Покоління</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-lg">
              Керуйте фінансами, заробляйте та інвестуйте в єдиному цифровому просторі. Без відділень. Без черг. Тільки ви та ваші гроші.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/login">
                <Button className="h-14 px-8 text-lg w-full sm:w-auto">Відкрити рахунок</Button>
              </Link>
              <div className="flex items-center gap-4 px-6 text-slate-400">
                <div className="flex -space-x-3">
                   {[1,2,3,4].map(i => (
                     <div key={i} className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-950 flex items-center justify-center text-xs">
                        {i}k
                     </div>
                   ))}
                </div>
                <span>+150k клієнтів</span>
              </div>
            </div>
          </div>
          
          <div className="relative animate-scale-in">
             <div className="relative z-10 bg-gradient-to-br from-slate-900 to-black p-8 rounded-3xl border border-slate-800 shadow-2xl transform rotate-[-5deg] hover:rotate-0 transition-transform duration-500">
                <div className="flex justify-between items-center mb-12">
                   <div className="text-2xl font-bold">VovaBank</div>
                   <div className="text-sm font-mono opacity-50">PLATINUM</div>
                </div>
                <div className="text-3xl font-mono tracking-widest mb-8">5375 •••• •••• 9921</div>
                <div className="flex justify-between items-end">
                   <div>
                      <div className="text-xs opacity-50 uppercase">Balance</div>
                      <div className="text-2xl font-bold">124,500.00 ₴</div>
                   </div>
                   <div className="w-12 h-8 bg-yellow-500/20 rounded border border-yellow-500/50"></div>
                </div>
             </div>
             <div className="absolute inset-0 bg-blue-600/30 blur-[60px] -z-10"></div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-slate-900/50 border-y border-slate-800">
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 hover:border-blue-500/50 transition-all">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 mb-6">
                     <ShieldCheck size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Надійний захист</h3>
                  <p className="text-slate-400">Ваші дані та кошти захищені сучасними протоколами шифрування.</p>
               </div>
               <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 hover:border-blue-500/50 transition-all">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 mb-6">
                     <Globe size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Працюємо 24/7</h3>
                  <p className="text-slate-400">Доступ до рахунків з будь-якої точки світу в будь-який час.</p>
               </div>
               <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 hover:border-blue-500/50 transition-all">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 mb-6">
                     <CreditCard size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Безкоштовні перекази</h3>
                  <p className="text-slate-400">Миттєві перекази між картками банку без жодних комісій.</p>
               </div>
            </div>
         </div>
      </section>

      {/* Stats / Currency */}
      <section className="py-20 px-6">
         <div className="max-w-5xl mx-auto bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-12 border border-indigo-500/30 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5"></div>
            <h2 className="text-3xl font-bold mb-8 relative z-10">Курс Валют VovaBank</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
               <div className="bg-slate-950/50 p-6 rounded-2xl backdrop-blur">
                  <div className="text-slate-400 text-sm mb-1">USD / UAH</div>
                  <div className="text-2xl font-bold">41.50 ₴</div>
                  <div className="text-emerald-400 text-xs mt-1">▲ 0.5%</div>
               </div>
               <div className="bg-slate-950/50 p-6 rounded-2xl backdrop-blur">
                  <div className="text-slate-400 text-sm mb-1">EUR / UAH</div>
                  <div className="text-2xl font-bold">44.20 ₴</div>
                  <div className="text-emerald-400 text-xs mt-1">▲ 0.2%</div>
               </div>
               <div className="bg-slate-950/50 p-6 rounded-2xl backdrop-blur">
                  <div className="text-slate-400 text-sm mb-1">BTC / USD</div>
                  <div className="text-2xl font-bold">$68,400</div>
                  <div className="text-red-400 text-xs mt-1">▼ 1.2%</div>
               </div>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-12 px-6">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
            <p>© 2024 VovaBank Simulator. Всі права захищені.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
               <a href="#" className="hover:text-white">Ліцензія</a>
               <a href="#" className="hover:text-white">Конфіденційність</a>
               <a href="#" className="hover:text-white">Підтримка</a>
            </div>
         </div>
      </footer>
    </div>
  );
};