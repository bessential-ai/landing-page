// [SCR: G-02] 결제 (PG) · scope: P1
// 실제 PG 연동 금지 — UI 와 상태 전이(pending → success/fail)만. 연동 지점은 TODO(pg-integration).
"use client";

import { Suspense, use, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ReportTopBar from "@/components/report/ReportTopBar";
import { productById } from "@/lib/payment/products";

type PayState = "idle" | "pending";

function PayInner({ reportId }: { reportId: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const product = productById(params.get("product"));
  const [state, setState] = useState<PayState>("idle");
  const [method, setMethod] = useState("card");

  // TODO(pg-integration): 실제 PG SDK 호출로 교체. 지금은 상태 전이만 시뮬레이션.
  function pay(outcome: "success" | "fail") {
    setState("pending");
    setTimeout(() => {
      const q = `?product=${product.id}`;
      router.replace(outcome === "success" ? `/checkout/${reportId}/complete${q}` : `/checkout/${reportId}/failed${q}`);
    }, 1500);
  }

  const methods = [
    { id: "card", label: "신용/체크카드" },
    { id: "kakao", label: "카카오페이" },
    { id: "toss", label: "토스페이" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <ReportTopBar />
      <main className="max-w-md mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <span className="text-xs font-semibold tracking-widest text-indigo-600 uppercase">결제</span>
        <h1 className="text-2xl font-bold text-gray-900 mt-2 mb-6">결제 진행</h1>

        <div className="rounded-2xl border border-gray-100 bg-white p-5">
          <div className="flex items-center justify-between pb-4 border-b border-gray-50">
            <span className="text-sm text-gray-500">{product.name}</span>
            <span className="text-lg font-extrabold text-gray-900">{product.priceLabel}</span>
          </div>

          <fieldset className="mt-4 space-y-2" disabled={state === "pending"}>
            <legend className="text-xs font-medium text-gray-500 mb-1">결제 수단</legend>
            {methods.map((m) => (
              <label key={m.id} className={`flex items-center gap-2.5 rounded-xl border px-4 py-3 cursor-pointer ${method === m.id ? "border-indigo-400 bg-indigo-50/50" : "border-gray-200"}`}>
                <input type="radio" name="method" checked={method === m.id} onChange={() => setMethod(m.id)} className="accent-indigo-600" />
                <span className="text-sm text-gray-800">{m.label}</span>
              </label>
            ))}
          </fieldset>

          <button
            onClick={() => pay("success")}
            disabled={state === "pending"}
            className="w-full mt-5 py-3 rounded-full bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-60"
          >
            {state === "pending" ? "결제 처리 중…" : `${product.priceLabel} 결제하기`}
          </button>

          {/* 데모: 실패 상태 전이 확인용 (실제 연동 시 제거) */}
          <button
            onClick={() => pay("fail")}
            disabled={state === "pending"}
            className="w-full mt-2 py-2 text-xs text-gray-400 hover:text-gray-600 disabled:opacity-60"
          >
            결제 실패 시뮬레이션
          </button>
        </div>
        <p className="text-[11px] text-gray-400 mt-3 text-center">TODO(pg-integration): 실제 결제 연동 예정 · 지금은 데모입니다.</p>
      </main>
    </div>
  );
}

export default function PayPage({ params }: { params: Promise<{ reportId: string }> }) {
  const { reportId } = use(params);
  return (
    <Suspense fallback={null}>
      <PayInner reportId={reportId} />
    </Suspense>
  );
}
