# package.json 역할 명세

> 이 문서는 `client/package.json`의 역할과 책임을 정의합니다.
> React Native(Expo) 프로젝트의 명세서로, 이 앱이 어떤 패키지에 의존하는지와 실행 명령어를 정의합니다.

---

## 역할 개요

`npm install` 실행 시 이 파일을 읽어 필요한 외부 패키지를 설치합니다.
코드가 아닌 **프로젝트 설정 파일**로, 직접 수정하거나 `npm install <패키지명>` 명령어로 자동 업데이트됩니다.

---

## 주요 구성 항목

### scripts
앱 실행 및 관리에 사용하는 명령어를 정의합니다.

| 명령어 | 설명 |
|--------|------|
| `npm start` | Expo 개발 서버 실행 |
| `npm run android` | Android 에뮬레이터 또는 실기기 실행 |
| `npm run ios` | iOS 시뮬레이터 또는 실기기 실행 |

### dependencies
앱 실행에 반드시 필요한 패키지 목록입니다.

| 패키지 | 용도 |
|--------|------|
| `expo` | React Native 앱 빌드 및 실행 환경 |
| `react` / `react-native` | UI 컴포넌트 및 앱 기반 프레임워크 |
| `expo-font` | 커스텀 폰트(`NotoSansKR-Regular.ttf`) 로드 |
| `expo-splash-screen` | 폰트/초기화 완료 전 스플래시 스크린 유지 |
| `expo-location` | GPS 실시간 위치 추적 (`rideModule.js`에서 사용) |
| `expo-camera` | QR 코드 스캔 (`qrModule.js`에서 사용) |
| `expo-notifications` | 이용 정지 감지 시 푸시 알림 발송 (`MapScreen.jsx`에서 사용) |
| `react-native-maps` | 타슈 대여소 지도 및 GPS 경로 표시 (`MapScreen.jsx`에서 사용) |
| `@react-navigation/native` | 화면 간 네비게이션 |
| `@react-navigation/stack` | 스택 네비게이션 구성 (`App.jsx`에서 사용) |
| `axios` | 서버 API 요청 (각 Screen 및 Module에서 사용) |
| `@react-native-async-storage/async-storage` | 로그인 토큰 등 로컬 데이터 저장 |

### devDependencies
개발 환경에서만 사용하는 패키지 목록입니다.

| 패키지 | 용도 |
|--------|------|
| `@babel/core` | React Native 코드 트랜스파일 (Expo 기본 포함) |

---

## 규칙

- 새 패키지 추가 시 `npm install <패키지명> --save` 사용 (자동으로 이 파일에 반영됨)
- API 키, 비밀번호 등 민감한 값은 이 파일에 작성하지 않음. 반드시 `.env` 사용
- `node_modules/`는 `.gitignore`에 포함되어 있으므로 이 파일만 있으면 `npm install`로 재설치 가능
- Expo 관련 패키지는 `expo install <패키지명>` 사용 권장 (`npm install` 대신) — Expo SDK 버전과의 호환성을 자동으로 맞춰줌