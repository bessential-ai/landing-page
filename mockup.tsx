"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { 
  Activity, 
  Route, 
  Building2, 
  Landmark, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  Check, 
  Lock, 
  ChevronRight,
  ListChecks,
  ShieldAlert
} from "lucide-react";

const ACCENT_GRAD = "linear-gradient(135deg, #6366F1, #8B5CF6)";

const VIEWS = [
  { id: "landing", code: "00", label: "데모 메인" },
  { id: "input", code: "01", label: "아이디어 입력" },
  { id: "diagnosis", code: "02", label: "진단" },
  { id: "roadmap", code: "03", label: "로드맵" },
  { id: "step", code: "04", label: "단계 상세" },
  { id: "docs", code: "05", label: "산출물" },
];

const SAMPLE_INPUT = "경도인지장애 부모를 둔 보호자를 위해, 보호자 목소리로 AI가 매일 안부 전화를 걸어 복약·식사·컨디션을 확인하고 보호자 앱에 기록·알림해 주는 서비스";

const DIAG_AXES = [
  { label: "문제 정의·수요", score: 82 },
  { label: "솔루션 차별성", score: 68 },
  { label: "기술 실현성", score: 74 },
  { label: "규제·인허가", score: 58 },
  { label: "수익모델·단위경제", score: 70 },
  { label: "팀·실행력", score: 76 },
];

const DIAG_STRENGTHS = [
  { t: "명확하고 우상향하는 수요", d: "초고령사회·MCI 증가 + 비동거 돌봄 공백. 통증이 보편적이고 시간이 갈수록 커집니다." },
  { t: "임상 신뢰 자산", d: "세브란스 교수 자문 — 설계 타당성·기관 채널·투자 신뢰까지, 초기 팀이 갖기 어려운 출발점." },
  { t: "정서적 차별화 — 익숙한 목소리", d: "낯선 기계음이 아닌 보호자 본인 목소리. 응답률·지속률을 끌어올리는 정서적 훅." },
  { t: "다층 수익 경로", d: "B2C 구독 + 기관 B2B + 통신사 제휴 — 단일 채널 실패 시 대안 보유." },
];

const DIAG_RISKS = [
  { t: "의료기기·의료행위 경계", sev: "高", d: "‘확인·알림’이 의료 모니터링으로 해석될 위험 → 비의료 건강관리로 포지셔닝 + 식약처 분류·법무 검토." },
  { t: "건강 민감정보 처리", sev: "高", d: "당사자(MCI) 동의능력 이슈 → 보호자·대리 동의 구조 명시, 최소수집·암호화·파기 정책." },
  { t: "음성 합성 윤리·악용", sev: "중~高", d: "음성권·딥보이스 악용·인지 윤리 → 본인 인증 등록, AI 고지, 무단합성 방지." },
  { t: "AI 환각·오탐/미탐", sev: "High", d: "응급 자동판단 배제 + 사람(보호자) 확인 루프 강제, 119/보호자 연계." },
];

