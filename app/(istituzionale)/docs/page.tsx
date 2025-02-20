"use client"

import { motion } from "framer-motion"
import { Code, AlertTriangle, Terminal, Zap, CodeXml, Code2 } from "lucide-react"
import Footer from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Header from "@/components/header"
import { useState } from "react"
import { Site } from "@/lib/api-types"
import Image from "next/image"

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


export default function DocsPage() {
  const [copiedScript, setCopiedScript] = useState(false)
  const [integrationMethod, setIntegrationMethod] = useState<'script' | 'cdn' | 'react' | 'vue' | 'next' | 'laravel'>('cdn')
  const [copiedCdn, setCopiedCdn] = useState(false)
  const [site, setSite] = useState<Site>({
    id: "1",
    slug: "example-slug",
    url: "https://example.com",
    status: "healthy",
    monitoringCode: "9387392782729383",
    lastUpdate: null,
    metrics: {
      loadTime: 0,
      errors: [],
      consoleEntries: [],
      imageIssues: [],
      resources: []
    },
    performanceData: []
  });
  

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
    })(window,document,'script','9387392782729383');
  </script>`
  
    const getCdnCode = (site: Site) => `
  <!-- Aggiungi questo codice nel tag <head> -->
  <script 
    src="https://web-monitor-eta.vercel.app/tracker.min.js" 
    data-site-id="9387392782729383"
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
      script.dataset.siteId = '9387392782729383';
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
      script.dataset.siteId = '9387392782729383';
      document.body.appendChild(script);
    },
    beforeDestroy() {
      const script = document.querySelector(\`script[data-site-id="9387392782729383"]\`);
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
            data-site-id="9387392782729383"
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
          data-site-id="{{ '9387392782729383' }}"
          async
      ></script>
  </body>
  </html>
  
  {{-- Or in your app.blade.php --}}
  @push('scripts')
      <script
          src="https://web-monitor-eta.vercel.app/tracker.min.js"
          data-site-id="{{ '9387392782729383' }}"
          async
      ></script>
  @endpush`

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
          <Card>
        <CardHeader>
          <CardTitle>Metodi di installazione 🔧</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="border-b mb-6">
            <div className="flex gap-2">
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
                  <Image src={'/icon-language/icons8-javascript.svg'} alt="Laravel" height={20} width={20}></Image>
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
                  <Image src={'/icon-language/icons8-reagire.svg'} alt="Laravel" height={20} width={20}></Image>
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
                  <Image src={'/icon-language/icons8-vista-js.svg'} alt="Laravel" height={20} width={20}></Image>
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
                  <Image src={'/icon-language/icons8-nextjs.svg'} alt="Laravel" height={20} width={20}></Image>
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
                    <Image src={'/icon-language/laravel-svgrepo-com.svg'} alt="Laravel" height={20} width={20}></Image>
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
      <Alert className="bg-white text-primary">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="text-primary">Importante: ambito di monitoraggio</AlertTitle>
          <AlertDescription className="text-primary mt-2">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Pagine singole:</strong> Se inserisci lo script in una pagina specifica, il monitoraggio sarà limitato solo a quella pagina.
              </li>
              <li>
                <strong>Framework (React, Vue, Next.js, Laravel):</strong> Inserendo lo script nel layout principale dell&apos;applicazione, il monitoraggio sarà attivo su tutte le pagine automaticamente.
              </li>
            </ul>
          </AlertDescription>
        </Alert>
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