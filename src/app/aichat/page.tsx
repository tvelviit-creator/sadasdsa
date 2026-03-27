"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUserPhone } from "@/utils/userData";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
    id: string;
    role: "user" | "assistant";
    text: string;
    link?: {
        text: string;
        url: string;
    };
    isRead?: boolean;
    isAdminSender?: boolean;
    senderPhone?: string;
    buttons?: string[];
    timestamp?: string;
}

const AnimatedTLogo = ({ size = 24, className = "" }: { size?: number, className?: string }) => {
    return (
        <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size, perspective: "100px" }}>
            {/* Cyberpunk Mecha Robot Head (Serious) */}
            <motion.svg 
                width={size} height={size} viewBox="0 0 24 24" fill="none" 
                stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"
                className="absolute inset-0 origin-center"
                animate={{ 
                    opacity: [1, 1, 0, 0, 1],
                    rotateY: [0, 0, 90, 90, 0],
                    scale: [1, 1, 0.8, 0.8, 1]
                }}
                transition={{ duration: 6, times: [0, 0.4, 0.5, 0.9, 1], repeat: Infinity, ease: "easeInOut" }}
            >
                {/* Structured helmet shape */}
                <polygon points="6,7 18,7 21,13 16,20 8,20 3,13" />
                {/* Aggressive narrow visor */}
                <line x1="7" y1="12" x2="17" y2="12" strokeWidth="2.5" />
                <line x1="8" y1="15" x2="16" y2="15" strokeWidth="1" opacity="0.5" />
                {/* Vertical core line */}
                <line x1="12" y1="15" x2="12" y2="20" />
                <line x1="12" y1="3" x2="12" y2="7" />
                {/* Minimalist side tech-nodes */}
                <line x1="3" y1="10" x2="1" y2="10" />
                <line x1="21" y1="10" x2="23" y2="10" />
            </motion.svg>

            {/* Strict T Logo */}
            <motion.svg 
                width={size} height={size} viewBox="0 0 24 24" fill="none" 
                stroke="currentColor" strokeWidth="3.5" strokeLinecap="square"
                className="absolute inset-0 origin-center"
                animate={{ 
                    opacity: [0, 0, 1, 1, 0],
                    rotateY: [-90, -90, 0, 0, -90],
                    scale: [0.8, 0.8, 1, 1, 0.8]
                }}
                transition={{ duration: 6, times: [0, 0.4, 0.5, 0.9, 1], repeat: Infinity, ease: "easeInOut" }}
            >
                <path d="M4 6h16" />
                <path d="M12 6v15" />
            </motion.svg>
        </div>
    );
};

