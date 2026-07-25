// [COMPONENT] "(확인 필요)" 배지 — 불확실/변동 정보 표기 공통 (IA-SPEC §3-3 신뢰 원칙).
export default function NeedsCheckBadge() {
  return (
    <span className="inline-flex items-center text-[10px] font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5 align-middle">
      (확인 필요)
    </span>
  );
}
