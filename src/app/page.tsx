// [SCR: P-01] 랜딩 — 한 줄 입력 · scope: P1
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { byGroup } from "@/lib/ia";
import { COMPANY, businessInfoItems } from "@/config/company";

const PRODUCT_URL = "/mockup"; // TODO(cta-rewire): 진단 진입점(/diagnose) 전환은 결정 (a) 대기

const stats = [
  { target: 0, suffix: "근거 기반", label: "출처·확인일 표기, 추측은 (확인 필요)로" },
  { target: 0, suffix: "한 흐름에", label: "진단 → 로드맵 → 산출물까지" },
  { target: 0, suffix: "무료로 시작", label: "요약·강점·점수는 결제 없이" },
];

// 랜딩 진입점 카드 — IA-SPEC Phase 2: 분해된 공개 라우트(P-02~P-05)로 안내.
// 목록은 IA 매니페스트(P 그룹, P1, 랜딩 제외)에서 파생한다. 하드코딩 금지.
const ENTRY_DESC: Record<string, string> = {
  "P-02": "왜 필요한지, 무엇을 주는지, 어떻게 작동하는지",
  "P-03": "구독이 아니라 아이디어별 결제 — 무료 미리보기부터",
  "P-04": "실제 결과가 이만큼 나옵니다 — 의료·커머스 예시",
  "P-05": "결제 전에 궁금한 것들",
};

const SECTION_COUNT = 3;
const COOLDOWN = 750;

const sectionBg = [
  "#ffffff", // 0. 히어로
  "#f6f7fb", // 1. 진입점 카드
  "#0e0f13", // 2. 피날레 + 푸터
];

