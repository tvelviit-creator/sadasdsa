"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function TemaPage() {
  const router = useRouter();
  const [selectedTheme, setSelectedTheme] = useState<'auto' | 'day' | 'night'>('day');

  useEffect(() => {
    const saved = localStorage.getItem('app-theme') as 'auto' | 'day' | 'night';
    if (saved) setSelectedTheme(saved);
  }, []);

  const applyTheme = (theme: 'auto' | 'day' | 'night') => {
    const root = document.documentElement;
    root.classList.remove('day-theme', 'night-theme');
    
    if (theme === 'day') {
      root.classList.add('day-theme');
    } else if (theme === 'night') {
      root.classList.add('night-theme');
    } else {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add(isDark ? 'night-theme' : 'day-theme');
    }
  };

  const changeTheme = (theme: 'auto' | 'day' | 'night') => {
    setSelectedTheme(theme);
    localStorage.setItem('app-theme', theme);
    applyTheme(theme);
    
    // Also dispatch a custom event so other components can react if needed
    window.dispatchEvent(new Event('theme-change'));
  };

  // Icon colors based on selected theme (for the cards themselves)
  const getIconColor = (theme: 'auto' | 'day' | 'night') => {
    return selectedTheme === theme ? "var(--text-primary)" : "var(--text-secondary)";
  };

  const getCardStroke = (theme: 'auto' | 'day' | 'night') => {
    return selectedTheme === theme ? "var(--text-primary)" : "var(--border-color)";
  };

  const getCardFill = (theme: 'auto' | 'day' | 'night') => {
    return selectedTheme === theme ? "var(--card-bg)" : "transparent";
  };

  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] font-sans selection:bg-white/10 transition-colors duration-300">
      {/* 375px Design Container */}
      <div className="relative w-full max-w-[375px] mx-auto min-h-screen bg-[var(--bg-color)] transition-colors duration-300">

        {/* Main SVG Layout Container */}
        <svg width="375" height="365" viewBox="0 0 375 365" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full select-none">
          <mask id="path-1-inside-1_1725_6381" fill="white">
            <path d="M0 0H375V102H0V0Z"/>
          </mask>
          <path d="M0 0H375V102H0V0Z" fill="var(--bg-color)"/>
          <path d="M375 102V101H0V102V103H375V102Z" fill="var(--border-color)" mask="url(#path-1-inside-1_1725_6381)"/>
          <path d="M51 72L29 72M29 72L38.4286 81M29 72L38.4286 63" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M126.721 71.432C127.601 71.752 128.289 72.248 128.785 72.92C129.281 73.576 129.529 74.384 129.529 75.344C129.529 76.24 129.305 77.048 128.857 77.768C128.425 78.472 127.809 79.024 127.009 79.424C126.225 79.808 125.329 80 124.321 80H117.265V64.16H122.881C123.841 64.16 124.705 64.352 125.473 64.736C126.241 65.104 126.833 65.624 127.249 66.296C127.681 66.952 127.897 67.712 127.897 68.576C127.897 69.728 127.505 70.68 126.721 71.432ZM120.385 66.944V70.568H122.617C123.273 70.568 123.777 70.408 124.129 70.088C124.497 69.752 124.681 69.304 124.681 68.744C124.681 68.184 124.497 67.744 124.129 67.424C123.777 67.104 123.273 66.944 122.617 66.944H120.385ZM124.081 77.216C124.785 77.216 125.337 77.04 125.737 76.688C126.137 76.336 126.337 75.848 126.337 75.224C126.337 74.616 126.137 74.136 125.737 73.784C125.337 73.416 124.785 73.232 124.081 73.232H120.385V77.216H124.081ZM132.028 68.12H135.244V71.552H137.404C138.844 71.552 140.028 71.928 140.956 72.68C141.884 73.432 142.348 74.456 142.348 75.752C142.348 77.08 141.884 78.12 140.956 78.872C140.028 79.624 138.844 80 137.404 80H132.028V68.12ZM143.692 68.12H146.908V80H143.692V68.12ZM137.308 77.264C137.868 77.264 138.3 77.144 138.604 76.904C138.908 76.648 139.06 76.28 139.06 75.8C139.06 75.32 138.9 74.952 138.58 74.696C138.276 74.424 137.852 74.288 137.308 74.288H135.244V77.264H137.308ZM156.91 68.288C157.95 68.288 158.894 68.552 159.742 69.08C160.59 69.592 161.254 70.304 161.734 71.216C162.23 72.128 162.478 73.144 162.478 74.264C162.478 75.416 162.206 76.448 161.662 77.36C161.118 78.272 160.366 78.984 159.406 79.496C158.446 80.008 157.366 80.264 156.166 80.264C154.886 80.264 153.766 79.976 152.806 79.4C151.846 78.808 151.102 77.976 150.574 76.904C150.046 75.832 149.782 74.592 149.782 73.184V71.384C149.782 69.56 149.998 68.048 150.43 66.848C150.862 65.648 151.662 64.672 152.83 63.92C154.014 63.168 155.686 62.664 157.846 62.408C158.838 62.28 159.638 62.152 160.246 62.024C160.854 61.896 161.246 61.8 161.422 61.736V64.688C160.814 64.928 159.63 65.128 157.87 65.288C156.478 65.432 155.414 65.704 154.678 66.104C153.958 66.504 153.462 67.032 153.19 67.688C152.918 68.344 152.766 69.224 152.734 70.328C153.198 69.672 153.79 69.168 154.51 68.816C155.23 68.464 156.03 68.288 156.91 68.288ZM156.118 77.312C156.982 77.312 157.702 77.016 158.278 76.424C158.87 75.832 159.166 75.112 159.166 74.264C159.166 73.416 158.87 72.704 158.278 72.128C157.702 71.536 156.982 71.24 156.118 71.24C155.27 71.24 154.55 71.536 153.958 72.128C153.382 72.704 153.094 73.416 153.094 74.264C153.094 75.112 153.382 75.832 153.958 76.424C154.55 77.016 155.27 77.312 156.118 77.312ZM170.667 80.264C169.499 80.264 168.427 79.992 167.451 79.448C166.491 78.888 165.731 78.136 165.171 77.192C164.611 76.232 164.331 75.184 164.331 74.048C164.331 72.912 164.611 71.872 165.171 70.928C165.731 69.968 166.499 69.216 167.475 68.672C168.451 68.128 169.523 67.856 170.691 67.856C171.859 67.856 172.931 68.136 173.907 68.696C174.883 69.24 175.651 69.984 176.211 70.928C176.787 71.872 177.075 72.912 177.075 74.048C177.075 75.184 176.787 76.232 176.211 77.192C175.651 78.136 174.875 78.888 173.883 79.448C172.907 79.992 171.835 80.264 170.667 80.264ZM170.691 77.288C171.571 77.288 172.299 76.984 172.875 76.376C173.467 75.768 173.763 75 173.763 74.072C173.763 73.144 173.467 72.368 172.875 71.744C172.299 71.12 171.571 70.808 170.691 70.808C169.795 70.808 169.059 71.12 168.483 71.744C167.907 72.352 167.619 73.128 167.619 74.072C167.619 75 167.907 75.768 168.483 76.376C169.059 76.984 169.795 77.288 170.691 77.288ZM186.396 67.856C187.5 67.856 188.484 68.128 189.348 68.672C190.228 69.2 190.916 69.936 191.412 70.88C191.908 71.808 192.156 72.864 192.156 74.048C192.156 75.232 191.908 76.296 191.412 77.24C190.916 78.184 190.228 78.928 189.348 79.472C188.484 80.016 187.5 80.288 186.396 80.288C185.676 80.288 185.012 80.168 184.404 79.928C183.796 79.672 183.276 79.312 182.844 78.848V84.32H179.604V68.12H182.58V69.608C182.98 69.048 183.508 68.616 184.164 68.312C184.836 68.008 185.58 67.856 186.396 67.856ZM185.796 77.336C186.66 77.336 187.388 77.04 187.98 76.448C188.572 75.84 188.868 75.048 188.868 74.072C188.868 73.08 188.572 72.288 187.98 71.696C187.404 71.088 186.676 70.784 185.796 70.784C184.98 70.784 184.276 71.064 183.684 71.624C183.092 72.168 182.796 72.976 182.796 74.048C182.796 75.104 183.084 75.92 183.66 76.496C184.252 77.056 184.964 77.336 185.796 77.336ZM203.8 70.856H200.152V68.12H210.688V70.856H207.016V80H203.8V70.856ZM223.548 75.152H215.22C215.412 75.904 215.796 76.488 216.372 76.904C216.964 77.304 217.692 77.504 218.556 77.504C219.724 77.504 220.828 77.104 221.868 76.304L223.212 78.512C221.804 79.696 220.22 80.288 218.46 80.288C217.228 80.288 216.116 80.016 215.124 79.472C214.132 78.928 213.356 78.184 212.796 77.24C212.236 76.28 211.956 75.224 211.956 74.072C211.956 72.92 212.228 71.872 212.772 70.928C213.316 69.968 214.06 69.216 215.004 68.672C215.964 68.128 217.02 67.856 218.172 67.856C219.26 67.856 220.228 68.104 221.076 68.6C221.924 69.08 222.58 69.744 223.044 70.592C223.524 71.424 223.764 72.352 223.764 73.376C223.764 73.952 223.692 74.544 223.548 75.152ZM218.052 70.472C217.364 70.472 216.764 70.688 216.252 71.12C215.74 71.552 215.396 72.136 215.22 72.872H220.62C220.604 72.136 220.348 71.552 219.852 71.12C219.356 70.688 218.756 70.472 218.052 70.472ZM226.364 67.856H227.42L232.988 74.072L238.604 67.856H239.636V80H236.396V74.288L233.516 77.528H232.436L229.58 74.312V80H226.364V67.856ZM243.004 68.12H246.22V71.552H248.38C249.82 71.552 251.004 71.928 251.932 72.68C252.86 73.432 253.324 74.456 253.324 75.752C253.324 77.08 252.86 78.12 251.932 78.872C251.004 79.624 249.82 80 248.38 80H243.004V68.12ZM254.668 68.12H257.884V80H254.668V68.12ZM248.284 77.264C248.844 77.264 249.276 77.144 249.58 76.904C249.884 76.648 250.036 76.28 250.036 75.8C250.036 75.32 249.876 74.952 249.556 74.696C249.252 74.424 248.828 74.288 248.284 74.288H246.22V77.264H248.284Z" fill="var(--text-primary)"/>
          
          {/* Intro Text Block */}
          <text x="24" y="148" fill="var(--text-primary)" style={{ fontFamily: 'var(--font-cera)', fontSize: '18px', fontWeight: 700 }}>Выберите тему оформления</text>
          <text x="24" y="172" fill="var(--text-secondary)" style={{ fontFamily: 'var(--font-gilroy)', fontSize: '14px', fontWeight: 400 }}>Настройте внешний вид приложения так,</text>
          <text x="24" y="194" fill="var(--text-secondary)" style={{ fontFamily: 'var(--font-gilroy)', fontSize: '14px', fontWeight: 400 }}>как вам удобнее.</text>

          {/* THEME CARDS */}
          {/* Card 1: Авто */}
          <rect x="24.5" y="245.5" width="97" height="97" rx="23.5" stroke={getCardStroke('auto')} strokeWidth="1.5" fill={getCardFill('auto')} />
          <path d="M51 270.5C51 270.5 51.1 270.6 51.6 270.9C52.1 271.2 52.7 271.3 53.3 271.4C53.9 271.4 54.4 271.3 55 271.1C55.5 270.9 56 270.6 56.4 270.2L58.8 267.8C59.6 267 60 266 60 264.9C60 263.9 59.5 262.9 58.8 262.1C58 261.4 57 261 56 261C54.9 260.9 53.9 261.4 53.1 262.1L51.7 263.5M53 267.5C53 267.5 52.8 267.3 52.3 267C51.8 266.7 51.2 266.6 50.6 266.5C50 266.5 49.5 266.6 48.9 266.8C48.4 267 47.9 267.3 47.5 267.7L45.1 270.1C44.3 270.9 43.9 271.9 44 273C44 274 44.4 275 45.1 275.8C45.1 275.8 45.9 276.5 46.9 276.9C47.9 277 49 277 50.8 275.8" stroke={getIconColor('auto')} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          <text x="73" y="322" fill={getIconColor('auto')} textAnchor="middle" style={{ fontFamily: 'var(--font-gilroy)', fontSize: '15px', fontWeight: 500 }}>Авто</text>

          {/* Card 2: День */}
          <rect x="138.8" y="245.5" width="97" height="97" rx="23.5" stroke={getCardStroke('day')} strokeWidth="1.5" fill={getCardFill('day')} />
          <path d="M166.3 261V259M166.3 277V279M160.7 263.4L159.3 262M172 274.7L173.4 276.1M158.3 269H156.3M174.3 269H176.3M172 263.4L173.4 262M160.7 274.7L159.3 276.1M166.3 274C163.5 274 161.3 271.7 161.3 269C161.3 266.2 163.5 264 166.3 264C169 264 171.3 266.2 171.3 269C171.3 271.7 169 274 166.3 274Z" stroke={getIconColor('day')} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          <text x="187" y="322" fill={getIconColor('day')} textAnchor="middle" style={{ fontFamily: 'var(--font-gilroy)', fontSize: '15px', fontWeight: 500 }}>День</text>

          {/* Card 3: Ночь */}
          <rect x="253.1" y="245.5" width="97" height="97" rx="23.5" fill={getCardFill('night')} stroke={getCardStroke('night')} strokeWidth="1.5" />
          <path d="M277.8 262.8C277.8 267.7 281.8 271.8 286.8 271.8C287.7 271.8 288.6 271.6 289.4 271.4C288.3 275.1 284.9 277.8 280.8 277.8C275.8 277.8 271.8 273.7 271.8 268.8C271.8 264.7 274.5 261.3 278.2 260.1C277.9 261 277.8 261.8 277.8 262.8Z" stroke={getIconColor('night')} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          <text x="301" y="322" fill={getIconColor('night')} textAnchor="middle" style={{ fontFamily: 'var(--font-gilroy)', fontSize: '15px', fontWeight: 500 }}>Ночь</text>
        </svg>

        {/* INTERACTIVE AREAS */}
        {/* Back Button */}
        <div className="absolute top-0 left-0 w-[80px] h-[102px]">
          <button onClick={() => router.back()} className="w-full h-full appearance-none cursor-pointer" aria-label="Назад" />
        </div>

        {/* Theme Toggles */}
        <div className="absolute top-[245px] left-0 w-full h-[110px] flex justify-between px-[24px] gap-[10px]">
          <button onClick={() => changeTheme('auto')} className="flex-1 h-full appearance-none cursor-pointer" aria-label="Авто тема" />
          <button onClick={() => changeTheme('day')} className="flex-1 h-full appearance-none cursor-pointer" aria-label="Дневная тема" />
          <button onClick={() => changeTheme('night')} className="flex-1 h-full appearance-none cursor-pointer" aria-label="Ночная тема" />
        </div>

      </div>
    </div>
  );
}
