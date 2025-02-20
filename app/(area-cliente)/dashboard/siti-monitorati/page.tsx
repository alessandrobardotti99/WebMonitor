"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Globe, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Sidebar } from "@/components/sidebar";
import { motion } from "framer-motion";
import FooterDashboard from "@/components/footer-dashboard";
import SitesSkeleton from "@/components/skeleton-all-site";

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

export default function DashboardPage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
  

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 overflow-scroll h-screen flex flex-col min-h-[calc(100vh-2rem)]">
        <main className="flex-1 ml-64">
          <div className="space-y-6 p-8">
            <div className="flex items-center justify-between">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <h1 className="text-2xl font-bold">Siti Monitorati</h1>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Aggiungi Sito
                </Button>
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
