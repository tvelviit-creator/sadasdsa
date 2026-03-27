"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, Zap, ChevronRight, Check } from "lucide-react";

// --- CUSTOM BACKGROUND SYSTEMS ---
const GridBackground = ({ mousePos }: { mousePos: { x: number, y: number } }) => {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden h-[120vh]">
            <div 
                className="absolute inset-0 opacity-[0.08]"
                style={{
                    backgroundImage: `linear-gradient(var(--accent-cyan) 1px, transparent 1px), linear-gradient(90deg, var(--accent-cyan) 1px, transparent 1px)`,
                    backgroundSize: '60px 60px',
                    maskImage: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`,
                    WebkitMaskImage: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`,
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0A0B]/60 to-[#0A0A0B]" />
        </div>
    );
};

const ParticleBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let w = canvas.width = window.innerWidth;
        let h = canvas.height = window.innerHeight;
        const particles: any[] = [];
        const count = 40;

        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.2,
                vy: (Math.random() - 0.5) * 0.2,
                size: Math.random() * 1.5 + 0.5,
                opacity: Math.random() * 0.3 + 0.1
            });
        }

        const animate = () => {
            ctx.clearRect(0, 0, w, h);
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > w) p.vx *= -1;
                if (p.y < 0 || p.y > h) p.vy *= -1;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
                ctx.fill();
            });
            requestAnimationFrame(animate);
        };
        animate();

        const handleResize = () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none opacity-40" />;
};

