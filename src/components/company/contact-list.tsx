
import { User, Mail, Phone, Briefcase, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Contact } from "@/lib/types"

interface ContactListProps {
  contacts: Contact[]
  isLoading: boolean
  onDelete: (contactId: string) => void
  onAdd: () => void
}

export function ContactList({ contacts, isLoading, onDelete, onAdd }: ContactListProps) {
  if (isLoading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Contacts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-20 bg-secondary rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-card-foreground">Contacts ({contacts.length})</CardTitle>
        <Button size="sm" onClick={onAdd}>
          Ajouter
        </Button>
      </CardHeader>
      <CardContent>
        {contacts.length === 0 ? (
          <div className="text-center py-8">
            <User className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">Aucun contact pour cette entreprise.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {contacts.map((contact) => (
              <div key={contact.id} className="p-4 rounded-lg bg-secondary/50 border border-border">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-card-foreground">
                        {contact.first_name} {contact.last_name}
                      </h4>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <Briefcase className="h-3 w-3" />
                        <span>{contact.job_title}</span>
                      </div>
                      <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                        <a
                          href={`mailto:${contact.email}`}
                          className="flex items-center gap-1 hover:text-primary transition-colors"
                        >
                          <Mail className="h-3 w-3" />
                          {contact.email}
                        </a>
                        <a
                          href={`tel:${contact.phone}`}
                          className="flex items-center gap-1 hover:text-primary transition-colors"
                        >
                          <Phone className="h-3 w-3" />
                          {contact.phone}
                        </a>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => onDelete(contact.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
