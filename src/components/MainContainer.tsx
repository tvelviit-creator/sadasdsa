"use client";

import { usePathname } from "next/navigation";

export default function MainContainer({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    
    // Pages where we DON'T want the sidebar or its padding
    const hiddenRoutes = ["/", "/onboarding", "/registration", "/code", "/final", "/client-partner", "/admin"];
    const isHidden = hiddenRoutes.some(route => route === "/" ? pathname === "/" : pathname.startsWith(route)) || (pathname !== "/" && pathname.endsWith("/add"));

    return (
        <div className={`w-full md:max-w-none ${isHidden ? '' : 'md:pl-[280px]'} ${isHidden ? 'max-w-none' : 'max-w-[430px]'} mx-auto md:mx-0 min-h-screen bg-[var(--bg-color)] md:shadow-none shadow-[0_0_60px_rgba(0,0,0,0.5)] relative overflow-x-hidden flex flex-col transition-all duration-300`}>
            {children}
        </div>
    );
}
