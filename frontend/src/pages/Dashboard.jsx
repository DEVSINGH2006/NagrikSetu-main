/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { MapPin, Clock, CheckCircle, AlertTriangle, Loader2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';

const Dashboard = () => {
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyIssues = async () => {
      let localIssues = [];
      try {
        localIssues = JSON.parse(localStorage.getItem('myIssues') || '[]');
      } catch {
        localIssues = [];
      }

      try {
        const { data } = await axios.get('/api/issues/my');
        if (Array.isArray(data) && data.length > 0) {
          const apiIds = new Set(data.map(d => d._id));
          const uniqueLocal = localIssues.filter(l => !apiIds.has(l._id));
          setIssues([...uniqueLocal, ...data]);
        } else {
          setIssues(localIssues);
        }
      } catch {
        setIssues(localIssues);
      }
      setLoading(false);
    };

    fetchMyIssues();
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'submitted': return 'text-yellow-400 bg-yellow-400';
      case 'review': return 'text-blue-400 bg-blue-400';
      case 'progress': return 'text-purple-400 bg-purple-400';
      case 'resolved': return 'text-[var(--color-success)] bg-[var(--color-success)]';
      default: return 'text-gray-400 bg-gray-400';
    }
  };

  return (
    <div className="py-12 px-6 max-w-7xl mx-auto min-h-[calc(100vh-[65px])]">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-serif font-bold mb-2">My <span className="text-[var(--color-secondary)]">Dashboard</span></h1>
          <p className="text-gray-400 text-lg">Welcome back, {user?.name}</p>
        </div>
        <div className="glass px-6 py-3 rounded-xl flex items-center gap-4 border border-[var(--color-secondary)] border-opacity-30">
          <div className="text-right">
            <p className="text-xs text-gray-400 uppercase tracking-widest">Civic Points</p>
            <p className="text-2xl font-bold text-[var(--color-secondary)] drop-shadow-md">350</p>
          </div>
          <div className="h-10 w-[1px] bg-gray-600"></div>
          <div className="text-left">
            <p className="text-xs text-gray-400 uppercase tracking-widest">Rank</p>
            <p className="text-xl font-bold text-white drop-shadow-md">Silver</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-12">
        {['Total Reported', 'In Progress', 'Resolved', 'Upvotes Received'].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-6 rounded-2xl border border-[var(--color-secondary)] border-opacity-20 flex flex-col items-center justify-center relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--color-secondary)] opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity"></div>
            <p className="text-3xl font-bold font-serif mb-1 z-10">{i === 0 ? issues.length : (i === 1 ? issues.filter(x => x.status === 'progress').length : (i === 2 ? issues.filter(x => x.status === 'resolved').length : 12))}</p>
            <p className="text-sm text-gray-400 z-10">{stat}</p>
          </motion.div>
        ))}
      </div>

      <div className="glass rounded-3xl p-8 border border-[var(--color-secondary)] border-opacity-20">
        <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
          <h2 className="text-2xl font-bold font-serif">My Reported Issues</h2>
          <Link to="/report" className="text-sm text-[var(--color-secondary)] hover:underline flex items-center gap-1">New Report <ArrowRight size={14} /></Link>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-[var(--color-secondary)]" size={40} /></div>
        ) : issues.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <CheckCircle size={48} className="mx-auto text-gray-600 mb-4 opacity-50" />
            <p className="text-lg">You haven't reported any issues yet.</p>
            <Link to="/report" className="inline-block mt-4 px-6 py-2 bg-[var(--color-secondary)] text-[var(--color-accent)] font-bold rounded-lg transition-transform hover:scale-105">Report Your First Issue</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {issues.map((issue) => (
              <motion.div 
                key={issue._id} 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-black bg-opacity-40 rounded-xl p-5 border border-gray-700 hover:border-[var(--color-secondary)] hover:border-opacity-50 transition-colors flex flex-col md:flex-row gap-6 items-center"
              >
                <div className="w-full md:w-32 h-24 rounded-lg bg-gray-800 flex-shrink-0 overflow-hidden relative">
                  {issue.photos?.[0] ? <img src={issue.photos[0]} alt="Issue" className="w-full h-full object-cover" /> : <div className="absolute inset-0 flex items-center justify-center text-gray-600"><AlertTriangle /></div>}
                </div>
                
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold truncate max-w-sm">{issue.title}</h3>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={issue.status} showSimple={true} />
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-400 mb-3 truncate max-w-xl">{issue.description}</p>
                  
                  <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><MapPin size={14} className="text-[var(--color-secondary)]" /> {issue.location?.address || 'Vadodara'}</span>
                    <span className="flex items-center gap-1"><Clock size={14} className="text-[var(--color-primary)]" /> {new Date(issue.createdAt).toLocaleDateString()}</span>
                    <span className="bg-gray-800 px-2 py-1 rounded text-gray-300">{issue.category}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;