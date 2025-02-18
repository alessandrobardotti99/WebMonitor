"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { AlertCircle, Clock, Image as ImageIcon, Code, Terminal, FileDown, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface Site {
  id: string;
  slug: string;
  url: string;
  monitoringCode: string;
  status: 'healthy' | 'warning' | 'error';
  lastUpdate: string;
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
  performanceData: typeof defaultPerformanceData;
}

const defaultPerformanceData = [
  { time: '00:00', loadTime: 1.2 },
  { time: '04:00', loadTime: 1.5 },
  { time: '08:00', loadTime: 2.1 },
  { time: '12:00', loadTime: 1.8 },
  { time: '16:00', loadTime: 1.3 },
  { time: '20:00', loadTime: 1.6 },
]

const getStatusColor = (status: Site['status']) => {
  switch (status) {
    case 'healthy':
      return 'bg-green-500/15 text-green-700 dark:text-green-400';
    case 'warning':
      return 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400';
    case 'error':
      return 'bg-red-500/15 text-red-700 dark:text-red-400';
  }
}

const getConsoleEntryColor = (type: 'log' | 'info' | 'warn' | 'error') => {
  switch (type) {
    case 'error':
      return 'text-red-500 dark:text-red-400';
    case 'warn':
      return 'text-yellow-500 dark:text-yellow-400';
    case 'info':
      return 'text-blue-500 dark:text-blue-400';
    default:
      return 'text-foreground';
  }
}


