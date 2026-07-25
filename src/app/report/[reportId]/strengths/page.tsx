// [SCR: R-01] ① 장점 · 단점 · scope: P1
import { ThumbsUp, ThumbsDown } from "lucide-react";
import ModuleSection from "@/components/report/ModuleSection";
import { getMockReport } from "@/mocks/report";

export default async function StrengthsPage({ params }: { params: Promise<{ reportId: string }> }) {
  const { reportId } = await params;
  const report = getMockReport(reportId); // TODO(report-api)

  return (
    <ModuleSection id="R-01" sources={report.sources}>
      <section>
        <h2 className="flex items-center gap-1.5 text-sm font-bold text-emerald-600 mb-3"><ThumbsUp size={15} /> 장점</h2>
        <div className="space-y-3">
          {report.strengths.map((s, i) => (
            <div key={i} className="rounded-xl border border-gray-100 bg-white p-4">
              <div className="font-semibold text-gray-900 text-sm">{s.t}</div>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed break-keep">{s.d}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="pt-2">
        <h2 className="flex items-center gap-1.5 text-sm font-bold text-rose-600 mb-3"><ThumbsDown size={15} /> 단점</h2>
        <div className="space-y-3">
          {report.weaknesses.map((w, i) => (
            <div key={i} className="rounded-xl border border-gray-100 bg-white p-4">
              <div className="font-semibold text-gray-900 text-sm">{w.t}</div>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed break-keep">{w.d}</p>
            </div>
          ))}
        </div>
      </section>
    </ModuleSection>
  );
}
