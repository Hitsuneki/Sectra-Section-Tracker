export interface Section {
  id: string;
  name: string;
  code: string;
  subject: string;
  schedule: string;
  room: string;
  studentCount: number;
  createdAt: string;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  studentId: string;
  email: string;
  sectionId: string;
  enrolledAt: string;
  photo?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  sectionId: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  dueDate: string;
  createdAt: string;
  totalPoints: number;
}

export interface Progress {
  id: string;
  studentId: string;
  taskId: string;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Overdue';
  score: number | null;
  feedback: string | null;
  submittedAt: string | null;
  updatedAt: string;
}

export interface DashboardStats {
  totalSections: number;
  totalStudents: number;
  totalTasks: number;
  averageCompletion: number;
}

// New types for additional features
export interface Announcement {
  id: string;
  sectionId: string;
  title: string;
  content: string;
  createdBy: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Grade {
  studentId: string;
  taskId: string;
  score: number;
  maxScore: number;
  percentage: number;
  letterGrade: string;
}

export interface Submission {
  id: string;
  studentId: string;
  taskId: string;
  files: string[];
  submittedAt: string;
  status: 'Pending' | 'Graded';
  score: number | null;
  feedback: string | null;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  sectionId: string;
  studentId: string;
  status: 'Present' | 'Absent' | 'Late';
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'task' | 'announcement' | 'event';
  sectionId: string;
  taskId?: string;
  color?: string;
}

export interface Notification {
  id: string;
  type: 'task_due' | 'grade_posted' | 'announcement' | 'submission';
  message: string;
  time: string;
  read: boolean;
  icon: string;
}

export interface StudentPerformance {
  studentId: string;
  studentName: string;
  completedTasks: number;
  overdueTasks: number;
  averageScore: number;
  status: 'On Track' | 'At Risk' | 'Needs Attention';
}

export interface Analytics {
  sectionPerformance: { sectionId: string; sectionName: string; averageScore: number }[];
  taskCompletionRate: { completed: number; pending: number; overdue: number };
  gradeDistribution: { grade: string; count: number }[];
}