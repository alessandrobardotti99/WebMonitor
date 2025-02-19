export interface MonitoringData {
  siteId: string;
  timestamp: number;
  data: {
    url?: string;
    loadTime: number;
    errors: Array<{
      type: string;
      message: string;
      filename: string;
      lineno: number;
      timestamp: string;
    }>;
    consoleEntries: Array<{
      type: 'log' | 'info' | 'warn' | 'error';
      message: string;
      timestamp: string;
    }>;
    imageIssues: Array<{
      url: string;
      originalSize: {
        width: number;
        height: number;
      };
      displaySize: {
        width: number;
        height: number;
      };
    }>;
    resources: Array<{
      name: string;
      type: string;
      duration: number;
      size: number;
    }>;
  };
}

export interface Site {
  id: string;
  slug: string;
  url: string;
  monitoringCode: string;
  status: string;
  lastUpdate: string | null;
  metrics: {
    loadTime: number;
    errors: {
      type: string;
      message: string;
      filename: string;
      lineNumber: number;
      timestamp: string;
    }[];
    consoleEntries: {
      type: 'log' | 'info' | 'warn' | 'error';
      message: string;
      timestamp: string;
    }[];
    imageIssues: {
      url: string;
      originalSize: { width: number; height: number };
      displaySize: { width: number; height: number };
    }[];
  };
  performanceData: {
    time: string;
    loadTime: number;
  }[];
}


export interface SiteMetrics {
  site_id: string;
  avg_load_time: number;
  total_errors: number;
  total_image_issues: number;
  samples: number;
  last_updated: string;
}