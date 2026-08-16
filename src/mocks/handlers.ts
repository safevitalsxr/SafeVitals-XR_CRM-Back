import { http, HttpResponse } from "msw"
import { mockEmployees } from "./data/employees"
import { mockDepartments, mockTeams, mockRoles } from "./data/organization"
import { mockAuditLogs } from "./data/audit"

const dbEmployees = [...mockEmployees]
const dbDepartments = [...mockDepartments]
const dbTeams = [...mockTeams]
const dbRoles = [...mockRoles]
const dbAuditLogs = [...mockAuditLogs]

// We will also maintain state for access requests since they were hardcoded in UI
const dbAccessRequests = [
  { id: "ar_1", employeeId: "EMP-00125", employeeName: "Amit Patel", requestedRole: "Department Head", reason: "Taking over Engineering lead", dateSubmitted: "Today", status: "Pending" },
  { id: "ar_2", employeeId: "EMP-00126", employeeName: "Sarah Jenkins", requestedRole: "Super Admin", reason: "Need access to system config", dateSubmitted: "Yesterday", status: "Pending" },
  { id: "ar_3", employeeId: "EMP-00124", employeeName: "Ram Kumar", requestedRole: "Standard Employee", reason: "New hire onboarding.", dateSubmitted: "Aug 12", status: "Approved" }
]

const dbLeaveRequests = [
  { id: "lr_1", employeeName: "Neha Gupta", type: "Annual Leave", duration: "3 Days", dates: "Aug 20 - Aug 22", reason: "Family vacation to Kerala", status: "Pending", submittedAt: "Today" },
  { id: "lr_2", employeeName: "Ram Kumar", type: "Sick Leave", duration: "1 Day", dates: "Aug 16", reason: "Fever and cold", status: "Pending", submittedAt: "Yesterday" },
  { id: "lr_3", employeeName: "Arjun Patel", type: "Parental Leave", duration: "14 Days", dates: "Sep 01 - Sep 14", reason: "Newborn baby care", status: "Approved", submittedAt: "Aug 10" },
  { id: "lr_4", employeeName: "Priya Sharma", type: "Unpaid Leave", duration: "2 Days", dates: "Aug 10 - Aug 11", reason: "Personal errands", status: "Rejected", submittedAt: "Aug 05" }
]

const dbTasks = [
  { id: "task_1", title: "Setup new employee workstation", assignee: "Amit Patel", dueDate: "Today", priority: "High", status: "In Progress" },
  { id: "task_2", title: "Monthly security review", assignee: "Ram Kumar", dueDate: "Aug 20", priority: "Medium", status: "To Do" },
  { id: "task_3", title: "Update payroll records", assignee: "HR Team", dueDate: "Aug 15", priority: "High", status: "Done" },
]

const addAuditLog = (action: string, actor: string, targetId?: string, targetName?: string) => {
  dbAuditLogs.unshift({
    id: `log_${Date.now()}`,
    userId: "sys",
    actorName: actor,
    action,
    targetId,
    targetName,
    ipAddress: "192.168.1.1",
    timestamp: new Date().toISOString(),
    details: {}
  } as any)
}

