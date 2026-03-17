## App.jsx

**역할:** 앱 진입점 컴포넌트

**책임:**
- 앱 전체 네비게이션 구조 초기화 및 라우팅 설정
- `expo-font`를 통한 커스텀 폰트 로드 (`assets/` 폰트 파일 참조)
- 인증 상태에 따라 AuthScreen 또는 MapScreen으로 초기 라우팅 분기

**비고:** `client/` 루트에 위치. `src/screens/` 하위 모든 화면의 최상위 진입점

---