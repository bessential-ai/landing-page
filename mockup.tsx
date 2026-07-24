"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  FileText,
  CheckCircle2,
  ArrowRight,
  Check,
  Lock,
  ChevronRight,
  ListChecks,
  Download,
  TrendingUp,
  TrendingDown,
  Target,
  Users,
  Search,
  ExternalLink,
  Scale,
  Gauge,
  Sparkles,
  Rocket,
  Award,
  Lightbulb,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  Landmark,
} from "lucide-react";

const ACCENT_GRAD = "linear-gradient(135deg, #6366F1, #8B5CF6)";

const VIEWS = [
  { id: "landing", code: "00", label: "데모 메인" },
  { id: "input", code: "01", label: "아이디어 입력" },
  { id: "diagnosis", code: "02", label: "종합 진단" },
  { id: "bm", code: "03", label: "비즈니스 모델" },
  { id: "market", code: "04", label: "시장조사" },
  { id: "competitors", code: "05", label: "유사 서비스" },
  { id: "risk", code: "06", label: "리스크" },
  { id: "metrics", code: "07", label: "핵심 지표" },
  { id: "roadmap", code: "08", label: "로드맵" },
  { id: "support", code: "09", label: "지원사업" },
];

const SAMPLE_INPUT =
  "경도인지장애 부모를 둔 보호자를 위해, 보호자 목소리로 AI가 매일 안부 전화를 걸어 복약·식사·컨디션을 확인하고 보호자 앱에 기록·알림해 주는 서비스";

/* ── 종합 점수 (가중 합산) ── */
const SCORE_AXES = [
  { label: "실현 가능성", weight: 35, score: 74, why: "STT·TTS·LLM은 상용 API로 조립 가능. 다만 오탐·미탐 제어와 통화당 원가가 실현의 관건." },
  { label: "수익성", weight: 35, score: 70, why: "B2C 구독 + 기관 B2B + 통신사 제휴로 다층 수익. 통화 원가 대비 마진 확보가 핵심." },
  { label: "접근 가능성", weight: 20, score: 66, why: "보호자(자녀)는 접근이 쉬우나, 기관·통신사 채널은 계약 리드타임이 길다." },
  { label: "확장성", weight: 10, score: 80, why: "당뇨·고혈압 등 만성질환 관리, 다국어로 확장 용이. 축적되는 음성·신뢰 데이터가 해자." },
];
const TOTAL_SCORE = Math.round(
  SCORE_AXES.reduce((s, a) => s + (a.score * a.weight) / 100, 0)
);

/* ── 장점 / 단점 (구조화 상세) ── */
const PROS = [
  {
    t: "익숙한 목소리라는 정서적 훅",
    mechanism: "MCI 환자와 고령자는 낯선 기계음성에 경계심·피로를 느껴 통화를 금방 끊거나 무성의하게 답하는 경향이 있습니다. 반면 익숙한 자녀 목소리는 인지 부하가 낮아 통화 문턱을 떨어뜨리고, '전화를 받는다 → 대화를 이어간다 → 매일 반복한다'는 습관 형성으로 이어집니다. 즉 목소리는 단순 UX가 아니라 '지속'을 만드는 핵심 장치입니다.",
    evidence: "표준 AI 안부전화(클로바 케어콜 등)가 공통적으로 지적받는 약점이 바로 '기계적이라 어르신이 금방 끊는다'는 점이고, 반대로 가족 음성·사진을 활용한 정서 돌봄 제품이 지속률에서 강점을 보인 사례가 있습니다. 정서적 연결이 응답 지속의 변수라는 방향은 여러 돌봄 서비스에서 반복 관찰됩니다.",
    implication: "이 훅은 응답률·4주 지속률이라는 케어 서비스의 생존 지표를 직접 끌어올립니다. 게다가 '보호자 목소리 등록·학습' 과정에서 쌓이는 음성·동의 데이터는 경쟁사가 하루아침에 복제할 수 없어, 초기 차별점이 시간이 갈수록 해자로 굳어집니다.",
  },
  {
    t: "우상향하는 구조적 수요",
    mechanism: "수요가 '유행'이 아니라 인구구조에서 나옵니다. 초고령사회 진입 + MCI 유병률 증가 + 자녀와 떨어져 사는 노인가구 증가가 동시에 겹치면서, '멀리 있는 부모를 매일 확인하고 싶다'는 니즈가 구조적으로 커지고 있습니다.",
    evidence: "65세 이상 인구 비중이 20%를 넘어서는 국면이고, 1~2인 노인가구·독거 비율도 지속 상승 추세입니다. 돌봄 인력 수급은 반대로 부족해져, 사람 대신 기술로 메우려는 압력이 커집니다(모두 공식 통계로 재확인 권장).",
    implication: "시장이 축소가 아니라 확장 방향이라 '타이밍 리스크'가 낮습니다. 지금 진입해 데이터·채널을 선점하면, 시장이 커질수록 후발주자 대비 누적 우위가 벌어지는 구조입니다.",
  },
  {
    t: "임상 자문이라는 신뢰 자산",
    mechanism: "헬스케어에서 초기 팀의 최대 약점은 '이 설계가 임상적으로 말이 되냐'는 신뢰의 공백입니다. 세브란스 교수 자문은 설계 타당성 검증을 넘어, 기관·투자자·규제 대응에서 '검증된 팀'이라는 신호로 작동합니다.",
    evidence: "병원·요양기관 B2B 계약과 정부 R&D·투자 심사는 공통적으로 '의학적 근거와 자문 체계'를 요구합니다. 임상 자문 네트워크가 있으면 기관 파일럿 섭외와 TIPS·복지부 과제 지원에서 실질적 가점 요인이 됩니다.",
    implication: "돈으로 살 수 없는 초기 신뢰를 이미 확보한 셈이라, 기관 채널 진입과 투자 유치의 리드타임을 단축합니다. 다만 자문은 '설계 검증'이지 '의료행위 허가'가 아니므로, 규제 라인은 별도로 관리해야 합니다.",
  },
  {
    t: "다층 수익 경로 (B2C·B2B·제휴)",
    mechanism: "단일 채널에 의존하면 그 채널 하나가 막힐 때 사업 전체가 멈춥니다. 이 아이디어는 보호자 직접 구독(B2C) + 요양·복지기관 좌석제(B2B) + 통신사 번들 제휴(수수료)라는 서로 성격이 다른 세 갈래를 가집니다.",
    evidence: "B2C는 초기 검증과 정서적 스토리에 강하고, B2B는 계약당 매출이 크고 이탈이 낮으며, 통신사 제휴는 대규모 유통을 한 번에 엽니다. 실제 시니어 케어 시장에서 지자체·통신사 예산이 큰 수요처로 작동해 온 전례가 있습니다.",
    implication: "한 채널이 규제·경쟁으로 막혀도 나머지로 버틸 수 있어 다운사이드가 방어됩니다. 단, 초기에 세 개를 동시에 쫓으면 리소스가 분산되므로 'B2C로 검증 → B2B/제휴로 확장' 순서를 지키는 것이 중요합니다.",
  },
  {
    t: "소프트웨어 기반의 빠른 반복 속도",
    mechanism: "경쟁 축인 돌봄 로봇·인형은 하드웨어라 기능 하나를 바꾸려면 금형·펌웨어·재고까지 손봐야 합니다. 전화(음성 SW) 기반인 이 서비스는 프롬프트·질문 세트·알림 로직을 배포 한 번으로 바꿀 수 있어, 사용자 피드백을 주 단위로 반영할 수 있습니다.",
    evidence: "하드웨어 제품은 초기 CAC(기기 원가)와 재고 리스크가 크고 업데이트 주기가 분기~연 단위입니다. 반면 순수 SW 서비스는 A/B 테스트·기능 토글로 실험 비용이 거의 0에 수렴합니다.",
    implication: "'질환군 확장(당뇨·고혈압), 질문 세트 개인화, 알림 튜닝'을 경쟁사보다 몇 배 빠르게 돌릴 수 있어, 시간이 갈수록 제품 완성도 격차가 벌어집니다. 초기 자본이 적은 팀에게 특히 유리한 구조입니다.",
  },
];
const CONS = [
  {
    t: "의료기기·의료행위 경계 (가장 큰 벽)",
    mechanism: "'건강 상태를 확인하고 이상을 알린다'는 핵심 기능이, 규제 해석에 따라 '의료적 모니터링·판단'으로 읽힐 수 있습니다. 그 선을 넘는 순간 소프트웨어 의료기기(SaMD) 인허가 대상이 되어, 인증·임상·품질관리 부담이 사업 초기 역량을 초과합니다.",
    evidence: "식약처의 '비의료 건강관리 서비스 가이드라인'은 허용(건강정보 제공·생활습관 관리)과 금지(진단·처방·질병 예측) 행위를 구분하지만, '이상 징후 알림' 같은 표현은 경계가 모호해 해석 다툼이 생기기 쉽습니다.",
    implication: "제품 기능과 마케팅 문구 한 줄이 규제 등급을 바꿀 수 있어, 카피라이팅 단계부터 법무가 개입해야 합니다. 초기에는 기능을 '건강관리 정보 제공'으로 좁게 묶고, 확장 기능은 규제 확인 이후로 미루는 보수적 설계가 안전합니다.",
  },
  {
    t: "통화당 변동 원가 (마진 구조의 급소)",
    mechanism: "통화가 한 번 발생할 때마다 STT(음성→텍스트) + LLM(대화 분석) + TTS(음성 합성) + 통신망 비용이 함께 발생합니다. 사용자가 많이 쓸수록 원가도 비례해 늘어나는 '변동비 사업'이라, 구독가를 잘못 잡으면 많이 팔수록 손해가 커집니다.",
    evidence: "매일 1회 × 수 분 통화 × 가구 수로 원가가 누적되고, 여기에 재시도·긴 대화가 겹치면 통화당 단가가 뜁니다. 음성 AI 스택은 토큰·오디오 길이에 과금되는 구조라 사용량이 곧 비용입니다.",
    implication: "'통화당 원가 < 구독가 안의 목표 마진'을 증명하지 못하면 스케일이 곧 적자가 됩니다. 따라서 초기부터 통화당 원가 계측을 코드에 심고, 통화 길이·빈도·모델 티어를 원가 기준으로 설계하는 것이 생존 조건입니다.",
  },
  {
    t: "민감 건강정보 + 동의능력 이슈",
    mechanism: "다루는 데이터가 '건강정보'라 개인정보보호법상 민감정보로 가중 보호됩니다. 게다가 서비스 당사자(MCI 환자)는 동의능력이 제한될 수 있어, 본인 동의만으로는 법적으로 유효하지 않을 위험이 있습니다.",
    evidence: "민감정보는 별도의 명시적 동의·강화된 안전조치가 요구되고, 동의능력이 불완전한 대상에 대해서는 보호자(법정대리·위임) 동의 구조가 필요합니다. 유출·오남용 사고 시 과징금과 신뢰 붕괴의 타격이 일반 서비스보다 큽니다.",
    implication: "가입 플로우 자체를 '보호자 대리동의 + 당사자 고지'로 설계하고, 최소수집·암호화·보관기간·파기·접근통제 정책을 문서화해야 합니다. 이건 나중에 붙이는 옵션이 아니라 첫 설계에 넣어야 하는 전제 조건입니다.",
  },
  {
    t: "음성 합성 윤리·악용 리스크",
    mechanism: "보호자 목소리를 합성해 재생하는 방식은 강력한 훅인 동시에, 음성권 침해·딥보이스 악용이라는 양날의 검입니다. 등록 절차가 허술하면 타인의 목소리를 무단 합성하는 통로가 될 수 있습니다.",
    evidence: "합성음성 악용(보이스피싱·사칭)에 대한 사회적 경계가 높아지고 있고, 음성은 초상권에 준하는 인격적 권리로 다뤄지는 추세입니다. 'AI가 합성한 음성'임을 고지하지 않으면 기만 이슈도 생깁니다.",
    implication: "본인 인증 등록만 허용하고, 합성 음성에 'AI 안내' 고지를 넣고, 무단 합성 방지 장치를 두는 것이 신뢰의 기본선입니다. 윤리 설계를 초기에 못 박아야 나중에 규제·여론 리스크로 되돌아오지 않습니다.",
  },
  {
    t: "빅플레이어 진입·모방 위협",
    mechanism: "이 시장에는 이미 네이버(클로바)·통신사·대형 요양기업처럼 데이터·유통·자본을 가진 플레이어가 인접해 있습니다. 우리가 시장을 검증해 주면, 그들이 유사 기능을 얹어 대규모 유통으로 밀어붙일 위험이 있습니다.",
    evidence: "AI 안부전화 자체는 이미 여러 곳이 시도 중이고, 통신사는 시니어 고객·과금 인프라를, 네이버는 음성 AI 스택을 이미 보유합니다. 순수 기능만으로는 진입장벽이 낮습니다.",
    implication: "'기능'이 아니라 '보호자 목소리 데이터 + 임상 신뢰 + 정서적 록인'이라는 복제 어려운 해자로 승부해야 합니다. 동시에 통신사·기관을 경쟁자가 아닌 제휴 파트너로 먼저 끌어들여, 그들이 직접 만들기보다 우리를 얹는 편이 낫게 만드는 전략이 필요합니다.",
  },
];

