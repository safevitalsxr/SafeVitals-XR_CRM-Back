"use client"

import * as React from "react"
import { CheckSquare, Clock, Filter, Plus, User, Calendar, MoreHorizontal, Trash2, Edit2, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/DropdownMenu"

type Task = {
  id: string
  title: string
  assignee: string
  dueDate: string
  priority: "High" | "Medium" | "Low"
  status: "To Do" | "In Progress" | "Done"
}

export default function TasksPage() {
  const [tasks, setTasks] = React.useState<Task[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks")
      if (!res.ok) throw new Error("Failed")
      const data = await res.json()
      setTasks(data)
    } catch (e) {
      toast.error("Failed to fetch tasks")
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    fetchTasks()
  }, [])

  const updateStatus = async (id: string, newStatus: string) => {
    const tid = toast.loading("Updating status...")
    try {
      const res = await fetch(`/api/tasks/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      })
      if (!res.ok) throw new Error("Failed")
      setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus as any } : t))
      toast.success("Task updated", { id: tid })
    } catch (e) {
      toast.error("Failed to update status", { id: tid })
    }
  }

  const deleteTask = async (id: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return
    const tid = toast.loading("Deleting task...")
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed")
      setTasks(prev => prev.filter(t => t.id !== id))
      toast.success("Task deleted", { id: tid })
    } catch (e) {
      toast.error("Failed to delete task", { id: tid })
    }
  }

  const todoCount = tasks.filter(t => t.status === "To Do").length
  const inProgressCount = tasks.filter(t => t.status === "In Progress").length
  const doneCount = tasks.filter(t => t.status === "Done").length

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Task Management</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button onClick={() => toast.info("Create Task modal coming soon!")}>
            <Plus className="mr-2 h-4 w-4" />
            Create Task
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">To Do</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todoCount}</div>
            <p className="text-xs text-muted-foreground">Assigned across teams</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressCount}</div>
            <p className="text-xs text-muted-foreground">Currently being worked on</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{doneCount}</div>
            <p className="text-xs text-muted-foreground">Finished tasks</p>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task Title</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Priority</TableHead>
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
            ) : tasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No tasks found.
                </TableCell>
              </TableRow>
            ) : (
              tasks.map(task => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.title}</TableCell>
                  <TableCell className="flex items-center gap-2"><User className="h-3 w-3 text-muted-foreground"/> {task.assignee}</TableCell>
                  <TableCell className="text-muted-foreground"><Calendar className="inline mr-1 h-3 w-3"/> {task.dueDate}</TableCell>
                  <TableCell>
                    {task.priority === "High" && <Badge variant="destructive">High</Badge>}
                    {task.priority === "Medium" && <Badge variant="outline" className="text-amber-500 border-amber-500">Medium</Badge>}
                    {task.priority === "Low" && <Badge variant="secondary">Low</Badge>}
                  </TableCell>
                  <TableCell>
                    {task.status === "To Do" && <Badge variant="secondary">To Do</Badge>}
                    {task.status === "In Progress" && <Badge variant="outline" className="text-blue-500 border-blue-500">In Progress</Badge>}
                    {task.status === "Done" && <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600">Done</Badge>}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4"/></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => updateStatus(task.id, "To Do")}>Mark as To Do</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateStatus(task.id, "In Progress")}>Mark as In Progress</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateStatus(task.id, "Done")}>Mark as Done</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => toast.info("Edit modal coming soon")}><Edit2 className="w-4 h-4 mr-2"/> Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:bg-destructive focus:text-destructive-foreground" onClick={() => deleteTask(task.id)}>
                          <Trash2 className="w-4 h-4 mr-2"/> Delete Task
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
