"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { getOrderById, saveOrder, Order } from "@/utils/orders";
import { ChatMessage, getChatMessages, sendChatMessage } from "@/utils/chat";
import { getCurrentUserPhone } from "@/utils/userData";

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
        <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] flex justify-center font-cera overflow-hidden transition-colors duration-300">
            <div className="w-full max-w-[375px] relative h-screen flex flex-col">

                {/* Header - Fixed 24px Bold, centered positioning */}
                <header className="fixed top-0 w-full max-w-[375px] h-[160px] bg-[var(--bg-color)] z-50 px-[24px] pt-[64px] pb-[16px] flex flex-col justify-between left-1/2 -translate-x-1/2 border-b border-[var(--border-color)] transition-colors duration-300">
                    <div className="relative flex items-center justify-center w-full h-[32px]">
                        <button
                            onClick={() => router.push("/seller")}
                            className="absolute left-0 w-[32px] h-[32px] flex items-center justify-center active:scale-95 transition-all text-[var(--text-primary)]"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <h1 
                            className="text-[24px] font-bold text-[var(--text-primary)] leading-[1.2]"
                            style={{ fontFamily: 'var(--font-cera)' }}
                        >
                            Заказ №{orderNumStr}
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
                        <div className="w-1/2 h-full shrink-0 overflow-y-auto no-scrollbar pt-[180px] pb-10 px-[24px]">
                            <div className="space-y-[24px] pb-24">

                                {/* Summary Card Area */}
                                <div className="space-y-[24px]">
                                    <div className="space-y-[8px] px-[8px]">
                                        <div className="flex justify-between items-start gap-[12px]">
                                            <h2 className="text-[24px] font-semibold text-[var(--text-primary)] leading-[120%] flex-1 line-clamp-2">{order.title}</h2>
                                            <div className="flex items-center gap-[12px] shrink-0 h-[20px]">
                                                <div className={`px-[10px] h-[20px] rounded-full flex items-center justify-center border border-[var(--border-color)] ${status === 'pending' ? 'bg-[#FFC700]' : (status === 'completed' || status === 'cancelled') ? 'bg-[var(--accent-color)]' : 'bg-[#4AC99B]'}`}>
                                                    <span className="text-[var(--bg-color)] text-[11px] font-bold leading-none">
                                                        {status === 'in_progress' ? 'В работе' : status === 'pending' ? 'Ожидает' : 'Остановлен'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                         <div className="flex justify-between items-center h-[22px]">
                                             <span className="text-[var(--text-secondary)] text-[18px] font-bold leading-[120%]">{order.tariff}{order.design ? ` + ${order.design}` : ""}</span>
                                             <span className="text-[var(--text-secondary)] text-[18px] font-bold leading-[120%] tabular-nums">{Number(order.price || 0).toLocaleString()} ₽</span>
                                         </div>
                                    </div>

                                    <div className="flex flex-wrap gap-[8px] px-[8px]">
                                        {(order.features && order.features.length > 0 ? order.features : ["Общее"]).map((tag, idx) => (
                                            <div key={idx} className="bg-[var(--nav-bg)] px-[8px] py-0 h-[20px] rounded-full flex items-center justify-center border border-[var(--border-color)]">
                                                <span className="text-[var(--text-primary)] text-[13px] font-normal leading-[20px]">{tag}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Info rows with Dots Layout and Professional Terms from Mockup */}
                                    <div className="space-y-[8px] px-[8px]">
                                        <div className="flex items-center gap-[4px] h-[24px]">
                                            <span className="text-[13px] font-bold text-[var(--text-secondary)] leading-none shrink-0">Клиент</span>
                                            <div className="flex-1 border-b border-dotted border-[var(--border-color)] h-[12px] opacity-50" />
                                            <span className="text-[16px] font-normal text-[var(--text-primary)] leading-none shrink-0 text-right truncate max-w-[170px]">
                                                {order.clientName || "—"}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-[4px] h-[24px]">
                                            <span className="text-[13px] font-bold text-[var(--text-secondary)] leading-none shrink-0">Телефон</span>
                                            <div className="flex-1 border-b border-dotted border-[var(--border-color)] h-[12px] opacity-50" />
                                            <span className="text-[16px] font-normal text-[var(--text-primary)] leading-none shrink-0 tabular-nums text-right">
                                                {formatPhone(order.clientPhone)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-[4px] h-[24px]">
                                            <span className="text-[13px] font-bold text-[var(--text-secondary)] leading-none shrink-0">Создан</span>
                                            <div className="flex-1 border-b border-dotted border-[var(--border-color)] h-[12px] opacity-50" />
                                            <span className="text-[16px] font-normal text-[var(--text-primary)] leading-none shrink-0 tabular-nums text-right">
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

                        {/* Chat Tab content */}
                        <div
                            ref={chatContainerRef}
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
                                                    max-w-[85%] px-[20px] py-[14px] text-[15px] leading-[1.4] break-words whitespace-pre-wrap flex flex-col gap-1 relative transition-all duration-300
                                                    ${isMe 
                                                        ? "bg-[#EDEDED] text-[#141414] rounded-[20px] rounded-tr-[4px]" 
                                                        : "bg-[#D6D6D6] text-[#141414] rounded-[20px] rounded-tl-[4px]"
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
