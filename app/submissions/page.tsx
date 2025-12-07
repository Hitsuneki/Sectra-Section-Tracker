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
import { Download, Eye, FileText, Search } from 'lucide-react';
import { mockSubmissions, mockSections, getStudentName, getTaskTitle } from '@/lib/mockData';
import type { Submission } from '@/types';
import { toast } from 'sonner';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>(mockSubmissions);
  const [searchTerm, setSearchTerm] = useState('');
  const [sectionFilter, setSectionFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isGradeDialogOpen, setIsGradeDialogOpen] = useState(false);
  const [gradingSubmission, setGradingSubmission] = useState<Submission | null>(null);
  const [gradeData, setGradeData] = useState({
    score: '',
    feedback: '',
  });

  const filteredSubmissions = submissions.filter((submission) => {
    const studentName = getStudentName(submission.studentId);
    const taskTitle = getTaskTitle(submission.taskId);
    
    const matchesSearch =
      studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      taskTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || submission.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleOpenGradeDialog = (submission: Submission) => {
    setGradingSubmission(submission);
    setGradeData({
      score: submission.score?.toString() || '',
      feedback: submission.feedback || '',
    });
    setIsGradeDialogOpen(true);
  };

  const handleSubmitGrade = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (gradingSubmission) {
      setSubmissions(submissions.map(s =>
        s.id === gradingSubmission.id
          ? {
              ...s,
              score: parseInt(gradeData.score),
              feedback: gradeData.feedback,
              status: 'Graded' as const,
            }
          : s
      ));
      toast.success('Grade submitted successfully');
    }
    
    setIsGradeDialogOpen(false);
  };

  const handleBulkDownload = () => {
    toast.success('Downloading all submissions...');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
                <h1 className="text-heading-1">Submissions</h1>
                <p className="text-body text-muted-foreground mt-1">
                  Manage all student file submissions and grading
                </p>
              </div>
              <Button onClick={handleBulkDownload}>
                <Download className="mr-2 h-4 w-4" />
                Bulk Download
              </Button>
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search by student or task..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={sectionFilter} onValueChange={setSectionFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by section" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sections</SelectItem>
                      {mockSections.map((section) => (
                        <SelectItem key={section.id} value={section.id}>
                          {section.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Graded">Graded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Submissions Table */}
            <Card>
              <CardHeader>
                <CardTitle>All Submissions ({filteredSubmissions.length})</CardTitle>
                <CardDescription>Review and grade student submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Task Title</TableHead>
                      <TableHead>Submitted At</TableHead>
                      <TableHead>Files</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubmissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell className="font-medium">
                          {getStudentName(submission.studentId)}
                        </TableCell>
                        <TableCell>
                          <div className="max-w-[200px]">
                            <p className="truncate">{getTaskTitle(submission.taskId)}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-small">{formatDate(submission.submittedAt)}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-small">{submission.files.length} file(s)</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={submission.status === 'Graded' ? 'default' : 'secondary'}
                          >
                            {submission.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {submission.score !== null ? (
                            <span className="font-medium">{submission.score}</span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toast.info('Viewing submission...')}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toast.success('Downloading files...')}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleOpenGradeDialog(submission)}
                            >
                              Grade
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Grade Dialog */}
            <Dialog open={isGradeDialogOpen} onOpenChange={setIsGradeDialogOpen}>
              <DialogContent className="max-w-2xl">
                <form onSubmit={handleSubmitGrade}>
                  <DialogHeader>
                    <DialogTitle>Grade Submission</DialogTitle>
                    <DialogDescription>
                      {gradingSubmission && (
                        <>
                          {getStudentName(gradingSubmission.studentId)} - {getTaskTitle(gradingSubmission.taskId)}
                        </>
                      )}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="score">Score</Label>
                      <Input
                        id="score"
                        type="number"
                        value={gradeData.score}
                        onChange={(e) => setGradeData({ ...gradeData, score: e.target.value })}
                        placeholder="Enter score"
                        required
                        min="0"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="feedback">Feedback</Label>
                      <Textarea
                        id="feedback"
                        value={gradeData.feedback}
                        onChange={(e) => setGradeData({ ...gradeData, feedback: e.target.value })}
                        placeholder="Provide feedback to the student..."
                        rows={6}
                      />
                    </div>
                    {gradingSubmission && (
                      <div className="rounded-md bg-muted p-4">
                        <p className="text-small font-medium mb-2">Submitted Files:</p>
                        <div className="space-y-1">
                          {gradingSubmission.files.map((file, index) => (
                            <div key={index} className="flex items-center gap-2 text-small text-muted-foreground">
                              <FileText className="h-4 w-4" />
                              <span>{file}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsGradeDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      Submit Grade
                    </Button>
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