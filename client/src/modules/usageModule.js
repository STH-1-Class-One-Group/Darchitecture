import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiConstants";

export async function logUsage(action) {
  try {
    await apiClient.post(API_ENDPOINTS.usageLog, { action });
  } catch (error) {
    // 무시: 개발 환경에서는 로그 실패를 치명적으로 처리하지 않음
  }
}
