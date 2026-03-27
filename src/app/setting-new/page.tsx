"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getActiveRole, setActiveRole, startRoleTransition, getCurrentUserPhone } from "@/utils/userData";

export default function SettingsPage() {
  const router = useRouter();
  const [activeRole, setRoleState] = useState<"client" | "seller">("client");
  const [userPhone, setUserPhone] = useState<string | null>(null);

  useEffect(() => {
    setRoleState(getActiveRole());
    setUserPhone(getCurrentUserPhone());
  }, []);

  const handleRoleChange = (newRole: "client" | "seller") => {
    if (newRole === activeRole) return;
    
    // Trigger premium transition
    startRoleTransition(newRole);
    
    // Update role after a short delay to sync with animation
    setTimeout(() => {
      setActiveRole(newRole);
      setRoleState(newRole);
      // Dispatch event for other components
      window.dispatchEvent(new Event('role-change'));
    }, 1000); 
  };

  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] flex flex-col items-center transition-colors duration-300 font-sans overflow-x-hidden selection:bg-[var(--accent-cyan)]/30">
      
      {/* Shared Background Architectural Elements */}
      <div className="absolute inset-0 z-[0] pointer-events-none opacity-[0.05] dark:opacity-[0.03]" style={{ backgroundImage: `radial-gradient(var(--text-primary) 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
      <div className="fixed top-[-10%] right-[-10%] w-[60%] h-[60%] bg-[var(--accent-cyan)]/5 blur-[100px] rounded-full pointer-events-none z-[0]" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-500/5 blur-[100px] rounded-full pointer-events-none z-[0]" />

      {/* --- DESKTOP LAYOUT --- */}
      <div className="hidden md:flex flex-col w-full max-w-[1200px] mx-auto px-10 py-20 relative z-10 min-h-screen">
        <header className="mb-20 flex items-center justify-between">
            <div className="space-y-4">
                <button 
                  onClick={() => router.push(activeRole === 'seller' ? '/seller' : '/client')}
                  className="group flex items-center gap-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all uppercase text-[11px] font-black tracking-[0.2em]"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                  Вернуться
                </button>
                <h1 className="text-5xl lg:text-7xl font-black font-cera text-[var(--text-primary)] tracking-tighter leading-none uppercase">
                    НАСТРОЙКИ & <br/>
                    <span className="text-[var(--accent-cyan)] opacity-80 dark:opacity-40">ПРИЛОЖЕНИЕ</span>
                </h1>
            </div>

            <div className="hidden lg:block w-[400px] h-px bg-gradient-to-r from-[var(--border-color)] to-transparent" />
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-20">
          {/* Left Column: Role Switcher */}
          <section className="space-y-8">
            <div className="space-y-2">
                <h2 className="text-[14px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] opacity-80">Выбор режима</h2>
                <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed">Переключайтесь между интерфейсом клиента и продавца в одно нажатие.</p>
            </div>

            <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-[32px] p-2 flex relative shadow-2xl shadow-black/5 dark:shadow-black/20 overflow-hidden h-[72px]">
                <div 
                  className={`absolute top-2 bottom-2 w-[calc(50%-8px)] bg-[var(--text-primary)] rounded-[24px] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] z-0 
                    ${activeRole === 'seller' ? 'left-2' : 'left-[calc(50%)]'}`}
                />
                
                <button 
                  onClick={() => handleRoleChange('seller')}
                  className={`flex-1 relative z-10 font-bold text-[13px] uppercase tracking-widest transition-colors duration-500
                    ${activeRole === 'seller' ? 'text-[var(--bg-color)]' : 'text-[var(--text-secondary)]'}`}
                >
                  ПАРТНЕР
                </button>
                
                <button 
                  onClick={() => handleRoleChange('client')}
                  className={`flex-1 relative z-10 font-bold text-[13px] uppercase tracking-widest transition-colors duration-500
                    ${activeRole === 'client' ? 'text-[var(--bg-color)]' : 'text-[var(--text-secondary)]'}`}
                >
                  КЛИЕНТ
                </button>
            </div>
          </section>

          {/* Right Column: Menu Items */}
          <section className="space-y-12">
            <h2 className="text-[14px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] opacity-80">Основные разделы</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <button 
                    onClick={() => router.push('/order')}
                    className="group h-[220px] bg-[var(--card-bg)] border border-[var(--border-color)] rounded-[40px] p-10 flex flex-col justify-between hover:border-[var(--accent-cyan)] transition-all hover:translate-y-[-8px] relative overflow-hidden shadow-lg shadow-black/5"
                >
                    <div className="w-14 h-14 bg-[var(--accent-cyan)]/10 rounded-[20px] flex items-center justify-center border border-[var(--accent-cyan)]/20 group-hover:scale-110 transition-transform duration-500">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                            <path d="M3 6h18" />
                            <path d="M16 10a4 4 0 0 1-8 0" />
                        </svg>
                    </div>
                    <div className="space-y-2 text-left">
                        <h3 className="text-2xl font-black font-cera uppercase text-[var(--text-primary)]">Заказы</h3>
                        <p className="text-[14px] text-[var(--text-secondary)]">Управление активными проектами</p>
                    </div>
                    <div className="absolute top-8 right-8 text-[var(--text-primary)] opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 17l10-10M7 7h10v10" />
                      </svg>
                    </div>
                </button>
                <button 
                    onClick={() => router.push(activeRole === 'seller' ? '/lkseller' : '/profile')}
                    className="group h-[220px] bg-[var(--card-bg)] border border-[var(--border-color)] rounded-[40px] p-10 flex flex-col justify-between hover:border-[var(--accent-cyan)] transition-all hover:translate-y-[-8px] relative overflow-hidden shadow-lg shadow-black/5"
                >
                    <div className="w-14 h-14 bg-pink-500/10 rounded-[20px] flex items-center justify-center border border-pink-500/20 group-hover:scale-110 transition-transform duration-500">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgb(236, 72, 153)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                    </div>
                    <div className="space-y-2 text-left">
                        <h3 className="text-2xl font-black font-cera uppercase text-[var(--text-primary)]">Профиль</h3>
                        <p className="text-[14px] text-[var(--text-secondary)]">Управление данными и аккаунтом</p>
                    </div>
                    <div className="absolute top-8 right-8 text-[var(--text-primary)] opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 17l10-10M7 7h10v10" />
                      </svg>
                    </div>
                </button>

                <button 
                    onClick={() => router.push('/tema')}
                    className="group h-[220px] bg-[var(--card-bg)] border border-[var(--border-color)] rounded-[40px] p-10 flex flex-col justify-between hover:border-[var(--accent-cyan)] transition-all hover:translate-y-[-8px] relative overflow-hidden shadow-lg shadow-black/5"
                >
                    <div className="w-14 h-14 bg-[var(--accent-cyan)]/10 rounded-[20px] flex items-center justify-center border border-[var(--accent-cyan)]/20 group-hover:scale-110 transition-transform duration-500">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="5" />
                            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                        </svg>
                    </div>
                    <div className="space-y-2 text-left">
                        <h3 className="text-2xl font-black font-cera uppercase text-[var(--text-primary)]">Тема</h3>
                        <p className="text-[14px] text-[var(--text-secondary)]">Персонализация интерфейса</p>
                    </div>
                    <div className="absolute top-8 right-8 text-[var(--text-primary)] opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 17l10-10M7 7h10v10" />
                      </svg>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-[var(--accent-cyan)]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>

                {userPhone === "79999999999" && (
                    <button 
                        onClick={() => router.push('/admin')}
                        className="group h-[220px] bg-[var(--accent-cyan)]/5 border border-[var(--accent-cyan)]/20 rounded-[40px] p-10 flex flex-col justify-between hover:border-[var(--accent-cyan)] transition-all hover:translate-y-[-8px] relative overflow-hidden shadow-lg shadow-black/5"
                    >
                        <div className="w-14 h-14 bg-[var(--accent-cyan)]/10 rounded-[20px] flex items-center justify-center border border-[var(--accent-cyan)]/20 group-hover:scale-110 transition-transform duration-500">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                            </svg>
                        </div>
                        <div className="space-y-2 text-left">
                            <h3 className="text-2xl font-black font-cera uppercase text-[var(--accent-cyan)]">Админ-панель</h3>
                            <p className="text-[14px] text-[var(--text-secondary)]">Управление платформой</p>
                        </div>
                        <div className="absolute top-8 right-8 text-[var(--accent-cyan)] opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M7 17l10-10M7 7h10v10" />
                            </svg>
                        </div>
                    </button>
                )}
            </div>
          </section>
        </div>
      </div>

      {/* --- MOBILE LAYOUT --- */}
      <div className="md:hidden flex flex-col w-full items-center relative z-10 transition-opacity duration-500">
        {/* Mobile Premium Header */}
        <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[375px] h-[102px] z-50">
          <svg width="375" height="102" viewBox="0 0 375 102" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <mask id="path-1-inside-1_1767_18849" fill="white">
              <path d="M0 0H375V102H0V0Z"/>
            </mask>
            <path d="M0 0H375V102H0V0Z" fill="var(--bg-color)"/>
            <path d="M375 102V101H0V102V103H375V102Z" fill="var(--border-color)" mask="url(#path-1-inside-1_1767_18849)"/>
            <path d="M126.125 64.16H129.365V70.232H136.373V64.16H139.613V80H136.373V73.16H129.365V80H126.125V64.16ZM147.773 67.856C149.325 67.856 150.557 68.296 151.469 69.176C152.397 70.04 152.861 71.296 152.861 72.944V80H149.885V78.848C149.453 79.296 148.925 79.648 148.301 79.904C147.693 80.16 147.013 80.288 146.261 80.288C144.997 80.288 143.997 79.96 143.261 79.304C142.525 78.632 142.157 77.776 142.157 76.736C142.157 75.664 142.557 74.824 143.357 74.216C144.173 73.592 145.269 73.28 146.645 73.28H149.621V72.752C149.621 72.096 149.429 71.584 149.045 71.216C148.677 70.848 148.133 70.664 147.413 70.664C146.805 70.664 146.261 70.8 145.781 71.072C145.301 71.328 144.797 71.736 144.269 72.296L142.589 70.304C143.965 68.672 145.693 67.856 147.773 67.856ZM147.125 77.912C147.829 77.912 148.421 77.696 148.901 77.264C149.381 76.816 149.621 76.248 149.621 75.56V75.416H147.077C146.549 75.416 146.141 75.52 145.853 75.728C145.565 75.92 145.421 76.216 145.421 76.616C145.421 77.016 145.573 77.336 145.877 77.576C146.197 77.8 146.613 77.912 147.125 77.912ZM161.667 80.288C160.499 80.288 159.427 80.016 158.451 79.472C157.491 78.912 156.723 78.16 156.147 77.216C155.587 76.256 155.307 75.2 155.307 74.048C155.307 72.896 155.587 71.848 156.147 70.904C156.723 69.96 157.491 69.216 158.451 68.672C159.427 68.128 160.499 67.856 161.667 67.856C162.835 67.856 163.859 68.12 164.739 68.648C165.619 69.16 166.315 69.872 166.827 70.784L164.571 72.536C164.203 71.992 163.787 71.568 163.323 71.264C162.875 70.96 162.339 70.808 161.715 70.808C160.803 70.808 160.051 71.12 159.459 71.744C158.883 72.352 158.595 73.12 158.595 74.048C158.595 74.992 158.883 75.776 159.459 76.4C160.051 77.008 160.803 77.312 161.715 77.312C162.323 77.312 162.851 77.168 163.299 76.88C163.763 76.576 164.187 76.152 164.571 75.608L166.827 77.336C166.315 78.248 165.611 78.968 164.715 79.496C163.835 80.024 162.819 80.288 161.667 80.288ZM171.597 70.856H167.949V68.12H178.485V70.856H174.813V80H171.597V70.856ZM187.216 67.856C188.32 67.856 189.304 68.128 190.168 68.672C191.048 69.2 191.736 69.936 192.232 70.88C192.728 71.808 192.976 72.864 192.976 74.048C192.976 75.232 192.728 76.296 192.232 77.24C191.736 78.184 191.048 78.928 190.168 79.472C189.304 80.016 188.32 80.288 187.216 80.288C186.496 80.288 185.832 80.168 185.224 79.928C184.616 79.672 184.096 79.312 183.664 78.848V84.32H180.424V68.12H183.4V69.608C183.8 69.048 184.328 68.616 184.984 68.312C185.656 68.008 186.4 67.856 187.216 67.856ZM186.616 77.336C187.48 77.336 188.208 77.04 188.8 76.448C189.392 75.84 189.688 75.048 189.688 74.072C189.688 73.08 189.392 72.288 188.8 71.696C188.224 71.088 187.496 70.784 186.616 70.784C185.8 70.784 185.096 71.064 184.504 71.624C183.912 72.168 183.616 72.976 183.616 74.048C183.616 75.104 183.904 75.92 184.48 76.496C185.072 77.056 185.784 77.336 186.616 77.336ZM201.182 80.264C200.014 80.264 198.942 79.992 197.966 79.448C197.006 78.888 196.246 78.136 195.686 77.192C195.126 76.232 194.846 75.184 194.846 74.048C194.846 72.912 195.126 71.872 195.686 70.928C196.246 69.968 197.014 69.216 197.99 68.672C198.966 68.128 200.038 67.856 201.206 67.856C202.374 67.856 203.446 68.136 204.422 68.696C205.398 69.24 206.166 69.984 206.726 70.928C207.302 71.872 207.59 72.912 207.59 74.048C207.59 75.184 207.302 76.232 206.726 77.192C206.166 78.136 205.39 78.888 204.398 79.448C203.422 79.992 202.35 80.264 201.182 80.264ZM201.206 77.288C202.086 77.288 202.814 76.984 203.39 76.376C203.982 75.768 204.278 75 204.278 74.072C204.278 73.144 203.39 72.368 203.39 71.744C202.814 71.12 202.086 70.808 201.206 70.808C200.31 70.808 199.574 71.12 198.998 71.744C198.422 72.352 198.134 73.128 198.134 74.072C198.134 75 198.422 75.768 198.998 76.376C199.574 76.984 200.31 77.288 201.206 77.288ZM221.112 67.856V80H217.872V73.568L211.248 80.288H210.192V68.12H213.408V74.6L220.056 67.856H221.112ZM215.928 66.296C214.696 66.296 213.696 65.912 212.928 65.144C212.16 64.36 211.776 63.352 211.776 62.12V61.448H214.368V62.096C214.368 62.704 214.504 63.176 214.776 63.512C215.048 63.832 215.432 63.992 215.928 63.992C216.424 63.992 216.808 63.832 217.08 63.512C217.352 63.176 217.488 62.704 217.488 62.096V61.448H220.056V62.12C220.056 63.352 219.672 64.36 218.904 65.144C218.136 65.912 217.144 66.296 215.928 66.296ZM232.385 80L227.681 73.712V80H224.465V68.12H227.681V73.664L232.169 68.12H235.841L231.353 73.544L236.225 80H232.385ZM249.026 67.856V80H245.786V73.568L239.162 80.288H238.106V68.12H241.322V74.6L247.97 67.856H249.026Z" fill="var(--text-primary)"/>
          </svg>
        </header>

        {/* Settings Content */}
        <main className="w-full max-w-[1200px] mx-auto pt-[124px] px-6 space-y-10 pb-20">
          
          {/* Role Switcher - NEW */}
          <section className="max-w-[400px] mx-auto w-full">
            <h2 className="text-[12px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-6 px-1 opacity-80" style={{ fontFamily: 'var(--font-cera), sans-serif' }}>
              Режим интерфейса
            </h2>
            
            <div className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] rounded-[24px] p-2 flex relative mb-10 shadow-xl overflow-hidden">
               {/* Animated Slide Background */}
               <div 
                 className={`absolute top-2 bottom-2 w-[calc(50%-8px)] bg-[var(--text-primary)] rounded-[18px] transition-all duration-500 ease-out z-0 
                   ${activeRole === 'seller' ? 'left-2' : 'left-[calc(50%)]'}`}
               />
               
               <button 
                 onClick={() => handleRoleChange('seller')}
                 className={`flex-1 h-14 relative z-10 font-black text-[11px] uppercase tracking-widest transition-colors duration-300 
                   ${activeRole === 'seller' ? 'text-[var(--bg-color)]' : 'text-[var(--text-secondary)]'}`}
               >
                 Партнер
               </button>
               
               <button 
                 onClick={() => handleRoleChange('client')}
                 className={`flex-1 h-14 relative z-10 font-black text-[11px] uppercase tracking-widest transition-colors duration-300 
                   ${activeRole === 'client' ? 'text-[var(--bg-color)]' : 'text-[var(--text-secondary)]'}`}
               >
                 Клиент
               </button>
            </div>
          </section>

          <section className="max-w-[400px] mx-auto w-full">
            <h2 className="text-[12px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-6 px-1 opacity-80" style={{ fontFamily: 'var(--font-cera), sans-serif' }}>
              Общие
            </h2>
            
            <div className="space-y-4">
              <button 
                  onClick={() => router.push(activeRole === 'seller' ? '/lkseller' : '/profile')}
                  className="w-full h-20 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-[24px] px-6 flex items-center justify-between group active:scale-[0.98] transition-all overflow-hidden relative"
              >
                  <div className="flex items-center gap-4 relative z-10">
                      <div className="w-10 h-10 bg-pink-500/10 rounded-full flex items-center justify-center border border-pink-500/20">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgb(236, 72, 153)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </div>
                      <span className="text-[17px] font-bold text-[var(--text-primary)]">Личный профиль</span>
                  </div>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-30 group-hover:translate-x-1 transition-transform">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
              </button>

              <button 
                  onClick={() => router.push('/tema')}
                  className="w-full h-20 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-[24px] px-6 flex items-center justify-between group active:scale-[0.98] transition-all overflow-hidden relative"
              >
                  <div className="flex items-center gap-4 relative z-10">
                      <div className="w-10 h-10 bg-[var(--accent-cyan)]/10 rounded-full flex items-center justify-center border border-pink-600/20">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                          <circle cx="12" cy="12" r="4" />
                        </svg>
                      </div>
                      <span className="text-[17px] font-bold text-[var(--text-primary)]">Цветовая тема</span>
                  </div>
                  <div className="flex items-center gap-3 relative z-10">
                      <span className="text-[13px] font-black uppercase tracking-widest text-[var(--text-secondary)] opacity-80 group-hover:opacity-100 transition-opacity">Смена</span>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-30 group-hover:translate-x-1 transition-transform">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-cyan)]/20 to-transparent" />
              </button>

              <button 
                  onClick={() => router.push('/order')}
                  className="w-full h-20 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-[24px] px-6 flex items-center justify-between group active:scale-[0.98] transition-all overflow-hidden relative"
              >
                  <div className="flex items-center gap-4 relative z-10">
                      <div className="w-10 h-10 bg-yellow-500/10 rounded-full flex items-center justify-center border border-yellow-500/20">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgb(234, 179, 8)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                            <path d="M3 6h18" />
                            <path d="M16 10a4 4 0 0 1-8 0" />
                        </svg>
                      </div>
                      <span className="text-[17px] font-bold text-[var(--text-primary)]">Мои заказы</span>
                  </div>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-30 group-hover:translate-x-1 transition-transform">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
              </button>

              {userPhone === "79999999999" && (
                <button 
                    onClick={() => router.push('/admin')}
                    className="w-full h-20 bg-[var(--accent-cyan)]/5 border border-[var(--accent-cyan)]/20 rounded-[24px] px-6 flex items-center justify-between group active:scale-[0.98] transition-all overflow-hidden relative"
                >
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="w-10 h-10 bg-[var(--accent-cyan)]/10 rounded-full flex items-center justify-center border border-[var(--accent-cyan)]/20">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                          </svg>
                        </div>
                        <span className="text-[17px] font-bold text-[var(--accent-cyan)]">Админ-панель</span>
                    </div>
                </button>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
