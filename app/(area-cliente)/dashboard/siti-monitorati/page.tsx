"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Globe, ChevronRight, Plus, Code2, CodeXml, Braces, FileCode, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Sidebar } from "@/components/sidebar";
import { motion, AnimatePresence } from "framer-motion";
import FooterDashboard from "@/components/footer-dashboard";
import SitesSkeleton from "@/components/skeleton-all-site";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { v4 as uuidv4 } from 'uuid';
import Image from "next/image";

interface Site {
  id: string;
  slug: string;
  url: string;
  monitoringCode: string;
  status: "healthy" | "warning" | "error";
  lastUpdate: string;
  metrics: {
    loadTime: number;
    errors: { type: string; message: string; filename: string; lineNumber: number; timestamp: string }[];
    consoleEntries: { type: "log" | "info" | "warn" | "error"; message: string; timestamp: string }[];
    imageIssues: { url: string; originalSize: { width: number; height: number }; displaySize: { width: number; height: number } }[];
  };
}

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
);

const getStatusColor = (status: Site["status"]) => {
  switch (status) {
    case "healthy":
      return "bg-green-500/15 text-green-700 dark:text-green-400";
    case "warning":
      return "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400";
    case "error":
      return "bg-red-500/15 text-red-700 dark:text-red-400";
  }
};

const getInstallationCode = (token: string, method: string) => {
  switch (method) {
    case 'script':
      return `<!-- Add this code just before closing </body> tag -->
<script>
  (function(w,d,s,c) {
    var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s);
    j.async=true;
    j.src='https://web-monitor-eta.vercel.app/tracker.min.js';
    j.dataset.siteId=c;
    f.parentNode.insertBefore(j,f);
  })(window,document,'script','${token}');
</script>`;
    case 'cdn':
      return `<!-- Aggiungi questo codice nel tag <head> -->
<script 
  src="https://web-monitor-eta.vercel.app/tracker.min.js" 
  data-site-id="${token}"
  async
></script>`;
    case 'react':
      return `// In your React component or App.js
import { useEffect } from 'react';

function WebMonitor() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://web-monitor-eta.vercel.app/tracker.min.js';
    script.async = true;
    script.dataset.siteId = '${token}';
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
}`;
    case 'vue':
      return `<!-- In your Vue component -->
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
    script.dataset.siteId = '${token}';
    document.body.appendChild(script);
  },
  beforeDestroy() {
    const script = document.querySelector(\`script[data-site-id="${token}"]\`);
    if (script) {
      document.body.removeChild(script);
    }
  }
}
</script>`;
    case 'next':
      return `// In your _app.tsx or a layout component
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Script
          src="https://web-monitor-eta.vercel.app/tracker.min.js"
          data-site-id="${token}"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}`;
    case 'laravel':
      return `{{-- In your blade layout file --}}
<!DOCTYPE html>
<html>
<head>
    {{-- Your other head elements --}}
</head>
<body>
    @yield('content')
    
    <script
        src="https://web-monitor-eta.vercel.app/tracker.min.js"
        data-site-id="{{ '${token}' }}"
        async
    ></script>
</body>
</html>

{{-- Or in your app.blade.php --}}
@push('scripts')
    <script
        src="https://web-monitor-eta.vercel.app/tracker.min.js"
        data-site-id="{{ '${token}' }}"
        async
    ></script>
@endpush`;
    default:
      return '';
  }
};

