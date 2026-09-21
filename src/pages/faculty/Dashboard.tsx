import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import { useMockData } from '../../context/MockDataContext';
import { StatusBadge } from '../../components/StatusBadge';
import { FileText, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { currentUser, complaints, categories, users } = useMockData();
  
  // Find complaints relevant to this faculty member (either assigned to them directly, or in their assigned categories)
  const facultyCategories = categories.filter(c => currentUser?.assignedCategories?.includes(c.id));
  const categoryIds = facultyCategories.map(c => c.id);
  
  const relevantComplaints = complaints.filter(c => 
    c.assignedTo === currentUser?.id || categoryIds.includes(c.categoryId)
  );

  const newComplaints = relevantComplaints.filter(c => c.status === 'Submitted' || c.status === 'Under Review');
  const inProgressComplaints = relevantComplaints.filter(c => c.status === 'Assigned' || c.status === 'In Progress');
  const resolvedComplaints = relevantComplaints.filter(c => c.status === 'Resolved');
  const escalatedComplaints = relevantComplaints.filter(c => c.status === 'Escalated');

  return (
    <Layout title="Faculty Dashboard">
      <div className="mb-8">
        <h2 className="text-xl text-slate-600">
          Welcome, <span className="font-semibold text-navy-900">{currentUser?.name}</span>
        </h2>
        <p className="text-slate-500 mt-1">{currentUser?.department} Department</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card flex flex-col justify-between border-l-4 border-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 font-medium text-sm mb-1">New / Review</p>
              <h3 className="text-3xl font-bold text-slate-800">{newComplaints.length}</h3>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <FileText className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="card flex flex-col justify-between border-l-4 border-orange-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 font-medium text-sm mb-1">In Progress</p>
              <h3 className="text-3xl font-bold text-slate-800">{inProgressComplaints.length}</h3>
            </div>
            <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="card flex flex-col justify-between border-l-4 border-green-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 font-medium text-sm mb-1">Resolved</p>
              <h3 className="text-3xl font-bold text-slate-800">{resolvedComplaints.length}</h3>
            </div>
            <div className="p-2 bg-green-100 rounded-lg text-green-600">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="card flex flex-col justify-between border-l-4 border-red-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 font-medium text-sm mb-1">Escalated</p>
              <h3 className="text-3xl font-bold text-slate-800">{escalatedComplaints.length}</h3>
            </div>
            <div className="p-2 bg-red-100 rounded-lg text-red-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-navy-900">Complaints Assigned to You</h3>
        </div>
        
        {relevantComplaints.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <p>No complaints assigned to your categories.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-sm font-medium text-slate-500 uppercase">Complaint ID</th>
                  <th className="px-6 py-4 text-sm font-medium text-slate-500 uppercase">Student</th>
                  <th className="px-6 py-4 text-sm font-medium text-slate-500 uppercase">Category</th>
                  <th className="px-6 py-4 text-sm font-medium text-slate-500 uppercase">Priority</th>
                  <th className="px-6 py-4 text-sm font-medium text-slate-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-sm font-medium text-slate-500 uppercase text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {relevantComplaints.map(complaint => {
                  const student = users.find(u => u.id === complaint.studentId);
                  const category = categories.find(c => c.id === complaint.categoryId);
                  
                  return (
                    <tr key={complaint.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-navy-900">
                        {complaint.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-900">{student?.name}</div>
                        <div className="text-xs text-slate-500">{complaint.location}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {category?.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-xs font-semibold ${
                          complaint.priority === 'Urgent' ? 'text-red-600' :
                          complaint.priority === 'High' ? 'text-orange-500' :
                          complaint.priority === 'Medium' ? 'text-yellow-600' :
                          'text-blue-600'
                        }`}>
                          {complaint.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={complaint.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right space-x-3">
                        <Link 
                          to={`/faculty/complaint/${complaint.id.replace('#', '')}`}
                          className="btn-secondary py-1 px-3 inline-flex text-xs"
                        >
                          View / Update
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
