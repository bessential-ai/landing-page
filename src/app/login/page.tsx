// [SCR: A-01] 로그인 · scope: P1
"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import { login } from "@/lib/api/auth";
import { setMockSession } from "@/lib/auth/session";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/"; // 인증 게이트가 붙여준 원래 목적지

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const res = await login({ email, password }); // TODO(auth-api)
    setPending(false);
    if (!res.ok) {
      setError(res.error ?? "로그인에 실패했습니다.");
      return;
    }
    setMockSession();
    router.push(next);
  }

  return (
    <AuthShell
      title="로그인"
      subtitle="아이디어 진단을 이어서 진행하세요."
      footer={
        <>
          계정이 없으신가요?{" "}
          <Link href={`/signup?next=${encodeURIComponent(next)}`} className="text-indigo-600 font-medium hover:text-indigo-700">
            회원가입
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="이메일" type="email" value={email} onChange={setEmail} autoComplete="email" required />
        <Field label="비밀번호" type="password" value={password} onChange={setPassword} autoComplete="current-password" required />
        {error && <p className="text-xs text-red-600">{error}</p>}
        <div className="flex justify-end">
          <Link href="/reset-password" className="text-xs text-gray-500 hover:text-gray-800">비밀번호를 잊으셨나요?</Link>
        </div>
        <button
          type="submit"
          disabled={pending}
          className="w-full py-2.5 rounded-full bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-60"
        >
          {pending ? "로그인 중…" : "로그인"}
        </button>
      </form>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
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
