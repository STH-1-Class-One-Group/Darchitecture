export const API_BASE_URL = "https://deutsch-erp-factors-represents.trycloudflare.com";

export const API_ENDPOINTS = {
  authRegister: "/auth/register",
  authLogin: "/auth/login",
  rideStart: "/ride/start",
  rideEnd: "/ride/end",
  reportList: "/report/list",
  reportDetail: (id) => `/report/${id}`,
  pointBalance: "/point/balance",
  pointLog: "/point/log",
  mapStations: "/map/stations",
  quizQuestions: "/quiz/questions",
  quizSubmit: "/quiz/submit",
  usageLog: "/usage/log"
};