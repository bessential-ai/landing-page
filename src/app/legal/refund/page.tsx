// [SCR: S-03] 환불정책 · scope: P1
import LegalShell, { LegalPending } from "@/components/site/LegalShell";

export default function RefundPage() {
  return (
    <LegalShell title="환불정책">
      <LegalPending />
    </LegalShell>
  );
}
