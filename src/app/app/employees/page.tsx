"use client"

import * as React from "react"
import { Search, Plus, Filter, MoreHorizontal, ShieldAlert, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Badge } from "@/components/ui/Badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/DropdownMenu"
import { Employee } from "@/types"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/authStore"
import { toast } from "sonner"

export default function EmployeesPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [employees, setEmployees] = React.useState<Employee[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState("")

  React.useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch("/api/employees")
        if (!res.ok) {
          throw new Error("Failed to fetch employees: " + res.status)
        }
        const data = await res.json()
        setEmployees(data)
      } catch (error) {
        console.error("Failed to load employees:", error)
        // Fallback data if MSW fails to intercept
        setEmployees([
          {
            id: "user_1",
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
          },
          {
            id: "user_2",
            employeeId: "EMP-00125",
            email: "priya.sharma@safevitals.com",
            firstName: "Priya",
            lastName: "Sharma",
            status: "Active",
            roleId: "role_2",
            departmentId: "dept_1",
            teamId: "team_2",
            position: "Backend Developer",
            workScheduleId: "sch_1",
            joiningDate: "2024-01-15",
            createdAt: "2024-01-10T10:00:00Z",
            updatedAt: "2024-01-10T10:00:00Z",
          }
        ])
      } finally {
        setIsLoading(false)
      }
    }
    fetchEmployees()
  }, [])

  const filteredEmployees = employees.filter(emp => 
    emp.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Employees Directory</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Invite Employee
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, ID, or email..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <div className="flex justify-center">
                    <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredEmployees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No employees found.
                </TableCell>
              </TableRow>
            ) : (
              filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.employeeId}</TableCell>
                  <TableCell>
                    {employee.firstName} {employee.lastName}
                  </TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>
                    {employee.status === "Active" ? (
                      <Badge variant="default" className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20">
                        <ShieldAlert className="mr-1 h-3 w-3" />
                        {employee.status}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => router.push(`/app/employees/${employee.id}`)}>
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.info("Edit Assignment coming soon")}>Edit Assignment</DropdownMenuItem>
                        {user?.roleId === "role_1" && employee.roleId !== "role_1" && (
                          <DropdownMenuItem 
                            className="text-emerald-600 focus:bg-emerald-500/10 focus:text-emerald-600 font-medium"
                            onClick={async () => {
                              const tid = toast.loading("Promoting user...")
                              try {
                                await fetch(`/api/employees/${employee.id}/promote`, { method: "PUT" })
                                setEmployees(prev => prev.map(e => e.id === employee.id ? { ...e, roleId: "role_1" } : e))
                                toast.success("User promoted to Super Admin!", { id: tid })
                              } catch (e) {
                                toast.error("Failed to promote user", { id: tid })
                              }
                            }}
                          >
                            Promote to Admin
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
                          disabled={employee.status === "Suspended" || user?.roleId !== "role_1"}
                          onClick={async () => {
                            const tid = toast.loading("Suspending user...")
                            try {
                              await fetch(`/api/employees/${employee.id}/suspend`, { method: "PUT" })
                              setEmployees(prev => prev.map(e => e.id === employee.id ? { ...e, status: "Suspended" } : e))
                              toast.success("User suspended successfully", { id: tid })
                            } catch (e) {
                              toast.error("Failed to suspend user", { id: tid })
                            }
                          }}
                        >
                          Suspend Account
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
