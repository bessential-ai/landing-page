// [SCR: R-08] ⑧ 지원사업 매칭 · scope: P1
import ModuleSection from "@/components/report/ModuleSection";
import NeedsCheckBadge from "@/components/report/NeedsCheckBadge";
import { getMockReport } from "@/mocks/report";

export default async function GrantsPage({ params }: { params: Promise<{ reportId: string }> }) {
  const { reportId } = await params;
  const report = getMockReport(reportId); // TODO(report-api)

  return (
    <ModuleSection id="R-08" sources={report.sources}>
      {report.grants.map((g, i) => (
        <div key={i} className="rounded-xl border border-gray-100 bg-white p-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900 text-sm">{g.name}</span>
            <span className="text-[11px] text-gray-400">· {g.org}</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">적합: {g.fit}</div>
          <div className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
            {g.note} <NeedsCheckBadge />
          </div>
        </div>
      ))}
    </ModuleSection>
  );
}
