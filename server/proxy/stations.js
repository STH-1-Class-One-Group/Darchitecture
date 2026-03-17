const stations = [
  {
    id: 'tashu-01',
    name: '대전역 1번 출구',
    lat: 36.3321,
    lng: 127.4346,
    docks: 18,
  },
  {
    id: 'tashu-02',
    name: '유성 온천역',
    lat: 36.3538,
    lng: 127.3419,
    docks: 22,
  },
  {
    id: 'tashu-03',
    name: '정부청사 앞',
    lat: 36.3613,
    lng: 127.3866,
    docks: 16,
  },
];

function getStations() {
  return stations;
}

module.exports = {
  getStations,
};
