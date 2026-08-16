"use client"

import * as React from "react"
import { Shield, Plus, Lock, Users, Clock, Calendar, Settings, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Switch } from "@/components/ui/Switch"
import { Label } from "@/components/ui/Label"
import { Role } from "@/types"

// --- Permission Definitions ---
const PERMISSION_MODULES = [
  {
    id: "employees",
    title: "Employee Profiles",
    icon: Users,
    description: "Access and modify employee data",
    permissions: [
      { id: "employees.view.basic", label: "View Basic Details", desc: "Can see name, email, and department" },
      { id: "employees.view.private", label: "View Private Info", desc: "Can see salary, home address, and phone" },
      { id: "employees.edit", label: "Edit Employee Data", desc: "Can modify employee records" },
      { id: "employees.delete", label: "Delete Employees", desc: "Can permanently remove employees" },
    ]
  },
  {
    id: "attendance",
    title: "Attendance & Schedules",
    icon: Clock,
    description: "Manage workforce timing",
    permissions: [
      { id: "attendance.view", label: "View Attendance", desc: "Can see who is clocked in/out" },
      { id: "attendance.edit", label: "Modify Time Logs", desc: "Can correct or alter attendance records" },
      { id: "schedules.manage", label: "Manage Schedules", desc: "Can create or update work shifts" },
    ]
  },
  {
    id: "leave",
    title: "Leave Management",
    icon: Calendar,
    description: "Handle time-off requests",
    permissions: [
      { id: "leave.request", label: "Request Leave", desc: "Can submit personal time off requests" },
      { id: "leave.approve", label: "Approve Leave", desc: "Can approve or reject team leave requests" },
    ]
  },
  {
    id: "system",
    title: "System Settings",
    icon: Settings,
    description: "Core platform configuration",
    permissions: [
      { id: "system.audit", label: "View Audit Logs", desc: "Can see all system activity history" },
      { id: "system.roles", label: "Manage Roles", desc: "Can create and modify access permissions" },
    ]
  }
]

