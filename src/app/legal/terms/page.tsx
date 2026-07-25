// [SCR: S-01] 이용약관 · scope: P1
import LegalShell, { LegalPending } from "@/components/site/LegalShell";

export default function TermsPage() {
  return (
    <LegalShell title="이용약관">
      <LegalPending />
    </LegalShell>
  );
}
