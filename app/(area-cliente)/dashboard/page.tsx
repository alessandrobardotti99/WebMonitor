"use client"

import { useState } from 'react'
import { motion } from "framer-motion"
import { useSession } from "next-auth/react";
import { 
  Card, 
  CardContent, 
  CardHeader,
  CardTitle,
  CardDescription 
} from "@/components/ui/card"
import { 
  Activity,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  MousePointerClick,
  Zap,
  AlertCircle,
  Settings,
  FileText,
  Image,
  Code2,
  ChevronRight,
  BarChart3
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts'
import { Sidebar } from '@/components/sidebar'

const visitData = [
  { time: '00:00', visits: 2400 },
  { time: '03:00', visits: 1398 },
  { time: '06:00', visits: 9800 },
  { time: '09:00', visits: 3908 },
  { time: '12:00', visits: 4800 },
  { time: '15:00', visits: 3800 },
  { time: '18:00', visits: 4300 },
  { time: '21:00', visits: 2400 },
];

const performanceData = [
  { time: '00:00', score: 98 },
  { time: '03:00', score: 96 },
  { time: '06:00', score: 95 },
  { time: '09:00', score: 98 },
  { time: '12:00', score: 99 },
  { time: '15:00', score: 97 },
  { time: '18:00', score: 96 },
  { time: '21:00', score: 98 },
];

const StatCard = ({ 
  title, 
  value, 
  change, 
  icon: Icon,
  trend = "up"
}: { 
  title: string;
  value: string;
  change: string;
  icon: React.ElementType;
  trend?: "up" | "down";
}) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between space-y-0">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold">{value}</p>
            <Badge 
              variant={trend === "up" ? "default" : "destructive"}
              className="font-medium"
            >
              {trend === "up" ? (
                <ArrowUpRight className="w-3 h-3 mr-1" />
              ) : (
                <ArrowDownRight className="w-3 h-3 mr-1" />
              )}
              {change}
            </Badge>
          </div>
        </div>
        <div className="p-2 bg-primary/5 rounded-full">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>
    </CardContent>
  </Card>
)

const AlertCard = ({ title, description, icon: Icon }: { 
  title: string;
  description: string;
  icon: React.ElementType;
}) => (
  <Card className="bg-primary/5 border-primary/10">
    <CardContent className="p-6">
      <div className="flex items-start gap-4">
        <div className="p-2 bg-primary/10 rounded-full">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-medium">{title}</h4>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </CardContent>
  </Card>
)

const QuickLinkCard = ({ 
  icon: Icon, 
  title, 
  description, 
  href 
}: { 
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
}) => (
  <Link href={href}>
    <Card className="hover:bg-muted/50 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-primary/5 rounded-lg">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 space-y-1">
            <h3 className="text-sm font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  </Link>
)

export default function DashboardPage() {
  const { data: session } = useSession();
  const [greeting] = useState(() => {
    const hour = new Date().getHours()
    if (hour < 12) return "Buongiorno"
    if (hour < 18) return "Buon pomeriggio"
    return "Buona sera"
  })

  const userName = session?.user?.name || "Utente";

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <motion.h1 
                className="text-2xl font-bold"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {greeting}, {userName} 👋
              </motion.h1>
              <motion.p 
                className="text-muted-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                Ecco un riepilogo delle performance del tuo sito
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Button>
                <Activity className="w-4 h-4 mr-2" />
                Scansione Rapida
              </Button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
             <h2 className="text-lg font-semibold mb-4">Link Rapidi 🔗</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <QuickLinkCard
                icon={BarChart3}
                title="Report Analytics"
                description="Visualizza report dettagliati e analisi approfondite"
                href="/dashboard/analytics"
              />
              <QuickLinkCard
                icon={Image}
                title="Ottimizzazione Media"
                description="Gestisci e ottimizza immagini e contenuti multimediali"
                href="/dashboard/media"
              />
              <QuickLinkCard
                icon={Code2}
                title="Performance Code"
                description="Analizza e ottimizza le performance del codice"
                href="/dashboard/code"
              />
              <QuickLinkCard
                icon={FileText}
                title="Documentazione"
                description="Consulta guide e documentazione tecnica"
                href="/docs"
              />
              <QuickLinkCard
                icon={Settings}
                title="Impostazioni"
                description="Configura le preferenze del tuo account"
                href="/dashboard/settings"
              />
              <QuickLinkCard
                icon={Activity}
                title="Monitor Real-time"
                description="Monitora le performance in tempo reale"
                href="/dashboard/monitor"
              />
            </div>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <StatCard
                title="Visitatori Oggi"
                value="2,851"
                change="+12.5%"
                icon={Users}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <StatCard
                title="Tempo di Caricamento"
                value="1.2s"
                change="-0.3s"
                icon={Clock}
                trend="up"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <StatCard
                title="Tasso di Conversione"
                value="3.2%"
                change="-0.4%"
                icon={MousePointerClick}
                trend="down"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <StatCard
                title="Performance Score"
                value="98"
                change="+2"
                icon={Zap}
              />
            </motion.div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Visitatori 👥</CardTitle>
                  <CardDescription>Andamento delle visite nelle ultime 24 ore</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={visitData}>
                        <defs>
                          <linearGradient id="visitGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="time" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--background))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="visits" 
                          stroke="hsl(var(--primary))"
                          fillOpacity={1}
                          fill="url(#visitGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Performance 📉</CardTitle>
                  <CardDescription>Score di performance nelle ultime 24 ore</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="time" className="text-xs" />
                        <YAxis domain={[90, 100]} className="text-xs" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--background))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="score" 
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                          dot={{ 
                            stroke: 'hsl(var(--primary))',
                            strokeWidth: 2,
                            r: 4,
                            fill: 'hsl(var(--background))'
                          }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <AlertCard
                icon={AlertCircle}
                title="Ottimizzazione Immagini"
                description="3 immagini potrebbero essere ottimizzate per migliorare il tempo di caricamento"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <AlertCard
                icon={Zap}
                title="Performance JavaScript"
                description="Il bundle JavaScript principale è aumentato di 45KB nell'ultima build"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <AlertCard
                icon={Clock}
                title="Tempo di Risposta Server"
                description="Il tempo medio di risposta del server è migliorato del 15% nell'ultima ora"
              />
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}