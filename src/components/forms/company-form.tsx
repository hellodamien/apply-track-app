
import type React from "react"

import { useState } from "react"
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
import { createCompany, updateCompany } from "@/lib/api"
import type { Company } from "@/lib/types"

interface CompanyFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  company?: Company | null
}

export function CompanyForm({ isOpen, onClose, onSuccess, company }: CompanyFormProps) {
  const [name, setName] = useState(company?.name || "")
  const [address, setAddress] = useState(company?.address || "")
  const [postalCode, setPostalCode] = useState(company?.postal_code || "")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const isEditing = !!company

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      if (isEditing) {
        await updateCompany(company.id, { name, address, postal_code: postalCode })
      } else {
        await createCompany({ name, address, postal_code: postalCode })
      }
      onSuccess()
      onClose()
      resetForm()
    } catch {
      setError(isEditing ? "Erreur lors de la modification." : "Erreur lors de la création.")
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setName("")
    setAddress("")
    setPostalCode("")
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
          <DialogTitle className="text-card-foreground">
            {isEditing ? "Modifier l'entreprise" : "Ajouter une entreprise"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {isEditing
              ? "Modifiez les informations de l'entreprise."
              : "Remplissez les informations de l'entreprise à suivre."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="space-y-2">
            <Label htmlFor="name" className="text-card-foreground">
              Nom de l&apos;entreprise
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Google France"
              required
              className="bg-input border-border text-card-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-card-foreground">
              Adresse
            </Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Ex: 8 Rue de Londres"
              required
              className="bg-input border-border text-card-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="postalCode" className="text-card-foreground">
              Code postal
            </Label>
            <Input
              id="postalCode"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder="Ex: 75009"
              required
              className="bg-input border-border text-card-foreground"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Enregistrement..." : isEditing ? "Modifier" : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
