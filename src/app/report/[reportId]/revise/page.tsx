// [SCR: V-01] 아이디어 수정 · scope: P1
"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, RefreshCw } from "lucide-react";
import ReportTopBar from "@/components/report/ReportTopBar";
import { getMockReport } from "@/mocks/report";

export default function RevisePage({ params }: { params: Promise<{ reportId: string }> }) {
  const { reportId } = use(params);
  const router = useRouter();
  const report = getMockReport(reportId); // TODO(report-api)
  const [idea, setIdea] = useState(report.idea);

  function onRediagnose(e: React.FormEvent) {
    e.preventDefault();
    // 수정한 아이디어로 재진단 — 진단 퍼널 시작으로 이동
    router.push("/diagnose");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ReportTopBar
        right={
          <Link href={`/report/${reportId}`} className="text-xs text-gray-500 hover:text-gray-900 inline-flex items-center gap-1">
            <ArrowLeft size={13} /> 리포트로
          </Link>
        }
      />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <span className="text-xs font-semibold tracking-widest text-indigo-600 uppercase">재진단</span>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2 mb-1">아이디어를 수정할까요?</h1>
        <p className="text-sm text-gray-500 mb-6 break-keep">문구를 다듬거나 방향을 바꾼 뒤 다시 진단하면 새 버전이 만들어집니다.</p>

        <form onSubmit={onRediagnose} className="space-y-4">
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            rows={5}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 resize-none"
          />
          <button type="submit" className="w-full py-3 rounded-full bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors inline-flex items-center justify-center gap-1.5">
            <RefreshCw size={15} /> 이 아이디어로 재진단
          </button>
        </form>
      </main>
    </div>
  );
}
