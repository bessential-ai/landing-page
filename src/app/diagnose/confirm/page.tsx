// [SCR: D-02] 추출 확인 · 후속 질문 · scope: P1
// 단순 confirm 이 아니다 — AI가 이해한 내용을 사용자가 직접 확인하고 수정한다.
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useDiagnose } from "@/lib/diagnose/context";
import type { ExtractedIdea } from "@/lib/api/types";

const FIELDS: { key: keyof ExtractedIdea; label: string; placeholder: string }[] = [
  { key: "oneLiner", label: "한 줄 정의", placeholder: "이 아이디어를 한 문장으로" },
  { key: "problem", label: "해결하는 문제", placeholder: "누구의 어떤 불편을 해결하나요?" },
  { key: "customer", label: "핵심 고객", placeholder: "가장 먼저 쓸 사람은 누구인가요?" },
  { key: "solution", label: "솔루션", placeholder: "무엇을 어떻게 제공하나요?" },
  { key: "revenue", label: "수익 모델", placeholder: "어떻게 돈을 버나요?" },
];

export default function ConfirmPage() {
  const router = useRouter();
  const { draft, update } = useDiagnose();
  const [form, setForm] = useState<ExtractedIdea>(
    draft.extracted ?? { oneLiner: draft.idea, problem: "", customer: "", solution: "", revenue: "" }
  );

  // D-01 을 건너뛰고 직접 진입하면 시작으로 되돌림
  useEffect(() => {
    if (!draft.idea) router.replace("/diagnose");
  }, [draft.idea, router]);

  function set(key: keyof ExtractedIdea, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    update({ extracted: form });
    router.push("/diagnose/industry");
  }

  return (
    <div>
      <span className="text-xs font-semibold tracking-widest text-indigo-600 uppercase">STEP 2</span>
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2 mb-2">AI가 이렇게 이해했어요</h1>
      <p className="text-sm text-gray-500 mb-6 break-keep">
        틀린 부분이 있으면 직접 고쳐주세요. 정확할수록 진단이 좋아집니다.
      </p>
      <form onSubmit={onSubmit} className="space-y-4">
        {FIELDS.map((f) => (
          <label key={f.key} className="block">
            <span className="text-xs font-medium text-gray-600">{f.label}</span>
            <textarea
              value={form[f.key]}
              onChange={(e) => set(f.key, e.target.value)}
              rows={2}
              placeholder={f.placeholder}
              className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 resize-none"
            />
          </label>
        ))}
        <div className="flex gap-2 pt-2">
          <button type="button" onClick={() => router.back()} className="px-4 py-2.5 rounded-full border border-gray-200 text-sm text-gray-600 hover:bg-gray-100">
            이전
          </button>
          <button type="submit" className="flex-1 py-2.5 rounded-full bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors inline-flex items-center justify-center gap-1.5">
            맞아요, 다음 <ArrowRight size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}
