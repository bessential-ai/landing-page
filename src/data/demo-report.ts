// [DATA] 데모 리포트 단일 소스 — /mockup 과 랜딩 결과예시(/sample)가 함께 재사용한다.
// 원칙: 지어내지 않는다. 시장 수치·출처·실제 사명·지원사업 요건·실제 사례는
//   값을 비우고 confidence:"확인 필요" + TODO(키) 로 남긴다. 논리적 서술(설명·판단 근거)만 채운다.

export type Confidence = "확인됨" | "확인 필요";
export type Tier = "free" | "paid";

export interface Source {
  title: string;
  issuer?: string;
  checkedAt?: string;
  confidence: Confidence;
}

// ── Block: 스텝마다 형태가 다르므로 kind 로 구분하는 discriminated union ──
export type Block =
  | TextBlock
  | VerdictBlock
  | ScoreBlock
  | ProsConsBlock
  | CollapseBlock
  | CompetitorCategoriesBlock
  | CaseStudiesBlock
  | BeforeAfterBlock
  | LeanCanvasBlock
  | MarketStageBlock
  | MetricItemBlock
  | RoadmapPhaseBlock
  | RiskCardBlock
  | GrantBlock
  | PromptBlock;

export interface TextBlock { kind: "text"; heading?: string; body: string }

export interface VerdictBlock {
  kind: "verdict";
  sentence: string; // 종합 판정 한 문장
  bases: string[]; // 판정 근거 3~4
  nextActions: string[]; // 다음에 할 일 3
  negativeBranch?: { when: string; alternatives: { t: string; d: string }[] }; // 부정 판정 분기
}

export interface ScoreAxis {
  key: string;
  label: string;
  score: number; // 0~100
  rationale: string; // 왜 그 점수인지 근거 2~3줄
  rubric: string; // "이 항목은 이런 내용을 바탕으로 심사합니다"
}
export interface ScoreBlock { kind: "score"; total: number; axes: ScoreAxis[] }

export interface ProConItem { t: string; what: string; why: string; impact: string } // 무엇이 / 왜 / 영향
export interface ProsConsBlock { kind: "prosCons"; pros: ProConItem[]; cons: ProConItem[] }

export interface CollapseBlock { kind: "collapse"; title: string; blocks: Block[] } // 접히는 하위 블록

export interface CompetitorCategory {
  category: string; // 대안 "카테고리" (개별 회사명 아님)
  approach: string; // 접근 방식
  limit: string; // 한계
  diff: string; // 우리와의 차이
}
export interface CompetitorCategoriesBlock {
  kind: "competitorCategories";
  categories: CompetitorCategory[];
  companyNamesTodo: string; // TODO(competitor-names)
}

export interface CaseStudiesBlock { kind: "caseStudies"; structureNote: string; todo: string } // TODO(case-studies)

export interface BeforeAfterRow { field: string; before: string; after: string; why: string } // AI가 바꾼 이유
export interface BeforeAfterBlock { kind: "beforeAfter"; rows: BeforeAfterRow[] }

// 린 캔버스 9블록 — Before(내 입력)와 After(AI 완성본)를 동시에 보여주고, 칸마다 변경 이유를 붙인다.
export interface LeanCanvasCell {
  id: string; // problem/solution/uvp/advantage/segment/metrics/channel/cost/revenue
  label: string;
  before: string; // 처음 입력(간단)
  after: string[]; // AI가 구체화한 항목들
  why: string; // 왜 이렇게 바꿨는지 (변경 이유)
}
export interface LeanCanvasBlock { kind: "leanCanvas"; cells: LeanCanvasCell[] }

export interface MarketStage {
  no: 1 | 2 | 3 | 4;
  title: string; // ① 시장 사이즈 추세와 변화 요인 …
  whyLook: string; // 어떤 지표를 왜 봐야 하는지(채움)
  estimated: boolean; // 추정치 vs 실측치 시각 구분용
  // 수치·연도·출처는 지어내지 않는다 → 비움
  valueTodo: string; // TODO(market-data)
}
export interface MarketStageBlock { kind: "marketStage"; stages: MarketStage[] }

export interface MetricItem {
  what: string; // 무엇을 조사할지
  purpose: string; // 목적
  how: string; // 방법
  interpret: string; // 결과 해석 가이드 — "이렇게 나오면 이런 의미"
  hypothesis?: { claim: string; method: string; pass: string; failResponse: string };
}
export interface MetricItemBlock { kind: "metricItem"; items: MetricItem[] }

export interface RoadmapPhase {
  code: string; // P0~P5
  title: string;
  duration: string;
  goal: string;
  todos: string[]; // 세부 할 일 4~6
  deliverables: string[]; // 산출물
  entryCondition: string; // 다음 스텝 진입 조건
  status: "미시작" | "진행 중" | "완료";
}
export interface RoadmapPhaseBlock { kind: "roadmapPhase"; phases: RoadmapPhase[] }

