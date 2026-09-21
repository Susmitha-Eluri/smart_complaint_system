import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import { useMockData } from '../../context/MockDataContext';
import { StatusBadge } from '../../components/StatusBadge';
import { PlusCircle, FileText, Clock, CheckCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { currentUser, complaints, categories } = useMockData();
  
  const studentComplaints = complaints.filter(c => c.studentId === currentUser?.id);
  
  const inProgressCount = studentComplaints.filter(c => ['Under Review', 'Assigned', 'In Progress'].includes(c.status)).length;
  const resolvedCount = studentComplaints.filter(c => c.status === 'Resolved').length;
  const pendingCount = studentComplaints.filter(c => c.status === 'Submitted').length;

  return (
    <Layout title="Dashboard">
      <div className="mb-8">
        <h2 className="text-xl text-slate-600">
          Good Morning, <span className="font-semibold text-navy-900">{currentUser?.name} 👋</span>
        </h2>
        <p className="text-slate-500 mt-1">Raise an issue and help us improve the campus.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card bg-navy-900 text-white border-none flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <FileText className="w-16 h-16" />
          </div>
          <div>
            <p className="text-royal-400 font-medium text-sm mb-1">Total Complaints</p>
            <h3 className="text-3xl font-bold">{studentComplaints.length}</h3>
          </div>
        </div>

        <div className="card flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 font-medium text-sm mb-1">In Progress</p>
              <h3 className="text-3xl font-bold text-slate-800">{inProgressCount}</h3>
            </div>
            <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="card flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 font-medium text-sm mb-1">Resolved</p>
              <h3 className="text-3xl font-bold text-slate-800">{resolvedCount}</h3>
            </div>
            <div className="p-2 bg-green-100 rounded-lg text-green-600">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="card flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 font-medium text-sm mb-1">Pending</p>
              <h3 className="text-3xl font-bold text-slate-800">{pendingCount}</h3>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <FileText className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-navy-900">My Recent Complaints</h3>
        <Link to="/student/raise" className="btn-primary gap-2">
          <PlusCircle className="w-4 h-4" /> Raise a Complaint
        </Link>
      </div>

      <div className="card p-0 overflow-hidden">
        {studentComplaints.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <p>You haven't raised any complaints yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-sm font-medium text-slate-500 uppercase">Complaint ID</th>
                  <th className="px-6 py-4 text-sm font-medium text-slate-500 uppercase">Category</th>
                  <th className="px-6 py-4 text-sm font-medium text-slate-500 uppercase">Description</th>
                  <th className="px-6 py-4 text-sm font-medium text-slate-500 uppercase">Date</th>
                  <th className="px-6 py-4 text-sm font-medium text-slate-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-sm font-medium text-slate-500 uppercase text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {studentComplaints.map(complaint => (
                  <tr key={complaint.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-navy-900">
                      {complaint.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {categories.find(c => c.id === complaint.categoryId)?.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">
                      {complaint.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={complaint.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Link 
                        to={`/student/track/${complaint.id.replace('#', '')}`}
                        className="text-royal-600 hover:text-royal-800 font-medium text-sm"
                      >
                        Track
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
