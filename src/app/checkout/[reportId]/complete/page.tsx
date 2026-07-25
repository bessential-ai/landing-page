// [SCR: G-03] 결제 완료 · scope: P1
"use client";

import { Suspense, use, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import ReportTopBar from "@/components/report/ReportTopBar";
import { markPaid } from "@/lib/payment/status";

function CompleteInner({ reportId }: { reportId: string }) {
  // 결제 완료 표시 → 결제 게이트 통과 (TODO(pg-integration): 서버 확인으로 교체)
  useEffect(() => {
    markPaid(reportId);
  }, [reportId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <ReportTopBar />
      <main className="max-w-md mx-auto px-4 sm:px-6 py-16 text-center">
        <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900">결제가 완료됐어요</h1>
        <p className="text-sm text-gray-500 mt-2 break-keep">전체 리포트가 잠금 해제됐습니다. 마지막으로 창업자 프로필만 확인할게요.</p>

        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/onboarding/profile"
            className="w-full py-3 rounded-full bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors inline-flex items-center justify-center gap-1.5"
          >
            창업자 프로필 작성 (STEP 3) <ArrowRight size={16} />
          </Link>
          <Link href={`/report/${reportId}`} className="w-full py-3 rounded-full border border-gray-200 bg-white text-gray-700 text-sm font-semibold hover:border-gray-300 transition-colors">
            바로 리포트 보기
          </Link>
        </div>
      </main>
    </div>
  );
}

export default function CompletePage({ params }: { params: Promise<{ reportId: string }> }) {
  const { reportId } = use(params);
  return (
    <Suspense fallback={null}>
      <CompleteInner reportId={reportId} />
    </Suspense>
  );
}
