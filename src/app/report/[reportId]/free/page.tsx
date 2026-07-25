// [SCR: F-01] 무료 결과 요약 · scope: P1 · 비결제 열람 가능
import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import ReportTopBar from "@/components/report/ReportTopBar";
import { getMockReport } from "@/mocks/report";

export default async function FreeSummaryPage({ params }: { params: Promise<{ reportId: string }> }) {
  const { reportId } = await params;
  const report = getMockReport(reportId); // TODO(report-api)

  return (
    <div className="min-h-screen bg-gray-50">
      <ReportTopBar right={<span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded font-medium">무료 미리보기</span>} />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <span className="text-xs font-semibold tracking-widest text-indigo-600 uppercase">무료 결과 요약</span>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2 mb-1">이 아이디어, 시작할 가치가 있을까?</h1>
        <p className="text-sm text-gray-500 break-keep">{report.idea}</p>

        {/* 종합 점수 */}
        <div className="mt-6 flex items-center gap-5 rounded-2xl border border-gray-100 bg-white p-5">
          <div className="text-center shrink-0">
            <div className="text-4xl font-extrabold text-indigo-600">
              {report.score}
              <span className="text-sm text-gray-400">/100</span>
            </div>
            <div className="text-[10px] text-gray-400 mt-1">비즈니스 진단 지수</div>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed break-keep">{report.verdict}</p>
        </div>

        {/* 구조화 요약 (무료 공개) */}
        <div className="mt-6 rounded-2xl border border-gray-100 bg-white divide-y divide-gray-50 overflow-hidden">
          {report.summary.map((s, i) => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-4 gap-1 sm:gap-3 px-4 py-3">
              <span className="font-semibold text-indigo-600 text-xs">{s.k}</span>
              <span className="sm:col-span-3 text-gray-700 text-xs break-keep">{s.v}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link
            href={`/report/${reportId}/free/scores`}
            className="flex-1 py-3 rounded-full border border-gray-200 bg-white text-gray-800 text-sm font-semibold text-center hover:border-gray-300 transition-colors inline-flex items-center justify-center gap-1.5"
          >
            6축 점수 상세 보기 <ArrowRight size={16} />
          </Link>
          <Link
            href={`/report/${reportId}/paywall`}
            className="flex-1 py-3 rounded-full bg-indigo-600 text-white text-sm font-semibold text-center hover:bg-indigo-700 transition-colors inline-flex items-center justify-center gap-1.5"
          >
            <Lock size={15} /> 전체 리포트 잠금 해제
          </Link>
        </div>
      </main>
    </div>
  );
}
