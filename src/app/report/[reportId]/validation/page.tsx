// [SCR: R-06] ⑥ 검증 방법 · scope: P1
import ModuleSection from "@/components/report/ModuleSection";
import { getMockReport } from "@/mocks/report";

export default async function ValidationPage({ params }: { params: Promise<{ reportId: string }> }) {
  const { reportId } = await params;
  const report = getMockReport(reportId); // TODO(report-api)

  return (
    <ModuleSection id="R-06" sources={report.sources}>
      <p className="text-sm text-gray-500 break-keep -mt-2 mb-2">가장 먼저 깨질 수 있는 가정부터, 어떻게 검증할지와 합격선을 제시합니다.</p>
      {report.validation.map((v, i) => (
        <div key={i} className="rounded-xl border border-gray-100 bg-white p-4">
          <div className="font-semibold text-gray-900 text-sm break-keep">🎯 {v.a}</div>
          <div className="text-xs text-gray-500 mt-1.5"><span className="font-medium text-gray-700">방법:</span> {v.how}</div>
          <div className="text-xs text-indigo-600 mt-0.5"><span className="font-medium text-gray-700">합격선:</span> {v.pass}</div>
        </div>
      ))}
    </ModuleSection>
  );
}
