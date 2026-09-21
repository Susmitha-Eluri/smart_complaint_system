import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, Complaint, ComplaintCategory, ComplaintStatus } from '../types';
import { demoUsers, demoCategories, demoComplaints } from '../demoData';

interface MockDataContextType {
  currentUser: User | null;
  login: (email: string) => Promise<boolean>;
  logout: () => void;
  users: User[];
  complaints: Complaint[];
  categories: ComplaintCategory[];
  addComplaint: (complaint: Omit<Complaint, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'comments'>) => void;
  updateComplaintStatus: (id: string, status: ComplaintStatus) => void;
  addComment: (complaintId: string, text: string) => void;
  assignComplaint: (complaintId: string, facultyId: string) => void;
}

const MockDataContext = createContext<MockDataContextType | undefined>(undefined);

export const MockDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users] = useState<User[]>(demoUsers);
  const [complaints, setComplaints] = useState<Complaint[]>(demoComplaints);
  const [categories] = useState<ComplaintCategory[]>(demoCategories);

  // Restore user from local storage
  useEffect(() => {
    const savedUserId = localStorage.getItem('currentUser');
    if (savedUserId) {
      const user = users.find(u => u.id === savedUserId);
      if (user) setCurrentUser(user);
    }
  }, [users]);

  const login = async (email: string) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    const user = users.find(u => u.email === email);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('currentUser', user.id);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const addComplaint = (complaintData: Omit<Complaint, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'comments'>) => {
    const newId = `#C00${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    const newComplaint: Complaint = {
      ...complaintData,
      id: newId,
      status: 'Submitted',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: []
    };
    
    // Simulate routing and email dispatch
    const category = categories.find(c => c.id === complaintData.categoryId);
    if (category && category.assignedFacultyIds.length > 0) {
      newComplaint.assignedTo = category.assignedFacultyIds[0];
      console.log(`[MOCK EMAIL] Sent to ${category.department} team: New complaint ${newId} registered.`);
    } else {
      console.log(`[MOCK EMAIL] Sent to General Admin: New complaint ${newId} registered (unassigned category).`);
    }

    setComplaints([newComplaint, ...complaints]);
  };

  const updateComplaintStatus = (id: string, status: ComplaintStatus) => {
    setComplaints(prev => prev.map(c => 
      c.id === id ? { ...c, status, updatedAt: new Date().toISOString() } : c
    ));
    console.log(`[MOCK NOTIFICATION] Complaint ${id} status updated to ${status}.`);
  };

  const addComment = (complaintId: string, text: string) => {
    if (!currentUser) return;
    
    const newComment = {
      id: `CM${Math.floor(Math.random() * 10000)}`,
      authorId: currentUser.id,
      text,
      createdAt: new Date().toISOString()
    };

    setComplaints(prev => prev.map(c => 
      c.id === complaintId 
        ? { ...c, comments: [...c.comments, newComment], updatedAt: new Date().toISOString() }
        : c
    ));
  };

  const assignComplaint = (complaintId: string, facultyId: string) => {
    setComplaints(prev => prev.map(c => 
      c.id === complaintId 
        ? { ...c, assignedTo: facultyId, status: 'Assigned', updatedAt: new Date().toISOString() }
        : c
    ));
  };

  return (
    <MockDataContext.Provider value={{
      currentUser,
      login,
      logout,
      users,
      complaints,
      categories,
      addComplaint,
      updateComplaintStatus,
      addComment,
      assignComplaint
    }}>
      {children}
    </MockDataContext.Provider>
  );
};

export const useMockData = () => {
  const context = useContext(MockDataContext);
  if (context === undefined) {
    throw new Error('useMockData must be used within a MockDataProvider');
  }
  return context;
};
