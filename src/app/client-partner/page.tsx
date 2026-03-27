"use client";

import MobileView from "./MobileView";
import DesktopView from "./DesktopView";

export default function ClientPartnerPage() {
  return (
    <>
      {/* Mobile View */}
      <div className="md:hidden w-full min-h-screen relative">
        <MobileView />
      </div>

      {/* PC View */}
      <div className="hidden md:flex w-full min-h-screen relative">
        <DesktopView />
      </div>
    </>
  );
}