export default function Home() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        setMounted(true);
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    if (!mounted) return null;

    return (
        <div className="bg-[#050506] min-h-screen text-white font-sans selection:bg-[var(--accent-cyan)] selection:text-black overflow-x-hidden relative">
            
            <GridBackground mousePos={mousePos} />
            <ParticleBackground />

            {/* MINIMAL NAV */}
            <header className="fixed top-0 left-0 w-full z-[100] px-6 md:px-32 py-8 md:py-10 flex items-center justify-between pointer-events-none">
                <div className="flex items-center pointer-events-auto">
                    <div className="w-10 h-10 bg-white rounded-[12px] flex items-center justify-center transition-all hover:scale-110 shadow-xl select-none cursor-pointer" onClick={() => router.push("/")}>
                        <span className="text-black font-black text-xl font-cera translate-y-[1px]">T</span>
                    </div>
                </div>
            </header>

            <main className="relative z-10 w-full">
                
                {/* 1. HERO */}
                <section className="min-h-screen w-full flex flex-col lg:flex-row items-center justify-center px-6 md:px-32 relative overflow-hidden pt-32 lg:pt-0">
                    <div className="w-full lg:w-[55%] relative z-10">
                        <motion.div 
                            initial={{ opacity: 0, x: -60 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1.5 }}
                            className="flex flex-col text-center lg:text-left items-center lg:items-start"
                        >
                            <h1 className="text-6xl md:text-[140px] lg:text-[180px] font-black font-cera leading-[0.78] tracking-[-0.08em] uppercase mb-12 select-none">
                                <span className="block mb-2">TVELV</span>
                                <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/[0.05] block font-cera">CORE</span>
                            </h1>

                            <div className="max-w-xl space-y-10">
                                <p className="text-base md:text-2xl text-white/30 leading-tight font-gilroy font-semibold italic border-none lg:border-l lg:border-white/10 lg:pl-8">
                                    Единая платформа для прозрачного взаимодействия заказчиков и партнёров. Среда, где идеи защищены технологиями.
                                </p>
                                
                                <div className="flex justify-center lg:justify-start pt-4">
                                    <button 
                                        onClick={() => router.push("/registration")}
                                        className="px-10 py-5 bg-white text-black rounded-full text-[9px] font-black uppercase tracking-[0.5em] hover:scale-105 hover:bg-[var(--accent-cyan)] transition-all flex items-center gap-4 group"
                                    >
                                        Зайти в систему
                                        <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* HERO VISUALS: FLOATING ON DESKTOP ONLY */}
                    <div className="hidden lg:flex w-full lg:w-[45%] relative justify-end">
                         <div className="relative w-full max-w-lg aspect-square">
                             {/* TOP RIGHT: Order Notification */}
                             <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1.5, delay: 0.5 }}
                                className="absolute top-[12%] right-[-10%] w-[75%] bg-white/[0.02] border border-white/5 rounded-2xl p-6 backdrop-blur-3xl shadow-2xl z-20"
                             >
                                 <div className="flex flex-col gap-6">
                                      <span className="text-[8px] font-black opacity-20 uppercase tracking-[0.4em]">Уведомление</span>
                                      <div className="flex items-center justify-between">
                                          <span className="text-lg font-black font-cera tracking-tight">Вам поступил новый заказ</span>
                                          <div className="w-10 h-10 bg-emerald-400/10 rounded-full flex items-center justify-center shrink-0">
                                               <Check size={16} className="text-emerald-400" />
                                          </div>
                                      </div>
                                 </div>
                             </motion.div>

                             {/* BOTTOM LEFT: Balance Funding */}
                             <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1.5, delay: 0.2 }}
                                className="absolute bottom-[15%] left-[-10%] w-[70%] bg-white/[0.02] border border-white/5 text-white backdrop-blur-3xl rounded-2xl p-6 shadow-2xl z-30"
                             >
                                 <div className="flex flex-col gap-6">
                                      <span className="text-[8px] font-black opacity-20 uppercase tracking-[0.4em]">Финансы</span>
                                      <div className="flex items-center justify-between">
                                          <span className="text-xl font-black font-cera tracking-tight">+ 2,400.00 USD</span>
                                          <div className="w-10 h-10 bg-emerald-400/10 rounded-full flex items-center justify-center shrink-0">
                                               <Zap size={16} className="text-emerald-400" />
                                          </div>
                                      </div>
                                 </div>
                             </motion.div>
                         </div>
                    </div>
                </section>

                {/* 2. THE INFRASTRUCTURE: LINEAR ARCHITECTURAL LIST (MOBILE OPTIMIZED) */}
                <section className="py-24 md:py-48 px-6 md:px-32 relative overflow-hidden bg-[#050506]">
                    <div className="max-w-[1700px] mx-auto flex flex-col">
                        
                        <div className="flex flex-col gap-4 mb-20 md:mb-40 items-center md:items-start text-center md:text-left">
                             <span className="text-[9px] font-black opacity-20 tracking-[1em] uppercase">Architecture</span>
                             <h2 className="text-4xl md:text-7xl font-black font-cera uppercase leading-[0.85] tracking-tighter">
                                ПЛОТНОСТЬ <br /> <span className="text-white/10">ИНФРАСТРУКТУРЫ.</span>
                             </h2>
                        </div>

                        {/* LINEAR ROWS */}
                        <div className="flex flex-col border-t border-white/5">
                            
                            {[
                                { id: "01", title: "ECOSYSTEM", desc: "Развертывание проектов за миллисекунды. Среда, где ресурсы распределяются динамически." },
                                { id: "02", title: "SECURITY", desc: "Шифрование военного уровня и автоматический аудит. Ваша интеллектуальная собственность в безопасности." },
                                { id: "03", title: "FINANCIALS", desc: "Мгновенные выплаты и автоматизация отчетности. Прозрачный леджер для каждого участника." },
                                { id: "04", title: "NETWORK", desc: "Прямой доступ к лучшим студиям. Верифицированная сеть технологических партнеров." }
                            ].map((item, idx) => (
                                <div key={item.id} className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-10 py-12 lg:py-20 border-b border-white/5 hover:bg-white/[0.01] transition-all group relative cursor-default">
                                     
                                     {/* ID & TITLE */}
                                     <div className="lg:col-span-4 flex items-baseline gap-6 lg:gap-12">
                                          <span className="text-[10px] font-mono font-black opacity-10 group-hover:opacity-40 transition-opacity">{item.id}</span>
                                          <h3 className="text-4xl md:text-8xl font-black font-cera uppercase tracking-[-0.05em] leading-none group-hover:text-[var(--accent-cyan)] transition-colors duration-500">
                                              {item.title}
                                          </h3>
                                     </div>

                                     {/* VISUAL DIVIDER (HIDDEN ON MOBILE) */}
                                     <div className="hidden lg:flex lg:col-span-3 items-center justify-center pointer-events-none overflow-hidden">
                                          <div className="w-full flex items-center gap-2 pr-10">
                                               <div className="h-[1px] flex-1 bg-white opacity-5 group-hover:opacity-20 transition-all duration-1000 scale-x-0 group-hover:scale-x-100 origin-left" />
                                               {[...Array(idx + 3)].map((_, i) => (
                                                   <div key={i} className="w-1 h-1 bg-white rounded-full opacity-5 group-hover:opacity-40" />
                                               ))}
                                          </div>
                                     </div>

                                     {/* DESCRIPTION */}
                                     <div className="lg:col-span-5 flex flex-col justify-center">
                                          <p className="text-xs md:text-sm font-black opacity-30 uppercase tracking-[0.2em] md:tracking-[0.3em] leading-relaxed max-w-lg group-hover:opacity-60 transition-opacity">
                                               {item.desc}
                                          </p>
                                     </div>

                                     <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-cyan)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10" />
                                </div>
                            ))}

                        </div>
                    </div>
                </section>

                {/* FOOTER: MOBILE FRIENDLY */}
                <footer className="py-16 px-6 md:px-32 flex flex-col md:flex-row items-center justify-between bg-black/40 backdrop-blur-3xl border-t border-white/5 gap-12 group">
                      <div className="flex flex-col md:flex-row items-center gap-6">
                           <span className="text-[10px] font-black uppercase opacity-20 group-hover:opacity-40 transition-opacity text-center md:text-left tracking-widest">
                                © 2026 ТВЭЛВИ. Все права защищены.
                           </span>
                      </div>
                      
                      <div className="flex items-center gap-10">
                          {/* TG: OFFICIAL SVG */}
                          <a href="https://t.me/tvelvi_it" target="_blank" rel="noopener noreferrer" className="opacity-20 hover:opacity-100 hover:scale-125 hover:text-[#229ED9] transition-all">
                              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .33z"/></svg>
                          </a>
                          
                          {/* WA: OFFICIAL SVG */}
                          <a href="https://wa.me/message/GEJZ2WL6QLI2K1" target="_blank" rel="noopener noreferrer" className="opacity-20 hover:opacity-100 hover:scale-125 hover:text-[#25D366] transition-all">
                              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12.012 2c-5.508 0-9.991 4.483-9.991 9.991 0 1.76.457 3.475 1.326 4.978L2.001 22l5.163-1.355c1.455.793 3.09 1.213 4.756 1.213l.004-.001c5.508 0 10.038-4.529 10.038-10.038.001-5.512-4.437-9.821-9.95-9.821zm4.722 13.921c-.244.688-1.42 1.261-1.956 1.341-.536.081-1.18.113-1.9-.116-.394-.125-.916-.289-1.579-.574-2.831-1.213-4.665-4.085-4.806-4.272-.141-.186-1.139-1.516-1.139-2.893 0-1.376.719-2.053 1.016-2.355.297-.302.646-.377.861-.377.216 0 .432.001.621.01.199.009.467-.075.731.564.264.639.904 2.2.983 2.358.079.158.132.342.026.549-.105.207-.158.337-.314.516-.157.179-.328.399-.469.536-.158.154-.321.322-.138.639.183.316.812 1.34 1.742 2.167.93.827 1.71 1.082 2.026 1.24.316.158.501.132.688-.076.188-.207.791-.917 1.002-1.233.21-.316.422-.263.712-.158.29.105 1.84.869 2.156 1.027.316.158.528.237.607.37.079.132.079.766-.165 1.454z"/></svg>
                          </a>

                          {/* VK: OFFICIAL SVG */}
                          <a href="https://vk.com/tvelvi" target="_blank" rel="noopener noreferrer" className="opacity-20 hover:opacity-100 hover:scale-125 hover:text-[#0077FF] transition-all">
                               <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12c0 6.627 5.373 12 12 12s12-5.373 12-12c0-6.627-5.373-12-12-12zm5.723 16.5h-1.632c-.592 0-.776-.472-1.848-1.544-1.112-1.072-1.444-1.2-1.684-1.2-.336 0-.432.1-.432.584v1.2c0 .36-.12.96-1.152.96-1.632 0-3.352-1.152-4.632-2.928-1.92-2.688-2.604-5.264-2.604-5.744 0-.216.084-.416.324-.416h1.632c.216 0 .312.1.396.336.192.6 1.056 2.76 2.256 4.344.408.552.564.732.78.732.12 0 .216-.048.216-.444V9.66c-.024-.624-.36-.672-.36-.888 0-.104.084-.216.216-.216h2.568c.18 0 .24.1.24.324v3.42c0 .372.168.492.276.492.192 0 .432-.12.864-.552 1.344-1.656 2.064-4.596 2.064-4.596.06-.156.168-.24.384-.24h1.632c.456 0 .552.228.456.456-.252.612-2.316 4.092-2.316 4.092-.12.192-.168.288 0 .516.12.156.552.54 1.152 1.152.888.888 1.62 1.728 1.836 2.28.096.24 0 .516-.468.516z"/></svg>
                          </a>
                      </div>
                </footer>
            </main>
        </div>
    );
}
