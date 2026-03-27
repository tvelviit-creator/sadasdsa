import type { Metadata } from "next";
import { Manrope, Outfit } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import AdminBottomNav from "@/components/AdminBottomNav";
import DesktopSidebar from "@/components/DesktopSidebar";
import RoleTransition from "@/components/RoleTransition";
import MainContainer from "@/components/MainContainer";
import DevinBackground from "@/components/DevinBackground";
import { Suspense } from "react";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: '--font-gilroy', // Mapping Manrope to Gilroy feels
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: '--font-cera', // Mapping Outfit to Cera Pro feels
});

export const metadata: Metadata = {
  title: "Tvelv App",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var theme = localStorage.getItem('app-theme') || 'night';
                var root = document.documentElement;
                if (theme === 'auto') {
                  var isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  root.classList.add(isDark ? 'night-theme' : 'day-theme');
                } else {
                  root.classList.add(theme + '-theme');
                }
              } catch (e) {}
            })()
          `
        }} />
      </head>
      <body className={`${manrope.variable} ${outfit.variable} font-sans bg-[var(--bg-color)] text-[var(--text-primary)] antialiased transition-colors duration-300`}>
        {/* Global Devin-style Background (Visible on PC) */}
        <div className="hidden md:block">
          <DevinBackground />
        </div>

        <Suspense fallback={null}>
          {/* Desktop PC Sidebar */}
          <DesktopSidebar />
        </Suspense>

        <RoleTransition />

        <MainContainer>
          {children}
          
          {/* Mobile Bottom Navigations */}
          <Suspense fallback={null}>
            <div className="md:hidden">
              <BottomNav />
              <AdminBottomNav />
            </div>
          </Suspense>
        </MainContainer>
      </body>
    </html>
  );
}
