// IA 정합성 검사 — src/lib/ia.ts 매니페스트의 path 목록과 실제 파일시스템 라우트를 대조한다.
// 누락(매니페스트엔 있으나 파일 없음) 또는 초과(파일은 있으나 매니페스트에 없음)가 있으면 exit 1.
// IA-SPEC §0-5: 매니페스트와 실제 라우트가 불일치하면 빌드 실패로 간주.
// 실행: node scripts/check-ia.ts  (package.json 의 `check:ia`)
import { readdirSync, statSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { SCREENS } from "../src/lib/ia.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const APP = join(ROOT, "src", "app");

// IA 밖이지만 의도적으로 존치하는 라우트 (docs/IA-SPEC.md 결정 대기 중).
//  - /mockup : 제품 목업. CTA 재배선 결정(결정 a) 전까지 유지. IA-SPEC §5 미해결 아님, 별개.
const IGNORED_ROUTES = new Set<string>(["/mockup"]);

// 파일시스템 page.tsx → 라우트 경로. src/app/report/[reportId]/free/page.tsx → /report/[reportId]/free
function fileToRoute(pageFile: string): string {
  const rel = relative(APP, dirname(pageFile)); // "" | "report/[reportId]/free"
  if (rel === "") return "/";
  const segments = rel.split(sep).filter((seg) => !(seg.startsWith("(") && seg.endsWith(")"))); // route group 제거
  return "/" + segments.join("/");
}

function walkPageFiles(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walkPageFiles(full, acc);
    } else if (entry === "page.tsx" || entry === "page.ts" || entry === "page.jsx" || entry === "page.js") {
      acc.push(full);
    }
  }
  return acc;
}

const manifestPaths = new Set(SCREENS.map((s) => s.path));
const fsRoutes = walkPageFiles(APP).map(fileToRoute);
const fsRouteSet = new Set(fsRoutes);

// 누락: 매니페스트에 있으나 파일시스템에 page 파일 없음
const missing = [...manifestPaths].filter((p) => !fsRouteSet.has(p)).sort();

// 초과: 파일시스템에 있으나 매니페스트에도 무시목록에도 없음
const extra = fsRoutes.filter((p) => !manifestPaths.has(p) && !IGNORED_ROUTES.has(p)).sort();

console.log(`IA check — manifest routes: ${manifestPaths.size}, filesystem routes: ${fsRouteSet.size}`);
if (IGNORED_ROUTES.size > 0) {
  console.log(`ignored (IA 밖, 의도적 존치): ${[...IGNORED_ROUTES].join(", ")}`);
}

if (missing.length === 0 && extra.length === 0) {
  console.log("✓ IA-SPEC 매니페스트와 파일시스템 라우트 일치");
  process.exit(0);
}

if (missing.length > 0) {
  console.error(`\n✗ 누락 ${missing.length}건 (매니페스트에 있으나 page 파일 없음):`);
  for (const p of missing) console.error(`    ${p}`);
}
if (extra.length > 0) {
  console.error(`\n✗ 초과 ${extra.length}건 (page 파일 있으나 매니페스트에 없음):`);
  for (const p of extra) console.error(`    ${p}`);
}
process.exit(1);
