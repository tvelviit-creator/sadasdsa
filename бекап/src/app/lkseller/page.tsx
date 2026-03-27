"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getUserData, saveUserData, getCurrentUserPhone, logout, setActiveRole, formatPhone } from "@/utils/userData";
import { getSellerOrders, Order } from "@/utils/orders";

export default function LkSellerPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentPhone = getCurrentUserPhone();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (currentPhone) {
      const data = getUserData(currentPhone);
      if (data) {
        setName(data.name || "");
        setEmail(data.email || "");
        setPhone(data.phone || currentPhone);
        setAvatar(data.avatar || null);
      } else {
        setPhone(currentPhone);
      }

      const fetchOrders = async () => {
        try {
          const data = await getSellerOrders(currentPhone);
          setOrders(Array.isArray(data) ? data : []);
        } catch (e) {
          console.error("Failed to load seller orders", e);
          setOrders([]);
        }
      };
      fetchOrders();
    }
  }, [currentPhone]);

  const handleSave = () => {
    if (!currentPhone) return;
    saveUserData(currentPhone, { name, email, phone, avatar: avatar || undefined });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setAvatar(result);
        if (currentPhone) {
          saveUserData(currentPhone, { avatar: result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    logout();
    router.replace("/registration");
  };

  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] pb-10 font-sans overflow-x-hidden flex justify-center transition-colors duration-300">
      <div className="w-full max-w-[375px] relative min-h-screen">
        {/* Figma SVG Header */}
        <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[375px] h-[102px] z-50 transition-colors duration-300">
          <svg width="375" height="102" viewBox="0 0 375 102" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <mask id="path-1-inside-1_1555_12650" fill="white">
              <path d="M0 0H375V102H0V0Z"/>
            </mask>
            <path d="M0 0H375V102H0V0Z" fill="var(--bg-color)"/>
            <path d="M375 102V101H0V102V103H375V102Z" fill="var(--border-color)" mask="url(#path-1-inside-1_1555_12650)"/>
            <path d="M51 72L29 72M29 72L38.4286 81M29 72L38.4286 63" stroke="var(--text-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M305.024 68.0835L304.584 67.8242C304.516 67.7839 304.482 67.7637 304.449 67.7427C304.122 67.5345 303.845 67.2468 303.644 66.9026C303.623 66.868 303.604 66.8317 303.565 66.7599C303.526 66.6882 303.506 66.6519 303.488 66.6159C303.307 66.2579 303.209 65.8588 303.203 65.4526C303.203 65.4118 303.203 65.3701 303.204 65.2872L303.213 64.7459C303.227 63.8796 303.234 63.4452 303.119 63.0553C303.017 62.709 302.846 62.39 302.618 62.1193C302.361 61.8133 302.004 61.595 301.291 61.1589L300.698 60.7967C299.986 60.3619 299.63 60.1444 299.252 60.0615C298.918 59.9881 298.573 59.9915 298.24 60.0708C297.864 60.1603 297.513 60.3834 296.81 60.8295L296.806 60.8315L296.381 61.1012C296.314 61.1438 296.28 61.1653 296.247 61.1852C295.913 61.3821 295.54 61.491 295.158 61.504C295.119 61.5053 295.08 61.5053 295.002 61.5053C294.924 61.5053 294.883 61.5053 294.844 61.504C294.462 61.491 294.088 61.3815 293.753 61.1837C293.72 61.1638 293.686 61.1421 293.619 61.0993L293.191 60.8272C292.484 60.3769 292.13 60.1514 291.752 60.0615C291.417 59.9819 291.071 59.9797 290.736 60.054C290.357 60.1379 290.001 60.357 289.289 60.7952L289.286 60.7967L288.7 61.157L288.694 61.1612C287.988 61.5955 287.634 61.8131 287.379 62.1179C287.152 62.3883 286.983 62.7068 286.882 63.0522C286.767 63.4426 286.773 63.878 286.787 64.7483L286.796 65.2888C286.797 65.3707 286.799 65.4114 286.799 65.4516C286.793 65.8586 286.694 66.2585 286.512 66.6172C286.494 66.6527 286.475 66.6881 286.436 66.759C286.398 66.8299 286.379 66.8652 286.359 66.8994C286.157 67.2454 285.879 67.5348 285.549 67.7434C285.516 67.764 285.482 67.7838 285.415 67.8235L284.98 68.0786C284.258 68.5029 283.897 68.7153 283.635 69.0174C283.402 69.2848 283.227 69.6019 283.12 69.9472C282.998 70.3376 282.999 70.7754 283 71.6508L283.002 72.3663C283.004 73.2359 283.006 73.6704 283.128 74.0581C283.235 74.4011 283.409 74.7164 283.64 74.9821C283.902 75.2825 284.259 75.4935 284.976 75.9162L285.406 76.17C285.479 76.2132 285.516 76.2345 285.551 76.257C285.878 76.4657 286.154 76.7543 286.354 77.0983C286.376 77.1355 286.397 77.1741 286.439 77.2512C286.48 77.3274 286.501 77.3655 286.52 77.4037C286.696 77.7572 286.79 78.1499 286.797 78.5496C286.797 78.5928 286.797 78.6364 286.795 78.7242L286.787 79.2429C286.773 80.1162 286.767 80.5534 286.882 80.9449C286.984 81.2912 287.155 81.6102 287.383 81.8809C287.64 82.1869 287.997 82.405 288.711 82.8411L289.303 83.2032C290.015 83.6381 290.371 83.8553 290.749 83.9382C291.083 84.0116 291.428 84.0087 291.761 83.9295C292.138 83.8398 292.49 83.6159 293.195 83.1686L293.62 82.8989C293.687 82.8562 293.721 82.8349 293.755 82.815C294.089 82.6181 294.461 82.5086 294.843 82.4956C294.882 82.4943 294.921 82.4943 294.999 82.4943C295.078 82.4943 295.117 82.4943 295.155 82.4956C295.538 82.5087 295.913 82.6185 296.248 82.8162C296.277 82.8336 296.307 82.8524 296.358 82.8854L296.81 83.1729C297.518 83.6232 297.871 83.848 298.249 83.938C298.583 84.0175 298.93 84.0208 299.265 83.9465C299.644 83.8626 300.001 83.643 300.712 83.2051L301.307 82.8394C302.013 82.4049 302.367 82.187 302.622 81.8821C302.849 81.6117 303.019 81.2933 303.12 80.9479C303.234 80.5603 303.227 80.1283 303.213 79.2706L303.204 78.7112C303.203 78.6293 303.203 78.5886 303.203 78.5483C303.209 78.1413 303.307 77.7412 303.488 77.3825C303.506 77.3471 303.525 77.3113 303.564 77.2407C303.603 77.1698 303.623 77.1344 303.643 77.1002C303.845 76.7542 304.123 76.4646 304.453 76.256C304.485 76.2356 304.518 76.2161 304.584 76.1774L304.587 76.1762L305.021 75.9212C305.743 75.4969 306.104 75.2843 306.367 74.9821C306.599 74.7148 306.775 74.3981 306.882 74.0528C307.002 73.6647 307.001 73.2295 307 72.3643L306.998 71.6334C306.996 70.7638 306.995 70.3294 306.874 69.9416C306.766 69.5986 306.591 69.2834 306.36 69.0176C306.099 68.7176 305.741 68.5065 305.026 68.0846L305.024 68.0835Z" stroke="var(--text-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M290.199 72.0001C290.199 74.812 292.348 77.0915 295 77.0915C297.652 77.0915 299.802 74.812 299.802 72.0001C299.802 69.1882 297.652 66.9087 295 66.9087C292.348 66.9087 290.199 69.1882 290.199 72.0001Z" stroke="var(--text-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M335 75.375L338.375 72M338.375 72L335 68.625M338.375 72H326M331.625 66.6547V66.6002C331.625 65.3401 331.625 64.7096 331.87 64.2283C332.086 63.8049 332.43 63.461 332.853 63.2452C333.335 63 333.965 63 335.225 63H340.4C341.66 63 342.29 63 342.771 63.2452C343.194 63.461 343.539 63.8049 343.755 64.2283C344 64.7091 344 65.3389 344 66.5965V77.404C344 78.6617 344 79.2905 343.755 79.7714C343.539 80.1947 343.194 80.5393 342.771 80.755C342.29 81 341.661 81 340.403 81H335.222C333.964 81 333.334 81 332.853 80.755C332.43 80.5393 332.086 80.1944 331.87 79.771C331.625 79.2897 331.625 78.6601 331.625 77.4V77.3438" stroke="var(--logout-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M131.176 64.16H144.424V80H141.184V67.088H134.416V80H131.176V64.16ZM154.509 67.856C155.613 67.856 156.597 68.128 157.461 68.672C158.341 69.2 159.029 69.936 159.525 70.88C160.021 71.808 160.269 72.864 160.269 74.048C160.269 75.232 160.021 76.296 159.525 77.24C159.029 78.184 158.341 78.928 157.461 79.472C156.597 80.016 155.613 80.288 154.509 80.288C153.789 80.288 153.125 80.168 152.517 79.928C151.909 79.672 151.389 79.312 150.957 78.848V84.32H147.717V68.12H150.693V69.608C151.093 69.048 151.621 68.616 152.277 68.312C152.949 68.008 153.693 67.856 154.509 67.856ZM153.909 77.336C154.773 77.336 155.501 77.04 156.093 76.448C156.685 75.84 156.981 75.048 156.981 74.072C156.981 73.08 156.685 72.288 156.093 71.696C155.517 71.088 154.789 70.784 153.909 70.784C153.093 70.784 152.389 71.064 151.797 71.624C151.205 72.168 150.909 72.976 150.909 74.048C150.909 75.104 151.197 75.92 151.773 76.496C152.365 77.056 153.077 77.336 153.909 77.336ZM168.475 80.264C167.307 80.264 166.235 79.992 165.259 79.448C164.299 78.888 163.539 78.136 162.979 77.192C162.419 76.232 162.139 75.184 162.139 74.048C162.139 72.912 162.419 71.872 162.979 70.928C163.539 69.968 164.307 69.216 165.283 68.672C166.259 68.128 167.331 67.856 168.499 67.856C169.667 67.856 170.739 68.136 171.715 68.696C172.691 69.24 173.459 69.984 174.019 70.928C174.595 71.872 174.883 72.912 174.883 74.048C174.883 75.184 174.595 76.232 174.019 77.192C173.459 78.136 172.683 78.888 171.691 79.448C170.715 79.992 169.643 80.264 168.475 80.264ZM168.499 77.288C169.379 77.288 170.107 76.984 170.683 76.376C171.275 75.768 171.571 75 171.571 74.072C171.571 73.144 171.275 72.368 170.683 71.744C170.107 71.12 169.379 70.808 168.499 70.808C167.603 70.808 166.867 71.12 166.291 71.744C165.715 72.352 165.427 73.128 165.427 74.072C165.427 75 165.715 75.768 166.291 76.376C166.867 76.984 167.603 77.288 168.499 77.288ZM189.949 77.264V83.384H186.853V80H178.741V83.384H175.645V77.264H176.917C177.397 76.8 177.741 76.08 177.949 75.104C178.173 74.128 178.317 72.784 178.381 71.072L178.477 68.12H187.981V77.264H189.949ZM180.229 77.264H184.765V70.856H181.357L181.333 71.552C181.269 74.032 180.901 75.936 180.229 77.264ZM197.191 67.856C198.743 67.856 199.975 68.296 200.887 69.176C201.815 70.04 202.279 71.296 202.279 72.944V80H199.303V78.848C198.871 79.296 198.343 79.648 197.719 79.904C197.111 80.16 196.431 80.288 195.679 80.288C194.415 80.288 193.415 79.96 192.679 79.304C191.943 78.632 191.575 77.776 191.575 76.736C191.575 75.664 191.975 74.824 192.775 74.216C193.591 73.592 194.687 73.28 196.063 73.28H199.039V72.752C199.039 72.096 198.847 71.584 198.463 71.216C198.095 70.848 197.551 70.664 196.831 70.664C196.223 70.664 195.679 70.8 195.199 71.072C194.719 71.328 194.215 71.736 193.687 72.296L192.007 70.304C193.383 68.672 195.111 67.856 197.191 67.856ZM196.543 77.912C197.247 77.912 197.839 77.696 198.319 77.264C198.799 76.816 199.039 76.248 199.039 75.56V75.416H196.495C195.967 75.416 195.559 75.52 195.271 75.728C194.983 75.92 194.839 76.216 194.839 76.616C194.839 77.016 194.991 77.336 195.295 77.576C195.615 77.8 196.031 77.912 196.543 77.912ZM214.205 73.64C214.781 73.896 215.229 74.256 215.549 74.72C215.885 75.184 216.053 75.736 216.053 76.376C216.053 77.08 215.869 77.712 215.501 78.272C215.133 78.816 214.621 79.24 213.965 79.544C213.325 79.848 212.597 80 211.781 80H205.469V68.12H210.989C212.205 68.12 213.205 68.424 213.989 69.032C214.773 69.624 215.165 70.432 215.165 71.456C215.165 72.32 214.845 73.048 214.205 73.64ZM208.541 72.752H210.797C211.757 72.752 212.237 72.384 212.237 71.648C212.237 71.264 212.117 70.984 211.877 70.808C211.637 70.632 211.277 70.544 210.797 70.544H208.541V72.752ZM211.421 77.6C211.933 77.6 212.333 77.48 212.621 77.24C212.925 77 213.077 76.68 213.077 76.28C213.077 75.88 212.925 75.568 212.621 75.344C212.333 75.12 211.933 75.008 211.421 75.008H208.541V77.6H211.421ZM229.583 75.152H221.255C221.447 75.904 221.831 76.488 222.407 76.904C222.999 77.304 223.727 77.504 224.591 77.504C225.759 77.504 226.863 77.104 227.903 76.304L229.247 78.512C227.839 79.696 226.255 80.288 224.495 80.288C223.263 80.288 222.151 80.016 221.159 79.472C220.167 78.928 219.391 78.184 218.831 77.24C218.271 76.28 217.991 75.224 217.991 74.072C217.991 72.92 218.263 71.872 218.807 70.928C219.351 69.968 220.095 69.216 221.039 68.672C221.999 68.128 223.055 67.856 224.207 67.856C225.295 67.856 226.263 68.104 227.111 68.6C227.959 69.08 228.615 69.744 229.079 70.592C229.559 71.424 229.799 72.352 229.799 73.376C229.799 73.952 229.727 74.544 229.583 75.152ZM224.087 70.472C223.399 70.472 222.799 70.688 222.287 71.12C221.775 71.552 221.431 72.136 221.255 72.872H226.655C226.639 72.136 226.383 71.552 225.887 71.12C225.391 70.688 224.791 70.472 224.087 70.472ZM241.783 80H232.399V68.12H235.615V77.264H239.695V68.12H242.911V77.264H244.879V83.384H241.783V80Z" fill="var(--text-primary)"/>
          </svg>
          
          {/* Invisible Functional Overlays */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            {/* Back Button Overlay */}
            <button 
              onClick={() => router.push("/seller")}
              className="absolute left-[20px] bottom-[15px] w-[50px] h-[40px] pointer-events-auto active:opacity-50 transition-opacity"
              aria-label="Назад"
            />
            
            {/* Settings Button Overlay */}
            <button 
              onClick={() => router.push("/setting-new")}
              className="absolute right-[65px] bottom-[15px] w-[45px] h-[45px] pointer-events-auto active:opacity-50 transition-opacity"
              aria-label="Настройки"
            />
            
            {/* Logout Button Overlay */}
            <button 
              onClick={handleLogout}
              className="absolute right-[20px] bottom-[15px] w-[45px] h-[45px] pointer-events-auto active:opacity-50 transition-opacity"
              aria-label="Выход"
            />
          </div>
        </header>

        <main className="px-6 space-y-8 pt-[124px]">
          {/* Profile Avatar Section */}
          <div className="flex flex-col items-center">
            {avatar ? (
              <div className="w-[124px] h-[124px] rounded-[32px] overflow-hidden border border-[var(--border-color)] shadow-2xl">
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-[124px] h-[124px] bg-[#FF3B30] rounded-[32px] flex items-center justify-center text-center p-4 shadow-2xl shadow-[#FF3B30]/20">
                <span className="text-white tvelvi-h6">Ignite Pass</span>
              </div>
            )}
          </div>

          {/* Form Fields */}
            <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[var(--text-secondary)] tvelvi-s ml-1">Имя</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={handleSave}
                className="w-full h-[64px] bg-[var(--nav-bg)] rounded-[24px] px-6 tvelvi-m text-[var(--text-primary)] border border-[var(--border-color)] focus:outline-none transition-all placeholder:text-[var(--text-secondary)]"
                placeholder="Иван Петров"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[var(--text-secondary)] tvelvi-s ml-1">Почта</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={handleSave}
                className="w-full h-[64px] bg-[var(--nav-bg)] rounded-[24px] px-6 tvelvi-m text-[var(--text-primary)] border border-[var(--border-color)] focus:outline-none transition-all placeholder:text-[var(--text-secondary)]"
                placeholder="example@gmail.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[var(--text-secondary)] tvelvi-s ml-1">Номер телефона</label>
              <div className="w-full h-[64px] bg-[var(--nav-bg)] rounded-[24px] px-6 flex items-center tvelvi-m text-[var(--text-primary)] border border-[var(--border-color)]">
                {phone ? formatPhone(phone) : "+7 (900) 444 22-22"}
              </div>
            </div>
          </div>

          {/* Avatar Upload Area - Matching SVG Design */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full min-h-[181px] rounded-[24px] border-2 border-dashed border-[var(--border-color)] flex flex-col items-center justify-center gap-2 cursor-pointer active:bg-white/5 transition-all bg-transparent p-6"
          >
            {/* Cloud Icon from SVG */}
            <svg width="54" height="35" viewBox="137.5 25 54 35" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-1">
              <path d="M164.5 52.4999V37.4999M164.5 37.4999L157.136 42.4999M164.5 37.4999L171.864 42.4999M191.5 49.9999C191.5 44.4771 187.104 39.9999 181.682 39.9999C181.624 39.9999 181.567 40.0004 181.509 40.0015C180.319 31.52 173.156 25 164.5 25C157.635 25 151.712 29.1001 148.96 35.027C142.561 35.4536 137.5 40.8745 137.5 47.4995C137.5 54.403 142.995 60 149.773 60L181.682 59.9998C187.104 59.9998 191.5 55.5227 191.5 49.9999Z" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>

            <p className="text-[var(--text-secondary)] text-[14px] font-medium mb-4">Загрузите файл аватара</p>

            <div className="w-full max-w-[279px] h-[44px] bg-[var(--text-secondary)] rounded-full flex items-center justify-center active:scale-95 transition-all shadow-lg">
              <span className="text-[var(--bg-color)] text-[16px] font-bold">Выбрать файл</span>
            </div>

            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </div>

          {/* Role Switch Button - SVG Style */}
          <button
            onClick={() => {
              setActiveRole("client");
              router.push("/profile");
            }}
            className="w-full h-[56px] active:scale-[0.98] transition-all group mt-4 mb-4"
          >
            <svg width="100%" height="56" viewBox="0 0 327 56" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0.5" y="0.5" width="326" height="55" rx="27.5" fill="var(--bg-color)" />
              <rect x="0.5" y="0.5" width="326" height="55" rx="27.5" stroke="var(--text-primary)" className="group-hover:stroke-[var(--text-primary)] transition-colors" />
              <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="var(--text-primary)" className="tvelvi-h6 tracking-wider" style={{ fontFamily: 'var(--font-cera), sans-serif', fontWeight: 700 }}>
                Я клиент
              </text>
            </svg>
          </button>

          <section id="orders-section" className="mt-12 space-y-6 pb-20">
            <h2 className="text-[24px] font-bold text-[var(--text-primary)] px-2 mb-4" style={{ fontFamily: 'var(--font-cera), sans-serif' }}>Заказы</h2>
            <div className="flex flex-col gap-[16px]">
              {orders.length === 0 ? (
                <div className="text-center py-20 text-[var(--text-secondary)]/50 font-normal text-[16px]">
                  Заказов не найдено
                </div>
              ) : (
                orders.map((order) => {
                  const getStatusInfo = (order: Order) => {
                    const s = order.status;
                    const stage = order.stage;
                    if (s === 'cancelled') return { text: 'Отмена', bg: 'bg-[#FF8C67]' };
                    if (s === 'completed' || (stage as string) === 'ready') return { text: 'Готов', bg: 'bg-[#4AC99B]' };
                    if (s === 'pending') return { text: 'Ожидает', bg: 'bg-[#FFC700]' };
                    return { text: 'В работе', bg: 'bg-[#4AC99B]' };
                  };

                  const getProgressSteps = (order: Order) => {
                    if (order.status === 'completed' || (order.stage as string) === 'ready') return 5;
                    if (order.status === 'cancelled') return 0;
                    switch (order.stage) {
                      case 'ready': return 5;
                      case 'test': return 4;
                      case 'development': return 3;
                      case 'design': return 2;
                      case 'processing': return 1;
                      default: return 1;
                    }
                  };

                  const formatPhone = (phone: string) => {
                    const cleaned = ('' + phone).replace(/\D/g, '');
                    if (cleaned.length === 11) {
                      return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)} ${cleaned.slice(7, 9)}-${cleaned.slice(9, 11)}`;
                    }
                    return phone.startsWith('+') ? phone : `+${phone}`;
                  };

                  const progress = getProgressSteps(order);
                  const statusInfo = getStatusInfo(order);
                  const isPartnerOrder = !!order.partnerName;
                  const tags = order.features && order.features.length > 0 ? order.features : ["Общее"];
                  const orderNumStr = order.orderNumber ? String(order.orderNumber).split('-').pop() : order.id.slice(-4);

                  return (
                    <div
                      key={order.id}
                      onClick={() => router.push(`/lkseller/orders/${order.id}`)}
                      className={`w-full bg-[var(--card-bg)] rounded-[24px] p-[16px] gap-[16px] flex flex-col active:scale-[0.98] transition-all cursor-pointer relative overflow-hidden border border-[var(--border-color)] shadow-xl ${isPartnerOrder ? 'min-h-[412px]' : 'min-h-[351px]'}`}
                    >
                      {/* Identity Block Matches Admin EXACTLY */}
                      <div className="flex flex-col gap-[4px] h-[84px] shrink-0">
                        <div className="flex items-start justify-between h-[58px]">
                          <h2 className="text-[24px] font-bold text-[var(--text-primary)] leading-[29px] line-clamp-2 max-w-[215px]">
                            {order.title || "Без названия"}
                          </h2>
                          <span className="text-[24px] font-bold text-[var(--text-secondary)] leading-[29px] tabular-nums shrink-0">
                            №{orderNumStr}
                          </span>
                        </div>
                        <div className="flex items-center justify-between h-[22px]">
                          <span className="text-[18px] font-bold text-[var(--text-secondary)] leading-[22px] truncate">
                            {order.tariff || "Базовый"}
                          </span>
                          <span className="text-[18px] font-bold text-[var(--text-secondary)] leading-[22px] tabular-nums">
                            {Number(order.price || 0).toLocaleString()} ₽
                          </span>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-[8px] mb-[32px] shrink-0">
                        {tags.slice(0, 3).map((tag, i) => (
                          <div key={i} className="px-[12px] h-[24px] flex items-center bg-[var(--nav-bg)] rounded-full border border-[var(--border-color)]">
                            <span className="text-[var(--text-primary)] text-[11px] font-bold tracking-tight opacity-60 uppercase">{tag}</span>
                          </div>
                        ))}
                      </div>

                      {/* Info Rows */}
                      <div className="flex flex-col gap-[8px] shrink-0">
                        {isPartnerOrder && (
                          <div className="flex items-center gap-[4px] h-[24px]">
                            <span className="text-[13px] font-normal text-[var(--text-secondary)] leading-none shrink-0">Партнер</span>
                            <div className="flex-1 border-b border-dotted border-[var(--border-color)] h-[12px] opacity-50" />
                            <span className="text-[16px] font-normal text-[var(--text-primary)] leading-none shrink-0 truncate max-w-[160px] text-right">
                              {order.partnerName}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-[4px] h-[24px]">
                          <span className="text-[13px] font-normal text-[var(--text-secondary)] leading-none shrink-0">Заказчик</span>
                          <div className="flex-1 border-b border-dotted border-[var(--border-color)] h-[12px] opacity-50" />
                          <span className="text-[16px] font-normal text-[var(--text-primary)] leading-none shrink-0 text-right truncate max-w-[160px]">
                            {order.clientName || "—"}
                          </span>
                        </div>
                        <div className="flex items-center gap-[4px] h-[24px]">
                          <span className="text-[13px] font-normal text-[var(--text-secondary)] leading-none shrink-0">Телефон</span>
                          <div className="flex-1 border-b border-dotted border-[var(--border-color)] h-[12px] opacity-50" />
                          <span className="text-[16px] font-normal text-[var(--text-primary)] leading-none shrink-0 tabular-nums text-right">
                            {formatPhone(order.clientPhone)}
                          </span>
                        </div>

                        <div className="flex gap-[32px] mt-[4px] h-[44px]">
                          <div className="flex flex-col gap-[0px]">
                            <span className="text-[13px] font-normal text-[var(--text-secondary)] leading-[20px]">Создан</span>
                            <span className="text-[16px] font-normal text-[var(--text-primary)] leading-[24px] tabular-nums">
                              {new Date(order.createdAt).toLocaleDateString("ru-RU")}
                            </span>
                          </div>
                          <div className="flex flex-col gap-[0px]">
                            <span className="text-[13px] font-normal text-[var(--text-secondary)] leading-[20px]">Обновлен</span>
                            <span className="text-[16px] font-normal text-[var(--text-primary)] leading-[24px] tabular-nums">
                              {order.updatedAt ? new Date(order.updatedAt).toLocaleDateString("ru-RU") : new Date(order.createdAt).toLocaleDateString("ru-RU")}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Footer Row */}
                      <div className="flex items-center justify-between mt-auto h-[24px]">
                        <div className="flex gap-[4px]">
                          {[1, 2, 3, 4, 5].map((step) => (
                            <div
                              key={step}
                              className={`h-[12px] w-[32px] rounded-full transition-colors duration-500 ${step <= progress ? 'bg-[var(--text-primary)] [html.day-theme_&]:bg-[#141414]' : 'bg-[var(--nav-bg)] border border-[var(--border-color)]'}`}
                            />
                          ))}
                        </div>
                        <div className={`px-[12px] h-[24px] rounded-full border border-[var(--text-primary)] flex items-center justify-center shrink-0 ${statusInfo.bg} shadow-sm`}>
                          <span className="text-[var(--bg-color)] text-[12px] font-bold leading-none">
                            {statusInfo.text}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
