import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import { useMockData } from '../../context/MockDataContext';
import { StatusBadge } from '../../components/StatusBadge';
import type { ComplaintStatus } from '../../types';
import { ArrowLeft, Send, CheckCircle } from 'lucide-react';

const ComplaintDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { complaints, categories, users, updateComplaintStatus, addComment, currentUser } = useMockData();
  
  const formattedId = `#${id}`;
  const complaint = complaints.find(c => c.id === formattedId);
  const category = categories.find(c => c.id === complaint?.categoryId);
  const student = users.find(u => u.id === complaint?.studentId);

  const [newComment, setNewComment] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  if (!complaint) {
    return (
      <Layout title="Complaint Details">
        <div className="card text-center p-12">
          <h3 className="text-xl font-bold text-navy-900 mb-2">Complaint Not Found</h3>
          <Link to="/faculty" className="btn-primary inline-flex">Back to Dashboard</Link>
        </div>
      </Layout>
    );
  }

  const handleStatusChange = (status: ComplaintStatus) => {
    setIsUpdating(true);
    setTimeout(() => {
      updateComplaintStatus(complaint.id, status);
      setIsUpdating(false);
    }, 600);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    addComment(complaint.id, newComment);
    setNewComment('');
  };

  return (
    <Layout title={`Complaint ${complaint.id}`}>
      <div className="mb-6">
        <Link to="/faculty" className="text-slate-500 hover:text-navy-900 flex items-center gap-1 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col - Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-navy-900">{complaint.title}</h2>
              <StatusBadge status={complaint.status} />
            </div>
            
            <p className="text-slate-700 mb-6">{complaint.description}</p>
            
            <div className="bg-slate-50 p-4 rounded-lg grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-500 block mb-1">Student Name</span>
                <span className="font-medium text-navy-900">{student?.name}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">Location</span>
                <span className="font-medium text-navy-900">{complaint.location}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">Category</span>
                <span className="font-medium text-navy-900">{category?.name}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">Priority</span>
                <span className="font-medium text-navy-900">{complaint.priority}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold text-navy-900 mb-4">Discussion & Updates</h3>
            
            <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2">
              {complaint.comments.length === 0 ? (
                <p className="text-slate-500 text-sm italic">No comments yet.</p>
              ) : (
                complaint.comments.map(comment => {
                  const author = users.find(u => u.id === comment.authorId);
                  const isMe = author?.id === currentUser?.id;
                  
                  return (
                    <div key={comment.id} className={`p-4 rounded-lg ${isMe ? 'bg-royal-50 border border-royal-100 ml-8' : 'bg-slate-50 mr-8'}`}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-sm text-navy-900">{isMe ? 'You' : author?.name}</span>
                        <span className="text-xs text-slate-500">{new Date(comment.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-slate-700">{comment.text}</p>
                    </div>
                  );
                })
              )}
            </div>

            <form onSubmit={handleAddComment} className="flex gap-2">
              <input 
                type="text" 
                className="input-field flex-1"
                placeholder="Type an update or comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button type="submit" disabled={!newComment.trim()} className="btn-primary">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Col - Actions */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card sticky top-24">
            <h3 className="text-lg font-bold text-navy-900 mb-4">Update Status</h3>
            
            <div className="space-y-3">
              <button 
                onClick={() => handleStatusChange('Under Review')}
                disabled={isUpdating || complaint.status === 'Under Review' || complaint.status === 'Resolved'}
                className="w-full text-left px-4 py-3 rounded-lg border border-slate-200 hover:border-purple-500 hover:bg-purple-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between"
              >
                <span className="font-medium text-purple-700">Mark as Under Review</span>
                {complaint.status === 'Under Review' && <CheckCircle className="w-4 h-4 text-purple-500" />}
              </button>
              
              <button 
                onClick={() => handleStatusChange('Assigned')}
                disabled={isUpdating || complaint.status === 'Assigned' || complaint.status === 'Resolved'}
                className="w-full text-left px-4 py-3 rounded-lg border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between"
              >
                <span className="font-medium text-indigo-700">Accept / Assigned to me</span>
                {complaint.status === 'Assigned' && <CheckCircle className="w-4 h-4 text-indigo-500" />}
              </button>

              <button 
                onClick={() => handleStatusChange('In Progress')}
                disabled={isUpdating || complaint.status === 'In Progress' || complaint.status === 'Resolved'}
                className="w-full text-left px-4 py-3 rounded-lg border border-slate-200 hover:border-orange-500 hover:bg-orange-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between"
              >
                <span className="font-medium text-orange-700">Mark as In Progress</span>
                {complaint.status === 'In Progress' && <CheckCircle className="w-4 h-4 text-orange-500" />}
              </button>
              
              <button 
                onClick={() => handleStatusChange('Resolved')}
                disabled={isUpdating || complaint.status === 'Resolved'}
                className="w-full text-left px-4 py-3 rounded-lg border border-slate-200 hover:border-green-500 hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between"
              >
                <span className="font-medium text-green-700">Mark as Resolved</span>
                {complaint.status === 'Resolved' && <CheckCircle className="w-4 h-4 text-green-500" />}
              </button>
            </div>
            
            {complaint.status === 'Resolved' && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg text-green-800 text-sm text-center">
                This complaint has been resolved. No further action is required.
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ComplaintDetails;
