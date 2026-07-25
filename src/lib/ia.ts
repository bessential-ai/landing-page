// [SRC: IA MANIFEST] docs/IA-SPEC.md §6 — 라우팅/화면 구조의 단일 소스 오브 트루스.
// 사이트맵·네비·브레드크럼·접근제어·스텁 생성·정합성 검사는 전부 이 파일에서 파생시킨다.
// 화면을 추가/삭제/이동할 때: docs/IA-SPEC.md §1 를 먼저 고치고 → 이 배열을 고치고 → 코드를 고친다.

export type Scope = "P1" | "P2";
export type Group = "A" | "D" | "P" | "F" | "G" | "R" | "V" | "M" | "S" | "T";

export interface Screen {
  id: string; // "P-01"
  group: Group;
  name: string; // "랜딩 — 한 줄 입력"
  path: string; // "/" | "/report/[reportId]/free"
  scope: Scope;
  auth: boolean; // 인증 필요 여부 (IA-SPEC §2 인증 게이트)
  paid: boolean; // 결제 게이트 뒤인지 (IA-SPEC §2 결제 게이트)
}

// 그룹 라벨 (네비/사이트맵 표기용)
export const GROUP_LABEL: Record<Group, string> = {
  A: "계정",
  D: "진단 입력",
  P: "홈 · 공개",
  F: "무료 결과",
  G: "결제 · 프로필",
  R: "유료 리포트",
  V: "재진단",
  M: "마이 페이지",
  S: "정책 · 시스템",
  T: "진척 관리",
};

