"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { getOrderById, Order } from "@/utils/orders";
import { ChatMessage, getChatMessages, sendChatMessage } from "@/utils/chat";
import { getCurrentUserPhone, getUserData, UserData } from "@/utils/userData";

export default function OrderDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const orderId = params.id as string;

    const [order, setOrder] = useState<Order | null>(null);
    const [partner, setPartner] = useState<UserData | null>(null);
    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
    const [activeTab, setActiveTabInternal] = useState<"details" | "chat">((searchParams.get('tab') as "chat") || "details");
    const [showDisputeModal, setShowDisputeModal] = useState(false);

    const setActiveTab = (tab: "details" | "chat") => {
        const params = new URLSearchParams(searchParams);
        if (tab === 'chat') {
            params.set('tab', 'chat');
        } else {
            params.delete('tab');
        }
        router.replace(`${window.location.pathname}?${params.toString()}`, { scroll: false });
        setActiveTabInternal(tab);
    };

    const currentPhone = getCurrentUserPhone();

    // Chat states
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputText, setInputText] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const loadData = useCallback(async () => {
        const data = await getOrderById(orderId);
        if (data) {
            setOrder(data);
            const chatMsgs = await getChatMessages(orderId);
            setMessages(chatMsgs);

            if (data.sellerPhone && data.sellerPhone !== 'ADMIN') {
                const partnerData = await getUserData(data.sellerPhone);
                if (partnerData) setPartner(partnerData);
            }
        }
    }, [orderId]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const [hasUnreadInOrder, setHasUnreadInOrder] = useState(false);

    useEffect(() => {
        if (!orderId || !currentPhone) return;

        const checkUnread = async () => {
            try {
                const res = await fetch(`/api/chat?orderId=${orderId}`);
                if (res.ok) {
                    const msgs = await res.json();
                    const unread = msgs.some((m: any) => m.senderPhone !== currentPhone && !m.isRead);
                    setHasUnreadInOrder(unread);
                    if (activeTab === 'chat') {
                        setMessages(msgs);
                        if (unread) {
                            fetch(`/api/chat?markRead=true&orderId=${orderId}&phone=${currentPhone}`)
                                .then(() => {
                                    window.dispatchEvent(new CustomEvent('refreshUnread'));
                                });
                        }
                    }
                }
            } catch (e) {}
        };

        checkUnread();
        const interval = setInterval(checkUnread, 3000);
        return () => clearInterval(interval);
    }, [orderId, currentPhone, activeTab]);

    useEffect(() => {
        if (activeTab === "chat" && chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: "smooth"
            });
        }
    }, [messages, activeTab]);

    const handleSendMessage = () => {
        if (!inputText.trim() || !orderId || !currentPhone) return;
        const newMessage: ChatMessage = {
            id: `msg_${Date.now()}`,
            orderId: orderId,
            senderPhone: currentPhone,
            text: inputText.trim(),
            timestamp: new Date().toISOString()
        };
        sendChatMessage(newMessage);
        setMessages(prev => [...prev, newMessage]);
        setInputText("");
    };

    if (!order) return <div className="min-h-screen bg-[var(--bg-color)]" />;

    // Helper functions
    const getStatusInfo = (order: Order) => {
        const s = order.status;
        if (s === 'cancelled' || s === 'completed') return { text: 'Остановлен', bg: 'bg-[var(--accent-color)]' };
        if (s === 'pending') return { text: 'Ожидает', bg: 'bg-[#FFC700]' };
        return { text: 'В работе', bg: 'bg-[#4AC99B]' };
    };

    const statusInfo = getStatusInfo(order);
    const orderNumStr = order.orderNumber ? String(order.orderNumber).split('-').pop() : order.id.slice(-4);

    // Calculate progress step (1-5)
    const getProgressStep = (stage?: string) => {
        if (!stage) return 1;
        switch (stage) {
            case 'processing': return 1;
            case 'design': return 2;
            case 'development': return 3;
            case 'test': return 4;
            case 'ready': return 5;
            default: return 1;
        }
    };
    const progress = getProgressStep(order.stage);

    return (
        <div className="min-h-screen bg-transparent text-[var(--text-primary)] font-sans overflow-x-hidden transition-colors duration-300 w-full flex">
            
            {/* Premium Desktop Architectural Layout */}
            <div className="hidden lg:flex flex-col w-full px-12 pt-16 pb-32 min-h-screen gap-10">
                
                {/* Massive Architectural Header */}
                <div className="flex justify-between items-end w-full mb-4">
                    <div className="flex flex-col">
                        <button
                            onClick={() => router.push("/order")}
                            className="group flex items-center gap-3 text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] transition-colors duration-300 mb-8 w-fit"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:-translate-x-1 transition-transform">
                                
                            </svg>
                            <span className="text-[13px] font-black uppercase tracking-[0.2em] mt-0.5">НАЗАД К СПИСКУ</span>
                        </button>
                        
                        <h1 className="text-4xl md:text-5xl font-black font-cera text-[var(--text-primary)] leading-none tracking-tight uppercase">
                            ДЕТАЛИ ПРОЕКТА
                            <br/>
                            <span className="opacity-50"># {orderNumStr}</span>
                        </h1>
                    </div>

                    <div className="flex flex-col items-end text-right">
                         <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)] opacity-50 mb-3">ОБЩАЯ СТОИМОСТЬ</span>
                         <span className="text-5xl font-black font-cera text-[var(--text-primary)] leading-none">{Number(order.price).toLocaleString()} ₽</span>
                    </div>
                </div>

                <div className="grid grid-cols-[400px_1fr] w-full gap-8 items-start relative pb-10">
                    
                    {/* Left Architectural Info Column */}
                    <div className="flex flex-col gap-6 w-full">
                        
                        {/* Main Status & Info Card */}
                        <div className="relative overflow-hidden w-full bg-[var(--nav-bg)]/30 border border-[var(--border-color)] rounded-[32px] p-8 flex flex-col group hover:border-[var(--accent-cyan)]/30 transition-all duration-500 shrink-0">
                            
                            {/* Watermark */}
                            <div className="absolute right-[-10%] bottom-[-5%] text-[150px] font-black font-cera text-[var(--text-primary)] opacity-[0.02] select-none pointer-events-none rotate-90 transform group-hover:scale-105 transition-transform duration-1000">
                                {orderNumStr}
                            </div>

                            <div className="flex items-center gap-6 mb-8">
                                {/* Dynamic Status Indicator Core */}
                                <div className="flex shrink-0 w-[56px] h-[56px] flex-col items-center justify-center relative group">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className={`w-[48px] h-[48px] rounded-full border-2 border-dashed ${statusInfo.bg.replace('bg-', 'border-[') + ']'} opacity-40 animate-[spin_10s_linear_infinite] group-hover:opacity-80 transition-opacity`} style={{ borderColor: statusInfo.bg.replace('bg-[', '').replace(']', '') }} />
                                    </div>
                                    <div className={`relative z-10 w-[32px] h-[32px] rounded-full flex items-center justify-center ${statusInfo.bg} bg-opacity-20 backdrop-blur-sm border ${statusInfo.bg.replace('bg-', 'border-[') + ']'} shadow-[0_0_15px_currentColor] group-hover:scale-110 transition-transform duration-300`} style={{ borderColor: statusInfo.bg.replace('bg-[', '').replace(']', ''), color: statusInfo.bg.replace('bg-[', '').replace(']', '') }}>
                                        <div className={`w-2 h-2 rounded-full ${statusInfo.bg} ${statusInfo.text === 'В работе' || statusInfo.text === 'Ожидает' ? 'animate-ping' : ''}`} />
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] opacity-50 mb-0.5">Текущий статус</span>
                                    <span className="text-[16px] font-bold text-[var(--text-primary)] uppercase tracking-tight">{statusInfo.text}</span>
                                </div>
                            </div>

                            <h2 className="text-2xl font-black text-[var(--text-primary)] font-cera uppercase leading-tight tracking-tight mb-8">
                                {order.title}
                            </h2>

                            <div className="flex flex-col gap-5 mt-auto relative z-10 w-full">
                                <div className="flex items-end gap-2 w-full">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] opacity-50 mb-[2px]">Тариф</span>
                                    <div className="flex-1 border-b-[2px] border-dotted border-[var(--border-color)] h-[2px] mb-[5px] opacity-30" />
                                    <span className="text-[14px] font-bold text-[var(--text-primary)] text-right">{order.tariff}</span>
                                </div>
                                <div className="flex items-end gap-2 w-full">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] opacity-50 mb-[2px]">Создан</span>
                                    <div className="flex-1 border-b-[2px] border-dotted border-[var(--border-color)] h-[2px] mb-[5px] opacity-30" />
                                    <span className="text-[14px] font-bold text-[var(--text-primary)] tabular-nums text-right">{new Date(order.createdAt).toLocaleDateString("ru-RU")}</span>
                                </div>
                                <div className="flex items-end gap-2 w-full">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] opacity-50 mb-[2px]">Исполнитель</span>
                                    <div className="flex-1 border-b-[2px] border-dotted border-[var(--border-color)] h-[2px] mb-[5px] opacity-30" />
                                    <span className="text-[14px] font-bold text-[var(--text-primary)] truncate max-w-[150px] text-right">
                                        {order.sellerPhone === 'ADMIN' ? 'Твэлви' : (partner?.name || order.partnerName || '—')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Progress Stepper Block */}
                        <div className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] rounded-[32px] p-8 flex flex-col shrink-0">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)] opacity-50 mb-6">
                                ЭТАПЫ РАБОТЫ
                            </span>
                            
                            <div className="flex flex-col gap-4">
                                {[
                                    { step: 1, name: 'СБОР ДАННЫХ' },
                                    { step: 2, name: 'ВИЗУАЛ / ДИЗАЙН' },
                                    { step: 3, name: 'РАЗРАБОТКА' },
                                    { step: 4, name: 'ТЕСТИРОВАНИЕ' },
                                    { step: 5, name: 'ЗАВЕРШЕНО' }
                                ].map((item) => {
                                    const isCompleted = item.step <= progress;
                                    const isActive = item.step === progress;
                                    return (
                                        <div key={item.step} className="flex items-center gap-4">
                                            <div className="flex flex-col items-center">
                                                <div className={`w-3 h-3 rounded-full transition-all duration-300 ${isCompleted ? 'bg-[var(--text-primary)] shadow-[0_0_10px_currentColor]' : 'bg-[var(--nav-bg)] border border-[var(--border-color)]'}`} />
                                            </div>
                                            <span className={`text-[12px] font-black tracking-widest uppercase transition-colors duration-300 ${isActive ? 'text-[var(--text-primary)]' : isCompleted ? 'text-[var(--text-primary)] opacity-70' : 'text-[var(--text-secondary)] opacity-30'}`}>
                                                {item.name}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Dispute Area */}
                        {order.clientPhone === currentPhone && !order.isDisputed && (
                            <button
                                onClick={() => setShowDisputeModal(true)}
                                className="w-full h-14 border border-[var(--border-color)] bg-[var(--card-bg)] hover:bg-[#FF8C67]/10 hover:border-[#FF8C67]/30 hover:text-[#FF8C67] text-[var(--text-secondary)] rounded-2xl font-bold transition-all flex items-center justify-center tracking-widest uppercase text-[11px] shrink-0"
                            >
                                ОТКРЫТЬ СПОР ПО ЗАКАЗУ
                            </button>
                        )}
                        {order.isDisputed && (
                            <div className="w-full h-14 bg-[#FF8C67]/10 border border-[#FF8C67]/30 text-[#FF8C67] rounded-2xl flex items-center justify-center gap-3 shrink-0">
                                <div className="w-2 h-2 rounded-full bg-[#FF8C67] animate-pulse" />
                                <span className="font-bold uppercase tracking-widest text-[11px]">В ПРОЦЕССЕ СПОРА</span>
                            </div>
                        )}
                    </div>

                    {/* Right Architectural Chat Column */}
                    <div className="flex flex-col w-full h-[calc(100vh-280px)] min-h-[600px] bg-[var(--nav-bg)]/30 border border-[var(--border-color)] rounded-[32px] overflow-hidden sticky top-8">
                        {/* Chat Top Bar */}
                        <div className="h-20 border-b border-[var(--border-color)] flex items-center px-10 shrink-0 bg-[var(--card-bg)]/50 backdrop-blur-md">
                            <span className="text-[12px] font-black uppercase tracking-widest text-[var(--text-secondary)] opacity-70">
                                СЕАНС СВЯЗИ: <span className="text-[var(--text-primary)] ml-2">{order.sellerPhone === 'ADMIN' ? 'TVELFY SUPPORT' : 'SELLER'}</span>
                            </span>
                        </div>
                        
                        {/* Chat Messages Ground */}
                        <div className="flex-1 overflow-y-auto p-10 flex flex-col hide-scrollbar" ref={chatContainerRef}>
                            <div className="flex flex-col space-y-6">
                                {messages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full pt-32 opacity-20 text-[var(--text-primary)]">
                                        <h3 className="text-2xl font-black font-cera tracking-tight uppercase">СИСТЕМА СВЯЗИ АКТИВИРОВАНА</h3>
                                        <p className="text-[12px] font-bold tracking-widest uppercase mt-2">ЖДЕМ ПЕРВОГО СООБЩЕНИЯ</p>
                                    </div>
                                ) : (
                                    messages.map((msg, idx) => {
                                        const isMe = msg.senderPhone === currentPhone;
                                        const isSystem = msg.isSystem || msg.senderPhone === 'SYSTEM';

                                        if (isSystem) return (
                                            <div key={idx} className="flex justify-center w-full py-4">
                                                <div className="max-w-[80%] text-center px-6 py-2 text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] bg-[var(--border-color)]/30 rounded-full">
                                                    {msg.text}
                                                </div>
                                            </div>
                                        );

                                        return (
                                            <div key={idx} className={`flex flex-col ${isMe ? "items-end" : "items-start"} mt-2`}>
                                                <div className={`
                                                    max-w-[70%] px-6 py-4 text-[15px] font-medium leading-relaxed break-words whitespace-pre-wrap flex flex-col gap-2 relative transition-all duration-300
                                                    ${isMe 
                                                        ? "bg-[var(--text-primary)] text-[var(--bg-color)] rounded-[24px] rounded-tr-sm" 
                                                        : "bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-[24px] rounded-tl-sm"
                                                    }
                                                `}>
                                                    {msg.text}
                                                    <div className={`text-[10px] opacity-40 font-bold tabular-nums tracking-widest ${isMe ? "text-right" : "text-left"}`}>
                                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>

                        {/* Input Area */}
                        <div className="p-6 bg-[var(--card-bg)]/50 border-t border-[var(--border-color)] shrink-0 flex gap-4 items-center">
                            <button className="w-14 h-14 rounded-full bg-[var(--nav-bg)] border border-[var(--border-color)] flex items-center justify-center shrink-0 hover:border-[var(--text-primary)] hover:text-[var(--text-primary)] text-[var(--text-secondary)] transition-all">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                                </svg>
                            </button>
                            <div className="flex-1 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-full h-14 flex items-center px-6 transition-colors duration-300 focus-within:border-[var(--text-primary)]">
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && inputText.trim()) handleSendMessage();
                                    }}
                                    placeholder="ПЕРЕДАТЬ ДАННЫЕ В ЧАТ..."
                                    className="w-full bg-transparent text-[13px] font-bold tracking-widest uppercase text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] outline-none"
                                />
                            </div>
                            <button
                                onClick={handleSendMessage}
                                disabled={!inputText.trim()}
                                className="w-14 h-14 rounded-full text-[var(--bg-color)] flex items-center justify-center transition-all shrink-0 active:scale-95 disabled:opacity-50"
                                style={{ backgroundColor: inputText.trim() ? 'var(--accent-cyan)' : 'var(--text-primary)' }}
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5">
                                    <path d="M12 19V5M12 5l-7 7M12 5l7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Layout (Original Design) */}
            <div className="w-full max-w-[375px] mx-auto relative h-screen flex flex-col lg:hidden bg-[var(--bg-color)]">
                <div className="fixed inset-0 z-[-1] pointer-events-none opacity-[0.03]" style={{ backgroundImage: `radial-gradient(var(--text-primary) 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
                <div className="fixed top-[-10%] right-[-10%] w-[60%] h-[60%] bg-[var(--accent-cyan)]/5 blur-[100px] rounded-full pointer-events-none z-[-1]" />
                <div className="fixed bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-500/5 blur-[100px] rounded-full pointer-events-none z-[-1]" />
                
                {/* Header - Centered fixed positioning */}
                <header className="fixed top-0 w-full max-w-[375px] h-[160px] bg-[var(--nav-bg)] backdrop-blur-3xl z-50 px-[24px] pt-[64px] pb-[16px] flex flex-col justify-between left-1/2 -translate-x-1/2 border-b border-[var(--border-color)] shadow-2xl transition-colors duration-300">
                    <div className="relative flex items-center justify-center w-full h-[32px]">
                        <button
                            onClick={() => router.push("/client")}
                            className="absolute left-0 w-[32px] h-[32px] flex items-center justify-center active:scale-95 transition-all text-[var(--text-primary)]"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                
                            </svg>
                        </button>
                        <h1 className="text-[22px] font-semibold tracking-tight text-[var(--text-primary)] font-cera">Заказ №{orderNumStr}</h1>
                    </div>

                    <div className="relative flex bg-[var(--nav-bg)] backdrop-blur-md rounded-full border border-[var(--border-color)] h-[56px] w-full p-[4px] mt-[24px] shadow-sm">
                        {/* Sliding Border for Active Tab */}
                        <div
                            className={`absolute top-[4px] bottom-[4px] w-[calc(50%-4px)] rounded-full transition-all duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] bg-[var(--card-bg)] border border-[var(--border-color)] shadow-sm ${activeTab === 'details' ? 'left-[4px]' : 'left-[50%]'}`}
                        />
                        <button
                            onClick={() => setActiveTab('details')}
                            className={`relative z-10 flex-1 rounded-full text-[17px] font-semibold transition-all duration-500 flex items-center justify-center font-cera ${activeTab === 'details' ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]/40'}`}
                        >
                            Детали
                        </button>
                        <button
                            onClick={() => setActiveTab('chat')}
                            className={`relative z-10 flex-1 rounded-full text-[17px] font-semibold transition-all duration-500 flex items-center justify-center font-cera ${activeTab === 'chat' ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]/40'}`}
                        >
                            Чат
                            {activeTab !== 'chat' && hasUnreadInOrder && (
                                <div className="absolute top-[16px] right-[24px] w-[8px] h-[8px] bg-[var(--accent-color)] rounded-full border border-[var(--bg-color)] shadow-[0_0_10px_rgba(255,140,103,0.5)]" />
                            )}
                        </button>
                    </div>
                </header>

                <main className="flex-1 relative overflow-hidden h-full">
                    <div
                        className="flex h-full transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] will-change-transform"
                        style={{
                            transform: activeTab === 'details' ? 'translateX(0%)' : 'translateX(-50%)',
                            width: '200%'
                        }}
                    >
                        {/* Details Tab */}
                        <div className="w-1/2 h-full shrink-0 overflow-y-auto hide-scrollbar pt-[180px] pb-10 px-[24px]">
                            <div className="space-y-[24px] pb-20">

                                {/* Order Info Block */}
                                <div className="space-y-[24px]">
                                    <div className="space-y-[8px] px-[8px]">
                                        <div className="flex justify-between items-start gap-[12px]">
                                            <h2 className="text-[24px] font-semibold text-[var(--text-primary)] leading-[120%] flex-1 line-clamp-2 font-cera">{order.title}</h2>
                                            <div className="flex items-center gap-[12px] shrink-0 h-[20px]">
                                                {/* Status Badge from SVG */}
                                                <div className={`px-[10px] h-[20px] rounded-full flex items-center justify-center border border-[var(--border-color)] ${statusInfo.bg}`}>
                                                    <span className="text-[var(--bg-color)] text-[11px] font-bold leading-none">{statusInfo.text}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center h-[22px]">
                                            <span className="text-[var(--text-secondary)] text-[18px] font-bold leading-[120%]">{order.tariff}</span>
                                            <span className="text-[var(--text-secondary)] text-[18px] font-bold leading-[120%] tabular-nums">{Number(order.price).toLocaleString()} ₽</span>
                                        </div>
                                    </div>

                                    {/* Tags - Grey background, Black text as in SVG */}
                                    <div className="flex flex-wrap gap-[8px] px-[8px]">
                                        {(order.features && order.features.length > 0 ? order.features : ["Уникальный дизайн", "Внутренние покупки", "Авторизация"]).map((tag, idx) => (
                                            <div key={idx} className="bg-[var(--nav-bg)] backdrop-blur-sm px-[12px] py-0 h-[20px] rounded-full flex items-center justify-center border border-[var(--border-color)]">
                                                <span className="text-[var(--text-primary)] text-[11px] font-bold leading-[20px]">{tag}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Info rows with Dotted Line */}
                                    <div className="space-y-[12px] px-[8px] mt-4">
                                        <div className="flex items-end gap-[4px] h-[20px]">
                                            <span className="text-[13px] font-bold text-[var(--text-secondary)] leading-none shrink-0 mb-[2px]">Партнер</span>
                                            <div className="flex-1 border-b-[2px] border-dotted border-[var(--border-color)] h-[2px] mb-[4px] opacity-70" />
                                            <span className="text-[16px] font-bold text-[var(--text-primary)] leading-none shrink-0 text-right truncate max-w-[170px]">
                                                {order.sellerPhone === 'ADMIN' ? 'Твэлви' : (partner?.name || order.partnerName || '—')}
                                            </span>
                                        </div>
                                        <div className="flex items-end gap-[4px] h-[20px]">
                                            <span className="text-[13px] font-bold text-[var(--text-secondary)] leading-none shrink-0 mb-[2px]">Создан</span>
                                            <div className="flex-1 border-b-[2px] border-dotted border-[var(--border-color)] h-[2px] mb-[4px] opacity-70" />
                                            <span className="text-[16px] font-bold text-[var(--text-primary)] leading-none shrink-0 tabular-nums text-right">
                                                {new Date(order.createdAt).toLocaleDateString("ru-RU")}
                                            </span>
                                        </div>
                                        <div className="flex items-end gap-[4px] h-[20px]">
                                            <span className="text-[13px] font-bold text-[var(--text-secondary)] leading-none shrink-0 mb-[2px]">Этап</span>
                                            <div className="flex-1 border-b-[2px] border-dotted border-[var(--border-color)] h-[2px] mb-[4px] opacity-70" />
                                            <span className="text-[16px] font-bold text-[var(--text-primary)] leading-none shrink-0 text-right">
                                                {order.stage === 'processing' ? 'Обработка' : order.stage === 'design' ? 'Дизайн' : order.stage === 'development' ? 'Разработка' : order.stage === 'test' ? 'Тестирование' : 'Готов'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Progress Bars from SVG */}
                                    <div className="px-[8px] mt-8 pt-4">
                                        <div className="flex gap-[4px] h-[12px]">
                                            {[1, 2, 3, 4, 5].map((step) => (
                                                <div
                                                    key={step}
                                                    className={`h-full flex-1 rounded-full transition-colors duration-300 ${step <= progress ? 'bg-[var(--text-primary)] [html.day-theme_&]:bg-[#141414]' : 'bg-[var(--nav-bg)] border border-[var(--border-color)]'}`}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {order.clientPhone === currentPhone && !order.isDisputed && (
                                        <div className="space-y-[12px] px-[8px] mt-8">
                                            <div className="bg-[var(--nav-bg)] backdrop-blur-md border border-[var(--border-color)] rounded-[24px] p-5 flex gap-4 transition-colors duration-300 shadow-md">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
                                                    <circle cx="12" cy="12" r="10" />
                                                    <path d="M12 16v-4" />
                                                    <path d="M12 8h.01" />
                                                </svg>
                                                <p className="text-[13px] text-[var(--text-secondary)] leading-[1.5]">
                                                    Если у вас возникли проблемы с заказом, вы можете пригласить администратора в чат для решения спорной ситуации.
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => setShowDisputeModal(true)}
                                                className="w-full h-[56px] bg-[var(--nav-bg)] backdrop-blur-md border border-[#FF8C67]/30 text-[#FF8C67] rounded-full font-bold active:scale-95 transition-all mt-4 text-[16px] shadow-lg"
                                            >
                                                Открыть спор
                                            </button>
                                        </div>
                                    )}

                                    {order.isDisputed && (
                                        <div className="flex items-center justify-center gap-2 py-6 border-t border-[var(--border-color)] mt-10 transition-colors duration-300">
                                            <div className="w-2 h-2 rounded-full bg-[var(--accent-color)] animate-pulse" />
                                            <span className="text-[var(--accent-color)] font-bold uppercase tracking-widest text-[12px]">В процессе спора</span>
                                        </div>
                                    )}

                                </div>
                            </div>
                        </div>

                        {/* Chat Tab (Mobile List) */}
                        <div
                            className="w-1/2 h-full shrink-0 overflow-y-auto hide-scrollbar pt-[180px] px-[24px]"
                        >
                            <div className="flex flex-col space-y-6 pb-32">
                                {messages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center pt-20 opacity-30 text-center text-[var(--text-primary)]">
                                        <p className="font-bold">Сообщений пока нет</p>
                                    </div>
                                ) : (
                                    messages.map((msg, idx) => {
                                        const isMe = msg.senderPhone === currentPhone;
                                        const isSystem = msg.isSystem || msg.senderPhone === 'SYSTEM';

                                        if (isSystem) return (
                                            <div key={idx} className="flex justify-center w-full py-2">
                                                <div className="max-w-[90%] text-center px-5 py-2 text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.1em] bg-[var(--nav-bg)] backdrop-blur-md rounded-full border border-[var(--border-color)] shadow-sm transition-colors duration-300" style={{ fontFamily: 'var(--font-cera)' }}>
                                                    {msg.text}
                                                </div>
                                            </div>
                                        );

                                        return (
                                            <div key={idx} className={`flex flex-col ${isMe ? "items-end" : "items-start"} animate-in zoom-in-95 duration-300`}>
                                                <div className={`
                                                    max-w-[85%] px-[20px] py-[16px] text-[15px] leading-[1.5] break-words whitespace-pre-wrap flex flex-col gap-1 relative transition-all duration-300
                                                    ${isMe 
                                                        ? "bg-[var(--text-primary)] text-[var(--bg-color)] rounded-[20px] rounded-tr-[4px] shadow-lg" 
                                                        : "bg-[var(--nav-bg)] backdrop-blur-3xl text-[var(--text-primary)] border border-[var(--border-color)] rounded-[20px] rounded-tl-[4px] shadow-lg"
                                                    }
                                                `}>
                                                    {msg.text}
                                                    <div className={`text-[10px] mt-1 opacity-40 font-medium tabular-nums ${isMe ? "text-right" : "text-left"}`}>
                                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div />
                            </div>
                        </div>
                    </div>
                </main>

                <div className={`fixed bottom-0 w-full max-w-[375px] px-[16px] pb-[34px] bg-[var(--nav-bg)] backdrop-blur-3xl border-t border-[var(--border-color)] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] left-1/2 -translate-x-1/2 z-50 lg:hidden ${activeTab === 'chat' ? 'translate-y-0' : 'translate-y-full'}`}>
                    <div className="flex items-center gap-[8px] h-[52px] mt-[12px]">
                        {/* Attachment Button */}
                        <button className="w-[52px] h-[52px] rounded-full bg-[var(--nav-bg)] border border-[var(--border-color)] flex items-center justify-center shrink-0 active:scale-95 transition-all text-[var(--text-primary)] hover:text-[var(--accent-cyan)] shadow-lg">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                            </svg>
                        </button>
 
                        {/* Input Area */}
                        <div className="flex-1 bg-[var(--nav-bg)] border border-[var(--border-color)] rounded-[20px] h-[52px] flex items-center px-[20px] shadow-inner transition-all duration-300 focus-within:border-[var(--text-secondary)]">
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        if (inputText.trim()) handleSendMessage();
                                    }
                                }}
                                placeholder="Написать сообщение..."
                                className="w-full h-full bg-transparent text-[16px] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] outline-none font-medium"
                            />
                        </div>
 
                        {/* Send Button */}
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
            </div>

            {/* Dispute Modal - Global */}
            {showDisputeModal && (
                <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center px-6 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="w-full max-w-[327px] bg-[var(--card-bg)] border border-[var(--border-color)] rounded-[32px] p-8 flex flex-col shadow-2xl animate-in zoom-in-95 duration-300 transition-colors duration-300">
                        <h3 className="text-[24px] font-bold mb-2 text-[var(--text-primary)]">Открыть спор?</h3>
                        <p className="text-[var(--text-secondary)] mb-8 leading-relaxed">
                            В чат будет приглашен администратор Твэлви для разрешения ситуации.
                        </p>
                        <button
                            onClick={async () => {
                                // Dispute logic
                                setShowDisputeModal(false);
                                if (!currentPhone || !order) return;
                                try {
                                    const sysMsg: ChatMessage = {
                                        id: `msg_dispute_${Date.now()}`,
                                        orderId: orderId,
                                        senderPhone: 'SYSTEM',
                                        text: "⚠️ Спор открыт. Администратор скоро подключится.",
                                        timestamp: new Date().toISOString(),
                                        isSystem: true
                                    } as ChatMessage;
                                    await sendChatMessage(sysMsg);
                                    setMessages(prev => [...prev, sysMsg]);
                                    
                                    await fetch('/api/support', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                            userPhone: currentPhone,
                                            text: `Спор по заказу №${orderNumStr}`,
                                            type: 'dispute',
                                            orderId: orderId
                                        })
                                    });
 
                                    const updatedOrder = { ...order, isDisputed: true };
                                    await fetch('/api/orders', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify(updatedOrder)
                                    });
                                    setOrder(updatedOrder);
                                    setActiveTab('chat');
                                } catch (e) {}
                            }}
                            className="bg-[var(--text-primary)] text-[var(--bg-color)] h-12 rounded-full font-bold mb-3 transition-colors duration-300"
                        >
                            Да, открыть
                        </button>
                        <button
                            onClick={() => setShowDisputeModal(false)}
                            className="h-12 border border-[var(--border-color)] text-[var(--text-primary)] rounded-full font-bold transition-colors duration-300"
                        >
                            Отмена
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
