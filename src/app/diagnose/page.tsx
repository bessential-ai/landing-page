// [SCR: D-01] 아이디어 한 줄 입력 · scope: P1
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useDiagnose } from "@/lib/diagnose/context";
import { extractIdea } from "@/lib/api/diagnose";

export default function DiagnoseStartPage() {
  const router = useRouter();
  const { draft, update } = useDiagnose();
  const [idea, setIdea] = useState(draft.idea);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!idea.trim()) return;
    setPending(true);
    update({ idea });
    const extracted = await extractIdea(idea); // D-01 → D-02: AI 추출 (TODO: ai-extract)
    update({ extracted });
    router.push("/diagnose/confirm");
  }

  return (
    <div>
      <span className="text-xs font-semibold tracking-widest text-indigo-600 uppercase">STEP 1</span>
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2 mb-2">아이디어를 한 줄로 적어주세요</h1>
      <p className="text-sm text-gray-500 mb-6 break-keep">
        완벽하지 않아도 괜찮습니다. 다음 단계에서 AI가 이해한 내용을 함께 다듬습니다.
      </p>
      <form onSubmit={onSubmit} className="space-y-4">
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          rows={4}
          autoFocus
          placeholder="예: 마감 임박한 음식을 동네 손님에게 할인가로 연결하는 앱"
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 resize-none"
        />
        <button
          type="submit"
          disabled={pending || !idea.trim()}
          className="w-full py-3 rounded-full bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-1.5"
        >
          {pending ? "AI가 읽는 중…" : (<>다음 <ArrowRight size={16} /></>)}
        </button>
      </form>
    </div>
  );
}
