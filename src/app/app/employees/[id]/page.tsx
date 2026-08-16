"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Mail, Phone, MapPin, Building, ShieldAlert, Ban, Trash2, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/Dialog"
import { Label } from "@/components/ui/Label"
import { Input } from "@/components/ui/Input"
import { Employee } from "@/types"
import { useAuthStore } from "@/stores/authStore"

export default function EmployeeProfilePage() {
  const params = useParams()
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const [employee, setEmployee] = React.useState<Employee | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  // Edit states
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [editEmail, setEditEmail] = React.useState("")
  const [editPhone, setEditPhone] = React.useState("")
  const [editAddress, setEditAddress] = React.useState("")

  React.useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await fetch(`/api/employees/${params.id}`)
        if (!res.ok) {
          throw new Error("Failed to fetch employee: " + res.status)
        }
        const data = await res.json()
        setEmployee(data)
        setEditEmail(data.secondaryEmail || "")
        setEditPhone(data.phone || "")
        setEditAddress(data.address || "")
      } catch (error) {
        console.error("Failed to load employee:", error)
        // Fallback data if MSW fails to intercept
        setEmployee({
            id: params.id as string,
            employeeId: "EMP-00124",
            email: "ram.kumar@safevitals.com",
            firstName: "Ram",
            lastName: "Kumar",
            status: "Active",
            roleId: "role_1",
            departmentId: "dept_1",
            teamId: "team_1",
            position: "Full Stack Developer",
            workScheduleId: "sch_1",
            joiningDate: "2023-10-12",
            createdAt: "2023-10-10T10:00:00Z",
            updatedAt: "2023-10-10T10:00:00Z",
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchEmployee()
  }, [params.id])

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!employee) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <h2 className="text-2xl font-bold">Employee not found</h2>
        <Button variant="outline" onClick={() => router.push("/app/employees")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Directory
        </Button>
      </div>
    )
  }

  const initials = `${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}`

  const handleSaveContactInfo = () => {
    // In a real app, you would make a PUT request here.
    // For now, we just update the local React state immediately to simulate a fast UI.
    setEmployee({
      ...employee,
      secondaryEmail: editEmail,
      phone: editPhone,
      address: editAddress
    })
    setIsDialogOpen(false)
  }

  return (
    <div className="flex-1 space-y-6 max-w-5xl mx-auto w-full">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/app/employees")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Employee Profile</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Summary Card */}
        <Card className="md:col-span-1 border-t-4 border-t-primary">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 mt-2">
              <Avatar className="h-24 w-24 border-4 border-background shadow-sm">
                <AvatarImage src={employee.avatarUrl} alt={employee.firstName} />
                <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-2xl">{employee.firstName} {employee.lastName}</CardTitle>
            <CardDescription className="text-sm font-medium">{employee.employeeId}</CardDescription>
            <div className="flex justify-center pt-2">
              {employee.status === "Active" ? (
                <Badge variant="default" className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20">
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  Active Account
                </Badge>
              ) : (
                <Badge variant="destructive" className="bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20">
                  <ShieldAlert className="mr-1 h-3 w-3" />
                  {employee.status} Account
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4 mt-4">
            <div className="space-y-3 text-sm">
              <div className="flex items-center text-muted-foreground">
                <Mail className="mr-2 h-4 w-4" />
                {employee.email}
              </div>
              <div className="flex items-center text-muted-foreground">
                <Building className="mr-2 h-4 w-4" />
                HQ Office
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details & Actions */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Assignment Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Department</p>
                <p className="font-medium">Engineering</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Team</p>
                <p className="font-medium">Frontend Architecture</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">System Role</p>
                <p className="font-medium">Standard Employee</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Work Schedule</p>
                <p className="font-medium">Standard (Mon-Fri)</p>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/20 px-6 py-4">
              <Button variant="outline" size="sm">Edit Assignment</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Personal contact details and emergency info.</CardDescription>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">Edit Contact Info</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Contact Information</DialogTitle>
                    <DialogDescription>
                      Make changes to your secondary contact details below.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="secondaryEmail">Secondary Email</Label>
                      <Input
                        id="secondaryEmail"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        placeholder="personal@example.com"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="address">Home Address</Label>
                      <Input
                        id="address"
                        value={editAddress}
                        onChange={(e) => setEditAddress(e.target.value)}
                        placeholder="123 Main St, City, Country"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleSaveContactInfo}>Save changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-1"><Mail className="h-3 w-3"/> Secondary Email</p>
                <p className="font-medium">{employee.secondaryEmail || "Not provided"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-1"><Phone className="h-3 w-3"/> Phone Number</p>
                <p className="font-medium">{employee.phone || "Not provided"}</p>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3"/> Home Address</p>
                <p className="font-medium">{employee.address || "Not provided"}</p>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest system logs for this employee.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 border-l-2 border-muted ml-3 pl-6 relative">
                <div className="relative">
                  <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-emerald-500 ring-4 ring-background" />
                  <p className="text-sm font-medium">Logged into system from new IP Address</p>
                  <p className="text-xs text-muted-foreground mt-1">Today, 09:05 AM</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-primary ring-4 ring-background" />
                  <p className="text-sm font-medium">Updated contact information</p>
                  <p className="text-xs text-muted-foreground mt-1">Yesterday, 14:30 PM</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-primary ring-4 ring-background" />
                  <p className="text-sm font-medium">Submitted Weekly Report #42</p>
                  <p className="text-xs text-muted-foreground mt-1">Aug 14, 17:00 PM</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/20 shadow-none">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center">
                <ShieldAlert className="mr-2 h-5 w-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>
                Lifecycle controls for this employee. These actions have immediate effect.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg bg-destructive/5 border-destructive/10">
                <div className="space-y-0.5 mb-4 sm:mb-0">
                  <p className="text-sm font-medium">Suspend Account</p>
                  <p className="text-xs text-muted-foreground">Temporarily revoke login access. Can be restored.</p>
                </div>
                <Button 
                  variant="outline" 
                  className="text-destructive hover:bg-destructive hover:text-white border-destructive/20"
                  onClick={async () => {
                    const tid = toast.loading("Suspending user...")
                    try {
                      await fetch(`/api/employees/${employee.id}/suspend`, { method: "PUT" })
                      setEmployee({ ...employee, status: "Suspended" })
                      toast.success("User suspended successfully", { id: tid })
                    } catch (e) {
                      toast.error("Failed to suspend user", { id: tid })
                    }
                  }}
                  disabled={employee.status === "Suspended" || user?.roleId !== "role_1"}
                >
                  {employee.status === "Suspended" ? "Account Suspended" : "Suspend Account"}
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg border-destructive/10">
                <div className="space-y-0.5 mb-4 sm:mb-0">
                  <p className="text-sm font-medium">Delete Employee Data</p>
                  <p className="text-xs text-muted-foreground">Permanently remove this user. This action cannot be undone.</p>
                </div>
                <Button 
                  variant="destructive"
                  disabled={user?.roleId !== "role_1"}
                  onClick={async () => {
                    if (!confirm(`Are you sure you want to permanently delete ${employee.firstName}?`)) return
                    const tid = toast.loading("Deleting user...")
                    try {
                      await fetch(`/api/employees/${employee.id}`, { method: "DELETE" })
                      toast.success("User deleted", { id: tid })
                      router.push("/app/employees")
                    } catch (e) {
                      toast.error("Failed to delete user", { id: tid })
                    }
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Hard Delete
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}
