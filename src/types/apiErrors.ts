export interface ApiError {
  id: string;
  errorType: 'CLIENT' | 'SERVER';
  sessionId: string;
  pageType: 'USER' | 'ADMISSION';
  errorCategory: 'NETWORK_ERROR' | 'RUNTIME_ERROR' | 'SERVER_ERROR';
  errorCode: string;
  message: string;
  endpoint: string | null;
  httpMethod: string | null;
  httpStatus: number | null;
  createdAt: string;
  resolved?: boolean;
  resolvedAt?: string;
}

export interface ApiErrorsMeta {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface ApiErrorsData {
  errors: ApiError[];
  meta: ApiErrorsMeta;
}

export interface ApiErrorsResponse {
  success: boolean;
  data: ApiErrorsData;
}

export interface ApiErrorsParams {
  page: number;
  limit: number;
  errorType?: 'CLIENT' | 'SERVER';
  resolutionStatus?: 'RESOLVED' | 'UNRESOLVED';
  startDate?: string;
  endDate?: string;
}
