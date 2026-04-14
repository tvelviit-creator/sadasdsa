"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getServices, Service } from "@/utils/services";
import { getCategories, Category } from "@/utils/categories";
import { getActiveRole } from "@/utils/userData";

export default function ServicesPage() {
    const router = useRouter();
    const params = useParams();
    const categoryId = params.id as string;

    const [services, setServices] = useState<Service[]>([]);
    const [category, setCategory] = useState<Category | null>(null);
    const [role, setRole] = useState<"client" | "seller">("client");

    const isSeller = role === "seller";

    useEffect(() => {
        async function loadData() {
            setRole(getActiveRole());
            const [cats, loadedServices] = await Promise.all([
                getCategories(),
                getServices(categoryId)
            ]);
            const currentCat = cats.find(c => c.id === categoryId);
            setCategory(currentCat || null);
            setServices(loadedServices);
        }
        loadData();
    }, [categoryId]);

    const patternColors = [
        "border-teal-400/20",
        "border-pink-500/20",
        "border-purple-500/20",
        "border-blue-500/20",
        "border-orange-500/20",
    ];

    if (role === "seller") {
        return (
            <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] font-sans pb-32 flex justify-center transition-colors duration-300">
                <div className="w-full max-w-[375px] relative min-h-screen">
                    {/* Seller Header - SVG Design Without Title */}
                    <header className="fixed top-0 w-full max-w-[375px] h-[97px] bg-[var(--bg-color)] z-50 transition-colors duration-300">
                        <svg width="375" height="97" viewBox="0 0 375 97" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                            <mask id="path-1-inside-1_1725_6563" fill="white">
                                <path d="M0 0H375V97H0V0Z"/>
                            </mask>
                            <path d="M0 0H375V97H0V0Z" fill="var(--bg-color)"/>
                            <path d="M375 97V96H0V97V98H375V97Z" fill="var(--border-color)" mask="url(#path-1-inside-1_1725_6563)"/>
                        </svg>
                        
                        <button
                            onClick={() => router.back()}
                            className="absolute left-6 bottom-[18px] flex items-center justify-center active:scale-90 transition-all text-[var(--text-primary)]"
                        >
                            <svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22 9L0 9M0 9L9.4286 18M0 9L9.4286 0" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>

                        <button
                            onClick={() => router.push(`/catigoriy/${categoryId}/add`)}
                            className="bg-[var(--text-primary)] w-[80px] h-[32px] rounded-full flex items-center justify-center active:scale-95 transition-all absolute right-6 bottom-[11px]"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--bg-color)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 5v14M5 12h14" />
                            </svg>
                        </button>
                    </header>

                    <main className="pt-[140px] px-6 pb-8">
                        <div className="grid grid-cols-2 gap-x-[19px] gap-y-10">
                            {services.map((service, index) => (
                                <div
                                    key={service.id}
                                    className="flex flex-col cursor-pointer active:scale-[0.98] transition-all group"
                                    onClick={() => router.push(`/tarif?id=${service.id}`)}
                                >
                                    {/* Seller Card Design */}
                                    <div className="relative w-full aspect-[153.5/159] rounded-[23.5px] overflow-hidden bg-[var(--card-bg)] mb-4 border border-[var(--border-color)] shadow-xl transition-colors duration-300">
                                        {/* Concentric Pattern Background (keeping current since SVG suggests a pattern) */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                                <div
                                                    key={i}
                                                    className={`absolute rounded-[32px] border ${patternColors[index % patternColors.length]} opacity-30`}
                                                    style={{
                                                        width: `${60 + i * 25}%`,
                                                        height: `${60 + i * 25}%`,
                                                        borderWidth: '1px'
                                                    }}
                                                />
                                            ))}
                                        </div>

                                        {/* Image / Placeholder */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            {service.coverImage ? (
                                                <img
                                                    src={service.coverImage}
                                                    alt={service.name}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="w-[80%] h-[90%] bg-gradient-to-b from-white/10 to-transparent rounded-[20px] border border-white/10 shadow-2xl relative overflow-hidden">
                                                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-white/20 rounded-full" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Partner Badge */}
                                        {(service.id === 'foodtech' || !!service.partnerName) && (
                                            <div className="absolute top-2.5 right-2.5 h-[24px] min-w-[76px] px-3 bg-[var(--bg-color)] flex items-center justify-center rounded-full transition-colors duration-300 shadow-sm border border-[var(--border-color)]">
                                                <span className="text-[11px] font-medium text-[var(--text-primary)] whitespace-nowrap pt-[1px]">Партнер</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="px-1 space-y-1">
                                        <h3 className="tvelvi-h7 text-[var(--text-primary)] leading-tight tracking-tight transition-colors duration-300">
                                            {service.name}
                                        </h3>
                                        <p className="text-[var(--text-secondary)] tvelvi-s transition-colors duration-300">
                                            от {Number(service.price).toLocaleString()} ₽
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {services.length === 0 && (
                            <div className="text-center py-20 text-[var(--text-secondary)] tvelvi-m transition-colors duration-300">
                                В этой категории пока нет услуг
                            </div>
                        )}
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] font-sans pb-32 flex justify-center overflow-x-hidden transition-colors duration-300">
            <div className="w-full max-w-[375px] relative min-h-screen flex flex-col">
                {/* Client Header - SVG Design Without Title */}
                <header className="fixed top-0 w-full max-w-[375px] h-[97px] bg-[var(--bg-color)] z-50 transition-colors duration-300">
                    <svg width="375" height="97" viewBox="0 0 375 97" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                        <mask id="path-1-inside-1_1725_6563" fill="white">
                            <path d="M0 0H375V97H0V0Z"/>
                        </mask>
                        <path d="M0 0H375V97H0V0Z" fill="var(--bg-color)"/>
                        <path d="M375 97V96H0V97V98H375V97Z" fill="var(--border-color)" mask="url(#path-1-inside-1_1725_6563)"/>
                    </svg>
                    
                    <button
                        onClick={() => router.back()}
                        className="absolute left-6 bottom-[18px] flex items-center justify-center active:scale-90 transition-all text-[var(--text-primary)]"
                    >
                        <svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22 9L0 9M0 9L9.4286 18M0 9L9.4286 0" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </header>

                <main className="pt-[140px] px-6 pb-8">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-8">
                        {services.map((service, index) => (
                            <div
                                key={service.id}
                                className="flex flex-col cursor-pointer active:scale-[0.98] transition-all group"
                                onClick={() => router.push(`/tarif?id=${service.id}`)}
                            >
                                {/* Card Image Area */}
                                <div className="relative aspect-[1/1] rounded-[28px] overflow-hidden bg-[var(--card-bg)] mb-3 border border-[var(--border-color)] shadow-xl transition-colors duration-300">
                                    {/* Concentric Pattern Background */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                                            <div
                                                key={i}
                                                className={`absolute rounded-[32px] border ${patternColors[index % patternColors.length]} opacity-40`}
                                                style={{
                                                    width: `${60 + i * 20}%`,
                                                    height: `${60 + i * 20}%`,
                                                    borderWidth: '1px'
                                                }}
                                            />
                                        ))}
                                    </div>

                                    {/* Image / Placeholder */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-full h-full relative">
                                            {service.coverImage ? (
                                                <img
                                                    src={service.coverImage}
                                                    alt={service.name}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <div className="w-[80%] h-[90%] bg-gradient-to-b from-white/10 to-transparent rounded-[20px] border border-white/10 shadow-2xl relative overflow-hidden">
                                                        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-white/20 rounded-full" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Partner Badge */}
                                        {(service.id === 'foodtech' || !!service.partnerName) && (
                                            <div className="absolute top-2.5 right-2.5 h-[24px] min-w-[76px] px-3 bg-[var(--bg-color)] flex items-center justify-center rounded-full transition-colors duration-300 shadow-sm border border-[var(--border-color)]">
                                                <span className="text-[11px] font-medium text-[var(--text-primary)] whitespace-nowrap pt-[1px]">Партнер</span>
                                            </div>
                                        )}
                                    </div>

                                </div>

                                {/* Info */}
                                <div className="px-1 space-y-0.5">
                                    <h3 className="tvelvi-h7 text-[var(--text-primary)] leading-tight tracking-tight transition-colors duration-300">
                                        {service.name}
                                    </h3>
                                    <p className="text-[var(--text-secondary)] tvelvi-s transition-colors duration-300">
                                        от {Number(service.price).toLocaleString()} ₽
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {services.length === 0 && (
                        <div className="text-center py-20 text-[var(--text-secondary)] transition-colors duration-300">
                            В этой категории пока нет услуг
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
