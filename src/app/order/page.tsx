"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUserPhone, getActiveRole, formatPhone } from "@/utils/userData";
import { getClientOrders, getSellerOrders, Order } from "@/utils/orders";

export default function OrdersPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [role, setRole] = useState<"client" | "seller">("client");
    const [loading, setLoading] = useState(true);

    const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});

    const loadOrders = async () => {
        const phone = getCurrentUserPhone();
        if (phone) {
            const activeRole = getActiveRole();
            setRole(activeRole);

            const fetchedOrders = activeRole === "seller"
                ? await getSellerOrders(phone)
                : await getClientOrders(phone);

            const sorted = [...fetchedOrders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setOrders(sorted);

            // Fetch unread counts
            sorted.forEach(async (order) => {
                const res = await fetch(`/api/chat?orderId=${order.id}`);
                const msgs = await res.json();
                const count = msgs.filter((m: any) => m.senderPhone !== phone && !m.isRead).length;
                setUnreadCounts(prev => ({ ...prev, [order.id]: count }));
            });
        } else {
            router.replace("/registration");
        }
        setLoading(false);
    };

    useEffect(() => {
        loadOrders();
        const interval = setInterval(loadOrders, 3000);
        return () => clearInterval(interval);
    }, [router]);

    const [activeTab, setActiveTab] = useState<"ACTIVE" | "HISTORY">("ACTIVE");

    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const isCompletedOrCancelled = order.status === 'completed' || order.status === 'cancelled' || order.stage === 'ready';
            if (activeTab === "ACTIVE") return !isCompletedOrCancelled;
            if (activeTab === "HISTORY") return isCompletedOrCancelled;
            return true;
        });
    }, [orders, activeTab]);

    if (loading) return <div className="min-h-screen bg-[var(--bg-color)]" />;

    return (
        <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] font-sans flex flex-col selection:bg-[var(--accent-cyan)]/30 transition-colors duration-300 w-full overflow-x-hidden relative z-10">
            {/* Desktop Header - Architectural Style with Interactive Tabs */}
            <div className="hidden md:flex flex-col px-12 mt-16 mb-12 w-full gap-4">
               <h1 className="text-4xl md:text-5xl font-black font-cera text-[var(--text-primary)] tracking-tight leading-none uppercase">
                 ЗАКАЗЫ<br/>
                 <div className="flex items-center gap-2 mt-2">
                    <button 
                        onClick={() => setActiveTab("ACTIVE")}
                        className={`transition-all duration-300 ${activeTab === "ACTIVE" ? 'text-[var(--text-primary)] opacity-100' : 'text-[var(--text-secondary)] opacity-50 hover:opacity-80'}`}
                    >
                        АКТИВНЫЕ
                    </button>
                    <span className="text-[var(--text-secondary)] opacity-30">/</span>
                    <button 
                        onClick={() => setActiveTab("HISTORY")}
                        className={`transition-all duration-300 ${activeTab === "HISTORY" ? 'text-[var(--text-primary)] opacity-100' : 'text-[var(--text-secondary)] opacity-50 hover:opacity-80'}`}
                    >
                        ИСТОРИЯ
                    </button>
                 </div>
               </h1>
            </div>

            {/* Mobile Header - RESTORED ORIGINAL */}
            <header className="fixed md:hidden top-0 w-full max-w-[375px] h-[102px] bg-[var(--bg-color)] border-b border-[var(--border-color)] z-[100] px-6 flex items-end pb-[12px] transition-colors duration-300">
                <h1 className="text-[24px] font-bold text-[var(--text-primary)] leading-[120%] tracking-normal" style={{ fontFamily: 'var(--font-cera), sans-serif' }}>
                    Заказы
                </h1>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 pt-[124px] md:pt-0 px-6 md:px-12 pb-32 w-full">
                {filteredOrders.length === 0 ? (
                    <>
                        {/* Desktop Empty State - Cinematic Architectural Design */}
                        <div className="hidden md:flex relative w-full h-[600px] flex-col items-center justify-center overflow-hidden border border-[var(--border-color)] rounded-[48px] bg-[var(--nav-bg)]/10 group/empty">
                            {/* Architectural Background Text */}
                            <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none overflow-hidden">
                                <span className="text-[15vw] font-black text-white/[0.02] leading-none uppercase tracking-tighter transform -rotate-12 translate-y-12">
                                    {activeTab === 'HISTORY' ? 'HISTORY' : 'ACTIVE'}
                                </span>
                            </div>
                            
                            {/* Minimalist Central Content */}
                            <div className="relative z-10 flex flex-col items-center">
                                {/* Geometric Decor */}
                                <div className="w-16 h-[1px] bg-[var(--accent-cyan)] mb-12 opacity-40 group-hover:w-32 transition-all duration-700 ease-out" />
                                
                                <h2 className="text-[13px] font-black uppercase tracking-[0.4em] text-[var(--text-secondary)] mb-6 opacity-40">
                                    СТАТУС: <span className="text-[var(--text-primary)] opacity-100">РАЗДЕЛ ПУСТ</span>
                                </h2>
                                
                                <h3 className="text-4xl md:text-5xl font-black font-cera text-[var(--text-primary)] mb-10 tracking-tight uppercase text-center leading-tight">
                                    {activeTab === 'HISTORY' ? (
                                        <>
                                            В ИСТОРИИ<br/>
                                            <span className="text-[var(--text-secondary)]">ПОКА НЕТ</span><br/>
                                            ЗАВЕРШЕННЫХ ДЕЛ
                                        </>
                                    ) : (
                                        <>
                                            У ВАС НЕТ<br/>
                                            <span className="text-[var(--text-secondary)]">АКТИВНЫХ ПРЯМО</span><br/>
                                            СЕЙЧАС ПРОЕКТОВ
                                        </>
                                    )}
                                </h3>
                                
                                <div className="w-16 h-[1px] bg-[var(--accent-cyan)] mt-12 opacity-40 group-hover:w-8 transition-all duration-700 ease-out" />
                            </div>
                            
                            {/* Edge Accents */}
                            <div className="absolute top-8 left-8 w-4 h-4 border-t border-l border-[var(--border-color)]" />
                            <div className="absolute top-8 right-8 w-4 h-4 border-t border-r border-[var(--border-color)]" />
                            <div className="absolute bottom-8 left-8 w-4 h-4 border-b border-l border-[var(--border-color)]" />
                            <div className="absolute bottom-8 right-8 w-4 h-4 border-b border-r border-[var(--border-color)]" />
                        </div>
                        {/* Mobile Empty State - RESTORED ORIGINAL */}
                        <div className="md:hidden py-32 flex flex-col items-center justify-center space-y-8 h-full">
                            <div className="relative">
                                <div className="absolute inset-0 bg-[var(--accent-cyan)] opacity-20 blur-[40px] rounded-full animate-pulse" />
                                <div className="relative w-24 h-24 bg-white/[0.03] backdrop-blur-3xl rounded-[40px] flex items-center justify-center border border-white/10 shadow-2xl overflow-hidden">
                                    <svg width="42" height="42" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 2L20.66 7V17L12 22L3.34 17V7L12 2Z" stroke="url(#grad_empty_mob)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M12 2V12L20.66 7M12 12L3.34 7M12 12L12 22" stroke="url(#grad_empty_mob)" strokeWidth="1" strokeOpacity="0.4" strokeLinecap="round" strokeLinejoin="round" />
                                        <circle cx="12" cy="12" r="2.5" fill="url(#grad_empty_mob)" fillOpacity="0.3" stroke="url(#grad_empty_mob)" strokeWidth="1.2" />
                                        <defs>
                                            <linearGradient id="grad_empty_mob" x1="3.34" y1="2" x2="20.66" y2="22" gradientUnits="userSpaceOnUse">
                                                <stop stopColor="var(--accent-cyan)" />
                                                <stop offset="1" stopColor="#2979FF" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </div>
                            </div>
                            <div className="text-center space-y-3">
                                <h2 className="text-[16px] font-bold text-[var(--text-primary)] uppercase tracking-[0.15em]" style={{ fontFamily: 'var(--font-cera)' }}>
                                    Заказов пока нет
                                </h2>
                                <p className="text-[13px] text-[#999999] max-w-[220px] mx-auto leading-relaxed font-medium opacity-50">
                                    {role === 'seller' ? 'Ваши будущие клиенты увидят ваши услуги в каталоге' : 'Новые проекты появятся здесь сразу после оформления'}
                                </p>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        {/* DESKTOP LIST VIEW - SLEEK LUXURY ROWS */}
                        <div className="hidden md:flex flex-col w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {filteredOrders.map((order) => (
                                <DesktopListRow 
                                    key={order.id} 
                                    order={order} 
                                    router={router} 
                                    role={role} 
                                    unreadCount={unreadCounts[order.id] || 0}
                                />
                            ))}
                        </div>

                        {/* MOBILE LIST VIEW - ORIGINAL APP STYLE */}
                        <div className="md:hidden grid grid-cols-1 gap-5">
                            {filteredOrders.map((order) => (
                                <OrderCard 
                                    key={order.id} 
                                    order={order} 
                                    router={router} 
                                    role={role} 
                                    unreadCount={unreadCounts[order.id] || 0}
                                />
                            ))}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}

