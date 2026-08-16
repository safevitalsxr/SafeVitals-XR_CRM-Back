"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, Building2, Users, Shield, 
  Clock, LifeBuoy, BarChart3, Lock, Settings 
} from "lucide-react"

import { useAuthStore } from "@/stores/authStore"

const navGroups = [
  {
    title: "Overview",
    roles: ["role_1", "role_2", "role_3"], // Everyone
    items: [
      { title: "Dashboard", href: "/app/dashboard", icon: LayoutDashboard },
    ]
  },
  {
    title: "Organization",
    roles: ["role_1", "role_2"], // Admin and Managers
    items: [
      { title: "Company Hierarchy", href: "/app/organization", icon: Building2 },
      { title: "Departments", href: "/app/departments", icon: Building2 },
      { title: "Teams", href: "/app/teams", icon: Users },
      { title: "Work Schedules", href: "/app/schedules", icon: Clock },
    ]
  },
  {
    title: "People",
    roles: ["role_1", "role_2"], // Admin and Managers
    items: [
      { title: "Employees", href: "/app/employees", icon: Users },
    ]
  },
  {
    title: "Access Control",
    roles: ["role_1"], // Super Admin only
    items: [
      { title: "Roles & Permissions", href: "/app/roles", icon: Shield },
      { title: "Access Requests", href: "/app/access-requests", icon: Shield },
    ]
  },
  {
    title: "Workforce",
    roles: ["role_1", "role_2", "role_3"], // Everyone
    items: [
      { title: "Attendance", href: "/app/attendance", icon: Clock },
      { title: "Leave", href: "/app/leave", icon: Clock },
      { title: "Weekly Reports", href: "/app/reports", icon: BarChart3 },
      { title: "Tasks", href: "/app/tasks", icon: LayoutDashboard },
    ]
  },
  {
    title: "Support",
    roles: ["role_1", "role_2", "role_3"], // Everyone
    items: [
      { title: "Tickets", href: "/app/tickets", icon: LifeBuoy },
    ]
  },
  {
    title: "Super Admin",
    roles: ["role_1"], // Super Admin only
    items: [
      { title: "Audit Logs", href: "/app/audit", icon: Lock },
      { title: "Security", href: "/app/security", icon: Shield },
      { title: "Settings", href: "/app/settings", icon: Settings },
    ]
  }
]

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuthStore()

  // Use the user's roleId to filter navigation groups, default to role_3 if not found
  const userRoleId = user?.roleId || "role_3"

  const filteredNavGroups = navGroups.filter(group => group.roles.includes(userRoleId))

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-card">
      <div className="flex h-14 items-center border-b px-6">
        <div className="flex flex-col">
          <span className="font-bold tracking-tight">SAFE VITALS</span>
          <span className="text-[10px] uppercase text-muted-foreground tracking-wider">Employee Operations</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="grid gap-6 px-4">
          {filteredNavGroups.map((group, index) => (
            <div key={index} className="flex flex-col gap-1">
              <h4 className="px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                {group.title}
              </h4>
              {group.items.map((item, itemIndex) => {
                const Icon = item.icon
                const isActive = pathname?.startsWith(item.href)
                return (
                  <Link
                    key={itemIndex}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-2 py-1.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                      isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  )
}