/* ── 비즈니스 모델 · 린 캔버스 9블록 (Before: 사용자 입력 / After: 유료 도출) ── */
const CANVAS: Record<string, { label: string; before: string; after: string[] }> = {
  problem: {
    label: "문제",
    before: "부모님 안부가 늘 걱정된다",
    after: [
      "비동거 자녀가 MCI 부모의 매일 상태 변화를 파악하기 어렵다",
      "직접 전화는 지속·기록이 안 돼 '어제보다 나빠졌는지' 추세를 놓친다",
      "복약·식사 누락, 이상 징후를 조기에 잡을 상시 채널이 없다",
    ],
  },
  solution: {
    label: "솔루션",
    before: "AI가 대신 전화해 준다",
    after: [
      "보호자 음성 AI 케어콜 (1일 1회, 부담 없는 시간대)",
      "3항목 자동 확인: 복약 · 식사 · 컨디션",
      "대화 분석 → 요약 + 이상 신호 추출",
      "보호자 앱: 기록 · 추세 그래프 · 이상 알림",
    ],
  },
  uvp: {
    label: "고유 가치 제안",
    before: "(명확한 정의 없음)",
    after: [
      "부모님이 거부감 없이 받는 '익숙한 목소리'로 매일 확인·기록·알림",
      "태그라인: \"부모님 안부, 매일 대신 여쭤봐 드릴게요.\"",
      "하이레벨 컨셉: 시니어를 위한 음성 기반 원격 케어 비서",
    ],
  },
  advantage: {
    label: "불공정 강점",
    before: "AI가 전화하는 것 자체",
    after: [
      "보호자 목소리 데이터 + 사용 동의 자산 (복제 난이도 높음)",
      "임상 자문 네트워크(세브란스)에서 오는 신뢰",
      "축적되는 통화·건강 추세 데이터 → 개인화 정확도 해자",
      "오래 쓸수록 바꾸기 어려운 정서적 록인",
    ],
  },
  segment: {
    label: "고객군",
    before: "노인, 가족",
    after: [
      "1차(결제자): 비동거 40~60대 자녀",
      "2차(B2B): 요양·복지기관, 데이케어센터",
      "3차(제휴): 통신사 시니어 요금제",
      "얼리어답터: 매일 전화하지만 지치는 효자·효녀 자녀",
    ],
  },
  metrics: {
    label: "핵심 지표",
    before: "(설정 없음)",
    after: [
      "응답률 · 4주 지속률",
      "이상알림 유용성 · 거짓경보율",
      "유료 전환율 & CAC · 통화당 원가",
      "LTV ÷ (CAC + 누적 통화원가)",
    ],
  },
  channel: {
    label: "채널",
    before: "(정의 없음)",
    after: [
      "B2C: 앱스토어 + 맘카페·부모돌봄 커뮤니티·SNS",
      "B2B: 요양·복지기관 제휴 영업",
      "제휴: 통신사 번들 · 보험사 부가서비스",
      "바이럴: '부모님 리포트' 가족 공유 → 형제자매 유입",
    ],
  },
  cost: {
    label: "비용 구조",
    before: "(고려 안 함)",
    after: [
      "변동비(급소): 통화당 STT · LLM · TTS · 통신 원가",
      "고정비: 개발·운영 인건비, 임상 자문 비용",
      "초기: 규제 검토·법무, 개인정보 보안 체계 구축",
      "획득비: 자녀 타깃 마케팅 CAC",
    ],
  },
  revenue: {
    label: "수익원",
    before: "월 구독",
    after: [
      "B2C 월 구독 (기본 / 프리미엄 티어)",
      "B2B 좌석제 (기관 계정당 과금)",
      "통신사·보험 제휴 수수료 (RS)",
      "부가: 상세 리포트 · 전문가 상담 연계",
    ],
  },
};

/* 캔버스 변화의 '사고 과정' — 왜 이렇게 바꿨는가 */
const BM_BEFORE_AFTER = [
  { k: "문제", before: "부모님 안부가 늘 걱정된다", after: "비동거 자녀가 MCI 부모의 상태 변화를 매일 파악하기 어렵고, 직접 전화는 지속·기록·추세화가 안 된다", why: "'걱정'이라는 감정은 그 자체로는 살 수 없습니다. 이를 '지속성·기록·추세 감지의 부재'라는 검증 가능하고 측정 가능한 결핍으로 쪼개야, 솔루션이 무엇을 해결하는지가 분명해지고 인터뷰로 실제 통증을 확인할 수 있습니다." },
  { k: "고객", before: "노인, 가족", after: "1차: 비동거 40~60대 자녀 / 2차: 요양·복지기관 / 3차: 통신사", why: "'가족'은 너무 넓어 마케팅도 제품도 초점을 잃습니다. 실제로 돈을 내는 사람(자녀)을 1차 고객으로 못 박고, 대량 유통을 여는 채널(기관·통신사)을 2·3차로 분리했습니다. 누구의 지갑을 여는지가 명확해야 메시지·가격·기능이 한 방향으로 정렬됩니다." },
  { k: "솔루션", before: "AI가 전화해 주는 서비스", after: "보호자 음성 AI 케어콜 → 3항목(복약·식사·컨디션) 확인 → 대화 분석 → 보호자 앱 기록·이상 알림", why: "'전화'만으로는 가치가 모호하고 아무나 흉내 낼 수 있습니다. '무엇을 확인해(3항목) → 무엇을 남기고(기록·추세) → 언제 알리는가(이상)'를 하나의 반복 가능한 루프로 고정하면, 제품의 범위와 원가·품질 기준이 동시에 잡힙니다." },
  { k: "수익모델", before: "월 구독", after: "B2C 월 구독(보호자) + B2B 좌석제(기관) + 통신사 번들 제휴 수수료", why: "통화가 변동비라 단일 B2C 구독만으로는 원가 충격에 취약합니다. 계약 규모가 크고 이탈이 낮은 B2B, 대규모 유통을 여는 제휴를 더해 원가를 감당하고 성장 경로를 다변화했습니다. 단, 순서는 B2C 검증이 먼저입니다." },
  { k: "차별점", before: "AI가 대신 전화", after: "익숙한 '보호자 목소리' + 임상 자문 기반 설계 + 축적되는 통화·신뢰 데이터", why: "'AI 전화'는 이미 여럿이 하고 있어 차별점이 되지 못합니다. 복제 난이도가 높은 세 가지 — 보호자 목소리 데이터, 임상 신뢰, 시간이 갈수록 쌓이는 개인화 데이터 — 로 재정의해야 후발주자·빅플레이어의 모방을 견디는 해자가 됩니다." },
];

/* ── 시장조사 ── */
const MARKET_SIZE = [
  { k: "TAM", label: "국내 시니어 케어테크 전체", value: "약 2.7조원", w: 100, note: "고령친화산업 중 디지털 돌봄·헬스케어 영역 전체. 계산식: 65세+ 인구 × 디지털 케어 침투율 × 연 지출 (추정·공식 통계로 재확인 필요)" },
  { k: "SAM", label: "비동거 자녀 대상 원격 안부·모니터링", value: "약 4,800억원", w: 42, note: "우리가 실제로 노리는 세그먼트. 돌봄 공백이 있는 비동거 노인가구 × 유료 전환 가능 가구 × 연 구독액으로 산출" },
  { k: "SOM", label: "3년 내 확보 가능 (수도권 중심)", value: "약 120억원", w: 12, note: "초기 채널·CAC·팀 규모를 감안한 보수적 3년 목표. SAM의 2~3% 침투 가정" },
];
/* 수요가 실재한다는 구체 근거 지표 */
const DEMAND_EVIDENCE = [
  { stat: "약 20%", label: "65세 이상 인구 비중 (초고령사회 기준선 돌파)", note: "돌봄 대상 모수 자체가 매년 커지는 방향" },
  { stat: "10명 중 1명+", label: "65세 이상 인지저하(MCI·치매 포함) 관련 유병 추정", note: "핵심 타깃(MCI)의 절대 규모가 크고 증가세" },
  { stat: "30%대", label: "노인 1인가구(독거) 비중 추세", note: "'옆에서 매일 확인할 사람'의 부재 → 원격 확인 수요" },
  { stat: "지속 심화", label: "요양보호사 등 돌봄 인력 수급 격차", note: "사람으로 못 메우는 공백 → 기술 대체 압력" },
];
const DEMAND_SPLIT = [
  { label: "비동거 자녀의 정기 안부 니즈", pct: 38 },
  { label: "복약·식사 관리 필요", pct: 24 },
  { label: "치매·MCI 조기 변화 감지", pct: 18 },
  { label: "응급·이상징후 알림", pct: 12 },
  { label: "정서적 교류·외로움 완화", pct: 8 },
];
const SALES_TREND = [
  { year: "'26", v: 20 },
  { year: "'27", v: 180 },
  { year: "'28", v: 900 },
  { year: "'29", v: 3200 },
  { year: "'30", v: 8500 },
];
const MARKET_DRIVERS = [
  { t: "초고령사회 진입 (구조적 순풍)", d: "65세 이상 비중이 20%를 넘어서며 돌봄 수요 모수가 매년 확대. 유행이 아니라 인구구조가 미는 수요라 지속성이 높다.", dir: "up" },
  { t: "1~2인 노인가구·독거 증가", d: "자녀와 떨어져 사는 노인이 늘며 '멀리서 매일 확인'하는 원격 케어 니즈가 구조적으로 상승.", dir: "up" },
  { t: "돌봄 인력 수급 격차", d: "요양·돌봄 인력은 부족해지는 반면 대상자는 늘어, 사람 대신 기술로 메우려는 압력이 커진다.", dir: "up" },
  { t: "AI 음성 기술 성숙·원가 하락", d: "STT·TTS·LLM 상용 API 품질이 오르고 단가가 내려가며, 과거엔 비쌌던 케어콜이 사업성 있는 구간에 진입.", dir: "up" },
  { t: "개인정보·의료 규제 강화", d: "민감 건강정보·의료기기 경계 규제는 진입 마찰 요인. 다만 잘 대응하면 오히려 후발주자 진입장벽이 된다.", dir: "down" },
];

