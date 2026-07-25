// [SCR: R-10] 반려 리포트 · 대안 · scope: P1
// 판정이 부정적일 때의 분기 화면. 대안 방향을 제시한다.
import Link from "next/link";
import { AlertTriangle, ArrowRight, Lightbulb } from "lucide-react";
import ModuleSection from "@/components/report/ModuleSection";
import { getMockReport } from "@/mocks/report";

export default async function RejectedPage({ params }: { params: Promise<{ reportId: string }> }) {
  const { reportId } = await params;
  const report = getMockReport(reportId); // TODO(report-api)

  return (
    <ModuleSection id="R-10" sources={report.sources}>
      {report.rejected ? (
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 flex items-start gap-2">
          <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 break-keep">
            현재 형태로는 권장하기 어려운 판정입니다. 아래 대안 방향으로 범위·채널을 바꿔 재진단해 보세요.
          </p>
        </div>
      ) : (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-800 break-keep">
          이 리포트는 반려되지 않았습니다. 아래는 방향을 더 강화할 수 있는 대안 관점입니다.
        </div>
      )}

      <h2 className="flex items-center gap-1.5 text-sm font-bold text-gray-900 mt-2 mb-1"><Lightbulb size={15} className="text-indigo-500" /> 대안 방향</h2>
      {report.alternatives.map((a, i) => (
        <div key={i} className="rounded-xl border border-gray-100 bg-white p-4">
          <div className="font-semibold text-gray-900 text-sm">{a.t}</div>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed break-keep">{a.d}</p>
        </div>
      ))}

      <Link
        href={`/report/${reportId}/revise`}
        className="mt-2 inline-flex items-center justify-center gap-1.5 w-full py-3 rounded-full bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
      >
        아이디어 수정해서 재진단 <ArrowRight size={16} />
      </Link>
    </ModuleSection>
  );
}
