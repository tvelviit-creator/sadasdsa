"use client";

import { useEffect, useState, useRef, useCallback, Suspense } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUserPhone, getUserData } from "@/utils/userData";
import { saveOrder, getAllOrders, Order } from "@/utils/orders";

interface SelectedPackages {
  serviceIndex: number;
  serviceFileName: string;
  designIndex: number;
  designFileName: string;
  serviceName?: string;
  tariffName?: string;
  tariffDescription?: string;
  tariffFeatures?: { id: string; text: string }[];
  tariffPrice?: number;
  designName?: string;
  designDescription?: string;
  designPrice?: number;
  sellerPhone?: string;
  partnerName?: string;
}

function PayContent() {
  const router = useRouter();
  const [selectedPackages, setSelectedPackages] = useState<SelectedPackages | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const orderCreatedRef = useRef<boolean>(false);

  useEffect(() => {
    const saved = localStorage.getItem("selectedPackages");
    if (saved) {
      try {
        setSelectedPackages(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const totalPrice = (selectedPackages?.tariffPrice || 0) + (selectedPackages?.designPrice || 0);

  const createOrder = useCallback(async () => {
    if (orderCreatedRef.current) return null;

    const currentPhone = getCurrentUserPhone();
    if (!currentPhone || !selectedPackages) return null;

    const allOrders = await getAllOrders();
    const userOrders = Array.isArray(allOrders) ? allOrders.filter(order => order.clientPhone === currentPhone) : [];
    const orderNumber = (userOrders.length > 0 ? Math.max(...userOrders.map(order => order.orderNumber)) : 0) + 1;

    const orderId = `order_${currentPhone}_${Date.now()}`;
    const features = selectedPackages.tariffFeatures?.map(f => f.text) || [];
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
    };

    await saveOrder(newOrder);
    orderCreatedRef.current = true;
    return orderId;
  }, [selectedPackages, totalPrice]);

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(async () => {
      const orderId = await createOrder();
      if (orderId) {
        router.push(`/order/${orderId}`);
      } else {
        router.push("/profile");
      }
    }, 2500);
  };

  if (!selectedPackages) return <div className="min-h-screen bg-[var(--bg-color)]" />;

  return (
    <div className="h-screen bg-[var(--bg-color)] text-[var(--text-primary)] flex flex-col items-center transition-colors duration-300 overflow-hidden">

      {/* Header - Precise match to sbp.css line 311 (Top Bar) */}
      <header className="w-full h-[102px] border-b border-[var(--border-color)] flex items-center justify-between px-[24px] pt-[56px] pb-[14px] relative shrink-0 transition-colors duration-300">
        <button
          onClick={() => router.back()}
          className="w-[32px] h-[32px] flex items-center justify-center active:scale-90 transition-transform z-10 text-[var(--text-primary)]"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19L5 12L12 5" />
          </svg>
        </button>
        <span className="absolute left-1/2 -translate-x-1/2 top-[56px] text-[24px] font-bold text-[var(--text-primary)] h-[29px] flex items-center transition-colors duration-300">
          Оплата
        </span>
        <div className="w-[32px]" />
      </header>

      {/* Main Content Area - Center aligned vertically like "QR и кнопка" frame */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-[375px] px-[24px] gap-[32px]">

        {/* QR Section - gap 26px */}
        <div className="flex flex-col items-center gap-[26px]">
          <h2 className="text-[24px] font-bold text-[var(--text-primary)] text-center leading-[120%] transition-colors duration-300">
            Отсканируйте QR код
          </h2>

          {/* QR Code Container with white background for scannability in all themes */}
          <div className="bg-white p-4 rounded-[24px] shadow-sm">
            <img 
              src="/sbp_qr.png" 
              alt="SBP QR Code" 
              className="w-[245px] h-[245px] object-contain transition-opacity duration-300"
            />
          </div>
        </div>

        {/* Price Section - sbp.css line 156 (32px bold) */}
        <div className="w-full flex flex-col items-center">
          <span className="text-[32px] font-bold text-[var(--text-primary)] leading-[120%] tracking-tight h-[38px] flex items-center transition-colors duration-300">
            {totalPrice.toLocaleString()} ₽
          </span>
        </div>

        {/* Action Button Section - sbp.css "Кнопка банка" */}
        <div className="w-full flex flex-col items-center gap-[12px]">
          <span className="text-[var(--text-secondary)] text-[16px] font-normal leading-[150%] h-[24px] flex items-center transition-colors duration-300">или</span>
          <button
            onClick={handlePay}
            disabled={isProcessing}
            className="w-full h-[56px] bg-[var(--text-primary)] rounded-full flex items-center justify-center active:scale-95 transition-all"
          >
            <span className="text-[var(--bg-color)] text-[16px] font-bold leading-[120%] h-[19px] flex items-center transition-colors duration-300">
              {isProcessing ? "Обработка..." : "Перейти в приложение банка"}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
}

export default function PayPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg-color)]" />}>
      <PayContent />
    </Suspense>
  );
}
