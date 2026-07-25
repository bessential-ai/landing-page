// [SCR: A-03] 약관 동의 — 옵트인 분리 · scope: P1
// 다크패턴 금지: "필수 약관 모두 동의"는 필수 항목만 토글한다. 선택(마케팅)은 절대 일괄 체크하지 않는다.
"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Check } from "lucide-react";
import AuthShell from "@/components/auth/AuthShell";
import { signup } from "@/lib/api/auth";
import { setMockSession } from "@/lib/auth/session";
import { loadSignupDraft, clearSignupDraft } from "@/lib/auth/signup-draft";
import type { ConsentState } from "@/lib/api/types";

interface ConsentItem {
  key: keyof ConsentState;
  label: string;
  required: boolean;
  href?: string;
}

// 필수/선택을 명시적으로 분리한다.
const REQUIRED_ITEMS: ConsentItem[] = [
  { key: "termsOfService", label: "[필수] 이용약관 동의", required: true, href: "/legal/terms" },
  { key: "privacyPolicy", label: "[필수] 개인정보 수집·이용 동의", required: true, href: "/legal/privacy" },
  { key: "age14", label: "[필수] 만 14세 이상입니다", required: true },
];
const OPTIONAL_ITEMS: ConsentItem[] = [
  { key: "marketing", label: "[선택] 마케팅·혜택 알림 수신", required: false },
];

function ConsentInner() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/";

  const [consents, setConsents] = useState<ConsentState>({
    termsOfService: false,
    privacyPolicy: false,
    age14: false,
    marketing: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    // A-02 를 거치지 않고 직접 들어오면 회원가입 폼으로 되돌림
    if (!loadSignupDraft()) router.replace(`/signup?next=${encodeURIComponent(next)}`);
  }, [router, next]);

  const requiredAllChecked = REQUIRED_ITEMS.every((i) => consents[i.key]);

  function toggle(key: keyof ConsentState) {
    setConsents((c) => ({ ...c, [key]: !c[key] }));
  }

  // 필수 항목만 일괄 토글. 선택(마케팅)은 건드리지 않는다.
  function toggleAllRequired() {
    const nextVal = !requiredAllChecked;
    setConsents((c) => ({ ...c, termsOfService: nextVal, privacyPolicy: nextVal, age14: nextVal }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!requiredAllChecked) {
      setError("필수 약관에 모두 동의해야 가입할 수 있습니다.");
      return;
    }
    const draft = loadSignupDraft();
    if (!draft) {
      router.replace(`/signup?next=${encodeURIComponent(next)}`);
      return;
    }
    setPending(true);
    const res = await signup({ ...draft, consents }); // TODO(auth-api)
    setPending(false);
    if (!res.ok) {
      setError(res.error ?? "가입에 실패했습니다.");
      return;
    }
    clearSignupDraft();
    setMockSession();
    router.push(next);
  }

  return (
    <AuthShell title="약관 동의" subtitle="필수 항목과 선택 항목을 나눠서 확인하세요.">
      <form onSubmit={onSubmit} className="space-y-5">
        {/* 필수 약관 모두 동의 — 필수 항목만 토글 */}
        <button
          type="button"
          onClick={toggleAllRequired}
          className={`w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
            requiredAllChecked ? "border-indigo-300 bg-indigo-50/60" : "border-gray-200"
          }`}
        >
          <Box checked={requiredAllChecked} />
          <span className="text-sm font-semibold text-gray-900">필수 약관 모두 동의</span>
        </button>

        <fieldset className="space-y-2.5">
          <legend className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1">필수</legend>
          {REQUIRED_ITEMS.map((i) => (
            <ConsentRow key={i.key} item={i} checked={consents[i.key]} onToggle={() => toggle(i.key)} />
          ))}
        </fieldset>

        <fieldset className="space-y-2.5">
          <legend className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1">선택</legend>
          {OPTIONAL_ITEMS.map((i) => (
            <ConsentRow key={i.key} item={i} checked={consents[i.key]} onToggle={() => toggle(i.key)} />
          ))}
        </fieldset>

        {error && <p className="text-xs text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={pending || !requiredAllChecked}
          className="w-full py-2.5 rounded-full bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {pending ? "가입 처리 중…" : "동의하고 가입 완료"}
        </button>
      </form>
    </AuthShell>
  );
}

export default function ConsentPage() {
  return (
    <Suspense fallback={null}>
      <ConsentInner />
    </Suspense>
  );
}

function ConsentRow({ item, checked, onToggle }: { item: ConsentItem; checked: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <button type="button" onClick={onToggle} className="flex items-center gap-2.5 text-left flex-1">
        <Box checked={checked} />
        <span className="text-sm text-gray-700">{item.label}</span>
      </button>
      {item.href && (
        <Link href={item.href} className="text-[11px] text-gray-400 underline hover:text-gray-700 shrink-0">
          보기
        </Link>
      )}
    </div>
  );
}

function Box({ checked }: { checked: boolean }) {
  return (
    <span
      className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
        checked ? "bg-indigo-600 border-indigo-600 text-white" : "border-gray-300 bg-white"
      }`}
    >
      {checked && <Check size={13} />}
    </span>
  );
}
