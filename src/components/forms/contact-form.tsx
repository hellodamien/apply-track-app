
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
import { createContact } from "@/lib/api"

interface ContactFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  companyId: string
}

export function ContactForm({ isOpen, onClose, onSuccess, companyId }: ContactFormProps) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [jobTitle, setJobTitle] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await createContact(companyId, {
        first_name: firstName,
        last_name: lastName,
        job_title: jobTitle,
        phone,
        email,
      })
      onSuccess()
      onClose()
      resetForm()
    } catch {
      setError("Erreur lors de la création du contact.")
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFirstName("")
    setLastName("")
    setJobTitle("")
    setPhone("")
    setEmail("")
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
          <DialogTitle className="text-card-foreground">Ajouter un contact</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Ajoutez les coordonnées d&apos;un contact dans cette entreprise.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-card-foreground">
                Prénom
              </Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Jean"
                required
                className="bg-input border-border text-card-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-card-foreground">
                Nom
              </Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Dupont"
                required
                className="bg-input border-border text-card-foreground"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobTitle" className="text-card-foreground">
              Poste
            </Label>
            <Input
              id="jobTitle"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="Responsable RH"
              required
              className="bg-input border-border text-card-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-card-foreground">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jean.dupont@entreprise.fr"
              required
              className="bg-input border-border text-card-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-card-foreground">
              Téléphone
            </Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="06 12 34 56 78"
              required
              className="bg-input border-border text-card-foreground"
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
