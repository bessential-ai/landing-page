"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

const features = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: "서류 자동 분류",
    desc: "사업자등록, 투자계약서, 고용 관련 서류 등 필요한 서류를 유형별로 자동 분류해드립니다.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    title: "체크리스트 제공",
    desc: "창업 단계별로 필요한 서류 체크리스트를 제공하여 빠짐없이 준비할 수 있도록 도와줍니다.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: "안전한 보관",
    desc: "중요한 창업 서류를 암호화된 클라우드에 안전하게 보관하고 언제 어디서나 접근하세요.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "팀 협업",
    desc: "공동창업자, 법무법인, 회계사 등 관계자와 서류를 안전하게 공유하고 협업하세요.",
  },
];

const steps = [
  { num: "01", title: "회원가입", desc: "간단한 정보만으로 30초 안에 가입 완료" },
  { num: "02", title: "서류 업로드", desc: "보유한 서류를 드래그 앤 드롭으로 손쉽게 업로드" },
  { num: "03", title: "자동 정리", desc: "AI가 서류를 분석하고 유형별로 자동 분류" },
  { num: "04", title: "관리 시작", desc: "체크리스트와 함께 빠진 서류 없이 창업 준비 완료" },
];

const stats = [
  { target: 1200, suffix: "+", label: "창업팀 이용 중" },
  { target: 98, suffix: "%", label: "사용자 만족도" },
  { target: 3, suffix: "분", label: "평균 서류 정리 시간" },
];

const SECTION_COUNT = 4;
const COOLDOWN = 950; // ms
const INTRO_STORAGE_KEY = "bessential:hero-intro-seen";
const COUNT_UP_DURATION = 2000;
const COUNT_UP_DELAY = 120;

const formatStatValue = (value: number, suffix: string) => {
  return `${Math.floor(value).toLocaleString("en-US")}${suffix}`;
};

