"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Activity, BarChart2, Terminal, Shield, ArrowRight, Code2, Gauge, Bot, Check, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Header from '@/components/header'
import { HeroSection } from "@/components/hero-section"
import Image from "next/image"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Footer from "@/components/footer"

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
}


const devFeatures = [
  {
    icon: "🚀",
    title: "Supporto Localhost",
    description: "Monitora le tue applicazioni in fase di sviluppo su qualsiasi porta localhost",
    content: {
      title: "Sviluppa con Fiducia ",
      description: "Monitora le tue applicazioni direttamente in ambiente di sviluppo con supporto completo per localhost e porte personalizzate.",
      features: [
        "Supporto per tutte le porte localhost standard",
        "Monitoraggio in tempo reale durante lo sviluppo",
        "Configurazione automatica dell'ambiente"
      ]
    }
  },
  {
    icon: "🔍",
    title: "Debug in Tempo Reale",
    description: "Individua e risolvi i problemi durante lo sviluppo, prima della produzione",
    content: {
      title: "Debug Senza Interruzioni",
      description: "Identifica e risolvi i problemi istantaneamente durante lo sviluppo, prima che raggiungano la produzione.",
      features: [
        "Tracciamento errori in tempo reale",
        "Stack trace dettagliati e contestuali",
        "Suggerimenti di ottimizzazione automatici"
      ]
    }
  },

  {
    icon: "✅",
    title: "Facilità di integrazione",
    description: "Con o senza esperienza nella programmazione in pochi minuti sarai in grado di monitorare",
    content: {
      title: "Integra il tracker in pochi minuti",
      description: "Inserisci lo snipper di codice all'interno del tuo sito e inizia subito a tracciare i risultati",
      features: [
        "Velocità",
        "Semplicità",
        "Chirezza"
      ]
    }
  }
]

