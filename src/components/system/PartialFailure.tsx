// [SCR: S-05] 오류 · 부분 실패 — 공용 컴포넌트 · scope: P1
// 리포트 일부 모듈이 실패/누락됐을 때 해당 슬롯에 렌더한다. 아직 어느 화면에도 연결하지 않음(Phase 5에서 연결).
// 전체 화면을 죽이지 않고, 실패한 부분만 표시하고 재시도 액션을 제공한다.
import { AlertTriangle, RotateCw } from "lucide-react";

export interface PartialFailureProps {
  /** 실패한 영역 이름 (예: "④ 시장 조사") */
  title?: string;
  /** 사용자에게 보일 설명 */
  message?: string;
  /** 재시도 핸들러. 없으면 재시도 버튼을 숨긴다. */
  onRetry?: () => void;
}

export default function PartialFailure({
  title = "이 부분을 불러오지 못했습니다",
  message = "일시적인 문제로 일부 내용을 표시하지 못했습니다. 나머지 내용은 정상적으로 제공됩니다.",
  onRetry,
}: PartialFailureProps) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5 flex items-start gap-3"
    >
      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-amber-900">{title}</p>
        <p className="text-xs text-amber-700 mt-1 break-keep">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-medium text-amber-800 hover:text-amber-900 transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5" />
            다시 시도
          </button>
        )}
      </div>
    </div>
  );
}
