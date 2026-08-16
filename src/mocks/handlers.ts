import { http, HttpResponse, delay } from "msw"
import { mockEmployees } from "./data/employees"
import { mockDepartments, mockTeams, mockRoles } from "./data/organization"
import { mockAuditLogs } from "./data/audit"
import { mockPermissions } from "./data/permissions"

const dbEmployees = [...mockEmployees]
const dbDepartments = [...mockDepartments]
const dbTeams = [...mockTeams]
const dbRoles = [...mockRoles]
const dbAuditLogs = [...mockAuditLogs]

// We will also maintain state for access requests since they were hardcoded in UI
const dbAccessRequests: any[] = []

const dbLeaveRequests: any[] = []

const dbTasks: any[] = []

const dbReports: any[] = [
  { id: "rep_1", employeeName: "Ram Kumar", week: "Aug 10 - Aug 16", submittedAt: "Yesterday, 05:30 PM", hours: 40, status: "Approved" },
  { id: "rep_2", employeeName: "Neha Gupta", week: "Aug 10 - Aug 16", submittedAt: "Today, 09:00 AM", hours: 42.5, status: "Pending" }
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

  http.put("/api/employees/:id/promote", ({ params }) => {
    const idx = dbEmployees.findIndex((e) => e.id === params.id)
    if (idx !== -1) {
      dbEmployees[idx].roleId = "role_1" // Promote to Super Admin
      addAuditLog("employee.promote", "Admin", dbEmployees[idx].id, dbEmployees[idx].firstName)
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
  // REPORTS
  // ----------------------------------------
  http.get("/api/reports", () => {
    return HttpResponse.json(dbReports)
  }),
  http.get("/api/reports/stats", () => {
    return HttpResponse.json({
      pending: dbReports.filter(r => r.status === "Pending").length,
      approved: dbReports.filter(r => r.status === "Approved").length,
      missing: 0,
      archived: 1204
    })
  }),

  // ----------------------------------------
  // ORGANIZATION & RBAC
  // ----------------------------------------
  http.get("/api/departments", async () => {
    await delay(300)
    return HttpResponse.json(dbDepartments)
  }),
  http.get("/api/teams", async () => {
    await delay(300)
    return HttpResponse.json(dbTeams)
  }),
  
  // PERMISSIONS
  http.get("/api/permissions", async () => {
    await delay(200)
    return HttpResponse.json(mockPermissions)
  }),

  // ROLES CRUD
  http.get("/api/roles", async () => {
    await delay(400)
    // calculate userCount dynamically
    const rolesWithCounts = dbRoles.map(role => ({
      ...role,
      userCount: dbEmployees.filter(e => e.roleId === role.id).length
    }))
    return HttpResponse.json(rolesWithCounts)
  }),

  http.post("/api/roles", async ({ request }) => {
    await delay(600)
    const body = await request.json() as any
    
    // Validation
    if (!body.name) {
      return HttpResponse.json({ error: "Role name is required" }, { status: 400 })
    }
    if (dbRoles.some(r => r.name.toLowerCase() === body.name.toLowerCase())) {
      return HttpResponse.json({ error: "A role with this name already exists" }, { status: 400 })
    }

    const newRole = {
      id: `role_custom_${Date.now()}`,
      name: body.name,
      description: body.description || "",
      isSystem: false,
      permissions: body.permissions || [],
      status: body.status || "Active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    dbRoles.push(newRole)
    addAuditLog("role.create", "Admin", newRole.id, newRole.name)
    return HttpResponse.json({ ...newRole, userCount: 0 })
  }),

  http.put("/api/roles/:id", async ({ params, request }) => {
    await delay(500)
    const body = await request.json() as any
    const idx = dbRoles.findIndex(r => r.id === params.id)
    
    if (idx === -1) return new HttpResponse("Not found", { status: 404 })

    // If it's a system role, we shouldn't allow changing name or status, only permissions (if even that)
    // Actually, system roles might be completely locked down or just let them edit permissions.
    // The UI currently allows saving configuration (permissions) for system roles? Wait, the prompt says "Do not modify system roles".
    if (dbRoles[idx].isSystem && (body.name !== dbRoles[idx].name || body.status !== dbRoles[idx].status)) {
       return HttpResponse.json({ error: "Cannot modify system role properties" }, { status: 403 })
    }

    dbRoles[idx] = {
      ...dbRoles[idx],
      name: body.name || dbRoles[idx].name,
      description: body.description ?? dbRoles[idx].description,
      permissions: body.permissions || dbRoles[idx].permissions,
      status: body.status || dbRoles[idx].status,
      updatedAt: new Date().toISOString()
    }

    addAuditLog("role.update", "Admin", dbRoles[idx].id, dbRoles[idx].name)
    return HttpResponse.json({ 
      ...dbRoles[idx], 
      userCount: dbEmployees.filter(e => e.roleId === dbRoles[idx].id).length 
    })
  }),

  http.delete("/api/roles/:id", async ({ params }) => {
    await delay(500)
    const idx = dbRoles.findIndex(r => r.id === params.id)
    if (idx === -1) return new HttpResponse("Not found", { status: 404 })
    
    if (dbRoles[idx].isSystem) {
      return HttpResponse.json({ error: "Cannot delete system roles" }, { status: 403 })
    }

    // Check if users are still assigned
    if (dbEmployees.some(e => e.roleId === params.id)) {
      return HttpResponse.json({ error: "Cannot delete role that has active users assigned to it" }, { status: 400 })
    }

    const deletedRole = dbRoles.splice(idx, 1)[0]
    addAuditLog("role.delete", "Admin", deletedRole.id, deletedRole.name)
    return HttpResponse.json({ success: true })
  }),

  http.put("/api/roles/:id/duplicate", async ({ params }) => {
    await delay(400)
    const role = dbRoles.find(r => r.id === params.id)
    if (!role) return new HttpResponse("Not found", { status: 404 })

    const newRole = {
      id: `role_custom_${Date.now()}`,
      name: `${role.name} (Copy)`,
      description: role.description,
      isSystem: false,
      permissions: [...role.permissions],
      status: "Active" as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    dbRoles.push(newRole)
    addAuditLog("role.duplicate", "Admin", newRole.id, newRole.name)
    return HttpResponse.json({ ...newRole, userCount: 0 })
  }),

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
