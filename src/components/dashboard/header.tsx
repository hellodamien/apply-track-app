import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Briefcase, LogOut, Plus } from "lucide-react"
import { Link } from "react-router-dom"

interface DashboardHeaderProps {
  onAddCompany: () => void
}

export function DashboardHeader({ onAddCompany }: DashboardHeaderProps) {
  const { user, logout } = useAuth()

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Briefcase className="h-5 w-5 text-primary" />
          </div>
          <span className="text-lg font-semibold text-card-foreground">ApplyTrack</span>
        </Link>

        <div className="flex items-center gap-4">
          <Button onClick={onAddCompany} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Ajouter une entreprise</span>
          </Button>

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:inline">{user?.username}</span>
            <Button variant="ghost" size="icon" onClick={logout} title="Déconnexion">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
