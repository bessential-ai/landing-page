// [SCR: P-05] FAQ · 문의 · scope: P1
"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import { faqs } from "@/content/landing";
import { COMPANY } from "@/config/company";

export default function FaqPage() {
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SiteHeader />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <div className="text-center mb-8 sm:mb-10">
          <span className="text-xs font-semibold tracking-widest text-indigo-600 uppercase">FAQ</span>
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mt-2 sm:mt-3">결제 전에, 궁금한 것들</h1>
        </div>

        <div className="space-y-2.5">
          {faqs.map((f, i) => {
            const isOpen = openFaqIdx === i;
            return (
              <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 shadow-sm">
                <button
                  onClick={() => setOpenFaqIdx(isOpen ? null : i)}
                  className="w-full flex justify-between items-center p-3.5 font-semibold text-xs sm:text-sm text-left text-gray-800 hover:bg-gray-50/60 transition-colors select-none focus:outline-none gap-2 bg-transparent border-none"
                >
                  <span className="break-keep">{f.q}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-indigo-600" : ""}`} />
                </button>
                <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                  <div className="overflow-hidden">
                    <div className="p-4 pt-0 text-[11px] sm:text-xs text-gray-500 leading-relaxed border-t border-gray-50/50 bg-gray-50/20 break-keep">
                      {f.a}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 문의 */}
        <section className="mt-12 border-t border-gray-100 pt-8 text-center">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">더 궁금한 점이 있나요?</h2>
          {COMPANY.inquiryEmail ? (
            <p className="text-sm text-gray-500 mt-2">
              문의: <a href={`mailto:${COMPANY.inquiryEmail}`} className="text-indigo-600 hover:text-indigo-700 font-medium">{COMPANY.inquiryEmail}</a>
            </p>
          ) : (
            // TODO(company-info): 문의 이메일 확정 후 노출
            <p className="text-sm text-gray-400 mt-2">문의 창구를 준비하고 있습니다.</p>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
