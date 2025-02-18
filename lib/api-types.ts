export interface MonitoringData {
  siteId: string;
  timestamp: number;
  data: {
    loadTime: number;
    errors: Array<{
      message: string;
      filename: string;
      lineno: number;
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

export interface SiteMetrics {
  site_id: string;
  avg_load_time: number;
  total_errors: number;
  total_image_issues: number;
  samples: number;
  last_updated: string;
}