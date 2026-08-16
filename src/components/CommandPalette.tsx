"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Building2,
  Calendar,
  LayoutDashboard,
  LifeBuoy,
  Settings,
  User,
  Users,
} from "lucide-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/Command"

export function CommandPalette() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => runCommand(() => router.push("/app/dashboard"))}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/app/employees"))}>
            <Users className="mr-2 h-4 w-4" />
            <span>Employees Directory</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/app/departments"))}>
            <Building2 className="mr-2 h-4 w-4" />
            <span>Departments</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Quick Actions">
          <CommandItem onSelect={() => runCommand(() => router.push("/app/leave"))}>
            <Calendar className="mr-2 h-4 w-4" />
            <span>Apply for Leave</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/app/tickets"))}>
            <LifeBuoy className="mr-2 h-4 w-4" />
            <span>Raise a Ticket</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem onSelect={() => runCommand(() => router.push("/app/settings"))}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile Settings</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/app/settings"))}>
            <Settings className="mr-2 h-4 w-4" />
            <span>System Settings</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
