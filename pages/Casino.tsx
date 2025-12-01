import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/storage';
import { Button } from '../components/UI';
import { Dice5, Zap, DollarSign, ArrowUp, ArrowDown, Disc, Coins } from 'lucide-react';

// --- SLOTS ---
const SlotsGame = ({ user, refreshUser, notify }: any) => {
  const [bet, setBet] = useState(10);
  const [reels, setReels] = useState(['🍒', '🍋', '🍇']);
  const [isSpinning, setIsSpinning] = useState(false);
  
  const ICONS = ['🍒', '🍋', '🍇', '💎', '7️⃣'];

  const spin = () => {
    if (user.balance < bet) return notify('error', 'Недостатньо коштів');
    setIsSpinning(true);

    let intervals: any[] = [];
    const newReels = [...reels];

    [0, 1, 2].forEach((i) => {
      intervals[i] = setInterval(() => {
        newReels[i] = ICONS[Math.floor(Math.random() * ICONS.length)];
        setReels([...newReels]);
      }, 100 + i * 50);
    });

    setTimeout(() => {
      intervals.forEach(clearInterval);
      const finalReels = [
        ICONS[Math.floor(Math.random() * ICONS.length)],
        ICONS[Math.floor(Math.random() * ICONS.length)],
        ICONS[Math.floor(Math.random() * ICONS.length)]
      ];
      setReels(finalReels);
      setIsSpinning(false);

      let multiplier = 0;
      if (finalReels[0] === finalReels[1] && finalReels[1] === finalReels[2]) {
        if (finalReels[0] === '7️⃣') multiplier = 20;
        else if (finalReels[0] === '💎') multiplier = 10;
        else multiplier = 5;
      } else if (finalReels[0] === finalReels[1] || finalReels[1] === finalReels[2] || finalReels[0] === finalReels[2]) {
        multiplier = 0.5; // Return half bet
      }

      StorageService.playCasino(user.id, bet, multiplier, 'Slots');
      refreshUser();
      if (multiplier > 1) notify('success', `Джекпот! +${(bet * multiplier).toFixed(0)} ₴`);
      else if (multiplier === 0.5) notify('info', 'Пара! Половина ставки повернута.');
      else notify('error', 'Ви програли');
      
    }, 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-700 p-8 rounded-3xl relative overflow-hidden text-center max-w-md w-full mx-auto">
       <h3 className="text-2xl font-bold text-yellow-400 mb-6 flex items-center justify-center gap-2">
         <Zap /> SUPER SLOTS <Zap />
       </h3>
       <div className="flex justify-center gap-4 mb-8">
          {reels.map((icon, i) => (
            <div key={i} className="w-20 h-24 bg-slate-800 border-2 border-yellow-500/50 rounded-xl flex items-center justify-center text-4xl shadow-inner">
               <div className={isSpinning ? 'animate-bounce' : ''}>{icon}</div>
            </div>
          ))}
       </div>
       <div className="flex items-center justify-center gap-4 mb-6">
          <button onClick={() => setBet(Math.max(5, bet - 5))} className="w-10 h-10 bg-slate-800 rounded-full hover:bg-slate-700">-</button>
          <span className="text-xl font-mono font-bold w-20 text-center">{bet} ₴</span>
          <button onClick={() => setBet(bet + 5)} className="w-10 h-10 bg-slate-800 rounded-full hover:bg-slate-700">+</button>
       </div>
       <Button onClick={spin} disabled={isSpinning || user.balance < bet} className="w-full bg-gradient-to-r from-yellow-600 to-orange-600">
         {isSpinning ? 'Крутимо...' : 'SPIN'}
       </Button>
    </div>
  );
};

// --- COIN FLIP ---
const CoinFlipGame = ({ user, refreshUser, notify }: any) => {
    const [bet, setBet] = useState(10);
    const [flipping, setFlipping] = useState(false);
    
    const play = (choice: 'Heads' | 'Tails') => {
        if (user.balance < bet) return notify('error', 'Недостатньо коштів');
        setFlipping(true);
        setTimeout(() => {
            const result = Math.random() > 0.5 ? 'Heads' : 'Tails';
            const win = result === choice;
            StorageService.playCasino(user.id, bet, win ? 2 : 0, 'CoinFlip');
            refreshUser();
            notify(win ? 'success' : 'error', win ? `Перемога! +${bet} ₴` : 'Програш');
            setFlipping(false);
        }, 1000);
    };

    return (
        <div className="bg-slate-900 border border-slate-700 p-8 rounded-3xl text-center max-w-md w-full mx-auto">
             <h3 className="text-xl font-bold text-white mb-6 flex items-center justify-center gap-2"><Coins /> Орел чи Решка</h3>
             <div className={`w-24 h-24 rounded-full bg-yellow-500 mx-auto mb-8 flex items-center justify-center text-yellow-900 font-bold text-3xl border-4 border-yellow-300 ${flipping ? 'animate-spin' : ''}`}>
                 ₴
             </div>
             <input type="number" value={bet} onChange={e => setBet(Number(e.target.value))} className="w-full bg-slate-800 p-3 rounded-xl text-center mb-4 text-white" />
             <div className="grid grid-cols-2 gap-4">
                 <Button onClick={() => play('Heads')} disabled={flipping}>Орел</Button>
                 <Button onClick={() => play('Tails')} disabled={flipping} variant="secondary">Решка</Button>
             </div>
        </div>
    );
};

// --- ROULETTE (Colors) ---
const RouletteGame = ({ user, refreshUser, notify }: any) => {
    const [bet, setBet] = useState(10);
    const [spinning, setSpinning] = useState(false);

    const play = (color: 'red' | 'black' | 'green') => {
        if (user.balance < bet) return notify('error', 'Недостатньо коштів');
        setSpinning(true);
        setTimeout(() => {
            const r = Math.random();
            let result = 'black';
            if (r < 0.05) result = 'green';
            else if (r < 0.525) result = 'red';
            
            let mult = 0;
            if (result === color) mult = color === 'green' ? 14 : 2;
            
            StorageService.playCasino(user.id, bet, mult, 'Roulette');
            refreshUser();
            notify(mult > 0 ? 'success' : 'error', mult > 0 ? `Випало ${result}! +${bet * mult} ₴` : `Випало ${result}. Програш.`);
            setSpinning(false);
        }, 1000);
    };

    return (
        <div className="bg-slate-900 border border-slate-700 p-8 rounded-3xl text-center max-w-md w-full mx-auto">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center justify-center gap-2"><Disc /> Рулетка</h3>
            <div className={`w-24 h-24 rounded-full border-8 border-slate-700 mx-auto mb-6 flex items-center justify-center bg-gradient-to-br from-red-600 via-green-600 to-black ${spinning ? 'animate-spin' : ''}`}>
               <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <input type="number" value={bet} onChange={e => setBet(Number(e.target.value))} className="w-full bg-slate-800 p-3 rounded-xl text-center mb-4 text-white" />
            <div className="flex gap-2">
                <button onClick={() => play('red')} disabled={spinning} className="flex-1 bg-red-600 hover:bg-red-500 py-3 rounded-xl font-bold text-white">RED x2</button>
                <button onClick={() => play('green')} disabled={spinning} className="w-16 bg-green-600 hover:bg-green-500 py-3 rounded-xl font-bold text-white">0</button>
                <button onClick={() => play('black')} disabled={spinning} className="flex-1 bg-slate-800 hover:bg-slate-700 py-3 rounded-xl font-bold text-white">BLACK x2</button>
            </div>
        </div>
    );
};

export const Casino = () => {
  const { user, refreshUser, notify } = useAuth();
  const [game, setGame] = useState('slots');

  return (
    <div className="flex flex-col items-center py-6 space-y-8 animate-fade-in">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-white mb-2">Vova Casino</h2>
        <p className="text-slate-400">Азартні ігри на віртуальні гривні.</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 p-1 bg-slate-900 rounded-xl border border-slate-800">
         {['slots', 'coin', 'roulette'].map(g => (
             <button 
               key={g}
               onClick={() => setGame(g)} 
               className={`px-6 py-2 rounded-lg transition-all capitalize ${game === g ? 'bg-slate-800 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
             >
               {g}
             </button>
         ))}
      </div>

      <div className="w-full">
        {game === 'slots' && <SlotsGame user={user} refreshUser={refreshUser} notify={notify} />}
        {game === 'coin' && <CoinFlipGame user={user} refreshUser={refreshUser} notify={notify} />}
        {game === 'roulette' && <RouletteGame user={user} refreshUser={refreshUser} notify={notify} />}
      </div>
    </div>
  );
};