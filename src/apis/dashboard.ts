import axios from 'axios';
import type { DashboardResponse } from '../types/dashboard';

const API_BASE_URL = 'https://meeeeercat.ncloud.sbs';

export const fetchDashboardData = async (): Promise<DashboardResponse> => {
  const response = await axios.get<DashboardResponse>(
    `${API_BASE_URL}/v1/dashboard/realtime`
  );
  return response.data;
};
