import type { Metadata } from "next";
import { Manrope, Outfit } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import AdminBottomNav from "@/components/AdminBottomNav";
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
      <body className={`${manrope.variable} ${outfit.variable} font-sans bg-[var(--bg-color)] text-[var(--text-primary)] antialiased flex justify-center transition-colors duration-300`}>
        {/* Main Phone Container - Center Column on PC */}
        <div className="w-full max-w-[430px] min-h-screen bg-[var(--bg-color)] shadow-[0_0_60px_rgba(0,0,0,0.5)] relative overflow-x-hidden flex flex-col transition-colors duration-300">
          {children}
          
          <Suspense fallback={null}>
            <BottomNav />
            <AdminBottomNav />
          </Suspense>
        </div>
      </body>
    </html>
  );
}
