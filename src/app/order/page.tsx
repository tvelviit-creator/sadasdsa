"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUserPhone, getActiveRole, formatPhone } from "@/utils/userData";
import { getClientOrders, getSellerOrders, Order } from "@/utils/orders";
import OrderHeader from "@/components/OrderHeader";

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
                
                <OrderHeader />

                <main className="flex-1 pt-[124px] px-6 pb-32 space-y-5">
                    {orders.length === 0 ? (
                        <div className="py-40 flex flex-col items-center justify-center">
                            <h2 className="text-[16px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.1em]" style={{ fontFamily: 'var(--font-cera)' }}>
                                Заказов нет
                            </h2>
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
    const partnerDisplayName = order.sellerPhone === 'ADMIN' ? 'Твэлви' : (order.partnerName || 'Партнер');
    const orderNumStr = order.orderNumber ? String(order.orderNumber).split('-').pop() : order.id.slice(-4);

    return (
        <div
            key={order.id}
            onClick={() => router.push(`${baseRoute}/${order.id}`)}
            className="w-[327px] mx-auto bg-[var(--card-bg)] border border-[var(--border-color)] rounded-[24px] p-[16px] flex flex-col gap-[12px] active:scale-[0.98] transition-all cursor-pointer relative overflow-hidden h-[351px]"
        >
            {/* 1. Header Section */}
            <div className="flex flex-col gap-[2px]">
                <div className="flex justify-between items-start">
                    <h2 
                        className="text-[24px] font-bold text-[var(--text-primary)] leading-[120%] flex-1 line-clamp-1"
                        style={{ fontFamily: "'Cera Pro', sans-serif" }}
                    >
                        {order.title || "Проект"}
                    </h2>
                    <span 
                        className="text-[24px] font-bold text-[var(--text-secondary)] leading-[120%]"
                        style={{ fontFamily: "'Cera Pro', sans-serif" }}
                    >
                        №{orderNumStr}
                    </span>
                </div>

                <div className="flex justify-between items-center h-[22px]">
                    <span 
                        className="text-[18px] font-bold text-[var(--text-secondary)] leading-[120%]"
                        style={{ fontFamily: "'Cera Pro', sans-serif" }}
                    >
                        {order.tariff || "Базовый"}
                    </span>
                    <span 
                        className="text-[18px] font-bold text-[var(--text-secondary)] leading-[120%] tabular-nums"
                        style={{ fontFamily: "'Cera Pro', sans-serif" }}
                    >
                        {Number(order.price || 0).toLocaleString()} ₽
                    </span>
                </div>
            </div>

            {/* 2. Divider */}
            <div className="w-full h-0 border-t-2 border-[var(--border-color)]" />

            {/* 3. Tags */}
            <div className="flex flex-wrap gap-[6px]">
                {(order.features && order.features.length > 0 ? order.features : ["Внутренние покупки", "Авторизация"]).slice(0, 3).map((tag, idx) => (
                    <div key={idx} className="bg-[var(--text-secondary)] px-[8px] h-[20px] rounded-full flex items-center justify-center">
                        <span className="text-[var(--bg-color)] text-[13px] font-bold leading-none">{tag}</span>
                    </div>
                ))}
            </div>

            {/* 4. Info Rows */}
            <div className="flex flex-col gap-[6px] mt-[4px]">
                <div className="flex items-end gap-2">
                    <span className="text-[14px] text-[var(--text-secondary)] whitespace-nowrap" style={{ fontFamily: "'Cera Pro', sans-serif" }}>Партнер</span>
                    <div className="flex-1 border-b border-dotted border-[var(--border-color)] mb-1" />
                    <span className="text-[16px] text-[var(--text-primary)] font-normal truncate max-w-[150px]" style={{ fontFamily: "'Cera Pro', sans-serif" }}>{partnerDisplayName}</span>
                </div>
                <div className="flex items-end gap-2">
                    <span className="text-[14px] text-[var(--text-secondary)] whitespace-nowrap" style={{ fontFamily: "'Cera Pro', sans-serif" }}>Заказчик</span>
                    <div className="flex-1 border-b border-dotted border-[var(--border-color)] mb-1" />
                    <span className="text-[16px] text-[var(--text-primary)] font-normal truncate max-w-[150px]" style={{ fontFamily: "'Cera Pro', sans-serif" }}>{order.clientName || "Клиент"}</span>
                </div>
                <div className="flex items-end gap-2">
                    <span className="text-[14px] text-[var(--text-secondary)] whitespace-nowrap" style={{ fontFamily: "'Cera Pro', sans-serif" }}>Телефон</span>
                    <div className="flex-1 border-b border-dotted border-[var(--border-color)] mb-1" />
                    <span className="text-[16px] text-[var(--text-primary)] font-normal tabular-nums" style={{ fontFamily: "'Cera Pro', sans-serif" }}>{order.clientPhone || "+7..."}</span>
                </div>
            </div>

            {/* 5. Dates Section */}
            <div className="flex gap-[24px] mt-[4px]">
                <div className="flex flex-col gap-[2px]">
                    <span className="text-[14px] text-[var(--text-secondary)]" style={{ fontFamily: "'Cera Pro', sans-serif" }}>Создан</span>
                    <span className="text-[16px] text-[var(--text-primary)] font-normal tabular-nums" style={{ fontFamily: "'Cera Pro', sans-serif" }}>
                        {new Date(order.createdAt).toLocaleDateString("ru-RU")}
                    </span>
                </div>
                <div className="flex flex-col gap-[2px]">
                    <span className="text-[14px] text-[var(--text-secondary)]" style={{ fontFamily: "'Cera Pro', sans-serif" }}>Обновлен</span>
                    <span className="text-[16px] text-[var(--text-primary)] font-normal tabular-nums" style={{ fontFamily: "'Cera Pro', sans-serif" }}>
                        {new Date(order.updatedAt || order.createdAt).toLocaleDateString("ru-RU")}
                    </span>
                </div>
            </div>

            {/* 6. Footer: Progress & Status */}
            <div className="flex justify-between items-center mt-auto pt-[4px]">
                <div className="flex gap-[6px]">
                    {[1, 2, 3, 4, 5].map((step) => (
                        <div 
                            key={step} 
                            className={`w-[36px] h-[12px] rounded-full transition-all duration-500 ${step <= progress ? 'bg-[var(--text-primary)]' : 'bg-[var(--border-color)]'}`}
                        />
                    ))}
                </div>
                <div className={`${statusInfo.bg} px-[8px] py-[2px] rounded-full flex items-center justify-center transform translate-x-[-6px]`}>
                    <span className="text-[var(--bg-color)] text-[12px] font-bold" style={{ fontFamily: "'Cera Pro', sans-serif" }}>
                        {statusInfo.text}
                    </span>
                </div>
            </div>

            {unreadCount > 0 && (
                <div className="absolute top-[16px] right-[16px] w-2 h-2 bg-[#FF8C67] rounded-full" />
            )}
        </div>
    );
}
