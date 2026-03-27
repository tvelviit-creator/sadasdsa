import React from 'react';

type CategoryIconProps = {
    name: string;
    isActive: boolean;
    iconImage?: string | null;
};

export const CategoryIcon = ({ name = "", isActive, iconImage }: CategoryIconProps) => {
    const type = (name || "").toLowerCase();

    // Updated Colors from SVG
    const strokeColor = isActive ? "var(--accent-cyan)" : "var(--text-primary)";
    const bgFill = isActive ? "var(--nav-bg)" : "var(--card-bg)";

    // Common Wrapper to handle the 52x52 size and 16px radius
    const IconWrapper = ({ children, viewBox }: { children?: React.ReactNode, viewBox: string }) => (
        <svg width="52" height="52" viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x={viewBox.split(' ')[0]} y={viewBox.split(' ')[1]} width="52" height="52" rx="16" fill={bgFill} />
            {children}
        </svg>
    );

    // If custom image is provided, use it
    if (iconImage) {
        return (
            <IconWrapper viewBox="0 0 52 52">
                <image href={iconImage} x="0" y="0" width="52" height="52" preserveAspectRatio="xMidYMid slice" />
            </IconWrapper>
        );
    }

    // App/Mobile (Phone)
    if (type.includes('приложение') || type.includes('app') || type.includes('mobile')) {
        return (
            <IconWrapper viewBox="14 4 52 52">
                <path d="M33 21.6225V38.3781C33 39.996 33 40.8038 33.3052 41.4218C33.5736 41.9654 34.0017 42.4085 34.5285 42.6854C35.1269 43 35.9106 43 37.4757 43H42.5243C44.0894 43 44.872 43 45.4704 42.6854C45.9972 42.4085 46.4267 41.9654 46.6951 41.4218C47 40.8044 47 39.997 47 38.3822V21.6178C47 20.003 47 19.1944 46.6951 18.577C46.4267 18.0335 45.9972 17.5918 45.4704 17.3149C44.8714 17 44.0884 17 42.5203 17H37.4803C35.9121 17 35.1275 17 34.5285 17.3149C34.0017 17.5918 33.5736 18.0335 33.3052 18.577C33 19.195 33 20.0046 33 21.6225Z" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </IconWrapper>
        );
    }

    // Site/Web (Browser Window)
    if (type.includes('сайт') || type.includes('web') || type.includes('лендинг')) {
        return (
            <IconWrapper viewBox="94 4 52 52">
                <path d="M107 21H107.028M107.028 21H132.972M107.028 21C107 21.4716 107 22.0529 107 22.8003V37.2003C107 38.8805 107 39.7194 107.315 40.3611C107.592 40.9256 108.033 41.3857 108.577 41.6733C109.194 42 110.003 42 111.618 42L128.382 42C129.997 42 130.804 42 131.422 41.6733C131.965 41.3857 132.408 40.9256 132.685 40.3611C133 39.72 133 38.8815 133 37.2046L133 22.7954C133 22.0503 133 21.4705 132.972 21M107.028 21C107.062 20.4115 107.14 19.994 107.315 19.6377C107.592 19.0732 108.033 18.6146 108.577 18.327C109.195 18 110.005 18 111.623 18H128.378C129.996 18 130.804 18 131.422 18.327C131.965 18.6146 132.408 19.0732 132.685 19.6377C132.86 19.994 132.938 20.4115 132.972 21M132.972 21H133" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </IconWrapper>
        );
    }

    // Game (Gamepad)
    if (type.includes('игра') || type.includes('game')) {
        return (
            <IconWrapper viewBox="174 4 52 52">
                <path d="M191 30L196 30M193.5 27.5L193.5 32.5M191.622 23L208.377 23C209.995 23 210.805 23 211.423 23.3052C211.967 23.5736 212.408 24.0017 212.685 24.5285C213 25.1275 213 25.9121 213 27.4803L213 32.5203C213 34.0884 213 34.8714 212.685 35.4704C212.408 35.9972 211.967 36.4267 211.423 36.6951C210.806 37 209.997 37 208.382 37L191.618 37C190.003 37 189.196 37 188.578 36.6951C188.035 36.4267 187.592 35.9972 187.315 35.4704C187 34.872 187 34.0894 187 32.5243L187 27.4757C187 25.9106 187 25.1269 187.315 24.5285C187.592 24.0017 188.035 23.5736 188.578 23.3052C189.196 23 190.004 23 191.622 23ZM204 30L204 30.0028L203.997 30.0027L203.997 30L204 30ZM209.003 30.0028L209.003 30.0056L209 30.0055L209 30.0028L209.003 30.0028ZM206.503 27.5L206.503 27.5028L206.5 27.5027L206.5 27.5L206.503 27.5ZM206.503 32.5L206.503 32.5028L206.5 32.5027L206.5 32.5L206.503 32.5Z" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </IconWrapper>
        );
    }

    // UI/UX (Layers)
    if (type.includes('ui') || type.includes('ux') || type.includes('дизайн')) {
        return (
            <IconWrapper viewBox="254 4 52 52">
                <path d="M270 26.3333V39.0444C270 39.729 270 40.071 270.121 40.3324C270.228 40.5624 270.397 40.7497 270.607 40.8669C270.844 41 271.155 41 271.776 41H283.333M285.555 25.1111L281.111 30L278.889 27.5556M274.444 32.2002V22.9113C274.444 21.5423 274.444 20.8573 274.687 20.3344C274.9 19.8745 275.239 19.5008 275.657 19.2664C276.133 19 276.756 19 278 19H286.444C287.689 19 288.311 19 288.786 19.2664C289.204 19.5008 289.545 19.8745 289.758 20.3344C290 20.8573 290 21.5418 290 22.9108L290 32.1998C290 33.5688 290 34.2533 289.758 34.7762C289.545 35.2361 289.204 35.6106 288.786 35.8449C288.311 36.1111 287.69 36.1111 286.448 36.1111H277.996C276.754 36.1111 276.132 36.1111 275.657 35.8449C275.239 35.6106 274.9 35.2363 274.687 34.7763C274.444 34.2534 274.444 33.5693 274.444 32.2002Z" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </IconWrapper>
        );
    }

    // AI (Brain/Network)
    if (type.includes('ai') || type.includes('ии') || type.includes('нейро')) {
        return (
            <IconWrapper viewBox="334 4 52 52">
                <path d="M364.727 23.4524H367.953C368.157 23.4524 369.236 23.47 370.109 24.2784C370.981 25.0868 371 26.0891 371 26.2754V34.815C371 35.0366 370.986 36.1749 370.008 37.1067C368.989 38.0737 367.698 38.0863 367.472 38.0838H364.442L361.295 41L358.132 38.0687H354.482C354.251 38.0561 353.289 37.9755 352.498 37.2301C351.729 36.5073 351.644 35.6435 351.628 35.4245V32.7147M349 23.4952L352.079 21.9087L353.78 19L355.468 21.959L358.553 23.4952L355.46 25.0616L353.778 27.9048L352.066 25.0717L349 23.4952ZM358.458 31.3397C359.156 31.1131 359.852 30.8864 360.55 30.6598C360.798 30.0428 361.045 29.4233 361.292 28.8063L362.078 30.6825C362.771 30.9016 363.464 31.1206 364.157 31.3397C363.461 31.5865 362.768 31.8333 362.072 32.0826C361.817 32.7424 361.561 33.4022 361.306 34.062C361.05 33.4022 360.798 32.745 360.542 32.0852C359.846 31.8358 359.151 31.5891 358.455 31.3397H358.458Z" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </IconWrapper>
        );
    }

    // Default fallback
    return (
        <svg width="52" height="52" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="24" height="24" rx="6" fill={bgFill} />
            <circle cx="12" cy="12" r="10" stroke={strokeColor} strokeWidth="2" />
        </svg>
    );
};
