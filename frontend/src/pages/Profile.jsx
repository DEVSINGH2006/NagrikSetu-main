/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Phone, MapPin, Loader2, Star, BadgeCheck, Camera } from 'lucide-react';
import { format } from 'date-fns';

const Profile = () => {
  const { user, login } = useAuth(); // We'll just update state after passing to Context if needed
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '', phone: '', address: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get('/api/users/profile');
        setProfile(data);
        setFormData({ name: data.name, phone: data.phone || '', address: data.address || '' });
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const { data } = await axios.put('/api/users/profile', formData);
      setProfile(data);
      setEditing(false);
      // Hacky way to update local storage context, technically needs AuthContext trigger
      const currentAuth = JSON.parse(localStorage.getItem('userInfo'));
      localStorage.setItem('userInfo', JSON.stringify({ ...currentAuth, ...data }));
    } catch (error) {
      alert('Failed to update profile');
    }
    setUpdating(false);
  };

  if (loading) return <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-[var(--color-secondary)]" size={40} /></div>;

  return (
    <div className="py-10 px-6 max-w-4xl mx-auto min-h-[calc(100vh-[65px])]">
      <h1 className="text-4xl font-serif font-bold text-[var(--color-secondary)] mb-10">My Profile</h1>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3">
          <div className="glass p-8 rounded-3xl border border-[var(--color-secondary)] border-opacity-30 text-center flex flex-col items-center">
            <div className="relative w-32 h-32 mb-6 group">
              <img src={profile?.profilePhoto} alt="Profile" className="w-full h-full rounded-full object-cover border-4 border-gray-800" />
              <button disabled className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={24} className="text-white" />
              </button>
            </div>
            
            <h2 className="text-2xl font-bold">{profile?.name}</h2>
            <p className="text-gray-400 text-sm mb-4">{profile?.email}</p>
            <p className="px-3 py-1 bg-gray-800 rounded-full text-xs font-bold uppercase tracking-widest text-[var(--color-secondary)] border border-gray-600 border-opacity-50">
              Role: {profile?.role}
            </p>

            <div className="w-full mt-8 pt-6 border-t border-gray-700 flex justify-between px-2">
              <div className="text-center">
                <p className="text-2xl font-bold font-serif text-white flex items-center justify-center gap-1"><Star size={18} fill="currentColor" className="text-yellow-500" />{profile?.civicPoints}</p>
                <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Points</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold font-serif text-white flex items-center justify-center gap-1"><BadgeCheck size={18} className="text-blue-400" /> {profile?.badges?.length || 0}</p>
                <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Badges</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-2/3">
          <div className="glass p-8 rounded-3xl border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold font-serif">Personal Details</h2>
              <button onClick={() => setEditing(!editing)} className="text-sm px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors font-medium">
                {editing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            {editing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input type="text" name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-black bg-opacity-40 border border-gray-600 rounded-lg py-3 pl-10 pr-4 text-white focus:border-[var(--color-secondary)]" required />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input type="tel" name="phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-black bg-opacity-40 border border-gray-600 rounded-lg py-3 pl-10 pr-4 text-white focus:border-[var(--color-secondary)]" />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Address directly linked to you</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input type="text" name="address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full bg-black bg-opacity-40 border border-gray-600 rounded-lg py-3 pl-10 pr-4 text-white focus:border-[var(--color-secondary)]" />
                  </div>
                </div>
                
                <button type="submit" disabled={updating} className="w-full px-6 py-3 bg-[var(--color-secondary)] text-[var(--color-accent)] font-bold rounded-lg border border-[var(--color-secondary)] hover:shadow-lg transition-shadow mt-4">
                  {updating ? <Loader2 size={20} className="animate-spin text-center w-full mx-auto" /> : 'Save Changes'}
                </button>
              </form>
            ) : (
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-gray-400 mb-1 uppercase tracking-widest">Email Address</p>
                  <p className="font-medium text-lg">{profile?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1 uppercase tracking-widest">Phone Number</p>
                  <p className="font-medium text-lg flex items-center gap-2">{profile?.phone || <span className="text-gray-600 italic">Not provided</span>}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1 uppercase tracking-widest">Residential Address</p>
                  <p className="font-medium text-lg">{profile?.address || <span className="text-gray-600 italic">Not provided</span>}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1 uppercase tracking-widest">Account Created</p>
                  <p className="font-medium text-lg">{profile?.createdAt ? format(new Date(profile.createdAt), 'MMMM dd, yyyy') : 'Recently'}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;