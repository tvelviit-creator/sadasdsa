"use client";

import { Service, Tariff } from "@/utils/services";

interface MobileViewProps {
  router: any;
  serviceData: Service;
  currentStage: number;
  setCurrentStage: (stage: any) => void;
  currentItems: any[];
  selectedIndex: number | null;
  activeCardIndex: number;
  handleCardClick: (index: number) => void;
  handleContinue: () => void;
  goToCard: (index: number, smooth?: boolean) => void;
  onDragStart: (x: number) => void;
  onDragMove: (x: number) => void;
  onDragEnd: () => void;
  trackRef: any;
  isTariffStage: boolean;
  isContinueEnabled: boolean;
  CardGlow: any;
  DesignOneBackground: any;
  DesignTwoBackground: any;
  DesignThreeBackground: any;
  CustomCheckIcon: any;
}

export default function MobileView({
  router,
  serviceData,
  currentStage,
  setCurrentStage,
  currentItems,
  selectedIndex,
  activeCardIndex,
  handleCardClick,
  handleContinue,
  goToCard,
  onDragStart,
  onDragMove,
  onDragEnd,
  trackRef,
  isTariffStage,
  isContinueEnabled,
  CardGlow,
  DesignOneBackground,
  DesignTwoBackground,
  DesignThreeBackground,
  CustomCheckIcon
}: MobileViewProps) {
  return (
    <div className="md:hidden w-full max-w-[375px] min-h-screen flex flex-col relative pb-[120px] mx-auto bg-[var(--bg-color)]">
      {/* Mobile Background Elements */}
      <div className="fixed inset-0 z-[0] pointer-events-none opacity-[0.05] dark:opacity-[0.03]" style={{ backgroundImage: `radial-gradient(var(--text-primary) 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
      <div className="fixed top-[-10%] right-[-10%] w-[60%] h-[60%] bg-[var(--accent-cyan)]/5 blur-[100px] rounded-full pointer-events-none z-[0]" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-500/5 blur-[100px] rounded-full pointer-events-none z-[0]" />

      {/* Premium SVG Header from Backup */}
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[375px] h-[130px] z-[100] transition-colors duration-300">
        <svg width="375" height="130" viewBox="0 0 375 130" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full transition-colors duration-300">
          <mask id="path-1-inside-1_132_5703" fill="white">
            <path d="M0 0H375V130H0V0Z" />
          </mask>
          <path d="M0 0H375V130H0V0Z" fill="var(--bg-color)" />
          <path d="M375 130V129H0V130V131H375V130Z" fill="var(--border-color)" mask="url(#path-1-inside-1_132_5703)" />
          
          {/* Step 1 Progress */}
          <rect x="24" y="56" width="103.667" height="12" rx="6" fill="var(--border-color)" />
          <path 
            d={currentStage === 1 ? "M24 56H69.8333C73.147 56 75.8333 58.6863 75.8333 62C75.8333 65.3137 73.147 68 69.8333 68H24V56Z" : "M24 56H121.667C124.981 56 127.667 58.6863 127.667 62C127.667 65.3137 124.981 68 121.667 68H24V56Z"} 
            fill={currentStage >= 1 ? "var(--text-primary)" : "var(--nav-btn)"} 
            className="transition-all duration-500"
          />

          {/* Step 2 Progress */}
          <rect x="135.667" y="56" width="103.667" height="12" rx="6" fill="var(--border-color)" />
          <path 
            d={currentStage === 2 ? "M135.667 56H181.5C184.814 56 187.5 58.6863 187.5 62C187.5 65.3137 184.814 68 181.5 68H135.667V56Z" : (currentStage > 2 ? "M135.667 56H233.334C236.648 56 239.334 58.6863 239.334 62C239.334 65.3137 236.648 68 233.334 68H135.667V56Z" : "M135.667 56H135.667V68H135.667V56Z")} 
            fill={currentStage >= 2 ? "var(--text-primary)" : "var(--nav-btn)"} 
            className="transition-all duration-500"
          />

          {/* Step 3 Progress */}
          <rect x="247.333" y="56" width="103.667" height="12" rx="6" fill="var(--border-color)" />
          <path 
            d={currentStage === 3 ? "M247.333 56H293.167C296.481 56 299.167 58.6863 299.167 62C299.167 65.3137 296.481 68 293.167 68H247.333V56Z" : "M247.333 56H247.333V68H247.333V56Z"} 
            fill={currentStage >= 3 ? "var(--text-primary)" : "var(--nav-btn)"} 
            className="transition-all duration-500"
          />

          {/* Back Arrow */}
          <path d="M51 100L29 100M29 100L38.4286 109M29 100L38.4286 91" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        {/* Hit Area for Back Button */}
        <button
          onClick={() => currentStage === 2 ? setCurrentStage(1) : router.back()}
          className="absolute left-[20px] top-[80px] w-12 h-12 flex items-center justify-center active:scale-95 z-20"
        />

        {/* Main Service Name */}
        <h1 className="absolute top-[88px] left-1/2 -translate-x-1/2 text-[18px] font-black text-[var(--text-primary)] uppercase tracking-[0.2em] pointer-events-none whitespace-nowrap transition-colors duration-300">
          {serviceData.name}
        </h1>
      </header>

      {/* Dynamic Spacer */}
      <div className="h-[140px] shrink-0" />

      {/* Title Section */}
      <div className="px-[32px] mb-[16px] relative z-10 transition-colors duration-300">
        <h2 className="text-[24px] font-bold text-[var(--text-primary)] leading-[120%]">
          Выберите {currentStage === 1 ? "пакет услуг" : "стиль дизайна"}
        </h2>
        <p className="text-[16px] font-normal text-[var(--text-secondary)] leading-[150%]">
          {currentStage === 1 ? "Лучший вариант для вашего проекта" : "Визуальное оформление"}
        </p>
      </div>

      {/* Carousel of Cards from Backup */}
      <div className="flex-1 relative z-10 overflow-hidden px-[24px] py-[4px]" 
           onMouseDown={(e) => onDragStart(e.pageX)} 
           onMouseMove={(e) => onDragMove(e.pageX)} 
           onMouseUp={onDragEnd} 
           onMouseLeave={onDragEnd} 
           onTouchStart={(e) => onDragStart(e.touches[0].pageX)} 
           onTouchMove={(e) => onDragMove(e.touches[0].pageX)} 
           onTouchEnd={onDragEnd}>
        <div ref={trackRef} className="flex gap-[20px] will-change-transform" style={{ transform: `translateX(0px)`, transition: 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)' }}>
          {currentItems.map((item, index) => {
            const isSelected = selectedIndex === index;
            return (
              <div key={item.id} className="shrink-0 w-[244px] h-[432px] relative select-none" onClick={() => handleCardClick(index)}>
                {/* Main Card Body from Backup */}
                <div className={`absolute inset-0 z-10 p-[16px] rounded-[24px] flex flex-col justify-between transition-all duration-300 bg-[var(--tarif-card-bg)] overflow-hidden border border-[var(--border-color)]`}>
                  <CardGlow isVisible={isSelected} />
                  {currentStage === 2 && (
                    <div className="absolute inset-0 opacity-10 mix-blend-screen text-[var(--accent-cyan)]">
                      {index === 0 && <DesignOneBackground />}
                      {index === 1 && <DesignTwoBackground />}
                      {index === 2 && <DesignThreeBackground />}
                    </div>
                  )}
                  
                  <div className="relative z-20 flex flex-col gap-[24px] pointer-events-none">
                    {/* Header Info */}
                    <div className="flex flex-col gap-[8px]">
                      <h3 className={`text-[18px] font-bold leading-[120%] transition-colors duration-300 ${isSelected ? 'text-[var(--text-primary)]' : 'text-[var(--text-primary)]/80'}`}>{item.name}</h3>
                      <div className="flex flex-col gap-[0px]">
                        <div className="text-[24px] font-normal text-[var(--text-primary)] leading-[150%] transition-colors duration-300">
                          {currentStage === 1 ? "от " : "+"}{Number(item.price).toLocaleString()} ₽
                        </div>
                        <p className="text-[13px] font-normal text-[var(--text-secondary)] leading-[154%] transition-colors duration-300">{item.description}</p>
                      </div>
                    </div>

                    {/* Features List */}
                    <div className="flex flex-col gap-[8px]">
                      {isTariffStage ? (item as Tariff).features?.map((feature) => (
                        <div key={feature.id} className="flex items-start gap-[8px]">
                          <div className="shrink-0 pt-[2px]">
                            <CustomCheckIcon color={isSelected ? "var(--accent-cyan)" : "var(--border-color)"} />
                          </div>
                          <span className="text-[16px] font-normal text-[var(--text-secondary)] leading-[150%] line-clamp-2 transition-colors duration-300">{feature.text}</span>
                        </div>
                      )) : null}
                    </div>
                  </div>

                  {/* Select Button from Backup */}
                  <div className="relative z-20">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardClick(index);
                      }}
                      className={`w-full h-[44px] rounded-full border flex items-center justify-center transition-all active:scale-95 transition-colors duration-300 ${isSelected ? 'bg-[var(--tarif-card-bg)] border-[var(--text-primary)]' : 'bg-transparent border-[var(--text-primary)]'}`}
                    >
                      <div className="relative w-full h-full flex items-center justify-center">
                        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                          <svg width="212" height="44" viewBox="0 0 212 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M97 22L103 28L115 16" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <span className={`text-[16px] font-bold text-[var(--text-primary)] transition-all duration-300 ${isSelected ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}>Выбрать</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer with Controller from Backup */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[375px] h-[200px] px-[24px] pb-[40px] z-50 pointer-events-none flex flex-col justify-end">
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-color)] via-[var(--bg-color)] to-transparent z-0 transition-colors duration-300" />
        
        <div className="relative z-10 flex flex-col gap-[20px] items-center">
          {/* Premium SVG Slider Controller from Backup */}
          <div className="pointer-events-auto select-none">
            <svg width="327" height="32" viewBox="0 0 327 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-colors duration-300">
              <rect x="0.5" y="0.5" width="79" height="31" rx="15.5" stroke={activeCardIndex > 0 ? "var(--text-secondary)" : "var(--border-color)"} fill="transparent" className={activeCardIndex > 0 ? "cursor-pointer active:opacity-50 transition-all" : "cursor-default"} onClick={() => activeCardIndex > 0 && goToCard(activeCardIndex - 1)} />
              <path d="M48 16L32 16M32 16L38.8571 22.5M32 16L38.8571 9.5" stroke={activeCardIndex > 0 ? "var(--text-primary)" : "var(--border-color)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none" />

              {currentItems.map((_, i) => {
                const xBase = 130.5 + (i * 24.667);
                const isActive = activeCardIndex === i;
                return (
                  <g key={i} className="cursor-pointer group" onClick={() => goToCard(i)}>
                    <rect x={xBase} y="10" width="16.6667" height="12" rx="6" fill={isActive ? "var(--text-primary)" : "var(--border-color)"} className="transition-all duration-300 group-hover:opacity-80" />
                  </g>
                );
              })}

              <rect x="247.5" y="0.5" width="79" height="31" rx="15.5" stroke={activeCardIndex < currentItems.length - 1 ? "var(--text-secondary)" : "var(--border-color)"} fill="transparent" className={activeCardIndex < currentItems.length - 1 ? "cursor-pointer active:opacity-50 transition-all" : "cursor-default"} onClick={() => activeCardIndex < currentItems.length - 1 && goToCard(activeCardIndex + 1)} />
              <path d="M279 16L295 16M295 16L288.143 9.5M295 16L288.143 22.5" stroke={activeCardIndex < currentItems.length - 1 ? "var(--text-primary)" : "var(--border-color)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none" />
            </svg>
          </div>

          <button onClick={handleContinue} disabled={!isContinueEnabled} className={`w-full h-[56px] rounded-full text-[16px] font-bold transition-all flex items-center justify-center tracking-tight pointer-events-auto transition-colors duration-300 ${isContinueEnabled ? 'bg-[var(--text-primary)] text-[var(--bg-color)] active:scale-95 shadow-xl' : 'bg-[var(--tarif-card-bg)] text-[var(--text-secondary)] border border-[var(--border-color)] cursor-not-allowed'}`}>Продолжить</button>
        </div>
      </div>
    </div>
  );
}
