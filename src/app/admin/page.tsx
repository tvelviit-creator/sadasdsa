"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserData, saveUserData, getCurrentUserPhone, formatPhone } from "@/utils/userData";
import { getAllOrders, Order } from "@/utils/orders";
import { Users, Settings, LogOut } from "lucide-react";

export default function AdminProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [phone, setPhone] = useState<string>("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    let isMounted = true;
    const currentPhone = getCurrentUserPhone();
    if (!currentPhone) {
      router.replace("/registration");
      return;
    }
    
    const ud = getUserData(currentPhone);
    setPhone(currentPhone);
    if (ud) {
      setName(ud.name || "Администратор");
      setEmail(ud.email || "");
      setAvatar(ud.avatar || "");
    } else {
      setName("Администратор");
    }

    async function fetchOrders() {
      try {
        const all = await getAllOrders();
        if (isMounted) {
          // Sort explicitly by date for latest
          const latest = all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setOrders(latest);
        }
      } catch (e) {
        console.error("Error fetching orders:", e);
      }
    }
    fetchOrders();

    return () => { isMounted = false; };
  }, [router]);

  const handleSave = () => {
    if (phone) {
      saveUserData(phone, { name, email, avatar });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAvatar(base64String);
        if (phone) {
          saveUserData(phone, { avatar: base64String });
        }
      };
      reader.readAsDataURL(file);
    }
  };


  return (
    <div className="w-full min-h-screen bg-[#0A0A0B] text-[var(--text-primary)] font-sans relative overflow-hidden">
      {/* Background Architectural Grid */}
      <div className="hidden md:block absolute inset-0 z-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: `radial-gradient(white 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
      
      {/* Background Accents */}
      <div className="hidden md:block absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[var(--accent-cyan)]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="hidden md:block absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* PC Version */}
      <main className="hidden md:flex flex-col flex-1 w-full max-w-[1600px] mx-auto px-12 xl:px-24 py-12 space-y-10 relative z-10">
        <header className="mb-0">
            <h1 className="text-4xl md:text-5xl font-black font-cera text-[var(--text-primary)] tracking-tight leading-none uppercase drop-shadow-sm">
                ЛИЧНЫЙ КАБИНЕТ<br/>
                <span className="text-[var(--accent-cyan)] opacity-60">АДМИНИСТРАТОРА</span>
            </h1>
        </header>

        <div className="grid grid-cols-[1fr_2fr] gap-10 items-start">
          <div className="space-y-8 w-full">
            {/* Profile Avatar Section */}
            <div className="flex flex-col items-center">
              {avatar ? (
                <div className="w-[124px] h-[124px] rounded-[32px] overflow-hidden border border-[var(--border-color)] shadow-2xl transition-transform hover:scale-105">
                  <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-[124px] h-[124px] bg-[var(--text-primary)] rounded-[32px] flex items-center justify-center text-center p-4 shadow-2xl shadow-[var(--text-primary)]/20 transition-transform hover:scale-105">
                  <span className="text-[var(--bg-color)] text-lg font-black uppercase">ТВЕЛЬФ</span>
                </div>
              )}
            </div>

            {/* Form Fields */}
            <div className="space-y-6 bg-[var(--card-bg)] p-8 rounded-[32px] border border-[var(--border-color)] shadow-2xl relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <h2 className="text-xl font-bold font-cera text-[var(--text-primary)]">Личные данные</h2>
              <div className="space-y-2">
                <label className="text-[var(--text-secondary)] text-[13px] ml-1 font-medium">Имя</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={handleSave}
                  className="w-full h-[56px] bg-[var(--nav-bg)] rounded-[20px] px-5 text-[15px] font-bold text-[var(--text-primary)] border border-[var(--border-color)] focus:outline-none transition-colors focus:border-[var(--accent-cyan)] placeholder:text-[var(--text-secondary)] placeholder:font-normal"
                  placeholder="Администратор"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[var(--text-secondary)] text-[13px] ml-1 font-medium">Почта</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={handleSave}
                  className="w-full h-[56px] bg-[var(--nav-bg)] rounded-[20px] px-5 text-[15px] font-bold text-[var(--text-primary)] border border-[var(--border-color)] focus:outline-none transition-colors focus:border-[var(--accent-cyan)] placeholder:text-[var(--text-secondary)] placeholder:font-normal"
                  placeholder="admin@tvelv.ru"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[var(--text-secondary)] text-[13px] ml-1 font-medium">Номер телефона</label>
                <div className="w-full h-[56px] bg-[#111] rounded-[20px] px-5 flex items-center text-[15px] font-bold tracking-widest text-[var(--text-primary)] border border-[#222] opacity-70 cursor-not-allowed">
                  {phone ? formatPhone(phone) : "+7 (999) 999 99-99"}
                </div>
              </div>
            </div>

            {/* Avatar Upload Area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full min-h-[160px] rounded-[32px] border border-dashed border-white/10 bg-white/[0.02] flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/[0.04] active:bg-white/[0.06] transition-all p-6 group backdrop-blur-3xl"
            >
              <svg width="40" height="28" viewBox="137.5 25 54 35" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-0 transition-transform group-hover:-translate-y-1">
                <path d="M164.5 52.4999V37.4999M164.5 37.4999L157.136 42.4999M164.5 37.4999L171.864 42.4999M191.5 49.9999C191.5 44.4771 187.104 39.9999 181.682 39.9999C181.624 39.9999 181.567 40.0004 181.509 40.0015C180.319 31.52 173.156 25 164.5 25C157.635 25 151.712 29.1001 148.96 35.027C142.561 35.4536 137.5 40.8745 137.5 47.4995C137.5 54.403 142.995 60 149.773 60L181.682 59.9998C187.104 59.9998 191.5 55.5227 191.5 49.9999Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors"/>
              </svg>
              <p className="text-[var(--text-secondary)] text-[12px] font-medium mb-3 group-hover:text-[var(--text-primary)] transition-colors">Обновить аватарку</p>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </div>
          </div>

          <section className="space-y-6 pb-20 w-full min-w-0">
            <h2 className="text-[20px] md:text-[24px] font-bold text-[var(--text-primary)] md:mb-6" style={{ fontFamily: 'var(--font-cera), sans-serif' }}>Глобально по заказам в работе</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[16px]">
              {orders.length === 0 ? (
                <div className="col-span-full h-full min-h-[30vh] flex items-center justify-center text-center py-20 text-[var(--text-secondary)]/30 font-bold text-[18px] uppercase tracking-widest bg-[var(--card-bg)] rounded-[32px] border border-[var(--border-color)]">
                  Заказов пока нет
                </div>
              ) : (
                orders.slice(0, 6).map((order) => {
                  const orderNumStr = order.orderNumber ? String(order.orderNumber).split('-').pop() : order.id.slice(-4);
                  
                  return (
                    <div key={order.id} onClick={() => router.push(`/admin/orders/${order.id}`)} className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] shadow-2xl rounded-[32px] p-8 flex flex-col gap-4 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] hover:border-white/10 active:scale-[0.98] transition-all cursor-pointer group relative overflow-hidden">
                       <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                       <div className="flex justify-between items-start">
                          <h3 className="text-[20px] font-bold leading-tight font-cera uppercase max-w-[200px] line-clamp-2">{order.title || "Без названия"}</h3>
                          <span className="text-[20px] font-bold text-[#666] font-cera group-hover:text-[var(--text-primary)] transition-colors">№{orderNumStr}</span>
                       </div>
                       <div className="flex justify-between items-center text-[16px] font-bold text-[var(--text-secondary)] font-cera mt-1">
                          <span>{order.tariff || "Базовый"}</span>
                          <span className="text-[var(--text-primary)]">{Number(order.price).toLocaleString()} ₽</span>
                       </div>
                       
                       <div className="flex flex-col gap-1.5 mt-2 pt-3 border-t border-[var(--border-color)]/50">
                          <div className="flex justify-between text-[12px] text-[var(--text-secondary)]">
                             <span>Заказчик:</span>
                             <span className="text-[var(--text-primary)] font-medium tabular-nums">{order.clientPhone ? formatPhone(order.clientPhone) : "-"}</span>
                          </div>
                       </div>
                       
                       <div className="flex items-center justify-between mt-auto pt-4 border-t border-[var(--border-color)]">
                          <span className="text-[12px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">{new Date(order.createdAt).toLocaleDateString('ru-RU')}</span>
                          <div className={`px-4 py-1.5 rounded-full border border-[var(--border-color)] group-hover:border-[var(--text-primary)]/30 transition-colors`}>
                             <span className="text-[var(--text-primary)] text-[10px] font-black uppercase tracking-wider">Открыть</span>
                          </div>
                       </div>
                    </div>
                  );
                })
              )}
            </div>
            
            {orders.length > 6 && (
              <button 
                onClick={() => router.push('/admin/orders')}
                className="w-full mt-4 h-[60px] rounded-[24px] bg-[var(--card-bg)] border border-[var(--border-color)] flex items-center justify-center text-[14px] font-bold uppercase tracking-widest hover:border-white/20 hover:bg-white/5 transition-all active:scale-[0.98]"
              >
                Все заказы
              </button>
            )}
          </section>
        </div>
      </main>

      {/* MOBILE Version - Full Functional Layout */}
      <div className="md:hidden w-full flex flex-col relative items-center pb-32 bg-[#0A0A0B]">
        <div className="fixed inset-0 z-[0] pointer-events-none opacity-[0.03]" style={{ backgroundImage: `radial-gradient(white 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
        <div className="fixed top-[-10%] right-[-10%] w-[60%] h-[60%] bg-[var(--accent-cyan)]/5 blur-[100px] rounded-full pointer-events-none z-[0]" />
        <div className="fixed bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-500/5 blur-[100px] rounded-full pointer-events-none z-[0]" />

        <header className="fixed top-0 w-full max-w-[375px] h-[97px] bg-black/40 backdrop-blur-3xl z-50 transition-colors duration-300 border-b border-white/5">
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="flex items-center justify-between h-full px-6 pt-6">
            <h1 className="text-[18px] font-black font-cera text-white uppercase tracking-tight">Админ-панель</h1>
            <button 
              onClick={() => router.push('/client')}
              className="px-4 h-[32px] rounded-full bg-white text-black text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all"
            >
              К сайту
            </button>
          </div>
        </header>

        <main className="pt-[130px] px-6 w-full relative z-10 space-y-12">
          {/* Admin Identity Section */}
          <div className="flex flex-col items-center gap-6">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative group cursor-pointer"
            >
              <div className="w-[110px] h-[110px] rounded-[32px] overflow-hidden border border-white/10 bg-black/40 backdrop-blur-3xl shadow-2xl relative">
                {avatar ? (
                  <img src={avatar} alt="Avatar" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[var(--text-primary)] text-[var(--bg-color)]">
                    <span className="text-xl font-black uppercase">ТВ</span>
                  </div>
                )}
                {/* Edit Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[var(--accent-cyan)] rounded-2xl flex items-center justify-center shadow-lg border-4 border-[#0A0A0B]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </div>
            </div>

            <div className="text-center space-y-1">
              <h2 className="text-[22px] font-black font-cera text-white uppercase tracking-tight">{name}</h2>
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-[var(--accent-cyan)] rounded-full animate-pulse shadow-[0_0_8px_var(--accent-cyan)]" />
                <span className="text-[12px] font-black text-[var(--accent-cyan)] uppercase tracking-widest opacity-60">Super Admin</span>
              </div>
            </div>
          </div>

          {/* Form Fields Section */}
          <div className="space-y-4 bg-white/[0.03] backdrop-blur-3xl rounded-[32px] p-6 border border-white/5">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-white/30 uppercase tracking-widest ml-1">Имя</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={handleSave}
                  className="w-full h-[56px] bg-black/40 rounded-[20px] px-5 text-[14px] font-bold text-white border border-white/5 focus:outline-none transition-colors focus:border-[var(--accent-cyan)]/40"
                  placeholder="Администратор"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-white/30 uppercase tracking-widest ml-1">Эл. почта</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={handleSave}
                  className="w-full h-[56px] bg-black/40 rounded-[20px] px-5 text-[14px] font-bold text-white border border-white/5 focus:outline-none transition-colors focus:border-[var(--accent-cyan)]/40"
                  placeholder="admin@tvelv.ru"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-white/30 uppercase tracking-widest ml-1">Телефон</label>
                <div className="w-full h-[56px] bg-black/40 rounded-[20px] px-5 flex items-center text-[14px] font-bold text-white border border-white/5 opacity-40">
                  {phone ? formatPhone(phone) : "+7 (999) 999 99-99"}
                </div>
              </div>
            </div>
          </div>

          {/* Global Orders Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-[18px] font-black font-cera text-white uppercase tracking-tight">Заказы в работе</h2>
              <button 
                onClick={() => router.push('/admin/orders')}
                className="text-[11px] font-black text-[var(--accent-cyan)] uppercase tracking-widest hover:opacity-100 transition-opacity"
              >
                Все
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {orders.length === 0 ? (
                <div className="py-16 bg-white/[0.02] border border-dashed border-white/10 rounded-[32px] flex flex-col items-center justify-center">
                  <span className="text-[var(--text-secondary)]/30 font-black text-[12px] uppercase tracking-[0.2em]">Нет активных заказов</span>
                </div>
              ) : (
                orders.slice(0, 3).map((order) => {
                  const orderNumStr = order.orderNumber ? String(order.orderNumber).split('-').pop() : order.id.slice(-4);
                  return (
                    <div
                      key={order.id}
                      onClick={() => router.push(`/admin/orders/${order.id}`)}
                      className="w-full bg-[#111] rounded-[28px] p-5 flex flex-col gap-4 active:scale-[0.98] transition-all relative overflow-hidden border border-white/5 shadow-xl"
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-1 uppercase font-cera">
                          <h3 className="text-[16px] font-bold text-white leading-tight line-clamp-1">{order.title || "Без названия"}</h3>
                          <p className="text-[11px] text-[var(--accent-cyan)] opacity-70 tracking-widest">{order.tariff || "Базовый"}</p>
                        </div>
                        <span className="text-[15px] font-bold text-white/30 font-cera tracking-tight">#{orderNumStr}</span>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="flex flex-col">
                           <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Заказчик</span>
                           <span className="text-[13px] font-bold text-white whitespace-nowrap">{order.clientPhone ? formatPhone(order.clientPhone) : "-"}</span>
                        </div>
                        <div className="text-right flex flex-col items-end">
                           <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Стоимость</span>
                           <span className="text-[15px] font-black text-[var(--accent-cyan)]">{Number(order.price).toLocaleString()} ₽</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          {/* Action Grid */}
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => router.push('/admin/users')}
              className="h-[100px] bg-white/[0.03] border border-white/5 rounded-[28px] flex flex-col items-center justify-center gap-2 active:scale-95 transition-all shadow-lg"
            >
              <Users className="w-6 h-6 text-white" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">Юзеры</span>
            </button>
            <button 
              onClick={() => router.push('/admin/settings')}
              className="h-[100px] bg-white/[0.03] border border-white/5 rounded-[28px] flex flex-col items-center justify-center gap-2 active:scale-95 transition-all shadow-lg"
            >
              <Settings className="w-6 h-6 text-white" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">Настройки</span>
            </button>
          </div>

          <button 
            onClick={() => {
              sessionStorage.removeItem("currentUserPhone");
              localStorage.removeItem("currentUserPhone");
              router.replace("/");
            }}
            className="w-full h-[56px] rounded-full border border-red-500/20 text-red-500/60 font-black text-[12px] uppercase tracking-[0.2em] active:bg-red-500/10 transition-all flex items-center justify-center gap-3"
          >
            <LogOut className="w-4 h-4" />
            Выйти из системы
          </button>
        </main>
      </div>
    </div>
  );
}
