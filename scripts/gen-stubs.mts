// 일회성 스텁 생성기 — src/lib/ia.ts 매니페스트에서 라우트 스텁 page.tsx 를 만든다.
// 이미 존재하는 파일은 절대 덮어쓰지 않는다. "/"(P-01, 기존 랜딩)는 건너뛴다.
// 실행: node scripts/gen-stubs.mts
import { mkdirSync, existsSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { SCREENS } from "../src/lib/ia.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const APP = join(ROOT, "src", "app");

function dirForPath(path: string): string {
  // "/" → app 루트, "/foo/bar" → app/foo/bar
  const rel = path.replace(/^\//, "");
  return rel === "" ? APP : join(APP, rel);
}

function p1Stub(id: string, name: string, scope: string): string {
  return `// [SCR: ${id}] ${name} · scope: ${scope}
export default function Page() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-3 px-6 text-center">
      <span className="text-xs font-medium tracking-wide text-indigo-600">${id}</span>
      <h1 className="text-2xl font-bold text-gray-900">${name}</h1>
      <p className="text-sm text-gray-500">구현 예정</p>
    </main>
  );
}
`;
}

function p2Stub(id: string, name: string, scope: string): string {
  return `// [SCR: ${id}] ${name} · scope: ${scope}
import ComingSoon from "@/components/system/ComingSoon";

export default function Page() {
  return <ComingSoon screenId="${id}" />;
}
`;
}

let created = 0;
let skipped = 0;
for (const s of SCREENS) {
  if (s.path === "/") {
    skipped++; // 기존 랜딩 — 건드리지 않음
    continue;
  }
  const dir = dirForPath(s.path);
  const file = join(dir, "page.tsx");
  if (existsSync(file)) {
    skipped++;
    continue;
  }
  mkdirSync(dir, { recursive: true });
  const content = s.scope === "P2" ? p2Stub(s.id, s.name, s.scope) : p1Stub(s.id, s.name, s.scope);
  writeFileSync(file, content, "utf8");
  created++;
  console.log(`  + ${s.id.padEnd(5)} ${s.path}`);
}
console.log(`\ncreated ${created}, skipped ${skipped} (existing/landing)`);
