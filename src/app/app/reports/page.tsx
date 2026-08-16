"use client"

import * as React from "react"
import { BarChart3, Clock, CheckCircle2, AlertCircle, FileText, Download, Filter } from "lucide-react"

import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"

export default function ReportsPage() {
  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Weekly Reports</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button>
            <BarChart3 className="mr-2 h-4 w-4" />
            Submit My Report
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14</div>
            <p className="text-xs text-muted-foreground">From direct reports</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved This Week</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">Successfully processed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Missing Submissions</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">3</div>
            <p className="text-xs text-muted-foreground">Overdue</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Archived</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,204</div>
            <p className="text-xs text-muted-foreground">Historical records</p>
          </CardContent>
        </Card>
      </div>

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
            <TableRow>
              <TableCell className="font-medium">Sarah Jenkins</TableCell>
              <TableCell>Aug 10 - Aug 16</TableCell>
              <TableCell className="text-muted-foreground">Today, 09:00 AM</TableCell>
              <TableCell>42.5 hrs</TableCell>
              <TableCell><Badge variant="outline" className="text-amber-500 border-amber-500">Pending</Badge></TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="outline" size="sm" className="text-emerald-600 border-emerald-500 hover:bg-emerald-50">Approve</Button>
                <Button variant="ghost" size="sm">Review</Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Amit Patel</TableCell>
              <TableCell>Aug 10 - Aug 16</TableCell>
              <TableCell className="text-muted-foreground">Yesterday, 05:30 PM</TableCell>
              <TableCell>40.0 hrs</TableCell>
              <TableCell><Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600">Approved</Badge></TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">John Doe</TableCell>
              <TableCell>Aug 10 - Aug 16</TableCell>
              <TableCell className="text-muted-foreground">Not submitted</TableCell>
              <TableCell>--</TableCell>
              <TableCell><Badge variant="destructive">Overdue</Badge></TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm">Send Reminder</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
