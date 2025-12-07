'use client';

import { useState } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Download, Check, X, Clock } from 'lucide-react';
import { mockAttendance, mockStudents, mockSections } from '@/lib/mockData';
import type { AttendanceRecord } from '@/types';
import { toast } from 'sonner';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { cn } from '@/lib/utils';

export default function AttendancePage() {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(mockAttendance);
  const [sectionFilter, setSectionFilter] = useState<string>('1');
  const [selectedDate, setSelectedDate] = useState('2024-02-14');

  // Get unique dates for the selected section
  const dates = Array.from(new Set(
    attendance
      .filter(a => a.sectionId === sectionFilter)
      .map(a => a.date)
  )).sort();

  // Get students for the selected section
  const students = mockStudents.filter(s => s.sectionId === sectionFilter);

  const getAttendanceStatus = (studentId: string, date: string): 'Present' | 'Absent' | 'Late' | null => {
    const record = attendance.find(
      a => a.studentId === studentId && a.date === date && a.sectionId === sectionFilter
    );
    return record ? record.status : null;
  };

  const updateAttendance = (studentId: string, date: string, status: 'Present' | 'Absent' | 'Late') => {
    const existingRecord = attendance.find(
      a => a.studentId === studentId && a.date === date && a.sectionId === sectionFilter
    );

    if (existingRecord) {
      setAttendance(attendance.map(a =>
        a.id === existingRecord.id ? { ...a, status } : a
      ));
    } else {
      const newRecord: AttendanceRecord = {
        id: String(attendance.length + 1),
        date,
        sectionId: sectionFilter,
        studentId,
        status,
      };
      setAttendance([...attendance, newRecord]);
    }
    toast.success('Attendance updated');
  };

  const markAllPresent = () => {
    students.forEach(student => {
      updateAttendance(student.id, selectedDate, 'Present');
    });
    toast.success('All students marked present');
  };

  const getAttendancePercentage = (studentId: string): number => {
    const studentAttendance = attendance.filter(
      a => a.studentId === studentId && a.sectionId === sectionFilter
    );
    const presentCount = studentAttendance.filter(a => a.status === 'Present').length;
    return studentAttendance.length > 0
      ? Math.round((presentCount / studentAttendance.length) * 100)
      : 0;
  };

  const handleExport = () => {
    toast.success('Attendance exported to CSV');
  };

  const getStatusIcon = (status: 'Present' | 'Absent' | 'Late' | null) => {
    switch (status) {
      case 'Present':
        return <Check className="h-4 w-4 text-green-600" />;
      case 'Absent':
        return <X className="h-4 w-4 text-red-600" />;
      case 'Late':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: 'Present' | 'Absent' | 'Late' | null) => {
    switch (status) {
      case 'Present':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'Absent':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      case 'Late':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400';
    }
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
                <h1 className="text-heading-1">Attendance</h1>
                <p className="text-body text-muted-foreground mt-1">
                  Track and manage student attendance
                </p>
              </div>
              <Button onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </Button>
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <Select value={sectionFilter} onValueChange={setSectionFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockSections.map((section) => (
                        <SelectItem key={section.id} value={section.id}>
                          {section.name} ({section.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                  <Button onClick={markAllPresent} variant="outline">
                    Mark All Present
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Attendance Grid */}
            <Card>
              <CardHeader>
                <CardTitle>Attendance for {selectedDate}</CardTitle>
                <CardDescription>Click on cells to update attendance status</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[200px]">Student Name</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => {
                      const status = getAttendanceStatus(student.id, selectedDate);
                      return (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">
                            {student.firstName} {student.lastName}
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-2">
                              {getStatusIcon(status)}
                              <span className={cn(
                                'inline-flex items-center justify-center rounded-md px-3 py-1 text-sm font-medium',
                                getStatusColor(status)
                              )}>
                                {status || 'Not Marked'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateAttendance(student.id, selectedDate, 'Present')}
                                className={status === 'Present' ? 'bg-green-100 dark:bg-green-900/30' : ''}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateAttendance(student.id, selectedDate, 'Late')}
                                className={status === 'Late' ? 'bg-yellow-100 dark:bg-yellow-900/30' : ''}
                              >
                                <Clock className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateAttendance(student.id, selectedDate, 'Absent')}
                                className={status === 'Absent' ? 'bg-red-100 dark:bg-red-900/30' : ''}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Attendance Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Attendance Summary</CardTitle>
                <CardDescription>Overall attendance percentage by student</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student Name</TableHead>
                      <TableHead className="text-center">Total Classes</TableHead>
                      <TableHead className="text-center">Present</TableHead>
                      <TableHead className="text-center">Absent</TableHead>
                      <TableHead className="text-center">Late</TableHead>
                      <TableHead className="text-center">Attendance %</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => {
                      const studentAttendance = attendance.filter(
                        a => a.studentId === student.id && a.sectionId === sectionFilter
                      );
                      const presentCount = studentAttendance.filter(a => a.status === 'Present').length;
                      const absentCount = studentAttendance.filter(a => a.status === 'Absent').length;
                      const lateCount = studentAttendance.filter(a => a.status === 'Late').length;
                      const percentage = getAttendancePercentage(student.id);

                      return (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">
                            {student.firstName} {student.lastName}
                          </TableCell>
                          <TableCell className="text-center">{studentAttendance.length}</TableCell>
                          <TableCell className="text-center">
                            <span className="text-green-600 font-medium">{presentCount}</span>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="text-red-600 font-medium">{absentCount}</span>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="text-yellow-600 font-medium">{lateCount}</span>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className={cn(
                              'font-bold',
                              percentage >= 90 ? 'text-green-600' :
                              percentage >= 75 ? 'text-yellow-600' :
                              'text-red-600'
                            )}>
                              {percentage}%
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}