/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { ThumbsUp, MessageSquare, MapPin, Share2, Search, Filter, CheckCircle2, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import StatusBadge from '../components/StatusBadge';

const Community = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [situationFilter, setSituationFilter] = useState('All'); // 'All' | 'Pending' | 'Completed'
  const [search, setSearch] = useState('');
  const { user } = useAuth();
  
  const categories = ['All', 'Pothole', 'Garbage', 'Streetlight', 'Water', 'Traffic', 'Construction', 'Noise', 'Other'];

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const { data } = await axios.get('/api/issues');
        setIssues(data);
      } catch (error) {
        console.error('Error fetching issues', error);
      }
      setLoading(false);
    };

    fetchIssues();
  }, []);

  const handleUpvote = async (id) => {
    if (!user) return alert('Please login to upvote');
    try {
      await axios.post(`/api/issues/${id}/upvote`);
      setIssues(issues.map(issue => 
        issue._id === id 
          ? { ...issue, upvotes: [...issue.upvotes, user._id] } 
          : issue
      ));
    } catch (error) {
      alert(error.response?.data?.message || 'Error upvoting');
    }
  };

  const filteredIssues = issues.filter(issue => {
    const matchCat = filter === 'All' || issue.category === filter;
    const isCompleted = (issue.status || '').toLowerCase() === 'resolved' || (issue.status || '').toLowerCase() === 'completed';
    const matchSituation = 
      situationFilter === 'All' ||
      (situationFilter === 'Completed' && isCompleted) ||
      (situationFilter === 'Pending' && !isCompleted);

    const matchSearch = issue.title.toLowerCase().includes(search.toLowerCase()) || issue.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSituation && matchSearch;
  });

  return (
    <div className="py-10 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-serif font-bold mb-2">Community <span className="text-[var(--color-secondary)]">Feed</span></h1>
          <p className="text-gray-400 max-w-xl">See what issues your fellow citizens in Vadodara are reporting, upvote them, and help the administration prioritize.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full md:w-1/4">
          <div className="glass p-6 rounded-2xl border border-[var(--color-secondary)] border-opacity-30 sticky top-24">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 border-b border-gray-700 pb-2"><Filter size={18} /> Filters</h3>
            
            <div className="mb-6 relative text-gray-400">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={16} />
              <input 
                type="text" 
                placeholder="Search issues..." 
                className="w-full bg-black bg-opacity-40 border border-gray-600 rounded-lg py-2 pl-10 pr-4 focus:border-[var(--color-secondary)] text-white text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="mb-6 space-y-2">
              <p className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">Situation</p>
              <div className="grid grid-cols-3 gap-1 bg-black/40 p-1 rounded-xl border border-gray-700">
                {['All', 'Pending', 'Completed'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSituationFilter(s)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                      situationFilter === s
                        ? 'bg-[var(--color-secondary)] text-black shadow-sm'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">Categories</p>
              {categories.map(c => (
                <button 
                  key={c}
                  onClick={() => setFilter(c)}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${filter === c ? 'bg-[var(--color-secondary)] text-black font-bold' : 'hover:bg-gray-800 text-gray-300'}`}
                >
                  {c}
                </button>
              ))}
            </div>
            
            <div className="mt-8 pt-4 border-t border-gray-700">
               <p className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">Top Reporters</p>
               <div className="flex items-center gap-3 py-2 text-sm text-gray-300">
                 <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] flex justify-center items-center text-white font-bold">JD</div>
                 <div className="flex-1"><p className="font-bold">John Doe</p><p className="text-xs text-[var(--color-secondary)]">42 Reports</p></div>
               </div>
               <div className="flex items-center gap-3 py-2 text-sm text-gray-300">
                 <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] flex justify-center items-center text-white font-bold">AS</div>
                 <div className="flex-1"><p className="font-bold">Amit Shah</p><p className="text-xs text-gray-400">28 Reports</p></div>
               </div>
            </div>
          </div>
        </div>

        {/* Main Feed */}
        <div className="w-full md:w-3/4 space-y-6">
          {loading ? (
            <p className="text-center py-20 text-gray-400">Loading issues...</p>
          ) : filteredIssues.length === 0 ? (
            <div className="glass p-10 rounded-2xl text-center border border-gray-700">
              <h3 className="text-xl font-bold mb-2">No issues found</h3>
              <p className="text-gray-400">No issues found matching your selected filters.</p>
            </div>
          ) : (
            filteredIssues.map((issue) => {
              const hasUpvoted = user ? issue.upvotes?.includes(user._id) : false;

              return (
                 <motion.div 
                  key={issue._id} 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -2 }}
                  className="glass p-6 md:p-8 rounded-2xl border border-[var(--color-secondary)] border-opacity-20 hover:border-opacity-50 transition-all shadow-lg"
                 >
                   <div className="flex justify-between items-start mb-4">
                     <div className="flex items-center gap-3">
                       <img src={issue.reportedBy?.profilePhoto || 'https://res.cloudinary.com/demo/image/upload/v1/default_avatar.png'} alt="user" className="w-10 h-10 rounded-full border border-gray-600" />
                       <div>
                         <p className="font-bold text-white text-sm">{issue.reportedBy?.name || 'Anonymous citizen'}</p>
                         <p className="text-xs text-gray-500">{formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}</p>
                       </div>
                     </div>
                     <StatusBadge status={issue.status} showSimple={true} />
                   </div>

                   <h3 className="text-2xl font-serif font-bold mb-3 hover:text-[var(--color-secondary)] transition-colors cursor-pointer">{issue.title}</h3>
                   <p className="text-gray-300 text-sm mb-4 leading-relaxed line-clamp-3">{issue.description}</p>
                   
                   {issue.photos?.[0] && (
                     <div className="w-full h-64 md:h-80 rounded-xl overflow-hidden mb-4 border border-gray-700">
                       <img src={issue.photos[0]} alt="Issue" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                     </div>
                   )}

                   <div className="flex flex-wrap items-center justify-between border-t border-gray-700 pt-4 mt-2">
                     <div className="flex gap-4">
                       <button 
                         onClick={() => handleUpvote(issue._id)}
                         className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors ${
                           hasUpvoted 
                             ? 'text-[var(--color-secondary)] border-[var(--color-secondary)] bg-[var(--color-secondary)] bg-opacity-10' 
                             : 'text-gray-400 border-gray-600 hover:text-white hover:bg-gray-800'
                         }`}
                       >
                         <ThumbsUp size={16} fill={hasUpvoted ? "currentColor" : "none"} /> 
                         <span className="font-bold">{issue.upvotes.length}</span>
                       </button>
                       <button className="flex items-center gap-1.5 px-3 py-1.5 text-gray-400 border border-transparent hover:text-white transition-colors">
                         <MessageSquare size={16} /> <span className="font-bold">{issue.comments?.length || 0}</span>
                       </button>
                       <button className="flex items-center gap-1.5 px-3 py-1.5 text-gray-400 border border-transparent hover:text-white transition-colors">
                         <Share2 size={16} /> Share
                       </button>
                     </div>
                     <div className="flex items-center gap-1 text-xs text-gray-400 mt-2 md:mt-0 px-3 py-1.5 bg-black bg-opacity-40 rounded-full">
                       <MapPin size={12} className="text-[var(--color-primary)]" />
                       <span className="max-w-[150px] truncate">{issue.location?.address || 'Vadodara'}</span>
                     </div>
                   </div>
                 </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Community;