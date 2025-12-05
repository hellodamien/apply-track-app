import { AlertTriangle, Clock } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { Company } from "@/lib/types"
import { getDaysSince } from "@/lib/utils/date"
import { Link } from "react-router-dom"

interface FollowUpAlertProps {
  companies: Company[]
}

export function FollowUpAlert({ companies }: FollowUpAlertProps) {
  if (companies.length === 0) return null

  return (
    <Alert className="bg-destructive/10 border-destructive/30 mb-6">
      <AlertTriangle className="h-5 w-5 text-destructive" />
      <AlertTitle className="text-destructive font-semibold">Relances nécessaires ({companies.length})</AlertTitle>
      <AlertDescription className="mt-2">
        <p className="text-muted-foreground mb-3">
          Ces entreprises n&apos;ont pas eu d&apos;interaction depuis plus de 7 jours :
        </p>
        <div className="space-y-2">
          {companies.map((company) => {
            const lastInteraction = company.interactions?.[0]
            const daysSince = lastInteraction ? getDaysSince(lastInteraction.date) : null

            return (
              <Link
                key={company.id}
                to={`/companies/${company.id}`}
                className="flex items-center justify-between p-2 rounded-md bg-background/50 hover:bg-background transition-colors"
              >
                <span className="font-medium text-foreground">{company.name}</span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {daysSince !== null ? `${daysSince} jours` : "Aucune interaction"}
                </span>
              </Link>
            )
          })}
        </div>
      </AlertDescription>
    </Alert>
  )
}
