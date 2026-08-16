"use client"

import * as React from "react"
import { Building2, Users, Plus, LayoutGrid } from "lucide-react"

import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Department, Team } from "@/types"

export default function OrganizationPage() {
  const [departments, setDepartments] = React.useState<Department[]>([])
  const [teams, setTeams] = React.useState<Team[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptRes, teamRes] = await Promise.all([
          fetch("/api/departments"),
          fetch("/api/teams")
        ])
        const deptsData = await deptRes.json()
        const teamsData = await teamRes.json()
        setDepartments(deptsData)
        setTeams(teamsData)
      } catch (error) {
        console.error("Failed to load organization data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Organization Structure</h2>
        <div className="flex items-center space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Department
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Departments
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Teams
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teams.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {departments.map((dept) => {
          const deptTeams = teams.filter(t => t.departmentId === dept.id)
          return (
            <Card key={dept.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <LayoutGrid className="h-5 w-5 text-primary" />
                    {dept.name}
                  </CardTitle>
                  <Button variant="ghost" size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription>{dept.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Teams ({deptTeams.length})</span>
                  </div>
                  {deptTeams.length > 0 ? (
                    <div className="grid gap-2">
                      {deptTeams.map(team => (
                        <div key={team.id} className="flex items-center justify-between rounded-md border p-3 hover:bg-muted/50 transition-colors cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <Users className="h-4 w-4 text-primary" />
                            </div>
                            <span className="font-medium text-sm">{team.name}</span>
                          </div>
                          <Badge variant="secondary">Active</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">No teams in this department yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
