"use client";

import { useRef } from "react";
import { Tariff, Design } from "@/utils/services";
import { ImagePlus, Plus, Trash2, CheckCircle2, ChevronLeft, Sparkles, Layout, Zap, Layers, ArrowUpRight, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DesktopViewProps {
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
  sellerName: string;
}

export default function DesktopView({
  serviceName, setServiceName,
  servicePrice, setServicePrice,
  coverImage, handleImageUpload,
  tariffs, addTariff, removeTariff, updateTariff,
  addFeature, removeFeature, updateFeature,
  designs, addDesign, removeDesign, updateDesign,
  handleSave, isFormValid, router, sellerName
}: DesktopViewProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="hidden md:flex flex-col w-full min-h-screen bg-[var(--bg-color)] gap-0 relative z-10 overflow-hidden">
      {/* Background Architectural Grid */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.05] dark:opacity-[0.03]" 
           style={{ backgroundImage: `radial-gradient(var(--text-primary) 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
      
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
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--accent-cyan)] opacity-60">Студия размещения</span>
            <div className="flex items-center gap-2">
               <span className="text-[15px] font-bold text-white/90">{serviceName || "Новый проект"}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
           <div className="text-right flex flex-col items-end">
              <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Готовность к публикации</span>
              <div className="flex gap-1 mt-1">
                 {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`h-1 w-6 rounded-full transition-all duration-500 ${isFormValid || (i < 3) ? 'bg-[var(--accent-cyan)] shadow-[0_0_10px_var(--accent-cyan)]/30' : 'bg-white/5'}`} />
                 ))}
              </div>
           </div>

           <button
             onClick={handleSave}
             disabled={!isFormValid}
             className={`h-12 px-10 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-500 relative group overflow-hidden ${
               isFormValid 
               ? 'text-black bg-white hover:bg-[var(--accent-cyan)] active:scale-95' 
               : 'text-white/20 bg-white/5 border border-[var(--border-color)] cursor-not-allowed'
             }`}
           >
             <span className="relative z-10 flex items-center gap-2">
               ОПУБЛИКОВАТЬ
             </span>
           </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden relative z-10">
         {/* Left Side: The Editor */}
         <div className="flex-1 overflow-y-auto no-scrollbar pt-16 pb-32 px-12 xl:px-24">
            <div className="max-w-[800px] mx-auto flex flex-col gap-24">
               
               {/* Section 1: Identity */}
               <motion.section 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-16"
               >
                  <div className="flex flex-col gap-2">
                     <h2 className="text-5xl font-black font-cera uppercase tracking-tighter text-white">Основная <br/><span className="text-white/20">Информация</span></h2>
                  </div>

                  <div className="grid grid-cols-12 gap-12">
                     {/* Image Drop */}
                     <div className="col-span-5">
                        <div 
                           onClick={() => fileInputRef.current?.click()}
                           className={`aspect-[3/4] rounded-[32px] border-2 border-dashed transition-all duration-700 cursor-pointer overflow-hidden group relative flex flex-col items-center justify-center ${
                             coverImage ? 'border-transparent' : 'border-[var(--border-color)] hover:border-[var(--accent-cyan)]/40 hover:bg-[var(--accent-cyan)]/[0.02]'
                           }`}
                        >
                          {coverImage ? (
                            <>
                              <img src={coverImage} alt="Preview" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                                 <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                                    <Plus className="w-6 h-6 rotate-45" />
                                 </div>
                                 <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Заменить</span>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="w-16 h-16 rounded-full bg-white/[0.03] border border-[var(--border-color)] flex items-center justify-center mb-6 group-hover:border-[var(--accent-cyan)]/30 transition-colors">
                                 <ImagePlus className="w-6 h-6 text-white/10 group-hover:text-[var(--accent-cyan)]" />
                              </div>
                              <span className="text-[10px] font-black uppercase tracking-widest text-white/20 group-hover:text-white/40 transition-colors">Загрузить обложку</span>
                            </>
                          )}
                          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                        </div>
                     </div>

                     <div className="col-span-7 flex flex-col justify-center pl-16">
                        <div className="max-w-[500px] flex flex-col gap-16">
                           
                           {/* Name Input Group */}
                           <div className="flex flex-col gap-3 group border-b border-[var(--border-color)] focus-within:border-[var(--accent-cyan)] transition-all duration-500 pb-4">
                              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)]/70 group-focus-within:text-[var(--accent-cyan)] transition-colors">Наименование</span>
                              <input 
                                type="text"
                                value={serviceName}
                                onChange={(e) => setServiceName(e.target.value)}
                                placeholder="Заголовок услуги..."
                                className="bg-transparent text-2xl font-bold text-[var(--text-primary)] outline-none placeholder:text-[var(--text-secondary)]/30 tracking-tight"
                              />
                           </div>

                           {/* Price Input Group */}
                           <div className="flex flex-col gap-3 group border-b border-[var(--border-color)] focus-within:border-[var(--accent-cyan)] transition-all duration-500 pb-4">
                              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)]/70 group-focus-within:text-[var(--accent-cyan)] transition-colors">Стоимость</span>
                              <div className="flex items-center justify-between gap-4">
                                 <input 
                                   type="text"
                                   value={servicePrice}
                                   onChange={(e) => setServicePrice(e.target.value)}
                                   placeholder="0"
                                   className="bg-transparent text-5xl font-black text-[var(--text-primary)] outline-none placeholder:text-[var(--text-secondary)]/30 tracking-tighter w-full"
                                 />
                                 <span className="text-2xl font-black text-[var(--text-primary)]/20 group-focus-within:text-[var(--accent-cyan)] transition-colors">₽</span>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </motion.section>

               {/* Section 2: Tariffs */}
                <motion.section 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-col gap-12"
               >
                  <div className="flex items-end justify-between border-b border-[var(--border-color)] pb-8">
                     <div className="flex flex-col gap-2">
                        <h2 className="text-4xl font-black font-cera uppercase tracking-tighter text-[var(--text-primary)]">Тарифные планы</h2>
                     </div>
                     <button 
                       onClick={addTariff}
                       className="h-12 px-6 rounded-xl border border-[var(--border-color)]/20 text-[var(--text-primary)]/60 hover:text-[var(--text-primary)] hover:bg-[var(--text-primary)]/5 transition-all flex items-center gap-3 text-[10px] font-black uppercase tracking-widest"
                     >
                        <Plus className="w-4 h-4" /> Добавить
                     </button>
                  </div>

                  <div className="flex flex-col gap-10">
                    <AnimatePresence>
                      {tariffs.map((tariff, index) => (
                        <motion.div 
                          key={tariff.id}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-[var(--nav-bg)]/40 border border-[var(--border-color)]/20 p-8 rounded-[32px] group relative overflow-hidden"
                        >
                           <div className="absolute top-0 right-0 p-8 opacity-5">
                              <Zap className="w-20 h-20 text-[var(--text-primary)]" />
                           </div>

                           <div className="flex flex-col gap-8 relative z-10">
                              <div className="flex items-start justify-between">
                                 <div className="flex-1 grid grid-cols-2 gap-8">
                                    <div className="flex flex-col gap-2">
                                       <input 
                                         value={tariff.name}
                                         onChange={(e) => updateTariff(tariff.id, "name", e.target.value)}
                                         placeholder="Название тарифа..."
                                         className="bg-transparent border-b border-[var(--border-color)] text-lg font-bold py-2 focus:border-[var(--accent-cyan)] text-[var(--text-primary)] outline-none transition-all"
                                       />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                       <input 
                                         value={tariff.price}
                                         onChange={(e) => updateTariff(tariff.id, "price", e.target.value)}
                                         placeholder="Стоимость..."
                                         className="bg-transparent border-b border-[var(--border-color)] text-lg font-bold py-2 focus:border-[var(--accent-cyan)] text-[var(--text-primary)] outline-none transition-all"
                                       />
                                    </div>
                                 </div>
                                 <button onClick={() => removeTariff(tariff.id)} className="w-10 h-10 flex items-center justify-center text-[var(--text-primary)]/10 hover:text-red-500 transition-colors ml-8">
                                    <Trash2 className="w-4 h-4" />
                                 </button>
                              </div>

                              <div className="flex flex-col gap-2">
                                 <textarea 
                                   value={tariff.description}
                                   onChange={(e) => updateTariff(tariff.id, "description", e.target.value)}
                                   placeholder="Опишите, что включено..."
                                   className="bg-[var(--text-primary)]/[0.02] border border-[var(--border-color)] text-[var(--text-primary)] rounded-xl p-4 h-24 text-sm font-medium outline-none focus:border-[var(--border-color)]/40 resize-none transition-all"
                                 />
                              </div>

                               <div className="flex flex-col gap-4">
                                  <div className="flex flex-wrap gap-3">
                                     {tariff.features.map(f => (
                                        <div key={f.id} className="flex items-center gap-3 bg-[var(--text-primary)]/[0.03] border border-[var(--border-color)] rounded-full px-5 py-2 focus-within:border-[var(--accent-cyan)]/30 transition-all group/feat shadow-sm">
                                           <input 
                                             value={f.text}
                                             onChange={(e) => updateFeature(tariff.id, f.id, e.target.value)}
                                             className="bg-transparent text-[11px] font-bold outline-none text-[var(--text-primary)]/80 w-36 placeholder:text-[var(--text-primary)]/10"
                                             placeholder="Что включено..."
                                           />
                                           <button onClick={() => removeFeature(tariff.id, f.id)} className="opacity-0 group-hover/feat:opacity-100 transition-all hover:scale-110">
                                              <Plus className="w-3.5 h-3.5 text-red-400 rotate-45" />
                                           </button>
                                        </div>
                                     ))}
                                     
                                     <button 
                                       onClick={() => addFeature(tariff.id)}
                                       className="flex items-center gap-3 bg-[var(--accent-cyan)]/[0.05] border border-[var(--accent-cyan)]/20 rounded-full px-5 py-2 hover:bg-[var(--accent-cyan)]/[0.1] transition-all text-[var(--accent-cyan)] group/add active:scale-95"
                                     >
                                        <Plus className="w-3.5 h-3.5 transition-transform group-hover/add:rotate-90" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.1em]">Добавить преимущество</span>
                                     </button>
                                  </div>
                               </div>
                           </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
               </motion.section>

               {/* Section 3: Visuals */}
                <motion.section 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-col gap-12"
               >
                  <div className="flex items-end justify-between border-b border-[var(--border-color)] pb-8">
                     <div className="flex flex-col gap-2">
                        <h2 className="text-4xl font-black font-cera uppercase tracking-tighter text-[var(--text-primary)]">Опции дизайна</h2>
                     </div>
                     <button 
                       onClick={addDesign}
                       className="h-12 px-6 rounded-xl border border-[var(--border-color)]/20 text-[var(--text-primary)]/60 hover:text-[var(--text-primary)] hover:bg-[var(--text-primary)]/5 transition-all flex items-center gap-3 text-[10px] font-black uppercase tracking-widest"
                     >
                        <Plus className="w-4 h-4" /> Добавить опцию
                     </button>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                     {designs.map((design) => (
                        <div key={design.id} className="bg-[var(--nav-bg)]/20 border border-[var(--border-color)]/20 p-6 rounded-[24px] relative group hover:bg-[var(--nav-bg)]/50 transition-colors">
                           <button onClick={() => removeDesign(design.id)} className="absolute top-4 right-4 text-[var(--text-primary)]/5 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                              <Trash2 className="w-3.5 h-3.5" />
                           </button>
                           <div className="grid grid-cols-2 gap-8 mb-6">
                              <div className="flex flex-col gap-1.5">
                                 <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-secondary)]/70">Название дизайна</span>
                                 <input 
                                   value={design.name}
                                   onChange={(e) => updateDesign(design.id, "name", e.target.value)}
                                   placeholder="Название опции..."
                                   className="bg-transparent border-b border-[var(--border-color)] py-2 font-bold text-base text-[var(--text-primary)] outline-none focus:border-[var(--accent-cyan)] transition-all"
                                 />
                              </div>
                              <div className="flex flex-col gap-1.5">
                                 <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-secondary)]/70">Стоимость</span>
                                 <input 
                                   value={design.price}
                                   onChange={(e) => updateDesign(design.id, "price", e.target.value)}
                                   placeholder="0"
                                   className="bg-transparent border-b border-[var(--border-color)] py-2 font-bold text-base text-[var(--text-primary)] outline-none focus:border-[var(--accent-cyan)] transition-all"
                                 />
                              </div>
                           </div>
                           <div className="flex flex-col gap-1.5">
                              <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-secondary)]/70">Описание</span>
                              <textarea 
                                value={design.description}
                                onChange={(e) => updateDesign(design.id, "description", e.target.value)}
                                placeholder="Опишите особенности этого дизайна..."
                                className="bg-[var(--nav-bg)]/[0.02] border border-[var(--border-color)] text-[var(--text-primary)] rounded-xl p-4 h-20 text-sm font-medium outline-none focus:border-[var(--border-color)]/40 resize-none transition-all"
                              />
                           </div>
                        </div>
                     ))}
                  </div>
               </motion.section>
            </div>
         </div>

         {/* Right Side: The LIVE Preview Shell */}
         <div className="w-[450px] xl:w-[500px] border-l border-[var(--border-color)]/20 bg-[var(--nav-bg)]/20 flex flex-col p-12">
            <div className="sticky top-0 flex flex-col gap-10">
               <div className="flex items-center justify-between">
               </div>

               {/* Store Card Mimic */}
               <div className="flex justify-center pt-8">
                  <div className="w-full max-w-[320px] flex flex-col group/preview">
                      <div className="aspect-[3/4.2] bg-[var(--card-bg)]/40 rounded-[24px] border border-[var(--border-color)]/20 relative overflow-hidden mb-4 shadow-xl dark:shadow-2xl transition-all duration-700 group-hover/preview:shadow-[0_20px_50px_rgba(26,232,232,0.1)]">
                          {coverImage ? (
                            <img src={coverImage} className="w-full h-full object-cover" alt="" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center opacity-10">
                              <Sparkles className="w-12 h-12 text-[var(--text-primary)]" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                          <div className="absolute top-4 right-4 text-white/40">
                             <ArrowUpRight className="w-5 h-5" />
                          </div>
                      </div>

                       <div className="flex flex-col px-1 gap-1">
                          <div className="flex flex-col mb-1">
                             <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-[var(--text-secondary)]/70 uppercase tracking-tighter">{sellerName}</span>
                                <div className="w-1 h-1 rounded-full bg-[var(--text-primary)]/40" />
                                <span className="text-[14px] text-[var(--text-secondary)]/70 font-bold line-clamp-1">
                                   {serviceName || "Название вашей услуги"}
                                </span>
                             </div>
                          </div>

                          <div className="flex items-baseline gap-2">
                             <span className="text-[16px] font-black font-cera text-[var(--text-primary)] leading-none">
                                {servicePrice ? Number(servicePrice).toLocaleString() : '0'} ₽
                             </span>
                             <span className="text-[10px] text-[var(--text-primary)]/40 line-through font-bold opacity-0 group-hover/preview:opacity-100 transition-opacity">
                                {servicePrice ? Math.round(Number(servicePrice) * 1.2).toLocaleString() : '0'} ₽
                             </span>
                          </div>
                       </div>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4 mt-16">
                  {[
                    { label: "Контент", active: !!serviceName, icon: <Layout className="w-5 h-5" /> },
                    { label: "Обложка", active: !!coverImage, icon: <ImagePlus className="w-5 h-5" /> },
                    { label: `Тарифы ${tariffs.length ? '['+tariffs.length+']' : ''}`, active: tariffs.length > 0, icon: <Zap className="w-5 h-5" /> },
                    { label: "Дизайн", active: designs.length > 0, icon: <Layers className="w-5 h-5" /> }
                  ].map((item, i) => (
                    <div 
                      key={i} 
                      className={`flex flex-col items-center justify-center p-8 rounded-[38px] border transition-all duration-1000 relative group ${
                        item.active 
                        ? 'border-[var(--accent-cyan)]/30 bg-[var(--accent-cyan)]/[0.03] shadow-[0_20px_40px_rgba(26,232,232,0.05)]' 
                        : 'border-[var(--border-color)] bg-[var(--text-primary)]/[0.01] opacity-20'
                      }`}
                    >
                       <div className={`transition-all duration-700 ${item.active ? 'text-[var(--accent-cyan)]' : 'text-[var(--text-primary)]/40'}`}>
                          {item.icon}
                       </div>
                       <span className={`text-[9px] font-black uppercase tracking-[0.2em] mt-4 transition-colors ${item.active ? 'text-[var(--text-primary)]/80' : 'text-[var(--text-primary)]/50'}`}>
                          {item.label}
                       </span>
                       
                       {/* Status Pulse */}
                       {item.active && (
                         <div className="absolute top-4 right-4 w-1 h-1 rounded-full bg-[var(--accent-cyan)] shadow-[0_0_10px_var(--accent-cyan)]" />
                       )}
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </main>
    </div>
  );
}
