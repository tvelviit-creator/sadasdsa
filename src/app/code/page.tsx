"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { registerPhone, setCurrentUserPhone, getUserData } from "@/utils/userData";
import "../registration/registration.css";

function CodeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const phoneNumber = searchParams.get("phone") || "";
  const [code, setCode] = useState<string[]>(["", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(15);
  const [maskedPhone, setMaskedPhone] = useState("");

  useEffect(() => {
    if (phoneNumber) {
      // Format as +7 ... 22-22
      const lastFour = phoneNumber.slice(-4);
      const masked = `+7 ... ${lastFour.slice(0, 2)}-${lastFour.slice(2)}`;
      setMaskedPhone(masked);
    }
  }, [phoneNumber]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
  }, [code]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (code.every((digit) => digit !== "") && phoneNumber) {
      const userData = getUserData(phoneNumber);
      if (userData?.isBlocked) {
        alert("Account blocked");
        setCode(["", "", "", ""]);
        return;
      }

      // Start transition animation
      setIsTransitioning(true);
      
      registerPhone(phoneNumber);
      setCurrentUserPhone(phoneNumber);
      
      // If super admin, go to admin panel. Otherwise go to client-partner
      const targetPath = phoneNumber === "79999999999" ? "/admin" : "/client-partner";
      
      // Delay navigation to allow animation to complete
      setTimeout(() => router.push(targetPath), 800);
    }
  }, [code, router, phoneNumber]);

  return (
    <div className={`registration-wrapper select-none ${isTransitioning ? 'transition-exit' : ''}`}>
      {/* Background Atmosphere */}
      <div className="reg-bg-glow" />
      <div className="reg-bg-glow-secondary" />
      <div className="reg-decor-1 pulse-subtle" />
      <div className="reg-decor-2 pulse-subtle delay-300" />
      <div className="reg-decor-3 pulse-subtle delay-1000" />

      <div className={`registration-container code-entry-content ${isTransitioning ? 'transition-exit-content' : ''}`}>
        <button onClick={() => router.back()} className="code-back-btn hover:text-[var(--text-primary)] transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="animate-fade-in-up">
          <h2 className="code-title">4-х значный код</h2>
          <p className="code-subtitle text-[var(--text-secondary)]">
            Введите код из СМС, отправленное на номер <span className="text-[var(--text-primary)] font-medium">{maskedPhone}</span>
          </p>

          <div className="code-inputs">
            {code.map((digit, index) => (
              <div 
                key={index} 
                className={`code-box ${code.findIndex(d => d === "") === index ? 'active' : ''} ${digit !== "" ? 'filled' : ''}`}
              >
                {digit}
              </div>
            ))}
          </div>

          <div className="code-timer-container">
            {timeLeft > 0 ? (
              <span className="code-timer-text text-[var(--text-secondary)]">
                Отправить еще раз через <span className="text-[var(--text-primary)] tabular-nums">00:{timeLeft.toString().padStart(2, '0')}</span>
              </span>
            ) : (
              <button 
                onClick={() => setTimeLeft(15)} 
                className="code-resend-btn hover:text-[#70FFFF] transition-colors"
                style={{ color: '#70FFFF' }}
              >
                Отправить еще раз
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CodePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg-color)]" />}>
      <CodeContent />
    </Suspense>
  );
}
