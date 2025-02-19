"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { 
  Activity, 
  LineChart, 
  Zap, 
  Users, 
  ArrowRight,
  BarChart3,
  PieChart,
  MousePointerClick,
  Gauge,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Brain,
  Lightbulb,
  Target,
  Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRef } from "react"

const ScrollProgress = () => {
  const targetRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end end"]
  })

  return (
    <motion.div
      ref={targetRef}
      className="fixed left-0 top-0 right-0 h-1 bg-primary/20 z-50"
    >
      <motion.div
        className="h-full bg-primary"
        style={{ scaleX: scrollYProgress, transformOrigin: "0%" }}
      />
    </motion.div>
  )
}


const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description,
  delay = 0
}: { 
  icon: React.ElementType;
  title: string;
  description: string;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ scale: 1.02 }}
    className="p-6 bg-card rounded-lg border shadow-sm hover:shadow-md transition-all"
  >
    <div className="space-y-4">
      <div className="p-3 bg-primary/10 w-fit rounded-lg">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  </motion.div>
)

const ComparisonVisual = () => {
  const traditionalScreen = (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="relative p-6 bg-gradient-to-br from-card to-card/95 border rounded-xl shadow-lg backdrop-blur-sm"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-destructive/10">
              <BarChart3 className="w-5 h-5 text-destructive" />
            </div>
            <span className="font-medium">Analytics Tradizionale</span>
          </div>
          ❌
        </div>
        
        <div className="space-y-4">
          <motion.div 
            className="flex items-center justify-between p-3 bg-destructive/5 rounded-lg border border-destructive/10"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-destructive" />
              <span className="text-sm font-medium">Setup Complesso</span>
            </div>
            <span className="text-xs bg-destructive/10 px-2 py-1 rounded-full text-destructive font-medium">4-5 ore</span>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            <motion.div 
              className="p-4 bg-muted rounded-lg border"
              whileHover={{ scale: 1.02 }}
            >
              <div className="space-y-2">
                <div className="h-2 bg-muted-foreground/20 rounded-full w-3/4" />
                <div className="h-8 bg-muted-foreground/10 rounded-lg animate-pulse" />
                <div className="h-2 bg-muted-foreground/20 rounded-full w-1/2" />
              </div>
            </motion.div>
            <motion.div 
              className="p-4 bg-muted rounded-lg border"
              whileHover={{ scale: 1.02 }}
            >
              <div className="space-y-2">
                <div className="h-2 bg-muted-foreground/20 rounded-full w-1/2" />
                <div className="h-8 bg-muted-foreground/10 rounded-lg animate-pulse delay-150" />
                <div className="h-2 bg-muted-foreground/20 rounded-full w-3/4" />
              </div>
            </motion.div>
          </div>

          <motion.div 
            className="flex items-center justify-between p-3 bg-destructive/5 rounded-lg border border-destructive/10"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-destructive" />
              <span className="text-sm font-medium">Curva di Apprendimento</span>
            </div>
            <span className="text-xs bg-destructive/10 px-2 py-1 rounded-full text-destructive font-medium">Elevata</span>
          </motion.div>
        </div>

        <div className="bg-destructive/10 text-destructive p-2 rounded-lg text-sm font-medium border border-destructive/20">
          Complesso
        </div>
      </div>
    </motion.div>
  )

  const webmonitorScreen = (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2 }}
      className="relative p-6 bg-gradient-to-br from-card to-card/95 border rounded-xl shadow-lg backdrop-blur-sm"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <span className="font-medium">WebMonitor</span>
          </div>
          <div className="flex items-center gap-1">
            ✨
            ✅
          </div>
        </div>
        
        <div className="space-y-4">
          <motion.div 
            className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/10"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Setup Immediato</span>
            </div>
            <span className="text-xs bg-green-300 px-2 py-1 rounded-full text-green-600 font-medium">5 minuti</span>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            <motion.div 
              className="p-4 bg-primary/5 rounded-lg border border-primary/10"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Performance</span>
              </div>
              <div className="relative h-2 bg-primary/20 rounded-full overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-primary"
                  initial={{ width: "0%" }}
                  whileInView={{ width: "92%" }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
              <div className="mt-2 text-xs text-right text-primary font-medium">92%</div>
            </motion.div>

            <motion.div 
              className="p-4 bg-primary/5 rounded-lg border border-primary/10"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Gauge className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Velocità</span>
              </div>
              <div className="relative h-2 bg-primary/20 rounded-full overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-primary"
                  initial={{ width: "0%" }}
                  whileInView={{ width: "95%" }}
                  transition={{ duration: 1, delay: 0.7 }}
                />
              </div>
              <div className="mt-2 text-xs text-right text-primary font-medium">95%</div>
            </motion.div>
          </div>

          <motion.div 
            className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/10"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Curva di Apprendimento</span>
            </div>
            <span className="text-xs bg-green-300 px-2 py-1 rounded-full text-green-600 font-medium">Minima</span>
          </motion.div>
        </div>

        <div className="bg-green-100 text-green-600 p-2 rounded-lg text-sm font-medium border border-primary/20">
          Intuitivo
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-center text-primary">
          Strumenti Tradizionali
        </h3>
        {traditionalScreen}
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-center text-primary">
          WebMonitor
        </h3>
        {webmonitorScreen}
      </div>
    </div>
  )
}

