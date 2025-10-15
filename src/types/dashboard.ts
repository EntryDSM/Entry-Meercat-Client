export interface DashboardResponse {
  success: boolean;
  data: DashboardData;
}

export interface DashboardData {
  realtime: {
    concurrent: {
      total: number;
      byStatus: {
        browsing: number;
        authenticated: number;
        submitting: number;
        maintaining: number;
      };
      byPageType: {
        USER: number;
        AUTH: number;
        ADMISSION: number;
      };
    };
    activeSubmissions: number;
  };
  performance: {
    server: {
      avgResponseTime: number;
      maxResponseTime: number;
    };
    client: {
      avgDomLoadTime: number | null;
    };
  };
  apiStatus: {
    totalRequests: number;
    requestsLastHour: number;
    successRequests: number;
    errorRequests: number;
    avgResponseTime: number;
    maxResponseTime: number;
  };
  errors: {
    lastHour: {
      client: number;
      clientWarnings: number;
      server: number;
      critical: number;
    };
    recentServerErrors: Array<{
      id: string;
      message: string;
      endpoint: string;
      httpStatus: number;
      createdAt: string;
    }>;
    recentClientErrors: any[];
    recentClientWarnings: any[];
  };
  submissions: {
    total: number;
    inProgress: number;
    success: number;
    failed: number;
    abandoned: number;
    avgDuration: string;
  };
  cancellations: {
    success: number;
    failed: number;
  };
  pdf: {
    download: {
      success: number;
      failed: number;
    };
    preview: {
      success: number;
      failed: number;
    };
  };
  api: {
    totalRequests: number;
  };
  network: {
    good: number;
    poor: number;
  };
  devices: {
    [key: string]: {
      count: number;
      percentage: number;
    };
  };
  timeline: {
    concurrentMax: number;
    concurrentAvg: number;
    data: Array<{
      time: string;
      count: number;
    }>;
  };
  serverTimeout: {
    lastHour: number;
    total: number;
  };
  visitorStats: {
    totalSessions: number;
    revisitSessions: number;
    revisitRate: number;
    avgRevisitCount: number;
    avgStayTime: string;
  };
}
