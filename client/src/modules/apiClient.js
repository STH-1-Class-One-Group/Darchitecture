import axios from "axios";
import { API_BASE_URL } from "../constants/apiConstants";
import { auth } from "../lib/firebase";

const apiClient = axios.create({
  baseURL: API_BASE_URL
});

apiClient.interceptors.request.use(async (config) => {
  if (typeof auth.authStateReady === "function") {
    try {
      await auth.authStateReady();
    } catch (error) {
      // 인증 상태 복원이 늦어도 요청은 계속 시도한다.
    }
  }

  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers = {
      ...(config.headers || {}),
      Authorization: `Bearer ${token}`
    };
  }

  return config;
});

export default apiClient;
