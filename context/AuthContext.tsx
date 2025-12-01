import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Notification } from '../types';
import { StorageService } from '../services/storage';

interface AuthContextType {
  user: User | null;
  login: (u: string, p: string) => Promise<void>;
  register: (u: string, p: string, n: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => void;
  isLoading: boolean;
  notifications: Notification[];
  notify: (type: 'success' | 'error' | 'info', message: string) => void;
  removeNotification: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simple base64 pop sound for notifications
const NOTIFICATION_SOUND = "data:audio/wav;base64,UklGRl9vT1BXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU"; // Shortened placeholder, effectively silent in this mockup but demonstrates intent. 
// Let's use a real short beep data uri
const BEEP_SOUND = "data:audio/mpeg;base64,//uQxAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq";

export const AuthProvider = ({ children }: { children?: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const storedId = localStorage.getItem('vovabank_session_id');
    if (storedId) {
      const foundUser = StorageService.getUser(storedId);
      if (foundUser) setUser(foundUser);
    }
    setIsLoading(false);
  }, []);

  const playSound = () => {
    try {
        const audio = new Audio("https://codeskulptor-demos.commondatastorage.googleapis.com/pang/pop.mp3");
        audio.volume = 0.2;
        audio.play().catch(e => console.log("Audio play blocked", e));
    } catch (e) {}
  };

  const notify = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, type, message }]);
    if(type !== 'error') playSound(); 
    setTimeout(() => removeNotification(id), 4000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const login = async (username: string, password: string) => {
    await new Promise(r => setTimeout(r, 600));
    const foundUser = StorageService.login(username, password);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('vovabank_session_id', foundUser.id);
      notify('success', `Вітаємо, ${foundUser.fullName}!`);
    } else {
      throw new Error("Невірний логін або пароль");
    }
  };

  const register = async (username: string, password: string, fullName: string) => {
    await new Promise(r => setTimeout(r, 800));
    const newUser = StorageService.register(username, password, fullName);
    setUser(newUser);
    localStorage.setItem('vovabank_session_id', newUser.id);
    notify('success', 'Аккаунт успішно створено! Вам нараховано 10 ₴.');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vovabank_session_id');
    notify('info', 'Ви вийшли з системи');
  };

  const refreshUser = () => {
    if (user) {
      const updated = StorageService.getUser(user.id);
      if (updated) setUser(updated);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, refreshUser, isLoading, notifications, notify, removeNotification }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};