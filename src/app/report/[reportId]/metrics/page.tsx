// [SCR: R-05] ⑤ 핵심 지표 · scope: P1
import ModuleSection from "@/components/report/ModuleSection";
import { getMockReport } from "@/mocks/report";

export default async function MetricsPage({ params }: { params: Promise<{ reportId: string }> }) {
  const { reportId } = await params;
  const report = getMockReport(reportId); // TODO(report-api)

  return (
    <ModuleSection id="R-05" sources={report.sources}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {report.metrics.map((m, i) => (
          <div key={i} className="rounded-xl border border-gray-100 bg-white p-4">
            <div className="text-xs text-gray-500">{m.label}</div>
            <div className="text-lg font-extrabold text-indigo-600 mt-0.5">{m.value}</div>
            <p className="text-[11px] text-gray-400 mt-1 break-keep">{m.note}</p>
          </div>
        ))}
      </div>
    </ModuleSection>
  );
}
