"use client"

import * as React from "react"
import { BarChart3, Clock, CheckCircle2, AlertCircle, FileText, Download, Filter } from "lucide-react"

import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { useAuthStore } from "@/stores/authStore"
import { toast } from "sonner"

type Report = {
  id: string
  employeeName: string
  week: string
  submittedAt: string
  hours: number
  status: "Pending" | "Approved" | "Overdue"
}

export default function ReportsPage() {
  const [reports, setReports] = React.useState<Report[]>([])
  const [stats, setStats] = React.useState({ pending: 0, approved: 0, missing: 0, archived: 0 })
  const [isLoading, setIsLoading] = React.useState(true)

  const { user } = useAuthStore()
  const isStandardEmployee = user?.roleId === "role_3"
  const fullName = user ? `${user.firstName} ${user.lastName}` : "Employee"

  const fetchReports = async () => {
    try {
      const [repRes, statsRes] = await Promise.all([
        fetch("/api/reports"),
        fetch("/api/reports/stats")
      ])
      
      if (!repRes.ok || !statsRes.ok) throw new Error("Failed to load reports")
      
      const repData = await repRes.json()
      const statsData = await statsRes.json()

      if (isStandardEmployee) {
        setReports(repData.filter((r: Report) => r.employeeName === fullName))
      } else {
        setReports(repData)
      }
      setStats(statsData)
    } catch (e) {
      toast.error("Failed to load reports data")
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    fetchReports()
  }, [])

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          {isStandardEmployee ? "My Weekly Reports" : "Weekly Reports"}
        </h2>
        <div className="flex items-center space-x-2">
          {!isStandardEmployee && (
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          )}
          <Button onClick={() => toast.info("Report submission coming soon!")}>
            <BarChart3 className="mr-2 h-4 w-4" />
            Submit My Report
          </Button>
        </div>
      </div>

      {!isStandardEmployee && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">From direct reports</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved This Week</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.approved}</div>
              <p className="text-xs text-muted-foreground">Successfully processed</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Missing Submissions</CardTitle>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{stats.missing}</div>
              <p className="text-xs text-muted-foreground">Overdue</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Archived</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.archived.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Historical records</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Week</TableHead>
              <TableHead>Submitted On</TableHead>
              <TableHead>Hours Claimed</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex justify-center">
                    <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                  </div>
                </TableCell>
              </TableRow>
            ) : reports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No reports found.
                </TableCell>
              </TableRow>
            ) : (
              reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.employeeName}</TableCell>
                  <TableCell>{report.week}</TableCell>
                  <TableCell className="text-muted-foreground">{report.submittedAt}</TableCell>
                  <TableCell>{report.hours ? `${report.hours} hrs` : "--"}</TableCell>
                  <TableCell>
                    {report.status === "Pending" && <Badge variant="outline" className="text-amber-500 border-amber-500">Pending</Badge>}
                    {report.status === "Approved" && <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600">Approved</Badge>}
                    {report.status === "Overdue" && <Badge variant="destructive">Overdue</Badge>}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {report.status === "Pending" && !isStandardEmployee ? (
                      <>
                        <Button variant="outline" size="sm" className="text-emerald-600 border-emerald-500 hover:bg-emerald-50">Approve</Button>
                        <Button variant="ghost" size="sm">Review</Button>
                      </>
                    ) : report.status === "Overdue" && !isStandardEmployee ? (
                      <Button variant="outline" size="sm">Send Reminder</Button>
                    ) : (
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
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
