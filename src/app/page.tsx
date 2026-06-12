"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { 
  Activity, 
  Route, 
  Building2, 
  Landmark, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  Check, 
  Lock, 
  ShieldAlert, 
  X, 
  User, 
  Award, 
  ShieldCheck, 
  Eye, 
  ChevronDown,
  HelpCircle,
  ListChecks
} from "lucide-react";

const PRODUCT_URL = "/mockup";

const stats = [
  { target: 0, suffix: "근거 기반", label: "출처·확인일 표기, 추측은 (확인 필요)로" },
  { target: 0, suffix: "한 흐름에", label: "진단 → 로드맵 → 산출물까지" },
  { target: 0, suffix: "무료로 시작", label: "요약·강점·점수는 결제 없이" },
];

const features = [
  {
    icon: <Activity className="w-5 h-5" />,
    title: "사업성 진단",
    desc: "아이디어를 문제·고객·솔루션·수익모델로 구조화하고, 강점과 주의할 리스크, 먼저 검증해야 할 핵심 가정을 정리합니다.",
  },
  {
    icon: <Route className="w-5 h-5" />,
    title: "실행 로드맵",
    desc: "검증 → 행정 → MVP → 고객 → 자금 순서로, 지금 당장 해야 할 일을 우선순위로 보여줍니다.",
  },
  {
    icon: <Building2 className="w-5 h-5" />,
    title: "법인 · 행정 가이드",
    desc: "개인사업자와 법인 중 무엇이 맞는지, 사업자등록과 업종 인허가까지 단계별로 안내합니다.",
    note: "일반 정보 · 전문가 확인 권장",
  },
  {
    icon: <Landmark className="w-5 h-5" />,
    title: "지원사업 매칭",
    desc: "예비·초기·도약 패키지 등 단계에 맞는 정부지원사업 후보를 짚어 드립니다.",
    note: "공고·요건 변동 · 확인 필요",
  },
  {
    icon: <FileText className="w-5 h-5" />,
    title: "산출물 자동 생성",
    desc: "린 캔버스, 정관 초안, 준비물 체크리스트, IR 한 장까지 — 필요한 서류를 한 곳에서 만들고 관리합니다.",
    note: undefined,
  },
  {
    icon: <CheckCircle2 className="w-5 h-5" />,
    title: "진척 관리",
    desc: "무엇을 했고 무엇이 남았인지 한 화면에서 추적하며 끝까지 끌고 갑니다.",
  },
];

const steps = [
  { num: "01", title: "아이디어 입력",  desc: "한 문장과 짧은 후속 질문 몇 개로 시작합니다." },
  { num: "02", title: "진단",           desc: "문제·고객·수익모델로 구조화하고 사업성과 리스크를 점검합니다." },
  { num: "03", title: "로드맵",         desc: "단계별로 해야 할 일과 그 이유를 순서대로 정리합니다." },
  { num: "04", title: "실행",           desc: "체크리스트를 따라가며 필요한 문서를 바로 생성합니다." },
];

const chatbotComparison = [
  { axis: "정확성", gpt: "일반론·출처 불명, 최신 제도는 부정확하기 쉬움", be: "한국 행정·규제 반영 + 출처·확인일 표기" },
  { axis: "아이디어 맞춤", gpt: "물어볼 때마다 맥락을 다시 설명해야 함", be: "입력 기준으로 단계·할 일을 자동 정렬" },
  { axis: "산출물", gpt: "답변을 직접 문서로 정리해야 함", be: "린캔버스·IR·체크리스트를 바로 생성" },
  { axis: "끝까지 실행", gpt: "한 번 답하고 끝", be: "진척 관리·리마인더로 완주 지원" },
];

const trustItems = [
  { icon: <User className="w-5 h-5" />, t: "만든 사람이 분명합니다", d: "익명 서비스가 아니라 [창업자명 · 한 줄 이력]이 직접 만들고 책임집니다. 문의에 사람이 답합니다." },
  { icon: <Award className="w-5 h-5" />, t: "도메인 자문", d: "[자문 실명 · 소속] 등 해당 분야 전문가의 자문을 받아 설계합니다." },
  { icon: <ShieldCheck className="w-5 h-5" />, t: "근거 기반, 추측 없음", d: "출처·확인일을 함께 표기하고, 불확실한 항목은 ‘(확인 필요)’로 구분합니다. 모르는 걸 아는 척하지 않습니다." },
  { icon: <Eye className="w-5 h-5" />, t: "결제 전에 공개", d: "결과물의 깊이를 무료로 미리 확인할 수 있습니다. 사보고 결정하세요." },
];

const prices = [
  {
    name: "무료 미리보기",
    price: "₩0",
    note: "이 아이디어, 시작할 가치가 있는지부터",
    highlight: false,
    features: ["아이디어 구조화 요약", "강점 미리보기", "사업성 점수 공개", "리스크·로드맵·산출물은 잠김"],
    cta: "무료로 진단하기",
  },
  {
    name: "아이디어 1건",
    price: "₩4,900",
    was: "₩9,900",
    note: "이 아이디어를 끝까지 — 단건 결제",
    highlight: true,
    tag: "베타 한정가",
    features: ["전체 진단 (리스크·검증 가정 포함)", "단계별 실행 로드맵 P0–P5", "법인·행정 가이드 + 산출물 생성", "진척 관리 · 리마인더"],
    cta: "1건 시작하기",
  },
  {
    name: "묶음 3건",
    price: "₩12,000",
    note: "건당 ₩4,000 · 여러 아이디어 비교",
    highlight: false,
    features: ["3개 아이디어 전체 분석", "아이디어 간 비교", "팀 공유", "크레딧 소진형 (구독 아님)"],
    cta: "묶음 시작하기",
  },
];

const faqs = [
  { q: "결제하면 무엇을 받나요?", a: "선택한 아이디어 1건에 대한 전체 진단(리스크·검증 가정 포함), 단계별 실행 로드맵, 법인·행정 가이드, 그리고 린 캔버스·IR 한 장·체크리스트 등 산출물 문서를 받습니다. 무료 구간에서는 구조화 요약·강점·사업성 점수까지 미리 볼 수 있습니다." },
  { q: "구독인가요?", a: "아니요. 아이디어 1건당 결제하는 방식입니다. 매달 빠져나가는 구독료가 없고, 분석이 필요한 아이디어에만 결제하면 됩니다. 여러 건을 볼 때는 묶음으로 건당 단가를 낮출 수 있습니다." },
  { q: "환불되나요?", a: "결제 전에 요약·강점·점수를 무료로 확인할 수 있습니다. 결제 후 환불은 환불정책을 따르며, 디지털 콘텐츠 특성상 결과 생성·열람 여부에 따라 기준이 달라질 수 있습니다. 정확한 기준은 결제 화면과 환불정책에 표기됩니다." },
  { q: "결과 정보는 정확한가요?", a: "출처와 확인일을 함께 표기하고, 불확실한 항목은 ‘(확인 필요)’로 명확히 구분합니다. 다만 법인 비용·세금, 정부지원사업의 요건·금액·일정 같은 변동 정보는 진행 시점에 공식 공고와 전문가(법무사·세무사 등) 확인을 권장합니다. 본 서비스는 법률·세무 자문이 아닙니다." },
  { q: "제 아이디어와 데이터는 안전한가요?", a: "입력하신 아이디어는 결과 생성 목적으로만 사용하며, 최소 수집·암호화·보관기간·파기 원칙을 따릅니다. 자세한 처리 내용은 개인정보처리방침에 따릅니다." },
  { q: "어떤 아이디어든 되나요?", a: "업종에 관계없이 작동합니다. 위 ‘결과 예시’에서 의료·커머스 등 서로 다른 아이디어가 같은 깊이로 분석되는 것을 직접 확인할 수 있습니다." },
  { q: "법률·세무 자문을 대체하나요?", a: "아니요. 일반적인 정보와 실행 가이드를 제공합니다. 실제 계약·등기·세무·인허가는 반드시 법무사·세무사 등 전문가의 확인이 필요합니다." },
];

