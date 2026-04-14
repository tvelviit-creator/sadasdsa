"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCategories, Category } from "@/utils/categories";
import { getServices } from "@/utils/services";
import { getActiveRole } from "@/utils/userData"
import { DefaultCategoryCover } from "@/components/DefaultCategoryCover";
import { getCategoryCover } from "@/components/CategoryCovers";

export default function CatigoriyPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [role, setRole] = useState<"client" | "seller">("client");
    const [services, setServices] = useState<any[]>([]);

    useEffect(() => {
        async function load() {
            const [cats, allServices] = await Promise.all([
                getCategories(),
                getServices()
            ]);
            setCategories(cats);
            setRole(getActiveRole());
            setServices(allServices);
        }
        load();
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
                <header className="fixed top-0 w-full max-w-[375px] h-[102px] z-50 transition-colors duration-300">
                    <svg width="375" height="102" viewBox="0 0 375 102" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                        <mask id="path-1-inside-1_1919_16665" fill="white">
                            <path d="M0 0H375V102H0V0Z"/>
                        </mask>
                        <path d="M0 0H375V102H0V0Z" fill="var(--bg-color)"/>
                        <path d="M375 102V101H0V102V103H375V102Z" fill="var(--border-color)" mask="url(#path-1-inside-1_1919_16665)"/>
                        
                        {/* Back Button Group */}
                        <g 
                            onClick={handleBack}
                            className="cursor-pointer active:opacity-50 transition-opacity pointer-events-auto"
                            style={{ pointerEvents: 'all' }}
                        >
                            <rect x="20" y="55" width="40" height="40" fill="transparent" />
                            <path d="M51 72L29 72M29 72L38.4286 81M29 72L38.4286 63" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </g>

                        <path d="M138.243 80L131.451 71.744V80H128.211V64.16H131.451V71.504L137.499 64.16H141.363L135.291 71.624L142.155 80H138.243ZM148.593 67.856C150.145 67.856 151.377 68.296 152.289 69.176C153.217 70.04 153.681 71.296 153.681 72.944V80H150.705V78.848C150.273 79.296 149.745 79.648 149.121 79.904C148.513 80.16 147.833 80.288 147.081 80.288C145.817 80.288 144.817 79.96 144.081 79.304C143.345 78.632 142.977 77.776 142.977 76.736C142.977 75.664 143.377 74.824 144.177 74.216C144.993 73.592 146.089 73.28 147.465 73.28H150.441V72.752C150.441 72.096 150.249 71.584 149.865 71.216C149.497 70.848 148.953 70.664 148.233 70.664C147.625 70.664 147.081 70.8 146.601 71.072C146.121 71.328 145.617 71.736 145.089 72.296L143.409 70.304C144.785 68.672 146.513 67.856 148.593 67.856ZM147.945 77.912C148.649 77.912 149.241 77.696 149.721 77.264C150.201 76.816 150.441 76.248 150.441 75.56V75.416H147.897C147.369 75.416 146.961 75.52 146.673 75.728C146.385 75.92 146.241 76.216 146.241 76.616C146.241 77.016 146.393 77.336 146.697 77.576C147.017 77.8 147.433 77.912 147.945 77.912ZM158.941 70.856H155.293V68.12H165.829V70.856H162.157V80H158.941V70.856ZM178.688 75.152H170.36C170.552 75.904 170.936 76.488 171.512 76.904C172.104 77.304 172.832 77.504 173.696 77.504C174.864 77.504 175.968 77.104 177.008 76.304L178.352 78.512C176.944 79.696 175.36 80.288 173.6 80.288C172.368 80.288 171.256 80.016 170.264 79.472C169.272 78.928 168.496 78.184 167.936 77.24C167.376 76.28 167.096 75.224 167.096 74.072C167.096 72.92 167.368 71.872 167.912 70.928C168.456 69.968 169.2 69.216 170.144 68.672C171.104 68.128 172.16 67.856 173.312 67.856C174.4 67.856 175.368 68.104 176.216 68.6C177.064 69.08 177.72 69.744 178.184 70.592C178.664 71.424 178.904 72.352 178.904 73.376C178.904 73.952 178.832 74.544 178.688 75.152ZM173.192 70.472C172.504 70.472 171.904 70.688 171.392 71.12C170.88 71.552 170.536 72.136 170.36 72.872H175.76C175.744 72.136 175.488 71.552 174.992 71.12C174.496 70.688 173.896 70.472 173.192 70.472ZM181.504 68.12H190.24V70.856H184.72V80H181.504V68.12ZM197.643 80.264C196.475 80.264 195.403 79.992 194.427 79.448C193.467 78.888 192.707 78.136 192.147 77.192C191.587 76.232 191.307 75.184 191.307 74.048C191.307 72.912 191.587 71.872 192.147 70.928C192.707 69.968 193.475 69.216 194.451 68.672C195.427 68.128 196.499 67.856 197.667 67.856C198.835 67.856 199.907 68.136 200.883 68.696C201.859 69.24 202.627 69.984 203.187 70.928C203.763 71.872 204.051 72.912 204.051 74.048C204.051 75.184 203.763 76.232 203.187 77.192C202.627 78.136 201.851 78.888 200.859 79.448C199.883 79.992 198.811 80.264 197.643 80.264ZM197.667 77.288C198.547 77.288 199.275 76.984 199.851 76.376C200.443 75.768 200.739 75 200.739 74.072C200.739 73.144 200.443 72.368 199.851 71.744C199.275 71.12 198.547 70.808 197.667 70.808C196.771 70.808 196.035 71.12 195.459 71.744C194.883 72.352 194.595 73.128 194.595 74.072C194.595 75 194.883 75.768 195.459 76.376C196.035 76.984 196.771 77.288 197.667 77.288ZM213.373 67.856C214.477 67.856 215.461 68.128 216.325 68.672C217.205 69.2 217.893 69.936 218.389 70.88C218.885 71.808 219.133 72.864 219.133 74.048C219.133 75.232 218.885 76.296 218.389 77.24C217.893 78.184 217.205 78.928 216.325 79.472C215.461 80.016 214.477 80.288 213.373 80.288C212.653 80.288 211.989 80.168 211.381 79.928C210.773 79.672 210.253 79.312 209.821 78.848V84.32H206.581V68.12H209.557V69.608C209.957 69.048 210.485 68.616 211.141 68.312C211.813 68.008 212.557 67.856 213.373 67.856ZM212.773 77.336C213.637 77.336 214.365 77.04 214.957 76.448C215.549 75.84 215.845 75.048 215.845 74.072C215.845 73.08 215.549 72.288 214.957 71.696C214.381 71.088 213.653 70.784 212.773 70.784C211.957 70.784 211.253 71.064 210.661 71.624C210.069 72.168 209.773 72.976 209.773 74.048C209.773 75.104 210.061 75.92 210.637 76.496C211.229 77.056 211.941 77.336 212.773 77.336ZM232.666 67.856V80H229.426V73.568L222.802 80.288H221.746V68.12H224.962V74.6L231.61 67.856H232.666ZM246.94 67.856V80H243.7V73.568L237.076 80.288H236.02V68.12H239.236V74.6L245.884 67.856H246.94Z" fill="var(--text-primary)"/>
                    </svg>
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
