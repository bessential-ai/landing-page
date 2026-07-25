// [SCR: S-04] 사업자정보 표기 · scope: P1
import LegalShell from "@/components/site/LegalShell";
import { businessInfoItems } from "@/config/company";

export default function BusinessInfoPage() {
  const items = businessInfoItems();

  return (
    <LegalShell title="사업자정보">
      <dl className="rounded-2xl border border-gray-100 divide-y divide-gray-50 overflow-hidden">
        {items.map((i) => (
          <div key={i.label} className="grid grid-cols-3 gap-3 px-5 py-4 text-sm">
            <dt className="font-semibold text-gray-500">{i.label}</dt>
            <dd className="col-span-2 text-gray-900 break-all">{i.value}</dd>
          </div>
        ))}
      </dl>
      {/* TODO(company-info): 통신판매업신고번호 · 문의 이메일 확정 후 company.ts 에 채우면 자동 노출 */}
    </LegalShell>
  );
}
