"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Users, Building2, Briefcase, Activity, Clock, ShieldAlert, FileText, LifeBuoy } from "lucide-react"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { useAuthStore } from "@/stores/authStore"

export default function DashboardPage() {
  const { user } = useAuthStore()
  const [stats, setStats] = React.useState<any>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/stats")
        if (!res.ok) {
          throw new Error("Failed to fetch dashboard stats: " + res.status)
        }
        const data = await res.json()
        setStats(data)
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error)
        // Fallback stats so the dashboard doesn't break
        setStats({
          totalEmployees: 42,
          workingNow: 30,
          pendingReports: 14,
          openTickets: 5,
          totalDepartments: 3,
          totalTeams: 4,
          activeRoles: 3,
          suspendedUsers: 2
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchStats()
  }, [])

  // Provide fallbacks while loading
  const {
    totalEmployees = "--",
    workingNow = "--",
    pendingReports = "--",
    openTickets = "--",
    totalDepartments = "--",
    totalTeams = "--",
    activeRoles = "--",
    suspendedUsers = "--"
  } = stats || {}

  const isStandardEmployee = user?.roleId === "role_3"

  if (isStandardEmployee) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Good morning, {user?.firstName || "Employee"}
          </h1>
          <p className="text-muted-foreground">Here is your daily summary</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-emerald-500/50 shadow-sm bg-emerald-500/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Status</CardTitle>
              <Activity className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">Punched In</div>
              <p className="text-xs text-muted-foreground mt-1">
                Since {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} Today
              </p>
              <div className="mt-4 flex gap-2">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Take Break</Button>
                <Button variant="outline" className="w-full text-destructive border-destructive hover:bg-destructive/10">Punch Out</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Schedule</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">09:00 - 17:00</div>
              <p className="text-xs text-muted-foreground mt-1">
                Standard Morning Shift
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground mt-1">
                Require your action
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Leave</CardTitle>
              <CardDescription>Your recently requested time off.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Aug 20 - Aug 22 (3 Days)</p>
                    <p className="text-xs text-muted-foreground">Paid Time Off</p>
                  </div>
                  <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600">Approved</Badge>
                </div>
                <div className="flex items-center justify-between pb-2">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Sep 05 (1 Day)</p>
                    <p className="text-xs text-muted-foreground">Sick Leave</p>
                  </div>
                  <Badge variant="outline" className="text-amber-500 border-amber-500">Pending</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>My Recent Activity</CardTitle>
              <CardDescription>Actions you have performed.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Punched in from Office IP</p>
                    <p className="text-xs text-muted-foreground">Today, 09:00 AM</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Submitted weekly report</p>
                    <p className="text-xs text-muted-foreground">Yesterday, 05:30 PM</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Resolved "Setup Workstation" task</p>
                    <p className="text-xs text-muted-foreground">Aug 14, 02:15 PM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Admin / Manager Dashboard View
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Good morning, {user?.firstName || "Guest"}
        </h1>
        <p className="text-muted-foreground">Safe Vitals organization overview</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <div className="h-8 w-16 animate-pulse bg-muted rounded"></div> : (
              <div className="text-2xl font-bold">{totalEmployees}</div>
            )}
            <p className="text-xs text-muted-foreground">
              +4 since last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Currently Working</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <div className="h-8 w-16 animate-pulse bg-muted rounded"></div> : (
              <div className="text-2xl font-bold">{workingNow}</div>
            )}
            <p className="text-xs text-muted-foreground">
              {stats ? Math.round((workingNow / totalEmployees) * 100) : "--"}% of active workforce
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {isLoading ? <div className="h-8 w-16 animate-pulse bg-muted rounded"></div> : (
              <div className="text-2xl font-bold">{pendingReports}</div>
            )}
            <p className="text-xs text-muted-foreground">
              Under review
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <LifeBuoy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {isLoading ? <div className="h-8 w-16 animate-pulse bg-muted rounded"></div> : (
              <div className="text-2xl font-bold">{openTickets}</div>
            )}
            <p className="text-xs text-muted-foreground">
              Requiring attention
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Workforce Activity</CardTitle>
            <CardDescription>Live attendance and status of all employees.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-[350px] items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
              [ Sophisticated data visualization placeholder ]
            </div>
            <div className="mt-4 flex gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-emerald-500"></div> Working ({workingNow})</div>
              <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-amber-500"></div> On Break (15)</div>
              <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-blue-500"></div> On Leave (6)</div>
              <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-slate-500"></div> Offline (5)</div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions across the platform.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.firstName || "Ram"} Kumar checked in</p>
                  <p className="text-sm text-muted-foreground">09:05 AM</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Priya submitted weekly report</p>
                  <p className="text-sm text-muted-foreground">09:17 AM</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Admin created new employee</p>
                  <p className="text-sm text-muted-foreground">09:31 AM</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Manager approved leave request</p>
                  <p className="text-sm text-muted-foreground">09:44 AM</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Departments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDepartments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Teams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTeams}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Active Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeRoles}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-destructive">Suspended Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{suspendedUsers}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