export type RiskLevel = "高" | "中~高" | "中" | "低";
export interface RiskCard {
  t: string;
  level: RiskLevel;
  situation: string; // ① 문제 상황
  basis: string; // ② 그렇게 판단한 근거
  response: string; // ③ 대응 방안 (규제 대응 경로) — "우회/회피" 금지
  legalCiteTodo?: string; // 법조문·분류코드·판례 TODO(legal-cite)
}
export interface RiskCardBlock { kind: "riskCard"; risks: RiskCard[] }

export interface GrantItem {
  name: string; // 사업명은 공개 정보 → 사용 가능
  org: string;
  stage: string; // 대상 단계
  eligibleMet: string[]; // 요건 충족 항목(논리)
  eligibleGap: string[]; // 미충족 항목(논리)
  termsTodo: string; // 요건·금액·일정·선정률 TODO(grant-terms)
}
export interface Deliverable { t: string; d: string; grantLink?: string } // 연계 산출물
export interface GrantBlock { kind: "grant"; grants: GrantItem[]; artifacts: Deliverable[] }

export interface PromptTarget { slot: string; note: string } // AI 타깃 슬롯
export interface ToolIntegration { name: string; use: string } // 피그마/스티치/노션
export interface PromptBlock {
  kind: "prompt";
  targetsTodo: string; // TODO(ai-targets)
  targets: PromptTarget[]; // 우선 3~4 슬롯 구조
  commonPromptNote: string; // 01~08 요약을 조립하는 구조 설명
  tools: ToolIntegration[]; // 피그마/스티치/노션
  toolIntegrationTodo: string; // TODO(tool-integration)
}

export interface Step {
  no: string; // "01"
  id: string; // "idea-input"
  title: string;
  tier: Tier;
  summary: string; // 스텝 인디케이터용 한 줄
  lockedTeaser?: string; // 잠금 오버레이 문구 (구체 수치)
  blocks: Block[];
  sources?: Source[]; // 하단 출처 슬롯 (실제 항목은 TODO(sources))
}

// 출처 슬롯 공통 — 실제 항목은 지어내지 않고 확인 필요로 둔다. TODO(sources)
const PENDING_SOURCES: Source[] = [
  { title: "", issuer: "", checkedAt: "", confidence: "확인 필요" },
];

// ─────────────────────────────────────────────────────────────────────────────
// 의료 · MCI 케어콜 데모 리포트 (기본 예시)
// ─────────────────────────────────────────────────────────────────────────────
export const DEMO_IDEA =
  "경도인지장애(MCI) 부모를 둔 비동거 보호자를 위해, 보호자 목소리로 AI가 매일 안부 전화를 걸어 복약·식사·컨디션을 확인하고 보호자 앱에 기록·알림해 주는 서비스";

