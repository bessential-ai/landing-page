// [SCR: G-01] 상품 선택 · scope: P1
"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import ReportTopBar from "@/components/report/ReportTopBar";
import { PRODUCTS, type Product } from "@/lib/payment/products";

export default function CheckoutSelectPage({ params }: { params: Promise<{ reportId: string }> }) {
  const { reportId } = use(params);
  const router = useRouter();
  const [selected, setSelected] = useState<Product["id"]>("first");

  function onContinue() {
    router.push(`/checkout/${reportId}/pay?product=${selected}`);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ReportTopBar />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <span className="text-xs font-semibold tracking-widest text-indigo-600 uppercase">상품 선택</span>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2 mb-6">어떤 상품으로 진행할까요?</h1>

        {/* 가격 사다리: 990 → 3,900 → 9,900(건당 3,300 병기) */}
        <div className="space-y-3">
          {PRODUCTS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelected(p.id)}
              className={`w-full flex items-center gap-3 rounded-2xl border px-5 py-4 text-left transition-colors ${
                selected === p.id ? "border-indigo-400 bg-indigo-50/60" : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <span className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${selected === p.id ? "bg-indigo-600 border-indigo-600 text-white" : "border-gray-300"}`}>
                {selected === p.id && <Check size={12} />}
              </span>
              <span className="flex-1">
                <span className="flex items-baseline gap-2">
                  <span className="font-semibold text-gray-900">{p.name}</span>
                  {p.once && <span className="text-[11px] font-medium text-indigo-600">{p.once}</span>}
                </span>
                <span className="text-xs text-gray-500">{p.note}</span>
              </span>
              <span className="text-right shrink-0">
                <span className="block font-extrabold text-gray-900">{p.priceLabel}</span>
                {p.perUnit && <span className="block text-[11px] text-indigo-600 font-medium">{p.perUnit}</span>}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={onContinue}
          className="w-full mt-6 py-3 rounded-full bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors inline-flex items-center justify-center gap-1.5"
        >
          결제로 이동 <ArrowRight size={16} />
        </button>
      </main>
    </div>
  );
}