const easeOutQuint = (progress: number) => {
  return 1 - Math.pow(1 - progress, 5);
};

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [playIntro, setPlayIntro] = useState(false);
  const [countValues, setCountValues] = useState(() => stats.map((s) => s.target));
  const blocking = useRef(false);
  const touchStartY = useRef(0);

  const goTo = useCallback((index: number) => {
    const next = Math.min(Math.max(index, 0), SECTION_COUNT - 1);
    setCurrent(next);
    blocking.current = true;
    setTimeout(() => { blocking.current = false; }, COOLDOWN);
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const hasSeenIntro = window.sessionStorage.getItem(INTRO_STORAGE_KEY) === "true";

      if (reduceMotion || hasSeenIntro) return;

      window.sessionStorage.setItem(INTRO_STORAGE_KEY, "true");
      setPlayIntro(true);
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (current !== 0) return;

    let frame = 0;
    let timeout = 0;

    const resetFrame = window.requestAnimationFrame(() => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduceMotion) return;

      setCountValues(stats.map(() => 0));

      timeout = window.setTimeout(() => {
        const startedAt = performance.now();

        const tick = (now: number) => {
          const progress = Math.min((now - startedAt) / COUNT_UP_DURATION, 1);
          const eased = easeOutQuint(progress);

          setCountValues(stats.map((s) => s.target * eased));

          if (progress < 1) {
            frame = window.requestAnimationFrame(tick);
          } else {
            setCountValues(stats.map((s) => s.target));
          }
        };

        frame = window.requestAnimationFrame(tick);
      }, COUNT_UP_DELAY);
    });

    return () => {
      window.cancelAnimationFrame(resetFrame);
      window.clearTimeout(timeout);
      window.cancelAnimationFrame(frame);
    };
  }, [current]);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (blocking.current) return;
      setCurrent((c) => {
        const next = e.deltaY > 0 ? Math.min(c + 1, SECTION_COUNT - 1) : Math.max(c - 1, 0);
        blocking.current = true;
        setTimeout(() => { blocking.current = false; }, COOLDOWN);
        return next;
      });
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (blocking.current) return;
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        setCurrent((c) => { const n = Math.min(c + 1, SECTION_COUNT - 1); blocking.current = true; setTimeout(() => { blocking.current = false; }, COOLDOWN); return n; });
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        setCurrent((c) => { const n = Math.max(c - 1, 0); blocking.current = true; setTimeout(() => { blocking.current = false; }, COOLDOWN); return n; });
      }
    };
    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (blocking.current) return;
      const delta = touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(delta) < 30) return;
      setCurrent((c) => {
        const next = delta > 0 ? Math.min(c + 1, SECTION_COUNT - 1) : Math.max(c - 1, 0);
        blocking.current = true;
        setTimeout(() => { blocking.current = false; }, COOLDOWN);
        return next;
      });
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
  }, []);

  const sectionIds = ["hero", "features", "how", "cta"];
  const sectionBg = ["#ffffff", "#f9fafb", "#ffffff", "#ffffff"];

  return (
    <div
      className="h-screen overflow-hidden text-gray-900"
      style={{ backgroundColor: sectionBg[current], transition: "background-color 900ms cubic-bezier(0.16, 1, 0.3, 1)" }}
    >
      {/* 헤더 */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Image src="/logo.svg" alt="B Essential" width={130} height={22} priority />
          <nav className="hidden md:flex items-center gap-8 text-sm text-gray-600">
            {["기능", "이용 방법", "시작하기"].map((label, i) => (
              <button key={label} onClick={() => goTo(i + 1)} className="hover:text-indigo-600 transition-colors cursor-pointer bg-transparent border-none p-0">
                {label}
              </button>
            ))}
          </nav>
          <button
            onClick={() => goTo(3)}
            className="text-sm font-medium px-4 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            무료로 시작하기
          </button>
        </div>
      </header>

      {/* 우측 dot 인디케이터 */}
      <nav className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
        {sectionIds.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer border-none p-0 ${
              current === i ? "bg-indigo-600 scale-125" : "bg-gray-300 hover:bg-indigo-300"
            }`}
            aria-label={`섹션 ${i + 1}`}
          />
        ))}
      </nav>

      {/* 슬라이드 래퍼 */}
      <div
        className="will-change-transform"
        style={{
          transform: `translateY(-${current * 100}vh)`,
          transition: "transform 900ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* 섹션 1 — 히어로 */}
        <section className="h-screen flex flex-col items-center justify-center px-6 pt-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(99,102,241,0.1),transparent)]" />
          <div className="max-w-3xl mx-auto">
            <span
              className={`inline-block text-xs font-semibold tracking-widest text-indigo-600 uppercase mb-6 px-3 py-1 bg-indigo-50 rounded-full ${playIntro ? "hero-rise-in" : ""}`}
              style={{ animationDelay: "80ms" }}
            >
              창업 서류 관리 플랫폼
            </span>
            <h1 className="text-5xl sm:text-6xl font-bold leading-tight tracking-tight text-gray-900 mb-6">
              <span className={`inline-block ${playIntro ? "hero-rise-in" : ""}`} style={{ animationDelay: "180ms" }}>
                창업 서류,
              </span>
              <br />
              <span
                className={`inline-block bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 bg-clip-text text-transparent gradient-flow ${playIntro ? "hero-rise-in" : ""}`}
                style={{ animationDelay: "300ms" }}
              >
                이제 쉽고 빠르게
              </span>
            </h1>
            <p
              className={`text-lg sm:text-xl text-gray-500 leading-relaxed mb-10 max-w-xl mx-auto ${playIntro ? "hero-rise-in" : ""}`}
              style={{ animationDelay: "440ms" }}
            >
              사업자등록부터 투자계약서까지, 초기 창업자에게 필요한 모든 서류를 한 곳에서 정리하세요.
              B Essential이 복잡한 서류 준비를 단순하게 만들어드립니다.
            </p>
            <div
              className={`flex flex-col sm:flex-row gap-4 justify-center ${playIntro ? "hero-rise-in" : ""}`}
              style={{ animationDelay: "560ms" }}
            >
              <button
                onClick={() => goTo(3)}
                className="px-8 py-4 rounded-full bg-indigo-600 text-white font-semibold text-base hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 cursor-pointer border-none"
              >
                지금 무료로 시작하기
              </button>
              <button
                onClick={() => goTo(2)}
                className="px-8 py-4 rounded-full border border-gray-200 text-gray-700 font-semibold text-base hover:bg-gray-50 transition-colors cursor-pointer bg-transparent"
              >
                이용 방법 보기 →
              </button>
            </div>
          </div>
          <div className="mt-16 max-w-2xl w-full grid grid-cols-3 gap-8">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`text-center ${playIntro ? "hero-rise-in" : ""}`}
                style={{ animationDelay: `${680 + i * 90}ms` }}
              >
                <div className="text-3xl font-bold text-gray-900 tabular-nums" style={{ fontFamily: "'Pretendard Variable', Pretendard, sans-serif" }}>
                  {formatStatValue(countValues[i], s.suffix)}
                </div>
                <div className="text-sm text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
          <button
            onClick={() => goTo(1)}
            className="absolute bottom-8 flex flex-col items-center gap-1 text-gray-400 animate-bounce bg-transparent border-none cursor-pointer"
          >
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </section>

        {/* 섹션 2 — 기능 */}
        <section className="h-screen flex flex-col items-center justify-center px-6">
          <div className="max-w-6xl w-full mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                창업에 집중할 수 있도록
              </h2>
              <p className="text-gray-500 text-lg max-w-xl mx-auto">
                서류 걱정 없이 비즈니스에만 집중하세요. B Essential이 나머지를 처리합니다.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
                >
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                    {f.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 섹션 3 — 이용 방법 */}
        <section className="h-screen flex flex-col items-center justify-center px-6">
          <div className="max-w-5xl w-full mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                4단계로 끝나는 서류 정리
              </h2>
              <p className="text-gray-500 text-lg">복잡한 과정 없이 누구나 쉽게 시작할 수 있어요.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {steps.map((s, i) => (
                <div key={s.num} className="relative">
                  {i < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-6 left-full w-full h-px bg-gradient-to-r from-indigo-200 to-transparent -translate-x-4 z-0" />
                  )}
                  <div className="relative z-10">
                    <span className="text-5xl font-black text-indigo-100 select-none">{s.num}</span>
                    <h3 className="font-semibold text-gray-900 text-lg mt-1 mb-2">{s.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 섹션 4 — CTA + 푸터 */}
        <section className="h-screen flex flex-col items-center justify-center px-6">
          <div className="flex-1 flex items-center justify-center w-full">
            <div className="max-w-3xl w-full text-center bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-12 sm:p-16 shadow-xl shadow-indigo-200">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                지금 바로 시작해보세요
              </h2>
              <p className="text-indigo-100 text-lg mb-8 max-w-md mx-auto">
                무료 플랜으로 B Essential의 핵심 기능을 경험해보세요. 신용카드 불필요.
              </p>
              <a
                href="#"
                className="inline-block px-10 py-4 rounded-full bg-white text-indigo-600 font-bold text-base hover:bg-indigo-50 transition-colors shadow-lg"
              >
                무료로 시작하기
              </a>
            </div>
          </div>
          <footer className="w-full border-t border-gray-100 py-8 px-6">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <Image src="/logo.svg" alt="B Essential" width={100} height={17} />
              <p className="text-sm text-gray-400">© 2026 B Essential. All rights reserved.</p>
              <div className="flex gap-6 text-sm text-gray-400">
                <a href="#" className="hover:text-gray-600 transition-colors">이용약관</a>
                <a href="#" className="hover:text-gray-600 transition-colors">개인정보처리방침</a>
              </div>
            </div>
          </footer>
        </section>
      </div>
    </div>
  );
}