const ROADMAP = [
  { 
    code: "P0", 
    title: "아이디어 검증", 
    goal: "돈 낼 보호자가 있는지 확인", 
    todo: "보호자 10~15명 인터뷰 · 경쟁 5종 매핑 · 린 캔버스 · 미니 파일럿 협조자 모집",
    todos: ["보호자 인터뷰 대본 작성 → 10~15명 인터뷰", "경쟁·대안 5종 매핑", "린 캔버스 작성", "5가구 2주 미니 파일럿 협조자 모집"]
  },
  { 
    code: "P1", 
    title: "사업형태·행정 셋업", 
    goal: "법적 실체 + 규제 포지셔닝", 
    todo: "개인 vs 법인 결정 · 설립등기 · 의료기기 경계 자가진단 · 개인정보·음성 동의 설계",
    todos: ["개인사업자 vs 법인 결정", "(법인 시) 상호·자본금·정관·설립등기 → 사업자등록", "의료기기/비의료 경계 자가진단 + 법무 검토 일정", "개인정보·음성 동의 구조 설계"]
  },
  { 
    code: "P2", 
    title: "MVP / 프로토타입", 
    goal: "핵심 케어콜 루프", 
    todo: "‘1일 1회 통화→3항목 확인→요약→앱 기록→이상 알림’ 범위 고정 · 통화당 원가 계측",
    todos: ["기능을 ‘1일 1회 통화→3항목 확인→요약→앱 기록→이상 알림’으로 고정", "STT·TTS·LLM 파이프라인 결정(고지 포함)", "응급 자동판단 배제 + ‘확인 필요’ 전달 로직", "통화당 원가 측정 계측 삽입"]
  },
  { 
    code: "P3", 
    title: "초기 고객·검증", 
    goal: "유료 보호자 20명", 
    todo: "KPI(응답률·지속률·거짓경보율) 정의 · 유료 전환 테스트 · 임상 라벨링",
    todos: ["KPI 정의: 응답률·지속률·알림 유용성·거짓경보율·결제 전환", "소규모 유료 전환 테스트(가격 가설)", "통화 로그 임상 자문과 라벨링 → 오탐·미탐", "이탈 인터뷰 루프"]
  },
];

const ADMIN_COMPARE = [
  { k: "대외 신뢰도", a: "낮음", b: "높음", note: "병원·기관·통신사 계약엔 법인 유리" },
  { k: "투자 유치", a: "어려움", b: "가능", note: "정부 R&D·지분 투자 고려 시 법인" },
  { k: "책임 범위", a: "무한책임", b: "유한책임", note: "건강데이터·케어 사고 리스크 분리" },
  { k: "설립 속도", a: "빠름", b: "상대적 느림", note: "초기 속도는 개인 유리" },
];

const ADMIN_REG = [
  "의료기기(SaMD) 해당 여부 — 비의료 건강관리로 한정, 식약처 분류 확인",
  "비의료 건강관리 가이드라인 — 허용·금지 행위에 맞춰 기능·문구 점검",
  "개인정보·민감정보 — 보호자·대리 동의 구조, 최소수집·암호화·파기",
  "음성 합성 — 본인 인증 등록·합성 동의, AI 고지 설계",
];

const ARTIFACTS = [
  { t: "진단 리포트", d: "구조화 요약 + 6축 점수 + 강점·리스크·검증 가정" },
  { t: "린 캔버스", d: "9블록 — 문제·고객·UVP·솔루션·채널·수익·비용·지표·강점" },
  { t: "개인 vs 법인 비교표", d: "신뢰도·투자·책임·세제 기준 의사결정 표" },
  { t: "보호자 인터뷰 가이드", d: "통증·대안·지불의사·음성 수용도 질문 세트" },
  { t: "IR 한 장", d: "문제→솔루션→시장→BM→트랙션→팀→Ask" },
  { t: "예창패 사업계획서 골격", d: "PSST 구조 초안 (서식·일정 확인 필요)" },
];

const leanCanvasData = [
  { k: "문제", v: "비동거 자녀가 매일 확인 못 함 / 직접 전화는 지속·기록 안 됨 / 변화 추세 놓침" },
  { k: "고객군", v: "1차 비동거 40~60대 자녀 / 2차 요양·복지기관 / 3차 통신사" },
  { k: "고유 가치", v: "부모가 거부감 없이 받는 익숙한 목소리로, 매일 확인·기록·이상 알림" },
  { k: "솔루션", v: "보호자 음성 AI 케어콜 + 대화 분석 + 보호자 앱 기록·알림" },
  { k: "채널", v: "보호자 직접 가입(앱) / 기관 제휴 / 통신사 번들" },
  { k: "수익원", v: "B2C 월 구독 + B2B 좌석제 + 제휴 수수료" },
  { k: "비용 구조", v: "통화·STT·TTS·LLM 원가 / 인건비 / 임상 자문 / 법무" },
  { k: "핵심 지표", v: "응답률·지속률·알림 유용성·거짓경보율·결제 전환" },
  { k: "불공정 강점", v: "임상 자문 네트워크 + 보호자 목소리 데이터·신뢰 축적" },
];

