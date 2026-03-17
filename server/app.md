
# app.js 역할 명세

> 이 문서는 `server/app.js`의 역할과 책임을 정의합니다.
> 서버 실행 시 가장 먼저 읽히는 진입점(entry point)으로, 서버 전체 구성을 조립하는 파일입니다.

---

## 역할 개요

`server/` 하위의 모든 구성요소(라우터, 미들웨어, 프록시 등)를 하나의 Express 앱으로 조립합니다.
개별 파일들은 각자의 역할만 수행하고, `app.js`가 이를 연결하여 실제로 동작하는 서버를 만듭니다.

```
node app.js 실행
      ↓
Express 앱 생성
      ↓
미들웨어 등록 (JSON 파싱, CORS 등)
      ↓
routes/ 연결 (/auth, /ride, /report, /point, /map, /quiz, /usage)
      ↓
서버 포트 오픈 → 요청 대기
```

---

## 책임 범위

### 1. Express 앱 생성
- `express()` 인스턴스 생성

### 2. 미들웨어 등록
- JSON 요청 파싱 (`express.json()`)
- CORS 설정 (클라이언트 앱의 요청 허용)
- 기타 공통 미들웨어

### 3. 라우터 연결
- `server/routes/` 하위 파일들을 경로에 매핑

| 라우터 파일 | 연결 경로 |
|------------|----------|
| `routes/auth.js` | `/auth` |
| `routes/ride.js` | `/ride` |
| `routes/report.js` | `/report` |
| `routes/point.js` | `/point` |
| `routes/map.js` | `/map` |
| `routes/quiz.js` | `/quiz` |
| `routes/usage.js` | `/usage` |

### 4. 서버 포트 오픈
- 지정된 포트에서 요청 대기 시작

---

## 규칙

- 비즈니스 로직을 직접 작성하지 않음. 로직은 반드시 `core/`에 위치
- 라우터별 세부 엔드포인트는 `routes/` 각 파일에 위임
- 환경변수(포트 번호 등)는 `.env`에서 참조