export const STEPS: Step[] = [
  // 01 아이디어 입력 (free)
  {
    no: "01",
    id: "idea-input",
    title: "아이디어 입력",
    tier: "free",
    summary: "한 줄 요약 + 비즈니스 모델 입력",
    blocks: [
      { kind: "text", heading: "아이디어 한 줄 요약", body: DEMO_IDEA },
      {
        kind: "text",
        heading: "입력 안내",
        body: "완벽하지 않아도 됩니다. 한 줄과 비즈니스 모델 칸을 채우면, AI가 이해한 내용을 다음 단계에서 확인·수정합니다.",
      },
    ],
  },

  // 02 종합 진단 리포트 (free)
  {
    no: "02",
    id: "diagnosis",
    title: "종합 진단 리포트",
    tier: "free",
    summary: "판정 · 6축 점수 · 장단점 · 유사서비스/사례",
    blocks: [
      {
        kind: "verdict",
        sentence:
          "수요와 명분은 강하지만, 규제·검증이 관문인 유형입니다. 가장 낮은 규제 축을 서비스 설계로 통제할 수 있느냐가 성패를 가릅니다.",
        bases: [
          "인구구조(초고령·비동거)가 미는 구조적 수요라 지속성이 높다",
          "보호자 목소리·임상 신뢰라는 모방 난도 높은 차별점이 있다",
          "핵심 리스크가 '설계로 통제 가능한' 규제·데이터 영역에 몰려 있다",
        ],
        nextActions: [
          "보호자 10~15명 문제 인터뷰로 지불의사부터 확인",
          "5~10가구 2주 케어콜 파일럿으로 응답·지속률 측정",
          "식약처 비의료 분류 상담 + 법무 자문으로 규제 스코프 확정",
        ],
        negativeBranch: {
          when: "지불의사·지속률이 합격선을 밑돌거나 규제 스코프가 비의료로 확정되지 않을 때",
          alternatives: [
            { t: "범위 축소 — 비의료 안부 확인에 집중", d: "의료 해석 소지를 줄여 규제 리스크를 낮추고 검증 속도를 높인다." },
            { t: "채널 전환 — 기관(B2B) 우선", d: "개인 대신 요양·복지 기관을 1차 고객으로 두어 신뢰·구매력을 확보한다." },
          ],
        },
      },
      {
        kind: "score",
        total: 72,
        axes: [
          { key: "problem", label: "문제 정의·수요", score: 82, rationale: "초고령사회·비동거 돌봄 공백이 맞물려 통증이 크고 우상향한다.", rubric: "문제의 명확성과 수요의 크기·지속성, 통증의 강도를 심사합니다." },
          { key: "solution", label: "솔루션 차별성", score: 68, rationale: "보호자 목소리·MCI 특화가 차별점이나 기술 자체의 모방 장벽은 낮다.", rubric: "대체재 대비 차별성과 모방 난도(해자)를 심사합니다." },
          { key: "tech", label: "기술 실현성", score: 74, rationale: "STT·TTS·LLM은 성숙. 노인 발화 인식·환각 통제가 실현 난점이다.", rubric: "핵심 기술의 성숙도와 팀의 구현 난도를 심사합니다." },
          { key: "reg", label: "규제·인허가", score: 58, rationale: "의료기기 경계·건강 민감정보·음성합성 윤리가 얽힌 최대 관문이다.", rubric: "인허가 부담과 규제 리스크의 통제 가능성을 심사합니다." },
          { key: "econ", label: "수익모델·단위경제", score: 70, rationale: "통화가 변동비라 원가 검증이 필요하고 LTV가 관건이다.", rubric: "수익모델의 현실성과 단위경제(원가·LTV)를 심사합니다." },
          { key: "team", label: "팀·실행력", score: 76, rationale: "임상 자문은 강한 신뢰 자산이나 개발 인력 집중이 리스크다.", rubric: "팀의 실행 역량과 도메인 신뢰 자산을 심사합니다." },
        ],
      },
      {
        kind: "prosCons",
        pros: [
          { t: "명확하고 우상향하는 수요", what: "초고령·비동거·독거 증가가 동시에 맞물린 통증", why: "인구구조가 미는 수요라 유행과 달리 지속·확대된다", impact: "시장 타이밍과 메시지 설득력이 강해진다" },
          { t: "임상 신뢰 자산", what: "의학적 타당성·기관 채널·투자 신뢰의 출발점", why: "헬스케어에서 가장 비싼 자원은 코드가 아니라 임상 신뢰다", impact: "B2B·투자 심사에서 동급 팀 대비 우위" },
          { t: "정서적 차별화 — 익숙한 목소리", what: "보호자 본인 목소리라는 정서 훅", why: "기계음 케어콜 대비 응답·지속률을 끌어올린다", impact: "검증되면 단순 기능 차이를 넘는 방어선" },
          { t: "다층 수익 경로", what: "B2C + 기관 B2B + 통신사 제휴", why: "단일 채널 의존을 줄여 원가 충격에 대응", impact: "한 채널이 막혀도 성장 경로가 남는다" },
        ],
        cons: [
          { t: "낮은 기술 모방 장벽", what: "케어콜 기능 자체의 진입장벽이 낮음", why: "STT·TTS·LLM은 상용 API로 누구나 접근 가능", impact: "차별점을 데이터·신뢰로 계속 벌려야 한다" },
          { t: "규제 불확실성", what: "의료기기 경계·민감정보 해석의 모호함", why: "'이상 알림' 표현의 규제 해석이 갈릴 수 있다", impact: "스코프 확정 전까지 사업 리스크가 크다" },
          { t: "변동비 구조", what: "통화·LLM·음성합성 원가가 사용량에 비례", why: "구독 단가 대비 원가 검증이 안 되면 적자", impact: "단위경제 검증이 우선순위가 된다" },
          { t: "인력 집중 리스크", what: "초기 실행이 소수 인력에 의존", why: "핵심 역량이 분산돼 있지 않다", impact: "지속성·속도에 병목이 생길 수 있다" },
        ],
      },
      {
        kind: "collapse",
        title: "유사 서비스 · 대안",
        blocks: [
          {
            kind: "competitorCategories",
            companyNamesTodo: "TODO(competitor-names): 각 카테고리의 실제 회사·제품명 확인 후 기입",
            categories: [
              { category: "공공 예산 기반 AI 안부전화", approach: "지자체 예산으로 표준 AI 음성이 주기적 안부전화를 걸고 담당자에게 리포트", limit: "표준 합성음이라 정서적 지속성이 약하고 가족 개인화·기록 레이어가 얇다", diff: "우리는 보호자 목소리 훅 + 가족 앱 기록으로 B2C 지불 동기를 만든다" },
              { category: "정서 돌봄 하드웨어(인형·로봇)", approach: "실물 디바이스로 말벗·복약 알림·정서 케어 제공", limit: "초기 원가·재고 부담이 크고 기능 업데이트가 느리다", diff: "우리는 소프트웨어·전화 기반이라 CAC가 낮고 개선이 빠르다" },
              { category: "통신사 시니어 케어 번들", approach: "시니어 요금제에 안부·긴급알림을 번들로 결합", limit: "케어가 부가서비스라 깊이가 얕고 개인화가 핵심이 아니다", diff: "정면 대결이 아니라 제휴 파트너로 유통 위에 얹는 포지션" },
              { category: "범용 안부·복약 알림 앱", approach: "복약 알림·가족 메시지 등을 자녀가 직접 설치·관리", limit: "어르신이 직접 앱을 써야 해 MCI·고령층에겐 장벽", diff: "전화만 받으면 되는 능동형이라 수동 알림앱과 근본적으로 다르다" },
              { category: "방문·인력 기반 돌봄 서비스", approach: "요양보호사·복지사가 직접 방문·전화로 케어", limit: "인력 수급 격차로 커버리지·비용에 한계", diff: "사람으로 못 메우는 매일의 확인 공백을 기술로 보완한다" },
            ],
          },
          { kind: "caseStudies", structureNote: "각 사례는 { 진행 단계 / 배경 / 우리에게 주는 교훈 } 구조로 채운다.", todo: "TODO(case-studies): 실제 기업·서비스 사례는 검증 후 기입" },
        ],
      },
    ],
    sources: PENDING_SOURCES,
  },

  // 03 비즈니스 모델 (paid)
  {
    no: "03",
    id: "bm",
    title: "비즈니스 모델",
    tier: "paid",
    summary: "Before/After · AI가 바꾼 이유",
    lockedTeaser: "9블록 린 캔버스 Before/After 전체와 칸별 변경 사유가 잠겨 있습니다.",
    blocks: [
      {
        kind: "leanCanvas",
        cells: [
          {
            id: "problem", label: "문제",
            before: "부모님 안부가 늘 걱정된다",
            after: [
              "비동거 자녀가 MCI 부모의 매일 상태 변화를 파악하기 어렵다",
              "직접 전화는 지속·기록이 안 돼 '어제보다 나빠졌는지' 추세를 놓친다",
              "복약·식사 누락, 이상 징후를 조기에 잡을 상시 채널이 없다",
            ],
            why: "'걱정'이라는 감정은 그 자체로 살 수 없습니다. '지속·기록·추세 감지의 부재'라는 측정 가능한 결핍으로 쪼개야, 인터뷰로 통증을 검증할 수 있고 솔루션이 무엇을 해결하는지가 분명해집니다.",
          },
          {
            id: "solution", label: "솔루션",
            before: "AI가 대신 전화해 준다",
            after: [
              "보호자 음성 AI 케어콜 (1일 1회, 부담 없는 시간대)",
              "3항목 자동 확인: 복약 · 식사 · 컨디션",
              "대화 분석 → 요약 + 이상 신호 추출",
              "보호자 앱: 기록 · 추세 그래프 · 이상 알림",
            ],
            why: "'AI가 전화'는 아무나 흉내 낼 수 있고 가치가 모호합니다. '무엇을 확인해(3항목) → 무엇을 남기고(기록·추세) → 언제 알리는가(이상)'를 하나의 반복 루프로 고정하면 제품 범위와 원가·품질 기준이 동시에 잡힙니다.",
          },
          {
            id: "uvp", label: "고유 가치 제안",
            before: "(명확한 정의 없음)",
            after: [
              "부모님이 거부감 없이 받는 '익숙한 목소리'로 매일 확인·기록·알림",
              "태그라인: \"부모님 안부, 매일 대신 여쭤봐 드릴게요.\"",
              "하이레벨 컨셉: 시니어를 위한 음성 기반 원격 케어 비서",
            ],
            why: "고유 가치가 한 문장으로 정의돼야 마케팅·가격·기능이 같은 방향으로 정렬됩니다. 경쟁 케어콜과 갈리는 지점('익숙한 목소리')을 태그라인·컨셉으로 명문화했습니다.",
          },
          {
            id: "advantage", label: "불공정 강점",
            before: "AI가 전화하는 것 자체",
            after: [
              "보호자 목소리 데이터 + 사용 동의 자산 (복제 난이도 높음)",
              "임상 자문 네트워크에서 오는 신뢰 (확인 필요)",
              "축적되는 통화·건강 추세 데이터 → 개인화 정확도 해자",
              "오래 쓸수록 바꾸기 어려운 정서적 록인",
            ],
            why: "'AI 전화' 자체는 진입장벽이 낮습니다. 복제 난도가 높은 자산(음성 데이터·임상 신뢰·축적 데이터·정서 록인)으로 강점을 재정의해야 후발주자·빅플레이어의 모방을 견딥니다.",
          },
          {
            id: "segment", label: "고객군",
            before: "노인, 가족",
            after: [
              "1차(결제자): 비동거 40~60대 자녀",
              "2차(B2B): 요양·복지기관, 데이케어센터",
              "3차(제휴): 통신사 시니어 요금제",
              "얼리어답터: 매일 전화하지만 지치는 효자·효녀 자녀",
            ],
            why: "'가족'은 너무 넓어 제품도 마케팅도 초점을 잃습니다. 실제 지갑을 여는 자녀를 1차로 못 박고, 대량 유통을 여는 기관·통신사를 2·3차로 분리해야 메시지·가격·기능이 정렬됩니다.",
          },
          {
            id: "metrics", label: "핵심 지표",
            before: "(설정 없음)",
            after: [
              "응답률 · 4주 지속률",
              "이상알림 유용성 · 거짓경보율",
              "유료 전환율 & CAC · 통화당 원가",
              "LTV ÷ (CAC + 누적 통화원가)",
            ],
            why: "감으로 운영하면 무엇이 되고 안 되는지 모릅니다. 응답·지속·전환·단위경제를 처음부터 숫자로 정의해야 검증(STEP 05)과 자금 설득이 가능해집니다.",
          },
          {
            id: "channel", label: "채널",
            before: "(정의 없음)",
            after: [
              "B2C: 앱스토어 + 맘카페·부모돌봄 커뮤니티·SNS",
              "B2B: 요양·복지기관 제휴 영업",
              "제휴: 통신사 번들 · 보험사 부가서비스",
              "바이럴: '부모님 리포트' 가족 공유 → 형제자매 유입",
            ],
            why: "채널이 없으면 좋은 제품도 팔리지 않습니다. 결제자(자녀)에게 닿는 경로와, 형제자매로 번지는 바이럴 고리를 명시해 CAC를 낮출 지점을 만들었습니다.",
          },
          {
            id: "cost", label: "비용 구조",
            before: "(고려 안 함)",
            after: [
              "변동비(급소): 통화당 STT · LLM · TTS · 통신 원가",
              "고정비: 개발·운영 인건비, 임상 자문 비용",
              "초기: 규제 검토·법무, 개인정보 보안 체계 구축",
              "획득비: 자녀 타깃 마케팅 CAC",
            ],
            why: "통화가 사용량에 비례하는 변동비라 원가가 이 사업의 급소입니다. 변동·고정·초기·획득비를 나눠야 단위경제(구독 단가 vs 통화 원가) 검증 대상이 분명해집니다.",
          },
          {
            id: "revenue", label: "수익원",
            before: "월 구독",
            after: [
              "B2C 월 구독 (기본 / 프리미엄 티어)",
              "B2B 좌석제 (기관 계정당 과금)",
              "통신사·보험 제휴 수수료 (RS)",
              "부가: 상세 리포트 · 전문가 상담 연계",
            ],
            why: "단일 B2C 구독은 통화 원가 충격에 취약합니다. 계약 규모가 크고 이탈이 낮은 B2B, 대규모 유통을 여는 제휴로 수익원을 다변화하되 순서는 B2C 검증이 먼저입니다.",
          },
        ],
      },
    ],
    sources: PENDING_SOURCES,
  },

  // 04 시장조사 (paid)
  {
    no: "04",
    id: "market",
    title: "시장조사",
    tier: "paid",
    summary: "4단계 · 수치는 확인 필요",
    lockedTeaser: "시장 사이즈·수요 지표·규모·수요 비중 4단계 상세가 잠겨 있습니다.",
    blocks: [
      {
        kind: "marketStage",
        stages: [
          { no: 1, title: "시장 사이즈 추세와 변화 요인", whyLook: "시장이 커지는 방향인지, 무엇이 그 방향을 미는지를 먼저 봐야 진입 타이밍을 판단할 수 있습니다.", estimated: true, valueTodo: "TODO(market-data): 추세 수치·연도·출처 확인 후 기입" },
          { no: 2, title: "관련 수요 지표 상세", whyLook: "총량이 아니라 '우리 문제'에 직접 연결되는 수요 지표를 봐야 실제 표적 수요를 가늠할 수 있습니다.", estimated: true, valueTodo: "TODO(market-data): 수요 지표 값·출처 확인 후 기입" },
          { no: 3, title: "시장 규모", whyLook: "TAM/SAM/SOM으로 규모를 층위별로 나눠야 '노릴 수 있는 크기'를 현실적으로 잡을 수 있습니다.", estimated: false, valueTodo: "TODO(market-data): 시장 규모 산정식·수치·출처 확인 후 기입" },
          { no: 4, title: "관련 수요 비중", whyLook: "수요를 세부 니즈로 쪼개 비중을 봐야 어떤 기능·세그먼트부터 공략할지 우선순위가 나옵니다.", estimated: true, valueTodo: "TODO(market-data): 수요 비중 값·출처 확인 후 기입" },
        ],
      },
    ],
    sources: PENDING_SOURCES,
  },

  // 05 핵심 지표 (paid) — 실행 워크시트
  {
    no: "05",
    id: "metrics",
    title: "핵심 지표",
    tier: "paid",
    summary: "직접 진행할 조사 워크시트 · 검증 가설",
    lockedTeaser: "직접 진행할 조사 항목 6건과 결과 해석 가이드·합격선이 잠겨 있습니다.",
    blocks: [
      {
        kind: "metricItem",
        items: [
          { what: "보호자 문제 인터뷰(지불의사)", purpose: "돈을 낼 만큼 통증이 큰지 확인", how: "비동거 보호자 10~15명 심층 인터뷰 + 가격 민감도 질문", interpret: "5명 이상 '유료라도 쓰겠다' + 대체 지출(요양·돌봄·통신) 존재하면 수요 신호. 무료만 원하면 통증 재정의 필요.", hypothesis: { claim: "보호자가 월 구독료를 낼 만큼 통증이 크다", method: "인터뷰 + 대체 지출 확인", pass: "5명+ 유료 의향 & 대체 지출 존재", failResponse: "타깃 세그먼트를 좁히거나 기관 B2B로 전환" } },
          { what: "케어콜 응답·지속 파일럿", purpose: "피보호자가 실제로 전화를 받고 지속하는지", how: "5~10가구 2주 파일럿, 응답률·완료율·중도 거부율 측정", interpret: "응답률 60%+·2주 지속률 50%+면 초기 기준 통과. 급락하면 통화 설계(시간·톤·길이) 재검토.", hypothesis: { claim: "피보호자가 AI 전화를 받고 지속한다", method: "2주 파일럿 지표 측정", pass: "응답률 60%+ / 지속률 50%+", failResponse: "통화 UX·시간대·목소리 방식 재설계" } },
          { what: "보호자 음성 합성 수용도", purpose: "보호자 목소리 합성에 대한 거부감·신뢰", how: "합성 음성 시연 후 거부감·신뢰 설문, 기계음 vs 보호자음성 선호 비교", interpret: "보호자 음성 선호가 유의하게 높고 거부감이 소수면 정서 훅 유효. 거부감이 크면 옵트인·고지 강화.", },
          { what: "단위경제(원가) 실측", purpose: "통화당 원가와 구독 단가의 마진 확인", how: "STT·TTS·LLM·통신 원가를 실제 통화량 기준으로 집계", interpret: "구독 단가 > 통화 원가 + CAC 회수 가능하면 지속 가능. 역전되면 통화 빈도·길이·모델 조정.", },
          { what: "채널별 전환·CAC", purpose: "어떤 유입 채널이 저비용으로 전환되는지", how: "소규모 광고·커뮤니티·기관 소개 등 채널별 전환·비용 비교", interpret: "특정 채널의 CAC가 LTV 대비 건전하면 그 채널에 집중. 전부 높으면 메시지·타깃 재점검.", },
          { what: "기관(B2B) 관심도 타진", purpose: "요양·복지기관의 도입 의향·요구", how: "기관 담당자 인터뷰 + 파일럿 의향서(LOI) 확보 시도", interpret: "LOI 1~2건 확보되면 B2B 경로 유효. 무관심하면 B2C 검증에 자원 집중.", },
        ],
      },
    ],
    sources: PENDING_SOURCES,
  },

  // 06 로드맵 (paid)
  {
    no: "06",
    id: "roadmap",
    title: "로드맵",
    tier: "paid",
    summary: "P0 검증 → P5 확장",
    lockedTeaser: "P0~P5 6단계의 세부 할 일·산출물·진입 조건이 잠겨 있습니다.",
    blocks: [
      {
        kind: "roadmapPhase",
        phases: [
          { code: "P0", title: "아이디어 검증", duration: "2~4주", goal: "돈 낼 보호자가 있는지 확인", todos: ["보호자 인터뷰 대본 작성", "10~15명 문제 인터뷰", "경쟁·대안 카테고리 매핑", "5가구 2주 미니 파일럿 협조자 모집"], deliverables: ["문제 인터뷰 요약", "린 캔버스 초안"], entryCondition: "지불의사·통증이 인터뷰로 확인됨", status: "진행 중" },
          { code: "P1", title: "사업형태·행정 셋업", duration: "2~4주", goal: "법적 실체 + 규제 포지셔닝", todos: ["개인사업자 vs 법인 결정", "의료기기/비의료 경계 자가진단", "식약처 분류 상담 + 법무 검토", "개인정보·음성 동의 구조 설계"], deliverables: ["규제 스코프 문서", "동의 구조 설계서"], entryCondition: "비의료 스코프가 서면으로 확인됨", status: "미시작" },
          { code: "P2", title: "MVP / 프로토타입", duration: "6~10주", goal: "핵심 케어콜 루프 작동", todos: ["1일 1회 통화→3항목 확인→요약→앱 기록 고정", "STT·TTS·LLM 파이프라인 결정", "응급 자동판단 배제 + 확인 권유 로직"], deliverables: ["작동하는 케어콜 MVP", "보호자 앱 기록·알림"], entryCondition: "파일럿 응답·지속률 합격선 통과", status: "미시작" },
          { code: "P3", title: "고객 확보", duration: "6~12주", goal: "유료 전환·재구매 검증", todos: ["저비용 채널 실험", "유료 전환 퍼널 최적화", "이탈 원인 인터뷰"], deliverables: ["채널별 CAC·전환 데이터"], entryCondition: "건전한 CAC/LTV 채널 확인", status: "미시작" },
          { code: "P4", title: "자금 조달", duration: "병행", goal: "성장 연료 확보", todos: ["지원사업 지원(별도 스텝)", "IR 자료 정비", "트랙션 지표 정리"], deliverables: ["IR 한 장", "트랙션 리포트"], entryCondition: "반복 가능한 성장 지표 확보", status: "미시작" },
          { code: "P5", title: "확장", duration: "지속", goal: "B2B·제휴로 스케일업", todos: ["기관 좌석제 상품화", "통신사 제휴 논의", "질환·연령 확장 검토"], deliverables: ["B2B 상품·계약서 템플릿"], entryCondition: "B2C 단위경제가 검증됨", status: "미시작" },
        ],
      },
    ],
    sources: PENDING_SOURCES,
  },

  // 07 리스크 / 해결 필요 (paid)
  {
    no: "07",
    id: "risks",
    title: "리스크 / 해결 필요",
    tier: "paid",
    summary: "위험도별 대응 방안",
    lockedTeaser: "위험도 高~低 리스크 6건과 각 대응 방안이 잠겨 있습니다.",
    blocks: [
      {
        kind: "riskCard",
        risks: [
          { t: "의료기기(SaMD)·의료행위 경계", level: "高", situation: "'건강 상태 확인 → 이상 알림'이 의료적 판단으로 해석되면 소프트웨어 의료기기 인허가 대상이 된다.", basis: "식약처 비의료 건강관리 가이드라인이 허용/금지를 나누지만 '이상 징후 알림' 표현은 경계가 모호해 해석 다툼이 잦다.", response: "규제 대응 경로: 기능·문구를 '복약·식사·컨디션 기록과 보호자 공유'로 좁히고, 응급 판단 대신 '보호자 확인 권유'로 통일. 식약처 사전 분류 상담으로 비의료 확인을 서면 확보하고 법무 자문 레터를 받아 그 범위에서만 마케팅 문구를 확정.", legalCiteTodo: "TODO(legal-cite): 관련 고시·분류코드 확인" },
          { t: "민감 건강정보·동의능력", level: "高", situation: "건강정보는 민감정보로 가중 보호되며, 당사자(MCI)의 동의능력이 제한될 수 있어 본인 동의만으로는 유효성이 흔들린다.", basis: "개인정보보호법상 민감정보는 분리·명시 동의와 강화된 안전조치가 요구된다.", response: "규제 대응 경로: 가입 플로우를 '보호자 대리동의 + 당사자 고지' 구조로 설계, 최소수집·암호화·보관기간·파기 명문화, 목적별 분리 고지. 동의 이력·대리동의 근거를 로그로 남겨 입증책임에 대비.", legalCiteTodo: "TODO(legal-cite): 근거 조항 확인" },
          { t: "음성 합성 악용·음성권", level: "中~高", situation: "보호자 목소리 합성은 강력한 훅이지만 음성권 침해·딥보이스 악용의 통로가 될 수 있다.", basis: "등록 검증이 허술하면 타인 목소리 무단 합성에 악용될 수 있고, 합성음 미고지는 기만 이슈가 된다.", response: "규제 대응 경로: 본인 인증을 통과한 목소리만 등록·합성, 합성 통화에 'AI 안내' 고지 삽입, 성문 대조·워터마크로 추적성 확보, 목적 외 사용 금지·파기 정책을 계약·시스템 양쪽에 명문화." },
          { t: "AI 환각·오탐/미탐", level: "中", situation: "대화 분석이 이상을 잘못 잡거나 놓치면 신뢰·안전 사고로 이어진다.", basis: "건강 도메인은 한 번의 사고가 브랜드 전체를 흔든다.", response: "대응 방안: 응급을 AI가 자동 판단하지 않고 항상 사람(보호자) 확인 루프를 거치게 하고, 임계값을 보수적으로 두며, 통화 로그를 임상 자문과 라벨링해 기준을 데이터로 튜닝." },
          { t: "표시·광고 규제(건강 표현)", level: "中", situation: "'조기 발견·예방·개선' 등 효능을 암시하는 문구는 표시광고 심의 대상이 될 수 있다.", basis: "근거 없는 효과 주장은 시정·과태료와 앱스토어 반려 사유가 된다.", response: "대응 방안: 치료·진단·예방을 단정하는 표현을 빼고 '기록·공유·안부 확인' 사실 위주로 소구, 효과 주장은 자체 데이터 범위 안에서만." },
          { t: "전자상거래·자동결제 고지", level: "低", situation: "월 구독·자동결제는 청약철회·자동갱신 고지·간편 해지 의무를 진다.", basis: "결제자(자녀)와 이용자(부모)가 다르고 고령층이 얽혀 고지 미흡은 분쟁이 되기 쉽다.", response: "대응 방안: 요금·갱신주기·해지방법을 명확히 고지하고 원클릭 해지 제공, 자동갱신 전 사전 알림 자동화, 약관·환불정책 정비." },
        ],
      },
    ],
    sources: PENDING_SOURCES,
  },

  // 08 지원사업 소개 (paid)
  {
    no: "08",
    id: "grants",
    title: "지원사업 소개",
    tier: "paid",
    summary: "지원사업 매칭 · 연계 산출물",
    lockedTeaser: "지원사업 매칭과 연계 산출물 3종이 잠겨 있습니다.",
    blocks: [
      {
        kind: "grant",
        grants: [
          { name: "예비창업패키지", org: "중소벤처기업부 · 창업진흥원", stage: "예비창업자", eligibleMet: ["0→1 사업화 자금·멘토링 수요와 부합", "헬스케어·SW 아이템 + 임상 자문 스토리"], eligibleGap: ["사업자등록 이력 여부 확인 필요"], termsTodo: "TODO(grant-terms): 요건·금액·일정·선정률은 공고 확인" },
          { name: "고령친화산업 실증·지원사업", org: "보건복지부 · 관련 진흥원", stage: "실증 필요 기업", eligibleMet: ["시니어 케어 도메인에 직접 부합", "기관 실증 파일럿과 연결 가능"], eligibleGap: ["협력 기관 의향서(LOI) 확보 필요"], termsTodo: "TODO(grant-terms): 요건·금액·일정 공고 확인" },
          { name: "TIPS(민간투자주도형 기술창업)", org: "중기부 · 운영사", stage: "기술 창업기업", eligibleMet: ["임상·AI 음성 기술성 스토리"], eligibleGap: ["운영사 선투자·추천 필요"], termsTodo: "TODO(grant-terms): 요건·금액·선정 절차 확인" },
          { name: "초기창업패키지", org: "창업진흥원", stage: "창업 3년 이내", eligibleMet: ["초기 트랙션 확보 시 적합"], eligibleGap: ["사업자등록·초기 지표 필요"], termsTodo: "TODO(grant-terms): 요건·금액·일정 공고 확인" },
        ],
        artifacts: [
          { t: "진단 리포트", d: "구조화 요약 + 6축 점수 + 장단점·리스크·검증 가정", grantLink: "예비창업패키지 사업계획서 근거" },
          { t: "린 캔버스", d: "9블록 — 문제·고객·UVP·솔루션·채널·수익·비용·지표·강점", grantLink: "아이템 차별성·시장성 증빙" },
          { t: "IR 구조 및 사업계획서 개요", d: "문제→솔루션→시장→BM→트랙션→팀→Ask 골격", grantLink: "TIPS·초기창업 IR 기반" },
        ],
      },
    ],
    sources: PENDING_SOURCES,
  },

  // 09 AI 프롬프트 · 앱 연결 (paid) — 신규
  {
    no: "09",
    id: "ai-bridge",
    title: "AI 프롬프트 · 앱 연결",
    tier: "paid",
    summary: "AI별 프롬프트 · 외부 툴 연계",
    lockedTeaser: "AI별 맞춤 프롬프트와 피그마·스티치·노션 연계가 잠겨 있습니다.",
    blocks: [
      {
        kind: "prompt",
        targetsTodo: "TODO(ai-format): AI별 정확한 프롬프트 형식은 조정 예정",
        targets: [
          { slot: "제미나이", note: "Gemini 형식 프롬프트로 전환" },
          { slot: "클로드", note: "Claude 형식 프롬프트로 전환" },
          { slot: "지피티", note: "GPT 형식 프롬프트로 전환" },
        ],
        commonPromptNote: "01~08 스텝(아이디어·진단·BM·시장·지표·로드맵·리스크·지원사업) 요약을 조립해, 사업 내용을 AI에게 이해시키는 공통 프롬프트를 생성합니다.",
        tools: [
          { name: "Figma", use: "화면·플로우 시안화 — 프롬프트/구조를 디자인 초안으로" },
          { name: "Stitch", use: "UI 생성 — 화면 구조를 빠른 프로토타입으로" },
          { name: "Notion", use: "실행 관리 — 로드맵·지표 워크시트를 문서로 이관" },
        ],
        toolIntegrationTodo: "TODO(tool-integration): 각 툴 연계 방식 확정",
      },
    ],
    sources: PENDING_SOURCES,
  },
];

