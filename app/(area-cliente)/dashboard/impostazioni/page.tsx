"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react";
import { 
  User, 
  Lock, 
  Trash2, 
  AlertTriangle,
  Save,
  Shield,
  Eye,
  EyeOff,
  Check,
  X
} from "lucide-react"
import { Sidebar } from '@/components/sidebar'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface TabProps {
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

interface PasswordRequirement {
  text: string;
  met: boolean;
}

const Tab = ({ icon: Icon, label, isActive, onClick }: TabProps) => (
  <button
    onClick={onClick}
    className={`relative flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors
      ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
  >
    <Icon className="w-4 h-4" />
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

const PasswordInput = ({ 
  id, 
  label, 
  value, 
  onChange, 
  showRequirements = false 
}: { 
  id: string; 
  label: string; 
  value: string; 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; 
  showRequirements?: boolean;
}) => {
  const [showPassword, setShowPassword] = useState(false)

  const requirements: PasswordRequirement[] = [
    { text: "Almeno 8 caratteri", met: value.length >= 8 },
    { text: "Almeno una lettera maiuscola", met: /[A-Z]/.test(value) },
    { text: "Almeno una lettera minuscola", met: /[a-z]/.test(value) },
    { text: "Almeno un numero", met: /\d/.test(value) },
    { text: "Almeno un carattere speciale", met: /[!@#$%^&*(),.?":{}|<>]/.test(value) }
  ]

  const strengthPercentage = (requirements.filter(req => req.met).length / requirements.length) * 100

  const getStrengthColor = () => {
    if (strengthPercentage <= 20) return "bg-red-500"
    if (strengthPercentage <= 40) return "bg-orange-500"
    if (strengthPercentage <= 60) return "bg-yellow-500"
    if (strengthPercentage <= 80) return "bg-blue-500"
    return "bg-green-500"
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          className="h-11 pr-10"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {showRequirements && value && (
        <div className="space-y-2 mt-2">
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <motion.div
              className={`h-full ${getStrengthColor()}`}
              initial={{ width: 0 }}
              animate={{ width: `${strengthPercentage}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="space-y-2">
            {requirements.map((requirement, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                {requirement.met ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <X className="w-4 h-4 text-red-500" />
                )}
                <span className={requirement.met ? "text-green-500" : "text-red-500"}>
                  {requirement.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter();
  const { data: session, status } = useSession()
  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        name: session.user.name || "",
        email: session.user.email || "",
      }));
    }
  }, [session]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
    setIsMounted(true);
  }, [status, router]);

  if (!isMounted || status === "loading") {
    return <p className="text-center">Caricamento...</p>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const res = await fetch("/api/modifica-profilo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
        }),
      });
  
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Errore nell'aggiornamento del profilo");
      }
  
      alert("Profilo aggiornato con successo! Per applicare le modifiche, effettua di nuovo l'accesso.");
      signOut(); // Esci e rientra per aggiornare la sessione
  
    } catch (error) {
      console.error("Errore:", error);
      alert("Si è verificato un errore durante l'aggiornamento del profilo");
    }
  
    setIsLoading(false);
  };
  

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Impostazioni</h1>
            <p className="text-muted-foreground">
              Gestisci il tuo profilo e le impostazioni dell&apos;account
            </p>
          </div>

          <div className="border-b mb-8">
            <div className="flex gap-2">
              <Tab
                icon={User}
                label="Profilo"
                isActive={activeTab === 'profile'}
                onClick={() => setActiveTab('profile')}
              />
              <Tab
                icon={Shield}
                label="Sicurezza"
                isActive={activeTab === 'security'}
                onClick={() => setActiveTab('security')}
              />
            </div>
          </div>

          <div>
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="space-y-6"
              >
                <div className="p-6 bg-card rounded-lg border shadow-sm">
                  <h2 className="text-lg font-semibold mb-4">Informazioni Personali</h2>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo</Label>
                      <Input
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="h-11"
                />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="h-11"
                      />
                    </div>
                    <div className="pt-4 text-end" onClick={handleSubmit}> 
                      <Button size="lg" disabled={isLoading} className="h-11">
                        {isLoading ? "Salvataggio..." : "Salva Modifiche"}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-destructive/5 rounded-lg border border-destructive/20">
                  <div className="flex items-center gap-2 text-destructive mb-4">
                    <Trash2 className="h-5 w-5" />
                    <h2 className="text-lg font-semibold">Elimina Account</h2>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Una volta eliminato l&apos;account, tutti i tuoi dati verranno rimossi permanentemente.
                    Questa azione non può essere annullata.
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <div className="text-end">
                        <Button variant="destructive" className="h-11">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Elimina Account
                        </Button>
                      </div>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Sei sicuro di voler eliminare l&apos;account?</DialogTitle>
                        <DialogDescription>
                          Questa azione non può essere annullata. Tutti i tuoi dati verranno eliminati permanentemente.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex items-center gap-2 p-4 bg-destructive/10 rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-destructive" />
                        <p className="text-sm text-destructive">
                          L&apos;eliminazione dell&apos;account è irreversibile
                        </p>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" className="h-11">Annulla</Button>
                        <Button variant="destructive" className="h-11">
                          Conferma Eliminazione
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="space-y-6"
              >
                <div className="p-6 bg-card rounded-lg border shadow-sm">
                  <h2 className="text-lg font-semibold mb-4">Cambia Password</h2>
                  <div className="space-y-4">
                    <PasswordInput
                      id="currentPassword"
                      label="Password Attuale"
                      value={formData.currentPassword}
                      onChange={handleChange}
                    />
                    <Separator className="my-4" />
                    <div className="space-y-4">
                      <PasswordInput
                        id="newPassword"
                        label="Nuova Password"
                        value={formData.newPassword}
                        onChange={handleChange}
                        showRequirements
                      />
                      <PasswordInput
                        id="confirmPassword"
                        label="Conferma Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="pt-4 text-end">
                      <Button disabled={isLoading} className="h-11">
                        <Save className="w-4 h-4 mr-2" />
                        {isLoading ? "Aggiornamento..." : "Aggiorna Password"}
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}