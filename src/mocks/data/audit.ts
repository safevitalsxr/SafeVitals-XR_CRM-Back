export interface AuditLog {
  id: string
  timestamp: string
  actorId: string
  actorName: string
  action: string
  targetId?: string
  targetName?: string
  ipAddress: string
}

export const mockAuditLogs: AuditLog[] = [
  {
    id: "log_1",
    timestamp: "2026-08-16T09:31:00Z",
    actorId: "user_1",
    actorName: "Ram Kumar",
    action: "user.create",
    targetId: "user_6",
    targetName: "New Employee",
    ipAddress: "192.168.1.104"
  },
  {
    id: "log_2",
    timestamp: "2026-08-16T09:15:00Z",
    actorId: "user_3",
    actorName: "HR Manager",
    action: "leave.approve",
    targetId: "leave_42",
    targetName: "Leave Request",
    ipAddress: "10.0.0.55"
  },
  {
    id: "log_3",
    timestamp: "2026-08-15T18:45:00Z",
    actorId: "user_1",
    actorName: "Ram Kumar",
    action: "role.update",
    targetId: "role_3",
    targetName: "Standard Employee",
    ipAddress: "192.168.1.104"
  },
  {
    id: "log_4",
    timestamp: "2026-08-15T14:20:00Z",
    actorId: "user_2",
    actorName: "System",
    action: "user.suspend",
    targetId: "user_8",
    targetName: "Suspended User",
    ipAddress: "127.0.0.1"
  },
  {
    id: "log_5",
    timestamp: "2026-08-15T09:05:00Z",
    actorId: "user_1",
    actorName: "Ram Kumar",
    action: "auth.login",
    ipAddress: "192.168.1.104"
  }
]