export default function DashboardPage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newToken, setNewToken] = useState<string>('');
  const [integrationMethod, setIntegrationMethod] = useState('cdn');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    async function fetchSites() {
      try {
        const response = await fetch("/api/collect/");
        if (!response.ok) throw new Error("Errore nel recupero dei dati");
        const data = await response.json();
        setSites(data);
      } catch (err) {
        setError("Impossibile recuperare i dati");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchSites();
  }, []);

  const handleGenerateToken = () => {
    const token = uuidv4();
    setNewToken(token);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 overflow-scroll h-screen flex flex-col min-h-[calc(100vh-2rem)]">
        <main className="flex-1 ml-64">
          <div className="space-y-6 p-8">
            <div className="flex items-center justify-between">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <h1 className="text-2xl font-bold">Siti monitorati</h1>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={handleGenerateToken}>
                      <Plus className="h-4 w-4 mr-2" />
                      Aggiungi sito
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[1200px]">
                    <DialogHeader>
                      <DialogTitle>Aggiungi un nuovo sito</DialogTitle>
                      <DialogDescription>
                        Usa questo token per monitorare il tuo sito. Copia il codice di installazione e aggiungilo al tuo sito.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm font-mono mb-2">Il tuo token di monitoraggio:</p>
                        <code className="text-primary font-bold">{newToken}</code>
                      </div>

                      <div className="space-y-6">
                        <div className="border-b mb-6">
                          <div className="flex gap-2 overflow-x-auto pb-2">
                            <Tab
                              icon={CodeXml}
                              label="CDN"
                              isActive={integrationMethod === 'cdn'}
                              onClick={() => setIntegrationMethod('cdn')}
                            />
                            <Tab
                              iconSrc="/icon-language/icons8-javascript.svg"
                              label="Script Tag"
                              isActive={integrationMethod === 'script'}
                              onClick={() => setIntegrationMethod('script')}
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

                        <AnimatePresence mode="wait">
                          <motion.div
                            key={integrationMethod}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-4"
                          >
                            <div className="rounded-lg overflow-hidden border">
                              <div className="bg-muted px-4 py-2 border-b flex items-center gap-2">
                                {integrationMethod === 'script' && (
                                  <Image src="/icon-language/icons8-javascript.svg" alt="JavaScript" width={16} height={16} />
                                )}
                                {integrationMethod === 'react' && (
                                  <Image src="/icon-language/icons8-reagire.svg" alt="React" width={16} height={16} />
                                )}
                                {integrationMethod === 'vue' && (
                                  <Image src="/icon-language/icons8-vista-js.svg" alt="Vue.js" width={16} height={16} />
                                )}
                                {integrationMethod === 'next' && (
                                  <Image src="/icon-language/icons8-nextjs.svg" alt="Next.js" width={16} height={16} />
                                )}
                                {integrationMethod === 'laravel' && (
                                  <Image src="/icon-language/laravel-svgrepo-com.svg" alt="Laravel" width={16} height={16} />
                                )}
                                {integrationMethod === 'cdn' && <Code2 className="w-4 h-4 text-muted-foreground" />}
                                <span className="text-sm text-muted-foreground">Installation Code</span>
                              </div>
                              <pre className="p-4 bg-black/90 text-gray-300 font-mono text-sm overflow-x-auto">
                                <code>{getInstallationCode(newToken, integrationMethod)}</code>
                              </pre>
                            </div>
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </motion.div>
            </div>

            {loading ? (
              <div>
                <SitesSkeleton />
              </div>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {sites.map((site) => (
                    <Link key={site.id} href={`/dashboard/siti-monitorati/${encodeURIComponent(site.monitoringCode)}`}>
                      <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Globe className="h-5 w-5 text-muted-foreground" />
                                <div>
                                  <h2 className="font-medium">{site.url}</h2>
                                  <p className="text-sm text-muted-foreground">Ultimo aggiornamento: {site.lastUpdate}</p>
                                </div>
                              </div>
                              <Badge className={getStatusColor(site.status)}>
                                {site.status.charAt(0).toUpperCase() + site.status.slice(1)}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-2">
                              <div>
                                <p className="text-sm text-muted-foreground">Tempo di Caricamento</p>
                                <p className="text-lg font-medium">{site.metrics?.loadTime ? `${site.metrics.loadTime}s` : "N/A"}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Errori JS</p>
                                <p className="text-lg font-medium">{site.metrics?.errors?.length ?? 0}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Log Console</p>
                                <p className="text-lg font-medium">{site.metrics?.consoleEntries?.length ?? 0}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Problemi Immagini</p>
                                <p className="text-lg font-medium">{site.metrics?.imageIssues?.length ?? 0}</p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t">
                              <code className="text-xs text-muted-foreground font-mono">{site.monitoringCode}</code>
                              <ChevronRight className="h-5 w-5 text-muted-foreground" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </main>
        <FooterDashboard />
      </div>
    </div>
  );
}