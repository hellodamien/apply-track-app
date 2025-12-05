export interface Company {
  id: string
  name: string
  address: string
  postal_code: string
  interactions?: Interaction[]
}

export interface Contact {
  id: string
  first_name: string
  last_name: string
  job_title: string
  phone: string
  email: string
}

export interface Interaction {
  id: string
  date: string
  type: "Email" | "Téléphone" | "LinkedIn" | "Entretien"
  description: string
}

export const INTERACTION_TYPES = ["Email", "Téléphone", "LinkedIn", "Entretien"] as const