function DesktopListRow({ order, router, role, unreadCount }: { order: Order, router: any, role: string, unreadCount: number }) {
    const baseRoute = role === 'seller' ? '/lkseller/orders' : '/order';
    const statusInfo = getStatus(order);
    
    const orderNumStr = order.orderNumber ? String(order.orderNumber).split('-').pop() : order.id.slice(-4);
    const partnerDisplayName = order.sellerPhone === 'ADMIN' ? 'Твэлви' : (order.partnerName || '—');

    let isCompletedOrCancelled = order.status === 'completed' || order.status === 'cancelled' || order.stage === 'ready';

    return (
        <div 
            onClick={() => router.push(`${baseRoute}/${order.id}`)}
            className={`group flex items-center justify-between p-6 mb-4 bg-[var(--card-bg)] border border-[var(--border-color)] cursor-pointer transition-all duration-300 rounded-[20px] hover:border-[var(--text-primary)] hover:shadow-lg ${isCompletedOrCancelled ? 'opacity-70 saturate-50' : ''}`}
        >
            <div className="flex items-center gap-6 flex-1 min-w-0 pr-6">
                {/* Dynamic Status Indicator Core */}
                <div className="flex shrink-0 w-[100px] flex-col items-center justify-center relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className={`w-[48px] h-[48px] rounded-full border-2 border-dashed ${statusInfo.bg.replace('bg-', 'border-[') + ']'} opacity-30 animate-[spin_10s_linear_infinite] group-hover:opacity-60 transition-opacity`} style={{ borderColor: statusInfo.bg.replace('bg-[', '').replace(']', '') }} />
                    </div>
                    <div className={`relative z-10 w-[32px] h-[32px] rounded-full flex items-center justify-center ${statusInfo.bg} bg-opacity-20 backdrop-blur-sm border ${statusInfo.bg.replace('bg-', 'border-[') + ']'} shadow-[0_0_15px_currentColor] group-hover:scale-110 transition-transform duration-300`} style={{ borderColor: statusInfo.bg.replace('bg-[', '').replace(']', ''), color: statusInfo.bg.replace('bg-[', '').replace(']', '') }}>
                        <div className={`w-2 h-2 rounded-full ${statusInfo.bg} ${statusInfo.text === 'В работе' || statusInfo.text === 'Ожидает' ? 'animate-ping' : ''}`} />
                    </div>
                </div>
                
                {/* Main Order Info */}
                <div className="flex flex-col min-w-0 flex-1 justify-center">
                    <div className="flex items-center gap-3 mb-1.5">
                        <h3 className="text-[20px] font-bold text-[var(--text-primary)] leading-none truncate font-cera uppercase tracking-tight">
                            {order.title || "БЕЗ НАЗВАНИЯ"}
                        </h3>
                        {unreadCount > 0 && (
                            <span className="px-2.5 py-0.5 rounded-full bg-[#FF8C67] text-[11px] font-black tracking-widest text-white shrink-0 animate-pulse">
                                +{unreadCount} НОВЫХ
                            </span>
                        )}
                    </div>
                    
                    <div className="flex items-center gap-x-4 gap-y-1 text-[13px] font-medium text-[var(--text-secondary)]">
                        <span className="text-[var(--text-primary)]">Заказ #{orderNumStr}</span>
                        <div className="w-1 h-1 rounded-full bg-[var(--border-color)]" />
                        <span>{new Date(order.createdAt).toLocaleDateString("ru-RU")}</span>
                        <div className="w-1 h-1 rounded-full bg-[var(--border-color)]" />
                        <span className="truncate">{statusInfo.text}</span>
                    </div>
                </div>
            </div>

            {/* Right side structural info */}
            <div className="flex items-center gap-10 shrink-0 border-l border-[var(--border-color)] pl-10">
                <div className="flex items-center gap-4 hidden lg:flex w-40">
                     <div className="w-10 h-10 rounded-full bg-[var(--nav-bg)] border border-[var(--border-color)] flex items-center justify-center shrink-0">
                         <span className="text-[14px] font-bold text-[var(--accent-cyan)]">{(partnerDisplayName[0] || 'П').toUpperCase()}</span>
                     </div>
                     <div className="flex flex-col min-w-0">
                         <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] opacity-50 mb-0.5">
                             ИСПОЛНИТЕЛЬ
                         </span>
                         <span className="text-[14px] font-bold text-[var(--text-primary)] truncate">
                             {partnerDisplayName}
                         </span>
                     </div>
                </div>
                
                <div className="flex flex-col text-right w-[140px]">
                     <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-secondary)] opacity-50 mb-1">
                         {order.tariff || "БАЗОВЫЙ"}
                     </span>
                     <span className="text-[24px] text-[var(--text-primary)] font-black tabular-nums font-cera leading-none">
                         {Number(order.price || 0).toLocaleString('ru-RU')} ₽
                     </span>
                </div>

                {/* Arrow Button */}
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-[var(--text-secondary)] group-hover:bg-[var(--text-primary)] group-hover:text-[var(--bg-color)] group-hover:rotate-45 transition-all duration-300 shrink-0">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                </div>
            </div>
        </div>
    );
}

