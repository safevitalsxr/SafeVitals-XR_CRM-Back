"use client"

import * as React from "react"
import { Search, Bell, Moon, Sun, LogOut, User as UserIcon, Settings } from "lucide-react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/Button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu"
import { useAuthStore } from "@/stores/authStore"

export function Header() {
  const { setTheme } = useTheme()
  const router = useRouter()
  const { user, logout } = useAuthStore()

  // During SSR or early hydration, user might be undefined/null before Zustand loads persist
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  // Fallback info if not logged in (though middleware/guards should catch this)
  const firstName = user?.firstName || "Guest"
  const lastName = user?.lastName || ""
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "G"
  const employeeId = user?.employeeId || ""
  const fullName = `${firstName} ${lastName}`.trim()

  return (
    <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b bg-background px-6 backdrop-blur">
      <div className="flex flex-1 items-center gap-4">
        <Button
          variant="outline"
          className="relative h-9 w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-64"
        >
          <Search className="mr-2 h-4 w-4" />
          <span>Search Safe Vitals...</span>
          <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Bell className="h-4 w-4" />
          <span className="sr-only">Notifications</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {mounted && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user?.avatarUrl || "/placeholder-user.jpg"} alt={fullName} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{fullName}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {employeeId || "No ID"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push(`/app/employees/${user?.id || ''}`)}>
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/app/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  )
}
