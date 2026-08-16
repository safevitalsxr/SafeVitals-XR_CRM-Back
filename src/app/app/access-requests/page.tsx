"use client"

import * as React from "react"
import { Filter, Search, CheckCircle2, XCircle, Clock } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Badge } from "@/components/ui/Badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { useAuthStore } from "@/stores/authStore"

type AccessRequest = {
  id: string
  employeeId: string
  employeeName: string
  requestedRole: string
  reason: string
  dateSubmitted: string
  status: "Pending" | "Approved" | "Rejected"
}

export default function AccessRequestsPage() {
  const [requests, setRequests] = React.useState<AccessRequest[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const { user } = useAuthStore()

  // Only Super Admins can approve/deny requests
  const canManage = user?.roleId === "role_1"

  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/access-requests")
      if (!res.ok) throw new Error("Failed")
      const data = await res.json()
      setRequests(data)
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    fetchRequests()
  }, [])

  const handleAction = async (id: string, action: "approve" | "deny") => {
    const toastId = toast.loading(`Processing request...`)
    try {
      const res = await fetch(`/api/access-requests/${id}/${action}`, { method: "PUT" })
      if (!res.ok) throw new Error("Failed to process")
      
      // Optimistic UI update
      setRequests(prev => prev.map(req => {
        if (req.id === id) {
          return { ...req, status: action === "approve" ? "Approved" : "Rejected" }
        }
        return req
      }))
      
      toast.success(`Request ${action === "approve" ? "approved" : "denied"} successfully`, { id: toastId })
    } catch (e) {
      toast.error(`Failed to ${action} request`, { id: toastId })
    }
  }

  const pendingCount = requests.filter(r => r.status === "Pending").length
  const approvedCount = requests.filter(r => r.status === "Approved").length
  const rejectedCount = requests.filter(r => r.status === "Rejected").length

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Access Requests</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Recently</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedCount}</div>
            <p className="text-xs text-muted-foreground">Roles successfully granted</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedCount}</div>
            <p className="text-xs text-muted-foreground">Access denied</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by employee or role..."
              className="pl-8"
            />
          </div>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Requested Role</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Date Submitted</TableHead>
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
            ) : requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No access requests found.
                </TableCell>
              </TableRow>
            ) : (
              requests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell className="font-medium">{req.employeeName}</TableCell>
                  <TableCell><Badge variant="secondary">{req.requestedRole}</Badge></TableCell>
                  <TableCell className="text-muted-foreground truncate max-w-[200px]" title={req.reason}>
                    {req.reason}
                  </TableCell>
                  <TableCell>{req.dateSubmitted}</TableCell>
                  <TableCell>
                    {req.status === "Pending" && <Badge variant="outline" className="text-amber-500 border-amber-500">Pending</Badge>}
                    {req.status === "Approved" && <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600">Approved</Badge>}
                    {req.status === "Rejected" && <Badge variant="outline" className="text-destructive border-destructive">Rejected</Badge>}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {req.status === "Pending" ? (
                      canManage ? (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-emerald-600 border-emerald-500 hover:bg-emerald-50"
                            onClick={() => handleAction(req.id, "approve")}
                          >
                            Approve
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-destructive border-destructive hover:bg-destructive/10"
                            onClick={() => handleAction(req.id, "deny")}
                          >
                            Deny
                          </Button>
                        </>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">No permission</span>
                      )
                    ) : (
                      <Button variant="ghost" size="sm">View Log</Button>
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
