"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { getCurrentUserPhone } from "@/utils/userData";

const menuItems = [
    {
        path: "/admin", icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
        )
    },
    {
        path: "/admin/orders", icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
        )
    },
    {
        path: "/admin/categories", icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
        )
    },
    {
        path: "/admin/settings", icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
        )
    },
];

export default function AdminBottomNav() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [mounted, setMounted] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
            setLastScrollY(currentScrollY);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    const [hasUnread, setHasUnread] = useState(false);

    const [hasSupport, setHasSupport] = useState(false);
 
    useEffect(() => {
        const checkSupport = async () => {
            try {
                const res = await fetch('/api/support?status=open', { cache: 'no-store' });
                if (res.ok) {
                    const data = await res.json();
                    setHasSupport(data.length > 0);
                }
            } catch (e) {}
        };
 
        checkSupport();
        const interval = setInterval(checkSupport, 5000);
        return () => clearInterval(interval);
    }, []);
 
    useEffect(() => {
        const phone = getCurrentUserPhone();
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

        const handleRefresh = () => checkUnread();
        window.addEventListener('refreshUnread', handleRefresh);

        return () => {
            clearInterval(interval);
            window.removeEventListener('refreshUnread', handleRefresh);
        };
    }, [pathname]);

    if (!mounted) return null;

    const isChat = searchParams?.get('tab') === 'chat' || pathname.includes("/aichat");
    const isSupportChat = pathname.includes("/admin/support");
    const isHidden = !pathname.startsWith("/admin") || isChat || isSupportChat || scrolled;

    const activeIndex = pathname === "/admin" ? 0
        : pathname.startsWith("/admin/orders") ? 1
            : pathname.startsWith("/admin/categories") ? 2
                : pathname.startsWith("/admin/settings") ? 3
                    : -1;

    // Fixed coordinates based on 327x64 original design
    const activeX = activeIndex !== -1 ? 4 + (activeIndex * 79.75) : -100;

    return (
        /* Normalized static size to match client: 327px width, 64px height, bottom-10 */
        <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 w-[327px] h-[64px] z-50 transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] ${isHidden ? 'translate-y-[150%] opacity-0 scale-95' : 'translate-y-0 opacity-100 scale-100'}`}>
            {/* SVG Background - Static size, no percent scaling */}
            <svg width="327" height="64" viewBox="0 0 327 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute top-0 left-0 pointer-events-none drop-shadow-xl transition-all duration-300">
                <rect x="0.5" y="0.5" width="326" height="63" rx="31.5" fill="var(--nav-bg)" />
                <rect x="0.5" y="0.5" width="326" height="63" rx="31.5" stroke="var(--border-color)" />

                <rect
                    x={activeX}
                    y="4"
                    width="79.75"
                    height="56"
                    rx="28"
                    fill="var(--nav-btn)"
                    className="transition-all duration-300 ease-in-out"
                    style={{ opacity: activeIndex !== -1 ? 1 : 0 }}
                />

                {/* Notification Badge inside SVG */}
                {hasUnread && (
                    <circle cx="134" cy="22" r="4.5" fill="var(--accent-color)" stroke="var(--nav-bg)" strokeWidth="1.5" />
                )}
                {hasSupport && (
                    <circle cx="292" cy="22" r="4.5" fill="var(--accent-cyan)" stroke="var(--nav-bg)" strokeWidth="1.5" className="animate-pulse" />
                )}
            </svg>

            {/* Icons Overlay - Exact matching coordinates */}
            <div className="absolute top-0 left-0 w-full h-full z-10">
                {menuItems.map((item, index) => {
                    const isActive = activeIndex === index;
                    return (
                        <button
                            key={item.path}
                            onClick={() => router.push(item.path)}
                            style={{
                                position: 'absolute',
                                left: `${4 + index * 79.75}px`,
                                width: '79.75px',
                                height: '56px',
                                top: '4px'
                            }}
                            className={`flex items-center justify-center transition-all duration-300 relative ${isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] opacity-40'}`}
                        >
                            {item.icon}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
