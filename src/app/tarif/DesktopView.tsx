"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Service, Tariff } from "@/utils/services";

interface DesktopViewProps {
  router: any;
  serviceData: Service;
  currentStage: number;
  setCurrentStage: (stage: any) => void;
  selectedTariffIndex: number | null;
  selectedDesignIndex: number | null;
  handleCardClick: (index: number) => void;
  handleContinue: () => void;
  isTariffStage: boolean;
  selectedIndex: number | null;
  isContinueEnabled: boolean;
  totalSelectedPrice: number;
  currentItems: any[];
  DesignOneBackground: any;
  DesignTwoBackground: any;
  DesignThreeBackground: any;
}

export default function DesktopView({
  router,
  serviceData,
  currentStage,
  setCurrentStage,
  selectedTariffIndex,
  selectedDesignIndex,
  handleCardClick,
  handleContinue,
  isTariffStage,
  selectedIndex,
  isContinueEnabled,
  totalSelectedPrice,
  currentItems,
  DesignOneBackground,
  DesignTwoBackground,
  DesignThreeBackground
}: DesktopViewProps) {
  return (
    <div className="hidden md:flex flex-col min-h-screen relative overflow-hidden bg-[var(--bg-color)]">
      {/* Architectural Background Grid */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.05] dark:opacity-[0.03]" 
           style={{ backgroundImage: `radial-gradient(var(--text-primary) 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

      {/* TVELF Unified Backdrop Glows */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[800px] h-[600px] bg-[radial-gradient(circle_at_0%_0%,var(--accent-cyan),transparent_60%)] opacity-[0.06] dark:opacity-[0.03] blur-[120px]" />
        <div className="absolute bottom-[-100px] right-[-100px] w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,var(--accent-cyan),transparent_70%)] opacity-[0.04] dark:opacity-[0.02] blur-[120px]" />
      </div>

      {/* Unified Header */}
      <header className="h-[84px] flex items-center px-12 justify-between shrink-0 z-[100] relative border-b border-[var(--border-color)]/20 bg-[var(--bg-color)]/60 backdrop-blur-md">
        <div className="flex items-center gap-10">
          <button 
            onClick={() => router.back()} 
            className="w-11 h-11 flex items-center justify-center border border-[var(--border-color)] rounded-2xl bg-[var(--card-bg)] hover:bg-[var(--border-color)] transition-all duration-300 active:scale-95 group"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <div className="flex flex-col">
            <h1 className="text-[19px] font-bold font-cera uppercase tracking-tight text-[var(--text-primary)]">{serviceData.name}</h1>
          </div>
        </div>
        
        {/* TVELF Pro Stepper Pill */}
        <div className="flex items-center p-1.5 bg-[var(--nav-bg)]/80 backdrop-blur-2xl rounded-[20px] border border-[var(--border-color)] shadow-xl dark:shadow-2xl">
          {[1, 2, 3].map((s) => (
            <button 
              key={s} 
              onClick={() => currentStage > s ? setCurrentStage(s as any) : null}
              className={`relative px-8 py-2.5 rounded-[14px] flex items-center gap-3 transition-all duration-500 overflow-hidden
                ${currentStage === s ? "text-[var(--bg-color)]" : "text-[var(--text-secondary)]/40 hover:text-[var(--text-secondary)]"}
              `}
            >
              {currentStage === s && (
                 <motion.div 
                   layoutId="active_stage_pill" 
                   className="absolute inset-0 bg-[var(--text-primary)]"
                   transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                 />
              )}
              <span className="relative z-10 text-[10px] font-bold tracking-[0.2em] uppercase">
                {s === 1 ? "Тариф" : s === 2 ? "Дизайн" : "Финал"}
              </span>
              {currentStage === s && (
                <motion.div 
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="relative z-10 w-1.5 h-1.5 rounded-full bg-[var(--accent-cyan)]" 
                />
              )}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-6">
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Primary Viewport */}
        <main className="flex-1 px-12 xl:px-24 py-12 overflow-y-auto no-scrollbar relative z-10">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentStage}
              initial={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.02, filter: "blur(10px)" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-[1080px] mx-auto w-full"
            >
              <div className="mb-14">
                <h2 className="text-5xl xl:text-6xl font-black font-cera uppercase tracking-tighter leading-[0.9] text-[var(--text-primary)]">
                  {isTariffStage ? "ВЫБЕРИТЕ" : "ВИЗУАЛЬНОЕ"} <br/>
                  <span className="text-[var(--text-secondary)] opacity-10">{isTariffStage ? "ПАКЕТ УСЛУГ" : "ОФОРМЛЕНИЕ"}</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentItems.map((item, i) => {
                  const isSelected = selectedIndex === i;
                  return (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => handleCardClick(i)}
                      className={`group relative cursor-pointer p-8 rounded-3xl border transition-all duration-700 flex flex-col min-h-[340px]
                        ${isSelected 
                          ? 'bg-[var(--card-bg)] border-[var(--accent-cyan)]/30 shadow-[0_30px_60px_rgba(0,0,0,0.05)] dark:shadow-[0_30px_60px_rgba(0,0,0,0.4)] scale-[1.02]' 
                          : 'bg-[var(--card-bg)]/40 border-[var(--border-color)] hover:border-[var(--text-secondary)] hover:bg-[var(--card-bg)]/80'
                        }`}
                    >
                       {/* Selection Highlight */}
                       {isSelected && (
                         <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-cyan)]/5 to-transparent pointer-events-none" />
                       )}

                       <div className="flex justify-end items-start mb-6 relative z-10">
                          <div className={`w-2 h-2 rounded-full transition-all duration-500 ${isSelected ? 'bg-[var(--accent-cyan)] shadow-[0_0_8px_var(--accent-cyan)]' : 'bg-[var(--border-color)]'}`} />
                       </div>

                       {!isTariffStage && (
                          <div className={`absolute inset-0 opacity-[0.03] transition-all duration-700 pointer-events-none ${isSelected ? 'opacity-[0.1]' : ''}`}>
                            {i === 0 && <DesignOneBackground />}
                            {i === 1 && <DesignTwoBackground />}
                            {i === 2 && <DesignThreeBackground />}
                          </div>
                       )}

                       <h4 className={`text-2xl font-black font-cera uppercase tracking-tight mb-8 relative z-10 ${isSelected ? 'text-[var(--text-primary)]' : 'text-[var(--text-primary)] opacity-60 group-hover:opacity-100'}`}>{item.name}</h4>

                       <div className="flex-1 space-y-4 mb-8 relative z-10">
                          {isTariffStage ? (item as Tariff).features.slice(0, 4).map(f => (
                            <div key={f.id} className="flex gap-3 items-start">
                              <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${isSelected ? 'bg-[var(--accent-cyan)]' : 'bg-[var(--border-color)]'}`} />
                              <span className={`text-[13px] font-medium leading-normal ${isSelected ? 'text-[var(--text-primary)] opacity-80' : 'text-[var(--text-secondary)] opacity-60 group-hover:opacity-100 group-hover:text-[var(--text-primary)]'}`}>
                                {f.text}
                              </span>
                            </div>
                          )) : (
                            <p className={`text-[13px] font-medium leading-relaxed ${isSelected ? 'text-[var(--text-primary)] opacity-70' : 'text-[var(--text-secondary)] opacity-40'}`}>
                              {item.description}
                            </p>
                          )}
                       </div>

                       <div className="mt-auto flex items-baseline gap-2 relative z-10">
                          <span className={`text-3xl font-black font-cera ${isSelected ? 'text-[var(--text-primary)]' : 'text-[var(--text-primary)] opacity-40'}`}>
                            {Number(item.price).toLocaleString()}
                          </span>
                          <span className="text-[11px] font-black text-[var(--accent-cyan)] opacity-40 uppercase tracking-widest">RUB</span>
                       </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </main>

        {/* TVELF Unified Glass Sidebar - Rounded Design Container */}
        <aside className="w-[440px] shrink-0 p-8 relative z-20 flex flex-col h-full bg-transparent">
          
          <div className="flex-1 flex flex-col justify-between overflow-hidden relative rounded-[40px] border border-[var(--border-color)]/20 bg-[var(--nav-bg)]/60 shadow-xl dark:shadow-[0_40px_80px_rgba(0,0,0,0.5)] backdrop-blur-[40px]">
            
            {/* Internal Architectural Accents */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" 
                 style={{ backgroundImage: `radial-gradient(var(--text-primary) 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />
            
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-cyan)] opacity-[0.05] dark:opacity-[0.03] blur-[60px] rounded-full" />

            <div className="p-10 space-y-12 relative z-10 flex-1 overflow-y-auto no-scrollbar">
               <div className="flex items-center justify-between pb-6 border-b border-[var(--border-color)]">
                  <h3 className="text-base font-bold text-[var(--text-primary)] font-gilroy uppercase tracking-tight">ОБЗОР ЗАКАЗА</h3>
               </div>

                  {/* Items List */}
                  {[
                    { label: "Категория", value: serviceData.name, active: true },
                    { label: "Тарифный план", value: selectedTariffIndex !== null ? serviceData.tariffs[selectedTariffIndex].name : null, active: selectedTariffIndex !== null },
                    { label: "Стиль оформления", value: selectedDesignIndex !== null ? serviceData.designs[selectedDesignIndex].name : null, active: selectedDesignIndex !== null }
                  ].map((item, i) => (
                    <div key={item.label} className="group flex flex-col gap-4 relative">
                       <div className="flex items-center gap-3 relative z-10">
                         <div className={`w-1 h-4 rounded-full transition-all duration-500 ${item.active ? 'bg-[var(--accent-cyan)] shadow-[0_0_6px_var(--accent-cyan)]' : 'bg-[var(--border-color)]'}`} />
                         <span className="text-[10px] font-black text-[var(--text-secondary)] opacity-40 uppercase tracking-[0.2em]">{item.label}</span>
                       </div>
                       
                       <AnimatePresence mode="wait">
                          <motion.div 
                            key={item.value || "none"}
                            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                            className="relative z-10 pl-4"
                          >
                             <p className={`text-2xl font-bold font-cera tracking-tight transition-colors duration-500 ${item.active ? 'text-[var(--text-primary)]' : 'text-[var(--text-primary)]/10'}`}>
                                {item.value || "Ожидание..."}
                             </p>
                          </motion.div>
                       </AnimatePresence>
                    </div>
                  ))}
               </div>

            {/* Bottom Total Card - Integrated into Sidebar Card */}
            <div className="px-8 py-6 bg-[var(--bg-color)]/20 border-t border-[var(--border-color)] relative z-10 backdrop-blur-md">
               <div className="space-y-6">
                  <div className="flex items-center justify-between px-2">
                    <div className="flex flex-col">
                      <div className="flex items-baseline gap-2">
                         <motion.div 
                            key={totalSelectedPrice}
                            initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                            className="text-4xl font-bold font-cera text-[var(--text-primary)] tracking-tighter"
                         >
                            {totalSelectedPrice.toLocaleString()}
                         </motion.div>
                         <span className="text-[10px] font-black text-[var(--accent-cyan)] opacity-30">RUB</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                     <button 
                       onClick={handleContinue}
                       disabled={!isContinueEnabled}
                       className="animated-button"
                     >
                        <svg xmlns="http://www.w3.org/2000/svg" className="arr-2" viewBox="0 0 24 24">
                          <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
                        </svg>
                        <span className="text">
                           {currentStage === 2 ? "Оформить заказ" : "Продолжить"}
                        </span>
                        <span className="circle"></span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="arr-1" viewBox="0 0 24 24">
                          <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
                        </svg>
                     </button>
                     
                     {currentStage > 1 && (
                       <button 
                         onClick={() => setCurrentStage((currentStage - 1) as any)}
                         className="text-[10px] font-bold text-[var(--text-secondary)]/40 hover:text-[var(--text-primary)] transition-all py-1 w-fit mx-auto uppercase tracking-widest"
                       >
                         Назад
                       </button>
                     )}
                  </div>
               </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

