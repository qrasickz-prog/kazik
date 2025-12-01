import { User, UserRole, Transaction, Card, JobTask, JobPosition } from '../types';

const STORAGE_KEYS = {
  USERS: 'vovabank_users_v3',
  TRANSACTIONS: 'vovabank_transactions_v3',
  CARDS: 'vovabank_cards_v3',
};

// --- Jobs Data (Rebalanced & Harder) ---
// difficulty: 1 (Easy) to 10 (Impossible)
// speed: 1 (Slow) to 5 (Fast)
interface EnhancedJob extends JobPosition {
    difficulty: number;
    speed: number;
}

export const JOBS_LIST: EnhancedJob[] = [
  // Tier 1: Service (Easy, Low Pay)
  { id: 'courier', title: "Кур'єр Glovo", salary: 15, perClick: 0.50, requiredLevel: 1, icon: '🚲', category: 'Service', difficulty: 20, speed: 1 },
  { id: 'cleaner', title: "Прибиральник", salary: 20, perClick: 0.75, requiredLevel: 1, icon: '🧹', category: 'Service', difficulty: 18, speed: 1.2 },
  { id: 'cashier', title: "Касир АТБ", salary: 25, perClick: 1.00, requiredLevel: 1, icon: '🏪', category: 'Service', difficulty: 15, speed: 1.5 },
  
  // Tier 2: Start (Moderate, Moderate Pay)
  { id: 'waiter', title: "Офіціант", salary: 40, perClick: 2.00, requiredLevel: 1, icon: '☕', category: 'Service', difficulty: 12, speed: 2 },
  { id: 'driver', title: "Водій Таксі", salary: 50, perClick: 3.50, requiredLevel: 1, icon: '🚕', category: 'Service', difficulty: 10, speed: 2.2 },
  { id: 'copywriter', title: "Копірайтер", salary: 70, perClick: 5.00, requiredLevel: 2, icon: '✍️', category: 'Start', difficulty: 8, speed: 2.5 },
  
  // Tier 3: Tech/Business (Hard, Good Pay)
  { id: 'designer', title: "Графічний Дизайнер", salary: 100, perClick: 8.00, requiredLevel: 2, icon: '🎨', category: 'Start', difficulty: 7, speed: 3 },
  { id: 'tester', title: "QA Тестувальник", salary: 150, perClick: 12.00, requiredLevel: 2, icon: '🐛', category: 'Tech', difficulty: 6, speed: 3.2 },
  { id: 'manager', title: "Проект Менеджер", salary: 200, perClick: 15.00, requiredLevel: 2, icon: '📊', category: 'Business', difficulty: 5, speed: 3.5 },
  
  // Tier 4: High End (Very Hard, High Pay)
  { id: 'developer', title: "Software Engineer", salary: 300, perClick: 25.00, requiredLevel: 2, icon: '💻', category: 'Tech', difficulty: 4, speed: 4 },
  { id: 'banker', title: "Банкір", salary: 450, perClick: 40.00, requiredLevel: 3, icon: '💼', category: 'Business', difficulty: 3, speed: 4.2 },
  { id: 'lawyer', title: "Адвокат", salary: 600, perClick: 60.00, requiredLevel: 3, icon: '⚖️', category: 'Gov', difficulty: 2.5, speed: 4.5 },
  
  // Tier 5: Elite (Insane, Massive Pay)
  { id: 'police', title: "Начальник Поліції", salary: 800, perClick: 100.00, requiredLevel: 3, icon: '👮', category: 'Gov', difficulty: 2, speed: 5 },
  { id: 'deputy', title: "Депутат", salary: 2000, perClick: 300.00, requiredLevel: 4, icon: '🏛️', category: 'Gov', difficulty: 1.5, speed: 6 },
];

const initData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    const adminUser: User = {
      id: 'admin-id',
      username: 'qrasickz',
      passwordHash: '1111',
      fullName: 'Головний Адміністратор',
      role: UserRole.ADMIN,
      balance: 1000, 
      createdAt: new Date().toISOString(),
      isBlocked: false,
      isVerified: true,
      avatarUrl: 'https://ui-avatars.com/api/?name=Admin&background=0f172a&color=fff',
      bio: 'Керуючий системою',
      location: 'Київ, Головний офіс'
    };
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([adminUser]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CARDS)) {
    localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify([]));
  }
};

initData();

const getUsers = (): User[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
const setUsers = (users: User[]) => localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
const getTransactions = (): Transaction[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || '[]');
const setTransactions = (txs: Transaction[]) => localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txs));
const getCards = (): Card[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.CARDS) || '[]');
const setCards = (cards: Card[]) => localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(cards));

