import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/storage';
import { Card } from '../types';
import { Button, BankCard, Modal, Input } from '../components/UI';
import { Plus, Trash2, Lock, Unlock, CreditCard, RefreshCw, Camera, Check, AlertCircle } from 'lucide-react';

const VerificationWizard = ({ onComplete, onClose }: any) => {
  const [step, setStep] = useState(1);
  const [age, setAge] = useState('');
  const [income, setIncome] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const nextStep = () => {
    if (step === 1 && parseInt(age) < 14) {
      alert("Вибачте, картки доступні лише з 14 років.");
      return;
    }
    setStep(step + 1);
  };

  const startScan = () => {
    setIsScanning(true);
    // Simulate scan
    let p = 0;
    const interval = setInterval(() => {
      p += 2;
      setScanProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 500);
      }
    }, 50);
  };

  return (
    <div className="text-center">
      {step === 1 && (
        <div className="space-y-4 animate-fade-in">
          <h3 className="text-lg font-bold text-white">Крок 1: Вік</h3>
          <p className="text-slate-400 text-sm">Вам має бути 14 років або більше.</p>
          <Input type="number" placeholder="Ваш вік" value={age} onChange={(e: any) => setAge(e.target.value)} />
          <Button onClick={nextStep} disabled={!age} className="w-full">Далі</Button>
        </div>
      )}
      {step === 2 && (
        <div className="space-y-4 animate-fade-in">
          <h3 className="text-lg font-bold text-white">Крок 2: Дохід</h3>
          <p className="text-slate-400 text-sm">Вкажіть ваш приблизний місячний дохід.</p>
          <Input type="number" placeholder="Сума в грн" value={income} onChange={(e: any) => setIncome(e.target.value)} />
          <Button onClick={nextStep} disabled={!income} className="w-full">Далі</Button>
        </div>
      )}
      {step === 3 && (
        <div className="space-y-6 animate-fade-in">
          <h3 className="text-lg font-bold text-white">Крок 3: Верифікація</h3>
          <p className="text-slate-400 text-sm">Нам потрібно просканувати ваші документи через камеру.</p>
          
          <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden border border-slate-700 flex items-center justify-center">
             {!isScanning ? (
               <Camera size={48} className="text-slate-600" />
             ) : (
                <>
                  <div className="absolute inset-0 bg-emerald-500/10 z-10 animate-pulse"></div>
                  <video className="w-full h-full object-cover opacity-50" autoPlay loop muted>
                     {/* Fake video feed fallback */}
                  </video>
                  <div className="absolute top-1/2 left-0 w-full h-0.5 bg-red-500 shadow-[0_0_15px_rgba(239,68,68,1)] animate-scan-line"></div>
                </>
             )}
          </div>

          {!isScanning ? (
             <Button onClick={startScan} variant="primary" className="w-full">Почати сканування</Button>
          ) : (
             <div className="w-full bg-slate-800 rounded-full h-2">
               <div className="bg-blue-500 h-2 rounded-full transition-all duration-100" style={{ width: `${scanProgress}%` }}></div>
             </div>
          )}
        </div>
      )}
    </div>
  );
};

