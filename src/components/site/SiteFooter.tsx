// [COMPONENT] 하위 공개 라우트 공용 푸터.
//  - §3-2 사업자 정보: company.ts 에서 파생, 값이 빈 항목은 렌더하지 않음
//  - §3-5 정책 링크: S-01~S-03 실제 라우트로 연결 (href="#" 금지)
import Link from "next/link";
import { COMPANY, businessInfoItems } from "@/config/company";

const DISCLAIMER =
  "본 서비스는 일반적인 정보와 실행 가이드를 제공하며, 법률·세무·노무 자문이 아닙니다. 법인 설립 절차·비용·세금, 정부지원사업의 요건·금액·일정은 시점에 따라 달라질 수 있어, 진행 전 공식 공고와 전문가(법무사·세무사 등) 확인이 필요합니다.";

export default function SiteFooter() {
  const biz = businessInfoItems();

  return (
    <footer className="w-full border-t border-gray-100 bg-white py-8 text-gray-500 text-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col gap-4">
        <p className="max-w-3xl leading-relaxed break-keep text-[11px] text-gray-400">{DISCLAIMER}</p>
        {biz.length > 0 && (
          <div className="flex flex-wrap gap-x-3 gap-y-1 pt-3 border-t border-gray-50 text-[11px] text-gray-400">
            {biz.map((i) => (
              <span key={i.label}>
                <b className="font-semibold">{i.label}: </b>
                {i.value}
              </span>
            ))}
          </div>
        )}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-3 border-t border-gray-50 gap-2 text-[11px]">
          <span>© {COMPANY.copyrightYear} {COMPANY.serviceName}. All rights reserved.</span>
          <div className="flex gap-4 text-gray-400">
            <Link href="/legal/terms" className="hover:text-gray-900 transition-colors">이용약관</Link>
            <Link href="/legal/privacy" className="hover:text-gray-900 transition-colors">개인정보처리방침</Link>
            <Link href="/legal/refund" className="hover:text-gray-900 transition-colors">환불정책</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
