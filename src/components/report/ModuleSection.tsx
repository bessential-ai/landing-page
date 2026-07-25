// [COMPONENT] 리포트 모듈 콘텐츠 공용 래퍼 — 제목(ia.ts 파생) + 본문 + 출처 슬롯.
import type { ReactNode } from "react";
import { byId } from "@/lib/ia";
import SourceSlot from "./SourceSlot";
import type { Source } from "@/mocks/report";

export default function ModuleSection({
  id,
  children,
  sources,
}: {
  id: string;
  children: ReactNode;
  sources?: Source[];
}) {
  const name = byId(id)?.name ?? "";
  return (
    <article>
      <span className="text-xs font-semibold tracking-widest text-indigo-600 uppercase">{id}</span>
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1.5 mb-6 break-keep">{name}</h1>
      <div className="space-y-4">{children}</div>
      {sources && <SourceSlot sources={sources} />}
    </article>
  );
}
