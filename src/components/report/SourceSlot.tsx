// [COMPONENT] 출처·확인일 표기 슬롯 — 모든 리포트 모듈 하단 공통.
import { ExternalLink } from "lucide-react";
import type { Source } from "@/mocks/report";
import NeedsCheckBadge from "./NeedsCheckBadge";

export default function SourceSlot({ sources }: { sources: Source[] }) {
  if (!sources || sources.length === 0) return null;
  return (
    <div className="mt-6 pt-4 border-t border-gray-100">
      <h4 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">출처 · 확인일</h4>
      <ul className="space-y-1.5">
        {sources.map((s, i) => (
          <li key={i} className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
            <span className="text-gray-700">{s.title}</span>
            <span className="text-gray-400">· {s.publisher}</span>
            <span className="text-gray-400 font-mono">· {s.checkedAt} 확인</span>
            {s.needsCheck && <NeedsCheckBadge />}
            {s.url && (
              <a href={s.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-0.5 text-indigo-500 hover:text-indigo-700">
                <ExternalLink size={11} /> 원문
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
