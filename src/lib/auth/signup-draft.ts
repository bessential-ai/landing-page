// [AUTH] 회원가입 임시 드래프트 — A-02(계정 입력) → A-03(약관 동의) 사이 값 전달.
// sessionStorage 사용(민감정보 서버 저장 아님). 실제 가입은 A-03 에서 signup() 스텁 호출.
export interface SignupDraft {
  name: string;
  email: string;
  password: string;
}

const KEY = "be:signup-draft";

export function saveSignupDraft(d: SignupDraft): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(KEY, JSON.stringify(d));
}

export function loadSignupDraft(): SignupDraft | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SignupDraft;
  } catch {
    return null;
  }
}

export function clearSignupDraft(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(KEY);
}
