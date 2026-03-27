"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalPrice: number;
}

export default function PaymentModal({ isOpen, onClose, totalPrice }: PaymentModalProps) {
  const [step, setStep] = useState<"loading" | "qr">("loading");

  useEffect(() => {
    if (isOpen) {
      setStep("loading");
      const timer = setTimeout(() => {
        setStep("qr");
      }, 2500); 
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
        {/* Backdrop - High-end Blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-3xl"
        />

        {/* Modal content - Premium Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[480px] rounded-[40px] border border-white/[0.08] bg-[#0A0A0B] shadow-[0_50px_100px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col items-center p-12"
        >
          {/* Subtle Internal Glow */}
          <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,var(--accent-cyan),transparent_70%)] opacity-[0.03] pointer-events-none" />

          <AnimatePresence mode="wait">
            {step === "loading" ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-10 py-12 relative z-10"
              >
                {/* Modern Minimal Loader */}
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-[3px] border-white/[0.03] border-t-[var(--accent-cyan)] mb-4"
                  />
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-cyan)] shadow-[0_0_15px_var(--accent-cyan)]" />
                </div>
                
                <div className="space-y-2">
                   <h3 className="text-3xl font-bold font-cera uppercase tracking-tight text-center">Оформление</h3>
                   <div className="flex justify-center gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div 
                          key={i}
                          animate={{ opacity: [0.2, 1, 0.2] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                          className="w-1.5 h-1.5 rounded-full bg-[var(--accent-cyan)]"
                        />
                      ))}
                   </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="qr"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center w-full relative z-10"
              >
                <h3 className="text-xl font-bold font-gilroy uppercase tracking-widest text-white/30 mb-10">СИСТЕМА БЫСТРЫХ ПЛАТЕЖЕЙ</h3>

                <div className="mb-12 relative group">
                   {/* QR Frame Decor */}
                   <div className="absolute -inset-4 border border-white/[0.05] rounded-[40px] pointer-events-none group-hover:border-[var(--accent-cyan)]/20 transition-colors duration-500" />
                   
                   <div className="p-8 bg-white rounded-[32px] shadow-[0_20px_60px_rgba(255,255,255,0.05)]">
                      {/* Clean SVG QR Placeholder */}
                      <svg width="180" height="180" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1.2" strokeLinecap="round">
                         <path d="M2 2h6v6H2zM16 2h6v6h-6zM2 16h6v6H2z" />
                         <path d="M5 5h0M19 5h0M5 19h0M12 2v4M12 8h0M10 12h4v4h-4zM16 12h6M16 16v6M20 18h2M12 18h0M12 22h0" />
                      </svg>
                   </div>
                </div>

                <div className="text-center mb-12">
                   <p className="text-white/40 text-sm font-bold uppercase tracking-widest mb-3">Сумма к оплате</p>
                   <p className="text-5xl font-black font-cera tracking-tighter">{totalPrice.toLocaleString()} <span className="text-xl text-[var(--accent-cyan)]">₽</span></p>
                </div>

                <button 
                  onClick={onClose}
                  className="w-full h-18 py-5 rounded-[24px] bg-[var(--text-primary)] text-black font-black uppercase tracking-[0.2em] text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
                >
                  Я ОПЛАТИЛ
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Minimal Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 w-10 h-10 flex items-center justify-center rounded-full border border-[var(--border-color)] hover:bg-white/5 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white/20" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
