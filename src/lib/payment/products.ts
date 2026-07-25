// [PAYMENT] 결제 상품 — §3-1 가격 체계. 결제(G) 화면의 단일 소스.
export interface Product {
  id: "first" | "repurchase" | "bundle";
  name: string;
  price: number; // 원
  priceLabel: string;
  note: string;
  perUnit?: string; // 묶음 건당 단가 병기 (가격 사다리)
  once?: string; // 계정당 1회 한정 등
}

export const PRODUCTS: Product[] = [
  { id: "first", name: "첫 구매", price: 990, priceLabel: "990원", note: "이 아이디어를 끝까지", once: "계정당 1회 한정" },
  { id: "repurchase", name: "재구매", price: 3900, priceLabel: "3,900원", note: "건당 · 다음 아이디어부터" },
  { id: "bundle", name: "묶음 3건", price: 9900, priceLabel: "9,900원", note: "여러 아이디어 비교", perUnit: "건당 3,300원" },
];

export function productById(id: string | null | undefined): Product {
  return PRODUCTS.find((p) => p.id === id) ?? PRODUCTS[0];
}
