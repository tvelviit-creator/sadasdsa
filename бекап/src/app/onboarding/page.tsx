"use client";

import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] flex flex-col items-center justify-between p-8 relative overflow-hidden transition-colors duration-300">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-20%] w-[600px] h-[600px] bg-[var(--accent-cyan)] opacity-[0.07] blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-20%] w-[500px] h-[500px] bg-[var(--accent-neon-pink)] opacity-[0.05] blur-[100px] rounded-full animate-pulse delay-1000" />
      <div className="absolute top-[30%] right-[-10%] w-[300px] h-[300px] bg-[var(--text-primary)] opacity-[0.02] blur-[80px] rounded-full" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center z-10 w-full max-w-sm">
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-gradient-to-tr from-[var(--accent-cyan)] to-[var(--accent-neon-pink)] blur-2xl opacity-20 animate-pulse" />
          <div className="w-24 h-24 rounded-[32px] bg-gradient-to-tr from-[var(--accent-cyan)] to-[var(--accent-neon-pink)] p-[2px] relative z-10">
            <div className="w-full h-full rounded-[30px] bg-[var(--bg-color)] flex items-center justify-center">
              <span className="text-4xl font-black tracking-tighter text-[var(--text-primary)]">
                TV
              </span>
            </div>
          </div>
        </div>

        <h1 className="tvelvi-h2 mb-6 tracking-tight">
          Привет! <br />
          Это <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--accent-cyan)] via-[var(--text-primary)] to-[var(--accent-cyan)] bg-[length:200%_auto] animate-gradient-x">Tvelv</span>
        </h1>

        <p className="text-[var(--text-secondary)] tvelvi-l leading-relaxed max-w-[280px] mx-auto">
          Ваша персональная <br /> экосистема услуг
        </p>
      </div>

      {/* Action Section */}
      <div className="w-full max-w-sm z-10 space-y-6 pb-8">
        <div className="glass-card p-2 p-[2px] bg-gradient-to-r from-transparent via-[var(--text-primary)]/10 to-transparent">
          <button
            onClick={() => router.push("/registration")}
            className="w-full h-[68px] bg-[var(--text-primary)] text-[var(--bg-color)] tvelvi-h6 rounded-[28px] transition-all active:scale-[0.97] hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] flex items-center justify-center gap-3"
          >
            Начать работу
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </button>
        </div>

        <p className="text-center tvelvi-h9 text-[var(--text-secondary)] opacity-40">
          Powered by next-gen AI
        </p>
      </div>
    </div>
  );
}
