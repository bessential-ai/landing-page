// [SCR: F-03] 페이월 · scope: P1
// 잠긴 콘텐츠를 숨기지 않는다 — 흐림 + 잠금 배지 + "안에 무엇이 있는지" 요약으로 보여준다.
import Link from "next/link";
import { Lock, Check, ArrowRight } from "lucide-react";
import ReportTopBar from "@/components/report/ReportTopBar";
import { getMockReport } from "@/mocks/report";
import { byGroup } from "@/lib/ia";

export default async function PaywallPage({ params }: { params: Promise<{ reportId: string }> }) {
  const { reportId } = await params;
  const report = getMockReport(reportId); // TODO(report-api)

  // "안에 무엇이 있는지" — 잠긴 R 모듈 목록을 매니페스트에서 파생 (하드코딩 금지)
  const lockedModules = byGroup("R").filter((s) => /^R-0[1-9]$/.test(s.id));

  return (
    <div className="min-h-screen bg-gray-50">
      <ReportTopBar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <span className="text-xs font-semibold tracking-widest text-indigo-600 uppercase">전체 리포트</span>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2 mb-1">
          점수 {report.score}점 — 나머지는 ‘무엇을, 어떻게’입니다
        </h1>
        <p className="text-sm text-gray-500 break-keep">강점·단점, 규제 대응, 시장, 로드맵, 산출물까지 전체가 잠겨 있습니다.</p>

        {/* 잠긴 콘텐츠 미리보기 — 숨기지 않고 흐림 처리 */}
        <div className="relative mt-6 rounded-2xl border border-gray-100 bg-white overflow-hidden">
          <div className="p-5 sm:p-6 space-y-3 blur-[5px] select-none pointer-events-none" aria-hidden>
            {report.strengths.map((s, i) => (
              <div key={i}>
                <div className="font-semibold text-gray-900 text-sm">{s.t}</div>
                <p className="text-xs text-gray-500 break-keep">{s.d}</p>
              </div>
            ))}
          </div>
          <div className="absolute inset-0 flex items-center justify-center bg-white/40">
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm">
              <Lock size={15} /> 결제 후 열람
            </span>
          </div>
        </div>

        {/* 안에 무엇이 있는지 */}
        <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-5 sm:p-6">
          <h2 className="text-sm font-bold text-gray-900 mb-3">전체 리포트에 들어있는 것</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
            {lockedModules.map((m) => (
              <li key={m.id} className="flex items-center gap-2 text-sm text-gray-600">
                <Check size={14} className="text-indigo-500 shrink-0" />
                {m.name}
              </li>
            ))}
          </ul>
        </div>

        {/* 가격 · CTA */}
        <div className="mt-6 rounded-2xl border border-indigo-200 bg-indigo-50/50 p-5 sm:p-6 text-center">
          <div className="text-3xl font-extrabold text-gray-900">
            990원 <span className="text-sm font-medium text-indigo-600">· 첫 구매 계정당 1회 한정</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">이후 재구매 3,900원 · 묶음 3건 9,900원(건당 3,300원)</p>
          <Link
            href={`/checkout/${reportId}`}
            className="mt-4 inline-flex items-center justify-center gap-1.5 w-full sm:w-auto px-8 py-3 rounded-full bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
          >
            잠금 해제하고 전체 보기 <ArrowRight size={16} />
          </Link>
        </div>
      </main>
    </div>
  );
}
