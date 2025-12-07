'use client';

import { useState } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { mockCalendarEvents, mockTasks, mockSections } from '@/lib/mockData';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { cn } from '@/lib/utils';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 1, 1)); // February 2024
  const [view, setView] = useState<'month' | 'week'>('month');

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getEventsForDate = (date: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
    return mockCalendarEvents.filter(event => event.date === dateStr);
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'task':
        return 'bg-blue-500';
      case 'announcement':
        return 'bg-purple-500';
      case 'event':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getDifficultyColor = (taskId?: string) => {
    if (!taskId) return 'bg-blue-500';
    const task = mockTasks.find(t => t.id === taskId);
    if (!task) return 'bg-blue-500';
    
    switch (task.difficulty) {
      case 'Easy':
        return 'bg-green-500';
      case 'Medium':
        return 'bg-yellow-500';
      case 'Hard':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  const getSectionName = (sectionId: string) => {
    return mockSections.find(s => s.id === sectionId)?.code || 'Unknown';
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-background">
        <AppSidebar />
        
        <main className="ml-64 flex-1 p-8">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-heading-1">Calendar</h1>
                <p className="text-body text-muted-foreground mt-1">
                  Visual timeline of all deadlines and events
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={view === 'month' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setView('month')}
                >
                  Month
                </Button>
                <Button
                  variant={view === 'week' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setView('week')}
                >
                  Week
                </Button>
              </div>
            </div>

            {/* Calendar Navigation */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={previousMonth}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                      Today
                    </Button>
                    <Button variant="outline" size="sm" onClick={nextMonth}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                  {/* Day Headers */}
                  {dayNames.map((day) => (
                    <div key={day} className="text-center font-medium text-small text-muted-foreground py-2">
                      {day}
                    </div>
                  ))}
                  
                  {/* Empty cells for days before month starts */}
                  {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                    <div key={`empty-${index}`} className="min-h-[100px] border border-border rounded-md bg-muted/30" />
                  ))}
                  
                  {/* Calendar days */}
                  {Array.from({ length: daysInMonth }).map((_, index) => {
                    const date = index + 1;
                    const events = getEventsForDate(date);
                    const isToday = new Date().getDate() === date && 
                                   new Date().getMonth() === currentDate.getMonth() &&
                                   new Date().getFullYear() === currentDate.getFullYear();
                    
                    return (
                      <div
                        key={date}
                        className={cn(
                          'min-h-[100px] border border-border rounded-md p-2 space-y-1 hover:bg-accent/50 transition-colors',
                          isToday && 'border-primary border-2 bg-primary/5'
                        )}
                      >
                        <div className={cn(
                          'text-small font-medium',
                          isToday && 'text-primary font-bold'
                        )}>
                          {date}
                        </div>
                        <div className="space-y-1">
                          {events.map((event) => (
                            <div
                              key={event.id}
                              className="group relative"
                            >
                              <div className={cn(
                                'text-xs px-2 py-1 rounded truncate cursor-pointer',
                                getDifficultyColor(event.taskId),
                                'text-white hover:opacity-90'
                              )}>
                                {event.title.substring(0, 15)}...
                              </div>
                              {/* Tooltip */}
                              <div className="absolute left-0 top-full mt-1 z-10 hidden group-hover:block">
                                <div className="bg-popover text-popover-foreground border rounded-md shadow-lg p-3 w-64">
                                  <p className="font-medium text-sm">{event.title}</p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {getSectionName(event.sectionId)}
                                  </p>
                                  <Badge variant="outline" className="mt-2 text-xs">
                                    {event.type}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Deadlines</CardTitle>
                <CardDescription>Next 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockCalendarEvents
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .slice(0, 5)
                    .map((event) => {
                      const task = mockTasks.find(t => t.id === event.taskId);
                      return (
                        <div key={event.id} className="flex items-start gap-4 border-b border-border pb-3 last:border-0 last:pb-0">
                          <div className={cn(
                            'w-2 h-2 rounded-full mt-2',
                            getDifficultyColor(event.taskId)
                          )} />
                          <div className="flex-1 space-y-1">
                            <p className="text-label">{event.title}</p>
                            <div className="flex items-center gap-2 text-small text-muted-foreground">
                              <span>{event.date}</span>
                              <span>•</span>
                              <Badge variant="outline">{getSectionName(event.sectionId)}</Badge>
                              {task && (
                                <>
                                  <span>•</span>
                                  <span>{task.totalPoints} points</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>

            {/* Legend */}
            <Card>
              <CardHeader>
                <CardTitle>Color Legend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-green-500" />
                    <span className="text-small">Easy Tasks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-yellow-500" />
                    <span className="text-small">Medium Tasks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-red-500" />
                    <span className="text-small">Hard Tasks</span>
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