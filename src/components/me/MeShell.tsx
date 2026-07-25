// [COMPONENT] 마이 페이지(M) 공용 셸 — 상단바 + 마이페이지 네비(ia.ts M 그룹 P1 파생).
"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { byGroup } from "@/lib/ia";

const ME_NAV = byGroup("M").filter((s) => s.scope === "P1"); // M-01/02/04/06

export default function MeShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/85 backdrop-blur">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" aria-label="B Essential 홈으로">
            <Image src="/logo.svg" alt="B Essential" width={110} height={20} priority />
          </Link>
          <span className="text-sm font-semibold text-gray-700">마이 페이지</span>
        </div>
      </header>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col md:flex-row gap-6">
        <nav className="md:w-48 shrink-0 flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
          {ME_NAV.map((s) => {
            const active = pathname === s.path;
            return (
              <Link
                key={s.id}
                href={s.path}
                className={`px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                  active ? "bg-indigo-600 text-white font-semibold" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {s.name}
              </Link>
            );
          })}
        </nav>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
