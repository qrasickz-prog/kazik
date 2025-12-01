
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  username: string;
  passwordHash: string;
  fullName: string;
  role: UserRole;
  balance: number;
  avatarUrl?: string;
  createdAt: string;
  isBlocked: boolean;
  isVerified: boolean;
  // New profile fields
  location?: string;
  bio?: string;
  jobId?: string; // ID of the current job
  lastDailySalary?: string; // Date ISO string
}

export interface Card {
  id: string;
  userId: string;
  number: string;
  expiry: string;
  cvv: string;
  pin: string;
  type: 'VISA' | 'MASTERCARD';
  tier: 'SILVER' | 'GOLD' | 'PLATINUM';
  color: string;
  isBlocked: boolean;
}

export interface Transaction {
  id: string;
  fromUserId: string;
  toUserId: string;
  amount: number;
  date: string;
  description: string;
  type: 'TRANSFER' | 'DEPOSIT' | 'WITHDRAWAL' | 'GAME' | 'SALARY';
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export interface JobPosition {
  id: string;
  title: string;
  salary: number; // Daily fixed salary
  perClick: number; // Earnings per task
  requiredLevel: number; // Just for flavor
  icon: string;
  category: 'Start' | 'Business' | 'Gov' | 'Tech' | 'Service';
}

export interface JobTask {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  clientName: string;
  reward: number;
}