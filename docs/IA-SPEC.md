# B Essential — IA SPEC (개발 기준 문서)

> 이 파일은 **라우팅·화면 구조의 단일 소스 오브 트루스**다.
> 화면을 추가·삭제·이동할 때 이 파일을 먼저 고치고, 코드를 그 다음에 고친다.
> 버전: v1.0 / 2026-07-26

---

## 0. 규칙

1. 모든 페이지 파일 최상단에 화면 ID 주석을 단다. 예외 없음.
   ```tsx
   // [SCR: P-01] 랜딩 — 한 줄 입력 · scope: P1
   ```
2. 라우트 경로는 아래 표가 기준이다. **경로를 바꾸려면 이 표를 먼저 고친다.**
3. `scope: P1` = 이번 범위, 실제 구현. `scope: P2` = 2차 범위, **스텁만** 생성(라우트 + "준비 중" 화면 + IA 주석).
4. 관리자(B) 화면 6종은 이 문서 범위 밖이다. 만들지 않는다.
5. 라우트 매니페스트(`src/lib/ia.ts`)와 실제 파일 시스템 라우트가 불일치하면 빌드 실패로 간주한다.

---

## 1. 라우트 매니페스트

### A — 계정

| ID | 화면명 | 경로 | scope |
|---|---|---|---|
| A-01 | 로그인 | `/login` | P1 |
| A-02 | 회원가입 | `/signup` | P1 |
| A-03 | 약관 동의 — 옵트인 분리 | `/signup/consent` | P1 |
| A-04 | 비밀번호 재설정 | `/reset-password` | P1 |
| A-05 | 이메일 인증 | `/verify-email` | **P2** |

### D — 진단 입력

| ID | 화면명 | 경로 | scope |
|---|---|---|---|
| D-01 | 아이디어 한 줄 입력 | `/diagnose` | P1 |
| D-02 | 추출 확인 · 후속 질문 | `/diagnose/confirm` | P1 |
| D-03 | 업종 · 규제 선택 | `/diagnose/industry` | P1 |
| D-04 | 업종별 조건부 | `/diagnose/conditions` | P1 |
| D-05 | 최종 확인 | `/diagnose/review` | P1 |
| D-06 | 진단 진행 중 | `/diagnose/running` | P1 |

### P — 홈 · 공개

| ID | 화면명 | 경로 | scope |
|---|---|---|---|
| P-01 | 랜딩 — 한 줄 입력 | `/` | P1 |
| P-02 | 서비스 소개 | `/about` | P1 |
| P-03 | 요금제 | `/pricing` | P1 |
| P-04 | 샘플 리포트 | `/sample` | P1 |
| P-05 | FAQ · 문의 | `/faq` | P1 |

### S — 정책 · 표기 / 시스템

| ID | 화면명 | 경로 / 위치 | scope |
|---|---|---|---|
| S-01 | 이용약관 | `/legal/terms` | P1 |
| S-02 | 개인정보처리방침 | `/legal/privacy` | P1 |
| S-03 | 환불정책 | `/legal/refund` | P1 |
| S-04 | 사업자정보 표기 | `/legal/business-info` | P1 |
| S-05 | 오류 · 부분 실패 | 공용 컴포넌트 `components/system/PartialFailure` | P1 |
| S-06 | 404 · 500 | `app/not-found.tsx`, `app/error.tsx` | P1 |
| S-07 | 점검 안내 | `/maintenance` | **P2** |

### F — 무료 결과

| ID | 화면명 | 경로 | scope |
|---|---|---|---|
| F-01 | 무료 결과 요약 | `/report/[reportId]/free` | P1 |
| F-02 | 6축 점수 상세 | `/report/[reportId]/free/scores` | P1 |
| F-03 | 페이월 | `/report/[reportId]/paywall` | P1 |

### G — 결제 · 프로필

| ID | 화면명 | 경로 | scope |
|---|---|---|---|
| G-01 | 상품 선택 | `/checkout/[reportId]` | P1 |
| G-02 | 결제 (PG) | `/checkout/[reportId]/pay` | P1 |
| G-03 | 결제 완료 | `/checkout/[reportId]/complete` | P1 |
| G-04 | 결제 실패 | `/checkout/[reportId]/failed` | P1 |
| G-05 | 창업자 프로필 STEP3 | `/onboarding/profile` | P1 |

### R — 유료 리포트

| ID | 화면명 | 경로 | scope |
|---|---|---|---|
| R-00 | 리포트 허브 — 판정 | `/report/[reportId]` | P1 |
| R-01 | ① 장점 · 단점 | `/report/[reportId]/strengths` | P1 |
| R-02 | ② 유사 서비스 | `/report/[reportId]/competitors` | P1 |
| R-03 | ③ 규제 · 법률 리스크 | `/report/[reportId]/risks` | P1 |
| R-04 | ④ 시장 조사 | `/report/[reportId]/market` | P1 |
| R-05 | ⑤ 핵심 지표 | `/report/[reportId]/metrics` | P1 |
| R-06 | ⑥ 검증 방법 | `/report/[reportId]/validation` | P1 |
| R-07 | ⑦ 로드맵 P0~P5 | `/report/[reportId]/roadmap` | P1 |
| R-08 | ⑧ 지원사업 매칭 | `/report/[reportId]/grants` | P1 |
| R-09 | ⑨ 관련 사례 | `/report/[reportId]/cases` | P1 |
| R-10 | 반려 리포트 · 대안 | `/report/[reportId]/rejected` | P1 |
| R-11 | 근거 · 출처 상세 | `/report/[reportId]/sources` | P1 |
| R-12 | PDF 출력 · 공유 | `/report/[reportId]/export` | P1 |

