// [API STUB] 백엔드 연동 전 공용 타입. 실제 연동은 각 스텁 함수의 TODO 참고.
// 이 파일은 타입만 정의한다.

export interface User {
  id: string;
  email: string;
  name?: string;
}

// ── 계정(A) ──
export interface Credentials {
  email: string;
  password: string;
}

export interface SignupInput extends Credentials {
  name?: string;
  consents: ConsentState;
}

// A-03 약관 동의 — 필수/선택 분리 (다크패턴 금지: 전체동의가 선택 항목까지 강제하지 않음)
export interface ConsentState {
  termsOfService: boolean; // [필수] 이용약관
  privacyPolicy: boolean; // [필수] 개인정보 수집·이용
  age14: boolean; // [필수] 만 14세 이상
  marketing: boolean; // [선택] 마케팅·혜택 알림
}

export const REQUIRED_CONSENT_KEYS = ["termsOfService", "privacyPolicy", "age14"] as const;
export const OPTIONAL_CONSENT_KEYS = ["marketing"] as const;

// ── 진단(D) ──
export type IndustryKey = "medical" | "commerce" | "fintech" | "education" | "other";

export interface Industry {
  key: IndustryKey;
  label: string;
  /** 규제 민감 업종인지 — D-04 조건부 질문 분기의 힌트 */
  regulated: boolean;
}

// D-02: AI가 아이디어를 이해한 결과. 사용자가 확인/수정한다(단순 confirm 아님).
export interface ExtractedIdea {
  oneLiner: string;
  problem: string;
  customer: string;
  solution: string;
  revenue: string;
}

export interface DiagnoseDraft {
  idea: string; // D-01 한 줄 입력
  extracted?: ExtractedIdea; // D-02 확인·수정 결과
  industry?: IndustryKey; // D-03
  regulated?: boolean; // D-03
  conditions?: Record<string, string>; // D-04 업종별 조건부 답변
  confirmed?: boolean; // D-05 최종 확인
}
