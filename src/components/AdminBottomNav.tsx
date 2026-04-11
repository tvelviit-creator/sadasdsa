"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

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

    if (!mounted) return null;

    const isChat = searchParams?.get('tab') === 'chat' || pathname.includes("/aichat");
    const isSupportChat = pathname.includes("/admin/support");
    const isOrderAction = pathname.startsWith("/admin/orders/") && (pathname.includes("/add") || pathname.split("/").length > 3);
    const isUserAction = pathname.startsWith("/admin/users/") && (pathname.includes("/add") || pathname.split("/").length > 3);
    const isHidden = !pathname.startsWith("/admin") || isChat || isSupportChat || scrolled || isOrderAction || isUserAction;

    const activeIndex = pathname === "/admin" ? 0
        : pathname.startsWith("/admin/orders") ? 1
            : pathname.startsWith("/admin/categories") ? 2
                : pathname.startsWith("/admin/settings") ? 3
                    : -1;

    // Fixed coordinates based on 327x64 original design
    const activeX = activeIndex !== -1 ? 4 + (activeIndex * 79.75) : -100;

    return (
        <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 w-[327px] h-[64px] z-50 transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] ${isHidden ? 'translate-y-[150%] opacity-0 scale-95' : 'translate-y-0 opacity-100 scale-100'}`}>
            <svg width="327" height="64" viewBox="0 0 327 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute top-0 left-0 pointer-events-none drop-shadow-xl transition-all duration-300">
                <rect x="0.5" y="0.5" width="326" height="63" rx="31.5" fill="var(--nav-bg)"/>
                <rect x="0.5" y="0.5" width="326" height="63" rx="31.5" stroke="var(--border-color)"/>
                
                {/* Dynamic Active Indicator */}
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

                {/* Icons - Grouped to match stroke and color */}
                <g stroke={activeIndex === 0 ? "var(--text-primary)" : "var(--text-secondary)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-colors duration-300">
                    <path d="M53.875 39.9999C53.875 38.1422 52.0199 36.5618 49.4306 35.976M47.2083 40C47.2083 37.6436 44.2236 35.7333 40.5417 35.7333C36.8598 35.7333 33.875 37.6436 33.875 40M47.2083 32.5333C49.6629 32.5333 51.6528 30.6231 51.6528 28.2667C51.6528 25.9103 49.6629 24 47.2083 24M40.5417 32.5333C38.0871 32.5333 36.0972 30.6231 36.0972 28.2667C36.0972 25.9103 38.0871 24 40.5417 24C42.9963 24 44.9861 25.9103 44.9861 28.2667C44.9861 30.6231 42.9963 32.5333 40.5417 32.5333Z" />
                </g>

                <g stroke={activeIndex === 1 ? "var(--text-primary)" : "var(--text-secondary)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-colors duration-300">
                    <path d="M120.625 37H126.625M120.625 34H126.625M124.625 23.0009C124.53 23 124.422 23 124.3 23H119.825C118.705 23 118.145 23 117.717 23.218C117.34 23.4097 117.035 23.7155 116.843 24.0918C116.625 24.5196 116.625 25.0801 116.625 26.2002V37.8002C116.625 38.9203 116.625 39.4801 116.843 39.9079C117.035 40.2842 117.34 40.5905 117.717 40.7822C118.144 41 118.704 41 119.822 41L127.428 41C128.546 41 129.105 41 129.532 40.7822C129.909 40.5905 130.215 40.2842 130.407 39.9079C130.625 39.4805 130.625 38.9215 130.625 37.8036V29.3257C130.625 29.203 130.625 29.0955 130.624 29M124.625 23.0009C124.911 23.0035 125.091 23.0141 125.263 23.0555C125.467 23.1045 125.663 23.1853 125.842 23.2949C126.044 23.4186 126.217 23.5918 126.562 23.9375L129.688 27.063C130.034 27.4089 130.206 27.5814 130.33 27.7832C130.439 27.9621 130.52 28.1573 130.569 28.3613C130.611 28.5338 130.621 28.7145 130.624 29M124.625 23.0009L124.625 25.8002C124.625 26.9203 124.625 27.4802 124.843 27.908C125.035 28.2843 125.34 28.5905 125.717 28.7822C126.144 29 126.704 29 127.822 29H130.624" />
                </g>

                <g stroke={activeIndex === 2 ? "var(--text-primary)" : "var(--text-secondary)"} strokeWidth="2" className="transition-colors duration-300">
                    <path d="M195.423 33H199.047C199.577 33 200.086 33.2107 200.461 33.5858L201.289 34.4142C201.664 34.7893 202.173 35 202.703 35H204.047C204.577 35 205.086 34.7893 205.461 34.4142L206.289 33.5858C206.664 33.2107 207.173 33 207.703 33H211.327M195.375 32.3693L195.375 37C195.375 38.6569 196.718 40 198.375 40H208.375C210.032 40 211.375 38.6569 211.375 37V32.3693C211.375 32.124 211.345 31.8797 211.285 31.6417L209.943 26.2724C209.609 24.9369 208.409 24 207.033 24H199.717C198.341 24 197.141 24.9369 196.807 26.2724L195.465 31.6417C195.405 31.8797 195.375 32.124 195.375 32.3693Z" />
                </g>

                <g stroke={activeIndex === 3 ? "var(--text-primary)" : "var(--text-secondary)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-colors duration-300">
                    <path d="M290.643 29.0626L290.313 28.8681C290.262 28.8379 290.237 28.8228 290.212 28.8071C289.966 28.6509 289.759 28.4351 289.608 28.177C289.592 28.151 289.578 28.1238 289.549 28.0699C289.52 28.0162 289.505 27.9889 289.491 27.962C289.355 27.6934 289.282 27.3941 289.278 27.0895C289.277 27.0589 289.277 27.0276 289.278 26.9654L289.285 26.5594C289.295 25.9097 289.3 25.5839 289.214 25.2915C289.138 25.0317 289.01 24.7925 288.839 24.5895C288.646 24.36 288.378 24.1962 287.843 23.8692L287.398 23.5975C286.865 23.2714 286.598 23.1083 286.314 23.0461C286.064 22.9911 285.805 22.9936 285.555 23.0531C285.273 23.1202 285.01 23.2876 284.483 23.6221L284.48 23.6237L284.161 23.8259C284.111 23.8579 284.085 23.874 284.06 23.8889C283.809 24.0366 283.53 24.1183 283.243 24.128C283.214 24.129 283.185 24.129 283.126 24.129C283.068 24.129 283.037 24.129 283.008 24.128C282.721 24.1182 282.441 24.0361 282.19 23.8878C282.165 23.8728 282.14 23.8566 282.089 23.8245L281.769 23.6204C281.238 23.2827 280.972 23.1136 280.689 23.0461C280.438 22.9864 280.178 22.9848 279.927 23.0405C279.643 23.1034 279.376 23.2678 278.842 23.5964L278.839 23.5975L278.4 23.8677L278.395 23.8709C277.866 24.1966 277.601 24.3598 277.409 24.5884C277.239 24.7912 277.112 25.0301 277.036 25.2891C276.95 25.582 276.955 25.9085 276.965 26.5612L276.972 26.9666C276.973 27.028 276.974 27.0585 276.974 27.0887C276.97 27.3939 276.895 27.6938 276.759 27.9629C276.746 27.9895 276.731 28.0161 276.702 28.0692C276.673 28.1224 276.659 28.1489 276.644 28.1745C276.492 28.4341 276.284 28.6511 276.037 28.8075C276.012 28.823 275.987 28.8379 275.936 28.8677L275.61 29.0589C275.069 29.3772 274.798 29.5364 274.601 29.7631C274.427 29.9636 274.295 30.2014 274.215 30.4604C274.124 30.7532 274.124 31.0815 274.125 31.7381L274.126 32.2747C274.128 32.9269 274.13 33.2528 274.221 33.5436C274.301 33.8009 274.432 34.0373 274.605 34.2366C274.801 34.4618 275.069 34.6201 275.607 34.9372L275.929 35.1275C275.984 35.1599 276.012 35.1759 276.038 35.1928C276.284 35.3493 276.49 35.5657 276.641 35.8238C276.657 35.8516 276.673 35.8806 276.704 35.9384C276.735 35.9956 276.751 36.0241 276.765 36.0528C276.897 36.3179 276.968 36.6124 276.972 36.9122C276.973 36.9446 276.973 36.9773 276.971 37.0432L276.965 37.4322C276.955 38.0872 276.95 38.415 277.037 38.7086C277.113 38.9684 277.241 39.2076 277.412 39.4107C277.605 39.6402 277.873 39.8038 278.408 40.1308L278.853 40.4024C279.386 40.7286 279.653 40.8915 279.937 40.9537C280.187 41.0087 280.446 41.0065 280.696 40.9471C280.978 40.8799 281.243 40.7119 281.771 40.3764L282.09 40.1742C282.14 40.1422 282.166 40.1261 282.191 40.1113C282.442 39.9636 282.721 39.8815 283.007 39.8717C283.036 39.8707 283.066 39.8707 283.124 39.8707C283.183 39.8707 283.213 39.8707 283.242 39.8717C283.529 39.8815 283.81 39.9639 284.061 40.1122C284.083 40.1252 284.105 40.1393 284.144 40.1641L284.483 40.3797C285.013 40.7174 285.278 40.886 285.562 40.9535C285.813 41.0131 286.072 41.0156 286.324 40.9599C286.608 40.897 286.876 40.7323 287.409 40.4038L287.855 40.1296C288.385 39.8036 288.65 39.6402 288.842 39.4116C289.012 39.2088 289.139 38.97 289.215 38.711C289.3 38.4203 289.295 38.0962 289.285 37.4529L289.278 37.0334C289.277 36.972 289.277 36.9414 289.278 36.9112C289.282 36.606 289.355 36.3059 289.491 36.0369C289.504 36.0103 289.519 35.9835 289.548 35.9305C289.577 35.8773 289.592 35.8508 289.607 35.8252C289.759 35.5656 289.967 35.3484 290.215 35.192C290.239 35.1767 290.264 35.1621 290.313 35.133L290.315 35.1322L290.64 34.9409C291.182 34.6227 291.453 34.4632 291.65 34.2366C291.825 34.0361 291.956 33.7986 292.036 33.5396C292.127 33.2485 292.126 32.9221 292.125 32.2732L292.124 31.725C292.122 31.0729 292.121 30.747 292.03 30.4562C291.95 30.199 291.818 29.9625 291.645 29.7632C291.449 29.5382 291.181 29.3799 290.644 29.0634L290.643 29.0626Z" />
                    <path d="M279.524 32.0001C279.524 34.109 281.136 35.8186 283.125 35.8186C285.114 35.8186 286.727 34.109 286.727 32.0001C286.727 29.8911 285.114 28.1815 283.125 28.1815C281.136 28.1815 279.524 29.8911 279.524 32.0001Z" />
                </g>
            </svg>

            {/* Icons Overlay - Interactive buttons */}
            <div className="absolute top-0 left-0 w-full h-full z-10 flex">
                <button onClick={() => router.push("/admin")} className="flex-1 h-full" aria-label="Users" />
                <button onClick={() => router.push("/admin/orders")} className="flex-1 h-full" aria-label="Orders" />
                <button onClick={() => router.push("/admin/categories")} className="flex-1 h-full" aria-label="Categories" />
                <button onClick={() => router.push("/admin/settings")} className="flex-1 h-full" aria-label="Settings" />
            </div>
        </div>
    );
}
