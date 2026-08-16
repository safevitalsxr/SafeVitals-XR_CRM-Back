export const mockPermissions = [
  {
    id: "employees",
    title: "Employee Profiles",
    iconName: "users", // We'll map this string to a Lucide icon in the UI
    description: "Access and modify employee data",
    permissions: [
      { id: "employees.view.basic", label: "View Basic Details", desc: "Can see name, email, and department" },
      { id: "employees.view.private", label: "View Private Info", desc: "Can see salary, home address, and phone" },
      { id: "employees.create", label: "Create Employees", desc: "Can add new employee records" },
      { id: "employees.edit", label: "Edit Employee Data", desc: "Can modify employee records" },
      { id: "employees.delete", label: "Delete Employees", desc: "Can permanently remove employees" },
    ]
  },
  {
    id: "attendance",
    title: "Attendance & Schedules",
    iconName: "clock",
    description: "Manage workforce timing",
    permissions: [
      { id: "attendance.view", label: "View Attendance", desc: "Can see who is clocked in/out" },
      { id: "attendance.edit", label: "Modify Time Logs", desc: "Can correct or alter attendance records" },
      { id: "schedules.manage", label: "Manage Schedules", desc: "Can create or update work shifts" },
    ]
  },
  {
    id: "leave",
    title: "Leave Management",
    iconName: "calendar",
    description: "Handle time-off requests",
    permissions: [
      { id: "leave.view", label: "View Leave", desc: "Can see team leave calendar" },
      { id: "leave.request", label: "Request Leave", desc: "Can submit personal time off requests" },
      { id: "leave.approve", label: "Approve Leave", desc: "Can approve or reject team leave requests" },
    ]
  },
  {
    id: "reports",
    title: "Weekly Reports",
    iconName: "file-text",
    description: "Manage weekly progress reports",
    permissions: [
      { id: "reports.view", label: "View Reports", desc: "Can read reports submitted by others" },
      { id: "reports.submit", label: "Submit Reports", desc: "Can create and submit own reports" },
      { id: "reports.review", label: "Review Reports", desc: "Can approve or request revisions" },
    ]
  },
  {
    id: "system",
    title: "System Settings",
    iconName: "settings",
    description: "Core platform configuration",
    permissions: [
      { id: "system.audit", label: "View Audit Logs", desc: "Can see all system activity history" },
      { id: "system.roles", label: "Manage Roles", desc: "Can create and modify access permissions" },
    ]
  }
]
