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