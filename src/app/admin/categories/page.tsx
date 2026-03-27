"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCategories, Category, deleteCategory } from "@/utils/categories";
import { getServices } from "@/utils/services";

// Exact SVG Paths from the design
const CategoryIcons: Record<string, React.ReactNode> = {
  "Приложения": (
    <svg width="24" height="24" viewBox="61 155 14 26" fill="none">
      <path d="M61 159.623V176.378C61 177.996 61 178.804 61.3052 179.422C61.5736 179.965 62.0017 180.408 62.5285 180.685C63.1269 181 63.9106 181 65.4757 181H70.5243C72.0894 181 72.872 181 73.4704 180.685C73.9972 180.408 74.4267 179.965 74.6951 179.422C75 178.804 75 177.997 75 176.382V159.618C75 158.003 75 157.194 74.6951 156.577C74.4267 156.033 73.9972 155.592 73.4704 155.315C72.8714 155 72.0884 155 70.5203 155H65.4803C63.9121 155 63.1275 155 62.5285 155.315C62.0017 155.592 61.5736 156.033 61.3052 156.577C61 157.195 61 158.005 61 159.623Z" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  "Сайт": (
    <svg width="24" height="24" viewBox="55 260 26 24" fill="none">
      <path d="M55 263H55.0277M55.0277 263H80.9724M55.0277 263C55 263.472 55 264.053 55 264.8V279.2C55 280.88 55 281.719 55.3149 282.361C55.5918 282.926 56.0335 283.386 56.577 283.673C57.1944 284 58.003 284 59.6178 284L76.3822 284C77.997 284 78.8044 284 79.4218 283.673C79.9654 283.386 80.4085 282.926 80.6854 282.361C81 281.72 81 280.881 81 279.205L81 264.795C81 264.05 81 263.471 80.9724 263M55.0277 263C55.0623 262.412 55.1401 261.994 55.3149 261.638C55.5918 261.073 56.0335 260.615 56.577 260.327C57.195 260 58.0046 260 59.6225 260H76.3781C77.996 260 78.8038 260 79.4218 260.327C79.9654 260.615 80.6854 261.073 80.6854 261.638C80.8602 261.994 80.9379 262.412 80.9724 263M80.9724 263H81" stroke="var(--text-primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  "Игра": (
    <svg width="24" height="24" viewBox="55 369 26 14" fill="none">
      <path d="M59 376L64 376M61.5 373.5L61.5 378.5M59.622 369L76.3775 369C77.9954 369 78.805 369 79.423 369.305C79.9665 369.574 80.4082 370.002 80.6851 370.529C81 371.127 81 371.912 81 373.48L81 378.52C81 380.088 81 380.871 80.6851 381.47C80.4082 381.997 79.9665 382.427 79.423 382.695C78.8056 383 77.997 383 76.3822 383L59.6178 383C58.003 383 57.1956 383 56.5782 382.695C56.0346 382.427 55.5915 381.997 55.3146 381.47C55 380.872 55 380.089 55 378.524L55 373.476C55 371.911 55 371.127 55.3146 370.529C55.5915 370.002 56.0346 369.574 56.5782 369.305C57.1962 369 58.004 369 59.622 369ZM72 376L72 376.003L71.9971 376.003L71.9972 376L72 376ZM77.0028 376.003L77.0028 376.006L76.9999 376.006L77 376.003L77.0028 376.003ZM74.5026 373.5L74.5026 373.503L74.4998 373.503L74.4998 373.5L74.5026 373.5ZM74.5025 378.5L74.5025 378.503L74.4996 378.503L74.4997 378.5L74.5025 378.5Z" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  "UX/UI Дизайн": (
    <svg width="24" height="24" viewBox="58 469 20 22" fill="none">
      <path d="M58 476.333V489.044C58 489.729 58 490.071 58.1211 490.332C58.2276 490.562 58.3975 490.75 58.6065 490.867C58.844 491 59.155 491 59.776 491H71.3333M73.5554 475.111L69.111 480L66.8888 477.556M62.4444 482.2V472.911C62.4444 471.542 62.4444 470.857 62.6866 470.334C62.8996 469.874 63.2394 469.501 63.6575 469.266C64.1328 469 64.7556 469 66.0001 469H74.4445C75.689 469 76.311 469 76.7863 469.266C77.2044 469.501 77.5447 469.874 77.7578 470.334C78 470.857 78 471.542 78 472.911L78 482.2C78 483.569 78 484.253 77.7578 484.776C77.5447 485.236 77.2044 485.611 76.7863 485.845C76.3114 486.111 75.6903 486.111 74.4482 486.111H65.9965C64.7544 486.111 64.1324 486.111 63.6575 485.845C63.2394 485.611 62.8996 484.776 62.6866 484.776C62.4444 484.253 62.4444 483.569 62.4444 482.2Z" stroke="var(--text-primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  "AI и умные боты": (
    <svg width="24" height="24" viewBox="57 573 22 22" fill="none">
      <path d="M72.7275 577.452H75.9534C76.1573 577.452 77.2362 577.47 78.1086 578.278C78.981 579.087 79 580.089 79 580.275V588.815C79 589.037 78.9864 590.175 78.008 591.107C76.9889 592.074 75.698 592.086 75.4724 592.084H72.4421L69.295 595L66.1316 592.069H62.4817C62.2506 592.056 61.2886 591.976 60.4977 591.23C59.7286 590.507 59.6443 589.644 59.628 589.424V586.715M57 577.495L60.0792 575.909L61.7805 573L63.4682 575.959L66.5528 577.495L63.46 579.062L61.7778 581.905L60.0656 579.072L57 577.495ZM66.4577 585.34C67.1561 585.113 67.8519 584.886 68.5503 584.66C68.7977 584.043 69.045 583.423 69.2923 582.806L70.0777 584.682C70.7707 584.902 71.4637 585.121 72.1568 585.34C71.461 585.587 70.768 585.833 70.0723 586.083C69.8168 586.742 69.5613 587.402 69.3059 588.062C69.0504 587.402 68.7977 586.745 68.5422 586.085C67.8464 585.836 67.1507 585.589 66.455 585.34H66.4577Z" stroke="var(--text-primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  "Доработка и поддержка": (
    <svg width="24" height="24" viewBox="57 678 22 20" fill="none">
      <path d="M58.2222 680.5H77.7778M72.8889 693H69.2222M63.1111 688L65.5556 690.5L63.1111 693M57 694V682C57 680.6 57 679.9 57.2664 679.365C57.5008 678.894 57.8745 678.512 58.3344 678.272C58.8573 678 59.5423 678 60.9113 678H75.0891C76.4581 678 77.1417 678 77.6646 678.272C78.1245 678.512 78.4995 678.894 78.7338 679.365C79 679.899 79 680.599 79 681.996V694.004C79 695.401 79 696.1 78.7338 696.634C78.4995 697.105 78.1245 697.488 77.6646 697.728C77.1422 698 76.459 698 75.0927 698L60.9074 698C59.541 698 58.8568 698 58.3344 697.728C57.8745 697.488 57.5008 697.105 57.2664 696.634C57 696.099 57 695.4 57 694Z" stroke="var(--text-primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  "Трафик": (
    <svg width="24" height="24" viewBox="56 803 24 18" fill="none">
      <path d="M76.184 803C77.3829 804.15 78.3401 805.541 78.9964 807.087C79.6527 808.632 79.9942 810.3 79.9999 811.986C80.0057 813.673 79.6754 815.343 79.0296 816.893C78.3838 818.443 77.4361 819.841 76.2451 821M72.9104 806.612C73.6297 807.302 74.204 808.136 74.5978 809.064C74.9916 809.991 75.1965 810.992 75.2 812.004C75.2034 813.016 75.0053 814.018 74.6178 814.948C74.2303 815.878 73.6617 816.716 72.947 817.412M62.5764 816.236L64.5866 818.795C65.6346 820.129 66.1586 820.797 66.6176 820.869C67.015 820.932 67.4166 820.786 67.6873 820.48C68 820.127 68 819.269 68 817.554V806.505C68 804.79 68 803.932 67.6873 803.579C67.4166 803.273 67.015 803.127 66.6176 803.19C66.1586 803.262 65.6346 803.93 64.5866 805.264L62.5764 807.823C62.3647 808.093 62.2588 808.228 62.1278 808.325C62.0118 808.411 61.8818 808.474 61.7439 808.513C61.5882 808.557 61.4198 808.557 61.083 808.557H59.375C58.4676 808.557 58.0138 808.557 57.6472 808.682C56.9256 808.927 56.3595 809.509 56.1211 810.252C56 810.629 56 811.096 56 812.03C56 812.963 56 813.43 56.1211 813.807C56.3595 814.55 56.9256 815.132 57.6472 815.377C58.0138 815.502 58.4676 815.502 59.375 815.502H61.083C61.4198 815.502 61.5882 815.502 61.7439 815.546C61.8818 815.585 62.0118 815.649 62.1278 815.734C62.2588 815.831 62.3647 815.966 62.5764 816.236Z" stroke="var(--text-primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

export default function AdminCategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    setCategories(getCategories());
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] font-sans flex justify-center w-full">
      <div className="w-full max-w-[375px] md:max-w-none relative min-h-screen bg-transparent flex flex-col items-center mx-auto md:mx-0">
        {/* Mobile Background Elements */}
        <div className="md:hidden fixed inset-0 z-[-1] pointer-events-none opacity-[0.03]" style={{ backgroundImage: `radial-gradient(white 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
        <div className="md:hidden fixed top-[-10%] right-[-10%] w-[60%] h-[60%] bg-[var(--accent-cyan)]/5 blur-[100px] rounded-full pointer-events-none z-[-1]" />
        <div className="md:hidden fixed bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-500/5 blur-[100px] rounded-full pointer-events-none z-[-1]" />

        {/* Desktop Header */}
        <header className="hidden md:flex items-center justify-between pt-12 pb-8 px-12 top-0 z-[90] w-full">
          <div className="flex flex-col gap-1">
            <h1 className="text-4xl font-black font-cera text-[var(--text-primary)] uppercase">
              Категории <span className="text-[var(--text-secondary)] opacity-50 text-2xl ml-3">{categories.length}</span>
            </h1>
            <p className="text-sm font-medium text-[var(--text-secondary)] mt-1">Управление категориями и услугами</p>
          </div>
          <div className="flex items-center gap-4">
             <button
               onClick={() => router.push('/admin/categories/add')}
               className="h-12 px-6 bg-white text-black font-bold rounded-xl active:scale-95 transition-all text-sm hover:bg-[#92FFF4] shadow-lg flex items-center gap-2"
             >
               + Добавить
             </button>
          </div>
        </header>

        {/* Mobile Header - Top Bar Exact SVG Match */}
        <header className="fixed top-0 w-full max-w-[375px] h-[100px] z-50 bg-black/40 backdrop-blur-3xl border-b border-white/5 shadow-2xl transition-colors duration-300 md:hidden">
          <svg width="375" height="100" viewBox="0 0 375 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full absolute -z-10 left-0 bottom-0 pointer-events-none">
            <mask id="path-1-inside-1_158_5456" fill="white">
              <path d="M0 0H375V100H0V0Z" />
            </mask>
            <path d="M0 0H375V100H0V0Z" fill="transparent" />
            <path d="M375 100V99H0V100V101H375V100Z" fill="transparent" mask="url(#path-1-inside-1_158_5456)" />
            <path d="M43.856 79.5L37.064 71.244V79.5H33.824V63.66H37.064V71.004L43.112 63.66H46.976L40.904 71.124L47.768 79.5H43.856ZM54.2066 67.356C55.7586 67.356 56.9906 67.796 57.9026 68.676C58.8306 69.54 59.2946 70.796 59.2946 72.444V79.5H56.3186V78.348C55.8866 78.796 55.3586 79.148 54.7346 79.404C54.1266 79.66 53.4466 79.148 53.1174 79.404C52.5094 79.66 51.8294 79.788 51.0774 79.788C49.8134 79.788 48.8134 79.46 48.0774 78.804C47.3414 78.132 46.9734 77.276 46.9734 76.236C46.9734 75.164 47.3734 74.324 48.1734 73.716C48.9894 73.092 50.0854 72.78 51.4614 72.78H54.4374V72.252C54.4374 71.596 54.2454 71.084 53.8614 70.716C53.4934 70.348 52.9494 70.164 52.2294 70.164C51.6214 70.164 51.0774 70.3 50.5974 70.572C50.1174 70.828 49.6134 71.236 49.0854 71.796L47.4054 69.804C48.7814 68.172 50.5094 67.356 52.5894 67.356ZM51.9414 77.412C52.6454 77.412 53.2374 77.196 53.7174 76.764C54.1974 76.316 54.4374 75.748 54.4374 75.06V74.916H51.8934C51.3654 74.916 50.9574 75.02 50.6694 75.228C50.3814 75.42 50.2374 75.716 50.2374 76.116C50.2374 76.516 50.3894 76.836 50.6934 77.076C51.0134 77.3 51.4294 77.412 51.9414 77.412ZM64.5543 70.356H60.9063V67.62H71.4423V70.356H67.7703V79.5H64.5543V70.356ZM84.3014 74.652H75.9734C76.1654 75.404 76.5494 75.988 77.1254 76.404C77.7174 76.804 78.4454 77.004 79.3094 77.004C80.4774 77.004 81.5814 76.604 82.6214 75.804L83.9654 78.012C82.5574 79.196 80.9734 79.788 79.2134 79.788C77.9814 79.788 76.8694 79.516 75.8774 78.972C74.8854 78.428 74.1094 77.684 73.5494 76.74C72.9894 75.78 72.7094 74.724 72.7094 73.572C72.7094 72.42 72.9814 71.372 73.5254 70.428C74.0694 69.468 74.8134 68.716 75.7574 68.172C76.7174 67.628 77.7734 67.356 78.9254 67.356C80.0134 67.356 80.9814 67.604 81.8294 68.1C82.6774 68.58 83.3334 69.244 83.7974 70.092C84.2774 70.924 84.5174 71.852 84.5174 72.876C84.5174 73.452 84.4454 74.044 84.3014 74.652ZM78.8054 69.972C78.1174 69.972 77.5174 70.188 77.0054 70.62C76.4934 71.052 76.1494 71.636 75.9734 72.372H81.3734C81.3574 71.636 81.1014 71.052 80.6054 70.62C80.1094 70.188 79.5094 69.972 78.8054 69.972ZM87.1175 67.62H95.8535V70.356H90.3335V79.5H87.1175V67.62ZM103.256 79.764C102.088 79.764 101.016 79.492 100.04 78.948C99.0804 78.388 98.3204 77.636 97.7604 76.692C97.2004 75.732 96.9204 74.684 96.9204 73.548C96.9204 72.412 97.2004 71.372 97.7604 70.428C98.3204 69.468 99.0884 68.716 100.064 68.172C101.04 67.628 102.112 67.356 103.28 67.356C104.448 67.356 105.52 67.636 106.496 68.196C107.472 68.74 108.24 69.484 108.8 70.428C109.376 71.372 109.664 72.412 109.664 73.548C109.664 74.684 109.376 75.732 108.8 76.692C108.24 77.636 107.464 78.388 106.472 78.948C105.496 79.492 104.424 79.764 103.256 79.764ZM103.28 76.788C104.16 76.788 104.888 76.484 105.464 75.876C106.056 75.268 106.352 74.5 106.352 73.572C106.352 72.644 106.056 71.868 105.464 71.244C104.888 70.62 104.16 70.308 103.28 70.308C102.384 70.308 101.648 70.62 101.072 71.244C100.496 71.852 100.208 72.628 100.208 73.572C100.208 74.5 100.496 75.268 101.072 75.876C101.648 76.484 102.384 76.788 103.28 76.788ZM118.986 67.356C120.09 67.356 121.074 67.628 121.938 68.172C122.818 68.7 123.506 69.436 124.002 70.38C124.498 71.308 124.746 72.364 124.746 73.548C124.746 74.732 124.498 75.796 124.002 76.74C123.506 77.684 122.818 78.428 121.938 78.972C121.074 79.516 120.09 79.788 118.986 79.788C118.266 79.788 117.602 79.668 116.994 79.428C116.386 79.172 115.866 78.812 115.434 78.348V83.82H112.194V67.62H115.17V69.108C115.57 68.548 116.098 68.116 116.754 67.812C117.426 67.508 118.17 67.356 118.986 67.356ZM118.386 76.836C119.25 76.836 119.978 76.54 120.57 75.948C121.162 75.34 121.458 74.548 121.458 73.572C121.458 72.58 121.162 71.788 120.57 71.196C119.994 70.588 119.266 70.284 118.386 70.284C117.57 70.284 116.866 70.564 116.274 71.124C115.682 71.668 115.386 72.476 115.386 73.548C115.386 74.604 115.674 75.42 116.25 75.996C116.842 76.556 117.554 76.836 118.386 76.836ZM138.28 67.356V79.5H135.04V73.068L128.416 79.788H127.36V67.62H130.576V74.1L137.224 67.356H138.28ZM152.553 67.356V79.5H149.313V73.068L142.689 79.788H141.633V67.62H144.849V74.1L151.497 67.356H152.553" fill="var(--text-primary)" />
            <rect x="271" y="56" width="80" height="32" rx="16" fill="var(--text-primary)" />
            <path d="M319.485 72H311M311 72H302.515M311 72V63.5147M311 72V80.4853" stroke="var(--bg-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

          {/* Invisible Hit Area for Add Button */}
          <button
            onClick={() => router.push("/admin/categories/add")}
            className="absolute right-[24px] bottom-[12px] w-[80px] h-[32px] bg-transparent border-none outline-none cursor-pointer active:opacity-60 transition-opacity"
            aria-label="Add Category"
          />
        </header>

        {/* Categories List */}
        <main className="pt-[150px] md:pt-4 px-[24px] md:px-12 pb-40 flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[16px] md:gap-[20px] items-start w-full">
          {categories.map((cat) => {
            const serviceCount = getServices(cat.id).length;
            const IconComponent = CategoryIcons[cat.name] || (
              <div className="w-[32px] h-[32px] border-2 border-[var(--border-color)] rounded-md" />
            );

            return (
              <div
                key={cat.id}
                onClick={() => router.push(`/admin/categories/edit/${cat.id}`)}
                className="w-full h-[88px] bg-black/40 backdrop-blur-md rounded-[24px] px-[16px] flex items-center gap-[16px] border border-white/5 shadow-lg md:bg-[var(--card-bg)] md:border-[var(--border-color)] hover:shadow-xl hover:border-white/10 md:hover:border-[#92FFF4]/30 active:scale-[0.98] transition-all cursor-pointer relative"
              >
                {/* Icon Box */}
                <div className="w-[56px] h-[56px] bg-[var(--border-color)] rounded-[8px] flex items-center justify-center shrink-0">
                  {cat.iconImage ? (
                    <img src={cat.iconImage} alt="" className="w-9 h-9 object-contain" />
                  ) : (
                    IconComponent
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-center min-w-0">
                  <h3 className="text-[18px] font-bold text-[var(--text-primary)] truncate leading-none mb-4">
                    {cat.name}
                  </h3>

                  <div className="flex items-center w-full gap-[4px] h-[20px]">
                    <span className="text-[13px] text-[var(--text-secondary)] font-medium shrink-0">Услуг</span>
                    {/* Dotted separator line */}
                    <div 
                      className="flex-1 h-[2px] opacity-40" 
                      style={{ 
                        backgroundImage: `radial-gradient(circle, var(--border-color) 1px, transparent 1px)`, 
                        backgroundSize: '4px 1px',
                        backgroundRepeat: 'repeat-x',
                        backgroundPosition: 'bottom'
                      }} 
                    />
                    <span className="text-[15px] text-[var(--text-primary)] font-bold shrink-0">{serviceCount}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {categories.length === 0 && (
            <div className="py-20 text-center text-[var(--text-secondary)] text-[13px] font-bold opacity-30 uppercase tracking-widest">
              Список пуст
            </div>
          )}
        </main>

      </div>

      <style jsx global>{`
        body { 
          background-color: var(--bg-color); 
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }
      `}</style>
    </div>
  );
}
