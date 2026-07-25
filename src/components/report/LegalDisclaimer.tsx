// [COMPONENT] 법률 자문 아님 고지 — R-03(규제·법률 리스크) 등에 부착.
import { Scale } from "lucide-react";

export default function LegalDisclaimer() {
  return (
    <div className="mt-4 flex items-start gap-2 rounded-xl bg-gray-50 border border-gray-100 px-3.5 py-3">
      <Scale size={15} className="text-gray-400 shrink-0 mt-0.5" />
      <p className="text-[11px] text-gray-500 leading-relaxed break-keep">
        본 내용은 일반 정보와 대응 방안 제안이며 법률 자문이 아닙니다. 실제 인허가·계약·규제 판단은 변호사·법무사 등 전문가 확인이 필요합니다.
      </p>
    </div>
  );
}
