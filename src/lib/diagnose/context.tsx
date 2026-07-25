// [STATE] 진단 퍼널(D-01~D-06) 단일 상태 컨테이너.
// diagnose layout 에서 Provider 로 감싸 스텝 간 이동에도 상태를 유지한다.
// sessionStorage 로 새로고침 복원(민감정보 서버 저장 아님).
"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { DiagnoseDraft } from "@/lib/api/types";

const EMPTY: DiagnoseDraft = { idea: "" };
const KEY = "be:diagnose-draft";

interface DiagnoseContextValue {
  draft: DiagnoseDraft;
  update: (patch: Partial<DiagnoseDraft>) => void;
  reset: () => void;
}

const DiagnoseContext = createContext<DiagnoseContextValue | null>(null);

export function DiagnoseProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<DiagnoseDraft>(EMPTY);

  // 새로고침 복원
  useEffect(() => {
    const raw = typeof window !== "undefined" ? sessionStorage.getItem(KEY) : null;
    if (raw) {
      try {
        setDraft(JSON.parse(raw) as DiagnoseDraft);
      } catch {
        /* ignore */
      }
    }
  }, []);

  const update = useCallback((patch: Partial<DiagnoseDraft>) => {
    setDraft((d) => {
      const nextDraft = { ...d, ...patch };
      if (typeof window !== "undefined") sessionStorage.setItem(KEY, JSON.stringify(nextDraft));
      return nextDraft;
    });
  }, []);

  const reset = useCallback(() => {
    setDraft(EMPTY);
    if (typeof window !== "undefined") sessionStorage.removeItem(KEY);
  }, []);

  return <DiagnoseContext.Provider value={{ draft, update, reset }}>{children}</DiagnoseContext.Provider>;
}

export function useDiagnose(): DiagnoseContextValue {
  const ctx = useContext(DiagnoseContext);
  if (!ctx) throw new Error("useDiagnose must be used within DiagnoseProvider");
  return ctx;
}
