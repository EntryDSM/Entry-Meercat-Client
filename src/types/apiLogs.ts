export interface ApiLog {
  id: string;
  sessionId: string;
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime: number;
  requestSize: number;
  responseSize: number;
  createdAt: string;
}

export interface ApiLogsMeta {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface ApiLogsData {
  logs: ApiLog[];
  meta: ApiLogsMeta;
}

export interface ApiLogsResponse {
  success: boolean;
  data: ApiLogsData;
}

export interface ApiLogsParams {
  page?: number;
  limit?: number;
  sessionId?: string;
  endpoint?: string;
  startDate?: string;
  endDate?: string;
}
