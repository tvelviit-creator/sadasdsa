"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { getOrderById, saveOrder, Order } from "@/utils/orders";
import { ChatMessage, getChatMessages, sendChatMessage } from "@/utils/chat";
import { getCurrentUserPhone } from "@/utils/userData";
import { AlertTriangle } from "lucide-react";

export default function OrderDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const orderId = params.id as string;

    const [order, setOrder] = useState<Order | null>(null);
    const [status, setStatus] = useState<Order["status"]>("pending");
    const [stage, setStage] = useState<Order["stage"]>("processing");
    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
    const [activeTab, setActiveTabInternal] = useState<"details" | "chat">((searchParams.get('tab') as "chat") || "details");

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
            setStatus(data.status);
            setStage(data.stage || "processing");
            const chatMsgs = await getChatMessages(orderId);
            setMessages(chatMsgs);
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

    const handleUpdate = async (updates: Partial<Order>) => {
        if (!order) return;
        const updatedOrder: Order = {
            ...order,
            ...updates,
            updatedAt: new Date().toISOString()
        };
        await saveOrder(updatedOrder);
        setOrder(updatedOrder);
        if (updates.status) setStatus(updates.status);
        if (updates.stage) setStage(updates.stage);
    };

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

    const formatPhone = (phone: string) => {
        const cleaned = ('' + phone).replace(/\D/g, '');
        if (cleaned.length === 11) {
            return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)} ${cleaned.slice(7, 9)}-${cleaned.slice(9, 11)}`;
        }
        return phone.startsWith('+') ? phone : `+${phone}`;
    };

    if (!order) return <div className="min-h-screen bg-[var(--bg-color)]" />;

    const orderNumStr = order.orderNumber ? String(order.orderNumber).split('-').pop() : order.id.slice(-4);

    return (
        <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] font-sans overflow-x-hidden transition-colors duration-300 w-full flex">

            {/* Premium Desktop Architectural Layout */}
            <div className="hidden lg:flex flex-col w-full px-12 pt-16 pb-32 min-h-screen gap-10">
                
                {/* Massive Architectural Header */}
                <div className="flex justify-between items-end w-full mb-4">
                    <div className="flex flex-col">
                        <button
                            onClick={() => router.push("/lkseller/orders")}
                            className="group flex items-center gap-3 text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] transition-colors duration-300 mb-8 w-fit"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:-translate-x-1 transition-transform">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                            <span className="text-[13px] font-black uppercase tracking-[0.2em] mt-0.5">НАЗАД К ЗАКАЗАМ</span>
                        </button>
                        
                        <h1 className="text-4xl md:text-5xl font-black font-cera text-[var(--text-primary)] leading-none tracking-tight uppercase">
                            УПРАВЛЕНИЕ ЗАКАЗОМ
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
                                <div className="flex shrink-0 w-[56px] h-[56px] flex-col items-center justify-center relative group/status">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className={`w-[48px] h-[48px] rounded-full border-2 border-dashed ${status === 'pending' ? 'border-[#FFC700]' : (status === 'completed' || status === 'cancelled') ? 'border-[var(--accent-color)]' : 'border-[#4AC99B]'} opacity-40 animate-[spin_10s_linear_infinite] group-hover/status:opacity-80 transition-opacity`} />
                                    </div>
                                    <div className={`relative z-10 w-[32px] h-[32px] rounded-full flex items-center justify-center ${status === 'pending' ? 'bg-[#FFC700] border-[#FFC700]' : (status === 'completed' || status === 'cancelled') ? 'bg-[var(--accent-color)] border-[var(--accent-color)]' : 'bg-[#4AC99B] border-[#4AC99B]'} bg-opacity-20 backdrop-blur-sm border shadow-[0_0_15px_currentColor] group-hover/status:scale-110 transition-transform duration-300`} style={{ color: status === 'pending' ? '#FFC700' : (status === 'completed' || status === 'cancelled') ? 'var(--accent-color)' : '#4AC99B' }}>
                                        <div className={`w-2 h-2 rounded-full ${status === 'pending' ? 'bg-[#FFC700] animate-ping' : (status === 'completed' || status === 'cancelled') ? 'bg-[var(--accent-color)]' : 'bg-[#4AC99B] animate-ping'}`} />
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] opacity-50 mb-0.5">Текущий статус</span>
                                    <span className="text-[16px] font-bold text-[var(--text-primary)] uppercase tracking-tight">
                                        {status === 'in_progress' ? 'В работе' : status === 'pending' ? 'Ожидает' : 'Остановлен'}
                                    </span>
                                </div>
                            </div>

                            <h2 className="text-2xl font-black text-[var(--text-primary)] font-cera uppercase leading-tight tracking-tight mb-8">
                                {order.title || "БЕЗ НАЗВАНИЯ"}
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
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] opacity-50 mb-[2px]">Клиент ({order.clientName || '—'})</span>
                                    <div className="flex-1 border-b-[2px] border-dotted border-[var(--border-color)] h-[2px] mb-[5px] opacity-30" />
                                    <span className="text-[14px] font-bold text-[var(--text-primary)] truncate max-w-[150px] text-right">
                                        {formatPhone(order.clientPhone)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Admin Controls Area */}
                        <div className="w-full bg-[var(--nav-bg)]/30 border border-[var(--border-color)] rounded-[40px] p-10 flex flex-col shrink-0 transition-all duration-500 hover:border-[var(--accent-cyan)]/20 relative overflow-hidden group/admin">
                             {/* subtle glow */}
                             <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[var(--accent-cyan)] opacity-[0.02] blur-[80px] rounded-full pointer-events-none" />
                             
                             <div className="flex items-center justify-between mb-10">
                                 <div className="flex items-center gap-3">
                                     <div className="w-[8px] h-[8px] rounded-full bg-[var(--accent-cyan)] shadow-[0_0_12px_var(--accent-cyan)]" />
                                     <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[var(--text-primary)] opacity-80">
                                        ПУЛЬТ УПРАВЛЕНИЯ
                                     </span>
                                 </div>
                                 <div className="h-[1px] flex-1 bg-gradient-to-r from-[var(--border-color)] to-transparent ml-6" />
                             </div>

                             <div className="space-y-12">
                                 {/* Status Control */}
                                 <div className="space-y-4">
                                     <div className="flex justify-between items-center px-2">
                                         <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)]">ГЛОБАЛЬНЫЙ СТАТУС</h3>
                                         <span className="text-[10px] font-black uppercase tracking-[0.1em] text-[var(--accent-cyan)] opacity-60">АВТОМАТИЧЕСКИ</span>
                                     </div>
                                     <div className="relative flex bg-[#0A0A0B] rounded-[20px] border border-[var(--border-color)] h-[56px] p-[6px] shadow-inner">
                                         <div
                                             className={`absolute top-[6px] bottom-[6px] w-[calc(33.33%-6px)] rounded-[14px] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] border border-white/10 shadow-2xl ${
                                                 status === 'in_progress' ? 'left-[6px] bg-[#4AC99B]' :
                                                 status === 'pending' ? 'left-[33.33%] bg-[#FFC700]' :
                                                 'left-[66.66%] bg-[var(--accent-color)]'
                                             }`}
                                         >
                                             <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none rounded-[14px]" />
                                         </div>
                                         {(['in_progress', 'pending', 'cancelled'] as const).map((s) => {
                                             const isActive = status === s;
                                             return (
                                                 <button
                                                     key={s}
                                                     onClick={() => handleUpdate({ status: s })}
                                                     className={`relative z-10 flex-1 rounded-[14px] text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-500 ${isActive ? 'text-black' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                                                 >
                                                     {s === 'in_progress' ? 'В РАБОТЕ' : s === 'pending' ? 'ОЖИДАЕТ' : 'ОТМЕНА'}
                                                 </button>
                                             );
                                         })}
                                     </div>
                                 </div>

                                 {/* Stage Control */}
                                 <div className="space-y-4">
                                     <div className="flex justify-between items-center px-2">
                                         <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)]">ЭТАП ВЫПОЛНЕНИЯ</h3>
                                         <span className="text-[10px] font-black uppercase tracking-[0.1em] text-[var(--accent-cyan)] opacity-60">ПОШАГОВО</span>
                                     </div>
                                     <div className="relative flex bg-[#0A0A0B] rounded-[20px] border border-[var(--border-color)] h-[56px] p-[6px] shadow-inner">
                                         <div
                                             className="absolute top-[6px] bottom-[6px] w-[calc(20%-2.5px)] rounded-[14px] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] bg-[var(--text-primary)] border border-white/10 shadow-xl"
                                             style={{
                                                 left: `calc(${(['processing', 'design', 'development', 'test', 'ready'] as const).indexOf(stage as any) * 20}% + ${(['processing', 'design', 'development', 'test', 'ready'] as const).indexOf(stage as any) === 0 ? '6px' : '0px'})`
                                             }}
                                         />
                                         {(['processing', 'design', 'development', 'test', 'ready'] as const).map((s) => {
                                             const isActive = stage === s;
                                             return (
                                                 <button
                                                     key={s}
                                                     onClick={() => handleUpdate({ stage: s })}
                                                     className={`relative z-10 flex-1 rounded-[14px] text-[9px] font-black uppercase tracking-tight transition-all duration-500 ${isActive ? 'text-black' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                                                 >
                                                     {s === 'processing' ? 'ИНФО' : s === 'design' ? 'ДИЗАЙН' : s === 'development' ? 'КОД' : s === 'test' ? 'ТЕСТ' : 'ГОТОВ'}
                                                 </button>
                                             );
                                         })}
                                     </div>
                                 </div>

                                 {/* Dispute Button */}
                                 <div className="pt-4">
                                     {!order.isDisputed ? (
                                         <button 
                                            onClick={async () => {
                                                if (confirm("Данное действие уведомит администратора для решения спорной ситуации. Продолжить?")) {
                                                    try {
                                                        const sysMsg: ChatMessage = {
                                                            id: `msg_dispute_${Date.now()}`,
                                                            orderId: orderId,
                                                            senderPhone: 'SYSTEM',
                                                            text: "⚠️ Спор открыт продавцом. Администратор скоро подключится.",
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
                                                                text: `Спор по заказу №${orderNumStr} (от продавца)`,
                                                                type: 'dispute',
                                                                orderId: orderId
                                                            })
                                                        });

                                                        const updatedOrder = { ...order, isDisputed: true };
                                                        await handleUpdate(updatedOrder);
                                                        setActiveTab('chat');
                                                    } catch (e) {
                                                        alert("Ошибка при открытии спора.");
                                                    }
                                                }
                                            }}
                                            className="w-full h-16 rounded-[20px] bg-transparent border border-[var(--border-color)] flex items-center justify-center gap-4 group/dispute hover:bg-red-500/5 hover:border-red-500/30 transition-all duration-500"
                                         >
                                            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 group-hover/dispute:scale-110 transition-transform">
                                                <AlertTriangle className="w-4 h-4" />
                                            </div>
                                            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)] group-hover/dispute:text-red-500 transition-colors">ОТКРЫТЬ СПОР ПО ЗАКАЗУ</span>
                                         </button>
                                     ) : (
                                         <div className="w-full h-16 rounded-[20px] bg-red-500/5 border border-red-500/20 flex items-center justify-center gap-3">
                                             <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                             <span className="text-[11px] font-black uppercase tracking-[0.2em] text-red-500">ЗАКАЗ В СПОРЕ</span>
                                         </div>
                                     )}
                                 </div>
                             </div>
                        </div>

                    </div>

                    {/* Right Architectural Chat Column */}
                    <div className="flex flex-col w-full h-[calc(100vh-280px)] min-h-[600px] bg-[var(--nav-bg)]/30 border border-[var(--border-color)] rounded-[32px] overflow-hidden sticky top-8">
                        {/* Chat Top Bar */}
                        <div className="h-20 border-b border-[var(--border-color)] flex items-center px-10 shrink-0 bg-[var(--card-bg)]/50 backdrop-blur-md">
                            <span className="text-[12px] font-black uppercase tracking-widest text-[var(--text-secondary)] opacity-70">
                                СЕАНС СВЯЗИ: <span className="text-[var(--text-primary)] ml-2">КЛИЕНТ ({order.clientName || 'НЕТ ИМЕНИ'})</span>
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
            <div className="w-full max-w-[375px] relative h-screen flex flex-col lg:hidden z-10">

                {/* Mobile Background Elements */}
                <div className="fixed inset-0 z-[-1] pointer-events-none opacity-[0.03]" style={{ backgroundImage: `radial-gradient(white 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
                <div className="fixed top-[10%] right-[-20%] w-[60%] h-[60%] bg-[var(--accent-cyan)]/5 blur-[120px] rounded-full pointer-events-none z-[-1]" />
                <div className="fixed bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-500/5 blur-[100px] rounded-full pointer-events-none z-[-1]" />

                {/* Header - Fixed 24px Bold, centered positioning */}
                <header className="fixed top-0 w-full max-w-[375px] h-[160px] bg-[#0A0A0B]/80 backdrop-blur-3xl z-50 px-[24px] pt-[64px] pb-[16px] flex flex-col justify-between left-1/2 -translate-x-1/2 border-b border-white/5 shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-colors duration-300">
                    <div className="relative flex items-center justify-center w-full h-[32px]">
                        <button
                            onClick={() => router.push("/seller")}
                            className="absolute left-0 w-[32px] h-[32px] flex items-center justify-center active:scale-95 transition-all text-[var(--text-primary)]"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <h1 className="text-[22px] font-semibold tracking-tight text-[var(--text-primary)] font-cera">Заказ №{orderNumStr}</h1>
                    </div>

                    <div className="relative flex bg-white/5 backdrop-blur-md rounded-full border border-white/10 h-[56px] w-full p-[4px] mt-[24px] shadow-inner">
                        {/* Sliding Border for Active Tab */}
                        <div
                            className={`absolute top-[4px] bottom-[4px] w-[calc(50%-4px)] rounded-full transition-all duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] border border-white/20 bg-white/10 shadow-lg ${activeTab === 'details' ? 'left-[4px]' : 'left-[50%]'}`}
                        />
                        <button
                            onClick={() => setActiveTab('details')}
                            className={`relative z-10 flex-1 rounded-full text-[14px] font-black uppercase tracking-wider transition-all duration-500 flex items-center justify-center font-cera ${activeTab === 'details' ? 'text-white' : 'text-white/40'}`}
                        >
                            Детали
                        </button>
                        <button
                            onClick={() => setActiveTab('chat')}
                            className={`relative z-10 flex-1 rounded-full text-[14px] font-black uppercase tracking-wider transition-all duration-500 flex items-center justify-center font-cera ${activeTab === 'chat' ? 'text-white' : 'text-white/40'}`}
                        >
                            Чат
                            {activeTab !== 'chat' && hasUnreadInOrder && (
                                <div className="absolute top-[16px] right-[24px] w-[8px] h-[8px] bg-[#FF4D4D] rounded-full border border-[var(--bg-color)] shadow-[0_0_10px_rgba(255,77,77,0.5)]" />
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
                        <div className="w-1/2 h-full shrink-0 overflow-y-auto no-scrollbar pt-[180px] pb-10 px-[24px]">
                            <div className="space-y-[24px] pb-24">

                                {/* Summary Card Area */}
                                <div className="space-y-[24px]">
                                    <div className="space-y-[8px] px-[8px]">
                                        <div className="flex justify-between items-start gap-[12px]">
                                            <h2 className="text-[24px] font-semibold text-[var(--text-primary)] leading-[120%] flex-1 line-clamp-2 font-cera">{order.title}</h2>
                                            <div className="flex items-center gap-[12px] shrink-0 h-[20px]">
                                                <div className={`px-[10px] h-[20px] rounded-full flex items-center justify-center border border-[var(--border-color)] ${status === 'pending' ? 'bg-[#FFC700]' : (status === 'completed' || status === 'cancelled') ? 'bg-[var(--accent-color)]' : 'bg-[#4AC99B]'}`}>
                                                    <span className="text-[var(--bg-color)] text-[11px] font-bold leading-none">
                                                        {status === 'in_progress' ? 'В работе' : status === 'pending' ? 'Ожидает' : 'Остановлен'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center h-[22px]">
                                            <span className="text-white/60 text-[14px] font-bold uppercase tracking-wider leading-[120%]">{order.tariff}</span>
                                            <span className="text-white text-[18px] font-bold leading-[120%] tabular-nums">{Number(order.price).toLocaleString()} ₽</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-[8px] px-[8px]">
                                        {(order.features && order.features.length > 0 ? order.features : ["Общее"]).map((tag, idx) => (
                                            <div key={idx} className="bg-white/5 px-[10px] py-0 h-[22px] rounded-full flex items-center justify-center border border-white/10">
                                                <span className="text-white/80 text-[11px] font-black uppercase tracking-widest leading-[20px]">{tag}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Info rows with Dots Layout and Professional Terms from Mockup */}
                                    <div className="space-y-[12px] px-[8px]">
                                        <div className="flex items-center gap-[4px] h-[24px]">
                                            <span className="text-[11px] font-bold uppercase tracking-widest text-[white]/50 leading-none shrink-0">Клиент</span>
                                            <div className="flex-1 border-b border-white/10 h-[12px]" />
                                            <span className="text-[14px] font-normal text-white leading-none shrink-0 text-right truncate max-w-[170px]">
                                                {order.clientName || "—"}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-[4px] h-[24px]">
                                            <span className="text-[11px] font-bold uppercase tracking-widest text-[white]/50 leading-none shrink-0">Телефон</span>
                                            <div className="flex-1 border-b border-white/10 h-[12px]" />
                                            <span className="text-[14px] font-normal text-white leading-none shrink-0 tabular-nums text-right">
                                                {formatPhone(order.clientPhone)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-[4px] h-[24px]">
                                            <span className="text-[11px] font-bold uppercase tracking-widest text-[white]/50 leading-none shrink-0">Создан</span>
                                            <div className="flex-1 border-b border-white/10 h-[12px]" />
                                            <span className="text-[14px] font-normal text-white leading-none shrink-0 tabular-nums text-right">
                                                {new Date(order.createdAt).toLocaleDateString("ru-RU")}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Status Control Section */}
                                <div className="space-y-[8px]">
                                    <h3 className="text-[var(--text-primary)] text-[16px] font-normal leading-[24px] px-[8px] flex items-end h-[24px]">Статус</h3>
                                    <div className="relative flex bg-[var(--bg-color)] rounded-full border border-[var(--border-color)] h-[32px] p-[2px] overflow-hidden">
                                        {/* Sliding Indicator */}
                                        <div
                                            className={`absolute top-[2px] bottom-[2px] w-[calc(33.33%-2px)] rounded-full transition-all duration-300 ease-in-out border border-[var(--text-primary)] ${status === 'in_progress' ? 'left-[2px] bg-[#4AC99B]' :
                                                status === 'pending' ? 'left-[33.33%] bg-[#FFC700]' :
                                                    'left-[66.66%] bg-[var(--accent-color)]'
                                                }`}
                                        />
                                        {(['in_progress', 'pending', 'cancelled'] as const).map((s) => {
                                            const isActive = status === s;
                                            return (
                                                <button
                                                    key={s}
                                                    onClick={() => handleUpdate({ status: s })}
                                                    className={`relative z-10 flex-1 rounded-full text-[13px] font-bold transition-all duration-300 flex items-center justify-center ${isActive ? 'text-[var(--bg-color)]' : 'text-[var(--text-primary)]'}`}
                                                >
                                                    {s === 'in_progress' ? 'В работе' : s === 'pending' ? 'Ожидает' : 'Остановлен'}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Stage Control Section */}
                                <div className="space-y-[8px]">
                                    <h3 className="text-[var(--text-primary)] text-[16px] font-normal leading-[24px] px-[8px] flex items-end h-[24px]">Этап</h3>
                                    <div className="relative flex bg-[var(--bg-color)] rounded-full border border-[var(--border-color)] h-[32px] p-[2px] overflow-hidden">
                                        {/* Sliding Indicator */}
                                        <div
                                            className="absolute top-[2px] bottom-[2px] w-[calc(20%-2px)] rounded-full transition-all duration-300 ease-in-out border border-[var(--text-primary)] bg-[var(--text-primary)]"
                                            style={{
                                                left: `calc(${(['processing', 'design', 'development', 'test', 'ready'] as const).indexOf(stage as any) * 20}% + ${(['processing', 'design', 'development', 'test', 'ready'] as const).indexOf(stage as any) === 0 ? '2px' : '0px'})`
                                            }}
                                        />
                                        {(['processing', 'design', 'development', 'test', 'ready'] as const).map((s) => {
                                            const isActive = stage === s;
                                            return (
                                                <button
                                                    key={s}
                                                    onClick={() => handleUpdate({ stage: s })}
                                                    className={`relative z-10 flex-1 rounded-full text-[11px] font-bold transition-all duration-300 flex items-center justify-center ${isActive ? 'text-[var(--bg-color)]' : 'text-[var(--text-primary)]'}`}
                                                >
                                                    {s === 'processing' ? 'Обраб.' : s === 'design' ? 'Дизайн' : s === 'development' ? 'Разраб.' : s === 'test' ? 'Тест' : 'Готов'}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Chat Tab content (Mobile) */}
                        <div
                            className="w-1/2 h-full shrink-0 overflow-y-auto no-scrollbar pt-[180px] px-[24px]"
                        >
                            <div className="flex flex-col space-y-6 pb-32">
                                {messages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center pt-20 opacity-30 text-center text-[var(--text-primary)]">
                                        <p className="font-bold">Сообщений пока нет</p>
                                    </div>
                                ) : (
                                    messages.map((msg, index) => {
                                        const isMe = msg.senderPhone === currentPhone;
                                        return (
                                            <div key={index} className={`flex flex-col ${isMe ? "items-end" : "items-start"} animate-in zoom-in-95 duration-300`}>
                                                <div className={`
                                                    max-w-[85%] px-[20px] py-[16px] text-[15px] leading-[1.5] break-words whitespace-pre-wrap flex flex-col gap-1 relative transition-all duration-300
                                                    ${isMe 
                                                        ? "bg-[var(--text-primary)] text-[var(--bg-color)] rounded-[20px] rounded-tr-[4px]" 
                                                        : "bg-[var(--card-bg)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-[20px] rounded-tl-[4px]"
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

                <div className={`fixed bottom-0 w-full max-w-[375px] px-[16px] pb-[34px] bg-[var(--bg-color)] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] left-1/2 -translate-x-1/2 z-50 lg:hidden ${activeTab === 'chat' ? 'translate-y-0' : 'translate-y-full'}`}>
                    <div className="flex items-center gap-[8px] h-[52px] mt-[12px]">
                        {/* Attachment Button */}
                        <button className="w-[52px] h-[52px] rounded-full bg-[var(--nav-bg)] border border-[var(--border-color)] flex items-center justify-center shrink-0 active:scale-95 transition-all text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                            </svg>
                        </button>
 
                        {/* Input Area */}
                        <div className="flex-1 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-[20px] h-[52px] flex items-center px-[20px] transition-all duration-300 focus-within:border-[var(--text-secondary)]">
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
        </div>
    );
}
