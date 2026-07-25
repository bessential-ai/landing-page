// [SCR: M-06] 계정 · 탈퇴 · scope: P1
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MeShell from "@/components/me/MeShell";
import { clearMockSession } from "@/lib/auth/session";
import { MY_ACCOUNT } from "@/mocks/me";

export default function AccountPage() {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);

  function logout() {
    clearMockSession();
    router.push("/");
  }

  function withdraw() {
    // TODO(auth-api): 실제 탈퇴 처리(데이터 파기 등). 지금은 세션만 정리.
    clearMockSession();
    router.push("/");
  }

  return (
    <MeShell>
      <h1 className="text-xl font-bold text-gray-900 mb-5">계정</h1>

      <div className="rounded-2xl border border-gray-100 bg-white p-5">
        <div className="text-xs text-gray-400">이메일</div>
        <div className="text-sm font-medium text-gray-900 mt-0.5">{MY_ACCOUNT.email}</div>
        <button onClick={logout} className="mt-4 text-sm font-medium text-gray-600 hover:text-gray-900 underline">
          로그아웃
        </button>
      </div>

      {/* 위험 구역 */}
      <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50/40 p-5">
        <h2 className="text-sm font-bold text-rose-700">계정 탈퇴</h2>
        <p className="text-xs text-gray-500 mt-1 break-keep">
          탈퇴하면 리포트·아이디어 등 계정 데이터가 삭제되며 복구할 수 없습니다.
        </p>
        {!confirming ? (
          <button onClick={() => setConfirming(true)} className="mt-3 text-sm font-medium text-rose-600 border border-rose-200 rounded-full px-4 py-2 hover:bg-rose-50">
            계정 탈퇴
          </button>
        ) : (
          <div className="mt-3 flex items-center gap-2">
            <button onClick={withdraw} className="text-sm font-semibold text-white bg-rose-600 rounded-full px-4 py-2 hover:bg-rose-700">
              정말 탈퇴합니다
            </button>
            <button onClick={() => setConfirming(false)} className="text-sm text-gray-500 px-3 py-2 hover:text-gray-800">
              취소
            </button>
          </div>
        )}
      </div>
    </MeShell>
  );
}
