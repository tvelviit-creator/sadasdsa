"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getServices, Service, deleteService } from "@/utils/services";
import { getCurrentUserPhone, getActiveRole, getUserData } from "@/utils/userData";
import { Edit2, Trash2, LayoutGrid, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MyServicesPage() {
    const router = useRouter();
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const role = getActiveRole();
        if (role !== 'seller') {
            router.push('/client');
            return;
        }

        const phone = getCurrentUserPhone();
        if (!phone) {
            router.push('/registration');
            return;
        }

        const allServices = getServices();
        const sellerServices = allServices.filter(s => s.sellerPhone === phone);
        setServices(sellerServices);
        setLoading(false);
    }, [router]);

    const handleDelete = (id: string) => {
        if (confirm("Вы действительно хотите удалить эту услугу?")) {
            deleteService(id);
            setServices(prev => prev.filter(s => s.id !== id));
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--bg-color)] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[var(--text-primary)]/10 border-t-[var(--accent-cyan)] rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0A0A0B] text-white font-sans selection:bg-[var(--accent-cyan)]/30 transition-colors duration-300 relative z-10 mx-auto w-full">
            
            {/* MOBILE UI - MATCHING BACKUP DESIGN */}
            <div className="md:hidden">
                {/* Mobile Background Elements */}
                <div className="fixed inset-0 z-[-1] pointer-events-none opacity-[0.03]" style={{ backgroundImage: `radial-gradient(white 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
                <div className="fixed top-[-10%] right-[-10%] w-[60%] h-[60%] bg-[var(--accent-cyan)]/5 blur-[100px] rounded-full pointer-events-none z-[-1]" />
                <div className="fixed bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-500/5 blur-[100px] rounded-full pointer-events-none z-[-1]" />

                {/* Figma SVG Header */}
                <header className="fixed top-0 left-0 w-full h-[102px] z-[100] bg-black/40 backdrop-blur-3xl border-b border-white/5 shadow-2xl transition-colors duration-300">
                    <svg width="100%" height="102" viewBox="0 0 375 102" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full absolute inset-0 z-[-1] pointer-events-none">
                      <mask id="header-mask-service" fill="white">
                        <path d="M0 0H375V102H0V0Z" />
                      </mask>
                      <path d="M0 0H375V102H0V0Z" fill="transparent" />
                      <path d="M375 102V101H0V102V103H375V102Z" fill="transparent" mask="url(#header-mask-service)" />
                        {/* Back Arrow */}
                        <g onClick={() => router.push("/lkseller")} className="cursor-pointer pointer-events-auto">
                           <path d="M51 72L29 72M29 72L38.4286 81M29 72L38.4286 63" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </g>
                        {/* Settings Icon */}
                        <g onClick={() => router.push("/setting-new")} className="cursor-pointer pointer-events-auto">
                           <path d="M305.024 68.0835L304.584 67.8242C304.516 67.7839 304.482 67.7637 304.449 67.7427C304.122 67.5345 303.845 67.2468 303.644 66.9026C303.623 66.868 303.604 66.8317 303.565 66.7599C303.526 66.6882 303.506 66.6519 303.488 66.6159C303.307 66.2579 303.209 65.8588 303.203 65.4526C303.203 65.4118 303.203 65.3701 303.204 65.2872L303.213 64.7459C303.227 63.8796 303.234 63.4452 303.119 63.0553C303.017 62.709 302.846 62.39 302.618 62.1193C302.361 61.8133 302.004 61.595 301.291 61.1589L300.698 60.7967C299.986 60.3619 299.63 60.1444 299.252 60.0615C298.918 59.9881 298.573 59.9915 298.24 60.0708C297.864 60.1603 297.513 60.3834 296.81 60.8295L296.806 60.8315L296.381 61.1012C296.314 61.1438 296.28 61.1653 296.247 61.1852C295.913 61.3821 295.54 61.491 295.158 61.504C295.119 61.5053 295.08 61.5053 295.002 61.5053C294.924 61.5053 294.883 61.5053 294.844 61.504C294.462 61.491 294.088 61.3815 293.753 61.1837C293.72 61.1638 293.686 61.1421 293.619 61.0993L293.191 60.8272C292.484 60.3769 292.13 60.1514 291.752 60.0615C291.417 59.9819 291.071 59.9797 290.736 60.054C290.357 60.1379 290.001 60.357 289.289 60.7952L289.286 60.7967L288.7 61.157L288.694 61.1612C287.988 61.5955 287.634 61.8131 287.379 62.1179C287.152 62.3883 286.983 62.7068 286.882 63.0522C286.767 63.4426 286.773 63.878 286.787 64.7483L286.796 65.2888C286.797 65.3707 286.799 65.4114 286.799 65.4516C286.793 65.8586 286.694 66.2585 286.512 66.6172C286.494 66.6527 286.475 66.6881 286.436 66.759C286.398 66.8299 286.379 66.8652 286.359 66.8994C286.157 67.2454 285.879 67.5348 285.549 67.7434C285.516 67.764 285.482 67.7838 285.415 67.8235L284.98 68.0786C284.258 68.5029 283.897 68.7153 283.635 69.0174C283.402 69.2848 283.227 69.6019 283.12 69.9472C282.998 70.3376 282.999 70.7754 283 71.6508L283.002 72.3663C283.004 73.2359 283.006 73.6704 283.128 74.0581C283.235 74.4011 283.409 74.7164 283.64 74.9821C283.902 75.2825 284.259 75.4935 284.976 75.9162L285.406 76.17C285.479 76.2132 285.516 76.2345 285.551 76.257C285.878 76.4657 286.154 76.7543 286.354 77.0983C286.376 77.1355 286.397 77.1741 286.439 77.2512C286.48 77.3274 286.501 77.3655 286.52 77.4037C286.696 77.7572 286.79 78.1499 286.797 78.5496C286.797 78.5928 286.797 78.6364 286.795 78.7242L286.787 79.2429C286.773 80.1162 286.767 80.5534 286.882 80.9449C286.984 81.2912 287.155 81.6102 287.383 81.8809C287.64 82.1869 287.997 82.405 288.711 82.8411L289.303 83.2032C290.015 83.6381 290.371 83.8553 290.749 83.9382C291.083 84.0116 291.428 84.0087 291.761 83.9295C292.138 83.8398 292.49 83.6159 293.195 83.1686L293.62 82.8989C293.687 82.8562 293.721 82.8349 293.755 82.815C294.089 82.6181 294.461 82.5086 294.843 82.4956C294.882 82.4943 294.921 82.4943 294.999 82.4943C295.078 82.4943 295.117 82.4943 295.155 82.4956C295.538 82.5087 295.913 82.6185 296.248 82.8162C296.277 82.8336 296.307 82.8524 296.358 82.8854L296.81 83.1729C297.518 83.6232 297.871 83.848 298.249 83.938C298.583 84.0175 298.93 84.0208 299.265 83.9465C299.644 83.8626 300.001 83.643 300.712 83.2051L301.307 82.8394C302.013 82.4049 302.367 82.187 302.622 81.8821C302.849 81.6117 303.019 81.2933 303.12 80.9479C303.234 80.5603 303.227 80.1283 303.213 79.2706L303.204 78.7112C303.203 78.6293 303.203 78.5886 303.203 78.5483C303.209 78.1413 303.307 77.7412 303.488 77.3825C303.506 77.3471 303.525 77.3113 303.564 77.2407C303.603 77.1698 303.623 77.1344 303.643 77.1002C303.845 76.7542 304.123 76.4646 304.453 76.256C304.485 76.2356 304.518 76.2161 304.584 76.1774L304.587 76.1762L305.021 75.9212C305.743 75.4969 306.104 75.2843 306.367 74.9821C306.599 74.7148 306.775 74.3981 306.882 74.0528C307.002 73.6647 307.001 73.2295 307 72.3643L306.998 71.6334C306.996 70.7638 306.995 70.3294 306.874 69.9416C306.766 69.5986 306.591 69.2834 306.36 69.0176C306.099 68.7176 305.741 68.5065 305.026 68.0846L305.024 68.0835Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </g>

                        {/* Title text "МОИ УСЛУГИ" - Simplified text for consistent feel */}
                        <text x="50%" y="75" dominantBaseline="middle" textAnchor="middle" fill="white" style={{ fontFamily: 'var(--font-cera), sans-serif', fontWeight: 800, fontSize: '18px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Мои услуги</text>
                    </svg>
                </header>

                <main className="pt-[130px] px-6 pb-24">
                   {services.length === 0 ? (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-20 px-6 text-center space-y-8"
                      >
                        <div className="relative">
                          <div className="absolute inset-0 bg-[var(--accent-cyan)] opacity-10 blur-[40px] rounded-full animate-pulse" />
                          <div className="relative w-20 h-20 bg-white/[0.03] backdrop-blur-3xl rounded-[32px] flex items-center justify-center border border-[var(--border-color)] shadow-2xl overflow-hidden">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 2L20.66 7V17L12 22L3.34 17V7L12 2Z" stroke="var(--accent-cyan)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M12 2V12L20.66 7M12 12L3.34 7M12 12L12 22" stroke="var(--accent-cyan)" strokeWidth="1" strokeOpacity="0.4" strokeLinecap="round" strokeLinejoin="round" />
                              <circle cx="12" cy="12" r="2.5" stroke="var(--accent-cyan)" strokeWidth="1.2" strokeOpacity="0.3" />
                            </svg>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h2 className="text-[16px] font-black uppercase tracking-[0.1em] text-white font-cera leading-none">
                            У вас нет услуг
                          </h2>
                          <p className="text-[12px] text-white/50 max-w-[200px] mx-auto leading-relaxed font-medium">
                            Ваша витрина пока пуста. <br/>Добавьте первую услугу в кабинете.
                          </p>
                        </div>
                      </motion.div>
                   ) : (
                      <div className="grid grid-cols-2 gap-x-[19px] gap-y-10">
                         {services.map((service) => (
                            <div key={service.id} className="flex flex-col relative w-full h-full">
                               <div className="w-full aspect-[153.5/159] rounded-[24px] overflow-hidden bg-white/5 backdrop-blur-sm mb-3 relative border border-white/10 shadow-xl group" onClick={() => router.push(`/tarif?id=${service.id}`)}>
                                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />
                                  <img src={service.coverImage} alt={service.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                  
                                  {/* Mobile Floating Actions */}
                                  <div className="absolute top-2 right-2 flex flex-col gap-2 z-20">
                                     <button 
                                        onClick={(e) => {
                                           e.stopPropagation();
                                           router.push(`/catigoriy/${service.categoryId}/add?edit=${service.id}`);
                                        }}
                                        className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg active:scale-90"
                                     >
                                        <Edit2 className="w-3.5 h-3.5 text-white" />
                                     </button>
                                     <button 
                                        onClick={(e) => {
                                           e.stopPropagation();
                                           handleDelete(service.id);
                                        }}
                                        className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg active:scale-90"
                                     >
                                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                                     </button>
                                  </div>
                                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                               </div>
                               <div className="flex flex-col gap-1 px-1 mt-auto" onClick={() => router.push(`/tarif?id=${service.id}`)}>
                                  <h3 className="text-[13px] font-black text-white leading-tight line-clamp-2 uppercase">
                                     {service.name}
                                  </h3>
                                  <p className="text-[12px] text-[#1AE8E8] font-bold uppercase tracking-wider">
                                     от {Number(service.price).toLocaleString('ru-RU')} ₽
                                  </p>
                               </div>
                            </div>
                         ))}
                      </div>
                   )}
                </main>
            </div>

            {/* DESKTOP UI - ULTRA-MINIMALIST ARCHITECTURAL VERSION */}
            <div className="hidden md:flex flex-col w-full min-h-screen relative z-10 overflow-hidden bg-[var(--bg-color)]">
                <div className="max-w-[1400px] mx-auto w-full px-12 pt-20 pb-32 flex flex-col items-start">
                    
                    {/* Header Block - Matching settings style */}
                    <header className="flex flex-col mb-16">
                        <h1 className="text-4xl md:text-5xl font-black font-cera text-[var(--text-primary)] tracking-tight leading-none uppercase">
                            МОИ<br/>
                            <span className="text-[var(--text-secondary)] opacity-50">УСЛУГИ</span>
                        </h1>
                    </header>

                    {/* Content Section */}
                    <div className="w-full">
                        <div className="flex items-center justify-start gap-8 mb-12 pb-4 border-b border-[var(--border-color)]/20">
                            <h2 className="text-[12px] font-black uppercase tracking-[0.4em] opacity-40">
                                {services.length} ПОЗИЦИЙ
                            </h2>
                        </div>

                        {services.length === 0 ? (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="relative w-full h-[500px] flex flex-col items-center justify-center overflow-hidden border border-[var(--border-color)]/10 rounded-[48px] bg-[var(--card-bg)]/5 group/empty"
                            >
                                {/* Minimalist Central Content */}
                                <div className="relative z-10 flex flex-col items-center">
                                    <div className="w-12 h-[1px] bg-[var(--text-primary)] mb-8 opacity-20 group-hover:w-24 transition-all duration-700 ease-out" />
                                    
                                    <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-[var(--text-secondary)] mb-4 opacity-40">
                                        СТАТУС: <span className="text-[var(--text-primary)] opacity-100 uppercase">НЕТ ПОЗИЦИЙ</span>
                                    </h2>
                                    
                                    <h3 className="text-3xl md:text-4xl font-black font-cera text-[var(--text-primary)] mb-8 tracking-tight uppercase text-center leading-tight">
                                        ВАШ СПИСОК УСЛУГ<br/>
                                        <span className="text-[var(--text-secondary)] opacity-50">ПОКА</span> ПУСТ
                                    </h3>
                                    
                                    <button 
                                        onClick={() => router.push('/catigoriy')}
                                        className="h-12 px-8 rounded-full bg-[var(--text-primary)] text-[var(--bg-color)] text-[11px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl"
                                    >
                                        ДОБАВИТЬ УСЛУГУ
                                    </button>
                                    
                                    <div className="w-12 h-[1px] bg-[var(--text-primary)] mt-8 opacity-20 group-hover:w-6 transition-all duration-700 ease-out" />
                                </div>
                                
                                {/* Edge Accents */}
                                <div className="absolute top-8 left-8 w-4 h-4 border-t border-l border-[var(--border-color)]/20" />
                                <div className="absolute bottom-8 right-8 w-4 h-4 border-b border-r border-[var(--border-color)]/20" />
                            </motion.div>
                        ) : (
                            <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-6 gap-x-4 gap-y-10">
                                {services.map((service, index) => (
                                    <motion.div
                                        key={service.id}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.03, duration: 0.5, ease: "easeOut" }}
                                        className="group flex flex-col cursor-pointer transition-all duration-300"
                                        onClick={() => router.push(`/tarif?id=${service.id}`)}
                                    >
                                        {/* Image Card - Vertical Focus */}
                                        <div className="w-full aspect-[3/4.2] bg-[var(--card-bg)] rounded-[20px] relative overflow-hidden mb-3 transition-all duration-500 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)]">
                                            {service.coverImage ? (
                                                <img src={service.coverImage} alt={service.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                                            ) : (
                                                <div className="w-full h-full bg-[var(--nav-bg)] flex items-center justify-center">
                                                    <span className="text-xl opacity-5 font-black tracking-widest uppercase text-[var(--text-primary)]">TVELV</span>
                                                </div>
                                            )}
                                            
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            
                                            {/* Edit/Delete Overlay */}
                                            <div className="absolute inset-0 z-20 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                                                <div 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        router.push(`/catigoriy/${service.categoryId}/add?edit=${service.id}`);
                                                    }}
                                                    className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-[var(--accent-cyan)] transition-all shadow-xl active:scale-90 cursor-pointer"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </div>
                                                <div 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(service.id);
                                                    }}
                                                    className="w-10 h-10 rounded-full bg-white text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-xl active:scale-90 cursor-pointer"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content Info - WB STYLE */}
                                        <div className="flex flex-col px-1 overflow-hidden">
                                            {/* Brand & Name */}
                                            <div className="flex flex-col mb-1.5">
                                                {(() => {
                                                    const isAdmin = service.sellerPhone === "79999999999" || !service.sellerPhone || service.partnerName === "OFFICIAL" || !service.partnerName;
                                                    const name = isAdmin ? "TVELV OFFICIAL" : (service.partnerName || "OFFICIAL");
                                                    
                                                    return (
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-tight opacity-40">
                                                                {name}
                                                            </span>
                                                            <span className="text-[16px] text-[var(--text-primary)] line-clamp-2 font-bold opacity-90 leading-tight">
                                                                {service.name}
                                                            </span>
                                                        </div>
                                                    );
                                                })()}
                                            </div>

                                            {/* Price Section */}
                                            <div className="flex items-end gap-1.5 flex-wrap">
                                                <span className="text-[15px] font-black text-[var(--text-primary)] font-cera leading-none whitespace-nowrap">
                                                    {Number(service.price).toLocaleString()} ₽
                                                </span>
                                                <span className="text-[10px] text-[var(--text-secondary)] line-through opacity-20 font-bold mb-[2px] whitespace-nowrap">
                                                    {Math.round(Number(service.price) * 1.2).toLocaleString()} ₽
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
}
