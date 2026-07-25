// [SCR: P-04] 샘플 리포트 · scope: P1
"use client";

import { useState } from "react";
import { FileText, ListChecks, X, ShieldAlert, HelpCircle, CheckCircle2 } from "lucide-react";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import { examples, sampleTabs } from "@/content/landing";

export default function SamplePage() {
  const [exIdx, setExIdx] = useState(0);
  const [tabId, setTabId] = useState("diag");
  const [showModal, setShowModal] = useState(false);
  const E = examples[exIdx];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SiteHeader />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <div className="text-center mb-6 sm:mb-8">
          <span className="text-xs font-semibold tracking-widest text-indigo-600 uppercase">SAMPLE OUTPUT</span>
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mt-1 sm:mt-3">결제하면, 이만큼 나옵니다</h1>
        </div>

        <div className="flex gap-2 items-center mb-3 overflow-x-auto pb-1 whitespace-nowrap scrollbar-hide">
          <span className="text-[11px] text-gray-400 sticky left-0 bg-white pr-2 shrink-0">예시</span>
          {examples.map((x, i) => (
            <button
              key={x.id}
              onClick={() => setExIdx(i)}
              className={`px-3 py-1 text-xs rounded-full border ${exIdx === i ? "bg-indigo-50 text-indigo-600 border-indigo-200 font-semibold" : "border-gray-200 text-gray-500 bg-white"}`}
            >
              {x.label}
            </button>
          ))}
        </div>

        <div className="mb-3 p-3 bg-white border border-gray-100 rounded-xl flex gap-2 text-xs sm:text-sm">
          <span className="shrink-0 bg-indigo-50 text-indigo-600 px-1.5 py-0.5 text-[10px] font-mono rounded h-fit">입력</span>
          <p className="text-gray-700 leading-normal">{E.input}</p>
        </div>

        <div className="flex gap-1 mb-3 overflow-x-auto pb-1 whitespace-nowrap scrollbar-hide border-b border-gray-100">
          {sampleTabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTabId(t.id)}
              className={`px-4 py-2 text-xs font-medium border-b-2 transition-all ${tabId === t.id ? "border-indigo-600 text-indigo-600 font-bold" : "border-transparent text-gray-400"}`}
            >
              <span className="mr-1 font-mono text-[10px] opacity-60">{t.code}</span>
              {t.label}
            </button>
          ))}
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 shadow-sm text-xs sm:text-sm mb-3">
          {tabId === "diag" && (
            <div>
              <div className="font-bold mb-2.5 flex items-center gap-1.5">
                종합 매핑 요약 <span className="text-green-600 bg-green-50 px-1.5 py-0.5 rounded text-[10px]">무료 공개</span>
              </div>
              <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-50">
                {E.summary.map((s, i) => (
                  <div key={i} className="grid grid-cols-1 sm:grid-cols-4 p-3 gap-1 sm:gap-3">
                    <span className="font-semibold text-indigo-600 text-xs">{s.k}</span>
                    <span className="sm:col-span-3 text-gray-600 text-xs break-all">{s.v}</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-5 items-center">
                <div className="text-center bg-gray-50/60 rounded-xl p-3">
                  <div className="text-3xl sm:text-4xl font-extrabold text-indigo-600">
                    {E.score}
                    <span className="text-xs text-gray-400">/100</span>
                  </div>
                  <div className="text-[10px] text-gray-400 mt-1">비즈니스 진단 지수</div>
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  {E.axes.map((a, i) => (
                    <div key={i} className="grid grid-cols-4 items-center gap-1 text-[11px] sm:text-xs">
                      <span className="text-gray-600 truncate col-span-1">{a.label}</span>
                      <div className="col-span-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500" style={{ width: `${a.score}%` }} />
                      </div>
                      <span className="text-right font-mono text-gray-900 col-span-1">{a.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {tabId === "road" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {E.roadmap.map((r, i) => (
                <div key={i} className="border border-gray-100 p-4 rounded-xl bg-gray-50/50">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="bg-indigo-50 text-indigo-600 text-[10px] font-mono px-1.5 py-0.5 rounded">{r.code}</span>
                    <span className="text-[10px] text-gray-400">{r.dur}</span>
                  </div>
                  <div className="font-bold text-gray-900 text-xs sm:text-sm">{r.title}</div>
                  <p className="text-[11px] text-gray-500 mt-1 break-keep">{r.goal}</p>
                </div>
              ))}
            </div>
          )}
          {tabId === "admin" && (
            <div>
              <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-100">
                {E.compare.map((c, i) => (
                  <div key={i} className="grid grid-cols-3 p-3 text-[11px] sm:text-xs">
                    <span className="font-bold text-gray-700 truncate">{c.k}</span>
                    <span className="text-gray-500 truncate">개인: {c.a}</span>
                    <span className="text-indigo-600 font-semibold truncate">법인: {c.b}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {tabId === "docs" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {E.artifacts.slice(0, 6).map((a, i) => (
                <div key={i} className="border border-gray-100 p-3 rounded-xl">
                  <FileText className="text-indigo-500 w-4 h-4 mb-1" />
                  <div className="font-bold text-xs text-gray-900 truncate">{a.t}</div>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-tight break-keep">{a.d}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-center mt-3">
          <button
            onClick={() => setShowModal(true)}
            className="w-full sm:w-auto px-5 py-3 rounded-full bg-neutral-900 text-white font-medium text-xs hover:bg-neutral-800 transition-colors inline-flex items-center gap-1.5 shadow-sm whitespace-nowrap justify-center focus:outline-none"
          >
            <ListChecks size={15} /> 상세 리포트 보기 →
          </button>
        </div>
      </main>
      <SiteFooter />

      {/* ── 상세 리포트 팝업 모달 (랜딩에서 이동) ── */}
      <div
        className={`fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 bg-neutral-950/60 backdrop-blur-md transition-all duration-300 ${showModal ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setShowModal(false)}
      >
        <div
          className={`bg-white w-full max-w-4xl h-full sm:h-[85vh] rounded-none sm:rounded-3xl shadow-2xl overflow-hidden border border-neutral-100 flex flex-col transition-all duration-500 transform ${showModal ? "translate-y-0 scale-100" : "translate-y-12 scale-95"}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50 shrink-0">
            <div>
              <div className="text-[9px] sm:text-[10px] font-mono font-bold text-indigo-600 uppercase tracking-widest mb-0.5">B Essential Analytics</div>
              <h3 className="text-sm sm:text-base font-bold text-neutral-900 truncate max-w-[200px] sm:max-w-none">{E.label} 상세 리포트</h3>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200/70 text-neutral-500 hover:text-neutral-900 transition-colors focus:outline-none"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 sm:space-y-8 select-text">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
              <div className="md:col-span-2 space-y-5 sm:space-y-6">
                <div className="border border-neutral-100 rounded-xl sm:rounded-2xl p-4 sm:p-5 bg-white shadow-sm">
                  <h4 className="font-bold text-neutral-950 text-xs sm:text-sm mb-3.5 flex items-center gap-1.5 text-red-600">
                    <ShieldAlert size={16} /> 크리티컬 리스크 통제 장치
                  </h4>
                  <div className="space-y-3.5">
                    {E.risks?.map((r, i) => (
                      <div key={i} className="border-b border-neutral-50 pb-3 last:border-none last:pb-0 text-xs">
                        <div className="flex items-center gap-2 font-bold text-neutral-900 mb-1">
                          <span className="break-all">{r.t}</span>
                          <span className="bg-red-50 text-red-600 border border-red-100 px-1.5 py-0.5 rounded text-[9px] font-mono shrink-0">{r.sev}</span>
                        </div>
                        <p className="text-neutral-500 leading-relaxed text-[11px] sm:text-xs break-keep">{r.d}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {E.assumptions && (
                  <div className="border border-neutral-100 rounded-xl sm:rounded-2xl p-4 sm:p-5 bg-white shadow-sm">
                    <h4 className="font-bold text-neutral-950 text-xs sm:text-sm mb-3.5 flex items-center gap-1.5 text-indigo-600">
                      <HelpCircle size={16} /> 먼저 검증해야 할 핵심 가설
                    </h4>
                    <div className="space-y-2.5">
                      {E.assumptions.map((a, i) => (
                        <div key={i} className="p-3 bg-neutral-50/60 rounded-xl text-xs border border-neutral-100/50">
                          <div className="font-semibold text-neutral-900 mb-1 flex items-center gap-1 break-keep">🎯 가설: {a.a}</div>
                          <div className="text-neutral-500 mb-1 leading-normal"><span className="font-medium text-neutral-700">방법:</span> {a.how}</div>
                          <div className="text-indigo-600 font-medium leading-normal"><span className="font-medium text-neutral-700">합격선:</span> {a.pass}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-5 sm:space-y-6">
                <div className="border border-neutral-100 rounded-xl sm:rounded-2xl p-4 sm:p-5 bg-white shadow-sm">
                  <h4 className="font-bold text-neutral-950 text-xs sm:text-sm mb-3.5 flex items-center gap-1.5 text-emerald-600">
                    <CheckCircle2 size={16} /> 단계별 구체적 할 일 목록
                  </h4>
                  <div className="space-y-3">
                    {E.roadmap.map((r, i) => (
                      <div key={i} className="p-3 border border-neutral-100 bg-neutral-50/50 rounded-xl text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono font-bold text-[9px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded">{r.code}</span>
                          <span className="text-[9px] text-neutral-400">{r.dur}</span>
                        </div>
                        <div className="font-semibold text-xs text-neutral-900 mb-1.5">{r.title}</div>
                        <ul className="space-y-1 pl-3.5 list-disc text-neutral-500 text-[11px] sm:text-xs leading-normal break-keep">
                          {r.todos?.map((todo, idx) => (
                            <li key={idx}>{todo}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
