"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getUserData, saveUserData, getCurrentUserPhone, logout, setActiveRole, formatPhone } from "@/utils/userData";
import { getClientOrders, Order } from "@/utils/orders";

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentPhone = getCurrentUserPhone();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isPartnerActive, setIsPartnerActive] = useState(false);

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
        {/* Figma SVG Header for Client Profile */}
        <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[375px] h-[102px] z-50 transition-colors duration-300">
          <svg width="375" height="102" viewBox="0 0 375 102" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <mask id="path-1-inside-1_193_6989" fill="white">
              <path d="M0 0H375V102H0V0Z"/>
            </mask>
            <path d="M0 0H375V102H0V0Z" fill="var(--bg-color)"/>
            <path d="M375 102V101H0V102V103H375V102Z" fill="var(--border-color)" mask="url(#path-1-inside-1_193_6989)"/>
            

            
            {/* Settings/Logout Icons Area */}

            {/* Back Arrow */}
            <path d="M51 72L29 72M29 72L38.4286 81M29 72L38.4286 63" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            
            <path d="M335 75.375L338.375 72M338.375 72L335 68.625M338.375 72H326M331.625 66.6547V66.6002C331.625 65.3401 331.625 64.7096 331.87 64.2283C332.086 63.8049 332.43 63.461 332.853 63.2452C333.335 63 333.965 63 335.225 63H340.4C341.66 63 342.29 63 342.771 63.2452C343.194 63.461 343.539 63.8049 343.755 64.2283C344 64.7091 344 65.3389 344 66.5965V77.404C344 78.6617 344 79.2905 343.755 79.7714C343.539 80.1947 343.194 80.5393 342.771 80.755C342.29 81 341.661 81 340.403 81H335.222C333.964 81 333.334 81 332.853 80.755C332.43 80.5393 332.086 80.1944 331.87 79.771C331.625 79.2897 331.625 78.6601 331.625 77.4V77.3438" stroke="var(--logout-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            
            {/* Title: ПРОФИЛЬ (from user request 557) */}
            <g transform="translate(135.5, 62)">
              <path d="M-0.00021863 2.16H13.2478V18H10.0078V5.088H3.23978V18H-0.00021863V2.16ZM23.3336 5.856C24.4376 5.856 25.4216 6.128 26.2856 6.672C27.1656 7.2 27.8536 7.936 28.3496 8.88C28.8456 9.808 29.0936 10.864 29.0936 12.048C29.0936 13.232 28.8456 14.296 28.3496 15.24C27.8536 16.184 27.1656 16.928 26.2856 17.472C25.4216 18.016 24.4376 18.288 23.3336 18.288C22.6136 18.288 21.9496 18.168 21.3416 17.928C20.7336 17.672 20.2136 17.312 19.7816 16.848V22.32H16.5416V6.12H19.5176V7.608C19.9176 7.048 20.4456 6.616 21.1016 6.312C21.7736 6.008 22.5176 5.856 23.3336 5.856ZM22.7336 15.336C23.5976 15.336 24.3256 15.04 24.9176 14.448C25.5096 13.84 25.8056 13.048 25.8056 12.072C25.8056 11.08 25.5096 10.288 24.9176 9.696C24.3416 9.088 23.6136 8.784 22.7336 8.784C21.9176 8.784 21.2136 9.064 20.6216 9.624C20.0296 10.168 19.7336 10.976 19.7336 12.048C19.7336 13.104 20.0216 13.92 20.5976 14.496C21.1896 15.056 21.9016 15.336 22.7336 15.336ZM37.2993 18.264C36.1313 18.264 35.0593 17.992 34.0833 17.448C33.1233 16.888 32.3633 16.136 31.8033 15.192C31.2433 14.232 30.9633 13.184 30.9633 12.048C30.9633 10.912 31.2433 9.872 31.8033 8.928C32.3633 7.968 33.1313 7.216 34.1073 6.672C35.0833 6.128 36.1553 5.856 37.3233 5.856C38.4913 5.856 39.5633 6.136 40.5393 6.696C41.5153 7.24 42.2833 7.984 42.8433 8.928C43.4193 9.872 43.7073 10.912 43.7073 12.048C43.7073 13.184 43.4193 14.232 42.8433 15.192C42.2833 16.136 41.5073 16.888 40.5153 17.448C39.5393 17.992 38.4673 18.264 37.2993 18.264ZM37.3233 15.288C38.2033 15.288 38.9313 14.984 39.5073 14.376C40.0993 13.768 40.3953 13 40.3953 12.072C40.3953 11.144 40.0993 10.368 39.5073 9.744C38.9313 9.12 38.2033 8.808 37.3233 8.808C36.4273 8.808 35.6913 9.12 35.1153 9.744C34.5393 10.352 34.2513 11.128 34.2513 12.072C34.2513 13 34.5393 13.768 35.1153 14.376C35.6913 14.984 36.4273 15.288 37.3233 15.288ZM62.2689 12.048C62.2689 13.312 61.9729 14.4 61.3809 15.312C60.8049 16.208 60.0049 16.904 58.9809 17.4C57.9729 17.88 56.8209 18.152 55.5249 18.216V22.32H52.3089V18.216C51.0129 18.136 49.8529 17.848 48.8289 17.352C47.8209 16.856 47.0209 16.16 46.4289 15.264C45.8529 14.352 45.5649 13.28 45.5649 12.048C45.5649 10.784 45.8529 9.696 46.4289 8.784C47.0209 7.872 47.8209 7.176 48.8289 6.696C49.8529 6.2 51.0129 5.92 52.3089 5.856V-1.43051e-06H55.5249V5.856C56.8209 5.936 57.9729 6.232 58.9809 6.744C60.0049 7.24 60.8049 7.944 61.3809 8.856C61.9729 9.752 62.2689 10.816 62.2689 12.048ZM48.7809 12.072C48.7809 13.096 49.1009 13.904 49.7409 14.496C50.3969 15.072 51.2769 15.4 52.3809 15.48V8.616C51.2609 8.68 50.3809 9.008 49.7409 9.6C49.1009 10.176 48.7809 11 48.7809 12.072ZM55.4529 15.48C56.5729 15.416 57.4529 15.088 58.0929 14.496C58.7329 13.904 59.0529 13.072 59.0529 12C59.0529 10.976 58.7249 10.168 58.0689 9.576C57.4289 8.968 56.5569 8.648 55.4529 8.616V15.48ZM75.8148 5.856V18H72.5748V11.568L65.9508 18.288H64.8948V6.12H68.1108V12.6L74.7588 5.856H75.8148ZM89.5843 6.12V18H86.3683V8.856H83.1763L83.1523 9.768C83.1043 11.8 82.9443 13.424 82.6723 14.64C82.4003 15.856 81.9683 16.76 81.3763 17.352C80.8003 17.928 80.0163 18.216 79.0243 18.216C78.5603 18.216 78.1523 18.144 77.8003 18V15.336C77.9283 15.368 78.0803 15.384 78.2563 15.384C78.7043 15.384 79.0563 15.168 79.3123 14.736C79.5843 14.304 79.7843 13.624 79.9123 12.696C80.0403 11.768 80.1123 10.52 80.1283 8.952L80.1523 6.12H89.5843ZM92.9495 6.12H96.1655V9.552H98.3255C99.7815 9.552 100.966 9.928 101.878 10.68C102.806 11.432 103.27 12.456 103.27 13.752C103.27 15.064 102.806 16.104 101.878 16.872C100.966 17.624 99.7815 18 98.3255 18H92.9495V6.12ZM98.2295 15.264C98.7735 15.264 99.1975 15.144 99.5015 14.904C99.8215 14.648 99.9815 14.28 99.9815 13.8C99.9815 13.336 99.8215 12.968 99.5015 12.696C99.1815 12.424 98.7575 12.288 98.2295 12.288H96.1655V15.264H98.2295Z" fill="var(--text-primary)"/>
            </g>
          </svg>
          
          {/* Invisible Functional Overlays */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            {/* Back Button Overlay */}
            <button 
              onClick={() => router.push("/client")}
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
          <div className="flex flex-col items-center">
            {avatar ? (
              <div className="w-[124px] h-[124px] rounded-[32px] overflow-hidden border border-[var(--border-color)] shadow-2xl transition-colors duration-300">
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-[124px] h-[124px] bg-[var(--accent-color)] rounded-[32px] flex items-center justify-center text-center p-4 shadow-2xl shadow-[var(--accent-color)]/20 transition-all duration-300">
                <span className="text-white tvelvi-h6">Ignite Pass</span>
              </div>
            )}
          </div>

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

          <div className="w-full flex justify-center mt-4 mb-4">
            <div 
              className="relative w-[327px] h-[56px] cursor-pointer active:scale-[0.98] transition-all"
              onClick={() => {
                setIsPartnerActive(true);
                setTimeout(() => {
                  setActiveRole("seller");
                  router.push(currentPhone === "79999999999" ? "/admin" : "/lkseller");
                }, 300);
              }}
            >
              <svg width="327" height="56" viewBox="0 0 327 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                {/* Background Frame */}
                <rect x="0.5" y="0.5" width="326" height="55" rx="27.5" stroke="var(--border-color)"/>
                
                {/* Active Selector - Animates Between Left and Right */}
                <rect 
                  x={isPartnerActive ? "164" : "0.5"} 
                  y="0.5" width="162.5" height="55" rx="27.5" 
                  stroke="var(--text-primary)" 
                  className="transition-all duration-300 ease-in-out"
                />
                
                {/* Text "КЛИЕНТ" */}
                <path d="M56.206 22.44H57.454V33H56.206V22.44ZM64.382 33H62.798L57.598 27.336L62.35 22.44H63.95L59.23 27.336L64.382 33ZM72.123 25.208V33H70.891V26.312H67.995L67.963 27.272C67.9203 28.6373 67.819 29.736 67.659 30.568C67.499 31.4 67.243 32.024 66.891 32.44C66.539 32.856 66.059 33.064 65.451 33.064C65.3017 33.064 65.163 33.0427 65.035 33V31.96C65.163 31.9813 65.2697 31.992 65.355 31.992C65.8563 31.992 66.2137 31.6027 66.427 30.824C66.6403 30.0347 66.763 28.84 66.795 27.24L66.843 25.208H72.123ZM81.2764 25.032V33H80.0444V27.496L75.2924 33.176H74.8444V25.208H76.0764V30.728L80.8284 25.032H81.2764ZM90.865 29.48H84.705C84.7797 30.248 85.0837 30.8667 85.617 31.336C86.1503 31.8053 86.801 32.04 87.569 32.04C88.4543 32.04 89.249 31.688 89.953 30.984L90.673 31.816C90.2677 32.2427 89.7983 32.5787 89.265 32.824C88.7423 33.0587 88.1717 33.176 87.553 33.176C86.785 33.176 86.0863 33 85.457 32.648C84.8277 32.2853 84.3317 31.7947 83.969 31.176C83.6063 30.5573 83.425 29.8693 83.425 29.112C83.425 28.3653 83.601 27.6827 83.953 27.064C84.305 26.4347 84.785 25.9387 85.393 25.576C86.001 25.2133 86.673 25.032 87.409 25.032C88.0703 25.032 88.673 25.1813 89.217 25.48C89.761 25.7787 90.1877 26.1947 90.497 26.728C90.8063 27.2613 90.961 27.8693 90.961 28.552C90.961 28.8507 90.929 29.16 90.865 29.48ZM87.377 26.152C86.7263 26.152 86.161 26.36 85.681 26.776C85.201 27.1813 84.8917 27.72 84.753 28.392H89.697C89.6863 27.6987 89.457 27.1547 89.009 26.76C88.5717 26.3547 88.0277 26.152 87.377 26.152ZM93.1256 25.208H94.3576V28.312H98.1816V25.208H99.4136V33H98.1816V29.4H94.3576V33H93.1256V25.208ZM103.694 26.312H101.07V25.208H107.534V26.312H104.91V33H103.694V26.312Z" fill={isPartnerActive ? "var(--text-secondary)" : "var(--text-primary)"}/>
                
                {/* Text "ПАРТНЕР" */}
                <path d="M214.206 22.44H222.462V33H221.214V23.56H215.454V33H214.206V22.44ZM228.004 25.032C228.921 25.032 229.657 25.304 230.212 25.848C230.766 26.392 231.044 27.176 231.044 28.2V33H229.892V31.992C229.604 32.376 229.236 32.6693 228.788 32.872C228.34 33.0747 227.833 33.176 227.268 33.176C226.468 33.176 225.812 32.9787 225.3 32.584C224.798 32.1893 224.548 31.656 224.548 30.984C224.548 30.3227 224.804 29.7947 225.316 29.4C225.828 29.0053 226.505 28.808 227.348 28.808H229.812V28.136C229.812 27.496 229.641 27.0107 229.3 26.68C228.969 26.3387 228.51 26.168 227.924 26.168C227.454 26.168 227.038 26.2747 226.676 26.488C226.313 26.6907 225.972 27 225.652 27.416L224.836 26.744C225.188 26.168 225.641 25.7413 226.196 25.464C226.75 25.176 227.353 25.032 228.004 25.032ZM227.428 32.152C227.854 32.152 228.249 32.0613 228.612 31.88C228.974 31.688 229.262 31.4267 229.476 31.096C229.7 30.7653 229.812 30.4027 229.812 30.008V29.816H227.492C226.948 29.816 226.532 29.912 226.244 30.104C225.956 30.2853 225.812 30.5573 225.812 30.92C225.812 31.3147 225.966 31.6187 226.276 31.832C226.585 32.0453 226.969 32.152 227.428 32.152ZM237.753 25.032C238.489 25.032 239.15 25.2133 239.737 25.576C240.324 25.928 240.782 26.4133 241.113 27.032C241.444 27.6507 241.609 28.3387 241.609 29.096C241.609 29.8533 241.438 30.5467 241.097 31.176C240.766 31.7947 240.308 32.2853 239.721 32.648C239.134 33 238.478 33.176 237.753 33.176C237.177 33.176 236.633 33.064 236.121 32.84C235.62 32.6053 235.209 32.2853 234.889 31.88V35.88H233.657V25.208H234.809V26.456C235.108 26.008 235.518 25.6613 236.041 25.416C236.574 25.16 237.145 25.032 237.753 25.032ZM237.577 32.04C238.1 32.04 238.569 31.9173 238.985 31.672C239.412 31.416 239.742 31.064 239.977 30.616C240.222 30.168 240.345 29.6667 240.345 29.112C240.345 28.5573 240.222 28.056 239.977 27.608C239.742 27.16 239.412 26.808 238.985 26.552C238.569 26.296 238.1 26.168 237.577 26.168C237.108 26.168 236.665 26.2747 236.249 26.488C235.844 26.7013 235.513 27.0267 235.257 27.464C235.001 27.9013 234.873 28.4453 234.873 29.096C234.873 29.7467 234.996 30.296 235.241 30.744C235.497 31.1813 235.828 31.5067 236.233 31.72C236.649 31.9333 237.097 32.04 237.577 32.04ZM245.225 26.312H242.601V25.208H249.065V26.312H246.441V33H245.225V26.312ZM250.766 25.208H251.998V28.312H255.822V25.208H257.054V33H255.822V29.4H251.998V33H250.766V25.208ZM266.631 29.48H260.471C260.545 30.248 260.849 30.8667 261.383 31.336C261.916 31.8053 262.567 32.04 263.335 32.04C264.22 32.04 265.015 31.688 265.719 30.984L266.439 31.816C266.033 32.2427 265.564 32.5787 265.031 32.824C264.508 33.0587 263.937 33.176 263.319 33.176C262.551 33.176 261.852 33 261.223 32.648C260.593 32.2853 260.097 31.7947 259.735 31.176C259.372 30.5573 259.191 29.8693 259.191 29.112C259.191 28.3653 259.367 27.6827 259.719 27.064C260.071 26.4347 260.551 25.9387 261.159 25.576C261.767 25.2133 262.439 25.032 263.175 25.032C263.836 25.032 264.439 25.1813 264.983 25.48C265.527 25.7787 265.953 26.1947 266.263 26.728C266.572 27.2613 266.727 27.8693 266.727 28.552C266.727 28.8507 266.695 29.16 266.631 29.48ZM263.143 26.152C262.492 26.152 261.927 26.36 261.447 26.776C260.967 27.1813 260.657 27.72 260.519 28.392H265.463C265.452 27.6987 265.223 27.1547 264.775 26.76C264.337 26.3547 263.793 26.152 263.143 26.152ZM272.987 25.032C273.723 25.032 274.385 25.2133 274.971 25.576C275.558 25.928 276.017 26.4133 276.347 27.032C276.678 27.6507 276.843 28.3387 276.843 29.096C276.843 29.8533 276.673 30.5467 276.331 31.176C276.001 31.7947 275.542 32.2853 274.955 32.648C274.369 33 273.713 33.176 272.987 33.176C272.411 33.176 271.867 33.064 271.355 32.84C270.854 32.6053 270.443 32.2853 270.123 31.88V35.88H268.891V25.208H270.043V26.456C270.342 26.008 270.753 25.6613 271.275 25.416C271.809 25.16 272.379 25.032 272.987 25.032ZM272.811 32.04C273.334 32.04 273.803 31.9173 274.219 31.672C274.646 31.416 274.977 31.064 275.211 30.616C275.457 30.168 275.579 29.6667 275.579 29.112C275.579 28.5573 275.457 28.056 275.211 27.608C274.977 27.16 274.646 26.808 274.219 26.552C273.803 26.296 273.334 26.168 272.811 26.168C272.342 26.168 271.899 26.2747 271.483 26.488C271.078 26.7013 270.747 27.0267 270.491 27.464C270.235 27.9013 270.107 28.4453 270.107 29.096C270.107 29.7467 270.23 30.296 270.475 30.744C270.731 31.1813 271.062 31.5067 271.467 31.72C271.883 31.9333 272.331 32.04 272.811 32.04Z" fill={isPartnerActive ? "var(--text-primary)" : "var(--text-secondary)"}/>
              </svg>
            </div>
          </div>


        </main>
      </div>
    </div>
  );
}
