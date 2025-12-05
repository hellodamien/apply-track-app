import { Building2, MapPin, ChevronRight, Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Company } from "@/lib/types"
import { formatDate, isOlderThan7Days } from "@/lib/utils/date"
import { Link } from "react-router-dom"

interface CompanyCardProps {
  company: Company
}

export function CompanyCard({ company }: CompanyCardProps) {
  const lastInteraction = company.interactions?.[0]
  const needsFollowUp = lastInteraction ? isOlderThan7Days(lastInteraction.date) : true

  return (
    <Link to={`/companies/${company.id}`}>
      <Card
        className={`
        bg-card border-border hover:border-primary/50 transition-all cursor-pointer group
        ${needsFollowUp ? "border-l-4 border-l-destructive" : ""}
      `}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-secondary">
                <Building2 className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">
                  {company.name}
                </h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  <MapPin className="h-3 w-3" />
                  <span>
                    {company.address}, {company.postal_code}
                  </span>
                </div>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>

          <div className="mt-4 flex items-center justify-between">
            {lastInteraction ? (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Dernière interaction : {formatDate(lastInteraction.date)}
                </span>
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">Aucune interaction</span>
            )}

            {needsFollowUp && (
              <Badge variant="destructive" className="bg-destructive/20 text-destructive border-0">
                À relancer
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
