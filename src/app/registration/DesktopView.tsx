"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUserPhone } from "@/utils/userData";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function DesktopView() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const existingPhone = getCurrentUserPhone();
    if (existingPhone) {
      if (existingPhone === "79999999999") {
        router.replace("/admin");
      } else {
        router.replace("/client-partner");
      }
    }
  }, [router]);

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (!numbers) return "";

    let formatted = numbers.startsWith("8") ? "7" + numbers.slice(1) : numbers;
    if (!formatted.startsWith("7") && formatted.length > 0) formatted = "7" + formatted;
    
    formatted = formatted.slice(0, 11);

    if (formatted.length <= 1) return "+7";
    if (formatted.length <= 4) return `+7 (${formatted.slice(1)}`;
    if (formatted.length <= 7) return `+7 (${formatted.slice(1, 4)}) ${formatted.slice(4)}`;
    if (formatted.length <= 9) return `+7 (${formatted.slice(1, 4)}) ${formatted.slice(4, 7)}-${formatted.slice(7)}`;
    return `+7 (${formatted.slice(1, 4)}) ${formatted.slice(4, 7)}-${formatted.slice(7, 9)}-${formatted.slice(9, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formatted = formatPhone(rawValue);
    setPhone(formatted);

    const digits = formatted.replace(/\D/g, "");
    
    if (digits.length >= 2) {
      if (digits[1] !== "9") {
        setIsError(true);
        setIsValid(false);
      } else if (digits.length === 11) {
        setIsError(false);
        setIsValid(true);
      } else {
        setIsError(false);
        setIsValid(false);
      }
    } else {
      setIsError(false);
      setIsValid(false);
    }
  };

  const handleLogin = () => {
    if (isValid) {
      setIsExiting(true);
      const phoneNumber = phone.replace(/\D/g, "");
      setTimeout(() => {
          router.push(`/code?phone=${encodeURIComponent(phoneNumber)}`);
      }, 800);
    }
  };

  return (
    <div className="w-full h-full min-h-screen flex items-center justify-center relative bg-transparent overflow-hidden text-white font-sans selection:bg-[var(--accent-cyan)] selection:text-black">
      
      {/* Deep cinematic vignette */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(10,10,12,0.85)_100%)]" />
      
      {/* Soft interactive glow */}
      <div 
        className="absolute w-[100vw] h-[100vh] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.25] transition-opacity duration-1000 z-0 pointer-events-none mix-blend-screen"
        style={{ 
            background: 'radial-gradient(circle at center, rgba(0,240,255,0.15) 0%, transparent 60%)',
            opacity: isFocused ? 0.4 : 0.15 
        }}
      />

      <AnimatePresence>
        {!isExiting && (
          <motion.div 
            initial={{ opacity: 0, filter: "blur(20px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: -50, filter: "blur(30px)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="z-10 w-full h-screen grid grid-cols-1 lg:grid-cols-2"
          >
            
            {/* === LEFT COLUMN: HUGE MINIMALIST TYPOGRAPHY === */}
            <div className="hidden lg:flex flex-col justify-center pl-16 xl:pl-32 relative text-left group">
                <div className="relative pl-8">
                    <h1 
                        className="text-[13vw] xl:text-[11vw] font-black leading-none transition-all duration-700 ease-out z-10"
                        style={{ 
                            WebkitTextStroke: isFocused ? '0px transparent' : '2px rgba(255,255,255,0.15)',
                            color: isFocused ? 'var(--accent-cyan)' : 'transparent',
                            textShadow: isFocused ? '0 0 100px rgba(0, 240, 255, 0.4)' : 'none',
                            fontFamily: 'var(--font-cera)',
                            transform: isFocused ? "scale(1.02) translateX(2%)" : "scale(1) translateX(0%)",
                            willChange: 'transform, color, text-shadow'
                        }}
                    >
                        ВХОД
                    </h1>
                    
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="mt-6 text-[var(--text-secondary)] text-xl xl:text-2xl max-w-sm font-light leading-relaxed"
                    >
                        Единая учетная запись для клиентов и партнеров ТВЕЛЬФ.
                    </motion.div>
                </div>
            </div>

            {/* === RIGHT COLUMN: THE ZERO-UI FORM === */}
            <div className="flex flex-col justify-center px-10 md:px-24 xl:px-40 relative z-10 w-full">
                
                <div className="w-full max-w-lg mx-auto lg:mx-0">
                    <div className="flex flex-col gap-16">
                        
                        {/* Huge "Zero UI" Input Field */}
                        <div className="relative group w-full mt-12 flex flex-col justify-end min-h-[120px]">
                            
                            {/* Seamless floating placeholder hint */}
                            <motion.span 
                                className="absolute left-0 text-white/20 uppercase tracking-[0.3em] font-medium text-xs md:text-sm pointer-events-none transition-all duration-500 ease-out"
                                animate={{
                                    top: isFocused || phone ? "-20px" : "30px",
                                    opacity: isFocused || phone ? 1 : 0.5,
                                    color: isFocused ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.2)'
                                }}
                            >
                                {isFocused || phone ? "Ваш телефон" : "Нажмите, чтобы ввести номер"}
                            </motion.span>
                            
                            <input
                                type="tel"
                                value={phone}
                                onChange={handlePhoneChange}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                className="w-full bg-transparent border-none py-2 text-4xl lg:text-5xl text-left outline-none font-light tracking-widest transition-colors duration-300 placeholder:text-transparent"
                                placeholder="+7"
                                style={{ 
                                    fontFamily: 'var(--font-mono)',
                                    color: isFocused ? (isError ? '#FF8C67' : 'var(--text-primary)') : 'var(--text-primary)',
                                    textShadow: isFocused && !isError ? '0 0 30px rgba(0, 240, 255, 0.4)' : 'none'
                                }}
                            />
                            
                            {/* Premium animated bottom line */}
                            <div className="w-full h-[2px] bg-white/10 mt-4 relative overflow-hidden rounded-full">
                                <motion.div 
                                    initial={{ width: "0%", opacity: 0 }}
                                    animate={{ 
                                        width: isFocused ? "100%" : (phone ? "100%" : "0%"),
                                        opacity: isFocused ? 1 : (phone ? 0.3 : 0)
                                    }}
                                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                    className={`absolute left-0 top-0 h-full ${isError && phone ? 'bg-[#FF8C67] shadow-[0_0_15px_#FF8C67]' : 'bg-[var(--accent-cyan)] shadow-[0_0_15px_rgba(0,240,255,0.6)]'}`}
                                />
                            </div>
                            
                            {/* Error Message */}
                            <div className="h-6 mt-4 relative w-full overflow-hidden">
                                <AnimatePresence>
                                    {isError && !isFocused && phone && (
                                        <motion.p 
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="text-[#FF8C67] text-sm font-medium tracking-wide absolute top-0"
                                        >
                                            Неверный формат номера
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Action Buttons styled like client-partner details reveal */}
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ 
                                height: isFocused || phone ? 'auto' : 0, 
                                opacity: isFocused || phone ? 1 : 0 
                            }}
                            className="overflow-hidden w-full flex flex-col gap-6"
                        >
                            <button 
                                onClick={handleLogin}
                                disabled={!isValid}
                                className={`h-20 w-full rounded-[24px] flex items-center justify-center gap-4 font-bold text-xl uppercase tracking-widest transition-all duration-300 ${isValid ? 'bg-[var(--accent-cyan)] text-black shadow-[0_0_40px_rgba(0,240,255,0.3)] hover:bg-white hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] scale-100 hover:scale-[1.02]' : 'bg-white/5 text-white/30 cursor-not-allowed border border-[var(--border-color)] scale-[0.98]'}`}
                            >
                                <span className="z-10 relative">
                                    Продолжить
                                </span>
                                <ArrowRight className={`w-6 h-6 transition-transform duration-300 ${isValid ? 'translate-x-1' : ''} z-10 relative`} />
                            </button>
                        </motion.div>

                    </div>
                </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
