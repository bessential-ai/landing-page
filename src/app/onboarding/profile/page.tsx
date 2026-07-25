// [SCR: G-05] 창업자 프로필 STEP3 · scope: P1 · 결제 완료 후 진입
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import ReportTopBar from "@/components/report/ReportTopBar";

export default function ProfilePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [oneLiner, setOneLiner] = useState("");
  const [team, setTeam] = useState("solo");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    // TODO(auth-api): 창업자 프로필 저장. 지금은 스텁.
    await new Promise((r) => setTimeout(r, 500));
    router.push("/me/ideas");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ReportTopBar right={<span className="text-xs text-gray-400 font-mono">STEP 3 / 3</span>} />
      <main className="max-w-md mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <span className="text-xs font-semibold tracking-widest text-indigo-600 uppercase">창업자 프로필</span>
        <h1 className="text-2xl font-bold text-gray-900 mt-2 mb-1">거의 다 왔어요</h1>
        <p className="text-sm text-gray-500 mb-6 break-keep">로드맵과 지원사업 매칭을 더 정확히 하기 위한 정보입니다. 나중에 바꿀 수 있어요.</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block">
            <span className="text-xs font-medium text-gray-600">이름 / 팀명</span>
            <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200" />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-gray-600">한 줄 이력 (선택)</span>
            <input value={oneLiner} onChange={(e) => setOneLiner(e.target.value)} placeholder="예: 헬스케어 5년 · 개발자" className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200" />
          </label>
          <fieldset>
            <legend className="text-xs font-medium text-gray-600 mb-1.5">팀 구성</legend>
            <div className="flex gap-2">
              {[
                { id: "solo", label: "1인" },
                { id: "small", label: "2~3인" },
                { id: "team", label: "4인+" },
              ].map((o) => (
                <button key={o.id} type="button" onClick={() => setTeam(o.id)} className={`flex-1 py-2 rounded-lg border text-sm transition-colors ${team === o.id ? "border-indigo-400 bg-indigo-50 text-indigo-700 font-medium" : "border-gray-200 text-gray-600"}`}>
                  {o.label}
                </button>
              ))}
            </div>
          </fieldset>
          <button type="submit" disabled={pending} className="w-full py-3 rounded-full bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-60 inline-flex items-center justify-center gap-1.5">
            {pending ? "저장 중…" : (<>완료하고 내 아이디어로 <ArrowRight size={16} /></>)}
          </button>
        </form>
      </main>
    </div>
  );
}
