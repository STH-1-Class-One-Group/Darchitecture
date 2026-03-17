
# core/ 디렉토리 파일 명세

> 이 문서는 `server/core/` 하위 각 파일의 역할과 책임을 정의합니다.
> `server/routes/`에서 요청을 전달받아 실제 비즈니스 로직을 처리하는 계층입니다.
> 에이전트가 로직 추가·수정 시 각 파일의 책임 범위를 파악하기 위한 참조 문서입니다.

---

## ride.js

**역할:** 타슈 이용 세션 로직

**책임 범위:**
- 이용 시작 시 세션 데이터 생성 및 `rides/{rideId}` 저장
- 이용 종료 시 GPS 좌표 배열 기반 이동 거리(`distanceKm`) 계산
- 탄소 절감량(`carbonReductionKg`) 계산
- 이용 종료 시 `core/report.js` 호출하여 리포트 생성 트리거

**호출 라우터:** `routes/ride.js` (`POST /start`, `POST /end`)

**쓰기 컬렉션:** `rides/{rideId}`

---

## report.js

**역할:** 리포트 생성 및 조회 로직

**책임 범위:**
- 이용 종료 시점(`ride.js`)에서 호출되어 리포트 자동 생성
- `rides/{rideId}` 데이터를 기반으로 `reports/{reportId}` 문서 생성
- 리포트 목록 및 단건 조회 데이터 반환
- 리포트 생성 시 `core/point.js` 호출하여 포인트 적립 트리거

**호출 라우터:** `routes/report.js` (`GET /list`, `GET /:id`)

**쓰기 컬렉션:** `reports/{reportId}`

**비고:** 직접 라우터에서 호출되지 않고 `core/ride.js`의 `POST /end` 처리 시점에 내부 호출됨

---

## point.js

**역할:** 포인트 적립 및 조회 로직

**책임 범위:**
- 리포트 생성 시 포인트 적립량 계산 및 `pointLogs/{logId}` 저장
- `users/{userId}.pointBalance` 잔액 업데이트
- 포인트 잔액 및 적립 로그 조회 데이터 반환

**호출 라우터:** `routes/point.js` (`GET /balance`, `GET /log`)

**쓰기 컬렉션:** `pointLogs/{logId}`, `users/{userId}.pointBalance`

**비고:** 포인트 차감(사용) 로직은 미구현. 사용처 확정 후 추가 예정

---

## quiz.js

**역할:** 지식 퀴즈 및 KPI 기록 로직

**책임 범위:**
- 퀴즈 문제 목록 반환 (초기 측정 / 재측정 구분)
- 퀴즈 제출 결과 채점 및 `quizResults/{resultId}` 저장
- `type` 필드(`initial` / `retest`)로 구분하여 KPI 비교 데이터 누적

**호출 라우터:** `routes/quiz.js` (`GET /questions`, `POST /submit`)

**쓰기 컬렉션:** `quizResults/{resultId}`

---

## usage.js

**역할:** 앱 사용량 측정 로직

**책임 범위:**
- 사용자의 기능 사용 이벤트(`action`) 수신 및 `usageLogs/{logId}` 저장

**호출 라우터:** `routes/usage.js` (`POST /log`)

**쓰기 컬렉션:** `usageLogs/{logId}`

**비고:** 다른 core 파일과 의존성 없이 독립적으로 동작. 추후 실제 운영 플랫폼에서의 데이터 수집 경험 축적 목적