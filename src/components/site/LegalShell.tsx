// [COMPONENT] 정책 페이지 공용 셸 (S-01~S-04). 상단바 + 제목 + 본문 + 푸터.
import type { ReactNode } from "react";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";

export default function LegalShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <SiteHeader />
      <main className="max-w-3xl w-full mx-auto px-4 sm:px-6 py-14 sm:py-20 flex-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">{title}</h1>
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}

/** S-01~S-03: 법정 원문이 확정되지 않은 정책 페이지의 공용 안내. 원문을 임의로 작성하지 않는다. */
export function LegalPending() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-6 sm:p-8">
      <p className="text-sm text-gray-500 leading-relaxed break-keep">
        원문을 준비하고 있습니다. 확정된 정식 문구는 곧 이 페이지에 게시됩니다.
      </p>
      {/* TODO(legal-copy): 법정 원문 확정 후 삽입. 임의로 법적 문구를 작성하지 않는다. */}
    </div>
  );
}
