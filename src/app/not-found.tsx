// [SCR: S-06] 404 — 페이지를 찾을 수 없음 · scope: P1
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center">
      <span className="text-sm font-semibold tracking-wide text-indigo-600">404</span>
      <h1 className="text-2xl font-bold text-gray-900">페이지를 찾을 수 없습니다</h1>
      <p className="text-sm text-gray-500 break-keep max-w-sm">
        주소가 바뀌었거나 삭제된 페이지일 수 있습니다.
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
