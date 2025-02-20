"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SkeletonLoader from './skeleton-loader-detail-page'
import Image from 'next/image'
import {
  AlertCircle,
  Clock,
  Image as ImageIcon,
  Code,
  Terminal,
  FileDown,
  ArrowLeft,
  Loader2,
  Code2,
  Braces,
  FileCode,
  CodeXml,
  Database,
  AlertTriangle,
  Info
} from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Site } from "@/lib/api-types"

interface TabProps {
  icon?: React.ElementType;
  iconSrc?: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const Tab = ({ icon: Icon, iconSrc, label, isActive, onClick }: TabProps) => (
  <button
    onClick={onClick}
    className={`relative flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors
      ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
  >
    {iconSrc ? (
      <Image src={iconSrc} alt={label} width={20} height={20} className="w-5 h-5" />
    ) : (
      Icon && <Icon className="w-4 h-4" />
    )}
    {label}
    {isActive && (
      <motion.div
        layoutId="activeTab"
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
        initial={false}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    )}
  </button>
)

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
  const [integrationMethod, setIntegrationMethod] = useState<'script' | 'cdn' | 'react' | 'vue' | 'next' | 'laravel'>('script')
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

  const performanceChartData = site?.performanceData?.map(entry => ({
    time: entry.time,
    loadTime: entry.loadTime
  })) || [];

  const resourceChartData = site?.metrics?.resources?.map((resource) => ({
    name: resource.name.split('/').pop(), // Usa il nome effettivo del file
    duration: resource.duration
  })) || [];
  

  const getScriptCode = (site: Site) => `
<!-- Add this code just before closing </body> tag -->
<script>
  (function(w,d,s,c) {
    var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s);
    j.async=true;
    j.src='https://web-monitor-eta.vercel.app/tracker.min.js';
    j.dataset.siteId=c;
    f.parentNode.insertBefore(j,f);
  })(window,document,'script','${site.monitoringCode}');
</script>`

  const getCdnCode = (site: Site) => `
<!-- Add this code in the <head> tag -->
<script 
  src="https://web-monitor-eta.vercel.app/tracker.min.js" 
  data-site-id="${site.monitoringCode}"
  async
></script>`

  const getReactCode = (site: Site) => `
// In your React component or App.js
import { useEffect } from 'react';

function WebMonitor() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://web-monitor-eta.vercel.app/tracker.min.js';
    script.async = true;
    script.dataset.siteId = '${site.monitoringCode}';
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
}

// Use it in your app
function App() {
  return (
    <>
      <WebMonitor />
      {/* Your app content */}
    </>
  );
}`

  const getVueCode = (site: Site) => `
<!-- In your Vue component -->
<template>
  <div>
    <!-- Your component content -->
  </div>
</template>

<script>
export default {
  name: 'WebMonitor',
  mounted() {
    const script = document.createElement('script');
    script.src = 'https://web-monitor-eta.vercel.app/tracker.min.js';
    script.async = true;
    script.dataset.siteId = '${site.monitoringCode}';
    document.body.appendChild(script);
  },
  beforeDestroy() {
    const script = document.querySelector(\`script[data-site-id="${site.monitoringCode}"]\`);
    if (script) {
      document.body.removeChild(script);
    }
  }
}
</script>`

  const getNextCode = (site: Site) => `
// In your _app.tsx or a layout component
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Script
          src="https://web-monitor-eta.vercel.app/tracker.min.js"
          data-site-id="${site.monitoringCode}"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}`

  const getLaravelCode = (site: Site) => `
{{-- In your blade layout file --}}
<!DOCTYPE html>
<html>
<head>
    {{-- Your other head elements --}}
</head>
<body>
    @yield('content')
    
    <script
        src="https://web-monitor-eta.vercel.app/tracker.min.js"
        data-site-id="{{ '${site.monitoringCode}' }}"
        async
    ></script>
</body>
</html>

{{-- Or in your app.blade.php --}}
@push('scripts')
    <script
        src="https://web-monitor-eta.vercel.app/tracker.min.js"
        data-site-id="{{ '${site.monitoringCode}' }}"
        async
    ></script>
@endpush`




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
      <div>
        <SkeletonLoader />
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

      {/* Update the metrics cards at the top */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tempo di Caricamento Medio ⚡️
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{site.metrics.loadTime.toFixed(2)}s</div>
            <p className="text-xs text-muted-foreground">
              +0.1s dall&apos;ultima ora
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Errori JavaScript 🐛
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{site.metrics.errors.length}</div>
            <p className="text-xs text-muted-foreground">
              {site.metrics.errors.length > 0 ? '+' : '-'}
              {site.metrics.errors.length} dall&apos;ultima ora
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Problemi Immagini 🖼️
            </CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{site.metrics.imageIssues.length}</div>
            <p className="text-xs text-muted-foreground">
              {site.metrics.imageIssues.length > 0 ? '+' : '-'}
              {site.metrics.imageIssues.length} dall&apos;ultima ora
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Log Console 📝
            </CardTitle>
            <Terminal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{site.metrics.consoleEntries.length}</div>
            <p className="text-xs text-muted-foreground">
              {site.metrics.consoleEntries.length > 0 ? '+' : '-'}
              {site.metrics.consoleEntries.length} dall&apos;ultima ora
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Caricamento Risorse 📊</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeMetric} onValueChange={(v) => setActiveMetric(v as 'performance' | 'errors')}>
            {/* 🔥 Grafico della performance generale */}
            <TabsContent value="performance">
              {/* 🔥 Grafico delle risorse caricate */}
              <div className="h-[300px] mt-8">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={resourceChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="duration" stroke="hsl(var(--chart-2))" name="Caricamento (ms)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            {/* 🔥 Grafico degli errori */}
            <TabsContent value="errors">
              <div className="h-[300px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="errors" stroke="hsl(var(--chart-3))" name="Errors" />
                    <Line type="monotone" dataKey="imageIssues" stroke="hsl(var(--chart-4))" name="Image Issues" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

          </Tabs>
        </CardContent>
      </Card>

      {/* In the grid section for the three monitoring cards, update to: */}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Code2 className="h-5 w-5 text-destructive" />
              Errori JavaScript Recenti
            </CardTitle>
            <Badge variant="destructive" className="font-medium">
              {site.metrics.errors.length} errori
            </Badge>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {site.metrics.errors.map((error, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="group relative p-4 bg-destructive/5 hover:bg-destructive/10 rounded-lg border border-destructive/20 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="font-medium text-destructive flex items-center gap-2">
                          <AlertCircle className="h-4 w-4" />
                          {error.type}
                        </p>
                        <p className="text-sm text-muted-foreground">{error.message}</p>
                      </div>
                      <time className="text-xs text-muted-foreground">
                        {new Date(error.timestamp).toLocaleTimeString()}
                      </time>
                    </div>
                    <div className="mt-2 pt-2 border-t border-destructive/10 text-xs text-muted-foreground flex items-center gap-2">
                      <FileCode className="h-4 w-4" />
                      <span>
                        {error.filename}:{error.lineNumber}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Terminal className="h-5 w-5 text-primary" />
              Log della Console
            </CardTitle>
            <Badge className="font-medium">
              {site.metrics.consoleEntries.length} messaggi
            </Badge>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {site.metrics.consoleEntries.map((entry, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`p-3 rounded-lg font-mono text-sm border ${entry.type === 'error' ? 'bg-destructive/5 border-destructive/20' :
                      entry.type === 'warn' ? 'bg-yellow-500/5 border-yellow-500/20' :
                        entry.type === 'info' ? 'bg-blue-500/5 border-blue-500/20' :
                          'bg-muted border-muted-foreground/20'
                      }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className={`flex-1 ${getConsoleEntryColor(entry.type)}`}>
                        <div className="flex items-center gap-2">
                          {entry.type === 'error' && <AlertCircle className="h-4 w-4" />}
                          {entry.type === 'warn' && <AlertTriangle className="h-4 w-4" />}
                          {entry.type === 'info' && <Info className="h-4 w-4" />}
                          {entry.type === 'log' && <Terminal className="h-4 w-4" />}
                          {entry.message}
                        </div>
                      </div>
                      <time className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(entry.timestamp).toLocaleTimeString()}
                      </time>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-blue-500" />
              Ottimizzazione Immagini
            </CardTitle>
            <Badge variant="secondary" className="font-medium">
              {site.metrics.imageIssues.length} problemi
            </Badge>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {site.metrics.imageIssues.map((issue, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="group p-4 bg-muted/50 hover:bg-muted rounded-lg border transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm flex items-center gap-2">
                          <ImageIcon className="h-4 w-4" />
                          {issue.url.split('/').pop()}
                        </h4>
                        <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium">Dimensione Originale:</span>
                            <Badge variant="outline">
                              {issue.originalSize.width}x{issue.originalSize.height}px
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium">Dimensione Display:</span>
                            <Badge variant="outline">
                              {issue.displaySize.width}x{issue.displaySize.height}px
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={issue.originalSize.width > issue.displaySize.width * 2 ? "destructive" : "secondary"}
                          className="whitespace-nowrap"
                        >
                          {issue.originalSize.width > issue.displaySize.width * 2
                            ? 'Ridimensiona'
                            : 'Aumenta Risoluzione'}
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t text-xs text-muted-foreground">
                      <p className="font-medium">
                        Suggerimento: {
                          issue.originalSize.width > issue.displaySize.width * 2
                            ? 'L\'immagine è troppo grande per il display. Riduci le dimensioni per migliorare le prestazioni.'
                            : 'L\'immagine potrebbe apparire sfocata. Considera l\'utilizzo di una versione a risoluzione maggiore.'
                        }
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Metodi di installazione 🔧</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="border-b mb-6">
            <div className="flex gap-2">
              <Tab
               iconSrc="/icon-language/icons8-javascript.svg" 
                label="Script Tag"
                isActive={integrationMethod === 'script'}
                onClick={() => setIntegrationMethod('script')}
              />
              <Tab
                icon={CodeXml}
                label="CDN"
                isActive={integrationMethod === 'cdn'}
                onClick={() => setIntegrationMethod('cdn')}
              />
              <Tab
                 iconSrc="/icon-language/icons8-reagire.svg" 
                label="React"
                isActive={integrationMethod === 'react'}
                onClick={() => setIntegrationMethod('react')}
              />
              <Tab
                 iconSrc="/icon-language/icons8-vista-js.svg" 
                label="Vue.js"
                isActive={integrationMethod === 'vue'}
                onClick={() => setIntegrationMethod('vue')}
              />
              <Tab
                   iconSrc="/icon-language/icons8-nextjs.svg" 
                label="Next.js"
                isActive={integrationMethod === 'next'}
                onClick={() => setIntegrationMethod('next')}
              />
              <Tab
                   iconSrc="/icon-language/laravel-svgrepo-com.svg" 
                label="Laravel"
                isActive={integrationMethod === 'laravel'}
                onClick={() => setIntegrationMethod('laravel')}
              />
            </div>
          </div>

          <div className="space-y-4">
            {integrationMethod === 'script' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="space-y-4"
              >
                <div className="text-sm text-muted-foreground">
                  Add this code just before the closing <code className="text-primary">&lt;/body&gt;</code> tag of your website.
                </div>
                <div className="rounded-lg overflow-hidden border">
                  <div className="bg-muted px-4 py-2 border-b flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">script.html</span>
                  </div>
                  <pre className="p-4 bg-black/90 text-gray-300 font-mono text-sm">
                    <code>{getScriptCode(site)}</code>
                  </pre>
                </div>
              </motion.div>
            )}

            {integrationMethod === 'cdn' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="space-y-4"
              >
                <div className="text-sm text-muted-foreground">
                  Add this code in the <code className="text-primary">&lt;head&gt;</code> section of your website.
                  This method uses our CDN for faster loading.
                </div>
                <div className="rounded-lg overflow-hidden border">
                  <div className="bg-muted px-4 py-2 border-b flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">index.html</span>
                  </div>
                  <pre className="p-4 bg-black/90 text-gray-300 font-mono text-sm">
                    <code>{getCdnCode(site)}</code>
                  </pre>
                </div>
              </motion.div>
            )}

            {integrationMethod === 'react' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="space-y-4"
              >
                <div className="text-sm text-muted-foreground">
                  Create a WebMonitor component and add it to your React application.
                </div>
                <div className="rounded-lg overflow-hidden border">
                  <div className="bg-muted px-4 py-2 border-b flex items-center gap-2">
                    <Braces className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">WebMonitor.tsx</span>
                  </div>
                  <pre className="p-4 bg-black/90 text-gray-300 font-mono text-sm">
                    <code>{getReactCode(site)}</code>
                  </pre>
                </div>
              </motion.div>
            )}

            {integrationMethod === 'vue' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="space-y-4"
              >
                <div className="text-sm text-muted-foreground">
                  Create a WebMonitor component in your Vue.js application.
                </div>
                <div className="rounded-lg overflow-hidden border">
                  <div className="bg-muted px-4 py-2 border-b flex items-center gap-2">
                    <Code className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">WebMonitor.vue</span>
                  </div>
                  <pre className="p-4 bg-black/90 text-gray-300 font-mono text-sm">
                    <code>{getVueCode(site)}</code>
                  </pre>
                </div>
              </motion.div>
            )}

            {integrationMethod === 'next' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="space-y-4"
              >
                <div className="text-sm text-muted-foreground">
                  Use Next.js Script component for optimal loading.
                </div>
                <div className="rounded-lg overflow-hidden border">
                  <div className="bg-muted px-4 py-2 border-b flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">layout.tsx</span>
                  </div>
                  <pre className="p-4 bg-black/90 text-gray-300 font-mono text-sm">
                    <code>{getNextCode(site)}</code>
                  </pre>
                </div>
              </motion.div>
            )}

            {integrationMethod === 'laravel' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="space-y-4"
              >
                <div className="text-sm text-muted-foreground">
                  Add the tracking code to your Laravel Blade layout.
                </div>
                <div className="rounded-lg overflow-hidden border">
                  <div className="bg-muted px-4 py-2 border-b flex items-center gap-2">
                    <Database className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">app.blade.php</span>
                  </div>
                  <pre className="p-4 bg-black/90 text-gray-300 font-mono text-sm">
                    <code>{getLaravelCode(site)}</code>
                  </pre>
                </div>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}