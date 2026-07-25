// [CONFIG] 사업자 정보 — IA-SPEC §3-2 (법정 표시 의무 항목)
// 미확정 값은 빈 문자열 + TODO(company-info). UI 는 값이 빈 항목을 렌더하지 않는다(§3-3 원칙 준용).
// 확정: 대표자명(임태호), 사업자등록번호(772-88-04055).

export interface CompanyInfo {
  serviceName: string;
  representative: string; // 대표자명 (확정)
  businessRegNo: string; // 사업자등록번호 (확정)
  mailOrderNo: string; // 통신판매업신고번호
  address: string; // 주소
  inquiryEmail: string; // 문의 이메일
  copyrightYear: string;
}

export const COMPANY: CompanyInfo = {
  serviceName: "B Essential",
  representative: "임태호",
  businessRegNo: "772-88-04055",
  mailOrderNo: "", // TODO(company-info): 통신판매업신고번호 미확정
  address: "연세로2나길 61, 1층", // 확정

  inquiryEmail: "", // TODO(company-info): 문의 이메일 미확정 (기존 example@ 플레이스홀더 폐기)
  copyrightYear: "2026",
};

/** 값이 확정된(비어있지 않은) 사업자 정보 항목만 반환. 푸터/사업자정보 표기에서 사용. */
export function businessInfoItems(): { label: string; value: string }[] {
  return [
    { label: "대표", value: COMPANY.representative },
    { label: "사업자등록번호", value: COMPANY.businessRegNo },
    { label: "통신판매업", value: COMPANY.mailOrderNo },
    { label: "주소", value: COMPANY.address },
    { label: "문의", value: COMPANY.inquiryEmail },
  ].filter((i) => i.value.trim() !== "");
}
