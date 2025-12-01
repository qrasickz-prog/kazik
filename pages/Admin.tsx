import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/storage';
import { User, UserRole } from '../types';
import { Button, Input, Modal, Select } from '../components/UI';
import { useNavigate } from 'react-router-dom';
import { Users, DollarSign, ShieldAlert, Search, MapPin } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Edit State
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({
      fullName: '',
      balance: '',
      role: 'USER',
      location: ''
  });

  useEffect(() => {
    if (user?.role !== UserRole.ADMIN) {
      navigate('/dashboard');
      return;
    }
    setUsers(StorageService.getAllUsers());
  }, [user, navigate]);

  const handleEditClick = (u: User) => {
    setEditingUser(u);
    setEditForm({
        fullName: u.fullName,
        balance: u.balance.toString(),
        role: u.role,
        location: u.location || ''
    });
  };

  const saveChanges = () => {
    if (editingUser) {
      StorageService.updateUser(editingUser.id, {
          fullName: editForm.fullName,
          balance: parseFloat(editForm.balance),
          role: editForm.role as UserRole,
          location: editForm.location
      });
      setUsers(StorageService.getAllUsers());
      setEditingUser(null);
    }
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalMoney = users.reduce((acc, curr) => acc + curr.balance, 0);

  // Stats data
  const data = users.map(u => ({
    name: u.username,
    balance: u.balance
  })).sort((a,b) => b.balance - a.balance).slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          <ShieldAlert className="text-red-500" /> Панель Адміністратора
        </h2>
        <div className="bg-slate-800 px-4 py-2 rounded-lg text-slate-300 text-sm">
          Загальний капітал банку: <span className="text-emerald-400 font-bold ml-2">{totalMoney.toLocaleString()} ₴</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Management */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2"><Users size={20}/> Користувачі</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="text" 
                placeholder="Пошук..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-800 border-none rounded-lg pl-10 py-2 text-sm text-white focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-500 text-sm border-b border-slate-800">
                  <th className="pb-3 pl-2">Користувач</th>
                  <th className="pb-3">Роль</th>
                  <th className="pb-3 text-right">Баланс</th>
                  <th className="pb-3 text-right pr-2">Дії</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 pl-2 flex items-center gap-3">
                      <img src={u.avatarUrl} alt="av" className="w-8 h-8 rounded-full bg-slate-700 object-cover" />
                      <div>
                        <div className="font-medium text-white">{u.fullName}</div>
                        <div className="text-xs text-slate-500">@{u.username}</div>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${u.role === 'ADMIN' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 text-right font-mono text-emerald-400">
                      {u.balance.toLocaleString()} ₴
                    </td>
                    <td className="py-3 text-right pr-2">
                       <button onClick={() => handleEditClick(u)} className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors">
                         <DollarSign size={16} />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">ТОП-5 Багатіїв</h3>
          <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={data}>
                 <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                 <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value/1000}k`} />
                 <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                    cursor={{fill: 'transparent'}}
                 />
                 <Bar dataKey="balance" radius={[4, 4, 0, 0]}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#3b82f6'} />
                    ))}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
          </div>
        </div>
      </div>

      <Modal isOpen={!!editingUser} onClose={() => setEditingUser(null)} title="Редагування користувача">
        <div className="space-y-4">
          <p className="text-slate-400 text-sm">ID: {editingUser?.id}</p>
          
          <Input 
             label="Ім'я" 
             value={editForm.fullName} 
             onChange={(e: any) => setEditForm({...editForm, fullName: e.target.value})} 
          />
          
          <Input 
             label="Баланс" 
             type="number" 
             value={editForm.balance} 
             onChange={(e: any) => setEditForm({...editForm, balance: e.target.value})} 
          />

          <Select 
             label="Роль"
             value={editForm.role}
             onChange={(e: any) => setEditForm({...editForm, role: e.target.value})}
             options={[
                 { value: 'USER', label: 'Користувач' },
                 { value: 'ADMIN', label: 'Адміністратор' }
             ]}
          />

          <Input 
             label="Локація" 
             value={editForm.location} 
             onChange={(e: any) => setEditForm({...editForm, location: e.target.value})} 
          />

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="secondary" onClick={() => setEditingUser(null)}>Скасувати</Button>
            <Button variant="success" onClick={saveChanges}>Зберегти</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};