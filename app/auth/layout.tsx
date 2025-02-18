"use client"

import { motion } from "framer-motion"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen">
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
      {children}
    </div>
  )
}