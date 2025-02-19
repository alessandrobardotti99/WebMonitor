"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { AlertCircle, Clock, Image as ImageIcon, Code, Terminal, FileDown, ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Site } from "@/lib/api-types"

interface SiteDetailPageClientProps {
  slug: string;
}

const getStatusColor = (status: Site['status']) => {
  switch (status) {
    case 'healthy':
      return 'bg-green-500/15 text-green-700 dark:text-green-400';
    case 'warning':
      return 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400';
    case 'error':
      return 'bg-red-500/15 text-red-700 dark:text-red-400';
    default:
      return 'bg-gray-500/15 text-gray-700 dark:text-gray-400';
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
  console.log("🔍 Params ricevuti:", params);
  const monitoringCode = params.slug as string;
  const [activeMetric, setActiveMetric] = useState<'performance' | 'errors'>('performance')
  const [integrationMethod, setIntegrationMethod] = useState<'script' | 'cdn'>('script')
  const [site, setSite] = useState<Site | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    
    const fetchSiteData = async () => {
      try {
        console.log(`📡 Fetching data for monitoringCode: ${monitoringCode}`);
        setIsLoading(true);
        const response = await fetch(`/api/collect/sites/${monitoringCode}`);
        if (!response.ok) {
          throw new Error('Failed to fetch site data');
        }
        const data = await response.json();
        setSite(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchSiteData();
  }, [monitoringCode]);
  
  

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
    if (!site) return;
    
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Caricamento dati...</p>
        </div>
      </div>
    )
  }

  if (error || !site) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto" />
          <h2 className="text-lg font-semibold">Errore nel caricamento dei dati</h2>
          <p className="text-muted-foreground">{error || 'Sito non trovato'}</p>
          <Button asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Torna alla Dashboard
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 container m-auto mt-16">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/siti-monitorati">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-2xl font-bold">{site.url}</h1>
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
              Average Load Time ⚡️
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{site.metrics.loadTime.toFixed(2)}s</div>
            <p className="text-xs text-muted-foreground">
              +0.1s from last hour
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              JavaScript Errors 🐛
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{site.metrics.errors.length}</div>
            <p className="text-xs text-muted-foreground">
              {site.metrics.errors.length > 0 ? '+' : '-'}
              {site.metrics.errors.length} from last hour
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Image Issues 🖼️
            </CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{site.metrics.imageIssues.length}</div>
            <p className="text-xs text-muted-foreground">
              {site.metrics.imageIssues.length > 0 ? '+' : '-'}
              {site.metrics.imageIssues.length} from last hour
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Console Entries 📝
            </CardTitle>
            <Terminal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{site.metrics.consoleEntries.length}</div>
            <p className="text-xs text-muted-foreground">
              {site.metrics.consoleEntries.length > 0 ? '+' : '-'}
              {site.metrics.consoleEntries.length} from last hour
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Overview 📊</CardTitle>
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
            <CardTitle>Recent JavaScript Errors 🐛</CardTitle>
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
            <CardTitle>Console Output 📝</CardTitle>
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
            <CardTitle>Image Optimization Issues 🖼️</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
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
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Installation Methods 🔧</CardTitle>
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