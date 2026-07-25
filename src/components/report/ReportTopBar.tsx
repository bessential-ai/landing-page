// [COMPONENT] 리포트(F/R) 공용 상단 바.
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ReportTopBar({ right }: { right?: ReactNode }) {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/85 backdrop-blur">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link href="/" aria-label="B Essential 홈으로">
          <Image src="/logo.svg" alt="B Essential" width={110} height={20} priority />
        </Link>
        {right}
      </div>
    </header>
  );
}
