// [SCR: R-11] 근거 · 출처 상세 · scope: P1
import { ExternalLink } from "lucide-react";
import ModuleSection from "@/components/report/ModuleSection";
import NeedsCheckBadge from "@/components/report/NeedsCheckBadge";
import { getMockReport } from "@/mocks/report";

export default async function SourcesPage({ params }: { params: Promise<{ reportId: string }> }) {
  const { reportId } = await params;
  const report = getMockReport(reportId); // TODO(report-api)

  return (
    <ModuleSection id="R-11">
      <p className="text-sm text-gray-500 break-keep -mt-2 mb-2">
        리포트에 사용한 출처와 확인일입니다. 변동 가능한 항목에는 <NeedsCheckBadge /> 를 표기합니다.
      </p>
      <div className="rounded-2xl border border-gray-100 bg-white divide-y divide-gray-50 overflow-hidden">
        {report.sources.map((s, i) => (
          <div key={i} className="px-4 py-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-gray-900">{s.title}</span>
              {s.needsCheck && <NeedsCheckBadge />}
            </div>
            <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-2 flex-wrap">
              <span>{s.publisher}</span>
              <span className="font-mono">· {s.checkedAt} 확인</span>
              {s.url && (
                <a href={s.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-0.5 text-indigo-500 hover:text-indigo-700">
                  <ExternalLink size={11} /> 원문
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </ModuleSection>
  );
}
