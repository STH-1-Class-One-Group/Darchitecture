## package.json

**역할:** 클라이언트 의존성 및 프로젝트 메타 정보 정의 파일

**책임:**
- 프로젝트명, 버전 등 메타 정보 기록
- 사용 중인 npm 패키지 및 버전 명세

**주요 패키지 (예정):**

| 패키지 | 용도 |
| --- | --- |
| `expo` | React Native 앱 빌드 및 실행 환경 |
| `expo-location` | GPS 실시간 추적 (`rideModule.js`) |
| `expo-camera` | QR 스캔 (`qrModule.js`) |
| `expo-font` | 커스텀 폰트 로드 (`App.jsx`) |
| `expo-notifications` | 푸시 알림 (정지 감지 알림) |
| `react-navigation` | 화면 간 네비게이션 |

**비고:** `server/package.json`과 별개로 관리. 클라이언트 전용 의존성만 포함