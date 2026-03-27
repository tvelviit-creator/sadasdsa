"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getAllOrders, Order } from "@/utils/orders";

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<"ours" | "partners">("ours");

  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const phone = typeof window !== 'undefined' ? localStorage.getItem('currentUserPhone') : null;

    const fetchData = async () => {
      const list = await getAllOrders();
      const sorted = Array.isArray(list) ? list.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) : [];
      setOrders(sorted);

      // Fetch unread counts
      if (phone) {
        sorted.forEach(async (order) => {
          // Only show unread notifications for "Ours" (admin) orders
          const isOurOrder = !order.partnerName || order.partnerName.trim() === "";
          
          if (isOurOrder) {
            const res = await window.fetch(`/api/chat?orderId=${order.id}`);
            const msgs = await res.json();
            const count = msgs.filter((m: any) => {
              const mPhoneRaw = m.senderPhone;
              const mPhoneClean = mPhoneRaw === 'guest' ? 'guest' : mPhoneRaw.replace(/\D/g, '');
              const cleanPhone = phone === 'guest' ? 'guest' : phone.replace(/\D/g, '');
              return mPhoneClean !== cleanPhone && !m.isRead;
            }).length;
            setUnreadCounts(prev => ({ ...prev, [order.id]: count }));
          } else {
            setUnreadCounts(prev => ({ ...prev, [order.id]: 0 }));
          }
        });
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredOrders = orders.filter(o => {
    const isResolved = o.status === 'completed' || o.status === 'cancelled';
    if (isResolved) return false;
    
    if (activeTab === "ours") return !o.partnerName || o.partnerName.trim() === "";
    return !!o.partnerName && o.partnerName.trim() !== "";
  });

  const formatPhone = (phone: string) => {
    const cleaned = ('' + phone).replace(/\D/g, '');
    if (cleaned.length === 11) {
      return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)} ${cleaned.slice(7, 9)}-${cleaned.slice(9, 11)}`;
    }
    return phone.startsWith('+') ? phone : `+${phone}`;
  };

  return (
    <div className="min-h-screen bg-transparent text-[var(--text-primary)] font-sans flex justify-center selection:bg-[var(--accent-cyan)]/30 overflow-x-hidden md:w-full relative">
       {/* Background Architectural Grid (All Devices) */}
       <div className="fixed inset-0 z-[-1] pointer-events-none opacity-[0.03]" style={{ backgroundImage: `radial-gradient(white 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
       
       {/* Background Accents (All Devices) */}
       <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[var(--accent-cyan)]/5 blur-[120px] rounded-full pointer-events-none z-[-1]" />
       <div className="fixed bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none z-[-1]" />

      <div className="w-full relative min-h-screen flex flex-col md:pt-6 z-10 max-w-[1600px] mx-auto">
        
        {/* Desktop Header */}
        <div className="hidden md:flex flex-col w-full px-10 lg:px-14 pt-10 pb-4">
          <header className="flex flex-col md:flex-row items-center justify-between w-full bg-[var(--card-bg)] border border-[var(--border-color)] shadow-2xl rounded-[32px] px-8 py-6 relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="flex flex-col gap-1 relative z-10">
            <h1 className="text-3xl font-bold font-cera text-[var(--text-primary)]">Заказы <span className="text-[var(--accent-cyan)] opacity-60 text-xl ml-2 font-black">{filteredOrders.length}</span></h1>
            <p className="text-sm font-medium text-white/40">Управление заказами</p>
          </div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="flex bg-white/5 p-1 rounded-full border border-white/10 shadow-inner backdrop-blur-md">
              <button 
                onClick={() => setActiveTab("ours")} 
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'ours' ? 'bg-[var(--accent-cyan)] text-black shadow-[0_0_15px_rgba(26,232,232,0.3)]' : 'text-white/40 hover:text-white/80'}`}
              >
                Наши
              </button>
              <button 
                onClick={() => setActiveTab("partners")} 
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'partners' ? 'bg-[var(--accent-cyan)] text-black shadow-[0_0_15px_rgba(26,232,232,0.3)]' : 'text-white/40 hover:text-white/80'}`}
              >
                Партнеров
              </button>
            </div>
            <button 
              onClick={() => router.push('/admin/orders/add')}
              className="px-6 py-2 rounded-full text-[14px] font-bold bg-[var(--accent-cyan)] text-[#141414] transition-all hover:bg-[var(--accent-cyan)] shadow-md hover:scale-105"
            >
              + Создать
            </button>
          </div>
        </header>
      </div>

        {/* Mobile Header */}
        <header className="md:hidden fixed top-0 w-full max-w-[375px] h-[148px] bg-black/40 backdrop-blur-3xl border-b border-white/5 z-[100] px-6 flex items-end pb-[12px] transition-colors duration-300 shadow-2xl">
          <svg width="375" height="148" viewBox="0 0 375 148" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full absolute -z-10 left-0 bottom-0 pointer-events-none">
            <mask id="path-1-inside-1_1706_3260" fill="white">
              <path d="M0 0H375V148H0V0Z"/>
            </mask>
            <path d="M0 0H375V148H0V0Z" fill="transparent"/>
            <path d="M375 148V147H0V148V149H375V148Z" fill="transparent" mask="url(#path-1-inside-1_1706_3260)"/>
            
            {/* ЗАКАЗЫ Title Paths */}
            <path d="M42.92 71.172C43.64 71.524 44.2 72.012 44.6 72.636C45 73.26 45.2 73.988 45.2 74.82C45.2 75.812 44.952 76.684 44.456 77.436C43.96 78.172 43.256 78.748 42.344 79.164C41.448 79.58 40.392 79.788 39.176 79.788C37.768 79.788 36.52 79.46 35.432 78.804C34.344 78.148 33.512 77.252 32.936 76.116L35.192 74.484C36.216 76.02 37.536 76.788 39.152 76.788C39.968 76.788 40.648 76.596 41.192 76.212C41.736 75.828 42.008 75.308 42.008 74.652C42.008 74.076 41.792 73.612 41.36 73.26C40.928 72.908 40.288 72.732 39.44 72.732H37.352V70.068H39.2C39.872 70.068 40.392 69.9 40.76 69.564C41.128 69.228 41.312 68.788 41.312 68.244C41.312 67.684 41.112 67.236 40.712 66.9C40.328 66.548 39.784 66.372 39.08 66.372C37.688 66.372 36.592 67.06 35.792 68.436L33.536 66.828C34.08 65.74 34.84 64.892 35.816 64.284C36.792 63.676 37.936 63.372 39.248 63.372C40.864 63.372 42.144 63.788 43.088 64.62C44.032 65.436 44.504 66.556 44.504 67.98C44.504 68.62 44.36 69.212 44.072 69.756C43.8 70.3 43.416 70.772 42.92 71.172ZM52.5894 67.356C54.1414 67.356 55.3734 67.796 56.2854 68.676C57.2134 69.54 57.6774 70.796 57.6774 72.444V79.5H54.7014V78.348C54.2694 78.796 53.7414 79.148 53.1174 79.404C52.5094 79.66 51.8294 79.788 51.0774 79.788C49.8134 79.788 48.8134 79.46 48.0774 78.804C47.3414 78.132 46.9734 77.276 46.9734 76.236C46.9734 75.164 47.3734 74.324 48.1734 73.716C48.9894 73.092 50.0854 72.78 51.4614 72.78H54.4374V72.252C54.4374 71.596 54.2454 71.084 53.8614 70.716C53.4934 70.348 52.9494 70.164 52.2294 70.164C51.6214 70.164 51.0774 70.3 50.5974 70.572C50.1174 70.828 49.6134 71.236 49.0854 71.796L47.4054 69.804C48.7814 68.172 50.5094 67.356 52.5894 67.356ZM51.9414 77.412C52.6454 77.412 53.2374 77.196 53.7174 76.764C54.1974 76.316 54.4374 75.748 54.4374 75.06V74.916H51.8934C51.3654 74.916 50.9574 75.02 50.6694 75.228C50.3814 75.42 50.2374 75.716 50.2374 76.116C50.2374 76.516 50.3894 76.836 50.6934 77.076C51.0134 77.3 51.4294 77.412 51.9414 77.412ZM68.7875 79.5L64.0835 73.212V79.5H60.8675V67.62H64.0835V73.164L68.5715 67.62H72.2435L67.7555 73.044L72.6275 79.5H68.7875ZM79.1909 67.356C80.7429 67.356 81.9749 67.796 82.8869 68.676C83.8149 69.54 84.2789 70.796 84.2789 72.444V79.5H81.3029V78.348C80.8709 78.796 80.3429 79.148 79.7189 79.404C79.1109 79.66 78.4309 79.788 77.6789 79.788C76.4149 79.788 75.4149 79.46 74.6789 78.804C73.9429 78.132 73.5749 77.276 73.5749 76.236C73.5749 75.164 73.9749 74.324 74.7749 73.716C75.5909 73.092 76.6869 72.78 78.0629 72.78H81.0389V72.252C81.0389 71.596 80.8469 71.084 80.4629 70.716C80.0949 70.348 79.5509 70.164 78.8309 70.164C78.2229 70.164 77.6789 70.3 77.1989 70.572C76.7189 70.828 76.2149 71.236 75.6869 71.796L74.0069 69.804C75.3829 68.172 77.1109 67.356 79.1909 67.356ZM78.5429 77.412C79.2469 77.412 79.8389 77.196 80.3189 76.764C80.7989 76.316 81.0389 75.748 81.0389 75.06V74.916H78.4949C77.9669 74.916 77.5589 75.02 77.2709 75.228C76.9829 75.42 76.8389 75.716 76.8389 76.116C76.8389 76.516 76.9909 76.836 77.2949 77.076C77.6149 77.3 78.0309 77.412 78.5429 77.412ZM94.8851 73.332C95.4291 73.62 95.8451 74.004 96.1331 74.484C96.4211 74.948 96.5651 75.46 96.5651 76.02C96.5651 77.236 96.1491 78.172 95.3171 78.828C94.4851 79.468 93.2771 79.788 91.6931 79.788C89.4371 79.788 87.7331 79.044 86.5811 77.556L88.4051 75.636C89.2051 76.548 90.2371 77.004 91.5011 77.004C92.1251 77.004 92.5971 76.892 92.9171 76.668C93.2531 76.444 93.4211 76.14 93.4211 75.756C93.4211 75.404 93.2771 75.124 92.9891 74.916C92.7011 74.708 92.2851 74.604 91.7411 74.604H90.2051V72.204H91.5971C92.0131 72.204 92.3331 72.116 92.5571 71.94C92.7971 71.748 92.9171 71.492 92.9171 71.172C92.9171 70.852 92.7891 70.604 92.5331 70.428C92.2931 70.236 91.9331 70.14 91.4531 70.14C90.3171 70.14 89.3811 70.54 88.6451 71.34L86.7971 69.396C87.3571 68.74 88.0531 68.236 88.8851 67.884C89.7171 67.532 90.6371 67.356 91.6451 67.356C93.0371 67.356 94.1171 67.66 94.8851 68.268C95.6691 68.876 96.0611 69.732 96.0611 70.836C96.0611 71.86 95.6691 72.692 94.8851 73.332ZM99.2581 67.62H102.474V71.052H104.634C106.074 71.052 107.258 71.428 108.186 72.18C109.114 72.932 109.578 73.956 109.578 75.252C109.578 76.58 109.114 77.62 108.186 78.372C107.258 79.124 106.074 79.5 104.634 79.5H99.2581V67.62ZM110.922 67.62H114.138V79.5H110.922V67.62ZM104.538 76.764C105.098 76.764 105.53 76.644 105.834 76.404C106.138 76.148 106.29 75.78 106.29 75.3C106.29 74.82 106.13 74.452 105.81 74.196C105.506 73.924 105.082 73.788 104.538 73.788H102.474V76.764H104.538Z" fill="var(--text-primary)"/>

            {/* Numeric Count using Cera Pro Bold */}
            <text x="120" y="79" className="text-[24px] font-bold fill-[var(--text-primary)] opacity-20" style={{ fontFamily: 'var(--font-cera)' }}>{filteredOrders.length}</text>
            
            {/* Add Button Rect and Plus */}
            <rect x="271" y="56" width="80" height="32" rx="16" fill="var(--text-primary)"/>
            <path d="M319.485 72H311M311 72H302.515M311 72V63.5147M311 72V80.4853" stroke="var(--bg-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            
            {/* Tabs Selector Group */}
            <rect x="24.5" y="104.5" width="326" height="31" rx="15.5" stroke="rgba(255,255,255,0.1)" fill="rgba(255,255,255,0.02)"/>
            <rect 
              x={activeTab === 'ours' ? 24.5 : 188} 
              y="104.5" 
              width="162.5" 
              height="31" 
              rx="15.5" 
              stroke="var(--text-primary)"
              fill="transparent"
              className="transition-all duration-300"
            />
            
            {/* НАШИ и ПАРТНЕРОВ Text Paths (Decorative) */}
            <path d="M86.206 114.44H87.454V118.792H93.374V114.44H94.622V125H93.374V119.912H87.454V125H86.206V114.44ZM100.16 117.032C101.077 117.032 101.813 117.304 102.368 117.848C102.923 118.392 103.2 119.176 103.2 120.2V125H102.048V123.992C101.76 124.376 101.392 124.669 100.944 124.872C100.496 125.075 99.9893 125.176 99.424 125.176C98.624 125.176 97.968 124.979 97.456 124.584C96.9547 124.189 96.704 123.656 96.704 122.984C96.704 122.323 96.96 121.795 97.472 121.4C97.984 121.005 98.6613 120.808 99.504 120.808H101.968V120.136C101.968 119.496 101.797 119.011 101.456 118.68C101.125 118.339 100.667 118.168 100.08 118.168C99.6107 118.168 99.1947 118.275 98.832 118.488C98.4693 118.691 98.128 119 97.808 119.416L96.992 118.744C97.344 118.168 97.7973 117.741 98.352 117.464C98.9067 117.176 99.5093 117.032 100.16 117.032ZM99.584 124.152C100.011 124.152 100.405 124.061 100.768 123.88C101.131 123.688 101.419 123.427 101.632 123.096C101.856 122.765 101.968 122.403 101.968 122.008V121.816H99.648C99.104 121.816 98.688 121.912 98.4 122.104C98.112 122.285 97.968 122.557 97.968 122.92C97.968 123.315 98.1227 123.619 98.432 123.832C98.7413 124.045 99.1253 124.152 99.584 124.152ZM105.813 117.208H107.045V123.912H110.309V117.208H111.541V123.912H114.821V117.208H116.053V125H105.813V117.208ZM125.183 117.032V125H123.951V119.496L119.199 125.176H118.751V117.208H119.983V122.728L124.735 117.032H125.183Z" fill="var(--text-primary)"/>
            <path d="M228.706 114.44H236.962V125H235.714V115.56H229.954V125H228.706V114.44ZM242.504 117.032C243.421 117.032 244.157 117.304 244.712 117.848C245.266 118.392 245.544 119.176 245.544 120.2V125H244.392V123.992C244.104 124.376 243.736 124.669 243.288 124.872C242.84 125.075 242.333 125.176 241.768 125.176C240.968 125.176 240.312 124.979 239.8 124.584C239.298 124.189 239.048 123.656 239.048 122.984C239.048 122.323 239.304 121.795 239.816 121.4C240.328 121.005 241.005 120.808 241.848 120.808H244.312V120.136C244.312 119.496 244.141 119.011 243.8 118.68C243.469 118.339 243.01 118.168 242.424 118.168C241.954 118.168 241.538 118.275 241.176 118.488C240.813 118.691 240.472 119 240.152 119.416L239.336 118.744C239.688 118.168 240.141 117.741 240.696 117.464C241.25 117.176 241.853 117.032 242.504 117.032ZM241.928 124.152C242.354 124.152 242.749 124.061 243.112 123.88C243.474 123.688 243.762 123.427 243.976 123.096C244.2 122.765 244.312 122.403 244.312 122.008V121.816H241.992C241.448 121.816 241.032 121.912 240.744 122.104C240.456 122.285 240.312 122.557 240.312 122.92C240.312 123.315 240.466 123.619 240.776 123.832C241.085 124.045 241.469 124.152 241.928 124.152ZM252.253 117.032C252.989 117.032 253.65 117.213 254.237 117.576C254.824 117.928 255.282 118.413 255.613 119.032C255.944 119.651 256.109 120.339 256.109 121.096C256.109 121.853 255.938 122.547 255.597 123.176C255.266 123.795 254.808 124.285 254.221 124.648C253.634 125 252.978 125.176 252.253 125.176C251.677 125.176 251.133 125.064 250.621 124.84C250.12 124.605 249.709 124.285 249.389 123.88V127.88H248.157V117.208H249.309V118.456C249.608 118.008 250.018 117.661 250.541 117.416C251.074 117.16 251.645 117.032 252.253 117.032ZM252.077 124.04C252.6 124.04 253.069 123.917 253.485 123.672C253.912 123.416 254.242 123.064 254.477 122.616C254.722 122.168 254.845 121.667 254.845 121.112C254.845 120.557 254.722 120.056 254.477 119.608C254.242 119.16 253.912 118.808 253.485 118.552C253.069 118.296 252.6 118.168 252.077 118.168C251.608 118.168 251.165 118.275 250.749 118.488C250.344 118.701 250.013 119.027 249.757 119.464C249.501 119.901 249.373 120.445 249.373 121.096C249.373 121.747 249.496 122.296 249.741 122.744C249.997 123.181 250.328 123.507 250.733 123.72C251.149 123.933 251.597 124.04 252.077 124.04ZM259.725 118.312H257.101V117.208H263.565V118.312H260.941V125H259.725V118.312ZM265.266 117.208H266.498V120.312H270.322V117.208H271.554V125H270.322V121.4H266.498V125H265.266V117.208ZM281.131 121.48H274.971C275.045 122.248 275.349 122.867 275.883 123.336C276.416 123.805 277.067 124.04 277.835 124.04C278.72 124.04 279.515 123.688 280.219 122.984L280.939 123.816C280.533 124.243 280.064 124.579 279.531 124.824C279.008 125.059 278.437 125.176 277.819 125.176C277.051 125.176 276.352 125 275.723 124.648C275.093 124.285 274.597 123.795 274.235 123.176C273.872 122.557 273.691 121.869 273.691 121.112C273.691 120.365 273.867 119.683 274.219 119.064C274.571 118.435 275.051 117.939 275.659 117.576C276.267 117.213 276.939 117.032 277.675 117.032C278.336 117.032 278.939 117.181 279.483 117.48C280.027 117.779 280.453 118.195 280.763 118.728C281.072 119.261 281.227 119.869 281.227 120.552C281.227 120.851 281.195 121.16 281.131 121.48ZM277.643 118.152C276.992 118.152 276.427 118.36 275.947 118.776C275.467 119.181 275.157 119.72 275.019 120.392H279.963C279.952 119.699 279.723 119.155 279.275 118.76C278.837 118.355 278.293 118.152 277.643 118.152ZM287.487 117.032C288.223 117.032 288.885 117.213 289.471 117.576C290.058 117.928 290.517 118.413 290.847 119.032C291.178 119.651 291.343 120.339 291.343 121.096C291.343 121.853 291.173 122.547 290.831 123.176C290.501 123.795 290.042 124.285 289.455 124.648C288.869 125 288.213 125.176 287.487 125.176C286.911 125.176 286.367 125.064 285.855 124.84C285.354 124.605 284.943 124.285 284.623 123.88V127.88H283.391V117.208H284.543V118.456C284.842 118.008 285.253 117.661 285.775 117.416C286.309 117.16 286.879 117.032 287.487 117.032ZM287.311 124.04C287.834 124.04 288.303 123.917 288.719 123.672C289.146 123.416 289.477 123.064 289.711 122.616C289.957 122.168 290.079 121.667 290.079 121.112C290.079 120.557 289.957 120.056 289.711 119.608C289.477 119.16 289.146 118.808 288.719 118.552C288.303 118.296 287.834 118.168 287.311 118.168C286.842 118.168 286.399 118.275 285.983 118.488C285.578 118.701 285.247 119.027 284.991 119.464C284.735 119.901 284.607 120.445 284.607 121.096C284.607 121.747 284.73 122.296 284.975 122.744C285.231 123.181 285.562 123.507 285.967 123.72C286.383 123.933 286.831 124.04 287.311 124.04ZM297.005 125.16C296.258 125.16 295.575 124.979 294.957 124.616C294.338 124.253 293.847 123.763 293.485 123.144C293.122 122.515 292.941 121.832 292.941 121.096C292.941 120.349 293.122 119.667 293.485 119.048C293.847 118.419 294.338 117.928 294.957 117.576C295.586 117.213 296.274 117.032 297.021 117.032C297.767 117.032 298.45 117.213 299.069 117.576C299.698 117.939 300.194 118.429 300.557 119.048C300.919 119.667 301.101 120.349 301.101 121.096C301.101 121.832 300.919 122.515 300.557 123.144C300.194 123.763 299.698 124.253 299.069 124.616C298.439 124.979 297.751 125.16 297.005 125.16ZM297.005 124.024C297.527 124.024 298.002 123.896 298.429 123.64C298.866 123.384 299.207 123.037 299.453 122.6C299.709 122.152 299.837 121.656 299.837 121.112C299.837 120.557 299.714 120.056 299.469 119.608C299.223 119.16 298.882 118.808 298.445 118.552C298.018 118.296 297.543 118.168 297.021 118.168C296.487 118.168 296.007 118.296 295.581 118.552C295.154 118.808 294.818 119.16 294.573 119.608C294.327 120.056 294.205 120.557 294.205 121.112C294.205 121.656 294.327 122.152 294.573 122.6C294.818 123.037 295.154 123.384 295.581 123.64C296.007 123.896 296.482 124.024 297.005 124.024ZM308.178 120.776C308.637 120.936 308.994 121.176 309.25 121.496C309.517 121.816 309.65 122.2 309.65 122.648C309.65 123.341 309.4 123.907 308.898 124.344C308.397 124.781 307.725 125 306.882 125H303.266V117.208H306.482C307.25 117.208 307.858 117.395 308.306 117.768C308.765 118.141 308.994 118.643 308.994 119.272C308.994 119.581 308.92 119.869 308.77 120.136C308.632 120.392 308.434 120.605 308.178 120.776ZM304.498 120.392H306.498C306.925 120.392 307.245 120.301 307.458 120.12C307.672 119.928 307.778 119.667 307.778 119.336C307.778 118.653 307.352 118.312 306.498 118.312H304.498V120.392ZM306.802 123.912C307.314 123.912 307.709 123.795 307.986 123.56C308.274 123.325 308.418 123.021 308.418 122.648C308.418 122.285 308.274 122.003 307.986 121.8C307.709 121.587 307.314 121.48 306.802 121.48H304.498V123.912H306.802Z" fill="var(--text-primary)"/>
          </svg>

          {/* Interactive Regions */}
          <button 
            onClick={() => router.push('/admin/orders/add')}
            className="absolute right-[24px] top-[56px] w-[80px] h-[32px] bg-transparent border-none outline-none cursor-pointer z-[110]"
            aria-label="Add Order"
          />
          
          <div className="absolute bottom-[12.5px] left-[24.5px] w-[326px] h-[31px] flex z-[110]">
            <button 
              onClick={() => setActiveTab("ours")} 
              className="flex-1 h-full bg-transparent border-none outline-none cursor-pointer"
              aria-label="Admin Orders"
            />
            <button 
              onClick={() => setActiveTab("partners")} 
              className="flex-1 h-full bg-transparent border-none outline-none cursor-pointer"
              aria-label="Partner Orders"
            />
          </div>
        </header>

        <main className="flex-1 pt-[164px] md:pt-4 px-6 md:px-10 lg:px-14 pb-32 space-y-6 w-full">
          {filteredOrders.length === 0 ? (
            <div className="py-24 text-center opacity-10 h-full md:min-h-[50vh] flex items-center justify-center">
               <p className="text-[15px] font-black uppercase tracking-widest">Пусто</p>
            </div>
          ) : (
            <>
              {/* MOBILE CARDS - Hidden on md and up */}
              <div className="grid grid-cols-1 md:hidden gap-6">
                {filteredOrders.map((order) => (
                  <div 
                    key={order.id}
                    onClick={() => router.push(`/admin/orders/${order.id}`)}
                    className="bg-black/40 backdrop-blur-md rounded-[32px] p-6 flex flex-col justify-between active:scale-[0.98] transition-all cursor-pointer border border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative overflow-hidden group min-h-[350px]"
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                         <h3 className="text-[22px] font-bold leading-[120%] max-w-[210px] group-hover:text-[var(--accent-cyan)] transition-colors">
                           {order.title || "Без названия"}
                         </h3>
                         <span className="text-[22px] font-bold text-[var(--text-secondary)] tabular-nums flex items-center gap-2">
                           {unreadCounts[order.id] > 0 && (
                             <div className="w-[10px] h-[10px] bg-[#FF8C67] rounded-full shadow-[0_0_10px_rgba(255,140,103,1)] animate-pulse shrink-0" />
                           )}
                           №{order.orderNumber ? String(order.orderNumber).split('-').pop() : order.id.slice(-2)}
                         </span>
                      </div>

                      <div className="flex justify-between items-center h-[22px]">
                         <span className="text-[18px] font-bold text-[var(--text-secondary)] tracking-tight">{order.tariff || "Базовый"}</span>
                         <span className="text-[18px] font-bold text-[var(--text-secondary)] tabular-nums">
                           {Number(order.price || 0).toLocaleString()} ₽
                         </span>
                      </div>

                      <div className="w-full h-[1px] bg-[var(--border-color)] shrink-0" />

                      <div className="flex flex-wrap gap-2">
                         {(order.features || ["Общее"]).slice(0, 3).map((f, i) => (
                           <div key={i} className="bg-white/5 border border-white/10 px-3 py-1 rounded-full flex items-center justify-center shadow-sm">
                              <span className="text-[11px] font-medium text-[var(--text-secondary)] uppercase tracking-tighter">{f}</span>
                           </div>
                         ))}
                      </div>

                      <div className="space-y-2 pt-2">
                         {order.partnerName && (
                            <div className="flex items-center gap-1.5 h-[20px]">
                               <span className="text-[13px] text-[var(--text-secondary)] shrink-0 font-medium">Партнер</span>
                               <div className="flex-1 border-b border-dotted border-[var(--border-color)] h-[10px] opacity-50" />
                               <span className="text-[13px] font-medium text-[var(--text-primary)] text-right truncate max-w-[170px]">
                                 {order.partnerName}
                               </span>
                            </div>
                         )}
                         <div className="flex items-center gap-1.5 h-[20px]">
                            <span className="text-[13px] text-[var(--text-secondary)] shrink-0 font-medium">Заказчик</span>
                            <div className="flex-1 border-b border-dotted border-[var(--border-color)] h-[10px] opacity-50" />
                            <span className="text-[13px] font-medium text-[var(--text-primary)] text-right truncate max-w-[170px]">
                              {order.clientName || '—'}
                            </span>
                         </div>
                         <div className="flex items-center gap-1.5 h-[20px]">
                            <span className="text-[13px] text-[var(--text-secondary)] shrink-0 font-medium">Телефон</span>
                            <div className="flex-1 border-b border-dotted border-[var(--border-color)] h-[10px] opacity-50" />
                            <span className="text-[13px] font-medium text-[var(--text-primary)] text-right tabular-nums">
                              {formatPhone(order.clientPhone)}
                            </span>
                         </div>
                      </div>

                      <div className="flex gap-10 pt-2 shrink-0">
                         <div className="flex flex-col">
                            <span className="text-[12px] text-[var(--text-secondary)] font-medium">Создан</span>
                            <span className="text-[16px] font-bold text-[var(--text-primary)] mt-0.5">
                              {new Date(order.createdAt).toLocaleDateString("ru-RU")}
                            </span>
                         </div>
                         <div className="flex flex-col">
                            <span className="text-[12px] text-[var(--text-secondary)] font-medium">Обновлен</span>
                            <span className="text-[16px] font-bold text-[var(--text-primary)] mt-0.5">
                              {order.updatedAt ? new Date(order.updatedAt).toLocaleDateString("ru-RU") : new Date(order.createdAt).toLocaleDateString("ru-RU")}
                            </span>
                         </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-auto mt-4 shrink-0">
                       <div className="flex gap-[4px]">
                          {[1, 2, 3, 4, 5, 6].map((step) => {
                            const progress = order.status === 'completed' ? 6 : order.status === 'pending' ? 1 : 4;
                            return (
                                <div 
                                  key={step} 
                                  className={`h-[10px] w-[20px] sm:w-[30px] rounded-full transition-all duration-700 ${step <= progress ? 'bg-[var(--text-primary)] [html.day-theme_&]:bg-[#141414]' : 'bg-[var(--border-color)]'}`}
                                />
                            );
                          })}
                       </div>
                       <div className={`px-[12px] h-[24px] rounded-full flex items-center justify-center border border-[var(--border-color)] ${order.status === 'pending' ? 'bg-[#FFC700]' : (order.status === 'completed' || order.status === 'cancelled') ? 'bg-[#FF8C67]' : 'bg-[#4AC99B]'}`}>
                          <span className="text-[var(--bg-color)] text-[10px] font-black uppercase tracking-tight">
                            {order.status === 'pending' ? 'Ожидает' : order.status === 'completed' ? 'Готов' : order.status === 'cancelled' ? 'Отмена' : 'В работе'}
                          </span>
                       </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* DESKTOP TABLE/LIST - Hidden on mobile */}
              <div className="hidden md:flex flex-col gap-3">
                {/* Table Header */}
                <div className="flex items-center px-6 py-3 text-[12px] font-bold text-[var(--text-secondary)] uppercase tracking-wider font-cera border-b border-[var(--border-color)]/30 mb-2">
                   <div className="w-[80px]">ID</div>
                   <div className="flex-1 min-w-[200px]">Название</div>
                   <div className="w-[120px]">Тариф</div>
                   <div className="w-[160px]">Клиент</div>
                   {activeTab === 'partners' && <div className="w-[160px]">Партнер</div>}
                   <div className="w-[120px]">Сумма</div>
                   <div className="w-[120px]">Статус</div>
                   <div className="w-[100px]">Дата</div>
                </div>

                {/* Table Rows */}
                {filteredOrders.map((order) => {
                   const orderIdStr = order.orderNumber ? String(order.orderNumber).split('-').pop() : order.id.slice(-4);
                   
                   return (
                     <div 
                       key={`desktop-${order.id}`}
                       onClick={() => router.push(`/admin/orders/${order.id}`)}
                       className="flex items-center px-6 py-5 bg-[var(--card-bg)] rounded-[20px] border border-[var(--border-color)] hover:border-white/20 hover:shadow-2xl active:scale-[0.99] transition-all cursor-pointer group relative overflow-hidden"
                     >
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="w-[80px] flex items-center gap-2">
                           {unreadCounts[order.id] > 0 && <div className="w-2 h-2 rounded-full bg-[#FF8C67] shadow-[0_0_10px_rgba(255,140,103,0.8)] animate-pulse shrink-0" />}
                           <span className="text-[15px] font-bold text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">№{orderIdStr}</span>
                        </div>
                        <div className="flex-1 min-w-[200px] pr-4">
                           <h3 className="text-[16px] font-bold leading-tight group-hover:text-[var(--accent-cyan)] transition-colors line-clamp-1">{order.title || "Без названия"}</h3>
                           {order.features && order.features.length > 0 && (
                             <p className="text-[12px] text-[var(--text-secondary)] mt-1 truncate">{order.features.slice(0, 3).join(" • ")}</p>
                           )}
                        </div>
                        <div className="w-[120px]">
                           <span className="text-[14px] font-bold text-[var(--text-secondary)]">{order.tariff || "Базовый"}</span>
                        </div>
                        <div className="w-[160px] flex flex-col pr-4">
                           <span className="text-[14px] font-medium text-[var(--text-primary)] truncate">{order.clientName || '—'}</span>
                           <span className="text-[12px] text-[var(--text-secondary)] tabular-nums">{formatPhone(order.clientPhone)}</span>
                        </div>
                        {activeTab === 'partners' && (
                           <div className="w-[160px] pr-4">
                              <span className="text-[14px] font-medium text-[var(--text-primary)] truncate block">{order.partnerName || '—'}</span>
                           </div>
                        )}
                        <div className="w-[120px]">
                           <span className="text-[16px] font-bold">{Number(order.price || 0).toLocaleString()} ₽</span>
                        </div>
                        <div className="w-[120px]">
                           <div className={`inline-flex px-[12px] h-[24px] rounded-full items-center justify-center border border-[var(--border-color)] ${order.status === 'pending' ? 'bg-[#FFC700]' : (order.status === 'completed' || order.status === 'cancelled') ? 'bg-[#FF8C67]' : 'bg-[#4AC99B]'}`}>
                              <span className="text-[var(--bg-color)] text-[10px] font-black uppercase tracking-tight">
                                {order.status === 'pending' ? 'Ожидает' : order.status === 'completed' ? 'Готов' : order.status === 'cancelled' ? 'Отмена' : 'В работе'}
                              </span>
                           </div>
                        </div>
                        <div className="w-[100px] flex flex-col">
                           <span className="text-[13px] font-medium text-[var(--text-primary)]">{new Date(order.createdAt).toLocaleDateString("ru-RU")}</span>
                        </div>
                     </div>
                   );
                })}
              </div>
            </>
          )}
        </main>
      </div>

      <style jsx global>{`
        body { background-color: var(--bg-color); }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
