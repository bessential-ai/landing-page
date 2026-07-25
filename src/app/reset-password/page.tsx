// [SCR: A-04] 비밀번호 재설정 · scope: P1
"use client";

import { useState } from "react";
import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";
import { requestPasswordReset } from "@/lib/api/auth";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const res = await requestPasswordReset(email); // TODO(auth-api)
    setPending(false);
    if (!res.ok) {
      setError(res.error ?? "요청에 실패했습니다.");
      return;
    }
    setSent(true);
  }

  return (
    <AuthShell
      title="비밀번호 재설정"
      subtitle={sent ? undefined : "가입한 이메일로 재설정 링크를 보내드립니다."}
      footer={
        <Link href="/login" className="text-indigo-600 font-medium hover:text-indigo-700">
          로그인으로 돌아가기
        </Link>
      }
    >
      {sent ? (
        <p className="text-sm text-gray-600 leading-relaxed break-keep">
          <b className="text-gray-900">{email}</b> 주소로 재설정 안내를 보냈습니다. 메일함을 확인해 주세요.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block">
            <span className="text-xs font-medium text-gray-600">이메일</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200"
            />
          </label>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={pending}
            className="w-full py-2.5 rounded-full bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-60"
          >
            {pending ? "전송 중…" : "재설정 링크 보내기"}
          </button>
        </form>
      )}
    </AuthShell>
  );
}
