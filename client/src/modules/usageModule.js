import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiConstants";

export async function logUsage(action, userId) {
  try {
    await apiClient.post(API_ENDPOINTS.usageLog, { action, userId });
  } catch (error) {
    // 무시: 프로토타입에서는 로그 실패를 치명적으로 처리하지 않음
  }
}
