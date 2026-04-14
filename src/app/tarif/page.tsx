"use client";

import { useEffect, useState, useRef, Suspense, useId } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getServices, Service, Tariff, Design } from "@/utils/services";

// Custom gear-styled check icon from user design
const CustomCheckIcon = ({ color = "#F5F5F5" }: { color?: string }) => (
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
          <stop stopColor="var(--accent-cyan)" stopOpacity="0.6" />
          <stop offset="1" stopColor="var(--accent-cyan)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={gradientId2} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(228.622 130.322) rotate(90) scale(130.322 228.622)">
          <stop stopColor="var(--accent-cyan)" stopOpacity="0.6" />
          <stop offset="1" stopColor="var(--accent-cyan)" stopOpacity="0" />
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
        <path d="M109.16 248.704L117.72 257.593L134.839 239.815" stroke="var(--text-primary)" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M114.25 203.385C119.046 200.617 124.954 200.617 129.75 203.385L156.517 218.84C161.312 221.608 164.267 226.725 164.267 232.262V263.171C164.266 268.708 161.312 273.825 156.517 276.594L129.75 292.048C124.954 294.816 119.046 294.816 114.25 292.048L87.4834 276.594C82.6878 273.825 79.7336 268.708 79.7334 263.171V232.262C79.7335 226.725 82.6878 221.608 87.4834 218.84L114.25 203.385Z" stroke="var(--text-primary)" />
        <path d="M111.125 199.963C117.854 196.078 126.146 196.078 132.875 199.963L157.918 214.422C164.647 218.307 168.793 225.487 168.793 233.258V262.176C168.793 269.946 164.647 277.127 157.918 281.012L132.875 295.47C126.146 299.355 117.854 299.355 111.125 295.47L86.0811 281.012C79.3516 277.126 75.2061 269.945 75.2061 262.175V233.258C75.2061 225.487 79.3518 218.307 86.0811 214.422L111.125 199.963Z" stroke="var(--text-primary)" strokeOpacity="0.8" strokeWidth="0.5" />
        <path d="M106.625 195.647C116.139 190.154 127.861 190.154 137.375 195.647L159.406 208.367C168.92 213.86 174.781 224.012 174.781 234.998V260.436C174.781 271.422 168.92 281.573 159.406 287.066L137.375 299.786C127.861 305.279 116.139 305.279 106.625 299.786L84.5947 287.066C75.0807 281.573 69.2198 271.422 69.2197 260.436V234.997C69.2199 224.011 75.0808 213.86 84.5947 208.367L106.625 195.647Z" stroke="var(--text-primary)" strokeOpacity="0.6" strokeWidth="0.5" />
        <path d="M101.125 189.934C114.042 182.476 129.958 182.476 142.875 189.934L161.604 200.747C174.522 208.205 182.479 221.988 182.479 236.904V258.53C182.479 273.445 174.522 287.228 161.604 294.686L142.875 305.499C129.958 312.957 114.042 312.957 101.125 305.499L82.3965 294.686C69.4792 287.228 61.5215 273.445 61.5215 258.53V236.904C61.5215 221.988 69.4792 208.205 82.3965 200.747L101.125 189.934Z" stroke="var(--text-primary)" strokeOpacity="0.4" strokeWidth="0.5" />
        <path d="M94.625 183.81C111.565 174.03 132.435 174.03 149.375 183.81L163.657 192.056C180.597 201.837 191.032 219.91 191.032 239.47V255.963C191.032 275.523 180.597 293.597 163.657 303.377L149.375 311.623C132.435 321.403 111.565 321.403 94.625 311.623L80.3428 303.377C63.4034 293.597 52.9679 275.523 52.9678 255.963V239.47C52.9679 219.91 63.4034 201.837 80.3428 192.056L94.625 183.81Z" stroke="var(--text-primary)" strokeOpacity="0.2" strokeWidth="0.5" />
        <path d="M-38.75 203.385C-33.9543 200.617 -28.0457 200.617 -23.25 203.385L3.5166 218.84C8.31216 221.608 11.2665 226.725 11.2666 232.262V263.171C11.2664 268.708 8.31216 273.825 3.5166 276.594L-23.25 292.048C-28.0456 294.816 -33.9543 294.816 -38.75 292.048L-65.5166 276.594C-70.3122 273.825 -73.2664 268.708 -73.2666 263.171V232.262C-73.2665 226.725 -70.3122 221.608 -65.5166 218.84L-38.75 203.385Z" stroke="var(--text-primary)" />
        <path d="M-41.875 199.963C-35.1456 196.078 -26.8544 196.078 -20.125 199.963L4.91797 214.422C11.6474 218.307 15.793 225.487 15.793 233.258V262.176C15.7928 269.946 11.6473 277.127 4.91797 281.012L-20.125 295.47C-26.8544 299.355 -35.1455 299.355 -41.875 295.47L-66.9189 281.012C-73.6484 277.126 -77.7939 269.945 -77.7939 262.175V233.258C-77.7939 225.487 -73.6482 218.307 -66.9189 214.422L-41.875 199.963Z" stroke="var(--text-primary)" strokeOpacity="0.8" strokeWidth="0.5" />
        <path d="M-46.375 195.647C-36.861 190.154 -25.139 190.154 -15.625 195.647L6.40625 208.367C15.9202 213.86 21.7812 224.012 21.7812 234.998V260.436C21.7812 271.422 15.9201 281.573 6.40625 287.066L-15.625 299.786C-25.1391 305.279 -36.861 305.279 -46.375 299.786L-68.4053 287.066C-77.9193 281.573 -83.7802 271.422 -83.7803 260.436V234.997C-83.7801 224.011 -77.9192 213.86 -68.4053 208.367L-46.375 195.647Z" stroke="var(--text-primary)" strokeOpacity="0.6" strokeWidth="0.5" />
        <path d="M-51.875 189.934C-38.9576 182.476 -23.0424 182.476 -10.125 189.934L8.60449 200.747C21.5217 208.205 29.4795 221.988 29.4795 236.904V258.53C29.4795 273.445 21.5217 287.228 8.60449 294.686L-10.125 305.499C-23.0424 312.957 -38.9576 312.957 -51.875 305.499L-70.6035 294.686C-83.5208 287.228 -91.4785 273.445 -91.4785 258.53V236.904C-91.4785 221.988 -83.5208 208.205 -70.6035 200.747L-51.875 189.934Z" stroke="var(--text-primary)" strokeOpacity="0.4" strokeWidth="0.5" />
        <path d="M-58.375 183.81C-41.4353 174.03 -20.5647 174.03 -3.625 183.81L10.6572 192.056C27.5966 201.837 38.0321 219.91 38.0322 239.47V255.963C38.0321 275.523 27.5966 293.597 10.6572 303.377L-3.625 311.623C-20.5647 321.403 -41.4353 321.403 -58.375 311.623L-72.6572 303.377C-89.5966 293.597 -100.032 275.523 -100.032 255.963V239.47C-100.032 219.91 -89.5966 201.837 -72.6572 192.056L-58.375 183.81Z" stroke="var(--text-primary)" strokeOpacity="0.2" strokeWidth="0.5" />
        <path d="M267.25 203.385C272.046 200.617 277.954 200.617 282.75 203.385L309.517 218.84C314.312 221.608 317.267 226.725 317.267 232.262V263.171C317.266 268.708 314.312 273.825 309.517 276.594L282.75 292.048C277.954 294.816 272.046 294.816 267.25 292.048L240.483 276.594C235.688 273.825 232.734 268.708 232.733 263.171V232.262C232.733 226.725 235.688 221.608 240.483 218.84L267.25 203.385Z" stroke="var(--text-primary)" />
        <path d="M264.125 199.963C270.854 196.078 279.146 196.078 285.875 199.963L310.918 214.422C317.647 218.307 321.793 225.487 321.793 233.258V262.176C321.793 269.946 317.647 277.127 310.918 281.012L285.875 295.47C279.146 299.355 270.854 299.355 264.125 295.47L239.081 281.012C232.352 277.126 228.206 269.945 228.206 262.175V233.258C228.206 225.487 232.352 218.307 239.081 214.422L264.125 199.963Z" stroke="var(--text-primary)" strokeOpacity="0.8" strokeWidth="0.5" />
        <path d="M259.625 195.647C269.139 190.154 280.861 190.154 290.375 195.647L312.406 208.367C321.92 213.86 327.781 224.012 327.781 234.998V260.436C327.781 271.422 321.92 281.573 312.406 287.066L290.375 299.786C280.861 305.279 269.139 305.279 259.625 299.786L237.595 287.066C228.081 281.573 222.22 271.422 222.22 260.436V234.997C222.22 224.011 228.081 213.86 237.595 208.367L259.625 195.647Z" stroke="var(--text-primary)" strokeOpacity="0.6" strokeWidth="0.5" />
        <path d="M254.125 189.934C267.042 138.26 282.958 138.26 295.875 145.717L314.604 156.531C327.522 163.989 335.479 177.771 335.479 192.687V214.313C335.479 229.229 327.522 243.011 314.604 250.469L295.875 261.283C282.958 268.741 267.042 268.741 254.125 261.283L235.396 250.469C222.479 243.011 214.522 229.229 214.521 214.313V192.687C214.521 177.771 222.479 163.989 235.396 156.531L254.125 145.717Z" stroke="var(--text-primary)" strokeOpacity="0.4" strokeWidth="0.5" />
        <path d="M247.625 139.594C264.565 129.814 285.435 129.814 302.375 139.594L316.657 147.84C333.597 157.62 344.032 175.694 344.032 195.254V211.746C344.032 231.306 333.597 249.38 316.657 259.16L302.375 267.406C285.435 277.186 264.565 277.186 247.625 267.406L233.343 259.16C216.403 249.38 205.968 231.306 205.968 211.746V195.254C205.968 175.694 216.403 157.62 233.343 147.84L247.625 139.594Z" stroke="var(--text-primary)" strokeOpacity="0.2" strokeWidth="0.5" />
        <line x1="11.6494" y1="248.405" x2="80.0666" y2="248.405" stroke="var(--text-primary)" />
        <line x1="163.934" y1="248.405" x2="232.351" y2="248.405" stroke="var(--text-primary)" />
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
        <path d="M109.16 258.988L117.72 267.877L134.839 250.099" stroke="var(--text-primary)" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M114.25 213.669C119.046 210.9 124.954 210.9 129.75 213.669L156.517 229.123C161.312 231.892 164.267 237.009 164.267 242.546V273.454C164.266 278.992 161.312 284.108 156.517 286.877L129.75 302.331C124.954 305.1 119.046 305.1 114.25 302.331L87.4834 286.877C82.6878 284.108 79.7336 278.992 79.7334 273.454V242.546C79.7335 237.009 82.6878 231.892 87.4834 229.123L114.25 213.669Z" stroke="var(--text-primary)" />
        <path d="M111.125 210.246C117.854 206.361 126.146 206.361 132.875 210.246L157.918 224.705C164.647 218.305 168.793 235.771 168.793 243.541V272.459C168.793 280.23 164.647 287.41 157.918 291.295L132.875 305.753C126.146 309.638 117.854 309.638 111.125 305.753L86.0811 291.295C79.3516 287.41 75.2061 280.229 75.2061 272.458V243.541C75.2061 235.771 79.3518 228.591 86.0811 224.705L111.125 210.246Z" stroke="var(--text-primary)" strokeOpacity="0.8" strokeWidth="0.5" />
        <path d="M106.625 205.93C116.139 200.438 127.861 200.438 137.375 205.93L159.406 218.65C168.92 224.143 174.781 234.295 174.781 245.281V270.719C174.781 281.705 168.92 291.856 159.406 297.349L137.375 310.069C127.861 315.562 116.139 315.562 106.625 310.069L84.5947 297.349C75.0807 291.856 69.2198 281.705 69.2197 270.719V245.28C69.2199 234.294 75.0808 224.143 84.5947 218.65L106.625 205.93Z" stroke="var(--text-primary)" strokeOpacity="0.6" strokeWidth="0.5" />
        <path d="M101.125 200.217C114.042 192.76 129.958 192.76 142.875 200.217L161.604 211.031C174.522 218.489 182.479 232.271 182.479 247.187V268.813C182.479 283.729 174.522 297.511 161.604 304.969L142.875 315.783C129.958 323.24 114.042 323.241 101.125 315.783L82.3965 304.969C69.4792 297.511 61.5215 283.729 61.5215 268.813V247.187C61.5215 232.271 69.4792 218.489 82.3965 211.031L101.125 200.217Z" stroke="var(--text-primary)" strokeOpacity="0.4" strokeWidth="0.5" />
        <path d="M94.625 194.094C111.565 184.314 132.435 184.314 149.375 194.094L163.657 202.34C180.597 212.12 191.032 230.194 191.032 249.754V266.246C191.032 285.806 180.597 303.88 163.657 313.66L149.375 321.906C132.435 331.686 111.565 331.686 94.625 321.906L80.3428 313.66C63.4034 303.88 52.9679 285.806 52.9678 266.246V249.754C52.9679 230.194 63.4034 212.12 80.3428 202.34L94.625 194.094Z" stroke="var(--text-primary)" strokeOpacity="0.2" strokeWidth="0.5" />
        <path d="M-38.75 271.169C-33.9543 268.4 -28.0457 268.4 -23.25 271.169L3.5166 286.623C8.31216 289.392 11.2665 294.509 11.2666 300.046V330.954C11.2664 336.492 8.31216 341.608 3.5166 344.377L-23.25 359.831C-28.0456 362.6 -33.9543 362.6 -38.75 359.831L-65.5166 344.377C-70.3122 341.608 -73.2664 336.492 -73.2666 330.954V300.046C-73.2665 294.509 -70.3122 289.392 -65.5166 286.623L-38.75 271.169Z" stroke="var(--text-primary)" />
        <path d="M-41.875 267.746C-35.1456 263.861 -26.8544 263.861 -20.125 267.746L4.91797 282.205C11.6474 286.091 15.793 293.271 15.793 301.041V329.959C15.7928 337.73 11.6473 344.91 4.91797 348.795L-20.125 363.253C-26.8544 367.138 -35.1455 367.138 -41.875 363.253L-66.9189 348.795C-73.6484 344.91 -77.7939 337.729 -77.7939 329.958V301.041C-77.7939 293.271 -73.6482 286.091 -66.9189 282.205L-41.875 267.746Z" stroke="var(--text-primary)" strokeOpacity="0.8" strokeWidth="0.5" />
        <path d="M-46.375 263.43C-36.861 257.938 -25.139 257.938 -15.625 263.43L6.40625 276.15C15.9202 281.643 21.7812 291.795 21.7812 302.781V328.219C21.7812 339.205 15.9201 349.356 6.40625 354.849L-15.625 367.569C-25.1391 373.062 -36.861 373.062 -46.375 367.569L-68.4053 354.849C-77.9193 349.356 -83.7802 339.205 -83.7803 328.219V302.78C-83.7801 291.794 -77.9192 281.643 -68.4053 276.15L-46.375 263.43Z" stroke="var(--text-primary)" strokeOpacity="0.6" strokeWidth="0.5" />
        <path d="M-51.875 257.717C-38.9576 250.26 -23.0424 250.26 -10.125 257.717L8.60449 268.531C21.5217 275.989 29.4795 289.771 29.4795 304.687V326.313C29.4795 341.229 21.5217 355.011 8.60449 362.469L-10.125 373.283C-23.0424 380.741 -38.9576 380.741 -51.875 373.283L-70.6035 362.469C-83.5208 355.011 -91.4785 341.229 -91.4785 326.313V304.687C-91.4785 289.771 -83.5208 275.989 -70.6035 268.531L-51.875 257.717Z" stroke="var(--text-primary)" strokeOpacity="0.4" strokeWidth="0.5" />
        <path d="M-58.375 251.594C-41.4353 241.814 -20.5647 241.814 -3.625 251.594L10.6572 259.84C27.5966 269.62 38.0321 287.694 38.0322 307.254V323.746C38.0321 343.306 27.5966 361.38 10.6572 371.16L-3.625 379.406C-20.5647 389.186 -41.4353 389.186 -58.375 379.406L-72.6572 371.16C-89.5966 361.38 -100.032 343.306 -100.032 323.746V307.254C-100.032 287.694 -89.5966 269.62 -72.6572 259.84L-58.375 251.594Z" stroke="var(--text-primary)" strokeOpacity="0.2" strokeWidth="0.5" />
        <path d="M267.25 159.169C272.046 156.4 277.954 156.4 282.75 159.169L309.517 174.623C314.312 177.392 317.267 182.509 317.267 188.046V218.954C317.266 224.492 314.312 229.608 309.517 232.377L282.75 247.831C277.954 250.6 272.046 250.6 267.25 247.831L240.483 232.377C235.688 229.608 232.734 224.492 232.733 218.954V188.046C232.733 182.509 235.688 177.392 240.483 174.623L267.25 159.169Z" stroke="var(--text-primary)" />
        <path d="M264.125 155.746C270.854 151.861 279.146 151.861 285.875 155.746L310.918 170.205C317.647 174.091 321.793 181.271 321.793 189.041V217.959C321.793 225.73 317.647 232.91 310.918 236.795L285.875 251.253C279.146 255.138 270.854 255.138 264.125 251.253L239.081 236.795C232.352 232.91 228.206 225.729 228.206 217.958V189.041C228.206 181.271 232.352 174.091 239.081 170.205L264.125 155.746Z" stroke="var(--text-primary)" strokeOpacity="0.8" strokeWidth="0.5" />
        <path d="M259.625 151.43C269.139 145.938 280.861 145.938 290.375 151.43L312.406 164.15C321.92 169.643 327.781 179.795 327.781 190.781V216.219C327.781 227.205 321.92 237.356 312.406 242.849L290.375 255.569C280.861 261.062 269.139 261.062 259.625 255.569L237.595 242.849C228.081 237.356 222.22 227.205 222.22 216.219V190.78C222.22 179.794 228.081 169.643 237.595 164.15L259.625 151.43Z" stroke="var(--text-primary)" strokeOpacity="0.6" strokeWidth="0.5" />
        <path d="M254.125 145.717C267.042 138.26 282.958 138.26 295.875 145.717L314.604 156.531C327.522 163.989 335.479 177.771 335.479 192.687V214.313C335.479 229.229 327.522 243.011 314.604 250.469L295.875 261.283C282.958 268.741 267.042 268.741 254.125 261.283L235.396 250.469C222.479 243.011 214.522 229.229 214.521 214.313V192.687C214.521 177.771 222.479 163.989 235.396 156.531L254.125 145.717Z" stroke="var(--text-primary)" strokeOpacity="0.4" strokeWidth="0.5" />
        <path d="M247.625 139.594C264.565 129.814 285.435 129.814 302.375 139.594L316.657 147.84C333.597 157.62 344.032 175.694 344.032 195.254V211.746C344.032 231.306 333.597 249.38 316.657 259.16L302.375 267.406C285.435 277.186 264.565 277.186 247.625 267.406L233.343 259.16C216.403 249.38 205.968 231.306 205.968 211.746V195.254C205.968 175.694 216.403 157.62 233.343 147.84L247.625 139.594Z" stroke="var(--text-primary)" strokeOpacity="0.2" strokeWidth="0.5" />
      </g>
    </svg>
  );
};


