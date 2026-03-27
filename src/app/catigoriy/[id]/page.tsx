"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getServices, Service, deleteService } from "@/utils/services";
import { getCategories, Category } from "@/utils/categories";
import { getActiveRole, getUserData, getCurrentUserPhone } from "@/utils/userData";
import { motion } from "framer-motion";
import { Edit2, Trash2, Plus, ArrowUpRight } from "lucide-react";

export default function ServicesPage() {
    const router = useRouter();
    const params = useParams();
    const categoryId = params.id as string;

    const [services, setServices] = useState<Service[]>([]);
    const [category, setCategory] = useState<Category | null>(null);
    const [role, setRole] = useState<"client" | "seller">("client");
    const [currentUserPhone, setCurrentUserPhone] = useState<string | null>(null);

    const isSeller = role === "seller";

    useEffect(() => {
        setRole(getActiveRole());
        setCurrentUserPhone(getCurrentUserPhone());
        const cats = getCategories();
        const currentCat = cats.find(c => c.id === categoryId);
        setCategory(currentCat || null);

        const loadedServices = getServices(categoryId);
        setServices(loadedServices);
    }, [categoryId]);

    const handleDelete = (id: string) => {
        if (confirm("Вы уверены, что хотите удалить эту услугу?")) {
            deleteService(id);
            setServices(getServices(categoryId));
        }
    };

    const patternColors = [
        "border-teal-400/20",
        "border-pink-500/20",
        "border-purple-500/20",
        "border-blue-500/20",
        "border-orange-500/20",
    ];

    return (
        <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] font-sans transition-colors duration-300 pb-32">
            
            {/* PC VERSION - Ultra-Minimalist Architectural Layout */}
            <div className="hidden md:flex flex-col w-full min-h-screen relative z-10 overflow-hidden bg-[var(--bg-color)]">
                <div className="max-w-[1400px] mx-auto w-full px-12 pt-20 pb-32 flex flex-col items-start">
                    
                    {/* Header - Matching settings style */}
                    <header className="flex flex-col mb-16 shrink-0">
                        <h1 className="text-4xl md:text-5xl font-black font-cera text-[var(--text-primary)] tracking-tight leading-none uppercase">
                            {category?.name || "КАТАЛОГ"}<br/>
                            <span className="text-[var(--text-secondary)] opacity-70">Услуг</span>
                        </h1>
                    </header>

                    {/* Content Section */}
                    <div className="w-full">
                        <div className="flex items-center justify-between mb-12 pb-4 border-b border-[var(--border-color)]/20">
                            <h2 className="text-[12px] font-black uppercase tracking-[0.4em] opacity-60">
                                {services.length} ПОЗИЦИЙ
                            </h2>
                            {role === "seller" && (
                                <button
                                    onClick={() => router.push(`/catigoriy/${categoryId}/add`)}
                                    className="bg-[var(--text-primary)] text-[var(--bg-color)] h-[56px] px-10 rounded-[20px] flex items-center justify-center font-black tracking-widest uppercase transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] active:scale-95"
                                >
                                    <Plus className="mr-3 w-5 h-5 stroke-[3]" />
                                    Добавить
                                </button>
                            )}
                        </div>

                        {services.length === 0 ? (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="relative w-full h-[500px] flex flex-col items-center justify-center overflow-hidden border border-[var(--border-color)]/10 rounded-[48px] bg-[var(--card-bg)]/5 group/empty"
                            >
                                {/* Minimalist Central Content */}
                                <div className="relative z-10 flex flex-col items-center">
                                    <div className="w-12 h-[1px] bg-[var(--text-primary)] mb-8 opacity-40 group-hover:w-24 transition-all duration-700 ease-out" />
                                    
                                    <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-[var(--text-secondary)] mb-4 opacity-60">
                                        КАТЕГОРИЯ: <span className="text-[var(--text-primary)] opacity-100 uppercase">{category?.name || "КАТЕГОРИЯ"}</span>
                                    </h2>
                                    
                                    <h3 className="text-3xl md:text-4xl font-black font-cera text-[var(--text-primary)] mb-8 tracking-tight uppercase text-center leading-tight">
                                        УСЛУГИ В ДАННОМ<br/>
                                        <span className="text-[var(--text-secondary)] opacity-70">РАЗДЕЛЕ ПОКА</span><br/>
                                        ОТСУТСТВУЮТ
                                    </h3>
                                    
                                    {role === "seller" && (
                                        <button 
                                            onClick={() => router.push(`/catigoriy/${categoryId}/add`)}
                                            className="h-12 px-8 rounded-full bg-[var(--text-primary)] text-[var(--bg-color)] text-[11px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl"
                                        >
                                            ДОБАВИТЬ ПЕРВУЮ УСЛУГУ
                                        </button>
                                    )}
                                    
                                    <div className="w-12 h-[1px] bg-[var(--text-primary)] mt-8 opacity-20 group-hover:w-6 transition-all duration-700 ease-out" />
                                </div>
                                
                                {/* Edge Accents */}
                                <div className="absolute top-8 left-8 w-4 h-4 border-t border-l border-[var(--border-color)]/20" />
                                <div className="absolute bottom-8 right-8 w-4 h-4 border-b border-r border-[var(--border-color)]/20" />
                            </motion.div>
                        ) : (
                            <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-6 gap-x-4 gap-y-10">
                                {services.map((service, index) => (
                                    <motion.div
                                        key={service.id}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.03, duration: 0.5, ease: "easeOut" }}
                                        className="group flex flex-col cursor-pointer transition-all duration-300"
                                        onClick={() => router.push(`/tarif?id=${service.id}`)}
                                    >
                                        {/* Image Card - Vertical Focus */}
                                        <div className="w-full aspect-[3/4.2] bg-[var(--card-bg)] rounded-[20px] relative overflow-hidden mb-3 transition-all duration-500 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)]">
                                            {service.coverImage ? (
                                                <img src={service.coverImage} alt={service.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                                            ) : (
                                                <div className="w-full h-full bg-[var(--nav-bg)] flex items-center justify-center">
                                                    <span className="text-xl opacity-5 font-black tracking-widest uppercase text-[var(--text-primary)]">TVELV</span>
                                                </div>
                                            )}
                                            
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            
                                            {/* Partner Badge - Restored to original style */}
                                            {!!service.partnerName && (
                                                <div className="absolute top-3 right-3 h-[24px] min-w-[76px] px-3 bg-[var(--bg-color)] flex items-center justify-center rounded-full transition-colors duration-300 shadow-sm border border-[var(--border-color)] z-20">
                                                    <span className="text-[11px] font-medium text-[var(--text-primary)] whitespace-nowrap pt-[1px]">Партнер</span>
                                                </div>
                                            )}
                                            
                                            {/* Actions Overlay */}
                                            <div className="absolute top-3 right-3 z-10 opacity-40 group-hover:opacity-100 transition-all duration-300 flex flex-col gap-2">
                                                {((role === "seller" && service.sellerPhone === currentUserPhone) || currentUserPhone === "79999999999") ? (
                                                    <>
                                                        <div 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                router.push(`/catigoriy/${service.categoryId}/add?edit=${service.id}`);
                                                            }}
                                                            className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:bg-[var(--accent-cyan)] transition-colors cursor-pointer shadow-lg"
                                                        >
                                                            <Edit2 className="w-3.5 h-3.5" />
                                                        </div>
                                                        <div 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDelete(service.id);
                                                            }}
                                                            className="w-8 h-8 rounded-full bg-white text-red-600 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors cursor-pointer shadow-lg"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </div>
                                                    </>
                                                ) : (
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                                                )}
                                            </div>
                                        </div>

                                        {/* Content Info - WB STYLE */}
                                        <div className="flex flex-col px-1 overflow-hidden">
                                            {/* Brand & Name */}
                                            <div className="flex flex-col mb-1.5">
                                                {(() => {
                                                    const isAdmin = service.sellerPhone === "79999999999" || !service.sellerPhone || service.partnerName === "OFFICIAL" || !service.partnerName;
                                                    const name = isAdmin ? "TVELV OFFICIAL" : (service.partnerName || "OFFICIAL");
                                                    
                                                    return (
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-tight opacity-70">
                                                                {name}
                                                            </span>
                                                            <span className="text-[16px] text-[var(--text-primary)] line-clamp-2 font-bold opacity-90 leading-tight">
                                                                {service.name}
                                                            </span>
                                                        </div>
                                                    );
                                                })()}
                                            </div>

                                            {/* Price Section */}
                                            <div className="flex items-end gap-1.5 flex-wrap">
                                                <span className="text-[15px] font-black text-[var(--text-primary)] font-cera leading-none whitespace-nowrap">
                                                    {Number(service.price).toLocaleString()} ₽
                                                </span>
                                                <span className="text-[10px] text-[var(--text-secondary)] line-through opacity-40 font-bold mb-[2px] whitespace-nowrap">
                                                    {Math.round(Number(service.price) * 1.2).toLocaleString()} ₽
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* PHONE VERSION - Premium Mobile Layout */}
            <div className="md:hidden w-full flex flex-col relative items-center pb-32 bg-[var(--bg-color)]">
                <div className="fixed inset-0 z-[0] pointer-events-none opacity-[0.05] dark:opacity-[0.03]" style={{ backgroundImage: `radial-gradient(var(--text-primary) 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
                <div className="fixed top-[-10%] right-[-10%] w-[60%] h-[60%] bg-[var(--accent-cyan)]/5 blur-[100px] rounded-full pointer-events-none z-[0]" />
                <div className="fixed bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-500/5 blur-[100px] rounded-full pointer-events-none z-[0]" />
                <header className="fixed top-0 w-full max-w-[375px] h-[97px] bg-[var(--bg-color)]/60 backdrop-blur-3xl z-50 transition-colors duration-300 border-b border-[var(--border-color)]/10">
                    <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[var(--text-primary)]/10 to-transparent" />
                    <svg width="375" height="97" viewBox="0 0 375 97" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full relative z-10">
                        <mask id="path-1-inside-1_1725_6563" fill="white">
                            <path d="M0 0H375V97H0V0Z"/>
                        </mask>
                        <path d="M0 0H375V97H0V0Z" fill="transparent"/>
                        <path d="M375 97V96H0V97V98H375V97Z" fill="var(--border-color)" mask="url(#path-1-inside-1_1725_6563)"/>
                    </svg>
                    <button onClick={() => router.back()} className="absolute left-6 bottom-[18px] flex items-center justify-center active:scale-90 transition-all text-[var(--text-primary)] z-20">
                        <svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22 9L0 9M0 9L9.4286 18M0 9L9.4286 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                    {role === "seller" && (
                        <button onClick={() => router.push(`/catigoriy/${categoryId}/add`)} className="bg-[var(--text-primary)] w-[80px] h-[32px] rounded-full flex items-center justify-center active:scale-95 transition-all absolute right-6 bottom-[11px] z-20">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--bg-color)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 5v14M5 12h14" />
                            </svg>
                        </button>
                    )}
                </header>

                <main className="pt-[140px] px-6 w-full relative z-10">
                    {services.length === 0 ? (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-24 px-6 text-center space-y-8"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-[var(--accent-cyan)] opacity-10 blur-[40px] rounded-full animate-pulse" />
                                <div className="relative w-20 h-20 bg-[var(--card-bg)]/40 backdrop-blur-3xl rounded-[32px] flex items-center justify-center border border-[var(--border-color)]/20 shadow-2xl overflow-hidden">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 2L20.66 7V17L12 22L3.34 17V7L12 2Z" stroke="var(--accent-cyan)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M12 2V12L20.66 7M12 12L3.34 7M12 12L12 22" stroke="var(--accent-cyan)" strokeWidth="1" strokeOpacity="0.4" strokeLinecap="round" strokeLinejoin="round" />
                                        <circle cx="12" cy="12" r="2.5" stroke="var(--accent-cyan)" strokeWidth="1.2" strokeOpacity="0.3" />
                                    </svg>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-[16px] font-black uppercase tracking-[0.1em] text-[var(--text-primary)] font-cera leading-none">
                                    Услуг пока нет
                                </h2>
                                <p className="text-[12px] text-[var(--text-secondary)] max-w-[200px] mx-auto opacity-60 leading-relaxed font-medium">
                                    Категория «{category?.name}» пуста. <br/>Загляните к нам чуть позже.
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            {services.map((service, index) => (
                                <div key={service.id} className="flex flex-col cursor-pointer active:scale-[0.98] transition-all group" onClick={() => router.push(`/tarif?id=${service.id}`)}>
                                    <div className="relative aspect-[1/1] rounded-[28px] overflow-hidden bg-[var(--card-bg)]/40 backdrop-blur-md mb-3 border border-[var(--border-color)]/20 transition-all duration-300 shadow-xl dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
                                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--text-primary)]/10 to-transparent z-10" />
                                        <div className="absolute inset-0 flex items-center justify-center z-0">
                                            {service.coverImage ? (
                                                <img src={service.coverImage} alt={service.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <div className="w-[80%] h-[90%] bg-gradient-to-b from-[var(--text-primary)]/10 to-transparent rounded-[20px] border border-[var(--border-color)]/20 relative overflow-hidden">
                                                        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-[var(--text-primary)]/20 rounded-full" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        {(service.id === 'foodtech' || !!service.partnerName) && (
                                            <div className="absolute top-3 right-3 h-[24px] min-w-[76px] px-3 bg-[var(--bg-color)] flex items-center justify-center rounded-full transition-colors duration-300 shadow-sm border border-[var(--border-color)] z-20">
                                                <span className="text-[11px] font-medium text-[var(--text-primary)] whitespace-nowrap pt-[1px]">Партнер</span>
                                            </div>
                                        )}
                                        
                                        {/* Mobile Actions Overlay */}
                                        {((role === "seller" && service.sellerPhone === currentUserPhone) || currentUserPhone === "79999999999") && (
                                            <div className="absolute top-2.5 right-2.5 flex flex-col gap-2 z-20">
                                                <div 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        router.push(`/catigoriy/${service.categoryId}/add?edit=${service.id}`);
                                                    }}
                                                    className="w-9 h-9 rounded-full bg-[var(--text-primary)] text-[var(--bg-color)] flex items-center justify-center shadow-lg active:scale-90"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </div>
                                                <div 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(service.id);
                                                    }}
                                                    className="w-9 h-9 rounded-full bg-[var(--text-primary)] text-red-600 flex items-center justify-center shadow-lg active:scale-90"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="px-1 space-y-0.5">
                                        <h3 className="text-[14px] font-bold text-[var(--text-primary)] leading-tight transition-colors duration-300">
                                            {service.name}
                                        </h3>
                                        <p className="text-[var(--text-secondary)] text-[12px] font-bold uppercase tracking-wider">
                                            от {Number(service.price).toLocaleString()} ₽
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
