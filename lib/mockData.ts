import type { 
  Section, 
  Student, 
  Task, 
  Progress, 
  Announcement, 
  Grade, 
  Submission, 
  AttendanceRecord, 
  CalendarEvent, 
  Notification,
  StudentPerformance,
  Analytics
} from '@/types';

export const mockSections: Section[] = [
  {
    id: '1',
    name: 'Computer Science 101',
    code: 'CS101-A',
    subject: 'Computer Science',
    schedule: 'MWF 9:00-10:30 AM',
    room: 'Room 301',
    studentCount: 32,
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Data Structures',
    code: 'CS201-B',
    subject: 'Computer Science',
    schedule: 'TTh 1:00-2:30 PM',
    room: 'Room 205',
    studentCount: 28,
    createdAt: '2024-01-15',
  },
  {
    id: '3',
    name: 'Web Development',
    code: 'CS301-C',
    subject: 'Computer Science',
    schedule: 'MWF 2:00-3:30 PM',
    room: 'Lab 102',
    studentCount: 25,
    createdAt: '2024-01-15',
  },
];

export const mockStudents: Student[] = [
  {
    id: '1',
    firstName: 'Emma',
    lastName: 'Johnson',
    studentId: 'STU001',
    email: 'emma.johnson@university.edu',
    sectionId: '1',
    enrolledAt: '2024-01-20',
    photo: 'https://i.pravatar.cc/150?u=emma',
  },
  {
    id: '2',
    firstName: 'Liam',
    lastName: 'Smith',
    studentId: 'STU002',
    email: 'liam.smith@university.edu',
    sectionId: '1',
    enrolledAt: '2024-01-20',
    photo: 'https://i.pravatar.cc/150?u=liam',
  },
  {
    id: '3',
    firstName: 'Olivia',
    lastName: 'Williams',
    studentId: 'STU003',
    email: 'olivia.williams@university.edu',
    sectionId: '1',
    enrolledAt: '2024-01-20',
    photo: 'https://i.pravatar.cc/150?u=olivia',
  },
  {
    id: '4',
    firstName: 'Noah',
    lastName: 'Brown',
    studentId: 'STU004',
    email: 'noah.brown@university.edu',
    sectionId: '2',
    enrolledAt: '2024-01-20',
    photo: 'https://i.pravatar.cc/150?u=noah',
  },
  {
    id: '5',
    firstName: 'Ava',
    lastName: 'Davis',
    studentId: 'STU005',
    email: 'ava.davis@university.edu',
    sectionId: '2',
    enrolledAt: '2024-01-20',
    photo: 'https://i.pravatar.cc/150?u=ava',
  },
  {
    id: '6',
    firstName: 'Ethan',
    lastName: 'Martinez',
    studentId: 'STU006',
    email: 'ethan.martinez@university.edu',
    sectionId: '3',
    enrolledAt: '2024-01-20',
    photo: 'https://i.pravatar.cc/150?u=ethan',
  },
];

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Introduction to Programming Assignment',
    description: 'Complete the basic programming exercises covering variables, loops, and conditionals.',
    sectionId: '1',
    difficulty: 'Easy',
    dueDate: '2024-02-15',
    createdAt: '2024-02-01',
    totalPoints: 100,
  },
  {
    id: '2',
    title: 'Data Structures Quiz',
    description: 'Quiz covering arrays, linked lists, and basic tree structures.',
    sectionId: '2',
    difficulty: 'Medium',
    dueDate: '2024-02-20',
    createdAt: '2024-02-05',
    totalPoints: 50,
  },
  {
    id: '3',
    title: 'Web Development Project',
    description: 'Build a responsive landing page using HTML, CSS, and JavaScript.',
    sectionId: '3',
    difficulty: 'Hard',
    dueDate: '2024-03-01',
    createdAt: '2024-02-10',
    totalPoints: 150,
  },
  {
    id: '4',
    title: 'Algorithm Analysis',
    description: 'Analyze time and space complexity of common algorithms.',
    sectionId: '1',
    difficulty: 'Medium',
    dueDate: '2024-02-25',
    createdAt: '2024-02-08',
    totalPoints: 75,
  },
];

