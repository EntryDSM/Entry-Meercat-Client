import axios from 'axios';
import type { ApiLogsResponse, ApiLogsParams } from '../types/apiLogs';

const API_BASE_URL = 'https://meeeeercat.ncloud.sbs';

export const fetchApiLogs = async (params: ApiLogsParams = {}): Promise<ApiLogsResponse> => {
  const { page = 1, limit = 20, sessionId, endpoint, startDate, endDate } = params;

  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (sessionId) queryParams.append('sessionId', sessionId);
  if (endpoint) queryParams.append('endpoint', endpoint);
  if (startDate) queryParams.append('startDate', startDate);
  if (endDate) queryParams.append('endDate', endDate);

  const response = await axios.get<ApiLogsResponse>(
    `${API_BASE_URL}/v1/logs/api/list?${queryParams.toString()}`
  );

  return response.data;
};
