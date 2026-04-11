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
        <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] flex justify-center font-sans overflow-x-hidden transition-colors duration-300">
            <div className="w-full max-w-[375px] relative h-screen flex flex-col">
                {/* Header - Centered fixed positioning */}
        <header className="fixed top-0 w-full max-w-[375px] h-[160px] bg-[var(--bg-color)] z-50 px-[24px] pt-[64px] pb-[16px] flex flex-col justify-between left-1/2 -translate-x-1/2 border-b border-[var(--border-color)] transition-colors duration-300">
                    <div className="relative flex items-center justify-center w-full h-[32px]">
                        <button
                            onClick={() => router.push("/client")}
                            className="absolute left-0 w-[32px] h-[32px] flex items-center justify-center active:scale-95 transition-all text-[var(--text-primary)]"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <h1 
                            className="text-[24px] font-bold text-[#F5F5F5] leading-[120%] text-center flex items-center justify-center"
                            style={{ fontFamily: "'Cera Pro', var(--font-cera), sans-serif" }}
                        >
                            Заказ #{orderNumStr}
                        </h1>
                    </div>

                    <div className="relative flex bg-[var(--bg-color)] rounded-full border border-[var(--border-color)] h-[56px] w-full p-[4px] mt-[24px]">
                        {/* Sliding Border for Active Tab */}
                        <div
                            className={`absolute top-[4px] bottom-[4px] w-[calc(50%-4px)] rounded-full transition-all duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] border border-[var(--text-primary)] ${activeTab === 'details' ? 'left-[4px]' : 'left-[50%]'}`}
                        />
                        <button
                            onClick={() => setActiveTab('details')}
                            className={`relative z-10 flex-1 rounded-full text-[17px] font-semibold transition-all duration-500 flex items-center justify-center ${activeTab === 'details' ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]/40'}`}
                        >
                            Детали
                        </button>
                        <button
                            onClick={() => setActiveTab('chat')}
                            className={`relative z-10 flex-1 rounded-full text-[17px] font-semibold transition-all duration-500 flex items-center justify-center ${activeTab === 'chat' ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]/40'}`}
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
                            <div className="pb-20">

                                {/* Simplified Order Details - No borders/background as requested */}
                                <div className="flex flex-col space-y-[24px] transition-colors duration-300">
                                    
                                    {/* Header Section */}
                                    <div className="space-y-[6px]">
                                        <div className="flex justify-between items-start">
                                            <h2 className="text-[24px] font-bold text-[var(--text-primary)] leading-[1.2] flex-1 max-w-[210px]" style={{ fontFamily: 'var(--font-cera)' }}>{order.title}</h2>
                                            <div className={`px-[8px] h-[20px] rounded-full flex items-center justify-center shrink-0 mt-1.5 ${statusInfo.text === 'Ожидает' ? 'bg-[#FFD700]' : statusInfo.bg}`}>
                                                <span className="text-[#141414] text-[10px] font-black uppercase tracking-wider">{statusInfo.text}</span>
                                            </div>
                                        </div>

                                         <div className="flex justify-between items-center h-[22px]">
                                             <span className="text-[var(--text-secondary)] text-[18px] font-bold leading-[120%]">{order.tariff}{order.design ? ` + ${order.design}` : ""}</span>
                                             <span className="text-[var(--text-secondary)] text-[18px] font-bold leading-[120%] tabular-nums">{Number(order.price || 0).toLocaleString()} ₽</span>
                                         </div>
                                    </div>

                                    <div className="w-full h-[1px] bg-[var(--border-color)]/50" />

                                    {/* Tags Section */}
                                    <div className="flex flex-wrap gap-[6px]">
                                        {(order.features && order.features.length > 0 ? order.features : ["Внутренние покупки", "Авторизация"]).slice(0, 3).map((tag, idx) => (
                                            <div key={idx} className="bg-[var(--text-secondary)]/20 px-[10px] h-[22px] rounded-full flex items-center justify-center border border-[var(--text-secondary)]/10">
                                                <span className="text-[var(--text-primary)] text-[11px] font-bold leading-none">{tag}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Detailed Info Rows */}
                                    <div className="flex flex-col gap-[8px]">
                                        {/* Executor */}
                                        <div className="flex flex-col justify-center items-start h-[37px]">
                                            <span className="text-[11px] font-normal text-[#999999] leading-[120%] uppercase" style={{ fontFamily: "'Cera Pro', var(--font-cera), sans-serif" }}>Исполнитель</span>
                                            <span className="text-[16px] font-normal text-[#F5F5F5] leading-[24px] flex items-center" style={{ fontFamily: "'Cera Pro', var(--font-cera), sans-serif" }}>
                                                {order.sellerPhone === 'ADMIN' ? 'ООО ТЕСТ' : (partner?.name || order.partnerName || "ООО ТЕСТ")}
                                            </span>
                                        </div>

                                        {/* Created */}
                                        <div className="flex flex-col justify-center items-start h-[37px]">
                                            <span className="text-[11px] font-normal text-[#999999] leading-[120%] uppercase" style={{ fontFamily: "'Cera Pro', var(--font-cera), sans-serif" }}>Создан</span>
                                            <span className="text-[16px] font-normal text-[#F5F5F5] leading-[24px] flex items-center tabular-nums" style={{ fontFamily: "'Cera Pro', var(--font-cera), sans-serif" }}>
                                                {order.createdAt ? new Date(order.createdAt).toLocaleDateString("ru-RU", { day: '2-digit', month: '2-digit', year: 'numeric' }) : '08.04.2026'}
                                            </span>
                                        </div>

                                        {/* Stage */}
                                        <div className="flex flex-col justify-center items-start h-[37px]">
                                            <span className="text-[11px] font-normal text-[#999999] leading-[120%] uppercase" style={{ fontFamily: "'Cera Pro', var(--font-cera), sans-serif" }}>Этап</span>
                                            <span className="text-[16px] font-normal text-[#F5F5F5] leading-[24px] flex items-center" style={{ fontFamily: "'Cera Pro', var(--font-cera), sans-serif" }}>
                                                {order.stage === 'processing' ? 'Обработка' : 
                                                 order.stage === 'design' ? 'Дизайн' : 
                                                 order.stage === 'development' ? 'Разработка' : 
                                                 order.stage === 'test' ? 'Тестирование' : 
                                                 order.stage === 'ready' ? 'Готовность' : 'Обработка'}
                                            </span>
                                        </div>
                                    </div>
                                     {/* Date Block - 2 Cols */}
                                    <div className="flex gap-[28px]">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-[var(--text-secondary)] text-[12px] font-bold">Создан</span>
                                            <span className="text-[var(--text-primary)] text-[15px] font-bold tabular-nums">
                                                {new Date(order.createdAt).toLocaleDateString("ru-RU")}
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-[var(--text-secondary)] text-[12px] font-bold">Обновлен</span>
                                            <span className="text-[var(--text-primary)] text-[15px] font-bold tabular-nums">
                                                {new Date(order.updatedAt || order.createdAt).toLocaleDateString("ru-RU")}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Footer Section: Progress only */}
                                    <div className="flex flex-col gap-[8px] pt-4">
                                        <div className="flex gap-[4px]">
                                            {[1, 2, 3, 4, 5].map((step) => (
                                                <div
                                                    key={step}
                                                    className={`h-[12px] flex-1 rounded-full transition-colors duration-300 ${step <= progress ? 'bg-[var(--text-primary)]' : 'bg-[var(--border-color)]'}`}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {order.isDisputed && (
                                        <div className="flex items-center justify-center gap-2 py-4 border-t border-[var(--border-color)] mt-4">
                                            <div className="w-2 h-2 rounded-full bg-[var(--accent-color)] animate-pulse" />
                                            <span className="text-[var(--accent-color)] font-bold uppercase tracking-widest text-[12px]">В процессе спора</span>
                                        </div>
                                    )}

                                </div>
                            </div>
                        </div>

                        {/* Chat Tab */}
                        <div
                            ref={chatContainerRef}
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
                                                <div className="max-w-[90%] text-center px-5 py-2 text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.1em] bg-[var(--nav-bg)] rounded-full border border-[var(--border-color)] transition-colors duration-300" style={{ fontFamily: 'var(--font-cera)' }}>
                                                    {msg.text}
                                                </div>
                                            </div>
                                        );

                                        return (
                                            <div key={idx} className={`flex flex-col ${isMe ? "items-end" : "items-start"} animate-in zoom-in-95 duration-300`}>
                                                <div className={`
                                                    max-w-[85%] px-[20px] py-[14px] text-[15px] leading-[1.4] break-words whitespace-pre-wrap flex flex-col gap-1 relative transition-all duration-300
                                                    ${isMe 
                                                        ? "bg-[var(--nav-btn)] text-[var(--text-primary)] rounded-[20px] rounded-tr-[4px]" 
                                                        : "bg-[var(--nav-bg)] text-[var(--text-primary)] rounded-[20px] rounded-tl-[4px] border border-[var(--border-color)]/30"
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
                                <div ref={messagesEndRef} />
                            </div>
                        </div>
                    </div>
                </main>

                <div className={`fixed bottom-0 w-full max-w-[375px] px-[16px] pb-[34px] bg-[var(--bg-color)] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] left-1/2 -translate-x-1/2 z-50 ${activeTab === 'chat' ? 'translate-y-0' : 'translate-y-full'}`}>
                    <div className="flex items-center gap-[8px] h-[48px] mt-[12px]">
                        {/* Attachment Button */}
                        <button className="w-[48px] h-[48px] rounded-full bg-[var(--nav-bg)] flex items-center justify-center shrink-0 active:scale-90 transition-all border border-[var(--border-color)]">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                            </svg>
                        </button>
 
                        {/* Input Area */}
                        <div className="flex-1 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-full h-full flex items-center px-[20px] transition-colors duration-300">
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        if (inputText.trim()) handleSendMessage();
                                    }
                                }}
                                placeholder="Спросить Твэлви"
                                className="w-full bg-transparent text-[16px] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] outline-none"
                            />
                        </div>
 
                        {/* Send Button */}
                        <button
                            onClick={handleSendMessage}
                            disabled={!inputText.trim()}
                            className="w-[48px] h-[48px] rounded-full bg-[var(--nav-bg)] border border-[var(--border-color)] flex items-center justify-center transition-all shrink-0 active:scale-90 disabled:opacity-50"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 19V5M12 5l-7 7M12 5l7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>


        </div>
    );
}
