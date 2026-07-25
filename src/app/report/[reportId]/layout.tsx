// [LAYOUT] /report/[reportId]/** 공용 레이아웃.
// R 그룹(유료 모듈)만 ReportModuleShell(모듈 인디케이터)로 감싼다.
// F 그룹(free/paywall)·V 그룹(revise)은 각자 자체 크롬을 쓰므로 통과시킨다.
"use client";

import type { ReactNode } from "react";
import { useParams, usePathname } from "next/navigation";
import { matchScreen } from "@/lib/ia";
import ReportModuleShell from "@/components/report/ReportModuleShell";

export default function ReportLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const params = useParams();
  const reportId = String(params.reportId ?? "");
  const screen = matchScreen(pathname);

  if (screen?.group === "R") {
    return <ReportModuleShell reportId={reportId}>{children}</ReportModuleShell>;
  }
  return <>{children}</>;
}
