"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tariff, Feature, Design, saveService } from "@/utils/services";
import "./style.css";

export default function AddServicePage() {
    const router = useRouter();
    const categoryId = "sets";
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Основные поля услуги
    const [serviceName, setServiceName] = useState("");
    const [servicePrice, setServicePrice] = useState("");
    const [coverImage, setCoverImage] = useState<string>("");

    // Тарифы
    const [tariffs, setTariffs] = useState<Tariff[]>([]);

    // Дизайн
    const [designs, setDesigns] = useState<Design[]>([]);

    // --- Обработчики Тарифов ---
    const addTariff = () => {
        const newTariff: Tariff = {
            id: `tariff_${Date.now()}`,
            name: "",
            price: "",
            description: "",
            features: [],
        };
        setTariffs([...tariffs, newTariff]);
    };

    const removeTariff = (id: string) => {
        setTariffs(tariffs.filter((t) => t.id !== id));
    };

    const updateTariff = (id: string, field: keyof Tariff, value: string) => {
        setTariffs(
            tariffs.map((t) => (t.id === id ? { ...t, [field]: value } : t))
        );
    };

    // --- Обработчики Функций Тарифа ---
    const addFeature = (tariffId: string) => {
        const newFeature: Feature = {
            id: `feat_${Date.now()}_${Math.random()}`,
            text: "",
        };
        setTariffs(
            tariffs.map((t) =>
                t.id === tariffId
                    ? { ...t, features: [...t.features, newFeature] }
                    : t
            )
        );
    };

    const removeFeature = (tariffId: string, featureId: string) => {
        setTariffs(
            tariffs.map((t) =>
                t.id === tariffId
                    ? { ...t, features: t.features.filter((f) => f.id !== featureId) }
                    : t
            )
        );
    };

    const updateFeature = (tariffId: string, featureId: string, text: string) => {
        setTariffs(
            tariffs.map((t) =>
                t.id === tariffId
                    ? {
                        ...t,
                        features: t.features.map((f) =>
                            f.id === featureId ? { ...f, text } : f
                        ),
                    }
                    : t
            )
        );
    };

    // --- Обработчики Дизайна ---
    const addDesign = () => {
        const newDesign: Design = {
            id: `design_${Date.now()}`,
            name: "",
            price: "",
            description: "",
        };
        setDesigns([...designs, newDesign]);
    };

    const removeDesign = (id: string) => {
        setDesigns(designs.filter((d) => d.id !== id));
    };

    const updateDesign = (id: string, field: keyof Design, value: string) => {
        setDesigns(
            designs.map((d) => (d.id === id ? { ...d, [field]: value } : d))
        );
    };

    // --- Загрузка изображения ---
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const result = event.target?.result as string;
            if (result) {
                setCoverImage(result);
            }
        };
        reader.readAsDataURL(file);
    };

    // --- Сохранение услуги ---
    const handleSave = () => {
        if (!serviceName.trim()) {
            alert("Введите название услуги");
            return;
        }

        const newService = {
            id: `service_${Date.now()}`,
            categoryId,
            name: serviceName,
            price: servicePrice,
            coverImage,
            tariffs,
            designs,
            createdAt: new Date().toISOString(),
            sellerPhone: "ADMIN",
            partnerName: undefined,
        };

        saveService(newService);
        router.push(`/admin/categories/edit/${categoryId}`);
    };

    return (
        <div className="add-service-page">
            <div className="page-wrapper">

                {/* Header from SVG */}
                <header className="header-svg">
                    <button
                        onClick={() => router.back()}
                        className="w-10 h-10 flex items-center justify-start"
                    >
                        <svg width="22" height="18" viewBox="29 63 22 18" fill="none">
                            <path d="M51 72L29 72M29 72L38.4286 81M29 72L38.4286 63" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>

                    <div className="header-title">Услуга</div>

                    <button className="w-10 h-10 flex items-center justify-end">
                        <svg width="20" height="22" viewBox="325 61 20 22" fill="none">
                            <path d="M337.5 69.5556V78.1111M332.5 69.5556V78.1111M327.5 64.6667V79.0889C327.5 80.4579 327.5 81.1419 327.772 81.6648C328.012 82.1248 328.394 82.4995 328.865 82.7338C329.399 83 330.099 83 331.496 83H338.504C339.901 83 340.6 83 341.134 82.7338C341.605 82.4995 341.988 82.1248 342.228 81.6648C342.5 81.1425 342.5 80.459 342.5 79.0927V64.6667M327.5 64.6667H330M327.5 64.6667H325M330 64.6667H340M330 64.6667C330 63.5277 330 62.9585 330.19 62.5093C330.444 61.9103 331.543 61.1861C332.002 61 332.585 61 333.75 61H336.25C337.415 61 337.997 61 338.457 61.1861C339.069 61.4342 339.556 61.9103 339.81 62.5093C340 62.9585 340 63.5277 340 64.6667M340 64.6667H342.5M342.5 64.6667H345" stroke="#FF8C67" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </header>

                {/* Content */}
                <main className="animate-fade">

                    {/* Card Preview Area */}
                    <section className="preview-section">
                        <div className="preview-card">
                            {coverImage ? (
                                <img src={coverImage} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="opacity-20">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                        <circle cx="8.5" cy="8.5" r="1.5" />
                                        <polyline points="21 15 16 10 5 21" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        <div className="preview-name">{serviceName || "Название услуги"}</div>
                        <div className="preview-price">от {servicePrice || "0"} ₽</div>
                    </section>

                    <form className="form-content" onSubmit={(e) => e.preventDefault()}>

                        {/* Name Field */}
                        <div className="form-group">
                            <label className="form-label">Название</label>
                            <div className="form-input-container">
                                <input
                                    type="text"
                                    value={serviceName}
                                    onChange={(e) => setServiceName(e.target.value)}
                                    placeholder="Введите название"
                                />
                            </div>
                        </div>

                        {/* Cover Upload */}
                        <div className="form-group">
                            <label className="form-label">Обложка</label>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="upload-dropzone"
                            >
                                <svg width="54" height="35" viewBox="160 517 54 35" fill="none">
                                    <path d="M187.5 544.5V529.5M187.5 529.5L180.136 534.5M187.5 529.5L194.864 534.5M214.5 542C214.5 536.477 210.104 532 204.682 532C204.624 532 204.567 532 204.509 532.001C203.319 523.52 196.156 517 187.5 517C180.635 517 174.712 521.1 171.96 527.027C165.561 527.454 160.5 532.874 160.5 539.5C160.5 546.403 165.995 552 172.773 552L204.682 552C210.104 552 214.5 547.523 214.5 542Z" stroke="var(--text-secondary)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <div className="upload-text">Загрузите PNG или JPG файл обложки</div>
                                <button type="button" className="btn-select-file">Выбрать файл</button>
                                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                            </div>
                        </div>

                        {/* Price Field */}
                        <div className="form-group">
                            <label className="form-label">Цена</label>
                            <div className="form-input-container">
                                <input
                                    type="text"
                                    value={servicePrice}
                                    onChange={(e) => setServicePrice(e.target.value)}
                                    placeholder="180 000"
                                />
                            </div>
                        </div>

                        {/* Tariffs Section */}
                        <div className="section-header">
                            <h2 className="section-title">Тарифы</h2>
                            <button onClick={addTariff} type="button" className="btn-add-svg">
                                <svg width="24" height="24" viewBox="302 811 24 24" fill="none">
                                    <path d="M319.485 820H311M311 820H302.515M311 820V811.515M311 820V828.485" stroke="var(--bg-color)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex flex-col gap-4">
                            {tariffs.map((tariff) => (
                                <div key={tariff.id} className="item-card">
                                    <div className="form-group">
                                        <label className="form-label">Название</label>
                                        <div className="form-input-container">
                                            <input
                                                type="text"
                                                value={tariff.name}
                                                onChange={(e) => updateTariff(tariff.id, "name", e.target.value)}
                                                placeholder="Базовый"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Цена</label>
                                        <div className="form-input-container">
                                            <input
                                                type="text"
                                                value={tariff.price}
                                                onChange={(e) => updateTariff(tariff.id, "price", e.target.value)}
                                                placeholder="150 000"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Описание</label>
                                        <textarea
                                            value={tariff.description}
                                            onChange={(e) => updateTariff(tariff.id, "description", e.target.value)}
                                            placeholder="Расскажите что получит клиент"
                                            className="textarea-custom"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Функции</label>
                                        <div className="features-list">
                                            {tariff.features.map((feature) => (
                                                <div key={feature.id} className="feature-row">
                                                    <div className="form-input-container pr-12 w-full">
                                                        <input
                                                            type="text"
                                                            value={feature.text}
                                                            onChange={(e) => updateFeature(tariff.id, feature.id, e.target.value)}
                                                            placeholder="Функция"
                                                        />
                                                    </div>
                                                    <button
                                                        onClick={() => removeFeature(tariff.id, feature.id)}
                                                        className="btn-remove-feature"
                                                    >
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M18 6L6 18M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                onClick={() => addFeature(tariff.id)}
                                                className="btn-action-card btn-secondary"
                                            >
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                    <path d="M12 5v14M5 12h14" />
                                                </svg>
                                                <span>Добавить</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="h-[1px] bg-[var(--border-color)] w-full" />
                                    <button
                                        onClick={() => removeTariff(tariff.id)}
                                        className="btn-action-card btn-danger"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                        </svg>
                                        Удалить тариф
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Design Section */}
                        <div className="section-header mt-8">
                            <h2 className="section-title">Дизайн</h2>
                            <button onClick={addDesign} type="button" className="btn-add-svg">
                                <svg width="24" height="24" viewBox="302 811 24 24" fill="none">
                                    <path d="M319.485 820H311M311 820H302.515M311 820V811.515M311 820V828.485" stroke="var(--bg-color)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex flex-col gap-4">
                            {designs.map((design) => (
                                <div key={design.id} className="item-card">
                                    <div className="form-group">
                                        <label className="form-label">Название</label>
                                        <div className="form-input-container">
                                            <input
                                                type="text"
                                                value={design.name}
                                                onChange={(e) => updateDesign(design.id, "name", e.target.value)}
                                                placeholder="Темная тема"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Цена</label>
                                        <div className="form-input-container">
                                            <input
                                                type="text"
                                                value={design.price}
                                                onChange={(e) => updateDesign(design.id, "price", e.target.value)}
                                                placeholder="50 000"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Описание</label>
                                        <textarea
                                            value={design.description}
                                            onChange={(e) => updateDesign(design.id, "description", e.target.value)}
                                            placeholder="Описание дизайна"
                                            className="textarea-custom !h-[100px]"
                                        />
                                    </div>
                                    <div className="h-[1px] bg-[var(--border-color)] w-full" />
                                    <button
                                        onClick={() => removeDesign(design.id)}
                                        className="btn-action-card btn-danger"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                        </svg>
                                        Удалить дизайн
                                    </button>
                                </div>
                            ))}
                        </div>
                    </form>
                </main>

                {/* Footer with Floating Save Button */}
                <div className="footer-save">
                    <button
                        onClick={handleSave}
                        className="btn-save-main"
                    >
                        Сохранить
                    </button>
                </div>
            </div>

            {/* Hidden reference SVG for elements used */}
            <div className="hidden">
                {/* Total SVG code could be here if needed for direct referene */}
            </div>
        </div>
    );
}