export const CardsPage = () => {
  const { user, notify } = useAuth();
  const [cards, setCards] = useState<Card[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [selectedTier, setSelectedTier] = useState<'SILVER' | 'GOLD' | 'PLATINUM'>('SILVER');
  const [newCvv, setNewCvv] = useState('');

  // Verification State
  const [needsVerification, setNeedsVerification] = useState(false);

  useEffect(() => {
    if (user) setCards(StorageService.getUserCards(user.id));
  }, [user]);

  const initiateCreate = () => {
    if (!user?.isVerified) {
      setNeedsVerification(true);
      setIsCreateModalOpen(true);
    } else {
      setNeedsVerification(false);
      setIsCreateModalOpen(true);
    }
  };

  const handleVerificationComplete = () => {
    if (user) {
      StorageService.verifyUser(user.id);
      user.isVerified = true; // Optimistic update
      setNeedsVerification(false);
      notify('success', 'Верифікацію пройдено успішно!');
    }
  };

  const handleCreateCard = () => {
    if (user) {
      StorageService.createCard(user.id, selectedTier);
      setCards(StorageService.getUserCards(user.id));
      setIsCreateModalOpen(false);
      notify('success', `Картку ${selectedTier} успішно створено!`);
    }
  };

  const openCardDetails = (card: Card) => {
    setSelectedCard(card);
    setNewCvv('');
    setIsDetailsModalOpen(true);
  };

  const updateCardSettings = (action: 'cvv' | 'block' | 'delete') => {
    if (!selectedCard) return;

    if (action === 'cvv') {
      if(newCvv.length !== 3) return notify('error', 'CVV має бути 3 цифри');
      StorageService.updateCard(selectedCard.id, { cvv: newCvv });
      notify('success', 'CVV код змінено');
      setSelectedCard({ ...selectedCard, cvv: newCvv });
      setNewCvv('');
    }
    if (action === 'block') {
      const newState = !selectedCard.isBlocked;
      StorageService.updateCard(selectedCard.id, { isBlocked: newState });
      notify('info', newState ? 'Картку заблоковано' : 'Картку розблоковано');
      setSelectedCard({ ...selectedCard, isBlocked: newState });
    }
    if (action === 'delete') {
      if (confirm('Ви впевнені? Це незворотно.')) {
        StorageService.deleteCard(selectedCard.id);
        setCards(cards.filter(c => c.id !== selectedCard.id));
        setIsDetailsModalOpen(false);
        notify('success', 'Картку видалено');
      }
    }
    // Refresh main list
    if (user) setCards(StorageService.getUserCards(user.id));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-3xl font-bold text-white">Мої Картки</h2>
           <p className="text-slate-400">Керуйте своїми рахунками та налаштуваннями безпеки.</p>
        </div>
        <Button onClick={initiateCreate} variant="primary" className="shadow-lg shadow-blue-600/20">
          <Plus size={20} /> <span className="hidden sm:inline">Нова картка</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cards.map((c) => (
           <div key={c.id} className="flex flex-col gap-4 animate-fade-in-up">
              <BankCard card={c} />
              <div className="grid grid-cols-2 gap-2">
                 <Button onClick={() => openCardDetails(c)} variant="secondary" className="text-sm py-2 bg-slate-800">
                    Налаштування
                 </Button>
                 <Button 
                    onClick={() => {
                        setSelectedCard(c);
                        updateCardSettings('block');
                    }} 
                    variant={c.isBlocked ? 'success' : 'danger'} 
                    className="text-sm py-2 bg-opacity-20 hover:bg-opacity-30 border border-current"
                 >
                    {c.isBlocked ? 'Розблокувати' : 'Заблокувати'}
                 </Button>
              </div>
           </div>
        ))}
        {cards.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-800 rounded-3xl">
             <CreditCard size={48} className="mx-auto text-slate-600 mb-4" />
             <p className="text-slate-400">У вас немає активних карток.</p>
             <Button onClick={initiateCreate} variant="ghost" className="mt-4 text-blue-400">Створити першу картку</Button>
          </div>
        )}
      </div>

      {/* Creation / Verification Modal */}
      <Modal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        title={needsVerification ? "Верифікація особи" : "Оберіть тип картки"}
      >
        {needsVerification ? (
          <VerificationWizard onComplete={handleVerificationComplete} />
        ) : (
          <div className="space-y-4">
             <div className="grid grid-cols-3 gap-2">
               {['SILVER', 'GOLD', 'PLATINUM'].map((t) => (
                 <div 
                   key={t}
                   onClick={() => setSelectedTier(t as any)}
                   className={`
                     cursor-pointer p-4 rounded-xl text-center border transition-all
                     ${selectedTier === t ? 'border-blue-500 bg-blue-500/10 ring-1 ring-blue-500' : 'border-slate-700 bg-slate-800 hover:bg-slate-700'}
                   `}
                 >
                   <div className={`w-full h-8 mb-2 rounded ${
                     t === 'SILVER' ? 'bg-gradient-to-br from-slate-400 to-slate-600' :
                     t === 'GOLD' ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                     'bg-gradient-to-br from-slate-800 to-black border border-white/20'
                   }`}></div>
                   <span className="text-xs font-bold text-white">{t}</span>
                 </div>
               ))}
             </div>
             
             <div className="bg-slate-800/50 p-4 rounded-xl text-sm text-slate-400">
                <p className="flex justify-between mb-1"><span>Вартість відкриття:</span> <span className="text-white">Безкоштовно</span></p>
                <p className="flex justify-between"><span>Обслуговування:</span> <span className="text-white">0 ₴/міс</span></p>
             </div>

             <Button onClick={handleCreateCard} className="w-full h-12 text-lg">Підтвердити</Button>
          </div>
        )}
      </Modal>

      {/* Details Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Налаштування картки"
      >
        {selectedCard && (
           <div className="space-y-6">
              <div className="bg-slate-800 p-4 rounded-xl flex items-center justify-between">
                 <div>
                    <p className="text-xs text-slate-500">Баланс картки</p>
                    <p className="text-xl font-bold text-white">Спільний з рахунком</p>
                 </div>
                 <div className={`px-3 py-1 rounded-full text-xs font-bold ${selectedCard.isBlocked ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                    {selectedCard.isBlocked ? 'BLOCKED' : 'ACTIVE'}
                 </div>
              </div>

              <div className="space-y-3">
                 <h4 className="text-sm font-bold text-white uppercase opacity-70">Безпека</h4>
                 
                 <div className="flex gap-2 items-end">
                    <Input 
                       label="Змінити CVV" 
                       placeholder="123" 
                       maxLength={3} 
                       value={newCvv} 
                       onChange={(e: any) => setNewCvv(e.target.value)} 
                       className="flex-1"
                    />
                    <Button onClick={() => updateCardSettings('cvv')} disabled={newCvv.length !== 3}>ОК</Button>
                 </div>

                 <Button 
                   onClick={() => updateCardSettings('block')} 
                   variant="secondary" 
                   className="w-full justify-start text-left"
                 >
                   {selectedCard.isBlocked ? <Unlock size={18} /> : <Lock size={18} />}
                   {selectedCard.isBlocked ? 'Розблокувати картку' : 'Тимчасово заблокувати'}
                 </Button>

                 <Button 
                   onClick={() => updateCardSettings('delete')} 
                   variant="danger" 
                   className="w-full justify-start text-left bg-opacity-10 text-red-400 hover:bg-opacity-20 border border-transparent hover:border-red-500/30"
                 >
                   <Trash2 size={18} /> Закрити картку назавжди
                 </Button>
              </div>
           </div>
        )}
      </Modal>
    </div>
  );
};