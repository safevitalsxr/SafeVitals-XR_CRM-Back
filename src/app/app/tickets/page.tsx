"use client"

import * as React from "react"
import { Search, Filter, Plus, MessageSquare, AlertTriangle, Clock } from "lucide-react"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Badge } from "@/components/ui/Badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"

export default function TicketsPage() {
  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Support Tickets</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Ticket
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search ticket subjects or IDs..."
              className="pl-8"
            />
          </div>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket ID</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Submitted By</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="cursor-pointer hover:bg-muted/50">
              <TableCell className="font-medium font-mono text-xs">TCK-00142</TableCell>
              <TableCell className="font-medium">VPN Access not working from home</TableCell>
              <TableCell>Sarah Jenkins</TableCell>
              <TableCell><Badge variant="destructive">High</Badge></TableCell>
              <TableCell><Badge variant="outline" className="text-amber-500 border-amber-500">Open</Badge></TableCell>
              <TableCell className="text-muted-foreground">10 mins ago</TableCell>
            </TableRow>
            <TableRow className="cursor-pointer hover:bg-muted/50">
              <TableCell className="font-medium font-mono text-xs">TCK-00141</TableCell>
              <TableCell className="font-medium">Requesting new monitor</TableCell>
              <TableCell>Ram Kumar</TableCell>
              <TableCell><Badge variant="outline" className="text-blue-500 border-blue-500">Low</Badge></TableCell>
              <TableCell><Badge variant="outline" className="text-blue-500 border-blue-500">In Progress</Badge></TableCell>
              <TableCell className="text-muted-foreground">2 hours ago</TableCell>
            </TableRow>
            <TableRow className="cursor-pointer hover:bg-muted/50">
              <TableCell className="font-medium font-mono text-xs">TCK-00139</TableCell>
              <TableCell className="font-medium">Payroll discrepancy in last check</TableCell>
              <TableCell>Amit Patel</TableCell>
              <TableCell><Badge variant="destructive">Critical</Badge></TableCell>
              <TableCell><Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600">Resolved</Badge></TableCell>
              <TableCell className="text-muted-foreground">Yesterday</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
