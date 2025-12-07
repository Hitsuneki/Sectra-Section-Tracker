'use client';

import { useState } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download } from 'lucide-react';
import { mockStudents, mockTasks, mockGrades, mockSections, calculateLetterGrade, getGradeColor } from '@/lib/mockData';
import type { Grade } from '@/types';
import { toast } from 'sonner';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { cn } from '@/lib/utils';

export default function GradebookPage() {
  const [grades, setGrades] = useState<Grade[]>(mockGrades);
  const [sectionFilter, setSectionFilter] = useState<string>('all');
  const [editingCell, setEditingCell] = useState<{ studentId: string; taskId: string } | null>(null);
  const [editValue, setEditValue] = useState('');

  // Filter students and tasks by section
  const filteredStudents = sectionFilter === 'all' 
    ? mockStudents 
    : mockStudents.filter(s => s.sectionId === sectionFilter);
  
  const filteredTasks = sectionFilter === 'all'
    ? mockTasks
    : mockTasks.filter(t => t.sectionId === sectionFilter);

  const getGrade = (studentId: string, taskId: string): Grade | undefined => {
    return grades.find(g => g.studentId === studentId && g.taskId === taskId);
  };

  const getStudentTotal = (studentId: string): { total: number; max: number; percentage: number } => {
    const studentGrades = grades.filter(g => g.studentId === studentId);
    const total = studentGrades.reduce((sum, g) => sum + g.score, 0);
    const max = studentGrades.reduce((sum, g) => sum + g.maxScore, 0);
    const percentage = max > 0 ? Math.round((total / max) * 100) : 0;
    return { total, max, percentage };
  };

  const handleCellClick = (studentId: string, taskId: string, currentScore?: number) => {
    setEditingCell({ studentId, taskId });
    setEditValue(currentScore?.toString() || '');
  };

  const handleCellBlur = () => {
    if (editingCell) {
      const score = parseInt(editValue) || 0;
      const task = mockTasks.find(t => t.id === editingCell.taskId);
      
      if (task) {
        const percentage = Math.round((score / task.totalPoints) * 100);
        const letterGrade = calculateLetterGrade(percentage);
        
        const existingGrade = getGrade(editingCell.studentId, editingCell.taskId);
        
        if (existingGrade) {
          setGrades(grades.map(g =>
            g.studentId === editingCell.studentId && g.taskId === editingCell.taskId
              ? { ...g, score, percentage, letterGrade }
              : g
          ));
        } else {
          setGrades([...grades, {
            studentId: editingCell.studentId,
            taskId: editingCell.taskId,
            score,
            maxScore: task.totalPoints,
            percentage,
            letterGrade,
          }]);
        }
        
        toast.success('Grade updated successfully');
      }
    }
    setEditingCell(null);
  };

  const handleExport = () => {
    toast.success('Gradebook exported to CSV');
  };

  const getScoreColor = (percentage: number): string => {
    if (percentage >= 90) return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
    if (percentage >= 80) return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
    if (percentage >= 70) return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
    if (percentage >= 60) return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300';
    return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-background">
        <AppSidebar />
        
        <main className="ml-64 flex-1 p-8">
          <div className="mx-auto max-w-full space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-heading-1">Gradebook</h1>
                <p className="text-body text-muted-foreground mt-1">
                  Comprehensive grade management and tracking
                </p>
              </div>
              <Button onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export to CSV
              </Button>
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Select value={sectionFilter} onValueChange={setSectionFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by section" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sections</SelectItem>
                        {mockSections.map((section) => (
                          <SelectItem key={section.id} value={section.id}>
                            {section.name} ({section.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Gradebook Matrix */}
            <Card>
              <CardHeader>
                <CardTitle>Grade Matrix</CardTitle>
                <CardDescription>Click on any cell to edit grades. Color-coded by performance.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="sticky left-0 bg-background z-10 min-w-[200px]">Student</TableHead>
                        <TableHead className="min-w-[100px]">Student ID</TableHead>
                        {filteredTasks.map((task) => (
                          <TableHead key={task.id} className="min-w-[120px] text-center">
                            <div className="space-y-1">
                              <div className="font-medium">{task.title.substring(0, 20)}...</div>
                              <div className="text-xs text-muted-foreground">/{task.totalPoints}</div>
                            </div>
                          </TableHead>
                        ))}
                        <TableHead className="min-w-[100px] text-center font-bold">Total</TableHead>
                        <TableHead className="min-w-[80px] text-center font-bold">Grade</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.map((student) => {
                        const { total, max, percentage } = getStudentTotal(student.id);
                        const letterGrade = calculateLetterGrade(percentage);
                        
                        return (
                          <TableRow key={student.id}>
                            <TableCell className="sticky left-0 bg-background z-10 font-medium">
                              {student.firstName} {student.lastName}
                            </TableCell>
                            <TableCell className="text-small text-muted-foreground">
                              {student.studentId}
                            </TableCell>
                            {filteredTasks.map((task) => {
                              const grade = getGrade(student.id, task.id);
                              const isEditing = editingCell?.studentId === student.id && editingCell?.taskId === task.id;
                              
                              return (
                                <TableCell 
                                  key={task.id} 
                                  className="text-center cursor-pointer hover:bg-accent/50"
                                  onClick={() => handleCellClick(student.id, task.id, grade?.score)}
                                >
                                  {isEditing ? (
                                    <input
                                      type="number"
                                      value={editValue}
                                      onChange={(e) => setEditValue(e.target.value)}
                                      onBlur={handleCellBlur}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleCellBlur();
                                        if (e.key === 'Escape') setEditingCell(null);
                                      }}
                                      className="w-full text-center border rounded px-2 py-1"
                                      autoFocus
                                      max={task.totalPoints}
                                      min={0}
                                    />
                                  ) : grade ? (
                                    <div className={cn(
                                      'inline-flex items-center justify-center rounded-md px-3 py-1 font-medium',
                                      getScoreColor(grade.percentage)
                                    )}>
                                      {grade.score}
                                    </div>
                                  ) : (
                                    <span className="text-muted-foreground">-</span>
                                  )}
                                </TableCell>
                              );
                            })}
                            <TableCell className="text-center font-bold">
                              <div className="space-y-1">
                                <div>{total}/{max}</div>
                                <div className={cn('text-xs', getGradeColor(percentage))}>
                                  {percentage}%
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className={cn(
                                'inline-flex items-center justify-center rounded-full px-3 py-1 font-bold text-sm',
                                getScoreColor(percentage)
                              )}>
                                {letterGrade}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Legend */}
            <Card>
              <CardHeader>
                <CardTitle>Grade Legend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700" />
                    <span className="text-small">A (90-100%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700" />
                    <span className="text-small">B (80-89%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700" />
                    <span className="text-small">C (70-79%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-orange-100 dark:bg-orange-900/30 border border-orange-300 dark:border-orange-700" />
                    <span className="text-small">D (60-69%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700" />
                    <span className="text-small">F (&lt;60%)</span>
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