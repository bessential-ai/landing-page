// [SCR: P-02] 서비스 소개 · scope: P1
import { Check, X } from "lucide-react";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import { features, steps, chatbotComparison, visibleTrustItems } from "@/content/landing";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SiteHeader />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20 space-y-20 sm:space-y-28">
        {/* WHY B ESSENTIAL */}
        <section className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
          <div>
            <span className="text-xs font-semibold tracking-widest text-indigo-600 uppercase">WHY B ESSENTIAL</span>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight text-gray-900 mt-3 sm:mt-5 break-keep">
              '그래서 뭐부터 하지?'에서<br className="hidden sm:inline" /> 멈추지 않도록.
            </h1>
          </div>
          <div className="space-y-4 sm:space-y-5 text-gray-500 text-sm sm:text-base md:text-lg leading-relaxed">
            <p>
              대부분의 창업 도구는 <strong className="text-gray-900 font-semibold">이미 시작한 사람</strong>을 위한 것입니다.
              정작 아이디어만 있는 사람은 첫 발에서 막힙니다.
            </p>
            <p>
              B Essential은 그 0→1 구간을 메웁니다. 흩어진 정보를 검색으로 짜맞추는 대신,
              내 아이디어에 맞는 순서로 진단하고, 해야 할 일을 단계로 정리하고,
              필요한 서류까지 만들어 줍니다.
            </p>
          </div>
        </section>

        {/* WHAT YOU GET — 기능 6개 */}
        <section>
          <div className="text-center mb-8 sm:mb-10">
            <span className="text-xs font-semibold tracking-widest text-indigo-600 uppercase">WHAT YOU GET</span>
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mt-2 sm:mt-3">아이디어를 '실행 가능한 계획'으로</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {features.map((f, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-1.5 sm:mb-2">{f.title}</h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                {f.note && (
                  <span className="inline-block mt-2.5 text-[10px] font-mono text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-0.5">
                    {f.note}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS — 이용 방법 */}
        <section>
          <div className="text-center mb-8 sm:mb-12">
            <span className="text-xs font-semibold tracking-widest text-indigo-600 uppercase">HOW IT WORKS</span>
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mt-2 sm:mt-3 mb-2">입력에서 실행까지, 네 단계</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10">
            {steps.map((s, i) => (
              <div key={i} className="relative flex sm:block items-start gap-4">
                <span className="text-3xl sm:text-4xl font-black text-indigo-500 font-mono leading-none shrink-0">{s.num}</span>
                <div className="relative z-10">
                  <h3 className="font-semibold text-neutral-900 text-sm sm:text-lg sm:mt-1 mb-1 sm:mb-2">{s.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* WHY NOT JUST A CHATBOT — 챗봇 비교 */}
        <section>
          <div className="text-center mb-8 sm:mb-10">
            <span className="text-xs font-semibold tracking-widest text-indigo-600 uppercase">WHY NOT JUST A CHATBOT</span>
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mt-2 sm:mt-3">범용 챗봇으로는 안 됩니다</h2>
            <p className="text-gray-500 text-xs sm:text-base mt-2 px-2">
              내 아이디어에 맞춘 전용 순서·근거·행정 셋업 매핑 뼈대를 구성합니다.
            </p>
          </div>
          <div className="border border-gray-100 rounded-2xl sm:rounded-3xl overflow-hidden bg-white shadow-sm max-w-4xl mx-auto">
            <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-100 font-semibold text-xs sm:text-sm text-gray-700">
              <div className="p-3 sm:p-4 pl-4 sm:pl-6 text-gray-400 font-mono text-[10px] sm:text-xs tracking-wider">기준</div>
              <div className="p-3 sm:p-4 text-gray-500">범용 챗봇</div>
              <div className="p-3 sm:p-4 text-indigo-600 font-bold">B Essential</div>
            </div>
            {chatbotComparison.map((v, i) => (
              <div key={i} className="grid grid-cols-3 border-b border-gray-50 last:border-none text-xs sm:text-sm items-center">
                <div className="p-3 sm:p-4 pl-4 sm:pl-6 font-mono text-[10px] sm:text-xs text-gray-400 font-semibold">{v.axis}</div>
                <div className="p-3 sm:p-4 text-gray-500 flex gap-1 sm:gap-2 items-start break-all">
                  <X size={13} className="mt-0.5 text-gray-300 shrink-0" /> <span className="text-[11px] sm:text-sm">{v.gpt}</span>
                </div>
                <div className="p-4 sm:p-4 text-gray-900 font-medium bg-gradient-to-r from-indigo-50/10 to-purple-50/20 h-full flex gap-1 sm:gap-2 items-center break-all">
                  <Check size={13} className="text-indigo-500 shrink-0" /> <span className="text-[11px] sm:text-sm font-semibold">{v.be}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* WHY YOU CAN TRUST IT — 신뢰 지표 (§3-3: 미확정 플레이스홀더 항목은 렌더하지 않음) */}
        {visibleTrustItems.length > 0 && (
          <section>
            <div className="text-center mb-8 sm:mb-12">
              <span className="text-xs font-semibold tracking-widest text-indigo-600 uppercase">WHY YOU CAN TRUST IT</span>
              <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mt-2 sm:mt-3">왜 믿을 수 있나</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {visibleTrustItems.map((t, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                  <div className="w-9 h-9 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-3">
                    {t.icon}
                  </div>
                  <h4 className="font-bold text-sm sm:text-base text-gray-900">{t.t}</h4>
                  <p className="text-xs text-gray-500 mt-2 leading-relaxed break-keep">{t.d}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
