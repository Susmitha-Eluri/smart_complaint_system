import type { User, ComplaintCategory, Complaint } from './types';

export const demoUsers: User[] = [
  {
    id: 'U001',
    name: 'Rahul Sharma',
    email: 'student@gvpihlr.edu',
    role: 'student',
  },
  {
    id: 'U002',
    name: 'Dr. Ravi Kumar',
    email: 'maintenance@gvpihlr.edu',
    role: 'faculty',
    department: 'Maintenance',
    assignedCategories: ['CAT01', 'CAT06', 'CAT09'], // Water, Electrical, Cleanliness
  },
  {
    id: 'U003',
    name: 'Prof. Anita Desai',
    email: 'it@gvpihlr.edu',
    role: 'faculty',
    department: 'IT Department',
    assignedCategories: ['CAT02', 'CAT07'], // Lab, Internet
  },
  {
    id: 'U004',
    name: 'Admin User',
    email: 'admin@gvpihlr.edu',
    role: 'admin',
    department: 'Administration'
  }
];

export const demoCategories: ComplaintCategory[] = [
  { id: 'CAT01', name: 'Water Supply', department: 'Maintenance', assignedFacultyIds: ['U002'] },
  { id: 'CAT02', name: 'Lab Equipment', department: 'Technical Support', assignedFacultyIds: ['U003'] },
  { id: 'CAT03', name: 'Hostel', department: 'Hostel Administration', assignedFacultyIds: [] },
  { id: 'CAT04', name: 'Mess & Canteen', department: 'Food Services', assignedFacultyIds: [] },
  { id: 'CAT05', name: 'Classroom / Infrastructure', department: 'Infrastructure', assignedFacultyIds: [] },
  { id: 'CAT06', name: 'Electrical', department: 'Maintenance', assignedFacultyIds: ['U002'] },
  { id: 'CAT07', name: 'Internet / Wi-Fi', department: 'IT Department', assignedFacultyIds: ['U003'] },
  { id: 'CAT08', name: 'Transport', department: 'Transport Department', assignedFacultyIds: [] },
  { id: 'CAT09', name: 'Cleanliness / Sanitation', department: 'Maintenance', assignedFacultyIds: ['U002'] },
  { id: 'CAT10', name: 'Other', department: 'General Administration', assignedFacultyIds: ['U004'] }
];

export const demoComplaints: Complaint[] = [
  {
    id: '#C00123',
    title: 'No water in Block B Washroom',
    description: 'There has been no water supply in the men\'s washroom on the 2nd floor of Block B since morning.',
    categoryId: 'CAT01',
    location: 'Block B - 2nd Floor',
    priority: 'High',
    status: 'In Progress',
    studentId: 'U001',
    assignedTo: 'U002',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    comments: [
      { id: 'CM1', authorId: 'U002', text: 'Plumber has been dispatched.', createdAt: new Date(Date.now() - 86400000).toISOString() }
    ]
  },
  {
    id: '#C00124',
    title: 'Computer 15 not turning on',
    description: 'The workstation 15 in Computer Lab 2 is completely dead. Tried changing power cable but no luck.',
    categoryId: 'CAT02',
    location: 'Computer Lab 2',
    priority: 'Medium',
    status: 'Resolved',
    studentId: 'U001',
    assignedTo: 'U003',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    comments: [
      { id: 'CM2', authorId: 'U003', text: 'Power supply unit was faulty. Replaced it today.', createdAt: new Date(Date.now() - 86400000 * 3).toISOString() }
    ],
    feedback: { rating: 5, text: 'Very fast resolution, thanks!' }
  },
  {
    id: '#C00125',
    title: 'Wi-Fi keeps dropping during lectures',
    description: 'The connection in the main academic block keeps dropping every 10 minutes making it hard to follow online materials.',
    categoryId: 'CAT07',
    location: 'Academic Block',
    priority: 'High',
    status: 'Under Review',
    studentId: 'U001',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    comments: []
  },
  {
    id: '#C00126',
    title: 'Broken window latch',
    description: 'The latch on the left window is broken and it keeps banging when windy.',
    categoryId: 'CAT03',
    location: 'Girls Hostel Room 102',
    priority: 'Low',
    status: 'Submitted',
    studentId: 'U001',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    comments: []
  }
];
