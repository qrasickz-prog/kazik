import React, { useState } from 'react';
import { Button, Input } from '../components/UI';
import { Shield, FileText, HelpCircle, Send, User, Bot, Check, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
    const navigate = useNavigate();
    return (
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-foreground mb-6 transition-colors">
            <ArrowLeft size={18} /> Назад
        </button>
    );
};

const StaticPageLayout = ({ title, icon: Icon, children }: any) => (
    <div className="max-w-4xl mx-auto py-4 animate-fade-in">
        <BackButton />
        <div className="glass-panel rounded-3xl p-8 md:p-12 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px]"></div>
             <div className="flex items-center gap-4 mb-8 border-b border-border pb-6">
                 <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-blue-500">
                     <Icon size={28} />
                 </div>
                 <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h1>
             </div>
             <div className="text-slate-600 dark:text-slate-300 space-y-6 leading-relaxed text-lg">
                 {children}
             </div>
        </div>
    </div>
);

export const PrivacyPage = () => (
    <StaticPageLayout title="Політика Конфіденційності" icon={Shield}>
        <p><strong>1. Збір та обробка даних</strong><br/>
        Ми збираємо мінімальну кількість персональних даних, необхідних для коректного функціонування ігрового процесу "VovaBank". Всі дані (баланс, історія транзакцій, налаштування карток) зберігаються локально у вашому браузері (Local Storage).</p>
        
        <p><strong>2. Використання інформації</strong><br/>
        Ваші ігрові дані використовуються виключно для симуляції банківських операцій. Ми не передаємо, не продаємо і не розголошуємо вашу інформацію третім особам.</p>
        
        <p><strong>3. Безпека</strong><br/>
        Оскільки це симулятор, реальні фінансові транзакції не проводяться. Однак ми рекомендуємо не використовувати реальні паролі від ваших справжніх банківських акаунтів для входу в гру.</p>
        
        <div className="bg-blue-500/10 p-6 rounded-2xl border border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm mt-8 flex items-center gap-4">
            <Shield size={24} />
            <div>
                <strong>Захист даних активний</strong><br/>
                Останнє оновлення: 24 Жовтня 2024
            </div>
        </div>
    </StaticPageLayout>
);

export const TermsPage = () => (
    <StaticPageLayout title="Угода Користувача" icon={FileText}>
        <h3 className="text-xl font-bold text-foreground">1. Загальні положення</h3>
        <p>VovaBank - це розважальний веб-додаток (симулятор фінансової системи). Всі грошові одиниці ("Гривні", "UAH") є віртуальними і не мають реальної цінності. Їх неможливо вивести на реальну карту або обміняти на реальні товари.</p>
        
        <h3 className="text-xl font-bold text-foreground">2. Правила поведінки</h3>
        <ul className="list-disc pl-5 space-y-2">
            <li>Заборонено використовувати стороннє програмне забезпечення для автоматизації дій (боти, клікери).</li>
            <li>Заборонено використовувати вразливості коду для накрутки балансу.</li>
            <li>Адміністрація залишає за собою право заблокувати акаунт порушника без попередження.</li>
        </ul>
        
        <h3 className="text-xl font-bold text-foreground">3. Відмова від відповідальності</h3>
        <p>Розробники не несуть відповідальності за втрату віртуальних коштів, що сталася внаслідок технічних збоїв, очищення кешу браузера користувачем або оновлення системи.</p>
        
        <div className="mt-8 pt-6 border-t border-border">
            <Button className="w-full md:w-auto px-8">Я погоджуюсь з правилами</Button>
        </div>
    </StaticPageLayout>
);

export const SupportPage = () => {
    const [messages, setMessages] = useState<{sender: 'user'|'bot', text: string}[]>([
        { sender: 'bot', text: 'Вітаю! Це автоматична служба підтримки VovaBank. Чим я можу вам допомогти сьогодні?' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const handleSend = () => {
        if(!input.trim()) return;
        
        const userMsg = input;
        setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
        setInput('');
        setIsTyping(true);

        // Simulate bot response
        setTimeout(() => {
            let response = "Дякую за звернення. Наш оператор зв'яжеться з вами найближчим часом.";
            
            if (userMsg.toLowerCase().includes('робот') || userMsg.toLowerCase().includes('зарплат')) {
                response = "Питання щодо роботи? Переконайтеся, що ви виконуєте міні-гру (QTE) правильно. Зелена зона - це успіх.";
            } else if (userMsg.toLowerCase().includes('карт')) {
                response = "Управління картками доступне у розділі 'Гаманець'. Там ви можете блокувати картки або змінювати CVV.";
            } else if (userMsg.toLowerCase().includes('грош') || userMsg.toLowerCase().includes('баланс')) {
                response = "Ваш баланс оновлюється в реальному часі. Якщо ви помітили помилку, спробуйте оновити сторінку.";
            }

            setMessages(prev => [...prev, { sender: 'bot', text: response }]);
            setIsTyping(false);
        }, 1500 + Math.random() * 1000);
    };

    return (
        <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] py-4 animate-fade-in flex flex-col">
            <BackButton />
            <div className="flex-1 glass-panel rounded-3xl flex flex-col overflow-hidden shadow-2xl relative">
                
                {/* Header */}
                <div className="p-6 border-b border-border bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center backdrop-blur-sm z-10">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg">
                                <Bot size={24} />
                            </div>
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900"></div>
                        </div>
                        <div>
                            <h2 className="font-bold text-lg">Підтримка VovaBank</h2>
                            <p className="text-xs text-blue-500 font-medium">ШІ-Асистент • Відповідає миттєво</p>
                        </div>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-100/50 dark:bg-black/20">
                    {messages.map((m, i) => (
                        <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                            <div className={`
                                max-w-[80%] md:max-w-[60%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm relative
                                ${m.sender === 'user' 
                                    ? 'bg-blue-600 text-white rounded-br-sm' 
                                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-sm border border-border'}
                            `}>
                                {m.text}
                                <div className={`absolute bottom-2 right-2 opacity-50 text-[10px] flex items-center gap-1 ${m.sender === 'user' ? 'text-white' : 'text-slate-500'}`}>
                                    {new Date().toLocaleTimeString().slice(0,5)}
                                    {m.sender === 'user' && <Check size={12}/>}
                                </div>
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start animate-fade-in">
                            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-bl-sm border border-border flex gap-1">
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white dark:bg-slate-900 border-t border-border">
                    <div className="flex gap-3">
                        <Input 
                            value={input} 
                            onChange={(e: any) => setInput(e.target.value)}
                            placeholder="Напишіть повідомлення..."
                            className="flex-1"
                            onKeyDown={(e: any) => e.key === 'Enter' && handleSend()}
                        />
                        <Button onClick={handleSend} className="px-6 bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20">
                            <Send size={20} />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};