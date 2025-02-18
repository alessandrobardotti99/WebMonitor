export interface PerformanceMetrics {
  loadTime: number;
  jsErrors: {
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
}

class WebMonitor {
  private monitoringCode: string;
  private metrics: PerformanceMetrics = {
    loadTime: 0,
    jsErrors: [],
    consoleEntries: [],
    imageIssues: []
  };

  constructor(code: string) {
    this.monitoringCode = code;
    this.initializeMonitoring();
  }

  private initializeMonitoring() {
    this.monitorLoadTime();
    this.monitorJsErrors();
    this.monitorConsole();
    this.monitorImageIssues();
  }

  private monitorLoadTime() {
    if (typeof window !== 'undefined') {
      const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      this.metrics.loadTime = navigationTiming.loadEventEnd - navigationTiming.startTime;
    }
  }

  private monitorJsErrors() {
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (event) => {
        if (event.error) {
          this.metrics.jsErrors.push({
            type: event.error.name || 'Error',
            message: event.error.message,
            filename: event.filename,
            lineNumber: event.lineno,
            timestamp: new Date().toISOString()
          });
        }
      });

      window.addEventListener('unhandledrejection', (event) => {
        this.metrics.jsErrors.push({
          type: 'Promise Rejection',
          message: event.reason?.message || String(event.reason),
          filename: 'Unknown',
          lineNumber: 0,
          timestamp: new Date().toISOString()
        });
      });
    }
  }

  private monitorConsole() {
    if (typeof window !== 'undefined') {
      const originalConsole = {
        log: console.log,
        info: console.info,
        warn: console.warn,
        error: console.error
      };

      const createConsoleProxy = (type: 'log' | 'info' | 'warn' | 'error') => {
        return (...args: any[]) => {
          this.metrics.consoleEntries.push({
            type,
            message: args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
            ).join(' '),
            timestamp: new Date().toISOString()
          });
          originalConsole[type].apply(console, args);
        };
      };

      console.log = createConsoleProxy('log');
      console.info = createConsoleProxy('info');
      console.warn = createConsoleProxy('warn');
      console.error = createConsoleProxy('error');
    }
  }

  private monitorImageIssues() {
    if (typeof window !== 'undefined') {
      document.querySelectorAll('img').forEach((img) => {
        if (img.complete) {
          this.checkImageDimensions(img);
        } else {
          img.addEventListener('load', () => this.checkImageDimensions(img));
        }
      });
    }
  }

  private checkImageDimensions(img: HTMLImageElement) {
    const naturalSize = {
      width: img.naturalWidth,
      height: img.naturalHeight
    };
    
    const displaySize = {
      width: img.width,
      height: img.height
    };

    const scaleFactor = Math.abs(naturalSize.width / displaySize.width);
    if (scaleFactor > 2 || scaleFactor < 0.5) {
      this.metrics.imageIssues.push({
        url: img.src,
        originalSize: naturalSize,
        displaySize: displaySize
      });
    }
  }

  public getMetrics(): PerformanceMetrics {
    return this.metrics;
  }
}

export const initializeMonitoring = (code: string) => {
  return new WebMonitor(code);
};