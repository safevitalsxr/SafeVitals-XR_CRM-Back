"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { useAuthStore } from "@/stores/authStore"

import { VRHeadsetCanvas } from "@/components/3d/VRHeadset"

export default function LoginPage() {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState("")
  const router = useRouter()
  const login = useAuthStore((state) => state.login)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    // Simulate login network request using MSW
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })

      if (res.ok) {
        const data = await res.json()
        // Populate global state
        login(data.user, data.token)
        // Successful login
        router.push("/app/dashboard")
      } else {
        setError("Invalid email or password.")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-800 via-zinc-900 to-black p-10 text-white lg:flex overflow-hidden border-r border-white/5">
        <VRHeadsetCanvas />
        <div className="relative z-20 flex items-center text-lg font-medium gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-500 text-zinc-950 font-bold">
            S
          </div>
          Safe Vitals XR
        </div>
        <div className="relative z-20 mt-auto bg-black/40 p-4 rounded-lg backdrop-blur-sm border border-white/10 w-fit">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;The modern command center for managing our entire workforce, keeping everyone safe, aligned, and productive.&rdquo;
            </p>
            <footer className="text-sm text-emerald-400">Safe Vitals Inc.</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to sign in to your account
            </p>
          </div>

          <div className="grid gap-6">
            <form onSubmit={handleLogin}>
              <div className="grid gap-4">
                {error && (
                  <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    placeholder="name@safevitals.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={isLoading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="/forgot-password"
                      className="text-sm font-medium text-muted-foreground hover:text-primary"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    disabled={isLoading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button disabled={isLoading}>
                  {isLoading && (
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  )}
                  Sign In
                </Button>
              </div>
            </form>
          </div>

          <p className="px-8 text-center text-sm text-muted-foreground">
            Having trouble logging in?{" "}
            <Link
              href="/app/tickets/new"
              className="underline underline-offset-4 hover:text-primary"
            >
              Contact IT Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
