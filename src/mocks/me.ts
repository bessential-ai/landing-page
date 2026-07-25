// [MOCK] 마이 페이지 목 데이터. 실제 API 는 TODO(report-api)/TODO(auth-api).
export interface IdeaListItem {
  reportId: string;
  title: string;
  score: number;
  updatedAt: string;
  paid: boolean;
}

export interface Receipt {
  id: string;
  product: string;
  amount: string;
  paidAt: string;
  method: string;
}

export const MY_IDEAS: IdeaListItem[] = [
  { reportId: "demo", title: "보호자 목소리 AI 안부 케어콜", score: 72, updatedAt: "2026-07-20", paid: true },
  { reportId: "food-1", title: "마감 임박 음식 동네 할인 연결 앱", score: 70, updatedAt: "2026-07-18", paid: false },
];

export const MY_RECEIPTS: Receipt[] = [
  { id: "r-0001", product: "첫 구매 (아이디어 1건)", amount: "990원", paidAt: "2026-07-20", method: "카드" },
];

export const MY_ACCOUNT = {
  email: "founder@example.com", // TODO(auth-api): 실제 계정 이메일
};
