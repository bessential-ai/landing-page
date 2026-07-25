// [SCR: A-02] 회원가입 · scope: P1
"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import { saveSignupDraft } from "@/lib/auth/signup-draft";

function SignupForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("비밀번호는 8자 이상이어야 합니다.");
      return;
    }
    // 계정 정보는 A-03(약관 동의)로 넘겨 최종 가입 처리한다.
    saveSignupDraft({ name, email, password });
    router.push(`/signup/consent?next=${encodeURIComponent(next)}`);
  }

  return (
    <AuthShell
      title="회원가입"
      subtitle="이메일로 시작하세요. 다음 단계에서 약관에 동의합니다."
      footer={
        <>
          이미 계정이 있으신가요?{" "}
          <Link href={`/login?next=${encodeURIComponent(next)}`} className="text-indigo-600 font-medium hover:text-indigo-700">
            로그인
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="이름 (선택)" type="text" value={name} onChange={setName} autoComplete="name" />
        <Field label="이메일" type="email" value={email} onChange={setEmail} autoComplete="email" required />
        <Field label="비밀번호 (8자 이상)" type="password" value={password} onChange={setPassword} autoComplete="new-password" required />
        {error && <p className="text-xs text-red-600">{error}</p>}
        <button type="submit" className="w-full py-2.5 rounded-full bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors">
          약관 동의로 계속
        </button>
      </form>
    </AuthShell>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupForm />
    </Suspense>
  );
}

function Field({
  label,
  type,
  value,
  onChange,
  autoComplete,
  required,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-gray-600">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        required={required}
        className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200"
      />
    </label>
  );
}
