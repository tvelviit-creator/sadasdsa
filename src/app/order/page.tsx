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
            className="w-full bg-[var(--card-bg)] rounded-[32px] p-[24px] flex flex-col active:scale-[0.98] transition-all cursor-pointer relative overflow-hidden shadow-2xl min-h-[412px]"
        >
            {/* Header row */}
            <div className="flex justify-between items-start mb-[4px]">
                <h2 className="text-[var(--text-primary)] text-[22px] font-bold leading-[1.2] flex-1 line-clamp-1" style={{ fontFamily: 'var(--font-cera)' }}>
                    {order.title || "Проект"}
                </h2>
                <div className="flex items-center gap-1 opacity-40 shrink-0 ml-4">
                    <span className="text-[var(--text-secondary)] text-[20px] font-bold">№</span>
                    <span className="text-[var(--text-secondary)] text-[20px] font-bold tabular-nums">{orderNumStr}</span>
                </div>
            </div>

            {/* Subheader: Tariff & Price */}
            <div className="flex justify-between items-center mb-[16px]">
                <span className="text-[var(--text-secondary)] text-[15px] font-bold">{order.tariff || "Базовый"}</span>
                <span className="text-[var(--text-secondary)] text-[15px] font-bold tabular-nums">
                    {Number(order.price || 0).toLocaleString()} ₽
                </span>
            </div>

            <div className="w-full h-[1px] bg-[var(--border-color)] mb-[20px]" />

            {/* Tags - smaller */}
            <div className="flex flex-wrap gap-[6px] mb-[20px]">
                {(order.features && order.features.length > 0 ? order.features : ["Внутренние покупки", "Авторизация"]).slice(0, 3).map((tag, idx) => (
                    <div key={idx} className="bg-[var(--text-secondary)]/10 rounded-full px-[10px] h-[22px] flex items-center border border-[var(--text-secondary)]/10">
                        <span className="text-[var(--text-primary)] text-[11px] font-bold leading-none">{tag}</span>
                    </div>
                ))}
            </div>

            {/* Compact Info Rows */}
            <div className="space-y-[10px] mb-[24px]">
                <div className="flex items-end gap-[4px] h-[18px]">
                    <span className="text-[12px] font-bold text-[var(--text-secondary)] leading-none shrink-0 mb-[2px]">Партнер</span>
                    <div className="flex-1 border-b-[1px] border-dotted border-[var(--border-color)] h-[1px] mb-[3px]" />
                    <span className="text-[14px] font-bold text-[var(--text-primary)] leading-none shrink-0 truncate max-w-[140px] text-right">
                        {partnerDisplayName}
                    </span>
                </div>
                <div className="flex items-end gap-[4px] h-[18px]">
                    <span className="text-[12px] font-bold text-[var(--text-secondary)] leading-none shrink-0 mb-[2px]">Заказчик</span>
                    <div className="flex-1 border-b-[1px] border-dotted border-[var(--border-color)] h-[1px] mb-[3px]" />
                    <span className="text-[14px] font-bold text-[var(--text-primary)] leading-none shrink-0 truncate max-w-[130px] text-right">
                        {order.clientName || "Клиент"}
                    </span>
                </div>
                <div className="flex items-end gap-[4px] h-[18px]">
                    <span className="text-[12px] font-bold text-[var(--text-secondary)] leading-none shrink-0 mb-[2px]">Телефон</span>
                    <div className="flex-1 border-b-[1px] border-dotted border-[var(--border-color)] h-[1px] mb-[3px]" />
                    <span className="text-[var(--text-primary)] text-[14px] font-bold leading-none shrink-0 tabular-nums text-right">
                        {order.clientPhone || "+7..."}
                    </span>
                </div>
            </div>

            {/* Dates row - compact */}
            <div className="flex gap-[28px] mb-[28px]">
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

            {/* Bottom Bar: Progress and Badge - Compact */}
            <div className="mt-auto flex justify-between items-center h-[28px]">
                <div className="flex gap-[4px]">
                    {[1, 2, 3, 4, 5].map((step) => (
                        <div
                            key={step}
                            className={`h-[10px] w-[34px] rounded-full transition-colors duration-500 ${step <= progress ? 'bg-[var(--text-primary)]' : 'bg-[var(--border-color)]'}`}
                        />
                    ))}
                </div>
                <div className={`px-[8px] h-[22px] rounded-full flex items-center justify-center shrink-0 ${statusInfo.text === 'Ожидает' ? 'bg-[#FFD700]' : statusInfo.bg}`}>
                    <span className="text-[#141414] text-[10px] font-black uppercase tracking-wider">
                        {statusInfo.text}
                    </span>
                </div>
            </div>

            {unreadCount > 0 && (
                <div className="absolute top-[24px] right-[24px] w-2 h-2 bg-[#FF8C67] rounded-full" />
            )}
        </div>
    );
}
