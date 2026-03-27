"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { getActiveRole, getCurrentUserPhone } from "@/utils/userData";

export default function BottomNav() {
    const router = useRouter();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    const [scrolled, setScrolled] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        setMounted(true);

        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setScrolled(true); // Scrolling down - hide
            } else {
                setScrolled(false); // Scrolling up - show
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    const searchParams = useSearchParams();

    const [hasUnread, setHasUnread] = useState(false);

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
    const hiddenRoutes = ["/", "/admin", "/onboarding", "/registration", "/seller-menu2", "/pay", "/final", "/code", "/client-partner", "/tarif"];
    const isHidden = hiddenRoutes.some(route => route === "/" ? pathname === "/" : pathname.startsWith(route)) || isChat || scrolled;

    // Standard coordinates based on 327x64 design
    let activeX = -100;
    let activeTab: 'home' | 'orders' | 'categories' | 'settings' | null = null;

    if (pathname === "/client" || pathname === "/seller") {
        activeX = 4;
        activeTab = 'home';
    } else if (pathname.includes("/order") || pathname.includes("/lkseller/orders")) {
        activeX = 83.75;
        activeTab = 'orders';
    } else if (pathname.includes("/chats")) {
        activeX = 163.5;
        activeTab = 'categories';
    } else if (pathname.includes("/setting-new") || pathname.includes("/tema") || pathname.includes("/profile") || pathname.includes("/lkseller")) {
        activeX = 243.25;
        activeTab = 'settings';
    }

    return (
        <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 w-[327px] h-[64px] z-50 transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] ${isHidden ? 'translate-y-[150%] opacity-0 scale-95' : 'translate-y-0 opacity-100 scale-100'}`}>
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
                    style={{ opacity: activeX > 0 ? 1 : 0 }}
                />

                {/* Icons Layer - CAREFUL 1:1 RECOVERY */}
                <g stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {/* Slot 1: Grid Menu (Cleaned up to fix distortion) */}
                    <circle cx="38.875" cy="27" r="2.5" />
                    <circle cx="48.875" cy="27" r="2.5" />
                    <circle cx="38.875" cy="37" r="2.5" />
                    <circle cx="48.875" cy="37" r="2.5" />
                </g>

                <path d="M120.625 37H126.625M120.625 34H126.625M124.625 23.0009C124.53 23 124.422 23 124.3 23H119.825C118.705 23 118.145 23 117.717 23.218C117.34 23.4097 117.035 23.7155 116.843 24.0918C116.625 24.5196 116.625 25.0801 116.625 26.2002V37.8002C116.625 38.9203 116.625 39.4801 116.843 39.9079C117.035 40.2842 117.34 40.5905 117.717 40.7822C118.144 41 118.704 41 119.822 41L127.428 41C128.546 41 129.105 41 129.532 40.7822C129.909 40.5905 130.215 40.2842 130.407 39.9079C130.625 39.4805 130.625 38.9215 130.625 37.8036V29.3257C130.625 29.203 130.625 29.0955 130.624 29M124.625 23.0009C124.911 23.0035 125.091 23.0141 125.263 23.0555C125.467 23.1045 125.663 23.1853 125.842 23.2949C126.044 23.4186 126.217 23.5918 126.562 23.9375L129.688 27.063C130.034 27.4089 130.206 27.5814 130.33 27.7832C130.439 27.9621 130.52 28.1573 130.569 28.3613C130.611 28.5338 130.621 28.7145 130.624 29M124.625 23.0009L124.625 25.8002C124.625 26.9203 124.625 27.4802 124.843 27.908C125.035 28.2843 125.34 28.5905 125.717 28.7822C126.144 29 126.704 29 127.822 29H130.624" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

                <g transform="translate(191.375, 20)" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9.33814 15.9905C12.4946 15.8151 15 13.2003 15 10C15 6.68629 12.3137 4 9 4C5.68629 4 3 6.68629 3 10C3 11.1807 3.34094 12.2817 3.92989 13.21L3.50586 14.482L3.50518 14.4839C3.34278 14.9711 3.26154 15.2149 3.31938 15.3771C3.36979 15.5184 3.48169 15.6299 3.62305 15.6803C3.78472 15.7379 4.02675 15.6573 4.51069 15.4959L4.51758 15.4939L5.79004 15.0698C6.7183 15.6588 7.81935 15.9998 9.00006 15.9998C9.11352 15.9998 9.22624 15.9967 9.33814 15.9905ZM9.33814 15.9905C9.33822 15.9907 9.33806 15.9902 9.33814 15.9905ZM9.33814 15.9905C10.1591 18.3259 12.3841 20.0002 15.0001 20.0002C16.1808 20.0002 17.2817 19.6588 18.2099 19.0698L19.482 19.4939L19.4845 19.4944C19.9717 19.6567 20.2158 19.7381 20.378 19.6803C20.5194 19.6299 20.6299 19.5184 20.6803 19.3771C20.7382 19.2146 20.6572 18.9706 20.4943 18.4821L20.0703 17.21L20.2123 16.9746C20.7138 16.0979 20.9995 15.0823 20.9995 14C20.9995 10.6863 18.3137 8 15 8L14.7754 8.00414L14.6621 8.00967" />
                </g>

                <g transform="translate(271.125, 20)" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19.5179 9.0626L19.1881 8.86812C19.1369 8.83792 19.1118 8.82276 19.087 8.80705C18.8412 8.65089 18.6339 8.43512 18.4827 8.17698C18.4675 8.15101 18.4531 8.12377 18.4238 8.06994C18.3945 8.01617 18.3797 7.98892 18.366 7.96195C18.2304 7.69339 18.157 7.39411 18.1526 7.08949C18.1522 7.05886 18.1523 7.02757 18.1533 6.96537L18.1597 6.55939C18.17 5.90974 18.1752 5.5839 18.0891 5.29148C18.0126 5.03173 17.8846 4.79249 17.7138 4.58946C17.5206 4.35997 17.2533 4.19624 16.718 3.8692L16.2734 3.59755C15.7397 3.27142 15.4727 3.1083 15.1893 3.04611C14.9386 2.9911 14.6799 2.99365 14.4301 3.0531C14.1482 3.12021 13.8845 3.28758 13.3576 3.62213L13.3546 3.62365L13.036 3.8259C12.9857 3.85788 12.9602 3.874 12.9349 3.88888C12.6844 4.03658 12.4047 4.11826 12.1181 4.12801C12.0893 4.12899 12.0599 4.12899 12.0012 4.12899C11.9428 4.12899 11.9122 4.12899 11.8833 4.12801C11.5962 4.11821 11.3159 4.0361 11.065 3.88779C11.0397 3.87284 11.0147 3.85659 10.9642 3.82446L10.6436 3.62039C10.1131 3.28267 9.84738 3.11355 9.56388 3.04611C9.31307 2.98644 9.05347 2.98479 8.80186 3.04052C8.51775 3.10344 8.25072 3.26777 7.71664 3.59643L7.71427 3.59755L7.2752 3.86774L7.27034 3.87089C6.74108 4.1966 6.47581 4.35984 6.28429 4.5884C6.11434 4.79122 5.98731 5.03009 5.91127 5.28914C5.82533 5.58197 5.82991 5.9085 5.84027 6.56122L5.8467 6.96662C5.84768 7.02801 5.84936 7.05852 5.84894 7.08871C5.84468 7.39395 5.77033 7.69385 5.63428 7.96289C5.62082 7.98949 5.60633 8.0161 5.57737 8.06925C5.5484 8.12243 5.53437 8.14888 5.51934 8.17455C5.36743 8.43406 5.15925 8.65109 4.91183 8.80752C4.88735 8.82299 4.86156 8.83787 4.81088 8.86765L4.48535 9.05893C3.94373 9.37718 3.67298 9.53644 3.47597 9.76309C3.30169 9.96359 3.17003 10.2014 3.08966 10.4604C2.99881 10.7532 2.99889 11.0815 3.0003 11.7381L3.00145 12.2747C3.00284 12.9269 3.00476 13.2528 3.09581 13.5436C3.17636 13.8009 3.30706 14.0373 3.48037 14.2366C3.67626 14.4618 3.94432 14.6201 4.48183 14.9372L4.80446 15.1275C4.85937 15.1599 4.887 15.1759 4.91348 15.1928C5.15866 15.3493 5.36521 15.5657 5.51583 15.8238C5.5321 15.8516 5.54772 15.8806 5.57895 15.9384C5.6098 15.9956 5.62559 16.0241 5.63985 16.0528C5.77191 16.3179 5.84262 16.6124 5.84744 16.9122C5.84796 16.9446 5.84751 16.9773 5.84646 17.0432L5.84027 17.4322C5.82984 18.0872 5.8253 18.415 5.91175 18.7086C5.98823 18.9684 6.11605 19.2076 6.28693 19.4107C6.48007 19.6402 6.74784 19.8038 7.28311 20.1308L7.72762 20.4024C8.2614 20.7286 8.52819 20.8915 8.81156 20.9537C9.06226 21.0087 9.32112 21.0065 9.57092 20.9471C9.85325 20.8799 10.1178 20.7119 10.6462 20.3764L10.9648 20.1742C11.0152 20.1422 11.0407 20.1261 11.066 20.1113C11.3165 19.9636 11.5959 19.8815 11.8825 19.8717C11.9113 19.8707 11.9407 19.8707 11.9994 19.8707C12.0583 19.8707 12.0877 19.8707 12.1166 19.8717C12.4037 19.8815 12.6849 19.9639 12.9358 20.1122C12.9579 20.1252 12.98 20.1393 13.0188 20.1641L13.3575 20.3797C13.8881 20.7174 14.1532 20.886 14.4368 20.9535C14.6876 21.0131 14.9474 21.0156 15.199 20.9599C15.483 20.897 15.7506 20.7323 16.2844 20.4038L16.73 20.1296C17.2596 19.8036 17.5252 19.6402 17.7168 19.4116C17.8867 19.2088 18.0139 18.97 18.09 18.711C18.1753 18.4203 18.1701 18.0962 18.1599 17.4529L18.1533 17.0334C18.1523 16.972 18.1522 16.9414 18.1526 16.9112C18.1569 16.606 18.23 16.3059 18.366 16.0369C18.3795 16.0103 18.3941 15.9835 18.4229 15.9305C18.4519 15.8773 18.4669 15.8508 18.4819 15.8252C18.6338 15.5656 18.8422 15.3484 19.0897 15.192C19.1138 15.1767 19.1387 15.1621 19.1882 15.133L19.1899 15.1322L19.5154 14.9409C20.057 14.6227 20.3283 14.4632 20.5253 14.2366C20.6996 14.0361 20.8311 13.7986 20.9115 13.5396C21.0018 13.2485 21.0011 12.9221 20.9997 12.2732L20.9985 11.725C20.9971 11.0729 20.9964 10.747 20.9053 10.4562C20.8248 10.199 20.6933 9.96253 20.52 9.76323C20.3243 9.53819 20.0559 9.37986 19.5194 9.06342L19.5179 9.0626Z" />
                    <path d="M8.39888 12.0001C8.39888 14.109 10.0113 15.8186 12.0003 15.8186C13.9893 15.8186 15.6017 14.109 15.6017 12.0001C15.6017 9.89113 13.9893 8.1815 12.0003 8.1815C10.0113 8.1815 8.39888 9.89113 8.39888 12.0001Z" />
                </g>

                {/* Notification Badge inside SVG */}
                {hasUnread && (
                    <circle cx="214" cy="22" r="4.5" fill="var(--accent-color)" stroke="var(--nav-bg)" strokeWidth="1.5" />
                )}
            </svg>

            {/* Click Handlers - Invisible Overlay */}
            <div className="flex w-full h-full relative z-10">
                <button
                    onClick={() => {
                        const activeRole = getActiveRole();
                        router.push(activeRole === "seller" ? "/seller" : "/client");
                    }}
                    className="flex-1 h-full"
                    aria-label="Home"
                />
                <button
                    onClick={() => {
                        router.push("/order");
                    }}
                    className="flex-1 h-full"
                    aria-label="Orders"
                />
                <button
                    onClick={() => router.push("/chats")}
                    className="flex-1 h-full"
                    aria-label="Chats"
                />
                <button
                    onClick={() => router.push("/setting-new")}
                    className="flex-1 h-full"
                    aria-label="Settings"
                />
            </div>
        </div>
    );
}
