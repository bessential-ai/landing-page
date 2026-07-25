// [SCR: R-03] ③ 규제 · 법률 리스크 · scope: P1
// UI 문구에 "우회"/"회피" 사용 금지 — "대응 방안" / "규제 대응 경로"로 통일.
// 각 항목 하단에 법률자문 아님 고지(LegalDisclaimer)를 붙인다.
import { ShieldAlert } from "lucide-react";
import ModuleSection from "@/components/report/ModuleSection";
import LegalDisclaimer from "@/components/report/LegalDisclaimer";
import { getMockReport } from "@/mocks/report";

export default async function RisksPage({ params }: { params: Promise<{ reportId: string }> }) {
  const { reportId } = await params;
  const report = getMockReport(reportId); // TODO(report-api)

  return (
    <ModuleSection id="R-03" sources={report.sources}>
      <p className="text-sm text-gray-500 break-keep -mt-2 mb-2">
        규제를 피하는 방법이 아니라, 정면으로 <b className="text-gray-700">대응하는 경로</b>를 제시합니다.
      </p>
      {report.risks.map((r, i) => (
        <div key={i} className="rounded-xl border border-gray-100 bg-white p-4">
          <div className="flex items-center gap-2 mb-1.5">
            <ShieldAlert size={15} className="text-rose-500 shrink-0" />
            <span className="font-semibold text-gray-900 text-sm">{r.t}</span>
            <span className="ml-auto bg-rose-50 text-rose-600 border border-rose-100 px-1.5 py-0.5 rounded text-[10px] font-mono shrink-0">{r.sev}</span>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed break-keep">{r.d}</p>
          <LegalDisclaimer />
        </div>
      ))}
    </ModuleSection>
  );
}
