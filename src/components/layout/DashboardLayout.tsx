"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "./Sidebar"
import { Header } from "./Header"
import { CommandPalette } from "../CommandPalette"
import { useAuthStore } from "@/stores/authStore"

import { PageTransition } from "@/components/PageTransition"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    if (mounted && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, mounted, router])

  if (!mounted || !isAuthenticated) {
    // Show nothing or a loading spinner while checking auth state
    return null
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Sidebar />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-64 h-full min-h-screen">
        <Header />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
      </div>
      <CommandPalette />
    </div>
  )
}
