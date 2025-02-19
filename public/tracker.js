// WebMonitor Tracker v1.0.0
(() => {
  const WebMonitor = {
    siteId: null,
    data: {
      loadTime: 0,
      errors: [],
      consoleEntries: [],
      imageIssues: []
    },

    init() {
      // Get site ID from script tag
      const scriptTag = document.currentScript;
      this.siteId = scriptTag?.dataset?.siteId;
      
      if (!this.siteId) {
        console.error('WebMonitor: No site ID found');
        return;
      }

      this.monitorLoadTime();
      this.monitorErrors();
      this.monitorConsole();
      this.monitorImages();
      this.setupBeacon();
    },

    monitorLoadTime() {
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0];
        this.data.loadTime = navigation.loadEventEnd - navigation.startTime;
        this.sendData();
      });
    },

    monitorErrors() {
      window.addEventListener('error', (event) => {
        if (event.error) {
          this.data.errors.push({
            type: event.error.name || 'Error',
            message: event.error.message,
            filename: event.filename,
            lineNumber: event.lineno,
            timestamp: new Date().toISOString()
          });
          this.sendData();
        }
      });

      window.addEventListener('unhandledrejection', (event) => {
        this.data.errors.push({
          type: 'Promise Rejection',
          message: event.reason?.message || String(event.reason),
          filename: 'Unknown',
          lineNumber: 0,
          timestamp: new Date().toISOString()
        });
        this.sendData();
      });
    },

    monitorConsole() {
      const originalConsole = {
        log: console.log,
        info: console.info,
        warn: console.warn,
        error: console.error
      };

      const createConsoleProxy = (type) => {
        return (...args) => {
          this.data.consoleEntries.push({
            type,
            message: args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
            ).join(' '),
            timestamp: new Date().toISOString()
          });
          originalConsole[type].apply(console, args);
          this.sendData();
        };
      };

      console.log = createConsoleProxy('log');
      console.info = createConsoleProxy('info');
      console.warn = createConsoleProxy('warn');
      console.error = createConsoleProxy('error');
    },

    monitorImages() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const checkImageSize = () => {
              const naturalWidth = img.naturalWidth;
              const naturalHeight = img.naturalHeight;
              const displayWidth = img.width;
              const displayHeight = img.height;
              const scaleFactor = Math.abs(naturalWidth / displayWidth);

              if (scaleFactor > 2 || scaleFactor < 0.5) {
                this.data.imageIssues.push({
                  url: img.src,
                  originalSize: { width: naturalWidth, height: naturalHeight },
                  displaySize: { width: displayWidth, height: displayHeight }
                });
                this.sendData();
              }
            };

            if (img.complete) {
              checkImageSize();
            } else {
              img.addEventListener('load', checkImageSize);
            }
          }
        });
      });

      document.querySelectorAll('img').forEach(img => observer.observe(img));
    },

    setupBeacon() {
      let counter = 0;
      setInterval(() => {
        this.sendData();
        counter++;
        if (counter >= 60) {
          // Reset data arrays every hour to prevent memory bloat
          this.data.errors = [];
          this.data.consoleEntries = [];
          this.data.imageIssues = [];
          counter = 0;
        }
      }, 60000); // Send data every minute
    },

    sendData() {
      const payload = {
        siteId: this.siteId,
        timestamp: Date.now(),
        data: this.data
      };

      const blob = new Blob([JSON.stringify(payload)], {
        type: 'application/json'
      });

      navigator.sendBeacon('/api/collect', blob);
    }
  };

  // Initialize the tracker
  WebMonitor.init();
})();