export default function AiChatPage() {
    const router = useRouter();
    const defaultGreeting: Message[] = [
        {
            id: "greeting_1",
            role: "assistant",
            text: "Привет!\nЯ могу помочь тебе выбрать нужный продукт и подскажу как тебе собрать подходящий твоей задаче заказ.\nРасскажи о своем проекте.",
            timestamp: "2024-01-01T12:00:00.000Z",
            buttons: [
                "Проблема с заказом",
                "Проблема с оплатой",
                "Проблема с приложением",
                "Как разместить свои услуги?",
                "Позвать живого человека"
            ]
        }
    ];

    const [messages, setMessages] = useState<Message[]>(defaultGreeting);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [hasGreeted, setHasGreeted] = useState(true);
    const hasGreetedRef = useRef(true);
    const [isLoaded, setIsLoaded] = useState(false);
    const [userPhone, setUserPhone] = useState<string | null>(null);
    const [isSupportActive, setIsSupportActive] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // 1. Determine current user phone
    useEffect(() => {
        const rawPhone = getCurrentUserPhone() || "guest";
        const phone = rawPhone !== "guest" ? rawPhone.replace(/\D/g, '') : "guest";
        setUserPhone(phone);
    }, []);

    // 2. Load state from local storage whenever userPhone is set or changed
    useEffect(() => {
        if (!userPhone) return;

        const savedMessages = localStorage.getItem(`aiChatMessages_${userPhone}`);
        const savedHasGreeted = localStorage.getItem(`aiChatHasGreeted_${userPhone}`);
        const savedSupportActive = localStorage.getItem(`aiChatIsSupportActive_${userPhone}`);

        if (savedMessages) {
            try {
                const parsed = JSON.parse(savedMessages);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    // Migration: Update old button names and greeting text in history
                    const migrated = parsed.map(m => {
                        if (m.buttons) {
                            m.buttons = m.buttons.map((b: string) => 
                                b === "Проблемы с работой приложения" ? "Проблема с приложением" : b
                            );
                        }
                        // If it's the old greeting or old ID, sync it with the new default
                        if (m.id === "1" || m.id === "greeting_1" || (m.role === 'assistant' && m.text.includes("выбрать нужный продукт"))) {
                            return { 
                                ...defaultGreeting[0], 
                                id: "greeting_1", 
                                timestamp: m.timestamp || defaultGreeting[0].timestamp 
                            };
                        }
                        return m;
                    });
                    setMessages(migrated);
                } else {
                    setMessages(defaultGreeting);
                }
            } catch (e) {
                setMessages(defaultGreeting);
            }
        } else {
            setMessages(defaultGreeting);
        }

        if (savedHasGreeted === "false") {
            setHasGreeted(false);
            hasGreetedRef.current = false;
        }

        if (savedSupportActive === "true") {
            setIsSupportActive(true);
        }

        // Handle initial query from navigation (only once)
        const savedQuery = localStorage.getItem("aiInitialQuery");
        if (savedQuery) {
            handleSend(savedQuery, false);
            localStorage.removeItem("aiInitialQuery");
        }

        setIsLoaded(true);
    }, [userPhone]);

    // 3. Save state to local storage whenever it changes (only after loaded)
    useEffect(() => {
        if (!isLoaded || !userPhone) return;
        localStorage.setItem(`aiChatMessages_${userPhone}`, JSON.stringify(messages));
        localStorage.setItem(`aiChatHasGreeted_${userPhone}`, hasGreeted.toString());
        localStorage.setItem(`aiChatIsSupportActive_${userPhone}`, isSupportActive.toString());
    }, [messages, hasGreeted, isLoaded, userPhone, isSupportActive]);

    // Poll for operator messages if support is active
    useEffect(() => {
        if (!isSupportActive || !userPhone || userPhone === "guest") return;

        const checkSupportMessages = async () => {
            try {
                // 1. Fetch latest messages first so we see the closing message
                const res = await fetch(`/api/chat?orderId=support_${userPhone}`);
                let serverMsgs: any[] = [];
                if (res.ok) {
                    serverMsgs = await res.json();
                    setMessages(prev => {
                        const newMsgs = serverMsgs
                            .filter((sm: any) => !prev.some(pm => pm.id === sm.id))
                            .map((sm: any) => ({
                                id: sm.id,
                                role: (sm.isAdminSender ? 'assistant' : 'user') as "user" | "assistant",
                                text: sm.text,
                                isAdminSender: sm.isAdminSender,
                                senderPhone: sm.senderPhone,
                                buttons: sm.buttons,
                                link: sm.link,
                                timestamp: sm.timestamp
                            }));
                        
                        if (newMsgs.length === 0) return prev;
                        return [...prev, ...newMsgs];
                    });
                }

                // 2. Check if the request is still open
                const supRes = await fetch(`/api/support?status=open`);
                if (supRes.ok) {
                    const activeSups = await supRes.json();
                    const isOpen = activeSups.some((s: any) => s.userPhone === userPhone);
                    
                    // If closed by admin, wait a bit so user sees the last system message then disable support mode
                    if (!isOpen && isSupportActive) {
                        // Check if we HAVE the closing system message in serverMsgs or current messages
                        const hasClosedMsg = serverMsgs.some((m: any) => m.senderPhone === 'SYSTEM' && m.text.includes('закрыто'));
                        if (hasClosedMsg) {
                            setIsSupportActive(false);
                            localStorage.setItem(`aiChatIsSupportActive_${userPhone}`, "false");
                        }
                    }
                }
            } catch (e) {}
        };

        const interval = setInterval(checkSupportMessages, 2000); // Poll every 2 seconds for faster updates
        return () => clearInterval(interval);
    }, [isSupportActive, userPhone]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async (textToSend: string, isButton: boolean = false) => {
        const query = textToSend || input;
        if (!query.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: "user",
            text: query,
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput("");

        // If support is active, sync this message and handle AI reminder
        if (isSupportActive && userPhone) {
            fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: userMsg.id,
                    orderId: `support_${userPhone}`,
                    senderPhone: userPhone,
                    text: query,
                    timestamp: userMsg.timestamp || new Date().toISOString(),
                    isAdminSender: false,
                    isRead: false
                })
            });

            // If no human operator has responded yet, show a reminder from AI
            const operatorConnected = messages.some(m => 
                (m as any).isAdminSender && (m as any).senderPhone !== 'AI_ASSISTANT' && (m as any).senderPhone !== 'SYSTEM'
            );

            if (!operatorConnected) {
                setIsTyping(true);
                setTimeout(() => {
                    const aiWaitMsg: Message = {
                        id: (Date.now() + 1).toString(),
                        role: "assistant",
                        text: "Я уже позвал оператора, пожалуйста подождите"
                    };
                    setMessages(prev => [...prev, aiWaitMsg]);
                    setIsTyping(false);
                }, 1000);
            } else {
                setIsTyping(false);
            }
            return;
        }

        setIsTyping(true);

        setTimeout(() => {
            let aiResponse: Message;

            if (isButton) {
                // Handle Button Clicks
                let responseText = "";
                switch (query) {
                    case "Позвать живого человека":
                        responseText = "Переключаю на оператора... Ожидайте ответа в ближайшее время.";
                        setIsSupportActive(true);
                        
                        // Register support request
                        if (userPhone) {
                            const userData = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem(`user_${userPhone}`) || '{}') : {};
                            
                            // 1. Register support request
                            fetch('/api/support', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    userPhone: userPhone,
                                    userName: userData.name || (userPhone === 'guest' ? 'Гость' : 'Пользователь'),
                                    text: 'Запрос оператора из ИИ чата'
                                })
                            });

                            // 2. Sync history to server so admin can see it
                            const allMsgsToSync = [...messages, userMsg];
                            
                            const syncMessages = async () => {
                                for (const [idx, m] of allMsgsToSync.entries()) {
                                    await fetch('/api/chat', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                            id: m.id || `${Date.now()}_sync_${idx}`,
                                            orderId: `support_${userPhone}`,
                                            senderPhone: m.role === 'user' ? userPhone : 'AI_ASSISTANT',
                                            text: m.text,
                                            timestamp: m.timestamp || new Date().toISOString(),
                                            isAdminSender: m.role === 'assistant',
                                            isRead: true
                                        })
                                    });
                                    // Small delay to prevent rate issues or race conditions on the server file DB
                                    await new Promise(r => setTimeout(r, 50));
                                }

                                // 3. Sync the final AI response (transferring to operator)
                                fetch('/api/chat', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        id: (Date.now() + 500).toString(),
                                        orderId: `support_${userPhone}`,
                                        senderPhone: 'AI_ASSISTANT',
                                        text: responseText,
                                        timestamp: new Date().toISOString(),
                                        isAdminSender: true,
                                        isRead: true
                                    })
                                });
                            };

                            syncMessages();
                        }
                        break;
                    case "Проблема с заказом":
                        responseText = "Пожалуйста, напишите номер заказа и кратко опишите проблему.";
                        break;
                    case "Проблема с оплатой":
                        responseText = "Напишите дату, сумму и способ оплаты. Мы проверим транзакцию.";
                        break;
                    case "Проблема с приложением":
                        responseText = "Попробуйте обновить приложение. Если ошибка сохраняется, опишите, как она проявляется.";
                        break;
                    case "Как разместить свои услуги?":
                        responseText = "Чтобы разместить услуги, перейдите в профиль и зарегистрируйтесь как продавец.";
                        break;
                    default:
                        responseText = "Запрос принят.";
                }
                aiResponse = {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    text: responseText,
                    timestamp: new Date().toISOString()
                };
            } else {
                // Handle Typing
                // Use Ref to check current status including updates from this same stack if any (though unlikely here) or restored state
                if (!hasGreetedRef.current) {
                    setHasGreeted(true);
                    hasGreetedRef.current = true;
                    
                    aiResponse = {
                        id: (Date.now() + 1).toString(),
                        role: "assistant",
                        text: "Привет!\nЯ могу помочь тебе выбрать нужный продукт и подскажу как тебе собрать подходящий твоей задаче заказ.\nРасскажи о своем проекте.",
                        timestamp: new Date().toISOString(),
                        buttons: [
                            "Проблема с заказом",
                            "Проблема с оплатой",
                            "Проблема с приложением",
                            "Как разместить свои услуги?",
                            "Позвать живого человека"
                        ]
                    };
                } else {
                    // Fallback for subsequent typing
                    aiResponse = {
                        id: (Date.now() + 1).toString(),
                        role: "assistant",
                        text: "Я ничего не понимаю =(\nПозвать живого человека?",
                        timestamp: new Date().toISOString(),
                        buttons: ["Позвать живого человека"]
                    };
                }
            }

            setMessages(prev => [...prev, aiResponse]);
            setIsTyping(false);
        }, 1000);
    };

    const textStyle = {
        fontFamily: "var(--font-cera), sans-serif",
        fontSize: "15px",
        fontWeight: 400,
        lineHeight: "1.4",
        letterSpacing: "0",
        fontStyle: "normal"
    };

    return (
        <AnimatePresence mode="wait">
        <motion.div 
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.35, ease: "circOut" }}
            className="min-h-screen bg-transparent text-[var(--text-primary)] flex justify-center font-sans overflow-x-hidden transition-colors duration-300 w-full"
        >
            
            <div className="w-full max-w-[375px] md:max-w-[800px] lg:max-w-[1000px] relative h-[100dvh] md:h-[calc(100vh-48px)] flex flex-col md:my-6 md:bg-[var(--card-bg)] md:border md:border-[var(--border-color)] md:rounded-[32px] md:shadow-[0_0_40px_rgba(0,0,0,0.05)] md:overflow-hidden transition-all duration-300">
                
                {/* Desktop Header */}
                <header className="hidden md:flex items-center justify-between w-full px-8 py-6 shrink-0 border-b border-[var(--border-color)] bg-[var(--card-bg)] z-10 transition-colors duration-300 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-[rgba(0,229,255,0.03)] to-transparent pointer-events-none" />
                    <div className="flex items-center gap-5 relative z-10">
                        <div className="w-[52px] h-[52px] rounded-[18px] bg-[var(--text-primary)] flex items-center justify-center shrink-0 border border-[var(--border-color)]">
                            <AnimatedTLogo size={26} className="text-[var(--bg-color)]" />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight" style={{ fontFamily: 'var(--font-cera)' }}>Нейросеть</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse shadow-[0_0_8px_#00E5FF]" />
                                <span className="text-[12px] font-bold text-[#00E5FF] uppercase tracking-wider tooltip" style={{ fontFamily: 'var(--font-cera)' }}>Online</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Mobile Header Section from Figma SVG */}
                <header className="md:hidden fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[375px] h-[102px] z-50 transition-colors duration-300">
                    <svg width="375" height="102" viewBox="0 0 375 102" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                        <mask id="path-1-inside-aichat" fill="white">
                            <path d="M0 0H375V102H0V0Z"/>
                        </mask>
                        <path d="M0 0H375V102H0V0Z" fill="var(--bg-color)"/>
                        <path d="M375 102V101H0V102V103H375V102Z" fill="var(--border-color)" mask="url(#path-1-inside-aichat)"/>
                        
                        {/* Figma Back Arrow */}
                        <path d="M51 72L29 72M29 72L38.4286 81M29 72L38.4286 63" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        
                        {/* Figma Title Paths: "ИИ Помощник" */}
                        <path d="M118.654 63.872V80H115.414V70.184L106.126 80.288H105.07V64.16H108.31V73.88L117.574 63.872H118.654ZM135.857 63.872V80H132.617V70.184L123.329 80.288H122.273V64.16H125.513V73.88L134.777 63.872H135.857ZM146.203 64.16H159.451V80H156.211V67.088H149.443V80H146.203V64.16ZM168.409 80.264C167.241 80.264 166.169 79.992 165.193 79.448C164.233 78.888 163.473 78.136 162.913 77.192C162.353 76.232 162.073 75.184 162.073 74.048C162.073 72.912 162.353 71.872 162.913 70.928C163.473 69.968 164.241 69.216 165.217 68.672C166.193 68.128 167.265 67.856 168.433 67.856C169.601 67.856 170.673 68.136 171.649 68.696C172.625 69.24 173.393 69.984 173.953 70.928C174.529 71.872 174.817 72.912 174.817 74.048C174.817 75.184 174.529 76.232 173.953 77.192C173.393 78.136 172.617 78.888 171.625 79.448C170.649 79.992 169.577 80.264 168.409 80.264ZM168.433 77.288C169.313 77.288 170.041 76.984 170.617 76.376C171.209 75.768 171.505 75 171.505 74.072C171.505 73.144 171.209 72.368 170.617 71.744C170.041 71.12 169.313 70.808 168.433 70.808C167.537 70.808 166.801 71.12 166.225 71.744C165.649 72.352 165.361 73.128 165.361 74.072C165.361 75 165.649 75.768 166.225 76.376C166.801 76.984 167.537 77.288 168.433 77.288ZM177.418 67.856H178.474L184.042 74.072L189.658 67.856H190.69V80H187.45V74.288L184.57 77.528H183.49L180.634 74.312V80H177.418V67.856ZM199.651 80.264C198.483 80.264 197.411 79.992 196.435 79.448C195.475 78.888 194.715 78.136 194.155 77.192C193.595 76.232 193.315 75.184 193.315 74.048C193.315 72.912 193.595 71.872 194.155 70.928C194.715 69.968 195.483 69.216 196.459 68.672C197.435 68.128 198.507 67.856 199.675 67.856C200.843 67.856 201.915 68.136 202.891 68.696C203.867 69.24 204.635 69.984 205.195 70.928C205.771 71.872 206.059 72.912 206.059 74.048C206.059 75.184 205.771 76.232 205.195 77.192C204.635 78.136 203.859 78.888 202.867 79.448C201.891 79.992 200.819 80.264 199.651 80.264ZM199.675 77.288C200.555 77.288 201.283 76.984 201.859 76.376C202.451 75.768 202.747 75 202.747 74.072C202.747 73.144 202.451 72.368 201.859 71.744C201.283 71.12 200.555 70.808 199.675 70.808C198.779 70.808 198.043 71.12 197.467 71.744C196.891 72.352 196.603 73.128 196.603 74.072C196.603 75 196.891 75.768 197.467 76.376C198.043 76.984 198.779 77.288 199.675 77.288ZM224.812 80H208.66V68.12H211.876V77.264H215.692V68.12H218.908V77.264H222.724V68.12H225.94V77.264H227.884V83.384H224.812V80ZM230.34 68.12H233.556V72.464H237.948V68.12H241.164V80H237.948V75.224H233.556V80H230.34V68.12ZM255.44 67.856V80H252.2V73.568L245.576 80.288H244.52V68.12H247.736V74.6L254.384 67.856H255.44ZM266.713 80L262.009 73.712V80H258.793V68.12H262.009V73.664L266.497 68.12H270.169L265.681 73.544L270.553 80H266.713Z" fill="var(--text-primary)"/>
                    </svg>

                    {/* Interactive Back Button overlay */}
                    <button
                        onClick={() => router.back()}
                        className="absolute top-0 left-0 w-[80px] h-[102px] cursor-pointer appearance-none z-[60]"
                        aria-label="Назад"
                    />
                </header>

                {/* Strict Minimal Background with Tech Grid */}
                <div className="absolute inset-0 z-0 bg-transparent md:rounded-[32px] overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" 
                         style={{ backgroundImage: 'linear-gradient(var(--text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)', backgroundSize: '24px 24px' }} 
                    />
                    <div className="absolute top-0 left-0 right-0 h-[300px] bg-gradient-to-b from-[#00E5FF]/[0.02] to-transparent pointer-events-none" />
                </div>

                {/* Chat Area */}
                <main
                    ref={scrollRef}
                    className="flex-1 px-6 pt-[120px] md:pt-8 pb-[120px] md:pb-8 overflow-y-auto space-y-8 scroll-smooth hide-scrollbar transition-colors duration-300 md:bg-transparent relative z-10"
                >
                    <AnimatePresence initial={false}>
                    {messages.map((msg, idx) => {
                        const isSystem = (msg as any).senderPhone === 'SYSTEM';
                        const isMe = msg.role === 'user';
                        const isOperator = (msg as any).isAdminSender && (msg as any).senderPhone !== 'AI_ASSISTANT';

                        if (isSystem) {
                            return (
                                <div key={msg.id} className="flex justify-center my-4 animate-in fade-in duration-500">
                                    <div className="bg-[var(--panel-bg)]/80 backdrop-blur-sm px-5 py-2 rounded-full text-[11px] text-[var(--text-secondary)] font-bold uppercase tracking-[0.1em] border border-[var(--border-color)]" style={{ fontFamily: 'var(--font-cera)' }}>
                                        {msg.text}
                                    </div>
                                </div>
                            );
                        }

                            return (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, x: isMe ? 20 : -20, scale: 0.97 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    transition={{ duration: 0.35, ease: "easeOut" }}
                                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-full`}
                                >
                                    <div className={`
                                        max-w-[85%] px-[20px] py-[16px] flex flex-col gap-1.5 relative transition-all duration-300 shadow-sm
                                        ${isMe 
                                            ? "bg-gradient-to-br from-[var(--text-primary)] to-[var(--text-secondary)] text-[var(--bg-color)] rounded-[20px] rounded-tr-[4px]" 
                                            : "bg-[var(--card-bg)] border border-[#00E5FF]/20 shadow-[inset_2px_0_0_#00E5FF,0_4px_20px_rgba(0,229,255,0.03)] text-[var(--text-primary)] rounded-[20px] rounded-tl-[4px]"
                                        }
                                    `}>
                                     {/* Simple AI Assistant Avatar badge */}
                                    {!isMe && (
                                        <div className="flex absolute -left-[10px] -top-[10px] w-6 h-6 rounded-[8px] bg-[var(--text-primary)] items-center justify-center border-2 border-[var(--bg-color)] z-10 overflow-hidden">
                                            <AnimatedTLogo size={14} className="text-[var(--bg-color)]" />
                                        </div>
                                    )}
                                    <p style={textStyle} className="whitespace-pre-wrap relative z-10 leading-relaxed font-medium">{msg.text}</p>
                                    
                                    {msg.link && (
                                        <button
                                            onClick={() => router.push(msg.link!.url)}
                                            className="block mt-1 text-[var(--accent-cyan)] text-[14px] font-bold underline decoration-[var(--accent-cyan)]/30 underline-offset-4 active:opacity-60 transition-all font-cera"
                                        >
                                            {msg.link.text}
                                        </button>
                                    )}
 
                                    {/* Buttons Chips Container */}
                                    {msg.buttons && (
                                        <div className="flex flex-wrap gap-2 mt-3 mb-1">
                                            {msg.buttons.map((btnText, idx) => {
                                                const isCallHuman = btnText === "Позвать живого человека";
                                                return (
                                                    <button
                                                        key={idx}
                                                        onClick={() => handleSend(btnText, true)}
                                                        className={`overflow-hidden relative px-4 py-2 rounded-[16px] active:scale-95 transition-all text-[13px] font-bold font-cera flex items-center justify-center gap-2.5 shadow-sm ${
                                                            isCallHuman 
                                                                ? "w-full mt-2 bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-secondary)] text-[var(--bg-color)] hover:opacity-90 shadow-[0_4px_15px_rgba(0,0,0,0.1)]" 
                                                                : "bg-[var(--card-bg)] border border-[#00E5FF]/20 text-[var(--text-primary)] hover:bg-[#00E5FF]/5"
                                                        }`}
                                                    >
                                                        {isCallHuman && (
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-bounce-short">
                                                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                                            </svg>
                                                        )}
                                                        <span>{btnText}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
 
                                    <div className={`text-[10px] mt-1 opacity-40 font-medium tabular-nums ${isMe ? "text-right" : "text-left"}`}>
                                        {new Date(msg.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                    </AnimatePresence>

                    {isTyping && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex items-center gap-2 max-w-[85%] px-[20px] py-[16px] bg-[var(--card-bg)] border border-[#00E5FF]/20 shadow-[inset_2px_0_0_#00E5FF,0_4px_20px_rgba(0,229,255,0.03)] rounded-[20px] rounded-tl-[4px] w-fit relative"
                        >
                            <div className="flex absolute -left-[10px] -top-[10px] w-6 h-6 rounded-[8px] bg-[var(--text-primary)] items-center justify-center border-2 border-[var(--bg-color)] z-10 overflow-hidden">
                                <AnimatedTLogo size={14} className="text-[var(--bg-color)]" />
                            </div>
                            <div className="flex gap-1.5 items-center justify-center h-4">
                                {[0, 1, 2].map((i) => (
                                    <motion.div
                                        key={i}
                                        className="w-1.5 h-1.5 rounded-full bg-[var(--text-secondary)]"
                                        animate={{ opacity: [0.4, 1, 0.4] }}
                                        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </main>

                {/* Mobile Chat Input - Sleek & Serious */}
                <div className="md:hidden fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[375px] px-[16px] pb-[34px] bg-[var(--bg-color)]/90 backdrop-blur-xl z-[60] border-t border-[var(--border-color)] transition-all duration-300">
                    <div className="flex items-center gap-[8px] h-[48px] mt-[12px]">
                        <div className="flex-1 bg-[var(--card-bg)]/50 border border-[var(--border-color)] rounded-[20px] h-full flex items-center px-[20px] outline-none focus-within:border-[#00E5FF]/40 focus-within:shadow-[0_0_15px_rgba(0,229,255,0.08)] transition-all duration-300">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && input.trim()) handleSend(input, false);
                                }}
                                placeholder="Сообщение..."
                                className="w-full bg-transparent text-[16px] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] outline-none"
                                style={{ fontFamily: 'var(--font-cera), sans-serif' }}
                            />
                        </div>
 
                        <button
                            onClick={() => handleSend(input, false)}
                            disabled={!input.trim()}
                            className={`w-[48px] h-[48px] rounded-full flex items-center justify-center transition-all shrink-0 disabled:opacity-50
                                ${input.trim() 
                                    ? 'bg-gradient-to-br from-[var(--text-primary)] to-[var(--text-secondary)] text-[var(--bg-color)] active:scale-95 shadow-[0_4px_15px_rgba(0,0,0,0.15)]' 
                                    : 'bg-[var(--bg-color)] border border-[var(--border-color)] text-[var(--text-primary)]'
                                }
                            `}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 19V5M12 5l-7 7M12 5l7 7" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Desktop Chat Input */}
                <div className="hidden md:flex shrink-0 px-8 py-6 bg-[var(--card-bg)] border-t border-[var(--border-color)] w-full items-center gap-4 transition-colors duration-300 relative z-[60]">
                    <button className="w-[56px] h-[56px] rounded-full bg-[var(--nav-bg)] border border-[var(--border-color)] flex items-center justify-center shrink-0 active:scale-95 transition-all hover:border-[var(--text-primary)] group">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-[var(--text-primary)]" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                        </svg>
                    </button>
                    
                    <div className="flex-1 h-[56px] rounded-[20px] bg-[var(--bg-color)]/50 border border-[var(--border-color)] focus-within:border-[#00E5FF]/40 focus-within:shadow-[inset_0_0_10px_rgba(0,229,255,0.02),0_0_15px_rgba(0,229,255,0.08)] px-6 flex items-center transition-all duration-300">
                        <input
                            autoFocus
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && input.trim()) handleSend(input, false);
                            }}
                            placeholder="Сообщение..."
                            className="w-full h-full bg-transparent text-[16px] text-[var(--text-primary)] outline-none placeholder:text-[var(--text-secondary)] font-medium"
                            style={{ fontFamily: 'var(--font-cera), sans-serif' }}
                        />
                    </div>
                
                    <button
                        onClick={() => handleSend(input, false)}
                        disabled={!input.trim()}
                        className={`w-[56px] h-[56px] rounded-full flex items-center justify-center transition-all shrink-0 disabled:opacity-50
                            ${input.trim() 
                                ? 'bg-gradient-to-br from-[var(--text-primary)] to-[var(--text-secondary)] text-[var(--bg-color)] hover:opacity-90 active:scale-95 cursor-pointer shadow-[0_6px_20px_rgba(0,0,0,0.15)]' 
                                : 'bg-[var(--bg-color)] border border-[var(--border-color)] text-[var(--text-primary)]'
                            }
                        `}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 19V5M12 5l-7 7M12 5l7 7" />
                        </svg>
                    </button>
                </div>
            </div>
            <style jsx global>{`
                ::-webkit-scrollbar { display: none; }
                * { -ms-overflow-style: none; scrollbar-width: none; }
                @keyframes bounce-short {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-3px); }
                }
                .animate-bounce-short {
                    animation: bounce-short 1s ease-in-out infinite;
                }
                .animate-spin-slow {
                    animation: spin 8s linear infinite;
                }
            `}</style>
        </motion.div>
        </AnimatePresence>
    );
}