export default function Home() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [isCompiling, setIsCompiling] = useState(false);

  const blocking = useRef(false);
  const touchStartY = useRef(0);

  const entryScreens = byGroup("P").filter((s) => s.scope === "P1" && s.path !== "/");
  const isDark = current === SECTION_COUNT - 1;

  // 스피너 구동 후 페이지를 라우팅 전환하는 공용 핸들러
  const handleRedirectWithSpinner = useCallback(
    (targetUrl: string) => {
      setIsCompiling(true);
      setTimeout(() => {
        router.push(targetUrl);
      }, 1200); // 1.2초 동안 가상 컴파일 애니메이션 노출
    },
    [router]
  );

  const goTo = useCallback((index: number) => {
    const next = Math.min(Math.max(index, 0), SECTION_COUNT - 1);
    setCurrent(next);
    blocking.current = true;
    setTimeout(() => {
      blocking.current = false;
    }, COOLDOWN);
  }, []);

  useEffect(() => {
    const advance = (dir: number) => {
      setCurrent((c) => {
        const next = Math.min(Math.max(c + dir, 0), SECTION_COUNT - 1);
        blocking.current = true;
        setTimeout(() => {
          blocking.current = false;
        }, COOLDOWN);
        return next;
      });
    };
    const onWheel = (e: WheelEvent) => {
      if (isCompiling) return;
      e.preventDefault();
      if (blocking.current) return;
      advance(e.deltaY > 0 ? 1 : -1);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (isCompiling || blocking.current) return;
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        advance(1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        advance(-1);
      }
    };
    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (isCompiling || blocking.current) return;
      const delta = touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(delta) < 30) return;
      advance(delta > 0 ? 1 : -1);
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [isCompiling]);

  return (
    <div
      className="h-screen overflow-hidden text-gray-900 bes"
      style={{
        backgroundColor: sectionBg[current],
        transition: "background-color 750ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* ── 상단 고정 헤더 ── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 border-b nav transition-all duration-[750ms]"
        style={{
          backdropFilter: "blur(12px)",
          backgroundColor: isDark ? "rgba(14, 15, 19, 0.85)" : "rgba(255, 255, 255, 0.85)",
          borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(243, 244, 246, 1)",
          color: isDark ? "#ffffff" : "#111827",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => goTo(0)}
            className="flex items-center gap-2 cursor-pointer bg-transparent border-none p-0 active:scale-95 transition-transform"
            aria-label="B Essential 공식 홈페이지로 이동"
          >
            <Image
              src={isDark ? "/logo(w).svg" : "/logo.svg"}
              alt="B Essential"
              width={110}
              height={20}
              priority
              className="sm:w-[130px] sm:h-[22px]"
              style={{ transition: "all 750ms cubic-bezier(0.16, 1, 0.3, 1)" }}
            />
          </button>
          <nav className="hidden md:flex items-center gap-8 text-sm">
            {entryScreens.map((s) => (
              <Link
                key={s.id}
                href={s.path}
                className="transition-colors duration-200 text-current opacity-80 hover:opacity-100"
              >
                {s.name}
              </Link>
            ))}
          </nav>
          <button
            onClick={() => handleRedirectWithSpinner(PRODUCT_URL)}
            className="text-xs sm:text-sm font-medium px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors cursor-pointer whitespace-nowrap border-none"
          >
            무료로 진단하기
          </button>
        </div>
      </header>

      {/* 우측 네비게이터 도트 */}
      <nav className="fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 z-50 hidden sm:flex flex-col gap-3">
        {Array.from({ length: SECTION_COUNT }).map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer border-none p-0 ${
              current === i
                ? "bg-indigo-400 scale-125"
                : isDark
                ? "bg-white/40 hover:bg-white/70"
                : "bg-gray-300 hover:bg-indigo-300"
            }`}
            aria-label={`섹션 ${i + 1}`}
          />
        ))}
      </nav>

      {/* 풀페이지 슬라이더 트랙 */}
      <div
        className="will-change-transform"
        style={{
          transform: `translateY(-${current * 100}vh)`,
          transition: "transform 750ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* ── 섹션 0 · 히어로 ── */}
        <section className="h-screen flex flex-col items-center justify-center px-4 sm:px-6 pt-16 text-center relative overflow-hidden" id="top">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(99,102,241,0.08),transparent)]" />
          <div className="max-w-3xl mx-auto">
            <span className="mb-3 text-[10px] sm:text-xs">비공개 베타 · 얼리 액세스 모집</span>
            <span className="block text-[10px] sm:text-xs font-semibold tracking-widest text-indigo-600 uppercase mb-3 sm:mb-4">
              IDEA → COMPANY · 사업화 OS
            </span>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight text-gray-900 mb-4 sm:mb-6">
              막막한 아이디어를,<br />
              <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 bg-clip-text text-transparent gradient-flow">
                실행 가능한 회사로.
              </span>
            </h1>
            <p className="text-sm sm:text-lg md:text-xl text-gray-500 leading-relaxed mb-8 sm:mb-10 max-w-xl mx-auto px-2">
              사업성 진단 · 단계별 로드맵 · 법인/행정 셋업 · 정부지원사업 매칭까지.
              아이디어 한 줄을 넣으면, 무엇을 어떤 순서로 해야 하는지 정리해 드립니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center w-full px-4 sm:px-0">
              <button
                onClick={() => handleRedirectWithSpinner(PRODUCT_URL)}
                className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-indigo-600 text-white font-semibold text-sm sm:text-base hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 cursor-pointer border-none whitespace-nowrap inline-flex items-center gap-1.5 justify-center"
              >
                아이디어 무료로 진단하기 <ArrowRight size={17} className="shrink-0" />
              </button>
              <Link
                href="/about"
                className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-full border border-gray-200 text-gray-700 font-semibold text-sm sm:text-base hover:bg-gray-50 transition-colors cursor-pointer bg-transparent whitespace-nowrap text-center"
              >
                작동 방식 보기
              </Link>
            </div>
            <p className="text-[11px] sm:text-sm text-gray-400 mt-4">
              요약·강점·점수는 무료 · 전체 결과는 아이디어 1건 결제 · 구독 아님
            </p>
          </div>

          <div className="mt-8 sm:mt-12 max-w-2xl w-full grid grid-cols-3 gap-3 sm:gap-8 pt-6 sm:pt-8 border-t border-gray-100 px-2">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-sm sm:text-xl font-bold text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis">{s.suffix}</div>
                <div className="text-[10px] sm:text-xs text-gray-500 mt-1 break-keep leading-tight">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 섹션 1 · 진입점 카드 ── */}
        <section className="h-screen flex flex-col items-center justify-center px-4 sm:px-6">
          <div className="max-w-5xl w-full mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <span className="text-xs font-semibold tracking-widest text-indigo-600 uppercase">EXPLORE</span>
              <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mt-2 sm:mt-3">더 알아보기</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {entryScreens.map((s) => (
                <Link
                  key={s.id}
                  href={s.path}
                  className="group bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all flex items-center justify-between gap-4"
                >
                  <div>
                    <h3 className="font-semibold text-base sm:text-lg text-gray-900">{s.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1 break-keep">{ENTRY_DESC[s.id] ?? ""}</p>
                  </div>
                  <ArrowRight size={18} className="text-gray-300 group-hover:text-indigo-500 transition-colors shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── 섹션 2 · 피날레 + 푸터 ── */}
        <section
          className="h-screen flex flex-col items-center justify-center px-4 sm:px-6 relative overflow-hidden"
          style={{
            background: "linear-gradient(to bottom, #0e0f13 0%, #050507 100%)",
            transition: "all 750ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div className="flex-1 flex items-center justify-center w-full">
            <div className="max-w-2xl text-center px-2">
              <span className="text-xs font-semibold tracking-widest text-indigo-300 uppercase">START NOW</span>
              <h2 className="text-2xl sm:text-4xl font-bold text-white mt-2 sm:mt-3 mb-3 sm:mb-4">막막함은 여기서 끝내세요.</h2>
              <p className="text-xs sm:text-base text-gray-400 mb-6 sm:mb-8 break-keep">아이디어 한 줄이면 충분합니다. 요약·강점·점수까지는 무료로 바로 확인하세요.</p>
              <button
                onClick={() => handleRedirectWithSpinner(PRODUCT_URL)}
                className="w-full sm:w-auto inline-block px-8 py-3.5 rounded-full bg-white text-indigo-600 font-bold text-sm hover:bg-indigo-50 transition-colors shadow-lg whitespace-nowrap cursor-pointer border-none"
              >
                아이디어 무료로 진단하기
              </button>
            </div>
          </div>

          {/* 푸터 — §3-2 사업자 정보(company.ts, 빈 값 미표기) · §3-5 정책 링크(S-01~03) */}
          <footer className="w-full border-t border-white/10 py-5 sm:py-6 text-white/50 text-[10px] sm:text-xs overflow-y-auto max-h-[35vh]">
            <div className="max-w-6xl mx-auto flex flex-col gap-3.5 sm:gap-4 px-2">
              <div className="flex flex-col lg:flex-row justify-between gap-4">
                <div className="flex items-center gap-2 text-white font-bold">
                  <Link href="/" className="flex items-center gap-2 cursor-pointer active:scale-95 transition-transform" aria-label="B Essential 공식 홈페이지로 이동">
                    <Image src="/logo(w).svg" alt="B Essential" width={110} height={20} priority className="sm:w-[130px] sm:h-[22px]" />
                  </Link>
                </div>
                <p className="max-w-2xl text-left lg:text-right text-[10px] sm:text-[11px] leading-relaxed break-keep">
                  본 서비스는 일반적인 정보와 실행 가이드를 제공하며, 법률·세무·노무 자문이 아닙니다. 법인 설립 절차·비용·세금, 정부지원사업의 요건·금액·일정은 시점에 따라 달라질 수 있어, 진행 전 공식 공고와 전문가(법무사·세무사 등) 확인이 필요합니다.
                </p>
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-1 pt-2 border-t border-white/5 text-[10px] sm:text-[11px] text-white/40">
                {businessInfoItems().map((i) => (
                  <span key={i.label}>
                    <b>{i.label}: </b>
                    {i.value}
                  </span>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-center pt-2 border-t border-white/5 text-[10px] sm:text-[11px] gap-2">
                <span>© {COMPANY.copyrightYear} {COMPANY.serviceName}. All rights reserved.</span>
                <div className="flex gap-4 text-white/40">
                  <Link href="/legal/terms" className="hover:text-white transition-colors">이용약관</Link>
                  <Link href="/legal/privacy" className="hover:text-white transition-colors">개인정보처리방침</Link>
                  <Link href="/legal/refund" className="hover:text-white transition-colors">환불정책</Link>
                </div>
              </div>
            </div>
          </footer>
        </section>
      </div>

      {/* ── 컴파일러 가상 로딩 오버레이 ── */}
      <div
        className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-gradient-to-b from-neutral-950 to-black text-white transition-opacity duration-300 ${
          isCompiling ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center gap-4 text-center px-6">
          <div className="w-10 h-10 border-4 border-white/10 border-t-indigo-500 rounded-full animate-spin shrink-0" />
          <div className="space-y-1 mt-2">
            <h4 className="text-sm font-bold tracking-tight font-mono text-neutral-200">SANDBOX OS LOADING</h4>
            <p className="text-xs text-neutral-500 font-mono tracking-wide">샌드박스 커널 및 데이터 맵 구조화 중...</p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes gradientFlow {
          0%, 100% { background-position: 0% 50%; }
          50%       { background-position: 100% 50%; }
        }
        .gradient-flow {
          background-size: 200% 200%;
          animation: gradientFlow 4s ease infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .gradient-flow { animation: none; }
        }
        body {
          overflow: hidden;
          overscroll-behavior: none;
          touch-action: pan-y;
        }
      `}</style>
    </div>
  );
}
