import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Settings } from "lucide-react"

interface ApiSettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ApiSettingsDialog({ open, onOpenChange }: ApiSettingsDialogProps) {
  const [apiUrl, setApiUrl] = useState("")

  useEffect(() => {
    if (open) {
      const savedUrl = localStorage.getItem("applytrack_api_url")
      if (savedUrl) {
        setApiUrl(savedUrl)
      } else {
        setApiUrl(import.meta.env.VITE_API_BASE_URL || "http://localhost:3000")
      }
    }
  }, [open])

  const handleSave = () => {
    if (apiUrl) {
      localStorage.setItem("applytrack_api_url", apiUrl)
      onOpenChange(false)
      // Reload to apply new API URL
      window.location.reload()
    }
  }

  const handleReset = () => {
    const defaultUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"
    setApiUrl(defaultUrl)
    localStorage.removeItem("applytrack_api_url")
    onOpenChange(false)
    window.location.reload()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-card-foreground flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuration API
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Modifiez l&apos;URL de base de l&apos;API backend
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
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
              Entrez l&apos;URL complète de votre serveur API
            </p>
          </div>
          <div className="bg-muted/50 p-3 rounded-lg space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">URL par défaut:</span>
              <span className="text-foreground font-mono">
                {import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"}
              </span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleReset}>
            Réinitialiser
          </Button>
          <Button onClick={handleSave} disabled={!apiUrl}>
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
