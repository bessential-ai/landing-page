// [GATE] 인증 게이트 — IA-SPEC §2. (Next 16: middleware → proxy)
// 규칙: auth 화면(매니페스트에서 파생)에 비로그인 접근 시 /login?next= 로 리다이렉트.
// 결제 게이트는 Phase 4에서 이 파일에 추가한다.
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { matchScreen } from "@/lib/ia";
import { SESSION_COOKIE } from "@/lib/auth/session";
import { PAID_COOKIE } from "@/lib/payment/status";

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const screen = matchScreen(pathname);

  // 인증 게이트: /diagnose/**, /me/**, /checkout/**, /report/** 등 auth=true 화면
  if (screen?.auth) {
    const loggedIn = Boolean(request.cookies.get(SESSION_COOKIE)?.value);
    if (!loggedIn) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.search = "";
      url.searchParams.set("next", pathname + search); // 로그인 후 원래 목적지로 복귀
      return NextResponse.redirect(url);
    }
  }

  // 결제 게이트: R 그룹(screen.paid) 미결제 접근 시 페이월(F-03)로 리다이렉트 (IA-SPEC §2)
  if (screen?.paid) {
    const reportId = pathname.match(/^\/report\/([^/]+)/)?.[1];
    const rawPaid = request.cookies.get(PAID_COOKIE)?.value ?? "";
    const paidIds = decodeURIComponent(rawPaid).split(",").filter(Boolean);
    if (reportId && !paidIds.includes(reportId)) {
      const url = request.nextUrl.clone();
      url.pathname = `/report/${reportId}/paywall`;
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  // 정적 자원과 이미지·파비콘·SVG 는 게이트에서 제외 (auth 로직이 CSS/JS/이미지를 막지 않도록)
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.svg$).*)"],
};
