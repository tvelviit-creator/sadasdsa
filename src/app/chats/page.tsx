"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getActiveRole, getCurrentUserPhone } from "@/utils/userData";
import { getClientOrders, getSellerOrders, Order } from "@/utils/orders";
import { ChatMessage, sendChatMessage } from "@/utils/chat";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

const AnimatedTLogo = ({ size = 28, className = "" }: { size?: number, className?: string }) => {
    return (
        <div className={`relative flex items-center justify-center shrink-0 ${className}`} style={{ width: size, height: size }}>
            {/* Subtle Core Pulse background */}
            <motion.div 
                className="absolute inset-[-6px] bg-[var(--accent-cyan)]/20 rounded-full blur-lg"
                animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.2, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            
            {/* The Brand Logo - Rounded Box + T */}
            <div className="relative w-full h-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                <div className="absolute inset-0 bg-white rounded-[12px] shadow-sm shadow-white/20" />
                <span className="relative z-10 text-black font-black text-lg font-cera translate-y-[1px]">T</span>
            </div>
        </div>
    );
};

const AI_CHATS_ID = "ai-support-chat";

export default function ChatsPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [role, setRole] = useState<"client" | "seller" | null>(null);
    const [loading, setLoading] = useState(true);
    const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
    
    // Desktop Chat features
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputText, setInputText] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // --- AI Integrated State ---
    const [aiMessages, setAiMessages] = useState<any[]>([]);
    const [isAiTyping, setIsAiTyping] = useState(false);
    const [isSupportActive, setIsSupportActive] = useState(false);
    const [userPhone, setUserPhone] = useState<string | null>(null);
    const hasGreetedRef = useRef(true);

    const defaultGreeting = [
        {
            id: "greeting_1",
            role: "assistant",
            text: "Привет!\nЯ могу помочь тебе выбрать нужный продукт и подскажу как собрать подходящий твоей задаче заказ.\nРасскажи о своем проекте.",
            timestamp: new Date().toISOString(),
            buttons: ["Проблема с заказом", "Проблема с оплатой", "Проблема с приложением", "Как разместить свои услуги?", "Позвать живого человека"]
        }
    ];

    useEffect(() => {
        const rawPhone = getCurrentUserPhone() || "guest";
        const phone = rawPhone !== "guest" ? rawPhone.replace(/\D/g, '') : "guest";
        setUserPhone(phone);
    }, []);

    useEffect(() => {
        if (!userPhone) return;
        const savedMessages = localStorage.getItem(`aiChatMessages_${userPhone}`);
        const savedSupportActive = localStorage.getItem(`aiChatIsSupportActive_${userPhone}`);
        
        if (savedMessages) {
            try {
                const parsed = JSON.parse(savedMessages);
                setAiMessages(parsed.length > 0 ? parsed : defaultGreeting);
            } catch (e) { setAiMessages(defaultGreeting); }
        } else {
            setAiMessages(defaultGreeting);
        }
        if (savedSupportActive === "true") setIsSupportActive(true);
    }, [userPhone]);

    useEffect(() => {
        if (!userPhone) return;
        localStorage.setItem(`aiChatMessages_${userPhone}`, JSON.stringify(aiMessages));
        localStorage.setItem(`aiChatIsSupportActive_${userPhone}`, isSupportActive.toString());
    }, [aiMessages, isSupportActive, userPhone]);

    // AI Support Polling
    useEffect(() => {
        if (!isSupportActive || !userPhone || userPhone === "guest") return;
        const checkSupport = async () => {
            try {
                const res = await fetch(`/api/chat?orderId=support_${userPhone}`);
                if (res.ok) {
                    const serverMsgs = await res.json();
                    setAiMessages(prev => {
                        const newMsgs = serverMsgs
                            .filter((sm: any) => !prev.some(pm => pm.id === sm.id))
                            .map((sm: any) => ({
                                id: sm.id,
                                role: sm.isAdminSender ? 'assistant' : 'user',
                                text: sm.text,
                                isAdminSender: sm.isAdminSender,
                                senderPhone: sm.senderPhone,
                                buttons: sm.buttons,
                                timestamp: sm.timestamp
                            }));
                        return newMsgs.length > 0 ? [...prev, ...newMsgs] : prev;
                    });
                }
            } catch (e) {}
        };
        const interval = setInterval(checkSupport, 3000);
        return () => clearInterval(interval);
    }, [isSupportActive, userPhone]);
    // --- End AI Integrated State ---

    useEffect(() => {
        const activeRole = getActiveRole();
        const phone = getCurrentUserPhone();
        setRole(activeRole);

        async function fetchOrders() {
            if (!phone) {
                setLoading(false);
                return;
            }

            let clientData = await getClientOrders(phone);
            let sellerData = await getSellerOrders(phone);

            const isAdmin = phone === "79999999999" || phone === "79001112233";
            if (isAdmin) {
                try {
                    const adminOrders = await getSellerOrders("ADMIN");
                    sellerData = [...sellerData, ...adminOrders];
                } catch (e) {
                    console.error("Failed to fetch admin orders", e);
                }
            }
            
            let combined = [...clientData, ...sellerData];
            let data = Array.from(new Map(combined.map(item => [item.id, item])).values());
            
            data.sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime());

            if (isAdmin) {
                data = data.filter(order => order.status !== "completed" && order.status !== "cancelled");
            }

            setOrders(data);
            setLoading(false);

            data.forEach(async (order) => {
                const res = await fetch(`/api/chat?orderId=${order.id}`);
                const msgs = await res.json();
                const count = msgs.filter((m: any) => m.senderPhone !== phone && !m.isRead).length;
                setUnreadCounts(prev => ({ ...prev, [order.id]: count }));
            });
        }

        fetchOrders();
        const interval = setInterval(fetchOrders, 5000);
        return () => clearInterval(interval);
    }, []);

    // Desktop Chat effect
    useEffect(() => {
        if (!selectedOrder) return;
        
        const phone = getCurrentUserPhone();


        const fetchChat = async () => {
            try {
                const res = await fetch(`/api/chat?orderId=${selectedOrder.id}`);
                if (res.ok) {
                    const msgs = await res.json();
                    setMessages(msgs);
                    
                    const hasUnread = msgs.some((m: any) => m.senderPhone !== phone && !m.isRead);
                    if (hasUnread) {
                       await fetch(`/api/chat?markRead=true&orderId=${selectedOrder.id}&phone=${phone}`);
                       setUnreadCounts(prev => ({ ...prev, [selectedOrder.id]: 0 }));
                    }
                }
            } catch (e) {}
        };

        fetchChat();
        const interval = setInterval(fetchChat, 3000);
        return () => clearInterval(interval);
    }, [selectedOrder]);

    useEffect(() => {
        if (selectedOrder && chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: "smooth"
            });
        }
    }, [messages, selectedOrder]);

    const handleOrderClick = (order: Order) => {
        if (window.innerWidth >= 768) {
            setSelectedOrder(order);
        } else {
            const phone = getCurrentUserPhone();
            if (order.id === AI_CHATS_ID) {
                router.push("/aichat");
            } else if (order.sellerPhone === phone) {
                router.push(`/lkseller/orders/${order.id}?tab=chat`);
            } else {
                router.push(`/order/${order.id}?tab=chat`);
            }
        }
    };

    const handleSendAI = async (textToSend?: string) => {
        const query = textToSend || inputText;
        if (!query.trim() || !userPhone) return;

        const userMsg = {
            id: Date.now().toString(),
            role: "user",
            text: query,
            timestamp: new Date().toISOString()
        };

        setAiMessages(prev => [...prev, userMsg]);
        setInputText("");

        if (isSupportActive) {
            fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: userMsg.id, orderId: `support_${userPhone}`,
                    senderPhone: userPhone, text: query,
                    timestamp: userMsg.timestamp, isAdminSender: false, isRead: false
                })
            });
            return;
        }

        setIsAiTyping(true);
        setTimeout(() => {
            let responseText = "Запрос принят. Чем еще я могу помочь?";
            let buttons = ["Позвать живого человека"];
            
            if (query === "Позвать живого человека") {
                responseText = "Переключаю на оператора... Ожидайте ответа.";
                fetch('/api/support', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userPhone, text: 'Запрос из чата', type: 'support' })
                }).then(res => {
                    if (!res.ok) throw new Error('Failed to reach support');
                    setIsSupportActive(true);
                }).catch(e => {
                    alert("Ошибка при вызове оператора. Попробуйте позже.");
                    setAiMessages(prev => prev.filter(m => m.id !== aiResponse.id)); // Remove typing/success if failed
                });
                buttons = [];
            } else if (query.includes("заказ")) {
                responseText = "Опишите вашу проблему с заказом, и я помогу вам.";
            }

            const aiResponse = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                text: responseText,
                timestamp: new Date().toISOString(),
                buttons: buttons.length > 0 ? buttons : undefined
            };
            setAiMessages(prev => [...prev, aiResponse]);
            setIsAiTyping(false);
        }, 1000);
    };

    const handleSendMessage = () => {
        if (selectedOrder?.id === AI_CHATS_ID) {
            handleSendAI();
            return;
        }
        const phone = getCurrentUserPhone();
        if (!inputText.trim() || !selectedOrder || !phone) return;
        
        const newMessage: ChatMessage = {
            id: `msg_${Date.now()}`,
            orderId: selectedOrder.id,
            senderPhone: phone,
            text: inputText.trim(),
            timestamp: new Date().toISOString()
        };
        sendChatMessage(newMessage);
        setMessages(prev => [...prev, newMessage]);
        setInputText("");
    };

    const currentPhone = getCurrentUserPhone();

    return (
        <div className="min-h-screen bg-transparent text-[var(--text-primary)] font-sans transition-colors duration-300 w-full flex">
            
            {/* Desktop Full Layout */}
            <div className="w-full h-screen flex flex-col md:py-16 md:px-12 relative overflow-hidden">
                
                {/* Mobile Header */}
                <header className="md:hidden fixed top-0 left-0 w-full h-[102px] bg-black/40 backdrop-blur-3xl border-b border-white/5 z-[50] px-6 flex items-end pb-[16px] transition-colors duration-300 shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
                    <h1 className="text-[28px] font-bold text-[var(--text-primary)] tracking-tight" style={{ fontFamily: 'var(--font-cera), sans-serif' }}>
                        Чаты
                    </h1>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 w-full pt-[124px] md:pt-0 pb-32 md:pb-0 flex gap-10 overflow-hidden md:h-full px-6 md:px-0">
                    
                    {/* Left Panel Wrapper (Desktop Context) */}
                    <div className="w-full md:w-[380px] lg:w-[420px] shrink-0 flex flex-col h-[calc(100vh-140px)] md:h-full overflow-hidden">
                        
                        {/* Integrated Header for Desktop */}
                        <header className="hidden md:flex flex-col mb-10 shrink-0">
                            <h1 className="text-4xl md:text-5xl font-black font-cera text-[var(--text-primary)] tracking-tight leading-none uppercase">
                                ВАШИ<br/>
                                <span className="text-[var(--text-secondary)] opacity-50">ДИАЛОГИ</span>
                            </h1>
                        </header>

                        {/* Left Panel: Chat List Container */}
                        <div className="flex-1 flex flex-col md:bg-[var(--card-bg)] md:border md:border-[var(--border-color)] md:rounded-[32px] md:p-6 md:shadow-sm overflow-hidden min-h-0">
                            
                            {/* Scrollable Area for Chats */}
                            <div className="flex-1 overflow-y-auto hide-scrollbar">
                            
                                {/* TVELF AI - Clean Premium Aesthetic */}
                                <button
                                    onClick={() => handleOrderClick({ id: AI_CHATS_ID, title: 'ИИ Поддержка', sellerPhone: 'AI_ASSISTANT' } as any)}
                                    className="w-full mb-10 relative group shrink-0"
                                >
                                    <div className={`relative flex items-center gap-5 p-6 rounded-[24px] transition-all duration-300 md:border
                                        ${selectedOrder?.id === AI_CHATS_ID 
                                            ? "bg-[var(--text-primary)] border-[var(--text-primary)] shadow-2xl" 
                                            : "bg-black/40 backdrop-blur-3xl border-white/5 shadow-2xl md:bg-[var(--card-bg)] md:border-[var(--border-color)] md:shadow-sm md:hover:border-[var(--accent-cyan)]"
                                        }
                                    `}>
                                        <div className={`shrink-0 w-[54px] h-[54px] rounded-[18px] flex items-center justify-center transition-colors duration-300
                                            ${selectedOrder?.id === AI_CHATS_ID ? "bg-[var(--bg-color)]" : "bg-[#0F1115]"}
                                        `}>
                                            <AnimatedTLogo 
                                                size={24} 
                                            />
                                        </div>
                                        
                                        <div className="flex-1 flex flex-col items-start">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className={`text-[19px] font-bold tracking-tight ${selectedOrder?.id === AI_CHATS_ID ? "text-[var(--bg-color)]" : "text-[var(--text-primary)]"}`}>
                                                    TVELF AI
                                                </span>
                                                <div className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider
                                                    ${selectedOrder?.id === AI_CHATS_ID ? "bg-[var(--bg-color)]/20 text-[var(--bg-color)]" : "bg-[var(--accent-cyan)]/10 text-[var(--accent-cyan)]"}
                                                `}>
                                                    PRO
                                                </div>
                                            </div>
                                            <p className={`text-[13px] font-medium transition-opacity ${selectedOrder?.id === AI_CHATS_ID ? "text-[var(--bg-color)] opacity-70" : "text-[var(--text-secondary)]"}`}>
                                                Интеллектуальный помощник
                                            </p>
                                        </div>
                                        
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all
                                            ${selectedOrder?.id === AI_CHATS_ID 
                                                ? "bg-[var(--bg-color)]/10 text-[var(--bg-color)]" 
                                                : "text-[var(--text-secondary)] opacity-0 group-hover:opacity-100 group-hover:translate-x-1"
                                            }
                                        `}>
                                            <ArrowRight className="w-5 h-5" />
                                        </div>
                                    </div>
                                </button>

                                <div className="h-[1px] w-full bg-[var(--border-color)] mb-8 opacity-20 shrink-0" />

                                {/* Title for orders chat */}
                                <div className="px-4 mb-4 flex items-center justify-between shrink-0">
                                    <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] opacity-40">Чаты по заказам</span>
                                    <span className="text-[10px] font-black text-[var(--text-secondary)] opacity-20">{orders.length}</span>
                                </div>

                                {/* Orders List */}
                                <div className="space-y-3 pb-4">
                                    {loading ? (
                                        <div className="text-center py-10 text-[var(--text-secondary)] animate-pulse">Загрузка чатов...</div>
                                    ) : orders.length === 0 ? (
                                        <div className="text-center py-10 text-[var(--text-secondary)] font-medium">Нет активных чатов по заказам</div>
                                    ) : (
                                        orders.map((order) => {
                                            const isSeller = order.sellerPhone === currentPhone;
                                            const otherName = isSeller ? (order.clientName || 'Клиент') : (order.sellerPhone === 'ADMIN' ? 'Твэлви' : (order.partnerName || 'Партнер'));
                                            const orderIdStr = order.orderNumber ? `№${order.orderNumber}` : `№${order.id.slice(-4)}`;
                                            const isSelected = selectedOrder && selectedOrder.id === order.id;

                                            return (
                                                <button
                                                    key={order.id}
                                                    onClick={() => handleOrderClick(order)}
                                                    className={`w-full rounded-[24px] p-4 flex items-center gap-4 active:scale-98 transition-all group text-left hover:shadow-md
                                                        ${isSelected 
                                                            ? "bg-[var(--text-primary)] shadow-lg md:border-[var(--text-primary)]" 
                                                            : "bg-black/40 backdrop-blur-3xl border border-white/5 shadow-2xl md:bg-[var(--card-bg)] md:border-[var(--border-color)] md:backdrop-blur-none md:shadow-none"
                                                        }
                                                    `}
                                                >
                                                    <div className={`w-[52px] h-[52px] rounded-[18px] flex items-center justify-center shrink-0 text-[16px] font-bold border transition-colors duration-300
                                                        ${isSelected ? "bg-[var(--bg-color)] text-[var(--text-primary)] border-transparent" : "bg-[var(--nav-bg)] text-[var(--text-primary)] border-[var(--border-color)] group-hover:bg-[var(--text-primary)] group-hover:text-[var(--bg-color)]"}
                                                    `}>
                                                        {order.orderNumber ? String(order.orderNumber).slice(-2) : '№'}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex justify-between items-start mb-1 gap-2">
                                                            <span className={`text-[17px] font-bold line-clamp-1 flex-1 tracking-tight ${isSelected ? "text-[var(--bg-color)]" : "text-[var(--text-primary)]"}`} style={{ fontFamily: 'var(--font-cera)' }}>{order.title}</span>
                                                            <div className="flex flex-col items-end shrink-0 gap-1">
                                                                <span className={`text-[11px] font-bold transition-colors ${isSelected ? "text-[var(--bg-color)] opacity-60" : "text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"}`} style={{ fontFamily: 'var(--font-cera)' }}>
                                                                    {formatDate(order.updatedAt || order.createdAt)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex justify-between items-center mt-1">
                                                            <p className={`text-[14px] line-clamp-1 font-medium transition-colors ${isSelected ? "text-[var(--bg-color)] opacity-80" : "text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"}`}>
                                                                {otherName} • {orderIdStr}
                                                            </p>
                                                            {unreadCounts[order.id] > 0 && !isSelected && (
                                                                <div className="w-[20px] h-[20px] bg-[#FF8C67] rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(255,140,103,0.5)] animate-pulse shrink-0">
                                                                    <span className="text-[11px] font-black text-white">{unreadCounts[order.id]}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                {/* Right Panel: Chat Active Window (Hidden on Mobile) */}
                    <div className="hidden md:flex flex-col flex-1 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-[32px] overflow-hidden shadow-sm h-full">
                        {!selectedOrder ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-[var(--text-secondary)]">
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-20 mb-4">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                                </svg>
                                <p className="text-lg font-medium">Выберите чат слева</p>
                            </div>
                        ) : (
                            <>
                                {/* Chat Header */}
                                <div className="h-[80px] border-b border-[var(--border-color)] flex justify-between items-center px-6 bg-[var(--bg-color)] shrink-0">
                                    <div className="flex flex-col">
                                        <h2 className="text-xl font-bold text-[var(--text-primary)] font-cera line-clamp-1 uppercase tracking-tight">
                                            {selectedOrder.id === AI_CHATS_ID ? 'TVELF AI' : selectedOrder.title}
                                        </h2>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            {selectedOrder.id === AI_CHATS_ID ? (
                                                <>
                                                    <motion.div 
                                                        className="w-2 h-2 rounded-full bg-[var(--accent-cyan)]"
                                                        animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.1, 0.9] }}
                                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                                    />
                                                    <span className="text-[11px] font-bold text-[var(--accent-cyan)] uppercase tracking-wider">Online</span>
                                                </>
                                            ) : (
                                                <p className="text-xs font-medium text-[var(--text-secondary)]">
                                                    {selectedOrder.sellerPhone === currentPhone 
                                                        ? `С клиентом (${selectedOrder.clientName || 'Без имени'})`
                                                        : `С ${selectedOrder.sellerPhone === 'ADMIN' ? 'поддержкой' : 'селлером'}`}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    {selectedOrder.id !== AI_CHATS_ID && (
                                        <button 
                                            onClick={() => {
                                                if (selectedOrder.sellerPhone === currentPhone) {
                                                    router.push(`/lkseller/orders/${selectedOrder.id}`);
                                                } else {
                                                    router.push(`/order/${selectedOrder.id}`);
                                                }
                                            }}
                                            className="h-10 px-4 rounded-full border border-[var(--border-color)] text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--text-primary)] hover:text-[var(--bg-color)] transition-colors flex items-center justify-center shrink-0"
                                        >
                                            К заказу
                                        </button>
                                    )}
                                </div>
                                
                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-6 scroll-smooth" ref={chatContainerRef}>
                                    <div className="flex flex-col space-y-4">
                                        {selectedOrder.id === AI_CHATS_ID ? (
                                            <>
                                                {aiMessages.map((msg, idx) => {
                                                    const isMe = msg.role === 'user';
                                                    return (
                                                        <div key={idx} className={`flex flex-col ${isMe ? "items-end" : "items-start"} mt-1 animate-in zoom-in-95 duration-200`}>
                                                            <div className={`
                                                                max-w-[80%] px-[20px] py-[16px] text-[15px] leading-relaxed break-words whitespace-pre-wrap flex flex-col gap-1.5 relative transition-all duration-300 shadow-sm
                                                                ${isMe 
                                                                    ? "bg-gradient-to-br from-[var(--text-primary)] to-[var(--text-secondary)] text-[var(--bg-color)] rounded-[20px] rounded-tr-[4px]" 
                                                                    : "bg-[var(--card-bg)] border border-[#00E5FF]/20 shadow-[inset_2px_0_0_#00E5FF] text-[var(--text-primary)] rounded-[20px] rounded-tl-[4px]"
                                                                }
                                                            `}>
                                                                {!isMe && (
                                                                    <div className="flex absolute -left-[10px] -top-[10px] w-6 h-6 rounded-[8px] bg-[var(--text-primary)] items-center justify-center border-2 border-[var(--card-bg)] z-10 overflow-hidden">
                                                                        <AnimatedTLogo size={14} className="text-[var(--bg-color)]" />
                                                                    </div>
                                                                )}
                                                                <span className="font-medium">{msg.text}</span>
                                                                
                                                                {msg.buttons && (
                                                                    <div className="flex flex-wrap gap-2 mt-3">
                                                                        {msg.buttons.map((btnText: string, bIdx: number) => (
                                                                            <button
                                                                                key={bIdx}
                                                                                onClick={() => handleSendAI(btnText)}
                                                                                className="px-3 py-1.5 rounded-xl bg-[var(--nav-bg)] border border-[var(--border-color)] text-[12px] font-bold text-[var(--text-primary)] hover:bg-[var(--text-primary)] hover:text-[var(--bg-color)] transition-all"
                                                                            >
                                                                                {btnText}
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                )}

                                                                <div className={`text-[9.5px] mt-1 opacity-50 font-medium tabular-nums uppercase tracking-widest ${isMe ? "text-right" : "text-left"}`}>
                                                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                                {isAiTyping && (
                                                    <div className="flex items-center gap-2 max-w-[80%] px-[20px] py-[16px] bg-[var(--card-bg)] border border-[#00E5FF]/20 shadow-[inset_2px_0_0_#00E5FF] rounded-[20px] rounded-tl-[4px] w-fit relative">
                                                        <div className="flex absolute -left-[10px] -top-[10px] w-6 h-6 rounded-[8px] bg-[var(--text-primary)] items-center justify-center border-2 border-[var(--card-bg)] z-10 overflow-hidden">
                                                            <AnimatedTLogo size={14} className="text-[var(--bg-color)]" />
                                                        </div>
                                                        <div className="flex gap-1.5">
                                                            {[0, 1, 2].map((i) => (
                                                                <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-[var(--text-secondary)]" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                {messages.length === 0 ? (
                                                    <div className="flex flex-col items-center justify-center h-full pt-20 opacity-30 text-center text-[var(--text-primary)]">
                                                        <p className="font-bold">Сообщений пока нет</p>
                                                    </div>
                                                ) : (
                                                    messages.map((msg, idx) => {
                                                        const isMe = msg.senderPhone === currentPhone;
                                                        const isSystem = msg.isSystem || msg.senderPhone === 'SYSTEM';

                                                        if (isSystem) return (
                                                            <div key={idx} className="flex justify-center w-full py-2">
                                                                <div className="max-w-[80%] text-center px-4 py-1.5 text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.1em] bg-[var(--nav-bg)] rounded-full border border-[var(--border-color)]">
                                                                    {msg.text}
                                                                </div>
                                                            </div>
                                                        );

                                                        return (
                                                            <div key={idx} className={`flex flex-col ${isMe ? "items-end" : "items-start"} mt-1 animate-in zoom-in-95 duration-200`}>
                                                                <div className={`
                                                                    max-w-[75%] px-[20px] py-[16px] text-[15px] leading-relaxed break-words whitespace-pre-wrap flex flex-col gap-1 relative transition-all duration-300
                                                                    ${isMe 
                                                                        ? "bg-[var(--text-primary)] text-[var(--bg-color)] rounded-[24px] rounded-br-[4px]" 
                                                                        : "bg-[var(--card-bg)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-[24px] rounded-bl-[4px]"
                                                                    }
                                                                `}>
                                                                    <span className="font-medium">{msg.text}</span>
                                                                    <div className={`text-[9.5px] mt-1 opacity-50 font-medium tabular-nums uppercase tracking-widest ${isMe ? "text-right" : "text-left"}`}>
                                                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                )}
                                            </>
                                        )}
                                        <div ref={messagesEndRef} />
                                    </div>
                                </div>

                                {/* Input Area */}
                                <div className="p-4 bg-[var(--bg-color)] border-t border-[var(--border-color)] shrink-0 z-50">
                                    <div className="flex items-center gap-3 h-[56px] max-w-[1000px] mx-auto">
                                        <button className="w-[52px] h-[52px] rounded-full bg-[var(--nav-bg)] border border-[var(--border-color)] flex items-center justify-center shrink-0 hover:border-[var(--text-primary)] transition-colors group">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-[var(--text-primary)]" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                                            </svg>
                                        </button>
                                        <div className="flex-1 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-[20px] h-[52px] flex items-center px-[20px] transition-all duration-300 focus-within:border-[var(--text-secondary)]">
                                            <input
                                                type="text"
                                                value={inputText}
                                                onChange={(e) => setInputText(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && inputText.trim()) handleSendMessage();
                                                }}
                                                placeholder="Написать сообщение..."
                                                className="w-full h-full bg-transparent text-[16px] font-medium text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] outline-none"
                                            />
                                        </div>
                                        <button
                                            onClick={handleSendMessage}
                                            disabled={!inputText.trim()}
                                            className={`w-[52px] h-[52px] rounded-full flex items-center justify-center transition-all shrink-0 disabled:opacity-50
                                                ${inputText.trim() 
                                                    ? 'bg-[var(--text-primary)] text-[var(--bg-color)] active:scale-95' 
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
                            </>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}

function formatDate(dateStr: string) {
    if (!dateStr) return "12:00"; 
    const date = new Date(dateStr);
    const now = new Date();
    
    if (isNaN(date.getTime())) return "12:00";

    const isToday = date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    const isYesterday = date.getDate() === now.getDate() - 1 && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    
    if (isToday) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (isYesterday) {
        return "Вчера";
    }
    
    return date.toLocaleDateString([], { day: '2-digit', month: '2-digit' });
}
