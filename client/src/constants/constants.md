## constants/ 디렉토리 파일 명세

> 이 문서는 `client/src/constants/` 하위 상수 파일의 역할과 책임을 정의합니다.
> 에이전트가 코드 작성 또는 수정 시 각 파일의 목적과 범위를 파악하기 위한 참조 문서입니다.

---

## carbonConstants.js

**역할:** 탄소 절감량 계산 배출계수 상수

**책임:**
- 탄소 절감량 계산(로직 A)에 사용되는 교통수단별 고정 배출계수 값 정의
- 단위 변환(g → kg) 관련 상수 정의

**참조 위치:** `carbonModule.js`

---

## pointConstants.js

**역할:** 포인트 적립 기준 상수

**책임:**
- 거리 또는 탄소 절감량 단위당 적립 포인트 기준값 정의

**참조 위치:** `pointModule.js`

---

## regionConstants.js

**역할:** 대전 지역구 목록 상수

**책임:**
- 대전 5개 지역구 명칭 및 식별자 목록 정의
- 관광객 선택지 포함

**참조 위치:** `OnboardingScreen.jsx`, `MyPageScreen.jsx`

---

## apiConstants.js

**역할:** 서버 API 엔드포인트 상수

**책임:**
- 서버 베이스 URL 및 각 엔드포인트 경로 문자열 정의
- 엔드포인트 변경 시 이 파일만 수정하면 앱 전체에 반영되도록 단일 관리

**참조 위치:** 서버 통신이 필요한 모든 Screen 및 Module