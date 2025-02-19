"use client"

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useSession } from "next-auth/react"
import { 
  Activity, 
  Menu, 
  Moon, 
  Sun, 
  X, 
  Bell, 
  Settings, 
  User,
  Search,
  Plus
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { setTheme, theme } = useTheme()
  const pathname = usePathname()
  const { data: session } = useSession()
  const isDashboard = pathname?.startsWith('/dashboard')
  const isAuthPage = pathname?.startsWith('/auth')

  if (isAuthPage) {
    return null
  }

  return (
    <header className="fixed top-4 left-0 right-0 border bg-background/80 backdrop-blur-sm z-50 max-w-[1200px] rounded-full m-auto">
      <div className="container mx-auto px-8 py-2">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <Image src={'/images/logo.png'} alt='Web Monitor' width={50} height={50}></Image>
              <span className="text-xl font-bold">WebMonitor</span>
            </Link>
          </div>

          <div>
            {isDashboard ? (
              <div className="hidden md:flex max-w-xl flex-1">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search monitored sites..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10"
                  />
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-6">
                <Link href="/docs" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Documentation</Link>
                <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</Link>
                <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
                <Link href="#blog" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Blog</Link>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {isDashboard ? (
              <div className="hidden md:flex items-center space-x-4">
                <Button variant="outline" size="icon">
                  <Bell className="h-4 w-4" />
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Site
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>{session?.user?.name || "My Account"}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Bell className="mr-2 h-4 w-4" />
                      <span>Notifications</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Link href="/auth/login">Log out</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                {session ? (
                  <Link href="/dashboard">
                    <Button>Dashboard</Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/auth/login">
                      <Button variant="secondary">Accedi</Button>
                    </Link>
                    <Link href="/auth/register">
                      <Button>registrati</Button>
                    </Link>
                  </>
                )}
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </nav>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden pt-4"
            >
              {isDashboard ? (
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search monitored sites..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10"
                    />
                  </div>
                  <div className="flex flex-col space-y-4">
                    <Button className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Site
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col space-y-4">
                  <Link href="/docs" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Documentation</Link>
                  <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</Link>
                  <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
                  <Link href="#blog" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Blog</Link>

                  <div className="pt-4 flex flex-col space-y-2">
                    {session ? (
                      <Link href="/dashboard">
                        <Button className="w-full">Dashboard</Button>
                      </Link>
                    ) : (
                      <>
                        <Link href="/auth/login">
                          <Button variant="outline" className="w-full">Sign In</Button>
                        </Link>
                        <Link href="/auth/register">
                          <Button className="w-full">Get Started</Button>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
