// [PAYMENT] 목 결제 상태 — 결제 게이트 동작 확인용. 실제 결제/영수증은 TODO(pg-integration).
// be_paid 쿠키에 결제 완료한 reportId 를 콤마로 누적한다.
export const PAID_COOKIE = "be_paid";

function readIds(): string[] {
  if (typeof document === "undefined") return [];
  const entry = document.cookie.split("; ").find((c) => c.startsWith(`${PAID_COOKIE}=`));
  if (!entry) return [];
  return decodeURIComponent(entry.split("=")[1] || "").split(",").filter(Boolean);
}

function writeIds(ids: string[]): void {
  if (typeof document === "undefined") return;
  const value = encodeURIComponent(Array.from(new Set(ids)).join(","));
  document.cookie = `${PAID_COOKIE}=${value}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
}

/** 결제 완료 표시 (G-03). TODO(pg-integration): 서버 결제 확인으로 교체. */
export function markPaid(reportId: string): void {
  writeIds([...readIds(), reportId]);
}

/** 클라이언트에서 결제 여부 확인. */
export function isPaidClient(reportId: string): boolean {
  return readIds().includes(reportId);
}
