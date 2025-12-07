'use client';

import { useState } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Bell, FileText, Calendar, CheckCircle2, Megaphone, Trash2, Check, CheckCheck } from 'lucide-react';
import { mockNotifications } from '@/lib/mockData';
import type { Notification } from '@/types';
import { toast } from 'sonner';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { cn } from '@/lib/utils';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredNotifications = notifications.filter((notification) => {
    return typeFilter === 'all' || notification.type === typeFilter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
    toast.success('Notification marked as read');
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
    toast.success('Notification deleted');
  };

  const clearAll = () => {
    setNotifications([]);
    toast.success('All notifications cleared');
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'submission':
        return <FileText className="h-5 w-5 text-blue-600" />;
      case 'task_due':
        return <Calendar className="h-5 w-5 text-yellow-600" />;
      case 'grade_posted':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'announcement':
        return <Megaphone className="h-5 w-5 text-purple-600" />;
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'submission':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'task_due':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'grade_posted':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'announcement':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const formatType = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-background">
        <AppSidebar />
        
        <main className="ml-64 flex-1 p-8">
          <div className="mx-auto max-w-4xl space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-heading-1">Notifications</h1>
                <p className="text-body text-muted-foreground mt-1">
                  Stay updated with important events and activities
                </p>
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="px-3 py-1">
                    {unreadCount} unread
                  </Badge>
                )}
              </div>
            </div>

            {/* Actions Bar */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between gap-4">
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="submission">Submissions</SelectItem>
                      <SelectItem value="task_due">Task Due</SelectItem>
                      <SelectItem value="grade_posted">Grades Posted</SelectItem>
                      <SelectItem value="announcement">Announcements</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={markAllAsRead}>
                      <CheckCheck className="mr-2 h-4 w-4" />
                      Mark All Read
                    </Button>
                    <Button variant="outline" size="sm" onClick={clearAll}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Clear All
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notifications List */}
            <Card>
              <CardHeader>
                <CardTitle>All Notifications ({filteredNotifications.length})</CardTitle>
                <CardDescription>Recent updates and alerts</CardDescription>
              </CardHeader>
              <CardContent>
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-12">
                    <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No notifications to display</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={cn(
                          'flex items-start gap-4 p-4 rounded-lg border transition-colors',
                          notification.read
                            ? 'bg-background border-border'
                            : 'bg-accent/50 border-primary/20'
                        )}
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <p className={cn(
                                'text-label',
                                !notification.read && 'font-semibold'
                              )}>
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className={getTypeColor(notification.type)}>
                                  {formatType(notification.type)}
                                </Badge>
                                <span className="text-small text-muted-foreground">
                                  {notification.time}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsRead(notification.id)}
                                  title="Mark as read"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteNotification(notification.id)}
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notification Preferences */}
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Manage how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-label">Student Submissions</p>
                      <p className="text-small text-muted-foreground">
                        Get notified when students submit tasks
                      </p>
                    </div>
                    <input type="checkbox" defaultChecked className="h-4 w-4" />
                  </div>
                  <div className="border-t border-border pt-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="text-label">Upcoming Deadlines</p>
                        <p className="text-small text-muted-foreground">
                          Reminders for task due dates
                        </p>
                      </div>
                      <input type="checkbox" defaultChecked className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="border-t border-border pt-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="text-label">Grade Milestones</p>
                        <p className="text-small text-muted-foreground">
                          When grades are posted or updated
                        </p>
                      </div>
                      <input type="checkbox" defaultChecked className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="border-t border-border pt-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="text-label">System Announcements</p>
                        <p className="text-small text-muted-foreground">
                          Important updates and announcements
                        </p>
                      </div>
                      <input type="checkbox" className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}