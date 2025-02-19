"use client"

export default function FooterDashboard() {
  return (
    <footer className="p-1">
      <div className="w-full">
        <div className="border-t pt-4 pb-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} WebMonitor. Tutti diritti riservati
        </div>
      </div>
    </footer>
  )
}