export default function AboutPage() {
  const features = [
    {
      icon: LineChart,
      title: "Analisi Semplificata",
      description: "Trasformiamo dati complessi in informazioni chiare e actionable, permettendoti di prendere decisioni informate senza sforzo."
    },
    {
      icon: Zap,
      title: "Monitoraggio Intelligente",
      description: "Monitoriamo automaticamente le prestazioni del tuo sito, avvisandoti in tempo reale di qualsiasi problema rilevato."
    },
    {
      icon: Users,
      title: "Pensato per Tutti",
      description: "Un'interfaccia intuitiva che si adatta alle tue esigenze, che tu sia un principiante o un esperto di analisi web."
    }
  ]

  return (
    <>
    <Header />
    <div className="min-h-screen bg-background">
      <ScrollProgress />
      
      {/* Hero Section */}
      <section className="relative pt-40 pb-40 flex items-center justify-center overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-3 mb-8"
            >
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold tracking-tight sm:text-5xl"
            >
              Rendiamo il monitoraggio web 
              <span className="text-primary block pt-4"> accessibile a tutti ✅</span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-muted-foreground"
            >
              Sappiamo che strumenti come Google Analytics possono essere complessi.
              Per questo abbiamo creato una piattaforma che rende il monitoraggio web
              semplice e accessibile a tutti.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button 
                size="lg" 
                asChild
                className="relative overflow-hidden group"
              >
                <Link href="/auth/register">
                  <motion.div
                    className="absolute inset-0 bg-primary/20"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.5 }}
                  />
                  <span className="relative z-10">
                    Inizia Ora
                    <ArrowRight className="ml-2 h-4 w-4 inline-block group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="group"
              >
                Scopri di Più
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </div>
        </div>

        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            y: { duration: 1, repeat: Infinity, repeatType: "reverse" },
            opacity: { duration: 0.2 }
          }}
        >
          <ArrowRight className="w-6 h-6 rotate-90 text-muted-foreground" />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl font-bold mb-4"
              >
                Perché Scegliere WebMonitor?
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-lg text-muted-foreground"
              >
                Abbiamo ripensato il monitoraggio web da zero, concentrandoci sulla semplicità
                senza sacrificare le funzionalità
              </motion.p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <FeatureCard key={index} {...feature} delay={index * 0.2} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Visual Comparison Section */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl font-bold mb-4"
              >
               <h2 className="text-3xl font-bold mb-4 sm:text-5xl"> Le differenze di WebMonitor</h2>
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-lg text-muted-foreground"
              >
                Un confronto visivo tra gli strumenti di analisi tradizionali e WebMonitor
              </motion.p>
            </div>

            <ComparisonVisual />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 bg-primary text-primary-foreground overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_50%,transparent_75%,transparent_100%)] bg-[length:500px_500px]"
          animate={{
            backgroundPosition: ["0px 0px", "500px 500px"],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold"
            >
              Pronto a Semplificare il Tuo Monitoraggio Web?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg opacity-90"
            >
              Unisciti a migliaia di utenti che hanno già scelto WebMonitor per
              rendere il monitoraggio web più semplice ed efficace.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <Button 
                size="lg" 
                variant="secondary"
                asChild
                className="group hover:bg-secondary/90"
              >
                <Link href="/auth/register">
                  Inizia Gratuitamente
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
    <Footer />
    </>
  )
}