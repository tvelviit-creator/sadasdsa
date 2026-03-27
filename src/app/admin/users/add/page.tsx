"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { saveUserData, UserData } from "@/utils/userData";
import { ChevronLeft, UserPlus, User, Star } from "lucide-react";

export default function AddUserPage() {
  const router = useRouter();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isPartner, setIsPartner] = useState(false);
  const [avatar, setAvatar] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setAvatar(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!phone) {
      alert("Телефон обязателен");
      return;
    }
    
    const newUser: Partial<UserData> = {
      phone,
      name,
      email,
      isPartner,
      avatar,
    };
    
    saveUserData(phone, newUser);
    const registered = JSON.parse(localStorage.getItem("registeredPhones") || "[]");
    if (!registered.includes(phone)) {
        registered.push(phone);
        localStorage.setItem("registeredPhones", JSON.stringify(registered));
    }
    router.push("/admin");
  };

  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] font-sans flex justify-center selection:bg-[var(--accent-cyan)]/30 overflow-x-hidden w-full">
      {/* DESKTOP VIEW */}
      <div className="hidden md:flex flex-col w-full min-h-screen bg-[#0A0A0B] relative z-10 overflow-hidden">
         {/* Background Architectural Grid */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" 
               style={{ backgroundImage: `radial-gradient(white 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
          
          {/* Background Accents */}
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[var(--accent-cyan)]/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-500/5 blur-[120px] rounded-full pointer-events-none" />

          {/* Modern Slim Header */}
          <header className="h-20 shrink-0 flex items-center px-12 justify-between border-b border-white/[0.05] bg-[var(--card-bg)] z-[100] relative">
            <div className="flex items-center gap-10">
              <button 
                onClick={() => router.back()}
                className="w-10 h-10 rounded-xl border border-[var(--border-color)] bg-white/[0.02] flex items-center justify-center hover:bg-white/10 transition-all active:scale-95 group"
              >
                <ChevronLeft className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" />
              </button>
              
              <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--accent-cyan)] opacity-60">Управление пользователями</span>
                <div className="flex items-center gap-2">
                   <span className="text-[15px] font-bold text-white/90">Создание нового профиля</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
               <button
                 onClick={handleSave}
                 disabled={!phone}
                 className="h-12 px-10 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-500 hover:bg-[var(--accent-cyan)] hover:text-black text-white/80 border border-white/10 hover:border-[var(--accent-cyan)] active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
               >
                 СОЗДАТЬ ПРОФИЛЬ
               </button>
            </div>
          </header>

          <main className="flex-1 flex overflow-hidden relative z-10 w-full max-w-[1600px] mx-auto">
             {/* Left Side: The Editor */}
             <div className="flex-1 overflow-y-auto no-scrollbar pt-16 pb-32 px-12 xl:px-24">
                <div className="max-w-[800px] mx-auto flex flex-col gap-24">
                   
                   {/* Section 1: Identity */}
                   <div className="flex flex-col gap-16">
                      <div className="flex flex-col gap-2">
                         <h2 className="text-5xl font-black font-cera uppercase tracking-tighter text-white">Профиль <br/><span className="text-white/20">пользователя</span></h2>
                      </div>

                      <div className="grid grid-cols-12 gap-12">
                         {/* Avatar Drop */}
                         <div className="col-span-12 xl:col-span-4">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-4 block">Аватар</span>
                            <div 
                              onClick={() => fileInputRef.current?.click()}
                              className={`aspect-square rounded-[32px] border-2 border-dashed transition-all duration-700 cursor-pointer overflow-hidden group relative flex flex-col items-center justify-center w-full max-w-[280px] ${
                                avatar ? 'border-transparent' : 'border-[var(--border-color)] hover:border-[var(--accent-cyan)]/40 hover:bg-[var(--accent-cyan)]/[0.02]'
                              }`}
                            >
                              {avatar ? (
                                <>
                                  <img src={avatar} alt="Avatar Preview" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                                     <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Заменить</span>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="w-16 h-16 rounded-full bg-white/[0.03] border border-[var(--border-color)] flex items-center justify-center mb-6 group-hover:border-[var(--accent-cyan)]/30 transition-colors">
                                     <UserPlus className="w-6 h-6 text-white/10 group-hover:text-[var(--accent-cyan)]" />
                                  </div>
                                  <span className="text-[10px] font-black uppercase tracking-widest text-white/20 group-hover:text-white/40 transition-colors">Загрузить</span>
                                </>
                              )}
                            </div>
                         </div>

                         <div className="col-span-12 xl:col-span-8 flex flex-col justify-center gap-12 xl:pl-8">
                            {/* Phone Input Group */}
                            <div className="flex flex-col gap-3 group border-b border-[var(--border-color)] focus-within:border-[var(--accent-cyan)] transition-all duration-500 pb-4">
                               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 group-focus-within:text-[var(--accent-cyan)] transition-colors">Телефон *</span>
                               <input 
                                 type="text"
                                 value={phone}
                                 onChange={(e) => setPhone(e.target.value)}
                                 placeholder="79991234567"
                                 className="bg-transparent text-2xl font-bold text-white outline-none placeholder:text-white/5 tracking-tight w-full"
                               />
                            </div>

                            {/* Name Input Group */}
                            <div className="flex flex-col gap-3 group border-b border-[var(--border-color)] focus-within:border-[var(--accent-cyan)] transition-all duration-500 pb-4">
                               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 group-focus-within:text-[var(--accent-cyan)] transition-colors">Имя</span>
                               <input 
                                 type="text"
                                 value={name}
                                 onChange={(e) => setName(e.target.value)}
                                 placeholder="Иван Иванов"
                                 className="bg-transparent text-xl font-bold text-white outline-none placeholder:text-white/5 tracking-tight w-full"
                               />
                            </div>

                            {/* Email Input Group */}
                            <div className="flex flex-col gap-3 group border-b border-[var(--border-color)] focus-within:border-[var(--accent-cyan)] transition-all duration-500 pb-4">
                               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 group-focus-within:text-[var(--accent-cyan)] transition-colors">Почта</span>
                               <input 
                                 type="email"
                                 value={email}
                                 onChange={(e) => setEmail(e.target.value)}
                                 placeholder="email@example.com"
                                 className="bg-transparent text-xl font-bold text-white outline-none placeholder:text-white/5 tracking-tight w-full"
                               />
                            </div>
                            
                            {/* Partner Switch */}
                            <div className="flex items-center justify-between p-6 rounded-[24px] border border-[var(--border-color)] bg-white/[0.01] hover:bg-white/[0.02] cursor-pointer transition-colors" onClick={() => setIsPartner(!isPartner)}>
                               <div className="flex flex-col gap-1">
                                  <span className={`text-sm font-bold tracking-tight transition-colors ${isPartner ? 'text-[var(--accent-cyan)]' : 'text-white'}`}>Статус партнера</span>
                                  <span className="text-[10px] font-medium text-white/30 uppercase tracking-widest">Достаточен для доступа к селлерской панели</span>
                               </div>
                               <div className={`w-12 h-6 rounded-full relative transition-all duration-500 ${isPartner ? 'bg-[var(--accent-cyan)]' : 'bg-white/10'}`}>
                                  <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all duration-500 ${isPartner ? 'left-[26px]' : 'left-1'}`} />
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>

             {/* Right Side: LIVE Preview Shell */}
             <div className="hidden xl:flex w-[400px] border-l border-white/[0.05] bg-black/20 flex-col p-12 shrink-0">
                <div className="sticky top-0 flex flex-col gap-10">
                   {/* User Card Mimic */}
                   <div className="flex justify-center pt-8">
                      <div className="w-full flex flex-col group/preview">
                          <div className="aspect-[3/4] bg-white/[0.02] rounded-[32px] border border-white/[0.05] relative overflow-hidden mb-6 shadow-2xl transition-all duration-700 hover:border-[var(--accent-cyan)]/20 hover:shadow-[0_20px_50px_rgba(26,232,232,0.1)]">
                              {avatar ? (
                                <img src={avatar} className="w-full h-full object-cover opacity-80" alt="" />
                              ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center opacity-10 border border-[var(--border-color)]">
                                   <User className="w-24 h-24 mb-4" />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                              
                              <div className="absolute top-6 right-6 text-white/40 group-hover/preview:text-[var(--accent-cyan)] transition-colors">
                                 {isPartner && <Star className="w-6 h-6 fill-current text-[var(--accent-cyan)] drop-shadow-[0_0_10px_rgba(26,232,232,0.5)]" />}
                              </div>

                              <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-2">
                                 <h3 className="text-2xl font-bold font-cera text-white leading-tight drop-shadow-md">
                                    {name || "Профиль"}
                                 </h3>
                                 {phone ? (
                                   <div className="text-[12px] font-bold text-[var(--accent-cyan)] opacity-80 tracking-widest">{phone}</div>
                                 ) : (
                                   <div className="text-[12px] font-bold text-white/20 tracking-widest uppercase">Телефон не указан</div>
                                 )}
                                 {email && (
                                   <div className="text-[10px] font-medium text-white/50">{email}</div>
                                 )}
                              </div>
                          </div>
                      </div>
                   </div>
                </div>
             </div>
          </main>
      </div>

      <div className="md:hidden w-full relative min-h-screen bg-transparent flex flex-col items-center">
        {/* Mobile Background Elements */}
        <div className="md:hidden fixed inset-0 z-[-1] pointer-events-none opacity-[0.03]" style={{ backgroundImage: `radial-gradient(white 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
        <div className="md:hidden fixed top-[-10%] right-[-10%] w-[60%] h-[60%] bg-[var(--accent-cyan)]/5 blur-[100px] rounded-full pointer-events-none z-[-1]" />
        <div className="md:hidden fixed bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-500/5 blur-[100px] rounded-full pointer-events-none z-[-1]" />
        
        {/* Header - 1:1 SVG Match */}
        <header className="fixed top-0 w-full max-w-[375px] h-[102px] z-[100] bg-black/40 backdrop-blur-3xl border-b border-white/5 shadow-2xl transition-colors duration-300">
          <svg width="375" height="102" viewBox="0 0 375 102" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full absolute -z-10 left-0 bottom-0 pointer-events-none">
            <mask id="path-1-inside-1_1706_5018_add" fill="white">
              <path d="M0 0H375V102H0V0Z"/>
            </mask>
            <path d="M0 0H375V102H0V0Z" fill="transparent"/>
            <path d="M375 102V101H0V102V103H375V102Z" fill="transparent" mask="url(#path-1-inside-1_1706_5018_add)"/>
            <path d="M51 72L29 72M29 72L38.4286 81M29 72L38.4286 63" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M337.5 69.5556V78.1111M332.5 69.5556V78.1111M327.5 64.6667V79.0889C327.5 80.4579 327.5 81.1419 327.772 81.6648C328.012 82.1248 328.394 82.4995 328.865 82.7338C329.399 83 330.099 83 331.496 83H338.504C339.901 83 340.6 83 341.134 82.7338C341.605 82.4995 341.988 82.1248 342.228 81.6648C342.5 81.1425 342.5 80.459 342.5 79.0927V64.6667M327.5 64.6667H330M327.5 64.6667H325M330 64.6667H340M330 64.6667C330 63.5277 330 62.9585 330.19 62.5093C330.444 61.9103 330.93 61.4342 331.543 61.1861C332.002 61 332.585 61 333.75 61H336.25C337.415 61 337.997 61 338.457 61.1861C339.069 61.4342 339.556 61.9103 339.81 62.5093C340 62.9585 340 63.5277 340 64.6667M340 64.6667H342.5M342.5 64.6667H345" stroke="#FF8C67" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M107.859 64.16H121.107V80H117.867V67.088H111.099V80H107.859V64.16ZM130.065 80.264C128.897 80.264 127.825 79.992 126.849 79.448C125.889 78.888 125.129 78.136 124.569 77.192C124.009 76.232 123.729 75.184 123.729 74.048C123.729 72.912 124.009 71.872 124.569 70.928C125.129 69.968 125.897 69.216 126.873 68.672C127.849 68.128 128.921 67.856 130.089 67.856C131.257 67.856 132.329 68.136 133.305 68.696C134.281 69.24 135.049 69.984 135.609 70.928C136.185 71.872 136.473 72.912 136.473 74.048C136.473 75.184 136.185 76.232 135.609 77.192C135.049 78.136 134.273 78.888 133.281 79.448C132.305 79.992 131.233 80.264 130.065 80.264ZM130.089 77.288C130.969 77.288 131.697 76.984 132.273 76.376C132.865 75.768 133.161 75 133.161 74.072C133.161 73.144 132.865 72.368 132.273 71.744C131.697 71.12 130.969 70.808 130.089 70.808C129.193 70.808 128.457 71.12 127.881 71.744C127.305 72.352 127.017 73.128 127.017 74.072C127.017 75 127.305 75.768 127.881 76.376C128.457 76.984 129.193 77.288 130.089 77.288ZM149.491 68.12V80H146.275V70.856H143.083L143.059 71.768C143.011 73.8 142.851 75.424 142.579 76.64C142.307 77.856 141.875 78.76 141.283 79.352C140.707 79.928 139.923 80.216 138.931 80.216C138.467 80.216 138.059 80.144 137.707 80V77.336C137.835 77.368 137.987 77.384 138.163 77.384C138.611 77.384 138.963 77.168 139.219 76.736C139.491 76.304 139.691 75.624 139.819 74.696C139.947 73.768 140.019 72.52 140.035 70.952L140.059 68.12H149.491ZM152.856 68.12H156.072V71.552H158.232C159.688 71.552 160.872 71.928 161.784 72.68C162.712 73.432 163.176 74.456 163.176 75.752C163.176 77.064 162.712 78.104 161.784 78.872C160.872 79.624 159.688 80 158.232 80H152.856V68.12ZM158.136 77.264C158.68 77.264 159.104 77.144 159.408 76.904C159.728 76.648 159.888 76.28 159.888 75.8C159.888 75.336 159.728 74.968 159.408 74.696C159.088 74.424 158.664 74.288 158.136 74.288H156.072V77.264H158.136ZM172.975 73.832C173.519 74.12 173.935 74.504 174.223 74.984C174.511 75.448 174.655 75.96 174.655 76.52C174.655 77.736 174.239 78.672 173.407 79.328C172.575 79.968 171.367 80.288 169.783 80.288C167.527 80.288 165.823 79.544 164.671 78.056L166.495 76.136C167.295 77.048 168.327 77.504 169.591 77.504C170.215 77.504 170.687 77.392 171.007 77.168C171.343 76.944 171.511 76.64 171.511 76.256C171.511 75.904 171.367 75.624 171.079 75.416C170.791 75.208 170.375 75.104 169.831 75.104H168.295V72.704H169.687C170.103 72.704 170.423 72.616 170.647 72.44C170.887 72.248 171.007 71.992 171.007 71.672C171.007 71.352 170.879 71.104 170.623 70.928C170.383 70.736 170.023 70.64 169.543 70.64C168.407 70.64 167.471 71.04 166.735 71.84L164.887 69.896C165.447 69.24 166.143 68.736 166.975 68.384C167.807 68.032 168.727 67.856 169.735 67.856C171.127 67.856 172.207 68.16 172.975 68.768C173.759 69.376 174.151 70.232 174.151 71.336C174.151 72.36 173.759 73.192 172.975 73.832ZM182.94 80.264C181.772 80.264 180.7 79.992 179.724 79.448C178.764 78.888 178.004 78.136 177.444 77.192C176.884 76.232 176.604 75.184 176.604 74.048C176.604 72.912 176.884 71.872 177.444 70.928C178.004 69.968 178.772 69.216 179.748 68.672C180.724 68.128 181.796 67.856 182.964 67.856C184.132 67.856 185.204 68.136 186.18 68.696C187.156 69.24 187.924 69.984 188.484 70.928C189.06 71.872 189.348 72.912 189.348 74.048C189.348 75.184 189.06 76.232 188.484 77.192C187.924 78.136 187.148 78.888 186.156 79.448C185.18 79.992 184.108 80.264 182.94 80.264ZM182.964 77.288C183.844 77.288 184.572 76.984 185.148 76.376C185.74 75.768 186.036 75 186.036 74.072C186.036 73.144 185.74 72.368 185.148 71.744C184.572 71.12 183.844 70.808 182.964 70.808C182.068 70.808 181.332 71.12 180.756 71.744C180.18 72.352 179.892 73.128 179.892 74.072C179.892 75 180.18 75.768 180.756 76.376C181.332 76.984 182.068 77.288 182.964 77.288ZM200.686 73.64C201.262 73.896 201.71 74.256 202.03 74.72C202.366 75.184 202.534 75.736 202.534 76.376C202.534 77.08 202.35 77.712 201.982 78.272C201.614 78.816 201.102 79.24 200.446 79.544C199.806 79.848 199.078 80 198.262 80H191.95V68.12H197.47C198.686 68.12 199.686 68.424 200.47 69.032C201.254 69.624 201.646 70.432 201.646 71.456C201.646 72.32 201.326 73.048 200.686 73.64ZM195.022 72.752H197.278C198.238 72.752 198.718 72.384 198.718 71.648C198.718 71.264 198.598 70.984 198.358 70.808C198.118 70.632 197.758 70.544 197.278 70.544H195.022V72.752ZM197.902 77.6C198.414 77.6 198.814 77.48 199.102 77.24C199.406 77 199.558 76.68 199.558 76.28C199.558 75.88 199.406 75.568 199.102 75.344C198.814 75.12 198.414 75.008 197.902 75.008H195.022V77.6H197.902ZM210.015 67.856C211.567 67.856 212.799 68.296 213.711 69.176C214.639 70.04 215.103 71.296 215.103 72.944V80H212.127V78.848C211.695 79.296 211.167 79.648 210.543 79.904C209.935 80.16 209.255 80.288 208.503 80.288C207.239 80.288 206.239 79.96 205.503 79.304C204.767 78.632 204.399 77.776 204.399 76.736C204.399 75.664 204.799 74.824 205.599 74.216C206.415 73.592 207.511 73.28 208.887 73.28H211.863V72.752C211.863 72.096 211.671 71.584 211.287 71.216C210.919 70.848 210.375 70.664 209.655 70.664C209.047 70.664 208.503 70.8 208.023 71.072C207.543 71.328 207.039 71.736 206.511 72.296L204.831 70.304C206.207 68.672 207.935 67.856 210.015 67.856ZM209.367 77.912C210.071 77.912 210.663 77.696 211.143 77.264C211.623 76.816 211.863 76.248 211.863 75.56V75.416H209.319C208.791 75.416 208.383 75.52 208.095 75.728C207.807 75.92 207.663 76.216 207.663 76.616C207.663 77.016 207.815 77.336 208.119 77.576C208.439 77.8 208.855 77.912 209.367 77.912ZM220.363 70.856H216.715V68.12H227.251V70.856H223.579V80H220.363V70.856ZM240.11 75.152H231.782C231.974 75.904 232.358 76.488 232.934 76.904C233.526 77.304 234.254 77.504 235.118 77.504C236.286 77.504 237.39 77.104 238.43 76.304L239.774 78.512C238.366 79.696 236.782 80.288 235.022 80.288C233.79 80.288 232.678 80.016 231.686 79.472C230.694 78.928 229.918 78.184 229.358 77.24C228.798 76.28 228.518 75.224 228.518 74.072C228.518 72.92 228.79 71.872 229.334 70.928C229.878 69.968 230.622 69.216 231.566 68.672C232.526 68.128 233.582 67.856 234.734 67.856C235.822 67.856 236.79 68.104 237.638 68.6C238.486 69.08 239.142 69.744 239.606 70.592C240.086 71.424 240.326 72.352 240.326 73.376C240.326 73.952 240.254 74.544 240.11 75.152ZM234.614 70.472C233.926 70.472 233.326 70.688 232.814 71.12C232.302 71.552 231.958 72.136 231.782 72.872H237.182C237.166 72.136 236.91 71.552 236.414 71.12C235.918 70.688 235.318 70.472 234.614 70.472ZM253.342 68.12V80H250.126V70.856H246.934L246.91 71.768C246.862 73.8 246.702 75.424 246.43 76.64C246.158 77.856 245.726 78.76 245.134 79.352C244.558 79.928 243.774 80.216 242.782 80.216C242.318 80.216 241.91 80.144 241.558 80V77.336C241.686 77.368 241.838 77.384 242.014 77.384C242.462 77.384 242.814 77.168 243.07 76.736C243.342 76.304 243.542 75.624 243.67 74.696C243.798 73.768 243.87 72.52 243.886 70.952L243.91 68.12H253.342ZM256.707 68.12H259.923V71.552H262.083C263.539 71.552 264.723 71.928 265.635 72.68C266.563 73.432 267.027 74.456 267.027 75.752C267.027 77.064 266.563 78.104 265.635 78.872C264.723 79.624 263.539 80 262.083 80H256.707V68.12ZM261.987 77.264C262.531 77.264 262.955 77.144 263.259 76.904C263.579 76.648 263.739 76.28 263.739 75.8C263.739 75.336 263.579 74.968 263.259 74.696C262.939 74.424 262.515 74.288 261.987 74.288H259.923V77.264H261.987Z" fill="var(--text-primary)"/>
          </svg>

          {/* Hit Area for Back Button */}
          <button 
            onClick={() => router.back()} 
            className="absolute left-[24px] bottom-[10px] w-[50px] h-[50px] bg-transparent border-none outline-none cursor-pointer z-[110]"
            aria-label="Back"
          />
        </header>

        <main className="flex-1 w-full pt-[118px] md:pt-6 px-6 md:px-10 lg:px-12 pb-20 flex flex-col items-center md:items-start">
          
          <div className="w-full max-w-[500px] space-y-8">
            <div className="space-y-5">

             <div className="flex flex-col items-center md:items-start mb-8">
               <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                 {avatar ? (
                   <div className="w-[124px] h-[124px] rounded-[32px] overflow-hidden border border-[var(--border-color)] shadow-xl transition-transform group-hover:scale-105">
                     <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                   </div>
                 ) : (
                   <div className="w-[124px] h-[124px] bg-[var(--text-primary)] rounded-[32px] flex items-center justify-center text-center p-4 shadow-xl shadow-[var(--text-primary)]/20 transition-transform group-hover:scale-105">
                     <span className="text-[var(--bg-color)] text-3xl font-black uppercase font-cera">
                       {(name?.[0] || 'N').toUpperCase()}
                     </span>
                   </div>
                 )}
                 {/* Hover Overlay */}
                 <div className="absolute inset-0 bg-black/50 rounded-[32px] opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 transition-opacity duration-300">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    <span className="text-white text-[10px] font-bold uppercase tracking-wider">Загрузить</span>
                 </div>
                 <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
               </div>
             </div>

               <div className="space-y-2">
                  <p className="text-[11px] font-bold text-[var(--text-secondary)] ml-1" style={{ fontFamily: 'var(--font-cera)', lineHeight: '1.2' }}>Имя</p>
                  <div className="w-full h-[60px] bg-white/5 backdrop-blur-sm rounded-[20px] flex items-center px-5 border border-white/10 shadow-sm">
                    <input 
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full bg-transparent border-none outline-none text-[16px] font-bold text-[var(--text-primary)] placeholder-[var(--text-primary)]/20 transition-colors focus:text-[var(--accent-cyan)]"
                      style={{ fontFamily: 'var(--font-cera)' }}
                      placeholder="Иван Петров"
                    />
                  </div>
               </div>

               <div className="space-y-2">
                  <p className="text-[11px] font-bold text-[var(--text-secondary)] ml-1" style={{ fontFamily: 'var(--font-cera)', lineHeight: '1.2' }}>Почта</p>
                  <div className="w-full h-[60px] bg-white/5 backdrop-blur-sm rounded-[20px] flex items-center px-5 border border-white/10 shadow-sm">
                    <input 
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full bg-transparent border-none outline-none text-[16px] font-bold text-[var(--text-primary)] placeholder-[var(--text-primary)]/20 transition-colors focus:text-[var(--accent-cyan)]"
                      style={{ fontFamily: 'var(--font-cera)' }}
                      placeholder="email@example.com"
                    />
                  </div>
               </div>

               <div className="space-y-2">
                  <p className="text-[11px] font-bold text-[var(--text-secondary)] ml-1" style={{ fontFamily: 'var(--font-cera)', lineHeight: '1.2' }}>Номер телефона</p>
                  <div className="w-full h-[60px] bg-white/5 backdrop-blur-sm rounded-[20px] flex items-center px-5 border border-white/10 shadow-sm">
                    <input 
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full bg-transparent border-none outline-none text-[16px] font-bold text-[var(--text-primary)] placeholder-[var(--text-primary)]/20 tabular-nums transition-colors focus:text-[var(--accent-cyan)]"
                      style={{ fontFamily: 'var(--font-cera)' }}
                      placeholder="79991234567"
                    />
                  </div>
               </div>

               {/* Partner Status Card - Styled as form element */}
               <div className="space-y-2">
                 <p className="text-[11px] font-bold text-[var(--text-secondary)] ml-1" style={{ fontFamily: 'var(--font-cera)', lineHeight: '1.2' }}>Статус</p>
                 <div className="bg-white/5 backdrop-blur-sm rounded-[20px] p-5 flex items-center justify-between active:scale-[0.98] transition-all cursor-pointer border border-white/10 shadow-sm hover:shadow-lg" onClick={() => setIsPartner(!isPartner)}>
                    <div className="space-y-0.5" style={{ fontFamily: 'var(--font-cera)' }}>
                       <p className={`text-[16px] font-bold tracking-tight transition-colors ${isPartner ? 'text-[var(--accent-cyan)]' : 'text-[var(--text-primary)]'}`} style={{ lineHeight: '1.2' }}>Статус партнера</p>
                       <p className="text-[11px] font-bold text-[var(--text-secondary)]" style={{ lineHeight: '1.2' }}>Доступ к партнерской панели</p>
                    </div>
                    <div 
                      className={`w-[58px] h-[32px] rounded-full relative transition-all duration-500 overflow-hidden border ${isPartner ? 'bg-[var(--accent-cyan)] border-[var(--accent-cyan)]' : 'bg-[var(--bg-color)] border-[var(--border-color)]'}`}
                    >
                       <div 
                         className={`absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full transition-all duration-500 ease-[cubic-bezier(0.68,-0.55,0.27,1.55)] ${isPartner ? 'right-1 bg-white shadow-lg' : 'left-1 bg-[var(--border-color)]'}`}
                       />
                    </div>
                 </div>
               </div>
            </div>

            <div className="w-full pt-4">
              <button 
                onClick={handleSave}
                className="w-full h-[56px] bg-[var(--accent-cyan)] text-[#0A0A0A] shadow-[0_0_20px_rgba(26,232,232,0.3)] hover:scale-[1.02] rounded-[20px] text-[16px] font-bold tracking-wider active:scale-95 transition-all"
                style={{ fontFamily: 'var(--font-cera)', lineHeight: '1.2' }}
              >
                Создать
              </button>
            </div>
          </div>
        </main>
      </div>

      <style jsx global>{`
        body { background-color: var(--bg-color); }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