function getStatus(order: Order) {
    const s = order.status;
    const stage = order.stage;
    if (s === 'cancelled') return { text: 'Отмена', bg: 'bg-[#FF8C67]' };
    if (s === 'completed' || (stage as string) === 'ready') return { text: 'Готов', bg: 'bg-[#4AC99B]' };
    if (s === 'pending') return { text: 'Ожидает', bg: 'bg-[#FFC700]' };
    return { text: 'В работе', bg: 'bg-[#4AC99B]' };
}

function OrderCard({ order, router, role, unreadCount }: { order: Order, router: any, role: string, unreadCount: number }) {
    const baseRoute = role === 'seller' ? '/lkseller/orders' : '/order';
    const statusInfo = getStatus(order);
    
    const getProgressSteps = (order: Order) => {
        if (order.status === 'completed' || (order.stage as string) === 'ready') return 5;
        if (order.status === 'cancelled') return 0;
        switch (order.stage) {
            case 'ready': return 5;
            case 'test': return 4;
            case 'development': return 3;
            case 'design': return 2;
            case 'processing': return 1;
            default: return 1;
        }
    };

    const progress = getProgressSteps(order);
    const partnerDisplayName = order.sellerPhone === 'ADMIN' ? 'Твэлви' : (order.partnerName || '—');
    const orderNumStr = order.orderNumber ? String(order.orderNumber).split('-').pop() : order.id.slice(-4);

    return (
        <div
            onClick={() => router.push(`${baseRoute}/${order.id}`)}
            className="md:hidden w-full bg-[var(--card-bg)] rounded-[24px] p-[16px] gap-[16px] flex flex-col active:scale-[0.98] transition-all cursor-pointer relative overflow-hidden border border-[var(--border-color)] shadow-xl min-h-[351px]"
        >
            <div className="flex flex-col gap-[4px] h-[84px] shrink-0">
                <div className="flex items-start justify-between h-[58px]">
                    <div className="flex items-center gap-2">
                        <h2 className="text-[24px] font-bold text-[var(--text-primary)] leading-[29px] line-clamp-2 max-w-[215px] font-cera">
                            {order.title || "Без названия"}
                        </h2>
                        {unreadCount > 0 && (
                            <div className="px-2 py-0.5 bg-[#FF8C67] rounded-full text-[10px] font-black text-white shrink-0">
                                +{unreadCount}
                            </div>
                        )}
                    </div>
                    <span className="text-[24px] font-bold text-[var(--text-secondary)] leading-[29px] tabular-nums shrink-0 font-cera">
                        №{orderNumStr}
                    </span>
                </div>
                <div className="flex items-center justify-between h-[22px]">
                    <span className="text-[18px] font-bold text-[var(--text-secondary)] leading-[22px] truncate font-cera">
                        {order.tariff || "Базовый"}
                    </span>
                    <span className="text-[18px] font-bold text-[var(--text-secondary)] leading-[22px] tabular-nums font-cera">
                        {Number(order.price || 0).toLocaleString()} ₽
                    </span>
                </div>
            </div>
            <div className="flex flex-wrap gap-[8px] mb-[32px] shrink-0">
                {(order.features || ["Общее"]).slice(0, 3).map((tag, i) => (
                    <div key={i} className="px-[12px] h-[24px] flex items-center bg-[var(--nav-bg)] rounded-full border border-[var(--border-color)]">
                        <span className="text-[var(--text-primary)] text-[11px] font-bold tracking-tight opacity-60 uppercase">{tag}</span>
                    </div>
                ))}
            </div>
            <div className="flex flex-col gap-[8px] shrink-0">
                <div className="flex items-center gap-[4px] h-[24px]">
                    <span className="text-[13px] font-normal text-[var(--text-secondary)] leading-none shrink-0">Партнер</span>
                    <div className="flex-1 border-b border-dotted border-[var(--border-color)] h-[12px] opacity-50" />
                    <span className="text-[16px] font-normal text-[var(--text-primary)] leading-none shrink-0 truncate max-w-[160px] text-right">
                        {partnerDisplayName}
                    </span>
                </div>
                <div className="flex items-center gap-[4px] h-[24px]">
                    <span className="text-[13px] font-normal text-[var(--text-secondary)] leading-none shrink-0">Создан</span>
                    <div className="flex-1 border-b border-dotted border-[var(--border-color)] h-[12px] opacity-50" />
                    <span className="text-[16px] font-normal text-[var(--text-primary)] leading-none shrink-0 tabular-nums text-right">
                        {new Date(order.createdAt).toLocaleDateString("ru-RU")}
                    </span>
                </div>
            </div>
            <div className="flex items-center justify-between mt-auto h-[24px]">
                <div className="flex gap-[4px]">
                    {[1, 2, 3, 4, 5].map((step) => (
                        <div
                            key={step}
                            className={`h-[12px] w-[32px] rounded-full transition-colors duration-500 ${step <= progress ? 'bg-[var(--text-primary)] [html.day-theme_&]:bg-[#141414]' : 'bg-[var(--nav-bg)] border border-[var(--border-color)]'}`}
                        />
                    ))}
                </div>
                <div className={`px-[12px] h-[24px] rounded-full border border-[var(--text-primary)] flex items-center justify-center shrink-0 ${statusInfo.bg} shadow-sm`}>
                    <span className="text-[var(--bg-color)] text-[12px] font-bold leading-none">
                        {statusInfo.text}
                    </span>
                </div>
            </div>
        </div>
    );
}

