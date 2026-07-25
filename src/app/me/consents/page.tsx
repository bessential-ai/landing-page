// [SCR: M-04] 동의 · 약관 관리 · scope: P1
"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import MeShell from "@/components/me/MeShell";

export default function ConsentsPage() {
  // 필수 동의는 서비스 이용에 필요하므로 항상 동의 상태. 선택(마케팅)만 변경 가능.
  const [marketing, setMarketing] = useState(false);

  const required = [
    { label: "이용약관", href: "/legal/terms" },
    { label: "개인정보 수집·이용", href: "/legal/privacy" },
    { label: "만 14세 이상", href: undefined },
  ];

  return (
    <MeShell>
      <h1 className="text-xl font-bold text-gray-900 mb-5">동의 · 약관 관리</h1>

      <section className="mb-6">
        <h2 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">필수 동의</h2>
        <div className="rounded-2xl border border-gray-100 bg-white divide-y divide-gray-50 overflow-hidden">
          {required.map((r) => (
            <div key={r.label} className="flex items-center gap-3 px-4 py-3.5">
              <span className="w-5 h-5 rounded-md bg-indigo-600 text-white flex items-center justify-center shrink-0"><Check size={12} /></span>
              <span className="text-sm text-gray-800 flex-1">{r.label}</span>
              {r.href && <Link href={r.href} className="text-[11px] text-gray-400 underline hover:text-gray-700">보기</Link>}
            </div>
          ))}
        </div>
        <p className="text-[11px] text-gray-400 mt-1.5">필수 동의는 서비스 이용에 필요합니다. 철회를 원하시면 계정 탈퇴를 이용해 주세요.</p>
      </section>

      <section>
        <h2 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">선택 동의</h2>
        <button
          type="button"
          onClick={() => setMarketing((v) => !v)}
          className={`w-full flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-colors ${marketing ? "border-indigo-300 bg-indigo-50/60" : "border-gray-200 bg-white"}`}
        >
          <span className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${marketing ? "bg-indigo-600 border-indigo-600 text-white" : "border-gray-300"}`}>
            {marketing && <Check size={12} />}
          </span>
          <span className="text-sm text-gray-800">마케팅·혜택 알림 수신</span>
        </button>
      </section>
      {/* TODO(auth-api): 동의 상태 저장/철회 연동 */}
    </MeShell>
  );
}
