export type Role = 'student' | 'faculty' | 'admin';
export type Priority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type ComplaintStatus = 'Submitted' | 'Under Review' | 'Assigned' | 'In Progress' | 'Resolved' | 'Rejected' | 'Escalated';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department?: string; // For faculty/admin
  assignedCategories?: string[]; // For faculty
}

export interface ComplaintCategory {
  id: string;
  name: string;
  department: string;
  assignedFacultyIds: string[];
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  location: string;
  priority: Priority;
  status: ComplaintStatus;
  studentId: string;
  assignedTo?: string; // Faculty ID
  createdAt: string;
  updatedAt: string;
  evidenceUrl?: string;
  comments: Comment[];
  feedback?: {
    rating: number;
    text: string;
  }
}

export interface Comment {
  id: string;
  authorId: string;
  text: string;
  createdAt: string;
}
