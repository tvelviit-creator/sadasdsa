"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getServices } from "@/utils/services";
import { getCurrentUserPhone, getActiveRole } from "@/utils/userData";
import { BarChart3, TrendingUp, Users, ShoppingBag, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export default function AnalyticsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const role = getActiveRole();
        if (role !== 'seller') {
            router.push('/client');
            return;
        }
        setLoading(false);
    }, [router]);

    if (loading) return null;

    const stats = [
        { label: "Просмотры", value: "2.4K", change: "+12%", color: "var(--accent-cyan)", icon: Users },
        { label: "Заказы", value: "48", change: "+5%", color: "#4AC99B", icon: ShoppingBag },
        { label: "Доход", value: "124,500 ₽", change: "+18%", color: "#FFC700", icon: TrendingUp },
    ];

    return (
        <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] font-sans">
            <div className="w-full px-6 py-10 max-w-[1200px] mx-auto">
                <header className="mb-12 border-b border-[var(--border-color)] pb-6 flex items-end justify-between">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-3xl font-black font-cera uppercase tracking-tight flex items-center gap-4">
                            <div className="w-2 h-8 bg-[var(--accent-cyan)] rounded-full" />
                            Аналитика
                        </h1>
                        <p className="text-[12px] text-[var(--text-secondary)] opacity-60 uppercase tracking-[0.2em] font-semibold">
                            Обзор вашей деятельности за месяц
                        </p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {stats.map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-[32px] p-8 flex flex-col gap-4 relative overflow-hidden group hover:border-[var(--accent-cyan)]/30 transition-all duration-300"
                            >
                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Icon className="w-24 h-24" />
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-[var(--nav-bg)] flex items-center justify-center border border-[var(--border-color)]">
                                        <Icon className="w-5 h-5 opacity-60" style={{ color: stat.color }} />
                                    </div>
                                    <span className="text-[14px] font-bold text-[var(--text-secondary)] opacity-60 uppercase tracking-widest">{stat.label}</span>
                                </div>
                                <div className="flex items-baseline gap-4 mt-2">
                                    <span className="text-4xl font-black font-cera">{stat.value}</span>
                                    <span className="text-[14px] font-black text-[#4AC99B]" style={{ color: stat.change.startsWith('+') ? '#4AC99B' : '#FF8C67' }}>
                                        {stat.change}
                                    </span>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-[40px] p-12 flex flex-col items-center justify-center text-center gap-6 min-h-[400px]">
                    <div className="w-20 h-20 rounded-3xl bg-[var(--nav-bg)] flex items-center justify-center mb-4 border border-[var(--border-color)]">
                        <BarChart3 className="w-10 h-10 text-[var(--text-secondary)] opacity-20" />
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-widest font-cera opacity-80">Детализация временно недоступна</h2>
                    <p className="text-[var(--text-secondary)] text-sm max-w-sm opacity-60 font-medium leading-relaxed">
                        Мы собираем данные о ваших продажах и активности пользователей. Подробный график будет доступен после завершения первого заказа.
                    </p>
                </div>
            </div>
        </div>
    );
}
