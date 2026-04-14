"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUserPhone } from "@/utils/userData";
import RegistrationWelcomeSVG from "./RegistrationWelcomeSVG";
import "./registration.css";

export default function RegistrationPage() {
  const router = useRouter();
  const [showPhoneInput, setShowPhoneInput] = useState(false);

  useEffect(() => {
    // Force set theme to light for registration if needed, or just follow system
    const phone = getCurrentUserPhone();
    if (phone) {
      if (phone === "79999999999") {
        router.replace("/admin");
      } else {
        router.replace("/client-partner");
      }
    }
  }, [router]);

  const handleContinue = () => {
    setShowPhoneInput(true);
  };

  return (
    <div className="registration-wrapper select-none">
      {/* Persistent Decorative Elements across views */}
      <div className="reg-bg-glow" />
      <div className="reg-bg-glow-secondary" />
      <div className="reg-decor-1 pulse-subtle" />
      <div className="reg-decor-2 pulse-subtle delay-300" />
      <div className="reg-decor-3 pulse-subtle delay-1000" />

      {!showPhoneInput ? (
        <WelcomeView onContinue={handleContinue} />
      ) : (
        <PhoneEntryView onBack={() => setShowPhoneInput(false)} />
      )}
    </div>
  );
}

function WelcomeView({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="registration-container welcome-view-scroll">
      <div className="welcome-inner-content">
        <div className="svg-background">
          <RegistrationWelcomeSVG className="w-full h-auto" />
        </div>

        {/* Precise SVG Glow */}
        <div className="reg-user-glow animate-pulse-slow">
          <svg width="375" height="225" viewBox="0 0 375 225" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <ellipse cx="187" cy="112.5" rx="197" ry="112.5" fill="url(#paint0_radial_user_glow)"/>
            <defs>
              <radialGradient id="paint0_radial_user_glow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(187 112.5) rotate(90) scale(112.5 197)">
                <stop stop-color="#70FFFF" stop-opacity="0.8"/>
                <stop offset="1" stop-color="#70FFFF" stop-opacity="0"/>
              </radialGradient>
            </defs>
          </svg>
        </div>

        <button
          type="button"
          onClick={onContinue}
          className="svg-button-trigger-welcome pulse-button"
          aria-label="Продолжить"
        />
      </div>
    </div>
  );
}

function PhoneEntryView({ onBack }: { onBack: () => void }) {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isError, setIsError] = useState(false);

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
      const phoneNumber = phone.replace(/\D/g, "");
      router.push(`/code?phone=${encodeURIComponent(phoneNumber)}`);
    }
  };

  return (
    <div className="registration-container">
      <div className="phone-entry-content">
        <div className="animate-fade-in-up">
          <h2 className="reg-title">Начнем</h2>
          <p className="reg-subtitle">
            Введи свой номер телефона. Мы пришлем код подтверждения на него
          </p>

          <div className="reg-input-container">
            <div className={`reg-input-wrapper ${isError ? 'error' : ''}`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="reg-input-icon">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              
              <input
                type="tel"
                autoFocus
                value={phone}
                onChange={handlePhoneChange}
                placeholder="Номер телефона"
                className="reg-input-field"
              />

              {phone && (
                <button onClick={() => setPhone("")} className="reg-clear-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            {isError && (
              <p className="reg-error-text">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                Неверный формат номера
              </p>
            )}
          </div>
        </div>

        <div className="reg-actions animate-fade-in-up delay-200">
          <button className="reg-btn-outline" onClick={() => router.push('/client')}>
            Без авторизации
          </button>
          <button 
            disabled={!isValid} 
            onClick={handleLogin} 
            className="reg-btn-primary"
          >
            Продолжить
          </button>
        </div>
      </div>
    </div>
  );
}
