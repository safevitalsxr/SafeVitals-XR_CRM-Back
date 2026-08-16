"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"

export default function ResetPasswordPage() {
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [isSubmitted, setIsSubmitted] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate network request
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
    }, 1500)
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link
        href="/login"
        className="absolute left-4 top-4 md:left-8 md:top-8 flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Login
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <div className="flex justify-center mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-lg">
              S
            </div>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Create New Password
          </h1>
          <p className="text-sm text-muted-foreground">
            Your new password must be different from previous used passwords
          </p>
        </div>

        {isSubmitted ? (
          <div className="rounded-md bg-emerald-500/10 p-4 border border-emerald-500/20 text-center">
            <h3 className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Password Reset Successful</h3>
            <p className="mt-2 text-xs text-muted-foreground">
              You can now login with your new password.
            </p>
            <Button className="w-full mt-4" asChild>
              <Link href="/login">Go to Login</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    disabled={isLoading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    disabled={isLoading}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  {password && confirmPassword && password !== confirmPassword && (
                    <p className="text-xs text-destructive">Passwords do not match</p>
                  )}
                </div>
                <Button disabled={isLoading || (password !== confirmPassword && confirmPassword !== "")}>
                  {isLoading && (
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  )}
                  Reset Password
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