// IA-SPEC §2 게이트 규칙 적용:
//  - 인증(auth): /diagnose/** 이후 전 구간, /me/**, /checkout/** → D·F·G·R·V·M·T = true
//    (A 계정·P 공개·S 정책은 비인증 접근 가능)
//  - 결제(paid): F-03 페이월 ↔ R-00 허브 사이. R 그룹(R-00~R-12)만 결제 뒤. F 그룹은 무료 노출 한계선.
export const SCREENS: readonly Screen[] = [
  // A — 계정
  { id: "A-01", group: "A", name: "로그인", path: "/login", scope: "P1", auth: false, paid: false },
  { id: "A-02", group: "A", name: "회원가입", path: "/signup", scope: "P1", auth: false, paid: false },
  { id: "A-03", group: "A", name: "약관 동의 — 옵트인 분리", path: "/signup/consent", scope: "P1", auth: false, paid: false },
  { id: "A-04", group: "A", name: "비밀번호 재설정", path: "/reset-password", scope: "P1", auth: false, paid: false },
  { id: "A-05", group: "A", name: "이메일 인증", path: "/verify-email", scope: "P2", auth: false, paid: false },

  // D — 진단 입력 (인증 필요)
  { id: "D-01", group: "D", name: "아이디어 한 줄 입력", path: "/diagnose", scope: "P1", auth: true, paid: false },
  { id: "D-02", group: "D", name: "추출 확인 · 후속 질문", path: "/diagnose/confirm", scope: "P1", auth: true, paid: false },
  { id: "D-03", group: "D", name: "업종 · 규제 선택", path: "/diagnose/industry", scope: "P1", auth: true, paid: false },
  { id: "D-04", group: "D", name: "업종별 조건부", path: "/diagnose/conditions", scope: "P1", auth: true, paid: false },
  { id: "D-05", group: "D", name: "최종 확인", path: "/diagnose/review", scope: "P1", auth: true, paid: false },
  { id: "D-06", group: "D", name: "진단 진행 중", path: "/diagnose/running", scope: "P1", auth: true, paid: false },

  // P — 홈 · 공개
  { id: "P-01", group: "P", name: "랜딩 — 한 줄 입력", path: "/", scope: "P1", auth: false, paid: false },
  { id: "P-02", group: "P", name: "서비스 소개", path: "/about", scope: "P1", auth: false, paid: false },
  { id: "P-03", group: "P", name: "요금제", path: "/pricing", scope: "P1", auth: false, paid: false },
  { id: "P-04", group: "P", name: "샘플 리포트", path: "/sample", scope: "P1", auth: false, paid: false },
  { id: "P-05", group: "P", name: "FAQ · 문의", path: "/faq", scope: "P1", auth: false, paid: false },

  // S — 정책 · 표기 / 시스템
  // ※ S-05(PartialFailure 공용 컴포넌트)·S-06(not-found/error)은 URL 라우트가 아니므로 SCREENS 에 넣지 않는다.
  { id: "S-01", group: "S", name: "이용약관", path: "/legal/terms", scope: "P1", auth: false, paid: false },
  { id: "S-02", group: "S", name: "개인정보처리방침", path: "/legal/privacy", scope: "P1", auth: false, paid: false },
  { id: "S-03", group: "S", name: "환불정책", path: "/legal/refund", scope: "P1", auth: false, paid: false },
  { id: "S-04", group: "S", name: "사업자정보 표기", path: "/legal/business-info", scope: "P1", auth: false, paid: false },
  { id: "S-07", group: "S", name: "점검 안내", path: "/maintenance", scope: "P2", auth: false, paid: false },

  // F — 무료 결과 (인증 필요, 결제 전 무료 노출 한계선)
  { id: "F-01", group: "F", name: "무료 결과 요약", path: "/report/[reportId]/free", scope: "P1", auth: true, paid: false },
  { id: "F-02", group: "F", name: "6축 점수 상세", path: "/report/[reportId]/free/scores", scope: "P1", auth: true, paid: false },
  { id: "F-03", group: "F", name: "페이월", path: "/report/[reportId]/paywall", scope: "P1", auth: true, paid: false },

  // G — 결제 · 프로필 (인증 필요, 결제 진입 구간이므로 paid=false)
  { id: "G-01", group: "G", name: "상품 선택", path: "/checkout/[reportId]", scope: "P1", auth: true, paid: false },
  { id: "G-02", group: "G", name: "결제 (PG)", path: "/checkout/[reportId]/pay", scope: "P1", auth: true, paid: false },
  { id: "G-03", group: "G", name: "결제 완료", path: "/checkout/[reportId]/complete", scope: "P1", auth: true, paid: false },
  { id: "G-04", group: "G", name: "결제 실패", path: "/checkout/[reportId]/failed", scope: "P1", auth: true, paid: false },
  { id: "G-05", group: "G", name: "창업자 프로필 STEP3", path: "/onboarding/profile", scope: "P1", auth: true, paid: false },

  // R — 유료 리포트 (인증 + 결제 게이트 뒤)
  { id: "R-00", group: "R", name: "리포트 허브 — 판정", path: "/report/[reportId]", scope: "P1", auth: true, paid: true },
  { id: "R-01", group: "R", name: "① 장점 · 단점", path: "/report/[reportId]/strengths", scope: "P1", auth: true, paid: true },
  { id: "R-02", group: "R", name: "② 유사 서비스", path: "/report/[reportId]/competitors", scope: "P1", auth: true, paid: true },
  { id: "R-03", group: "R", name: "③ 규제 · 법률 리스크", path: "/report/[reportId]/risks", scope: "P1", auth: true, paid: true },
  { id: "R-04", group: "R", name: "④ 시장 조사", path: "/report/[reportId]/market", scope: "P1", auth: true, paid: true },
  { id: "R-05", group: "R", name: "⑤ 핵심 지표", path: "/report/[reportId]/metrics", scope: "P1", auth: true, paid: true },
  { id: "R-06", group: "R", name: "⑥ 검증 방법", path: "/report/[reportId]/validation", scope: "P1", auth: true, paid: true },
  { id: "R-07", group: "R", name: "⑦ 로드맵 P0~P5", path: "/report/[reportId]/roadmap", scope: "P1", auth: true, paid: true },
  { id: "R-08", group: "R", name: "⑧ 지원사업 매칭", path: "/report/[reportId]/grants", scope: "P1", auth: true, paid: true },
  { id: "R-09", group: "R", name: "⑨ 관련 사례", path: "/report/[reportId]/cases", scope: "P1", auth: true, paid: true },
  { id: "R-10", group: "R", name: "반려 리포트 · 대안", path: "/report/[reportId]/rejected", scope: "P1", auth: true, paid: true },
  { id: "R-11", group: "R", name: "근거 · 출처 상세", path: "/report/[reportId]/sources", scope: "P1", auth: true, paid: true },
  { id: "R-12", group: "R", name: "PDF 출력 · 공유", path: "/report/[reportId]/export", scope: "P1", auth: true, paid: true },

  // V — 재진단 (인증 필요)
  { id: "V-01", group: "V", name: "아이디어 수정", path: "/report/[reportId]/revise", scope: "P1", auth: true, paid: false },
  { id: "V-02", group: "V", name: "버전 비교", path: "/report/[reportId]/compare", scope: "P2", auth: true, paid: false },
  { id: "V-03", group: "V", name: "버전 이력", path: "/report/[reportId]/versions", scope: "P2", auth: true, paid: false },

  // M — 마이 페이지 (인증 필요)
  { id: "M-01", group: "M", name: "내 아이디어 목록", path: "/me/ideas", scope: "P1", auth: true, paid: false },
  { id: "M-02", group: "M", name: "결제 · 영수증", path: "/me/billing", scope: "P1", auth: true, paid: false },
  { id: "M-03", group: "M", name: "프로필 관리", path: "/me/profile", scope: "P2", auth: true, paid: false },
  { id: "M-04", group: "M", name: "동의 · 약관 관리", path: "/me/consents", scope: "P1", auth: true, paid: false },
  { id: "M-05", group: "M", name: "알림 설정", path: "/me/notifications", scope: "P2", auth: true, paid: false },
  { id: "M-06", group: "M", name: "계정 · 탈퇴", path: "/me/account", scope: "P1", auth: true, paid: false },

  // T — 진척 관리 (전체 P2, 인증 필요)
  { id: "T-01", group: "T", name: "로드맵 체크리스트", path: "/me/checklist", scope: "P2", auth: true, paid: false },
  { id: "T-02", group: "T", name: "알림 센터", path: "/me/inbox", scope: "P2", auth: true, paid: false },
];