export default function SiteDetailPage() {
  const params = useParams()
  const [activeMetric, setActiveMetric] = useState<'performance' | 'errors'>('performance')
  const [integrationMethod, setIntegrationMethod] = useState<'script' | 'cdn'>('script')

  // In a real app, fetch site data based on the slug
  const site: Site = {
    id: '1',
    slug: 'example-com',
    url: decodeURIComponent(params.site as string),
    monitoringCode: `wm_${Date.now()}`,
    status: 'warning',
    lastUpdate: '2 minutes ago',
    metrics: {
      loadTime: 1.58,
      errors: [
        {
          type: 'TypeError',
          message: 'Cannot read property \'length\' of undefined',
          filename: 'main.js',
          lineNumber: 123,
          timestamp: '2025-02-19T10:30:15.000Z'
        },
        {
          type: 'ReferenceError',
          message: 'analytics is not defined',
          filename: 'analytics.js',
          lineNumber: 45,
          timestamp: '2025-02-19T10:31:20.000Z'
        }
      ],
      consoleEntries: [
        {
          type: 'error',
          message: 'Failed to load resource: the server responded with a status of 404',
          timestamp: '2025-02-19T10:30:10.000Z'
        },
        {
          type: 'warn',
          message: 'Authentication token is about to expire',
          timestamp: '2025-02-19T10:31:00.000Z'
        }
      ],
      imageIssues: [
        {
          url: '/images/hero.jpg',
          originalSize: { width: 1920, height: 1080 },
          displaySize: { width: 480, height: 270 }
        },
        {
          url: '/images/product.jpg',
          originalSize: { width: 800, height: 800 },
          displaySize: { width: 1600, height: 1600 }
        }
      ]
    },
    performanceData: defaultPerformanceData
  }

  const getScriptCode = (site: Site) => `
<!-- Add this code just before closing </body> tag -->
<script>
  (function(w,d,s,c) {
    var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s);
    j.async=true;
    j.src='https://webmonitor.example.com/tracker.js';
    j.dataset.siteId=c;
    f.parentNode.insertBefore(j,f);
  })(window,document,'script','${site.monitoringCode}');
</script>`

  const getCdnCode = (site: Site) => `
<!-- Add this code in the <head> tag -->
<script 
  src="https://cdn.webmonitor.control/tracker.min.js" 
  data-site-id="${site.monitoringCode}"
  async
></script>`

  const handleExportData = () => {
    const data = {
      site: site.url,
      metrics: site.metrics,
      performanceData: site.performanceData
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${site.url}-monitoring-data.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 container m-auto mt-16">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
            <Link href={'/dashboard'}>
            <ArrowLeft />
            </Link>
          <h1 className="text-2xl font-bold">{site.slug}</h1>
          <Badge className={getStatusColor(site.status)}>
            {site.status.charAt(0).toUpperCase() + site.status.slice(1)}
          </Badge>
        </div>
        <Button onClick={handleExportData}>
          <FileDown className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Load Time
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{site.metrics.loadTime}s</div>
            <p className="text-xs text-muted-foreground">
              +0.1s from last hour
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              JavaScript Errors
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{site.metrics.errors.length}</div>
            <p className="text-xs text-muted-foreground">
              -2 from last hour
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Image Issues
            </CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{site.metrics.imageIssues.length}</div>
            <p className="text-xs text-muted-foreground">
              +3 from last hour
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Console Entries
            </CardTitle>
            <Terminal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{site.metrics.consoleEntries.length}</div>
            <p className="text-xs text-muted-foreground">
              +5 from last hour
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeMetric} onValueChange={(v) => setActiveMetric(v as 'performance' | 'errors')}>
            <TabsList className="grid w-full max-w-[400px] grid-cols-2">
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="errors">Errors & Issues</TabsTrigger>
            </TabsList>
            <TabsContent value="performance">
              <div className="h-[300px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={site.performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="loadTime" 
                      stroke="hsl(var(--chart-1))" 
                      name="Load Time (s)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="errors">
              <div className="h-[300px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={site.performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="errors" 
                      stroke="hsl(var(--chart-2))" 
                      name="Errors"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="imageIssues" 
                      stroke="hsl(var(--chart-3))" 
                      name="Image Issues"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Recent JavaScript Errors</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {site.metrics.errors.map((error, i) => (
                  <div key={i} className="p-3 bg-destructive/10 rounded-lg">
                    <p className="font-medium text-destructive">{error.type}</p>
                    <p className="text-sm text-muted-foreground">{error.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {error.filename}:{error.lineNumber}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(error.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Console Output</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-2 font-mono text-sm">
                {site.metrics.consoleEntries.map((entry, i) => (
                  <div key={i} className={`${getConsoleEntryColor(entry.type)}`}>
                    <span className="opacity-50">[{new Date(entry.timestamp).toLocaleTimeString()}]</span>{' '}
                    {entry.message}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
        <CardHeader>
          <CardTitle>Image Optimization Issues</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {site.metrics.imageIssues.map((issue, i) => (
              <div key={i} className="p-3 bg-muted rounded-lg">
                <p className="font-medium">{issue.url.split('/').pop()}</p>
                <div className="text-sm text-muted-foreground">
                  <p>Original: {issue.originalSize.width}x{issue.originalSize.height}px</p>
                  <p>Display: {issue.displaySize.width}x{issue.displaySize.height}px</p>
                  <p className="text-destructive mt-1">
                    Recommendation: {
                      issue.originalSize.width > issue.displaySize.width * 2
                        ? 'Serve resized image'
                        : 'Use higher resolution image'
                    }
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      </div>

      

      <Card>
        <CardHeader>
          <CardTitle>Installation Methods</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs value={integrationMethod} onValueChange={(v) => setIntegrationMethod(v as 'script' | 'cdn')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="script">Script Tag</TabsTrigger>
              <TabsTrigger value="cdn">CDN</TabsTrigger>
            </TabsList>
            <TabsContent value="script" className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Add this code just before the closing <code className="text-primary">&lt;/body&gt;</code> tag of your website.
              </div>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                <code>{getScriptCode(site)}</code>
              </pre>
            </TabsContent>
            <TabsContent value="cdn" className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Add this code in the <code className="text-primary">&lt;head&gt;</code> section of your website.
                This method uses our CDN for faster loading.
              </div>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                <code>{getCdnCode(site)}</code>
              </pre>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}