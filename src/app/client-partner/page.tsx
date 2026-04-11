"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUserPhone, saveUserData, setActiveRole } from "@/utils/userData";
import "./client-partner.css";

export default function ClientPartnerPage() {
  const router = useRouter();
  const [isExiting, setIsExiting] = useState(false);

  const handlePartnerSelect = async () => {
    const phone = getCurrentUserPhone();
    if (phone) {
      await saveUserData(phone, { isPartner: true });
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
    <div className={`cp-wrapper ${isExiting ? 'cp-exit' : ''}`}>
      <div className="cp-bg-glow" />
      <div className="cp-bg-glow-secondary" />
      
      {/* Decorative Floating Elements */}
      <div className="cp-decor-1 pulse-subtle" />
      <div className="cp-decor-2 pulse-subtle delay-500" />
      <div className="cp-decor-3 pulse-subtle delay-1000" />
      
      <div className={`cp-container ${isExiting ? 'cp-exit-content' : ''}`}>
        {/* Hexagon Illustration Area */}
        <div className="cp-illustration animate-in-fade">
          <div className="cp-glow-center" />
          <div className="cp-svg-container pulse-subtle">
            <svg width="257" height="305" viewBox="59 93 257 305" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M150.125 106.156C173.562 92.6248 202.438 92.6248 225.875 106.156L278.913 136.777C302.35 150.309 316.788 175.316 316.788 202.379V263.621C316.788 290.684 302.35 315.691 278.913 329.223L225.875 359.844C202.804 373.164 174.463 373.372 151.228 360.469L150.125 359.844L97.0869 329.223C73.65 315.691 59.2119 290.684 59.2119 263.621V202.379C59.2119 175.316 73.65 150.309 97.0869 136.777L150.125 106.156Z" stroke="var(--accent-cyan)" strokeOpacity="0.15" strokeWidth="0.8"/>
              <path d="M173.125 140.704C182.33 135.39 193.67 135.39 202.875 140.704L260.493 173.97C269.698 179.284 275.368 189.106 275.368 199.734V266.266C275.368 276.894 269.698 286.716 260.493 292.03L202.875 325.296C193.67 330.61 182.33 330.61 173.125 325.296L115.507 292.03C106.302 286.716 100.632 276.894 100.632 266.266V199.734C100.632 189.106 106.302 179.284 115.507 173.97L173.125 140.704Z" stroke="var(--accent-cyan)" strokeOpacity="0.3" strokeWidth="0.8"/>
              <path d="M167.125 131.291C180.042 123.834 195.958 123.834 208.875 131.291L265.645 164.068C278.562 171.526 286.52 185.308 286.52 200.224V265.776C286.52 280.692 278.562 294.475 265.645 301.933L208.875 334.708C195.958 342.166 180.042 342.166 167.125 334.708L110.354 301.933C97.4371 294.475 89.4795 280.692 89.4795 265.776V200.224C89.4795 185.308 97.4373 171.526 110.354 164.068L167.125 131.291Z" stroke="var(--accent-cyan)" strokeOpacity="0.25" strokeWidth="0.8"/>
              <path d="M178 147.774C184.188 144.201 191.812 144.201 198 147.774L256.808 181.726C262.996 185.299 266.808 191.902 266.808 199.047V266.953C266.808 274.098 262.996 280.701 256.808 284.273L198 318.227C191.812 321.799 184.188 321.799 178 318.227L119.192 284.273C113.004 280.701 109.192 274.098 109.192 266.953V199.047C109.192 191.902 113.004 185.299 119.192 181.726L178 147.774Z" fill="var(--bg-color)" stroke="var(--accent-cyan)"/>
              <path d="M172 217.086C172.934 214.273 174.644 211.769 176.944 209.847C179.244 207.925 182.045 206.662 185.032 206.198C188.02 205.735 191.079 206.088 193.874 207.219C196.669 208.351 199.089 210.217 200.868 212.61C202.646 215.003 203.712 217.829 203.949 220.778C204.187 223.727 203.586 226.684 202.212 229.32C200.839 231.956 198.75 234.168 196.171 235.713C193.592 237.259 190.626 238.077 187.601 238.077V243.426M187.873 259.464V259.999L187.328 260V259.464H187.873Z" stroke="var(--accent-cyan)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        <div className="cp-content animate-in-up">
          <h2 className="cp-title">Кто вы?</h2>
          <p className="cp-subtitle">
            Клиенты оформляют заказы и управляют проектами. Партнеры публикуют свои IT-услуги и пакеты
          </p>
        </div>

        <div className="cp-actions animate-in-up delay-100">
          <button onClick={handlePartnerSelect} className="cp-btn-outline">
            Размещаю услуги
          </button>
          <button onClick={handleClientSelect} className="cp-btn-primary">
            Ищу исполнителя
          </button>
        </div>
      </div>
    </div>
  );
}
