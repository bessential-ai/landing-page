// [SCR: P2-STUB] 준비 중 화면 — scope P2 라우트 공용 렌더 (IA-SPEC §0-3, §2 P2 게이트)
// P2 화면은 라우트만 살려두고 이 컴포넌트로 "준비 중"을 렌더한다. 네비게이션에는 노출하지 않는다.
import Link from "next/link";
import { byId } from "@/lib/ia";

export default function ComingSoon({ screenId }: { screenId: string }) {
  const screen = byId(screenId);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center">
      <span className="text-xs font-medium tracking-wide text-indigo-600">
        {screenId} · 2차 범위 (P2)
      </span>
      <h1 className="text-2xl font-bold text-gray-900">
        {screen?.name ?? "준비 중"}
      </h1>
      <p className="text-sm text-gray-500 break-keep max-w-sm">
        이 화면은 2차 범위로, 아직 준비 중입니다.
      </p>
      <Link
        href="/"
        className="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
      >
        홈으로 돌아가기
      </Link>
    </main>
  );
}
