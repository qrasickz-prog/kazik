import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { StorageService, JOBS_LIST } from '../services/storage';
import { JobPosition } from '../types';
import { Button } from '../components/UI';
import { Briefcase, Zap, AlertTriangle, CheckCircle, MousePointer2, TrendingUp, X, Target, DollarSign, Clock } from 'lucide-react';

// --- GAME LOGIC COMPONENT ---
const WorkTerminal = ({ job, onClose, onComplete, notify }: any) => {
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'RESULT'>('IDLE');
  const [cursorPos, setCursorPos] = useState(0); 
  const [direction, setDirection] = useState(1); 
  const [targetZone, setTargetZone] = useState({ start: 0, width: 20 });
  const animationRef = useRef<number>();

  const ZONE_WIDTH = Math.max(5, 25 - (job.difficulty || 0) * 1.5); // Harder jobs = smaller zone
  const SPEED = 0.5 + (job.speed || 1) * 0.3; // Harder jobs = faster speed

  const startGame = () => {
    setGameState('PLAYING');
    setCursorPos(0);
    setDirection(1);
    const maxStart = 100 - ZONE_WIDTH;
    const start = Math.random() * maxStart;
    setTargetZone({ start, width: ZONE_WIDTH });
  };

  useEffect(() => {
    if (gameState === 'PLAYING') {
      const update = () => {
        setCursorPos(prev => {
           let next = prev + (SPEED * direction);
           if (next >= 100) {
             next = 100;
             setDirection(-1);
           } else if (next <= 0) {
             next = 0;
             setDirection(1);
           }
           return next;
        });
        animationRef.current = requestAnimationFrame(update);
      };
      animationRef.current = requestAnimationFrame(update);
    }
    return () => cancelAnimationFrame(animationRef.current!);
  }, [gameState, direction, SPEED]);

  const handleStop = () => {
    if (gameState !== 'PLAYING') return;
    setGameState('RESULT');
    cancelAnimationFrame(animationRef.current!);

    const hit = cursorPos >= targetZone.start && cursorPos <= (targetZone.start + targetZone.width);
    
    if (hit) {
       onComplete(job.perClick);
       notify('success', `ЗАВДАННЯ ВИКОНАНО: +${job.perClick} ₴`);
       setTimeout(() => startGame(), 600); 
    } else {
       notify('error', 'ПОМИЛКА СИНХРОНІЗАЦІЇ');
       setTimeout(() => startGame(), 600); 
    }
  };

  useEffect(() => {
    startGame();
    return () => cancelAnimationFrame(animationRef.current!);
  }, []);

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in rounded-3xl">
       <div className="w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-emerald-400 to-blue-600 animate-pulse"></div>

          <div className="flex justify-between items-center mb-6">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-black/50 rounded flex items-center justify-center border border-zinc-700">{job.icon}</div>
                <div>
                   <h3 className="font-bold text-white text-sm uppercase tracking-wider">{job.title}</h3>
                   <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                      <p className="text-[10px] text-emerald-400 font-mono">SYSTEM_ONLINE</p>
                   </div>
                </div>
             </div>
             <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors bg-zinc-800 p-2 rounded-lg"><X size={16}/></button>
          </div>

          <div className="bg-black rounded-xl border border-zinc-800 p-6 mb-6">
             <div className="flex justify-between text-[10px] text-zinc-500 font-mono uppercase mb-2">
                <span>Signal Strength</span>
                <span>{SPEED.toFixed(1)}x Speed</span>
             </div>
             
             {/* The Bar Container */}
             <div className="h-12 bg-zinc-900 rounded-lg border border-zinc-700 relative overflow-hidden">
                {/* Target Zone */}
                <div 
                   className="absolute top-0 bottom-0 bg-emerald-500/20 border-l-2 border-r-2 border-emerald-500 transition-all duration-300"
                   style={{ left: `${targetZone.start}%`, width: `${targetZone.width}%` }}
                >
                    <div className="absolute inset-0 bg-emerald-400/10 animate-pulse"></div>
                </div>
                
                {/* Cursor */}
                <div 
                   className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_rgba(255,255,255,1)] z-10"
                   style={{ left: `${cursorPos}%` }}
                ></div>
             </div>
          </div>

          <Button 
            onClick={handleStop}
            className="w-full h-14 text-sm font-bold tracking-[0.2em] bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] border-0"
          >
             EXECUTE
          </Button>
       </div>
    </div>
  );
};

