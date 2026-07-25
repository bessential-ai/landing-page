// [SCR: P-03] 요금제 · scope: P1
import Link from "next/link";
import { Check } from "lucide-react";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import { prices } from "@/content/landing";

const PRODUCT_URL = "/mockup"; // TODO(cta-rewire): 결제 진입(/checkout) 전환은 Phase 4에서

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SiteHeader />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <div className="text-center mb-8 sm:mb-10">
          <span className="text-xs font-semibold tracking-widest text-indigo-600 uppercase">PRICING</span>
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mt-2 sm:mt-3">구독이 아니라, 아이디어별 결제</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {prices.map((p, i) => (
            <div
              key={i}
              className={`relative flex flex-col rounded-2xl p-5 sm:p-6 bg-white border transition-all duration-200 ${
                p.highlight ? "border-indigo-500 shadow-lg shadow-indigo-100" : "border-gray-100"
              }`}
            >
              {p.tag && (
                <span className="absolute -top-3 left-5 bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
                  {p.tag}
                </span>
              )}
              <div className="font-bold text-gray-900 text-sm sm:text-base">{p.name}</div>
              <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 mt-1 sm:mt-2">{p.price}</div>
              {/* §3-1: 첫 구매 1회 한정 / 묶음 건당 단가 병기 */}
              {p.once && <div className="text-[11px] font-semibold text-indigo-600 mt-1">{p.once}</div>}
              {p.perUnit && <div className="text-[11px] font-semibold text-indigo-600 mt-1">{p.perUnit}</div>}
              <div className="text-[11px] sm:text-xs text-gray-500 mt-1 mb-3.5 leading-tight">{p.note}</div>
              <ul className="space-y-1.5 flex-1 mb-4">
                {p.features.map((f, idx) => (
                  <li key={idx} className="flex gap-2 text-xs text-gray-600">
                    <Check className="text-indigo-500 w-3.5 h-3.5 shrink-0 mt-0.5" /> <span className="break-keep">{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={PRODUCT_URL}
                className={`w-full block text-center py-2 rounded-full text-xs font-semibold transition-colors whitespace-nowrap ${
                  p.highlight
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "border border-gray-200 text-gray-700 hover:border-gray-400"
                }`}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* TODO(pricing-vat): 부가세 포함 여부 문구 — 확정 전까지 표기하지 않음 */}

        {/* 기관 · 팀 제휴 (§3-4 오탈자 수정: "제맹" → "관리") */}
        <div className="mt-6 bg-gray-50 border border-gray-100 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <div className="font-semibold text-xs sm:text-sm">기관 · 팀 제휴</div>
            <p className="text-[11px] sm:text-xs text-gray-500 break-keep">
              대학 창업지원단 · 액셀러레이터 · 지자체 전용 화이트라벨 일괄 관리 대시보드
            </p>
          </div>
          <Link
            href={PRODUCT_URL}
            className="w-full sm:w-auto text-center text-xs font-semibold border border-gray-300 rounded-full px-4 py-1.5 shrink-0 whitespace-nowrap bg-white hover:bg-gray-50"
          >
            도입 문의
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
