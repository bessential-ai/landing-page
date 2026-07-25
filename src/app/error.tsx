// [SCR: S-06] 500 — 예기치 못한 오류 · scope: P1
"use client"; // Next.js: error 바운더리는 반드시 Client Component

import { useEffect } from "react";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    // TODO(error-reporting): 오류 리포팅 서비스로 전송
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center">
      <span className="text-sm font-semibold tracking-wide text-indigo-600">500</span>
      <h1 className="text-2xl font-bold text-gray-900">문제가 발생했습니다</h1>
      <p className="text-sm text-gray-500 break-keep max-w-sm">
        일시적인 오류일 수 있습니다. 잠시 후 다시 시도해 주세요.
      </p>
      <button
        onClick={() => unstable_retry()}
        className="mt-2 text-sm font-medium px-4 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
      >
        다시 시도
      </button>
    </main>
  );
}
