project-root/
│
├── client/                          # React Native (Expo) 앱
│   ├── assets/                      # 이미지, 폰트 등 정적 파일
│   ├── src/
│   │   ├── screens/                 # 화면 컴포넌트
│   │   │   ├── AuthScreen.jsx
│   │   │   ├── OnboardingScreen.jsx
│   │   │   ├── MapScreen.jsx
│   │   │   ├── ReportScreen.jsx
│   │   │   ├── ReportListScreen.jsx
│   │   │   ├── MyPageScreen.jsx
│   │   │   ├── QuizScreen.jsx
│   │   │   └── PermissionScreen.jsx
│   │   ├── modules/                 # 비즈니스 로직 모듈
│   │   │   ├── carbonModule.js
│   │   │   ├── rideModule.js
│   │   │   ├── pointModule.js
│   │   │   ├── qrModule.js
│   │   │   └── usageModule.js
│   │   ├── components/              # 재사용 UI 컴포넌트
│   │   └── constants/               # 배출계수 등 상수값
│   ├── App.jsx
│   └── package.json
│
├── server/                          # Node.js + Express 서버
│   ├── proxy/                       # API 키 보호, 인증, 요청 중계
│   ├── core/                        # 비즈니스 로직
│   │   ├── ride.js
│   │   ├── report.js
│   │   ├── point.js
│   │   ├── quiz.js
│   │   └── usage.js
│   ├── db/                          # Firebase 연동
│   │   └── firebase.js
│   ├── routes/                      # API 엔드포인트 라우팅
│   │   ├── auth.js
│   │   ├── ride.js
│   │   ├── report.js
│   │   ├── point.js
│   │   ├── map.js
│   │   ├── quiz.js
│   │   └── usage.js
│   ├── app.js
│   └── package.json
│
├── test/                            # 테스트 모듈
│   ├── prototype_test_v1.test.js
│   └── package.json
│
├── docs/                            # 문서
│   ├── project_plan_v1.docx
│   └── project_plan_v1.md
│
└── .gitignore