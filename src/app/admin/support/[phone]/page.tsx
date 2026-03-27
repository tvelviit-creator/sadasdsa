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
 
            const res = await fetch('/api/support', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userPhone: cleanPhone, status: 'closed' })
            });
            if (!res.ok) throw new Error('Failed to close session');
            
            setTimeout(() => {
                router.push('/admin/settings');
            }, 800);
        } catch (e) {
            console.error(e);
            alert("Ошибка при закрытии обращения.");
        }
    };

    if (loading) return null;

    return (
        <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] font-sans flex justify-center selection:bg-[#1AE8E8]/30 overflow-hidden w-full">
            {/* Mobile-centric container */}
            <div className="w-full max-w-[375px] relative h-screen bg-transparent flex flex-col md:hidden mx-auto">
                {/* Mobile Background Elements */}
                <div className="fixed inset-0 z-[-1] pointer-events-none opacity-[0.03]" style={{ backgroundImage: `radial-gradient(white 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
                <div className="fixed top-[-10%] right-[-10%] w-[60%] h-[60%] bg-[var(--accent-cyan)]/5 blur-[100px] rounded-full pointer-events-none z-[-1]" />
                <div className="fixed bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-500/5 blur-[100px] rounded-full pointer-events-none z-[-1]" />
                
                {/* Standard App Header */}
                <header className="fixed top-0 w-full max-w-[375px] h-[102px] z-[100] bg-black/40 backdrop-blur-3xl border-b border-white/5 shadow-2xl transition-colors duration-300">
                    <svg width="375" height="102" viewBox="0 0 375 102" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full absolute -z-10 left-0 bottom-0 pointer-events-none">
                        <mask id="header-mask" fill="white">
                            <path d="M0 0H375V102H0V0Z" />
                        </mask>
                        <path d="M0 0H375V102H0V0Z" fill="transparent" />
                        <path d="M375 102V101H0V102V103H375V102Z" fill="transparent" mask="url(#header-mask)" />
                    </svg>

                    <button 
                        onClick={() => router.push('/admin/settings')} 
                        className="absolute left-[20px] top-[60px] w-12 h-12 flex items-center justify-center active:scale-90 transition-all text-[var(--text-primary)]"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <div 
                        onClick={() => cleanPhone !== 'guest' && router.push(`/admin/users/${encodeURIComponent(cleanPhone)}`)}
                        className="absolute left-[70px] top-[60px] flex flex-col cursor-pointer active:opacity-60 transition-opacity min-w-0 max-w-[170px]"
                    >
                        <h1 className="text-[16px] font-bold text-[var(--text-primary)] leading-[1.2] truncate tracking-tight" style={{ fontFamily: 'var(--font-cera)' }}>{userName}</h1>
                        <span className="text-[11px] text-[var(--text-secondary)] font-bold leading-[1.2] tracking-tight uppercase" style={{ fontFamily: 'var(--font-cera)' }}>{phone === 'guest' ? 'Гость' : `+${cleanPhone}`}</span>
                    </div>

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
                                        <div className="bg-black/40 backdrop-blur-sm px-5 py-2 rounded-full text-[11px] text-[var(--text-secondary)] font-bold uppercase tracking-[0.1em] border border-white/5 shadow-sm" style={{ fontFamily: 'var(--font-cera)' }}>
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
                                            <div className="w-2 h-2 rounded-full bg-[var(--text-primary)]" />
                                        </div>
                                    )}
                                    {!isMe && !isAI && !isSystem && (
                                        <div className="flex items-center gap-2 mb-2 ml-2">
                                            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-[var(--text-primary)] border border-[var(--bg-color)]">
                                                <span className="text-[var(--bg-color)] text-[10px] font-bold">{userName.charAt(0).toUpperCase() || 'U'}</span>
                                            </div>
                                            <span className="text-[11px] text-[var(--text-secondary)] font-bold uppercase tracking-tight" style={{ fontFamily: 'var(--font-cera)' }}>{userName}</span>
                                        </div>
                                    )}
                                    
                                    <div className={`
                                        max-w-[85%] px-[20px] py-[16px] text-[15px] leading-[1.5] break-words whitespace-pre-wrap flex flex-col gap-1.5 relative transition-colors duration-300
                                        ${isMe ? "bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-[20px] rounded-tr-[4px] shadow-[0_5px_15px_rgba(0,0,0,0.3)]" : ""} 
                                        ${isAI ? "bg-black/40 backdrop-blur-md text-[var(--text-secondary)] italic text-[14px] rounded-[24px] border border-white/5 shadow-sm" : ""}
                                        ${isUser ? "bg-black/40 backdrop-blur-md text-[var(--text-primary)] rounded-[20px] rounded-tl-[4px] border border-white/5 shadow-sm" : ""}
                                    `}>
                                        <span className="font-medium">{msg.text}</span>
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

                <div className="fixed bottom-0 w-full max-w-[375px] px-[16px] pb-[34px] pt-[20px] bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B]/80 to-transparent z-[100]">
                    {!isConnected ? (
                        <button 
                            onClick={connectToChat}
                            className="w-full h-[56px] bg-[var(--border-color)] rounded-full flex items-center justify-center active:scale-[0.98] transition-all border border-[var(--border-color)]"
                        >
                            <span className="text-[16px] font-bold text-[var(--text-primary)] uppercase tracking-wider" style={{ fontFamily: 'var(--font-cera)' }}>Подключиться</span>
                        </button>
                    ) : (
                        <div className="flex items-center gap-[8px] h-[52px]">
                            <button className="w-[48px] h-[48px] rounded-full flex items-center justify-center shrink-0 active:scale-90 transition-transform">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19" />
                                </svg>
                            </button>

                            <div className="flex-1 bg-white/5 backdrop-blur-xl border border-white/10 shadow-sm rounded-[20px] h-full flex items-center px-[20px] focus-within:border-[var(--accent-cyan)] transition-colors duration-300">
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter' && inputText.trim()) handleSendMessage(); }}
                                    placeholder="Сообщение..."
                                    className="w-full bg-transparent text-[16px] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] outline-none font-medium"
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
                    )}
                </div>
            </div>

            {/* Desktop-centric container */}
            <div className="hidden md:flex flex-col flex-1 h-screen relative bg-transparent overflow-hidden">
                <header className="h-20 bg-[var(--card-bg)]/80 backdrop-blur-xl border-b border-[var(--border-color)] flex items-center justify-between px-10 shrink-0">
                    <div className="flex items-center gap-6">
                        <button 
                            onClick={() => router.push('/admin/settings')}
                            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors active:scale-95"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <div className="flex flex-col">
                            <h1 className="text-[20px] font-black font-cera text-white uppercase tracking-tight leading-none mb-1">{userName}</h1>
                            <span className="text-[12px] font-bold text-[var(--accent-cyan)] uppercase tracking-widest">{phone === 'guest' ? 'Гость' : `+${cleanPhone}`}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {!isConnected ? (
                            <button 
                                onClick={connectToChat}
                                className="h-10 px-8 bg-[#1AE8E8] rounded-full text-[12px] font-black uppercase tracking-widest text-[#0A0A0B] hover:shadow-[0_0_20px_rgba(26,232,232,0.4)] transition-all active:scale-95"
                            >
                                Начать диалог
                            </button>
                        ) : (
                            <button 
                                onClick={closeRequest}
                                className="h-10 px-8 bg-red-500/10 border border-red-500/20 rounded-full text-[12px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-95"
                            >
                                Закрыть сессию
                            </button>
                        )}
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto px-10 py-10 space-y-8 custom-scrollbar scroll-smooth">
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center opacity-20">
                            <div className="w-20 h-20 rounded-full border-2 border-dashed border-white/20 mb-6 flex items-center justify-center">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                </svg>
                            </div>
                            <p className="font-black tracking-widest uppercase text-[14px]">Ожидание сообщений</p>
                        </div>
                    ) : (
                        <div className="max-w-[1000px] mx-auto w-full space-y-8">
                            {messages.map((msg, index) => {
                                const isSystem = msg.senderPhone === 'SYSTEM';
                                const isMe = msg.isAdminSender && !isSystem && msg.senderPhone !== 'AI_ASSISTANT';
                                const isUser = !isMe && !isSystem && msg.senderPhone !== 'AI_ASSISTANT';

                                if (isSystem) {
                                    return (
                                        <div key={index} className="flex justify-center my-6">
                                            <div className="bg-white/5 px-8 py-2.5 rounded-full text-[12px] text-[var(--text-secondary)] font-bold uppercase tracking-[0.2em] border border-white/5">
                                                {msg.text}
                                            </div>
                                        </div>
                                    );
                                }

                                return (
                                    <div key={index} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                                        <div className={`flex items-center gap-3 mb-2 ${isMe ? "flex-row-reverse mr-1" : "ml-1"}`}>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isMe ? "bg-[var(--accent-cyan)] text-black" : "bg-white/10 text-white"}`}>
                                                <span className="text-[12px] font-black uppercase">{isMe ? 'A' : (userName.charAt(0) || 'U')}</span>
                                            </div>
                                            <span className="text-[12px] font-black text-white/40 uppercase tracking-widest">{isMe ? 'Вы' : userName}</span>
                                        </div>
                                        
                                        <div className={`
                                            max-w-[70%] px-8 py-5 text-[16px] leading-[1.6] break-words whitespace-pre-wrap rounded-[28px] border transition-all duration-300
                                            ${isMe ? "bg-[var(--accent-cyan)]/10 border-[var(--accent-cyan)]/20 text-white rounded-tr-[4px]" : "bg-white/5 border-white/10 text-white rounded-tl-[4px]"}
                                        `}>
                                            <span className="font-medium">{msg.text}</span>
                                            <div className="text-[10px] mt-2 opacity-30 font-bold tabular-nums tracking-widest flex items-center gap-2">
                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </main>

                <div className="p-10 bg-gradient-to-t from-[var(--bg-color)] to-transparent shrink-0">
                    <div className="max-w-[1000px] mx-auto w-full">
                        {!isConnected ? (
                            <button 
                                onClick={connectToChat}
                                className="w-full h-16 bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 rounded-[28px] flex items-center justify-center transition-all active:scale-[0.99]"
                            >
                                <span className="text-[14px] font-black text-white uppercase tracking-[0.3em]">Подключиться к диалогу</span>
                            </button>
                        ) : (
                            <div className="flex items-center gap-5">
                                <div className="flex-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[28px] flex items-center px-8 py-4 focus-within:border-[var(--accent-cyan)]/30 transition-all shadow-2xl">
                                    <input
                                        type="text"
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Enter' && inputText.trim()) handleSendMessage(); }}
                                        placeholder="Введите сообщение..."
                                        className="w-full bg-transparent text-[16px] text-white placeholder:text-white/20 outline-none font-medium h-full"
                                    />
                                </div>

                                <button
                                    onClick={handleSendMessage}
                                    disabled={!inputText.trim()}
                                    className={`w-16 h-16 rounded-[24px] flex items-center justify-center transition-all shrink-0 active:scale-95 shadow-xl
                                        ${inputText.trim() 
                                            ? 'bg-white text-black hover:bg-[#1AE8E8] shadow-[0_0_30px_rgba(255,255,255,0.1)]' 
                                            : 'bg-white/5 text-white/20 border border-white/5 opacity-50'
                                        }
                                    `}
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 19V5M12 5l-7 7M12 5l7 7" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.1); }
                .scroll-smooth { scroll-behavior: smooth; }
            `}</style>
        </div>
    );
}
