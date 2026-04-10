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
  const [isClientActive, setIsClientActive] = useState(false);

  useEffect(() => {
    if (currentPhone) {
      const fetchData = async () => {
        const data = await getUserData(currentPhone);
        if (data) {
          setName(data.name || "");
          setEmail(data.email || "");
          setPhone(data.phone || currentPhone);
          setAvatar(data.avatar || null);
        } else {
          setPhone(currentPhone);
        }
      };
      fetchData();
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
          <div className="flex flex-col gap-[16px] w-full">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-[181px] relative flex items-center justify-center cursor-pointer transition-all active:scale-[0.99] group overflow-hidden"
            >
              {/* SVG Background/Frame - Always show the dashed frame */}
              <svg width="329" height="181" viewBox="0 0 329 181" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
                <rect x="1" y="1" width="327" height="179" rx="24" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="8 16"/>
                <path d="M164.5 52.4999V37.4999M164.5 37.4999L157.136 42.4999M164.5 37.4999L171.864 42.4999M191.5 49.9999C191.5 44.4771 187.104 39.9999 181.682 39.9999C181.624 39.9999 181.567 40.0004 181.509 40.0015C180.319 31.52 173.156 25 164.5 25C157.635 25 151.712 29.1001 148.96 35.027C142.561 35.4536 137.5 40.8745 137.5 47.4995C137.5 54.403 142.995 60 149.773 60L181.682 59.9998C187.104 59.9998 191.5 55.5227 191.5 49.9999Z" stroke="var(--text-secondary)" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>

              {/* Functional Center Content - Always visible */}
              <div className="relative z-10 flex flex-col items-center gap-[20px] pt-[40px]">
                  <span className="text-[14px] font-medium text-[var(--text-secondary)] opacity-60">Загрузите файл аватара</span>
                  <button type="button" className="w-[279px] h-[44px] bg-[var(--nav-btn)] rounded-full flex items-center justify-center text-[var(--text-primary)] text-[16px] font-bold active:scale-95 transition-all shadow-lg">
                    Выбрать файл
                  </button>
              </div>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </div>

          {/* Role Switcher - Partner (right active) */}
          <div className="w-full flex justify-center mt-4 mb-4">
            <div 
              className="relative w-[327px] h-[56px] cursor-pointer active:scale-[0.98] transition-all"
              onClick={() => {
                setIsClientActive(true);
                setTimeout(() => {
                  setActiveRole("client");
                  router.push("/profile");
                }, 300);
              }}
            >
              <svg width="327" height="56" viewBox="0 0 327 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                {/* Background Frame */}
                <rect x="0.5" y="0.5" width="326" height="55" rx="27.5" stroke="var(--border-color)"/>
                
                {/* Active Selector - Animates Between Right (Partner) and Left (Client) */}
                <rect 
                  x={isClientActive ? "0.5" : "164"} 
                  y="0.5" width="162.5" height="55" rx="27.5" 
                  stroke="var(--text-primary)" 
                  className="transition-all duration-300 ease-in-out"
                />
                
                {/* Text "КЛИЕНТ" */}
                <path d="M56.206 22.44H57.454V33H56.206V22.44ZM64.382 33H62.798L57.598 27.336L62.35 22.44H63.95L59.23 27.336L64.382 33ZM72.123 25.208V33H70.891V26.312H67.995L67.963 27.272C67.9203 28.6373 67.819 29.736 67.659 30.568C67.499 31.4 67.243 32.024 66.891 32.44C66.539 32.856 66.059 33.064 65.451 33.064C65.3017 33.064 65.163 33.0427 65.035 33V31.96C65.163 31.9813 65.2697 31.992 65.355 31.992C65.8563 31.992 66.2137 31.6027 66.427 30.824C66.6403 30.0347 66.763 28.84 66.795 27.24L66.843 25.208H72.123ZM81.2764 25.032V33H80.0444V27.496L75.2924 33.176H74.8444V25.208H76.0764V30.728L80.8284 25.032H81.2764ZM90.865 29.48H84.705C84.7797 30.248 85.0837 30.8667 85.617 31.336C86.1503 31.8053 86.801 32.04 87.569 32.04C88.4543 32.04 89.249 31.688 89.953 30.984L90.673 31.816C90.2677 32.2427 89.7983 32.5787 89.265 32.824C88.7423 33.0587 88.1717 33.176 87.553 33.176C86.785 33.176 86.0863 33 85.457 32.648C84.8277 32.2853 84.3317 31.7947 83.969 31.176C83.6063 30.5573 83.425 29.8693 83.425 29.112C83.425 28.3653 83.601 27.6827 83.953 27.064C84.305 26.4347 84.785 25.9387 85.393 25.576C86.001 25.2133 86.673 25.032 87.409 25.032C88.0703 25.032 88.673 25.1813 89.217 25.48C89.761 25.7787 90.1877 26.1947 90.497 26.728C90.8063 27.2613 90.961 27.8693 90.961 28.552C90.961 28.8507 90.929 29.16 90.865 29.48ZM87.377 26.152C86.7263 26.152 86.161 26.36 85.681 26.776C85.201 27.1813 84.8917 27.72 84.753 28.392H89.697C89.6863 27.6987 89.457 27.1547 89.009 26.76C88.5717 26.3547 88.0277 26.152 87.377 26.152ZM93.1256 25.208H94.3576V28.312H98.1816V25.208H99.4136V33H98.1816V29.4H94.3576V33H93.1256V25.208ZM103.694 26.312H101.07V25.208H107.534V26.312H104.91V33H103.694V26.312Z" fill={isClientActive ? "var(--text-primary)" : "var(--text-secondary)"}/>
                
                {/* Text "ПАРТНЕР" */}
                <path d="M214.206 22.44H222.462V33H221.214V23.56H215.454V33H214.206V22.44ZM228.004 25.032C228.921 25.032 229.657 25.304 230.212 25.848C230.766 26.392 231.044 27.176 231.044 28.2V33H229.892V31.992C229.604 32.376 229.236 32.6693 228.788 32.872C228.34 33.0747 227.833 33.176 227.268 33.176C226.468 33.176 225.812 32.9787 225.3 32.584C224.798 32.1893 224.548 31.656 224.548 30.984C224.548 30.3227 224.804 29.7947 225.316 29.4C225.828 29.0053 226.505 28.808 227.348 28.808H229.812V28.136C229.812 27.496 229.641 27.0107 229.3 26.68C228.969 26.3387 228.51 26.168 227.924 26.168C227.454 26.168 227.038 26.2747 226.676 26.488C226.313 26.6907 225.972 27 225.652 27.416L224.836 26.744C225.188 26.168 225.641 25.7413 226.196 25.464C226.75 25.176 227.353 25.032 228.004 25.032ZM227.428 32.152C227.854 32.152 228.249 32.0613 228.612 31.88C228.974 31.688 229.262 31.4267 229.476 31.096C229.7 30.7653 229.812 30.4027 229.812 30.008V29.816H227.492C226.948 29.816 226.532 29.912 226.244 30.104C225.956 30.2853 225.812 30.5573 225.812 30.92C225.812 31.3147 225.966 31.6187 226.276 31.832C226.585 32.0453 226.969 32.152 227.428 32.152ZM237.753 25.032C238.489 25.032 239.15 25.2133 239.737 25.576C240.324 25.928 240.782 26.4133 241.113 27.032C241.444 27.6507 241.609 28.3387 241.609 29.096C241.609 29.8533 241.438 30.5467 241.097 31.176C240.766 31.7947 240.308 32.2853 239.721 32.648C239.134 33 238.478 33.176 237.753 33.176C237.177 33.176 236.633 33.064 236.121 32.84C235.62 32.6053 235.209 32.2853 234.889 31.88V35.88H233.657V25.208H234.809V26.456C235.108 26.008 235.518 25.6613 236.041 25.416C236.574 25.16 237.145 25.032 237.753 25.032ZM237.577 32.04C238.1 32.04 238.569 31.9173 238.985 31.672C239.412 31.416 239.742 31.064 239.977 30.616C240.222 30.168 240.345 29.6667 240.345 29.112C240.345 28.5573 240.222 28.056 239.977 27.608C239.742 27.16 239.412 26.808 238.985 26.552C238.569 26.296 238.1 26.168 237.577 26.168C237.108 26.168 236.665 26.2747 236.249 26.488C235.844 26.7013 235.513 27.0267 235.257 27.464C235.001 27.9013 234.873 28.4453 234.873 29.096C234.873 29.7467 234.996 30.296 235.241 30.744C235.497 31.1813 235.828 31.5067 236.233 31.72C236.649 31.9333 237.097 32.04 237.577 32.04ZM245.225 26.312H242.601V25.208H249.065V26.312H246.441V33H245.225V26.312ZM250.766 25.208H251.998V28.312H255.822V25.208H257.054V33H255.822V29.4H251.998V33H250.766V25.208ZM266.631 29.48H260.471C260.545 30.248 260.849 30.8667 261.383 31.336C261.916 31.8053 262.567 32.04 263.335 32.04C264.22 32.04 265.015 31.688 265.719 30.984L266.439 31.816C266.033 32.2427 265.564 32.5787 265.031 32.824C264.508 33.0587 263.937 33.176 263.319 33.176C262.551 33.176 261.852 33 261.223 32.648C260.593 32.2853 260.097 31.7947 259.735 31.176C259.372 30.5573 259.191 29.8693 259.191 29.112C259.191 28.3653 259.367 27.6827 259.719 27.064C260.071 26.4347 260.551 25.9387 261.159 25.576C261.767 25.2133 262.439 25.032 263.175 25.032C263.836 25.032 264.439 25.1813 264.983 25.48C265.527 25.7787 265.953 26.1947 266.263 26.728C266.572 27.2613 266.727 27.8693 266.727 28.552C266.727 28.8507 266.695 29.16 266.631 29.48ZM263.143 26.152C262.492 26.152 261.927 26.36 261.447 26.776C260.967 27.1813 260.657 27.72 260.519 28.392H265.463C265.452 27.6987 265.223 27.1547 264.775 26.76C264.337 26.3547 263.793 26.152 263.143 26.152ZM272.987 25.032C273.723 25.032 274.385 25.2133 274.971 25.576C275.558 25.928 276.017 26.4133 276.347 27.032C276.678 27.6507 276.843 28.3387 276.843 29.096C276.843 29.8533 276.673 30.5467 276.331 31.176C276.001 31.7947 275.542 32.2853 274.955 32.648C274.369 33 273.713 33.176 272.987 33.176C272.411 33.176 271.867 33.064 271.355 32.84C270.854 32.6053 270.443 32.2853 270.123 31.88V35.88H268.891V25.208H270.043V26.456C270.342 26.008 270.753 25.6613 271.275 25.416C271.809 25.16 272.379 25.032 272.987 25.032ZM272.811 32.04C273.334 32.04 273.803 31.9173 274.219 31.672C274.646 31.416 274.977 31.064 275.211 30.616C275.457 30.168 275.579 29.6667 275.579 29.112C275.579 28.5573 275.457 28.056 275.211 27.608C274.977 27.16 274.646 26.808 274.219 26.552C273.803 26.296 273.334 26.168 272.811 26.168C272.342 26.168 271.899 26.2747 271.483 26.488C271.078 26.7013 270.747 27.0267 270.491 27.464C270.235 27.9013 270.107 28.4453 270.107 29.096C270.107 29.7467 270.23 30.296 270.475 30.744C270.731 31.1813 271.062 31.5067 271.467 31.72C271.883 31.9333 272.331 32.04 272.811 32.04Z" fill={isClientActive ? "var(--text-secondary)" : "var(--text-primary)"}/>
              </svg>
            </div>
          </div>


        </main>
      </div>
    </div>
  );
}
