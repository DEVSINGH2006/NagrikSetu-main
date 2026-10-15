/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Users, FileText, CheckCircle, Clock, AlertTriangle, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

const DEFAULT_ADMIN_STATS = {
  totalIssues: 28,
  resolvedRate: 75,
  statusCounts: { progress: 7, submitted: 4, resolved: 17 },
  usersCount: 1420
};

const DEFAULT_ADMIN_ISSUES = [
  {
    _id: 'issue-001',
    title: 'Major Pothole on Sayaji Path Road',
    category: 'Pothole',
    status: 'submitted',
    aiPriority: 'high',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    reportedBy: { name: 'Aarav Sharma' },
    location: { address: 'Near Sayaji Garden, Vadodara' }
  },
  {
    _id: 'issue-002',
    title: 'Overflowing Municipal Garbage Container',
    category: 'Garbage',
    status: 'progress',
    aiPriority: 'medium',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    reportedBy: { name: 'Pooja Patel' },
    location: { address: 'Alkapuri Station Road, Vadodara' }
  },
  {
    _id: 'issue-003',
    title: 'Broken Streetlights on Akota Bridge',
    category: 'Streetlight',
    status: 'resolved',
    aiPriority: 'low',
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
    reportedBy: { name: 'Karan Dave' },
    location: { address: 'Akota Bridge Circle, Vadodara' }
  }
];

const AdminDashboard = () => {
  const [stats, setStats] = useState(DEFAULT_ADMIN_STATS);
  const [issues, setIssues] = useState(DEFAULT_ADMIN_ISSUES);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [{ data: statsData }, { data: issuesData }] = await Promise.all([
        axios.get('/api/admin/stats'),
        axios.get('/api/issues')
      ]);
      setStats(statsData || DEFAULT_ADMIN_STATS);
      setIssues(Array.isArray(issuesData) && issuesData.length > 0 ? issuesData : DEFAULT_ADMIN_ISSUES);
    } catch (error) {
      console.warn('Backend offline, using fallback admin demo data:', error.message);
      setStats(DEFAULT_ADMIN_STATS);
      setIssues(DEFAULT_ADMIN_ISSUES);
    }
    setLoading(false);
  };

  useEffect(() => {
    Promise.resolve().then(() => fetchData());
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    setUpdating(id);
    try {
      await axios.put(`/api/issues/${id}`, { status: newStatus });
      fetchData();
    } catch {
      // Local state update when offline
      setIssues(prev => prev.map(item => item._id === id ? { ...item, status: newStatus } : item));
    }
    setUpdating(null);
  };

  if (loading) return <div className="py-20 flex justify-center"><RefreshCw className="animate-spin text-[var(--color-secondary)]" size={40} /></div>;

  return (
    <div className="py-10 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="flex justify-between items-end mb-10 border-b border-gray-700 pb-6">
        <div>
          <h1 className="text-4xl font-serif font-bold text-[var(--color-secondary)] mb-2">Admin Panel</h1>
          <p className="text-gray-400">Manage civic issues and track resolution metrics.</p>
        </div>
        <button onClick={fetchData} className="px-4 py-2 bg-gray-800 text-white rounded flex items-center gap-2 hover:bg-gray-700 transition">
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-12">
        <div className="glass p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-500 bg-opacity-20 flex items-center justify-center text-blue-400">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-400 uppercase">Total Issues</p>
            <p className="text-2xl font-bold">{stats?.totalIssues}</p>
          </div>
        </div>
        <div className="glass p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-[var(--color-success)] bg-opacity-20 flex items-center justify-center text-[var(--color-success)]">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-400 uppercase">Resolved Rate</p>
            <p className="text-2xl font-bold">{stats?.resolvedRate}%</p>
          </div>
        </div>
        <div className="glass p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-purple-500 bg-opacity-20 flex items-center justify-center text-purple-400">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-400 uppercase">In Progress</p>
            <p className="text-2xl font-bold">{stats?.statusCounts?.progress || 0}</p>
          </div>
        </div>
        <div className="glass p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-[var(--color-secondary)] bg-opacity-20 flex items-center justify-center text-[var(--color-secondary)]">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-400 uppercase">Citizens</p>
            <p className="text-2xl font-bold">{stats?.usersCount}</p>
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden border border-gray-700">
        <div className="p-6 border-b border-gray-700 flex justify-between items-center bg-black bg-opacity-40">
          <h2 className="text-xl font-bold">Recent Issue Reports</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black bg-opacity-60 text-gray-400 text-sm tracking-wider uppercase">
                <th className="p-4 border-b border-gray-700 font-medium">Issue / Reporter</th>
                <th className="p-4 border-b border-gray-700 font-medium">Category / Priority</th>
                <th className="p-4 border-b border-gray-700 font-medium">Date</th>
                <th className="p-4 border-b border-gray-700 font-medium w-48">Status Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-sm">
              {issues.map((issue) => (
                <tr key={issue._id} className="hover:bg-white hover:bg-opacity-5 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-white line-clamp-1">{issue.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{issue.reportedBy?.name || 'Unknown'}</p>
                  </td>
                  <td className="p-4">
                    <span className="inline-block px-2 py-1 rounded bg-gray-800 text-xs text-gray-300 mr-2">{issue.category}</span>
                    <span className={`inline-flex items-center gap-1 text-xs font-bold uppercase ${issue.priority === 'critical' ? 'text-[var(--color-error)]' : issue.priority === 'high' ? 'text-orange-400' : 'text-green-400'}`}>
                      {issue.priority === 'critical' && <AlertTriangle size={12} />} {issue.priority || 'low'}
                    </span>
                  </td>
                  <td className="p-4 text-gray-400 flex items-center gap-2">
                    <Clock size={14} className="text-[var(--color-primary)] opacity-70" /> {format(new Date(issue.createdAt), 'MMM dd, yyyy')}
                  </td>
                  <td className="p-4">
                    {updating === issue._id ? (
                      <div className="flex justify-center"><RefreshCw className="animate-spin text-[var(--color-secondary)]" size={20} /></div>
                    ) : (
                      <select 
                        value={issue.status}
                        onChange={(e) => handleStatusChange(issue._id, e.target.value)}
                        className={`w-full p-2.5 rounded-xl border focus:outline-none text-xs font-semibold tracking-wide cursor-pointer transition-colors ${
                          issue.status === 'resolved' ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/60' : 
                          issue.status === 'progress' ? 'bg-blue-950/80 text-blue-300 border-blue-500/60' : 
                          'bg-amber-950/80 text-amber-300 border-amber-500/60'
                        }`}
                      >
                        <option value="submitted" className="bg-gray-950 text-amber-300">Pending</option>
                        <option value="review" className="bg-gray-950 text-blue-300">Under Review</option>
                        <option value="progress" className="bg-gray-950 text-blue-300">In Progress</option>
                        <option value="resolved" className="bg-gray-950 text-emerald-300">Completed</option>
                      </select>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;