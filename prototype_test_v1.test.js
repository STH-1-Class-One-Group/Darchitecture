/**
 * 1차 프로토타입 테스트 모듈
 * 탄소 중립 대전 지역특화 프로젝트
 *
 * 테스트 범위:
 *   1. carbonModule  — 탄소 절감량 계산 + 포인트 적립 (로직 A, 고정 배출계수)
 *   2. rideModule    — 이용 시작/종료 트리거, GPS 경로 누적, 총 거리 계산
 *   3. reportModule  — 이용 종료 후 리포트 데이터 구조 생성
 *   4. 통합 테스트   — 이용시작 → GPS 누적 → 이용종료 → 리포트 출력 전체 흐름
 *
 * 테스트 프레임워크: Jest (React Native 기본 내장)
 * 실행 방법: npx jest prototype_test_v1.test.js
 *
 * 미구현 (기술 스택 확정 후 2차 모듈에서 추가 예정):
 *   - DB 연동 (Firebase Firestore)
 *   - 카카오맵 API 연동
 *   - 실제 expo-location GPS 연동
 *
 * DB 필드명 기준: 플랜 페이퍼 6-4 (reports/{reportId})
 *   - durationMin        (durationMinutes 아님)
 *   - distanceKm
 *   - carbonReductionKg
 *   - pointsEarned
 */

// ─────────────────────────────────────────────────────────────
// carbonModule
// 실제 구현 시 /modules/carbonModule.js 로 분리할 것
// ─────────────────────────────────────────────────────────────

const EMISSION_FACTORS = {
  car: 130,    // g/km — 자가용 (휘발유 기준, 환경부)
  bus: 70,     // g/km — 시내버스
  subway: 35,  // g/km — 지하철
};

function calculateCarbonReduction(distanceKm, mode) {
  if (typeof distanceKm !== 'number' || distanceKm < 0)
    throw new Error('거리는 0 이상의 숫자여야 합니다.');
  if (!EMISSION_FACTORS[mode])
    throw new Error(`지원하지 않는 교통수단입니다: ${mode}`);
  const grams = distanceKm * EMISSION_FACTORS[mode];
  return Math.round((grams / 1000) * 100) / 100; // kg, 소수점 둘째 자리
}

function calculatePoints(distanceKm, mode) {
  const kg = calculateCarbonReduction(distanceKm, mode);
  return Math.floor(kg * 1000); // 1g CO₂ = 1포인트
}

// ─────────────────────────────────────────────────────────────
// rideModule
// 실제 구현 시 /modules/rideModule.js 로 분리할 것
// GPS watchPositionAsync 콜백을 addCoordinate()로 대체하여 테스트 가능하게 설계
// ─────────────────────────────────────────────────────────────

class RideSession {
  constructor() {
    this.isActive = false;
    this.coordinates = []; // [{ latitude, longitude, timestamp }]
    this.startTime = null;
    this.endTime = null;
  }

  start() {
    if (this.isActive) throw new Error('이미 이용 중입니다.');
    this.isActive = true;
    this.startTime = Date.now();
    this.coordinates = [];
    this.endTime = null;
  }

  addCoordinate(lat, lng) {
    if (!this.isActive) throw new Error('이용 시작 후 좌표를 추가할 수 있습니다.');
    this.coordinates.push({ latitude: lat, longitude: lng, timestamp: Date.now() });
  }

  stop() {
    if (!this.isActive) throw new Error('진행 중인 이용이 없습니다.');
    this.isActive = false;
    this.endTime = Date.now();
    return this._buildRideData();
  }

