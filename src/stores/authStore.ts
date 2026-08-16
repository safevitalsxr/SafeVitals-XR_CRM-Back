import { create } from "zustand"
import { persist } from "zustand/middleware"
import { Employee } from "@/types"

interface AuthState {
  user: Employee | null
  token: string | null
  isAuthenticated: boolean
  login: (user: Employee, token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: "safevitals-auth-storage", // name of the item in the storage (must be unique)
      // Note: In production, do not persist sensitive tokens in localStorage.
      // For this mock/V1 architecture, we use it for UX state persistence across reloads.
    }
  )
)
