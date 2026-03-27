"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getActiveRole, getCurrentUserPhone } from "@/utils/userData";
import { getClientOrders, getSellerOrders, Order } from "@/utils/orders";
import BottomNav from "@/components/BottomNav";

export default function ChatsPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [role, setRole] = useState<"client" | "seller" | null>(null);
    const [loading, setLoading] = useState(true);
    const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});

    useEffect(() => {
        const activeRole = getActiveRole();
        const phone = getCurrentUserPhone();
        setRole(activeRole);

        async function fetchOrders() {
            if (!phone) {
                setLoading(false);
                return;
            }

            let clientData = await getClientOrders(phone);
            let sellerData = await getSellerOrders(phone);

            // If admin, also fetch "ADMIN" orders (since they might be stored as 'ADMIN' instead of the phone)
            const isAdmin = phone === "79999999999" || phone === "79001112233";
            if (isAdmin) {
                try {
                    const adminOrders = await getSellerOrders("ADMIN");
                    sellerData = [...sellerData, ...adminOrders];
                } catch (e) {
                    console.error("Failed to fetch admin orders", e);
                }
            }
            
            // Combine and unique by ID
            let combined = [...clientData, ...sellerData];
            let data = Array.from(new Map(combined.map(item => [item.id, item])).values());
            
            data.sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime());

            // Filter for admin: hide completed/cancelled orders
            if (isAdmin) {
                data = data.filter(order => order.status !== "completed" && order.status !== "cancelled");
            }

            setOrders(data);
            setLoading(false);

            // Fetch unread counts
            data.forEach(async (order) => {
                const res = await fetch(`/api/chat?orderId=${order.id}`);
                const msgs = await res.json();
                const count = msgs.filter((m: any) => m.senderPhone !== phone && !m.isRead).length;
                setUnreadCounts(prev => ({ ...prev, [order.id]: count }));
            });
        }

        fetchOrders();
        const interval = setInterval(fetchOrders, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleOrderClick = (order: Order) => {
        const phone = getCurrentUserPhone();
        if (order.sellerPhone === phone) {
            router.push(`/lkseller/orders/${order.id}?tab=chat`);
        } else {
            router.push(`/order/${order.id}?tab=chat`);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] flex justify-center font-sans transition-colors duration-300">
            <div className="w-full max-w-[375px] relative min-h-screen pb-[100px]">
                {/* Header - Unified Standard */}
                <header className="fixed top-0 w-full max-w-[375px] h-[102px] bg-[var(--bg-color)] border-b border-[var(--border-color)] z-[100] px-6 flex items-end pb-[12px] transition-colors duration-300">
                    <h1 className="text-[24px] font-bold text-[var(--text-primary)] leading-[120%] tracking-normal" style={{ fontFamily: 'var(--font-cera), sans-serif' }}>
                        Чаты
                    </h1>
                </header>

                <main className="pt-[124px] px-4 space-y-2">
                    {/* AI Assistant Chat - Pinned & Premium */}
                    <button
                        onClick={() => router.push("/aichat")}
                        className="w-full relative group overflow-hidden rounded-[28px] p-[1px] transition-transform active:scale-98 shadow-2xl"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-[#00E5FF] via-[#2979FF] to-[#FF0080] opacity-50 group-hover:opacity-100 transition-opacity animate-gradient-xy" />
                        <div className="relative w-full h-full bg-[var(--card-bg)] rounded-[27px] p-4 flex items-center gap-4 border border-[var(--border-color)] transition-colors duration-300">
                            <div className="w-[52px] h-[52px] rounded-full bg-gradient-to-br from-[#00E5FF] to-[#2979FF] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(var(--accent-cyan-rgb),0.5)]">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                                    <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
                                    <path d="M12 12L2 12" />
                                    <path d="M12 12L12 22" />
                                </svg>
                            </div>
                            <div className="flex-1 text-left">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-[17px] font-bold text-[var(--text-primary)] tracking-tight" style={{ fontFamily: 'var(--font-cera)' }}>ИИ Помощник</span>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-cyan)] animate-pulse" />
                                        <span className="text-[11px] text-[var(--accent-cyan)] font-bold uppercase tracking-wider" style={{ fontFamily: 'var(--font-cera)' }}>Online</span>
                                    </div>
                                </div>
                                <p className="text-[14px] text-[var(--text-secondary)] line-clamp-1 italic font-medium">
                                    Я могу помочь с любым вопросом...
                                </p>
                            </div>
                        </div>
                    </button>

                    {/* Order Chats List */}
                    {loading ? (
                        <div className="text-center py-10 text-[var(--text-secondary)]">Загрузка чатов...</div>
                    ) : orders.length === 0 ? (
                        <div className="text-center py-10 text-[var(--text-secondary)]">
                            Нет активных чатов по заказам
                        </div>
                    ) : (
                        orders.map((order) => {
                            const isSeller = order.sellerPhone === getCurrentUserPhone();
                            const otherName = isSeller ? (order.clientName || 'Клиент') : (order.sellerPhone === 'ADMIN' ? 'Твэлви' : (order.partnerName || 'Партнер'));
                            const orderIdStr = order.orderNumber ? `№${order.orderNumber}` : `№${order.id.slice(-4)}`;
                            
                            return (
                                <button
                                    key={order.id}
                                    onClick={() => handleOrderClick(order)}
                                    className="w-full bg-[var(--card-bg)] rounded-[28px] p-4 flex items-center gap-4 active:scale-98 transition-all border border-[var(--border-color)]"
                                >
                                    <div className="w-[52px] h-[52px] rounded-[18px] bg-[var(--nav-bg)] flex items-center justify-center shrink-0 text-[10px] font-bold text-[var(--text-secondary)] border border-[var(--border-color)] transition-colors duration-300">
                                        {order.orderNumber ? String(order.orderNumber).slice(-2) : 'ID'}
                                    </div>
                                    <div className="flex-1 text-left min-w-0">
                                        <div className="flex justify-between items-start mb-1 gap-2">
                                            <span className="text-[17px] font-bold text-[var(--text-primary)] line-clamp-1 flex-1 tracking-tight" style={{ fontFamily: 'var(--font-cera)' }}>{order.title}</span>
                                            <div className="flex flex-col items-end shrink-0 gap-1">
                                                <span className="text-[11px] text-[var(--text-secondary)] font-bold" style={{ fontFamily: 'var(--font-cera)' }}>
                                                    {formatDate(order.updatedAt || order.createdAt)}
                                                </span>
                                                {unreadCounts[order.id] > 0 && (
                                                    <div className="w-[20px] h-[20px] bg-[var(--accent-color)] rounded-full flex items-center justify-center shadow-[var(--accent-glow)] animate-pulse">
                                                        <span className="text-[11px] font-black text-white">{unreadCounts[order.id]}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-[14px] text-[var(--text-secondary)] line-clamp-1 font-medium italic">
                                            {otherName} • {orderIdStr}
                                        </p>
                                    </div>
                                </button>
                            );
                        })
                    )}
                </main>
            </div>
        </div>
    );
}

function formatDate(dateStr: string) {
    if (!dateStr) return "12:00"; // Fallback
    const date = new Date(dateStr);
    const now = new Date();
    
    // Check if valid date
    if (isNaN(date.getTime())) return "12:00";

    const isToday = date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    const isYesterday = date.getDate() === now.getDate() - 1 && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    
    if (isToday) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (isYesterday) {
        return "Вчера";
    }
    
    // For older dates, still useful to show date
    return date.toLocaleDateString([], { day: '2-digit', month: '2-digit' });
}
