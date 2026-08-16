import { Department, Team, Role } from "@/types"

export const mockDepartments: Department[] = [
  { id: "dept_1", name: "Engineering", description: "Product Development & IT Infrastructure", managerId: "user_1" },
  { id: "dept_2", name: "Human Resources", description: "Talent, People Ops, & Payroll", managerId: "user_3" },
  { id: "dept_3", name: "Sales", description: "Outbound and Inbound Sales", managerId: "user_5" },
]

export const mockTeams: Team[] = [
  { id: "team_1", departmentId: "dept_1", name: "Frontend Architecture", leadId: "user_1" },
  { id: "team_2", departmentId: "dept_1", name: "Backend APIs", leadId: "user_2" },
  { id: "team_3", departmentId: "dept_2", name: "Recruiting", leadId: "user_3" },
  { id: "team_4", departmentId: "dept_3", name: "Enterprise Sales", leadId: "user_5" },
]

export const mockRoles: Role[] = [
  {
    id: "role_1",
    name: "Super Admin",
    description: "Unrestricted access to the entire organization",
    isSystem: true,
    permissions: ["*.*.*"],
    status: "Active",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z"
  },
  {
    id: "role_2",
    name: "Department Head",
    description: "Can manage all teams and employees within their department",
    isSystem: true,
    permissions: ["employees.view.department", "attendance.view.department", "reports.review.department"],
    status: "Active",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z"
  },
  {
    id: "role_3",
    name: "Standard Employee",
    description: "Default role for all new employees",
    isSystem: true,
    permissions: ["employees.view.own", "attendance.view.own", "reports.submit.own"],
    status: "Active",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z"
  }
]
