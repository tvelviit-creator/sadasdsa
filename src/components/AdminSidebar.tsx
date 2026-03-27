"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, Users, ShoppingBag, List, Settings, LogOut, ArrowLeft } from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    sessionStorage.removeItem("currentUserPhone");
    localStorage.removeItem("currentUserPhone");
    router.replace("/");
  };

  const menuItems = [
    { name: "ЛК Админа", path: "/admin", icon: <User className="w-5 h-5 shrink-0" />, exact: true },
    { name: "Пользователи", path: "/admin/users", icon: <Users className="w-5 h-5 shrink-0" /> },
    { name: "Заказы", path: "/admin/orders", icon: <ShoppingBag className="w-5 h-5 shrink-0" /> },
    { name: "Категории и Услуги", path: "/admin/categories", icon: <List className="w-5 h-5 shrink-0" /> },
    { name: "Настройки и Поддержка", path: "/admin/settings", icon: <Settings className="w-5 h-5 shrink-0" /> },
  ];

  return (
    <div className="hidden md:flex flex-col w-[280px] min-h-screen bg-[#111111] border-r border-[#222222] p-6 py-8 fixed left-0 top-0 z-[100] h-full overflow-y-auto">
      <div className="flex items-center gap-4 mb-12 pl-2 cursor-pointer" onClick={() => router.push('/admin')}>
         <div className="w-12 h-12 bg-white rounded-[16px] flex items-center justify-center text-black font-black text-2xl font-cera shadow-[0_0_20px_rgba(255,255,255,0.2)]">
           A
         </div>
         <div className="flex flex-col">
            <span className="text-[20px] font-black text-white font-cera leading-none tracking-tight">ADMIN</span>
            <span className="text-[10px] font-bold text-[#888888] tracking-[0.2em] uppercase mt-1">Panel</span>
         </div>
      </div>

      <nav className="flex flex-col gap-2.5 flex-1">
        {menuItems.map((item) => {
           const isActive = item.exact ? pathname === item.path : pathname.startsWith(item.path);
           
           return (
             <Link 
                href={item.path} 
                key={item.path}
                className={`flex items-center gap-3.5 px-4 py-3.5 rounded-[16px] transition-all duration-300 font-bold text-[14px] ${isActive ? 'bg-[#92FFF4] text-black shadow-[0_0_20px_rgba(146,255,244,0.15)] scale-[1.02]' : 'text-[#888888] hover:bg-[#222222] hover:text-white hover:scale-[1.02]'}`}
             >
                {item.icon}
                {item.name}
             </Link>
           );
        })}
      </nav>

      <div className="mt-8 flex flex-col gap-2 border-t border-[#222222] pt-8">
         <button 
           onClick={() => router.push('/client')}
           className="flex items-center gap-3.5 px-4 py-3.5 rounded-[16px] transition-all duration-300 font-bold text-[14px] text-white opacity-60 hover:opacity-100 hover:bg-[#222222]"
         >
            <ArrowLeft className="w-5 h-5 shrink-0" />
            К сайту
         </button>
         <button 
           onClick={handleLogout}
           className="flex items-center gap-3.5 px-4 py-3.5 rounded-[16px] transition-all duration-300 font-bold text-[14px] text-[#FF8C67] opacity-60 hover:opacity-100 hover:bg-[#FF8C67]/10"
         >
            <LogOut className="w-5 h-5 shrink-0" />
            Выйти
         </button>
      </div>
    </div>
  );
}