export const mockProgress: Progress[] = [
  {
    id: '1',
    studentId: '1',
    taskId: '1',
    status: 'Completed',
    score: 95,
    feedback: 'Excellent work! Clean code and good logic.',
    submittedAt: '2024-02-14',
    updatedAt: '2024-02-14',
  },
  {
    id: '2',
    studentId: '2',
    taskId: '1',
    status: 'In Progress',
    score: null,
    feedback: null,
    submittedAt: null,
    updatedAt: '2024-02-12',
  },
  {
    id: '3',
    studentId: '3',
    taskId: '1',
    status: 'Not Started',
    score: null,
    feedback: null,
    submittedAt: null,
    updatedAt: '2024-02-01',
  },
  {
    id: '4',
    studentId: '4',
    taskId: '2',
    status: 'Completed',
    score: 88,
    feedback: 'Good understanding of data structures.',
    submittedAt: '2024-02-19',
    updatedAt: '2024-02-19',
  },
  {
    id: '5',
    studentId: '5',
    taskId: '2',
    status: 'Completed',
    score: 92,
    feedback: 'Excellent performance!',
    submittedAt: '2024-02-18',
    updatedAt: '2024-02-18',
  },
];

export const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    sectionId: '1',
    title: 'Midterm Exam Schedule',
    content: 'The midterm exam will be held on March 15th at 9:00 AM in Room 301. Please arrive 10 minutes early.',
    createdBy: 'Prof. Johnson',
    isPinned: true,
    createdAt: '2024-02-10',
    updatedAt: '2024-02-10',
  },
  {
    id: '2',
    sectionId: '1',
    title: 'Office Hours Update',
    content: 'Office hours this week will be moved to Thursday 2-4 PM due to a faculty meeting.',
    createdBy: 'Prof. Johnson',
    isPinned: false,
    createdAt: '2024-02-12',
    updatedAt: '2024-02-12',
  },
  {
    id: '3',
    sectionId: '2',
    title: 'Guest Lecture Next Week',
    content: 'We will have a guest lecturer from Google discussing real-world applications of data structures.',
    createdBy: 'Prof. Smith',
    isPinned: true,
    createdAt: '2024-02-11',
    updatedAt: '2024-02-11',
  },
];

export const mockGrades: Grade[] = [
  { studentId: '1', taskId: '1', score: 95, maxScore: 100, percentage: 95, letterGrade: 'A' },
  { studentId: '1', taskId: '4', score: 70, maxScore: 75, percentage: 93, letterGrade: 'A' },
  { studentId: '2', taskId: '1', score: 82, maxScore: 100, percentage: 82, letterGrade: 'B' },
  { studentId: '3', taskId: '1', score: 78, maxScore: 100, percentage: 78, letterGrade: 'C' },
  { studentId: '4', taskId: '2', score: 88, maxScore: 100, percentage: 88, letterGrade: 'B' },
  { studentId: '5', taskId: '2', score: 92, maxScore: 100, percentage: 92, letterGrade: 'A' },
];

export const mockSubmissions: Submission[] = [
  {
    id: '1',
    studentId: '1',
    taskId: '1',
    files: ['assignment1.pdf', 'code.zip'],
    submittedAt: '2024-02-14T10:30:00',
    status: 'Graded',
    score: 95,
    feedback: 'Excellent work! Clean code and good logic.',
  },
  {
    id: '2',
    studentId: '2',
    taskId: '1',
    files: ['homework.pdf'],
    submittedAt: '2024-02-14T14:20:00',
    status: 'Pending',
    score: null,
    feedback: null,
  },
  {
    id: '3',
    studentId: '4',
    taskId: '2',
    files: ['quiz_answers.pdf'],
    submittedAt: '2024-02-19T09:15:00',
    status: 'Graded',
    score: 88,
    feedback: 'Good understanding of data structures.',
  },
];

