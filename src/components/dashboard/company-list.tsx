import type { Company } from "@/lib/types"
import { CompanyCard } from "./company-card"
import { Building2 } from "lucide-react"

interface CompanyListProps {
  companies: Company[]
  isLoading: boolean
}

export function CompanyList({ companies, isLoading }: CompanyListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-32 bg-card border border-border rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  if (companies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="p-4 rounded-full bg-secondary mb-4">
          <Building2 className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">Aucune entreprise</h3>
        <p className="text-muted-foreground max-w-sm">
          Commencez par ajouter une entreprise pour suivre vos candidatures.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {companies.map((company) => (
        <CompanyCard key={company.id} company={company} />
      ))}
    </div>
  )
}
