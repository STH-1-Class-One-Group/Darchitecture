## assets/ 디렉토리 파일 명세

> 이 문서는 `client/assets/` 하위 정적 파일의 역할과 용도를 정의합니다.
> 에이전트가 코드 작성 또는 수정 시 각 파일의 목적과 범위를 파악하기 위한 참조 문서입니다.

---

## icon.png

**역할:** 앱 아이콘 이미지

**책임:**
- 디바이스 홈 화면 및 앱 스토어에 표시되는 앱 아이콘
- Expo 빌드 시 `app.json`의 `icon` 필드에서 참조

---

## splash.png

**역할:** 앱 스플래시 스크린 이미지

**책임:**
- 앱 실행 직후 로딩 중 표시되는 초기 화면 이미지
- Expo 빌드 시 `app.json`의 `splash.image` 필드에서 참조

---

## logo.png

**역할:** 앱 로고 이미지

**책임:**
- AuthScreen, OnboardingScreen 등 주요 화면 상단에 표시되는 브랜드 로고

---

## adaptive-icon.png

**역할:** Android용 어댑티브 아이콘 이미지

**책임:**
- Android 디바이스의 어댑티브 아이콘 규격에 맞춘 전경(foreground) 이미지
- Expo 빌드 시 `app.json`의 `android.adaptiveIcon.foregroundImage` 필드에서 참조

**비고:** Android 전용 파일. iOS에서는 `icon.png` 사용

---

## favicon.png

**역할:** 웹 빌드용 파비콘 이미지

**책임:**
- Expo Web 빌드 시 브라우저 탭에 표시되는 아이콘
- Expo 빌드 시 `app.json`의 `web.favicon` 필드에서 참조

**비고:** 웹 빌드 미사용 시 불필요. Expo 기본 프로젝트 구조에 포함되어 있어 명세에 포함

---

## NotoSansKR-Regular.ttf

**역할:** 기본 한국어 폰트

**책임:**
- 앱 전반의 기본 텍스트에 적용되는 한국어 폰트
- `App.jsx`에서 `expo-font`를 통해 로드 후 전역 적용