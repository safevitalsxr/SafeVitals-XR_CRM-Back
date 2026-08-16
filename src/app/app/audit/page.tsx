"use client"

import * as React from "react"
import { Search, Filter, ShieldAlert, Activity, User, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Badge } from "@/components/ui/Badge"
import { AuditLog } from "@/mocks/data/audit"

export default function AuditLogsPage() {
  const [logs, setLogs] = React.useState<AuditLog[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState("")

  React.useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch("/api/audit-logs")
        if (!res.ok) {
          throw new Error("Failed to fetch audit logs: " + res.status)
        }
        const data = await res.json()
        setLogs(data)
      } catch (error) {
        console.error("Failed to fetch audit logs", error)
        // Fallback data if MSW fails to intercept
        setLogs([
          {
            id: "log_1",
            timestamp: "2026-08-16T09:00:00Z",
            actorId: "user_1",
            actorName: "Ram Kumar",
            action: "login",
            ipAddress: "192.168.1.1"
          },
          {
            id: "log_2",
            timestamp: "2026-08-16T09:30:00Z",
            actorId: "user_1",
            actorName: "Ram Kumar",
            action: "user.suspend",
            targetId: "user_4",
            targetName: "Arjun Patel",
            ipAddress: "192.168.1.1"
          }
        ])
      } finally {
        setIsLoading(false)
      }
    }
    fetchLogs()
  }, [])

  const filteredLogs = logs.filter(log => 
    log.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.targetName?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const renderActionBadge = (action: string) => {
    if (action.includes("suspend") || action.includes("delete")) {
      return <Badge variant="destructive" className="font-mono text-[10px]"><ShieldAlert className="w-3 h-3 mr-1"/> {action}</Badge>
    }
    if (action.includes("create") || action.includes("approve")) {
      return <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600 font-mono text-[10px]"><ShieldCheck className="w-3 h-3 mr-1"/> {action}</Badge>
    }
    return <Badge variant="secondary" className="font-mono text-[10px]"><Activity className="w-3 h-3 mr-1"/> {action}</Badge>
  }

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Audit Logs</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter Range
          </Button>
          <Button variant="outline">Export CSV</Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search actor, action, or target..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Timestamp</TableHead>
              <TableHead>Actor</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Target</TableHead>
              <TableHead className="text-right">IP Address</TableHead>
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
            ) : filteredLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No audit logs match your search.
                </TableCell>
              </TableRow>
            ) : (
              filteredLogs.map((log) => (
                <TableRow key={log.id} className="text-sm">
                  <TableCell className="font-mono text-muted-foreground text-xs whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted">
                        <User className="h-3 w-3" />
                      </div>
                      <span className="font-medium">{log.actorName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {renderActionBadge(log.action)}
                  </TableCell>
                  <TableCell>
                    {log.targetName ? (
                      <span className="text-muted-foreground">{log.targetName} <span className="text-xs opacity-50">({log.targetId})</span></span>
                    ) : (
                      <span className="text-muted-foreground italic">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs text-muted-foreground">
                    {log.ipAddress}
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
