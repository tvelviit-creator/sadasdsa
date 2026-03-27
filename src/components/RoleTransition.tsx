"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function RoleTransition() {
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [transitionRole, setTransitionRole] = useState<'client' | 'seller' | null>(null);
    const [customTitle, setCustomTitle] = useState<string | null>(null);
    const [customSubtitle, setCustomSubtitle] = useState<string | null>(null);

    useEffect(() => {
        const handleTransition = (e: any) => {
            setTransitionRole(e.detail.role);
            setCustomTitle(e.detail.title || null);
            setCustomSubtitle(e.detail.subtitle || null);
            setIsTransitioning(true);
            
            // Auto hide after 2 seconds (matches the timeout used in switchers)
            const timer = setTimeout(() => {
                setIsTransitioning(false);
            }, 2000);
            
            return () => clearTimeout(timer);
        };

        window.addEventListener('role-switch-start', handleTransition as EventListener);
        return () => window.removeEventListener('role-switch-start', handleTransition as EventListener);
    }, []);

    return (
        <AnimatePresence>
            {isTransitioning && (
                <motion.div
                    key="role-transition-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="fixed inset-0 z-[100000] flex items-center justify-center bg-[#0A0A0B]/80 backdrop-blur-[40px]"
                >
                    <motion.div
                         initial={{ scale: 0.9, opacity: 0, filter: "blur(10px)" }}
                         animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                         exit={{ scale: 1.1, opacity: 0, filter: "blur(20px)" }}
                         transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                         className="flex flex-col items-center"
                    >
                        <div className="relative mb-12">
                            <motion.div 
                                animate={{ 
                                    boxShadow: [
                                        `0 0 40px ${transitionRole === 'seller' ? 'rgba(255, 140, 103, 0.1)' : 'rgba(146, 255, 244, 0.1)'}`,
                                        `0 0 80px ${transitionRole === 'seller' ? 'rgba(255, 140, 103, 0.2)' : 'rgba(146, 255, 244, 0.2)'}`,
                                        `0 0 40px ${transitionRole === 'seller' ? 'rgba(255, 140, 103, 0.1)' : 'rgba(146, 255, 244, 0.1)'}`
                                    ]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="w-24 h-24 rounded-[32px] bg-[var(--card-bg)] border border-[var(--border-color)] flex items-center justify-center relative overflow-hidden"
                            >
                                <span className="text-[var(--text-primary)] font-black text-5xl font-cera translate-y-[1px]">T</span>
                                
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 1.5, ease: "easeInOut" }}
                                    className="absolute bottom-0 h-[2px]"
                                    style={{ 
                                        background: transitionRole === 'seller' ? 'var(--accent-color)' : 'var(--accent-cyan)' 
                                    }}
                                />
                            </motion.div>
                        </div>

                        <div className="text-center">
                            <motion.span 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-[10px] font-black uppercase tracking-[0.6em] text-[var(--text-secondary)] opacity-40 block mb-3"
                            >
                                {customTitle || "Переключение профиля"}
                            </motion.span>
                            
                            <motion.h2 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-4xl font-black text-[var(--text-primary)] font-cera leading-tight uppercase tracking-tighter"
                            >
                                {customSubtitle ? (
                                    <span>{customSubtitle}</span>
                                ) : (
                                    transitionRole === 'seller' ? (
                                        <>Личный кабинет<br /><span className="text-[var(--accent-color)]">Партнера</span></>
                                    ) : (
                                        <>Личный кабинет<br /><span className="text-[var(--accent-cyan)]">Клиента</span></>
                                    )
                                )}
                            </motion.h2>
                        </div>
                        
                        <div className="mt-16 w-32 h-[1px] bg-white/5 relative overflow-hidden">
                            <motion.div 
                                initial={{ left: "-100%" }}
                                animate={{ left: "100%" }}
                                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute inset-y-0 w-1/3"
                                style={{ 
                                    background: `linear-gradient(90deg, transparent, ${transitionRole === 'seller' ? 'var(--accent-color)' : 'var(--accent-cyan)'}, transparent)` 
                                }}
                            />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
