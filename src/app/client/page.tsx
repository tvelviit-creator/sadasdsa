"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCategories, Category } from "@/utils/categories";
import { getServices } from "@/utils/services";
import { getCurrentUserPhone, getUserData, setActiveRole, getActiveRole } from "@/utils/userData";

import { CategoryIcon } from "@/components/CategoryIcon";

export default function ClientPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [allServices, setAllServices] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [userName, setUserName] = useState("Friend");
  const [userAvatar, setUserAvatar] = useState<string | null>(null);

  useEffect(() => {
    // Force theme class application on mount just in case
    const saved = localStorage.getItem('app-theme') || 'day';
    const root = document.documentElement;
    if (saved === 'auto') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add(isDark ? 'night-theme' : 'day-theme');
    } else {
      root.classList.add(saved + '-theme');
    }
    router.prefetch("/aichat");
    
    const loadData = () => {
      const cats = getCategories();
      setCategories(cats);

      const srvs = getServices();
      setAllServices(srvs);

      setSelectedCategoryId(prev => {
        if (!prev && cats.length > 0) return cats[0].id;
        return prev;
      });
    };

    loadData();

    // Determine user data
    const phone = getCurrentUserPhone();
    if (phone) {
      const data = getUserData(phone);
      if (data?.isBlocked) {
         const isPermanent = data.blockedUntil === "permanent";
        const expiration = data.blockedUntil ? new Date(data.blockedUntil) : null;

        if (isPermanent || (expiration && new Date() < expiration)) {
          alert(isPermanent ? "Ваш аккаунт заблокирован навсегда." : `Ваш аккаунт заблокирован до ${expiration?.toLocaleDateString()}`);
          localStorage.removeItem("currentUserPhone");
          sessionStorage.removeItem("currentUserPhone");
          router.replace("/registration");
          return;
        }
      }
      if (data && data.name) setUserName(data.name);
      if (data && data.avatar) setUserAvatar(data.avatar);
    }

    // Listen for cross-tab updates
    const handleStorageChange = () => {
      loadData();
    };

    window.addEventListener("storage", handleStorageChange);
    // Custom event for same-tab updates if we emit them
    window.addEventListener("local-storage-update", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("local-storage-update", handleStorageChange);
    };
  }, [router]);

  // Handle derived filtering directly automatically on render
  const filteredServices = selectedCategoryId 
    ? allServices.filter(s => s.categoryId === selectedCategoryId)
    : allServices;

  const handleSearchSubmit = (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault();
    if (search.trim()) {
      localStorage.setItem("aiInitialQuery", search);
      router.push("/aichat");
    }
  };

  // Drag to scroll logic for desktop only
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeftState] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only enable drag on desktop (not touch devices)
    if ('ontouchstart' in window) return;
    
    setIsDragging(true);
    const container = e.currentTarget as HTMLElement;
    setStartX(e.pageX - container.offsetLeft);
    setScrollLeftState(container.scrollLeft);
    container.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const container = e.currentTarget as HTMLElement;
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed
    container.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUpOrLeave = (e: React.MouseEvent) => {
    if (isDragging) {
      const container = e.currentTarget as HTMLElement;
      container.style.cursor = 'grab';
    }
    setIsDragging(false);
  };




  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] pb-32 relative overflow-hidden animate-page-fade-in transition-colors duration-300">
      {/* Background Decor removed */}

      <header className="px-6 pt-12 pb-6 flex items-center justify-between w-full">
        {/* Greeting section */}
        <div className="flex-shrink-0">
          <svg width="112" height="28" viewBox="9 16 112 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.368 28V16.12H19.304V28H16.874V18.316H11.798V28H9.368ZM29.9464 20.224C30.7744 21.1 31.1884 22.204 31.1884 23.536C31.1884 24.868 30.7744 25.984 29.9464 26.884C29.1304 27.772 28.1044 28.216 26.8684 28.216C25.7524 28.216 24.8644 27.856 24.2044 27.136V31.24H21.7744V19.09H24.0064V20.206C24.6184 19.33 25.5724 18.892 26.8684 18.892C28.1044 18.892 29.1304 19.336 29.9464 20.224ZM28.7224 23.554C28.7224 22.822 28.5064 22.228 28.0744 21.772C27.6424 21.316 27.0904 21.088 26.4184 21.088C25.7704 21.088 25.2304 21.304 24.7984 21.736C24.3784 22.168 24.1684 22.768 24.1684 23.536C24.1684 24.304 24.3784 24.91 24.7984 25.354C25.2304 25.786 25.7704 26.002 26.4184 26.002C27.0784 26.002 27.6244 25.774 28.0564 25.318C28.5004 24.862 28.7224 24.274 28.7224 23.554ZM40.5467 18.892H41.3387V28H38.9087V23.176L33.9407 28.216H33.1487V19.09H35.5607V23.95L40.5467 18.892ZM51.7918 25.282C51.7918 26.074 51.4858 26.728 50.8738 27.244C50.2738 27.748 49.5118 28 48.5878 28H43.8538V19.09H47.9938C48.9178 19.09 49.6678 19.318 50.2438 19.774C50.8318 20.23 51.1258 20.836 51.1258 21.592C51.1258 22.24 50.8858 22.786 50.4058 23.23C51.3298 23.638 51.7918 24.322 51.7918 25.282ZM46.1578 20.908V22.564H47.8498C48.5698 22.564 48.9298 22.288 48.9298 21.736C48.9298 21.184 48.5698 20.908 47.8498 20.908H46.1578ZM49.2178 25.93C49.4458 25.75 49.5598 25.51 49.5598 25.21C49.5598 24.91 49.4458 24.676 49.2178 24.508C49.0018 24.34 48.7018 24.256 48.3178 24.256H46.1578V26.2H48.3178C48.7018 26.2 49.0018 26.11 49.2178 25.93ZM61.939 24.364H55.693C55.837 24.928 56.125 25.366 56.557 25.678C57.001 25.978 57.547 26.128 58.195 26.128C59.071 26.128 59.899 25.828 60.679 25.228L61.687 26.884C60.619 27.772 59.431 28.216 58.123 28.216C56.755 28.24 55.591 27.796 54.631 26.884C53.683 25.96 53.221 24.85 53.245 23.554C53.221 22.27 53.671 21.166 54.595 20.242C55.519 19.318 56.623 18.868 57.907 18.892C59.131 18.892 60.133 19.288 60.913 20.08C61.705 20.872 62.101 21.856 62.101 23.032C62.101 23.464 62.047 23.908 61.939 24.364ZM55.693 22.654H59.743C59.731 22.114 59.539 21.682 59.167 21.358C58.807 21.022 58.357 20.854 57.817 20.854C57.301 20.854 56.851 21.016 56.467 21.34C56.083 21.664 55.825 22.102 55.693 22.654ZM65.6208 28V21.142H62.8848V19.09H70.7868V21.142H68.0328V28H65.6208ZM73.1592 23.644L72.6912 16.12H75.5892L75.1392 23.644H73.1592ZM72.4932 26.542C72.4932 26.074 72.6492 25.678 72.9612 25.354C73.2852 25.03 73.6932 24.868 74.1852 24.868C74.6532 24.868 75.0432 25.03 75.3552 25.354C75.6792 25.678 75.8412 26.074 75.8412 26.542C75.8412 27.022 75.6792 27.424 75.3552 27.748C75.0432 28.06 74.6532 28.216 74.1852 28.216C73.6932 28.216 73.2852 28.06 72.9612 27.748C72.6492 27.424 72.4932 27.022 72.4932 26.542Z" fill="var(--text-primary)" className="transition-colors duration-300" />
          </svg>
        </div>

        {/* Icons section */}
        <div className="flex items-center gap-2">

          <button onClick={() => {
            const role = getActiveRole();
            router.push(role === 'seller' ? "/lkseller" : "/profile");
          }} className="w-[43px] h-[43px] rounded-full border border-[var(--border-color)] flex items-center justify-center overflow-hidden transition-all active:scale-95 transition-colors duration-300">
            {userAvatar ? (
              <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <svg width="18" height="18" viewBox="297 13 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M313 31C313 28.2386 309.418 26 305 26C300.582 26 297 28.2386 297 31M305 23C302.239 23 300 20.7614 300 18C300 15.2386 302.239 13 305 13C307.761 13 310 15.2386 310 18C310 20.7614 307.761 23 305 23Z" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Search Input - Improved dynamic highlighting matching SVG */}
      <div className="px-6 mb-10">
        <div className="flex items-center gap-2 h-[44px] w-full group">
          {/* Input Pill */}
          <div 
            className={`flex-1 bg-[var(--nav-bg)] rounded-full h-full flex items-center px-5 border transition-all duration-300 ${
              search.trim() || isFocused ? 'border-[var(--text-secondary)]' : 'border-[var(--border-color)]'
            }`}
          >
            <form onSubmit={handleSearchSubmit} className="flex-1">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSearchSubmit(e);
                  }
                }}
                placeholder="Спросить Твэлви"
                className="w-full bg-transparent text-[16px] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] outline-none"
              />
            </form>
          </div>

          {/* Action Pill - Highlighting from SVG */}
          <button
            onClick={handleSearchSubmit}
            disabled={!search.trim()}
            className={`w-[44px] h-[44px] rounded-full flex items-center justify-center transition-all shrink-0 active:scale-95 ${
              search.trim() ? 'bg-[var(--nav-btn)]' : 'bg-[var(--nav-bg)]'
            }`}
          >
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
              <path 
                d="M22 30V14M22 14L15.5 20.8571M22 14L28.5 20.8571" 
                stroke="var(--text-primary)" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className={`transition-opacity duration-300 ${search.trim() ? 'opacity-100' : 'opacity-40'}`}
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="px-6 mb-4">
          <div className="flex items-center justify-between h-8 relative w-full">
            <svg width="327" height="32" viewBox="9 0 327 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
              <path d="M16.892 22L11.798 15.808V22H9.368V10.12H11.798V15.628L16.334 10.12H19.232L14.678 15.718L19.826 22H16.892ZM24.6549 12.892C25.8189 12.892 26.7429 13.222 27.4269 13.882C28.1229 14.53 28.4709 15.472 28.4709 16.708V22H26.2389V21.136C25.9149 21.472 25.5189 21.736 25.0509 21.928C24.5949 22.12 24.0849 22.216 23.5209 22.216C22.5729 22.216 21.8229 21.97 21.2709 21.478C20.7189 20.974 20.4429 20.332 20.4429 19.552C20.4429 18.748 20.7429 18.118 21.3429 17.662C21.9549 17.194 22.7769 16.96 23.8089 16.96H26.0409V16.564C26.0409 16.072 25.8969 15.688 25.6089 15.412C25.3329 15.136 24.9249 14.998 24.3849 14.998C23.9289 14.998 23.5209 15.1 23.1609 15.304C22.8009 15.496 22.4229 15.802 22.0269 16.222L20.7669 14.728C21.7989 13.504 23.0949 12.892 24.6549 12.892ZM24.1689 20.434C24.6969 20.434 25.1409 20.272 25.5009 19.948C25.8609 19.612 26.0409 19.186 26.0409 18.67V18.562H24.1329C23.7369 18.562 23.4309 18.64 23.2149 18.796C22.9989 18.94 22.8909 19.162 22.8909 19.462C22.8909 19.762 23.0049 20.002 23.2329 20.182C23.4729 20.35 23.7849 20.434 24.1689 20.434ZM32.4157 15.142H29.6797V13.09H37.5817V15.142H34.8277V22H32.4157V15.142ZM47.2261 18.364H40.9801C41.1241 18.928 41.4121 19.366 41.8441 19.678C42.2881 19.978 42.8341 20.128 43.4821 20.128C44.3581 20.128 45.1861 19.828 45.9661 19.228L46.9741 20.884C45.9181 21.772 44.7301 22.216 43.4101 22.216C42.4861 22.216 41.6521 22.012 40.9081 21.604C40.1641 21.196 39.5821 20.638 39.1621 19.93C38.7421 19.21 38.5321 18.418 38.5321 17.554C38.5321 16.69 38.7361 15.904 39.1441 15.196C39.5521 14.476 40.1101 13.912 40.8181 13.504C41.5381 13.096 42.3301 12.892 43.1941 12.892C44.0101 12.892 44.7361 13.078 45.3721 13.45C46.0081 13.81 46.5001 14.308 46.8481 14.944C47.2081 15.568 47.3881 16.264 47.3881 17.032C47.3881 17.464 47.3341 17.908 47.2261 18.364ZM43.1041 14.854C42.5881 14.854 42.1381 15.016 41.7541 15.34C41.3701 15.664 41.1121 16.102 40.9801 16.654H45.0301C45.0181 16.114 44.8261 15.682 44.4541 15.358C44.0821 15.016 43.6321 14.854 43.1041 14.854ZM49.3381 13.09H55.8901V15.142H51.7501V22H49.3381V13.09ZM61.4423 22.198C60.5663 22.198 59.7623 21.994 59.0303 21.586C58.3103 21.166 57.7403 20.602 57.3203 19.894C56.9003 19.174 56.6903 18.388 56.6903 17.536C56.6903 16.684 56.9003 15.904 57.3203 15.196C57.7403 14.476 58.3163 13.912 59.0483 13.504C59.7803 13.096 60.5843 12.892 61.4603 12.892C62.3363 12.892 63.1403 13.102 63.8723 13.522C64.6043 13.93 65.1803 14.488 65.6003 15.196C66.0323 15.904 66.2483 16.684 66.2483 17.536C66.2483 18.388 66.0323 19.174 65.6003 19.894C65.1803 20.602 64.5983 21.166 63.8543 21.586C63.1223 21.994 62.3183 22.198 61.4423 22.198ZM61.4603 19.966C62.1203 19.966 62.6663 19.738 63.0983 19.282C63.5423 18.826 63.7643 18.25 63.7643 17.554C63.7643 16.858 63.5423 16.276 63.0983 15.808C62.6663 15.34 62.1203 15.106 61.4603 15.106C60.7883 15.106 60.2363 15.34 59.8043 15.808C59.3723 16.264 59.1563 16.846 59.1563 17.554C59.1563 18.25 59.3723 18.826 59.8043 19.282C60.2363 19.738 60.7883 19.966 61.4603 19.966ZM73.2395 12.892C74.0675 12.892 74.8055 13.096 75.4535 13.504C76.1135 13.9 76.6295 14.452 77.0015 15.16C77.3735 15.856 77.5595 16.648 77.5595 17.536C77.5595 18.424 77.3735 19.222 77.0015 19.93C76.6295 20.638 76.1135 21.196 75.4535 21.604C74.8055 22.012 74.0675 22.216 73.2395 22.216C72.6995 22.216 72.2015 22.126 71.7455 21.946C71.2895 21.754 70.8995 21.484 70.5755 21.136V25.24H68.1455V13.09H70.3775V14.206C70.6775 13.786 71.0735 13.462 71.5655 13.234C72.0695 13.006 72.6275 12.892 73.2395 12.892ZM72.7895 20.002C73.4375 20.002 73.9835 19.78 74.4275 19.336C74.8715 18.88 75.0935 18.286 75.0935 17.554C75.0935 16.81 74.8715 16.216 74.4275 15.772C73.9955 15.316 73.4495 15.088 72.7895 15.088C72.1775 15.088 71.6495 15.298 71.2055 15.718C70.7615 16.126 70.5395 16.732 70.5395 17.536C70.5395 18.328 70.7555 18.94 71.1875 19.372C71.6315 19.792 72.1655 20.002 72.7895 20.002ZM87.7098 12.892V22H85.2798V17.176L80.3118 22.216H79.5198V13.09H81.9318V17.95L86.9178 12.892H87.7098ZM98.4148 12.892V22H95.9848V17.176L91.0168 22.216H90.2248V13.09H92.6368V17.95L97.6228 12.892H98.4148" fill="var(--text-secondary)"/>
              {/* ЕЩЕ кнопка */}
              <g onClick={() => router.push("/catigoriy")} className="cursor-pointer">
                <rect x="270.5" y="0.5" width="56" height="31" rx="15.5" stroke="var(--border-color)" fill="transparent" />
                <path d="M283.427 20.5V9.94H290.531V11.892H285.587V14.036H289.219V15.876H285.587V18.548H290.723V20.5H283.427ZM303.271 22.756V20.5H292.503V12.58H294.647V18.676H297.191V12.58H299.335V18.676H301.879V12.58H304.023V18.676H305.319V22.756H303.271ZM314.032 17.268H308.48C308.608 17.7693 308.864 18.1587 309.248 18.436C309.642 18.7027 310.128 18.836 310.704 18.836C311.482 18.836 312.218 18.5693 312.912 18.036L313.808 19.508C312.858 20.2973 311.802 20.692 310.64 20.692C309.424 20.7133 308.389 20.3187 307.536 19.508C306.693 18.6867 306.282 17.7 306.304 16.548C306.282 15.4067 306.682 14.4253 307.504 13.604C308.325 12.7827 309.306 12.3827 310.448 12.404C311.536 12.404 312.426 12.756 313.12 13.46C313.824 14.164 314.176 15.0387 314.176 16.084C314.176 16.468 314.128 16.8627 314.032 17.268ZM308.48 15.748H312.08C312.069 15.268 311.898 14.884 311.568 14.596C311.248 14.2973 310.848 14.148 310.368 14.148C309.909 14.148 309.509 14.292 309.168 14.58C308.826 14.868 308.597 15.2573 308.48 15.748Z" fill="var(--text-primary)" />
              </g>
            </svg>
          </div>
        </div>
        <div
          className="flex overflow-x-auto gap-9 px-6 hide-scrollbar select-none cursor-grab"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
        >
          {categories.map((cat, index) => {
            const isActive = selectedCategoryId === cat.id;
            return (
              <button 
                key={cat.id} 
                onClick={() => setSelectedCategoryId(cat.id)} 
                className="flex flex-col items-center justify-start gap-[5px] active:scale-95 transition-all duration-200 shrink-0 px-1"
                style={{ minWidth: '60px', maxWidth: '80px' }}
              >
                <div className="w-[52px] h-[52px] pointer-events-none">
                  <CategoryIcon name={cat.name} isActive={isActive} iconImage={cat.iconImage} />
                </div>
                <span className={`text-[11px] font-bold text-center leading-tight uppercase tracking-[0.05em] transition-colors duration-300 ${isActive ? 'text-[var(--accent-cyan)]' : 'text-[var(--text-primary)]'}`}>
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Services Grid */}
      <div className="px-6">
        <div className="mb-4">
          <svg width="90" height="18" viewBox="8.3 5 70 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.838 5.12H19.43L15.38 14.012C14.816 15.188 14.276 16.01 13.76 16.478C13.244 16.934 12.476 17.174 11.456 17.198C11.012 17.198 10.562 17.132 10.106 17V14.93C10.406 14.966 10.724 14.984 11.06 14.984C11.78 14.984 12.338 14.732 12.734 14.228L8.306 5.12H11.024L14.048 11.582L16.838 5.12ZM19.3016 12.536C19.3016 11.24 19.7636 10.142 20.6876 9.242C21.6116 8.342 22.7396 7.892 24.0716 7.892C25.8236 7.892 27.1136 8.624 27.9416 10.088L26.2496 11.402C25.6496 10.538 24.9356 10.106 24.1076 10.106C23.4236 10.106 22.8596 10.34 22.4156 10.808C21.9836 11.264 21.7676 11.84 21.7676 12.536C21.7676 13.244 21.9836 13.832 22.4156 14.3C22.8596 14.756 23.4236 14.984 24.1076 14.984C24.9356 14.984 25.6496 14.558 26.2496 13.706L27.9416 15.002C27.5456 15.698 27.0116 16.244 26.3396 16.64C25.6796 17.024 24.9236 17.216 24.0716 17.216C22.7636 17.24 21.6356 16.79 20.6876 15.866C19.7396 14.93 19.2776 13.82 19.3016 12.536ZM30.5293 8.09H37.6033V17H35.1913V10.142H32.7973L32.7793 10.826C32.7193 13.142 32.4613 14.774 32.0053 15.722C31.5613 16.658 30.7873 17.138 29.6833 17.162C29.3473 17.162 29.0413 17.108 28.7653 17V15.002C28.8853 15.026 28.9993 15.038 29.1073 15.038C29.5993 15.038 29.9473 14.672 30.1513 13.94C30.3673 13.208 30.4873 11.966 30.5113 10.214L30.5293 8.09ZM46.1572 8.09H48.7132L44.4472 17.774C44.0392 18.698 43.5532 19.376 42.9892 19.808C42.4252 20.24 41.7292 20.456 40.9012 20.456C40.3972 20.456 39.8752 20.384 39.3352 20.24V18.206C39.8272 18.254 40.1752 18.278 40.3792 18.278C40.8352 18.278 41.2072 18.188 41.4952 18.008C41.7832 17.828 42.0292 17.516 42.2332 17.072L42.5032 16.46L39.0832 8.09H41.6572L43.8352 13.94L46.1572 8.09ZM50.1819 17V8.09H56.7339V10.142H52.5939V17H50.1819ZM65.7361 7.892H66.5281V17H64.0981V12.176L59.1301 17.216H58.3381V8.09H60.7501V12.95L65.7361 7.892Z" fill="var(--text-secondary)"/>
          </svg>
        </div>
        {filteredServices.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-[14px] text-[var(--text-secondary)] font-medium">Услуг в этой категории пока нет</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-[19px] gap-y-10">
            {filteredServices.map((service) => (
              <div key={service.id} className="flex flex-col group cursor-pointer" onClick={() => router.push(`/tarif?id=${service.id}`)}>
                {/* Image Container matches SVG 153.5x159 */}
                <div className="w-full aspect-[153.5/159] rounded-[23.5px] overflow-hidden bg-[var(--card-bg)] mb-4 relative border border-[var(--border-color)] transition-colors duration-300">
                  <img src={service.coverImage || service.image} alt={service.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  
                  {/* Partner Badge - Matching SVG exact style */}
                  {(service.id === 'foodtech' || !!service.partnerName) && (
                    <div className="absolute top-2.5 right-2.5 h-[24px] min-w-[76px] px-3 bg-[var(--bg-color)] flex items-center justify-center rounded-full transition-colors duration-300 shadow-sm border border-[var(--border-color)]">
                      <span className="text-[11px] font-medium text-[var(--text-primary)] whitespace-nowrap pt-[1px]">Партнер</span>
                    </div>
                  )}
                </div>
                
                {/* Text elements match SVG labels */}
                <div className="flex flex-col gap-1.5 pl-1">
                  <h3 className="text-[14px] font-bold text-[var(--text-primary)] leading-tight line-clamp-2 transition-colors duration-300">
                    {service.name || service.title}
                  </h3>
                  <p className="text-[13px] text-[var(--text-secondary)] font-medium uppercase tracking-[0.05em] transition-colors duration-300">
                    от {Number(service.price).toLocaleString('ru-RU')} ₽
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>


    </div>
  );
}