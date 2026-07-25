// [SCR: R-02] ② 유사 서비스 · scope: P1
import ModuleSection from "@/components/report/ModuleSection";
import { getMockReport } from "@/mocks/report";

export default async function CompetitorsPage({ params }: { params: Promise<{ reportId: string }> }) {
  const { reportId } = await params;
  const report = getMockReport(reportId); // TODO(report-api)

  return (
    <ModuleSection id="R-02" sources={report.sources}>
      {report.competitors.map((c, i) => (
        <div key={i} className="rounded-xl border border-gray-100 bg-white p-4">
          <div className="font-semibold text-gray-900 text-sm">{c.name}</div>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed break-keep">{c.note}</p>
        </div>
      ))}
    </ModuleSection>
  );
}
