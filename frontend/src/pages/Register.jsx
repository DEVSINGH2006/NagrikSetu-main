/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Phone, MapPin, LogIn } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', address: ''
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await register(formData);
    if (result.success) navigate('/dashboard');
    else setError(result.message);
  };

  return (
    <div className="flex min-h-[calc(100vh-[65px])] justify-center py-10 items-center bg-[var(--color-surface)] relative overflow-hidden">
      <div className="absolute top-[-100px] right-[-100px] w-96 h-96 bg-[var(--color-primary)] rounded-full blur-[120px] opacity-40"></div>
      <div className="absolute bottom-[-100px] left-[-100px] w-96 h-96 bg-[var(--color-secondary)] rounded-full blur-[120px] opacity-20"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass p-10 rounded-2xl w-full max-w-lg border border-[var(--color-secondary)] border-opacity-30 relative z-10"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif font-bold text-[var(--color-secondary)] mb-2">Create Account</h2>
          <p className="text-gray-400">Join Nagrik Setu to start making a difference</p>
        </div>

        {error && <div className="bg-[var(--color-error)] bg-opacity-20 text-[var(--color-error)] p-3 rounded-lg text-sm mb-4 border border-[var(--color-error)] border-opacity-30 text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required
              className="w-full bg-black bg-opacity-40 border border-gray-600 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[var(--color-secondary)] transition-colors" />
          </div>
          
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input type="email" name="email" placeholder="Email Address" onChange={handleChange} required
              className="w-full bg-black bg-opacity-40 border border-gray-600 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[var(--color-secondary)] transition-colors" />
          </div>

          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input type="tel" name="phone" placeholder="Phone Number" onChange={handleChange} required
              className="w-full bg-black bg-opacity-40 border border-gray-600 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[var(--color-secondary)] transition-colors" />
          </div>

          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" name="address" placeholder="Address in Vadodara" onChange={handleChange} required
              className="w-full bg-black bg-opacity-40 border border-gray-600 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[var(--color-secondary)] transition-colors" />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required
              className="w-full bg-black bg-opacity-40 border border-gray-600 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[var(--color-secondary)] transition-colors" />
          </div>
          
          <button 
            type="submit" 
            className="w-full py-3 mt-6 rounded-lg bg-[var(--color-secondary)] text-[var(--color-accent)] font-bold tracking-wide hover:shadow-[0_0_15px_rgba(212,175,55,0.6)] transition-all flex justify-center items-center gap-2"
          >
            Create Account
          </button>
        </form>
        
        <p className="text-center mt-6 text-gray-400 text-sm">
          Already have an account? <Link to="/login" className="text-[var(--color-secondary)] font-bold hover:underline">Log in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;