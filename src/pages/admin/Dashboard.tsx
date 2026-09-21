import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { useMockData } from '../../context/MockDataContext';
import { StatusBadge } from '../../components/StatusBadge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Settings, Database, Activity } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { complaints, categories, users } = useMockData();
  const [activeTab, setActiveTab] = useState<'overview' | 'complaints' | 'categories' | 'users'>('overview');

  // Stats
  const total = complaints.length;
  const resolved = complaints.filter(c => c.status === 'Resolved').length;
  const inProgress = complaints.filter(c => c.status === 'In Progress' || c.status === 'Assigned').length;
  const newCount = complaints.filter(c => c.status === 'Submitted' || c.status === 'Under Review').length;

  // Chart Data
  const categoryData = categories.map(cat => ({
    name: cat.name.split(' ')[0], // Short name
    value: complaints.filter(c => c.categoryId === cat.id).length
  })).filter(d => d.value > 0);

  const statusData = [
    { name: 'New', value: newCount, color: '#3B82F6' },
    { name: 'In Progress', value: inProgress, color: '#F59E0B' },
    { name: 'Resolved', value: resolved, color: '#10B981' }
  ];

  return (
    <Layout title="Admin Control Center">
      <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200 pb-px">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${activeTab === 'overview' ? 'bg-navy-900 text-white' : 'text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200'}`}
        >
          <div className="flex items-center gap-2"><Activity className="w-4 h-4" /> Overview</div>
        </button>
        <button 
          onClick={() => setActiveTab('complaints')}
          className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${activeTab === 'complaints' ? 'bg-navy-900 text-white' : 'text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200'}`}
        >
          <div className="flex items-center gap-2"><Database className="w-4 h-4" /> All Complaints</div>
        </button>
        <button 
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${activeTab === 'categories' ? 'bg-navy-900 text-white' : 'text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200'}`}
        >
          <div className="flex items-center gap-2"><Settings className="w-4 h-4" /> Categories & Routing</div>
        </button>
        <button 
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${activeTab === 'users' ? 'bg-navy-900 text-white' : 'text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200'}`}
        >
          <div className="flex items-center gap-2"><Users className="w-4 h-4" /> Grievance Members</div>
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="card text-center py-8">
              <h3 className="text-4xl font-bold text-navy-900 mb-1">{total}</h3>
              <p className="text-slate-500 font-medium">Total Complaints</p>
            </div>
            <div className="card text-center py-8 border-t-4 border-blue-500">
              <h3 className="text-4xl font-bold text-slate-800 mb-1">{newCount}</h3>
              <p className="text-slate-500 font-medium">New & Pending</p>
            </div>
            <div className="card text-center py-8 border-t-4 border-orange-500">
              <h3 className="text-4xl font-bold text-slate-800 mb-1">{inProgress}</h3>
              <p className="text-slate-500 font-medium">In Progress</p>
            </div>
            <div className="card text-center py-8 border-t-4 border-green-500">
              <h3 className="text-4xl font-bold text-slate-800 mb-1">{resolved}</h3>
              <p className="text-slate-500 font-medium">Resolved</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-lg font-bold text-navy-900 mb-6">Complaints by Category</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                    <RechartsTooltip cursor={{ fill: '#F1F5F9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="value" fill="#1D4ED8" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-bold text-navy-900 mb-6">Status Distribution</h3>
              <div className="h-64 flex justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
                {/* Custom Legend */}
                <div className="absolute right-8 top-1/2 -translate-y-1/2 space-y-3">
                  {statusData.map(s => (
                    <div key={s.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }}></div>
                      <span className="text-sm text-slate-600">{s.name} ({s.value})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'complaints' && (
        <div className="card p-0 overflow-hidden animate-fadeIn">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <input 
              type="text" 
              placeholder="Search ID, Student, or Category..." 
              className="input-field max-w-sm bg-white"
            />
            <div className="flex gap-2">
              <select className="input-field bg-white py-1">
                <option>All Statuses</option>
                <option>Submitted</option>
                <option>In Progress</option>
                <option>Resolved</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-sm font-medium text-slate-500 uppercase">ID</th>
                  <th className="px-6 py-4 text-sm font-medium text-slate-500 uppercase">Details</th>
                  <th className="px-6 py-4 text-sm font-medium text-slate-500 uppercase">Category</th>
                  <th className="px-6 py-4 text-sm font-medium text-slate-500 uppercase">Priority</th>
                  <th className="px-6 py-4 text-sm font-medium text-slate-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {complaints.map(complaint => (
                  <tr key={complaint.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-navy-900">{complaint.id}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-900">{complaint.title}</div>
                      <div className="text-xs text-slate-500">{new Date(complaint.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {categories.find(c => c.id === complaint.categoryId)?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-xs font-semibold text-slate-600 border px-2 py-1 rounded">{complaint.priority}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={complaint.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="card p-0 overflow-hidden animate-fadeIn">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 className="font-bold text-navy-900">Email & Routing Configuration</h3>
            <button className="btn-primary text-sm py-1.5">Add Category</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-6 py-4 text-sm font-medium text-slate-500 uppercase">Category Name</th>
                  <th className="px-6 py-4 text-sm font-medium text-slate-500 uppercase">Department</th>
                  <th className="px-6 py-4 text-sm font-medium text-slate-500 uppercase">Assigned Members / Email List</th>
                  <th className="px-6 py-4 text-sm font-medium text-slate-500 uppercase text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categories.map(cat => (
                  <tr key={cat.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-navy-900">{cat.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{cat.department}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {cat.assignedFacultyIds.length > 0 ? (
                        cat.assignedFacultyIds.map(fid => {
                          const user = users.find(u => u.id === fid);
                          return (
                            <div key={fid} className="flex items-center gap-2 mb-1">
                              <span className="w-2 h-2 rounded-full bg-green-500"></span>
                              {user?.name} <span className="text-xs text-slate-400">({user?.email})</span>
                            </div>
                          )
                        })
                      ) : (
                        <span className="text-slate-400 italic">Unassigned - Defaults to Admin</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-royal-600 hover:text-royal-800 text-sm font-medium">Edit Route</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="card p-0 overflow-hidden animate-fadeIn">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 className="font-bold text-navy-900">Grievance Members</h3>
            <button className="btn-primary text-sm py-1.5">Add Member</button>
          </div>
          <div className="p-8 text-center text-slate-500">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p>Manage faculty and staff accounts that handle complaints.</p>
            <p className="text-sm mt-2">In this prototype, members are pre-configured in demoData.ts</p>
          </div>
        </div>
      )}

    </Layout>
  );
};

export default Dashboard;