function Mono({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`font-mono text-[10px] sm:text-[11px] tracking-wider uppercase ${className}`}>{children}</span>;
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div className="font-mono text-[10px] sm:text-[11px] tracking-[0.18em] uppercase text-indigo-600 font-semibold mb-2 sm:mb-3">{children}</div>;
}

function PrimaryButton({ children, onClick, full = false }: { children: React.ReactNode; onClick?: () => void; full?: boolean }) {
  return (
    <button onClick={onClick} className={`group inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-4 py-3 text-xs sm:text-sm font-semibold text-white transition-colors hover:bg-neutral-800 ${full ? "w-full" : ""}`}>
      {children}
      <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
    </button>
  );
}

function Locked({ locked, title, children, pinTop = false, onUnlock }: { locked: boolean; title: string; children: React.ReactNode; pinTop?: boolean; onUnlock: () => void }) {
  if (!locked) return <>{children}</>;
  return (
    <div className="relative w-full h-full">
      <div className="pointer-events-none select-none opacity-30 blur-[4px] overflow-hidden" aria-hidden="true">
        {children}
      </div>
      <div className={`absolute inset-0 flex justify-center p-4 z-10 ${pinTop ? "items-start pt-6" : "items-center"}`}>
        <div className="w-full max-w-xs sm:max-w-sm rounded-2xl border border-neutral-200 bg-white/95 p-4 sm:p-5 text-center shadow-lg backdrop-blur-sm">
          <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 mb-2.5">
            <Lock size={16} />
          </div>
          <div className="text-xs sm:text-sm font-bold text-neutral-900 break-keep">{title}</div>
          <button onClick={onUnlock} className="mt-3.5 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md transition-transform hover:-translate-y-0.5" style={{ background: ACCENT_GRAD }}>
            결제하고 전체 보기
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function DemoNav({ view, setView, paid, setPaid }: { view: string; setView: (v: string) => void; paid: boolean; setPaid: (v: boolean) => void }) {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/90 backdrop-blur-md shrink-0">
      {/* px-4 sm:px-6 구조로 변경하여 page.tsx 레이아웃 컨테이너와 간격을 완벽 동기화 */}
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center gap-2 sm:gap-4 px-4 sm:px-6 py-2.5 sm:h-16">
        
        {/* 로고 영역 - page.tsx의 이미지 호출 패러다임 구조로 정교하게 패치 완료 */}
        <div className="flex items-center justify-between w-full sm:w-auto">
          <Link 
            href="/" 
            className="flex items-center gap-2 cursor-pointer active:scale-95 transition-transform"
            aria-label="B Essential 공식 홈페이지로 이동"
          >
            <Image 
              src="/logo.svg" 
              alt="B Essential" 
              width={110} 
              height={20} 
              priority 
              className="sm:w-[130px] sm:h-[22px]"
            />
          </Link>
          
          {/* 모바일 뷰어 토글 상태배치 */}
          <div className="flex sm:hidden items-center gap-1 rounded-full border border-neutral-200 bg-neutral-50 p-0.5 scale-90">
            <button onClick={() => setPaid(false)} className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${!paid ? "bg-neutral-900 text-white" : "text-neutral-500"}`}>무료</button>
            <button onClick={() => setPaid(true)} className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${paid ? "text-white" : "text-neutral-500"}`} style={paid ? { background: ACCENT_GRAD } : {}}>결제</button>
          </div>
        </div>

        {/* 데스크톱 전용 상태 배정 */}
        <div className="hidden sm:flex items-center gap-1 rounded-full border border-neutral-200 bg-neutral-50 p-0.5">
          <button onClick={() => setPaid(false)} className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${!paid ? "bg-neutral-900 text-white" : "text-neutral-500 hover:text-neutral-900"}`}>무료 미리보기</button>
          <button onClick={() => setPaid(true)} className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${paid ? "text-white" : "text-neutral-500 hover:text-neutral-900"}`} style={paid ? { background: ACCENT_GRAD } : {}}>결제 후 뷰</button>
        </div>

        {/* 탭 네비게이션: 모바일 가로 터치 스크롤 지원 유도 인프라 (`overflow-x-auto`) */}
        <nav className="w-full sm:w-auto ml-auto flex items-center gap-1 overflow-x-auto whitespace-nowrap scrollbar-none py-1 sm:py-0" style={{ scrollbarWidth: "none" }}>
          {VIEWS.map((v) => {
            const active = view === v.id;
            return (
              <button key={v.id} onClick={() => setView(v.id)} className={`flex shrink-0 items-center gap-1 rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5 transition-colors focus:outline-none ${active ? "bg-neutral-900 text-white" : "text-neutral-500 hover:text-neutral-900"}`}>
                <Mono className={`text-[9px] sm:text-[10px] ${active ? "text-indigo-200" : "text-neutral-400"}`}>{v.code}</Mono>
                <span className="text-[11px] sm:text-xs font-bold">{v.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

function DemoMainDashboard({ onStart, onDemo }: { onStart: () => void; onDemo: () => void }) {
  return (
    <div className="h-full w-full flex flex-col justify-center items-center px-4 py-8 bg-neutral-50 overflow-y-auto select-none">
      <div className="max-w-xl w-full text-center bg-white border border-neutral-200 rounded-2xl p-6 sm:p-10 shadow-sm">
        <Eyebrow>B ESSENTIAL DEMO SANDBOX</Eyebrow>
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-neutral-900 mt-1">
          사업화 시뮬레이터 데모 샌드박스
        </h1>
        <p className="mt-3 text-xs sm:text-sm leading-relaxed text-neutral-500 break-keep">
          본 화면은 대시보드 내부 로직을 점검하기 위한 테스트 샌드박스 공간입니다. 내 아이디어를 가상으로 타이핑하거나 내장 버전을 실시간 빌드 처리할 수 있습니다.
        </p>
        <div className="mt-6 sm:mt-8 flex flex-col gap-2.5 w-full">
          <button onClick={onStart} className="w-full flex items-center justify-between gap-2 rounded-xl bg-neutral-900 px-4 sm:px-5 py-3.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-neutral-800 transition-all group text-left">
            <span>🚀 내 아이디어 직접 진단 가상 입력</span>
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-1 shrink-0" />
          </button>
          <button onClick={onDemo} className="w-full flex items-center justify-between gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-4 sm:px-5 py-3.5 text-xs sm:text-sm font-bold text-neutral-800 hover:bg-neutral-100 transition-all group text-left">
            <span>📊 의료 AI 콜 가상 빌드 결과 즉시 조회</span>
            <ChevronRight size={15} className="text-neutral-400 transition-transform group-hover:translate-x-1 shrink-0" />
          </button>
        </div>
        <div className="mt-6 sm:mt-8 pt-5 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between text-[10px] text-neutral-400 font-medium gap-1">
          <span>인프라: 샌드박스 컴파일러 정상 구동 중</span>
          <Mono>© 2026 B ESSENTIAL</Mono>
        </div>
      </div>
    </div>
  );
}

function IdeaInput({ onSubmit }: { onSubmit: () => void }) {
  const followups = [
    { q: "누구의 어떤 문제를 푸나요?", ph: "예) 경도인지장애 부모를 둔 보호자가 부모 상태를 매일 확인하기 어렵다" },
    { q: "지금은 그 문제를 어떻게 해결하고 있나요?", ph: "예) 직접 전화/방문, 단순 안부전화 — 기록·추세 파악이 안 됨" },
    { q: "어떻게 돈을 벌 계획인가요?", ph: "예) 보호자 월 구독, 기관 B2B, 통신사 제휴" },
  ];
  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:py-10 h-full overflow-y-auto">
      <Eyebrow>STEP 01 · 아이디어 가상 가입</Eyebrow>
      <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-neutral-900">어떤 아이디어인가요?</h1>
      <div className="mt-5">
        <label className="mb-1.5 block text-[11px] sm:text-xs font-bold text-neutral-600">아이디어 한 줄 요약</label>
        <textarea rows={3} defaultValue={SAMPLE_INPUT} className="w-full resize-none rounded-xl border border-neutral-300 p-3 sm:p-4 text-xs sm:text-sm leading-relaxed text-neutral-900 focus:border-neutral-900 focus:outline-none" />
      </div>
      <div className="mt-5 rounded-xl border border-neutral-200 bg-white p-4">
        <div className="mb-3 text-[11px] sm:text-xs font-bold text-indigo-600 tracking-wide">AI 심층 후속 질문 (구조화 데이터 세팅)</div>
        <div className="space-y-4">
          {followups.map((f, i) => (
            <div key={i}>
              <label className="mb-1 block text-xs font-medium text-neutral-700">Q{i + 1}. {f.q}</label>
              <input placeholder={f.ph} className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:bg-white focus:outline-none" />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-5">
        <PrimaryButton onClick={onSubmit} full>진단 및 비즈니스 매핑 시작</PrimaryButton>
      </div>
    </div>
  );
}

function Diagnosis({ onRoadmap, paid, onUnlock }: { onRoadmap: () => void; paid: boolean; onUnlock: () => void }) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-10 h-full overflow-y-auto">
      <Eyebrow>STEP 02 · AI 종합 비즈니스 진단</Eyebrow>
      <div className="p-3 bg-neutral-100 rounded-xl border border-neutral-200 text-xs text-neutral-700 mb-5 font-medium break-all">
        <span className="font-bold text-indigo-600">[대상 아이디어] </span>{SAMPLE_INPUT}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center border border-neutral-200 rounded-xl bg-white p-4 sm:p-6 shadow-sm mb-5">
        <div className="text-center md:border-r border-neutral-200 py-1 md:py-2">
          <div className="text-4xl sm:text-5xl font-black text-indigo-600">72<span className="text-xs sm:text-sm font-normal text-neutral-400"> / 100</span></div>
          <div className="text-[10px] sm:text-[11px] text-neutral-400 font-bold mt-1">창업초기 종합 가치지수</div>
        </div>
        <div className="md:col-span-2 space-y-1.5 sm:space-y-2">
          {DIAG_AXES.map((a, i) => (
            <div key={i} className="grid grid-cols-4 items-center gap-2 text-xs">
              <span className="text-neutral-600 font-medium col-span-1 truncate">{a.label}</span>
              <div className="col-span-2 h-2 rounded-full bg-neutral-100 overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${a.score}%` }} />
              </div>
              <span className="text-right font-mono font-bold text-neutral-900 col-span-1">{a.score}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-5">
          <div className="text-xs font-bold text-emerald-600 mb-2.5 flex items-center gap-1">✨ 무료 공개 강점지표</div>
          <ul className="space-y-3 text-xs">
            {DIAG_STRENGTHS.map((s, i) => (
              <li key={i} className="break-keep">
                <div className="font-bold text-neutral-900 text-[11px] sm:text-xs">{s.t}</div>
                <p className="text-neutral-500 mt-0.5 leading-relaxed text-[11px] sm:text-xs">{s.d}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-5">
          <div className="text-xs font-bold text-indigo-600 mb-2.5 flex items-center gap-1">🔒 크리티컬 리스크 & 완화 장치</div>
          <Locked locked={!paid} title="핵심 위험 요소 및 도메인 완화책 잠김" onUnlock={onUnlock}>
            <ul className="space-y-3 text-xs">
              {DIAG_RISKS.map((r, i) => (
                <li key={i} className="border-b border-neutral-50 pb-2.5 last:border-none last:pb-0 break-keep">
                  <div className="font-bold text-neutral-900 text-[11px] sm:text-xs flex items-center gap-1.5 flex-wrap">
                    <span>{r.t}</span> 
                    <span className="text-[9px] bg-red-50 text-red-600 px-1 py-0.2 rounded border border-red-100 font-mono shrink-0">{r.sev}</span>
                  </div>
                  <p className="text-neutral-500 mt-0.5 leading-relaxed text-[11px] sm:text-xs">{r.d}</p>
                </li>
              ))}
            </ul>
          </Locked>
        </div>
      </div>
      <div className="mt-5">
        <PrimaryButton onClick={onRoadmap} full>이 진단을 기반으로 맞춤 로드맵 생성</PrimaryButton>
      </div>
    </div>
  );
}

function Roadmap({ onStep, paid, onUnlock }: { onStep: () => void; paid: boolean; onUnlock: () => void }) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-10 h-full overflow-y-auto">
      <Eyebrow>STEP 03 · 4단계 맞춤 마일스톤</Eyebrow>
      <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-neutral-900 mb-4 sm:mb-6">MCI 케어콜 비즈니스 액션 플랜</h1>
      <div className="space-y-3">
        {ROADMAP.map((r, i) => (
          <div key={i} className="border border-neutral-200 rounded-xl bg-white p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-start gap-3 flex-1">
              <span className="font-mono text-[10px] sm:text-xs font-bold px-2 py-0.5 bg-indigo-50 elegance text-indigo-600 rounded shrink-0">{r.code}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-neutral-900">{r.title}</div>
                <div className="text-xs text-neutral-500 mt-0.5 mb-1.5 break-keep"><span className="font-semibold text-neutral-700">목표:</span> {r.goal}</div>
                
                {!paid ? (
                  <div className="text-[11px] text-neutral-300 italic">세부 할 일 가이드 팩 잠김</div>
                ) : (
                  <ul className="mt-2 space-y-1 pl-3.5 list-disc text-[11px] sm:text-xs text-neutral-600 leading-normal break-keep">
                    {r.todos.map((todo, idx) => <li key={idx}>{todo}</li>)}
                  </ul>
                )}
              </div>
            </div>
            <div className="w-full md:w-auto shrink-0 self-stretch md:self-center flex justify-end">
              <Locked locked={!paid} title="세부 할일 락" onUnlock={onUnlock}>
                <button onClick={onStep} className="w-full md:w-auto text-center text-[11px] font-bold text-indigo-600 flex items-center justify-center gap-1 border border-indigo-200 bg-indigo-50/40 px-3 py-2 rounded-lg hover:bg-indigo-50 transition-colors focus:outline-none">
                  <ListChecks size={13} /> 행정 가이드 상세 보기
                </button>
              </Locked>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StepDetail({ onBack, paid, onUnlock }: { onBack: () => void; paid: boolean; onUnlock: () => void }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:py-10 h-full overflow-y-auto">
      <button onClick={onBack} className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 mb-3 block focus:outline-none">← 마일스톤 리스트로 가기</button>
      <Eyebrow>STEP 04 · 최적 사업형태 설계 및 인허가 가이드</Eyebrow>
      
      <div className="border border-neutral-200 rounded-xl bg-white overflow-hidden shadow-sm mb-5">
        <div className="bg-neutral-50 px-4 py-2.5 border-b border-neutral-200 font-mono text-[10px] sm:text-xs font-bold text-neutral-600">개인사업자 vs 법인 실체 비교 인프라</div>
        <div className="divide-y divide-neutral-100 text-xs">
          {ADMIN_COMPARE.map((c, i) => (
            <div key={i} className="p-3.5 grid grid-cols-1 sm:grid-cols-4 gap-1 sm:gap-2">
              <span className="font-bold text-neutral-900 col-span-1">{c.k}</span>
              <span className="text-neutral-600 text-[11px] sm:text-xs">개인: {c.a}</span>
              <span className="text-indigo-600 font-medium text-[11px] sm:text-xs">법인: {c.b}</span>
              <span className="text-neutral-400 text-left sm:text-right text-[10px] sm:text-[11px] break-keep">{c.note}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="border border-neutral-200 rounded-xl bg-white p-4 sm:p-5 shadow-sm">
        <div className="text-xs sm:text-sm font-bold text-neutral-900 flex items-center gap-1.5 mb-3">
          <Activity size={15} className="text-indigo-500 shrink-0" /> 도메인 특화 규제 필터링 엔진
        </div>
        <Locked locked={!paid} title="행정 법률 세부 가이드라인 가려짐" onUnlock={onUnlock} pinTop>
          <ul className="space-y-2 text-xs sm:text-sm">
            {ADMIN_REG.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-neutral-600 break-keep">
                <Check size={14} className="text-indigo-500 shrink-0 mt-0.5" />
                <span className="text-[11px] sm:text-xs leading-normal">{r}</span>
              </li>
            ))}
          </ul>
        </Locked>
      </div>
    </div>
  );
}

function Docs({ paid, onUnlock }: { paid: boolean; onUnlock: () => void }) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-10 h-full overflow-y-auto">
      <Eyebrow>STEP 05 · 연계 산출물 엔진</Eyebrow>
      <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-neutral-900 mb-4 sm:mb-6">자동 생성 매핑 파일 보드</h1>
      <Locked locked={!paid} title="문서 팩 내보내기 프레임워크 락 구조" onUnlock={onUnlock} pinTop>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mb-6">
          {ARTIFACTS.map((a, i) => (
            <div key={i} className="border border-neutral-200 rounded-xl bg-white p-4 shadow-sm hover:border-neutral-400 transition-colors">
              <FileText size={16} className="text-indigo-600 mb-1.5" />
              <div className="text-xs font-bold text-neutral-900">{a.t}</div>
              <p className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed break-keep">{a.d}</p>
            </div>
          ))}
        </div>

        <div className="border border-indigo-100 rounded-xl bg-white p-4 sm:p-5 shadow-sm">
          <div className="text-xs font-bold text-indigo-600 mb-3 flex items-center gap-1.5">
            <FileText size={14} /> 린 캔버스 시각화 (의료 AI 콜 빌드 시뮬레이션)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {leanCanvasData.map((l, idx) => (
              <div key={idx} className="border border-neutral-100 rounded-lg p-3 bg-neutral-50/40 text-xs">
                <span className="block text-[9px] font-mono text-indigo-500 font-bold uppercase tracking-wider mb-0.5">{l.k}</span>
                <p className="text-neutral-700 font-medium leading-relaxed break-all">{l.v}</p>
              </div>
            ))}
          </div>
        </div>
      </Locked>
    </div>
  );
}

function FontStyles() {
  return (
    <style>{`
      @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css');
      body { overflow: hidden; font-family: 'Pretendard', sans-serif; }
      .scrollbar-none::-webkit-scrollbar { display: none; }
      .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
    `}</style>
  );
}

export default function App() {
  const [view, setView] = useState("landing");
  const [paid, setPaid] = useState(false);
  const unlock = () => setPaid(true);

  return (
    <div className="h-screen w-screen bg-neutral-50 text-neutral-900 antialiased overflow-hidden flex flex-col">
      <FontStyles />
      <DemoNav view={view} setView={setView} paid={paid} setPaid={setPaid} />
      
      <main className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div 
            key={view} 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.15 }} 
            className="h-full w-full absolute inset-0"
          >
            {view === "landing" && (
              <DemoMainDashboard 
                onStart={() => setView("input")} 
                onDemo={() => setView("diagnosis")} 
              />
            )}
            {view === "input" && <IdeaInput onSubmit={() => setView("diagnosis")} />}
            {view === "diagnosis" && <Diagnosis onRoadmap={() => setView("roadmap")} paid={paid} onUnlock={unlock} />}
            {view === "roadmap" && <Roadmap onStep={() => setView("step")} paid={paid} onUnlock={unlock} />}
            {view === "step" && <StepDetail onBack={() => setView("roadmap")} paid={paid} onUnlock={unlock} />}
            {view === "docs" && <Docs paid={paid} onUnlock={unlock} />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}