/* ── 유사 서비스 / 관련 사례 ── */
const COMPETITORS = [
  {
    name: "네이버 클로바 케어콜",
    link: "clova.ai",
    tags: ["B2G", "표준 AI 음성", "안부전화"],
    focus: "지자체 예산으로 독거노인에게 주기적으로 AI가 안부전화를 걸어 식사·수면·건강을 묻고, 이상 신호를 담당 공무원에게 리포트하는 공공 돌봄 모델.",
    strength: "공공 예산 기반의 빠른 대규모 확산, 안정적인 콜 처리, 네이버 브랜드·음성 AI 스택의 신뢰.",
    weakness: "표준 합성음이라 정서적 지속성이 약하고, 가족(보호자)과의 개인화된 연결·기록 레이어가 얇음. B2G라 개별 가정의 세밀한 니즈·유료 프리미엄 대응은 한계.",
    diff: "우리는 '보호자 본인 목소리'라는 정서 훅 + 보호자 앱의 기록·추세·알림으로, 가족이 직접 지갑을 여는 B2C를 공략. 클로바가 약한 '지속성'과 '가족 개인화'가 정확히 우리의 진입점이다.",
  },
  {
    name: "효돌 (돌봄 인형)",
    link: "hyodol.com",
    tags: ["하드웨어", "정서 돌봄", "B2G/B2B"],
    focus: "봉제 인형 형태로 말벗·복약 알림·정서 케어를 제공하며 다수 지자체·기관에 납품. '정서 돌봄'이 실제 구매 동기가 됨을 시장에서 입증.",
    strength: "실물 인형이 주는 정서적 애착과 존재감, 지자체 납품 레퍼런스, 오프라인 케어와의 결합.",
    weakness: "하드웨어라 초기 원가(CAC)·재고 부담이 크고, 기능 업데이트가 느림. 가족과의 실시간 데이터 연동·추세 분석은 약함.",
    diff: "우리는 순수 소프트웨어·전화 기반이라 CAC가 낮고 배포 한 번으로 기능을 개선. 정서(목소리) + 데이터(기록·추세)를 동시에 잡아 '느린 하드웨어'와 차별화한다.",
  },
  {
    name: "통신사 시니어 케어 (SKT·KT 등)",
    link: "-",
    tags: ["통신사", "번들", "긴급 알림"],
    focus: "시니어 요금제에 안부·긴급 알림·AI 스피커 케어를 번들로 얹는 형태. 대규모 가입자 기반과 과금 인프라 보유.",
    strength: "압도적 유통(가입자)·과금 인프라, 통신망 연동, 브랜드 신뢰.",
    weakness: "케어가 부가서비스라 깊이가 얕고, 가족 목소리·임상 기반 개인화는 핵심이 아님. 자체 개발보다 파트너십으로 채우는 경향.",
    diff: "정면 대결이 아니라 '제휴 파트너'로 붙는다. 통신사의 유통 위에 우리의 음성 개인화·기록·임상 레이어를 얹어, 그들이 직접 만들기보다 우리를 얹는 편이 낫게 만드는 포지션.",
  },
  {
    name: "일반 안부·복약 알림 앱",
    link: "-",
    tags: ["B2C 앱", "셀프 케어"],
    focus: "복약 알림·가족 위치·안부 메시지 등을 제공하는 범용 시니어/가족 케어 앱들. 자녀가 직접 설치·관리.",
    strength: "가볍고 무료~저가라 진입장벽이 낮고, 자녀가 스스로 설치 가능.",
    weakness: "결국 '어르신이 직접 앱을 써야' 하는데 MCI·고령층에겐 그 자체가 벽. 능동적 확인이 아니라 수동 알림에 그침.",
    diff: "우리는 어르신이 앱을 배울 필요 없이 '전화를 받기만' 하면 된다. 능동적으로 매일 걸어 확인·기록하는 점에서 수동형 앱과 근본적으로 다르다.",
  },
];
const CASES = [
  { name: "네이버 클로바 케어콜 (지자체 확산)", stage: "전국 다수 지자체 도입", story: "독거노인을 대상으로 주 1~2회 AI가 안부전화를 걸어 식사·수면·건강을 묻고, 이상 신호를 지자체 담당자에게 전달하는 모델입니다. 지자체 복지 예산을 등에 업고 B2G로 빠르게 확산한 것이 강점이었습니다. 다만 표준 AI 음성이라 '어르신이 금방 무성의하게 답하거나 정서적으로 지속되지 않는다'는 점이 반복적으로 과제로 지적됐습니다. 우리에게 주는 교훈: (1) B2G/B2B 예산이 큰 수요처라는 점을 확인해 주지만, (2) 바로 그 '정서적 지속성'의 빈틈이 우리의 보호자 목소리 훅이 파고들 자리라는 것입니다." },
  { name: "일본 BOCCO / BOCCO emo (가족 커뮤니케이션 로봇)", stage: "상용화·판매 중", story: "가족 간 메시지를 음성으로 중계하는 소형 로봇으로 시작해, 시니어 안부·복약 알림·센서 연동으로 영역을 넓힌 사례입니다. 하드웨어 판매와 구독(센서·통신)을 병행하는 수익 구조를 오래 유지해 왔습니다. 우리에게 주는 시사점: (1) '가족과의 정서적 연결'을 코어로 잡은 제품이 시니어 케어로 자연스럽게 확장된다는 방향성 검증, (2) 다만 하드웨어는 초기 CAC·재고 부담이 크다는 점 — 우리가 소프트웨어·전화 기반을 택한 이유이기도 합니다." },
  { name: "효돌 (국내 돌봄 인형)", stage: "지자체·기관 납품 중", story: "봉제 인형 형태로 말벗·복약 알림·정서 케어를 제공하며 다수 지자체에 납품된 국내 사례입니다. '정서 돌봄'이 실제 구매 동기가 된다는 것을 시장에서 입증했습니다. 시사점: 정서 훅의 수요는 분명하되, 하드웨어라 업데이트·확장 속도가 느립니다. 소프트웨어 기반인 우리는 기능 개선·질환 확장을 훨씬 빠르게 반복할 수 있다는 대비가 됩니다." },
];

/* ── 리스크 (규제·법률) ── */
const RISKS = [
  {
    t: "의료기기(SaMD)·의료행위 경계",
    level: "높음",
    basis: "핵심 기능인 '건강 상태 확인 → 이상 알림'이 규제 해석에 따라 의료적 판단·모니터링으로 읽히면, 소프트웨어 의료기기(SaMD) 인허가 대상이 됩니다. 그 순간 임상시험·GMP 품질관리·인증이라는, 초기 스타트업이 감당하기 힘든 부담이 붙습니다. 식약처 '비의료 건강관리 가이드라인'이 허용/금지 행위를 나누지만 '이상 징후 알림' 같은 표현은 경계가 모호해 해석 다툼이 잦은 지점입니다.",
    easy: "가장 현실적인 1차 방어는 '기능·문구를 좁히는 것'입니다. 제품 카피에서 진단·질병 예측·처방을 연상시키는 표현(모니터링·조기진단·이상 감지 등)을 전면 배제하고, '복약·식사·컨디션 기록과 보호자 공유(건강관리 정보 제공)'로 스코프를 한정합니다. 응급 판단은 하지 않고 '보호자에게 확인을 권유'하는 톤으로 통일합니다.",
    bypass: "정공법은 식약처 사전 분류 상담을 신청해 '비의료' 확인을 서면으로 받아두고, 법무 자문 레터를 확보한 뒤 그 범위 안에서 마케팅 문구를 확정하는 것입니다. 이후 의료적 기능(예: 인지저하 스크리닝)으로 확장하고 싶다면, 그 기능만 별도 규제 트랙(인허가/제휴 병원 통한 처방형)으로 분리해 본체 서비스의 리스크와 격리합니다.",
  },
  {
    t: "민감 건강정보·동의능력",
    level: "높음",
    basis: "다루는 데이터가 건강정보라 개인정보보호법상 민감정보로 가중 보호되고, 명시적·분리 동의와 강화된 안전조치가 요구됩니다. 여기에 서비스 당사자(MCI 환자)는 동의능력이 제한될 수 있어 본인 동의만으로는 법적 유효성이 흔들립니다. 유출·오남용 사고 시 과징금과 신뢰 붕괴의 타격이 일반 서비스보다 훨씬 큽니다.",
    easy: "가입 플로우를 처음부터 '보호자(법정대리·위임) 대리동의 + 당사자 고지' 구조로 설계합니다. 수집 항목을 서비스에 꼭 필요한 최소로 줄이고(최소수집), 저장 시 암호화, 보관기간·파기 시점을 명문화합니다. 동의 화면을 목적별로 쪼개 '무엇을 왜 수집하는지'를 분리 고지합니다.",
    bypass: "동의 이력과 대리동의 근거를 로그로 남겨 입증책임에 대비하고, 접근권한 최소화·감사로그·처리위탁 계약(클라우드/STT·TTS 벤더)까지 체계를 갖춥니다. 초기에 개인정보 영향평가(간이라도)를 돌려 취약점을 미리 잡아두면, 나중에 기관 B2B 계약의 보안 심사에서 그대로 자산이 됩니다.",
  },
  {
    t: "음성 합성 악용·음성권",
    level: "중간",
    basis: "보호자 목소리를 합성·재생하는 방식은 강력한 훅이지만, 음성권(초상권에 준하는 인격권) 침해와 딥보이스 악용의 통로가 될 수 있습니다. 등록 검증이 허술하면 타인의 목소리를 무단 합성하는 데 악용될 수 있고, '합성음성임'을 알리지 않으면 기만 이슈도 생깁니다.",
    easy: "본인 인증을 통과한 사람의 목소리만 등록·합성하도록 막고, 합성된 통화에는 'AI가 전달하는 안내'라는 고지를 삽입합니다. 등록 시 '무단 타인 음성 등록 금지'를 약관·검증 단계에서 명확히 합니다.",
    bypass: "등록 단계에 성문(voiceprint) 대조나 실시간 발화 챌린지로 본인 확인을 강화하고, 생성 음성에 식별용 워터마크를 넣어 악용·유출 시 추적 가능하게 설계합니다. 음성 데이터의 목적 외 사용 금지와 파기 정책을 계약·시스템 양쪽에 못 박습니다.",
  },
  {
    t: "AI 환각·오탐/미탐",
    level: "중간",
    basis: "대화 분석 LLM이 이상 징후를 잘못 잡거나(오탐) 놓치면(미탐) 곧바로 신뢰·안전 사고로 이어집니다. 오탐이 잦으면 보호자가 알림에 피로해져 이탈하고, 미탐이 발생하면 '왜 못 잡았냐'는 책임 문제가 생깁니다. 건강 도메인이라 한 번의 사고가 브랜드 전체를 흔들 수 있습니다.",
    easy: "응급 상황을 AI가 '자동 판단·조치'하게 두지 않고, 항상 사람(보호자) 확인 루프를 거치게 합니다. AI는 '이런 신호가 있으니 확인이 필요합니다' 수준으로만 전달하고, 최종 판단·연락은 사람이 하도록 책임 경계를 명확히 둡니다.",
    bypass: "통화 로그를 임상 자문과 함께 라벨링해 오탐·미탐 기준을 데이터로 튜닝하고, 임계값을 보수적으로 잡습니다. 진짜 위급 신호에 대비해 119·보호자 이중 연계 경로를 두되, 이 경로가 '의료행위'로 해석되지 않도록 문구·책임범위를 법무와 함께 설계합니다.",
  },
  {
    t: "표시·광고 규제 (건강·의료 표현)",
    level: "중간",
    basis: "'조기 발견·질병 예방·건강 개선' 같은 효능·효과를 암시하는 광고 문구는 의료·건강기능 표시광고 규제의 심의 대상이 될 수 있습니다. 근거 없는 효과 주장이나 과장은 시정명령·과태료로 이어지고, 앱스토어 심사에서도 반려 사유가 됩니다.",
    easy: "마케팅에서 치료·진단·예방 효과를 단정하는 표현을 빼고, '기록·공유·안부 확인'이라는 기능 사실 위주로만 소구합니다. 후기·비교광고도 객관적 근거 범위 안에서만 사용합니다.",
    bypass: "핵심 카피는 사전에 법무·(필요 시) 광고 심의 관점에서 리뷰하고, 효과성 주장을 하려면 자체 데이터(응답률·지속률 등)라는 근거를 확보한 뒤 그 범위에서만 표현합니다.",
  },
  {
    t: "전자상거래·자동결제 고지 의무",
    level: "낮음~중간",
    basis: "월 구독·자동결제 모델은 전자상거래법상 청약철회·자동갱신 고지·간편한 해지 수단 제공 의무를 집니다. 특히 결제자(자녀)와 이용자(부모)가 다르고 고령층이 얽혀 있어, 고지 미흡·해지 곤란은 '다크패턴' 분쟁으로 번지기 쉽습니다.",
    easy: "가입·결제 화면에 요금·갱신 주기·해지 방법을 명확히 고지하고, 해지를 가입만큼 쉽게 만듭니다(원클릭 해지). 결제 전 요약 동의 화면을 둡니다.",
    bypass: "이용약관·개인정보처리방침·환불정책을 초기에 정비하고, 자동갱신 전 사전 알림(리마인드) 메일·문자를 자동화해 분쟁 소지를 원천 차단합니다.",
  },
];

