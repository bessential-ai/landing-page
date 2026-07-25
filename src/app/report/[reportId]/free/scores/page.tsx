// [SCR: F-02] 6축 점수 상세 · scope: P1 · 비결제 열람 가능 (무료 노출 한계선)
import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";
import ReportTopBar from "@/components/report/ReportTopBar";
import ScoreAxes from "@/components/report/ScoreAxes";
import { getMockReport } from "@/mocks/report";

export default async function ScoresPage({ params }: { params: Promise<{ reportId: string }> }) {
  const { reportId } = await params;
  const report = getMockReport(reportId); // TODO(report-api)

  return (
    <div className="min-h-screen bg-gray-50">
      <ReportTopBar right={<span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded font-medium">무료 미리보기</span>} />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <Link href={`/report/${reportId}/free`} className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 mb-4">
          <ArrowLeft size={13} /> 요약으로
        </Link>
        <span className="text-xs font-semibold tracking-widest text-indigo-600 uppercase">6축 점수 상세</span>
        <div className="flex items-baseline gap-3 mt-2 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">사업성 진단 지수</h1>
          <span className="text-2xl font-extrabold text-indigo-600">{report.score}<span className="text-sm text-gray-400">/100</span></span>
        </div>

        {/* 축 개수는 배열 길이로 렌더 (하드코딩 금지) */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6">
          <ScoreAxes axes={report.axes} showNotes />
        </div>

        <div className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-5 text-center">
          <p className="text-sm text-gray-700 break-keep mb-3">
            여기까지 무료입니다. 강점·단점, 규제 리스크, 로드맵, 산출물은 전체 리포트에 있습니다.
          </p>
          <Link
            href={`/report/${reportId}/paywall`}
            className="inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-full bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
          >
            <Lock size={15} /> 전체 리포트 잠금 해제
          </Link>
        </div>
      </main>
    </div>
  );
}
