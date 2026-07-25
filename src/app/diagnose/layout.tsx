// [LAYOUT] 진단 퍼널 공용 레이아웃 — 상태 컨테이너(DiagnoseProvider) + 스텝 인디케이터.
// 스텝 목록은 IA 매니페스트(D 그룹)에서 파생한다. 하드코딩 금지.
"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { byGroup } from "@/lib/ia";
import { DiagnoseProvider } from "@/lib/diagnose/context";

const STEPS = byGroup("D"); // D-01 … D-06 (표 순서)

export default function DiagnoseLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const currentIdx = STEPS.findIndex((s) => s.path === pathname);

  return (
    <DiagnoseProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="border-b border-gray-100 bg-white/85 backdrop-blur sticky top-0 z-40">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
            <Link href="/" aria-label="B Essential 홈으로">
              <Image src="/logo.svg" alt="B Essential" width={110} height={20} priority />
            </Link>
            {currentIdx >= 0 && (
              <span className="text-xs text-gray-400 font-mono">
                STEP {currentIdx + 1} / {STEPS.length}
              </span>
            )}
          </div>
          {/* 스텝 진행 바 */}
          <div className="max-w-2xl mx-auto px-4 sm:px-6 pb-3 flex gap-1.5">
            {STEPS.map((s, i) => (
              <div
                key={s.id}
                title={s.name}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  currentIdx >= 0 && i <= currentIdx ? "bg-indigo-500" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </header>
        <main className="flex-1 w-full max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">{children}</main>
      </div>
    </DiagnoseProvider>
  );
}
