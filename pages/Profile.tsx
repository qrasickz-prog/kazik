import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { StorageService, JOBS_LIST } from '../services/storage';
import { Button, Input, Modal } from '../components/UI';
import { MapPin, Briefcase, Calendar, ShieldCheck, Edit2, Camera, Upload } from 'lucide-react';

export const ProfilePage = () => {
  const { user, refreshUser, notify } = useAuth();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
      fullName: '',
      location: '',
      bio: '',
      avatarUrl: ''
  });

  const history = user ? StorageService.getHistory(user.id) : [];
  const myJob = user?.jobId ? JOBS_LIST.find(j => j.id === user.jobId) : null;

  const openEdit = () => {
      if(user) {
          setEditForm({
              fullName: user.fullName,
              location: user.location || '',
              bio: user.bio || '',
              avatarUrl: user.avatarUrl || ''
          });
          setIsEditOpen(true);
      }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setEditForm(prev => ({...prev, avatarUrl: reader.result as string}));
          };
          reader.readAsDataURL(file);
      }
  };

  const saveProfile = () => {
      if(user) {
          StorageService.updateUser(user.id, editForm);
          refreshUser();
          setIsEditOpen(false);
          notify('success', 'Профіль оновлено');
      }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      
      {/* Profile Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-900/50 to-slate-900/50"></div>
        <div className="relative pt-12 flex flex-col md:flex-row items-end md:items-center gap-6">
            <div className="relative group">
                <img 
                    src={user?.avatarUrl} 
                    className="w-32 h-32 rounded-3xl border-4 border-slate-900 shadow-2xl object-cover bg-slate-800" 
                    alt="Profile" 
                />
                <button onClick={openEdit} className="absolute bottom-[-10px] right-[-10px] bg-blue-600 p-2 rounded-xl text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                    <Edit2 size={16} />
                </button>
            </div>
            <div className="flex-1 mb-2">
                <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                    {user?.fullName} 
                    {user?.isVerified && <ShieldCheck className="text-blue-500" size={24} />}
                </h1>
                <p className="text-slate-400">@{user?.username}</p>
                <div className="flex gap-4 mt-3 text-sm text-slate-300">
                    <span className="flex items-center gap-1"><MapPin size={14}/> {user?.location || 'Україна'}</span>
                    <span className="flex items-center gap-1"><Briefcase size={14}/> {myJob ? myJob.title : 'Безробітний'}</span>
                    <span className="flex items-center gap-1"><Calendar size={14}/> З нами з {new Date(user?.createdAt || '').getFullYear()}</span>
                </div>
            </div>
            <Button onClick={openEdit} variant="secondary">Редагувати</Button>
        </div>
        
        {user?.bio && (
            <div className="mt-8 pt-6 border-t border-slate-800">
                <h3 className="text-sm font-bold text-slate-500 uppercase mb-2">Про себе</h3>
                <p className="text-slate-300 italic">"{user.bio}"</p>
            </div>
        )}
      </div>

      {/* Transaction History */}
      <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-6">Фінансова Історія</h3>
        <div className="space-y-4">
          {history.map((t: any) => (
            <div key={t.id} className="flex justify-between items-center border-b border-slate-800 pb-4 last:border-0 last:pb-0 hover:bg-slate-800/30 p-2 rounded-lg transition-colors">
               <div>
                 <div className="text-white font-medium">{t.description}</div>
                 <div className="text-slate-500 text-xs mt-1 font-mono">{new Date(t.date).toLocaleString()}</div>
               </div>
               <div className={`font-bold font-mono ${['DEPOSIT', 'SALARY', 'GAME'].includes(t.type) && (!t.description.includes('Програш')) || t.toUserId === user?.id ? 'text-emerald-400' : 'text-slate-400'}`}>
                 {['DEPOSIT', 'SALARY', 'GAME'].includes(t.type) && (!t.description.includes('Програш')) || t.toUserId === user?.id ? '+' : '-'}{t.amount.toFixed(2)} ₴
               </div>
            </div>
          ))}
          {history.length === 0 && <p className="text-slate-500 text-center py-4">Історія порожня</p>}
        </div>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Редагування профілю">
          <div className="space-y-4">
              <div className="flex flex-col items-center mb-4">
                  <div className="w-24 h-24 rounded-2xl bg-slate-800 mb-2 overflow-hidden border border-slate-700">
                      {editForm.avatarUrl && <img src={editForm.avatarUrl} className="w-full h-full object-cover" />}
                  </div>
                  <label className="cursor-pointer bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-lg text-xs text-white flex items-center gap-2">
                      <Upload size={12} /> Завантажити фото
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  </label>
              </div>

              <Input label="Повне ім'я" value={editForm.fullName} onChange={(e: any) => setEditForm({...editForm, fullName: e.target.value})} />
              <Input label="Місто / Локація" value={editForm.location} onChange={(e: any) => setEditForm({...editForm, location: e.target.value})} />
              <Input label="Біографія" value={editForm.bio} onChange={(e: any) => setEditForm({...editForm, bio: e.target.value})} />
              
              <Button onClick={saveProfile} className="w-full h-12">Зберегти зміни</Button>
          </div>
      </Modal>

    </div>
  );
};