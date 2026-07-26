"use client";

import React, { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  FileText, ArrowRight, Check, Lock, ChevronRight, ChevronDown,
  Download, TrendingUp, Scale, Gauge, Sparkles,
  Lightbulb, ThumbsUp, ThumbsDown, AlertTriangle, Landmark, Copy, Layers,
  BookOpen, PenTool,
} from "lucide-react";
import {
  STEPS, FREE_STEPS, PAID_STEPS, DEMO_IDEA, ATTACH_LIMIT,
  type Step, type ScoreBlock, type ProsConsBlock, type VerdictBlock, type LeanCanvasBlock, type LeanCanvasCell,
  type MarketStageBlock, type MetricItemBlock, type RoadmapPhaseBlock, type RiskCardBlock,
  type GrantBlock, type PromptBlock, type CollapseBlock, type CompetitorCategoriesBlock,
  type CaseStudiesBlock, type RiskLevel, type Source,
} from "@/data/demo-report";

const ACCENT_GRAD = "linear-gradient(135deg, #6366F1, #8B5CF6)";

// 상단 스텝 인디케이터는 demo-report.ts 에서 파생 (00 데모 메인 + STEPS).
const VIEWS = [{ no: "00", id: "demo-main", title: "데모 메인", tier: "free" as const }, ...STEPS];

function stepById(id: string): Step {
  return STEPS.find((s) => s.id === id)!;
}

/* ─────────────── 공용 UI ─────────────── */