### V — 재진단

| ID | 화면명 | 경로 | scope |
|---|---|---|---|
| V-01 | 아이디어 수정 | `/report/[reportId]/revise` | P1 |
| V-02 | 버전 비교 | `/report/[reportId]/compare` | **P2** |
| V-03 | 버전 이력 | `/report/[reportId]/versions` | **P2** |

### M — 마이 페이지

| ID | 화면명 | 경로 | scope |
|---|---|---|---|
| M-01 | 내 아이디어 목록 | `/me/ideas` | P1 |
| M-02 | 결제 · 영수증 | `/me/billing` | P1 |
| M-03 | 프로필 관리 | `/me/profile` | **P2** |
| M-04 | 동의 · 약관 관리 | `/me/consents` | P1 |
| M-05 | 알림 설정 | `/me/notifications` | **P2** |
| M-06 | 계정 · 탈퇴 | `/me/account` | P1 |

### T — 진척 관리 (전체 P2)

| ID | 화면명 | 경로 | scope |
|---|---|---|---|
| T-01 | 로드맵 체크리스트 | `/me/checklist` | **P2** |
| T-02 | 알림 센터 | `/me/inbox` | **P2** |

---

## 2. 게이트 / 접근 제어

| 게이트 | 위치 | 규칙 |
|---|---|---|
| 인증 게이트 | `/diagnose/**` 이후 전 구간, `/me/**`, `/checkout/**` | 비로그인 → `/login?next=` 로 리다이렉트 |
| **결제 게이트** | `F-03 페이월` ↔ `R-00 리포트 허브` 사이 | 미결제 상태로 `/report/[id]/*`(R 그룹) 직접 접근 시 → `/report/[id]/paywall` 로 리다이렉트 |
| P2 게이트 | scope P2 전 라우트 | "준비 중" 화면 렌더. 네비게이션에서는 노출하지 않음 |

**무료 노출 한계선**: `F-01 무료 결과 요약`, `F-02 6축 점수 상세` 까지만 무료. R 그룹 전체는 결제 후.

---

## 3. 콘텐츠 정정 사항 (현재 운영 사이트가 틀린 부분)

### 3-1. 가격 — 최우선

현재 사이트 표기(구버전)는 전부 폐기하고 아래로 교체한다.

| 상품 | 가격 | 표기 규칙 |
|---|---|---|
| 무료 미리보기 | ₩0 | F-01 · F-02 까지 열람 |
| **첫 구매** | **990원** | 계정당 1회 한정임을 반드시 병기 |
| **재구매** | **3,900원** | 건당 |
| **묶음 3건** | **9,900원** | 건당 3,300원 · 건당 단가 병기 |

- 구독 아님. "구독" 단어를 가격 문맥에서 쓰지 않는다.
- 부가세 포함 여부 문구는 `TODO(pricing-vat)` 주석으로 남기고 임의로 쓰지 않는다.

### 3-2. 사업자 정보 — 법정 표시 의무

현재 플레이스홀더가 그대로 노출 중이다. 값이 확정되지 않았으면 **하드코딩하지 말고** `src/config/company.ts` 로 분리하고 미확정 값은 빈 문자열 + `TODO(company-info)` 주석으로 둔다.

교체 대상: 사업자등록번호, 통신판매업신고번호, 주소, 문의 이메일, 대표자명.

### 3-3. 신뢰 섹션 플레이스홀더

`[창업자명 · 한 줄 이력]`, `[자문 실명 · 소속]` 이 노출 중. **값이 없으면 블록 전체를 렌더링하지 않는다** (플레이스홀더 노출 금지).

### 3-4. 오탈자

- "무엇이 남았인지" → "무엇이 남았는지"
- "일괄 제맹 대시보드" → "일괄 관리 대시보드"

### 3-5. 빈 링크

이용약관 / 개인정보처리방침 / 환불정책이 `href="#"` 로 걸려 있다. S-01~S-03 실제 라우트로 연결한다.

---

## 4. 점수 체계

**6축**으로 고정한다. 축 명칭은 현재 운영 사이트 표기를 따른다.

문제 정의·수요 / 솔루션 차별성 / 기술 실현성 / 규제·인허가 / 수익모델·단위경제 / 팀·실행력

- 종합 점수는 100점 만점.
- 축 개수를 하드코딩하지 말고 배열 길이로 렌더한다(향후 변경 대비).

---

## 5. 미해결 — 임의로 만들지 말 것

아래는 기획 12블록에는 있으나 IA에는 없다. **라우트를 만들지 않는다.** 확정 전까지 보류.

1. BM Before / After — AI 변경 사유 화면 (R-01 장점·단점과 별개)
2. AI 공통 프롬프트 / Figma · Stitch · Notion 연계 화면

---

## 6. 산출물 요구

`src/lib/ia.ts` 에 아래 형태의 타입 안전 매니페스트를 생성하고, 사이트맵·네비·브레드크럼·접근제어는 전부 이 매니페스트에서 파생시킨다.

```ts
export type Scope = "P1" | "P2";
export type Group = "A" | "D" | "P" | "F" | "G" | "R" | "V" | "M" | "S" | "T";

export interface Screen {
  id: string;        // "P-01"
  group: Group;
  name: string;      // "랜딩 — 한 줄 입력"
  path: string;      // "/" | "/report/[reportId]/free"
  scope: Scope;
  auth: boolean;     // 인증 필요 여부
  paid: boolean;     // 결제 게이트 뒤인지
}

export const SCREENS: readonly Screen[] = [ /* ... */ ];
```
