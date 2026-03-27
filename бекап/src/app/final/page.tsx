"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";

// Custom gear-styled check icon from user design
const CustomCheckIcon = ({ color = "var(--text-primary)" }: { color?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-colors duration-300">
    <path d="M15 9.99981L11 13.9998L8.99995 11.9998M13.246 3.45879L14.467 4.49929C14.7746 4.76143 15.1566 4.91991 15.5594 4.95206L17.1585 5.0795C18.0986 5.15452 18.8453 5.9008 18.9204 6.84093L19.0475 8.44024C19.0797 8.8431 19.2387 9.22559 19.5008 9.53319L20.5409 10.7538C21.1526 11.4716 21.1527 12.5275 20.541 13.2454L19.5009 14.4662C19.2388 14.7738 19.08 15.1564 19.0478 15.5593L18.9199 17.1583C18.8449 18.0984 18.0993 18.8452 17.1591 18.9202L15.5595 19.0478C15.1567 19.08 14.7744 19.2381 14.4667 19.5002L13.246 20.5407C12.5282 21.1525 11.4717 21.1526 10.7539 20.5409L9.53316 19.5003C9.22555 19.2382 8.84325 19.0798 8.44038 19.0477L6.84077 18.9202C5.90064 18.8452 5.15505 18.0986 5.08003 17.1585L4.9521 15.5594C4.91995 15.1565 4.76111 14.7742 4.49898 14.4666L3.45894 13.2454C2.84721 12.5276 2.84693 11.472 3.45865 10.7542L4.49963 9.53301C4.76176 9.22541 4.91908 8.84311 4.95122 8.44024L5.07915 6.84112C5.15417 5.90099 5.90192 5.15442 6.84205 5.0794L8.43989 4.95196C8.84276 4.91981 9.22525 4.76146 9.53285 4.49932L10.754 3.45879C11.4718 2.84707 12.5282 2.84707 13.246 3.45879Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

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
  partnerAvatar?: string;
}

function FinalContent() {
  const router = useRouter();
  const [selectedPackages, setSelectedPackages] = useState<SelectedPackages | null>(null);
  const [isAgreed, setIsAgreed] = useState<boolean>(false);

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

  if (!selectedPackages) return <div className="min-h-screen bg-[var(--bg-color)]" />;

  const isPartnerService = !!selectedPackages.partnerName;
  const executorName = selectedPackages.partnerName || "ООО \"Твэлви\"";
  const executorAvatar = selectedPackages.partnerAvatar;

  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] flex flex-col pb-40 transition-colors duration-300">

      {/* 1. Progress Bar (Sticky Top or just Top) */}
      <div className="px-6 pt-14 mb-6">
        <div className="flex gap-2">
          {[1, 2, 3].map((step) => (
            <div key={step} className="h-[6px] flex-1 rounded-full bg-[var(--border-color)] overflow-hidden transition-colors duration-300">
              <div
                className={`h-full bg-[var(--text-primary)] transition-all duration-500 ${step === 1 ? 'w-full' :
                  step === 2 ? 'w-full' :
                    'w-1/3' /* Step 3 partial fill based on screenshot */
                  }`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 2. Header */}
      <header className="px-6 flex items-center justify-between mb-8 relative">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 flex items-center justify-center active:scale-95 z-20 text-[var(--text-primary)] transition-colors duration-300"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 19L5 12L12 5" />
          </svg>
        </button>
        <h1 className="text-[20px] font-bold absolute left-1/2 -translate-x-1/2 tracking-tight">
          {selectedPackages.serviceName}
        </h1>
        <div className="w-10" />
      </header>

      {/* Content List */}
      <div className="px-6 space-y-8">

        {/* Section: App Name */}
        <div className="border-b border-[var(--border-color)] pb-6 transition-colors duration-300">
          <p className="text-[var(--text-secondary)] text-[15px] font-medium mb-1">Приложение</p>
          <h2 className="text-[24px] font-normal text-[var(--text-primary)] transition-colors duration-300">{selectedPackages.serviceName}</h2>
        </div>

        {/* Section: Executor */}
        <div className="border-b border-[var(--border-color)] pb-6 transition-colors duration-300">
          <div className="flex items-center gap-4">
            <div className="w-[48px] h-[48px] rounded-[12px] overflow-hidden flex items-center justify-center shrink-0">
              {executorAvatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={executorAvatar} alt={executorName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[var(--accent-color)] flex items-center justify-center transition-colors duration-300">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                </div>
              )}
            </div>
            <div>
              <p className="text-[var(--text-secondary)] text-[13px] font-medium mb-0.5">Исполнитель</p>
              <h3 className="text-[16px] text-[var(--text-primary)] font-normal transition-colors duration-300">{executorName}</h3>
            </div>
          </div>
        </div>

        {/* Section: Tariff (Packet) */}
        <div>
          <p className="text-[var(--text-secondary)] text-[15px] font-medium mb-1">Пакет</p>
          <h2 className="text-[28px] font-normal text-[var(--text-primary)] mb-2 transition-colors duration-300">{selectedPackages.tariffName}</h2>
          <p className="text-[var(--text-secondary)] text-[14px] mb-6 transition-colors duration-300">{selectedPackages.tariffDescription || "Больше возможностей для бизнеса"}</p>

          <div className="space-y-4">
            {selectedPackages.tariffFeatures?.map((f, i) => (
              <div key={i} className="flex items-start gap-4">
                <CustomCheckIcon />
                <span className="text-[15px] text-[var(--text-secondary)] leading-snug transition-colors duration-300">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="h-[1px] bg-[var(--border-color)] w-full transition-colors duration-300" />

        {/* Section: Design */}
        <div>
          <p className="text-[var(--text-secondary)] text-[15px] font-medium mb-1">Дизайн</p>
          <h2 className="text-[28px] font-normal text-[var(--text-primary)] mb-2 transition-colors duration-300">{selectedPackages.designName}</h2>
          <p className="text-[var(--text-secondary)] text-[14px] transition-colors duration-300">
            {selectedPackages.designDescription || "Полный дизайн-пакет с разработкой индивидуального стиля"}
          </p>
        </div>

        <div className="h-[1px] bg-[var(--border-color)] w-full transition-colors duration-300" />

        {/* Section: Total */}
        <div>
          <p className="text-[var(--text-secondary)] text-[15px] font-bold mb-1">Итого</p>
          <p className="text-[36px] font-bold text-[var(--text-primary)] transition-colors duration-300">{totalPrice.toLocaleString()} ₽</p>
        </div>

        {/* Agreement Radio/Checkbox */}
        <div
          onClick={() => setIsAgreed(!isAgreed)}
          className="flex items-start gap-4 cursor-pointer pt-2"
        >
          <div className={`
             w-6 h-6 rounded-full border-[2px] transition-all mt-1 flex items-center justify-center shrink-0
             ${isAgreed ? 'border-[var(--text-primary)] bg-[var(--text-primary)]' : 'border-[var(--text-primary)] bg-transparent'}
          `}>
            {isAgreed && <div className="w-2.5 h-2.5 rounded-full bg-[var(--bg-color)]" />}
          </div>
          <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed transition-colors duration-300">
            Согласен с условиями <span className="text-[var(--accent-cyan)] border-b border-[var(--accent-cyan)]/30 pb-0.5">Правил пользования площадкой</span> и <span className="text-[var(--accent-cyan)] border-b border-[var(--accent-cyan)]/30 pb-0.5">Условиями возврата</span>
          </p>
        </div>

      </div>

      {/* Floating Pay Button */}
      <div className="fixed bottom-6 left-0 right-0 z-50 px-6 flex justify-center">
        <button
          onClick={() => router.push("/pay")}
          disabled={!isAgreed}
          className={`
            w-full max-w-[327px] h-[56px] rounded-full font-bold text-[16px] transition-all flex items-center justify-center tracking-tight shadow-xl
            ${isAgreed
              ? 'bg-[var(--text-primary)] text-[var(--bg-color)] active:scale-95'
              : 'bg-[var(--nav-btn)] text-[var(--text-secondary)] cursor-not-allowed'}
          `}
        >
          Оплатить через СБП
        </button>
      </div>

    </div>
  );
}

export default function FinalPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A0A0B]" />}>
      <FinalContent />
    </Suspense>
  );
}
