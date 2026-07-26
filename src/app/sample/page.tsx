// [SCR: P-04] 샘플 리포트 · scope: P1
// STEP 2: 데이터 소스를 src/data/demo-report.ts 로 통일(재사용). 프레젠테이션은 /mockup 과 달라도 됨.
// 9스텝 인덱스를 전부 노출 — 무료 2개는 열림, 유료 7개는 자물쇠(lockedTeaser). CTA는 요금제로.
"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, Check, ChevronDown, ArrowRight } from "lucide-react";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import { SAMPLE_REPORTS, type Step } from "@/data/demo-report";

export default function SamplePage() {
  const [tab, setTab] = useState(0);
  const report = SAMPLE_REPORTS[tab];
  const freeCount = report.steps.filter((s) => s.tier === "free").length;
  const paidCount = report.steps.filter((s) => s.tier === "paid").length;

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SiteHeader />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <div className="text-center mb-6 sm:mb-8">
          <span className="text-xs font-semibold tracking-widest text-indigo-600 uppercase">SAMPLE OUTPUT</span>
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mt-1 sm:mt-3">결제하면, 이만큼 나옵니다</h1>
          <p className="text-sm text-gray-500 mt-2 break-keep">무료 {freeCount}단계는 열려 있고, 유료 {paidCount}단계는 결제 후 열립니다. 무엇이 들어있는지 목록으로 먼저 확인하세요.</p>
        </div>

        {/* 예시 탭 */}
        <div className="flex gap-2 justify-center mb-6 flex-wrap">
          {SAMPLE_REPORTS.map((r, i) => (
            <button key={r.id} onClick={() => setTab(i)} className={`px-3.5 py-1.5 text-xs rounded-full border transition-colors ${tab === i ? "bg-indigo-50 text-indigo-600 border-indigo-200 font-semibold" : "border-gray-200 text-gray-500 bg-white"}`}>
              {r.label}
            </button>
          ))}
        </div>

        {/* 입력 아이디어 */}
        <div className="mb-5 p-3 bg-gray-50 border border-gray-100 rounded-xl flex gap-2 text-xs sm:text-sm">
          <span className="shrink-0 bg-indigo-50 text-indigo-600 px-1.5 py-0.5 text-[10px] font-mono rounded h-fit">입력</span>
          <p className="text-gray-700 leading-normal break-keep">{report.idea}</p>
        </div>

        {/* 9스텝 인덱스 — 전부 노출 */}
        <div className="space-y-2.5">
          {report.steps.map((s) => (
            <SampleStepCard key={s.id} step={s} />
          ))}
        </div>

        {/* CTA → 요금제 */}
        <div className="mt-8 rounded-2xl border border-indigo-200 bg-indigo-50/50 p-5 text-center">
          <p className="text-sm text-gray-700 break-keep mb-3">잠긴 {paidCount}단계 전체를 열어보세요.</p>
          <Link href="/pricing" className="inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-full bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors">
            요금제 보기 <ArrowRight size={16} />
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function SampleStepCard({ step }: { step: Step }) {
  const [open, setOpen] = useState(step.tier === "free");
  const isPaid = step.tier === "paid";

  return (
    <div className={`rounded-xl border overflow-hidden ${isPaid ? "border-gray-200 bg-gray-50/40" : "border-gray-100 bg-white shadow-sm"}`}>
      <button onClick={() => !isPaid && setOpen((v) => !v)} className={`w-full flex items-center gap-3 px-4 py-3.5 text-left ${isPaid ? "cursor-default" : ""}`}>
        <span className="font-mono text-xs text-indigo-500 w-6 shrink-0">{step.no}</span>
        <span className="flex-1 min-w-0">
          <span className="text-sm font-semibold text-gray-900">{step.title}</span>
          <span className="block text-[11px] text-gray-400 break-keep">{step.summary}</span>
        </span>
        {isPaid ? (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-gray-400 bg-white border border-gray-200 rounded-full px-2 py-0.5 shrink-0"><Lock size={10} /> 유료</span>
        ) : (
          <>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 rounded px-1.5 py-0.5 shrink-0">무료</span>
            <ChevronDown size={16} className={`text-gray-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
          </>
        )}
      </button>

      {/* 무료: 열림 — summary 텍스트 미리보기 / 유료: 자물쇠 오버레이(lockedTeaser) */}
      {isPaid ? (
        <div className="px-4 pb-3.5 flex items-start gap-2">
          <Lock size={13} className="text-gray-300 shrink-0 mt-0.5" />
          <p className="text-[11px] text-gray-500 break-keep">{step.lockedTeaser ?? "결제 후 열람할 수 있습니다."}</p>
        </div>
      ) : (
        open && (
          <div className="px-4 pb-4 space-y-1.5 border-t border-gray-50 pt-3">
            {step.blocks.filter((b) => b.kind === "text").map((b, i) =>
              b.kind === "text" ? (
                <div key={i} className="text-xs text-gray-600 break-keep">
                  {b.heading && <span className="font-semibold text-gray-800">{b.heading}: </span>}
                  {b.body}
                </div>
              ) : null
            )}
            {/* 02 종합진단: 판정 한 줄 + 종합 점수 미리보기 */}
            {step.blocks.map((b, i) =>
              b.kind === "verdict" ? (
                <div key={i} className="text-xs text-gray-700 break-keep flex items-start gap-1.5">
                  <Check size={12} className="text-indigo-500 mt-0.5 shrink-0" />
                  {b.sentence}
                </div>
              ) : b.kind === "score" ? (
                <div key={i} className="inline-flex items-baseline gap-1 text-indigo-600 font-extrabold text-lg">
                  {b.total}
                  <span className="text-[10px] text-gray-400 font-normal">/100 종합</span>
                </div>
              ) : null
            )}
          </div>
        )
      )}
    </div>
  );
}
