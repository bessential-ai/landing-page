// [API STUB] 진단(D) — 백엔드/AI 연동 지점. 지금은 UI/상태 전이용 스텁.
// 실제 연동: TODO(diagnose-api), TODO(ai-extract), TODO(industry-questions).
import type { DiagnoseDraft, ExtractedIdea, Industry, IndustryKey } from "./types";

// D-03 업종 목록 (규제 민감 여부 포함) — TODO(industry-questions): 조건부 질문셋과 연동
export const INDUSTRIES: Industry[] = [
  { key: "medical", label: "의료 · 헬스케어", regulated: true },
  { key: "fintech", label: "핀테크 · 금융", regulated: true },
  { key: "commerce", label: "커머스 · 플랫폼", regulated: true },
  { key: "education", label: "교육", regulated: false },
  { key: "other", label: "기타", regulated: false },
];

// D-04 조건부 질문 — 업종에 따라 달라진다. 구조만 잡고 실제 질문셋은 TODO.
export interface ConditionQuestion {
  id: string;
  label: string;
  options: string[];
}

// TODO(industry-questions): 업종별 실제 질문셋으로 교체. 지금은 분기 구조 예시만.
const CONDITION_QUESTIONS: Record<IndustryKey, ConditionQuestion[]> = {
  medical: [
    { id: "device", label: "의료기기(SaMD)에 해당할 소지가 있나요?", options: ["예", "아니오", "잘 모름"] },
    { id: "sensitive", label: "건강 등 민감정보를 수집하나요?", options: ["예", "아니오"] },
  ],
  fintech: [
    { id: "settlement", label: "자금 이동·정산이 포함되나요?", options: ["예", "아니오"] },
  ],
  commerce: [
    { id: "mail-order", label: "통신판매(전자상거래)에 해당하나요?", options: ["예", "아니오", "잘 모름"] },
  ],
  education: [],
  other: [],
};

export function conditionQuestionsFor(industry: IndustryKey): ConditionQuestion[] {
  return CONDITION_QUESTIONS[industry] ?? [];
}

/** D-01 → D-02: 한 줄 아이디어에서 구조를 추출한다. TODO(ai-extract): 실제 LLM 호출로 교체. */
export async function extractIdea(idea: string): Promise<ExtractedIdea> {
  await fakeLatency(900);
  // 스텁: 입력을 그대로 반영한 뼈대만 반환. 실제로는 AI가 채운다.
  return {
    oneLiner: idea.trim(),
    problem: "",
    customer: "",
    solution: "",
    revenue: "",
  };
}

/** D-05 → D-06: 진단 실행 요청. reportId 를 반환(스텁). TODO(diagnose-api). */
export async function submitDiagnosis(draft: DiagnoseDraft): Promise<{ reportId: string }> {
  await fakeLatency(400);
  return { reportId: "demo" };
}

// D-06 진행 단계 텍스트 (스피너 대신 순차 노출). TODO(diagnose-api): 실제 진행률 스트림 연동.
export const RUNNING_STEPS = [
  "아이디어 구조 분석 중…",
  "유사 서비스·시장 조사 중…",
  "규제·인허가 리스크 점검 중…",
  "6축 사업성 점수 산출 중…",
  "실행 로드맵 구성 중…",
  "리포트 정리 중…",
];

function fakeLatency(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