export const StorageService = {
  login: (username: string, password: string): User | null => {
    const users = getUsers();
    const user = users.find(u => u.username === username && u.passwordHash === password);
    if (user) {
      if (user.isBlocked) throw new Error("Аккаунт заблоковано банком.");
      return user;
    }
    return null;
  },

  register: (username: string, password: string, fullName: string): User => {
    const users = getUsers();
    if (users.some(u => u.username === username)) {
      throw new Error("Цей логін вже зайнятий.");
    }
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      username,
      passwordHash: password,
      fullName,
      role: UserRole.USER,
      balance: 5, // Lower starting balance
      createdAt: new Date().toISOString(),
      isBlocked: false,
      isVerified: false,
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`,
      location: 'Україна',
      bio: 'Новий клієнт'
    };
    users.push(newUser);
    setUsers(users);
    
    StorageService.addTransaction({
      id: Math.random().toString(36),
      fromUserId: 'SYSTEM',
      toUserId: newUser.id,
      amount: 5,
      date: new Date().toISOString(),
      description: 'Бонус за реєстрацію',
      type: 'DEPOSIT'
    });

    return newUser;
  },

  getUser: (id: string): User | undefined => getUsers().find(u => u.id === id),

  updateUser: (userId: string, updates: Partial<User>) => {
    const users = getUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updates };
      setUsers(users);
    }
  },

  verifyUser: (userId: string) => {
    StorageService.updateUser(userId, { isVerified: true });
  },

  // --- Cards ---
  createCard: (userId: string, tier: 'SILVER' | 'GOLD' | 'PLATINUM'): Card => {
    const cards = getCards();
    
    let color = 'bg-slate-900'; 
    if (tier === 'SILVER') color = 'bg-slate-800'; 
    if (tier === 'GOLD') color = 'bg-stone-900'; 

    const newCard: Card = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      number: '5375 ' + Math.floor(1000 + Math.random() * 9000) + ' ' + Math.floor(1000 + Math.random() * 9000) + ' ' + Math.floor(1000 + Math.random() * 9000),
      expiry: '12/30',
      cvv: Math.floor(100 + Math.random() * 900).toString(),
      pin: Math.floor(1000 + Math.random() * 9000).toString(),
      type: Math.random() > 0.5 ? 'VISA' : 'MASTERCARD',
      tier,
      color,
      isBlocked: false
    };
    cards.push(newCard);
    setCards(cards);
    return newCard;
  },

  getUserCards: (userId: string): Card[] => getCards().filter(c => c.userId === userId),

  updateCard: (cardId: string, updates: Partial<Card>) => {
    const cards = getCards();
    const idx = cards.findIndex(c => c.id === cardId);
    if (idx !== -1) {
      cards[idx] = { ...cards[idx], ...updates };
      setCards(cards);
    }
  },

  deleteCard: (cardId: string) => {
    const cards = getCards();
    const newCards = cards.filter(c => c.id !== cardId);
    setCards(newCards);
  },

  // --- Transactions ---
  transfer: (fromUserId: string, toCardNumber: string, amount: number, description: string): void => {
    const users = getUsers();
    const cards = getCards();
    
    const senderIdx = users.findIndex(u => u.id === fromUserId);
    const receiverCard = cards.find(c => c.number.replace(/\s/g, '') === toCardNumber.replace(/\s/g, ''));
    
    if (senderIdx === -1) throw new Error("Помилка відправника");
    if (!receiverCard) throw new Error("Картку не знайдено");
    if (receiverCard.isBlocked) throw new Error("Картка отримувача заблокована");

    const receiverIdx = users.findIndex(u => u.id === receiverCard.userId);
    
    if (users[senderIdx].balance < amount) throw new Error("Недостатньо коштів");
    if (users[senderIdx].id === users[receiverIdx].id) throw new Error("Не можна ганяти гроші собі");

    users[senderIdx].balance -= amount;
    users[receiverIdx].balance += amount;
    setUsers(users);

    StorageService.addTransaction({
      id: Math.random().toString(36),
      fromUserId,
      toUserId: users[receiverIdx].id,
      amount,
      date: new Date().toISOString(),
      description,
      type: 'TRANSFER'
    });
  },

  playCasino: (userId: string, bet: number, multiplier: number, gameName: string): number => {
    const users = getUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (users[idx].balance < bet) throw new Error("Недостатньо коштів");

    const winAmount = bet * multiplier;
    const change = winAmount - bet;

    users[idx].balance += change;
    setUsers(users);

    StorageService.addTransaction({
      id: Math.random().toString(36),
      fromUserId: userId,
      toUserId: 'CASINO',
      amount: Math.abs(change),
      date: new Date().toISOString(),
      description: `${gameName}: ${change >= 0 ? 'Виграш' : 'Програш'}`,
      type: 'GAME'
    });
    
    return users[idx].balance;
  },

  // --- Work System ---
  employUser: (userId: string, jobId: string) => {
    StorageService.updateUser(userId, { jobId });
  },

  collectSalary: (userId: string, amount: number) => {
    const users = getUsers();
    const idx = users.findIndex(u => u.id === userId);
    if(idx !== -1) {
        users[idx].balance += amount;
        users[idx].lastDailySalary = new Date().toISOString();
        setUsers(users);
        StorageService.addTransaction({
            id: Math.random().toString(36),
            fromUserId: 'JOB',
            toUserId: userId,
            amount,
            date: new Date().toISOString(),
            description: 'Щоденна зарплата',
            type: 'SALARY'
        });
    }
  },

  doWorkTask: (userId: string, amount: number, taskName: string) => {
    const users = getUsers();
    const idx = users.findIndex(u => u.id === userId);
    if(idx !== -1) {
        users[idx].balance += amount;
        setUsers(users);
    }
  },

  addTransaction: (tx: Transaction) => {
    const txs = getTransactions();
    txs.push(tx);
    setTransactions(txs);
  },

  getHistory: (userId: string): Transaction[] => {
    const txs = getTransactions();
    return txs.filter(t => t.fromUserId === userId || t.toUserId === userId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  getAllUsers: (): User[] => getUsers(),
};