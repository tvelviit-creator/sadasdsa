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

    if (loading) return <div className="min-h-screen bg-[var(--bg-color)]" />;

    return (
        <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] font-sans flex justify-center selection:bg-[var(--accent-cyan)]/30 overflow-x-hidden transition-colors duration-300">
            <div className="w-full max-w-[375px] relative min-h-screen bg-[var(--bg-color)] flex flex-col">
                
                <header className="fixed top-0 w-full max-w-[375px] h-[102px] bg-[var(--bg-color)] border-b border-[var(--border-color)] z-[100] px-6 flex items-end pb-[12px] transition-colors duration-300">
                    <h1 className="text-[24px] font-bold text-[var(--text-primary)] leading-[120%] tracking-normal" style={{ fontFamily: 'var(--font-cera), sans-serif' }}>
                        Заказы
                    </h1>
                </header>

                <main className="flex-1 pt-[124px] px-6 pb-32 space-y-5">
                    {orders.length === 0 ? (
                        <div className="py-32 flex flex-col items-center justify-center space-y-8">
                            <div className="relative">
                                {/* Decorative Glow Background */}
                                <div className="absolute inset-0 bg-[var(--accent-cyan)] opacity-20 blur-[40px] rounded-full animate-pulse" />
                                
                                {/* Premium Icon Container */}
                                <div className="relative w-24 h-24 bg-white/[0.03] backdrop-blur-3xl rounded-[40px] flex items-center justify-center border border-white/10 shadow-2xl overflow-hidden group">
                                    {/* Subtle light sweep on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.05] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                                    
                                    <svg width="42" height="42" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        {/* Outer Hexagon */}
                                        <path d="M12 2L20.66 7V17L12 22L3.34 17V7L12 2Z" stroke="url(#grad_empty)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        {/* Inner Connections */}
                                        <path d="M12 2V12L20.66 7M12 12L3.34 7M12 12L12 22" stroke="url(#grad_empty)" strokeWidth="1" strokeOpacity="0.4" strokeLinecap="round" strokeLinejoin="round" />
                                        {/* Center Core */}
                                        <circle cx="12" cy="12" r="2.5" fill="url(#grad_empty)" fillOpacity="0.3" stroke="url(#grad_empty)" strokeWidth="1.2" />
                                        <defs>
                                            <linearGradient id="grad_empty" x1="3.34" y1="2" x2="20.66" y2="22" gradientUnits="userSpaceOnUse">
                                                <stop stopColor="#1AE8E8" />
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
                                    {role === 'seller' 
                                      ? 'Ваши будущие клиенты увидят ваши услуги в каталоге' 
                                      : 'Новые проекты появятся здесь сразу после оформления'}
                                </p>
                            </div>
                        </div>
                    ) : (
                        orders.map((order) => (
                            <OrderCard 
                                key={order.id} 
                                order={order} 
                                router={router} 
                                role={role} 
                                unreadCount={unreadCounts[order.id] || 0}
                            />
                        ))
                    )}
                </main>
            </div>
        </div>
    );
}

function OrderCard({ order, router, role, unreadCount }: { order: Order, router: any, role: string, unreadCount: number }) {
    const baseRoute = role === 'seller' ? '/lkseller/orders' : '/order';
    
    const getStatusInfo = (order: Order) => {
        const s = order.status;
        const stage = order.stage;
        if (s === 'cancelled') return { text: 'Отмена', bg: 'bg-[#FF8C67]' };
        if (s === 'completed' || (stage as string) === 'ready') return { text: 'Готов', bg: 'bg-[#4AC99B]' };
        if (s === 'pending') return { text: 'Ожидает', bg: 'bg-[#FFC700]' };
        return { text: 'В работе', bg: 'bg-[#4AC99B]' };
    };

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
    const statusInfo = getStatusInfo(order);
    const partnerDisplayName = order.sellerPhone === 'ADMIN' ? 'Твэлви' : (order.partnerName || '—');
    const orderNumStr = order.orderNumber ? String(order.orderNumber).split('-').pop() : order.id.slice(-4);

    return (
        <div
            key={order.id}
            onClick={() => router.push(`${baseRoute}/${order.id}`)}
            className="w-full bg-[var(--card-bg)] rounded-[24px] p-[16px] gap-[16px] flex flex-col active:scale-[0.98] transition-all cursor-pointer relative overflow-hidden border border-[var(--border-color)] shadow-xl min-h-[351px]"
        >
            <div className="flex flex-col gap-[4px] h-[84px] shrink-0">
                <div className="flex items-start justify-between h-[58px]">
                    <div className="flex items-center gap-2">
                        <h2 className="text-[24px] font-bold text-[var(--text-primary)] leading-[29px] line-clamp-2 max-w-[215px]">
                            {order.title || "Без названия"}
                        </h2>
                        {unreadCount > 0 && (
                            <div className="px-2 py-0.5 bg-[#FF8C67] rounded-full text-[10px] font-black text-white shrink-0">
                                +{unreadCount}
                            </div>
                        )}
                    </div>
                    <span className="text-[24px] font-bold text-[var(--text-secondary)] leading-[29px] tabular-nums shrink-0">
                        №{orderNumStr}
                    </span>
                </div>
                <div className="flex items-center justify-between h-[22px]">
                    <span className="text-[18px] font-bold text-[var(--text-secondary)] leading-[22px] truncate">
                        {order.tariff || "Базовый"}
                    </span>
                    <span className="text-[18px] font-bold text-[var(--text-secondary)] leading-[22px] tabular-nums">
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

