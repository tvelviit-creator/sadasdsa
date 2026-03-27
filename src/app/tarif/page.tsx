"use client";

import { useEffect, useState, useRef, Suspense, useId } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getServices, Service, Tariff, Design } from "@/utils/services";
import DesktopView from "./DesktopView";
import MobileView from "./MobileView";

// --- Shared Helper Components ---
const CustomCheckIcon = ({ color = "var(--text-primary)" }: { color?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 10.0001L11 14.0001L8.99995 12.0001M13.246 3.45904L14.467 4.49953C14.7746 4.76167 15.1566 4.92015 15.5594 4.9523L17.1585 5.07974C18.0986 5.15476 18.8453 5.90104 18.9204 6.84117L19.0475 8.44048C19.0797 8.84335 19.2387 9.22583 19.5008 9.53344L20.5409 10.7541C21.1526 11.4719 21.1527 12.5278 20.541 13.2456L19.5009 14.4664C19.2388 14.774 19.08 15.1567 19.0478 15.5595L18.9199 17.1586C18.8449 18.0987 18.0993 18.8454 17.1591 18.9205L15.5595 19.0481C15.1567 19.0802 14.7744 19.2383 14.4667 19.5004L13.246 20.541C12.5282 21.1527 11.4717 21.1528 10.7539 20.5411L9.53316 19.5005C9.22555 19.2384 8.84325 19.0801 8.44038 19.0479L6.84077 18.9205C5.90064 18.8454 5.15505 18.0989 5.08003 17.1587L4.9521 15.5596C4.91995 15.1568 4.76111 14.7745 4.49898 14.4668L3.45894 13.2457C2.84721 12.5278 2.84693 11.4723 3.45865 10.7544L4.49963 9.53326C4.76176 9.22565 4.91908 8.84335 4.95122 8.44048L5.07915 6.84136C5.15417 5.90123 5.90192 5.15467 6.84205 5.07964L8.43989 4.9522C8.84276 4.92005 9.22525 4.7617 9.53285 4.49956L10.754 3.45904C11.4718 2.84731 12.5282 2.84731 13.246 3.45904Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CardGlow = ({ isVisible }: { isVisible: boolean }) => {
  const uniqueId = useId().replace(/:/g, '');
  const gradientId1 = `paint0_radial_${uniqueId}`;
  const gradientId2 = `paint1_radial_${uniqueId}`;
  const maskId = `mask0_${uniqueId}`;

  return (
    <svg
      width="244"
      height="432"
      viewBox="0 0 244 432"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`absolute inset-0 transition-opacity duration-500 ease-in-out pointer-events-none ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      style={{ willChange: 'opacity' }}
    >
      <mask id={maskId} style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="244" height="432">
        <rect width="244" height="432" rx="20" fill="white" />
      </mask>
      <g mask={`url(#${maskId})`}>
        <ellipse cx="284.147" cy="124.156" rx="284.147" ry="124.156" transform="matrix(0.958794 0.284104 -0.394508 0.918892 -4.66699 -236.151)" fill={`url(#${gradientId1})`} />
        <ellipse cx="228.622" cy="130.322" rx="228.622" ry="130.322" transform="matrix(0.999996 -0.0026324 0.00381407 0.999993 -105.813 313.859)" fill={`url(#${gradientId2})`} />
      </g>
      <defs>
        <radialGradient id={gradientId1} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(284.147 124.156) rotate(90) scale(124.156 284.147)">
          <stop stopColor="#70FFFF" stopOpacity="0.8" />
          <stop offset="1" stopColor="#70FFFF" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={gradientId2} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(228.622 130.322) rotate(90) scale(130.322 228.622)">
          <stop stopColor="#70FFFF" stopOpacity="0.8" />
          <stop offset="1" stopColor="#70FFFF" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
};

const DesignOneBackground = () => {
  const uniqueId = useId().replace(/:/g, '');
  const maskId = `mask_design_${uniqueId}`;
  return (
    <svg width="244" height="432" viewBox="0 0 244 432" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 pointer-events-none">
      <mask id={maskId} style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="244" height="432">
        <rect width="244" height="432" rx="20" fill="white" />
      </mask>
      <g mask={`url(#${maskId})`}>
        <path d="M109.16 248.704L117.72 257.593L134.839 239.815" stroke="#141414" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M114.25 203.385C119.046 200.617 124.954 200.617 129.75 203.385L156.517 218.84C161.312 221.608 164.267 226.725 164.267 232.262V263.171C164.266 268.708 161.312 273.825 156.517 276.594L129.75 292.048C124.954 294.816 119.046 294.816 114.25 292.048L87.4834 276.594C82.6878 273.825 79.7336 268.708 79.7334 263.171V232.262C79.7335 226.725 82.6878 221.608 87.4834 218.84L114.25 203.385Z" stroke="#141414" />
        <path d="M111.125 199.963C117.854 196.078 126.146 196.078 132.875 199.963L157.918 214.422C164.647 218.307 168.793 225.487 168.793 233.258V262.176C168.793 269.946 164.647 277.127 157.918 281.012L132.875 295.47C126.146 299.355 117.854 299.355 111.125 295.47L86.0811 281.012C79.3516 277.126 75.2061 269.945 75.2061 262.175V233.258C75.2061 225.487 79.3518 218.307 86.0811 214.422L111.125 199.963Z" stroke="#2A2A2A" strokeWidth="0.5" />
        <path d="M106.625 195.647C116.139 190.154 127.861 190.154 137.375 195.647L159.406 208.367C168.92 213.86 174.781 224.012 174.781 234.998V260.436C174.781 271.422 168.92 281.573 159.406 287.066L137.375 299.786C127.861 305.279 116.139 305.279 106.625 299.786L84.5947 287.066C75.0807 281.573 69.2198 271.422 69.2197 260.436V234.997C69.2199 224.011 75.0808 213.86 84.5947 208.367L106.625 195.647Z" stroke="#525252" strokeWidth="0.5" />
        <path d="M101.125 189.934C114.042 182.476 129.958 182.476 142.875 189.934L161.604 200.747C174.522 208.205 182.479 221.988 182.479 236.904V258.53C182.479 273.445 174.522 287.228 161.604 294.686L142.875 305.499C129.958 312.957 114.042 312.957 101.125 305.499L82.3965 294.686C69.4792 287.228 61.5215 273.445 61.5215 258.53V236.904C61.5215 221.988 69.4792 208.205 82.3965 200.747L101.125 189.934Z" stroke="#A0A0A0" strokeWidth="0.5" />
        <path d="M94.625 183.81C111.565 174.03 132.435 174.03 149.375 183.81L163.657 192.056C180.597 201.837 191.032 219.91 191.032 239.47V255.963C191.032 275.523 180.597 293.597 163.657 303.377L149.375 311.623C132.435 321.403 111.565 321.403 94.625 311.623L80.3428 303.377C63.4034 293.597 52.9679 275.523 52.9678 255.963V239.47C52.9679 219.91 63.4034 201.837 80.3428 192.056L94.625 183.81Z" stroke="#BFBFBF" strokeWidth="0.5" />
        <path d="M-38.75 203.385C-33.9543 200.617 -28.0457 200.617 -23.25 203.385L3.5166 218.84C8.31216 221.608 11.2665 226.725 11.2666 232.262V263.171C11.2664 268.708 8.31216 273.825 3.5166 276.594L-23.25 292.048C-28.0456 294.816 -33.9543 294.816 -38.75 292.048L-65.5166 276.594C-70.3122 273.825 -73.2664 268.708 -73.2666 263.171V232.262C-73.2665 226.725 -70.3122 221.608 -65.5166 218.84L-38.75 203.385Z" stroke="#141414" />
        <path d="M-41.875 199.963C-35.1456 196.078 -26.8544 196.078 -20.125 199.963L4.91797 214.422C11.6474 218.307 15.793 225.487 15.793 233.258V262.176C15.7928 269.946 11.6473 277.127 4.91797 281.012L-20.125 295.47C-26.8544 299.355 -35.1455 299.355 -41.875 295.47L-66.9189 281.012C-73.6484 277.126 -77.7939 269.945 -77.7939 262.175V233.258C-77.7939 225.487 -73.6482 218.307 -66.9189 214.422L-41.875 199.963Z" stroke="#2A2A2A" strokeWidth="0.5" />
        <path d="M-46.375 195.647C-36.861 190.154 -25.139 190.154 -15.625 195.647L6.40625 208.367C15.9202 213.86 21.7812 224.012 21.7812 234.998V260.436C21.7812 271.422 15.9201 281.573 6.40625 287.066L-15.625 299.786C-25.1391 305.279 -36.861 305.279 -46.375 299.786L-68.4053 287.066C-77.9193 281.573 -83.7802 271.422 -83.7803 260.436V234.997C-83.7801 224.011 -77.9192 213.86 -68.4053 208.367L-46.375 195.647Z" stroke="#525252" strokeWidth="0.5" />
        <path d="M-51.875 189.934C-38.9576 182.476 -23.0424 182.476 -10.125 189.934L8.60449 200.747C21.5217 208.205 29.4795 221.988 29.4795 236.904V258.53C29.4795 273.445 21.5217 287.228 8.60449 294.686L-10.125 305.499C-23.0424 312.957 -38.9576 312.957 -51.875 305.499L-70.6035 294.686C-83.5208 287.228 -91.4785 273.445 -91.4785 258.53V236.904C-91.4785 221.988 -83.5208 208.205 -70.6035 200.747L-51.875 189.934Z" stroke="#A0A0A0" strokeWidth="0.5" />
        <path d="M-58.375 183.81C-41.4353 174.03 -20.5647 174.03 -3.625 183.81L10.6572 192.056C27.5966 201.837 38.0321 219.91 38.0322 239.47V255.963C38.0321 275.523 27.5966 293.597 10.6572 303.377L-3.625 311.623C-20.5647 321.403 -41.4353 321.403 -58.375 311.623L-72.6572 303.377C-89.5966 293.597 -100.032 275.523 -100.032 255.963V239.47C-100.032 219.91 -89.5966 201.837 -72.6572 192.056L-58.375 183.81Z" stroke="#BFBFBF" strokeWidth="0.5" />
        <path d="M267.25 203.385C272.046 200.617 277.954 200.617 282.75 203.385L309.517 218.84C314.312 221.608 317.267 226.725 317.267 232.262V263.171C317.266 268.708 314.312 273.825 309.517 276.594L282.75 292.048C277.954 294.816 272.046 294.816 267.25 292.048L240.483 276.594C235.688 273.825 232.734 268.708 232.733 263.171V232.262C232.733 226.725 235.688 221.608 240.483 218.84L267.25 203.385Z" stroke="#141414" />
        <path d="M264.125 199.963C270.854 196.078 279.146 196.078 285.875 199.963L310.918 214.422C317.647 218.307 321.793 225.487 321.793 233.258V262.176C321.793 269.946 317.647 277.127 310.918 281.012L285.875 295.47C279.146 299.355 270.854 299.355 264.125 295.47L239.081 281.012C232.352 277.126 228.206 269.945 228.206 262.175V233.258C228.206 225.487 232.352 218.307 239.081 214.422L264.125 199.963Z" stroke="#2A2A2A" strokeWidth="0.5" />
        <path d="M259.625 195.647C269.139 190.154 280.861 190.154 290.375 195.647L312.406 208.367C321.92 213.86 327.781 224.012 327.781 234.998V260.436C327.781 271.422 321.92 281.573 312.406 287.066L290.375 299.786C280.861 305.279 269.139 305.279 259.625 299.786L237.595 287.066C228.081 281.573 222.22 271.422 222.22 260.436V234.997C222.22 224.011 228.081 213.86 237.595 208.367L259.625 195.647Z" stroke="#525252" strokeWidth="0.5" />
        <path d="M254.125 189.934C267.042 182.476 282.958 182.476 295.875 189.934L314.604 200.747C327.522 208.205 335.479 221.988 335.479 236.904V258.53C335.479 273.445 327.522 287.228 314.604 294.686L295.875 305.499C282.958 312.957 267.042 312.957 254.125 305.499L235.396 294.686C222.479 287.228 214.522 273.445 214.521 258.53V236.904C214.521 221.988 222.479 208.205 235.396 200.747L254.125 189.934Z" stroke="#A0A0A0" strokeWidth="0.5" />
        <path d="M247.625 183.81C264.565 174.03 285.435 174.03 302.375 183.81L316.657 192.056C333.597 201.837 344.032 219.91 344.032 239.47V255.963C344.032 275.523 333.597 293.597 316.657 303.377L302.375 311.623C285.435 321.403 264.565 321.403 247.625 311.623L233.343 303.377C216.403 293.597 205.968 275.523 205.968 255.963V239.47C205.968 219.91 216.403 201.837 233.343 192.056L247.625 183.81Z" stroke="#BFBFBF" strokeWidth="0.5" />
        <line x1="11.6494" y1="248.405" x2="80.0666" y2="248.405" stroke="#141414" />
        <line x1="163.934" y1="248.405" x2="232.351" y2="248.405" stroke="#141414" />
      </g>
    </svg>
  );
};

const DesignTwoBackground = () => {
  const uniqueId = useId().replace(/:/g, '');
  const maskId = `mask_design2_${uniqueId}`;
  return (
    <svg width="244" height="432" viewBox="0 0 244 432" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 pointer-events-none">
      <mask id={maskId} style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="244" height="432">
        <rect width="244" height="432" rx="20" fill="white" />
      </mask>
      <g mask={`url(#${maskId})`}>
        <path d="M109.16 258.988L117.72 267.877L134.839 250.099" stroke="#141414" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M114.25 213.669C119.046 210.9 124.954 210.9 129.75 213.669L156.517 229.123C161.312 231.892 164.267 237.009 164.267 242.546V273.454C164.266 278.992 161.312 284.108 156.517 286.877L129.75 302.331C124.954 305.1 119.046 305.1 114.25 302.331L87.4834 286.877C82.6878 284.108 79.7336 278.992 79.7334 273.454V242.546C79.7335 237.009 82.6878 231.892 87.4834 229.123L114.25 213.669Z" stroke="#141414" />
        <path d="M111.125 210.246C117.854 206.361 126.146 206.361 132.875 210.246L157.918 224.705C164.647 228.591 168.793 235.771 168.793 243.541V272.459C168.793 280.23 164.647 287.41 157.918 291.295L132.875 305.753C126.146 309.638 117.854 309.638 111.125 305.753L86.0811 291.295C79.3516 287.41 75.2061 280.229 75.2061 272.458V243.541C75.2061 235.771 79.3518 228.591 86.0811 224.705L111.125 210.246Z" stroke="#2A2A2A" strokeWidth="0.5" />
        <path d="M106.625 205.93C116.139 200.438 127.861 200.438 137.375 205.93L159.406 218.65C168.92 224.143 174.781 234.295 174.781 245.281V270.719C174.781 281.705 168.92 291.856 159.406 297.349L137.375 310.069C127.861 315.562 116.139 315.562 106.625 310.069L84.5947 297.349C75.0807 291.856 69.2198 281.705 69.2197 270.719V245.28C69.2199 234.294 75.0808 224.143 84.5947 218.65L106.625 205.93Z" stroke="#525252" strokeWidth="0.5" />
        <path d="M101.125 200.217C114.042 192.76 129.958 192.76 142.875 200.217L161.604 211.031C174.522 218.489 182.479 232.271 182.479 247.187V268.813C182.479 283.729 174.522 297.511 161.604 304.969L142.875 315.783C129.958 323.241 114.042 323.241 101.125 315.783L82.3965 304.969C69.4792 297.511 61.5215 283.729 61.5215 268.813V247.187C61.5215 232.271 69.4792 218.489 82.3965 211.031L101.125 200.217Z" stroke="#A0A0A0" strokeWidth="0.5" />
        <path d="M94.625 194.094C111.565 184.314 132.435 184.314 149.375 194.094L163.657 202.34C180.597 212.12 191.032 230.194 191.032 249.754V266.246C191.032 285.806 180.597 303.88 163.657 313.66L149.375 321.906C132.435 331.686 111.565 331.686 94.625 321.906L80.3428 313.66C63.4034 303.88 52.9679 285.806 52.9678 266.246V249.754C52.9679 230.194 63.4034 212.12 80.3428 202.34L94.625 194.094Z" stroke="#BFBFBF" strokeWidth="0.5" />
        <path d="M267.25 159.169C272.046 156.4 277.954 156.4 282.75 159.169L309.517 174.623C314.312 177.392 317.267 182.509 317.267 188.046V218.954C317.266 224.492 314.312 229.608 309.517 232.377L282.75 247.831C277.954 250.6 272.046 250.6 267.25 247.831L240.483 232.377C235.688 229.608 232.734 224.492 232.733 218.954V188.046C232.733 182.509 235.688 177.392 240.483 174.623L267.25 159.169Z" stroke="#141414" />
        <path d="M264.125 155.746C270.854 151.861 279.146 151.861 285.875 155.746L310.918 170.205C317.647 174.091 321.793 181.271 321.793 189.041V217.959C321.793 225.73 317.647 232.91 310.918 236.795L285.875 251.253C279.146 255.138 270.854 255.138 264.125 251.253L239.081 236.795C232.352 232.91 228.206 225.729 228.206 217.958V189.041C228.206 181.271 232.352 174.091 239.081 170.205L264.125 155.746Z" stroke="#2A2A2A" strokeWidth="0.5" />
        <path d="M259.625 151.43C269.139 145.938 280.861 145.938 290.375 151.43L312.406 164.15C321.92 169.643 327.781 179.795 327.781 190.781V216.219C327.781 227.205 321.92 237.356 312.406 242.849L290.375 255.569C280.861 261.062 269.139 261.062 259.625 255.569L237.595 242.849C228.081 237.356 222.22 227.205 222.22 216.219V190.78C222.22 179.794 228.081 169.643 237.595 164.15L259.625 151.43Z" stroke="#525252" strokeWidth="0.5" />
        <path d="M254.125 145.717C267.042 138.26 282.958 138.26 295.875 145.717L314.604 156.531C327.522 163.989 335.479 177.771 335.479 192.687V214.313C335.479 229.229 327.522 243.011 314.604 250.469L295.875 261.283C282.958 268.741 267.042 268.741 254.125 261.283L235.396 250.469C222.479 243.011 214.522 229.229 214.521 214.313V192.687C214.521 177.771 222.479 163.989 235.396 156.531L254.125 145.717Z" stroke="#A0A0A0" strokeWidth="0.5" />
        <path d="M247.625 139.594C264.565 129.814 285.435 129.814 302.375 139.594L316.657 147.84C333.597 157.62 344.032 175.694 344.032 195.254V211.746C344.032 231.306 333.597 249.38 316.657 259.16L302.375 267.406C285.435 277.186 264.565 277.186 247.625 267.406L233.343 259.16C216.403 249.38 205.968 231.306 205.968 211.746V195.254C205.968 175.694 216.403 157.62 233.343 147.84L247.625 139.594Z" stroke="#BFBFBF" strokeWidth="0.5" />
      </g>
    </svg>
  );
};

const DesignThreeBackground = () => {
  const uniqueId = useId().replace(/:/g, '');
  const maskId = `mask_design3_${uniqueId}`;
  const gradId0 = `paint0_linear_3_${uniqueId}`;
  const gradId1 = `paint1_linear_3_${uniqueId}`;
  return (
    <svg width="244" height="432" viewBox="0 0 244 432" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 pointer-events-none">
      <mask id={maskId} style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="244" height="432">
        <rect width="244" height="432" rx="20" fill="white" />
      </mask>
      <g mask={`url(#${maskId})`}>
        <path d="M-89.7583 354.15C-17.576 354.15 18.5151 354.15 46.0851 340.039C70.3364 327.626 90.0533 307.82 102.41 283.459C116.458 255.764 116.458 219.509 116.458 147M-90 337.967H-80.3336C-17.1741 337.967 14.4057 337.967 38.5294 325.619C59.7492 314.758 77.0015 297.428 87.8136 276.112C100.105 251.879 100.105 220.156 100.105 156.71V147M-90 325.02H-72.6005C-16.6592 325.02 11.3114 325.02 32.6782 314.084C51.4729 304.464 66.7535 289.114 76.3299 270.234C87.2168 248.771 87.2168 220.673 87.2168 164.478V147M-90 316.928H-67.7674C-16.3374 316.928 9.3775 316.928 29.0211 306.874C46.3001 298.03 60.3484 283.918 69.1525 266.56C79.1614 246.828 79.1614 220.996 79.1614 169.333V147M-90 308.836H-62.9342C-16.0157 308.836 7.4436 308.836 25.3641 299.664C41.1274 291.596 53.9434 278.722 61.9752 262.887C71.1061 244.885 71.1061 221.32 71.1061 174.188V147" stroke={`url(#${gradId0})`} />
        <path d="M333.758 354.15C261.576 354.15 225.485 354.15 197.915 340.039C173.664 327.626 153.947 307.82 141.59 283.459C127.542 255.764 127.542 219.509 127.542 147M334 337.967H324.334C261.174 337.967 229.594 337.967 205.471 325.619C184.251 314.758 166.998 297.428 156.186 276.112C143.895 251.879 143.895 220.156 143.895 156.71V147M334 325.02H316.601C260.659 325.02 232.689 325.02 211.322 314.084C192.527 304.464 177.247 289.114 167.67 270.234C156.783 248.771 156.783 220.673 156.783 164.478V147M334 316.928H311.767C260.337 316.928 234.622 316.928 214.979 306.874C197.7 298.03 183.652 283.918 174.847 266.56C164.839 246.828 164.839 220.996 164.839 169.333V147M334 308.836H306.934C260.016 308.836 236.556 308.836 218.636 299.664C202.873 291.596 190.057 278.722 182.025 262.887C172.894 244.885 172.894 221.32 172.894 174.188V147" stroke={`url(#${gradId1})`} />
      </g>
      <defs>
        <linearGradient id={gradId0} x1="13.2288" y1="147" x2="13.2288" y2="354.15" gradientUnits="userSpaceOnUse">
          <stop stopColor="#141414" stopOpacity="0" />
          <stop offset="1" stopColor="#141414" />
        </linearGradient>
        <linearGradient id={gradId1} x1="230.771" y1="147" x2="230.771" y2="354.15" gradientUnits="userSpaceOnUse">
          <stop stopColor="#141414" stopOpacity="0" />
          <stop offset="1" stopColor="#141414" />
        </linearGradient>
      </defs>
    </svg>
  );
};

// --- Main Page Logic ---
function TarifContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serviceData, setServiceData] = useState<Service | null>(null);
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [currentStage, setCurrentStage] = useState<1 | 2 | 3>(1);
  const [selectedTariffIndex, setSelectedTariffIndex] = useState<number | null>(null);
  const [selectedDesignIndex, setSelectedDesignIndex] = useState<number | null>(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const trackRef = useRef<HTMLDivElement>(null);
  const dragInfo = useRef({
    isDragging: false,
    startX: 0,
    currentOffset: 0,
    activeCardIndex: 0,
    lastDiff: 0
  });

  const ITEM_WIDTH = 264; // 244 + 20 gap

  useEffect(() => {
    const services = getServices();
    const id = searchParams.get("id");

    if (services.length > 0) {
      const targetService = id ? services.find(s => s.id === id) : services[0];
      if (targetService) {
        setServiceData(targetService);
        setAllServices(services.filter(s => s.categoryId === targetService.categoryId));
      }
    }
  }, [searchParams]);

  useEffect(() => {
    dragInfo.current.activeCardIndex = 0;
    dragInfo.current.currentOffset = 0;
    setActiveCardIndex(0);
    if (trackRef.current) {
      trackRef.current.style.transition = 'none';
      trackRef.current.style.transform = `translateX(0px)`;
    }
  }, [currentStage]);

  const goToCard = (index: number, smooth = true) => {
    const newOffset = -index * ITEM_WIDTH;
    dragInfo.current.currentOffset = newOffset;
    dragInfo.current.activeCardIndex = index;

    if (trackRef.current) {
      trackRef.current.style.transition = smooth ? 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)' : 'none';
      trackRef.current.style.transform = `translateX(${newOffset}px)`;
    }
    setActiveCardIndex(index);
  };

  const onDragStart = (x: number) => {
    dragInfo.current.isDragging = true;
    dragInfo.current.startX = x;
    dragInfo.current.lastDiff = 0;
    if (trackRef.current) trackRef.current.style.transition = 'none';
  };

  const onDragMove = (x: number) => {
    if (!dragInfo.current.isDragging || !trackRef.current) return;
    const diff = x - dragInfo.current.startX;
    dragInfo.current.lastDiff = diff;
    const translate = dragInfo.current.currentOffset + Math.max(-100, Math.min(100, diff * 0.5));
    trackRef.current.style.transform = `translateX(${translate}px)`;
  };

  const onDragEnd = () => {
    if (!dragInfo.current.isDragging) return;
    dragInfo.current.isDragging = false;
    const diff = dragInfo.current.lastDiff * 0.5;
    let newIndex = dragInfo.current.activeCardIndex;
    if (diff < -50 && newIndex < currentItems.length - 1) newIndex++;
    else if (diff > 50 && newIndex > 0) newIndex--;
    goToCard(newIndex);
  };

  const handleCardClick = (index: number) => {
    if (Math.abs(dragInfo.current.lastDiff) > 5) return;
    goToCard(index);
    if (currentStage === 1) setSelectedTariffIndex(index);
    else setSelectedDesignIndex(index);
  };

  const handleContinue = () => {
    if (currentStage === 1 && selectedTariffIndex !== null) {
      setCurrentStage(2);
    } else if (currentStage === 2 && selectedDesignIndex !== null) {
      if (!serviceData || selectedTariffIndex === null || selectedDesignIndex === null) return;

      const selectedTariff = serviceData.tariffs[selectedTariffIndex];
      const selectedDesign = serviceData.designs[selectedDesignIndex];

      const selectedPackages = {
        serviceId: serviceData.id,
        serviceIndex: selectedTariffIndex,
        serviceFileName: selectedTariff.name,
        designIndex: selectedDesignIndex,
        designFileName: selectedDesign.name,
        serviceName: serviceData.name,
        serviceImage: serviceData.coverImage,
        tariffName: selectedTariff.name,
        tariffDescription: selectedTariff.description,
        tariffFeatures: selectedTariff.features,
        tariffPrice: selectedTariff.price,
        designName: selectedDesign.name,
        designDescription: selectedDesign.description,
        designPrice: selectedDesign.price,
        sellerPhone: serviceData.sellerPhone,
        partnerName: serviceData.partnerName,
        partnerAvatar: serviceData.partnerAvatar,
      };

      try {
        localStorage.setItem("selectedPackages", JSON.stringify(selectedPackages));
        router.push("/final");
      } catch (e) {
        console.error("Failed to save selection", e);
      }
    }
  };

  if (!serviceData) return <div className="min-h-screen bg-[var(--bg-color)] transition-colors duration-300" />;

  const currentItems = currentStage === 1 ? serviceData.tariffs : serviceData.designs;
  const isTariffStage = currentStage === 1;
  const selectedIndex = isTariffStage ? selectedTariffIndex : selectedDesignIndex;
  const isContinueEnabled = selectedIndex !== null;

  const totalSelectedPrice = (() => {
    const tPrice = selectedTariffIndex !== null ? Number(serviceData.tariffs[selectedTariffIndex].price) : 0;
    const dPrice = selectedDesignIndex !== null ? Number(serviceData.designs[selectedDesignIndex].price) : 0;
    return tPrice + dPrice;
  })();

  const commonProps = {
    router,
    serviceData,
    currentStage,
    setCurrentStage,
    currentItems,
    selectedIndex,
    isTariffStage,
    isContinueEnabled,
    DesignOneBackground,
    DesignTwoBackground,
    DesignThreeBackground,
    CustomCheckIcon
  };

  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] transition-colors duration-300 flex flex-col selection:bg-[var(--accent-cyan)] selection:text-black overflow-hidden font-sans">
      <DesktopView 
        {...commonProps}
        selectedTariffIndex={selectedTariffIndex}
        selectedDesignIndex={selectedDesignIndex}
        handleCardClick={handleCardClick}
        handleContinue={handleContinue}
        totalSelectedPrice={totalSelectedPrice}
      />
      <MobileView 
        {...commonProps}
        activeCardIndex={activeCardIndex}
        handleCardClick={handleCardClick}
        handleContinue={handleContinue}
        goToCard={goToCard}
        onDragStart={onDragStart}
        onDragMove={onDragMove}
        onDragEnd={onDragEnd}
        trackRef={trackRef}
        CardGlow={CardGlow}
      />
    </div>
  );
}

export default function TarifPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg-color)]" />}>
      <TarifContent />
    </Suspense>
  );
}
