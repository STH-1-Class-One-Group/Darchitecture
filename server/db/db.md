
# DB 구조 명세 (Firebase Firestore)

> 이 문서는 Firebase Firestore의 컬렉션 구조와 각 필드의 역할을 정의합니다.
> `server/db/firebase.js`는 Firestore 연결 설정 파일이며, 실제 데이터 구조는 이 문서를 기준으로 합니다.
> 서버 전역에서 DB 인스턴스를 사용할 수 있게 합니다.
> 에이전트가 데이터 읽기·쓰기 코드를 작성할 때 컬렉션·필드명과 데이터 타입을 참조하기 위한 문서입니다.

---

## users/{userId}

**설명:** 사용자 계정 정보. 인증(auth.js) 및 마이페이지(MyPageScreen)에서 참조

| 필드 | 타입 | 설명 | 비고 |
|------|------|------|------|
| `profile.name` | string | 사용자 이름 | |
| `profile.email` | string | 이메일 | 로그인 식별자 |
| `region` | string | 참여 지역구 또는 관광객 여부 | OnboardingScreen 초기 설정값. 대전 5개 지역구 중 하나 또는 `"visitor"` |
| `pointBalance` | number | 현재 포인트 잔액 | 적립 시마다 업데이트. 차감 로직은 미구현 (사용처 추후 결정) |

---

## rides/{rideId}

**설명:** 타슈 이용 세션 1건의 원본 데이터. `ride.js POST /end` 시점에 완성됨

| 필드 | 타입 | 설명 | 비고 |
|------|------|------|------|
| `userId` | string | 이용 사용자 ID | `users/{userId}` 참조 |
| `startTime` | timestamp | 이용 시작 시각 | |
| `endTime` | timestamp | 이용 종료 시각 | |
| `coordinates` | array\<map\> | GPS 경로 좌표 배열. 각 요소는 `{ lat, lng }` | MapScreen에서 실시간 수집 |
| `distanceKm` | number | 이동 거리 (km) | `coordinates` 기반 계산 |
| `carbonReductionKg` | number | 탄소 절감량 (kg) | `carbonModule.js` 로직 적용 결과 |

---

## reports/{reportId}

**설명:** 이용 완료 후 자동 생성되는 리포트. `rides/{rideId}` 기반으로 생성됨

| 필드 | 타입 | 설명 | 비고 |
|------|------|------|------|
| `rideId` | string | 원본 라이드 ID | `rides/{rideId}` 참조 |
| `distanceKm` | number | 이동 거리 (km) | |
| `durationMin` | number | 이용 시간 (분) | |
| `carbonReductionKg` | number | 탄소 절감량 (kg) | |
| `pointsEarned` | number | 이번 이용으로 적립된 포인트 | |

**비고:** 리포트 생성 시 `users/{userId}.pointBalance`도 함께 업데이트됨

---

## pointLogs/{logId}

**설명:** 포인트 적립 이력. MyPageScreen 적립 로그 조회 및 `point.js GET /log`에서 사용

| 필드 | 타입 | 설명 | 비고 |
|------|------|------|------|
| `userId` | string | 적립 사용자 ID | `users/{userId}` 참조 |
| `amount` | number | 적립 포인트 량 | |
| `earnedAt` | timestamp | 적립 시각 | |

**비고:** 차감(사용) 로그는 미구현. 향후 사용처 확정 시 `type` 필드(earn/use) 추가 검토

---

## quizResults/{resultId}

**설명:** 퀴즈 제출 결과. KPI 측정을 위해 초기값과 재측정값 비교에 활용됨

| 필드 | 타입 | 설명 | 비고 |
|------|------|------|------|
| `userId` | string | 퀴즈 응시 사용자 ID | `users/{userId}` 참조 |
| `score` | number | 퀴즈 점수 | |
| `takenAt` | timestamp | 응시 시각 | |
| `type` | string | 측정 구분 | `"initial"` (첫 사용 시) 또는 `"retest"` (일정 사용량 도달 후 재측정) |

**비고:** `initial`과 `retest` 비교 리포트로 사용자 지식 함양 정도를 KPI로 수치화

---

## usageLogs/{logId}

**설명:** 앱 기능별 사용량 측정 데이터. 추후 실제 운영 플랫폼에서의 데이터 수집 경험 축적 목적

| 필드 | 타입 | 설명 | 비고 |
|------|------|------|------|
| `userId` | string | 사용자 ID | `users/{userId}` 참조 |
| `action` | string | 사용한 기능명 | 예: `"ride_start"`, `"quiz_submit"`, `"report_view"` 등 |
| `loggedAt` | timestamp | 기록 시각 | |

**비고:** 다른 컬렉션과 의존성 없이 독립적으로 동작. `usage.js POST /log`에서만 쓰기 발생