const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

if (!apiBaseUrl) {
  throw new Error(
    "Missing EXPO_PUBLIC_API_BASE_URL. Set it in client/.env for local development and in Cloudflare Pages environment variables for deployment."
  );
}

export const API_BASE_URL = apiBaseUrl;

export const API_ENDPOINTS = {
  authRegister: "/auth/register",
  authLogin: "/auth/login",
  authMe: "/auth/me",
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
