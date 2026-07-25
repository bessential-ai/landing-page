// [SCR: R-00] 리포트 허브 — 판정 · scope: P1
import Link from "next/link";
import { ArrowRight, AlertTriangle, FileDown, BookMarked } from "lucide-react";
import { getMockReport } from "@/mocks/report";
import { byGroup } from "@/lib/ia";

export default async function ReportHubPage({ params }: { params: Promise<{ reportId: string }> }) {
  const { reportId } = await params;
  const report = getMockReport(reportId); // TODO(report-api)

  // 모듈 카드 = R-01~R-09 (허브·반려·출처·출력 제외)
  const modules = byGroup("R").filter((s) => /^R-0[1-9]$/.test(s.id));

  return (
    <div>
      {/* 판정 */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6">
        <span className="text-xs font-semibold tracking-widest text-indigo-600 uppercase">판정</span>
        <div className="flex items-center gap-5 mt-2">
          <div className="text-center shrink-0">
            <div className="text-4xl font-extrabold text-indigo-600">{report.score}<span className="text-sm text-gray-400">/100</span></div>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed break-keep">{report.verdict}</p>
        </div>
        {report.rejected && (
          <Link href={`/report/${reportId}/rejected`} className="mt-4 flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
            <AlertTriangle size={16} className="shrink-0" /> 이 아이디어는 현재 형태로는 권장되지 않습니다 — 대안 보기 <ArrowRight size={14} />
          </Link>
        )}
      </div>

      {/* 모듈 네비게이션 */}
      <h2 className="text-sm font-bold text-gray-900 mt-8 mb-3">리포트 모듈</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {modules.map((m) => (
          <Link
            key={m.id}
            href={m.path.replace("[reportId]", reportId)}
            className="group flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3.5 hover:border-indigo-200 hover:shadow-sm transition-all"
          >
            <span className="text-sm font-medium text-gray-800">{m.name}</span>
            <ArrowRight size={16} className="text-gray-300 group-hover:text-indigo-500 transition-colors" />
          </Link>
        ))}
      </div>

      {/* 부가: 출처 · 출력 */}
      <div className="grid grid-cols-2 gap-3 mt-3">
        <Link href={`/report/${reportId}/sources`} className="flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm text-gray-700 hover:border-gray-300">
          <BookMarked size={15} className="text-gray-400" /> 근거 · 출처
        </Link>
        <Link href={`/report/${reportId}/export`} className="flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm text-gray-700 hover:border-gray-300">
          <FileDown size={15} className="text-gray-400" /> 출력 · 공유
        </Link>
      </div>
    </div>
  );
}
