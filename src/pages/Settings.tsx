import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Settings, CheckCircle2 } from "lucide-react"

export default function SettingsPage() {
  const [apiUrl, setApiUrl] = useState("")
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    // Load saved API URL from localStorage
    const savedUrl = localStorage.getItem("applytrack_api_url")
    if (savedUrl) {
      setApiUrl(savedUrl)
    } else {
      setApiUrl(import.meta.env.VITE_API_BASE_URL || "http://localhost:3000")
    }
  }, [])

  const handleSave = () => {
    localStorage.setItem("applytrack_api_url", apiUrl)
    setSaved(true)

    // Reload the page to apply the new API URL
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  }

  const handleReset = () => {
    const defaultUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"
    setApiUrl(defaultUrl)
    localStorage.removeItem("applytrack_api_url")
    setSaved(true)

    setTimeout(() => {
      window.location.reload()
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader onAddCompany={() => { }} />

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Settings className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Paramètres</h1>
          </div>
          <p className="text-muted-foreground">Configurez les paramètres de l&apos;application</p>
        </div>

        {saved && (
          <Alert className="mb-6 bg-green-500/10 border-green-500/30">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-green-700 dark:text-green-400">
              Paramètres enregistrés avec succès. Rechargement en cours...
            </AlertDescription>
          </Alert>
        )}

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Configuration API</CardTitle>
            <CardDescription className="text-muted-foreground">
              Modifiez l&apos;URL de base de l&apos;API backend
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiUrl" className="text-card-foreground">
                URL de l&apos;API
              </Label>
              <Input
                id="apiUrl"
                type="url"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="http://localhost:3000"
                className="bg-input border-border text-card-foreground"
              />
              <p className="text-sm text-muted-foreground">
                Entrez l&apos;URL complète de votre serveur API (ex: http://localhost:3000 ou https://api.example.com)
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button onClick={handleSave} disabled={!apiUrl || saved}>
                Enregistrer
              </Button>
              <Button variant="outline" onClick={handleReset} disabled={saved}>
                Réinitialiser par défaut
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border mt-6">
          <CardHeader>
            <CardTitle className="text-card-foreground text-sm">Informations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">URL par défaut:</span>
              <span className="text-foreground font-mono text-xs">
                {import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">URL actuelle:</span>
              <span className="text-foreground font-mono text-xs">
                {localStorage.getItem("applytrack_api_url") || import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"}
              </span>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
