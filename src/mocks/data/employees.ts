import { Employee } from "@/types"

export const mockEmployees: Employee[] = [
  {
    id: "user_1",
    employeeId: "EMP-00124",
    email: "ram.kumar@safevitals.com",
    firstName: "Ram",
    lastName: "Kumar",
    status: "Active",
    roleId: "role_1", // Super Admin
    departmentId: "dept_1", // Engineering
    teamId: "team_1", // Full Stack
    position: "Full Stack Developer",
    workScheduleId: "sch_1",
    joiningDate: "2023-10-12",
    createdAt: "2023-10-10T10:00:00Z",
    updatedAt: "2023-10-10T10:00:00Z",
  },
  {
    id: "user_3",
    employeeId: "EMP-00126",
    email: "neha.gupta@safevitals.com",
    firstName: "Neha",
    lastName: "Gupta",
    status: "Active",
    roleId: "role_3", // Standard Employee
    departmentId: "dept_2", // HR
    teamId: "team_3", // HR Ops
    position: "HR Operations Lead",
    workScheduleId: "sch_1",
    joiningDate: "2022-05-20",
    createdAt: "2022-05-20T10:00:00Z",
    updatedAt: "2022-05-20T10:00:00Z",
  }
]
