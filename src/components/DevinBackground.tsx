"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function GlobalBackground() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) {
        return <div className="fixed inset-0 -z-50 bg-[var(--bg-color)]" />;
    }

    return (
        <div className="fixed inset-0 -z-50 overflow-hidden bg-[var(--bg-color)] transition-colors duration-700">
            {/* Architectural Grid - Premium TVELVI UI */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" 
                 style={{ backgroundImage: `radial-gradient(white 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

            {/* Premium Grain Overlay for texture */}
            <div 
                className="absolute inset-0 z-10 opacity-[0.04] dark:opacity-[0.06] pointer-events-none"
                style={{ 
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'repeat',
                }}
            />

            {/* Aurora Orbs - Pure CSS/Framer Motion, 0 frame renders, insanely fast */}
            <div className="absolute inset-0 opacity-60 dark:opacity-40 transition-opacity duration-700">
                {/* Cyan Orb */}
                <motion.div
                    className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full blur-[100px] md:blur-[160px] opacity-70"
                    style={{ background: 'var(--accent-cyan)' }}
                    animate={{
                        x: ['0%', '30%', '-10%', '0%'],
                        y: ['0%', '20%', '-20%', '0%'],
                        scale: [1, 1.2, 0.9, 1]
                    }}
                    transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                />

                {/* Accent Orb (Orange/Red) */}
                <motion.div
                    className="absolute bottom-[-10%] right-[-10%] w-[70vw] h-[70vw] rounded-full blur-[120px] md:blur-[180px] opacity-60"
                    style={{ background: 'var(--accent-color)' }}
                    animate={{
                        x: ['0%', '-30%', '10%', '0%'],
                        y: ['0%', '-20%', '10%', '0%'],
                        scale: [1, 1.1, 0.8, 1]
                    }}
                    transition={{ duration: 22, repeat: Infinity, ease: "linear", delay: 1 }}
                />

                {/* Deep Purple/Blue Tech Orb */}
                <motion.div
                    className="absolute top-[30%] right-[10%] w-[50vw] h-[50vw] rounded-full blur-[90px] md:blur-[140px] opacity-50"
                    style={{ background: '#7E57C2' }}
                    animate={{
                        x: ['0%', '-20%', '20%', '0%'],
                        y: ['0%', '30%', '-10%', '0%'],
                        scale: [1, 0.9, 1.3, 1]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear", delay: 2 }}
                />
            </div>

            {/* Fade the Aurora out towards the bottom and edges */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--bg-color)]/20 to-[var(--bg-color)] z-0 pointer-events-none" />
        </div>
    );
}
