// [API STUB] 계정(A) — 백엔드 연동 지점. 지금은 UI/상태 전이용 스텁.
// 실제 연동: TODO(auth-api). 여기서는 형태만 맞춘 가짜 응답을 반환한다.
import type { Credentials, SignupInput, User } from "./types";

export interface AuthResult {
  ok: boolean;
  user?: User;
  error?: string;
}

/** 로그인 — TODO(auth-api): 실제 인증 서버 호출로 교체 */
export async function login(creds: Credentials): Promise<AuthResult> {
  await fakeLatency();
  if (!creds.email || !creds.password) {
    return { ok: false, error: "이메일과 비밀번호를 입력해 주세요." };
  }
  return { ok: true, user: { id: "demo", email: creds.email } };
}

/** 회원가입 — TODO(auth-api) */
export async function signup(input: SignupInput): Promise<AuthResult> {
  await fakeLatency();
  const { termsOfService, privacyPolicy, age14 } = input.consents;
  if (!termsOfService || !privacyPolicy || !age14) {
    return { ok: false, error: "필수 약관에 동의해야 가입할 수 있습니다." };
  }
  return { ok: true, user: { id: "demo", email: input.email, name: input.name } };
}

/** 비밀번호 재설정 메일 요청 — TODO(auth-api) */
export async function requestPasswordReset(email: string): Promise<AuthResult> {
  await fakeLatency();
  if (!email) return { ok: false, error: "이메일을 입력해 주세요." };
  return { ok: true };
}

function fakeLatency(ms = 600): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
