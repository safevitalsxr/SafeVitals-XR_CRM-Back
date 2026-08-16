"use client"

import * as React from "react"
import { Calendar as CalendarIcon, Clock, Users, Plus, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Badge } from "@/components/ui/Badge"

export default function SchedulesPage() {
  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Work Schedules</h2>
        <div className="flex items-center space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Schedule
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Standard Shifts</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">Active templates</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <p className="text-xs text-muted-foreground">100% coverage</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Holidays</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Next 30 days</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Schedule Templates</CardTitle>
            <CardDescription>Manage global shift templates assigned to employees.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Template Name</TableHead>
                  <TableHead>Working Days</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Standard (Mon-Fri)</TableCell>
                  <TableCell>Mon, Tue, Wed, Thu, Fri</TableCell>
                  <TableCell>09:00 AM - 05:00 PM</TableCell>
                  <TableCell><Badge variant="outline">Fixed</Badge></TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Morning Shift (Mon-Sat)</TableCell>
                  <TableCell>Mon, Tue, Wed, Thu, Fri, Sat</TableCell>
                  <TableCell>06:00 AM - 02:00 PM</TableCell>
                  <TableCell><Badge variant="outline">Fixed</Badge></TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Evening Shift</TableCell>
                  <TableCell>Mon, Tue, Wed, Thu, Fri</TableCell>
                  <TableCell>02:00 PM - 10:00 PM</TableCell>
                  <TableCell><Badge variant="outline">Fixed</Badge></TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Flexible Core Hours</TableCell>
                  <TableCell>Mon, Tue, Wed, Thu, Fri</TableCell>
                  <TableCell>40 hrs/week (Core: 10AM-3PM)</TableCell>
                  <TableCell><Badge variant="secondary">Flexible</Badge></TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
