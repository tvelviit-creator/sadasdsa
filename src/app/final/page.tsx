"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import DesktopView from "./DesktopView";
import MobileView from "./MobileView";
import { getServiceById, getServices, type Service } from "@/utils/services";

interface SelectedPackages {
  serviceId?: string;
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
  partnerAvatar?: string;
  serviceImage?: string;
}

function FinalContent() {
  const router = useRouter();
  const [selectedPackages, setSelectedPackages] = useState<SelectedPackages | null>(null);
  const [isAgreed, setIsAgreed] = useState<boolean>(false);
  const [showPayment, setShowPayment] = useState<boolean>(false);

  useEffect(() => {
    const saved = localStorage.getItem("selectedPackages");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        
        // Auto-repair: if serviceImage is missing but serviceId/serviceName exists, try to get it
        if (!parsed.serviceImage && parsed.serviceId) {
          const service = getServiceById(parsed.serviceId);
          if (service && service.coverImage) {
            parsed.serviceImage = service.coverImage;
          }
        } else if (!parsed.serviceImage && parsed.serviceName) {
           // Fallback search by name if ID is missing (old sessions)
           const allServices = getServices();
           const service = allServices.find((s: Service) => s.name === parsed.serviceName);
           if (service && service.coverImage) {
              parsed.serviceImage = service.coverImage;
           }
        }

        setSelectedPackages(parsed);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  if (!selectedPackages) return <div className="min-h-screen bg-[var(--bg-color)] animate-pulse" />;

  const totalPrice = (selectedPackages.tariffPrice || 0) + (selectedPackages.designPrice || 0);
  const executorName = selectedPackages.partnerName || "ООО \"Твэлви\"";
  const executorAvatar = selectedPackages.partnerAvatar;

  const viewProps = {
    router,
    selectedPackages,
    totalPrice,
    isAgreed,
    setIsAgreed,
    executorName,
    executorAvatar,
    showPayment,
    setShowPayment
  };

  return (
    <>
      <DesktopView {...viewProps} />
      <MobileView {...viewProps} />
    </>
  );
}

export default function FinalPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A0A0B]" />}>
      <FinalContent />
    </Suspense>
  );
}
