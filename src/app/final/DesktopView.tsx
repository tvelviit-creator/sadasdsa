"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { saveOrder, getAllOrders, type Order } from "@/utils/orders";
import { getCurrentUserPhone, getUserData } from "@/utils/userData";

interface FinalDesktopViewProps {
  router: any;
  selectedPackages: any;
  totalPrice: number;
  isAgreed: boolean;
  setIsAgreed: (val: boolean) => void;
  executorName: string;
  executorAvatar?: string;
  showPayment: boolean;
  setShowPayment: (val: boolean) => void;
}

export default function DesktopView({
  selectedPackages,
  totalPrice,
  isAgreed,
  setIsAgreed,
  executorName,
  executorAvatar,
  showPayment,
  setShowPayment,
  router
}: FinalDesktopViewProps) {
  const [isCreating, setIsCreating] = useState(false);

  const handleFinalOrder = async () => {
    setIsCreating(true);
    
    // Fake delay for animation as requested
    await new Promise(resolve => setTimeout(resolve, 3000));

    const currentPhone = getCurrentUserPhone();
    if (!currentPhone || !selectedPackages) {
      setIsCreating(false);
      return;
    }

    try {
      const allOrders = await getAllOrders();
      const userOrders = Array.isArray(allOrders) ? allOrders.filter(o => o.clientPhone === currentPhone) : [];
      const orderNumber = (userOrders.length > 0 ? Math.max(...userOrders.map(o => o.orderNumber)) : 0) + 1;

      const orderId = `order_${currentPhone}_${Date.now()}`;
      const features = selectedPackages.tariffFeatures?.map((f: any) => f.text) || [];
      const clientData = getUserData(currentPhone);

      const newOrder: Order = {
        id: orderId,
        title: selectedPackages.serviceName || "",
        orderNumber,
        tariff: selectedPackages.tariffName || "",
        price: totalPrice,
        status: "pending",
        createdAt: new Date().toISOString(),
        clientPhone: currentPhone,
        sellerPhone: selectedPackages.sellerPhone || "ADMIN",
        description: selectedPackages.tariffDescription || selectedPackages.designDescription,
        features,
        clientName: clientData?.name || currentPhone,
        partnerName: selectedPackages.partnerName || "",
        serviceId: selectedPackages.serviceId,
      };

      await saveOrder(newOrder);
      
      // Clear storage
      localStorage.removeItem("selectedPackages");
      
      router.push(`/order/${orderId}`);
    } catch (error) {
      console.error(error);
      setIsCreating(false);
    }
  };

  return (
    <div className="hidden md:flex flex-col min-h-screen relative overflow-hidden bg-[var(--bg-color)]">
      {/* Architectural Background Grid */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: `radial-gradient(var(--border-color) 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

      {/* Unified Backdrop Glows */}
      <motion.div 
        animate={{ 
          opacity: showPayment ? 0.08 : 0.03,
          scale: showPayment ? 1.2 : 1
        }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <div className="absolute top-0 left-0 w-[800px] h-[600px] bg-[radial-gradient(circle_at_0%_0%,var(--accent-cyan),transparent_60%)] blur-[120px]" />
        <div className="absolute bottom-[-100px] right-[-100px] w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,var(--accent-cyan),transparent_70%)] blur-[120px]" />
      </motion.div>

      {/* Unified Header */}
      <header className="h-[84px] flex items-center px-12 justify-between shrink-0 z-[100] relative border-b border-white/[0.03] bg-black/5 backdrop-blur-md">
        <div className="flex items-center gap-10">
          <button 
            onClick={() => showPayment ? setShowPayment(false) : window.history.back()} 
            className="w-11 h-11 flex items-center justify-center border border-white/[0.06] rounded-2xl bg-white/[0.02] hover:bg-white/[0.08] hover:border-white/10 transition-all duration-300 active:scale-95 group"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <div className="flex flex-col">
            <h1 className="text-[19px] font-bold font-cera uppercase tracking-tight text-[var(--text-primary)]">{selectedPackages.serviceName}</h1>
          </div>
        </div>
        
        <div className="flex items-center p-1.5 bg-[#0F0F11]/60 backdrop-blur-2xl rounded-[20px] border border-white/[0.04] shadow-2xl">
           <div className={`px-8 py-2.5 rounded-[14px] flex items-center gap-3 transition-colors duration-500 ${showPayment ? 'bg-[var(--accent-cyan)] text-black' : 'bg-[var(--text-primary)] text-black'}`}>
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase">
                {showPayment ? 'ОЖИДАНИЕ ПЛАТЕЖА' : 'ФИНАЛИЗАЦИЯ ЗАКАЗА'}
              </span>
              <div className={`w-1.5 h-1.5 rounded-full ${showPayment ? 'bg-black animate-pulse' : 'bg-[var(--accent-cyan)]'}`} />
           </div>
        </div>
        
        <div className="w-20" />
      </header>

      <div className="flex-1 relative flex overflow-hidden">
        <AnimatePresence mode="wait">
          {!showPayment ? (
            <motion.div 
              key="summary"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50, filter: 'blur(20px)' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex w-full"
            >
              {/* Primary Viewport */}
              <main className="flex-1 px-12 xl:px-24 py-12 overflow-y-auto no-scrollbar relative z-10 flex flex-col items-center">
                 <div className="max-w-[800px] w-full">
                    {/* Main Greeting */}
                    <div className="mb-20">
                      <h2 className="text-6xl font-black font-cera uppercase tracking-tighter leading-[0.9] text-[var(--text-primary)] mb-6 transition-all duration-700">
                        УСЛОВИЯ <br/>
                        <span className="text-[var(--text-secondary)] opacity-10">ВАШЕГО ЗАКАЗА</span>
                      </h2>
                      <div className="w-24 h-[1px] bg-[var(--accent-cyan)] opacity-40" />
                    </div>

                    <div className="grid grid-cols-1 gap-12">
                       {/* App Details */}
                       <div className="flex flex-col gap-4">
                          <div className="p-8 rounded-[32px] border border-white/[0.05] bg-white/[0.02] flex items-center justify-between">
                             <div>
                                <p className="text-[var(--text-secondary)] text-[12px] uppercase tracking-widest font-bold mb-2">Объект разработки</p>
                                <h3 className="text-3xl font-bold font-cera uppercase">{selectedPackages.serviceName}</h3>
                             </div>
                             <div className="w-16 h-16 rounded-2xl bg-[var(--accent-cyan)]/5 border border-[var(--accent-cyan)]/10 flex items-center justify-center overflow-hidden">
                                {selectedPackages.serviceImage ? (
                                   <img src={selectedPackages.serviceImage} alt="" className="w-full h-full object-cover" />
                                ) : (
                                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" strokeWidth="2">
                                      <rect x="4" y="4" width="16" height="16" rx="4" />
                                      <path d="M12 4v16M4 12h16" opacity="0.2"/>
                                   </svg>
                                )}
                             </div>
                          </div>
                       </div>

                       {/* Executor Details */}
                       <div className="flex flex-col gap-4">
                          <div className="p-8 rounded-[32px] border border-white/[0.05] bg-white/[0.02] flex items-center gap-6">
                              <div className="w-20 h-20 rounded-[24px] overflow-hidden flex items-center justify-center shrink-0 border border-white/10">
                                {executorAvatar ? (
                                   <img src={executorAvatar} alt={executorName} className="w-full h-full object-cover" />
                                ) : (
                                   <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-black flex items-center justify-center">
                                      <span className="text-2xl font-black text-white/20">TV</span>
                                   </div>
                                )}
                              </div>
                              <div>
                                 <p className="text-[var(--text-secondary)] text-[12px] uppercase tracking-widest font-bold mb-1">Исполнитель</p>
                                 <h3 className="text-2xl font-bold font-gilroy">{executorName}</h3>
                              </div>
                          </div>
                       </div>

                       {/* Packages Details */}
                       <div className="grid grid-cols-2 gap-8">
                          <div className="flex flex-col gap-4">
                             <div className="p-8 rounded-[32px] border border-white/[0.05] bg-white/[0.02]">
                                <p className="text-[var(--text-secondary)] text-[12px] uppercase tracking-widest font-bold mb-4">Тариф</p>
                                <h3 className="text-xl font-bold font-cera uppercase mb-2">{selectedPackages.tariffName}</h3>
                                <div className="h-[1px] w-full bg-white/5 my-4" />
                                <div className="space-y-3">
                                   {selectedPackages.tariffFeatures?.slice(0, 3).map((f: any, i: number) => (
                                     <div key={i} className="flex items-center gap-3">
                                        <div className="w-1 h-1 rounded-full bg-[var(--accent-cyan)] opacity-40" />
                                        <span className="text-[12px] text-white/40">{f.text}</span>
                                     </div>
                                   ))}
                                </div>
                             </div>
                          </div>
                          <div className="flex flex-col gap-4">
                             <div className="p-8 rounded-[32px] border border-white/[0.05] bg-white/[0.02]">
                                <p className="text-[var(--text-secondary)] text-[12px] uppercase tracking-widest font-bold mb-4">Дизайн</p>
                                <h3 className="text-xl font-bold font-cera uppercase mb-2">{selectedPackages.designName}</h3>
                                <div className="h-[1px] w-full bg-white/5 my-4" />
                                <p className="text-[12px] text-white/40 leading-relaxed">
                                  {selectedPackages.designDescription || "Премиальное визуальное сопровождение вашего продукта"}
                                </p>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </main>

              {/* Sidebar Recap */}
              <aside className="w-[440px] shrink-0 p-8 relative z-20 flex flex-col h-full bg-transparent">
                 <div className="flex-1 flex flex-col justify-between overflow-hidden relative rounded-[40px] border border-white/[0.05] bg-[var(--nav-bg)] shadow-[0_40px_80px_rgba(0,0,0,0.5)] backdrop-blur-[40px] p-10">
                    <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" 
                         style={{ backgroundImage: `radial-gradient(var(--border-color) 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />
                    
                    <div className="relative z-10 flex-1 flex flex-col h-full">
                       <h3 className="text-base font-bold text-[var(--text-primary)] font-gilroy uppercase tracking-tight pb-6 border-b border-[var(--border-color)] mb-10">
                         ИТОГОВАЯ КОНФИГУРАЦИЯ
                       </h3>

                       <div className="flex-1 space-y-8">
                          <div className="flex justify-between items-baseline">
                             <span className="text-[11px] font-black text-[var(--text-secondary)] uppercase tracking-widest opacity-40">Основная стоимость</span>
                             <div className="h-[1px] flex-1 border-b border-dashed border-[var(--border-color)] mx-4" />
                             <span className="text-xl font-bold font-cera">{totalPrice.toLocaleString()} ₽</span>
                          </div>
                          
                          <div className="pt-10 mt-10 border-t border-[var(--border-color)]">
                             <div className="flex items-start gap-4 cursor-pointer group" onClick={() => setIsAgreed(!isAgreed)}>
                                <div className={`
                                   w-6 h-6 rounded-xl border-2 flex items-center justify-center transition-all shrink-0
                                   ${isAgreed ? 'border-[var(--accent-cyan)] bg-[var(--accent-cyan)]/20 shadow-[0_0_15px_rgba(0,240,255,0.2)]' : 'border-white/10 hover:border-white/20'}
                                `}>
                                   {isAgreed && <div className="w-2 h-2 rounded-full bg-[var(--accent-cyan)] shadow-[0_0_10px_var(--accent-cyan)]" />}
                                </div>
                                <p className="text-[12px] text-white/40 leading-relaxed group-hover:text-white/60 transition-colors uppercase tracking-tight font-medium">
                                   Я принимаю условия <span className="text-[var(--accent-cyan)] border-b border-[var(--accent-cyan)]/20">Пользовательского соглашения</span>
                                </p>
                             </div>
                          </div>
                       </div>

                       <div className="pt-10 space-y-8 border-t border-[var(--border-color)] mt-auto">
                          <div className="flex items-center justify-end">
                             <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-black font-cera tracking-tighter">{totalPrice.toLocaleString()}</span>
                                <span className="text-[11px] font-black text-[var(--accent-cyan)] uppercase opacity-30">RUB</span>
                             </div>
                          </div>

                          <button 
                            onClick={() => isAgreed && setShowPayment(true)}
                            disabled={!isAgreed}
                            className="animated-button"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="arr-2" viewBox="0 0 24 24">
                              <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
                            </svg>
                            <span className="text">ПЕРЕЙТИ К ОПЛАТЕ</span>
                            <span className="circle"></span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="arr-1" viewBox="0 0 24 24">
                              <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
                            </svg>
                          </button>
                       </div>
                    </div>
                 </div>
              </aside>
            </motion.div>
          ) : (
            <motion.div 
              key="payment"
              initial={{ opacity: 0, filter: 'blur(30px)', scale: 1.05 }}
              animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 flex overflow-hidden w-full h-full"
            >
              {/* Payment Hero Column */}
              <div className="flex-1 flex flex-col justify-center pl-16 xl:pl-32 relative text-left">
                  <div className="relative z-10 flex flex-col items-start">
                    {/* ... Oplata Animation ... */}
                    <div className="flex overflow-hidden">
                      {"ОПЛАТА".split("").map((char, i) => (
                        <motion.span
                          key={i}
                          initial={{ y: "100%" }}
                          animate={{ y: 0 }}
                          transition={{ 
                            duration: 0.8, 
                            delay: i * 0.1, 
                            ease: [0.16, 1, 0.3, 1] 
                          }}
                          className="text-[12vw] font-black leading-none font-cera text-[var(--accent-cyan)] uppercase inline-block"
                        >
                          {char}
                        </motion.span>
                      ))}
                    </div>
                    <div className="mt-12 flex items-center gap-5">
                      <div className="relative flex items-center justify-center">
                        <motion.div 
                          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          className="absolute w-4 h-4 rounded-full bg-[var(--accent-cyan)]/40"
                        />
                        <div className="w-2 h-2 rounded-full bg-[var(--accent-cyan)] shadow-[0_0_10px_var(--accent-cyan)]" />
                      </div>
                      
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl text-white/40 uppercase tracking-[0.3em] font-light">Ожидание оплаты</span>
                        <div className="flex gap-1 ml-2">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              animate={{ opacity: [0.2, 1, 0.2] }}
                              transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.2 }}
                              className="w-1 h-1 rounded-full bg-[var(--accent-cyan)]"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
              </div>

              {/* Payment Details Column */}
              <div className="w-[600px] h-full flex flex-col justify-center items-center px-12 xl:px-24 relative shrink-0">
                  <div className="relative z-10 w-full flex flex-col items-center">
                    <p className="text-[var(--text-secondary)] uppercase tracking-[0.5em] text-[10px] font-black opacity-20 mb-12">СИСТЕМА БЫСТРЫХ ПЛАТЕЖЕЙ</p>
                    
                    <div className="mb-16 p-10 bg-white rounded-[40px] shadow-[0_0_100px_rgba(255,255,255,0.05)] relative group">
                        <div className="absolute -inset-1 bg-gradient-to-br from-[var(--accent-cyan)] to-black opacity-0 group-hover:opacity-10 transition-opacity duration-1000 rounded-[44px]" />
                        <svg width="220" height="220" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1" strokeLinecap="round">
                           <path d="M2 2h6v6H2zM16 2h6v6h-6zM2 16h6v6H2z" />
                           <path d="M5 5h0M19 5h0M5 19h0M12 2v4M12 8h0M10 12h4v4h-4zM16 12h6M16 16v6M20 18h2M12 18h0M12 22h0" />
                        </svg>
                    </div>

                    <div className="text-center mb-16">
                       <p className="text-white/20 text-xs font-bold uppercase tracking-[0.3em] mb-4">Сумма к оплате</p>
                       <p className="text-7xl font-black font-cera tracking-tighter text-white">
                         {totalPrice.toLocaleString()} <span className="text-2xl text-[var(--accent-cyan)] font-bold">₽</span>
                       </p>
                    </div>

                    <div className="w-full relative h-[140px] flex items-center justify-center">
                      <AnimatePresence mode="wait">
                        {!isCreating ? (
                          <motion.div 
                            key="buttons"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="w-full space-y-4"
                          >
                            <button 
                              onClick={handleFinalOrder}
                              className="w-full py-6 rounded-[28px] bg-white text-black font-black uppercase tracking-[0.3em] text-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                              Я ОПЛАТИЛ
                            </button>
                            <button 
                              onClick={() => setShowPayment(false)}
                              className="w-full py-4 rounded-[28px] border border-[var(--border-color)] text-white/30 font-bold uppercase tracking-widest text-[10px] hover:text-white transition-colors"
                            >
                              ВЕРНУТЬСЯ К ЗАКАЗУ
                            </button>
                          </motion.div>
                        ) : (
                          <motion.div 
                            key="loading"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center gap-6"
                          >
                            <div className="relative flex items-center justify-center">
                              <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-12 h-12 rounded-full border-2 border-[var(--border-color)] border-t-[var(--accent-cyan)] shadow-[0_0_20px_var(--accent-cyan)]/20"
                              />
                            </div>
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-[10px] font-black text-[var(--accent-cyan)] uppercase tracking-[0.4em] animate-pulse">СОЗДАЕМ ЗАКАЗ</span>
                              <div className="flex gap-1">
                                {[0, 1, 2].map((i) => (
                                  <motion.div
                                    key={i}
                                    animate={{ opacity: [0.2, 1, 0.2] }}
                                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                                    className="w-1 h-1 rounded-full bg-[var(--accent-cyan)]"
                                  />
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}


