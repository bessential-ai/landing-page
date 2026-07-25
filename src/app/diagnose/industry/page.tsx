// [SCR: D-03] 업종 · 규제 선택 · scope: P1
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ShieldAlert } from "lucide-react";
import { useDiagnose } from "@/lib/diagnose/context";
import { INDUSTRIES } from "@/lib/api/diagnose";
import type { IndustryKey } from "@/lib/api/types";

export default function IndustryPage() {
  const router = useRouter();
  const { draft, update } = useDiagnose();
  const [selected, setSelected] = useState<IndustryKey | undefined>(draft.industry);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    const industry = INDUSTRIES.find((i) => i.key === selected);
    update({ industry: selected, regulated: industry?.regulated ?? false });
    router.push("/diagnose/conditions");
  }

  const selectedIndustry = INDUSTRIES.find((i) => i.key === selected);

  return (
    <div>
      <span className="text-xs font-semibold tracking-widest text-indigo-600 uppercase">STEP 3</span>
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2 mb-2">어떤 업종에 가깝나요?</h1>
      <p className="text-sm text-gray-500 mb-6 break-keep">규제 민감 업종은 다음 단계에서 추가로 확인할 게 있습니다.</p>
      <form onSubmit={onSubmit} className="space-y-3">
        {INDUSTRIES.map((i) => (
          <button
            key={i.key}
            type="button"
            onClick={() => setSelected(i.key)}
            className={`w-full flex items-center justify-between gap-3 rounded-xl border px-4 py-3.5 text-left transition-colors ${
              selected === i.key ? "border-indigo-400 bg-indigo-50/60" : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <span className="text-sm font-medium text-gray-900">{i.label}</span>
            {i.regulated && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5">
                <ShieldAlert size={11} /> 규제 민감
              </span>
            )}
          </button>
        ))}
        <button
          type="submit"
          disabled={!selected}
          className="w-full mt-3 py-2.5 rounded-full bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-1.5"
        >
          다음 {selectedIndustry?.regulated ? "(추가 확인 있음)" : ""} <ArrowRight size={16} />
        </button>
      </form>
    </div>
  );
}
