"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getActiveRole, getCurrentUserPhone, getUserData, setActiveRole, formatPhone, startRoleTransition } from "@/utils/userData";
import { Copy, Compass, Bell, MessageSquare, Briefcase, Settings, LogOut, Package, Moon, Sun, ChevronRight, RefreshCw, PlusSquare, BarChart3, LayoutGrid } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DesktopSidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const [activeRole, setActiveRoleState] = useState<string>("client");
    const [hasUnread, setHasUnread] = useState(false);
    const [userPhone, setUserPhone] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);
    const [userAvatar, setUserAvatar] = useState<string | null>(null);
    const [theme, setTheme] = useState<'day' | 'night' | 'auto'>('night');
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [transitionRole, setTransitionRole] = useState<'client' | 'seller' | null>(null);

    useEffect(() => {
        setMounted(true);
        setActiveRoleState(getActiveRole());
        const phone = getCurrentUserPhone();
        setUserPhone(phone);
        if (phone) {
            const data = getUserData(phone);
            if (data?.name) {
                setUserName(data.name);
            }
            if (data?.avatar) {
                setUserAvatar(data.avatar);
            }
        }

        // Load theme
        const savedTheme = localStorage.getItem('app-theme') as 'day' | 'night' | 'auto';
        if (savedTheme) {
            setTheme(savedTheme);
        } else {
            setTheme('night');
        }

        // Listen for theme changes
        const handleThemeChange = () => {
            const currentTheme = localStorage.getItem('app-theme') as 'day' | 'night' | 'auto';
            if (currentTheme) setTheme(currentTheme);
        };
        window.addEventListener('theme-change', handleThemeChange);
        
        // Listen for user data changes
        const handleUserChange = () => {
            const phone = getCurrentUserPhone();
            if (phone) {
                const data = getUserData(phone);
                setUserName(data?.name || null);
                setUserAvatar(data?.avatar || null);
            }
        };
        window.addEventListener('user-data-change', handleUserChange);

        if (!phone) return;

        const checkUnread = async () => {
            try {
                const res = await fetch(`/api/chat?checkUnread=true&phone=${encodeURIComponent(phone)}`);
                if (res.ok) {
                    const { count } = await res.json();
                    setHasUnread(count > 0);
                }
            } catch (e) {}
        };

        checkUnread();
        const interval = setInterval(checkUnread, 3000);
        return () => {
            clearInterval(interval);
            window.removeEventListener('theme-change', handleThemeChange);
            window.removeEventListener('user-data-change', handleUserChange);
        };
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'day' ? 'night' : 'day';
        setTheme(newTheme);
        localStorage.setItem('app-theme', newTheme);
        
        const root = document.documentElement;
        root.classList.remove('day-theme', 'night-theme');
        root.classList.add(`${newTheme}-theme`);
        
        window.dispatchEvent(new Event('theme-change'));
    };

    if (!mounted) return null;

    // Скрываем сайдбар на определенных страницах (например, лендинг)
    const hiddenRoutes = ["/", "/onboarding", "/registration", "/code", "/final", "/client-partner", "/admin"];
    const isHidden = hiddenRoutes.some(route => route === "/" ? pathname === "/" : pathname.startsWith(route)) || pathname.endsWith("/add");

    if (isHidden) return null;

    const navItems = [
        {
            path: activeRole === "seller" ? "/seller" : "/client",
            label: "Главная",
            icon: Compass
        },
        {
            path: "/chats",
            label: "Сообщения",
            icon: MessageSquare,
            badge: hasUnread
        },
        {
            path: "/order",
            label: "Заказы",
            icon: Package
        },
        {
            path: "/setting-new",
            label: "Настройки",
            icon: Settings
        }
    ];

    const adminNavItems = activeRole === "admin" ? [
        { path: "/admin", label: "Пользователи", icon: Briefcase },
        { path: "/admin/orders", label: "Все заказы", icon: Package },
        { path: "/admin/categories", label: "Категории", icon: Copy },
        { path: "/admin/settings", label: "Настройки", icon: Settings },
    ] : [];

    const handleRoleSwitch = () => {
        if (isTransitioning) return;
        const newRole = activeRole === "seller" ? "client" : "seller";
        setIsTransitioning(true);
        setTransitionRole(newRole);
        
        // Trigger global animation
        startRoleTransition(newRole);
        
        setTimeout(() => {
            setActiveRole(newRole);
            setActiveRoleState(newRole);
            router.push(newRole === "seller" ? "/seller" : "/client");
            
            setTimeout(() => {
                setIsTransitioning(false);
            }, 300);
        }, 1500);
    };

    return (
        <>
        <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="w-[280px] h-screen shrink-0 fixed left-0 top-0 hidden md:flex flex-col bg-[var(--bg-color)] border-r border-[var(--border-color)] overflow-hidden transition-all duration-500 z-40"
        >
            {/* Subtle Gradient Accent */}
            <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-[var(--accent-cyan)]/5 to-transparent pointer-events-none" />

            <div className="p-10 pb-4 flex-1 flex flex-col relative z-10">
                {/* Logo Section */}
                <div 
                    onClick={() => router.push(activeRole === "seller" ? "/seller" : activeRole === "admin" ? "/admin" : "/client")}
                    className="cursor-pointer mb-14 flex items-center gap-4 group"
                >
                    <div className="relative w-10 h-10 flex items-center justify-center">
                        <div className="absolute inset-0 bg-[var(--text-primary)] rounded-xl transition-transform duration-500 group-hover:rotate-12" />
                        <span className="relative z-10 text-[var(--bg-color)] font-black text-xl font-cera translate-y-[1px]">T</span>
                        <div className="absolute -inset-1 bg-[var(--accent-cyan)]/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    <div className="flex flex-col gap-0 leading-none">
                        <span className="text-2xl font-black tracking-tighter text-[var(--text-primary)] font-cera">TVELV</span>
                        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[var(--accent-cyan)] opacity-60">Система</span>
                    </div>
                </div>

                {/* Navigation Section */}
                <div className="flex flex-col gap-8">
                    {activeRole === 'admin' ? (
                        <div className="flex flex-col gap-2">
                             <div className="px-4 py-2 border border-[var(--accent-cyan)]/20 bg-[var(--accent-cyan)]/5 rounded-xl mb-4">
                                <span className="text-[10px] font-black text-[var(--accent-cyan)] uppercase tracking-widest">Панель управления</span>
                            </div>
                            {adminNavItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
                                return (
                                    <button
                                        key={item.path}
                                        onClick={() => router.push(item.path)}
                                        className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group
                                            ${isActive 
                                                ? 'text-[var(--text-primary)] bg-[var(--card-bg)] shadow-sm' 
                                                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                            }
                                        `}
                                    >
                                        <Icon className={`w-4 h-4 transition-all duration-300 ${isActive ? 'text-[var(--accent-color)] scale-110' : 'group-hover:scale-110'}`} />
                                        <span className={`text-[14px] font-bold tracking-tight ${isActive ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>{item.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col gap-1">
                            <h3 className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] px-4 mb-4 opacity-40">Основное меню</h3>
                            <nav className="flex flex-col gap-2">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));
                                    
                                    return (
                                        <button
                                            key={item.path}
                                            onClick={() => router.push(item.path)}
                                            className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative
                                                ${isActive 
                                                    ? 'bg-[var(--nav-bg)] text-[var(--text-primary)] border border-[var(--border-color)] shadow-sm' 
                                                    : 'text-[var(--text-secondary)] hover:bg-[var(--nav-bg)]/50 hover:text-[var(--text-primary)] border border-transparent'
                                                }
                                            `}
                                        >
                                            <div className="relative z-10 flex items-center justify-center">
                                                <Icon className={`w-5 h-5 transition-transform duration-500 ${isActive ? 'text-[var(--accent-cyan)]' : 'group-hover:scale-110 opacity-60'}`} />
                                                {item.badge && (
                                                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500" />
                                                )}
                                            </div>
                                            <span className={`text-[15px] font-bold tracking-tight relative z-10 ${isActive ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
                                                {item.label}
                                            </span>
                                        </button>
                                    );
                                })}

                                {activeRole === "seller" && (
                                    <div className="mt-8 flex flex-col gap-2">
                                        <div className="h-[1px] w-full bg-[var(--border-color)] mb-4 opacity-50" />
                                        <h3 className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] px-4 mb-3 opacity-40">Партнерская панель</h3>
                                        
                                        <button
                                            onClick={() => router.push("/my-services")}
                                            className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative
                                                ${pathname === '/my-services' ? 'bg-[var(--nav-bg)] text-[var(--text-primary)] border border-[var(--border-color)] shadow-sm' : 'text-[var(--text-secondary)] hover:bg-[var(--nav-bg)]/50 hover:text-[var(--text-primary)] border border-transparent'}
                                            `}
                                        >
                                            <LayoutGrid className={`w-5 h-5 relative z-10 ${pathname === '/my-services' ? 'text-[var(--accent-cyan)]' : 'group-hover:scale-110 opacity-60'}`} />
                                            <span className={`text-[15px] font-bold tracking-tight relative z-10 ${pathname === '/my-services' ? 'opacity-100' : 'opacity-60'}`}>Мои услуги</span>
                                        </button>

                                        <button
                                            onClick={() => router.push("/catigoriy")}
                                            className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative
                                                ${pathname.startsWith('/catigoriy') ? 'bg-[var(--nav-bg)] text-[var(--text-primary)] border border-[var(--border-color)] shadow-sm' : 'text-[var(--text-secondary)] hover:bg-[var(--nav-bg)]/50 hover:text-[var(--text-primary)] border border-transparent'}
                                            `}
                                        >
                                            <PlusSquare className={`w-5 h-5 relative z-10 ${pathname.startsWith('/catigoriy') ? 'text-[var(--accent-cyan)]' : 'group-hover:scale-110 opacity-60'}`} />
                                            <span className={`text-[15px] font-bold tracking-tight relative z-10 ${pathname.startsWith('/catigoriy') ? 'opacity-100' : 'opacity-60'}`}>Разместить</span>
                                        </button>

                                        <button
                                            onClick={() => router.push("/analytics")}
                                            className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative
                                                ${pathname === '/analytics' ? 'bg-[var(--nav-bg)] text-[var(--text-primary)] border border-[var(--border-color)] shadow-sm' : 'text-[var(--text-secondary)] hover:bg-[var(--nav-bg)]/50 hover:text-[var(--text-primary)] border border-transparent'}
                                            `}
                                        >
                                            <BarChart3 className={`w-5 h-5 relative z-10 ${pathname === '/analytics' ? 'text-[var(--accent-cyan)]' : 'group-hover:scale-110 opacity-60'}`} />
                                            <span className={`text-[15px] font-bold tracking-tight relative z-10 ${pathname === '/analytics' ? 'opacity-100' : 'opacity-60'}`}>Аналитика</span>
                                        </button>
                                    </div>
                                )}

                                {userPhone === "79999999999" && (
                                    <div className="mt-8 flex flex-col gap-2">
                                        <div className="h-[1px] w-full bg-[var(--border-color)] mb-4 opacity-50" />
                                        <h3 className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] px-4 mb-3 opacity-40">Администрирование</h3>
                                        
                                        <button
                                            onClick={() => router.push("/admin")}
                                            className="flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative border border-[var(--accent-cyan)]/20 bg-[var(--accent-cyan)]/5 hover:bg-[var(--accent-cyan)]/10 text-[var(--accent-cyan)]"
                                        >
                                            <Briefcase className="w-5 h-5 relative z-10 transition-transform duration-500 group-hover:scale-110" />
                                            <span className="text-[15px] font-bold tracking-tight relative z-10">Админ-панель</span>
                                        </button>
                                    </div>
                                )}
                            </nav>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Section */}
            <div className="p-8 border-t border-[var(--border-color)] bg-[var(--card-bg)]/30 backdrop-blur-xl relative z-20">
                {/* Profile Card - Clean Premium Design */}
                <div 
                    onClick={() => router.push(activeRole === 'admin' ? '/admin/settings' : activeRole === 'seller' ? '/lkseller' : '/profile')}
                    className="flex items-center gap-4 p-3 rounded-2xl hover:bg-[var(--nav-bg)]/50 transition-all cursor-pointer group mb-6 border border-transparent hover:border-[var(--border-color)]"
                >
                    <div className="w-12 h-12 rounded-full bg-[var(--nav-bg)] flex items-center justify-center border border-[var(--border-color)] group-hover:border-[var(--accent-cyan)]/30 transition-all duration-500 shrink-0 relative overflow-hidden">
                        {userAvatar ? (
                            <img src={userAvatar} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-[14px] font-black text-[var(--text-primary)] font-cera z-10">
                                {(userName?.[0] || userPhone?.[0] || 'T').toUpperCase()}
                            </span>
                        )}
                        {/* Subtle background glow */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-cyan)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <div className="flex flex-col min-w-0">
                        <span className="text-[15px] font-black text-[var(--text-primary)] truncate font-cera uppercase tracking-tight group-hover:text-[var(--accent-cyan)] transition-colors">
                            {userName || 'ПОЛЬЗОВАТЕЛЬ'}
                        </span>
                        <span className="text-[10px] font-bold text-[var(--text-secondary)] opacity-60 tracking-widest mt-0.5 tabular-nums uppercase">
                            {userPhone ? formatPhone(userPhone) : ''}
                        </span>
                    </div>
                </div>

                {/* Role Switcher Pill */}
                {activeRole !== 'admin' && (
                    <div className="p-1 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl flex gap-1 mb-6 relative overflow-hidden h-11">
                        <motion.div
                            className="absolute inset-y-1 rounded-lg bg-[var(--text-primary)] shadow-lg"
                            animate={{
                                left: activeRole === 'client' ? '4px' : 'calc(50% + 2px)',
                                right: activeRole === 'seller' ? '4px' : 'calc(50% + 2px)'
                            }}
                            transition={{ type: "spring", stiffness: 400, damping: 35 }}
                        />
                        <button
                            onClick={() => activeRole !== 'client' && handleRoleSwitch()}
                            className={`flex-1 flex items-center justify-center text-[11px] font-black uppercase tracking-widest relative z-10 transition-all duration-500 ${activeRole === 'client' ? 'text-[var(--bg-color)]' : 'text-[var(--text-secondary)] opacity-60 hover:opacity-100'}`}
                            disabled={isTransitioning}
                        >
                            Клиент
                        </button>
                        <button
                            onClick={() => activeRole !== 'seller' && handleRoleSwitch()}
                            className={`flex-1 flex items-center justify-center text-[11px] font-black uppercase tracking-widest relative z-10 transition-all duration-500 ${activeRole === 'seller' ? 'text-[var(--bg-color)]' : 'text-[var(--text-secondary)] opacity-60 hover:opacity-100'}`}
                            disabled={isTransitioning}
                        >
                            Партнер
                        </button>
                    </div>
                )}

                {/* Quick Actions Theme/Logout */}
                <div className="flex gap-2">
                    <button
                        onClick={toggleTheme}
                        className="flex-1 h-12 rounded-xl bg-[var(--bg-color)] border border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--accent-cyan)]/30 hover:text-[var(--accent-cyan)] transition-all flex items-center justify-center overflow-hidden"
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={theme}
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -10, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {theme === 'day' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                            </motion.div>
                        </AnimatePresence>
                    </button>
                    
                    <button 
                        onClick={() => {
                            localStorage.removeItem("currentUserPhone");
                            sessionStorage.removeItem("currentUserPhone");
                            router.push("/registration");
                        }}
                        className="w-12 h-12 rounded-xl bg-[var(--bg-color)] border border-[var(--border-color)] text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                        title="Выход"
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </motion.div>


        </>
    );
}
