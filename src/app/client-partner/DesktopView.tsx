"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUserPhone, saveUserData, setActiveRole } from "@/utils/userData";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

// --- CUSTOM HIGH-PERFORMANCE CANVAS PARTICLE NETWORK ---
// --- CUSTOM HIGH-PERFORMANCE CANVAS PARTICLE NETWORK ---
const ParticleSystem = ({ active }: { active: string | null }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (typeof window === "undefined") return;
        mouseRef.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

        let rafId: number;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d", { alpha: false }); 
        if (!ctx) return;

        let w = canvas.width = window.innerWidth;
        let h = canvas.height = window.innerHeight;
        
        let targetColor = "rgba(255, 255, 255, 0.1)";
        let lineColor = "rgba(255, 255, 255, 0.03)";
        let forceX = 0;

        const maxParticles = w < 768 ? 50 : 120; 
        const maxDist = 150; 
        const maxDistSq = maxDist * maxDist; 

        interface Particle {
            x: number; y: number; vx: number; vy: number; size: number;
        }
        
        let particles: Particle[] = Array.from({ length: maxParticles }, () => ({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.6,
            vy: (Math.random() - 0.5) * 0.6,
            size: Math.random() * 2 + 0.5,
        }));

        const handleMouse = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };
        
        let resizeTimer: any;
        const handleResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                w = canvas.width = window.innerWidth;
                h = canvas.height = window.innerHeight;
            }, 100);
        };

        window.addEventListener("mousemove", handleMouse, { passive: true });
        window.addEventListener("resize", handleResize, { passive: true });

        let currentForceX = 0;
        
        const draw = () => {
            // Setup colors based on role - Using exact brand colors
            if (active === "client") {
                targetColor = "rgba(146, 255, 244, 0.6)"; // --accent-cyan
                lineColor = "rgba(146, 255, 244, 0.12)";
                forceX = -4;
            } else if (active === "partner") {
                targetColor = "rgba(255, 140, 103, 0.6)"; // --accent-color
                lineColor = "rgba(255, 140, 103, 0.12)";
                forceX = 4; 
            } else {
                targetColor = "rgba(255, 255, 255, 0.15)";
                lineColor = "rgba(255, 255, 255, 0.05)";
                forceX = 0;
            }

            currentForceX += (forceX - currentForceX) * 0.04;

            // Clear with deep theme bg
            ctx.fillStyle = "#0A0A0B"; 
            ctx.fillRect(0, 0, w, h);

            ctx.fillStyle = targetColor;
            ctx.strokeStyle = lineColor;
            
            ctx.beginPath();
            
            const isMovingSideways = Math.abs(currentForceX) > 0.05;

            for (let i = 0; i < maxParticles; i++) {
                const p = particles[i];

                const dxM = p.x - mouseRef.current.x;
                const dyM = p.y - mouseRef.current.y;
                const distSqM = dxM * dxM + dyM * dyM;
                
                if (distSqM < 40000) { // 200 * 200
                    const f = (1 - Math.sqrt(distSqM) / 200) * 0.05;
                    p.x += dxM * f;
                    p.y += dyM * f;
                }

                if (isMovingSideways) {
                     p.x += currentForceX * (rCache[i] * 0.8 + 0.2);
                     if (currentForceX < 0 && p.x < -100) p.x = w + 100;
                     if (currentForceX > 0 && p.x > w + 100) p.x = -100;
                } else {
                    if (p.x < 0 || p.x > w) p.vx *= -1;
                    if (p.y < 0 || p.y > h) p.vy *= -1;
                }

                p.x += p.vx;
                p.y += p.vy;

                ctx.moveTo(p.x, p.y);
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

                for (let j = i + 1; j < maxParticles; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dSq = dx * dx + dy * dy;

                    if (dSq < maxDistSq) {
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                    }
                }
            }
            
            ctx.fill();
            ctx.stroke();

            rafId = requestAnimationFrame(draw);
        };
        
        const rCache = Array.from({length: maxParticles}, () => Math.random());

        rafId = requestAnimationFrame(draw);

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", handleMouse);
            cancelAnimationFrame(rafId);
        };
    }, [active]);

    return (
        <canvas 
            ref={canvasRef} 
            className="absolute inset-0 z-0 pointer-events-none w-full h-full transition-opacity duration-1000"
            style={{ mixBlendMode: 'screen', opacity: active ? 1 : 0.4 }}
        />
    );
};


