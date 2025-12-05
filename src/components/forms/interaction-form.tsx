
import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { createInteraction } from "@/lib/api"
import { INTERACTION_TYPES } from "@/lib/types"

interface InteractionFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  companyId: string
}

export function InteractionForm({ isOpen, onClose, onSuccess, companyId }: InteractionFormProps) {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [type, setType] = useState<string>("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!type) {
      setError("Veuillez sélectionner un type d'interaction.")
      return
    }

    setIsLoading(true)

    try {
      await createInteraction(companyId, { date, type, description })
      onSuccess()
      onClose()
      resetForm()
    } catch {
      setError("Erreur lors de la création de l'interaction.")
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setDate(new Date().toISOString().split("T")[0])
    setType("")
    setDescription("")
    setError("")
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-card-foreground">Ajouter une interaction</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Enregistrez une nouvelle interaction avec cette entreprise.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="space-y-2">
            <Label htmlFor="date" className="text-card-foreground">
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="bg-input border-border text-card-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type" className="text-card-foreground">
              Type d&apos;interaction
            </Label>
            <Select value={type} onValueChange={setType} required>
              <SelectTrigger className="bg-input border-border text-card-foreground">
                <SelectValue placeholder="Sélectionnez un type" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {INTERACTION_TYPES.map((interactionType) => (
                  <SelectItem
                    key={interactionType}
                    value={interactionType}
                    className="text-card-foreground hover:bg-secondary"
                  >
                    {interactionType}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-card-foreground">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez l'interaction (ex: Envoi de CV et lettre de motivation)"
              required
              rows={4}
              className="bg-input border-border text-card-foreground placeholder:text-muted-foreground resize-none"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Enregistrement..." : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
