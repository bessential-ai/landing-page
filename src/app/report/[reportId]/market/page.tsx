// [SCR: R-04] ④ 시장 조사 · scope: P1
import ModuleSection from "@/components/report/ModuleSection";
import NeedsCheckBadge from "@/components/report/NeedsCheckBadge";
import { getMockReport } from "@/mocks/report";

export default async function MarketPage({ params }: { params: Promise<{ reportId: string }> }) {
  const { reportId } = await params;
  const report = getMockReport(reportId); // TODO(report-api)
  const { market } = report;

  const rows = [
    { label: "TAM", value: market.tam },
    { label: "SAM", value: market.sam },
    { label: "SOM", value: market.som },
  ];

  return (
    <ModuleSection id="R-04" sources={report.sources}>
      <div className="rounded-2xl border border-gray-100 bg-white divide-y divide-gray-50 overflow-hidden">
        {rows.map((r) => (
          <div key={r.label} className="grid grid-cols-[4rem_1fr] gap-3 px-4 py-3 items-center">
            <span className="font-mono font-bold text-indigo-600 text-sm">{r.label}</span>
            <span className="text-sm text-gray-700 break-keep">
              {r.value.replace(/\s*\(확인 필요\)/, "")}
              {r.value.includes("(확인 필요)") && <> <NeedsCheckBadge /></>}
            </span>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-500 break-keep">{market.note}</p>
    </ModuleSection>
  );
}
