import axios from "axios"

const getApiBaseUrl = () => {
  // Check localStorage first, then env variable, then default
  if (typeof window !== "undefined") {
    const savedUrl = localStorage.getItem("applytrack_api_url")
    if (savedUrl) return savedUrl
  }
  return import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"
}

const api = axios.create({
  baseURL: getApiBaseUrl(),
})

// Interceptor to add token to all requests
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("applytrack_token")
    if (token) {
      config.headers["x-api-key"] = token
    }
  }
  return config
})

// Auth
export const login = (username: string, password: string) => api.post("/login", { username, password })

export const register = (username: string, password: string) => api.post("/register", { username, password })

// Companies
export const getCompanies = () => api.get("/companies")
export const getCompany = (id: string) => api.get(`/companies/${id}`)
export const createCompany = (data: { name: string; address: string; postal_code: string }) =>
  api.post("/companies", data)
export const updateCompany = (id: string, data: { name?: string; address?: string; postal_code?: string }) =>
  api.put(`/companies/${id}`, data)
export const deleteCompany = (id: string) => api.delete(`/companies/${id}`)

// Contacts
export const getContacts = (companyId: string) => api.get(`/companies/${companyId}/contacts`)
export const createContact = (
  companyId: string,
  data: { first_name: string; last_name: string; job_title: string; phone: string; email: string },
) => api.post(`/companies/${companyId}/contacts`, data)
export const deleteContact = (companyId: string, contactId: string) =>
  api.delete(`/companies/${companyId}/contacts/${contactId}`)

// Interactions
export const getInteractions = (companyId: string) => api.get(`/companies/${companyId}/interactions`)
export const createInteraction = (companyId: string, data: { date: string; type: string; description: string }) =>
  api.post(`/companies/${companyId}/interactions`, data)

export default api
