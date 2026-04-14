"use client";

import { useState, useEffect, Suspense, useRef } from "react";
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

<<<<<<< HEAD
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 4);
    const newCode = ["", "", "", ""];
    for (let i = 0; i < val.length; i++) {
=======
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus input on load
    inputRef.current?.focus();
    
    // Maintain focus on click anywhere
    const handleGlobalClick = () => inputRef.current?.focus();
    window.addEventListener("click", handleGlobalClick);
    return () => window.removeEventListener("click", handleGlobalClick);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 4);
    const newCode = ["", "", "", ""];
    for (let i = 0 ; i < val.length; i++) {
>>>>>>> f0ae42b902bf138f49fc2fb21aade7312fa498cf
        newCode[i] = val[i];
    }
    setCode(newCode);
  };

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

<<<<<<< HEAD
          <div className="relative">
            <input
              type="tel"
              pattern="[0-9]*"
              inputMode="numeric"
              autoFocus
              className="absolute inset-0 opacity-0 cursor-default"
              value={code.join("")}
              onChange={handleInputChange}
            />
            <div className="code-inputs pointer-events-none">
              {code.map((digit, index) => (
                <div 
                  key={index} 
                  className={`code-box ${code.findIndex(d => d === "") === index ? 'active' : ''} ${digit !== "" ? 'filled' : ''}`}
                >
                  {digit}
                </div>
              ))}
            </div>
=======
          <div className="code-inputs relative">
            {/* Hidden Input for Mobile Keyboard */}
            <input
              ref={inputRef}
              type="tel"
              pattern="[0-9]*"
              inputMode="numeric"
              maxLength={4}
              value={code.join("")}
              onChange={handleInputChange}
              className="absolute inset-0 opacity-0 w-full h-full cursor-default caret-transparent pointer-events-none"
              autoFocus
            />
            {code.map((digit, index) => (
              <div 
                key={index} 
                className={`code-box ${code.findIndex(d => d === "") === index ? 'active' : ''} ${digit !== "" ? 'filled' : ''}`}
              >
                {digit}
              </div>
            ))}
>>>>>>> f0ae42b902bf138f49fc2fb21aade7312fa498cf
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