export const handlers = [
  // ----------------------------------------
  // AUTHENTICATION
  // ----------------------------------------
  http.post("/api/auth/login", async ({ request }) => {
    const body = await request.json() as any
    
    // The universal mock password is "Admin@123"
    if (body.password !== "Admin@123") {
      return new HttpResponse("Unauthorized", { status: 401 })
    }

    if (body.email) {
      // Find the exact user by email (no fallback)
      const user = dbEmployees.find(e => e.email === body.email)
      
      if (user) {
        addAuditLog("login", user.firstName + " " + user.lastName)
        return HttpResponse.json({
          token: "mock-jwt-token",
          user,
        })
      }
    }
    
    return new HttpResponse("Unauthorized", { status: 401 })
  }),

  // ----------------------------------------
  // EMPLOYEES
  // ----------------------------------------
  http.get("/api/employees", () => {
    return HttpResponse.json(dbEmployees)
  }),

  http.get("/api/employees/:id", ({ params }) => {
    const employee = dbEmployees.find((e) => e.id === params.id)
    if (employee) {
      return HttpResponse.json(employee)
    }
    return new HttpResponse("Not found", { status: 404 })
  }),

  http.delete("/api/employees/:id", ({ params }) => {
    const idx = dbEmployees.findIndex((e) => e.id === params.id)
    if (idx !== -1) {
      const emp = dbEmployees[idx]
      dbEmployees.splice(idx, 1)
      addAuditLog("employee.delete", "Admin", emp.id, emp.firstName)
      return HttpResponse.json({ success: true })
    }
    return new HttpResponse("Not found", { status: 404 })
  }),

  http.put("/api/employees/:id/suspend", ({ params }) => {
    const idx = dbEmployees.findIndex((e) => e.id === params.id)
    if (idx !== -1) {
      dbEmployees[idx].status = "Suspended"
      addAuditLog("employee.suspend", "Admin", dbEmployees[idx].id, dbEmployees[idx].firstName)
      return HttpResponse.json(dbEmployees[idx])
    }
    return new HttpResponse("Not found", { status: 404 })
  }),

  // ----------------------------------------
  // ACCESS REQUESTS
  // ----------------------------------------
  http.get("/api/access-requests", () => {
    return HttpResponse.json(dbAccessRequests)
  }),

  http.put("/api/access-requests/:id/approve", ({ params }) => {
    const idx = dbAccessRequests.findIndex(a => a.id === params.id)
    if (idx !== -1) {
      dbAccessRequests[idx].status = "Approved"
      addAuditLog("access_request.approve", "Admin", dbAccessRequests[idx].employeeId, dbAccessRequests[idx].employeeName)
      return HttpResponse.json(dbAccessRequests[idx])
    }
    return new HttpResponse("Not found", { status: 404 })
  }),

  http.put("/api/access-requests/:id/deny", ({ params }) => {
    const idx = dbAccessRequests.findIndex(a => a.id === params.id)
    if (idx !== -1) {
      dbAccessRequests[idx].status = "Rejected"
      addAuditLog("access_request.deny", "Admin", dbAccessRequests[idx].employeeId, dbAccessRequests[idx].employeeName)
      return HttpResponse.json(dbAccessRequests[idx])
    }
    return new HttpResponse("Not found", { status: 404 })
  }),

  // ----------------------------------------
  // LEAVE REQUESTS
  // ----------------------------------------
  http.get("/api/leave-requests", () => {
    return HttpResponse.json(dbLeaveRequests)
  }),

  http.put("/api/leave-requests/:id/approve", ({ params }) => {
    const idx = dbLeaveRequests.findIndex(a => a.id === params.id)
    if (idx !== -1) {
      dbLeaveRequests[idx].status = "Approved"
      addAuditLog("leave_request.approve", "Admin", dbLeaveRequests[idx].id, dbLeaveRequests[idx].employeeName)
      return HttpResponse.json(dbLeaveRequests[idx])
    }
    return new HttpResponse("Not found", { status: 404 })
  }),

  http.put("/api/leave-requests/:id/reject", ({ params }) => {
    const idx = dbLeaveRequests.findIndex(a => a.id === params.id)
    if (idx !== -1) {
      dbLeaveRequests[idx].status = "Rejected"
      addAuditLog("leave_request.reject", "Admin", dbLeaveRequests[idx].id, dbLeaveRequests[idx].employeeName)
      return HttpResponse.json(dbLeaveRequests[idx])
    }
    return new HttpResponse("Not found", { status: 404 })
  }),

  // ----------------------------------------
  // TASKS
  // ----------------------------------------
  http.get("/api/tasks", () => {
    return HttpResponse.json(dbTasks)
  }),

  http.put("/api/tasks/:id/status", async ({ params, request }) => {
    const idx = dbTasks.findIndex(a => a.id === params.id)
    if (idx !== -1) {
      const body = await request.json() as any
      dbTasks[idx].status = body.status
      return HttpResponse.json(dbTasks[idx])
    }
    return new HttpResponse("Not found", { status: 404 })
  }),

  http.delete("/api/tasks/:id", ({ params }) => {
    const idx = dbTasks.findIndex(a => a.id === params.id)
    if (idx !== -1) {
      dbTasks.splice(idx, 1)
      return HttpResponse.json({ success: true })
    }
    return new HttpResponse("Not found", { status: 404 })
  }),

  // ----------------------------------------
  // ORGANIZATION & RBAC
  // ----------------------------------------
  http.get("/api/departments", () => HttpResponse.json(dbDepartments)),
  http.get("/api/teams", () => HttpResponse.json(dbTeams)),
  http.get("/api/roles", () => HttpResponse.json(dbRoles)),

  // ----------------------------------------
  // SUPER ADMIN & AUDIT
  // ----------------------------------------
  http.get("/api/audit-logs", () => HttpResponse.json(dbAuditLogs)),

  http.get("/api/stats", () => {
    return HttpResponse.json({
      totalEmployees: dbEmployees.length,
      activeEmployees: dbEmployees.filter(e => e.status === "Active").length,
      workingNow: Math.floor(dbEmployees.length * 0.75),
      pendingReports: 14,
      openTickets: 5,
      totalDepartments: dbDepartments.length,
      totalTeams: dbTeams.length,
      activeRoles: dbRoles.length,
      suspendedUsers: dbEmployees.filter(e => e.status === "Suspended").length || 0
    })
  }),
]