// ─── 조회 헬퍼 ───────────────────────────────────────────────────────────────

/** 특정 그룹의 화면들 (IA-SPEC §1 표 순서 유지) */
export function byGroup(group: Group): Screen[] {
  return SCREENS.filter((s) => s.group === group);
}

/** 화면 ID 로 단건 조회 */
export function byId(id: string): Screen | undefined {
  return SCREENS.find((s) => s.id === id);
}

/** 라우트 경로로 단건 조회 (동적 세그먼트는 표기 그대로: "/report/[reportId]/free") */
export function byPath(path: string): Screen | undefined {
  return SCREENS.find((s) => s.path === path);
}

/** 이번 범위(P1)만 */
export function p1Only(): Screen[] {
  return SCREENS.filter((s) => s.scope === "P1");
}

/** 2차 범위(P2)만 — 스텁/ComingSoon 대상 */
export function p2Only(): Screen[] {
  return SCREENS.filter((s) => s.scope === "P2");
}

/** 인증 게이트 뒤 화면들 */
export function authScreens(): Screen[] {
  return SCREENS.filter((s) => s.auth);
}

/** 결제 게이트 뒤 화면들 (R 그룹) */
export function paidScreens(): Screen[] {
  return SCREENS.filter((s) => s.paid);
}

// ─── 경로 매칭 (동적 세그먼트 대응) — proxy 게이트/브레드크럼에서 사용 ─────────────

// "/report/[reportId]/free" → /^\/report\/[^/]+\/free$/
const SCREEN_MATCHERS: { screen: Screen; re: RegExp }[] = SCREENS.map((s) => ({
  screen: s,
  re: new RegExp("^" + s.path.replace(/[.*+?^${}()|\\]/g, "\\$&").replace(/\\\[[^\]]+\\\]/g, "[^/]+") + "$"),
}));

/** URL 경로(실제 값)를 매니페스트 화면에 매칭. 예: "/report/abc/free" → F-01 */
export function matchScreen(pathname: string): Screen | undefined {
  return SCREEN_MATCHERS.find((m) => m.re.test(pathname))?.screen;
}
