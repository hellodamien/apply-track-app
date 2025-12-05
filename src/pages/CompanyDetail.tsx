import { useState, useEffect, useCallback } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { useAuth } from "@/contexts/auth-context"
import { getCompany, getContacts, getInteractions, deleteCompany, deleteContact } from "@/lib/api"
import type { Company, Contact, Interaction } from "@/lib/types"
import { isOlderThan7Days, formatDate } from "@/lib/utils/date"
import { DashboardHeader } from "@/components/dashboard/header"
import { ContactList } from "@/components/company/contact-list"
import { InteractionList } from "@/components/company/interaction-list"
import { CompanyForm } from "@/components/forms/company-form"
import { ContactForm } from "@/components/forms/contact-form"
import { InteractionForm } from "@/components/forms/interaction-form"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ArrowLeft, Building2, MapPin, Calendar, Pencil, Trash2, AlertTriangle } from "lucide-react"

export default function CompanyDetail() {
  const { id: companyId } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isLoading: authLoading, token } = useAuth()

  const [company, setCompany] = useState<Company | null>(null)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [interactions, setInteractions] = useState<Interaction[]>([])
  const [isLoadingCompany, setIsLoadingCompany] = useState(true)
  const [isLoadingContacts, setIsLoadingContacts] = useState(true)
  const [isLoadingInteractions, setIsLoadingInteractions] = useState(true)

  const [isEditFormOpen, setIsEditFormOpen] = useState(false)
  const [isContactFormOpen, setIsContactFormOpen] = useState(false)
  const [isInteractionFormOpen, setIsInteractionFormOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [contactToDelete, setContactToDelete] = useState<string | null>(null)

  const fetchCompany = useCallback(async () => {
    if (!token || !companyId) return
    try {
      const response = await getCompany(companyId)
      setCompany(response.data)
    } catch (error) {
      console.error("[v0] Error fetching company:", error)
    } finally {
      setIsLoadingCompany(false)
    }
  }, [token, companyId])

  const fetchContacts = useCallback(async () => {
    if (!token || !companyId) return
    try {
      const response = await getContacts(companyId)
      setContacts(response.data)
    } catch (error) {
      console.error("[v0] Error fetching contacts:", error)
    } finally {
      setIsLoadingContacts(false)
    }
  }, [token, companyId])

  const fetchInteractions = useCallback(async () => {
    if (!token || !companyId) return
    try {
      const response = await getInteractions(companyId)
      setInteractions(response.data)
    } catch (error) {
      console.error("[v0] Error fetching interactions:", error)
    } finally {
      setIsLoadingInteractions(false)
    }
  }, [token, companyId])

  useEffect(() => {
    if (!authLoading && token) {
      fetchCompany()
      fetchContacts()
      fetchInteractions()
    }
  }, [authLoading, token, fetchCompany, fetchContacts, fetchInteractions])

  const handleDeleteCompany = async () => {
    if (!companyId) return
    try {
      await deleteCompany(companyId)
      navigate("/dashboard")
    } catch (error) {
      console.error("[v0] Error deleting company:", error)
    }
  }

  const handleDeleteContact = async (contactId: string) => {
    if (!companyId) return
    try {
      await deleteContact(companyId, contactId)
      fetchContacts()
    } catch (error) {
      console.error("[v0] Error deleting contact:", error)
    } finally {
      setContactToDelete(null)
    }
  }

  const lastInteraction = interactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
  const needsFollowUp = !lastInteraction || isOlderThan7Days(lastInteraction.date)

  if (authLoading || isLoadingCompany) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Chargement...</div>
      </div>
    )
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader onAddCompany={() => {}} />
        <main className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>Entreprise introuvable.</AlertDescription>
          </Alert>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader onAddCompany={() => setIsEditFormOpen(true)} />

      <main className="container mx-auto px-4 py-8">
        {/* Back link */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au tableau de bord
        </Link>

        {/* Follow-up alert */}
        {needsFollowUp && (
          <Alert className="bg-destructive/10 border-destructive/30 mb-6">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <AlertDescription className="text-muted-foreground">
              <strong className="text-destructive">Relance nécessaire !</strong> La dernière interaction avec cette
              entreprise
              {lastInteraction ? ` remonte au ${formatDate(lastInteraction.date)}.` : " n'a pas encore eu lieu."}
            </AlertDescription>
          </Alert>
        )}

        {/* Company info card */}
        <Card className="bg-card border-border mb-6">
          <CardHeader className="flex flex-row items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-secondary">
                <Building2 className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-2xl text-card-foreground">{company.name}</CardTitle>
                  {needsFollowUp && (
                    <Badge variant="destructive" className="bg-destructive/20 text-destructive border-0">
                      À relancer
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1 text-muted-foreground mt-1">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {company.address}, {company.postal_code}
                  </span>
                </div>
                {lastInteraction && (
                  <div className="flex items-center gap-1 text-muted-foreground mt-2 text-sm">
                    <Calendar className="h-3 w-3" />
                    <span>Dernière interaction : {formatDate(lastInteraction.date)}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => setIsEditFormOpen(true)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="text-destructive hover:bg-destructive/10 bg-transparent"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Contacts and Interactions */}
        <div className="grid gap-6 lg:grid-cols-2">
          <ContactList
            contacts={contacts}
            isLoading={isLoadingContacts}
            onDelete={(contactId) => setContactToDelete(contactId)}
            onAdd={() => setIsContactFormOpen(true)}
          />
          <InteractionList
            interactions={interactions}
            isLoading={isLoadingInteractions}
            onAdd={() => setIsInteractionFormOpen(true)}
          />
        </div>
      </main>

      {/* Modals */}
      <CompanyForm
        isOpen={isEditFormOpen}
        onClose={() => setIsEditFormOpen(false)}
        onSuccess={fetchCompany}
        company={company}
      />

      <ContactForm
        isOpen={isContactFormOpen}
        onClose={() => setIsContactFormOpen(false)}
        onSuccess={fetchContacts}
        companyId={companyId!}
      />

      <InteractionForm
        isOpen={isInteractionFormOpen}
        onClose={() => setIsInteractionFormOpen(false)}
        onSuccess={fetchInteractions}
        companyId={companyId!}
      />

      {/* Delete company dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-card-foreground">Supprimer l&apos;entreprise</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Êtes-vous sûr de vouloir supprimer {company.name} ? Cette action est irréversible et supprimera également
              tous les contacts et interactions associés.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-secondary text-secondary-foreground">Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCompany}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete contact dialog */}
      <AlertDialog open={!!contactToDelete} onOpenChange={() => setContactToDelete(null)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-card-foreground">Supprimer le contact</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Êtes-vous sûr de vouloir supprimer ce contact ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-secondary text-secondary-foreground">Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => contactToDelete && handleDeleteContact(contactToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