export default function RolesPage() {
  const [roles, setRoles] = React.useState<Role[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [selectedRoleId, setSelectedRoleId] = React.useState<string | null>(null)

  // We maintain a local copy of permissions for the selected role to allow fast toggling UI
  const [activePermissions, setActivePermissions] = React.useState<string[]>([])

  React.useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await fetch("/api/roles")
        if (!res.ok) {
          throw new Error("Failed to fetch roles: " + res.status)
        }
        const data = await res.json()
        setRoles(data)
        if (data.length > 0) {
          setSelectedRoleId(data[0].id)
          setActivePermissions(data[0].permissions || [])
        }
      } catch (error) {
        console.error("Failed to load roles:", error)
        // Fallback robust role set
        const fallbackRoles: Role[] = [
          {
            id: "role_1",
            name: "Super Admin",
            description: "Unrestricted system access",
            isSystem: true,
            permissions: ["*.*.*"]
          },
          {
            id: "role_2",
            name: "Department Head",
            description: "Manages a specific department",
            isSystem: true,
            permissions: ["employees.view.basic", "attendance.view", "leave.approve"]
          },
          {
            id: "role_3",
            name: "Standard Employee",
            description: "Default employee access",
            isSystem: true,
            permissions: ["employees.view.basic", "leave.request"]
          },
          {
            id: "role_custom_1",
            name: "HR Manager",
            description: "Human Resources operations",
            isSystem: false,
            permissions: ["employees.view.basic", "employees.view.private", "employees.edit", "leave.approve"]
          }
        ]
        setRoles(fallbackRoles)
        setSelectedRoleId(fallbackRoles[0].id)
        setActivePermissions(fallbackRoles[0].permissions)
      } finally {
        setIsLoading(false)
      }
    }
    fetchRoles()
  }, [])

  const selectedRole = roles.find(r => r.id === selectedRoleId)
  const isSystemRole = selectedRole?.isSystem || false
  const hasFullAccess = activePermissions.includes("*.*.*")

  const handleToggle = (permissionId: string, checked: boolean) => {
    if (isSystemRole || hasFullAccess) return // Cannot edit system roles or super admins

    setActivePermissions(prev => {
      if (checked) {
        return [...prev, permissionId]
      } else {
        return prev.filter(p => p !== permissionId)
      }
    })
  }

  const handleRoleSelect = (roleId: string) => {
    setSelectedRoleId(roleId)
    const role = roles.find(r => r.id === roleId)
    setActivePermissions(role?.permissions || [])
  }

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2 mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Access Control & Roles</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Custom Role
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-140px)]">
        
        {/* LEFT PANE: Roles List */}
        <div className="w-full md:w-1/3 flex flex-col gap-4 border-r pr-6 overflow-y-auto">
          <div className="space-y-1 mb-2">
            <h3 className="text-lg font-medium leading-none">Security Roles</h3>
            <p className="text-sm text-muted-foreground">Select a role to configure its access permissions.</p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : (
            <div className="space-y-2">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => handleRoleSelect(role.id)}
                  className={`w-full flex flex-col items-start gap-2 rounded-lg border p-4 text-left transition-all hover:bg-accent hover:text-accent-foreground ${
                    selectedRoleId === role.id ? "bg-accent/80 border-primary shadow-sm" : "bg-card"
                  }`}
                >
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-2 font-medium">
                      <Shield className={`h-4 w-4 ${role.isSystem ? 'text-primary' : 'text-muted-foreground'}`} />
                      {role.name}
                    </div>
                    {role.isSystem && <Lock className="h-3 w-3 text-muted-foreground" />}
                  </div>
                  <div className="text-xs text-muted-foreground line-clamp-1">
                    {role.description}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT PANE: Permissions Matrix */}
        <div className="w-full md:w-2/3 flex flex-col gap-6 overflow-y-auto pb-12">
          {selectedRole ? (
            <>
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    {selectedRole.name}
                    {isSystemRole ? (
                      <Badge variant="secondary" className="font-normal"><Lock className="w-3 h-3 mr-1"/> System Role</Badge>
                    ) : (
                      <Badge variant="outline" className="font-normal border-primary/50 text-primary">Custom Role</Badge>
                    )}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">Configure what users with this role can do across the platform.</p>
                </div>
                {!isSystemRole && (
                  <Button variant="default">Save Configuration</Button>
                )}
              </div>

              {isSystemRole && (
                <div className="flex items-start gap-3 rounded-lg border border-amber-500/20 bg-amber-500/10 p-4 text-amber-600 dark:text-amber-400">
                  <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">System Role Locked</p>
                    <p className="text-sm opacity-90">
                      System roles are integral to Safe Vitals and cannot be modified. If you need a variation of this role, please create a new Custom Role.
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {PERMISSION_MODULES.map((module) => {
                  const Icon = module.icon
                  return (
                    <Card key={module.id} className="shadow-none border-border/50">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-primary/10 rounded-md">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{module.title}</CardTitle>
                            <CardDescription>{module.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="grid gap-6">
                        {module.permissions.map((perm) => {
                          const isChecked = hasFullAccess || activePermissions.includes(perm.id)
                          return (
                            <div key={perm.id} className="flex items-center justify-between space-x-2">
                              <div className="space-y-0.5">
                                <Label htmlFor={perm.id} className="text-base font-medium">{perm.label}</Label>
                                <p className="text-sm text-muted-foreground">{perm.desc}</p>
                              </div>
                              <Switch 
                                id={perm.id} 
                                checked={isChecked}
                                onCheckedChange={(c) => handleToggle(perm.id, c)}
                                disabled={isSystemRole || hasFullAccess}
                              />
                            </div>
                          )
                        })}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Select a role to view and manage its permissions
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
