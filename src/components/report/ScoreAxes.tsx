// [COMPONENT] 6축 점수 렌더 — 축 개수를 하드코딩하지 않고 배열 길이로 렌더한다(IA-SPEC §4).
import type { Axis } from "@/mocks/report";

export default function ScoreAxes({ axes, showNotes = false }: { axes: Axis[]; showNotes?: boolean }) {
  return (
    <div className="space-y-3">
      {axes.map((a, i) => (
        <div key={i}>
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-sm text-gray-700">{a.label}</span>
            <span className="text-sm font-mono font-semibold text-gray-900">{a.score}</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${a.score}%` }} />
          </div>
          {showNotes && <p className="text-xs text-gray-500 mt-1 break-keep">{a.note}</p>}
        </div>
      ))}
    </div>
  );
}
