"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { signIn } from "next-auth/react";
import { Activity, ArrowRight, Github, Loader2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

const ScanningAnimation = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Scanning line */}
      <motion.div
        className="absolute left-0 w-full h-0.5 bg-white/20"
        initial={{ top: "0%" }}
        animate={{ top: "100%" }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Grid background */}
      <div className="absolute inset-0" style={{
        backgroundImage: `
          linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px'
      }} />
    </div>
  )
}

const CodeBlock = () => {
  return (
    <motion.div
      className="relative z-10 bg-black/50 backdrop-blur-sm rounded-lg p-4 font-mono text-sm text-primary/70 overflow-hidden border border-white/5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
    >
      <div className="space-y-2 text-secondary">
        <div>Scanning website...</div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          {'>'} Checking JavaScript errors
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
        >
          {'>'} Analyzing image optimization
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.4 }}
        >
          {'>'} Validating performance metrics
        </motion.div>
      </div>
    </motion.div>
  )
}

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    console.log("🟡 Tentativo di login...");

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    console.log("🟢 Risultato:", result);

    if (result?.error) {
      setError(result.error);
    } else {
      router.push("/dashboard");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex relative">
      <Link href={'/'}>
      <Button className="absolute top-8 left-4 bg-seconddary z-50">
        <ArrowLeft />
      </Button>
      </Link>
      {/* Left Side - Animated Background */}
      <div className="hidden lg:flex w-1/2 relative bg-black items-center justify-center overflow-hidden">
        <ScanningAnimation />

        <div className="relative z-10 text-center space-y-6 max-w-md p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            <h1 className="text-4xl font-bold tracking-tight text-white">
              WebMonitor
            </h1>
            <p className="text-lg text-gray-400">
              Automated scanning and monitoring for web applications
            </p>
          </motion.div>

          <CodeBlock />
        </div>
      </div>

      {/* Right Side - Login Form */}
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
              Sign in to your account
            </h2>
            <p className="text-sm text-muted-foreground text-center">
              Enter your credentials to access the dashboard
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
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Button variant="link" className="px-0 font-normal">
                    Forgot password?
                  </Button>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11"
                />
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
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
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

          <p className="text-center text-sm text-muted-foreground">
            Non hai un account?{" "}
            <Link
              href="/auth/register"
              className="font-medium text-primary hover:text-primary/90 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}