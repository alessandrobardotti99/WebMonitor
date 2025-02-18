"use client"

import { motion } from "framer-motion"
import { 
  Activity, 
  LayoutDashboard, 
  Settings, 
  Bell, 
  HelpCircle,
  LogOut,
  Menu
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils"

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Bell, label: "Notifiche", href: "/dashboard/notifications" },
  { icon: Settings, label: "Impostazioni", href: "/dashboard/impostazioni" },
  { icon: HelpCircle, label: "Supporto", href: "/dashboard/support" },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <motion.div 
      className={cn(
        "h-screen fixed left-0 top-0 z-40 bg-background border-r flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
      animate={{ width: collapsed ? 64 : 256 }}
      transition={{ duration: 0.2 }}
    >
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" />
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-semibold text-lg"
            >
              WebMonitor
            </motion.span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
              item.href === "/dashboard" && "bg-muted text-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {item.label}
              </motion.span>
            )}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t">
        <button
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          )} onClick={() => signOut()}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Disconnetti
            </motion.span>
          )}
        </button>
      </div>
    </motion.div>
  )
}