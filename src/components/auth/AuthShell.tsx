// [COMPONENT] 계정(A) 화면 공용 셸 — 중앙 카드 레이아웃.
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

export default function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-10">
      <Link href="/" className="mb-8 active:scale-95 transition-transform" aria-label="B Essential 홈으로">
        <Image src="/logo.svg" alt="B Essential" width={130} height={22} priority />
      </Link>
      <div className="w-full max-w-sm bg-white border border-gray-100 rounded-2xl shadow-sm p-6 sm:p-8">
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-1.5 break-keep">{subtitle}</p>}
        <div className="mt-6">{children}</div>
      </div>
      {footer && <div className="mt-6 text-sm text-gray-500 text-center">{footer}</div>}
    </div>
  );
}