const examples = [
  {
    id: "mci",
    label: "의료 · MCI 케어콜",
    input: "경도인지장애 부모를 둔 보호자를 위해, 보호자 목소리로 AI가 매일 안부 전화를 걸어 복약·식사·컨디션을 확인하고 보호자 앱에 기록·알림해 주는 서비스",
    score: 72,
    summary: [
      { k: "한 줄 정의", v: "경도인지장애 노인을 둔 비동거 보호자를 위한 AI 음성 케어콜. 보호자가 녹음한 목소리로 매일 정해진 시간에 전화해 복약·식사·컨디션을 확인하고, 대화를 분석해 보호자 앱에 기록·이상 알림을 제공." },
      { k: "해결 문제", v: "비동거 자녀가 부모의 일상을 매일 확인하기 어렵고, 직접 전화는 지속이 어려워 변화 추세를 놓침. MCI 단계는 악화가 빨라 모니터링 공백이 큼." },
      { k: "1차 고객", v: "부모와 떨어져 사는 40~60대 자녀 — 죄책감·불안이 크고 지불 여력이 있음." },
      { k: "2·3차 고객", v: "요양·복지·재가돌봄 기관(다수 일괄 관리) / 통신사·시니어 디바이스(제휴·번들)." },
      { k: "핵심 가치", v: "매일 챙기지 못해 미안한 보호자에게, 부모가 거부감 없이 받는 익숙한 목소리로 꾸준한 확인·기록·이상 신호 조기 포착을 대신." },
      { k: "수익 모델", v: "B2C 월 구독(주력) + 기관 B2B 좌석제 + 통신사 제휴 수수료." }
    ],
    verdict: "수요와 명분은 강하고, 규제·검증이 관문인 유형입니다. 가장 낮은 규제 축(58)을 서비스 설계로 통제하는 것이 전체 점수를 끌어올리는 핵심 변수이며, 그 통제안은 ‘법인·행정’ 탭에서 다룹니다.",
    axes: [
      { label: "문제 정의·수요", score: 82, note: "초고령사회·MCI 증가 + 비동거 돌봄 공백 — 통증이 크고 우상향하는 시장." },
      { label: "솔루션 차별성", score: 68, note: "케어콜은 경쟁이 존재. 보호자 목소리·MCI 특화가 차별점이나 기술 모방 장벽은 낮음." },
      { label: "기술 실현성", score: 74, note: "STT·TTS·LLM은 성숙. 노인 발화 인식·음성 복제·환각 통제가 실현 난점." },
      { label: "규제·인허가", score: 58, note: "의료기기 경계·건강 민감정보·음성합성 윤리가 얽힘. 설계로 통제 가능한 리스크." },
      { label: "수익모델·단위경제", score: 70, note: "구독 단가 대비 통신·LLM·음성합성 원가 검증 필요. LTV가 관건." },
      { label: "팀·실행력", score: 76, note: "세브란스 임상 자문은 동급 팀 대비 강한 신뢰 자산. 개발 1인 의존이 리스크." }
    ],
    strengths: [
      { t: "명확하고 우상향하는 수요", d: "초고령사회 진입·MCI 인구 증가와 1인 가구·비동거 돌봄의 구조적 증가가 동시에 맞물립니다. ‘부모가 걱정되지만 매일 못 챙긴다’는 통증은 설명이 거의 필요 없을 만큼 보편적이고, 시간이 갈수록 커집니다." },
      { t: "임상 신뢰 자산", d: "헬스케어에서 가장 비싼 자원은 코드가 아니라 임상적 신뢰입니다. 세브란스 교수 자문은 설계의 의학적 타당성, 병원·기관 채널 진입, 투자·심사 신뢰도에서 동급 초기 팀이 갖기 어려운 출발점입니다." },
      { t: "정서적 차별화 — 익숙한 목소리", d: "경쟁 케어콜이 기계음·낯선 음성인 데 반해, 부모가 거부감 없이 받는 보호자 본인 목소리는 응답률·지속률을 끌어올리는 정서적 훅입니다. 검증되면 단순 기능 차이를 넘어선 방어선이 됩니다." },
      { t: "다층 수익 경로", d: "B2C 구독에만 의존하지 않고 기관(B2B)·통신사(제휴)로 확장 가능한 구조라, 단일 채널이 막혀도 대안이 있습니다." }
    ],
    risks: [
      { t: "의료기기·의료행위 경계", sev: "高", d: "‘확인·알림’이 의료 모니터링으로 해석될 위험. → 비의료 건강관리로 포지셔닝하고 기능·카피를 ‘확인·기록·전달’로 한정, 식약처 분류 확인 + 법무 검토." },
      { t: "건강 민감정보 처리", sev: "高", d: "건강정보는 민감정보이고 당사자(MCI)의 동의능력 이슈가 있음. → 보호자·대리 동의 구조 명시, 최소수집·암호화·보관기간·파기 정책 문서화." },
      { t: "음성 합성 윤리·악용", sev: "중~高", d: "음성권·딥보이스 보이스피싱 악용·당사자 인지 윤리. → 본인 인증 기반 등록·합성 동의, AI 안내 고지, 무단합성 방지·로깅." },
      { t: "AI 환각·오탐/미탐", sev: "高", d: "모호한 발화를 잘못 해석해 이상을 놓치거나 거짓 경보 → 돌봄 사고 위험. → 응급 자동판단 배제, 사람(보호자) 확인 루프 강제, 119/보호자 연계." }
    ],
    assumptions: [
      { a: "보호자가 월 구독료를 낼 만큼 통증이 크다", how: "보호자 10~15명 문제 인터뷰 + 가격 민감도 + 현재 대체 지출 확인", pass: "5명 이상 ‘유료라도 쓰겠다’ + 대체 지출(요양·돌봄·통신) 존재" },
      { a: "피보호자가 AI 전화를 받고 지속한다", how: "5~10가구 2주 파일럿, 응답률·완료율·중도 거부율 측정", pass: "응답률 60%+ / 2주 지속률 50%+ (초기 기준)" },
      { a: "보호자 목소리 합성을 수용한다", how: "합성 음성 시연 후 거부감·신뢰 설문, 기계음 vs 보호자음성 선호 비교", pass: "거부감 소수 + 보호자 음성 선호가 유의하게 높음" }
    ],
    roadmap: [
      { code: "P0", title: "아이디어 검증", dur: "2~4주", goal: "돈 낼 보호자가 있는지 확인", milestone: "보호자 인터뷰 10명+ · 핵심 가설 검증 시작", todos: ["보호자 인터뷰 대본 작성 → 10~15명 인터뷰", "경쟁·대안 5종 매핑", "린 캔버스 작성", "5가구 2주 미니 파일럿 협조자 모집"] },
      { code: "P1", title: "사업형태·행정 셋업", dur: "2~4주", goal: "법적 실체 + 규제 포지셔닝", milestone: "사업 형태 결정 · 설립등기 · 규제 1차 정리", todos: ["개인사업자 vs 법인 결정", "(법인 시) 상호·자본금·정관·설립등기 → 사업자등록", "의료기기/비의료 경계 자가진단 + 법무 검토", "개인정보·음성 동의 구조 설계"] },
      { code: "P2", title: "MVP / 프로토타입", dur: "6~10주", goal: "핵심 케어콜 루프", milestone: "케어콜 1회 루프 작동 · 앱 기록·알림", todos: ["기능을 ‘1일 1회 통화→3항목 확인→요약→앱 기록’으로 고정", "STT·TTS·LLM 파이프라인 결정(고지 포함)", "응급 자동판단 배제 + ‘확인 필요’ 전달 로직"] }
    ],
    compare: [
      { k: "대외 신뢰도", a: "낮음", b: "높음", note: "병원·기관·통신사 계약엔 법인 유리" },
      { k: "투자 유치", a: "어려움", b: "가능", note: "정부 R&D·지분 투자 고려 시 법인" },
      { k: "책임 범위", a: "무한책임", b: "유한책임", note: "건강데이터·케어 사고 리스크 분리" }
    ],
    proc: ["상호·사업 목적 정하기 (유사상호·상표 확인)", "본점 소재지 결정 (자택 가능 여부·임대차 확인)", "자본금 결정 (최저 요건 확인 필요)", "정관 작성 (목적에 헬스케어·SW·통신부가 포함)", "주식·발기인 구성, 잔고증명", "설립등기 (등록면허세·등기 비용 확인 필요)"],
    reg: ["의료기기(SaMD) 해당 여부 — 비의료 건강관리로 한정, 식약처 분류 확인", "비의료 건강관리 가이드라인 — 허용·금지 행위에 맞춰 기능·문구 점검", "개인정보·민감정보 — 보호자·대리 동의 구조, 최소수집·암호화·파기"],
    artifacts: [
      { t: "진단 리포트", d: "구조화 요약 + 6축 점수 + 강점·리스크·검증 가정 전체" },
      { t: "린 캔버스", d: "9블록 — 문제·고객·UVP·솔루션·채널·수익·비용·지표·강점" },
      { t: "개인 vs 법인 비교표", d: "신뢰도·투자·책임·세제 기준 의사결정 표" },
      { t: "법인 설립 체크리스트", d: "9단계 준비물·순서·주의점" },
      { t: "규제 자가진단 체크리스트", d: "의료기기·민감정보·음성·응급 5개 항목" },
      { t: "개인정보·음성 동의 처리방침 초안", d: "보호자·대리 동의 구조 반영" }
    ],
  },
  {
    id: "food",
    label: "커머스 · 마감 할인 앱",
    input: "마감 시간이 임박해 남은 음식을 동네 손님에게 할인 가격으로 파는, 가게와 손님을 연결하는 앱 — 가게는 폐기 손실을 줄이고 손님은 싸게 사며 음식물 쓰레기를 줄임",
    score: 70,
    summary: [{ k: "한 줄 정의", v: "마감 임박·재고 음식을 정가보다 싸게 묶은 ‘서프라이즈 백’을 가게와 동네 손님이 앱에서 거래하는 양면 마켓플레이스. 가게는 폐기 손실 회수, 손님은 할인, 환경엔 음식물 쓰레기 감소." }, { k: "해결 문제", v: "카페·베이커리·식당이 매일 버리는 마감 재고 손실 / 소비자의 가격 부담 / 음식물 쓰레기의 환경·사회 비용." }, { k: "1차 고객 (공급)", v: "마감 재고가 발생하는 동네 카페·베이커리·식당 점주 — ‘버리면 0원’이라 도입 장벽이 낮음." }, { k: "1차 고객 (수요)", v: "가성비·환경 의식이 있는 인근 거주·직장인." }, { k: "핵심 가치", v: "버리면 0원인 재고를 매출로 바꾸고, 손님은 반값에 사며, 음식물 쓰레기 감축이라는 사회적 명분을 더함." }, { k: "수익 모델", v: "거래 건당 수수료(주력) + 점주 구독·광고 + (확장) 프랜차이즈·기관 제휴." }],
    verdict: "양면시장 특성상 공급(가게)과 수요(손님)를 동시에 확보하는 ‘콜드스타트’가 최대 관문입니다. 한 지역의 밀도를 먼저 채우는 지역 한정 전략과, 음식물 쓰레기 감축이라는 사회적 명분(소셜벤처 트랙)이 이를 푸는 두 레버입니다.",
    axes: [{ label: "문제 정의·수요", score: 78, note: "점주 폐기 손실·소비자 가성비 모두 명확. 해외에서 검증된 모델." }, { label: "솔루션 차별성", score: 60, note: "모델 자체는 국내외 선례 존재. 지역 밀도·픽업 UX·브랜드가 실제 승부처." }, { label: "기술 실현성", score: 80, note: "위치·예약·결제 조합으로 난도 낮음 — 동시에 진입장벽도 낮다는 뜻." }, { label: "규제·인허가", score: 66, note: "통신판매·전자상거래 표시, 식품 표시·위생 책임. 의료보다 가볍지만 식품안전이 핵심." }, { label: "수익모델·단위경제", score: 64, note: "건당 수수료가 작아 거래량·밀도·재구매 없이는 단위경제가 안 나옴." }, { label: "팀·실행력", score: 70, note: "공급·수요를 동시에 모으는 지역 영업력이 관건." }],
    strengths: [{ t: "버려지던 가치의 전환", d: "폐기 시 0원인 재고를 매출로 바꿔주므로 점주에게 ‘손해 볼 것 없는’ 제안이 됩니다. 공급 측 도입 장벽이 낮아 초기 가게 확보가 상대적으로 쉽습니다." }, { t: "강한 사회적 명분", d: "음식물 쓰레기·탄소 감축은 ESG·지자체·소셜벤처 트랙과 직접 연결되는 스토리이자 지원 자산입니다. 단순 커머스보다 우호적 채널이 많습니다." }, { t: "낮은 기술 난도·빠른 MVP", d: "위치·예약·결제 조합이라 빠르게 만들고 검증할 수 있고, 초기 자금이 적게 든다는 강점이 있습니다. 가설 검증 속도가 빠릅니다." }, { t: "양면 네트워크 효과", d: "한 지역에서 공급·수요 밀도가 임계점을 넘으면 후발주자가 따라오기 어려운 해자가 형성됩니다." }],
    risks: [{ t: "양면 콜드스타트", sev: "高", d: "가게도 손님도 ‘상대가 없으면’ 안 들어옴. → 한 동네에 밀도 집중, 공급(가게)을 먼저 수기로 확보한 뒤 수요를 모객하는 순서 설계." }, { t: "식품 안전·표시 책임", sev: "중~高", d: "마감 식품의 소비기한·알레르기·위생 분쟁 시 플랫폼 책임론. → 소비기한·보관·알레르기 표시 의무화, 점주 약관·면책 조항 정비." }],
    assumptions: [{ a: "점주가 마감 재고를 앱에 올릴 의향이 있다", how: "동네 가게 10~15곳 인터뷰 + 시범 등록", pass: "5곳 이상 실제 등록·반복 등록 의향" }, { a: "손님이 ‘서프라이즈 백’을 반복 구매한다", how: "한 동네 2주 파일럿, 픽업 완료율·재구매율 측정", pass: "픽업 완료 80%+ / 2주 지속률 50%+" }],
    roadmap: [{ code: "P0", title: "아이디어 검증", dur: "2~4주", goal: "양면 수요가 실재하는지 확인", milestone: "가게 10곳+ · 손님 의향 파악 완료", todos: ["점주 10~15곳 인터뷰 + 시범 등록", "손님 가성비·환경 동기 인터뷰", "1개 동네 파일럿 가게 섭외"] }, { code: "P1", title: "사업형태·행정 셋업", dur: "2~4주", goal: "통신판매·표시·결제 정비", milestone: "사업 형태 결정 · 통신판매업 신고", todos: ["개인 vs 법인 결정", "통신판매업 신고 진행", "소비기한·알레르기 표시 시스템 설계"] }],
    compare: [{ k: "대외 신뢰도", a: "낮음", b: "높음", note: "가게 제휴 및 프랜차이즈 영업 시 법인 유리" }, { k: "투자 유치", a: "어려움", b: "가능", note: "임팩트 벤처캐피탈(VC) 및 소셜 트랙 자금 유치" }],
    proc: ["상호 결정 (전자상거래·중개 목적 포함)", "정관 작성 (통신판매·플랫폼 중개 목적 명시)", "법인 설립등기 및 통신판매업 신고"],
    reg: ["통신판매업 신고 의무 및 전상법 요건", "식품 표시·위생 가이드라인 수립", "플랫폼 중개자 지위 약관 및 면책 정비"],
    artifacts: [{ t: "진단 리포트", d: "구조화 요약 + 6축 점수 + 강점·리스크 전체" }, { t: "린 캔버스", d: "문제·고객·UVP·솔루션 포함 9블록 완성본" }, { t: "규제 자가진단 체크리스트", d: "식품안전법·전상법 통제 프레임워크" }],
  },
];

