"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { saveOrder, Order } from "@/utils/orders";
import { getServices, Service, Tariff, Design } from "@/utils/services";
import { getAllUsers, UserData } from "@/utils/userData";
import "./style.css";

export default function AdminAddOrderPage() {
    const router = useRouter();

    // Data
    const [services, setServices] = useState<Service[]>([]);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [allUsers, setAllUsers] = useState<UserData[]>([]);

    // Order Info
    const [title, setTitle] = useState("");
    const [tariff, setTariff] = useState("");
    const [tariffPrice, setTariffPrice] = useState("0");
    const [design, setDesign] = useState("");
    const [designPrice, setDesignPrice] = useState("0");
    
    // Client Info
    const [clientName, setClientName] = useState("");
    const [clientPhone, setClientPhone] = useState("");
    const [clientEmail, setClientEmail] = useState("");

    // Seller Info
    const [partnerName, setPartnerName] = useState("");
    const [sellerPhone, setSellerPhone] = useState("");

    // Features
    const [features, setFeatures] = useState<string[]>([]);
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        async function loadData() {
            const allServices = await getServices();
            setServices(allServices);
            
            const users = getAllUsers();
            setAllUsers(users);
        }
        loadData();
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
            if (service.designs.length > 0) {
               handleDesignSelect(service.designs[0]);
            }
        } else {
            setSelectedService(null);
        }
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

    const handleTariffSelect = (t: Tariff, s: Service | null = selectedService) => {
        setTariff(t.name);
        setTariffPrice(t.price.toString().replace(/\s/g, ''));
        setFeatures(t.features.map(f => f.text));
    };

    const handleDesignSelect = (d: Design) => {
        setDesign(d.name);
        setDesignPrice(d.price.toString().replace(/\s/g, ''));
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
            const currentTariffPrice = parsePrice(tariffPrice);
            const currentDesignPrice = parsePrice(designPrice);

            const newOrder: Order = {
                id: `ord_${Date.now()}`,
                orderNumber: Math.floor(1000 + Math.random() * 9000),
                title,
                tariff: tariff || "Индивидуальный",
                tariffPrice: currentTariffPrice,
                design: design || "Базовый",
                designPrice: currentDesignPrice,
                price: currentTariffPrice + currentDesignPrice,
                status: "pending",
                stage: "processing",
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
        <div className="add-order-page">
            <div className="page-wrapper">
                
                {/* Header matching Reference UI */}
                <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[375px] h-[102px] z-50">
                    <svg width="375" height="102" viewBox="0 0 375 102" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                        <path d="M0 0H375V102H0V0Z" fill="var(--bg-color)"/>
                        <path d="M0 102H375" stroke="var(--border-color)" strokeWidth="1"/>
                        <path d="M51 72L29 72M29 72L38.4286 81M29 72L38.4286 63" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        {/* Title text for Header */}
                        <text 
                            x="187.5" 
                            y="75" 
                            textAnchor="middle" 
                            dominantBaseline="middle"
                            className="fill-[var(--text-primary)]"
                            style={{ 
                                fontFamily: 'var(--font-cera)',
                                fontWeight: 700,
                                fontSize: '24px',
                                letterSpacing: '0%',
                            }}
                        >
                            Новый заказ
                        </text>
                    </svg>

                    <button
                        onClick={() => router.back()}
                        className="absolute left-[20px] bottom-[10px] w-[60px] h-[60px] z-10 active:opacity-60 transition-opacity"
                    />
                </header>

                <main className="animate-fade pt-[130px]">
                    <form className="form-content" onSubmit={(e) => e.preventDefault()}>
                        
                        {/* Service Selection */}
                        <div className="w-full relative">
                            <label className="form-label px-2 mb-2">Выберите услугу (пресет)</label>
                            <div className="form-input-container bg-[var(--border-color)]">
                                <select 
                                    onChange={(e) => handleServiceSelect(e.target.value)}
                                    className="w-full h-full"
                                >
                                    <option value="">Индивидуальный заказ</option>
                                    {services.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Project Name */}
                        <div className="w-full relative mt-4">
                            <label className="form-label px-2">Название проекта</label>
                            <div className="form-input-container">
                                <input 
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    placeholder="Название"
                                />
                            </div>
                        </div>

                        {/* Tariff Section */}
                        <div className="flex flex-col gap-4 mt-8">
                            <div className="section-header">
                                <span className="text-[14px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Конфигурация</span>
                            </div>

                            <div className="item-card">
                                <div className="form-group pb-4">
                                    <label className="form-label">Тариф</label>
                                    <div className="form-input-container">
                                        <input 
                                            value={tariff}
                                            onChange={e => setTariff(e.target.value)}
                                            placeholder="Пакет"
                                        />
                                    </div>
                                </div>
                                <div className="form-group pb-4">
                                    <label className="form-label">Стоимость тарифа (₽)</label>
                                    <div className="form-input-container">
                                        <input 
                                            value={tariffPrice}
                                            onChange={e => setTariffPrice(e.target.value)}
                                            placeholder="0"
                                            className="tabular-nums"
                                        />
                                    </div>
                                </div>

                                <div className="w-full h-[1px] bg-[var(--border-color)] my-2" />

                                <div className="form-group pb-4">
                                    <label className="form-label">Функции тарифа</label>
                                    <div className="flex flex-col gap-2 mt-2">
                                        {features.map((f, i) => (
                                            <div key={i} className="feature-row">
                                                <div className="form-input-container w-full pr-12 bg-[var(--bg-color)]">
                                                    <input 
                                                        value={f}
                                                        onChange={e => {
                                                            const newF = [...features];
                                                            newF[i] = e.target.value;
                                                            setFeatures(newF);
                                                        }}
                                                        placeholder="Опция"
                                                    />
                                                </div>
                                                <button onClick={() => removeFeature(i)} className="btn-remove-feature">
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M18 6L6 18M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            onClick={addFeature}
                                            type="button"
                                            className="w-full h-[32px] bg-transparent border-none outline-none p-0 cursor-pointer active:opacity-70 transition-opacity mt-2"
                                        >
                                            <svg width="295" height="32" viewBox="0 0 295 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                                                <rect x="0.5" y="0.5" width="294" height="31" rx="15.5" stroke="var(--border-color)"/>
                                                <path d="M113.485 16H105M105 16H96.5146M105 16V7.51472M105 16V24.4853" stroke="var(--add-btn-icon-alt)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M138.574 18.548V22.756H136.414V20.5H129.838V22.756H127.678V18.548H128.526C128.985 18.1747 129.315 17.4333 129.518 16.324C129.721 15.204 129.822 13.6573 129.822 11.684V9.94H137.166V18.548H138.574ZM131.854 11.892C131.833 13.524 131.742 14.8893 131.582 15.988C131.433 17.076 131.198 17.9293 130.878 18.548H135.006V11.892H131.854ZM143.645 20.676C142.866 20.676 142.152 20.4947 141.501 20.132C140.861 19.7587 140.354 19.2573 139.981 18.628C139.608 17.988 139.421 17.2893 139.421 16.532C139.421 15.7747 139.608 15.0813 139.981 14.452C140.354 13.812 140.866 13.3107 141.517 12.948C142.168 12.5853 142.882 12.404 143.661 12.404C144.44 12.404 145.154 12.5907 145.805 12.964C146.456 13.3267 146.968 13.8227 147.341 14.452C147.725 15.0813 147.917 15.7747 147.917 16.532C147.917 17.2893 147.725 17.988 147.341 18.628C146.968 19.2573 146.45 19.7587 145.789 20.132C145.138 20.4947 144.424 20.676 143.645 20.676ZM143.661 18.692C144.248 18.692 144.733 18.4893 145.117 18.084C145.512 17.6787 145.709 17.1667 145.709 16.548C145.709 15.9293 145.512 15.412 145.117 14.996C144.733 14.58 144.248 14.372 143.661 14.372C143.064 14.372 142.573 14.58 142.189 14.996C141.805 15.4013 141.613 15.9187 141.613 16.548C141.613 17.1667 141.805 17.6787 142.189 18.084C142.573 18.4893 143.064 18.692 143.661 18.692ZM154.083 12.692C154.777 12.692 155.406 12.868 155.971 13.22C156.537 13.5613 156.979 14.036 157.299 14.644C157.63 15.252 157.795 15.9293 157.795 16.676C157.795 17.444 157.614 18.132 157.251 18.74C156.889 19.348 156.387 19.8227 155.747 20.164C155.107 20.5053 154.387 20.676 153.587 20.676C152.734 20.676 151.987 20.484 151.347 20.1C150.707 19.7053 150.211 19.1507 149.859 18.436C149.507 17.7213 149.331 16.8947 149.331 15.956V14.756C149.331 13.54 149.475 12.532 149.763 11.732C150.051 10.932 150.585 10.2813 151.363 9.78C152.153 9.27867 153.267 8.94267 154.707 8.772C155.369 8.68667 155.902 8.60133 156.307 8.516C156.713 8.43067 156.974 8.36667 157.091 8.324V10.292C156.686 10.452 155.897 10.5853 154.723 10.692C153.795 10.788 153.086 10.9693 152.595 11.236C152.115 11.5027 151.785 11.8547 151.603 12.292C151.422 12.7293 151.321 13.316 151.299 14.052C151.609 13.6147 152.003 13.2787 152.483 13.044C152.963 12.8093 153.497 12.692 154.083 12.692ZM153.555 18.708C154.131 18.708 154.611 18.5107 154.995 18.116C155.39 17.7213 155.587 17.2413 155.587 16.676C155.587 16.1107 155.39 15.636 154.995 15.252C154.611 14.8573 154.131 14.66 153.555 14.66C152.99 14.66 152.51 14.8573 152.115 15.252C151.731 15.636 151.539 16.1107 151.539 16.676C151.539 17.2413 151.731 17.7213 152.115 18.116C152.51 18.5107 152.99 18.708 153.555 18.708ZM162.726 12.404C163.761 12.404 164.582 12.6973 165.19 13.284C165.809 13.86 166.118 14.6973 166.118 15.796V20.5H164.134V19.732C163.846 20.0307 163.494 20.2653 163.078 20.436C162.673 20.6067 162.22 20.692 161.718 20.692C160.876 20.692 160.209 20.4733 159.718 20.036C159.228 19.588 158.982 19.0173 158.982 18.324C158.982 17.6093 159.249 17.0493 159.782 16.644C160.326 16.228 161.057 16.02 161.974 16.02H163.958V15.668C163.958 15.2307 163.83 14.8893 163.574 14.644C163.329 14.3987 162.966 14.276 162.486 14.276C162.081 14.276 161.718 14.3667 161.398 14.548C161.078 14.7187 160.742 14.9907 160.39 15.364L159.27 14.036C160.188 12.948 161.34 12.404 162.726 12.404ZM162.294 19.108C162.764 19.108 163.158 18.964 163.478 18.676C163.798 18.3773 163.958 17.9987 163.958 17.54V17.444H162.262C161.91 17.444 161.638 17.5133 161.446 17.652C161.254 17.78 161.158 17.9773 161.158 18.244C161.158 18.5107 161.26 18.724 161.462 18.884C161.676 19.0333 161.953 19.108 162.294 19.108ZM174.069 16.26C174.453 16.4307 174.752 16.6707 174.965 16.98C175.189 17.2893 175.301 17.6573 175.301 18.084C175.301 18.5533 175.178 18.9747 174.933 19.348C174.688 19.7107 174.346 19.9933 173.909 20.196C173.482 20.3987 172.997 20.5 172.453 20.5H168.245V12.58H171.925C172.736 12.58 173.402 12.7827 173.925 13.188C174.448 13.5827 174.709 14.1213 174.709 14.804C174.709 15.38 174.496 15.8653 174.069 16.26ZM170.293 15.668H171.797C172.437 15.668 172.757 15.4227 172.757 14.932C172.757 14.676 172.677 14.4893 172.517 14.372C172.357 14.2547 172.117 14.196 171.797 14.196H170.293V15.668ZM172.213 18.9C172.554 18.9 172.821 18.82 173.013 18.66C173.216 18.5 173.317 18.2867 173.317 18.02C173.317 17.7533 173.216 17.5453 173.013 17.396C172.821 17.2467 172.554 17.172 172.213 17.172H170.293V18.9H172.213ZM184.369 12.404V20.5H182.209V16.212L177.793 20.692H177.089V12.58H179.233V16.9L183.665 12.404H184.369ZM188.14 14.404H185.708V12.58H192.732V14.404H190.284V20.5H188.14V14.404ZM194.073 12.58H196.217V14.868H197.657C198.628 14.868 199.417 15.1187 200.025 15.62C200.644 16.1213 200.953 16.804 200.953 17.668C200.953 18.5427 200.644 19.236 200.025 19.748C199.417 20.2493 198.628 20.5 197.657 20.5H194.073V12.58ZM197.593 18.676C197.956 18.676 198.238 18.596 198.441 18.436C198.654 18.2653 198.761 18.02 198.761 17.7C198.761 17.3907 198.654 17.1453 198.441 16.964C198.228 16.7827 197.945 16.692 197.593 16.692H196.217V18.676H197.593Z" fill="var(--text-primary)"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="w-full h-[1px] bg-[var(--border-color)] my-2" />

                                <div className="form-group">
                                    <label className="form-label">Дизайн</label>
                                    <div className="form-input-container">
                                        <input 
                                            value={design}
                                            onChange={e => setDesign(e.target.value)}
                                            placeholder="Стиль"
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Стоимость дизайна (₽)</label>
                                    <div className="form-input-container">
                                        <input 
                                            value={designPrice}
                                            onChange={e => setDesignPrice(e.target.value)}
                                            placeholder="0"
                                            className="tabular-nums"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Total Price */}
                        <div className="mt-4 px-2">
                             <p className="text-[12px] text-[var(--text-secondary)] font-medium mb-2">Итоговая стоимость</p>
                             <div className="price-display">
                                 <span className="price-value">{(parsePrice(tariffPrice) + parsePrice(designPrice)).toLocaleString()}</span>
                                 <span className="price-currency">₽</span>
                             </div>
                        </div>

                        {/* Customer Section */}
                        <div className="flex flex-col gap-4 mt-8">
                            <div className="section-header">
                                <span className="text-[14px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Заказчик</span>
                            </div>
                            <div className="item-card">
                                <div className="form-group">
                                    <label className="form-label">Выбрать заказчика</label>
                                    <div className="form-input-container bg-[var(--border-color)]">
                                        <select 
                                            onChange={(e) => handleCustomerSelect(e.target.value)}
                                            className="w-full h-full"
                                            value={clientPhone}
                                            required
                                        >
                                            <option value="">Выберите из базы...</option>
                                            {allUsers.map(u => (
                                                <option key={u.phone} value={u.phone}>{u.name || u.phone} ({u.phone})</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Seller Section */}
                        <div className="flex flex-col gap-4 mt-8">
                            <div className="section-header">
                                <span className="text-[14px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Продавец</span>
                            </div>
                            <div className="item-card">
                                <div className="form-group">
                                    <label className="form-label">Выбрать продавца</label>
                                    <div className="form-input-container bg-[var(--border-color)]">
                                        <select 
                                            onChange={(e) => handleSellerSelect(e.target.value)}
                                            className="w-full h-full"
                                            value={sellerPhone}
                                            required
                                        >
                                            <option value="">Выберите из базы...</option>
                                            {allUsers.filter(u => u.isPartner).map(u => (
                                                <option key={u.phone} value={u.phone}>{u.name || u.phone} ({u.phone})</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Save Button matching reference */}
                        <div className="mt-[32px] mb-[40px]">
                            <button
                                onClick={handleSubmit}
                                type="button"
                                disabled={!isFormValid || isAdding}
                                className={`w-full h-[56px] bg-transparent border-none outline-none p-0 transition-all ${
                                    isFormValid && !isAdding ? 'cursor-pointer active:opacity-70' : 'opacity-30 cursor-not-allowed grayscale'
                                }`}
                            >
                                <svg width="327" height="56" viewBox="0 0 327 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                                    <rect width="327" height="56" rx="28" fill="var(--text-primary)"/>
                                    <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" className="fill-[var(--bg-color)] text-[16px] font-black uppercase tracking-widest">
                                        {isAdding ? "Создание..." : "Создать заказ"}
                                    </text>
                                </svg>
                            </button>
                        </div>

                    </form>
                </main>
            </div>
        </div>
    );
}

