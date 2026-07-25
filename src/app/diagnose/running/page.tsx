// [SCR: D-06] 진단 진행 중 · scope: P1
// 수십 초 걸리는 작업. 스피너 금지 — 진행 단계 텍스트를 순차적으로 노출한다.
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { useDiagnose } from "@/lib/diagnose/context";
import { submitDiagnosis, RUNNING_STEPS } from "@/lib/api/diagnose";

const STEP_MS = 1100; // 각 단계 노출 간격 (실제로는 진행률 스트림으로 대체: TODO(diagnose-api))

export default function RunningPage() {
  const router = useRouter();
  const { draft, reset } = useDiagnose();
  const [stepIndex, setStepIndex] = useState(0);
  const reportId = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    // 진단 요청 (스텁) — reportId 확보
    submitDiagnosis(draft).then((res) => {
      if (!cancelled) reportId.current = res.reportId;
    });

    // 단계 텍스트를 순차 노출
    const timer = setInterval(() => {
      setStepIndex((i) => {
        const next = i + 1;
        if (next >= RUNNING_STEPS.length) {
          clearInterval(timer);
          // 마지막 단계까지 노출되면 결과(F-01 무료 요약)로 이동
          setTimeout(() => {
            if (cancelled) return;
            const id = reportId.current ?? "demo";
            reset(); // 퍼널 상태 정리
            router.replace(`/report/${id}/free`);
          }, STEP_MS);
        }
        return next;
      });
    }, STEP_MS);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
    // 마운트 시 1회만 실행
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="py-6">
      <span className="text-xs font-semibold tracking-widest text-indigo-600 uppercase">진단 중</span>
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2 mb-2">아이디어를 분석하고 있어요</h1>
      <p className="text-sm text-gray-500 mb-8 break-keep">30초쯤 걸립니다. 창을 닫지 말고 잠시만 기다려 주세요.</p>

      <ol className="space-y-3">
        {RUNNING_STEPS.map((label, i) => {
          const done = i < stepIndex;
          const active = i === stepIndex;
          return (
            <li key={i} className="flex items-center gap-3">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                  done ? "bg-indigo-600 text-white" : active ? "bg-indigo-100 text-indigo-600" : "bg-gray-100 text-gray-300"
                }`}
              >
                {done ? <Check size={13} /> : <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-indigo-600 animate-pulse" : "bg-gray-300"}`} />}
              </span>
              <span className={`text-sm transition-colors ${done ? "text-gray-400 line-through" : active ? "text-gray-900 font-medium" : "text-gray-400"}`}>
                {label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