// 스텝 인디케이터 파생용
export const FREE_STEPS = STEPS.filter((s) => s.tier === "free");
export const PAID_STEPS = STEPS.filter((s) => s.tier === "paid");

// 파일 첨부 개수(무료/유료 차이) — 구체 수치 미확정
export const ATTACH_LIMIT = {
  freeTodo: "TODO(attach-limit): 무료 첨부 개수 확정",
  paidTodo: "TODO(attach-limit): 유료 첨부 개수 확정",
};

// ─────────────────────────────────────────────────────────────────────────────
// 두 번째 예시: 커머스 · 마감 할인 앱 — 동일 9스텝 구조, 내용은 TODO(sample-commerce)
// ─────────────────────────────────────────────────────────────────────────────
export const COMMERCE_IDEA =
  "마감 임박한 음식을 동네 손님에게 할인가로 연결하는 앱 — 가게는 폐기 손실을 줄이고 손님은 싸게 사며 음식물 쓰레기를 줄인다";

// 구조만 동일하게, 콘텐츠는 비운다. TODO(sample-commerce)
export const COMMERCE_STEPS: Step[] = STEPS.map((s) => ({
  no: s.no,
  id: s.id,
  title: s.title,
  tier: s.tier,
  summary: "TODO(sample-commerce)",
  lockedTeaser: s.lockedTeaser,
  blocks: [{ kind: "text", body: "TODO(sample-commerce): 커머스 예시 콘텐츠 준비 중" }],
}));

export interface SampleReport {
  id: string;
  label: string;
  idea: string;
  steps: Step[];
}

export const SAMPLE_REPORTS: SampleReport[] = [
  { id: "mci", label: "의료 · MCI 케어콜", idea: DEMO_IDEA, steps: STEPS },
  { id: "commerce", label: "커머스 · 마감 할인 앱", idea: COMMERCE_IDEA, steps: COMMERCE_STEPS },
];
