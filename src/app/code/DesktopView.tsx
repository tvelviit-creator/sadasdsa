"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { registerPhone, setCurrentUserPhone, getUserData, startRoleTransition } from "@/utils/userData";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function DesktopView() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const phoneNumber = searchParams.get("phone") || "";
  const [code, setCode] = useState<string[]>(["", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(15);
  const [maskedPhone, setMaskedPhone] = useState("");
  const [isExiting, setIsExiting] = useState(false);
  const [isFocused, setIsFocused] = useState(true);

  useEffect(() => {
    if (phoneNumber) {
      // Format as +7 ... 22-22
      const lastFour = phoneNumber.slice(-4);
      const masked = `+7 ... ${lastFour.slice(0, 2)}-${lastFour.slice(2)}`;
      setMaskedPhone(masked);
    }
  }, [phoneNumber]);

  useEffect(() => {
    if (isExiting) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      setIsFocused(true);
      if (e.key >= "0" && e.key <= "9") {
        const newCode = [...code];
        const emptyIndex = newCode.findIndex((digit) => digit === "");
        if (emptyIndex !== -1) {
          newCode[emptyIndex] = e.key;
          setCode(newCode);
        }
      }
      if (e.key === "Backspace") {
        const newCode = [...code];
        const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
        if (lastFilledIndex !== -1) {
          newCode[lastFilledIndex] = "";
          setCode(newCode);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [code, isExiting]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  useEffect(() => {
    if (code.every((digit) => digit !== "") && phoneNumber) {
      const userData = getUserData(phoneNumber);
      if (userData?.isBlocked) {
        alert("Account blocked");
        setCode(["", "", "", ""]);
        return;
      }

      setIsExiting(true);
      registerPhone(phoneNumber);
      setCurrentUserPhone(phoneNumber);
      
      // Trigger global premium animation
      startRoleTransition("client", "Авторизация", "Вход выполнен");
      
      const targetPath = phoneNumber === "79999999999" ? "/admin" : "/client-partner";
      
      setTimeout(() => router.push(targetPath), 1500);
    }
  }, [code, router, phoneNumber]);

  const filledCount = code.filter(d => d !== "").length;
  const isFullyFilled = filledCount === 4;

  return (
    <div className="w-full h-full min-h-screen flex items-center justify-center relative bg-transparent overflow-hidden text-white font-sans selection:bg-[var(--accent-cyan)] selection:text-black">
      
      {/* Background - Matched perfectly with registration */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(10,10,12,0.85)_100%)]" />
      <div 
        className="absolute w-[100vw] h-[100vh] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.25] transition-opacity duration-1000 z-0 pointer-events-none mix-blend-screen"
        style={{ 
            background: 'radial-gradient(circle at center, rgba(0,240,255,0.15) 0%, transparent 60%)',
            opacity: filledCount > 0 ? 0.4 : 0.15 
        }}
      />

      <AnimatePresence>
        {!isExiting && (
          <motion.div 
            initial={{ opacity: 0, filter: "blur(20px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: 50, filter: "blur(30px)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="z-10 w-full h-screen grid grid-cols-1 lg:grid-cols-2"
          >
            
            {/* === LEFT COLUMN: HUGE MINIMALIST TYPOGRAPHY === */}
            <div className="hidden lg:flex flex-col justify-center pl-16 xl:pl-32 relative text-left group">
                <button 
                    onClick={() => router.back()}
                    className="absolute top-16 left-16 xl:left-32 w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 transition-all duration-300 hover:scale-110 z-20"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="relative pl-8 z-10">
                    <h1 
                        className="text-[13vw] xl:text-[11vw] font-black leading-none transition-all duration-700 ease-out"
                        style={{ 
                            WebkitTextStroke: filledCount > 0 ? '0px transparent' : '2px rgba(255,255,255,0.15)',
                            color: filledCount > 0 ? 'var(--accent-cyan)' : 'transparent',
                            textShadow: filledCount > 0 ? '0 0 100px rgba(0, 240, 255, 0.4)' : 'none',
                            fontFamily: 'var(--font-cera)',
                            transform: filledCount > 0 ? "scale(1.02) translateX(2%)" : "scale(1) translateX(0%)",
                            willChange: 'transform, color, text-shadow'
                        }}
                    >
                        КОД
                    </h1>
                    
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="mt-6 text-[var(--text-secondary)] text-xl xl:text-2xl max-w-sm font-light leading-relaxed"
                    >
                        Введите проверочный код из SMS для завершения идентификации.
                    </motion.div>
                </div>
            </div>

            {/* === RIGHT COLUMN: THE CODE FORM (Responsive) === */}
            <div className="flex flex-col justify-center px-6 sm:px-10 md:px-24 xl:px-40 relative z-10 w-full h-full lg:h-auto mt-20 lg:mt-0">
                
                {/* Mobile Back Button */}
                <button 
                    onClick={() => router.back()}
                    className="lg:hidden absolute top-8 left-6 w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 transition-all duration-300 z-20"
                >
                    <ArrowLeft className="w-4 h-4" />
                </button>

                <div className="w-full max-w-lg mx-auto lg:mx-0">
                    <div className="flex flex-col gap-16">
                        
                        <div className="lg:hidden mb-4">
                            <h2 className="text-4xl font-bold font-cera text-white mb-2 tracking-tight">КОД</h2>
                            <p className="text-[var(--text-secondary)] font-light">Введит код из СМС</p>
                        </div>

                        {/* Code Inputs */}
                        <div className="w-full flex justify-between gap-3 sm:gap-6 mt-12 mx-auto lg:mx-0 max-w-[400px]">
                            {code.map((digit, index) => {
                                const isActive = code.findIndex(d => d === "") === index;
                                const isFilled = digit !== "";
                                return (
                                    <div 
                                        key={index} 
                                        className="relative flex-1 aspect-square max-w-[80px]"
                                    >
                                        <div 
                                            className={`w-full h-full flex items-center justify-center font-mono text-4xl sm:text-5xl font-light transition-all duration-500 rounded-2xl ${isFilled ? 'text-[var(--accent-cyan)] drop-shadow-[0_0_15px_rgba(0,240,255,0.4)] bg-[var(--accent-cyan)]/10 border-transparent' : (isActive ? 'text-white border-white/30 bg-white/5' : 'text-transparent border-white/10 bg-transparent')}`}
                                            style={{
                                                border: isFilled ? '1px solid var(--accent-cyan)' : (isActive ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.1)'),
                                                boxShadow: isFilled ? '0 0 30px rgba(0, 240, 255, 0.2) inset' : 'none'
                                            }}
                                        >
                                            {digit}
                                            {/* Blinking cursor for active block */}
                                            {isActive && (
                                                <motion.div 
                                                    animate={{ opacity: [1, 0, 1] }}
                                                    transition={{ repeat: Infinity, duration: 1 }}
                                                    className="w-[2px] h-1/2 bg-[var(--accent-cyan)] absolute"
                                                />
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Timer / Resend Area */}
                        <div className="flex flex-col items-start gap-2 mt-4">
                            <motion.p 
                                className="text-[var(--text-secondary)] text-sm md:text-base font-light"
                                animate={{ color: isFullyFilled ? 'rgba(0, 240, 255, 0.8)' : 'var(--text-secondary)' }}
                            >
                                Код отправлен на <span className="font-mono tracking-widest text-[var(--accent-cyan)] shadow-[0_0_10px_rgba(0,240,255,0.2)]">{maskedPhone}</span>
                            </motion.p>
                            
                            <div className="h-10 mt-2">
                                {timeLeft > 0 ? (
                                    <span className="text-[var(--text-secondary)] text-xs uppercase tracking-widest font-medium">
                                        Отправить еще раз через <span className="text-white font-mono">{timeLeft.toString().padStart(2, '0')}</span>
                                    </span>
                                ) : (
                                    <button 
                                        onClick={() => setTimeLeft(15)} 
                                        className="text-[var(--accent-cyan)] text-xs uppercase tracking-widest font-bold hover:text-white transition-colors duration-300 drop-shadow-[0_0_10px_rgba(0,240,255,0.4)]"
                                    >
                                        Отправить еще раз
                                    </button>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
