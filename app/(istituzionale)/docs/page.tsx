"use client"

import { motion } from "framer-motion"
import { Activity, Code, Copy, Check, Terminal, Zap, ArrowRight, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import Footer from "@/components/footer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from "@/components/header"
import { useState } from "react"

export default function DocsPage() {
  const [copiedScript, setCopiedScript] = useState(false)
  const [copiedCdn, setCopiedCdn] = useState(false)

  const scriptCode = `<!-- Aggiungi questo codice prima del tag di chiusura </body> -->
<script>
  (function(w,d,s,c) {
    var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s);
    j.async=true;
    j.src='https://web-monitor-eta.vercel.app/tracker.js';
    j.dataset.siteId=c;
    f.parentNode.insertBefore(j,f);
  })(window,document,'script','YOUR_SITE_ID');
</script>`

  const cdnCode = `<!-- Aggiungi questo codice nel tag <head> -->
<script 
  src="https://cdn.webmonitor.control/tracker.min.js" 
  data-site-id="YOUR_SITE_ID"
  async
></script>`

  const copyToClipboard = (text: string, type: 'script' | 'cdn') => {
    navigator.clipboard.writeText(text)
    if (type === 'script') {
      setCopiedScript(true)
      setTimeout(() => setCopiedScript(false), 2000)
    } else {
      setCopiedCdn(true)
      setTimeout(() => setCopiedCdn(false), 2000)
    }
  }

  return (
    <>
    <Header />
    <div className="max-w-[1400px] mx-auto px-4 py-28">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-16"
      >
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Documentazione 📂</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Inizia con WebMonitor in pochi minuti. Monitora le prestazioni del tuo sito web
            con poche righe di codice.
          </p>
        </div>

        {/* Quick Start */}
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold">Guida Rapida</h2>
          
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: <Code className="h-6 w-6" />,
                title: "1. Aggiungi lo Script",
                description: "Copia e incolla il nostro codice di tracciamento nel tuo sito web."
              },
              {
                icon: <Terminal className="h-6 w-6" />,
                title: "2. Inizializza",
                description: "Lo script inizierà automaticamente a monitorare il tuo sito."
              },
              {
                icon: <Zap className="h-6 w-6" />,
                title: "3. Monitora",
                description: "Visualizza le analitiche in tempo reale nella tua dashboard."
              }
            ].map((step, i) => (
              <div key={i} className="p-6 rounded-lg border bg-card">
                <div className="text-primary mb-4">{step.icon}</div>
                <h3 className="font-medium mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>

          {/* Installation Methods */}
          <div className="mt-12 space-y-4">
            <h3 className="text-xl font-medium">Metodi di Installazione</h3>
            <Tabs defaultValue="script" className="w-full">
              <TabsList className="grid w-full max-w-[400px] grid-cols-2">
                <TabsTrigger value="script">Tag Script</TabsTrigger>
                <TabsTrigger value="cdn">CDN</TabsTrigger>
              </TabsList>
              <TabsContent value="script" className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Aggiungi questo codice prima del tag di chiusura <code className="text-primary">&lt;/body&gt;</code> del tuo sito web.
                </div>
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                    <code className="text-sm">{scriptCode}</code>
                  </pre>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(scriptCode, 'script')}
                  >
                    {copiedScript ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="cdn" className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Aggiungi questo codice nella sezione <code className="text-primary">&lt;head&gt;</code> del tuo sito web.
                  Questo metodo utilizza la nostra CDN per un caricamento più veloce.
                </div>
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                    <code className="text-sm">{cdnCode}</code>
                  </pre>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(cdnCode, 'cdn')}
                  >
                    {copiedCdn ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Features Documentation */}
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold">Funzionalità</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                title: "Monitoraggio Prestazioni",
                description: "Traccia i tempi di caricamento, l'utilizzo delle risorse e le metriche web vitali in tempo reale.",
                code: "// Le metriche di prestazione sono raccolte automaticamente\nconst loadTime = performance.now();"
              },
              {
                title: "Tracciamento Errori",
                description: "Cattura e analizza gli errori JavaScript con tracce dettagliate.",
                code: "// Gli errori sono catturati automaticamente\nwindow.onerror = function(msg, url, line) {\n  // Dettagli errore inviati alla dashboard\n};"
              },
              {
                title: "Monitoraggio Console",
                description: "Monitora gli output della console per individuare avvisi e debug.",
                code: "// I log della console sono tracciati\nconsole.log('Messaggio debug');\nconsole.error('Messaggio errore');"
              },
              {
                title: "Ottimizzazione Risorse",
                description: "Identifica opportunità per ottimizzare immagini e risorse.",
                code: "// Suggerimenti ottimizzazione immagini\nconst image = new Image();\nimage.onload = checkDimensions;"
              }
            ].map((feature, i) => (
              <div key={i} className="p-6 rounded-lg border bg-card space-y-4">
                <h3 className="font-medium">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
                <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
                  <code>{feature.code}</code>
                </pre>
              </div>
            ))}
          </div>
        </div>

      </motion.div>
    </div>
    <Footer />
    </>
  )
}