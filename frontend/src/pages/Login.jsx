/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) navigate('/dashboard');
    else setError(result.message);
  };

  return (
    <div className="flex h-[calc(100vh-[65px])] justify-center items-center bg-[var(--color-surface)] overflow-hidden relative">
      <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-[var(--color-primary)] rounded-full blur-[120px] opacity-40"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-[var(--color-secondary)] rounded-full blur-[120px] opacity-20"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass p-10 rounded-2xl w-full max-w-md border border-[var(--color-secondary)] border-opacity-30 relative z-10"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif font-bold text-gradient mb-2">Welcome Back</h2>
          <p className="text-gray-400">Login to your account to continue</p>
        </div>

        {error && <div className="bg-[var(--color-error)] bg-opacity-20 text-[var(--color-error)] p-3 rounded-lg text-sm mb-4 border border-[var(--color-error)] border-opacity-30 text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="email" 
              placeholder="Email Address" 
              className="w-full bg-black bg-opacity-40 border border-gray-600 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[var(--color-secondary)] transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full bg-black bg-opacity-40 border border-gray-600 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[var(--color-secondary)] transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center text-gray-400 cursor-pointer hover:text-white transition-colors">
              <input type="checkbox" className="mr-2 accent-[var(--color-secondary)] cursor-pointer" /> Remember me
            </label>
            <a href="#" className="text-[var(--color-secondary)] hover:underline">Forgot password?</a>
          </div>
          
          <button 
            type="submit" 
            className="w-full py-3 rounded-lg bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white font-bold tracking-wide hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all flex justify-center items-center gap-2 mt-4 cursor-pointer"
          >
            <LogIn size={20} /> Login
          </button>
        </form>

        {/* 1-Click Instant Test Credentials */}
        <div className="mt-6 pt-5 border-t border-white/10 space-y-2.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center">
            Instant Test Logins (1-Click)
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => {
                demoLogin('admin');
                navigate('/admin');
              }}
              className="px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              🛠️ Admin Panel
            </button>
            <button
              type="button"
              onClick={() => {
                demoLogin('citizen');
                navigate('/dashboard');
              }}
              className="px-3 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              👤 Citizen Portal
            </button>
          </div>
          <div className="text-[10px] text-slate-400 bg-black/30 p-2.5 rounded-lg border border-white/5 space-y-0.5">
            <p><span className="text-amber-400 font-semibold">Admin:</span> admin@nagriksetu.in / admin123</p>
            <p><span className="text-indigo-400 font-semibold">Citizen:</span> citizen@nagriksetu.in / citizen123</p>
          </div>
        </div>
        
        <p className="text-center mt-5 text-gray-400 text-xs">
          Don't have an account? <Link to="/register" className="text-[var(--color-secondary)] font-bold hover:underline">Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;