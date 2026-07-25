// [AUTH] 목(mock) 세션 — 백엔드 연동 전 인증 게이트 동작 확인용.
// 실제 세션/토큰은 TODO(auth-api). 지금은 쿠키 존재 여부로만 로그인 상태를 판정한다.

export const SESSION_COOKIE = "be_session";

/** 클라이언트에서 목 로그인 상태를 심는다 (로그인/회원가입 성공 시 호출). */
export function setMockSession(): void {
  if (typeof document === "undefined") return;
  // TODO(auth-api): 실제로는 서버가 HttpOnly 세션 쿠키를 내려준다. 여기서는 데모용 쿠키만.
  document.cookie = `${SESSION_COOKIE}=1; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;
}

/** 클라이언트에서 목 세션을 제거한다 (로그아웃/탈퇴 시). */
export function clearMockSession(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0; samesite=lax`;
}

/** 클라이언트에서 로그인 여부 확인. */
export function hasMockSession(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.split("; ").some((c) => c.startsWith(`${SESSION_COOKIE}=`) && c.split("=")[1]);
}