export default function DesktopView() {
  const router = useRouter();
  const [hoveredRole, setHoveredRole] = useState<"client" | "partner" | null>(null);
  const [isExiting, setIsExiting] = useState(false);

  const handlePartnerSelect = () => {
    const phone = getCurrentUserPhone();
    if (phone) {
      saveUserData(phone, { isPartner: true });
      setActiveRole("seller");
    }
    setIsExiting(true);
    setTimeout(() => router.push("/seller"), 800);
  };

  const handleClientSelect = () => {
    const phone = getCurrentUserPhone();
    if (phone) {
      setActiveRole("client");
    }
    setIsExiting(true);
    setTimeout(() => router.push("/client"), 800);
  };

  return (
    <div className="w-full h-full min-h-screen flex flex-col items-center justify-center relative bg-[#0A0A0B] overflow-hidden">
      
      {/* Background Graphic Engine */}
      <ParticleSystem active={hoveredRole} />

      {/* Cinematic Vignette */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(10,10,12,0.9)_100%)] transition-opacity duration-1000" />

      {/* Floating Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="absolute top-16 left-0 w-full flex justify-center text-[var(--text-secondary)] tracking-[0.4em] text-[10px] font-black uppercase opacity-40 z-20 pointer-events-none"
      >
        Выберите ваш путь
      </motion.div>

      <AnimatePresence>
        {!isExiting && (
          <motion.div 
            initial={{ opacity: 0, filter: "blur(20px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(40px)", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="z-10 w-full px-8 md:px-24 flex flex-col md:flex-row items-center justify-between gap-12"
          >
            {/* === LEFT: CLIENT === */}
            <div 
                className="group relative cursor-pointer flex-1 flex flex-col items-start w-full py-20"
                onMouseEnter={() => setHoveredRole("client")}
                onMouseLeave={() => setHoveredRole(null)}
                onClick={handleClientSelect}
            >
                {/* Huge Typography Interactive Button */}
                <h1 
                    className="text-[12vw] md:text-[8vw] xl:text-[7.5vw] font-black leading-none transition-all duration-700 ease-out z-10 relative"
                    style={{ 
                        WebkitTextStroke: hoveredRole === "client" ? '0px transparent' : '1px rgba(255,255,255,0.08)',
                        color: hoveredRole === "client" ? 'var(--accent-cyan)' : 'transparent',
                        textShadow: hoveredRole === "client" ? '0 0 80px rgba(146, 255, 244, 0.3)' : 'none',
                        fontFamily: 'var(--font-cera)',
                        letterSpacing: '-0.04em',
                        transform: hoveredRole === "client" ? "scale(1.05) translateX(3%)" : "scale(1) translateX(0%)",
                    }}
                >
                    КЛИЕНТ
                </h1>
                
                {/* Animated Graphic Reveal */}
                <div className="mt-8 flex items-center gap-6 overflow-hidden max-w-lg min-h-[60px]">
                    <motion.div 
                         initial={{ width: "0%" }}
                         animate={{ width: hoveredRole === "client" ? '3rem' : '0rem' }}
                         transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                         className="h-[2px] bg-[var(--accent-cyan)] shadow-[0_0_20px_var(--accent-cyan)]"
                    />
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ 
                            opacity: hoveredRole === "client" ? 1 : 0, 
                            x: hoveredRole === "client" ? 0 : -30 
                        }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="flex items-center gap-4 text-[var(--accent-cyan)] w-full"
                    >
                        <div className="w-10 h-10 rounded-full border border-[var(--accent-cyan)]/30 flex items-center justify-center bg-[var(--accent-cyan)]/10 backdrop-blur-xl shrink-0">
                            <ArrowUpRight className="w-4 h-4" />
                        </div>
                        <div className="hidden sm:block whitespace-nowrap">
                            <p className="text-lg font-black uppercase tracking-tight">Ищу исполнителя</p>
                            <p className="text-[11px] font-bold opacity-40 uppercase tracking-widest">Заказы • Проекты • Фриланс</p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* === CENTER ABSTRACT DIVIDER === */}
            <div className="hidden lg:flex flex-col items-center justify-center opacity-10 py-12">
                 <div className="w-[1px] h-[35vh] bg-gradient-to-b from-transparent via-white to-transparent" />
                 <span className="my-8 text-[9px] font-black tracking-[0.5em] uppercase">VS</span>
                 <div className="w-[1px] h-[35vh] bg-gradient-to-t from-transparent via-white to-transparent" />
            </div>

            {/* === RIGHT: PARTNER === */}
            <div 
                className="group relative cursor-pointer flex-1 flex flex-col items-end text-right w-full py-20"
                onMouseEnter={() => setHoveredRole("partner")}
                onMouseLeave={() => setHoveredRole(null)}
                onClick={handlePartnerSelect}
            >
                {/* Huge Typography Interactive Button */}
                <h1 
                    className="text-[12vw] md:text-[8vw] xl:text-[7.5vw] font-black leading-none transition-all duration-700 ease-out z-10 relative"
                    style={{ 
                        WebkitTextStroke: hoveredRole === "partner" ? '0px transparent' : '1px rgba(255,255,255,0.08)',
                        color: hoveredRole === "partner" ? 'var(--accent-color)' : 'transparent',
                        textShadow: hoveredRole === "partner" ? '0 0 80px rgba(255, 140, 103, 0.3)' : 'none',
                        fontFamily: 'var(--font-cera)',
                        letterSpacing: '-0.04em',
                        transform: hoveredRole === "partner" ? "scale(1.05) translateX(-3%)" : "scale(1) translateX(0%)",
                    }}
                >
                    ПАРТНЕР
                </h1>
                
                {/* Animated Graphic Reveal */}
                <div className="mt-8 flex flex-row-reverse items-center gap-6 overflow-hidden max-w-lg min-h-[60px]">
                    <motion.div 
                         initial={{ width: "0%" }}
                         animate={{ width: hoveredRole === "partner" ? '3rem' : '0rem' }}
                         transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                         className="h-[2px] bg-[var(--accent-color)] shadow-[0_0_20px_var(--accent-color)]"
                    />
                    <motion.div 
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ 
                            opacity: hoveredRole === "partner" ? 1 : 0, 
                            x: hoveredRole === "partner" ? 0 : 30 
                        }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="flex flex-row-reverse items-center gap-4 text-[var(--accent-color)] w-full"
                    >
                        <div className="w-10 h-10 rounded-full border border-[var(--accent-color)]/30 flex items-center justify-center bg-[var(--accent-color)]/10 backdrop-blur-xl shrink-0">
                            <ArrowUpRight className="w-4 h-4" />
                        </div>
                        <div className="hidden sm:block whitespace-nowrap text-right">
                            <p className="text-lg font-black uppercase tracking-tight">Размещаю услуги</p>
                            <p className="text-[11px] font-bold opacity-40 uppercase tracking-widest">Продажа • Публикация • Витрина</p>
                        </div>
                    </motion.div>
                </div>
            </div>
            
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
