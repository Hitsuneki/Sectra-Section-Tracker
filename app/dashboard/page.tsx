'use client';

import { AppSidebar } from '@/components/AppSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FolderKanban, Users, ClipboardList, TrendingUp, Clock, CheckCircle2 } from 'lucide-react';
import { mockSections, mockStudents, mockTasks, mockProgress } from '@/lib/mockData';

export default function DashboardPage() {
  const totalSections = mockSections.length;
  const totalStudents = mockStudents.length;
  const totalTasks = mockTasks.length;
  const completedTasks = mockProgress.filter(p => p.status === 'Completed').length;
  const averageCompletion = mockProgress.length > 0 
    ? Math.round((completedTasks / mockProgress.length) * 100) 
    : 0;

  const recentActivity = [
    { student: 'Emma Johnson', task: 'Introduction to Programming', action: 'Completed', time: '2 hours ago' },
    { student: 'Liam Smith', task: 'Data Structures Quiz', action: 'Submitted', time: '5 hours ago' },
    { student: 'Olivia Williams', task: 'Web Development Project', action: 'Started', time: '1 day ago' },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      
      <main className="ml-64 flex-1 p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-heading-1">Dashboard</h1>
            <p className="text-body text-muted-foreground mt-1">
              Welcome back. Here's an overview of your academic management.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-small font-medium text-muted-foreground">
                  Total Sections
                </CardTitle>
                <FolderKanban className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalSections}</div>
                <p className="text-small text-muted-foreground mt-1">
                  Active this semester
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-small font-medium text-muted-foreground">
                  Total Students
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalStudents}</div>
                <p className="text-small text-muted-foreground mt-1">
                  Across all sections
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-small font-medium text-muted-foreground">
                  Total Tasks
                </CardTitle>
                <ClipboardList className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalTasks}</div>
                <p className="text-small text-muted-foreground mt-1">
                  Assigned this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-small font-medium text-muted-foreground">
                  Avg. Completion
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{averageCompletion}%</div>
                <p className="text-small text-muted-foreground mt-1">
                  Task completion rate
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity and Sections */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest student submissions and progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-4 border-b border-border pb-4 last:border-0 last:pb-0">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary">
                        {activity.action === 'Completed' ? (
                          <CheckCircle2 className="h-4 w-4 text-success" />
                        ) : (
                          <Clock className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-label">{activity.student}</p>
                        <p className="text-small text-muted-foreground">{activity.task}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant={activity.action === 'Completed' ? 'default' : 'secondary'} className="text-xs">
                            {activity.action}
                          </Badge>
                          <span className="text-small text-muted-foreground">{activity.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Active Sections */}
            <Card>
              <CardHeader>
                <CardTitle>Active Sections</CardTitle>
                <CardDescription>Your current teaching sections</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockSections.map((section) => (
                    <div key={section.id} className="flex items-start justify-between border-b border-border pb-4 last:border-0 last:pb-0">
                      <div className="space-y-1">
                        <p className="text-label">{section.name}</p>
                        <p className="text-small text-muted-foreground">{section.code}</p>
                        <p className="text-small text-muted-foreground">{section.schedule}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-label">{section.studentCount}</p>
                        <p className="text-small text-muted-foreground">students</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}