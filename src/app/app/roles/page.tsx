"use client"

import * as React from "react"
import { Shield, Plus, Lock, Users, Clock, Calendar, Settings, AlertCircle, Copy, Trash2, Edit2, MoreHorizontal, CheckCircle2, ShieldAlert, FileText, Download, Filter } from "lucide-react"

import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Switch } from "@/components/ui/Switch"
import { Label } from "@/components/ui/Label"
import { Input } from "@/components/ui/Input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/Dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/DropdownMenu"
import { Role, PermissionModule } from "@/types"
import { toast } from "sonner"
import { useAuthStore } from "@/stores/authStore"

// Map string icon names to Lucide components
const IconMap: Record<string, any> = {
  "users": Users,
  "clock": Clock,
  "calendar": Calendar,
  "settings": Settings,
  "file-text": FileText
}

export default function RolesPage() {
  const { user } = useAuthStore()
  const isSuperAdmin = user?.roleId === "role_1" // Simplified permission check for this demo
  
  const [roles, setRoles] = React.useState<Role[]>([])
  const [modules, setModules] = React.useState<PermissionModule[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [selectedRoleId, setSelectedRoleId] = React.useState<string | null>(null)

  // Modals & Forms
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [isEditMode, setIsEditMode] = React.useState(false)
  
  // Form State
  const [formData, setFormData] = React.useState({ name: "", description: "", status: "Active" as "Active" | "Inactive" })
  const [activePermissions, setActivePermissions] = React.useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Filters & Search
  const [searchQuery, setSearchQuery] = React.useState("")

  const fetchData = async () => {
    try {
      const [rolesRes, permsRes] = await Promise.all([
        fetch("/api/roles"),
        fetch("/api/permissions")
      ])
      if (!rolesRes.ok || !permsRes.ok) throw new Error("Failed to fetch data")
      
      const rolesData = await rolesRes.json()
      const permsData = await permsRes.json()
      
      setRoles(rolesData)
      setModules(permsData)
      
      if (rolesData.length > 0 && !selectedRoleId) {
        setSelectedRoleId(rolesData[0].id)
      }
    } catch (error) {
      toast.error("Failed to load roles and permissions")
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    fetchData()
  }, [])

  const selectedRole = roles.find(r => r.id === selectedRoleId)
  const isSystemRole = selectedRole?.isSystem || false

  // Derived Statistics
  const totalRoles = roles.length
  const activeRoles = roles.filter(r => r.status === "Active").length
  const systemRoles = roles.filter(r => r.isSystem).length
  const totalUsersAssigned = roles.reduce((acc, r) => acc + (r.userCount || 0), 0)

  // Initialize form when a role is selected (if not in edit mode)
  React.useEffect(() => {
    if (selectedRole && !isEditMode && !isCreateOpen) {
      setFormData({ name: selectedRole.name, description: selectedRole.description, status: selectedRole.status })
      setActivePermissions(selectedRole.permissions || [])
    }
  }, [selectedRole, isEditMode, isCreateOpen])

  const handleRoleSelect = (id: string) => {
    setIsEditMode(false)
    setSelectedRoleId(id)
  }

  const handleTogglePermission = (permissionId: string, checked: boolean) => {
    if (!isEditMode && !isCreateOpen) return
    setActivePermissions(prev => checked ? [...prev, permissionId] : prev.filter(p => p !== permissionId))
  }

  const handleToggleModule = (moduleId: string, checked: boolean) => {
    if (!isEditMode && !isCreateOpen) return
    const mod = modules.find(m => m.id === moduleId)
    if (!mod) return
    const permIds = mod.permissions.map(p => p.id)
    setActivePermissions(prev => {
      const withoutModule = prev.filter(p => !permIds.includes(p))
      return checked ? [...withoutModule, ...permIds] : withoutModule
    })
  }

  const handleSave = async () => {
    if (!formData.name.trim()) return toast.error("Role name is required")
    setIsSubmitting(true)
    const tid = toast.loading(isCreateOpen ? "Creating role..." : "Updating role...")
    
    try {
      const url = isCreateOpen ? "/api/roles" : `/api/roles/${selectedRoleId}`
      const method = isCreateOpen ? "POST" : "PUT"
      const payload = { ...formData, permissions: activePermissions }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to save role")
      
      await fetchData() // Refresh all data to get updated counts
      
      if (isCreateOpen) {
        setSelectedRoleId(data.id)
        setIsCreateOpen(false)
      } else {
        setIsEditMode(false)
      }
      toast.success(isCreateOpen ? "Role created successfully" : "Role updated successfully", { id: tid })
    } catch (e: any) {
      toast.error(e.message, { id: tid })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this role? This action cannot be undone.")) return
    const tid = toast.loading("Deleting role...")
    try {
      const res = await fetch(`/api/roles/${id}`, { method: "DELETE" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to delete")
      
      await fetchData()
      if (selectedRoleId === id) setSelectedRoleId(roles[0]?.id || null)
      toast.success("Role deleted", { id: tid })
    } catch (e: any) {
      toast.error(e.message, { id: tid })
    }
  }

  const handleDuplicate = async (id: string) => {
    const tid = toast.loading("Duplicating role...")
    try {
      const res = await fetch(`/api/roles/${id}/duplicate`, { method: "PUT" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to duplicate")
      
      await fetchData()
      setSelectedRoleId(data.id)
      toast.success("Role duplicated", { id: tid })
    } catch (e: any) {
      toast.error(e.message, { id: tid })
    }
  }

  const handleStatusChange = async (id: string, newStatus: "Active" | "Inactive") => {
    const tid = toast.loading("Updating status...")
    try {
      const role = roles.find(r => r.id === id)
      const res = await fetch(`/api/roles/${id}`, { 
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to update")
      
      await fetchData()
      toast.success("Status updated", { id: tid })
    } catch (e: any) {
      toast.error(e.message, { id: tid })
    }
  }

  const filteredRoles = roles.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()))

  if (isLoading) {
    return <div className="flex h-[50vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>
  }

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2 mb-2">
        <h2 className="text-3xl font-bold tracking-tight">Role Management</h2>
        {isSuperAdmin && (
          <Button onClick={() => {
            setFormData({ name: "", description: "", status: "Active" })
            setActivePermissions([])
            setIsCreateOpen(true)
            setIsEditMode(false)
          }}>
            <Plus className="mr-2 h-4 w-4" />
            Create Role
          </Button>
        )}
      </div>

      {/* Dynamic Statistics */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRoles}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Roles</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeRoles}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Roles</CardTitle>
            <Lock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemRoles}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Users Assigned</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsersAssigned}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-280px)]">
        
        {/* LEFT PANE: Roles List */}
        <div className="w-full md:w-1/3 flex flex-col gap-4 border-r pr-6 overflow-y-auto">
          <Input 
            placeholder="Search roles..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          
          <div className="space-y-2">
            {filteredRoles.map((role) => (
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
                  {role.status === "Inactive" ? (
                    <Badge variant="secondary" className="text-xs">Inactive</Badge>
                  ) : role.isSystem ? (
                    <Lock className="h-3 w-3 text-muted-foreground" />
                  ) : null}
                </div>
                <div className="text-xs text-muted-foreground line-clamp-1 w-full">
                  {role.description || "No description"}
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                  <span className="flex items-center gap-1"><Users className="h-3 w-3"/> {role.userCount || 0} users</span>
                  <span className="flex items-center gap-1"><Settings className="h-3 w-3"/> {role.permissions.length} perms</span>
                </div>
              </button>
            ))}
            {filteredRoles.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No roles found.</p>}
          </div>
        </div>

        {/* RIGHT PANE: Role Details & Matrix */}
        <div className="w-full md:w-2/3 flex flex-col gap-6 overflow-y-auto pb-12">
          {isCreateOpen ? (
             <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h3 className="text-2xl font-bold">Create New Custom Role</h3>
                <p className="text-sm text-muted-foreground mt-1">Define permissions for this new role.</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                <Button onClick={handleSave} disabled={isSubmitting}>Save Role</Button>
              </div>
            </div>
          ) : selectedRole ? (
            <>
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    {selectedRole.name}
                    {selectedRole.status === "Inactive" && <Badge variant="secondary">Inactive</Badge>}
                    {isSystemRole ? (
                      <Badge variant="secondary" className="font-normal"><Lock className="w-3 h-3 mr-1"/> System Role</Badge>
                    ) : (
                      <Badge variant="outline" className="font-normal border-primary/50 text-primary">Custom Role</Badge>
                    )}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Created: {new Date(selectedRole.createdAt).toLocaleDateString()} &middot; Last updated: {new Date(selectedRole.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  {isEditMode ? (
                    <>
                      <Button variant="outline" onClick={() => setIsEditMode(false)}>Cancel</Button>
                      <Button onClick={handleSave} disabled={isSubmitting}>Save Changes</Button>
                    </>
                  ) : (
                    <>
                      {isSuperAdmin && (
                        <>
                          <Button variant="outline" onClick={() => setIsEditMode(true)}>
                            <Edit2 className="w-4 h-4 mr-2"/> Edit
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="icon"><MoreHorizontal className="w-4 h-4"/></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleDuplicate(selectedRole.id)}><Copy className="w-4 h-4 mr-2"/> Duplicate</DropdownMenuItem>
                              {!isSystemRole && (
                                <>
                                  <DropdownMenuItem onClick={() => handleStatusChange(selectedRole.id, selectedRole.status === "Active" ? "Inactive" : "Active")}>
                                    <ShieldAlert className="w-4 h-4 mr-2"/> {selectedRole.status === "Active" ? "Deactivate" : "Activate"}
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive focus:bg-destructive/10" onClick={() => handleDelete(selectedRole.id)}>
                                    <Trash2 className="w-4 h-4 mr-2"/> Delete Role
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </>
          ) : null}

          {/* Form Fields (Create or Edit Mode) */}
          {(isCreateOpen || isEditMode) && (
            <Card className="border-primary/20 bg-primary/5 shadow-none">
              <CardContent className="pt-6 grid gap-4">
                <div className="grid gap-2">
                  <Label>Role Name <span className="text-destructive">*</span></Label>
                  <Input 
                    placeholder="e.g. Finance Manager" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    disabled={isSystemRole}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Description</Label>
                  <Input 
                    placeholder="Briefly describe the purpose of this role" 
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Read-Only Description */}
          {!isCreateOpen && !isEditMode && selectedRole && (
             <div className="text-sm p-4 bg-muted/30 rounded-lg">
               <span className="font-medium">Description:</span> {selectedRole.description || "No description provided."}
             </div>
          )}

          {/* System Role Warning */}
          {isSystemRole && isEditMode && (
            <div className="flex items-start gap-3 rounded-lg border border-amber-500/20 bg-amber-500/10 p-4 text-amber-600">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium">System Role Edit Mode</p>
                <p className="text-sm opacity-90">
                  You can modify descriptions and permissions, but the core system role name cannot be changed.
                </p>
              </div>
            </div>
          )}

          {/* Permissions Matrix */}
          {(selectedRole || isCreateOpen) && (
            <div className="space-y-6 mt-4">
              <h4 className="text-lg font-semibold border-b pb-2">Permission Matrix</h4>
              {modules.map((module) => {
                const Icon = IconMap[module.iconName] || Settings
                const hasFullAccess = activePermissions.includes("*.*.*")
                
                // Check if all permissions in this module are selected
                const permIds = module.permissions.map(p => p.id)
                const isAllModuleSelected = permIds.every(id => activePermissions.includes(id)) || hasFullAccess

                return (
                  <Card key={module.id} className="shadow-none border-border/50">
                    <CardHeader className="pb-3 flex flex-row justify-between items-start">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary/10 rounded-md">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{module.title}</CardTitle>
                          <CardDescription>{module.description}</CardDescription>
                        </div>
                      </div>
                      {(isEditMode || isCreateOpen) && !hasFullAccess && (
                         <div className="flex items-center gap-2">
                           <Label className="text-xs text-muted-foreground cursor-pointer">Select All</Label>
                           <Switch 
                             checked={isAllModuleSelected}
                             onCheckedChange={c => handleToggleModule(module.id, c)}
                           />
                         </div>
                      )}
                    </CardHeader>
                    <CardContent className="grid gap-4">
                      {module.permissions.map((perm) => {
                        const isChecked = hasFullAccess || activePermissions.includes(perm.id)
                        return (
                          <div key={perm.id} className="flex items-center justify-between space-x-2 py-2 border-b last:border-0 border-border/40">
                            <div className="space-y-0.5">
                              <Label className="text-base font-medium flex items-center gap-2">
                                {perm.label}
                                {hasFullAccess && <Badge variant="outline" className="text-[10px] h-4">Inherited</Badge>}
                              </Label>
                              <p className="text-sm text-muted-foreground">{perm.desc}</p>
                            </div>
                            <Switch 
                              checked={isChecked}
                              onCheckedChange={(c) => handleTogglePermission(perm.id, c)}
                              disabled={(!isEditMode && !isCreateOpen) || hasFullAccess}
                            />
                          </div>
                        )
                      })}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
