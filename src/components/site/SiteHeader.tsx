// [COMPONENT] 하위 공개 라우트(P-02~P-05, S-01~S-04) 공용 상단 바.
// 네비게이션은 IA 매니페스트에서 파생 (P 그룹 P1, 랜딩 제외). 하드코딩하지 않는다.
import Image from "next/image";
import Link from "next/link";
import { byGroup } from "@/lib/ia";

const PRODUCT_URL = "/mockup"; // TODO(cta-rewire): 진단 진입점(/diagnose) 전환은 결정 (a) 대기

export default function SiteHeader() {
  const navItems = byGroup("P").filter((s) => s.scope === "P1" && s.path !== "/");

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/85 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 active:scale-95 transition-transform" aria-label="B Essential 홈으로">
          <Image src="/logo.svg" alt="B Essential" width={110} height={20} priority className="sm:w-[130px] sm:h-[22px]" />
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm">
          {navItems.map((s) => (
            <Link key={s.id} href={s.path} className="text-gray-600 opacity-80 hover:opacity-100 transition-colors">
              {s.name}
            </Link>
          ))}
        </nav>
        <Link
          href={PRODUCT_URL}
          className="text-xs sm:text-sm font-medium px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors whitespace-nowrap"
        >
          무료로 진단하기
        </Link>
      </div>
    </header>
  );
}
