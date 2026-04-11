"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { saveOrder, Order } from "@/utils/orders";
import { getServices, Service, Tariff, Design } from "@/utils/services";
import { getAllUsers, UserData } from "@/utils/userData";

export default function AdminAddOrderPage() {
    const router = useRouter();

    // Data
    const [services, setServices] = useState<Service[]>([]);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [allUsers, setAllUsers] = useState<UserData[]>([]);

    // Order Info
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("0");
    const [status, setStatus] = useState<Order["status"]>("in_progress");
    const [stage, setStage] = useState<Order["stage"]>("processing");
    const [tariff, setTariff] = useState("Базовый");
    
    // Client & Partner
    const [clientPhone, setClientPhone] = useState("");
    const [clientName, setClientName] = useState("");
    const [clientEmail, setClientEmail] = useState("");
    const [sellerPhone, setSellerPhone] = useState("");
    const [partnerName, setPartnerName] = useState("");

    // Features
    const [features, setFeatures] = useState<string[]>([]);
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        const allServices = getServices();
        setServices(allServices);
        
        const init = async () => {
          const users = await getAllUsers();
          setAllUsers(users);
        };
        init();
    }, []);

    const handleServiceSelect = (serviceId: string) => {
        const service = services.find(s => s.id === serviceId);
        if (service) {
            setSelectedService(service);
            setTitle(service.name);
            setSellerPhone(service.sellerPhone || "");
            setPartnerName(service.partnerName || "");
            
            if (service.tariffs.length > 0) {
                handleTariffSelect(service.tariffs[0], service);
            }
        } else {
            setSelectedService(null);
        }
    };

    const handleTariffSelect = (t: Tariff, s: Service | null = selectedService) => {
        setTariff(t.name);
        setFeatures(t.features.map(f => f.text));
        const tPrice = Number(t.price.replace(/\s/g, '')) || 0;
        setPrice(prev => {
            if (prev === "0") return tPrice.toString();
            return prev;
        });
    };

    const handleCustomerSelect = (phone: string) => {
        const user = allUsers.find(u => u.phone === phone);
        if (user) {
            setClientPhone(user.phone);
            setClientName(user.name || "");
            setClientEmail(user.email || "");
        }
    };

    const handleSellerSelect = (phone: string) => {
        const user = allUsers.find(u => u.phone === phone);
        if (user) {
            setSellerPhone(user.phone);
            setPartnerName(user.name || "");
        }
    };

    const addFeature = () => {
        setFeatures([...features, ""]);
    };

    const removeFeature = (index: number) => {
        setFeatures(features.filter((_, i) => i !== index));
    };

    const parsePrice = (val: string) => Number(String(val).replace(/\s/g, '')) || 0;

    const isFormValid = title.trim() !== "" && clientPhone.trim() !== "" && sellerPhone.trim() !== "";

    const handleSubmit = async () => {
        if (!isFormValid || isAdding) return;
        setIsAdding(true);
        try {
            const currentPrice = parsePrice(price);

            const newOrder: Order = {
                id: `ord_${Date.now()}`,
                orderNumber: Math.floor(1000 + Math.random() * 9000),
                title,
                tariff: tariff || "Индивидуальный",
                price: currentPrice,
                status,
                stage,
                createdAt: new Date().toISOString(),
                clientPhone,
                clientName,
                clientEmail,
                sellerPhone,
                partnerName,
                features,
            };

            await saveOrder(newOrder);
            router.push("/admin/orders");
        } catch (err) {
            console.error(err);
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <div className="add-order-page min-h-screen bg-[#141414] text-white flex justify-center selection:bg-[#FF8C67]/30 overflow-x-hidden">
            <div className="w-full max-w-[375px] flex flex-col items-center">
                
                {/* Header SVG */}
                <header className="fixed top-0 w-full max-w-[375px] h-[102px] z-[100] left-1/2 -translate-x-1/2">
                    <svg width="375" height="102" viewBox="0 0 375 102" fill="none" className="w-full h-full">
                        <mask id="path-1-inside-1_2008_7733" fill="white">
                            <path d="M0 0H375V102H0V0Z"/>
                        </mask>
                        <path d="M0 0H375V102H0V0Z" fill="#141414"/>
                        <path d="M375 102V101H0V102V103H375V102Z" fill="#404040" mask="url(#path-1-inside-1_2008_7733)"/>
                        
                        <g className="cursor-pointer" onClick={() => router.back()}>
                            <rect x="20" y="55" width="40" height="40" fill="transparent" />
                            <path d="M51 72L29 72M29 72L38.4286 81M29 72L38.4286 63" stroke="#F5F5F5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </g>

                        <text 
                            x="50%" 
                            y="76" 
                            textAnchor="middle" 
                            fill="#F5F5F5" 
                            style={{ fontSize: '20px', fontWeight: 'bold', fontFamily: 'Cera Pro, sans-serif' }}
                        >
                            Создать заказ
                        </text>
                    </svg>
                </header>

                <main className="w-full pt-[124px] pb-32 px-6 flex flex-col gap-6 animate-fade">
                    
                    {/* NAME FIELD */}
                    <div className="space-y-2">
                        <p className="text-[16px] font-normal text-[#F5F5F5] ml-1" style={{ fontFamily: 'var(--font-cera)', lineHeight: '24px' }}>Название</p>
                        <div className="w-full h-[56px] bg-[#313131] rounded-[16px] flex items-center px-6 border border-white/5">
                            <input 
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                className="w-full bg-transparent border-none outline-none text-[16px] font-normal text-[#F5F5F5] placeholder-white/20"
                                style={{ fontFamily: 'var(--font-cera)', lineHeight: '24px' }}
                                placeholder="Фудтех приложение"
                            />
                        </div>
                    </div>

                    {/* PRICE FIELD */}
                    <div className="space-y-2">
                        <p className="text-[16px] font-normal text-[#F5F5F5] ml-1" style={{ fontFamily: 'var(--font-cera)', lineHeight: '24px' }}>Стоимость</p>
                        <div className="w-full h-[56px] bg-[#313131] rounded-[16px] flex items-center px-6 border border-white/5">
                            <input 
                                value={price}
                                onChange={e => setPrice(e.target.value)}
                                className="w-full bg-transparent border-none outline-none text-[16px] font-normal text-[#F5F5F5] tabular-nums"
                                style={{ fontFamily: 'var(--font-cera)', lineHeight: '24px' }}
                                placeholder="250 000"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p className="text-[16px] font-normal text-[#F5F5F5] ml-1" style={{ fontFamily: 'var(--font-cera)', lineHeight: '24px' }}>Статус</p>
                        <div className="w-[327px] h-[32px] rounded-full border border-[#313131] flex p-0 relative overflow-hidden">
                            {(['in_progress', 'pending', 'cancelled'] as const).map((s) => {
                                const isActive = status === s;
                                const label = s === 'in_progress' ? 'В работе' : s === 'pending' ? 'Ожидает' : 'Остановлен';
                                const activeBg = s === 'in_progress' ? '#4AC99B' : s === 'pending' ? '#FFC700' : '#FF8C67';
                                return (
                                    <div key={s} className="flex-1 h-full relative z-10">
                                        {isActive && (
                                            <div 
                                                className="absolute inset-[0px] rounded-full border border-[#F5F5F5] z-0 transition-all duration-300" 
                                                style={{ backgroundColor: activeBg }}
                                            />
                                        )}
                                        <button 
                                            onClick={() => setStatus(s)}
                                            className={`relative z-10 w-full h-full text-[12px] font-bold transition-all duration-300 ${isActive ? 'text-[#141414]' : 'text-white/40'}`}
                                        >
                                            {label}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* STAGE SELECTOR (Pill Style from SVG) */}
                    <div className="space-y-2">
                        <p className="text-[16px] font-normal text-[#F5F5F5] ml-1" style={{ fontFamily: 'var(--font-cera)', lineHeight: '24px' }}>Этап</p>
                        <div className="w-[327px] h-[32px] rounded-full border border-[#313131] flex p-0 relative overflow-hidden">
                            {(['processing', 'design', 'development', 'test', 'ready'] as const).map((s) => {
                                const isActive = stage === s;
                                const label = s === 'processing' ? 'Обраб.' : s === 'design' ? 'Дизайн' : s === 'development' ? 'Разраб.' : s === 'test' ? 'Тест.' : 'Готов';
                                return (
                                    <button 
                                        key={s}
                                        onClick={() => setStage(s)}
                                        className={`flex-1 h-full text-[10px] font-bold transition-all relative z-10 flex items-center justify-center ${isActive ? 'text-white border border-[#F5F5F5] rounded-full' : 'text-white/20'}`}
                                    >
                                        {label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* TARIFF / PACKAGE (Pill Style from SVG) */}
                    <div className="space-y-2">
                        <div className="w-[327px] h-[24px] flex items-center">
                            <svg width="327" height="24" viewBox="0 0 327 24" fill="none">
                                <path d="M9.456 6.44H17.712V17H16.464V7.56H10.704V17H9.456V6.44ZM23.2538 9.032..." fill="#F5F5F5"/>
                                {/* Path truncated for brevity in thoughts, but full in code */}
                                <path d="M9.456 6.44H17.712V17H16.464V7.56H10.704V17H9.456V6.44ZM23.2538 9.032C24.1711 9.032 24.9071 9.304 25.4618 9.848C26.0164 10.392 26.2938 11.176 26.2938 12.2V17H25.1418V15.992C24.8538 16.376 24.4858 16.6693 24.0378 16.872C23.5898 17.0747 23.0831 17.176 22.5178 17.176C21.7178 17.176 21.0618 16.9787 20.5498 16.584C20.0484 16.1893 19.7978 15.656 19.7978 14.984C19.7978 14.3227 20.0538 13.7947 20.5658 13.4C21.0778 13.0053 21.7551 12.808 22.5978 12.808H25.0618V12.136C25.0618 11.496 24.8911 11.0107 24.5498 10.68C24.2191 10.3387 23.7604 10.168 23.1738 10.168C22.7044 10.168 22.2884 10.2747 21.9258 10.488C21.5631 10.6907 21.2218 11 20.9018 11.416L20.0858 10.744C20.4378 10.168 20.8911 9.74133 21.4457 9.464C22.0004 9.176 22.6031 9.032 23.2538 9.032ZM22.6778 16.152C23.1044 16.152 23.4991 16.0613 23.8618 15.88C24.2244 15.688 24.5124 15.4267 24.7258 15.096C24.9498 14.7653 25.0618 14.4027 25.0618 14.008V13.816H22.7418C22.1978 13.816 21.7818 13.912 21.4938 14.104C21.2058 14.2853 21.0618 14.5573 21.0618 14.92C21.0618 15.3147 21.2164 15.6187 21.5258 15.832C21.8351 16.0453 22.2191 16.152 22.6778 16.152ZM28.9069 9.208H30.1389V17H28.9069V9.208ZM35.4669 17H33.9149L30.2989 12.776L33.5789 9.208H35.1149L31.8029 12.744L35.4669 17ZM43.7869 13.48H37.6269C37.7015 14.248 38.0055 14.8667 38.5389 15.336C39.0722 15.8053 39.7229 16.04 40.4909 16.04C41.3762 16.04 42.1709 15.688 42.8749 14.984L43.5949 15.816C43.1895 16.2427 42.7202 16.5787 42.1869 16.824C41.6642 17.0587 41.0935 17.176 40.4749 17.176C39.7069 17.176 39.0082 17 38.3789 16.648C37.7495 16.2853 37.2535 15.7947 36.8909 15.176C36.5282 14.5573 36.3469 13.8693 36.3469 13.112C36.3469 12.3653 36.5229 11.6827 36.8749 11.064C37.2269 10.4347 37.7069 9.93867 38.3149 9.576C38.9229 9.21333 39.5949 9.032 40.3309 9.032C40.9922 9.032 41.5949 9.18133 42.1389 9.48C42.6829 9.77867 43.1095 10.1947 43.4189 10.728C43.7282 11.2613 43.8829 11.8693 43.8829 12.552C43.8829 12.8507 43.8509 13.16 43.7869 13.48ZM40.2989 10.152C39.6482 10.152 39.0829 10.36 38.6029 10.776C38.1229 11.1813 37.8135 11.72 37.6749 12.392H42.6189C42.6082 11.6987 42.3789 11.1547 41.9309 10.76C41.4935 10.3547 40.9495 10.152 40.2989 10.152ZM47.5065 10.312H44.8825V9.208H51.3465V10.312H48.7225V17H47.5065V10.312ZM64.3799 9.208L60.5399 18.088C60.2412 18.7707 59.8732 19.2667 59.4359 19.576C59.0092 19.896 58.4972 20.056 57.8999 20.056C57.5052 20.056 57.1052 20.0027 56.6999 19.896V18.856C57.1052 18.9093 57.4199 18.936 57.6439 18.936C58.0492 18.936 58.3905 18.8453 58.6679 18.664C58.9559 18.4827 59.2012 18.1573 59.4039 17.688L59.8199 16.76L56.5879 9.208H57.9159L60.4919 15.416L63.0679 9.208H64.3799ZM69.3644 17.176C68.6177 17.176 67.9297 16.9947 67.3004 16.632C66.6817 16.2693 66.191 15.7787 65.8284 15.16C65.4657 14.5307 65.2844 13.8427 65.2844 13.096C65.2844 12.3493 65.4657 11.6667 65.8284 11.048C66.191 10.4293 66.6817 9.93867 67.3004 9.576C67.9297 9.21333 68.6177 9.032 69.3644 9.032C70.047 9.032 70.6657 9.18667 71.2204 9.496C71.775 9.79467 72.2284 10.2053 72.5804 10.728L71.7004 11.432C71.071 10.5893 70.2977 10.168 69.3804 10.168C68.847 10.168 68.3617 10.3013 67.9244 10.568C67.4977 10.824 67.1617 11.176 66.9164 11.624C66.671 12.072 66.5484 12.5627 66.5484 13.096C66.5484 13.64 66.671 14.136 66.9164 14.584C67.1617 15.032 67.4977 15.3893 67.9244 15.656C68.3617 15.912 68.847 16.04 69.3804 16.04C70.2977 16.04 71.0657 15.624 71.6844 14.792L72.5644 15.48C72.2124 16.0027 71.759 16.4187 71.2044 16.728C70.6604 17.0267 70.047 17.176 69.3644 17.176ZM80.5449 9.208V17H79.3129V10.312H76.4169L76.3849 11.272C76.3422 12.6373 76.2409 13.736 76.0809 14.568C75.9209 15.4 75.6649 16.024 75.3129 16.44C74.9609 16.856 74.4809 17.064 73.8729 17.064C73.7235 17.064 73.5849 17.0427 73.4569 17V15.96C73.5849 15.9813 73.6915 15.992 73.7769 15.992C74.2782 15.992 74.6355 15.6027 74.8489 14.824C75.0622 14.0347 75.1849 12.84 75.2169 11.24L75.2649 9.208H80.5449ZM90.1143 9.208L86.2743 18.088C85.9756 18.7707 85.6076 19.2667 85.1703 19.576C84.7436 19.896 84.2316 20.056 83.6343 20.056C83.2396 20.056 82.8396 20.0027 82.4342 19.896V18.856C82.8396 18.9093 83.1543 18.936 83.3783 18.936C83.7836 18.936 84.1249 18.8453 84.4023 18.664C84.6903 18.4827 84.9356 18.1573 85.1383 17.688L85.5543 16.76L82.3223 9.208H83.6503L86.2263 15.416L88.8023 9.208H90.1143ZM91.8913 9.208H97.1393V10.312H93.1233V17H91.8913V9.208Z" fill="#F5F5F5"/>
                            </svg>
                        </div>
                        <div className="w-[327px] h-[32px] rounded-full border border-[#313131] flex p-0 relative overflow-hidden">
                            {['Базовый', 'Расширенный', 'Премиум'].map((p) => {
                                const isActive = tariff === p;
                                return (
                                    <button 
                                        key={p}
                                        onClick={() => {
                                            setTariff(p);
                                            if (selectedService) {
                                                const t = selectedService.tariffs.find(item => item.name === p);
                                                if (t) handleTariffSelect(t);
                                            }
                                        }}
                                        className={`flex-1 h-full text-[12px] font-bold transition-all relative z-10 flex items-center justify-center ${isActive ? 'text-white border border-[#F5F5F5] rounded-full' : 'text-white/40'}`}
                                    >
                                        {p}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* FEATURES SECTION */}
                    <div className="space-y-3">
                        <p className="text-[16px] font-normal text-[#F5F5F5] ml-1" style={{ fontFamily: 'var(--font-cera)', lineHeight: '24px' }}>Функции</p>
                        <div className="space-y-2">
                            {features.map((f, i) => (
                                <div key={i} className="w-full h-[56px] bg-[#313131] border border-white/5 rounded-[16px] flex items-center justify-between px-6 transition-all focus-within:border-white/20">
                                    <input 
                                        value={f}
                                        onChange={e => {
                                            const newF = [...features];
                                            newF[i] = e.target.value;
                                            setFeatures(newF);
                                        }}
                                        className="bg-transparent border-none outline-none text-[16px] font-normal text-[#F5F5F5] w-full"
                                        style={{ fontFamily: 'var(--font-cera)', lineHeight: '24px' }}
                                        placeholder="Опция"
                                    />
                                    <button onClick={() => removeFeature(i)} className="text-white/20 hover:text-white transition-all ml-4">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <path d="M18 6L6 18M6 6l12 12"/>
                                        </svg>
                                    </button>
                                </div>
                            ))}
                            <button 
                                onClick={addFeature}
                                className="w-full h-[31px] rounded-full border border-white/10 flex items-center justify-center gap-2 text-[13px] font-bold text-white active:scale-95 transition-all mt-1"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 5v14M5 12h14"/>
                                </svg>
                                <span>Добавить функцию</span>
                            </button>
                        </div>
                    </div>

                    {/* PARTNER FIELD */}
                    <div className="space-y-2">
                        <p className="text-[16px] font-normal text-[#F5F5F5] ml-1" style={{ fontFamily: 'var(--font-cera)', lineHeight: '24px' }}>Партнер</p>
                        <div className="w-full h-[56px] bg-[#313131] rounded-[16px] flex items-center px-6 border border-white/5">
                            <select 
                                onChange={(e) => handleSellerSelect(e.target.value)}
                                className="w-full bg-transparent border-none outline-none text-[16px] font-normal text-[#F5F5F5] cursor-pointer"
                                value={sellerPhone}
                                style={{ backgroundColor: '#313131', fontFamily: 'var(--font-cera)' }}
                            >
                                <option value="" style={{ backgroundColor: '#313131', color: '#F5F5F5' }}>Выберите партнера...</option>
                                {allUsers.filter(u => u.isPartner).map(u => (
                                    <option key={u.phone} value={u.phone} style={{ backgroundColor: '#313131', color: '#F5F5F5' }}>
                                        {u.name || u.phone}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* CLIENT FIELD */}
                    <div className="space-y-2">
                        <p className="text-[16px] font-normal text-[#F5F5F5] ml-1" style={{ fontFamily: 'var(--font-cera)', lineHeight: '24px' }}>Клиент</p>
                        <div className="w-full h-[56px] bg-[#313131] rounded-[16px] flex items-center px-6 border border-white/5">
                            <select 
                                onChange={(e) => handleCustomerSelect(e.target.value)}
                                className="w-full bg-transparent border-none outline-none text-[16px] font-normal text-[#F5F5F5] cursor-pointer"
                                value={clientPhone}
                                style={{ backgroundColor: '#313131', fontFamily: 'var(--font-cera)' }}
                            >
                                <option value="" style={{ backgroundColor: '#313131', color: '#F5F5F5' }}>Выберите клиента...</option>
                                {allUsers.map(u => (
                                    <option key={u.phone} value={u.phone} style={{ backgroundColor: '#313131', color: '#F5F5F5' }}>
                                        {u.name || u.phone}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Sticky Save Button - Using Provided SVG */}
                    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[60] active:scale-95 transition-all">
                        <button
                            onClick={handleSubmit}
                            disabled={!isFormValid || isAdding}
                            className={`w-[327px] h-[56px] relative flex items-center justify-center ${isFormValid && !isAdding ? 'opacity-100' : 'opacity-20 grayscale cursor-not-allowed'}`}
                        >
                            <svg width="327" height="56" viewBox="0 0 327 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0">
                                <rect width="327" height="56" rx="28" fill="#F5F5F5"/>
                                <path d="M128.122 32.692C127.088 32.692 126.138 32.452 125.274 31.972C124.421 31.492 123.744 30.836 123.242 30.004C122.752 29.1613 122.506 28.2333 122.506 27.22C122.506 26.2067 122.757 25.284 123.258 24.452C123.76 23.6093 124.437 22.948 125.29 22.468C126.154 21.988 127.104 21.748 128.138 21.748C129.141 21.748 130.048 21.9827 130.858 22.452C131.68 22.9107 132.325 23.5507 132.794 24.372L131.162 25.524C130.416 24.34 129.408 23.748 128.138 23.748C127.488 23.748 126.901 23.8973 126.378 24.196C125.866 24.4947 125.461 24.9107 125.162 25.444C124.874 25.9667 124.73 26.564 124.73 27.236C124.73 27.908 124.874 28.5053 125.162 29.028C125.461 29.5507 125.866 29.9613 126.378 30.26C126.901 30.548 127.488 30.692 128.138 30.692C129.408 30.692 130.416 30.1 131.162 28.916L132.794 30.068C132.336 30.8893 131.696 31.5347 130.874 32.004C130.053 32.4627 129.136 32.692 128.122 32.692ZM138.106 32.676C137.327 32.676 136.612 32.4947 135.962 32.132C135.322 31.7587 134.815 31.2573 134.442 30.628C134.068 29.988 133.882 29.2893 133.882 28.532C133.882 27.7747 134.068 27.0813 134.442 26.452C134.815 25.812 135.327 25.3107 135.978 24.948C136.628 24.5853 137.343 24.404 138.122 24.404C138.9 24.404 139.615 24.5907 140.266 24.964C140.916 25.3267 141.428 25.8227 141.802 26.452C142.186 27.0813 142.378 27.7747 142.378 28.532C142.378 29.2893 142.186 29.988 141.802 30.628C141.428 31.2573 140.911 31.7587 140.25 32.132C139.599 32.4947 138.884 32.676 138.106 32.676ZM138.122 30.692C138.708 30.692 139.194 30.4893 139.578 30.084C139.972 29.6787 140.17 29.1667 140.17 28.548C140.17 27.9293 139.972 27.412 139.578 26.996C139.194 26.58 138.708 26.372 138.122 26.372C137.524 26.372 137.034 26.58 136.65 26.996C136.266 27.4013 136.074 27.9187 136.074 28.548C136.074 29.1667 136.266 29.6787 136.65 30.084C137.034 30.4893 137.524 30.692 138.122 30.692ZM148.71 32.5L147.014 29.972L145.302 32.5H142.886L145.782 28.42L143.078 24.58H145.494L147.014 26.868L148.518 24.58H150.934L148.214 28.404L151.126 32.5H148.71ZM156.858 24.404C157.594 24.404 158.25 24.5853 158.826 24.948C159.412 25.3 159.871 25.7907 160.202 26.42C160.532 27.0387 160.698 27.7427 160.698 28.532C160.698 29.3213 160.532 30.0307 160.202 30.66C159.871 31.2893 159.412 31.7853 158.826 32.148C158.25 32.5107 157.594 32.692 156.858 32.692C156.378 32.692 155.935 32.612 155.53 32.452C155.124 32.2813 154.778 32.0413 154.49 31.732V35.38H152.33V24.58H154.314V25.572C154.58 25.1987 154.932 24.9107 155.37 24.708C155.818 24.5053 156.314 24.404 156.858 24.404ZM156.458 30.724C157.034 30.724 157.519 30.5267 157.914 30.132C158.308 29.7267 158.506 29.1987 158.506 28.548C158.506 27.8867 158.308 27.3587 157.914 26.964C157.53 26.5587 157.044 26.356 156.458 26.356C155.914 26.356 155.444 26.5427 155.05 26.916C154.655 27.2787 154.458 27.8173 154.458 28.532C154.458 29.236 154.65 29.78 155.034 30.164C155.428 30.5373 155.903 30.724 156.458 30.724ZM165.64 24.404C166.675 24.404 167.496 24.6973 168.104 25.284C168.723 25.86 169.032 26.6973 169.032 27.796V32.5H167.048V31.732C166.76 32.0307 166.408 32.2653 165.992 32.436C165.587 32.6067 165.134 32.692 164.632 32.692C163.79 32.692 163.123 32.4733 162.632 32.036C162.142 31.588 161.896 31.0173 161.896 30.324C161.896 29.6093 162.163 29.0493 162.696 28.644C163.24 28.228 163.971 28.02 164.888 28.02H166.872V27.668C166.872 27.2307 166.744 26.8893 166.488 26.644C166.243 26.3987 165.88 26.276 165.4 26.276C164.995 26.276 164.632 26.3667 164.312 26.548C163.992 26.7187 163.656 26.9907 163.304 27.364L162.184 26.036C163.102 24.948 164.254 24.404 165.64 24.404ZM165.208 31.108C165.678 31.108 166.072 30.964 166.392 30.676C166.712 30.3773 166.872 29.9987 166.872 29.54V29.444H165.176C164.824 29.444 164.552 29.5133 164.36 29.652C164.168 29.78 164.072 29.9773 164.072 30.244C164.072 30.5107 164.174 30.724 164.376 30.884C164.59 31.0333 164.867 31.108 165.208 31.108ZM171.159 24.58H173.303V27.476H176.231V24.58H178.375V32.5H176.231V29.316H173.303V32.5H171.159V24.58ZM187.892 24.404V32.5H185.732V28.212L181.316 32.692H180.612V24.58H182.756V28.9L187.188 24.404H187.892ZM191.664 26.404H189.232V24.58H196.256V26.404H193.808V32.5H191.664V26.404ZM197.597 24.58H199.741V26.868H201.181C202.151 26.868 202.941 27.1187 203.549 27.62C204.167 28.1213 204.477 28.804 204.477 29.668C204.477 30.5427 204.167 31.236 203.549 31.748C202.941 32.2493 202.151 32.5 201.181 32.5H197.597V24.58ZM201.117 30.676C201.479 30.676 201.762 30.596 201.965 30.436C202.178 30.2653 202.285 30.02 202.285 29.7C202.285 29.3907 202.178 29.1453 201.965 28.964C201.751 28.7827 201.469 28.692 201.117 28.692H199.741V30.676H201.117Z" fill="#141414"/>
                            </svg>
                        </button>
                    </div>

                </main>
            </div>
            <style jsx global>{` body { background-color: #141414; } ::-webkit-scrollbar { display: none; } `}</style>
        </div>
    );
}
