import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import { useMockData } from '../../context/MockDataContext';
import { StatusBadge } from '../../components/StatusBadge';
import type { ComplaintStatus } from '../../types';
import { CheckCircle2, Circle, Clock, MessageSquare, ArrowLeft } from 'lucide-react';

const TrackComplaint: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { complaints, categories } = useMockData();
  
  const formattedId = `#${id}`;
  const complaint = complaints.find(c => c.id === formattedId);
  const category = categories.find(c => c.id === complaint?.categoryId);

  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);

  if (!complaint) {
    return (
      <Layout title="Track Complaint">
        <div className="card text-center p-12">
          <h3 className="text-xl font-bold text-navy-900 mb-2">Complaint Not Found</h3>
          <p className="text-slate-500 mb-6">We couldn't find a complaint with ID {formattedId}</p>
          <Link to="/student" className="btn-primary inline-flex">Back to Dashboard</Link>
        </div>
      </Layout>
    );
  }

  const statusOrder: ComplaintStatus[] = ['Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved'];
  const getStatusIndex = (status: ComplaintStatus) => statusOrder.indexOf(status);
  const currentIndex = getStatusIndex(complaint.status);

  return (
    <Layout title={`Track Complaint ${complaint.id}`}>
      <div className="mb-6">
        <Link to="/student" className="text-slate-500 hover:text-navy-900 flex items-center gap-1 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col - Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-navy-900 mb-1">{complaint.title}</h2>
                <p className="text-sm text-slate-500">{category?.name} • {complaint.location}</p>
              </div>
              <StatusBadge status={complaint.status} />
            </div>
            
            <div className="prose prose-sm max-w-none text-slate-700">
              <p>{complaint.description}</p>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap gap-x-8 gap-y-4 text-sm">
              <div>
                <span className="text-slate-500 block mb-1">Priority</span>
                <span className="font-medium">{complaint.priority}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">Submitted On</span>
                <span className="font-medium">{new Date(complaint.createdAt).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">Last Updated</span>
                <span className="font-medium">{new Date(complaint.updatedAt).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Comments / Updates */}
          <div className="card">
            <h3 className="text-lg font-bold text-navy-900 mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-slate-400" />
              Updates & Comments
            </h3>
            
            {complaint.comments.length === 0 ? (
              <p className="text-slate-500 text-sm italic">No updates yet.</p>
            ) : (
              <div className="space-y-4">
                {complaint.comments.map(comment => (
                  <div key={comment.id} className="bg-slate-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-sm text-navy-900">Support Team</span>
                      <span className="text-xs text-slate-500">{new Date(comment.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-slate-700">{comment.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Feedback Section (if resolved) */}
          {complaint.status === 'Resolved' && !complaint.feedback && (
            <div className="card bg-blue-50 border-blue-100">
              <h3 className="text-lg font-bold text-navy-900 mb-2">Issue Resolved</h3>
              <p className="text-slate-600 text-sm mb-4">How was your experience with the resolution?</p>
              
              <div className="flex gap-2 mb-4">
                {[1, 2, 3, 4, 5].map(star => (
                  <button 
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-2xl ${rating >= star ? 'text-gold-500' : 'text-slate-300'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
              
              <textarea 
                className="input-field mb-4 text-sm h-20" 
                placeholder="Optional feedback..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              ></textarea>
              
              <button disabled={rating === 0} className="btn-primary">
                Submit Feedback
              </button>
            </div>
          )}

          {complaint.feedback && (
            <div className="card bg-slate-50">
              <h3 className="text-sm font-bold text-navy-900 mb-2">Your Feedback</h3>
              <div className="flex text-gold-500 mb-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <span key={star}>{complaint.feedback!.rating >= star ? '★' : '☆'}</span>
                ))}
              </div>
              {complaint.feedback.text && (
                <p className="text-sm text-slate-600 italic">"{complaint.feedback.text}"</p>
              )}
            </div>
          )}
        </div>

        {/* Right Col - Timeline */}
        <div className="lg:col-span-1">
          <div className="card sticky top-24">
            <h3 className="text-lg font-bold text-navy-900 mb-6">Status Timeline</h3>
            
            <div className="relative border-l-2 border-slate-200 ml-3 space-y-8">
              {statusOrder.map((status, index) => {
                const isCompleted = currentIndex >= index;
                const isCurrent = currentIndex === index;
                
                // Special case for Escalated/Rejected overriding the flow
                if (['Rejected', 'Escalated'].includes(complaint.status) && index > 1) {
                  if (index === 2) {
                    return (
                      <div key="special" className="relative pl-6">
                        <div className="absolute -left-[9px] top-1 bg-white">
                          <CheckCircle2 className="w-4 h-4 text-red-500" />
                        </div>
                        <h4 className="font-semibold text-sm text-red-600">{complaint.status}</h4>
                      </div>
                    );
                  }
                  return null;
                }

                return (
                  <div key={status} className={`relative pl-6 ${isCompleted ? '' : 'opacity-50'}`}>
                    <div className="absolute -left-[9px] top-1 bg-white">
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-300" />
                      )}
                    </div>
                    <div>
                      <h4 className={`font-semibold text-sm ${isCurrent ? 'text-royal-600' : 'text-slate-700'}`}>
                        {status}
                      </h4>
                      {isCurrent && status === 'In Progress' && (
                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Working on it
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TrackComplaint;
