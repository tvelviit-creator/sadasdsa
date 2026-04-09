"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { getCurrentUserPhone } from "@/utils/userData";

interface ChatMessage {
    id: string;
    senderPhone: string;
    senderName?: string;
    text: string;
    timestamp: string;
    isAdminSender: boolean;
    orderId?: string;
    isRead?: boolean;
}

export default function AdminSupportChatPage() {
    const router = useRouter();
    const params = useParams();
    const phone = params?.phone as string;
    const cleanPhone = phone === 'guest' ? 'guest' : (phone ? phone.replace(/\D/g, '') : '');
    
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputText, setInputText] = useState("");
    const [userName, setUserName] = useState("Пользователь");
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const currentPhone = getCurrentUserPhone();

    useEffect(() => {
        if (!cleanPhone) return;

        const fetchData = async () => {
            try {
                // Fetch user info from support requests
                const supRes = await fetch(`/api/support?status=open`, { cache: 'no-store' });
                if (supRes.ok) {
                    const sups = await supRes.json();
                    const currentSup = sups.find((s: any) => {
                        const sPhone = s.userPhone === 'guest' ? 'guest' : s.userPhone.replace(/\D/g, '');
                        return sPhone === cleanPhone;
                    });
                    if (currentSup) {
                        setUserName(currentSup.userName || "Пользователь");
                    }
                }

                const res = await fetch(`/api/chat?orderId=support_${cleanPhone}`, { cache: 'no-store' });
                if (res.ok) {
                    const data = await res.json();
                    setMessages(data);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 3000);
        return () => clearInterval(interval);
    }, [cleanPhone]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const lastConnectIdx = [...messages].reverse().findIndex(m => m.text === "Оператор Tvelv подключился");
        const lastCloseIdx = [...messages].reverse().findIndex(m => m.text === "Обращение закрыто оператором.");
        
        if (lastConnectIdx !== -1 && (lastCloseIdx === -1 || lastConnectIdx < lastCloseIdx)) {
            setIsConnected(true);
        } else {
            setIsConnected(false);
        }
    }, [messages]);

    const connectToChat = async () => {
        if (isConnected || !cleanPhone || !currentPhone) return;

        const systemMsg = {
            id: `msg_sys_${ Date.now()}`,
            orderId: `support_${cleanPhone}`,
            senderPhone: 'SYSTEM',
            text: "Оператор Tvelv подключился",
            timestamp: new Date().toISOString(),
            isAdminSender: true,
            isRead: true
        };

        await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(systemMsg)
        });
        setMessages(prev => [...prev, systemMsg]);

        const greetingMsg = {
            id: `msg_${Date.now()}_greeting`,
            orderId: `support_${cleanPhone}`,
            senderPhone: currentPhone,
            senderName: "Оператор Tvelv",
            text: "Ознакамливаюсь, подождите",
            timestamp: new Date().toISOString(),
            isAdminSender: true,
            isRead: false
        };

        await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(greetingMsg)
        });
        
        setMessages(prev => [...prev, greetingMsg]);
        setIsConnected(true);
    };

    const handleSendMessage = async () => {
        if (!inputText.trim() || !cleanPhone || !currentPhone) return;
 
        const newMessage: ChatMessage = {
            id: `msg_${Date.now()}`,
            orderId: `support_${cleanPhone}`,
            senderPhone: currentPhone,
            senderName: "Оператор Tvelv",
            text: inputText,
            timestamp: new Date().toISOString(),
            isAdminSender: true,
            isRead: false
        };
 
        setMessages(prev => [...prev, newMessage]);
        setInputText("");
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
 
        try {
            await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newMessage)
            });
            await fetch(`/api/chat?markRead=true&orderId=support_${cleanPhone}&phone=${encodeURIComponent(currentPhone)}`);
        } catch (e) {
            console.error(e);
        }
    };
 
    const closeRequest = async () => {
        if (!cleanPhone) return;
        try {
            const closingMsg: ChatMessage = {
                id: `msg_sys_${Date.now()}`,
                orderId: `support_${cleanPhone}`,
                senderPhone: 'SYSTEM',
                text: 'Обращение закрыто оператором.',
                timestamp: new Date().toISOString(),
                isAdminSender: true
            };
            setMessages(prev => [...prev, closingMsg]);
 
            await fetch('/api/support', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userPhone: cleanPhone, status: 'closed' })
            });
            
            setTimeout(() => {
                router.push('/admin/settings');
            }, 800);
        } catch (e) {
            console.error(e);
        }
    };

    if (loading) return null;

    return (
        <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] font-sans flex justify-center selection:bg-[#1AE8E8]/30 overflow-hidden">
            {/* Mobile-centric container */}
            <div className="w-full max-w-[375px] relative h-screen bg-[var(--bg-color)] flex flex-col">
                
                {/* Standard App Header */}
                <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[375px] h-[102px] z-[100]">
                    <svg width="375" height="102" viewBox="0 0 375 102" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                        <mask id="header-mask" fill="white">
                            <path d="M0 0H375V102H0V0Z" />
                        </mask>
                        <path d="M0 0H375V102H0V0Z" fill="var(--bg-color)" />
                        <path d="M375 102V101H0V102V103H375V102Z" fill="var(--border-color)" mask="url(#header-mask)" />
                    </svg>

                    {/* Back Button - Positioned exactly as in Design */}
                    <button 
                        onClick={() => router.push('/admin/settings')} 
                        className="absolute left-[20px] top-[60px] w-12 h-12 flex items-center justify-center active:scale-90 transition-all text-[var(--text-primary)]"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* User Info - Clean & Readable */}
                    <div 
                        onClick={() => cleanPhone !== 'guest' && router.push(`/admin/users/${encodeURIComponent(cleanPhone)}`)}
                        className="absolute left-[70px] top-[60px] flex flex-col cursor-pointer active:opacity-60 transition-opacity min-w-0 max-w-[170px]"
                    >
                        <h1 className="text-[16px] font-bold text-[var(--text-primary)] leading-[1.2] truncate tracking-tight" style={{ fontFamily: 'var(--font-cera)' }}>{userName}</h1>
                        <span className="text-[11px] text-[var(--text-secondary)] font-bold leading-[1.2] tracking-tight uppercase" style={{ fontFamily: 'var(--font-cera)' }}>{phone === 'guest' ? 'Гость' : `+${cleanPhone}`}</span>
                    </div>

                    {/* Action Button - Level & Aligned */}
                    <div className="absolute right-[24px] top-[64px]">
                        {!isConnected ? (
                            <button 
                                onClick={connectToChat}
                                className="h-[32px] px-5 bg-[#1AE8E8] rounded-full text-[11px] font-bold uppercase tracking-wider text-[var(--bg-color)] active:scale-95 transition-all shadow-[0_0_20px_rgba(26,232,232,0.3)]"
                                style={{ fontFamily: 'var(--font-cera)' }}
                            >
                                Начать
                            </button>
                        ) : (
                            <button 
                                onClick={closeRequest} 
                                className="h-[32px] px-5 bg-[var(--border-color)] border border-[var(--border-color)] rounded-full text-[11px] font-bold uppercase tracking-wider text-[#FF4545] active:scale-95 transition-all"
                                style={{ fontFamily: 'var(--font-cera)' }}
                            >
                                Закрыть
                            </button>
                        )}
                    </div>
                </header>

                {/* Chat Bodies */}
                <main className="flex-1 overflow-y-auto px-6 pt-[120px] pb-[130px] space-y-8 custom-scrollbar scroll-smooth">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center pt-20 opacity-20 text-center select-none">
                            <p className="font-bold tracking-widest uppercase text-[12px]" style={{ fontFamily: 'var(--font-cera)' }}>Ожидание сообщений</p>
                        </div>
                    ) : (
                        messages.map((msg, index) => {
                            const isSystem = msg.senderPhone === 'SYSTEM';
                            const isAI = msg.senderPhone === 'AI_ASSISTANT';
                            const isMe = msg.isAdminSender && !isSystem && !isAI;
                            const isUser = !isMe && !isSystem && !isAI;

                            if (isSystem) {
                                return (
                                    <div key={index} className="flex justify-center my-4 animate-in fade-in duration-500">
                                        <div className="bg-[var(--border-color)] px-5 py-2 rounded-full text-[11px] text-[var(--text-secondary)] font-bold uppercase tracking-[0.1em] border border-[var(--border-color)]" style={{ fontFamily: 'var(--font-cera)' }}>
                                            {msg.text}
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <div key={index} className={`flex flex-col ${isMe ? "items-end" : "items-start"} animate-in zoom-in-95 duration-300`}>
                                    {isMe && (
                                        <div className="flex items-center gap-2 mb-2 mr-2">
                                            <span className="text-[11px] text-[var(--text-secondary)] font-bold uppercase tracking-tight" style={{ fontFamily: 'var(--font-cera)' }}>Вы</span>
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#1AE8E8] shadow-[0_0_8px_#1AE8E8]" />
                                        </div>
                                    )}
                                    {!isMe && !isAI && !isSystem && (
                                        <div className="flex items-center gap-2 mb-2 ml-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[var(--text-secondary)]" />
                                            <span className="text-[11px] text-[var(--text-secondary)] font-bold uppercase tracking-tight" style={{ fontFamily: 'var(--font-cera)' }}>{userName}</span>
                                        </div>
                                    )}
                                    
                                    <div className={`
                                        max-w-[85%] px-5 py-4 text-[15px] leading-[1.5] break-words whitespace-pre-wrap flex flex-col gap-2 relative
                                        ${isMe ? "bg-[var(--card-bg)] text-[var(--text-primary)] rounded-[28px] rounded-tr-none border border-[var(--border-color)] shadow-2xl" : ""} 
                                        ${isAI ? "bg-[var(--card-bg)] text-[var(--text-secondary)] italic text-[14px] rounded-[20px] border border-dashed border-[var(--border-color)]" : ""}
                                        ${isUser ? "bg-[var(--card-bg)] text-[var(--text-primary)] rounded-[28px] rounded-tl-none border border-[var(--border-color)] shadow-xl" : ""}
                                    `}>
                                        <span className={isUser ? "font-medium" : ""}>{msg.text}</span>
                                        <div className={`text-[10px] mt-1 opacity-30 font-medium tabular-nums tracking-tighter ${isMe || isUser ? "text-right" : "text-left"}`}>
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </main>

                {/* Standard Tvelv Input Panel (Grey Pill Design) */}
                <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[375px] px-[16px] pb-[34px] bg-[var(--bg-color)] z-[100]">
                    {!isConnected ? (
                        <button 
                            onClick={connectToChat}
                            className="w-full h-[56px] bg-[var(--border-color)] rounded-full flex items-center justify-center active:scale-[0.98] transition-all border border-[var(--border-color)]"
                        >
                            <span className="text-[16px] font-bold text-[var(--text-primary)] uppercase tracking-wider" style={{ fontFamily: 'var(--font-cera)' }}>Подключиться</span>
                        </button>
                    ) : (
                        <div className="flex items-center gap-[8px] h-[48px]">
                            {/* Attachment Button */}
                            <button className="w-[48px] h-[48px] rounded-full bg-[var(--border-color)] flex items-center justify-center shrink-0 active:scale-90 transition-transform">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19" />
                                </svg>
                            </button>

                            {/* Input Capsule */}
                            <div className="flex-1 bg-[var(--border-color)] rounded-full h-full flex items-center px-[20px]">
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter' && inputText.trim()) handleSendMessage(); }}
                                    placeholder="Написать ответ..."
                                    className="w-full bg-transparent text-[16px] text-[var(--text-primary)] placeholder:text-[var(--text-primary)]/40 outline-none font-medium"
                                />
                            </div>

                            {/* Send Button */}
                            <button
                                onClick={handleSendMessage}
                                disabled={!inputText.trim()}
                                className="w-[48px] h-[48px] rounded-full bg-[var(--border-color)] flex items-center justify-center transition-all shrink-0 active:scale-90 disabled:opacity-50"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={inputText.trim() ? "var(--text-primary)" : "var(--text-secondary)"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 19V5M12 5l-7 7M12 5l7 7" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            </div>
            
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 0px; }
                .scroll-smooth { scroll-behavior: smooth; }
            `}</style>
        </div>
    );
}