export default function Home() {

  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeatureIndex((current) => (current + 1) % devFeatures.length);
    }, 8000); // Switch every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const activeFeature = devFeatures[activeFeatureIndex];

  return (
    <>
      <Header />
      <div className="relative pt-16">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-8"
          >
            <motion.div
              variants={fadeInUp}
              className="max-w-4xl mx-auto text-center space-y-4"
            >
              <div className="flex items-center justify-center gap-2 text-primary">
                <div className="flex items-center justify-center">
                  <div className="inline-flex items-center rounded-full border px-4 py-1 text-sm gap-2 bg-background/50 backdrop-blur-sm">
                    ✨
                    <span>Gratis per Sempre - Nessuna Carta di Credito Richiesta</span>
                  </div>
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Monitora le performance del tuo sito web in{' '}
                <span className="text-primary">tempo reale</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Ottieni informazioni istantanee sulle prestazioni, gli errori e le opportunità di ottimizzazione del tuo sito web.
                Inizia il monitoraggio in meno di 5 minuti.
              </p>
              <HeroSection
                image={{
                  light: "/images/hero.png",
                  dark: "/images/hero.png",
                  alt: "UI Components Preview",
                }}
              />

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button size="lg" className="gap-2">
                  Inizia Gratis <ArrowRight className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="gap-2">
                  Vedi Demo <Bot className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={fadeInUp}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8"
            >
              {[
                { label: "Siti Web Monitorati", value: "10,000+" },
                { label: "Problemi Rilevati", value: "1M+" },
                { label: "Analisi Performance", value: "5M+" },
                { label: "Sviluppatori Soddisfatti", value: "50,000+" }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-4 bg-background/50 rounded-lg backdrop-blur-sm"
                >
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Features */}
        <div></div>
        <div className="py-24 bg-primary rounded-tl-2xl rounded-tr-2xl max-w-[99%] m-auto relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="text-center mb-16"
            >
              <motion.h2 variants={fadeInUp} className="text-3xl font-bold text-secondary">
                Tutto ciò di cui hai Bisogno per Monitorare
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-muted-foreground mt-4 text-lg">
                Strumenti completi di monitoraggio per mantenere il tuo sito web al massimo delle prestazioni
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="grid md:grid-cols-3 gap-8"
            >
              {[
                {
                  icon: <Gauge className="h-6 w-6" />,
                  title: "Monitoraggio Prestazioni",
                  description: "Monitora i tempi di caricamento e le metriche web vitali in tempo reale"
                },
                {
                  icon: <Shield className="h-6 w-6" />,
                  title: "Rilevamento Errori",
                  description: "Individua e analizza gli errori JavaScript prima che influenzino gli utenti"
                },
                {
                  icon: <BarChart2 className="h-6 w-6" />,
                  title: "Ottimizzazione Risorse",
                  description: "Identifica opportunità per ottimizzare immagini e risorse"
                }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05 }}
                >
                  <Card className="relative overflow-hidden h-full">
                    <CardContent className="pt-6">
                      <div className="absolute top-0 right-0 p-3 text-primary">
                        {feature.icon}
                      </div>
                      <div className="space-y-2">
                       
                        <h3 className="font-semibold text-xl">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      <div className="relative z-20">
        {/* Development Support Section */}
        <div className="pb-24 bg-primary max-w-[99%] m-auto rounded-br-2xl rounded-bl-2xl">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Text Content */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={stagger}
                className="space-y-6"
              >
                <div className="inline-flex items-center rounded-full border px-4 py-1 text-sm gap-2 bg-secondary backdrop-blur-sm">
                  <Code2 className="h-4 w-4" />
                  <span>Perfetto per lo Sviluppo</span>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeFeatureIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <motion.h2 className="text-4xl font-bold text-secondary">
                      {activeFeature.content.title}
                    </motion.h2>

                    <motion.p className="text-lg text-muted-foreground">
                      {activeFeature.content.description}
                    </motion.p>

                    <motion.div className="space-y-4">
                      {activeFeature.content.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="mt-1">
                            <Check className="h-5 w-5 text-secondary" />
                          </div>
                          <p className="text-muted-foreground">{feature}</p>
                        </div>
                      ))}
                    </motion.div>
                  </motion.div>
                </AnimatePresence>

                <motion.div variants={fadeInUp}>
                  <Button size="lg" className="gap-2 bg-secondary text-primary">
                    Inizia a Sviluppare <ArrowRight className="h-4 w-4" />
                  </Button>
                </motion.div>
              </motion.div>

              {/* Right Column - Feature Cards */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={stagger}
                className="relative"
              >

                <div className="relative space-y-4">
                  {devFeatures.map((feature, i) => (
                    <motion.div
                      key={i}
                      variants={fadeInUp}
                      whileHover={{ scale: 1.02 }}
                      className={`transform transition-all ${i === activeFeatureIndex ? ' text-white bg-primary rounded-2xl' : 'bg-white rounded-2xl border'}`}
                      onClick={() => setActiveFeatureIndex(i)}
                    >
                      <Card className={`transform transition-all cursor-pointer ${i === activeFeatureIndex ? ' text-white bg-primary rounded-2xl' : 'bg-white rounded-2xl border-none'}`}>
                        <CardContent className={`transform transition-all rounded-2xl p-6 ${i === activeFeatureIndex ? ' rounded-2xl text-white bg-primary' : 'bg-white rounded-2xl'}`}>
                          <div className="flex gap-4">
                            <div className="p-3 rounded-lg flex items-center justify-center">
                              <span className="text-4xl">{feature.icon}</span>
                            </div>
                            <div className="space-y-1">
                              <h3 className="font-semibold text-xl">{feature.title}</h3>
                              <p className={`transform transition-all ${i === activeFeatureIndex ? ' text-white' : 'text-muted-foreground'}`}>{feature.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="text-center mb-16"
            >
              <motion.h2 variants={fadeInUp} className="text-3xl font-bold">
                Amato dagli sviluppatori ❤️
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-muted-foreground mt-4 text-lg">
                Scopri cosa dicono i nostri utenti di WebMonitor
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <Carousel className="w-full max-w-4xl mx-auto">
                <CarouselContent>
                  {[
                    {
                      quote: "WebMonitor ha completamente trasformato il modo in cui gestiamo il monitoraggio delle prestazioni del sito web. Le informazioni in tempo reale sono inestimabili.",
                      author: "Marco Rossi",
                      role: "Lead Developer presso TechCorp",
                      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&auto=format&fit=crop&q=60"
                    },
                    {
                      quote: "La configurazione di WebMonitor ha richiesto meno di 5 minuti e le informazioni che abbiamo ottenuto ci hanno aiutato a migliorare significativamente le prestazioni del nostro sito.",
                      author: "Laura Bianchi",
                      role: "Frontend Engineer presso StartupX",
                      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&auto=format&fit=crop&q=60"
                    },
                    {
                      quote: "Le funzionalità di tracciamento degli errori e monitoraggio delle prestazioni ci hanno aiutato a individuare e risolvere i problemi prima che influenzassero i nostri utenti.",
                      author: "Giuseppe Verdi",
                      role: "CTO presso DevStudio",
                      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&auto=format&fit=crop&q=60"
                    }
                  ].map((testimonial, index) => (
                    <CarouselItem key={index}>
                      <div className="p-6">
                        <div className="flex flex-col items-center text-center space-y-4">
                          <div className="relative w-20 h-20">
                            <Image
                              src={testimonial.image}
                              alt={testimonial.author}
                              className="rounded-full object-cover w-full h-full"
                              width={80}
                              height={80}
                            />
                            <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground p-1 rounded-full">
                              <Check className="w-4 h-4" />
                            </div>
                          </div>
                          <blockquote className="text-xl italic max-w-2xl">
                            &quot;{testimonial.quote}&quot;
                          </blockquote>
                          <div>
                            <div className="font-semibold">{testimonial.author}</div>
                            <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </motion.div>
          </div>
        </div>

        {/* Free Features */}
        <div className="py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center rounded-full border px-4 py-1 text-sm gap-2 bg-background/50 backdrop-blur-sm mb-8">
                ✨
                <span>Tutto Gratis, Per Sempre</span>
              </div>
              <motion.h2 variants={fadeInUp} className="text-3xl font-bold">
                Tutte le Funzionalità Incluse
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-muted-foreground mt-4 text-lg">
                Nessun piano premium, nessuna restrizione. Ogni funzionalità è disponibile per tutti.
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="max-w-2xl mx-auto"
            >
              <Card className="relative overflow-hidden">
                <CardContent className="pt-6 space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold">Piano Gratuito 🎉</h3>
                    <div className="mt-2">
                      <span className="text-4xl font-bold">€0</span>
                      <span className="text-muted-foreground">/per sempre</span>
                    </div>
                    <p className="text-muted-foreground mt-2">Tutto ciò di cui hai bisogno per monitorare i tuoi siti web</p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      "Siti web illimitati",
                      "Monitoraggio in tempo reale",
                      "Tracciamento errori",
                      "Analisi prestazioni",
                      "Ottimizzazione immagini",
                      "Monitoraggio console",
                      "Notifiche email",
                      "Accesso API",
                      "Alert personalizzati",
                      "Collaborazione team",
                      "Esportazione dati",
                      "Monitoraggio 24/7"
                    ].map((feature, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full" size="lg">
                    Inizia Ora
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    Nessuna carta di credito richiesta. Nessun costo nascosto.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* FAQ */}
        <div className="py-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="text-center mb-16"
            >
              <motion.h2 variants={fadeInUp} className="text-3xl font-bold">
                Domande Frequenti
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-muted-foreground mt-4 text-lg">
                Tutto quello che devi sapere su WebMonitor
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <Accordion type="single" collapsible className="w-full">
                {[
                  {
                    question: "WebMonitor è davvero gratuito?",
                    answer: "Sì! WebMonitor è completamente gratuito per sempre. Crediamo nel rendere il monitoraggio dei siti web accessibile a tutti. Non ci sono costi nascosti, non è richiesta carta di credito e non ci sono funzionalità premium a pagamento."
                  },
                  {
                    question: "Come funziona WebMonitor?",
                    answer: "WebMonitor utilizza un leggero snippet JavaScript per monitorare le prestazioni del tuo sito web, gli errori e l'esperienza utente in tempo reale. I dati vengono poi elaborati e visualizzati in una dashboard facile da comprendere."
                  },
                  {
                    question: "WebMonitor rallenterà il mio sito web?",
                    answer: "No, il nostro script di monitoraggio è estremamente leggero (< 5KB) e si carica in modo asincrono, quindi non influirà sulle prestazioni del tuo sito web."
                  },
                  {
                    question: "Che tipo di errori può rilevare WebMonitor?",
                    answer: "WebMonitor può rilevare errori JavaScript, problemi di rete, problemi di caricamento delle risorse e colli di bottiglia nelle prestazioni. Monitora anche gli output della console e fornisce tracce dettagliate degli errori."
                  },
                  {
                    question: "Ci sono limiti di utilizzo?",
                    answer: "No! Puoi monitorare siti web illimitati e ottenere dati illimitati. Crediamo nel fornire valore senza restrizioni."
                  }
                ].map((faq, i) => (
                  <AccordionItem key={i} value={`item-${i}`}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </div>
        </div>

        {/* CTA */}
        <div className="py-24 bg-primary text-primary-foreground rounded-2xl relative z-30 mb-28 max-w-[99%] m-auto">
          <motion.div
            className="absolute -z-10 inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_50%,transparent_75%,transparent_100%)] bg-[length:500px_500px]"
            animate={{
              backgroundPosition: ["0px 0px", "500px 500px"],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center rounded-full border border-primary-foreground/10 px-4 py-1 text-sm gap-2 mb-8">
              ✨
              <span>Gratis Per Sempre</span>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-3xl font-bold mb-6">
              Inizia a Monitorare Oggi
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg mb-8 text-primary-foreground/80">
              Unisciti a migliaia di sviluppatori che si fidano di WebMonitor per il monitoraggio dei loro siti web.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Button size="lg" variant="secondary" className="gap-2">
                Inizia Gratuitamente <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>
        </div>

        <Footer />
      </div>
    </>
  )
}