"use client"

import * as React from "react"
import { Clock, Filter, MapPin, Download, CheckCircle2, ShieldAlert } from "lucide-react"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Badge } from "@/components/ui/Badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { useAuthStore } from "@/stores/authStore"

export default function AttendancePage() {
  const { user } = useAuthStore()
  const isStandardEmployee = user?.roleId === "role_3"
  const fullName = user ? `${user.firstName} ${user.lastName}` : "Employee"

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          {isStandardEmployee ? "My Attendance" : "Attendance Logs"}
        </h2>
        <div className="flex items-center space-x-2">
          {!isStandardEmployee && (
            <>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </>
          )}
        </div>
      </div>

      {!isStandardEmployee && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">On Time Today</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85%</div>
              <p className="text-xs text-muted-foreground">105 employees</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Late Arrivals</CardTitle>
              <Clock className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Needs review</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Absent</CardTitle>
              <ShieldAlert className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
              <p className="text-xs text-muted-foreground">Excluding approved leave</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Check In</TableHead>
              <TableHead>Check Out</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Location</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isStandardEmployee ? (
              // Private view for standard employees
              <TableRow>
                <TableCell className="font-medium">{fullName}</TableCell>
                <TableCell>Aug 16, 2026</TableCell>
                <TableCell>08:55 AM</TableCell>
                <TableCell className="text-muted-foreground">--</TableCell>
                <TableCell><Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600">On Time</Badge></TableCell>
                <TableCell className="flex items-center gap-1 text-muted-foreground"><MapPin className="h-3 w-3"/> HQ Office</TableCell>
              </TableRow>
            ) : (
              // Global view for management
              <>
                <TableRow>
                  <TableCell className="font-medium">Ram Kumar</TableCell>
                  <TableCell>Aug 16, 2026</TableCell>
                  <TableCell>08:55 AM</TableCell>
                  <TableCell className="text-muted-foreground">--</TableCell>
                  <TableCell><Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600">On Time</Badge></TableCell>
                  <TableCell className="flex items-center gap-1 text-muted-foreground"><MapPin className="h-3 w-3"/> HQ Office</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Priya Singh</TableCell>
                  <TableCell>Aug 16, 2026</TableCell>
                  <TableCell>09:15 AM</TableCell>
                  <TableCell className="text-muted-foreground">--</TableCell>
                  <TableCell><Badge variant="outline" className="text-amber-500 border-amber-500">Late (15m)</Badge></TableCell>
                  <TableCell className="flex items-center gap-1 text-muted-foreground"><MapPin className="h-3 w-3"/> Remote (IP)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Amit Patel</TableCell>
                  <TableCell>Aug 15, 2026</TableCell>
                  <TableCell>08:50 AM</TableCell>
                  <TableCell>05:10 PM</TableCell>
                  <TableCell><Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600">On Time</Badge></TableCell>
                  <TableCell className="flex items-center gap-1 text-muted-foreground"><MapPin className="h-3 w-3"/> HQ Office</TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