function NeedsCheck() {
  return (
    <span className="inline-flex items-center text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5 align-middle">
      (확인 필요)
    </span>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div className="text-[10px] font-bold uppercase tracking-widest text-indigo-500">{children}</div>;
}

function SectionHead({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div className="mb-4">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-1 text-lg sm:text-2xl font-extrabold tracking-tight text-neutral-900">{title}</h2>
      {sub && <p className="mt-1 text-xs sm:text-sm text-neutral-500 break-keep">{sub}</p>}
    </div>
  );
}

// 출처 슬롯 — 실제 항목은 TODO(sources). 확인됨/확인필요 카운터 표시.
function SourceSlot({ sources }: { sources?: Source[] }) {
  const list = sources ?? [];
  const confirmed = list.filter((s) => s.confidence === "확인됨").length;
  const pending = list.filter((s) => s.confidence === "확인 필요").length;
  return (
    <div className="mt-6 pt-3 border-t border-neutral-100">
      <div className="flex items-center gap-2 text-[11px] text-neutral-400">
        <BookOpen size={12} />
        <span className="font-semibold text-neutral-500">출처 · 확인일</span>
        <span>확인된 항목 {confirmed}건 / <span className="text-amber-600 font-semibold">(확인 필요) {pending}건</span></span>
      </div>
      {/* TODO(sources): 문서명·발행기관·확인일·신뢰도 확정 후 기입 */}
    </div>
  );
}

// 유료 잠금 — 상단은 선명, 하단은 흐림 + 오버레이. 문구는 lockedTeaser(구체 수치).
function PaidLock({ locked, teaser, onUnlock, children }: { locked: boolean; teaser?: string; onUnlock: () => void; children: React.ReactNode }) {
  if (!locked) return <>{children}</>;
  return (
    <div className="relative overflow-hidden rounded-2xl">
      <div className="max-h-[38vh] overflow-hidden [mask-image:linear-gradient(to_bottom,black_45%,transparent)]">{children}</div>
      <div className="absolute inset-x-0 bottom-0 top-[30%] flex flex-col items-center justify-center gap-2 bg-white/40 backdrop-blur-[2px] px-6 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-900 text-white text-xs font-semibold px-3 py-1.5 shadow"><Lock size={13} /> 결제 후 열람</span>
        {teaser && <p className="text-xs sm:text-sm font-medium text-neutral-700 break-keep max-w-xs">{teaser}</p>}
        <button onClick={onUnlock} className="mt-1 inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-md transition-transform hover:-translate-y-0.5" style={{ background: ACCENT_GRAD }}>
          잠금 해제하고 전체 보기 <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

function ExpandRow({ title, badge, defaultOpen = false, children }: { title: string; badge?: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
      <button onClick={() => setOpen((v) => !v)} className="w-full flex items-center gap-2 px-3.5 py-3 text-left">
        <span className="text-sm font-semibold text-neutral-900 flex-1">{title}</span>
        {badge && <span className="text-[10px] font-mono text-neutral-400">{badge}</span>}
        <ChevronDown size={16} className={`text-neutral-400 transition-transform ${open ? "rotate-180 text-indigo-500" : ""}`} />
      </button>
      {open && <div className="px-3.5 pb-3.5 space-y-2 text-xs text-neutral-600">{children}</div>}
    </div>
  );
}

// 네비에서만 쓰는 축약 라벨 (스텝 제목은 그대로 유지) — 한 줄에 다 들어오도록
const NAV_SHORT: Record<string, string> = { risks: "리스크", "ai-bridge": "AI 연결", diagnosis: "종합 진단", bm: "BM", grants: "지원사업" };

function StepNav({ view, setView, paid, setPaid }: { view: string; setView: (v: string) => void; paid: boolean; setPaid: (v: boolean) => void }) {
  return (
    <div className="border-b border-neutral-100 bg-white/90 backdrop-blur sticky top-0 z-30">
      <div className="mx-auto max-w-6xl px-4 flex items-center justify-between gap-3 min-h-11 py-1.5 flex-wrap">
        <div className="flex flex-wrap gap-1">
          {VIEWS.map((v) => {
            const active = view === v.id;
            const isLocked = v.tier === "paid" && !paid;
            return (
              <button key={v.id} onClick={() => setView(v.id)} className={`shrink-0 inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold transition-colors ${active ? "text-white" : "text-neutral-500 hover:text-neutral-900"}`} style={active ? { background: ACCENT_GRAD } : {}}>
                <span className="font-mono opacity-70">{v.no}</span>{NAV_SHORT[v.id] ?? v.title}
                {isLocked && <Lock size={9} className="opacity-60" />}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-1 rounded-full bg-neutral-100 p-0.5 shrink-0">
          <button onClick={() => setPaid(false)} className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${!paid ? "bg-neutral-900 text-white" : "text-neutral-500"}`}>무료</button>
          <button onClick={() => setPaid(true)} className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${paid ? "text-white" : "text-neutral-500"}`} style={paid ? { background: ACCENT_GRAD } : {}}>결제 후</button>
        </div>
      </div>
    </div>
  );
}

function PrimaryButton({ children, onClick, disabled }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-md transition-transform enabled:hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed" style={{ background: ACCENT_GRAD }}>
      {children}
    </button>
  );
}

function StepShell({ step, children }: { step: Step; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-4 sm:py-6 h-full overflow-y-auto scrollbar-none">
      <SectionHead eyebrow={`STEP ${step.no} · ${step.tier === "free" ? "무료" : "유료"}`} title={step.title} sub={step.summary} />
      {children}
      <SourceSlot sources={step.sources} />
    </div>
  );
}

/* ─────────────── 00 데모 메인 ─────────────── */
function DemoMain({ onStart }: { onStart: () => void }) {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-5 sm:py-8 h-full overflow-y-auto scrollbar-none">
      <Eyebrow>DEMO</Eyebrow>
      <h1 className="mt-2 text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 break-keep">아이디어가 리포트가 되기까지, 9단계</h1>
      <p className="mt-2 text-sm text-neutral-500 break-keep">상단 탭으로 각 단계를 둘러보세요. 무료 2단계는 열려 있고, 유료 7단계는 잠겨 있습니다.</p>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {STEPS.map((s) => (
          <div key={s.id} className="rounded-xl border border-neutral-200 bg-white px-3 py-3">
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[11px] text-indigo-500">{s.no}</span>
              {s.tier === "paid" ? <Lock size={11} className="text-neutral-400" /> : <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 rounded px-1">무료</span>}
            </div>
            <div className="mt-1 text-sm font-semibold text-neutral-900">{s.title}</div>
            <div className="text-[11px] text-neutral-400 break-keep">{s.summary}</div>
          </div>
        ))}
      </div>
      <div className="mt-6"><PrimaryButton onClick={onStart}>데모 시작하기 <ArrowRight size={16} /></PrimaryButton></div>
    </div>
  );
}

/* ─────────────── 01 아이디어 입력 ─────────────── */
const BM_FIELDS = [
  { key: "problem", label: "해결하는 문제", ex: "비동거 자녀가 MCI 부모의 상태 변화를 매일 파악하기 어렵다" },
  { key: "customer", label: "핵심 고객", ex: "부모와 떨어져 사는 40~60대 자녀" },
  { key: "solution", label: "솔루션", ex: "보호자 목소리 AI 케어콜 → 3항목 확인 → 앱 기록·알림" },
  { key: "revenue", label: "수익 모델", ex: "B2C 월 구독 + 기관 B2B + 통신사 제휴" },
];

function IdeaInput({ onSubmit }: { onSubmit: () => void }) {
  const [oneLiner, setOneLiner] = useState(DEMO_IDEA);
  const [values, setValues] = useState<Record<string, string>>({});
  const [showConfirm, setShowConfirm] = useState(false);
  const firstEmptyRef = useRef<HTMLTextAreaElement | null>(null);

  const filledCount = BM_FIELDS.filter((f) => (values[f.key] ?? "").trim()).length;
  const canStart = oneLiner.trim().length > 0 && filledCount >= 2;
  const reason = !oneLiner.trim() ? "아이디어 한 줄을 입력하세요" : filledCount < 2 ? "비즈니스 모델 칸을 2개 이상 채우세요" : "";

  function fillExample() {
    setValues(Object.fromEntries(BM_FIELDS.map((f) => [f.key, f.ex])));
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-4 sm:py-6 h-full overflow-y-auto scrollbar-none relative">
      <SectionHead eyebrow="STEP 01 · 무료" title="아이디어 입력" sub="한 줄과 비즈니스 모델을 채우면, AI가 이해한 내용을 확인·수정합니다." />

      {/* 주인공: 한 줄 입력 */}
      <label className="block">
        <span className="text-xs font-semibold text-neutral-600">아이디어 한 줄</span>
        <textarea value={oneLiner} onChange={(e) => setOneLiner(e.target.value)} rows={3} className="mt-1 w-full rounded-2xl border-2 border-indigo-200 bg-white px-4 py-3.5 text-sm sm:text-base outline-none focus:border-indigo-400 resize-none" placeholder="예: 마감 임박한 음식을 동네 손님에게 할인가로 연결하는 앱" />
      </label>

      {/* BM 입력 */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {BM_FIELDS.map((f, i) => (
          <label key={f.key} className="block">
            <span className="text-[11px] font-semibold text-neutral-500">{f.label}</span>
            <textarea ref={i === 0 ? firstEmptyRef : undefined} value={values[f.key] ?? ""} onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))} rows={2} className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs outline-none focus:border-indigo-400 resize-none" placeholder={f.ex} />
          </label>
        ))}
      </div>

      {/* 예시(모범답안) — 클릭 시 자동 채움 */}
      <button onClick={fillExample} className="mt-3 w-full text-left rounded-xl border border-dashed border-indigo-200 bg-indigo-50/40 px-3.5 py-3 hover:bg-indigo-50 transition-colors">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600"><Sparkles size={13} /> 예시 입력 자동 채우기</div>
        <div className="text-[11px] text-neutral-500 mt-0.5">클릭하면 위 비즈니스 모델 칸이 모범답안으로 채워집니다.</div>
      </button>

      {/* 파일 첨부 — 무료/유료 개수 차이 */}
      <div className="mt-3 rounded-xl border border-neutral-200 bg-white px-3.5 py-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs text-neutral-600"><FileText size={14} className="text-neutral-400" /> 참고 자료 첨부</div>
        <div className="text-[11px] text-neutral-400">무료 <NeedsCheck /> / 유료 <NeedsCheck /> · 업그레이드 시 확대 {/* TODO(attach-limit) */}</div>
      </div>

      {/* 시작 버튼 */}
      <div className="mt-4">
        <PrimaryButton onClick={() => setShowConfirm(true)} disabled={!canStart}>진단 시작 <ArrowRight size={16} /></PrimaryButton>
        {!canStart && <div className="mt-1.5 text-center text-[11px] text-amber-600">{reason}</div>}
      </div>

      {/* 확인 팝업 — 페이지 이동 아님, 이 화면 위 오버레이 */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/50 backdrop-blur-sm p-4" onClick={() => setShowConfirm(false)}>
            <motion.div initial={{ y: 20, scale: 0.97 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: 0.97 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-neutral-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-neutral-100">
                <div className="text-[10px] font-mono font-bold text-indigo-500 uppercase tracking-widest">AI SUMMARY</div>
                <h3 className="text-base font-bold text-neutral-900 mt-0.5">이해한 내용이 맞나요?</h3>
              </div>
              <div className="px-5 py-4 space-y-2.5 max-h-[50vh] overflow-y-auto">
                <p className="text-sm text-neutral-700 leading-relaxed break-keep">{oneLiner}</p>
                {BM_FIELDS.filter((f) => (values[f.key] ?? "").trim()).map((f) => (
                  <div key={f.key} className="text-xs"><span className="font-semibold text-indigo-600">{f.label}: </span><span className="text-neutral-600">{values[f.key]}</span></div>
                ))}
                <p className="text-[11px] text-neutral-400 pt-1">AI가 위와 같이 이해했습니다. 틀린 곳이 있으면 수정해 주세요.</p>
              </div>
              <div className="px-5 py-4 flex gap-2 border-t border-neutral-100">
                <button onClick={() => { setShowConfirm(false); firstEmptyRef.current?.focus(); }} className="flex-1 rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-semibold text-neutral-600 hover:bg-neutral-50">수정하기</button>
                <button onClick={() => { setShowConfirm(false); onSubmit(); }} className="flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold text-white" style={{ background: ACCENT_GRAD }}>맞습니다, 진단 시작</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────── 02 종합 진단 리포트 ─────────────── */
function Diagnosis({ onNext }: { onNext: () => void }) {
  const step = stepById("diagnosis");
  const verdict = step.blocks.find((b) => b.kind === "verdict") as VerdictBlock;
  const score = step.blocks.find((b) => b.kind === "score") as ScoreBlock;
  const pc = step.blocks.find((b) => b.kind === "prosCons") as ProsConsBlock;
  const collapse = step.blocks.find((b) => b.kind === "collapse") as CollapseBlock;
  const [openAxis, setOpenAxis] = useState<string | null>(score.axes[0].key);

  return (
    <StepShell step={step}>
      {/* 판정 */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-4">
        <div className="text-sm font-bold text-neutral-900 break-keep">{verdict.sentence}</div>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <div className="text-[10px] font-bold uppercase text-neutral-400 mb-1">판정 근거</div>
            <ul className="space-y-1">{verdict.bases.map((b, i) => <li key={i} className="text-xs text-neutral-600 flex gap-1.5"><Check size={12} className="text-indigo-500 mt-0.5 shrink-0" />{b}</li>)}</ul>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase text-neutral-400 mb-1">다음에 할 일</div>
            <ol className="space-y-1">{verdict.nextActions.map((a, i) => <li key={i} className="text-xs text-neutral-600 flex gap-1.5"><span className="font-mono text-indigo-500">{i + 1}</span>{a}</li>)}</ol>
          </div>
        </div>
      </div>

      {/* 점수 + 6축 */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-4 items-start rounded-2xl border border-neutral-200 bg-white p-4">
        <div className="text-center sm:pr-4 sm:border-r border-neutral-100">
          <div className="text-5xl font-black text-transparent bg-clip-text" style={{ backgroundImage: ACCENT_GRAD }}>{score.total}</div>
          <div className="text-[10px] text-neutral-400">/ 100 · 종합</div>
        </div>
        <div className="space-y-1.5">
          {score.axes.map((a) => {
            const open = openAxis === a.key;
            return (
              <div key={a.key}>
                <button onClick={() => setOpenAxis(open ? null : a.key)} className="w-full flex items-center gap-2 text-left">
                  <span className="text-xs text-neutral-600 w-24 shrink-0 truncate">{a.label}</span>
                  <span className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden"><span className="block h-full rounded-full" style={{ width: `${a.score}%`, background: ACCENT_GRAD }} /></span>
                  <span className="text-xs font-mono font-bold text-neutral-900 w-7 text-right">{a.score}</span>
                  <ChevronDown size={13} className={`text-neutral-300 transition-transform ${open ? "rotate-180" : ""}`} />
                </button>
                {open && (
                  <div className="ml-24 mt-1 mb-2 rounded-lg bg-neutral-50 border border-neutral-100 px-3 py-2">
                    <div className="text-[10px] text-neutral-400 mb-1">이 항목은 이런 내용을 바탕으로 심사합니다: {a.rubric}</div>
                    <div className="text-xs text-neutral-600 break-keep">{a.rationale}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 장점 / 단점 — 클릭하면 상세 펼침 */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ProsCons title="장점" tone="good" items={pc.pros} />
        <ProsCons title="단점" tone="warn" items={pc.cons} />
      </div>

      {/* 유사 서비스 · 관련 사례 (접힘) */}
      <div className="mt-4 space-y-2">
        {collapse.blocks.map((b, i) => (
          <ExpandRow key={i} title={b.kind === "competitorCategories" ? "유사 서비스 · 대안" : "관련 사례"} defaultOpen={false}>
            {b.kind === "competitorCategories" && <CompetitorCategories block={b} />}
            {b.kind === "caseStudies" && <CaseStudies block={b} />}
          </ExpandRow>
        ))}
      </div>

      {/* 부정 판정 분기 */}
      {verdict.negativeBranch && (
        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/50 p-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700"><AlertTriangle size={13} /> 판정이 부정적일 때</div>
          <p className="text-[11px] text-amber-700 mt-1 break-keep">{verdict.negativeBranch.when}</p>
          <div className="mt-2 grid gap-2">
            {verdict.negativeBranch.alternatives.map((alt, i) => (
              <div key={i} className="rounded-lg bg-white border border-amber-100 px-3 py-2"><div className="text-xs font-semibold text-neutral-900">{alt.t}</div><div className="text-[11px] text-neutral-500 break-keep">{alt.d}</div></div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-5"><PrimaryButton onClick={onNext}>비즈니스 모델 보기 <ArrowRight size={16} /></PrimaryButton></div>
    </StepShell>
  );
}

function ProsCons({ title, tone, items }: { title: string; tone: "good" | "warn"; items: ProsConsBlock["pros"] }) {
  return (
    <div>
      <div className={`flex items-center gap-1.5 text-xs font-bold mb-2 ${tone === "good" ? "text-emerald-600" : "text-rose-600"}`}>
        {tone === "good" ? <ThumbsUp size={13} /> : <ThumbsDown size={13} />} {title} <span className="text-neutral-400 font-normal">· 눌러서 자세히</span>
      </div>
      <div className="space-y-2">
        {items.map((it, i) => (
          <ExpandRow key={i} title={it.t}>
            <div><span className="font-semibold text-neutral-500">무엇이: </span>{it.what}</div>
            <div><span className="font-semibold text-neutral-500">왜: </span>{it.why}</div>
            <div><span className="font-semibold text-neutral-500">영향: </span>{it.impact}</div>
          </ExpandRow>
        ))}
      </div>
    </div>
  );
}

function CompetitorCategories({ block }: { block: CompetitorCategoriesBlock }) {
  return (
    <div className="space-y-2">
      <div className="text-[10px] text-amber-600">개별 회사·제품명은 확인 후 표기 · {block.companyNamesTodo.replace("TODO(competitor-names): ", "")} <NeedsCheck /></div>
      {block.categories.map((c, i) => (
        <div key={i} className="rounded-lg border border-neutral-100 bg-neutral-50/60 px-3 py-2">
          <div className="text-xs font-bold text-neutral-800">{c.category}</div>
          <div className="mt-1 text-[11px] text-neutral-600"><span className="font-semibold">접근 방식: </span>{c.approach}</div>
          <div className="text-[11px] text-neutral-600"><span className="font-semibold">한계: </span>{c.limit}</div>
          <div className="text-[11px] text-indigo-600"><span className="font-semibold">우리와의 차이: </span>{c.diff}</div>
        </div>
      ))}
    </div>
  );
}

function CaseStudies({ block }: { block: CaseStudiesBlock }) {
  return (
    <div className="rounded-lg border border-dashed border-neutral-200 bg-neutral-50/60 px-3 py-3">
      <div className="text-[11px] text-neutral-500 break-keep">{block.structureNote}</div>
      <div className="mt-1.5 text-[10px] text-amber-600 flex items-center gap-1"><NeedsCheck /> {block.todo.replace("TODO(case-studies): ", "")}</div>
    </div>
  );
}

/* ─────────────── 03 비즈니스 모델 (린 캔버스 9블록 · Before/After 동시) ─────────────── */
function CanvasCell({ cell, className = "" }: { cell: LeanCanvasCell; className?: string }) {
  const [openWhy, setOpenWhy] = useState(false);
  return (
    <div className={`rounded-lg border border-neutral-200 bg-white p-2.5 flex flex-col ${className}`}>
      <div className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider mb-1.5 text-indigo-500">{cell.label}</div>
      {/* Before (내 입력) — 동시에 표시, 흐림·취소선 */}
      <div className="mb-1.5 text-[10px] text-neutral-400 break-keep line-through decoration-neutral-300">Before · {cell.before}</div>
      {/* After (AI 완성본) */}
      <ul className="space-y-1 flex-1">
        {cell.after.map((t, i) => (
          <li key={i} className="text-[11px] text-neutral-700 break-keep leading-relaxed flex gap-1">
            <span className="text-indigo-400 shrink-0">·</span><span>{t}</span>
          </li>
        ))}
      </ul>
      {/* 변경 이유 — 확인 가능 (칸마다) */}
      <button onClick={() => setOpenWhy((v) => !v)} className="mt-1.5 inline-flex items-center gap-1 self-start text-[9px] font-bold text-amber-600 hover:text-amber-700">
        <Lightbulb size={10} /> 왜 바꿨나 <ChevronDown size={9} className={openWhy ? "rotate-180" : ""} />
      </button>
      {openWhy && <p className="mt-1 rounded bg-amber-50 border border-amber-100 px-2 py-1.5 text-[10px] text-neutral-600 break-keep leading-relaxed">{cell.why}</p>}
    </div>
  );
}

function LeanCanvas({ cells }: { cells: LeanCanvasCell[] }) {
  const byId = Object.fromEntries(cells.map((c) => [c.id, c])) as Record<string, LeanCanvasCell>;
  const ordered = ["problem", "solution", "uvp", "advantage", "segment", "metrics", "channel", "cost", "revenue"];
  return (
    <>
      {/* 데스크톱: 클래식 린 캔버스 배치 (9블록 한눈에) */}
      <div className="hidden md:block">
        <div className="grid grid-cols-5 gap-2 items-stretch">
          <CanvasCell cell={byId.problem} className="row-span-2" />
          <CanvasCell cell={byId.solution} />
          <CanvasCell cell={byId.uvp} className="row-span-2" />
          <CanvasCell cell={byId.advantage} />
          <CanvasCell cell={byId.segment} className="row-span-2" />
          <CanvasCell cell={byId.metrics} />
          <CanvasCell cell={byId.channel} />
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <CanvasCell cell={byId.cost} />
          <CanvasCell cell={byId.revenue} />
        </div>
      </div>
      {/* 모바일: 순서대로 스택 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:hidden gap-2">
        {ordered.map((id) => <CanvasCell key={id} cell={byId[id]} />)}
      </div>
    </>
  );
}

function BusinessModel({ onNext }: { onNext: () => void }) {
  const step = stepById("bm");
  const lc = step.blocks.find((b) => b.kind === "leanCanvas") as LeanCanvasBlock;
  return (
    <StepShell step={step}>
      <div className="mb-3">
        <div className="text-xs text-neutral-500 break-keep">처음 적은 한 줄 입력(<span className="text-neutral-400">Before</span>)이 9블록 린 캔버스(<span className="text-indigo-600 font-semibold">After</span>)로 어떻게 채워졌는지 한 화면에서 비교하세요. 칸마다 <span className="text-amber-600 font-semibold">‘왜 바꿨나’</span>를 열어 변경 이유를 확인할 수 있습니다.</div>
      </div>
      <div className="rounded-2xl border border-indigo-100 bg-white p-3 sm:p-4 shadow-sm">
        <div className="flex items-center gap-1.5 mb-3 text-[11px] font-bold text-indigo-600"><Sparkles size={13} /> 린 캔버스 · Before → After · 9블록</div>
        <LeanCanvas cells={lc.cells} />
      </div>
      <div className="mt-5"><PrimaryButton onClick={onNext}>시장조사 보기 <ArrowRight size={16} /></PrimaryButton></div>
    </StepShell>
  );
}

/* ─────────────── 04 시장조사 ─────────────── */
function MarketResearch({ onNext }: { onNext: () => void }) {
  const step = stepById("market");
  const ms = step.blocks.find((b) => b.kind === "marketStage") as MarketStageBlock;
  return (
    <StepShell step={step}>
      <div className="flex items-center gap-3 mb-3 text-[11px] text-neutral-500">
        <span className="inline-flex items-center gap-1"><span className="w-3 h-2 rounded-sm" style={{ background: ACCENT_GRAD }} /> 실측치</span>
        <span className="inline-flex items-center gap-1"><span className="w-3 h-2 rounded-sm border border-dashed border-indigo-400" /> 추정치</span>
      </div>
      <div className="space-y-3">
        {ms.stages.map((st) => (
          <div key={st.no} className={`rounded-2xl border bg-white p-4 ${st.estimated ? "border-dashed border-indigo-300" : "border-neutral-200"}`}>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ background: ACCENT_GRAD }}>{st.no}</span>
              <span className="text-sm font-bold text-neutral-900">{st.title}</span>
              <span className="ml-auto text-[10px] text-neutral-400">{st.estimated ? "추정치" : "실측치"}</span>
            </div>
            <p className="mt-2 text-xs text-neutral-600 break-keep">{st.whyLook}</p>
            <div className="mt-2 rounded-lg bg-amber-50 border border-amber-100 px-3 py-2 flex items-center gap-1.5">
              <NeedsCheck /> <span className="text-[11px] text-amber-700">{st.valueTodo.replace("TODO(market-data): ", "")}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5"><PrimaryButton onClick={onNext}>핵심 지표 보기 <ArrowRight size={16} /></PrimaryButton></div>
    </StepShell>
  );
}

/* ─────────────── 05 핵심 지표 (워크시트) ─────────────── */
function KeyMetrics({ onNext }: { onNext: () => void }) {
  const step = stepById("metrics");
  const mi = step.blocks.find((b) => b.kind === "metricItem") as MetricItemBlock;
  const [done, setDone] = useState<Record<number, boolean>>({});
  return (
    <StepShell step={step}>
      <div className="text-xs text-neutral-500 mb-3 break-keep">읽는 리포트가 아니라 <span className="font-semibold text-neutral-700">직접 진행할 조사 목록</span>입니다. 체크하며 실제로 쓰세요.</div>
      <div className="space-y-2.5">
        {mi.items.map((it, i) => (
          <div key={i} className="rounded-2xl border border-neutral-200 bg-white p-4">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input type="checkbox" checked={!!done[i]} onChange={(e) => setDone((d) => ({ ...d, [i]: e.target.checked }))} className="mt-0.5 accent-indigo-600 w-4 h-4" />
              <div className="flex-1">
                <div className={`text-sm font-bold ${done[i] ? "text-neutral-400 line-through" : "text-neutral-900"}`}>{it.what}</div>
                <div className="mt-1 grid gap-1 text-[11px] text-neutral-600">
                  <div><span className="font-semibold text-neutral-500">목적: </span>{it.purpose}</div>
                  <div><span className="font-semibold text-neutral-500">방법: </span>{it.how}</div>
                  <div className="rounded bg-indigo-50/50 border border-indigo-100 px-2 py-1"><span className="font-semibold text-indigo-600">해석 가이드: </span>{it.interpret}</div>
                  {it.hypothesis && (
                    <div className="rounded bg-neutral-50 border border-neutral-100 px-2 py-1 mt-0.5">
                      <div><span className="font-semibold text-neutral-500">가설: </span>{it.hypothesis.claim}</div>
                      <div><span className="font-semibold text-emerald-600">합격선: </span>{it.hypothesis.pass}</div>
                      <div><span className="font-semibold text-rose-500">불합격 시: </span>{it.hypothesis.failResponse}</div>
                    </div>
                  )}
                </div>
              </div>
            </label>
          </div>
        ))}
      </div>
      <div className="mt-5"><PrimaryButton onClick={onNext}>로드맵 보기 <ArrowRight size={16} /></PrimaryButton></div>
    </StepShell>
  );
}

/* ─────────────── 06 로드맵 ─────────────── */
const STATUS_STYLE: Record<string, string> = { "미시작": "bg-neutral-100 text-neutral-400", "진행 중": "bg-indigo-100 text-indigo-600", "완료": "bg-emerald-100 text-emerald-600" };
function Roadmap({ onNext }: { onNext: () => void }) {
  const step = stepById("roadmap");
  const rp = step.blocks.find((b) => b.kind === "roadmapPhase") as RoadmapPhaseBlock;
  const [sel, setSel] = useState(0); // 최초 첫 스텝 자동 선택
  const p = rp.phases[sel];
  return (
    <StepShell step={step}>
      <div className="text-[11px] text-neutral-400 mb-2 sm:hidden">← 좌우로 스크롤 →</div>
      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
        {rp.phases.map((ph, i) => (
          <button key={ph.code} onClick={() => setSel(i)} className={`shrink-0 w-28 rounded-xl border px-3 py-2.5 text-left transition-colors ${sel === i ? "border-indigo-400 bg-indigo-50/60" : "border-neutral-200 bg-white"}`}>
            <div className="flex items-center justify-between"><span className="font-mono text-xs font-bold text-indigo-500">{ph.code}</span><span className={`text-[9px] font-semibold rounded px-1 ${STATUS_STYLE[ph.status]}`}>{ph.status}</span></div>
            <div className="text-xs font-semibold text-neutral-900 mt-1 truncate">{ph.title}</div>
            <div className="text-[10px] text-neutral-400">{ph.duration}</div>
          </button>
        ))}
      </div>
      {/* 선택 스텝 상세 */}
      <div className="mt-3 rounded-2xl border border-neutral-200 bg-white p-4">
        <div className="flex items-center gap-2"><span className="font-mono text-sm font-bold text-indigo-500">{p.code}</span><span className="text-base font-bold text-neutral-900">{p.title}</span><span className="ml-auto text-[10px] text-neutral-400">{p.duration}</span></div>
        <p className="mt-1 text-xs text-neutral-600 break-keep"><span className="font-semibold text-neutral-500">목표: </span>{p.goal}</p>
        <div className="mt-2 text-[10px] font-bold uppercase text-neutral-400">세부 할 일</div>
        <ul className="mt-1 grid gap-1">{p.todos.map((t, i) => <li key={i} className="text-xs text-neutral-600 flex gap-1.5"><Check size={12} className="text-indigo-400 mt-0.5 shrink-0" />{t}</li>)}</ul>
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="rounded-lg bg-neutral-50 border border-neutral-100 px-3 py-2"><div className="text-[10px] font-bold text-neutral-400">산출물</div>{p.deliverables.map((d, i) => <div key={i} className="text-[11px] text-neutral-600">· {d}</div>)}</div>
          <div className="rounded-lg bg-indigo-50/50 border border-indigo-100 px-3 py-2"><div className="text-[10px] font-bold text-indigo-500">다음 진입 조건</div><div className="text-[11px] text-neutral-600 break-keep">{p.entryCondition}</div></div>
        </div>
      </div>
      <div className="mt-5"><PrimaryButton onClick={onNext}>리스크 보기 <ArrowRight size={16} /></PrimaryButton></div>
    </StepShell>
  );
}

/* ─────────────── 07 리스크 ─────────────── */
const LEVEL_ORDER: RiskLevel[] = ["高", "中~高", "中", "低"];
const LEVEL_STYLE: Record<RiskLevel, { bg: string; text: string; icon: React.ReactNode; label: string }> = {
  "高": { bg: "bg-rose-50 border-rose-200", text: "text-rose-700", icon: <AlertTriangle size={13} />, label: "높음" },
  "中~高": { bg: "bg-orange-50 border-orange-200", text: "text-orange-700", icon: <TrendingUp size={13} />, label: "중~높음" },
  "中": { bg: "bg-amber-50 border-amber-200", text: "text-amber-700", icon: <Gauge size={13} />, label: "중간" },
  "低": { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", icon: <Check size={13} />, label: "낮음" },
};
function LegalNote() {
  return <div className="mt-2 flex items-start gap-1.5 rounded-lg bg-neutral-50 border border-neutral-100 px-2.5 py-2"><Scale size={12} className="text-neutral-400 shrink-0 mt-0.5" /><span className="text-[10px] text-neutral-500 break-keep">일반 정보이며 법률 자문이 아닙니다. 실제 판단은 전문가 확인이 필요합니다.</span></div>;
}
function Risks({ onNext }: { onNext: () => void }) {
  const step = stepById("risks");
  const rc = step.blocks.find((b) => b.kind === "riskCard") as RiskCardBlock;
  const [filter, setFilter] = useState<RiskLevel | "all">("all");
  const sorted = useMemo(() => [...rc.risks].sort((a, b) => LEVEL_ORDER.indexOf(a.level) - LEVEL_ORDER.indexOf(b.level)), [rc.risks]);
  const shown = filter === "all" ? sorted : sorted.filter((r) => r.level === filter);
  return (
    <StepShell step={step}>
      <div className="flex gap-1.5 mb-3 flex-wrap">
        <button onClick={() => setFilter("all")} className={`text-[11px] rounded-full px-2.5 py-1 border ${filter === "all" ? "bg-neutral-900 text-white border-neutral-900" : "border-neutral-200 text-neutral-500"}`}>전체</button>
        {LEVEL_ORDER.map((lv) => (
          <button key={lv} onClick={() => setFilter(lv)} className={`text-[11px] rounded-full px-2.5 py-1 border ${filter === lv ? `${LEVEL_STYLE[lv].bg} ${LEVEL_STYLE[lv].text} border-current` : "border-neutral-200 text-neutral-500"}`}>{LEVEL_STYLE[lv].label}</button>
        ))}
      </div>
      <div className="space-y-3">
        {shown.map((r, i) => {
          const st = LEVEL_STYLE[r.level];
          return (
            <div key={i} className={`rounded-2xl border bg-white p-4`}>
              <div className="flex items-center gap-2">
                {/* 3중 인코딩: 색 + 형태(아이콘) + 라벨 */}
                <span className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-bold ${st.bg} ${st.text}`}>{st.icon} {st.label}</span>
                <span className="text-sm font-bold text-neutral-900">{r.t}</span>
              </div>
              <div className="mt-2 grid gap-1.5 text-[11px] text-neutral-600">
                <div><span className="font-semibold text-neutral-500">① 문제 상황: </span>{r.situation}</div>
                <div><span className="font-semibold text-neutral-500">② 판단 근거: </span>{r.basis}</div>
                <div className="rounded bg-indigo-50/50 border border-indigo-100 px-2 py-1"><span className="font-semibold text-indigo-600">③ 규제 대응 경로: </span>{r.response}</div>
                {r.legalCiteTodo && <div className="text-[10px] text-amber-600 flex items-center gap-1"><NeedsCheck /> {r.legalCiteTodo.replace("TODO(legal-cite): ", "")}</div>}
              </div>
              <LegalNote />
            </div>
          );
        })}
      </div>
      <div className="mt-5"><PrimaryButton onClick={onNext}>지원사업 보기 <ArrowRight size={16} /></PrimaryButton></div>
    </StepShell>
  );
}

/* ─────────────── 08 지원사업 ─────────────── */
function Grants({ onNext }: { onNext: () => void }) {
  const step = stepById("grants");
  const g = step.blocks.find((b) => b.kind === "grant") as GrantBlock;
  return (
    <StepShell step={step}>
      <div className="space-y-2.5">
        {g.grants.map((gr, i) => (
          <div key={i} className="rounded-2xl border border-neutral-200 bg-white p-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-neutral-900">{gr.name}</span>
              <span className="text-[11px] text-neutral-400">· {gr.org}</span>
              <span className="ml-auto text-[10px] rounded bg-neutral-100 text-neutral-500 px-1.5 py-0.5">{gr.stage}</span>
            </div>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div className="rounded bg-emerald-50/50 border border-emerald-100 px-2 py-1.5"><div className="font-bold text-emerald-600 mb-0.5">충족</div>{gr.eligibleMet.map((e, k) => <div key={k} className="text-neutral-600">· {e}</div>)}</div>
              <div className="rounded bg-amber-50/50 border border-amber-100 px-2 py-1.5"><div className="font-bold text-amber-600 mb-0.5">확인/미충족</div>{gr.eligibleGap.map((e, k) => <div key={k} className="text-neutral-600">· {e}</div>)}</div>
            </div>
            <div className="mt-1.5 text-[10px] text-amber-600 flex items-center gap-1"><span className="rounded bg-amber-50 border border-amber-200 px-1.5 py-0.5 font-semibold">공고·요건 변동 · 확인 필요</span> {gr.termsTodo.replace("TODO(grant-terms): ", "")}</div>
          </div>
        ))}
      </div>
      {/* 연계 산출물 3종 — 지원사업과 1:1로 연결 */}
      <div className="mt-4 text-xs font-bold text-neutral-900 mb-2">연계 산출물</div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {g.artifacts.map((a, i) => (
          <div key={i} className="rounded-xl border border-neutral-200 bg-white p-3.5">
            <FileText size={16} className="text-indigo-500 mb-1" />
            <div className="text-sm font-bold text-neutral-900">{a.t}</div>
            <div className="text-[11px] text-neutral-500 break-keep mt-0.5">{a.d}</div>
            {a.grantLink && <div className="mt-1.5 text-[10px] text-indigo-500 flex items-center gap-1"><Landmark size={10} /> {a.grantLink}</div>}
            <div className="mt-2 flex gap-1.5">
              <button className="flex-1 text-[10px] rounded-lg border border-neutral-200 py-1 text-neutral-500" disabled>미리보기</button>
              <button className="flex-1 text-[10px] rounded-lg border border-neutral-200 py-1 text-neutral-500 inline-flex items-center justify-center gap-1" disabled><Download size={10} /> 다운로드</button>
            </div>
            <div className="mt-1 text-[9px] text-neutral-400 text-center">{/* TODO(export-format) */}포맷 준비 중</div>
          </div>
        ))}
      </div>
      <div className="mt-5"><PrimaryButton onClick={onNext}>AI 프롬프트 · 앱 연결 보기 <ArrowRight size={16} /></PrimaryButton></div>
    </StepShell>
  );
}

/* ─────────────── 09 AI 프롬프트 · 앱 연결 ─────────────── */
const TOOL_ICON: Record<string, React.ReactNode> = { Figma: <PenTool size={18} />, Stitch: <Layers size={18} />, Notion: <BookOpen size={18} /> };
function AiBridge() {
  const step = stepById("ai-bridge");
  const pb = step.blocks.find((b) => b.kind === "prompt") as PromptBlock;
  const [slot, setSlot] = useState(0);
  const [copied, setCopied] = useState(false);
  const assembled = `아래는 내 사업 아이디어 진단 요약입니다. 이 맥락을 이해하고 이어서 도와주세요.\n\n[아이디어] ${DEMO_IDEA}\n[01~08 요약] 진단·비즈니스 모델·시장·핵심 지표·로드맵·리스크·지원사업 내용을 조립해 삽입합니다.\n\n(대상 AI: ${pb.targets[slot].slot} 형식)`;
  function copy() {
    navigator.clipboard?.writeText(assembled).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); });
  }
  return (
    <StepShell step={step}>
      {/* AI 아이콘 슬롯 — 누르면 형식 전환 */}
      <div className="flex items-center gap-2 mb-1">
        {pb.targets.map((t, i) => (
          <button key={i} onClick={() => setSlot(i)} className={`flex flex-col items-center gap-1 rounded-xl border px-3 py-2 transition-colors ${slot === i ? "border-indigo-400 bg-indigo-50/60" : "border-neutral-200 bg-white"}`}>
            <Sparkles size={16} className={slot === i ? "text-indigo-600" : "text-neutral-400"} />
            <span className="text-[10px] text-neutral-500">{t.slot}</span>
          </button>
        ))}
      </div>
      <div className="text-[10px] text-amber-600 flex items-center gap-1 mb-3"><NeedsCheck /> {pb.targetsTodo.replace(/TODO\([a-z-]+\): /, "")}</div>

      {/* 공통 프롬프트 */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-4">
        <div className="text-xs font-bold text-neutral-900 mb-1">AI 공통 프롬프트</div>
        <p className="text-[11px] text-neutral-500 break-keep mb-2">{pb.commonPromptNote}</p>
        <pre className="rounded-xl bg-neutral-50 border border-neutral-100 p-3 text-[11px] text-neutral-700 whitespace-pre-wrap break-keep max-h-40 overflow-y-auto">{assembled}</pre>
        <button onClick={copy} className="mt-2 w-full inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-white" style={{ background: ACCENT_GRAD }}>
          {copied ? <><Check size={15} /> 복사됨</> : <><Copy size={15} /> 원클릭 복사</>}
        </button>
      </div>

      {/* 외부 툴 연계 3카드 */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-stretch">
        {pb.tools.map((t, i) => (
          <div key={i} className="rounded-xl border border-neutral-200 bg-white p-3.5 flex flex-col h-full">
            <div className="text-neutral-700 mb-1.5">{TOOL_ICON[t.name] ?? <Layers size={18} />}</div>
            <div className="text-sm font-bold text-neutral-900">{t.name}</div>
            <div className="text-[11px] text-neutral-500 break-keep mt-0.5 flex-1">{t.use}</div>
            <button className="mt-3 w-full text-[11px] rounded-lg border border-neutral-200 py-1.5 text-neutral-500" disabled>연결하기</button>
          </div>
        ))}
      </div>
      <div className="mt-1.5 text-[10px] text-amber-600 flex items-center gap-1"><NeedsCheck /> {pb.toolIntegrationTodo.replace(/TODO\([a-z-]+\): /, "")}</div>
    </StepShell>
  );
}

/* ─────────────── 메인 ─────────────── */
export default function Mockup() {
  const [view, setView] = useState("demo-main");
  const [paid, setPaid] = useState(false);
  const unlock = () => setPaid(true);
  const go = (id: string) => setView(id);

  const step = STEPS.find((s) => s.id === view);
  const locked = step ? step.tier === "paid" && !paid : false;

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900" style={{ fontFamily: "'Pretendard Variable', Pretendard, sans-serif" }}>
      <FontStyles />
      {/* 상단 유틸 바 */}
      <div className="border-b border-neutral-100 bg-white">
        <div className="mx-auto max-w-6xl px-4 h-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2"><Image src="/logo.svg" alt="B Essential" width={104} height={18} priority /></Link>
          <Link href="/pricing" className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1">요금제 <ChevronRight size={12} /></Link>
        </div>
      </div>

      <StepNav view={view} setView={setView} paid={paid} setPaid={setPaid} />

      <div className="h-[calc(100vh-96px)]">
        <AnimatePresence mode="wait">
          <motion.div key={view} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }} className="h-full">
            {view === "demo-main" && <DemoMain onStart={() => go("idea-input")} />}
            {view === "idea-input" && <IdeaInput onSubmit={() => go("diagnosis")} />}
            {view === "diagnosis" && <Diagnosis onNext={() => go("bm")} />}
            {step && locked ? (
              <div className="mx-auto max-w-4xl px-4 sm:px-6 py-4 sm:py-6 h-full overflow-y-auto scrollbar-none">
                <SectionHead eyebrow={`STEP ${step.no} · 유료`} title={step.title} sub={step.summary} />
                <PaidLock locked teaser={step.lockedTeaser} onUnlock={unlock}>
                  <LockedPreview id={view} />
                </PaidLock>
              </div>
            ) : (
              <>
                {view === "bm" && <BusinessModel onNext={() => go("market")} />}
                {view === "market" && <MarketResearch onNext={() => go("metrics")} />}
                {view === "metrics" && <KeyMetrics onNext={() => go("roadmap")} />}
                {view === "roadmap" && <Roadmap onNext={() => go("risks")} />}
                {view === "risks" && <Risks onNext={() => go("grants")} />}
                {view === "grants" && <Grants onNext={() => go("ai-bridge")} />}
                {view === "ai-bridge" && <AiBridge />}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// 잠금 상태에서 상단 일부만 보여줄 프리뷰 (실제 스텝 컴포넌트를 그대로 렌더 — 상단 30~40%만 노출됨)
function LockedPreview({ id }: { id: string }) {
  const noop = () => {};
  switch (id) {
    case "bm": return <BusinessModel onNext={noop} />;
    case "market": return <MarketResearch onNext={noop} />;
    case "metrics": return <KeyMetrics onNext={noop} />;
    case "roadmap": return <Roadmap onNext={noop} />;
    case "risks": return <Risks onNext={noop} />;
    case "grants": return <Grants onNext={noop} />;
    case "ai-bridge": return <AiBridge />;
    default: return null;
  }
}

function FontStyles() {
  return (
    <style>{`
      .scrollbar-none::-webkit-scrollbar { display: none; }
      .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
    `}</style>
  );
}
