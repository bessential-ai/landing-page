// [MOCK] 리포트 목 데이터 — F 그룹/R 그룹 렌더용. 실제 API 는 TODO(report-api).
// 축 개수 등은 배열 길이로 렌더한다(하드코딩 금지). Phase 5 에서 R 모듈 필드를 확장한다.

export interface Axis {
  label: string;
  score: number;
  note: string;
}

export interface Source {
  title: string;
  publisher: string;
  checkedAt: string; // 확인일 (YYYY-MM-DD)
  url?: string;
  needsCheck?: boolean; // (확인 필요) 배지
}

export interface MockReport {
  id: string;
  idea: string;
  score: number; // 0~100 종합
  verdict: string;
  rejected: boolean; // R-10 반려 분기 여부
  summary: { k: string; v: string }[];
  axes: Axis[]; // 6축 (배열 길이로 렌더)
  strengths: { t: string; d: string }[];
  weaknesses: { t: string; d: string }[];
  competitors: { name: string; note: string }[];
  risks: { t: string; sev: string; d: string }[]; // R-03 (문구에 "우회/회피" 금지)
  market: { tam: string; sam: string; som: string; note: string };
  metrics: { label: string; value: string; note: string }[];
  validation: { a: string; how: string; pass: string }[];
  roadmap: { code: string; title: string; dur: string; goal: string; todos: string[] }[];
  grants: { name: string; org: string; fit: string; note: string }[];
  cases: { name: string; note: string }[];
  sources: Source[];
}