export const mockAttendance: AttendanceRecord[] = [
  { id: '1', date: '2024-02-12', sectionId: '1', studentId: '1', status: 'Present' },
  { id: '2', date: '2024-02-12', sectionId: '1', studentId: '2', status: 'Present' },
  { id: '3', date: '2024-02-12', sectionId: '1', studentId: '3', status: 'Absent' },
  { id: '4', date: '2024-02-14', sectionId: '1', studentId: '1', status: 'Present' },
  { id: '5', date: '2024-02-14', sectionId: '1', studentId: '2', status: 'Late' },
  { id: '6', date: '2024-02-14', sectionId: '1', studentId: '3', status: 'Present' },
];

export const mockCalendarEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Introduction to Programming Assignment Due',
    date: '2024-02-15',
    type: 'task',
    sectionId: '1',
    taskId: '1',
    color: 'blue',
  },
  {
    id: '2',
    title: 'Data Structures Quiz Due',
    date: '2024-02-20',
    type: 'task',
    sectionId: '2',
    taskId: '2',
    color: 'yellow',
  },
  {
    id: '3',
    title: 'Web Development Project Due',
    date: '2024-03-01',
    type: 'task',
    sectionId: '3',
    taskId: '3',
    color: 'red',
  },
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'submission',
    message: 'Emma Johnson submitted Introduction to Programming Assignment',
    time: '2 hours ago',
    read: false,
    icon: 'file',
  },
  {
    id: '2',
    type: 'task_due',
    message: 'Data Structures Quiz is due in 3 days',
    time: '5 hours ago',
    read: false,
    icon: 'calendar',
  },
  {
    id: '3',
    type: 'grade_posted',
    message: 'Grades posted for Introduction to Programming Assignment',
    time: '1 day ago',
    read: true,
    icon: 'check',
  },
];

export const mockStudentPerformance: StudentPerformance[] = [
  {
    studentId: '1',
    studentName: 'Emma Johnson',
    completedTasks: 2,
    overdueTasks: 0,
    averageScore: 94,
    status: 'On Track',
  },
  {
    studentId: '2',
    studentName: 'Liam Smith',
    completedTasks: 1,
    overdueTasks: 1,
    averageScore: 82,
    status: 'At Risk',
  },
  {
    studentId: '3',
    studentName: 'Olivia Williams',
    completedTasks: 1,
    overdueTasks: 2,
    averageScore: 78,
    status: 'Needs Attention',
  },
];

export const mockAnalytics: Analytics = {
  sectionPerformance: [
    { sectionId: '1', sectionName: 'CS101-A', averageScore: 85 },
    { sectionId: '2', sectionName: 'CS201-B', averageScore: 90 },
    { sectionId: '3', sectionName: 'CS301-C', averageScore: 82 },
  ],
  taskCompletionRate: {
    completed: 65,
    pending: 25,
    overdue: 10,
  },
  gradeDistribution: [
    { grade: 'A', count: 12 },
    { grade: 'B', count: 8 },
    { grade: 'C', count: 5 },
    { grade: 'D', count: 2 },
    { grade: 'F', count: 1 },
  ],
};

// Helper functions
export function getStudentName(studentId: string): string {
  const student = mockStudents.find(s => s.id === studentId);
  return student ? `${student.firstName} ${student.lastName}` : 'Unknown';
}

export function getSectionName(sectionId: string): string {
  const section = mockSections.find(s => s.id === sectionId);
  return section ? section.code : 'Unknown';
}

export function getTaskTitle(taskId: string): string {
  const task = mockTasks.find(t => t.id === taskId);
  return task ? task.title : 'Unknown';
}

export function calculateLetterGrade(percentage: number): string {
  if (percentage >= 90) return 'A';
  if (percentage >= 80) return 'B';
  if (percentage >= 70) return 'C';
  if (percentage >= 60) return 'D';
  return 'F';
}

export function getGradeColor(percentage: number): string {
  if (percentage >= 90) return 'text-green-600 dark:text-green-400';
  if (percentage >= 80) return 'text-blue-600 dark:text-blue-400';
  if (percentage >= 70) return 'text-yellow-600 dark:text-yellow-400';
  if (percentage >= 60) return 'text-orange-600 dark:text-orange-400';
  return 'text-red-600 dark:text-red-400';
}