// --- MAIN PAGE ---

export const WorkPage = () => {
  const { user, refreshUser, notify } = useAuth();
  const [selectedJob, setSelectedJob] = useState<JobPosition | null>(null);
  const [isGameOpen, setIsGameOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const myJob = user?.jobId ? JOBS_LIST.find(j => j.id === user.jobId) : null;
  const canCollectSalary = user?.lastDailySalary ? new Date(user.lastDailySalary).getDate() !== new Date().getDate() : true;

  useEffect(() => {
    if (myJob && !selectedJob) setSelectedJob(myJob);
    else if (!selectedJob && JOBS_LIST.length > 0) setSelectedJob(JOBS_LIST[0]);
  }, [myJob]);

  const handleEmploy = () => {
    if (!user || !selectedJob) return;
    StorageService.employUser(user.id, selectedJob.id);
    refreshUser();
    notify('success', `Вітаємо! Ви прийняті на посаду: ${selectedJob.title}`);
  };

  const handleCollectSalary = () => {
    if (!user || !myJob) return;
    StorageService.collectSalary(user.id, myJob.salary);
    refreshUser();
    notify('success', `Отримано ставку: ${myJob.salary} ₴`);
  };

  const handleTaskComplete = (amount: number) => {
    if (!user) return;
    StorageService.doWorkTask(user.id, amount, 'Task');
    refreshUser();
  };

  const isMyJobSelected = selectedJob?.id === myJob?.id;

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col overflow-hidden animate-fade-in">
      <div className="mb-4 flex-shrink-0">
         <h2 className="text-3xl font-bold flex items-center gap-3">
            <Briefcase className="text-blue-500" /> Центр Зайнятості
         </h2>
         <p className="text-slate-500 text-sm">Оберіть вакансію або виконуйте обов'язки.</p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        
        {/* LEFT COLUMN: JOB LIST (Scrollable) */}
        <div className="lg:col-span-4 flex flex-col gap-2 overflow-y-auto pr-2 custom-scrollbar pb-20" ref={scrollRef}>
           {JOBS_LIST.map((job) => {
             const isSelected = selectedJob?.id === job.id;
             const isMine = myJob?.id === job.id;
             
             return (
               <div 
                 key={job.id}
                 onClick={() => setSelectedJob(job)}
                 className={`
                    group relative p-4 rounded-xl border cursor-pointer transition-all duration-200
                    ${isSelected 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 border-blue-500' 
                        : 'glass-panel hover:bg-slate-100 dark:hover:bg-white/5 border-border'}
                 `}
               >
                  {isMine && (
                      <div className="absolute top-2 right-2 flex items-center gap-1 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                          <span className="text-[10px] font-bold text-emerald-500 uppercase">My Job</span>
                      </div>
                  )}
                  
                  <div className="flex items-center gap-4">
                     <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-colors ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800'}`}>
                        {job.icon}
                     </div>
                     <div className="flex-1 min-w-0">
                        <h4 className={`font-bold truncate ${isSelected ? 'text-white' : ''}`}>{job.title}</h4>
                        <div className="flex items-center gap-3 mt-1 opacity-80">
                           <span className="text-xs">{job.category}</span>
                           <span className="text-xs font-mono opacity-70">Lvl {job.requiredLevel}</span>
                        </div>
                     </div>
                  </div>
               </div>
             );
           })}
        </div>

        {/* RIGHT COLUMN: DETAILS PANEL (Sticky/Fixed) */}
        <div className="lg:col-span-8 h-full flex flex-col min-h-0 relative">
           {selectedJob ? (
             <div className="h-full glass-panel rounded-3xl p-6 md:p-8 relative overflow-hidden flex flex-col shadow-2xl">
                
                {isGameOpen && isMyJobSelected && (
                    <WorkTerminal 
                        job={selectedJob} 
                        onClose={() => setIsGameOpen(false)} 
                        onComplete={handleTaskComplete} 
                        notify={notify}
                    />
                )}

                <div className="relative z-10 flex-1 flex flex-col">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-8">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-300 dark:from-slate-800 dark:to-black rounded-2xl flex items-center justify-center text-4xl shadow-inner border border-border">
                                {selectedJob.icon}
                            </div>
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold mb-1">{selectedJob.title}</h2>
                                <div className="flex gap-2">
                                    <span className="bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded text-xs font-bold border border-blue-500/20">{selectedJob.category}</span>
                                    <span className="bg-slate-500/10 text-slate-500 px-2 py-0.5 rounded text-xs font-bold border border-slate-500/20">Рівень {selectedJob.requiredLevel}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="text-right hidden md:block">
                             <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Складність</div>
                             <div className="flex items-center justify-end gap-1">
                                {[1,2,3,4,5].map(i => (
                                    <div key={i} className={`w-1.5 h-6 rounded-full transition-all ${i <= (selectedJob.difficulty || 0)/2 ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-slate-200 dark:bg-slate-800'}`}></div>
                                ))}
                             </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <div className="bg-slate-50 dark:bg-white/5 p-5 rounded-2xl border border-border flex items-center gap-4 hover:border-blue-500/30 transition-colors">
                             <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
                                <Clock size={24} />
                             </div>
                             <div>
                                <div className="text-xs text-slate-500 uppercase font-bold">Ставка в день</div>
                                <div className="text-2xl font-mono font-bold tracking-tight">{selectedJob.salary} ₴</div>
                             </div>
                        </div>
                        <div className="bg-slate-50 dark:bg-white/5 p-5 rounded-2xl border border-border flex items-center gap-4 hover:border-emerald-500/30 transition-colors">
                             <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
                                <Target size={24} />
                             </div>
                             <div>
                                <div className="text-xs text-slate-500 uppercase font-bold">Оплата за дію</div>
                                <div className="text-2xl font-mono font-bold tracking-tight">+{selectedJob.perClick} ₴</div>
                             </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-white/5 p-5 rounded-2xl border border-border mb-8">
                        <h4 className="text-sm font-bold mb-2 flex items-center gap-2">
                            <AlertTriangle size={16} className="text-yellow-500"/> Вимоги
                        </h4>
                        <p className="text-sm text-slate-500 leading-relaxed">
                             Ця робота вимагає високої концентрації. Ви повинні проходити перевірку навиків (QTE) для виконання кожного завдання. Чим вища зарплата — тим складніше завдання.
                        </p>
                    </div>

                    {/* Actions Area */}
                    <div className="mt-auto">
                        {isMyJobSelected ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-sm mb-2 px-1">
                                    <span className="text-slate-500">Статус контракту:</span>
                                    <span className="text-emerald-500 font-bold flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full"><CheckCircle size={12}/> ПІДПИСАНО</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Button 
                                        onClick={handleCollectSalary}
                                        disabled={!canCollectSalary}
                                        className={`h-14 font-bold border border-border ${!canCollectSalary ? 'opacity-50 grayscale bg-slate-100 dark:bg-white/5 text-slate-500' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
                                    >
                                        <DollarSign size={20} className="mr-2"/>
                                        {canCollectSalary ? 'Забрати ставку' : 'Вже отримано'}
                                    </Button>
                                    <Button 
                                        onClick={() => setIsGameOpen(true)}
                                        className="h-14 bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-[0_4px_20px_rgba(16,185,129,0.3)]"
                                    >
                                        <Zap className="mr-2" size={20} /> Працювати
                                    </Button>
                                </div>
                            </div>
                        ) : (
                             <Button 
                                onClick={handleEmploy}
                                variant="primary"
                                className="w-full h-14 text-lg font-bold shadow-lg"
                             >
                                Підписати контракт
                             </Button>
                        )}
                    </div>
                </div>
             </div>
           ) : (
             <div className="h-full flex flex-col items-center justify-center text-slate-400 glass-panel rounded-3xl p-8 border-dashed border-2">
                <Briefcase size={48} className="mb-4 opacity-50" />
                <p>Оберіть вакансію зі списку ліворуч,</p>
                <p>щоб переглянути деталі.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};