
import type React from "react"

import { MessageSquare, Calendar, Mail, Phone, Linkedin, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Interaction } from "@/lib/types"
import { formatDate } from "@/lib/utils/date"

interface InteractionListProps {
  interactions: Interaction[]
  isLoading: boolean
  onAdd: () => void
}

const interactionIcons: Record<string, React.ReactNode> = {
  Email: <Mail className="h-4 w-4" />,
  Téléphone: <Phone className="h-4 w-4" />,
  LinkedIn: <Linkedin className="h-4 w-4" />,
  Entretien: <Users className="h-4 w-4" />,
}

const interactionColors: Record<string, string> = {
  Email: "bg-blue-500/20 text-blue-400",
  Téléphone: "bg-green-500/20 text-green-400",
  LinkedIn: "bg-cyan-500/20 text-cyan-400",
  Entretien: "bg-amber-500/20 text-amber-400",
}

export function InteractionList({ interactions, isLoading, onAdd }: InteractionListProps) {
  // Sort interactions by date (most recent first)
  const sortedInteractions = [...interactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  if (isLoading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Historique des interactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-secondary rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-card-foreground">Historique des interactions ({interactions.length})</CardTitle>
        <Button size="sm" onClick={onAdd}>
          Ajouter
        </Button>
      </CardHeader>
      <CardContent>
        {sortedInteractions.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">Aucune interaction enregistrée.</p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

            <div className="space-y-4">
              {sortedInteractions.map((interaction, index) => (
                <div key={interaction.id} className="relative pl-10">
                  {/* Timeline dot */}
                  <div
                    className={`absolute left-2 top-2 w-4 h-4 rounded-full flex items-center justify-center ${interactionColors[interaction.type] || "bg-primary/20"}`}
                  >
                    <div className="w-2 h-2 rounded-full bg-current" />
                  </div>

                  <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                    <div className="flex items-start justify-between mb-2">
                      <Badge
                        className={`${interactionColors[interaction.type] || "bg-primary/20 text-primary"} border-0 gap-1`}
                      >
                        {interactionIcons[interaction.type]}
                        {interaction.type}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDate(interaction.date)}
                      </div>
                    </div>
                    <p className="text-card-foreground">{interaction.description}</p>
                    {index === 0 && (
                      <Badge variant="outline" className="mt-2 text-xs border-primary/30 text-primary">
                        Dernière interaction
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
