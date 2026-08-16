"use client"

import * as React from "react"
import { Save, Bell, Shield, Key, Eye, User as UserIcon } from "lucide-react"

import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Switch } from "@/components/ui/Switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { useAuthStore } from "@/stores/authStore"

export default function SettingsPage() {
  const { user } = useAuthStore()

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile" className="flex gap-2"><UserIcon className="h-4 w-4"/> Profile Details</TabsTrigger>
          <TabsTrigger value="notifications" className="flex gap-2"><Bell className="h-4 w-4"/> Notifications</TabsTrigger>
          <TabsTrigger value="security" className="flex gap-2"><Shield className="h-4 w-4"/> Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details. Changes will be reflected across Safe Vitals.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue={user?.firstName || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue={user?.lastName || ""} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input id="email" type="email" defaultValue={user?.email || ""} disabled />
                <p className="text-[0.8rem] text-muted-foreground">Your email address is managed by your organization.</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button><Save className="mr-2 h-4 w-4" /> Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose what updates you want to receive.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive weekly reports and critical alerts via email.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive real-time alerts on your devices.</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security & Access</CardTitle>
              <CardDescription>
                Manage your password and security keys.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current">Current Password</Label>
                <Input id="current" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new">New Password</Label>
                <Input id="new" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm">Confirm New Password</Label>
                <Input id="confirm" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline"><Key className="mr-2 h-4 w-4" /> Update Password</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
