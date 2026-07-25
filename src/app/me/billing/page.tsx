// [SCR: M-02] 결제 · 영수증 · scope: P1
import { Receipt as ReceiptIcon } from "lucide-react";
import MeShell from "@/components/me/MeShell";
import { MY_RECEIPTS } from "@/mocks/me";

export default function BillingPage() {
  return (
    <MeShell>
      <h1 className="text-xl font-bold text-gray-900 mb-5">결제 · 영수증</h1>

      {MY_RECEIPTS.length === 0 ? (
        <p className="text-sm text-gray-500">결제 내역이 없습니다.</p>
      ) : (
        <div className="rounded-2xl border border-gray-100 bg-white divide-y divide-gray-50 overflow-hidden">
          {MY_RECEIPTS.map((r) => (
            <div key={r.id} className="flex items-center gap-3 px-4 py-4">
              <ReceiptIcon size={18} className="text-gray-300 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900">{r.product}</div>
                <div className="text-[11px] text-gray-400">{r.paidAt} · {r.method} · {r.id}</div>
              </div>
              <div className="text-sm font-bold text-gray-900 shrink-0">{r.amount}</div>
            </div>
          ))}
        </div>
      )}
      {/* TODO(pg-integration): 실제 결제/영수증 발급 연동 */}
    </MeShell>
  );
}