  // 두 좌표 간 거리 계산 (Haversine 공식, 단위: km)
  _haversine(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  getTotalDistance() {
    if (this.coordinates.length < 2) return 0;
    let total = 0;
    for (let i = 1; i < this.coordinates.length; i++) {
      const prev = this.coordinates[i - 1];
      const curr = this.coordinates[i];
      total += this._haversine(prev.latitude, prev.longitude, curr.latitude, curr.longitude);
    }
    return Math.round(total * 1000) / 1000; // km, 소수점 셋째 자리
  }

  // durationMin: 플랜 페이퍼 DB 구조 기준 필드명
  getDurationMin() {
    if (!this.startTime || !this.endTime) return 0;
    return Math.round((this.endTime - this.startTime) / 60000 * 10) / 10;
  }

  _buildRideData() {
    return {
      startTime: this.startTime,
      endTime: this.endTime,
      durationMin: this.getDurationMin(),       // ← durationMin (플랜 페이퍼 기준)
      distanceKm: this.getTotalDistance(),
      coordinates: [...this.coordinates],
    };
  }
}

// ─────────────────────────────────────────────────────────────
// reportModule
// 실제 구현 시 /modules/reportModule.js 로 분리할 것
// ─────────────────────────────────────────────────────────────

function generateReport(rideData, mode = 'car') {
  if (!rideData || typeof rideData.distanceKm !== 'number')
    throw new Error('유효하지 않은 이용 데이터입니다.');

  const carbonReductionKg = calculateCarbonReduction(rideData.distanceKm, mode);
  const pointsEarned = calculatePoints(rideData.distanceKm, mode);

  return {
    // 이용 정보 — 플랜 페이퍼 reports/{reportId} 필드 기준
    startTime: rideData.startTime,
    endTime: rideData.endTime,
    durationMin: rideData.durationMin,          // ← durationMin (플랜 페이퍼 기준)
    distanceKm: rideData.distanceKm,
    // 탄소 절감
    alternativeMode: mode,
    carbonReductionKg,
    // 포인트
    pointsEarned,
    // 요약 메시지
    summary: `자전거로 ${rideData.distanceKm}km 이동하여 ${carbonReductionKg}kg의 탄소를 절감했다. ${pointsEarned}포인트가 적립되었다.`,
  };
}

// ─────────────────────────────────────────────────────────────
// 테스트
// ─────────────────────────────────────────────────────────────

// ── 1. carbonModule ───────────────────────────────────────────
describe('[carbonModule] 탄소 절감량 계산 — 로직 A', () => {

  describe('기본 계산', () => {
    test('자가용 대체 5km → 0.65kg', () => {
      expect(calculateCarbonReduction(5, 'car')).toBe(0.65);
    });
    test('버스 대체 5km → 0.35kg', () => {
      expect(calculateCarbonReduction(5, 'bus')).toBe(0.35);
    });
    test('지하철 대체 5km → 0.18kg', () => {
      expect(calculateCarbonReduction(5, 'subway')).toBe(0.18);
    });
  });

  describe('경계값', () => {
    test('거리 0km → 0kg', () => {
      expect(calculateCarbonReduction(0, 'car')).toBe(0);
    });
    test('0.1km → 소수점 정상 처리', () => {
      expect(calculateCarbonReduction(0.1, 'car')).toBe(0.01);
    });
  });

  describe('예외 처리', () => {
    test('음수 거리 → 에러', () => {
      expect(() => calculateCarbonReduction(-1, 'car')).toThrow();
    });
    test('미지원 교통수단 → 에러', () => {
      expect(() => calculateCarbonReduction(5, 'bike')).toThrow();
    });
  });

  describe('포인트 적립', () => {
    test('자가용 대체 5km → 650포인트', () => {
      expect(calculatePoints(5, 'car')).toBe(650);
    });
    test('버스 대체 10km → 700포인트', () => {
      expect(calculatePoints(10, 'bus')).toBe(700);
    });
    test('거리 0 → 0포인트', () => {
      expect(calculatePoints(0, 'car')).toBe(0);
    });
  });
});

// ── 2. rideModule ─────────────────────────────────────────────
describe('[rideModule] 이용 시작/종료 + GPS 경로', () => {
  let ride;

  beforeEach(() => {
    ride = new RideSession();
  });

  describe('이용 시작/종료 트리거', () => {
    test('start() → isActive true', () => {
      ride.start();
      expect(ride.isActive).toBe(true);
    });

    test('stop() → isActive false, rideData 반환', () => {
      ride.start();
      const data = ride.stop();
      expect(ride.isActive).toBe(false);
      expect(data).toHaveProperty('distanceKm');
      expect(data).toHaveProperty('durationMin');     // ← durationMin
      expect(data).toHaveProperty('coordinates');
    });

    test('이용 시작 없이 stop() → 에러', () => {
      expect(() => ride.stop()).toThrow('진행 중인 이용이 없습니다.');
    });

    test('이용 중 start() 재호출 → 에러', () => {
      ride.start();
      expect(() => ride.start()).toThrow('이미 이용 중입니다.');
    });

    test('이용 시작 없이 addCoordinate() → 에러', () => {
      expect(() => ride.addCoordinate(36.35, 127.38)).toThrow();
    });
  });

  describe('durationMin 계산', () => {
    test('10분 경과 시뮬레이션 → durationMin > 0', () => {
      ride.start();
      ride.startTime = Date.now() - 600000; // 테스트용: 10분 전으로 조작
      const data = ride.stop();
      expect(data.durationMin).toBeGreaterThan(0);
    });

    test('30분 경과 시뮬레이션 → durationMin ≈ 30', () => {
      ride.start();
      ride.startTime = Date.now() - 1800000; // 테스트용: 30분 전으로 조작
      const data = ride.stop();
      expect(data.durationMin).toBeCloseTo(30, 0);
    });
  });

  describe('GPS 경로 누적 + 거리 계산', () => {
    test('좌표 1개 → 거리 0km', () => {
      ride.start();
      ride.addCoordinate(36.35, 127.38);
      expect(ride.getTotalDistance()).toBe(0);
    });

    test('좌표 2개 → 거리 계산 정상 동작', () => {
      ride.start();
      ride.addCoordinate(36.3500, 127.3845);
      ride.addCoordinate(36.3510, 127.3855);
      const dist = ride.getTotalDistance();
      expect(dist).toBeGreaterThan(0);
      expect(dist).toBeLessThan(1);
    });

    test('대전 시내 실제 좌표 5개 → 누적 거리 합산', () => {
      ride.start();
      // 대전역 → 중앙로 방향 좌표 시뮬레이션
      ride.addCoordinate(36.3323, 127.4342);
      ride.addCoordinate(36.3340, 127.4330);
      ride.addCoordinate(36.3360, 127.4318);
      ride.addCoordinate(36.3380, 127.4305);
      ride.addCoordinate(36.3400, 127.4290);
      const dist = ride.getTotalDistance();
      expect(dist).toBeGreaterThan(0);
      expect(typeof dist).toBe('number');
    });

    test('stop() 반환 데이터에 coordinates 배열 포함', () => {
      ride.start();
      ride.addCoordinate(36.35, 127.38);
      ride.addCoordinate(36.36, 127.39);
      const data = ride.stop();
      expect(Array.isArray(data.coordinates)).toBe(true);
      expect(data.coordinates).toHaveLength(2);
    });
  });
});

// ── 3. reportModule ───────────────────────────────────────────
describe('[reportModule] 리포트 데이터 생성', () => {

  const mockRideData = {
    startTime: Date.now() - 1800000, // 30분 전
    endTime: Date.now(),
    durationMin: 30,                  // ← durationMin (플랜 페이퍼 기준)
    distanceKm: 5,
    coordinates: [],
  };

  test('리포트 정상 생성 — 필수 필드 포함', () => {
    const report = generateReport(mockRideData, 'car');
    expect(report).toHaveProperty('distanceKm');
    expect(report).toHaveProperty('durationMin');     // ← durationMin
    expect(report).toHaveProperty('carbonReductionKg');
    expect(report).toHaveProperty('pointsEarned');
    expect(report).toHaveProperty('summary');
    expect(report).toHaveProperty('alternativeMode');
  });

  test('5km 자가용 대체 → 탄소 0.65kg, 650포인트', () => {
    const report = generateReport(mockRideData, 'car');
    expect(report.carbonReductionKg).toBe(0.65);
    expect(report.pointsEarned).toBe(650);
  });

  test('5km 버스 대체 → 탄소 0.35kg, 350포인트', () => {
    const report = generateReport(mockRideData, 'bus');
    expect(report.carbonReductionKg).toBe(0.35);
    expect(report.pointsEarned).toBe(350);
  });

  test('summary 문자열에 거리, 탄소, 포인트 값 포함', () => {
    const report = generateReport(mockRideData, 'car');
    expect(report.summary).toContain('5');
    expect(report.summary).toContain('0.65');
    expect(report.summary).toContain('650');
  });

  test('유효하지 않은 rideData → 에러', () => {
    expect(() => generateReport(null, 'car')).toThrow();
    expect(() => generateReport({}, 'car')).toThrow();
  });
});

// ── 4. 통합 테스트 ────────────────────────────────────────────
describe('[통합] 이용시작 → GPS 누적 → 이용종료 → 리포트 전체 흐름', () => {

  test('정상 시나리오 전체 흐름', () => {
    const ride = new RideSession();

    // 1. 이용 시작
    ride.start();
    expect(ride.isActive).toBe(true);

    // 2. GPS 좌표 누적 (대전 타슈 경로 시뮬레이션)
    ride.addCoordinate(36.3500, 127.3845);
    ride.addCoordinate(36.3520, 127.3860);
    ride.addCoordinate(36.3545, 127.3878);
    ride.addCoordinate(36.3570, 127.3895);
    ride.addCoordinate(36.3600, 127.3915);
    expect(ride.coordinates).toHaveLength(5);

    // 3. 이용 시간 시뮬레이션 (15분 경과)
    ride.startTime = Date.now() - 900000;

    // 4. 이용 종료 → rideData 반환
    const rideData = ride.stop();
    expect(ride.isActive).toBe(false);
    expect(rideData.distanceKm).toBeGreaterThan(0);
    expect(rideData.durationMin).toBeGreaterThan(0);  // ← durationMin 검증

    // 5. 리포트 생성
    const report = generateReport(rideData, 'car');
    expect(report.carbonReductionKg).toBeGreaterThan(0);
    expect(report.pointsEarned).toBeGreaterThan(0);
    expect(typeof report.summary).toBe('string');

    // 6. 리포트 구조 최종 검증 (플랜 페이퍼 reports/{reportId} 필드 기준)
    expect(report).toMatchObject({
      distanceKm: rideData.distanceKm,
      durationMin: rideData.durationMin,              // ← durationMin
      alternativeMode: 'car',
      carbonReductionKg: expect.any(Number),
      pointsEarned: expect.any(Number),
      summary: expect.any(String),
    });
  });

  test('이용 종료 후 재시작 가능 여부 (연속 이용)', () => {
    const ride = new RideSession();

    // 1차 이용
    ride.start();
    ride.addCoordinate(36.35, 127.38);
    ride.addCoordinate(36.36, 127.39);
    const firstRide = ride.stop();
    const firstReport = generateReport(firstRide, 'bus');
    expect(firstReport.carbonReductionKg).toBeGreaterThan(0);

    // 2차 이용 (재시작)
    ride.start();
    ride.addCoordinate(36.36, 127.39);
    ride.addCoordinate(36.37, 127.40);
    const secondRide = ride.stop();
    const secondReport = generateReport(secondRide, 'bus');
    expect(secondReport.carbonReductionKg).toBeGreaterThan(0);

    // 두 이용의 포인트가 독립적으로 계산되는지 확인
    expect(firstReport.pointsEarned).toBeGreaterThan(0);
    expect(secondReport.pointsEarned).toBeGreaterThan(0);
  });

  test('거리 0 — 좌표 1개만 추가 후 종료 → 리포트 탄소 0, 포인트 0', () => {
    const ride = new RideSession();
    ride.start();
    ride.addCoordinate(36.35, 127.38);
    const rideData = ride.stop();
    const report = generateReport(rideData, 'car');
    expect(report.carbonReductionKg).toBe(0);
    expect(report.pointsEarned).toBe(0);
  });
});
