
# package.json 역할 명세

> 이 문서는 `server/package.json`의 역할과 책임을 정의합니다.
> Node.js 프로젝트의 명세서로, 이 서버가 어떤 패키지에 의존하는지와 실행 명령어를 정의합니다.

---

## 역할 개요

`npm install` 실행 시 이 파일을 읽어 필요한 외부 패키지를 설치합니다.
코드가 아닌 **프로젝트 설정 파일**로, 직접 수정하거나 `npm install <패키지명>` 명령어로 자동 업데이트됩니다.

---

## 주요 구성 항목

### scripts
서버 실행 및 관리에 사용하는 명령어를 정의합니다.

| 명령어 | 설명 |
|--------|------|
| `npm start` | 서버 실행 (`node app.js`) |
| `npm run dev` | 개발 모드 실행 (코드 변경 시 자동 재시작, `nodemon` 사용) |

### dependencies
서버 실행에 반드시 필요한 패키지 목록입니다.

| 패키지 | 용도 |
|--------|------|
| `express` | HTTP 서버 및 라우터 |
| `firebase-admin` | Firebase Firestore 연동 |
| `dotenv` | `.env` 환경변수 로드 |
| `cors` | CORS 설정 |
| `axios` | 외부 API 요청 (공공데이터포털 등) |

### devDependencies
개발 환경에서만 사용하는 패키지 목록입니다.

| 패키지 | 용도 |
|--------|------|
| `nodemon` | 개발 중 코드 변경 감지 및 서버 자동 재시작 |

---

## 규칙

- 새 패키지 추가 시 `npm install <패키지명> --save` 사용 (자동으로 이 파일에 반영됨)
- API 키, 비밀번호 등 민감한 값은 이 파일에 작성하지 않음. 반드시 `.env` 사용
- `node_modules/`는 `.gitignore`에 포함되어 있으므로 이 파일만 있으면 `npm install`로 재설치 가능