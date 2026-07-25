// [SCR: G-04] 결제 실패 · scope: P1
// 재시도 액션 필수 · 입력값(선택 상품) 보존.
"use client";

import { Suspense, use } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { XCircle, RotateCw } from "lucide-react";
import ReportTopBar from "@/components/report/ReportTopBar";
import { productById } from "@/lib/payment/products";

function FailedInner({ reportId }: { reportId: string }) {
  const params = useSearchParams();
  const product = productById(params.get("product")); // 입력값 보존
  const retryHref = `/checkout/${reportId}/pay?product=${product.id}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <ReportTopBar />
      <main className="max-w-md mx-auto px-4 sm:px-6 py-16 text-center">
        <XCircle className="w-14 h-14 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900">결제가 완료되지 않았어요</h1>
        <p className="text-sm text-gray-500 mt-2 break-keep">
          결제가 취소되었거나 중단됐습니다. <b className="text-gray-700">{product.name} ({product.priceLabel})</b> 선택은 그대로 유지됩니다.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <Link
            href={retryHref}
            className="w-full py-3 rounded-full bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors inline-flex items-center justify-center gap-1.5"
          >
            <RotateCw size={15} /> 다시 결제하기
          </Link>
          <Link href={`/checkout/${reportId}`} className="w-full py-3 rounded-full border border-gray-200 bg-white text-gray-700 text-sm font-semibold hover:border-gray-300 transition-colors">
            상품 다시 선택
          </Link>
        </div>
      </main>
    </div>
  );
}

export default function FailedPage({ params }: { params: Promise<{ reportId: string }> }) {
  const { reportId } = use(params);
  return (
    <Suspense fallback={null}>
      <FailedInner reportId={reportId} />
    </Suspense>
  );
}
