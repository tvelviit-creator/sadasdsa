"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { getCurrentUserPhone } from "@/utils/userData";

export default function MainContainer({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    
    // Pages where we DON'T want the sidebar or its padding
    const hiddenRoutes = ["/", "/onboarding", "/registration", "/code", "/final", "/client-partner", "/admin"];
    const isHidden = hiddenRoutes.some(route => route === "/" ? pathname === "/" : pathname.startsWith(route)) || (pathname !== "/" && pathname.endsWith("/add"));

    useEffect(() => {
        if (!isHidden) {
            const phone = getCurrentUserPhone();
            if (!phone) {
                router.replace("/registration");
            }
        }
    }, [pathname, isHidden, router]);

    return (
        <div className={`w-full md:max-w-none ${isHidden ? '' : 'md:pl-[280px]'} ${isHidden ? 'max-w-none' : 'max-w-[430px]'} mx-auto md:mx-0 min-h-screen bg-[var(--bg-color)] md:shadow-none shadow-[0_0_60px_rgba(0,0,0,0.5)] relative overflow-x-hidden flex flex-col transition-all duration-300`}>
            {children}
        </div>
    );
}
