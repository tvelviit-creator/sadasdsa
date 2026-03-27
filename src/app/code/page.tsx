"use client";

import { Suspense } from "react";
import MobileView from "./MobileView";
import DesktopView from "./DesktopView";

function CodePageContent() {
  return (
    <>
      {/* Mobile View */}
      <div className="md:hidden">
        <MobileView />
      </div>

      {/* PC View */}
      <div className="hidden md:block">
        <DesktopView />
      </div>
    </>
  );
}

export default function CodePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#040405]" />}>
      <CodePageContent />
    </Suspense>
  );
}
