"use client"

import * as React from "react"
import { Calendar as CalendarIcon, Filter, Plus, CheckCircle2, XCircle, Clock, Info, User, FileText, CalendarRange } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/Dialog"
import { useAuthStore } from "@/stores/authStore"

type LeaveRequest = {
  id: string
  employeeName: string
  type: string
  duration: string
  dates: string
  reason: string
  status: "Pending" | "Approved" | "Rejected"
  submittedAt: string
}

export default function LeavePage() {
  const [requests, setRequests] = React.useState<LeaveRequest[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const { user } = useAuthStore()

  const [selectedRequest, setSelectedRequest] = React.useState<LeaveRequest | null>(null)
  const [isDetailOpen, setIsDetailOpen] = React.useState(false)

  // System RBAC - Only Admins/Managers can approve/deny leave requests
  const canApprove = user?.roleId === "role_1" || user?.roleId === "role_2"

  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/leave-requests")
      if (!res.ok) throw new Error("Failed to fetch")
      const data = await res.json()
      setRequests(data)
    } catch (error) {
      console.error(error)
      toast.error("Failed to load leave requests")
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    fetchRequests()
  }, [])

  const handleAction = async (id: string, action: "approve" | "reject") => {
    const tid = toast.loading(`Processing request...`)
    try {
      const res = await fetch(`/api/leave-requests/${id}/${action}`, { method: "PUT" })
      if (!res.ok) throw new Error("Failed")
      
      setRequests(prev => prev.map(req => {
        if (req.id === id) {
          return { ...req, status: action === "approve" ? "Approved" : "Rejected" }
        }
        return req
      }))

      if (selectedRequest?.id === id) {
        setSelectedRequest({ ...selectedRequest, status: action === "approve" ? "Approved" : "Rejected" })
      }
      
      toast.success(`Leave request ${action === "approve" ? "approved" : "rejected"}`, { id: tid })
    } catch (e) {
      toast.error(`Failed to process leave request`, { id: tid })
    }
  }

  const openDetails = (req: LeaveRequest) => {
    setSelectedRequest(req)
    setIsDetailOpen(true)
  }

  const pendingCount = requests.filter(r => r.status === "Pending").length
  const approvedCount = requests.filter(r => r.status === "Approved").length
  const rejectedCount = requests.filter(r => r.status === "Rejected").length

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Leave Requests</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Request
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Leave Currently</CardTitle>
            <CalendarIcon className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedCount}</div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Leave Type</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Reason</TableHead>
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
                  No leave requests found.
                </TableCell>
              </TableRow>
            ) : (
              requests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell className="font-medium">{req.employeeName}</TableCell>
                  <TableCell>{req.type}</TableCell>
                  <TableCell>{req.dates} ({req.duration})</TableCell>
                  <TableCell className="text-muted-foreground truncate max-w-[200px]" title={req.reason}>
                    {req.reason}
                  </TableCell>
                  <TableCell>
                    {req.status === "Pending" && <Badge variant="outline" className="text-amber-500 border-amber-500">Pending</Badge>}
                    {req.status === "Approved" && <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600">Approved</Badge>}
                    {req.status === "Rejected" && <Badge variant="outline" className="text-destructive border-destructive">Rejected</Badge>}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {req.status === "Pending" && canApprove ? (
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
                          onClick={() => handleAction(req.id, "reject")}
                        >
                          Reject
                        </Button>
                      </>
                    ) : (
                      <Button variant="ghost" size="sm" onClick={() => openDetails(req)}>
                        View Details
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* DETAILED VIEW DIALOG */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              Leave Request Details
              {selectedRequest?.status === "Pending" && <Badge variant="outline" className="ml-2 text-amber-500 border-amber-500">Pending</Badge>}
              {selectedRequest?.status === "Approved" && <Badge variant="default" className="ml-2 bg-emerald-500 hover:bg-emerald-600">Approved</Badge>}
              {selectedRequest?.status === "Rejected" && <Badge variant="outline" className="ml-2 text-destructive border-destructive">Rejected</Badge>}
            </DialogTitle>
            <DialogDescription>
              Submitted {selectedRequest?.submittedAt}
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground flex items-center"><User className="mr-2 w-4 h-4" /> Employee Name</p>
                  <p className="font-medium text-lg">{selectedRequest.employeeName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground flex items-center"><Info className="mr-2 w-4 h-4" /> Leave Type</p>
                  <p className="font-medium text-lg">{selectedRequest.type}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground flex items-center"><CalendarRange className="mr-2 w-4 h-4" /> Requested Dates</p>
                  <p className="font-medium text-lg">{selectedRequest.dates}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground flex items-center"><Clock className="mr-2 w-4 h-4" /> Duration</p>
                  <p className="font-medium text-lg">{selectedRequest.duration}</p>
                </div>
              </div>

              <div className="space-y-2 mt-4 p-4 rounded-md bg-muted/50 border">
                <p className="text-sm font-medium text-muted-foreground flex items-center"><FileText className="mr-2 w-4 h-4" /> Reason for Leave</p>
                <p className="text-sm leading-relaxed">{selectedRequest.reason}</p>
              </div>
            </div>
          )}

          <DialogFooter className="flex items-center justify-between w-full sm:justify-between border-t pt-4">
            <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
              Close Details
            </Button>

            {selectedRequest?.status === "Pending" && canApprove && (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="text-destructive border-destructive hover:bg-destructive/10"
                  onClick={() => handleAction(selectedRequest.id, "reject")}
                >
                  Reject Request
                </Button>
                <Button 
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => handleAction(selectedRequest.id, "approve")}
                >
                  Approve Request
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
