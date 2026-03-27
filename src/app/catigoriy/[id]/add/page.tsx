"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Tariff, Feature, Design, saveService, getServiceById } from "@/utils/services";
import { getCategories, Category } from "@/utils/categories";
import { getActiveRole, getCurrentUserPhone, getUserData } from "@/utils/userData";
import "./style.css";
import MobileView from "./MobileView";
import DesktopView from "./DesktopView";

export default function PartnerAddServicePage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const categoryId = params.id as string;
  const editId = searchParams.get("edit");

  useEffect(() => {
    const role = getActiveRole();
    if (role !== "seller") {
      router.replace("/client");
    }
  }, [router]);

  // Основные поля услуги
  const [serviceName, setServiceName] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [coverImage, setCoverImage] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCatId, setSelectedCatId] = useState(categoryId);
  const [sellerName, setSellerName] = useState("");

  useEffect(() => {
    setCategories(getCategories());
    if (categoryId) setSelectedCatId(categoryId);
    
    const currentPhone = getCurrentUserPhone();
    const userData = currentPhone ? getUserData(currentPhone) : null;
    setSellerName(userData?.name || "Партнер");

    if (editId) {
      const existing = getServiceById(editId);
      if (existing) {
        // Ownership Check
        if (existing.sellerPhone !== currentPhone && currentPhone !== "79999999999") {
          router.replace(`/catigoriy/${categoryId}`);
          return;
        }
        
        setServiceName(existing.name);
        setServicePrice(existing.price);
        setCoverImage(existing.coverImage || "");
        setTariffs(existing.tariffs);
        setDesigns(existing.designs);
        setSelectedCatId(existing.categoryId);
      }
    }
  }, [categoryId, editId, router]);

  // Тарифы
  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  // Дизайн
  const [designs, setDesigns] = useState<Design[]>([]);

  // --- Обработчики Тарифов ---
  const addTariff = () => {
    const newTariff: Tariff = {
      id: `tariff_${Date.now()}`,
      name: "", price: "", description: "", features: [],
    };
    setTariffs([...tariffs, newTariff]);
  };

  const removeTariff = (id: string) => {
    setTariffs(tariffs.filter((t) => t.id !== id));
  };

  const updateTariff = (id: string, field: keyof Tariff, value: string) => {
    setTariffs(tariffs.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
  };

  // --- Обработчики Функций Тарифа ---
  const addFeature = (tariffId: string) => {
    const newFeature: Feature = { id: `feat_${Date.now()}_${Math.random()}`, text: "" };
    setTariffs(tariffs.map((t) => t.id === tariffId ? { ...t, features: [...t.features, newFeature] } : t));
  };

  const removeFeature = (tariffId: string, featureId: string) => {
    setTariffs(tariffs.map((t) => t.id === tariffId ? { ...t, features: t.features.filter((f) => f.id !== featureId) } : t));
  };

  const updateFeature = (tariffId: string, featureId: string, text: string) => {
    setTariffs(tariffs.map((t) => t.id === tariffId ? { ...t, features: t.features.map((f) => f.id === featureId ? { ...f, text } : f) } : t));
  };

  // --- Обработчики Дизайна ---
  const addDesign = () => {
    const newDesign: Design = { id: `design_${Date.now()}`, name: "", price: "", description: "" };
    setDesigns([...designs, newDesign]);
  };

  const removeDesign = (id: string) => {
    setDesigns(designs.filter((d) => d.id !== id));
  };

  const updateDesign = (id: string, field: keyof Design, value: string) => {
    setDesigns(designs.map((d) => (d.id === id ? { ...d, [field]: value } : d)));
  };

  // --- Загрузка изображения ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) setCoverImage(result);
    };
    reader.readAsDataURL(file);
  };

  const isFormValid = serviceName.trim() !== "" && coverImage !== "" && servicePrice.trim() !== "" && tariffs.length > 0 && designs.length > 0;

  const handleSave = () => {
    if (!isFormValid) return;
    const currentPhone = getCurrentUserPhone();
    const userData = currentPhone ? getUserData(currentPhone) : null;
    const newService = {
      id: editId || `service_${Date.now()}`,
      categoryId: selectedCatId,
      name: serviceName,
      price: servicePrice,
      coverImage,
      tariffs,
      designs,
      createdAt: editId ? (getServiceById(editId)?.createdAt || new Date().toISOString()) : new Date().toISOString(),
      updatedAt: editId ? new Date().toISOString() : undefined,
      sellerPhone: currentPhone || "PARTNER",
      partnerName: userData?.name || "Партнер",
      partnerAvatar: userData?.avatar || "",
    };
    saveService(newService);
    router.push(`/catigoriy/${selectedCatId}`);
  };

  const commonProps = {
    serviceName, setServiceName, servicePrice, setServicePrice,
    coverImage, handleImageUpload, tariffs, addTariff, removeTariff, updateTariff,
    addFeature, removeFeature, updateFeature, designs, addDesign, removeDesign, updateDesign,
    handleSave, isFormValid, router, categoryId, sellerName
  };

  return (
    <>
      <div className="md:hidden">
        <MobileView {...commonProps} />
      </div>
      <div className="hidden md:block">
        <DesktopView {...commonProps} />
      </div>
    </>
  );
}
