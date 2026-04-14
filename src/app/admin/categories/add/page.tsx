"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { saveCategory } from "@/utils/categories";
import { DefaultCategoryCover } from "@/components/DefaultCategoryCover";
import { DefaultCategoryIcon } from "@/components/DefaultCategoryIcon";
import { getCategoryCover } from "@/components/CategoryCovers";

export default function AddCategoryPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [iconImage, setIconImage] = useState<string | null>(null);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const iconInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console.log("TVELV_DEBUG: AddCategoryPage Loaded at /admin/categories/add");
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'icon' | 'cover') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (type === 'icon') {
          setIconImage(result);
        } else if (type === 'cover') {
          setCoverImage(result);
        }
      };
      reader.readAsDataURL(file);
    }
    // Reset input value so same file can be selected again
    e.target.value = "";
  };

  const handleNameBlur = async () => {
    if (name.trim()) {
      const newId = `cat_${Date.now()}`;
      await saveCategory({
        id: newId,
        name: name.trim(),
        iconImage: iconImage || "",
        coverImage: coverImage || "",
        createdAt: new Date().toISOString(),
      });
      router.replace(`/admin/categories/edit/${newId}`);
    }
  };

  const isFormValid = name.trim().length > 0;

  const handleSaveAndAddService = async () => {
    if (!isFormValid) return;
    const newId = `cat_${Date.now()}`;
    await saveCategory({
      id: newId,
      name: name.trim(),
      iconImage: iconImage || "",
      coverImage: coverImage || "",
      createdAt: new Date().toISOString(),
    });
    router.push(`/admin/categories/${newId}/services/add`);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] font-sans overflow-x-hidden hide-scrollbar">
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Main Container 375px */}
      <div className="relative w-full max-w-[375px] min-h-screen mx-auto bg-[var(--bg-color)] flex flex-col pt-[150px] pb-[100px] px-[24px]">

        {/* Top Bar - Exact 1:1 SVG match from prompt */}
        <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[375px] h-[102px] z-50">
          <svg width="375" height="102" viewBox="0 0 375 102" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <mask id="path-1-inside-1_1311_3780_add" fill="white">
              <path d="M0 0H375V102H0V0Z" />
            </mask>
            <path d="M0 0H375V102H0V0Z" fill="var(--bg-color)" />
            <path d="M375 102V101H0V102V103H375V102Z" fill="var(--border-color)" mask="url(#path-1-inside-1_1311_3780_add)" />

            {/* Back Arrow */}
            <path d="M51 72L29 72M29 72L38.4286 81M29 72L38.4286 63" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

            {/* Trash Icon (Decorative to match design exactly) */}
            <path d="M337.5 69.5556V78.1111M332.5 69.5556V78.1111M327.5 64.6667V79.0889C327.5 80.4579 327.5 81.1419 327.772 81.6648C328.012 82.1248 328.394 82.4995 328.865 82.7338C329.399 83 330.099 83 331.496 83H338.504C339.901 83 340.6 83 341.134 82.7338C341.605 82.4995 341.988 82.1248 342.228 81.6648C342.5 81.1425 342.5 80.459 342.5 79.0927V64.6667M327.5 64.6667H330M327.5 64.6667H325M330 64.6667H340M330 64.6667C330 63.5277 330 62.9585 330.19 62.5093C330.444 61.9103 330.93 61.4342 331.543 61.1861C332.002 61 332.585 61 333.75 61H336.25C337.415 61 337.997 61 338.457 61.1861C339.069 61.4342 339.556 61.9103 339.81 62.5093C340 62.9585 340 63.5277 340 64.6667M340 64.6667H342.5M342.5 64.6667H345" stroke="var(--logout-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

            {/* Категория (Decorative Title Paths) */}
            <path d="M142.135 80H138.223L131.431 71.744V80H128.191V64.16H131.431V71.504L137.479 64.16H141.343L135.271 71.624L142.135 80ZM153.662 72.944V80H150.686V78.848C149.758 79.808 148.55 80.288 147.062 80.288C145.814 80.288 144.814 79.96 144.062 79.304C143.326 78.648 142.958 77.792 142.958 76.736C142.958 75.664 143.358 74.824 144.158 74.216C144.974 73.592 146.07 73.28 147.446 73.28H150.422V72.752C150.422 72.08 150.23 71.568 149.846 71.216C149.478 70.848 148.934 70.664 148.214 70.664C147.622 70.664 147.086 70.792 146.606 71.048C146.126 71.304 145.614 71.72 145.07 72.296L143.39 70.304C144.766 68.672 146.494 67.856 148.574 67.856C150.142 67.856 151.382 68.304 152.294 69.2C153.206 70.08 153.662 71.328 153.662 72.944ZM150.422 75.56V75.416H147.878C146.774 75.416 146.222 75.816 146.222 76.616C146.222 77.016 146.374 77.336 146.678 77.576C146.998 77.8 147.414 77.912 147.926 77.912C148.646 77.912 149.238 77.696 149.702 77.264C150.182 76.816 150.422 76.248 150.422 75.56ZM158.922 80V70.856H155.274V68.12H165.81V70.856H162.138V80H158.922ZM178.669 75.152H170.341C170.533 75.904 170.917 76.488 171.493 76.904C172.085 77.304 172.813 77.504 173.677 77.504C174.845 77.504 175.949 77.104 176.989 76.304L178.333 78.512C176.909 79.696 175.325 80.288 173.581 80.288C171.757 80.32 170.205 79.728 168.925 78.512C167.661 77.28 167.045 75.8 167.077 74.072C167.045 72.36 167.645 70.888 168.877 69.656C170.109 68.424 171.581 67.824 173.293 67.856C174.925 67.856 176.261 68.384 177.301 69.44C178.357 70.496 178.885 71.808 178.885 73.376C178.885 73.952 178.813 74.544 178.669 75.152ZM170.341 72.872H175.741C175.725 72.152 175.469 71.576 174.973 71.144C174.493 70.696 173.893 70.472 173.173 70.472C172.485 70.472 171.885 70.688 171.373 71.12C170.861 71.552 170.517 72.136 170.341 72.872ZM181.485 80V68.12H190.221V70.856H184.701V80H181.485ZM191.288 74.048C191.256 72.352 191.872 70.888 193.136 69.656C194.4 68.424 195.904 67.824 197.648 67.856C199.392 67.824 200.896 68.424 202.16 69.656C203.44 70.888 204.064 72.352 204.032 74.048C204.064 75.744 203.44 77.216 202.16 78.464C200.88 79.696 199.368 80.296 197.624 80.264C195.88 80.296 194.376 79.696 193.112 78.464C191.864 77.216 191.256 75.744 191.288 74.048ZM199.832 76.376C200.424 75.768 200.72 75 200.72 74.072C200.72 73.144 200.424 72.368 199.832 71.744C199.256 71.12 198.528 70.808 197.648 70.808C196.752 70.808 196.016 71.12 195.44 71.744C194.864 72.352 194.576 73.128 194.576 74.072C194.576 75 194.864 75.768 195.44 76.376C196.016 76.984 196.752 77.288 197.648 77.288C198.528 77.288 199.256 76.984 199.832 76.376ZM217.457 69.632C218.561 70.8 219.113 72.272 219.113 74.048C219.113 75.824 218.561 77.312 217.457 78.512C216.369 79.696 215.001 80.288 213.353 80.288C211.865 80.288 210.681 79.808 209.801 78.848V84.32H206.561V68.12H209.537V69.608C210.353 68.44 211.625 67.856 213.353 67.856C215.001 67.856 216.369 68.448 217.457 69.632ZM215.825 74.072C215.825 73.096 215.537 72.304 214.961 71.696C214.385 71.088 213.649 70.784 212.753 70.784C211.889 70.784 211.169 71.072 210.593 71.648C210.033 72.224 209.753 73.024 209.753 74.048C209.753 75.072 210.033 75.88 210.593 76.472C211.169 77.048 211.889 77.336 212.753 77.336C213.633 77.336 214.361 77.032 214.937 76.424C215.529 75.816 215.825 75.032 215.825 74.072ZM231.591 67.856H232.647V80H229.407V73.568L222.783 80.288H221.727V68.12H224.943V74.6L231.591 67.856ZM240.584 68.12H245.96V80H242.744V76.352H241.472L238.544 80H234.896L238.256 75.896C237.456 75.576 236.832 75.096 236.384 74.456C235.952 73.816 235.736 73.072 235.736 72.224C235.736 70.976 236.176 69.984 237.056 69.248C237.936 68.496 239.112 68.12 240.584 68.12ZM242.744 73.736V70.856H240.704C240.192 70.856 239.784 70.984 239.48 71.24C239.176 71.496 239.024 71.84 239.024 72.272C239.024 72.72 239.176 73.08 239.48 73.352C239.784 73.608 240.192 73.736 240.704 73.736H242.744Z" fill="var(--text-primary)" />
          </svg>

          {/* Back button hit area */}
          <button
            onClick={() => router.back()}
            className="absolute left-[20px] bottom-[10px] w-[60px] h-[60px] z-10 active:opacity-60 transition-opacity"
          />
        </header>

        {/* Form Fields Stack */}
        <div className="flex flex-col gap-[24px]">

          {/* Text Field: Name */}
          <div className="flex flex-col gap-[4px] w-full">
            <div className="px-[8px] h-[24px] flex items-end">
              <span className="text-[16px] leading-[24px] font-normal text-[var(--text-primary)]">Название</span>
            </div>
            <div className="w-full h-[56px] bg-[var(--border-color)] rounded-[16px] flex items-center px-[16px]">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={handleNameBlur}
                placeholder="Приложения"
                className="w-full bg-transparent border-none outline-none text-[16px] leading-[24px] text-[var(--text-primary)] placeholder:text-[var(--text-primary)]/40"
              />
            </div>
          </div>

          {/* Icon/Preview Row */}
          <div className="flex items-center gap-[16px] w-full">
            {/* Category Card Preview */}
            <div className="w-[155px] h-[155px] bg-[var(--card-bg)] rounded-[24px] shrink-0 relative overflow-hidden">
              {coverImage ? (
                <>
                  <img src={coverImage} className="absolute inset-0 w-full h-full object-cover z-0" alt="" />
                  <div className="absolute inset-0 z-10 p-[16px] flex flex-col justify-between items-end bg-black/20">
                    <span className="w-full text-left text-[16px] font-bold leading-[1.2] text-[var(--text-primary)] line-clamp-2 drop-shadow-md">
                      {name || "Название"}
                    </span>
                    {/* UI-FIX: Removed icon overlay from the preview because the user finds it confusing/duplicated */}
                  </div>
                </>
              ) : (
                <div className="w-full h-full bg-[var(--card-bg)] flex items-center justify-center text-[var(--border-color)]">
                   <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                     <rect x="3" y="3" width="18" height="18" rx="2" strokeLinecap="round" />
                     <circle cx="8.5" cy="8.5" r="1.5" />
                     <path d="M21 15l-5-5L5 21" strokeLinecap="round" strokeLinejoin="round" />
                   </svg>
                </div>
              )}
            </div>

            {/* Small Icon Square */}
            <div className="flex flex-col items-center justify-center gap-[10px] w-full h-[155px]">
              {iconImage ? (
                <div className="flex flex-col items-center gap-[2px] p-[4px] w-full bg-[var(--bg-color)] rounded-[16px]">
                  <div
                    onClick={() => iconInputRef.current?.click()}
                    className="w-[52px] h-[52px] bg-[var(--card-bg)] rounded-[16px] flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
                  >
                    <img src={iconImage} className="w-full h-full object-cover" alt="Small icon" />
                  </div>
                  <span className="text-center text-[11px] font-bold leading-[1.2] text-[var(--text-primary)]">Иконка</span>
                </div>
              ) : (
                <div
                  onClick={() => iconInputRef.current?.click()}
                  className="w-full h-full cursor-pointer active:scale-[0.98] transition-all"
                >
                  <DefaultCategoryIcon className="w-full h-full" />
                </div>
              )}
            </div>
          </div>

          {/* Cover Section */}
          <div className="flex flex-col gap-[4px] w-full">
            <div className="px-[8px] h-[24px] flex items-end">
              <span className="text-[16px] leading-[24px] font-normal text-[var(--text-primary)]">Обложка</span>
            </div>

            <div
              onClick={() => coverInputRef.current?.click()}
              className="w-full h-[181px] relative flex items-center justify-center cursor-pointer transition-all active:scale-[0.99] group overflow-hidden"
            >
              {/* SVG Background/Frame */}
              <svg width="329" height="181" viewBox="0 0 329 181" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
                <rect x="1" y="1" width="327" height="179" rx="24" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="8 16"/>
                <path d="M164.5 52.4999V37.4999M164.5 37.4999L157.136 42.4999M164.5 37.4999L171.864 42.4999M191.5 49.9999C191.5 44.4771 187.104 39.9999 181.682 39.9999C181.624 39.9999 181.567 40.0004 181.509 40.0015C180.319 31.52 173.156 25 164.5 25C157.635 25 151.712 29.1001 148.96 35.027C142.561 35.4536 137.5 40.8745 137.5 47.4995C137.5 54.403 142.995 60 149.773 60L181.682 59.9998C187.104 59.9998 191.5 55.5227 191.5 49.9999Z" stroke="var(--text-secondary)" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>

              {/* Functional Center Content */}
              <div className="relative z-10 flex flex-col items-center gap-[20px] pt-[40px]">
                 <span className="text-[14px] font-medium text-[var(--text-secondary)] opacity-60">Загрузите файл обложки</span>
                  <button className="w-[279px] h-[44px] bg-[var(--nav-btn)] rounded-full flex items-center justify-center text-[var(--text-primary)] text-[16px] font-bold active:scale-95 transition-all shadow-lg">
                    Выбрать файл
                 </button>
              </div>
            </div>
          </div>

          {/* Icons Section */}
          <div className="flex flex-col gap-[4px] w-full">
            <div className="px-[8px] h-[24px] flex items-end">
              <span className="text-[16px] leading-[24px] font-normal text-[var(--text-primary)]">Иконки</span>
            </div>

            <div
              onClick={() => iconInputRef.current?.click()}
              className="w-full h-[181px] relative flex items-center justify-center cursor-pointer transition-all active:scale-[0.99] group overflow-hidden"
            >
              {/* SVG Background/Frame */}
              <svg width="329" height="181" viewBox="0 0 329 181" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
                <rect x="1" y="1" width="327" height="179" rx="24" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="8 16"/>
                <path d="M164.5 52.4999V37.4999M164.5 37.4999L157.136 42.4999M164.5 37.4999L171.864 42.4999M191.5 49.9999C191.5 44.4771 187.104 39.9999 181.682 39.9999C181.624 39.9999 181.567 40.0004 181.509 40.0015C180.319 31.52 173.156 25 164.5 25C157.635 25 151.712 29.1001 148.96 35.027C142.561 35.4536 137.5 40.8745 137.5 47.4995C137.5 54.403 142.995 60 149.773 60L181.682 59.9998C187.104 59.9998 191.5 55.5227 191.5 49.9999Z" stroke="var(--text-secondary)" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>

              {/* Functional Center Content */}
              <div className="relative z-10 flex flex-col items-center gap-[20px] pt-[40px]">
                 <span className="text-[14px] font-medium text-[var(--text-secondary)] opacity-60">Загрузите файл иконки</span>
                  <button className="w-[279px] h-[44px] bg-[var(--nav-btn)] rounded-full flex items-center justify-center text-[var(--text-primary)] text-[16px] font-bold active:scale-95 transition-all shadow-lg">
                    Выбрать файл
                 </button>
              </div>
            </div>
          </div>

          {/* Services Section - Active if name is entered */}
          <div className={`mt-[24px] flex flex-col gap-[16px] transition-all duration-500 ${!name.trim() ? 'opacity-20 pointer-events-none select-none' : 'opacity-100'}`}>
            <div className="flex items-center justify-between">
              <span className="text-[24px] font-bold text-[var(--text-primary)]">Услуги</span>
              <button
                onClick={handleSaveAndAddService}
                className="w-[80px] h-[32px] bg-[var(--text-primary)] rounded-full flex items-center justify-center active:scale-95 transition-transform"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="var(--bg-color)" strokeWidth="2">
                  <path d="M9 1V17M1 9H17" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <div className="py-[40px] text-center border border-dashed border-[var(--border-color)] rounded-[24px]">
              <span className="text-[13px] text-[var(--text-secondary)]">В этой категории пока нет услуг</span>
            </div>
          </div>

          {/* Hidden Inputs pushed to bottom, added key to force re-render on upload */}
          <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'cover')} />
          <input ref={iconInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'icon')} />
        </div>
      </div>
    </div>
  );
}
