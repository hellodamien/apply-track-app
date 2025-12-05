import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/contexts/auth-context"
import { getCompanies } from "@/lib/api"
import type { Company } from "@/lib/types"
import { isOlderThan7Days } from "@/lib/utils/date"
import { DashboardHeader } from "@/components/dashboard/header"
import { FollowUpAlert } from "@/components/dashboard/follow-up-alert"
import { CompanyList } from "@/components/dashboard/company-list"
import { CompanyForm } from "@/components/forms/company-form"

export default function Dashboard() {
  const { isLoading: authLoading, token } = useAuth()
  const [companies, setCompanies] = useState<Company[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const fetchCompanies = useCallback(async () => {
    if (!token) return

    try {
      const response = await getCompanies()
      setCompanies(response.data)
    } catch (error) {
      console.error("[v0] Error fetching companies:", error)
    } finally {
      setIsLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (!authLoading && token) {
      fetchCompanies()
    }
  }, [authLoading, token, fetchCompanies])

  // Separate companies that need follow-up
  const companiesNeedingFollowUp = companies.filter((company) => {
    const lastInteraction = company.interactions?.[0]
    return !lastInteraction || isOlderThan7Days(lastInteraction.date)
  })

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader onAddCompany={() => setIsFormOpen(true)} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-1">Tableau de bord</h1>
          <p className="text-muted-foreground">Suivez l&apos;état de vos candidatures et ne manquez aucune relance.</p>
        </div>

        <FollowUpAlert companies={companiesNeedingFollowUp} />

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Mes entreprises ({companies.length})</h2>
        </div>

        <CompanyList companies={companies} isLoading={isLoading} />
      </main>

      <CompanyForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSuccess={fetchCompanies} />
    </div>
  )
}
