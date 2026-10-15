import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Map, Users, Bot, LogOut, FileText, User, ShieldAlert } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="glass sticky top-0 z-50 w-full px-8 py-3 flex justify-between items-center border-b border-white/5 mx-auto max-w-7xl mt-4 rounded-2xl">
      <Link to="/" className="text-2xl font-bold font-serif flex items-center gap-3 group">
        <div className="flex items-center gap-2">
          <svg width="24" height="16" viewBox="0 0 900 600" className="rounded-sm shadow-sm overflow-hidden border border-white/10 group-hover:scale-110 transition-transform">
            <rect width="900" height="200" fill="#FF9933" />
            <rect y="200" width="900" height="200" fill="#FFFFFF" />
            <rect y="400" width="900" height="200" fill="#128807" />
            <circle cx="450" cy="300" r="40" fill="none" stroke="#000080" strokeWidth="2" />
          </svg>
          <div className="flex items-center">
            <span className="text-[var(--color-primary)]">Nagrik</span>
            <span className="text-white">Setu</span>
          </div>
        </div>
      </Link>
      
      <div className="hidden md:flex gap-8 items-center text-sm font-medium text-slate-300">
        <Link to="/" className="hover:text-white transition-colors flex items-center gap-2 tracking-wide"><Home size={16} /> Home</Link>
        <Link to="/map" className="hover:text-white transition-colors flex items-center gap-2 tracking-wide"><Map size={16} /> Map</Link>
        <Link to="/community" className="hover:text-white transition-colors flex items-center gap-2 tracking-wide"><Users size={16} /> Community</Link>
        <Link to="/assistant" className="hover:text-white transition-colors flex items-center gap-2 tracking-wide"><Bot size={16} /> AI Assistant</Link>
        
        {user ? (
          <>
            {user.role === 'admin' && (
              <Link to="/admin" className="text-amber-400 hover:text-amber-300 font-bold transition-colors flex items-center gap-1.5 tracking-wide">
                <ShieldAlert size={16} /> Admin Panel
              </Link>
            )}
            <Link to="/dashboard" className="hover:text-white transition-colors flex items-center gap-2 tracking-wide"><FileText size={16} /> Dashboard</Link>
            <Link to="/profile" className="hover:text-white transition-colors flex items-center gap-2 tracking-wide"><User size={16} /> Profile</Link>
            <button onClick={logout} className="hover:text-red-400 transition-colors flex items-center gap-2 tracking-wide cursor-pointer">
              <LogOut size={16} /> Logout
            </button>
            <Link to="/report" className="bg-[var(--color-primary)] px-5 py-2.5 rounded-xl text-white font-bold hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all">
              Report Issue
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-white transition-all">Login</Link>
            <Link to="/register" className="bg-[var(--color-secondary)] px-5 py-2.5 rounded-xl text-white font-bold hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all">
              Join NagrikSetu
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

