// [SCR: S-02] 개인정보처리방침 · scope: P1
import LegalShell, { LegalPending } from "@/components/site/LegalShell";

export default function PrivacyPage() {
  return (
    <LegalShell title="개인정보처리방침">
      <LegalPending />
    </LegalShell>
  );
}
