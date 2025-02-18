"use client"

import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Globe, ChevronRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
}

const initialSites: Site[] = [
  {
    id: '1',
    slug: 'example-com',
    url: 'example-com',
    monitoringCode: 'wm_example123',
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
        }
      ],
      consoleEntries: [
        {
          type: 'error',
          message: 'Failed to load resource',
          timestamp: '2025-02-19T10:30:10.000Z'
        }
      ],
      imageIssues: [
        {
          url: '/images/hero.jpg',
          originalSize: { width: 1920, height: 1080 },
          displaySize: { width: 480, height: 270 }
        }
      ]
    }
  }
];

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

export default function DashboardPage() {
  const [sites] = useState<Site[]>(initialSites);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Monitored Sites</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Site
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sites.map((site) => (
          <Link 
            key={site.id} 
            href={`/dashboard/${encodeURIComponent(site.slug)}`}
          >
            <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h2 className="font-medium">{site.url}</h2>
                        <p className="text-sm text-muted-foreground">Last update: {site.lastUpdate}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(site.status)}>
                      {site.status.charAt(0).toUpperCase() + site.status.slice(1)}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Load Time</p>
                      <p className="text-lg font-medium">{site.metrics.loadTime}s</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">JS Errors</p>
                      <p className="text-lg font-medium">{site.metrics.errors.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Console Entries</p>
                      <p className="text-lg font-medium">{site.metrics.consoleEntries.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Image Issues</p>
                      <p className="text-lg font-medium">{site.metrics.imageIssues.length}</p>
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
    </div>
  )
}