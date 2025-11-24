'use client';

import { useState } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Edit, CheckCircle2, Clock, AlertCircle, XCircle } from 'lucide-react';
import { mockProgress, mockStudents, mockTasks } from '@/lib/mockData';
import type { Progress } from '@/types';
import { toast } from 'sonner';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function ProgressPage() {
  const [progressList, setProgressList] = useState<Progress[]>(mockProgress);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProgress, setEditingProgress] = useState<Progress | null>(null);
  const [formData, setFormData] = useState({
    status: 'Not Started' as Progress['status'],
    score: '',
    feedback: '',
  });

  const filteredProgress = progressList.filter((progress) => {
    const student = mockStudents.find(s => s.id === progress.studentId);
    const task = mockTasks.find(t => t.id === progress.taskId);
    
    const matchesSearch = student && task && (
      `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const matchesStatus = statusFilter === 'all' || progress.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleOpenDialog = (progress: Progress) => {
    setEditingProgress(progress);
    setFormData({
      status: progress.status,
      score: progress.score?.toString() || '',
      feedback: progress.feedback || '',
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProgress) {
      setProgressList(progressList.map(p => 
        p.id === editingProgress.id 
          ? { 
              ...p, 
              status: formData.status,
              score: formData.score ? parseFloat(formData.score) : null,
              feedback: formData.feedback || null,
              updatedAt: new Date().toISOString().split('T')[0],
              submittedAt: formData.status === 'Completed' ? new Date().toISOString().split('T')[0] : p.submittedAt,
            }
          : p
      ));
      toast.success('Progress updated successfully');
    }
    
    setIsDialogOpen(false);
  };

  const getStudentName = (studentId: string) => {
    const student = mockStudents.find(s => s.id === studentId);
    return student ? `${student.firstName} ${student.lastName}` : 'Unknown';
  };

  const getTaskTitle = (taskId: string) => {
    return mockTasks.find(t => t.id === taskId)?.title || 'Unknown';
  };

  const getStatusIcon = (status: Progress['status']) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'In Progress':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'Overdue':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <XCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: Progress['status']) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-background">
      <AppSidebar />
      
      <main className="ml-64 flex-1 p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-heading-1">Progress Tracking</h1>
            <p className="text-body text-muted-foreground mt-1">
              Monitor and update student task completion and scores
            </p>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by student name or task..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Not Started">Not Started</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Progress Table */}
          <Card>
            <CardHeader>
              <CardTitle>Student-Task Progress ({filteredProgress.length})</CardTitle>
              <CardDescription>Track completion status and provide feedback</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Task</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProgress.map((progress) => (
                    <TableRow key={progress.id}>
                      <TableCell className="font-medium">
                        {getStudentName(progress.studentId)}
                      </TableCell>
                      <TableCell>
                        <p className="text-small">{getTaskTitle(progress.taskId)}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(progress.status)}
                          <Badge className={getStatusColor(progress.status)}>
                            {progress.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        {progress.score !== null ? (
                          <span className="font-medium">{progress.score}</span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-small text-muted-foreground">
                        {progress.updatedAt}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenDialog(progress)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Edit Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Update Progress</DialogTitle>
                  <DialogDescription>
                    Update student task status, score, and feedback
                  </DialogDescription>
                </DialogHeader>
                {editingProgress && (
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label>Student</Label>
                      <Input
                        value={getStudentName(editingProgress.studentId)}
                        disabled
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Task</Label>
                      <Input
                        value={getTaskTitle(editingProgress.taskId)}
                        disabled
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value: Progress['status']) => setFormData({ ...formData, status: value })}
                      >
                        <SelectTrigger id="status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Not Started">Not Started</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                          <SelectItem value="Overdue">Overdue</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="score">Score</Label>
                      <Input
                        id="score"
                        type="number"
                        value={formData.score}
                        onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                        placeholder="Enter score"
                        min="0"
                        max="100"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="feedback">Feedback</Label>
                      <Textarea
                        id="feedback"
                        value={formData.feedback}
                        onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                        placeholder="Provide feedback to the student..."
                        rows={4}
                      />
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Update Progress</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
    </ProtectedRoute>
  );
}