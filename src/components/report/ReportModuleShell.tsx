// [COMPONENT] 유료 리포트(R) 모듈 공용 셸 — 상단바 + 모듈 인디케이터(네비).
// 모듈 목록은 IA 매니페스트(R 그룹)에서 파생한다. 하드코딩 금지.
"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home } from "lucide-react";
import ReportTopBar from "./ReportTopBar";
import { byGroup } from "@/lib/ia";

// 허브(R-00)와 반려 분기(R-10)는 상시 네비에서 제외
const MODULES = byGroup("R").filter((s) => s.id !== "R-00" && s.id !== "R-10");

function withId(path: string, reportId: string): string {
  return path.replace("[reportId]", reportId);
}

export default function ReportModuleShell({ reportId, children }: { reportId: string; children: ReactNode }) {
  const pathname = usePathname();
  const hubHref = `/report/${reportId}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <ReportTopBar
        right={
          <Link href={hubHref} className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900">
            <Home size={13} /> 허브
          </Link>
        }
      />
      {/* 모듈 인디케이터 — 가로 스크롤 탭 */}
      <nav className="sticky top-14 z-30 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 flex gap-1 overflow-x-auto whitespace-nowrap scrollbar-hide py-2">
          {MODULES.map((m) => {
            const href = withId(m.path, reportId);
            const active = pathname === href;
            return (
              <Link
                key={m.id}
                href={href}
                className={`px-3 py-1.5 rounded-full text-xs transition-colors shrink-0 ${
                  active ? "bg-indigo-600 text-white font-semibold" : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {m.name}
              </Link>
            );
          })}
        </div>
      </nav>
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">{children}</main>
    </div>
  );
}