const DesignThreeBackground = () => {
  const uniqueId = useId().replace(/:/g, '');
  const maskId = `mask_design3_${uniqueId}`;
  const radId0 = `paint0_radial_3_${uniqueId}`;
  const radId1 = `paint1_radial_3_${uniqueId}`;
  const linId2 = `paint2_linear_3_${uniqueId}`;
  const linId3 = `paint3_linear_3_${uniqueId}`;
  return (
    <svg width="244" height="432" viewBox="0 0 244 432" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 pointer-events-none">
      <mask id={maskId} style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="244" height="432">
        <rect width="244" height="432" rx="20" fill="white" />
      </mask>
      <g mask={`url(#${maskId})`}>
        <ellipse cx="284.147" cy="124.156" rx="284.147" ry="124.156" transform="matrix(0.958794 0.284104 -0.394508 0.918892 -4.66699 -236.151)" fill={`url(#${radId0})`} />
        <ellipse cx="228.622" cy="130.322" rx="228.622" ry="130.322" transform="matrix(0.999996 -0.0026324 0.00381407 0.999993 -105.813 313.859)" fill={`url(#${radId1})`} />
        <path d="M-89.7583 354.15C-17.576 354.15 18.5151 354.15 46.0851 340.039C70.3364 327.626 90.0533 307.82 102.41 283.459C116.458 255.764 116.458 219.509 116.458 147M-90 337.967H-80.3336C-17.1741 337.967 14.4057 337.967 38.5294 325.619C59.7492 314.758 77.0015 297.428 87.8136 276.112C100.105 251.879 100.105 220.156 100.105 156.71V147M-90 325.02H-72.6005C-16.6592 325.02 11.3114 325.02 32.6782 314.084C51.4729 304.464 66.7535 289.114 76.3299 270.234C87.2168 248.771 87.2168 220.673 87.2168 164.478V147M-90 316.928H-67.7674C-16.3374 316.928 9.3775 316.928 29.0211 306.874C46.3001 298.03 60.3484 283.918 69.1525 266.56C79.1614 246.828 79.1614 220.996 79.1614 169.333V147M-90 308.836H-62.9342C-16.0157 308.836 7.4436 308.836 25.3641 299.664C41.1274 291.596 53.9434 278.722 61.9752 262.887C71.1061 244.885 71.1061 221.32 71.1061 174.188V147" stroke={`url(#${linId2})`} />
        <path d="M333.758 354.15C261.576 354.15 225.485 354.15 197.915 340.039C173.664 327.626 153.947 307.82 141.59 283.459C127.542 255.764 127.542 219.509 127.542 147M334 337.967H324.334C261.174 337.967 229.594 337.967 205.471 325.619C184.251 314.758 166.998 297.428 156.186 276.112C143.895 251.879 143.895 220.156 143.895 156.71V147M334 325.02H316.601C260.659 325.02 232.689 325.02 211.322 314.084C192.527 304.464 177.247 289.114 167.67 270.234C156.783 248.771 156.783 220.673 156.783 164.478V147M334 316.928H311.767C260.337 316.928 234.622 316.928 214.979 306.874C197.7 298.03 183.652 283.918 174.847 266.56C164.839 246.828 164.839 220.996 164.839 169.333V147M334 308.836H306.934C260.016 308.836 236.556 308.836 218.636 299.664C202.873 291.596 190.057 278.722 182.025 262.887C172.894 244.885 172.894 221.32 172.894 174.188V147" stroke={`url(#${linId3})`} />
      </g>
      <defs>
        <radialGradient id={radId0} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(284.147 124.156) rotate(90) scale(124.156 284.147)">
          <stop stopColor="#70FFFF" stopOpacity="0.8" />
          <stop offset="1" stopColor="#70FFFF" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={radId1} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(228.622 130.322) rotate(90) scale(130.322 228.622)">
          <stop stopColor="#70FFFF" stopOpacity="0.8" />
          <stop offset="1" stopColor="#70FFFF" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={linId2} x1="13.2288" y1="147" x2="13.2288" y2="354.15" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--text-primary)" stopOpacity="0" />
          <stop offset="1" stopColor="var(--text-primary)" strokeOpacity="0.4" />
        </linearGradient>
        <linearGradient id={linId3} x1="230.771" y1="147" x2="230.771" y2="354.15" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--text-primary)" stopOpacity="0" />
          <stop offset="1" stopColor="var(--text-primary)" strokeOpacity="0.4" />
        </linearGradient>
      </defs>
    </svg>
  );
};

function TarifContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serviceData, setServiceData] = useState<Service | null>(null);
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

  // Constants for card sizing
  const CARD_WIDTH = 244;
  const CARD_GAP = 20;
  const ITEM_WIDTH = CARD_WIDTH + CARD_GAP;

  useEffect(() => {
    async function load() {
        const services = await getServices();
        const id = searchParams.get("id");

        if (services.length > 0) {
            let targetService = id ? services.find(s => s.id === id) : services[0];
            if (targetService) setServiceData(targetService);
        }
    }
    load();
  }, [searchParams]);

  // Handle stage changes or initial load
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
    if (trackRef.current) {
      trackRef.current.style.transition = 'none';
    }
  };

  const onDragMove = (x: number) => {
    if (!dragInfo.current.isDragging || !trackRef.current) return;
    const diff = x - dragInfo.current.startX;
    dragInfo.current.lastDiff = diff;

    // Resistance logic
    const resistance = 0.5;
    const walk = diff * resistance;
    const clampedWalk = Math.max(-100, Math.min(100, walk));

    const translate = dragInfo.current.currentOffset + clampedWalk;
    trackRef.current.style.transform = `translateX(${translate}px)`;
  };

  const onDragEnd = () => {
    if (!dragInfo.current.isDragging) return;
    dragInfo.current.isDragging = false;

    const diff = dragInfo.current.lastDiff;
    const threshold = 50;
    let newIndex = dragInfo.current.activeCardIndex;

    const resistanceDiff = diff * 0.5;
    if (resistanceDiff < -threshold && dragInfo.current.activeCardIndex < currentItems.length - 1) {
      newIndex = dragInfo.current.activeCardIndex + 1;
    } else if (resistanceDiff > threshold && dragInfo.current.activeCardIndex > 0) {
      newIndex = dragInfo.current.activeCardIndex - 1;
    }

    goToCard(newIndex);
  };

  const handleCardClick = (index: number) => {
    if (Math.abs(dragInfo.current.lastDiff) > 5) return;
    goToCard(index);
    if (currentStage === 1) {
      setSelectedTariffIndex(index);
    } else {
      setSelectedDesignIndex(index);
    }
  };

  const handleContinue = () => {
    if (currentStage === 1 && selectedTariffIndex !== null) {
      setCurrentStage(2);
    } else if (currentStage === 2 && selectedDesignIndex !== null) {
      if (!serviceData || selectedTariffIndex === null || selectedDesignIndex === null) return;

      const selectedTariff = serviceData.tariffs[selectedTariffIndex];
      const selectedDesign = serviceData.designs[selectedDesignIndex];

      const selectedPackages = {
        serviceIndex: selectedTariffIndex,
        serviceFileName: selectedTariff.name,
        designIndex: selectedDesignIndex,
        designFileName: selectedDesign.name,
        serviceName: serviceData.name,
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

      localStorage.setItem("selectedPackages", JSON.stringify(selectedPackages));
      router.push("/final");
    }
  };

  const currentItems = currentStage === 1 ? serviceData?.tariffs || [] : serviceData?.designs || [];
  const selectedIndex = currentStage === 1 ? selectedTariffIndex : selectedDesignIndex;
  const isContinueEnabled = selectedIndex !== null;

  if (!serviceData) return <div className="min-h-screen bg-[var(--bg-color)] transition-colors duration-300" />;

  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] flex flex-col items-center overflow-x-hidden no-scrollbar transition-colors duration-300">
      {/* Main Wrapper for 375px design */}
      <div className="w-full max-w-[375px] min-h-screen flex flex-col relative pb-[220px]">

        {/* Premium SVG Header */}
        <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[375px] h-[130px] z-[100] transition-colors duration-300">
          <svg width="375" height="130" viewBox="0 0 375 130" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full transition-colors duration-300">
            <mask id="path-1-inside-1_132_5703" fill="white">
              <path d="M0 0H375V130H0V0Z" />
            </mask>
            <path d="M0 0H375V130H0V0Z" fill="var(--bg-color)" />
            <path d="M375 130V129H0V130V131H375V130Z" fill="var(--border-color)" mask="url(#path-1-inside-1_132_5703)" />
            
            {/* Step 1 Progress */}
            <rect x="24" y="56" width="103.667" height="12" rx="6" fill="var(--border-color)" />
            <path 
              d={currentStage === 1 ? "M24 56H69.8333C73.147 56 75.8333 58.6863 75.8333 62C75.8333 65.3137 73.147 68 69.8333 68H24V56Z" : "M24 56H121.667C124.981 56 127.667 58.6863 127.667 62C127.667 65.3137 124.981 68 121.667 68H24V56Z"} 
              fill={currentStage >= 1 ? "var(--text-primary)" : "var(--nav-btn)"} 
              className="transition-all duration-500"
            />

            {/* Step 2 Progress */}
            <rect x="135.667" y="56" width="103.667" height="12" rx="6" fill="var(--border-color)" />
            <path 
              d={currentStage === 2 ? "M135.667 56H181.5C184.814 56 187.5 58.6863 187.5 62C187.5 65.3137 184.814 68 181.5 68H135.667V56Z" : (currentStage > 2 ? "M135.667 56H233.334C236.648 56 239.334 58.6863 239.334 62C239.334 65.3137 236.648 68 233.334 68H135.667V56Z" : "M135.667 56H135.667V68H135.667V56Z")} 
              fill={currentStage >= 2 ? "var(--text-primary)" : "var(--nav-btn)"} 
              className="transition-all duration-500"
            />

            {/* Step 3 Progress */}
            <rect x="247.333" y="56" width="103.667" height="12" rx="6" fill="var(--border-color)" />
            <path 
              d={currentStage === 3 ? "M247.333 56H293.167C296.481 56 299.167 58.6863 299.167 62C299.167 65.3137 296.481 68 293.167 68H247.333V56Z" : "M247.333 56H247.333V68H247.333V56Z"} 
              fill={currentStage >= 3 ? "var(--text-primary)" : "var(--nav-btn)"} 
              className="transition-all duration-500"
            />

            {/* Back Arrow */}
            <path d="M51 100L29 100M29 100L38.4286 109M29 100L38.4286 91" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

          {/* Hit Areas */}
          <button
            onClick={() => currentStage === 2 ? setCurrentStage(1) : router.back()}
            className="absolute left-[20px] top-[80px] w-12 h-12 flex items-center justify-center active:scale-95 z-20"
          />

          {/* Main Service Name (Prominent in center) */}
          <h1 className="absolute top-[88px] left-1/2 -translate-x-1/2 text-[18px] font-black text-[var(--text-primary)] uppercase tracking-[0.2em] pointer-events-none whitespace-nowrap transition-colors duration-300">
            {serviceData.name}
          </h1>
        </header>

        {/* Dynamic Spacer */}
        <div className="h-[148px] shrink-0" />

        {/* 3. Title Section */}
        <div className="px-[24px] mb-[32px]">
          <h2 className="text-[24px] font-bold text-[var(--text-primary)] leading-[120%] transition-colors duration-300">
            Выберите {currentStage === 1 ? "пакет услуг" : "пакет дизайна"}
          </h2>
          <p className="text-[16px] font-normal text-[var(--text-secondary)] leading-[150%] transition-colors duration-300">
            {currentStage === 1 ? "Собери приложение" : "Каким должно быть оформление"}
          </p>
        </div>

        {/* 4. Carousel of Cards */}
        <div
          className="flex-1 relative overflow-hidden px-[24px] py-[4px] cursor-grab active:cursor-grabbing"
          onMouseDown={(e) => onDragStart(e.pageX)}
          onMouseMove={(e) => onDragMove(e.pageX)}
          onMouseUp={() => onDragEnd()}
          onMouseLeave={() => onDragEnd()}
          onTouchStart={(e) => onDragStart(e.touches[0].pageX)}
          onTouchMove={(e) => onDragMove(e.touches[0].pageX)}
          onTouchEnd={() => onDragEnd()}
          style={{ touchAction: 'pan-y' }}
        >
          <div
            ref={trackRef}
            className="flex gap-[20px] will-change-transform"
            style={{
              transform: `translateX(0px)`,
              transition: 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)'
            }}
          >
            {currentItems.map((item, index) => {
              const isSelected = selectedIndex === index;
              return (
                <div
                  key={item.id}
                  className="shrink-0 w-[244px] h-[432px] relative select-none"
                  onClick={() => handleCardClick(index)}
                >
                  {/* Main Card Body */}
                  <div
                    className="absolute inset-0 z-10 p-[16px] rounded-[24px] flex flex-col justify-between transition-all duration-300 bg-[var(--tarif-card-bg)] overflow-hidden border border-[var(--border-color)]"
                  >
                    <CardGlow isVisible={isSelected} />
                    {currentStage === 2 && index === 0 && <DesignOneBackground />}
                    {currentStage === 2 && index === 1 && <DesignTwoBackground />}
                    {currentStage === 2 && index === 2 && <DesignThreeBackground />}

                    <div className="relative z-20 flex flex-col gap-[24px]">
                      {/* Header Info */}
                      <div className="flex flex-col gap-[8px]">
                        <h3 className="text-[18px] font-bold text-[var(--text-primary)] leading-[120%] transition-colors duration-300">
                          {item.name}
                        </h3>
                        <div className="flex flex-col gap-[0px]">
                          <div className="text-[24px] font-normal text-[var(--text-primary)] leading-[150%] transition-colors duration-300">
                            от {Number(item.price).toLocaleString()} ₽
                          </div>
                          <p className="text-[13px] font-normal text-[var(--text-secondary)] leading-[154%] transition-colors duration-300">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      {/* Features List */}
                      <div className="flex flex-col gap-[8px]">
                        {currentStage === 1 && (item as Tariff).features?.map((feature) => (
                          <div key={feature.id} className="flex items-start gap-[8px]">
                            <div className="shrink-0 pt-[2px]">
                              <CustomCheckIcon color="var(--text-primary)" />
                            </div>
                            <span className="text-[16px] font-normal text-[var(--text-secondary)] leading-[150%] line-clamp-2 transition-colors duration-300">
                              {feature.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Select Button */}
                    <div className="relative z-20">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCardClick(index);
                        }}
                        className={`
                          w-full h-[44px] rounded-full border flex items-center justify-center transition-all active:scale-95 transition-colors duration-300
                          ${isSelected
                            ? 'bg-[var(--tarif-card-bg)] border-[var(--text-primary)]'
                            : 'bg-transparent border-[var(--text-primary)]'}
                        `}
                      >
                        <div className="relative w-full h-full flex items-center justify-center">
                          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                            <svg width="212" height="44" viewBox="0 0 212 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M97 22L103 28L115 16" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                          <span className={`text-[16px] font-bold text-[var(--text-primary)] transition-all duration-300 ${isSelected ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}>
                            Выбрать
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 6. Footer Tab Bar with Controller & Continue Button */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[375px] h-[200px] px-[24px] pb-[40px] z-50 pointer-events-none flex flex-col justify-end">
          {/* Gradient protective background */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-color)] via-[var(--bg-color)] to-transparent z-0 transition-colors duration-300" />

          <div className="relative z-10 flex flex-col gap-[20px] items-center">
            {/* Premium SVG Slider Controller */}
            <div className="pointer-events-auto select-none">
              <svg width="327" height="32" viewBox="0 0 327 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-colors duration-300">
                {/* Left Button Pill */}
                <rect 
                  x="0.5" y="0.5" width="79" height="31" rx="15.5" 
                  stroke={activeCardIndex > 0 ? "var(--text-secondary)" : "var(--border-color)"} 
                  fill="transparent"
                  className={activeCardIndex > 0 ? "cursor-pointer active:opacity-50 transition-all" : "cursor-default"}
                  onClick={() => activeCardIndex > 0 && goToCard(activeCardIndex - 1)}
                />
                <path 
                  d="M48 16L32 16M32 16L38.8571 22.5M32 16L38.8571 9.5" 
                  stroke={activeCardIndex > 0 ? "var(--text-primary)" : "var(--border-color)"} 
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
                  className="pointer-events-none"
                />

                {/* Markers Section - Pill shapes as per design */}
                {currentItems.map((_, i) => {
                  const xBase = 130.5 + (i * 24.667); // Exact spacing from your SVG
                  const isActive = activeCardIndex === i;
                  
                  return (
                    <g key={i} className="cursor-pointer group" onClick={() => goToCard(i)}>
                      <rect 
                        x={xBase} y="10" 
                        width="16.6667" 
                        height="12" rx="6" 
                        fill={isActive ? "var(--text-primary)" : "var(--border-color)"} 
                        className="transition-all duration-300 group-hover:opacity-80" 
                      />
                    </g>
                  );
                })}

                {/* Right Button Pill */}
                <rect 
                  x="247.5" y="0.5" width="79" height="31" rx="15.5" 
                  stroke={activeCardIndex < currentItems.length - 1 ? "var(--text-secondary)" : "var(--border-color)"} 
                  fill="transparent"
                  className={activeCardIndex < currentItems.length - 1 ? "cursor-pointer active:opacity-50 transition-all" : "cursor-default"}
                  onClick={() => activeCardIndex < currentItems.length - 1 && goToCard(activeCardIndex + 1)}
                />
                <path 
                  d="M279 16L295 16M295 16L288.143 9.5M295 16L288.143 22.5" 
                  stroke={activeCardIndex < currentItems.length - 1 ? "var(--text-primary)" : "var(--border-color)"} 
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
                  className="pointer-events-none"
                />
              </svg>
            </div>

            {/* Continue Button */}
            <button
              onClick={handleContinue}
              disabled={!isContinueEnabled}
              className={`
                w-full h-[56px] rounded-full text-[16px] font-bold transition-all flex items-center justify-center tracking-tight pointer-events-auto transition-colors duration-300
                ${isContinueEnabled ? 'bg-[var(--text-primary)] text-[var(--bg-color)] active:scale-95 shadow-xl' : 'bg-[var(--tarif-card-bg)] text-[var(--text-secondary)] border border-[var(--border-color)] cursor-not-allowed'}
              `}
            >
              Продолжить
            </button>
          </div>
        </div>

      </div>
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