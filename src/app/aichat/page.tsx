"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUserPhone } from "@/utils/userData";

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

export default function AiChatPage() {
    const router = useRouter();
    const defaultGreeting: Message[] = [
        {
            id: "greeting_1",
            role: "assistant",
            text: "Тогда ты по адресу!\nЕсли ты мне расскажешь какой функционал тебя интересует, я расскажу какой тариф тебе подойдет.\n\nЛибо ты уже сейчас можешь собрать свой продукт самостоятельно уже сейчас:",
            link: {
                text: "Собрать Фудтех приложение",
                url: "/catigoriy/cat_1770840272713"
            },
            timestamp: new Date().toISOString()
        }
    ];

    const [messages, setMessages] = useState<Message[]>(defaultGreeting);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [hasGreeted, setHasGreeted] = useState(true);
    const hasGreetedRef = useRef(true);
    const [isLoaded, setIsLoaded] = useState(false);
    const [userPhone, setUserPhone] = useState<string | null>(null);
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


        // Handle initial query from navigation (only once)
        const savedQuery = localStorage.getItem("aiInitialQuery");
        if (savedQuery) {
            handleSend(savedQuery);
            localStorage.removeItem("aiInitialQuery");
        }

        setIsLoaded(true);
    }, [userPhone]);

    // 3. Save state to local storage whenever it changes (only after loaded)
    useEffect(() => {
        if (!isLoaded || !userPhone) return;
        localStorage.setItem(`aiChatMessages_${userPhone}`, JSON.stringify(messages));
        localStorage.setItem(`aiChatHasGreeted_${userPhone}`, hasGreeted.toString());
    }, [messages, hasGreeted, isLoaded, userPhone]);


    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async (textToSend: string) => {
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
        setIsTyping(true);

        setTimeout(() => {
            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                text: "Тогда ты по адресу!\nЕсли ты мне расскажешь какой функционал тебя интересует, я расскажу какой тариф тебе подойдет.\n\nЛибо ты уже сейчас можешь собрать свой продукт самостоятельно уже сейчас:",
                link: {
                    text: "Собрать Фудтех приложение",
                    url: "/catigoriy/cat_1770840272713"
                },
                timestamp: new Date().toISOString()
            };

            setMessages(prev => [...prev, aiResponse]);
            setIsTyping(false);
        }, 1000);
    };

    const textStyle = {
        fontFamily: "var(--font-cera), sans-serif",
        fontSize: "15px",
        fontWeight: 300,
        lineHeight: "1.4",
        letterSpacing: "0",
        fontStyle: "normal"
    };

    return (
        <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] flex justify-center font-sans overflow-x-hidden transition-colors duration-300">
            <div className="w-full max-w-[375px] relative h-screen flex flex-col">
                {/* Header Section from Figma SVG */}
                <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[375px] h-[102px] z-50 transition-colors duration-300">
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

                {/* Chat Area */}
                <main
                    ref={scrollRef}
                    className="flex-1 px-6 pt-[120px] pb-[120px] overflow-y-auto space-y-8 scroll-smooth hide-scrollbar transition-colors duration-300"
                >
                    {messages.map((msg) => {
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
                            <div
                                key={msg.id}
                                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-full animate-in fade-in slide-in-from-bottom-2 duration-300`}
                            >
                                <div className={`
                                    max-w-[85%] px-[24px] py-[18px] flex flex-col gap-1.5 relative transition-all duration-300
                                    ${isMe 
                                        ? "bg-[var(--nav-btn)] text-[var(--text-primary)] rounded-[32px] rounded-br-[8px] shadow-sm" 
                                        : "text-[var(--text-primary)] border-none px-0"
                                    }
                                `}>
                                    <p style={textStyle} className="whitespace-pre-wrap leading-[1.6] opacity-90">{msg.text}</p>
                                    
                                    {msg.link && (
                                        <div
                                            className="block mt-2 text-[var(--accent-cyan)] text-[15px] font-light underline decoration-[var(--accent-cyan)]/40 underline-offset-4 font-cera text-left cursor-pointer"
                                        >
                                            {msg.link.text}
                                        </div>
                                    )}
 

                                </div>
                            </div>
                        );
                    })}

                    {isTyping && (
                        <div className="flex flex-col items-start max-w-full animate-pulse transition-colors duration-300">
                            <p className="text-[15px] text-[var(--text-secondary)] font-light ml-4">печатает...</p>
                        </div>
                    )}
                </main>

                {/* Chat Input Bar - Redesigned to match SVG template */}
                <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[375px] px-[24px] pb-[34px] bg-[var(--bg-color)] z-50 transition-colors duration-300">
                    <div className="flex items-center gap-[8px] w-[327px] mx-auto h-[44px] mt-[12px]">
                        {/* Input Area */}
                        <div className="w-[275px] h-[44px] bg-[var(--nav-bg)] rounded-full flex items-center px-[22px] transition-colors duration-300 border border-[var(--border-color)]/30">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && input.trim()) handleSend(input);
                                }}
                                placeholder="Спросить Твэлви"
                                className="w-full bg-transparent text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] outline-none"
                                style={{ fontFamily: 'var(--font-cera), sans-serif' }}
                            />
                        </div>
 
                        {/* Send Button */}
                        <button
                            onClick={() => handleSend(input)}
                            disabled={!input.trim()}
                            className="w-[44px] h-[44px] bg-[var(--nav-bg)] border border-[var(--border-color)]/30 rounded-full flex items-center justify-center transition-all shrink-0 active:scale-95 disabled:opacity-50"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 18V6M12 6L5.5 12.8571M12 6L18.5 12.8571" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <style jsx global>{`
                ::-webkit-scrollbar { display: none; }
                @keyframes bounce-short {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-3px); }
                }
                .animate-bounce-short {
                    animation: bounce-short 1s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
