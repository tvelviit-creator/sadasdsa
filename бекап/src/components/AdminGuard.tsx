"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getCurrentUserPhone } from "@/utils/userData";

// Define the Super Admin phone number
export const SUPER_ADMIN_PHONE = "79999999999";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAuth = () => {
            const phone = getCurrentUserPhone();
            
            // In a real app, you'd also check a token or the 'isAdmin' flag in the DB
            // But for this setup, we'll tie it to the specific phone number as requested
            if (phone === SUPER_ADMIN_PHONE) {
                setIsAuthorized(true);
            } else {
                console.warn("🚫 [AdminGuard] Unauthorized access attempt from:", phone);
                setIsAuthorized(false);
                router.push("/registration"); // Redirect to login if not admin
            }
        };

        checkAuth();
    }, [pathname, router]);

    if (isAuthorized === null) {
        return (
            <div className="min-h-screen bg-[#141414] flex items-center justify-center text-white/20">
                Проверка доступа...
            </div>
        );
    }

    if (isAuthorized === false) {
        return null; // Will redirect
    }

    return <>{children}</>;
}
