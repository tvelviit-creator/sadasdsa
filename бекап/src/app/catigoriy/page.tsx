"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCategories, Category } from "@/utils/categories";
import { getActiveRole } from "@/utils/userData"
import { DefaultCategoryCover } from "@/components/DefaultCategoryCover";
import { getCategoryCover } from "@/components/CategoryCovers";

export default function CatigoriyPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [role, setRole] = useState<"client" | "seller">("client");
    const [services, setServices] = useState<any[]>([]);

    useEffect(() => {
        setCategories(getCategories());
        setRole(getActiveRole());
        // Load all services to count them per category
        const allServices = (typeof window !== "undefined") ? JSON.parse(localStorage.getItem("services") || "[]") : [];
        setServices(allServices);
    }, []);

    const isSeller = role === "seller";

    const getServicesCount = (catId: string) => {
        return services.filter(s => s.categoryId === catId).length;
    };

    // Helper to get category icon based on name
    const getCategoryIcon = (name: string) => {
        const n = name.toLowerCase();
        
        // 1. ПРИЛОЖЕНИЯ (Phone)
        if (n.includes('приложен') || n.includes('app')) {
            return (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="7" y="2" width="10" height="20" rx="2" />
                    <path d="M12 18h.01" />
                </svg>
            );
        }
        // 2. САЙТ (Browser)
        if (n.includes('сайт') || n.includes('веб') || n.includes('web')) {
            return (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="M3 10h18" />
                </svg>
            );
        }
        // 3. ИГРА (Gamepad)
        if (n.includes('игр') || n.includes('game')) {
            return (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="6" y1="12" x2="10" y2="12" />
                    <line x1="8" y1="10" x2="8" y2="14" />
                    <circle cx="15.5" cy="12.5" r=".5" fill="currentColor" />
                    <circle cx="18.5" cy="10.5" r=".5" fill="currentColor" />
                    <path d="M21 12c.5 0 1 .5 1 1v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4c0-.5.5-1 1-1h18z" />
                </svg>
            );
        }
        // 4. ДИЗАЙН (Brush/Checklist)
        if (n.includes('дизайн') || n.includes('design') || n.includes('ux')) {
            return (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                    <rect x="8" y="2" width="8" height="4" rx="1" />
                    <path d="M9 14l2 2 4-4" />
                </svg>
            );
        }
        // 5. AI / БОТЫ (Sparkles)
        if (n.includes('ai') || n.includes('ии') || n.includes('бот')) {
            return (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                    <path d="M19 3v4" />
                    <path d="M21 5h-4" />
                </svg>
            );
        }
        // 6. ПОДДЕРЖКА (Support/Console)
        return (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M8 12l2-2-2-2" />
                <path d="M12 14h4" />
            </svg>
        );
    };

    const handleBack = () => {
        if (isSeller) {
            router.push("/seller");
        } else {
            router.push("/client");
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] font-sans pb-32 flex justify-center overflow-x-hidden transition-colors duration-300">
            <div className="w-full max-w-[375px] flex flex-col relative">
                
                {/* Unified Header - Stylized SVG */}
                <header className="fixed top-0 w-full max-w-[375px] h-[97px] bg-[var(--bg-color)] z-50 transition-colors duration-300">
                    <svg width="375" height="97" viewBox="0 0 375 97" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                        <mask id="path-1-inside-1_1725_6563" fill="white">
                            <path d="M0 0H375V97H0V0Z"/>
                        </mask>
                        <path d="M0 0H375V97H0V0Z" fill="var(--bg-color)"/>
                        <path d="M375 97V96H0V97V98H375V97Z" fill="var(--border-color)" mask="url(#path-1-inside-1_1725_6563)"/>
                        
                        {/* Word "КАТЕГОРИИ" centered by translation */}
                        <g transform="translate(94.3, 0)">
                            <path d="M47.768 78H43.856L37.064 69.744V78H33.824V62.16H37.064V69.504L43.112 62.16H46.976L40.904 69.624L47.768 78ZM59.2946 70.944V78H56.3186V76.848C55.3906 77.808 54.1826 78.288 52.6946 78.288C51.4466 78.288 50.4466 77.96 49.6946 77.304C48.9586 76.648 48.5906 75.792 48.5906 74.736C48.5906 73.664 48.9906 72.824 49.7906 72.216C50.6066 71.592 51.7026 71.28 53.0786 71.28H56.0546V70.752C56.0546 70.08 55.8626 69.568 55.4786 69.216C55.1106 68.848 54.5666 68.664 53.8466 68.664C53.2546 68.664 52.7186 68.792 52.2386 69.048C51.7586 69.304 51.2466 69.72 50.7026 70.296L49.0226 68.304C50.3986 66.672 52.1266 65.856 54.2066 65.856C55.7746 65.856 57.0146 66.304 57.9266 67.2C58.8386 68.08 59.2946 69.328 59.2946 70.944ZM56.0546 73.56V73.416H53.5106C52.4066 73.416 51.8546 73.816 51.8546 74.616C51.8546 75.016 52.0066 75.336 52.3106 75.576C52.6306 75.8 53.0466 75.912 53.5586 75.912C54.2786 75.912 54.8706 75.696 55.3346 75.264C55.8146 74.816 56.0546 74.248 56.0546 73.56ZM64.5543 78V68.856H60.9063V66.12H71.4423V68.856H67.7703V78H64.5543ZM84.3014 73.152H75.9734C76.1654 73.904 76.5494 74.488 77.1254 74.904C77.7174 75.304 78.4454 75.504 79.3094 75.504C80.4774 75.504 81.5814 75.104 82.6214 74.304L83.9654 76.512C82.5414 77.696 80.9574 78.288 79.2134 78.288C77.3894 78.32 75.8374 77.728 74.5574 76.512C73.2934 75.28 72.6774 73.8 72.7094 72.072C72.6774 70.36 73.2774 68.888 74.5094 67.656C75.7414 66.424 77.2134 65.824 78.9254 65.856C80.5574 65.856 81.8934 66.384 82.9334 67.44C83.9894 68.496 84.5174 69.808 84.5174 71.376C84.5174 71.952 84.4454 72.544 84.3014 73.152ZM75.9734 70.872H81.3734C81.3574 70.152 81.1014 69.576 80.6054 69.144C80.1254 68.696 79.5254 68.472 78.8054 68.472C78.1174 68.472 77.5174 68.688 77.0054 69.12C76.4934 69.552 76.1494 70.136 75.9734 70.872ZM87.1175 78V66.12H95.8535V68.856H90.3335V78H87.1175ZM96.9204 72.048C96.8884 70.352 97.5044 68.888 98.7684 67.656C100.032 66.424 101.536 65.824 103.28 65.856C105.024 65.824 106.528 66.424 107.792 67.656C109.072 68.888 109.696 70.352 109.664 72.048C109.696 73.744 109.072 75.216 107.792 76.464C106.512 77.696 105 78.296 103.256 78.264C101.512 78.296 100.008 77.696 98.7444 76.464C97.4964 75.216 96.8884 73.744 96.9204 72.048ZM105.464 74.376C106.056 73.768 106.352 73 106.352 72.072C106.352 71.144 106.056 70.368 105.464 69.744C104.888 69.12 104.16 68.808 103.28 68.808C102.384 68.808 101.648 69.12 101.072 69.744C100.496 70.352 100.208 71.128 100.208 72.072C100.208 73 100.496 73.768 101.072 74.376C101.648 74.984 102.384 75.288 103.28 75.288C104.16 75.288 104.888 74.984 105.464 74.376ZM123.09 67.632C124.194 68.8 124.746 70.272 124.746 72.048C124.746 73.824 124.194 75.312 123.09 76.512C122.002 77.696 120.634 78.288 118.986 78.288C117.498 78.288 116.314 77.808 115.434 76.848V82.32H112.194V66.12H115.17V67.608C115.986 66.44 117.258 65.856 118.986 65.856C120.634 65.856 122.002 66.448 123.09 67.632ZM121.458 72.072C121.458 71.096 121.17 70.304 120.594 69.696C120.018 69.088 119.282 68.784 118.386 68.784C117.522 68.784 116.802 69.072 116.226 69.648C115.666 70.224 115.386 71.024 115.386 72.048C115.386 73.072 115.666 73.88 116.226 74.472C116.802 75.048 117.522 75.336 118.386 75.336C119.266 75.336 119.994 75.032 120.57 74.424C121.162 73.816 121.458 73.032 121.458 72.072ZM137.224 65.856H138.28V78H135.04V71.568L128.416 78.288H127.36V66.12H130.576V72.6L137.224 65.856ZM151.497 65.856H152.553V78H149.313V71.568L142.689 78.288H141.633V66.12H144.849V72.6L151.497 65.856Z" fill="var(--text-primary)"/>
                        </g>
                    </svg>
                    
                    {/* Back Button */}
                    <button
                        onClick={handleBack}
                        className="absolute left-6 bottom-[18px] flex items-center justify-center active:scale-90 transition-all text-[var(--text-primary)]"
                    >
                        <svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22 9L0 9M0 9L9.4286 18M0 9L9.4286 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </header>

                {isSeller ? (
                    /* Partner View - List */
                    <main className="pt-[121px] px-6 pb-20">
                        <div className="flex flex-col gap-4">
                            {categories.map((cat) => (
                                <div
                                    key={cat.id}
                                    onClick={() => router.push(`/catigoriy/${cat.id}`)}
                                    className="w-full h-[88px] bg-[var(--card-bg)] rounded-[24px] px-4 flex items-center cursor-pointer active:scale-[0.98] transition-all border border-[var(--border-color)] transition-colors duration-300"
                                >
                                    {/* Icon Container (56x56) */}
                                    <div className="w-[56px] h-[56px] bg-[var(--border-color)] rounded-[8px] flex items-center justify-center text-[var(--text-primary)] transition-colors duration-300">
                                        {getCategoryIcon(cat.name)}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 ml-4 flex flex-col justify-center">
                                        <h2 className="text-[16px] font-bold text-[var(--text-primary)] leading-tight transition-colors duration-300" style={{ fontFamily: 'var(--font-cera)' }}>
                                            {cat.name}
                                        </h2>
                                        
                                        <div className="flex items-center mt-2">
                                            <span className="text-[13px] font-medium text-[var(--text-secondary)] transition-colors duration-300" style={{ fontFamily: 'var(--font-cera)' }}>
                                                Услуг
                                            </span>
                                            <div className="flex-1 border-b border-dashed border-[var(--border-color)] mx-3 mb-1 transition-colors duration-300" />
                                            <span className="text-[14px] font-bold text-[var(--text-primary)] tabular-nums transition-colors duration-300" style={{ fontFamily: 'var(--font-cera)' }}>
                                                {getServicesCount(cat.id)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </main>
                ) : (
                    /* Client View - Grid */
                    <main className="pt-[134px] px-[24px] pb-20">
                        <div className="grid grid-cols-2 gap-[16px]">
                            {categories.map((cat) => (
                                <div
                                    key={cat.id}
                                    onClick={() => router.push(`/catigoriy/${cat.id}`)}
                                    className="w-[155px] h-[155px] bg-[var(--card-bg)] rounded-[24px] relative overflow-hidden active:scale-[0.98] transition-all cursor-pointer border border-[var(--border-color)] transition-colors duration-300"
                                >
                                    {/* Cover Background */}
                                    {cat.coverImage ? (
                                        <img src={cat.coverImage} className="absolute inset-0 w-full h-full object-cover z-0" alt="" />
                                    ) : (
                                        <div className="absolute inset-0 z-0">
                                            {getCategoryCover(cat.name, "w-full h-full") || <DefaultCategoryCover className="w-full h-full opacity-60" />}
                                        </div>
                                    )}

                                    {/* Card Content Overlay */}
                                    <div className="absolute inset-0 z-10 p-[16px] flex flex-col justify-between">
                                        {!getCategoryCover(cat.name) && (
                                            <span className="text-[16px] font-bold leading-[1.2] text-[var(--text-primary)] line-clamp-2 drop-shadow-lg transition-colors duration-300">
                                                {cat.name}
                                            </span>
                                        )}
                                    </div>
                                    
                                    {/* Subtle Gradient for better text legibility */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-transparent z-[5]" />
                                </div>
                            ))}
                        </div>
                    </main>
                )}

                {categories.length === 0 && (
                    <div className="py-20 text-center text-[var(--text-secondary)] text-[13px] font-bold opacity-30 uppercase tracking-widest transition-colors duration-300">
                        Нет данных
                    </div>
                )}
            </div>
        </div>
    );
}
