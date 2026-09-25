import { useEffect, useState } from 'react';
import { getMyProfile, updateProfile } from '../services/skillSyncApi';
import { LoadingSpinner, ErrorMessage } from '../components/UIComponents';
import { User, Settings } from 'lucide-react';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [updatingProfile, setUpdatingProfile] = useState(false);

  const fetchData = async () => {
    try {
      const username = localStorage.getItem('demo_username');
      const profileRes = await getMyProfile();
      const me = profileRes.data.find(p => p.user.username === username);
      setProfile(me);
    } catch (err) {
      setError('Failed to load profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUpdatingProfile(true);
    try {
      await updateProfile(profile.id, {
        full_name: profile.full_name,
        department: profile.department,
        year: profile.year,
        bio: profile.bio
      });
      alert('Profile updated successfully!');
    } catch (err) {
      alert('Failed to update profile.');
    } finally {
      setUpdatingProfile(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Profile</h2>
        <p className="text-slate-500 font-medium mt-2">Manage your personal information and skills.</p>
      </div>

      <div className="solid-panel p-8">
        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <User size={20} className="text-brand-500" />
          Basic Details
        </h3>
        
        <form onSubmit={handleProfileUpdate} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Full Name</label>
              <input required type="text" value={profile.full_name} onChange={e => setProfile({...profile, full_name: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Department</label>
              <input required type="text" value={profile.department} onChange={e => setProfile({...profile, department: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Year</label>
              <input required type="number" min="1" max="4" value={profile.year} onChange={e => setProfile({...profile, year: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Bio</label>
            <textarea value={profile.bio || ''} onChange={e => setProfile({...profile, bio: e.target.value})} rows="3" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all resize-none"></textarea>
          </div>
          
          <button type="submit" disabled={updatingProfile} className="px-6 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/25 disabled:opacity-50">
            {updatingProfile ? 'Saving...' : 'Save Profile Details'}
          </button>
        </form>
      </div>
    </div>
  );
}
