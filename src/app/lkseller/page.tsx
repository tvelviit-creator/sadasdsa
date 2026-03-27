"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getUserData, saveUserData, getCurrentUserPhone, logout, setActiveRole, formatPhone, startRoleTransition } from "@/utils/userData";

export default function LkSellerPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentPhone = getCurrentUserPhone();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);

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
    <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] pb-10 font-sans overflow-x-hidden transition-colors duration-300">
      
      {/* --- PREMIUM DESKTOP LAYOUT --- */}
      <div className="hidden lg:flex flex-col w-full max-w-[1400px] mx-auto px-12 pt-16 pb-32 min-h-screen gap-10">
          <div className="flex justify-between items-end w-full mb-4">
              <div className="flex flex-col">
                  <button onClick={() => router.push("/seller")} className="group flex items-center gap-3 text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] transition-colors duration-300 mb-8 w-fit">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:-translate-x-1 transition-transform">
                          <path d="M19 12H5M12 19L5 12L12 5" />
                      </svg>
                      <span className="text-[13px] font-black uppercase tracking-[0.2em] mt-0.5">В КАТАЛОГ СЕЛЛЕРА</span>
                  </button>
                  <h1 className="text-4xl md:text-5xl font-black font-cera text-[var(--text-primary)] leading-none tracking-tight uppercase">
                      КАБИНЕТ ПАРТНЕРА
                      <br/>
                      <span className="opacity-50"># {phone ? formatPhone(phone).replace(/\D/g, '').slice(-7) : 'АНОНИМ'}</span>
                  </h1>
              </div>
          </div>

          <div className="flex flex-col w-full max-w-[600px] mx-auto gap-8 items-start relative pb-10">
              <div className="flex flex-col gap-6 w-full sticky top-8">
                  <div className="w-full bg-[var(--nav-bg)]/30 border border-[var(--border-color)] rounded-[32px] p-8 flex flex-col items-center group overflow-hidden relative">
                      <div className="flex flex-col items-center w-full relative z-10 gap-6">
                          {avatar ? (
                              <div className="w-[160px] h-[160px] rounded-[40px] overflow-hidden border-2 border-[var(--border-color)] shadow-xl transition-all duration-500 group-hover:border-[var(--accent-cyan)]/30 group-hover:shadow-[0_0_30px_rgba(74,201,155,0.1)]">
                                  <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                              </div>
                          ) : (
                              <div className="w-[160px] h-[160px] bg-[var(--bg-color)] rounded-[40px] flex items-center justify-center border-2 border-[var(--border-color)] shadow-xl transition-all duration-500 group-hover:border-[var(--accent-cyan)]/30 group-hover:shadow-[0_0_30px_rgba(74,201,155,0.1)]">
                                  <span className="text-[var(--text-secondary)] font-black text-2xl uppercase opacity-30">AVATAR</span>
                              </div>
                          )}
                          <div className="w-full flex flex-col gap-4">
                              <button onClick={() => fileInputRef.current?.click()} className="w-full h-12 bg-transparent border border-[var(--text-primary)] text-[var(--text-primary)] text-[11px] font-black tracking-[0.1em] uppercase rounded-full hover:bg-[var(--text-primary)] hover:text-[var(--bg-color)] transition-all flex items-center justify-center">
                                  ИЗМЕНИТЬ АВАТАР
                              </button>
                              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                          </div>
                      </div>
                  </div>

                  <div className="w-full bg-[var(--nav-bg)]/30 border border-[var(--border-color)] rounded-[32px] p-8 flex flex-col gap-6 relative overflow-hidden focus-within:border-[var(--text-primary)]/50 transition-colors group">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)] opacity-50 mb-2">НАСТРОЙКИ ДАННЫХ</span>
                      <div className="space-y-4 relative z-10 w-full">
                          <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-[0.1em] text-[var(--text-secondary)] ml-2 transition-colors group-focus-within:text-[var(--text-primary)]">ИМЯ ПАРТНЕРА</label>
                              <input value={name} onChange={(e) => setName(e.target.value)} onBlur={handleSave} className="w-full h-14 bg-[var(--nav-bg)]/50 rounded-2xl px-6 text-[14px] font-bold text-[var(--text-primary)] border border-[var(--border-color)] focus:border-[var(--accent-cyan)] focus:bg-[var(--nav-bg)] focus:outline-none transition-all placeholder:text-[var(--text-secondary)] placeholder:opacity-50" placeholder="АНОНИМ" />
                          </div>
                          <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-[0.1em] text-[var(--text-secondary)] ml-2 transition-colors group-focus-within:text-[var(--text-primary)]">РАБОЧАЯ ПОЧТА</label>
                              <input value={email} onChange={(e) => setEmail(e.target.value)} onBlur={handleSave} className="w-full h-14 bg-[var(--nav-bg)]/50 rounded-2xl px-6 text-[14px] font-bold text-[var(--text-primary)] border border-[var(--border-color)] focus:border-[var(--accent-cyan)] focus:bg-[var(--nav-bg)] focus:outline-none transition-all placeholder:text-[var(--text-secondary)] placeholder:opacity-50" placeholder="N/A" />
                          </div>
                          <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-[0.1em] text-[var(--text-secondary)] ml-2">НОМЕР СВЯЗИ</label>
                              <div className="w-full h-14 bg-[var(--card-bg)] opacity-50 cursor-not-allowed rounded-2xl px-6 flex items-center text-[14px] font-bold tracking-widest text-[var(--text-primary)] border border-[var(--border-color)]">{phone ? formatPhone(phone) : "+7 (000) 000 00-00"}</div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      {/* --- PREMIUM MOBILE LAYOUT (HIDDEN ON DESKTOP) --- */}
      <div className="lg:hidden w-full flex-1 relative min-h-screen bg-transparent">
        <div className="absolute inset-0 z-[-1] pointer-events-none opacity-[0.03]" style={{ backgroundImage: `radial-gradient(white 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
        <div className="fixed top-[-10%] right-[-10%] w-[60%] h-[60%] bg-[var(--accent-cyan)]/5 blur-[100px] rounded-full pointer-events-none z-[-1]" />
        <div className="fixed bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-500/5 blur-[100px] rounded-full pointer-events-none z-[-1]" />
        
        {/* Figma SVG Header for Seller Profile (Mobile & Tablet) - Identical to Client for Parity */}
        <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[375px] h-[102px] z-50 transition-colors duration-300">
          <svg width="375" height="102" viewBox="0 0 375 102" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <mask id="path-1-inside-1_193_6989_lk" fill="white">
              <path d="M0 0H375V102H0V0Z"/>
            </mask>
            <path d="M0 0H375V102H0V0Z" fill="var(--bg-color)"/>
            <path d="M375 102V101H0V102V103H375V102Z" fill="var(--border-color)" mask="url(#path-1-inside-1_193_6989_lk)"/>
            
            {/* Back Arrow */}
            <path d="M51 72L29 72M29 72L38.4286 81M29 72L38.4286 63" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            
            {/* Settings/Logout Icons */}
            <path d="M305.024 68.0835L304.584 67.8242C304.516 67.7839 304.482 67.7637 304.449 67.7427C304.122 67.5345 303.845 67.2468 303.644 66.9026C303.623 66.868 303.604 66.8317 303.565 66.7599C303.526 66.6882 303.506 66.6519 303.488 66.6159C303.307 66.2579 303.209 65.8588 303.203 65.4526C303.203 65.4118 303.203 65.3701 303.204 65.2872L303.213 64.7459C303.227 63.8796 303.234 63.4452 303.119 63.0553C303.017 62.709 302.846 62.39 302.618 62.1193C302.361 61.8133 302.004 61.595 301.291 61.1589L300.698 60.7967C299.986 60.3619 299.63 60.1444 299.252 60.0615C298.918 59.9881 298.573 59.9915 298.24 60.0708C297.864 60.1603 297.513 60.3834 296.81 60.8295L296.806 60.8315L296.381 61.1012C296.314 61.1438 296.28 61.1653 296.247 61.1852C295.913 61.3821 295.54 61.491 295.158 61.504C295.119 61.5053 295.08 61.5053 295.002 61.5053C294.924 61.5053 294.883 61.5053 294.844 61.504C294.462 61.491 294.088 61.3815 293.753 61.1837C293.72 61.1638 293.686 61.1421 293.619 61.0993L293.191 60.8272C292.484 60.3769 292.13 60.1514 291.752 60.0615C291.417 59.9819 291.071 59.9797 290.736 60.054C290.357 60.1379 290.001 60.357 289.289 60.7952L289.286 60.7967L288.7 61.157L288.694 61.1612C287.988 61.5955 287.634 61.8131 287.379 62.1179C287.152 62.3883 286.983 62.7068 286.882 63.0522C286.767 63.4426 286.773 63.878 286.787 64.7483L286.796 65.2888C286.797 65.3707 286.799 65.4114 286.799 65.4516C286.793 65.8586 286.694 66.2585 286.512 66.6172C286.494 66.6527 286.475 66.6881 286.436 66.759C286.398 66.8299 286.379 66.8652 286.359 66.8994C286.157 67.2454 285.879 67.5348 285.549 67.7434C285.516 67.764 285.482 67.7838 285.415 67.8235L284.98 68.0786C284.258 68.5029 283.897 68.7153 283.635 69.0174C283.402 69.2848 283.227 69.6019 283.12 69.9472C282.998 70.3376 282.999 70.7754 283 71.6508L283.002 72.3663C283.004 73.2359 283.006 73.6704 283.128 74.0581C283.235 74.4011 283.409 74.7164 283.64 74.9821C283.902 75.2825 284.259 75.4935 284.976 75.9162L285.406 76.17C285.479 76.2132 285.516 76.2345 285.551 76.257C285.878 76.4657 286.154 76.7543 286.354 77.0983C286.376 77.1355 286.397 77.1741 286.439 77.2512C286.48 77.3274 286.501 77.3655 286.52 77.4037C286.696 77.7572 286.79 78.1499 286.797 78.5496C286.797 78.5928 286.797 78.6364 286.795 78.7242L286.787 79.2429C286.773 80.1162 286.767 80.5534 286.882 80.9449C286.984 81.2912 287.155 81.6102 287.383 81.8809C287.64 82.1869 287.997 82.405 288.711 82.8411L289.303 83.2032C290.015 83.6381 290.371 83.8553 290.749 83.9382C291.083 84.0116 291.428 84.0087 291.761 83.9295C292.138 83.8398 292.49 83.6159 293.195 83.1686L293.62 82.8989C293.687 82.8562 293.721 82.8349 293.755 82.815C294.089 82.6181 294.461 82.5086 294.843 82.4956C294.882 82.4943 294.921 82.4943 294.999 82.4943C295.078 82.4943 295.117 82.4943 295.155 82.4956C295.538 82.5087 295.913 82.6185 296.248 82.8162C296.277 82.8336 296.307 82.8524 296.358 82.8854L296.81 83.1729C297.518 83.6232 297.871 83.848 298.249 83.938C298.583 84.0175 298.93 84.0208 299.265 83.9465C299.644 83.8626 300.001 83.643 300.712 83.2051L301.307 82.8394C302.013 82.4049 302.367 82.187 302.622 81.8821C302.849 81.6117 303.019 81.2933 303.12 80.9479C303.234 80.5603 303.227 80.1283 303.213 79.2706L303.204 78.7112C303.203 78.6293 303.203 78.5886 303.203 78.5483C303.209 78.1413 303.307 77.7412 303.488 77.3825C303.506 77.3471 303.525 77.3113 303.564 77.2407C303.603 77.1698 303.623 77.1344 303.643 77.1002C303.845 76.7542 304.123 76.4646 304.453 76.256C304.485 76.2356 304.518 76.2161 304.584 76.1774L304.587 76.1762L305.021 75.9212C305.743 75.4969 306.104 75.2843 306.367 74.9821C306.599 74.7148 306.775 74.3981 306.882 74.0528C307.002 73.6647 307.001 73.2295 307 72.3643L306.998 71.6334C306.996 70.7638 306.995 70.3294 306.874 69.9416C306.766 69.5986 306.591 69.2834 306.36 69.0176C306.099 68.7176 305.741 68.5065 305.026 68.0846L305.024 68.0835Z" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M290.199 72.0001C290.199 74.812 292.348 77.0915 295 77.0915C297.652 77.0915 299.802 74.812 299.802 72.0001C299.802 69.1882 297.652 66.9087 295 66.9087C292.348 66.9087 290.199 69.1882 290.199 72.0001Z" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M335 75.375L338.375 72M338.375 72L335 68.625M338.375 72H326M331.625 66.6547V66.6002C331.625 65.3401 331.625 64.7096 331.87 64.2283C332.086 63.8049 332.43 63.461 332.853 63.2452C333.335 63 333.965 63 335.225 63H340.4C341.66 63 342.29 63 342.771 63.2452C343.194 63.461 343.539 63.8049 343.755 64.2283C344 64.7091 344 65.3389 344 66.5965V77.404C344 78.6617 344 79.2905 343.755 79.7714C343.539 80.1947 343.194 80.5393 342.771 80.755C342.29 81 341.661 81 340.403 81H335.222C333.964 81 333.334 81 332.853 80.755C332.43 80.5393 332.086 80.1944 331.87 79.771C331.625 79.2897 331.625 78.6601 331.625 77.4V77.3438" stroke="var(--logout-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            
            {/* Title: ПРОФИЛЬ (Using same SVG path as client for absolute parity) */}
            <g transform="translate(135.5, 62)">
              <path d="M-0.00021863 2.16H13.2478V18H10.0078V5.088H3.23978V18H-0.00021863V2.16ZM23.3336 5.856C24.4376 5.856 25.4216 6.128 26.2856 6.672C27.1656 7.2 27.8536 7.936 28.3496 8.88C28.8456 9.808 29.0936 10.864 29.0936 12.048C29.0936 13.232 28.8456 14.296 28.3496 15.24C27.8536 16.184 27.1656 16.928 26.2856 17.472C25.4216 18.016 24.4376 18.288 23.3336 18.288C22.6136 18.288 21.9496 18.168 21.3416 17.928C20.7336 17.672 20.2136 17.312 19.7816 16.848V22.32H16.5416V6.12H19.5176V7.608C19.9176 7.048 20.4456 6.616 21.1016 6.312C21.7736 6.008 22.5176 5.856 23.3336 5.856ZM22.7336 15.336C23.5976 15.336 24.3256 15.04 24.9176 14.448C25.5096 13.84 25.8056 13.048 25.8056 12.072C25.8056 11.08 25.5096 10.288 24.9176 9.696C24.3416 9.088 23.6136 8.784 22.7336 8.784C21.9176 8.784 21.2136 9.064 20.6216 9.624C20.0296 10.168 19.7336 10.976 19.7336 12.048C19.7336 13.104 20.0216 13.92 20.5976 14.496C21.1896 15.056 21.9016 15.336 22.7336 15.336ZM37.2993 18.264C36.1313 18.264 35.0593 17.992 34.0833 17.448C33.1233 16.888 32.3633 16.136 31.8033 15.192C31.2433 14.232 30.9633 13.184 30.9633 12.048C30.9633 10.912 31.2433 9.872 31.8033 8.928C32.3633 7.968 33.1313 7.216 34.1073 6.672C35.0833 6.128 36.1553 5.856 37.3233 5.856C38.4913 5.856 39.5633 6.136 40.5393 6.696C41.5153 7.24 42.2833 7.984 42.8433 8.928C43.4193 9.872 43.7073 10.912 43.7073 12.048C43.7073 13.184 43.4193 14.232 42.8433 15.192C42.2833 16.136 41.5073 16.888 40.5153 17.448C39.5393 17.992 38.4673 18.264 37.2993 18.264ZM37.3233 15.288C38.2033 15.288 38.9313 14.984 39.5073 14.376C40.0993 13.768 40.3953 13 40.3953 12.072C40.3953 11.144 40.0993 10.368 39.5073 9.744C38.9313 9.12 38.2033 8.808 37.3233 8.808C36.4273 8.808 35.6913 9.12 35.1153 9.744C34.5393 10.352 34.2513 11.128 34.2513 12.072C34.2513 13 34.5393 13.768 35.1153 14.376C35.6913 14.984 36.4273 15.288 37.3233 15.288ZM62.2689 12.048C62.2689 13.312 61.9729 14.4 61.3809 15.312C60.8049 16.208 60.0049 16.904 58.9809 17.4C57.9729 17.88 56.8209 18.152 55.5249 18.216V22.32H52.3089V18.216C51.0129 18.136 49.8529 17.848 48.8289 17.352C47.8209 16.856 47.0209 16.16 46.4289 15.264C45.8529 14.352 45.5649 13.28 45.5649 12.048C45.5649 10.784 45.8529 9.696 46.4289 8.784C47.0209 7.872 47.8209 7.176 48.8289 6.696C49.8529 6.2 51.0129 5.92 52.3089 5.856V-1.43051e-06H55.5249V5.856C56.8209 5.936 57.9729 6.232 58.9809 6.744C60.0049 7.24 60.8049 7.944 61.3809 8.856C61.9729 9.752 62.2689 10.816 62.2689 12.048ZM48.7809 12.072C48.7809 13.096 49.1009 13.904 49.7409 14.496C50.3969 15.072 51.2769 15.4 52.3809 15.48V8.616C51.2609 8.68 50.3809 9.008 49.7409 9.6C49.1009 10.176 48.7809 11 48.7809 12.072ZM55.4529 15.48C56.5729 15.416 57.4529 15.088 58.0929 14.496C58.7329 13.904 59.0529 13.072 59.0529 12C59.0529 10.976 58.7249 10.168 58.0689 9.576C57.4289 8.968 56.5569 8.648 55.4529 8.616V15.48ZM75.8148 5.856V18H72.5748V11.568L65.9508 18.288H64.8948V6.12H68.1108V12.6L74.7588 5.856H75.8148ZM89.5843 6.12V18H86.3683V8.856H83.1763L83.1523 9.768C83.1043 11.8 82.9443 13.424 82.6723 14.64C82.4003 15.856 81.9683 16.76 81.3763 17.352C80.8003 17.928 80.0163 18.216 79.0243 18.216C78.5603 18.216 78.1523 18.144 77.8003 18V15.336C77.9283 15.368 78.0803 15.384 78.2563 15.384C78.7043 15.384 79.0563 15.168 79.3123 14.736C79.5843 14.304 79.7843 13.624 79.9123 12.696C80.0403 11.768 80.1123 10.52 80.1283 8.952L80.1523 6.12H89.5843ZM92.9495 6.12H96.1655V9.552H98.3255C99.7815 9.552 100.966 9.928 101.878 10.68C102.806 11.432 103.27 12.456 103.27 13.752C103.27 15.064 102.806 16.104 101.878 16.872C100.966 17.624 99.7815 18 98.3255 18H92.9495V6.12ZM98.2295 15.264C98.7735 15.264 99.1975 15.144 99.5015 14.904C99.8215 14.648 99.9815 14.28 99.9815 13.8C99.9815 13.336 99.8215 12.968 99.5015 12.696C99.1815 12.424 98.7575 12.288 98.2295 12.288H96.1655V15.264H98.2295Z" fill="var(--text-primary)"/>
            </g>
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

        <main className="w-full max-w-[1200px] mx-auto px-6 pt-[124px] pb-10">
          
          <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
            {/* Avatar Section */}
            <div className="flex flex-col items-center md:items-start w-full md:w-[320px] shrink-0 gap-6">
              <div className="flex flex-col items-center w-full">
                {avatar ? (
                  <div className="w-[124px] md:w-[200px] h-[124px] md:h-[200px] rounded-[32px] md:rounded-[48px] overflow-hidden border border-white/5 shadow-2xl transition-colors duration-300">
                    <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-[124px] md:w-[200px] h-[124px] md:h-[200px] bg-[var(--nav-bg)] backdrop-blur-3xl rounded-[32px] md:rounded-[48px] flex items-center justify-center text-center p-4 shadow-2xl border border-[var(--border-color)] transition-all duration-300">
                    <span className="text-[var(--text-secondary)] tvelvi-h6 md:text-xl opacity-40">Avatar</span>
                  </div>
                )}
              </div>

                <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full min-h-[160px] rounded-[24px] border border-dashed border-[var(--border-color)] flex flex-col items-center justify-center gap-2 cursor-pointer active:bg-[var(--text-primary)]/5 transition-all bg-[var(--nav-bg)]/20 backdrop-blur-md p-6 group hover:border-[var(--accent-cyan)] shadow-xl relative overflow-hidden"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <svg width="54" height="35" viewBox="137.5 25 54 35" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-1 transition-transform group-hover:-translate-y-1">
                  <path d="M164.5 52.4999V37.4999M164.5 37.4999L157.136 42.4999M164.5 37.4999L171.864 42.4999M191.5 49.9999C191.5 44.4771 187.104 39.9999 181.682 39.9999C181.624 39.9999 181.567 40.0004 181.509 40.0015C180.319 31.52 173.156 25 164.5 25C157.635 25 151.712 29.1001 148.96 35.027C142.561 35.4536 137.5 40.8745 137.5 47.4995C137.5 54.403 142.995 60 149.773 60L181.682 59.9998C187.104 59.9998 191.5 55.5227 191.5 49.9999Z" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p className="text-[var(--text-secondary)] text-[14px] font-medium mb-4 group-hover:text-[var(--text-primary)] transition-colors">Загрузите файл аватара</p>
                <div className="w-full max-w-[279px] h-[44px] bg-[#C2C2C2] hover:bg-[#a9a9a9] rounded-full flex items-center justify-center active:scale-95 transition-all shadow-md">
                  <span className="text-[#141414] text-[16px] font-bold">Выбрать файл</span>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </div>

              <button
                onClick={() => {
                  const newRole = "client";
                  startRoleTransition(newRole);
                  setTimeout(() => {
                      setActiveRole(newRole);
                      router.push("/profile");
                  }, 1500);
              }}
                className="w-full h-[56px] active:scale-[0.98] transition-all group hidden md:block mt-auto"
              >
                <svg width="100%" height="56" viewBox="0 0 327 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="0.5" y="0.5" width="326" height="55" rx="27.5" fill="var(--bg-color)" />
                  <rect x="0.5" y="0.5" width="326" height="55" rx="27.5" stroke="var(--text-primary)" className="group-hover:stroke-[var(--text-primary)] transition-colors" />
                  <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="var(--text-primary)" className="tvelvi-h6 tracking-wider" style={{ fontFamily: 'var(--font-cera), sans-serif', fontWeight: 700 }}>
                    Я клиент
                  </text>
                </svg>
              </button>
            </div>

            <div className="flex-1 w-full space-y-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-[0.2em] ml-4 transition-colors">ИМЯ ПАРТНЕРА</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={handleSave}
                    className="w-full h-[64px] bg-[var(--nav-bg)] backdrop-blur-md rounded-[24px] px-8 text-[16px] font-bold text-[var(--text-primary)] border border-[var(--border-color)] focus:border-[var(--accent-cyan)] focus:bg-[var(--nav-bg)] focus:outline-none transition-all placeholder:text-[var(--text-secondary)] shadow-xl"
                    placeholder="Аноним"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-[0.2em] ml-4 transition-colors">РАБОЧАЯ ПОЧТА</label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={handleSave}
                    className="w-full h-[64px] bg-[var(--nav-bg)] backdrop-blur-md rounded-[24px] px-8 text-[16px] font-bold text-[var(--text-primary)] border border-[var(--border-color)] focus:border-[var(--accent-cyan)] focus:bg-[var(--nav-bg)] focus:outline-none transition-all placeholder:text-[var(--text-secondary)] shadow-xl"
                    placeholder="N/A"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-[0.2em] ml-4">НОМЕР СВЯЗИ</label>
                  <div className="w-full h-[64px] bg-[var(--nav-bg)] backdrop-blur-md rounded-[24px] px-8 flex items-center text-[16px] font-bold tracking-widest text-[var(--text-primary)] border border-[var(--border-color)] opacity-50 shadow-inner">
                    {phone ? formatPhone(phone) : "+7 (000) 000 00-00"}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
