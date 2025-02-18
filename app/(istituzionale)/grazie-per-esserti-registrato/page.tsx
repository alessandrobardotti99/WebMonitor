"use client"

import { motion } from "framer-motion"
import { Activity, CheckCircle2, Rocket, Zap, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const ParticlesAnimation = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-primary/20 rounded-full"
          initial={{
            opacity: 0,
            scale: 0,
            x: "50%",
            y: "50%"
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`
          }}
          transition={{
            duration: 3,
            delay: i * 0.1,
            repeat: Infinity,
            repeatDelay: Math.random() * 2
          }}
        />
      ))}
    </div>
  )
}

const NextStepsList = () => {
  const steps = [
    { 
      icon: Rocket, 
      title: "Configura il tuo Primo Progetto",
      description: "Inizia a monitorare la tua applicazione web"
    }
  ]

  return (
    <div className="space-y-6">
      {steps.map((step, index) => (
        <motion.div
          key={index}
          className="flex items-start gap-4 text-white/80"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 + index * 0.2 }}
        >
          <div className="p-2 rounded-lg bg-primary/10 mt-1">
            <step.icon className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-medium text-white">{step.title}</h3>
            <p className="text-sm text-white/60">{step.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default function ThankYouPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Animated Background */}
      <div className="hidden lg:flex w-1/2 relative bg-black items-center justify-center overflow-hidden">
        <ParticlesAnimation />
        
        <div className="relative z-10 text-center space-y-8 max-w-md p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <h1 className="text-4xl font-bold tracking-tight text-white">
              Benvenuto in WebMonitor
            </h1>
            <p className="text-lg text-gray-400">
              Iniziamo il tuo percorso di monitoraggio
            </p>
          </motion.div>
          
          <NextStepsList />
        </div>
      </div>

      {/* Right Side - Thank You Message */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 200,
                damping: 20,
                delay: 0.2
              }}
              className="flex justify-center"
            >
              <div className="rounded-full bg-primary/10 p-3">
                <CheckCircle2 className="w-12 h-12 text-primary" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-2"
            >
              <h2 className="text-2xl font-semibold tracking-tight">
                Registrazione Completata!
              </h2>
              <p className="text-muted-foreground">
                Grazie per esserti unito a WebMonitor. Siamo entusiasti di aiutarti a monitorare e ottimizzare le tue applicazioni web.
              </p>
            </motion.div>
          </div>

          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button asChild className="w-full h-11">
              <Link href="/dashboard">
                Vai alla Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button variant="outline" asChild className="w-full h-11">
              <Link href="/docs">
                Visualizza Documentazione
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center"
          >
            <p className="text-sm text-muted-foreground">
              Hai bisogno di aiuto? <Link href="/support" className="text-primary hover:underline">Contatta il nostro team di supporto</Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}