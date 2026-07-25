// [SCR: R-07] ⑦ 로드맵 P0~P5 · scope: P1
import ModuleSection from "@/components/report/ModuleSection";
import { getMockReport } from "@/mocks/report";

export default async function RoadmapPage({ params }: { params: Promise<{ reportId: string }> }) {
  const { reportId } = await params;
  const report = getMockReport(reportId); // TODO(report-api)

  return (
    <ModuleSection id="R-07" sources={report.sources}>
      <ol className="relative border-l border-gray-200 ml-2 space-y-5">
        {report.roadmap.map((r, i) => (
          <li key={i} className="ml-5">
            <span className="absolute -left-[9px] w-4 h-4 rounded-full bg-indigo-600 border-2 border-white" />
            <div className="flex items-center gap-2">
              <span className="bg-indigo-50 text-indigo-600 text-[10px] font-mono px-1.5 py-0.5 rounded">{r.code}</span>
              <span className="font-bold text-gray-900 text-sm">{r.title}</span>
              <span className="text-[10px] text-gray-400 ml-auto">{r.dur}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1 break-keep">{r.goal}</p>
            <ul className="mt-2 space-y-1 pl-4 list-disc text-[11px] text-gray-500 leading-relaxed break-keep">
              {r.todos.map((t, j) => (
                <li key={j}>{t}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </ModuleSection>
  );
}