const sampleTabs = [
  { id: "diag", code: "02", label: "진단" },
  { id: "road", code: "03", label: "로드맵" },
  { id: "admin", code: "04", label: "법인·행정" },
  { id: "docs", code: "05", label: "산출물" },
];

const SECTION_COUNT = 10;
const COOLDOWN = 750;
const INTRO_STORAGE_KEY = "bessential:hero-intro-seen";

const sectionBg = [
  "#ffffff", // 0. 히어로
  "#f6f7fb", // 1. Why B Essential
  "#ffffff", // 2. 기능소개
  "#f6f7fb", // 3. 이용방법
  "#ffffff", // 4. 챗봇 비교
  "#ffffff", // 5. 예시 리포트
  "#f6f7fb", // 6. 왜 신뢰할 수 있나
  "#ffffff", // 7. 가격 안내
  "#f6f7fb", // 8. FAQ
  "#0e0f13", // 9. 최종 빌드 및 푸터
];

export default function Home() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [playIntro, setPlayIntro] = useState(false);
  const [exIdx, setExIdx] = useState(0);
  const [tabId, setTabId] = useState("diag");
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  
  // 샌드박스 컴파일러 로딩 레이어 인터랙션 제어용 상태
  const [isCompiling, setIsCompiling] = useState(false);

  const blocking = useRef(false);
  const touchStartY = useRef(0);
  const E = examples[exIdx];

  // 스피너 구동 후 페이지를 라우팅 전환하는 공용 헨들러 인터페이스
  const handleRedirectWithSpinner = useCallback((targetUrl: string) => {
    setIsCompiling(true);
    setTimeout(() => {
      router.push(targetUrl);
    }, 1200); // 1.2초 동안 가상 컴파일 애니메이션 노출
  }, [router]);

  const goTo = useCallback((index: number) => {
    const next = Math.min(Math.max(index, 0), SECTION_COUNT - 1);
    setCurrent(next);
    blocking.current = true;
    setTimeout(() => { blocking.current = false; }, COOLDOWN);
  }, []);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (showModal || isCompiling) return;
      e.preventDefault();
      if (blocking.current) return;
      setCurrent((c) => {
        const next = e.deltaY > 0 ? Math.min(c + 1, SECTION_COUNT - 1) : Math.max(c - 1, 0);
        blocking.current = true;
        setTimeout(() => { blocking.current = false; }, COOLDOWN);
        return next;
      });
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (showModal || isCompiling) {
        if (e.key === "Escape") setShowModal(false);
        return;
      }
      if (blocking.current) return;
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        setCurrent((c) => { const n = Math.min(c + 1, SECTION_COUNT - 1); blocking.current = true; setTimeout(() => { blocking.current = false; }, COOLDOWN); return n; });
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        setCurrent((c) => { const n = Math.max(c - 1, 0); blocking.current = true; setTimeout(() => { blocking.current = false; }, COOLDOWN); return n; });
      }
    };
    const onTouchStart = (e: TouchEvent) => { touchStartY.current = e.touches[0].clientY; };
    const onTouchEnd = (e: TouchEvent) => {
      if (showModal || isCompiling) return;
      if (blocking.current) return;
      const delta = touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(delta) < 30) return;
      setCurrent((c) => {
        const next = delta > 0 ? Math.min(c + 1, SECTION_COUNT - 1) : Math.max(c - 1, 0);
        blocking.current = true;
        setTimeout(() => { blocking.current = false; }, COOLDOWN);
        return next;
      });
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [showModal, isCompiling]);

  return (
    <div
      className="h-screen overflow-hidden text-gray-900 bes"
      style={{ 
        backgroundColor: sectionBg[current],
        transition: "background-color 750ms cubic-bezier(0.16, 1, 0.3, 1)"
      }}
    >
      {/* ── 헤더 ── */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 border-b nav transition-all duration-[750ms] cubic-bezier(0.16, 1, 0.3, 1) ${current === 9 ? "bg-black/20 border-white/10 text-white" : "bg-white/85 border-gray-100"}`}
        style={{ backdropFilter: "blur(12px)", backgroundColor: current === 9 ? "rgba(14, 15, 19, 0.85)" : "rgba(255, 255, 255, 0.85)", borderColor: current === 9 ? "rgba(255, 255, 255, 0.1)" : "rgba(243, 244, 246, 1)", color: current === 9 ? "#ffffff" : "#111827" }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between nav-in">
          <button 
            onClick={() => goTo(0)}
            className="flex items-center gap-2 cursor-pointer bg-transparent border-none p-0 active:scale-95 transition-transform"
            aria-label="B Essential 공식 홈페이지로 이동"
          >
          <div className="flex items-center gap-2 cursor-pointer active:scale-95 transition-transform">
            {/* current === 9 (마지막 섹션)일 때 로고 이미지가 logo(w).svg로 750ms 동기화 전환되도록 스위칭 */}
            <Image 
              src={current === 9 ? "/logo(w).svg" : "/logo.svg"} 
              alt="B Essential" 
              width={110} 
              height={20} 
              priority 
              className="sm:w-[130px] sm:h-[22px]"
              style={{ transition: "all 750ms cubic-bezier(0.16, 1, 0.3, 1)" }}
            />
          </div>
          </button>
          <nav className="hidden md:flex items-center gap-8 text-sm nav-links">
            {[
              { label: "기능", idx: 2 },
              { label: "이용 방법", idx: 3 },
              { label: "챗봇 비교", idx: 4 },
              { label: "결과 예시", idx: 5 },
              { label: "가격", idx: 7 },
            ].map(({ label, idx }) => (
              <button
                key={label}
                onClick={() => goTo(idx)}
                className="transition-colors duration-200 cursor-pointer bg-transparent border-none p-0 text-current opacity-80 hover:opacity-100"
              >
                {label}
              </button>
            ))}
          </nav>
          <button
            onClick={() => handleRedirectWithSpinner(PRODUCT_URL)}
            className="text-xs sm:text-sm font-medium px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors cursor-pointer btn btn-grad nav-cta whitespace-nowrap border-none"
          >
            무료로 진단하기
          </button>
        </div>
      </header>

      {/* 우측 네비게이터 도트 */}
      <nav className="fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 z-50 hidden sm:flex flex-col gap-3">
        {Array.from({ length: SECTION_COUNT }).map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer border-none p-0 ${
              current === i
                ? "bg-indigo-400 scale-125"
                : current === SECTION_COUNT - 1
                ? "bg-white/40 hover:bg-white/70"
                : "bg-gray-300 hover:bg-indigo-300"
            }`}
            aria-label={`섹션 ${i + 1}`}
          />
        ))}
      </nav>

      {/* 풀페이지 슬라이더 트랙 컨테이너 */}
      <div
        className="will-change-transform transition-transform"
        style={{ 
          transform: `translateY(-${current * 100}vh)`,
          transition: "transform 750ms cubic-bezier(0.16, 1, 0.3, 1)"
        }}
      >
        {/* ── 섹션 0 · 히어로 ── */}
        <section className="h-screen flex flex-col items-center justify-center px-4 sm:px-6 pt-16 text-center relative overflow-hidden hero" id="top">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(99,102,241,0.08),transparent)]" />
          <div className="max-w-3xl mx-auto hero-in">
            <span className="hero-badge mb-3 text-[10px] sm:text-xs">비공개 베타 · 얼리 액세스 모집</span>
            <span className="block text-[10px] sm:text-xs font-semibold tracking-widest text-indigo-600 uppercase mb-3 sm:mb-4 eyebrow">
              IDEA → COMPANY · 사업화 OS
            </span>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight text-gray-900 mb-4 sm:mb-6 h1 hero-h1">
              막막한 아이디어를,<br />
              <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 bg-clip-text text-transparent gradient-flow grad-text">
                실행 가능한 회사로.
              </span>
            </h1>
            <p className="text-sm sm:text-lg md:text-xl text-gray-500 leading-relaxed mb-8 sm:mb-10 max-w-xl mx-auto lead hero-lead px-2">
              사업성 진단 · 단계별 로드맵 · 법인/행정 셋업 · 정부지원사업 매칭까지.
              아이디어 한 줄을 넣으면, 무엇을 어떤 순서로 해야 하는지 정리해 드립니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center hero-cta items-center w-full px-4 sm:px-0">
              <button
                onClick={() => handleRedirectWithSpinner(PRODUCT_URL)}
                className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-indigo-600 text-white font-semibold text-sm sm:text-base hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 cursor-pointer border-none btn btn-grad whitespace-nowrap inline-flex items-center gap-1.5 justify-center"
              >
                아이디어 무료로 진단하기 <ArrowRight size={17} className="shrink-0" />
              </button>
              <button
                onClick={() => goTo(3)}
                className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-full border border-gray-200 text-gray-700 font-semibold text-sm sm:text-base hover:bg-gray-50 transition-colors cursor-pointer bg-transparent btn btn-ghost whitespace-nowrap"
              >
                작동 방식 보기
              </button>
            </div>
            <p className="text-[11px] sm:text-sm text-gray-400 mt-4 hero-micro">
              요약·강점·점수는 무료 · 전체 결과는 아이디어 1건 결제 · 구독 아님
            </p>
          </div>

          <div className="mt-8 sm:mt-12 max-w-2xl w-full grid grid-cols-3 gap-3 sm:gap-8 pt-6 sm:pt-8 border-t border-gray-100 stats px-2">
            {stats.map((s, i) => (
              <div key={i} className="text-center stat">
                <div className="text-sm sm:text-xl font-bold text-gray-900 stat-num whitespace-nowrap overflow-hidden text-ellipsis">{s.suffix}</div>
                <div className="text-[10px] sm:text-xs text-gray-500 mt-1 stat-lab break-keep leading-tight">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 섹션 1 · Why B Essential ── */}
        <section className="h-screen flex items-center px-4 sm:px-6 bes-section">
          <div className="max-w-5xl w-full mx-auto grid md:grid-cols-2 gap-8 sm:grid-cols-1 md:gap-16 items-center value-grid">
            <div>
              <span className="text-xs font-semibold tracking-widest text-indigo-600 uppercase eyebrow">WHY B ESSENTIAL</span>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight text-gray-900 mt-3 sm:mt-5 h2 break-keep">
                '그래서 뭐부터 하지?'에서<br className="hidden sm:inline" /> 멈추지 않도록.
              </h2>
            </div>
            <div className="space-y-4 sm:space-y-5 text-gray-500 text-sm sm:text-base md:text-lg leading-relaxed value-body">
              <p className="lead">
                대부분의 창업 도구는 <strong className="text-gray-900 font-semibold">이미 시작한 사람</strong>을 위한 것입니다.
                정작 아이디어만 있는 사람은 첫 발에서 막힙니다.
              </p>
              <p>
                B Essential은 그 0→1 구간을 메웁니다. 흩어진 정보를 검색으로 짜맞추는 대신,
                내 아이디어에 맞는 순서로 진단하고, 해야 할 일을 단계로 정리하고,
                필요한 서류까지 만들어 줍니다.
              </p>
            </div>
          </div>
        </section>

        {/* ── 섹션 2 · 기능 6개 ── */}
        <section className="h-screen flex flex-col items-center justify-center px-4 sm:px-6 bes-section tint">
          <div className="max-w-6xl w-full mx-auto overflow-y-auto max-h-[85vh] sm:overflow-visible pr-1">
            <div className="text-center mb-6 sm:mb-10 sec-head">
              <span className="text-xs font-semibold tracking-widest text-indigo-600 uppercase eyebrow">WHAT YOU GET</span>
              <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mt-2 sm:mt-3 h2">
                아이디어를 '실행 가능한 계획'으로
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 card-grid">
              {features.map((f, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 card shadow-sm">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 card-ico">
                    {f.icon}
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-1.5 sm:mb-2 card-title">{f.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed card-desc">{f.desc}</p>
                  {f.note && (
                    <span className="inline-block mt-2.5 text-[10px] font-mono text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-0.5 card-note">
                      {f.note}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 섹션 3 · 이용 방법 ── */}
        <section className="h-screen flex flex-col items-center justify-center px-4 sm:px-6 bes-section">
          <div className="max-w-5xl w-full mx-auto">
            <div className="text-center mb-8 sm:mb-12 sec-head">
              <span className="text-xs font-semibold tracking-widest text-indigo-600 uppercase eyebrow">HOW IT WORKS</span>
              <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mt-2 sm:mt-3 mb-2 h2">
                입력에서 실행까지, 네 단계
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10 steps">
              {steps.map((s, i) => (
                <div key={i} className="relative step flex sm:block items-start gap-4">
                  <span className="text-3xl sm:text-4xl font-black text-indigo-500 font-mono step-n leading-none shrink-0">{s.num}</span>
                  <div className="relative z-10">
                    <h3 className="font-semibold text-neutral-900 text-sm sm:text-lg sm:mt-1 mb-1 sm:mb-2 step-title">{s.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 leading-relaxed step-desc">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 섹션 4 · 범용 챗봇 비교 ── */}
        <section className="h-screen flex flex-col items-center justify-center px-4 sm:px-6 bes-section tint">
          <div className="max-w-4xl w-full mx-auto overflow-y-auto max-h-[85vh] sm:overflow-visible pr-1">
            <div className="text-center mb-6 sm:mb-10 sec-head">
              <span className="text-xs font-semibold tracking-widest text-indigo-600 uppercase eyebrow">WHY NOT JUST A CHATBOT</span>
              <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mt-2 sm:mt-3 h2">범용 챗봇으로는 안 됩니다</h2>
              <p className="text-gray-500 text-xs sm:text-base mt-2 lead px-2">
                내 아이디어에 맞춘 전용 순서·근거·행정 셋업 매핑 뼈대를 구성합니다.
              </p>
            </div>
            <div className="border border-gray-100 rounded-2xl sm:rounded-3xl overflow-hidden bg-white shadow-sm vs">
              <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-100 font-semibold text-xs sm:text-sm text-gray-700 vs-head">
                <div className="p-3 sm:p-4 pl-4 sm:pl-6 text-gray-400 font-mono text-[10px] sm:text-xs tracking-wider vs-axis">기준</div>
                <div className="p-3 sm:p-4 text-gray-500 vs-col vs-gpt">범용 챗봇</div>
                <div className="p-3 sm:p-4 text-indigo-600 font-bold vs-col vs-be">B Essential</div>
              </div>
              {chatbotComparison.map((v, i) => (
                <div key={i} className="grid grid-cols-3 border-b border-gray-50 last:border-none text-xs sm:text-sm items-center vs-row">
                  <div className="p-3 sm:p-4 pl-4 sm:pl-6 font-mono text-[10px] sm:text-xs text-gray-400 font-semibold vs-axis">{v.axis}</div>
                  <div className="p-3 sm:p-4 text-gray-500 flex gap-1 sm:gap-2 items-start vs-cell vs-gpt break-all">
                    <X size={13} className="mt-0.5 text-gray-300 shrink-0" /> <span className="text-[11px] sm:text-sm">{v.gpt}</span>
                  </div>
                  <div className="p-4 sm:p-4 text-gray-900 font-medium bg-gradient-to-r from-indigo-50/10 to-purple-50/20 h-full flex gap-1 sm:gap-2 items-center vs-cell vs-be break-all">
                    <Check size={13} className="text-indigo-500 shrink-0" /> <span className="text-[11px] sm:text-sm font-semibold">{v.be}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 섹션 5 · 실제 결과 미리보기 ── */}
        <section className="h-screen flex flex-col items-center justify-center px-4 sm:px-6 bes-section">
          <div className="max-w-5xl w-full mx-auto overflow-y-auto max-h-[85vh] pr-1">
            <div className="text-center mb-4 sm:mb-6 sec-head">
              <span className="text-xs font-semibold tracking-widest text-indigo-600 uppercase eyebrow">SAMPLE OUTPUT</span>
              <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mt-1 sm:mt-3 h2">결제하면, 이만큼 나옵니다</h2>
            </div>
            
            <div className="flex gap-2 items-center mb-3 overflow-x-auto pb-1 whitespace-nowrap scrollbar-hide ex-chips">
              <span className="text-[11px] text-gray-400 ex-chips-lab sticky left-0 bg-white pr-2 shrink-0">예시</span>
              {examples.map((x, i) => (
                <button key={x.id} onClick={() => setExIdx(i)} className={`ex-chip px-3 py-1 text-xs rounded-full border ${exIdx === i ? "on bg-indigo-50 text-indigo-600 border-indigo-200 font-semibold" : "border-gray-200 text-gray-500 bg-white"}`}>{x.label}</button>
              ))}
            </div>

            <div className="sample-input mb-3 p-3 bg-white border border-gray-100 rounded-xl flex gap-2 text-xs sm:text-sm">
              <span className="sample-input-lab shrink-0 bg-indigo-50 text-indigo-600 px-1.5 py-0.5 text-[10px] font-mono rounded h-fit">입력</span>
              <p className="text-gray-700 leading-normal">{E.input}</p>
            </div>

            <div className="flex gap-1 mb-3 overflow-x-auto pb-1 whitespace-nowrap scrollbar-hide sample-tabs border-b border-gray-100">
              {sampleTabs.map((t) => (
                <button key={t.id} onClick={() => setTabId(t.id)} className={`sample-tab px-4 py-2 text-xs font-medium border-b-2 transition-all ${tabId === t.id ? "on border-indigo-600 text-indigo-600 font-bold" : "border-transparent text-gray-400"}`}>
                  <span className="sample-tab-code mr-1 font-mono text-[10px] opacity-60">{t.code}</span>{t.label}
                </button>
              ))}
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 shadow-sm sample-panel text-xs sm:text-sm mb-3">
              {tabId === "diag" && (
                <div>
                  <div className="font-bold mb-2.5 blk-h flex items-center gap-1.5">종합 매핑 요약 <span className="free-badge text-green-600 bg-green-50 px-1.5 py-0.2 rounded text-[10px]">무료 공개</span></div>
                  <div className="border border-gray-100 rounded-xl overflow-hidden sum-card divide-y divide-gray-50">
                    {E.summary.map((s, i) => (
                      <div key={i} className="grid grid-cols-1 sm:grid-cols-4 p-3 gap-1 sm:gap-3 sum-row"><span className="font-semibold text-indigo-600 sum-k text-xs">{s.k}</span><span className="sm:col-span-3 text-gray-600 text-xs break-all">{s.v}</span></div>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-5 items-center sp-diag-top">
                    <div className="text-center bg-gray-50/60 rounded-xl p-3 score-box">
                      <div className="text-3xl sm:text-4xl font-extrabold text-indigo-600 score-big">{E.score}<span className="text-xs text-gray-400 score-out">/100</span></div>
                      <div className="text-[10px] text-gray-400 mt-1 score-sub">비즈니스 진단 지수</div>
                    </div>
                    <div className="sm:col-span-2 space-y-1.5 axis">
                      {E.axes.map((a, i) => (
                        <div key={i} className="grid grid-cols-4 items-center gap-1 text-[11px] sm:text-xs axis-item">
                          <span className="text-gray-600 axis-label truncate col-span-1">{a.label}</span>
                          <div className="col-span-2 h-2 bg-gray-100 rounded-full overflow-hidden axis-bar"><div className="h-full bg-indigo-500 axis-fill" style={{ width: `${a.score}%` }} /></div>
                          <span className="text-right font-mono text-gray-900 axis-num col-span-1">{a.score}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {tabId === "road" && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 rm-rail">
                  {E.roadmap.map((r, i) => (
                    <div key={i} className="border border-gray-100 p-4 rounded-xl bg-gray-50/50 rm-step">
                      <div className="flex justify-between items-center mb-1.5 rm-head"><span className="bg-indigo-50 text-indigo-600 text-[10px] font-mono px-1.5 py-0.2 rounded rm-code">{r.code}</span><span className="text-[10px] text-gray-400 rm-dur">{r.dur}</span></div>
                      <div className="font-bold text-gray-900 text-xs sm:text-sm rm-title">{r.title}</div>
                      <p className="text-[11px] text-gray-500 mt-1 rm-goal break-keep">{r.goal}</p>
                    </div>
                  ))}
                </div>
              )}
              {tabId === "admin" && (
                <div>
                  <div className="border border-gray-100 rounded-xl overflow-hidden cmp divide-y divide-gray-100">
                    {E.compare.map((c, i) => (
                      <div key={i} className="grid grid-cols-3 p-3 text-[11px] sm:text-xs cmp-row"><span className="font-bold text-gray-700 cmp-k truncate">{c.k}</span><span className="text-gray-500 truncate">개인: {c.a}</span><span className="text-indigo-600 font-semibold cmp-b truncate">법인: {c.b}</span></div>
                    ))}
                  </div>
                </div>
              )}
              {tabId === "docs" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 doc-grid">
                  {E.artifacts.slice(0, 6).map((a, i) => (
                    <div key={i} className="border border-gray-100 p-3 rounded-xl doc-card"><FileText className="text-indigo-500 w-4 h-4 mb-1 doc-ico" /><div className="font-bold text-xs text-gray-900 doc-t truncate">{a.t}</div><p className="text-[11px] text-gray-500 mt-0.5 doc-d leading-tight break-keep">{a.d}</p></div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-center mt-3">
              <button
                onClick={() => setShowModal(true)}
                className="w-full sm:w-auto px-5 py-3 rounded-full bg-neutral-900 text-white font-medium text-xs hover:bg-neutral-800 transition-colors inline-flex items-center gap-1.5 shadow-sm whitespace-nowrap justify-center focus:outline-none"
              >
                <ListChecks size={15} /> 상세 리포트 보기 →
              </button>
            </div>
          </div>
        </section>

        {/* ── 섹션 6 · 신뢰 지표 ── */}
        <section className="h-screen flex flex-col items-center justify-center px-4 sm:px-6 bes-section tint">
          <div className="max-w-5xl w-full mx-auto overflow-y-auto max-h-[85vh] sm:overflow-visible pr-1">
            <div className="text-center mb-6 sm:mb-12 sec-head">
              <span className="text-xs font-semibold tracking-widest text-indigo-600 uppercase eyebrow">WHY YOU CAN TRUST IT</span>
              <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mt-2 sm:mt-3 h2">왜 믿을 수 있나</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 trust-grid">
              {trustItems.map((t, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm trust-card">
                  <div className="w-9 h-9 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-3 trust-ico">
                    {t.icon}
                  </div>
                  <h4 className="font-bold text-sm sm:text-base text-gray-900 trust-t">{t.t}</h4>
                  <p className="text-xs text-gray-500 mt-2 leading-relaxed trust-d break-keep">{t.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 섹션 7 · 가격 안내 ── */}
        <section className="h-screen flex flex-col items-center justify-center px-4 sm:px-6 bes-section">
          <div className="max-w-5xl w-full mx-auto overflow-y-auto max-h-[85vh] sm:overflow-visible pr-1">
            <div className="text-center mb-6 sm:mb-8 sec-head">
              <span className="text-xs font-semibold tracking-widest text-indigo-600 uppercase eyebrow">PRICING</span>
              <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mt-2 sm:mt-3 h2">구독이 아니라, 아이디어별 결제</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 price-grid">
              {prices.map((p, i) => (
                <div key={i} className={`relative flex flex-col rounded-2xl p-5 sm:p-6 bg-white border transition-all duration-200 price ${p.highlight ? "border-indigo-500 shadow-lg shadow-indigo-100 price-hi" : "border-gray-100"}`}>
                  {p.tag && <span className="absolute -top-3 left-5 bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full price-tag">{p.tag}</span>}
                  <div className="font-bold text-gray-900 text-sm sm:text-base price-name">{p.name}</div>
                  <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 mt-1 sm:mt-2 price-amt">
                    {p.was && <span className="text-xs sm:text-sm text-gray-400 line-through mr-2 font-normal price-was">{p.was}</span>}
                    {p.price}
                  </div>
                  <div className="text-[11px] sm:text-xs text-gray-500 mt-1 mb-3.5 price-note leading-tight">{p.note}</div>
                  <ul className="space-y-1.5 flex-1 price-feats mb-4">
                    {p.features.map((f, idx) => (
                      <li key={idx} className="flex gap-2 text-xs text-gray-600"><Check className="text-indigo-500 w-3.5 h-3.5 price-check shrink-0 mt-0.5" /> <span className="break-keep">{f}</span></li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handleRedirectWithSpinner(PRODUCT_URL)}
                    className={`w-full block text-center py-2 rounded-full text-xs font-semibold transition-colors btn cursor-pointer border-none ${p.highlight ? "bg-indigo-600 text-white hover:bg-indigo-700 btn-grad" : "border border-gray-200 text-gray-700 hover:border-gray-400 btn-ghost"} price-cta whitespace-nowrap`}
                  >
                    {p.cta}
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-gray-50 border border-gray-100 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 org">
              <div><div className="font-semibold text-xs sm:text-sm org-title">기관 · 팀 제휴</div><p className="text-[11px] sm:text-xs text-gray-500 org-desc break-keep">대학 창업지원단 · 액셀러레이터 · 지자체 전용 화이트라벨 일괄 제맹 대시보드</p></div>
              <button
                onClick={() => handleRedirectWithSpinner(PRODUCT_URL)}
                className="w-full sm:w-auto text-center text-xs font-semibold border border-gray-300 border-solid rounded-full px-4 py-1.5 btn btn-ghost shrink-0 whitespace-nowrap bg-white hover:bg-gray-50 cursor-pointer"
              >
                도입 문의
              </button>
            </div>
          </div>
        </section>

        {/* ── 자주 묻는 질문 ── */}
        <section className="h-screen flex flex-col items-center justify-center px-4 sm:px-6 bes-section tint">
          <div className="max-w-3xl w-full mx-auto overflow-y-auto max-h-[80vh] pr-1">
            <div className="text-center mb-6 sm:mb-8 sec-head">
              <span className="text-xs font-semibold tracking-widest text-indigo-600 uppercase eyebrow">FAQ</span>
              <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mt-2 sm:mt-3 h2">결제 전에, 궁금한 것들</h2>
            </div>
            <div className="space-y-2.5 faq-list">
              {faqs.map((f, i) => {
                const isOpen = openFaqIdx === i;
                return (
                  <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden faq-item transition-all duration-300 shadow-sm">
                    <button 
                      onClick={() => setOpenFaqIdx(isOpen ? null : i)}
                      className="w-full flex justify-between items-center p-3.5 font-semibold text-xs sm:text-sm text-left text-gray-800 hover:bg-gray-50/60 transition-colors select-none faq-q focus:outline-none gap-2 bg-transparent border-none"
                    >
                      <span className="break-keep">{f.q}</span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-indigo-600" : ""}`} />
                    </button>
                    <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                      <div className="overflow-hidden">
                        <div className="p-4 pt-0 text-[11px] sm:text-xs text-gray-500 leading-relaxed faq-a border-t border-gray-50/50 bg-gray-50/20 break-keep">
                          {f.a}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 섹션 9 · 피날레 및 푸터 ── */}
        <section 
          className="h-screen flex flex-col items-center justify-center px-4 sm:px-6 relative overflow-hidden"
          style={{
            background: "linear-gradient(to bottom, #0e0f13 0%, #050507 100%)",
            transition: "all 750ms cubic-bezier(0.16, 1, 0.3, 1)"
          }}
        >
          <div className="flex-1 flex items-center justify-center w-full">
            <div className="max-w-2xl text-center px-2">
              <span className="text-xs font-semibold tracking-widest text-indigo-300 uppercase eyebrow">START NOW</span>
              <h2 className="text-2xl sm:text-4xl font-bold text-white mt-2 sm:mt-3 mb-3 sm:mb-4 h2 cta-h2">막막함은 여기서 끝내세요.</h2>
              <p className="text-xs sm:text-base text-gray-400 mb-6 sm:mb-8 lead cta-lead break-keep">아이디어 한 줄이면 충분합니다. 요약·강점·점수까지는 무료로 바로 확인하세요.</p>
              <button
                onClick={() => handleRedirectWithSpinner(PRODUCT_URL)}
                className="w-full sm:w-auto inline-block px-8 py-3.5 rounded-full bg-white text-indigo-600 font-bold text-sm hover:bg-indigo-50 transition-colors shadow-lg btn btn-grad whitespace-nowrap cursor-pointer border-none"
              >
                아이디어 무료로 진단하기
              </button>
            </div>
          </div>

          <footer className="w-full border-t border-white/10 py-5 sm:py-6 text-white/50 text-[10px] sm:text-xs footer overflow-y-auto max-h-[35vh]">
            <div className="max-w-6xl mx-auto flex flex-col gap-3.5 sm:gap-4 px-2">
              <div className="flex flex-col lg:flex-row justify-between gap-4 foot-disc">
                <div className="flex items-center gap-2 text-white font-bold foot-brand">
                  <Link 
                    href="/" 
                    className="flex items-center gap-2 cursor-pointer active:scale-95 transition-transform"
                    aria-label="B Essential 공식 홈페이지로 이동"
                  >
                    {/* 푸터 영역의 로고도 마지막 9번 섹션 진입 시 logo(w).svg로 연동 교체 수립 */}
                    <Image 
                      src="/logo(w).svg" 
                      alt="B Essential" 
                      width={110} 
                      height={20} 
                      priority 
                      className="sm:w-[130px] sm:h-[22px]"
                      style={{ transition: "all 750ms cubic-bezier(0.16, 1, 0.3, 1)" }}
                    />
                  </Link>
                </div>
                <p className="max-w-2xl text-left lg:text-right text-[10px] sm:text-[11px] leading-relaxed break-keep">
                  본 서비스는 일반적인 정보와 실행 가이드를 제공하며, 법률·세무·노무 자문이 아닙니다. 법인 설립 절차·비용·세금, 정부지원사업의 요건·금액·일정은 시점에 따라 달라질 수 있어, 진행 전 공식 공고와 전문가(법무사·세무사 등) 확인이 필요합니다.
                </p>
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-1 pt-2 border-t border-white/5 text-[10px] sm:text-[11px] text-white/40 foot-biz">
                <span className="foot-biz-item"><b>대표: </b>임태호</span>
                <span className="foot-biz-item"><b>사업자등록번호: </b>[000-00-00000]</span>
                <span className="foot-biz-item"><b>통신판매업: </b>0000-서울00구-0000</span>
                <span className="foot-biz-item"><b>주소: </b>서울특별시 00구 00로 00</span>
                <span className="foot-biz-item"><b>문의: </b>example@bessential.ai.kr</span>
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-center pt-2 border-t border-white/5 text-[10px] sm:text-[11px] gap-2 foot-bottom">
                <span>© 2026 B Essential. All rights reserved.</span>
                <div className="flex gap-4 foot-links text-white/40">
                  <a href="#" className="hover:text-white transition-colors">이용약관</a>
                  <a href="#" className="hover:text-white transition-colors">개인정보처리방침</a>
                  <a href="#" className="hover:text-white transition-colors">환불정책</a>
                </div>
              </div>
            </div>
          </footer>
        </section>

      </div>

      {/* ── 오버레이 상세 리포트 팝업 모달 ── */}
      <div 
        className={`fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 bg-neutral-950/60 backdrop-blur-md transition-all duration-300 ${showModal ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setShowModal(false)}
      >
        <div 
          className={`bg-white w-full max-w-4xl h-full sm:h-[85vh] rounded-none sm:rounded-3xl shadow-2xl overflow-hidden border border-neutral-100 flex flex-col transition-all duration-500 transform ${showModal ? "translate-y-0 scale-100" : "translate-y-12 scale-95"}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50 shrink-0">
            <div>
              <div className="text-[9px] sm:text-[10px] font-mono font-bold text-indigo-600 uppercase tracking-widest mb-0.5">B Essential Analytics</div>
              <h3 className="text-sm sm:text-base font-bold text-neutral-900 truncate max-w-[200px] sm:max-w-none">{E.label} 상세 리포트</h3>
            </div>
            <button 
              onClick={() => setShowModal(false)}
              className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200/70 text-neutral-500 hover:text-neutral-900 transition-colors focus:outline-none"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 sm:space-y-8 select-text">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
              
              <div className="md:col-span-2 space-y-5 sm:space-y-6">
                <div className="border border-neutral-100 rounded-xl sm:rounded-2xl p-4 sm:p-5 bg-white shadow-sm">
                  <h4 className="font-bold text-neutral-950 text-xs sm:text-sm mb-3.5 flex items-center gap-1.5 text-red-600">
                    <ShieldAlert size={16} /> 크리티컬 리스크 통제 장치
                  </h4>
                  <div className="space-y-3.5">
                    {E.risks?.map((r, i) => (
                      <div key={i} className="border-b border-neutral-50 pb-3 last:border-none last:pb-0 text-xs">
                        <div className="flex items-center gap-2 font-bold text-neutral-900 mb-1">
                          <span className="break-all">{r.t}</span>
                          <span className="bg-red-50 text-red-600 border border-red-100 px-1.5 py-0.2 rounded text-[9px] font-mono shrink-0">{r.sev}</span>
                        </div>
                        <p className="text-neutral-500 leading-relaxed text-[11px] sm:text-xs break-keep">{r.d}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {E.assumptions && (
                  <div className="border border-neutral-100 rounded-xl sm:rounded-2xl p-4 sm:p-5 bg-white shadow-sm">
                    <h4 className="font-bold text-neutral-950 text-xs sm:text-sm mb-3.5 flex items-center gap-1.5 text-indigo-600">
                      <HelpCircle size={16} /> 먼저 검증해야 할 핵심 가설
                    </h4>
                    <div className="space-y-2.5">
                      {E.assumptions.map((a, i) => (
                        <div key={i} className="p-3 bg-neutral-50/60 rounded-xl text-xs border border-neutral-100/50">
                          <div className="font-semibold text-neutral-900 mb-1 flex items-center gap-1 break-keep">🎯 가설: {a.a}</div>
                          <div className="text-neutral-500 mb-1 leading-normal"><span className="font-medium text-neutral-700">방법:</span> {a.how}</div>
                          <div className="text-indigo-600 font-medium leading-normal"><span className="font-medium text-neutral-700">합격선:</span> {a.pass}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-5 sm:space-y-6">
                <div className="border border-neutral-100 rounded-xl sm:rounded-2xl p-4 sm:p-5 bg-white shadow-sm">
                  <h4 className="font-bold text-neutral-950 text-xs sm:text-sm mb-3.5 flex items-center gap-1.5 text-emerald-600">
                    <CheckCircle2 size={16} /> 단계별 구체적 할 일 목록
                  </h4>
                  <div className="space-y-3">
                    {E.roadmap.map((r, i) => (
                      <div key={i} className="p-3 border border-neutral-100 bg-neutral-50/50 rounded-xl text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono font-bold text-[9px] bg-indigo-50 text-indigo-600 px-1.5 py-0.2 rounded">{r.code}</span>
                          <span className="text-[9px] text-neutral-400">{r.dur}</span>
                        </div>
                        <div className="font-semibold text-xs text-neutral-900 mb-1.5">{r.title}</div>
                        <ul className="space-y-1 pl-3.5 list-disc text-neutral-500 text-[11px] sm:text-xs leading-normal break-keep">
                          {r.todos?.map((todo, idx) => (
                            <li key={idx}>{todo}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ── [신규 연출] 샌드박스 커널 컴파일러 가상 로딩 스피너 오버레이 ── */}
      <div 
        className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-gradient-to-b from-neutral-950 to-black text-white transition-opacity duration-300 ${isCompiling ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        <div className="flex flex-col items-center gap-4 text-center px-6">
          {/* 부드럽게 무한 회전하는 CSS 스피너 원형 링 */}
          <div className="w-10 h-10 border-4 border-white/10 border-t-indigo-500 rounded-full animate-spin shrink-0" />
          
          <div className="space-y-1 mt-2">
            <h4 className="text-sm font-bold tracking-tight font-mono text-neutral-200">SANDBOX OS LOADING</h4>
            <p className="text-xs text-neutral-500 font-mono tracking-wide">샌드박스 커널 및 데이터 맵 구조화 중...</p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes heroRiseIn {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-rise-in {
          opacity: 0;
          animation: heroRiseIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes gradientFlow {
          0%, 100% { background-position: 0% 50%; }
          50%       { background-position: 100% 50%; }
        }
        .gradient-flow {
          background-size: 200% 200%;
          animation: gradientFlow 4s ease infinite;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-rise-in  { animation: none; opacity: 1; }
          .gradient-flow { animation: none; }
        }

        body { 
          overflow: hidden; 
          font-family: 'Pretendard', sans-serif; 
          overscroll-behavior: none; /* 핵심: 모바일 바운스 차단 */
          touch-action: pan-y;       /* 핵심: 터치 스크롤 제어 최적화 */
        }
        
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}