const DEMO: MockReport = {
  id: "demo",
  idea: "경도인지장애 부모를 둔 보호자를 위해, 보호자 목소리로 AI가 매일 안부 전화를 걸어 복약·식사·컨디션을 확인하고 보호자 앱에 기록·알림해 주는 서비스",
  score: 72,
  verdict:
    "수요와 명분은 강하고, 규제·검증이 관문인 유형입니다. 가장 낮은 규제 축을 서비스 설계로 통제하는 것이 전체 점수를 끌어올리는 핵심 변수입니다.",
  rejected: false,
  summary: [
    { k: "한 줄 정의", v: "경도인지장애 노인을 둔 비동거 보호자를 위한 AI 음성 케어콜." },
    { k: "해결 문제", v: "비동거 자녀가 부모의 일상을 매일 확인하기 어렵고 변화 추세를 놓침." },
    { k: "1차 고객", v: "부모와 떨어져 사는 40~60대 자녀." },
    { k: "핵심 가치", v: "부모가 거부감 없이 받는 익숙한 목소리로 꾸준한 확인·기록·이상 신호 조기 포착." },
    { k: "수익 모델", v: "B2C 월 구독 + 기관 B2B 좌석제 + 통신사 제휴 수수료." },
  ],
  axes: [
    { label: "문제 정의·수요", score: 82, note: "초고령사회·MCI 증가 + 비동거 돌봄 공백." },
    { label: "솔루션 차별성", score: 68, note: "보호자 목소리·MCI 특화가 차별점이나 모방 장벽은 낮음." },
    { label: "기술 실현성", score: 74, note: "STT·TTS·LLM은 성숙. 노인 발화 인식·환각 통제가 난점." },
    { label: "규제·인허가", score: 58, note: "의료기기 경계·건강 민감정보·음성합성 윤리가 얽힘." },
    { label: "수익모델·단위경제", score: 70, note: "구독 단가 대비 통신·LLM·음성합성 원가 검증 필요." },
    { label: "팀·실행력", score: 76, note: "임상 자문은 강한 신뢰 자산. 개발 1인 의존이 리스크." },
  ],
  strengths: [
    { t: "명확하고 우상향하는 수요", d: "초고령사회 진입·MCI 인구 증가와 비동거 돌봄의 구조적 증가가 맞물립니다." },
    { t: "임상 신뢰 자산", d: "임상 자문은 의학적 타당성·채널 진입·투자 신뢰도에서 강한 출발점입니다." },
    { t: "정서적 차별화 — 익숙한 목소리", d: "보호자 본인 목소리는 응답률·지속률을 끌어올리는 정서적 훅입니다." },
  ],
  weaknesses: [
    { t: "낮은 기술 모방 장벽", d: "케어콜 자체는 경쟁이 존재하고 핵심 기술의 진입장벽이 높지 않습니다." },
    { t: "1인 개발 의존", d: "초기 실행이 소수 인력에 집중돼 있어 지속성 리스크가 있습니다." },
  ],
  competitors: [
    { name: "일반 AI 케어콜", note: "기계음·범용 안부 전화. MCI 특화·보호자 음성 부재." },
    { name: "시니어 돌봄 앱", note: "기록 중심, 능동적 매일 확인 루프는 약함." },
  ],
  risks: [
    { t: "의료기기·의료행위 경계", sev: "高", d: "‘확인·알림’이 의료 모니터링으로 해석될 소지. 대응 방안: 비의료 건강관리로 포지셔닝, 기능·문구를 ‘확인·기록·전달’로 한정, 식약처 분류 확인 + 법무 검토." },
    { t: "건강 민감정보 처리", sev: "高", d: "민감정보이며 당사자 동의능력 이슈. 대응 방안: 보호자·대리 동의 구조, 최소수집·암호화·보관기간·파기 정책 문서화." },
    { t: "음성 합성 윤리·악용", sev: "중~高", d: "음성권·딥보이스 악용 우려. 대응 방안: 본인 인증 기반 등록·합성 동의, AI 안내 고지, 무단합성 방지·로깅." },
  ],
  market: {
    tam: "국내 65세 이상 약 900만 명 (확인 필요)",
    sam: "MCI·비동거 돌봄 가구 (확인 필요)",
    som: "초기 목표: 수도권 유료 전환 가구",
    note: "시장 수치는 공식 통계 확인일 기준이며 변동될 수 있습니다.",
  },
  metrics: [
    { label: "월 구독 전환율", value: "목표 8~12%", note: "무료 체험 → 유료 (초기 가정)" },
    { label: "2주 지속률", value: "목표 50%+", note: "피보호자 응답 지속" },
    { label: "월 이탈률", value: "목표 5% 이하", note: "돌봄 신뢰 형성 시" },
  ],
  validation: [
    { a: "보호자가 월 구독료를 낼 만큼 통증이 크다", how: "보호자 10~15명 인터뷰 + 가격 민감도", pass: "5명+ ‘유료라도 쓰겠다’" },
    { a: "피보호자가 AI 전화를 받고 지속한다", how: "5~10가구 2주 파일럿", pass: "응답률 60%+ / 지속률 50%+" },
  ],
  roadmap: [
    { code: "P0", title: "아이디어 검증", dur: "2~4주", goal: "돈 낼 보호자가 있는지 확인", todos: ["보호자 인터뷰 10~15명", "경쟁·대안 5종 매핑", "린 캔버스 작성"] },
    { code: "P1", title: "사업형태·행정 셋업", dur: "2~4주", goal: "법적 실체 + 규제 포지셔닝", todos: ["개인 vs 법인 결정", "의료기기/비의료 경계 자가진단 + 법무 검토"] },
    { code: "P2", title: "MVP", dur: "6~10주", goal: "핵심 케어콜 루프", todos: ["1일 1회 통화→확인→앱 기록 고정", "응급 자동판단 배제 로직"] },
  ],
  grants: [
    { name: "예비창업패키지", org: "중소벤처기업부", fit: "예비창업자", note: "요건·일정 변동 · 확인 필요" },
    { name: "초기창업패키지", org: "창업진흥원", fit: "3년 이내 초기 창업", note: "요건·일정 변동 · 확인 필요" },
  ],
  cases: [
    { name: "해외 시니어 AI 케어콜", note: "지역 밀착·기관 채널로 성장한 참고 사례." },
    { name: "국내 비대면 돌봄 파일럿", note: "지자체 협업 구조 참고." },
  ],
  sources: [
    { title: "고령인구 통계", publisher: "통계청", checkedAt: "2026-07-01", needsCheck: true },
    { title: "비의료 건강관리 서비스 가이드라인", publisher: "보건복지부", checkedAt: "2026-07-01" },
  ],
};

/** reportId 로 목 리포트 조회. 지금은 모두 데모 리포트를 반환. TODO(report-api). */
export function getMockReport(reportId: string): MockReport {
  return { ...DEMO, id: reportId };
}