/* ── 핵심 지표 ── */
const METRICS = [
  {
    name: "응답률 (Pickup Rate)",
    how: "2주 미니 파일럿에서 5~10가구를 모아, '통화 시도 횟수 대비 실제로 받은 비율'을 시간대·요일별로 로깅합니다. 조사 대상은 어르신(수신자)이지만, 설정은 보호자(자녀)가 하므로 두 관점을 함께 봅니다. 목소리 버전(가족 목소리 vs 표준 AI)을 A/B로 나눠 응답률 차이도 측정합니다.",
    meaning: "이 서비스가 '실제로 닿는가'를 재는 1차 관문입니다. 응답률이 낮다는 건 통화 시간대·빈도·목소리 중 무언가가 어르신의 생활 리듬과 안 맞는다는 신호이고, 여기서 막히면 뒤의 모든 기능이 무의미해집니다. 가족 목소리 버전의 응답률이 유의미하게 높다면, 핵심 가설(정서적 훅)이 데이터로 증명되는 것입니다.",
    use: "온보딩 기본 설정(추천 통화 시간대·빈도)의 근거가 되고, '가족 목소리가 응답률을 N%p 높인다'는 수치는 투자·기관 설득의 핵심 트랙션 슬라이드가 됩니다.",
    benchmark: "초기 목표선: 응답률 60%+ · 가족 목소리 버전이 표준음 대비 유의미하게 높으면 핵심 가설 성립",
  },
  {
    name: "지속률 (4주 유지율)",
    how: "가입 가구가 4주 뒤에도 통화를 유지하는 비율을 코호트(가입 주차)별로 추적합니다. 이탈한 가구에는 짧은 이탈 인터뷰를 붙여 '왜 멈췄는지(어르신 거부·효용 부족·보호자 무관심)'를 정성으로 함께 수집합니다.",
    meaning: "정서적 훅이 '한 번의 신기함'이 아니라 '습관'으로 자리잡는지를 보는 지표입니다. 케어 서비스에서 지속률은 곧 해자입니다 — 오래 쓸수록 음성·건강 데이터가 쌓이고 전환 비용이 커져 경쟁사가 뺏기 어려워지기 때문입니다. 4주를 넘기는 코호트가 두꺼워질수록 사업의 바닥이 단단해집니다.",
    use: "고객생애가치(LTV) 산정의 핵심 입력값이고, 구독 가격 가설(얼마까지 받아도 유지되는가)을 검증하는 근거입니다. 이탈 인터뷰 결과는 다음 기능 우선순위를 정합니다.",
    benchmark: "목표선: 4주 지속률 40%+ (케어 서비스 록인의 최소 신호선)",
  },
  {
    name: "이상징후 알림 유용성",
    how: "이상 알림을 받은 보호자에게 주간으로 '이 알림이 실제로 도움이 됐는가'를 1~5점으로 묻고, 그 알림으로 실제 조치(전화·방문·병원)를 했는지 여부를 함께 기록합니다. 조사 대상은 보호자(자녀)이며, 알림 1건 단위로 유용/무용을 라벨링합니다.",
    meaning: "알림의 '신호 대 소음(signal/noise)' 비율을 재는 지표입니다. 점수가 낮다는 건 쓸데없는 알림이 많다는 뜻이고, 이는 곧 보호자 피로 → 알림 무시 → 이탈로 이어집니다. 반대로 유용성이 높으면 '이 서비스가 없으면 불안하다'는 록인이 생깁니다.",
    use: "임상 자문과 함께 어떤 통화 로그를 우선 라벨링할지 정하는 기준이 되고, 기능 로드맵(어떤 이상 유형을 먼저 잡을지)을 결정합니다.",
    benchmark: "목표선: 알림 유용성 평균 4.0/5.0+ · 조치로 이어진 알림 비율 상승 추세",
  },
  {
    name: "거짓경보율 (False Alarm Rate)",
    how: "발송된 이상 알림 중 '실제로는 문제가 없었던' 비율을 집계합니다. 사후에 보호자 확인 결과와 대조해 오탐 여부를 판정하고, 어떤 대화 패턴에서 오탐이 많은지 유형화합니다.",
    meaning: "안전(미탐을 줄이려 민감하게)과 신뢰(오탐을 줄이려 둔감하게) 사이의 트레이드오프를 관리하는 지표입니다. 거짓경보가 잦으면 보호자가 '양치기 소년' 취급을 하며 진짜 경보까지 무시하게 됩니다. 이 균형점을 데이터로 찾는 것이 제품 신뢰의 핵심입니다.",
    use: "이상 감지 임계값 튜닝의 직접 근거이고, 법무 관점에서 '무리한 자동 판단을 하지 않았다'는 방어 근거로도 쓰입니다.",
    benchmark: "목표선: 거짓경보율 10% 이하 (보호자 피로·이탈 임계선)",
  },
  {
    name: "유료 전환율 & CAC",
    how: "무료 체험 → 유료 결제로 넘어가는 비율과, 그 한 명을 데려오는 데 든 획득 비용(CAC)을 채널별로 함께 측정합니다. 여기에 통화당 원가를 얹어 '가구당 월 원가 대비 구독가'의 단위경제를 계산합니다.",
    meaning: "이 사업이 '많이 팔수록 이득인가, 손해인가'를 판정하는 단위경제의 급소입니다. 통화가 변동비라, 전환율이 높아도 원가·CAC가 크면 스케일이 곧 적자가 됩니다. 'LTV > CAC + 누적 통화원가'가 성립하는 순간이 확장을 눌러도 되는 신호입니다.",
    use: "가격·채널 전략의 결정 근거이자, 투자 유치 IR에서 '지속가능한 유닛 이코노믹스'를 증명하는 가장 중요한 숫자입니다.",
    benchmark: "초기 목표선: 무료→유료 전환 5~10%, LTV ÷ CAC ≥ 3",
  },
  {
    name: "통화당 원가 (Unit Cost)",
    how: "실제 통화 1건에 드는 STT·LLM·TTS·통신 비용을 코드 계측으로 자동 집계하고, 통화 길이·재시도·모델 티어별로 분해해 원가 드라이버를 찾습니다.",
    meaning: "구독가 안에 마진이 남는지를 결정하는 원가의 바닥입니다. 이 숫자를 모르면 가격도, 확장 여부도 결정할 수 없습니다. 사용량이 곧 비용인 사업에서 가장 먼저 통제해야 하는 지표입니다.",
    use: "통화 길이·빈도·모델 선택(경량/고성능)의 설계 기준이 되고, '구독가 − 통화원가 − CAC'로 진짜 마진을 계산하는 입력값이 됩니다.",
    benchmark: "목표선: 통화당 원가 < 구독가의 30~40% (마진·CAC 회수 여력 확보)",
  },
];

/* ── 로드맵 (시간이 아닌 단계형) ── */
const ROADMAP_STEPS = [
  {
    code: "STEP 1",
    title: "'돈 낼 보호자'가 있는지부터 확인",
    todo: "비동거 자녀 10~15명 심층 인터뷰 + 5가구 2주 미니 파일럿(수동으로라도 직접 전화·기록)",
    tasks: [
      "인터뷰 대본 작성 → 비동거 자녀 10~15명 문제·대안·지불의사 인터뷰",
      "경쟁·대안 서비스 5종 직접 써보고 강약점 매핑",
      "5가구를 모아 2주간 '사람이 직접 전화 → 기록' 컨시어지 파일럿",
      "가격 민감도 질문(얼마면 쓰겠나) 포함",
    ],
    output: "손에 남는 것 — 인터뷰 노트, 지불의사 근거, 초기 린 캔버스 v1, 대안 매핑표",
    next: "인터뷰에서 '유료 의사'가 확인되면 → STEP 2. 아니면 문제 정의·타깃부터 다시.",
    signal: "다음으로 넘어가는 신호 — 인터뷰 10건 중 다수가 '유료라도 쓰겠다'",
    watchout: "흔한 실수 — 지인·긍정 반응만 듣고 넘어가기. '지금 결제 가능?'까지 물어 진짜 지불의사를 검증할 것.",
  },
  {
    code: "STEP 2",
    title: "케어콜 루프 1개만 되게 만들기",
    todo: "'1일 1회 통화 → 3항목 확인 → 요약 → 앱 기록 → 이상 알림' 단일 루프를 상용 API로 조립",
    tasks: [
      "STT·LLM·TTS·통신 스택 선정(경량 우선) 및 통화 파이프라인 조립",
      "질문 세트(복약·식사·컨디션) 3항목으로 고정",
      "대화 요약 + 이상 신호 추출 로직 최소 버전",
      "보호자 앱: 기록·추세·알림 최소 화면",
    ],
    output: "손에 남는 것 — 돌아가는 MVP 1개, 통화 스크립트, 파일럿 피드백 로그",
    next: "루프가 안정적으로 돌면 → STEP 3(원가·안전). 통화 품질이 문제면 STT/TTS 스택 교체.",
    signal: "다음 신호 — 파일럿 가구에서 통화가 며칠 연속 끊김 없이 완주",
    watchout: "흔한 실수 — 기능을 늘리다 루프가 무거워짐. '1개 루프'만 완주시키는 데 집중.",
  },
  {
    code: "STEP 3",
    title: "원가와 안전 경계를 먼저 못 박기",
    todo: "통화당 원가 계측 삽입 + 응급 자동판단 배제·보호자 확인 루프 + 식약처 비의료 분류 상담",
    tasks: [
      "통화당 원가(STT·LLM·TTS·통신) 자동 계측을 코드에 삽입",
      "응급 자동판단 배제 → '보호자 확인 필요' 전달 로직으로 설계",
      "식약처 비의료 분류 상담 신청 + 법무 자문 레터 준비",
      "개인정보·음성 동의(보호자 대리동의) 구조 설계",
    ],
    output: "손에 남는 것 — 통화당 원가 실측치, 규제 포지셔닝 문서, 동의 플로우 설계서",
    next: "원가가 구독가 안에 들어오고 규제 경계가 정리되면 → STEP 4. 원가 초과면 빈도·범위 축소.",
    signal: "다음 신호 — 통화당 원가 < 목표 마진 · 법무 '비의료' 코멘트 확보",
    watchout: "흔한 실수 — 원가·규제를 '나중에'로 미룸. 스케일 후에 손대면 사업 모델을 통째로 갈아야 한다.",
  },
  {
    code: "STEP 4",
    title: "소수에게 '유료로' 팔아보기",
    todo: "20가구 대상 유료 전환 테스트(가격 가설) + KPI(응답·지속·거짓경보) 측정",
    tasks: [
      "무료 체험 → 유료 전환 퍼널 구성(가격 A/B)",
      "핵심 KPI(응답률·4주 지속률·거짓경보율·전환율) 대시보드화",
      "이탈 가구 인터뷰 루프 상시화",
      "결제·자동갱신·해지 고지 등 전자상거래 요건 정비",
    ],
    output: "손에 남는 것 — 검증된 가격 가설, 유닛 이코노믹스 초안, 트랙션 지표 세트",
    next: "유료 전환·지속률이 기준을 넘으면 → 확장(기관 B2B/통신사 제휴). 이탈이 크면 가치·가격 재설계.",
    signal: "다음 신호 — 4주 지속률·유료 전환율이 목표선 도달 · LTV>CAC 성립",
    watchout: "흔한 실수 — '무료 사용자 수'에 취하기. 유료 전환과 지속률이 진짜 지표다.",
  },
  {
    code: "STEP 5",
    title: "채널을 늘려 확장하기",
    todo: "요양·복지기관 B2B 파일럿 1곳 + 통신사 제휴 접점 타진",
    tasks: [
      "요양·복지기관 1곳과 좌석제 파일럿 계약",
      "기관 세일즈 자료(효과 데이터·보안·규제 대응) 패키지화",
      "통신사·보험사 제휴 접점 타진 및 제안서",
      "예비창업패키지·TIPS 등 지원사업 병행 신청",
    ],
    output: "손에 남는 것 — 재현 가능한 B2B 세일즈 플레이북, 제휴 파이프라인, 투자 IR 초안",
    next: "기관·제휴에서 반복 가능한 계약 공식이 나오면 → 스케일업/투자 라운드.",
    signal: "다음 신호 — 재현 가능한 B2B 세일즈 사이클 · 첫 제휴 LOI 확보",
    watchout: "흔한 실수 — 검증 전에 채널부터 늘리기. B2C 유닛 이코노믹스가 먼저 서야 확장이 레버가 된다.",
  },
];

