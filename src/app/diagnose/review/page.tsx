// [SCR: D-05] 최종 확인 · scope: P1
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { useDiagnose } from "@/lib/diagnose/context";
import { INDUSTRIES } from "@/lib/api/diagnose";

export default function ReviewPage() {
  const router = useRouter();
  const { draft, update } = useDiagnose();

  useEffect(() => {
    if (!draft.idea) router.replace("/diagnose");
  }, [draft.idea, router]);

  const industryLabel = INDUSTRIES.find((i) => i.key === draft.industry)?.label ?? "-";
  const ex = draft.extracted;

  function onConfirm() {
    update({ confirmed: true });
    router.push("/diagnose/running");
  }

  const rows: { label: string; value: string; edit: string }[] = [
    { label: "한 줄 정의", value: ex?.oneLiner || draft.idea, edit: "/diagnose/confirm" },
    { label: "해결하는 문제", value: ex?.problem || "-", edit: "/diagnose/confirm" },
    { label: "핵심 고객", value: ex?.customer || "-", edit: "/diagnose/confirm" },
    { label: "솔루션", value: ex?.solution || "-", edit: "/diagnose/confirm" },
    { label: "수익 모델", value: ex?.revenue || "-", edit: "/diagnose/confirm" },
    { label: "업종", value: industryLabel, edit: "/diagnose/industry" },
  ];

  return (
    <div>
      <span className="text-xs font-semibold tracking-widest text-indigo-600 uppercase">STEP 5</span>
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2 mb-2">이대로 진단할까요?</h1>
      <p className="text-sm text-gray-500 mb-6 break-keep">잘못된 부분이 있으면 각 항목의 ‘수정’으로 돌아가 고칠 수 있습니다.</p>

      <div className="rounded-2xl border border-gray-100 bg-white divide-y divide-gray-50 overflow-hidden">
        {rows.map((r) => (
          <div key={r.label} className="grid grid-cols-[6.5rem_1fr_auto] gap-3 px-4 py-3 items-start text-sm">
            <span className="font-semibold text-gray-500">{r.label}</span>
            <span className="text-gray-800 break-keep">{r.value}</span>
            <Link href={r.edit} className="text-[11px] text-indigo-500 hover:text-indigo-700 shrink-0">수정</Link>
          </div>
        ))}
      </div>

      <button
        onClick={onConfirm}
        className="w-full mt-6 py-3 rounded-full bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors inline-flex items-center justify-center gap-1.5"
      >
        <Sparkles size={16} /> 진단 시작
      </button>
    </div>
  );
}
