// [SCR: M-01] 내 아이디어 목록 · scope: P1
import Link from "next/link";
import { ArrowRight, Lock, Plus } from "lucide-react";
import MeShell from "@/components/me/MeShell";
import { MY_IDEAS } from "@/mocks/me";

export default function IdeasPage() {
  return (
    <MeShell>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-bold text-gray-900">내 아이디어</h1>
        <Link href="/diagnose" className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700">
          <Plus size={15} /> 새 진단
        </Link>
      </div>

      <div className="space-y-3">
        {MY_IDEAS.map((it) => {
          const href = it.paid ? `/report/${it.reportId}` : `/report/${it.reportId}/free`;
          return (
            <Link key={it.reportId} href={href} className="group flex items-center gap-4 rounded-xl border border-gray-100 bg-white px-4 py-4 hover:border-indigo-200 hover:shadow-sm transition-all">
              <div className="text-center shrink-0 w-12">
                <div className="text-xl font-extrabold text-indigo-600">{it.score}</div>
                <div className="text-[9px] text-gray-400">/100</div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-900 truncate">{it.title}</div>
                <div className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-1.5">
                  {it.updatedAt}
                  {!it.paid && <span className="inline-flex items-center gap-0.5 text-amber-600"><Lock size={10} /> 미결제</span>}
                </div>
              </div>
              <ArrowRight size={16} className="text-gray-300 group-hover:text-indigo-500 transition-colors shrink-0" />
            </Link>
          );
        })}
      </div>
    </MeShell>
  );
}