/* ── 지원사업 ── */
const SUPPORT_PROGRAMS = [
  {
    name: "예비창업패키지",
    org: "중소벤처기업부 · 창업진흥원",
    fit: "높음",
    amount: "최대 1억원 (평균 약 5천만원)",
    status: "모집 예정 (통상 연 1회·상반기)",
    eligible: "공고일 기준 사업자등록이 없는 예비창업자. 팀 구성·아이템 보유 시 유리.",
    why: "0→1 구간의 사업화 자금과 멘토링을 동시에 받는 대표 트랙. 헬스케어·SW 아이템 + 임상 자문 스토리가 심사에서 강점으로 작동해, 초기 검증(파일럿) 비용을 충당하기 좋습니다.",
    prepare: "사업계획서(PSST 구조), 팀 이력, 아이템 차별성·시장성 근거, (있다면) 초기 인터뷰·파일럿 데이터.",
    tip: "발표·서류에서 '진단·이상 감지' 같은 의료 표현을 빼고 '건강관리 정보 제공'으로 서술 → 규제 리스크 질문을 미리 방어. 임상 자문은 신뢰 카드로 전면에.",
  },
  {
    name: "고령친화산업 실증·지원사업",
    org: "보건복지부 · 관련 진흥원",
    fit: "높음",
    amount: "과제별 상이 (실증비·인프라 지원)",
    status: "수시·연간 공고",
    eligible: "고령친화·시니어 케어 관련 제품/서비스를 보유하고 실증(현장 검증)이 필요한 기업.",
    why: "우리 도메인(시니어 케어)에 정확히 꽂히는 트랙입니다. 요양·복지기관 실증 파일럿과 자금이 직접 연결돼, STEP 3~5의 기관 검증을 국비로 돌릴 수 있습니다.",
    prepare: "실증 계획(대상 기관·인원·기간·지표), 안전·개인정보 대응 방안, 협력 기관 의향서(LOI).",
    tip: "실증 지표에 응답률·지속률 같은 우리 핵심 KPI를 넣어두면, 과제 수행이 곧 제품 검증이 됩니다.",
  },
  {
    name: "TIPS (민간투자주도형 기술창업)",
    org: "중기부 · 운영사(액셀러레이터)",
    fit: "중간~높음",
    amount: "R&D 최대 5억원 + 운영사 투자 연계",
    status: "운영사 추천·선발 필요",
    eligible: "운영사(엔젤·AC)로부터 선투자를 받은 기술 창업기업.",
    why: "임상 자문·AI 음성 기술이라는 기술성 스토리를 살리기 좋은 대형 트랙. R&D 자금과 후속 투자·네트워크를 함께 얻어 스케일업(STEP 5) 연료가 됩니다.",
    prepare: "기술성·시장성 IR, 운영사 컨택·선투자 유치, 팀의 기술 역량 증빙.",
    tip: "먼저 TIPS 운영사와의 관계 형성이 관문. 초기 트랙션(유료 전환·지속률)을 만들어 운영사 설득 자료로 쓰세요.",
  },
  {
    name: "초기창업패키지",
    org: "창업진흥원",
    fit: "중간",
    amount: "최대 1억원",
    status: "창업 3년 이내 대상",
    eligible: "사업자등록 후 3년 이내 초기 창업기업.",
    why: "예비창업 단계를 지나 법인 설립·초기 트랙션을 확보한 뒤 이어받기 좋은 트랙. 검증된 지표가 있으면 선정 확률이 올라갑니다.",
    prepare: "사업자등록증, 초기 매출·트랙션 지표, 성장 계획서.",
    tip: "예비창업패키지 → 초기창업패키지로 이어지는 정부지원 사다리를 미리 설계해두면 자금 공백을 줄일 수 있습니다.",
  },
  {
    name: "창업도약패키지",
    org: "창업진흥원",
    fit: "중간",
    amount: "최대 3억원 규모",
    status: "창업 3~7년 도약기 대상",
    eligible: "업력 3~7년의 도약기 기업(사업모델 고도화·스케일업 단계).",
    why: "PMF 이후 스케일 구간에서 사업모델 고도화·판로 확장 자금으로 유효. 지금 단계보다는 검증 이후를 위한 '다음 카드'로 기억해 둘 것.",
    prepare: "매출·지표 성장 근거, 스케일업/판로 계획.",
    tip: "지금 바로는 이르지만, 로드맵 STEP 4~5를 넘긴 뒤를 겨냥해 미리 요건을 파악해두면 좋습니다.",
  },
];

const ARTIFACTS = [
  { t: "진단 리포트", d: "구조화 요약 + 가중 점수 + 장단점·리스크·검증 가정", file: "/docs/diagnostic_report.pdf" },
  { t: "린 캔버스", d: "9블록 — 문제·고객·UVP·솔루션·채널·수익·비용·지표·강점", file: "/docs/lean_canvas.pdf" },
  { t: "개인 vs 법인 비교표", d: "신뢰도·투자·책임·세제 기준 의사결정 표", file: "/docs/business_comparison.pdf" },
  { t: "보호자 인터뷰 가이드", d: "통증·대안·지불의사·음성 수용도 질문 세트", file: "/docs/interview_guide.pdf" },
  { t: "IR 한 장", d: "문제→솔루션→시장→BM→트랙션→팀→Ask", file: "/docs/one_page_ir.pdf" },
  { t: "예창패 사업계획서 골격", d: "PSST 구조 초안 (서식·일정 확인 필요)", file: "/docs/yechangpae_proposal.pdf" },
];

/* ─────────────── 공통 UI ─────────────── */

function Mono({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`font-mono text-[10px] sm:text-[11px] tracking-wider uppercase ${className}`}>{children}</span>;
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div className="font-mono text-[10px] sm:text-[11px] tracking-[0.18em] uppercase text-indigo-600 font-semibold mb-2 sm:mb-3">{children}</div>;
}

function SectionHead({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div className="mb-5">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-neutral-900 break-keep">{title}</h1>
      {sub && <p className="mt-1.5 text-xs sm:text-sm text-neutral-500 break-keep">{sub}</p>}
    </div>
  );
}

function IdeaBanner() {
  return (
    <div className="p-3 bg-neutral-100 rounded-xl border border-neutral-200 text-xs text-neutral-700 mb-5 font-medium break-keep">
      <span className="font-bold text-indigo-600">[대상 아이디어] </span>{SAMPLE_INPUT}
    </div>
  );
}

function PrimaryButton({ children, onClick, full = false }: { children: React.ReactNode; onClick?: () => void; full?: boolean }) {
  return (
    <button onClick={onClick} className={`group inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-4 py-3 text-xs sm:text-sm font-semibold text-white transition-colors hover:bg-neutral-800 ${full ? "w-full" : ""}`}>
      {children}
      <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
    </button>
  );
}

