"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Activity, ArrowRight, Github, Loader2, Code2, Terminal, Blocks, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"

const GridAnimation = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Animated grid cells */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-primary/5 backdrop-blur-sm"
          initial={{
            opacity: 0,
            scale: 0,
            x: Math.random() * 100 - 50 + "%",
            y: Math.random() * 100 - 50 + "%"
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 4,
            delay: i * 0.2,
            repeat: Infinity,
            repeatDelay: Math.random() * 2
          }}
          style={{
            width: Math.random() * 100 + 50,
            height: Math.random() * 100 + 50,
            borderRadius: '8px'
          }}
        />
      ))}
    </div>
  )
}

const FeatureList = () => {
  const features = [
    { icon: Code2, text: "JavaScript error detection" },
    { icon: Terminal, text: "Performance monitoring" },
    { icon: Blocks, text: "Asset optimization" }
  ]

  return (
    <div className="space-y-6">
      {features.map((feature, index) => (
        <motion.div
          key={index}
          className="flex items-center gap-4 text-white/80"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 + index * 0.2 }}
        >
          <div className="p-2 rounded-lg bg-primary/10">
            <feature.icon className="w-5 h-5" />
          </div>
          <span className="text-sm">{feature.text}</span>
        </motion.div>
      ))}
    </div>
  )
}

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
    const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const res = await fetch("/api/auth/register", {  // Assicurati che l'endpoint sia corretto
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      // Controlla se la risposta è effettivamente JSON
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("La risposta non è JSON. Controlla l'API.");
      }
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.error || "Errore durante la registrazione");
      }
  
      router.push("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen flex relative">
      <Link href={'/'}>
        <Button className="absolute top-8 left-4 bg-seconddary z-50">
          <ArrowLeft />
        </Button>
      </Link>
      {/* Left Side - Animated Background */}
      <div className="hidden lg:flex w-1/2 relative bg-black items-center justify-center overflow-hidden">
        <GridAnimation />

        <div className="relative z-10 text-center space-y-8 max-w-md p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <div className="m-auto flex items-center justify-center">
               <Image src={'/images/logo.png'} alt='Web Monitor' width={100} height={100}></Image>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white">
              Join WebMonitor
            </h1>
            <p className="text-lg text-gray-400">
              Start monitoring your web applications today
            </p>
          </motion.div>

          <FeatureList />
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center space-y-6 lg:hidden">
            <motion.div
              className="flex items-center justify-center gap-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Activity className="h-10 w-10 text-primary" />
              <h2 className="text-3xl font-bold text-primary">
                WebMonitor
              </h2>
            </motion.div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight text-center">
              Create an account
            </h2>
            <p className="text-sm text-muted-foreground text-center">
              Enter your information to create your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="h-11"
                />
                <p className="text-xs text-muted-foreground">
                  Must be at least 8 characters long
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                className="w-full h-11"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </motion.div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                variant="outline"
                className="w-full h-11"
                type="button"
              >
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>
            </motion.div>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="font-medium text-primary hover:text-primary/90 hover:underline"
              >
                Sign in
              </Link>
            </p>

            <p className="text-center text-xs text-muted-foreground">
              By clicking continue, you agree to our{" "}
              <Link href="#" className="hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="hover:underline">
                Privacy Policy
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}