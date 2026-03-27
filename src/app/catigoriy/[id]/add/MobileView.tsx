"use client";

import { useRef } from "react";
import { Tariff, Design } from "@/utils/services";
import { Plus } from "lucide-react";

interface MobileViewProps {
  serviceName: string;
  setServiceName: (v: string) => void;
  servicePrice: string;
  setServicePrice: (v: string) => void;
  coverImage: string;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  tariffs: Tariff[];
  addTariff: () => void;
  removeTariff: (id: string) => void;
  updateTariff: (id: string, field: keyof Tariff, value: string) => void;
  addFeature: (tariffId: string) => void;
  removeFeature: (tariffId: string, featureId: string) => void;
  updateFeature: (tariffId: string, featureId: string, text: string) => void;
  designs: Design[];
  addDesign: () => void;
  removeDesign: (id: string) => void;
  updateDesign: (id: string, field: keyof Design, value: string) => void;
  handleSave: () => void;
  isFormValid: boolean;
  router: any;
}

export default function MobileView({
  serviceName, setServiceName,
  servicePrice, setServicePrice,
  coverImage, handleImageUpload,
  tariffs, addTariff, removeTariff, updateTariff,
  addFeature, removeFeature, updateFeature,
  designs, addDesign, removeDesign, updateDesign,
  handleSave, isFormValid, router
}: MobileViewProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="add-service-page min-h-screen bg-[var(--bg-color)] relative overflow-x-hidden transition-colors duration-300">
      {/* Background Architectural Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.05] dark:opacity-[0.03]" style={{ backgroundImage: `radial-gradient(var(--text-primary) 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
      <div className="fixed top-[-10%] right-[-20%] w-[60%] h-[60%] bg-[var(--accent-cyan)]/5 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-500/5 blur-[100px] rounded-full pointer-events-none z-0" />

      <div className="page-wrapper px-[24px] relative z-10">
        {/* Figma SVG Header (Matches Profile for Parity) */}
        <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[375px] h-[102px] z-50 transition-colors duration-300">
          <svg width="375" height="102" viewBox="0 0 375 102" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <mask id="path-1-inside-1_1767_18849_add" fill="white">
              <path d="M0 0H375V102H0V0Z"/>
            </mask>
            <path d="M0 0H375V102H0V0Z" fill="var(--bg-color)"/>
            <path d="M375 102V101H0V102V103H375V102Z" fill="var(--border-color)" mask="url(#path-1-inside-1_1767_18849_add)"/>
            
            {/* Back Arrow */}
            <path d="M51 72L29 72M29 72L38.4286 81M29 72L38.4286 63" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            
            {/* Title: НОВЫЙ ПРОЕКТ (approximate positioning, using standard paths if available or clean placeholder) */}
            <g transform="translate(95, 62)">
                <text x="0" y="16" fill="var(--text-primary)" style={{ fontFamily: 'var(--font-cera), sans-serif', fontWeight: 900, fontSize: '13px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                    НОВЫЙ ПРОЕКТ
                </text>
            </g>
          </svg>

          <button 
            onClick={() => router.back()}
            className="absolute left-[20px] bottom-[15px] w-[50px] h-[40px] pointer-events-auto active:opacity-50 transition-opacity z-[60]"
            aria-label="Назад"
          />
        </header>

        {/* Content */}
        <main className="animate-fade pt-[110px]">

          {/* Card Preview Area */}
          <section className="flex flex-col items-center py-[24px]">
            <div className="w-[180px] flex flex-col gap-4 group">
              <div className="w-[180px] h-[240px] relative rounded-[32px] overflow-hidden border border-[var(--border-color)]/20 bg-[var(--card-bg)]/40 backdrop-blur-md flex items-center justify-center shadow-xl dark:shadow-2xl transition-all duration-700 group-hover:shadow-[0_20px_40px_rgba(0,240,255,0.1)]">
                {coverImage ? (
                  <img src={coverImage} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="" />
                ) : (
                  <div className="flex flex-col items-center gap-3 opacity-20">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="6" />
                      <circle cx="15" cy="9" r="2" />
                      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                    </svg>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-primary)]/60">Визуал</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              </div>
              <div className="flex flex-col gap-1 px-2">
                <h3 className="text-[var(--text-primary)] text-[16px] font-black leading-none uppercase truncate m-0 font-cera">
                  {serviceName || "Наименование"}
                </h3>
                <p className="text-[var(--accent-cyan)] text-[14px] font-black font-cera m-0 tracking-tight opacity-70">
                  {servicePrice ? Number(servicePrice.replace(/\D/g, '') || 0).toLocaleString() : "0"} ₽
                </p>
              </div>
            </div>
          </section>

          <form className="form-content !p-0 !pt-[12px] flex flex-col gap-[24px] pb-[140px]" onSubmit={(e) => e.preventDefault()}>

            {/* Name Field */}
            <div className="flex flex-col gap-2">
              <label className="text-[var(--text-secondary)] text-[10px] uppercase font-black tracking-[0.2em] ml-4 opacity-80">Наименование проекта</label>
              <div className="relative">
                <input
                  type="text"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  placeholder="Заголовок услуги..."
                  className="w-full h-[64px] bg-[var(--nav-bg)]/50 rounded-[24px] px-6 text-[16px] font-bold text-[var(--text-primary)] border border-[var(--border-color)] focus:outline-none transition-all focus:border-[var(--accent-cyan)]/30 placeholder:text-[var(--text-secondary)]/30 shadow-inner"
                />
              </div>
            </div>

            {/* Cover Upload */}
            <div className="flex flex-col gap-2">
              <label className="text-[var(--text-secondary)] text-[10px] uppercase font-black tracking-[0.2em] ml-4 opacity-80">Визуальное сопровождение (PNG/JPG)</label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full min-h-[160px] rounded-[32px] border-2 border-dashed border-[var(--border-color)] flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-[var(--text-primary)]/5 transition-all bg-transparent group backdrop-blur-md"
              >
                <div className="w-12 h-12 rounded-2xl bg-[var(--text-primary)]/5 border border-[var(--border-color)]/20 flex items-center justify-center group-hover:border-[var(--accent-cyan)]/40 transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-30 group-hover:opacity-100 group-hover:text-[var(--accent-cyan)] transition-all">
                    <path d="M12 16V10M12 10L9 13M12 10L15 13" />
                    <path d="M19 16.5V17a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-.5" />
                    <path d="M13.5 11h-3" />
                  </svg>
                </div>
                <span className="text-[var(--text-secondary)] text-[12px] font-black uppercase tracking-widest opacity-40">Выбрать файл</span>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </div>
            </div>

            {/* Price Field */}
            <div className="flex flex-col gap-2">
              <label className="text-[var(--text-secondary)] text-[10px] uppercase font-black tracking-[0.2em] ml-4 opacity-80">Стартовая стоимость</label>
              <div className="relative">
                <input
                  type="text"
                  value={servicePrice}
                  onChange={(e) => setServicePrice(e.target.value)}
                  placeholder="0"
                  className="w-full h-[64px] bg-[var(--nav-bg)]/50 rounded-[24px] px-6 text-[24px] font-black text-[var(--text-primary)] border border-[var(--border-color)] focus:outline-none transition-all focus:border-[var(--accent-cyan)]/30 placeholder:text-[var(--text-secondary)]/30 shadow-inner tracking-tight"
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] opacity-20 font-black text-[20px]">₽</span>
              </div>
            </div>

            {/* Tariffs Section */}
            <div className="flex items-center justify-between px-2 mt-4">
              <h2 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tighter font-cera">Тарифы</h2>
              <button 
                onClick={addTariff}
                className="h-10 px-5 rounded-xl bg-[var(--text-primary)] text-[var(--bg-color)] text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all"
              >
                Добавить
              </button>
            </div>

            <div className="flex flex-col gap-6">
              {tariffs.map((tariff) => (
                <div key={tariff.id} className="bg-[var(--card-bg)] backdrop-blur-xl rounded-[32px] p-6 flex flex-col gap-6 border border-[var(--border-color)] shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                     <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="1.5">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                     </svg>
                  </div>
                  
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-[var(--text-secondary)] text-[9px] uppercase font-black font-cera tracking-widest ml-4 opacity-80">Название тарифа</label>
                      <input
                        type="text"
                        value={tariff.name}
                        onChange={(e) => updateTariff(tariff.id, "name", e.target.value)}
                        placeholder="Базовый"
                        className="w-full h-14 bg-[var(--nav-bg)]/50 border border-[var(--border-color)] rounded-2xl px-5 text-[15px] font-bold text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]/30 transition-colors placeholder:text-[var(--text-secondary)]/20 uppercase tracking-widest"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[var(--text-secondary)] text-[9px] uppercase font-black font-cera tracking-widest ml-4 opacity-80">Стоимость тарифа</label>
                      <input
                        type="text"
                        value={tariff.price}
                        onChange={(e) => updateTariff(tariff.id, "price", e.target.value)}
                        placeholder="150 000"
                        className="w-full h-14 bg-[var(--nav-bg)]/50 border border-[var(--border-color)] rounded-2xl px-5 text-[15px] font-bold text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]/30 transition-colors placeholder:text-[var(--text-secondary)]/20"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[var(--text-secondary)] text-[9px] uppercase font-black font-cera tracking-widest ml-4 opacity-80">Подробное описание</label>
                      <textarea
                        value={tariff.description}
                        onChange={(e) => updateTariff(tariff.id, "description", e.target.value)}
                        placeholder="Опишите ценность для клиента..."
                        className="w-full h-32 bg-[var(--nav-bg)]/50 border border-[var(--border-color)] rounded-2xl p-5 text-[14px] font-medium text-[var(--text-primary)]/80 focus:outline-none focus:border-[var(--accent-cyan)]/30 transition-colors resize-none placeholder:text-[var(--text-secondary)]/10"
                      />
                    </div>
                    
                    <div className="flex flex-col gap-3 mt-2">
                      <label className="text-[var(--text-secondary)] text-[9px] uppercase font-black font-cera tracking-widest ml-4 opacity-80">Преимущества (Features)</label>
                      <div className="flex flex-col gap-2">
                        {tariff.features.map((feature) => (
                          <div key={feature.id} className="relative group/feat animate-in slide-in-from-left-2 transition-all">
                            <input
                              type="text"
                              value={feature.text}
                              onChange={(e) => updateFeature(tariff.id, feature.id, e.target.value)}
                              placeholder="Пункт преимущества..."
                              className="w-full h-12 bg-[var(--text-primary)]/10 border border-[var(--text-primary)]/5 rounded-full px-5 pr-12 text-[13px] font-bold text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]/20 transition-all placeholder:text-[var(--text-secondary)]/40 shadow-inner"
                            />
                            <button
                              onClick={() => removeFeature(tariff.id, feature.id)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500/40 hover:text-red-500 transition-colors"
                            >
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M18 6L6 18M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => addFeature(tariff.id)}
                          className="w-full h-12 rounded-full border border-dashed border-[var(--border-color)] text-[var(--text-secondary)]/50 hover:text-[var(--accent-cyan)] hover:border-[var(--accent-cyan)]/30 transition-all flex items-center justify-center gap-2 hover:bg-[var(--accent-cyan)]/[0.02]"
                        >
                           <Plus className="w-4 h-4" />
                           <span className="text-[10px] font-black uppercase tracking-widest">Добавить преимущество</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => removeTariff(tariff.id)}
                    className="w-full h-12 rounded-full border border-[var(--border-color)] bg-[var(--text-primary)]/5 text-red-500/60 text-[10px] font-black uppercase tracking-[0.2em] mt-4 hover:bg-red-500/10 hover:text-red-500 transition-all active:scale-95"
                  >
                    УДАЛИТЬ ТАРИФ
                  </button>
                </div>
              ))}
            </div>

            {/* Design Section */}
            <div className="flex items-center justify-between px-2 mt-8">
              <h2 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tighter font-cera">Дизайн</h2>
              <button 
                onClick={addDesign}
                className="h-10 px-5 rounded-xl bg-[var(--text-primary)] text-[var(--bg-color)] text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all"
              >
                Добавить
              </button>
            </div>

            <div className="flex flex-col gap-6">
              {designs.map((design) => (
                <div key={design.id} className="bg-[var(--card-bg)] backdrop-blur-xl rounded-[32px] p-6 flex flex-col gap-6 border border-[var(--border-color)] shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                     <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="1.5">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                     </svg>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-[var(--text-secondary)] text-[9px] uppercase font-black font-cera tracking-widest ml-4 opacity-50">Название опции</label>
                      <input
                        type="text"
                        value={design.name}
                        onChange={(e) => updateDesign(design.id, "name", e.target.value)}
                        placeholder="Темная тема"
                        className="w-full h-14 bg-[var(--nav-bg)]/50 border border-[var(--border-color)] rounded-2xl px-5 text-[15px] font-bold text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]/30 transition-colors placeholder:text-[var(--text-secondary)]/20 uppercase tracking-widest"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[var(--text-secondary)] text-[9px] uppercase font-black font-cera tracking-widest ml-4 opacity-50">Стоимость дизайна</label>
                      <input
                        type="text"
                        value={design.price}
                        onChange={(e) => updateDesign(design.id, "price", e.target.value)}
                        placeholder="50 000"
                        className="w-full h-14 bg-[var(--nav-bg)]/50 border border-[var(--border-color)] rounded-2xl px-5 text-[15px] font-bold text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]/30 transition-colors placeholder:text-[var(--text-secondary)]/20"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[var(--text-secondary)] text-[9px] uppercase font-black font-cera tracking-widest ml-4 opacity-50">Описание опции</label>
                      <textarea
                        value={design.description}
                        onChange={(e) => updateDesign(design.id, "description", e.target.value)}
                        placeholder="Особенности данного стиля..."
                        className="w-full h-24 bg-[var(--nav-bg)]/50 border border-[var(--border-color)] rounded-2xl p-5 text-[14px] font-medium text-[var(--text-primary)]/80 focus:outline-none focus:border-[var(--accent-cyan)]/30 transition-colors resize-none placeholder:text-[var(--text-secondary)]/10"
                      />
                    </div>
                  </div>
                  
                  <button
                    onClick={() => removeDesign(design.id)}
                    className="w-full h-12 rounded-full border border-[var(--border-color)] bg-[var(--text-primary)]/5 text-red-500/60 text-[10px] font-black uppercase tracking-[0.2em] mt-2 hover:bg-red-500/10 hover:text-red-500 transition-all active:scale-95"
                  >
                    УДАЛИТЬ ОПЦИЮ
                  </button>
                </div>
              ))}
            </div>

            {/* Save Button fixed footer */}
            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[375px] h-[120px] bg-gradient-to-t from-[var(--bg-color)] via-[var(--bg-color)] to-transparent flex items-center justify-center px-6 z-50">
              <button
                onClick={handleSave}
                disabled={!isFormValid}
                className={`w-full h-16 rounded-[24px] font-black text-[13px] uppercase tracking-[0.2em] transition-all duration-500 relative overflow-hidden group shadow-xl dark:shadow-2xl ${
                  isFormValid 
                  ? 'text-[var(--bg-color)] bg-[var(--text-primary)] active:scale-95' 
                  : 'text-[var(--text-secondary)]/20 bg-[var(--card-bg)]/40 border border-[var(--border-color)]/20 opacity-50 cursor-not-allowed grayscale'
                }`}
              >
                <div className="relative z-10">
                   {isFormValid ? "ОПУБЛИКОВАТЬ ПРОЕКТ" : "ЗАПОЛНИТЕ ФОРМУ"}
                 </div>
                {isFormValid && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                )}
              </button>
            </div>

          </form>
        </main>
      </div>
    </div>
  );
}
