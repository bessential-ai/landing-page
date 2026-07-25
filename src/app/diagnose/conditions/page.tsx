// [SCR: D-04] 업종별 조건부 · scope: P1
// D-03 에서 고른 업종에 따라 질문이 달라진다. 여기서는 분기 구조만 잡고
// 실제 질문셋은 TODO(industry-questions) (src/lib/api/diagnose.ts).
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useDiagnose } from "@/lib/diagnose/context";
import { conditionQuestionsFor } from "@/lib/api/diagnose";

export default function ConditionsPage() {
  const router = useRouter();
  const { draft, update } = useDiagnose();

  // D-03 을 건너뛰고 들어오면 업종 선택으로 되돌림
  useEffect(() => {
    if (!draft.industry) router.replace("/diagnose/industry");
  }, [draft.industry, router]);

  const questions = draft.industry ? conditionQuestionsFor(draft.industry) : [];
  const [answers, setAnswers] = useState<Record<string, string>>(draft.conditions ?? {});

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    update({ conditions: answers });
    router.push("/diagnose/review");
  }

  const allAnswered = questions.every((q) => answers[q.id]);

  return (
    <div>
      <span className="text-xs font-semibold tracking-widest text-indigo-600 uppercase">STEP 4</span>
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2 mb-2">
        {questions.length > 0 ? "몇 가지만 더 확인할게요" : "추가로 확인할 항목은 없어요"}
      </h1>
      <p className="text-sm text-gray-500 mb-6 break-keep">
        {questions.length > 0
          ? "업종 특성상 규제·리스크에 영향을 주는 질문입니다."
          : "선택하신 업종은 별도 조건 확인 없이 바로 진행합니다."}
      </p>

      <form onSubmit={onSubmit} className="space-y-5">
        {questions.map((q) => (
          <fieldset key={q.id} className="space-y-2">
            <legend className="text-sm font-medium text-gray-800 mb-1">{q.label}</legend>
            <div className="flex flex-wrap gap-2">
              {q.options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setAnswers((a) => ({ ...a, [q.id]: opt }))}
                  className={`px-3.5 py-2 rounded-full border text-sm transition-colors ${
                    answers[q.id] === opt ? "border-indigo-400 bg-indigo-50 text-indigo-700 font-medium" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </fieldset>
        ))}

        <div className="flex gap-2 pt-2">
          <button type="button" onClick={() => router.back()} className="px-4 py-2.5 rounded-full border border-gray-200 text-sm text-gray-600 hover:bg-gray-100">
            이전
          </button>
          <button
            type="submit"
            disabled={questions.length > 0 && !allAnswered}
            className="flex-1 py-2.5 rounded-full bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-1.5"
          >
            다음 <ArrowRight size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}