function Locked({ locked, title, children, pinTop = false, onUnlock }: { locked: boolean; title: string; children: React.ReactNode; pinTop?: boolean; onUnlock: () => void }) {
  if (!locked) return <>{children}</>;
  return (
    <div className="relative w-full h-full">
      <div className="pointer-events-none select-none opacity-30 blur-[4px] overflow-hidden" aria-hidden="true">
        {children}
      </div>
      <div className={`absolute inset-0 flex justify-center p-4 z-10 ${pinTop ? "items-start pt-6" : "items-center"}`}>
        <div className="w-full max-w-xs sm:max-w-sm rounded-2xl border border-neutral-200 bg-white/95 p-4 sm:p-5 text-center shadow-lg backdrop-blur-sm">
          <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 mb-2.5">
            <Lock size={16} />
          </div>
          <div className="text-xs sm:text-sm font-bold text-neutral-900 break-keep">{title}</div>
          <button onClick={onUnlock} className="mt-3.5 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md transition-transform hover:-translate-y-0.5" style={{ background: ACCENT_GRAD }}>
            결제하고 전체 보기
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* 클릭하면 상세가 펼쳐지는 행 */
function ExpandRow({ title, icon, badge, badgeClass = "", children, defaultOpen = false }: { title: string; icon?: React.ReactNode; badge?: string; badgeClass?: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`rounded-xl border bg-white transition-colors ${open ? "border-neutral-900" : "border-neutral-200 hover:border-neutral-300"}`}>
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center gap-2 p-3.5 text-left focus:outline-none">
        {icon}
        <span className="text-xs sm:text-sm font-bold text-neutral-900 flex-1 min-w-0 break-keep">{title}</span>
        {badge && <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border shrink-0 ${badgeClass}`}>{badge}</span>}
        <ChevronRight size={15} className={`text-neutral-400 shrink-0 transition-transform ${open ? "rotate-90" : ""}`} />
      </button>
      {open && <div className="px-3.5 pb-3.5 -mt-0.5 text-xs text-neutral-600 leading-relaxed break-keep space-y-2.5">{children}</div>}
    </div>
  );
}

/* 상세 블록 (라벨 + 본문) — 자세히 보기 내부에서 재사용 */
function DetailBlock({ label, text, tone = "neutral", icon }: { label: string; text: string; tone?: "neutral" | "good" | "accent" | "warn"; icon?: React.ReactNode }) {
  const box = {
    neutral: "bg-neutral-50 border-neutral-100",
    good: "bg-emerald-50/60 border-emerald-100",
    accent: "bg-indigo-50/50 border-indigo-100",
    warn: "bg-amber-50/60 border-amber-100",
  }[tone];
  const lab = {
    neutral: "text-neutral-500",
    good: "text-emerald-600",
    accent: "text-indigo-600",
    warn: "text-amber-700",
  }[tone];
  return (
    <div className={`rounded-lg border p-2.5 ${box}`}>
      <div className={`text-[10px] font-bold mb-1 flex items-center gap-1 ${lab}`}>{icon}{label}</div>
      <p className="text-neutral-600 leading-relaxed">{text}</p>
    </div>
  );
}

/* 비율 강조용 가로 스택 막대 */
function StackedBar({ data }: { data: { label: string; pct: number }[] }) {
  const colors = ["#4F46E5", "#7C3AED", "#DB2777", "#F59E0B", "#10B981"];
  return (
    <div>
      <div className="flex h-4 w-full overflow-hidden rounded-full border border-neutral-100">
        {data.map((d, i) => (
          <div key={i} style={{ width: `${d.pct}%`, background: colors[i % colors.length] }} />
        ))}
      </div>
      <ul className="mt-3 space-y-1.5">
        {data.map((d, i) => (
          <li key={i} className="flex items-center gap-2 text-xs">
            <span className="h-2.5 w-2.5 rounded-sm shrink-0" style={{ background: colors[i % colors.length] }} />
            <span className="text-neutral-600 flex-1 break-keep">{d.label}</span>
            <span className="font-mono font-bold text-neutral-900 shrink-0">{d.pct}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* 판매량/추이 막대 그래프 (픽셀 높이 — 퍼센트 높이는 부모가 auto라 0으로 계산됨) */
function BarChart({ data, unit }: { data: { year: string; v: number }[]; unit?: string }) {
  const max = Math.max(...data.map((d) => d.v));
  const H = 120; // 막대 최대 높이(px)
  const fmt = (v: number) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : `${v}`);
  return (
    <div>
      <div className="flex items-end gap-2 sm:gap-3" style={{ height: H + 26 }}>
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1">
            <span className="text-[9px] sm:text-[10px] font-mono font-bold text-neutral-500">{fmt(d.v)}</span>
            <div className="w-full rounded-t-md bg-gradient-to-t from-indigo-500 to-violet-400" style={{ height: Math.max(4, (d.v / max) * H) }} />
            <span className="text-[10px] text-neutral-400 font-mono">{d.year}</span>
          </div>
        ))}
      </div>
      {unit && <div className="text-[10px] text-neutral-400 mt-2 text-right">{unit}</div>}
    </div>
  );
}

/* ─────────────── 네비게이션 ─────────────── */

function DemoNav({ view, setView, paid, setPaid }: { view: string; setView: (v: string) => void; paid: boolean; setPaid: (v: boolean) => void }) {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/90 backdrop-blur-md shrink-0">
      <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center gap-2 sm:gap-3 px-4 sm:px-5 py-2.5 sm:h-16">
        <div className="flex items-center justify-between w-full sm:w-auto shrink-0">
          <Link href="/" className="flex items-center gap-2 cursor-pointer active:scale-95 transition-transform" aria-label="B Essential 공식 홈페이지로 이동">
            <Image src="/logo.svg" alt="B Essential" width={104} height={18} priority className="sm:w-[118px] sm:h-[20px]" />
          </Link>
          <div className="flex sm:hidden items-center gap-1 rounded-full border border-neutral-200 bg-neutral-50 p-0.5 scale-90">
            <button onClick={() => setPaid(false)} className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${!paid ? "bg-neutral-900 text-white" : "text-neutral-500"}`}>무료</button>
            <button onClick={() => setPaid(true)} className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${paid ? "text-white" : "text-neutral-500"}`} style={paid ? { background: ACCENT_GRAD } : {}}>결제</button>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1 rounded-full border border-neutral-200 bg-neutral-50 p-0.5 shrink-0">
          <button onClick={() => setPaid(false)} className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${!paid ? "bg-neutral-900 text-white" : "text-neutral-500 hover:text-neutral-900"}`}>무료</button>
          <button onClick={() => setPaid(true)} className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${paid ? "text-white" : "text-neutral-500 hover:text-neutral-900"}`} style={paid ? { background: ACCENT_GRAD } : {}}>결제 후</button>
        </div>

        <div className="relative w-full sm:flex-1 sm:min-w-0">
          <nav className="w-full flex items-center gap-0.5 overflow-x-auto whitespace-nowrap scrollbar-none py-1 sm:py-0 sm:justify-end pr-5 sm:pr-6" style={{ scrollbarWidth: "none" }}>
            {VIEWS.map((v) => {
              const active = view === v.id;
              return (
                <button key={v.id} onClick={() => setView(v.id)} className={`flex shrink-0 items-center gap-1 rounded-full px-2 sm:px-2.5 py-1 sm:py-1.5 transition-colors focus:outline-none ${active ? "bg-neutral-900 text-white" : "text-neutral-500 hover:text-neutral-900"}`}>
                  <Mono className={`text-[9px] sm:text-[10px] ${active ? "text-indigo-200" : "text-neutral-400"}`}>{v.code}</Mono>
                  <span className="text-[11px] sm:text-xs font-bold">{v.label}</span>
                </button>
              );
            })}
          </nav>
          {/* 가로 스크롤 힌트: 오른쪽 페이드 */}
          <div className="pointer-events-none absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-white to-transparent" />
        </div>
      </div>
    </header>
  );
}

/* ─────────────── 화면들 ─────────────── */

function DemoMainDashboard({ onStart, onDemo }: { onStart: () => void; onDemo: () => void }) {
  return (
    <div className="h-full w-full flex flex-col justify-center items-center px-4 py-8 bg-neutral-50 overflow-y-auto scrollbar-none select-none">
      <div className="max-w-xl w-full text-center bg-white border border-neutral-200 rounded-2xl p-6 sm:p-10 shadow-sm">
        <Eyebrow>B ESSENTIAL DEMO SANDBOX</Eyebrow>
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-neutral-900 mt-1">사업화 시뮬레이터 데모 샌드박스</h1>
        <p className="mt-3 text-xs sm:text-sm leading-relaxed text-neutral-500 break-keep">
          본 화면은 대시보드 내부 로직을 점검하기 위한 테스트 샌드박스 공간입니다. 내 아이디어를 가상으로 타이핑하거나 내장 버전을 실시간 빌드 처리할 수 있습니다.
        </p>
        <div className="mt-6 sm:mt-8 flex flex-col gap-2.5 w-full">
          <button onClick={onStart} className="w-full flex items-center justify-between gap-2 rounded-xl bg-neutral-900 px-4 sm:px-5 py-3.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-neutral-800 transition-all group text-left">
            <span>🚀 내 아이디어 직접 진단 가상 입력</span>
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-1 shrink-0" />
          </button>
          <button onClick={onDemo} className="w-full flex items-center justify-between gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-4 sm:px-5 py-3.5 text-xs sm:text-sm font-bold text-neutral-800 hover:bg-neutral-100 transition-all group text-left">
            <span>📊 의료 AI 콜 가상 빌드 결과 즉시 조회</span>
            <ChevronRight size={15} className="text-neutral-400 transition-transform group-hover:translate-x-1 shrink-0" />
          </button>
        </div>
        <div className="mt-6 sm:mt-8 pt-5 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between text-[10px] text-neutral-400 font-medium gap-1">
          <span>인프라: 샌드박스 컴파일러 정상 구동 중</span>
          <Mono>© 2026 B ESSENTIAL</Mono>
        </div>
      </div>
    </div>
  );
}

const BM_FIELDS = [
  { key: "problem", label: "문제", q: "누구의 어떤 문제를 푸나요?", ph: "예) 경도인지장애 부모를 둔 보호자가 부모 상태를 매일 확인하기 어렵다" },
  { key: "customer", label: "고객", q: "핵심 고객은 누구인가요?", ph: "예) 비동거 40~60대 자녀 / 요양·복지기관 / 통신사" },
  { key: "solution", label: "솔루션", q: "어떻게 해결하나요?", ph: "예) 보호자 음성 AI가 매일 안부 전화 → 대화 분석 → 앱 기록·이상 알림" },
  { key: "revenue", label: "수익모델", q: "어떻게 돈을 버나요?", ph: "예) 보호자 월 구독 + 기관 B2B 좌석제 + 통신사 제휴 수수료" },
  { key: "edge", label: "차별점", q: "경쟁 대비 강점은 무엇인가요?", ph: "예) 낯선 기계음이 아닌 익숙한 보호자 목소리 + 임상 자문 네트워크" },
];

function IdeaInput({ onSubmit }: { onSubmit: () => void }) {
  const [oneLiner, setOneLiner] = useState(SAMPLE_INPUT);
  const [values, setValues] = useState<Record<string, string>>({});
  const [active, setActive] = useState<string | null>(BM_FIELDS[0].key);

  const filledCount = BM_FIELDS.filter((f) => (values[f.key] || "").trim().length > 0).length;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:py-10 h-full overflow-y-auto scrollbar-none">
      <SectionHead eyebrow="STEP 01 · 아이디어 가상 가입" title="어떤 아이디어인가요?" sub="아래 칸을 눌러 사업 정보를 항목별로 입력하면, AI가 더 정확하게 진단합니다." />

      <div className="mt-1">
        <label className="mb-1.5 block text-[11px] sm:text-xs font-bold text-neutral-600">아이디어 한 줄 요약</label>
        <textarea rows={2} value={oneLiner} onChange={(e) => setOneLiner(e.target.value)} className="w-full resize-none rounded-xl border border-neutral-300 p-3 sm:p-4 text-xs sm:text-sm leading-relaxed text-neutral-900 focus:border-neutral-900 focus:outline-none" />
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="text-[11px] sm:text-xs font-bold text-indigo-600 tracking-wide">비즈니스 모델 · 항목별 입력</div>
        <span className="font-mono text-[10px] sm:text-[11px] text-neutral-400">{filledCount}/{BM_FIELDS.length} 작성됨</span>
      </div>

      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {BM_FIELDS.map((f) => {
          const isActive = active === f.key;
          const val = values[f.key] || "";
          const filled = val.trim().length > 0;
          return (
            <div
              key={f.key}
              role="button"
              tabIndex={0}
              onClick={() => setActive(f.key)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setActive(f.key); } }}
              className={`cursor-pointer text-left rounded-xl border p-3.5 transition-all focus:outline-none ${
                isActive ? "border-neutral-900 bg-white shadow-md sm:col-span-2" : filled ? "border-indigo-200 bg-indigo-50/40 hover:border-indigo-300" : "border-neutral-200 bg-white hover:border-neutral-400"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-900">{f.label}</span>
                {filled && <CheckCircle2 size={14} className="text-indigo-500 shrink-0" />}
              </div>
              {isActive ? (
                <div onClick={(e) => e.stopPropagation()}>
                  <p className="mt-1.5 mb-2 text-[11px] text-neutral-500 break-keep">{f.q}</p>
                  <textarea autoFocus rows={3} value={val} placeholder={f.ph} onChange={(e) => setValues((prev) => ({ ...prev, [f.key]: e.target.value }))} className="w-full resize-none rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs leading-relaxed text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:bg-white focus:outline-none" />
                </div>
              ) : (
                <p className={`mt-1 text-[11px] leading-relaxed break-keep line-clamp-2 ${filled ? "text-neutral-600" : "text-neutral-400"}`}>{filled ? val : f.q}</p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-5">
        <PrimaryButton onClick={onSubmit} full>진단 및 비즈니스 매핑 시작</PrimaryButton>
      </div>
    </div>
  );
}

/* 02 · 종합 진단 (가중 점수 + 장단점) */
function Diagnosis({ onNext, paid, onUnlock }: { onNext: () => void; paid: boolean; onUnlock: () => void }) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-10 h-full overflow-y-auto scrollbar-none">
      <SectionHead eyebrow="STEP 02 · AI 종합 비즈니스 진단" title="이 아이디어, 지금 점수는?" />
      <IdeaBanner />

      {/* 종합 점수 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center border border-neutral-200 rounded-xl bg-white p-4 sm:p-6 shadow-sm mb-5">
        <div className="text-center md:border-r border-neutral-200 py-1 md:py-2">
          <div className="flex items-center justify-center gap-1.5 text-indigo-600 mb-1"><Gauge size={16} /><span className="text-[10px] font-bold uppercase tracking-wider">가중 종합 점수</span></div>
          <div className="text-5xl sm:text-6xl font-black text-indigo-600">{TOTAL_SCORE}<span className="text-xs sm:text-sm font-normal text-neutral-400"> / 100</span></div>
          <div className="text-[10px] sm:text-[11px] text-neutral-400 font-bold mt-1">분야별 가중치로 합산</div>
        </div>
        <div className="md:col-span-2 space-y-2.5">
          {SCORE_AXES.map((a, i) => (
            <div key={i}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-neutral-700 font-semibold flex items-center gap-1.5">{a.label}<span className="text-[9px] font-mono text-indigo-500 bg-indigo-50 rounded px-1 py-0.5">{a.weight}%</span></span>
                <span className="font-mono font-bold text-neutral-900">{a.score}</span>
              </div>
              <div className="h-2 rounded-full bg-neutral-100 overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${a.score}%` }} />
              </div>
              <p className="text-[10px] text-neutral-400 mt-1 break-keep leading-normal">{a.why}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 장점 / 단점 — 클릭 시 상세 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="text-xs font-bold text-emerald-600 mb-2.5 flex items-center gap-1.5"><ThumbsUp size={14} /> 장점 <span className="text-neutral-400 font-normal">· 눌러서 상세 보기</span></div>
          <div className="space-y-2">
            {PROS.map((p, i) => (
              <ExpandRow key={i} title={p.t} icon={<CheckCircle2 size={15} className="text-emerald-500 shrink-0" />} defaultOpen={i === 0}>
                <DetailBlock label="왜 강점인가 (메커니즘)" text={p.mechanism} tone="good" icon={<Sparkles size={11} />} />
                <DetailBlock label="근거" text={p.evidence} tone="neutral" icon={<Search size={11} />} />
                <DetailBlock label="그래서 (사업적 함의)" text={p.implication} tone="accent" icon={<Lightbulb size={11} />} />
              </ExpandRow>
            ))}
          </div>
        </div>
        <div>
          <div className="text-xs font-bold text-rose-600 mb-2.5 flex items-center gap-1.5"><ThumbsDown size={14} /> 단점 <span className="text-neutral-400 font-normal">· 눌러서 상세 보기</span></div>
          <Locked locked={!paid} title="단점 상세 진단 잠김" onUnlock={onUnlock} pinTop>
            <div className="space-y-2">
              {CONS.map((c, i) => (
                <ExpandRow key={i} title={c.t} icon={<AlertTriangle size={15} className="text-rose-400 shrink-0" />} defaultOpen={i === 0}>
                  <DetailBlock label="왜 약점인가 (메커니즘)" text={c.mechanism} tone="warn" icon={<AlertTriangle size={11} />} />
                  <DetailBlock label="근거" text={c.evidence} tone="neutral" icon={<Search size={11} />} />
                  <DetailBlock label="그래서 (무엇을 해야 하나)" text={c.implication} tone="accent" icon={<Lightbulb size={11} />} />
                </ExpandRow>
              ))}
            </div>
          </Locked>
        </div>
      </div>

      <div className="mt-5">
        <PrimaryButton onClick={onNext} full>비즈니스 모델 정리 보기</PrimaryButton>
      </div>
    </div>
  );
}

/* 린 캔버스 한 칸 */
function CanvasCell({ id, mode, className = "" }: { id: string; mode: "before" | "after"; className?: string }) {
  const b = CANVAS[id];
  return (
    <div className={`rounded-lg border p-2.5 flex flex-col ${mode === "after" ? "border-indigo-200 bg-indigo-50/30" : "border-neutral-200 bg-neutral-50"} ${className}`}>
      <div className={`text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider mb-1.5 ${mode === "after" ? "text-indigo-500" : "text-neutral-400"}`}>{b.label}</div>
      {mode === "before" ? (
        <p className="text-[11px] text-neutral-400 break-keep leading-relaxed">{b.before}</p>
      ) : (
        <ul className="space-y-1">
          {b.after.map((t, i) => (
            <li key={i} className="text-[11px] text-neutral-700 break-keep leading-relaxed flex gap-1">
              <span className="text-indigo-400 shrink-0">·</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function CanvasGrid({ mode }: { mode: "before" | "after" }) {
  return (
    <>
      {/* 데스크톱: 클래식 린 캔버스 배치 */}
      <div className="hidden md:block">
        <div className="grid grid-cols-5 grid-rows-2 gap-2" style={{ minHeight: 300 }}>
          <CanvasCell id="problem" mode={mode} className="row-span-2" />
          <CanvasCell id="solution" mode={mode} />
          <CanvasCell id="uvp" mode={mode} className="row-span-2" />
          <CanvasCell id="advantage" mode={mode} />
          <CanvasCell id="segment" mode={mode} className="row-span-2" />
          <CanvasCell id="metrics" mode={mode} />
          <CanvasCell id="channel" mode={mode} />
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <CanvasCell id="cost" mode={mode} />
          <CanvasCell id="revenue" mode={mode} />
        </div>
      </div>
      {/* 모바일: 순서대로 스택 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:hidden gap-2">
        {["problem", "solution", "uvp", "advantage", "segment", "metrics", "channel", "cost", "revenue"].map((id) => (
          <CanvasCell key={id} id={id} mode={mode} />
        ))}
      </div>
    </>
  );
}

/* 03 · 비즈니스 모델 (린 캔버스 Before/After) */
function BusinessModel({ onNext, paid, onUnlock }: { onNext: () => void; paid: boolean; onUnlock: () => void }) {
  const [mode, setMode] = useState<"before" | "after">("after");
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:py-10 h-full overflow-y-auto scrollbar-none">
      <SectionHead eyebrow="STEP 03 · 비즈니스 모델 · 린 캔버스" title="내 입력 → 유료 진단이 완성한 캔버스" sub="처음 적은 한 줄짜리 입력이, 9블록 린 캔버스로 어떻게 채워지는지 비교해 보세요." />

      {/* Before / After 토글 */}
      <div className="flex items-center gap-1 rounded-full border border-neutral-200 bg-neutral-50 p-0.5 w-fit mb-4">
        <button onClick={() => setMode("before")} className={`rounded-full px-3.5 py-1.5 text-[11px] sm:text-xs font-bold transition-colors ${mode === "before" ? "bg-neutral-900 text-white" : "text-neutral-500 hover:text-neutral-900"}`}>Before · 내 입력</button>
        <button onClick={() => setMode("after")} className={`rounded-full px-3.5 py-1.5 text-[11px] sm:text-xs font-bold transition-colors ${mode === "after" ? "text-white" : "text-neutral-500 hover:text-neutral-900"}`} style={mode === "after" ? { background: ACCENT_GRAD } : {}}>After · AI 완성본</button>
      </div>

      {/* 캔버스 */}
      {mode === "after" ? (
        <Locked locked={!paid} title="AI가 완성한 린 캔버스 (유료)" onUnlock={onUnlock} pinTop>
          <div className="rounded-2xl border border-indigo-100 bg-white p-3 sm:p-4 shadow-sm">
            <div className="flex items-center gap-1.5 mb-3 text-[11px] font-bold text-indigo-600"><Sparkles size={13} /> AFTER · 유료 진단 완성본 · 9블록</div>
            <CanvasGrid mode="after" />
          </div>
        </Locked>
      ) : (
        <div className="rounded-2xl border border-neutral-200 bg-white p-3 sm:p-4 shadow-sm">
          <div className="flex items-center gap-1.5 mb-3 text-[11px] font-bold text-neutral-400"><FileText size={13} /> BEFORE · 처음 입력한 내용</div>
          <CanvasGrid mode="before" />
        </div>
      )}

      {/* 사고 과정 */}
      <div className="mt-6">
        <div className="text-xs font-bold text-neutral-900 mb-2.5 flex items-center gap-1.5"><Lightbulb size={14} className="text-amber-500" /> AI가 이렇게 바꾼 이유 <span className="text-neutral-400 font-normal">· 눌러서 상세</span></div>
        <div className="space-y-2">
          {BM_BEFORE_AFTER.map((b, i) => (
            <ExpandRow key={i} title={b.k} badge="Before → After" badgeClass="bg-indigo-50 text-indigo-500 border-indigo-100" defaultOpen={i === 0}>
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1.5fr] gap-2 items-center">
                <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-2.5">
                  <div className="text-[9px] font-mono text-neutral-400 mb-1">BEFORE</div>
                  <p className="text-[11px] text-neutral-500 break-keep line-through decoration-neutral-300">{b.before}</p>
                </div>
                <ArrowRight size={15} className="text-indigo-400 mx-auto rotate-90 sm:rotate-0 shrink-0" />
                <div className="rounded-lg border border-indigo-200 bg-indigo-50/50 p-2.5">
                  <div className="text-[9px] font-mono text-indigo-500 mb-1">AFTER</div>
                  <p className="text-[11px] text-neutral-800 font-medium break-keep">{b.after}</p>
                </div>
              </div>
              <DetailBlock label="왜 이렇게 바꿨나" text={b.why} tone="accent" icon={<Lightbulb size={11} />} />
            </ExpandRow>
          ))}
        </div>
      </div>

      <div className="mt-5"><PrimaryButton onClick={onNext} full>시장조사 결과 보기</PrimaryButton></div>
    </div>
  );
}

/* 04 · 시장조사 */
function MarketResearch({ onNext }: { onNext: () => void }) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-10 h-full overflow-y-auto scrollbar-none">
      <SectionHead eyebrow="STEP 04 · 시장조사" title="시장 규모·수요·추세" sub="전체 수요를 100으로 놓고 각 니즈가 차지하는 비중을 함께 봅니다." />

      {/* 시장 규모 TAM/SAM/SOM */}
      <div className="border border-neutral-200 rounded-xl bg-white p-4 sm:p-5 shadow-sm mb-4">
        <div className="text-xs font-bold text-neutral-900 mb-3 flex items-center gap-1.5"><Target size={14} className="text-indigo-500" /> 시장 규모 (TAM · SAM · SOM)</div>
        <div className="space-y-2.5">
          {MARKET_SIZE.map((m, i) => (
            <div key={i}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-neutral-700"><span className="font-mono text-indigo-500 mr-1.5">{m.k}</span>{m.label}</span>
                <span className="font-mono font-bold text-neutral-900 shrink-0 ml-2">{m.value}</span>
              </div>
              <div className="h-2.5 rounded-full bg-neutral-100 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${m.w}%`, background: ACCENT_GRAD }} />
              </div>
              <p className="text-[10px] text-neutral-400 mt-1 break-keep">{m.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 수요가 실재한다는 근거 지표 */}
      <div className="border border-neutral-200 rounded-xl bg-white p-4 sm:p-5 shadow-sm mb-4">
        <div className="text-xs font-bold text-neutral-900 mb-3 flex items-center gap-1.5"><Search size={14} className="text-indigo-500" /> 관련 수요 지표 상세 (실재 근거)</div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          {DEMAND_EVIDENCE.map((d, i) => (
            <div key={i} className="rounded-lg border border-neutral-100 bg-neutral-50/50 p-2.5">
              <div className="text-lg sm:text-xl font-black text-indigo-600 leading-none">{d.stat}</div>
              <div className="text-[11px] font-semibold text-neutral-700 mt-1.5 break-keep leading-tight">{d.label}</div>
              <p className="text-[10px] text-neutral-400 mt-1 break-keep leading-normal">{d.note}</p>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-neutral-400 mt-2.5">※ 수치는 방향성 이해용 추정치이며, 진행 시 통계청·복지부 공식 자료로 재확인 권장</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 수요 지표 비율 */}
        <div className="border border-neutral-200 rounded-xl bg-white p-4 sm:p-5 shadow-sm">
          <div className="text-xs font-bold text-neutral-900 mb-3 flex items-center gap-1.5"><Users size={14} className="text-indigo-500" /> 관련 수요 비중 (전체=100)</div>
          <StackedBar data={DEMAND_SPLIT} />
        </div>
        {/* 판매량 그래프 */}
        <div className="border border-neutral-200 rounded-xl bg-white p-4 sm:p-5 shadow-sm">
          <div className="text-xs font-bold text-neutral-900 mb-3 flex items-center gap-1.5"><TrendingUp size={14} className="text-indigo-500" /> 예상 유료 가구 추이</div>
          <BarChart data={SALES_TREND} unit="단위: 유료 가구 수 (시뮬레이션)" />
        </div>
      </div>

      {/* 시장 추세와 요인 */}
      <div className="border border-neutral-200 rounded-xl bg-white p-4 sm:p-5 shadow-sm mt-4">
        <div className="text-xs font-bold text-neutral-900 mb-3 flex items-center gap-1.5"><Activity size={14} className="text-indigo-500" /> 시장 사이즈 추세와 요인</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {MARKET_DRIVERS.map((d, i) => (
            <div key={i} className="flex items-start gap-2 rounded-lg border border-neutral-100 bg-neutral-50/50 p-2.5">
              {d.dir === "up" ? <TrendingUp size={15} className="text-emerald-500 shrink-0 mt-0.5" /> : <TrendingDown size={15} className="text-rose-400 shrink-0 mt-0.5" />}
              <div>
                <div className="text-xs font-bold text-neutral-800">{d.t}</div>
                <p className="text-[11px] text-neutral-500 mt-0.5 break-keep leading-normal">{d.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5"><PrimaryButton onClick={onNext} full>유사 서비스 분석 보기</PrimaryButton></div>
    </div>
  );
}

/* 05 · 유사 서비스 + 관련 사례 */
function Competitors({ onNext }: { onNext: () => void }) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-10 h-full overflow-y-auto scrollbar-none">
      <SectionHead eyebrow="STEP 05 · 유사 서비스 · 관련 사례" title="누가 이미 하고 있나?" sub="경쟁·유사 서비스의 핵심 기능과, 내 아이디어와의 차별점을 정리했습니다." />

      <div className="text-xs font-bold text-neutral-900 mb-2.5 flex items-center gap-1.5"><Search size={14} className="text-indigo-500" /> 유사 서비스 분석 <span className="text-neutral-400 font-normal">· 눌러서 강점·약점·차별점</span></div>
      <div className="space-y-2.5">
        {COMPETITORS.map((c, i) => (
          <ExpandRow
            key={i}
            title={c.name}
            icon={<Landmark size={15} className="text-indigo-400 shrink-0" />}
            badge={c.link !== "-" ? c.link : undefined}
            badgeClass="bg-indigo-50 text-indigo-500 border-indigo-100"
            defaultOpen={i === 0}
          >
            <div className="flex flex-wrap gap-1 -mt-0.5">
              {c.tags.map((t, k) => (
                <span key={k} className="text-[9px] font-mono text-neutral-500 bg-neutral-100 border border-neutral-200 rounded px-1.5 py-0.5">{t}</span>
              ))}
            </div>
            <DetailBlock label="집중 영역·주요 내용" text={c.focus} tone="neutral" icon={<Search size={11} />} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <DetailBlock label="강점" text={c.strength} tone="good" icon={<ThumbsUp size={11} />} />
              <DetailBlock label="약점 (우리의 기회)" text={c.weakness} tone="warn" icon={<ThumbsDown size={11} />} />
            </div>
            <DetailBlock label="내 아이디어와의 차별점" text={c.diff} tone="accent" icon={<Sparkles size={11} />} />
          </ExpandRow>
        ))}
      </div>

      <div className="text-xs font-bold text-neutral-900 mb-2.5 mt-6 flex items-center gap-1.5"><Landmark size={14} className="text-indigo-500" /> 관련 사례 (진행도·과정)</div>
      <div className="space-y-2">
        {CASES.map((c, i) => (
          <ExpandRow key={i} title={c.name} badge={c.stage} badgeClass="bg-neutral-100 text-neutral-500 border-neutral-200" defaultOpen={i === 0}>
            <p>{c.story}</p>
          </ExpandRow>
        ))}
      </div>

      <div className="mt-5"><PrimaryButton onClick={onNext} full>리스크 진단 보기</PrimaryButton></div>
    </div>
  );
}

/* 06 · 리스크 (규제·법률) */
function Risk({ onNext, paid, onUnlock }: { onNext: () => void; paid: boolean; onUnlock: () => void }) {
  const levelClass = (lv: string) => (lv === "높음" ? "bg-red-50 text-red-600 border-red-100" : "bg-amber-50 text-amber-700 border-amber-200");
  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:py-10 h-full overflow-y-auto scrollbar-none">
      <SectionHead eyebrow="STEP 06 · 리스크 · 규제 · 법률" title="무엇이 발목을 잡는가" sub="위험도와 근거, 그리고 현실적인 대응책·우회법을 함께 제시합니다." />
      <div className="space-y-2.5">
        {RISKS.map((r, i) => (
          <ExpandRow key={i} title={r.t} icon={<Scale size={15} className="text-indigo-500 shrink-0" />} badge={`위험도 ${r.level}`} badgeClass={levelClass(r.level)} defaultOpen={i === 0}>
            <div className="rounded-lg bg-neutral-50 border border-neutral-100 p-2.5">
              <div className="text-[10px] font-bold text-neutral-500 mb-1">근거</div>
              <p className="text-neutral-600">{r.basis}</p>
            </div>
            <Locked locked={!paid} title="현실적 솔루션·우회법 잠김" onUnlock={onUnlock} pinTop>
              <div className="rounded-lg bg-emerald-50/60 border border-emerald-100 p-2.5">
                <div className="text-[10px] font-bold text-emerald-600 mb-1 flex items-center gap-1"><Check size={11} /> 현실적으로 쉬운 대응</div>
                <p className="text-neutral-700">{r.easy}</p>
              </div>
              <div className="rounded-lg bg-indigo-50/50 border border-indigo-100 p-2.5 mt-2">
                <div className="text-[10px] font-bold text-indigo-600 mb-1 flex items-center gap-1"><Rocket size={11} /> 우회·정공 방법</div>
                <p className="text-neutral-700">{r.bypass}</p>
              </div>
            </Locked>
          </ExpandRow>
        ))}
      </div>
      <div className="mt-5"><PrimaryButton onClick={onNext} full>핵심 지표 보기</PrimaryButton></div>
    </div>
  );
}

/* 07 · 핵심 지표 */
function KeyMetrics({ onNext, paid, onUnlock }: { onNext: () => void; paid: boolean; onUnlock: () => void }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:py-10 h-full overflow-y-auto scrollbar-none">
      <SectionHead eyebrow="STEP 07 · 핵심 지표" title="무엇을·누구에게 조사해 뽑을까" sub="측정 방법과 그 지표의 의미, 그리고 어디에 쓰는지까지 연결합니다." />
      <div className="space-y-2.5">
        {METRICS.map((m, i) => (
          <ExpandRow key={i} title={m.name} icon={<Award size={15} className="text-indigo-500 shrink-0" />} defaultOpen={i === 0}>
            <div className="rounded-lg bg-neutral-50 border border-neutral-100 p-2.5">
              <div className="text-[10px] font-bold text-neutral-500 mb-1 flex items-center gap-1"><Search size={11} /> 어떻게·누구에게 조사</div>
              <p className="text-neutral-600">{m.how}</p>
            </div>
            <div className="rounded-lg bg-neutral-50 border border-neutral-100 p-2.5">
              <div className="text-[10px] font-bold text-neutral-500 mb-1">지표의 의미</div>
              <p className="text-neutral-600">{m.meaning}</p>
            </div>
            <Locked locked={!paid} title="지표 활용 방안·목표선 잠김" onUnlock={onUnlock} pinTop>
              <div className="rounded-lg bg-indigo-50/50 border border-indigo-100 p-2.5">
                <div className="text-[10px] font-bold text-indigo-600 mb-1 flex items-center gap-1"><Lightbulb size={11} /> 활용 방안</div>
                <p className="text-neutral-700">{m.use}</p>
              </div>
              <div className="rounded-lg bg-emerald-50/60 border border-emerald-100 p-2.5 flex items-start gap-1.5">
                <Target size={12} className="text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-neutral-700"><span className="font-bold text-emerald-600">기준선: </span>{m.benchmark}</p>
              </div>
            </Locked>
          </ExpandRow>
        ))}
      </div>
      <div className="mt-5"><PrimaryButton onClick={onNext} full>실행 로드맵 보기</PrimaryButton></div>
    </div>
  );
}

/* 08 · 로드맵 (시간이 아닌 단계형) */
function Roadmap({ onNext, paid, onUnlock }: { onNext: () => void; paid: boolean; onUnlock: () => void }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:py-10 h-full overflow-y-auto scrollbar-none">
      <SectionHead eyebrow="STEP 08 · 실행 로드맵" title="'이걸 하면, 다음은 이거'" sub="몇 달 안에 무엇을 하라는 방식이 아니라 — 하나가 되면 그 결과에 따라 다음 스텝으로 넘어가는 조건형 흐름입니다." />
      <div className="space-y-3">
        {ROADMAP_STEPS.map((s, i) => (
          <div key={i} className="relative">
            <div className="border border-neutral-200 rounded-xl bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-[10px] sm:text-xs font-bold px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded shrink-0">{s.code}</span>
                <span className="text-sm font-bold text-neutral-900 break-keep">{s.title}</span>
              </div>
              <div className="flex items-start gap-1.5 text-xs text-neutral-600 break-keep mb-2">
                <ListChecks size={13} className="text-neutral-400 shrink-0 mt-0.5" />
                <span><span className="font-semibold text-neutral-700">지금 할 것: </span>{s.todo}</span>
              </div>
              {!paid ? (
                <div className="text-[11px] text-neutral-300 italic">실행 태스크·산출물·다음 스텝 분기 잠김</div>
              ) : (
                <div className="space-y-2">
                  <ul className="space-y-1 pl-1">
                    {s.tasks.map((t, k) => (
                      <li key={k} className="flex items-start gap-1.5 text-[11px] text-neutral-600 break-keep">
                        <Check size={12} className="text-indigo-400 shrink-0 mt-0.5" /><span>{t}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="rounded-lg bg-neutral-50 border border-neutral-100 p-2.5 text-[11px] text-neutral-600 break-keep flex items-start gap-1.5">
                    <FileText size={12} className="text-neutral-400 shrink-0 mt-0.5" /><span>{s.output}</span>
                  </div>
                  <div className="rounded-lg bg-indigo-50/50 border border-indigo-100 p-2.5 text-[11px] text-neutral-700 break-keep">
                    <span className="font-semibold text-indigo-600">다음 스텝 → </span>{s.next}
                  </div>
                  <div className="flex items-start gap-1.5 text-[11px] text-emerald-700 break-keep">
                    <Target size={12} className="shrink-0 mt-0.5" /><span>{s.signal}</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-[11px] text-amber-700 break-keep">
                    <AlertTriangle size={12} className="shrink-0 mt-0.5" /><span>{s.watchout}</span>
                  </div>
                </div>
              )}
            </div>
            {i < ROADMAP_STEPS.length - 1 && (
              <div className="flex justify-center py-1">
                <ChevronRight size={16} className="text-indigo-300 rotate-90" />
              </div>
            )}
          </div>
        ))}
      </div>
      {!paid && (
        <div className="mt-3">
          <Locked locked title="단계별 분기·판단 기준 전체 잠김" onUnlock={onUnlock}>
            <div className="h-2" />
          </Locked>
        </div>
      )}
      <div className="mt-5"><PrimaryButton onClick={onNext} full>지원사업 매칭 보기</PrimaryButton></div>
    </div>
  );
}

/* 09 · 지원사업 */
function Support({ paid, onUnlock }: { paid: boolean; onUnlock: () => void }) {
  const fitClass = (f: string) => (f.startsWith("높음") || f.includes("높음") ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-200");
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-10 h-full overflow-y-auto scrollbar-none">
      <SectionHead eyebrow="STEP 09 · 지원사업 매칭" title="지금 노려볼 지원사업" sub="아이디어 단계·도메인에 맞는 정부지원사업 후보입니다." />
      <div className="rounded-lg bg-amber-50 border border-amber-200 p-2.5 text-[11px] text-amber-800 mb-4 break-keep flex items-start gap-1.5">
        <AlertTriangle size={13} className="shrink-0 mt-0.5" />
        <span>모집 일정·금액·요건은 <b>수시로 바뀝니다.</b> 진행 시점에 반드시 공식 공고를 확인하세요. (본 화면은 예시)</span>
      </div>
      <Locked locked={!paid} title="지원사업 상세 매칭 리포트 잠김" onUnlock={onUnlock} pinTop>
        <div className="space-y-2.5">
          {SUPPORT_PROGRAMS.map((p, i) => (
            <ExpandRow
              key={i}
              title={p.name}
              icon={<Landmark size={15} className="text-indigo-400 shrink-0" />}
              badge={`적합 ${p.fit}`}
              badgeClass={fitClass(p.fit)}
              defaultOpen={i === 0}
            >
              <div className="flex flex-wrap gap-1.5 -mt-0.5">
                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-neutral-400 bg-neutral-50 border border-neutral-200 rounded px-1.5 py-0.5">{p.org}</span>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-indigo-600 bg-indigo-50 border border-indigo-100 rounded px-1.5 py-0.5">{p.amount}</span>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-neutral-500 bg-neutral-50 border border-neutral-200 rounded px-1.5 py-0.5">{p.status}</span>
              </div>
              <DetailBlock label="지원 자격" text={p.eligible} tone="neutral" icon={<Users size={11} />} />
              <DetailBlock label="왜 이 아이디어에 적합한가" text={p.why} tone="accent" icon={<Sparkles size={11} />} />
              <DetailBlock label="준비물" text={p.prepare} tone="neutral" icon={<FileText size={11} />} />
              <DetailBlock label="합격 팁" text={p.tip} tone="good" icon={<Lightbulb size={11} />} />
            </ExpandRow>
          ))}
        </div>
      </Locked>

      <div className="mt-6 border border-indigo-100 rounded-xl bg-white p-4 sm:p-5 shadow-sm">
        <div className="text-xs font-bold text-indigo-600 mb-3 flex items-center gap-1.5"><FileText size={14} /> 연계 산출물 (다운로드)</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ARTIFACTS.map((a, i) => (
            <a key={i} href={a.file} download={`${a.t}.pdf`} className="group border border-neutral-200 rounded-xl bg-white p-3.5 shadow-sm hover:border-indigo-500 hover:shadow-md transition-all text-left flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-1.5">
                  <FileText size={15} className="text-indigo-600" />
                  <Download size={13} className="text-neutral-400 group-hover:text-indigo-600 transition-colors" />
                </div>
                <div className="text-xs font-bold text-neutral-900 group-hover:text-indigo-600 transition-colors break-keep">{a.t}</div>
                <p className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed break-keep">{a.d}</p>
              </div>
              <div className="mt-2.5 pt-2 border-t border-neutral-100 flex items-center justify-between text-[10px] text-neutral-400 font-semibold">
                <span>PDF 다운로드</span>
                <span className="text-[8px] tracking-wider uppercase font-mono bg-neutral-100 px-1 py-0.5 rounded text-neutral-500">PDF</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function FontStyles() {
  return (
    <style>{`
      @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css');
      body { overflow: hidden; font-family: 'Pretendard', sans-serif; }
      .scrollbar-none::-webkit-scrollbar { display: none; }
      .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
    `}</style>
  );
}

export default function App() {
  const [view, setView] = useState("landing");
  const [paid, setPaid] = useState(false);
  const unlock = () => setPaid(true);

  const order = VIEWS.map((v) => v.id);
  const goNext = () => {
    const i = order.indexOf(view);
    if (i < order.length - 1) setView(order[i + 1]);
  };

  return (
    <div className="h-screen w-screen bg-neutral-50 text-neutral-900 antialiased overflow-hidden flex flex-col">
      <FontStyles />
      <DemoNav view={view} setView={setView} paid={paid} setPaid={setPaid} />

      <main className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div key={view} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="h-full w-full absolute inset-0">
            {view === "landing" && <DemoMainDashboard onStart={() => setView("input")} onDemo={() => setView("diagnosis")} />}
            {view === "input" && <IdeaInput onSubmit={() => setView("diagnosis")} />}
            {view === "diagnosis" && <Diagnosis onNext={goNext} paid={paid} onUnlock={unlock} />}
            {view === "bm" && <BusinessModel onNext={goNext} paid={paid} onUnlock={unlock} />}
            {view === "market" && <MarketResearch onNext={goNext} />}
            {view === "competitors" && <Competitors onNext={goNext} />}
            {view === "risk" && <Risk onNext={goNext} paid={paid} onUnlock={unlock} />}
            {view === "metrics" && <KeyMetrics onNext={goNext} paid={paid} onUnlock={unlock} />}
            {view === "roadmap" && <Roadmap onNext={goNext} paid={paid} onUnlock={unlock} />}
            {view === "support" && <Support paid={paid} onUnlock={unlock} />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
