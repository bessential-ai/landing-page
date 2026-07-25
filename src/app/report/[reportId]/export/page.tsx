// [SCR: R-12] PDF 출력 · 공유 · scope: P1
// 출력 포맷 미확정 — TODO(export-format). 지금은 UI 만 두고 실제 생성/공유는 비활성.
import { FileDown, Link2, Printer } from "lucide-react";
import ModuleSection from "@/components/report/ModuleSection";

export default async function ExportPage({ params }: { params: Promise<{ reportId: string }> }) {
  await params; // reportId (미사용, 실제 출력 연동 시 사용)

  const options = [
    { icon: <FileDown size={18} />, label: "PDF로 저장", desc: "전체 리포트를 PDF 파일로 내려받기" },
    { icon: <Printer size={18} />, label: "인쇄", desc: "인쇄용 레이아웃으로 출력" },
    { icon: <Link2 size={18} />, label: "공유 링크", desc: "읽기 전용 링크로 공유" },
  ];

  return (
    <ModuleSection id="R-12">
      <p className="text-sm text-gray-500 break-keep -mt-2 mb-2">출력 포맷을 준비 중입니다. 확정되면 아래에서 바로 내보낼 수 있습니다.</p>
      <div className="space-y-3">
        {options.map((o) => (
          <button
            key={o.label}
            type="button"
            disabled
            className="w-full flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3.5 text-left opacity-60 cursor-not-allowed"
          >
            <span className="text-gray-400">{o.icon}</span>
            <span className="flex-1">
              <span className="block text-sm font-medium text-gray-800">{o.label}</span>
              <span className="block text-xs text-gray-400">{o.desc}</span>
            </span>
            <span className="text-[10px] text-gray-400 bg-gray-100 rounded px-1.5 py-0.5">준비 중</span>
          </button>
        ))}
      </div>
      {/* TODO(export-format): 출력 포맷 확정 후 실제 PDF 생성·공유 링크 연동 */}
    </ModuleSection>
  );
}
