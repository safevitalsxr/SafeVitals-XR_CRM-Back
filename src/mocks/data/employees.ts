import { Employee } from "@/types"

export const mockEmployees: Employee[] = [
  {
    id: "user_1",
    employeeId: "EMP-00124",
    email: "ram.kumar@safevitals.com",
    firstName: "Ram",
    lastName: "Kumar",
    status: "Active",
    roleId: "role_1",
    departmentId: "dept_1", // Engineering
    teamId: "team_1", // Full Stack
    position: "Full Stack Developer",
    workScheduleId: "sch_1",
    joiningDate: "2023-10-12",
    createdAt: "2023-10-10T10:00:00Z",
    updatedAt: "2023-10-10T10:00:00Z",
  },
  {
    id: "user_2",
    employeeId: "EMP-00125",
    email: "priya.sharma@safevitals.com",
    firstName: "Priya",
    lastName: "Sharma",
    status: "Active",
    roleId: "role_2",
    departmentId: "dept_1",
    teamId: "team_2", // Backend
    position: "Backend Developer",
    workScheduleId: "sch_1",
    joiningDate: "2024-01-15",
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-10T10:00:00Z",
  },
  {
    id: "user_3",
    employeeId: "EMP-00126",
    email: "neha.gupta@safevitals.com",
    firstName: "Neha",
    lastName: "Gupta",
    status: "Active",
    roleId: "role_3", // HR Executive
    departmentId: "dept_2", // HR
    teamId: "team_3", // HR Ops
    position: "HR Operations Lead",
    workScheduleId: "sch_1",
    joiningDate: "2022-05-20",
    createdAt: "2022-05-20T10:00:00Z",
    updatedAt: "2022-05-20T10:00:00Z",
  },
  {
    id: "user_4",
    employeeId: "EMP-00127",
    email: "arjun.patel@safevitals.com",
    firstName: "Arjun",
    lastName: "Patel",
    status: "Suspended",
    roleId: "role_1",
    departmentId: "dept_1",
    teamId: "team_1",
    position: "Junior Developer",
    workScheduleId: "sch_1",
    joiningDate: "2025-06-01",
    createdAt: "2025-06-01T10:00:00Z",
    updatedAt: "2025-06-01T10:00:00Z",
  },
  // We can add up to 120 mock employees here later via a script or faker.js
]
