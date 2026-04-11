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

    const handleSendMessage = async () => {
        if (!inputText.trim() || !orderId || !currentPhone) return;
        const newMessage: ChatMessage = {
            id: `msg_${Date.now()}`,
            orderId: orderId,
            senderPhone: currentPhone,
            text: inputText.trim(),
            timestamp: new Date().toISOString()
        };
        await sendChatMessage(newMessage);
        setMessages(prev => [...prev, newMessage]);
        setInputText("");
    };

    if (!order) return <div className="min-h-screen bg-[var(--bg-color)]" />;

    // Helper functions
    const getStatusInfo = (order: Order) => {
        const s = order.status;
        if (s === 'cancelled') return { text: 'Отмена', bg: 'bg-[#FF8C67]' };
        if (s === 'completed') return { text: 'Готов', bg: 'bg-[#4AC99B]' };
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
                {/* Header - Fixed 24px Bold, centered positioning */}
                <header className="fixed top-0 w-full max-w-[375px] h-[150px] bg-[var(--bg-color)] z-50 flex flex-col left-1/2 -translate-x-1/2 border-b border-[var(--border-color)] transition-colors duration-300">
                    <button
                        onClick={() => router.back()}
                        className="absolute left-[29px] top-[63px] w-[22px] h-[18px] flex items-center justify-center active:scale-95 transition-all text-[var(--text-primary)]"
                    >
                        <svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22 9H0M0 9L9.42857 18M0 9L9.42857 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                    
                    <h1 
                        className="absolute left-1/2 -translate-x-1/2 top-[57.5px] w-[127px] h-[29px] flex items-center justify-center overflow-visible whitespace-nowrap"
                        style={{ 
                            fontFamily: "'Cera Pro', sans-serif",
                            fontWeight: 700,
                            fontSize: '24px',
                            lineHeight: '120%',
                            letterSpacing: '0%',
                            textAlign: 'center',
                            verticalAlign: 'middle',
                            color: 'var(--text-primary)'
                        }}
                    >
                        Заказ №{orderNumStr}
                    </h1>

                    <div className="absolute left-[24.5px] top-[104.5px] w-[326px] h-[31px]">
                        <div className="absolute inset-0 border border-[var(--border-color)] rounded-full" />
                        
                        <div
                            className={`absolute top-0 bottom-0 w-1/2 rounded-full border border-[var(--text-primary)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${activeTab === 'details' ? 'left-0' : 'left-1/2'}`}
                        />
                        
                        <div className="relative flex h-full items-center">
                            <button
                                onClick={() => setActiveTab('details')}
                                className={`flex-1 text-[13px] font-bold transition-all duration-300 ${activeTab === 'details' ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}
                            >
                                Детали
                            </button>
                            <button
                                onClick={() => setActiveTab('chat')}
                                className={`flex-1 text-[13px] font-bold transition-all duration-300 flex items-center justify-center gap-1 ${activeTab === 'chat' ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}
                            >
                                Чат
                                {activeTab !== 'chat' && hasUnreadInOrder && (
                                    <div className="w-[5px] h-[6px] bg-[#FF8C67] rounded-full shadow-[0_0_10px_rgba(255,140,103,0.5)]" />
                                )}
                            </button>
                        </div>
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
                        <div className="w-1/2 h-full shrink-0 overflow-y-auto hide-scrollbar pt-[180px] pb-32 px-[24px]">
                            <div className="flex flex-col gap-[24px] pb-24">
                                {/* 1. Header Section: Title & Status Badge */}
                                <div className="flex flex-col gap-[8px]">
                                    <div className="flex justify-between items-start gap-4">
                                        <h2 
                                            className="text-[24px] font-bold text-[var(--text-primary)] leading-[1.2] flex-1 line-clamp-2"
                                            style={{ fontFamily: "'Cera Pro', sans-serif" }}
                                        >
                                            {order.title || "Обучающее приложение"}
                                        </h2>
                                        <div className={`${statusInfo.bg} h-[20px] px-[8px] rounded-[10px] flex items-center justify-center shrink-0`}>
                                            <span className="text-[var(--bg-color)] text-[13px] font-normal leading-none whitespace-nowrap" style={{ fontFamily: "'Cera Pro', sans-serif" }}>
                                                {statusInfo.text}
                                            </span>
                                        </div>
                                    </div>

                                    {/* 2. Tariff and Price Row */}
                                    <div className="flex justify-between items-center h-[22px]">
                                        <span 
                                            className="text-[18px] font-bold text-[var(--text-secondary)] leading-[1.2]"
                                            style={{ fontFamily: "'Cera Pro', sans-serif" }}
                                        >
                                            {order.tariff || "Базовый"}
                                        </span>
                                        <span 
                                            className="text-[18px] font-bold text-[var(--text-secondary)] leading-[1.2] tabular-nums"
                                            style={{ fontFamily: "'Cera Pro', sans-serif" }}
                                        >
                                            {order.price ? Number(order.price).toLocaleString() : "240 000"} ₽
                                        </span>
                                    </div>
                                </div>

                                {/* 3. Tags / Features */}
                                <div className="flex flex-wrap gap-[8px]">
                                    {(order.features && order.features.length > 0 ? order.features : ["Авторизация", "Профиль", "Отслеживание заказа"]).map((tag, idx) => (
                                        <div key={idx} className="bg-[var(--text-secondary)] px-[12px] h-[20px] rounded-full flex items-center justify-center">
                                            <span className="text-[var(--bg-color)] text-[13px] font-medium leading-none">{tag}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* 4. Info Sections (Stacks) */}
                                <div className="flex flex-col gap-[12px]">
                                    {/* Executor (Seller) */}
                                    <div className="flex flex-col">
                                        <span className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.05em]" style={{ fontFamily: "'Cera Pro', sans-serif" }}>
                                            Исполнитель
                                        </span>
                                        <span className="text-[16px] text-[var(--text-primary)] font-normal leading-[1.5]" style={{ fontFamily: "'Cera Pro', sans-serif" }}>
                                            {partner?.name || (order.sellerPhone === 'ADMIN' ? 'Администрация' : partner?.phone || "В поиске...")}
                                        </span>
                                    </div>

                                    {/* Created Date */}
                                    <div className="flex flex-col">
                                        <span className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.05em]" style={{ fontFamily: "'Cera Pro', sans-serif" }}>
                                            Создан
                                        </span>
                                        <span className="text-[16px] text-[var(--text-primary)] font-normal leading-[1.5] tabular-nums" style={{ fontFamily: "'Cera Pro', sans-serif" }}>
                                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString("ru-RU") : "02.08.2025"}
                                        </span>
                                    </div>

                                    {/* Stage Name */}
                                    <div className="flex flex-col">
                                        <span className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.05em]" style={{ fontFamily: "'Cera Pro', sans-serif" }}>
                                            Этап
                                        </span>
                                        <span className="text-[16px] text-[var(--text-primary)] font-normal leading-[1.5]" style={{ fontFamily: "'Cera Pro', sans-serif" }}>
                                            {(() => {
                                                switch(order.stage) {
                                                    case 'processing': return "Обработка";
                                                    case 'design': return "Дизайн";
                                                    case 'development': return "Разработка";
                                                    case 'test': return "Тестирование";
                                                    case 'ready': return "Готов";
                                                    default: return "Обработка";
                                                }
                                            })()}
                                        </span>
                                    </div>
                                </div>

                                {/* 5. Progress Bar Section */}
                                <div className="flex flex-col gap-[16px]">
                                    <div className="flex justify-between items-center w-full gap-[8.3px]">
                                        {[1, 2, 3, 4, 5].map((step) => {
                                            const isActive = step < progress;
                                            const isCurrent = step === progress;
                                            return (
                                                <div 
                                                    key={step} 
                                                    className="flex-1 h-[12px] bg-[var(--border-color)] rounded-full overflow-hidden relative"
                                                >
                                                    {/* White Fill Segment */}
                                                    <div 
                                                        className="absolute inset-0 bg-[var(--text-primary)] transition-all duration-700 ease-out"
                                                        style={{ 
                                                            width: isActive ? '100%' : isCurrent ? '50%' : '0%',
                                                            borderRadius: 'inherit'
                                                        }}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {order.isDisputed && (
                                    <div className="flex items-center justify-center gap-2 py-2 mt-2 border-t border-[#FFF]/10">
                                        <div className="w-2 h-2 rounded-full bg-[#FF8C67] animate-pulse" />
                                        <span className="text-[#FF8C67] font-bold uppercase tracking-widest text-[12px]">Спор открыт</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Chat Tab */}
                        <div
                            ref={chatContainerRef}
                            className="w-1/2 h-full shrink-0 overflow-y-auto hide-scrollbar pt-[170px] px-[24px]"
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
                                                    max-w-[85%] px-[24px] py-[18px] flex flex-col gap-1.5 relative transition-all duration-300
                                                    bg-[var(--nav-btn)] text-[var(--text-primary)] rounded-[32px] shadow-sm
                                                    ${isMe ? "rounded-br-[8px]" : "rounded-bl-[8px]"}
                                                `}>
                                                    <div className="text-[15px] leading-[1.6] break-words whitespace-pre-wrap opacity-90" style={{ fontFamily: "'Cera Pro', sans-serif", fontWeight: 300 }}>
                                                        {msg.text}
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
