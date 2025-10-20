import axios from 'axios';
import type { ApiErrorsParams, ApiErrorsResponse } from '../types/apiErrors';

const BASE_URL = 'https://meeeeercat.ncloud.sbs/v1/error/admin';

export const fetchApiErrors = async (params: ApiErrorsParams): Promise<ApiErrorsResponse> => {
  const response = await axios.get<ApiErrorsResponse>(`${BASE_URL}/list`, {
    params: {
      page: params.page,
      limit: params.limit,
      errorType: params.errorType,
      resolutionStatus: params.resolutionStatus,
      startDate: params.startDate,
      endDate: params.endDate,
    },
  });
  return response.data;
};
