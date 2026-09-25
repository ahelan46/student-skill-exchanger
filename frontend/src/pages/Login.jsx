import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginDemo } from '../services/skillSyncApi';
import { Sparkles, ArrowRight, User } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const profileRes = await loginDemo(username, password);
      const exists = profileRes.data.find(p => p.user.username === username);
      if (!exists) {
        throw new Error('User not found. Try a demo account below.');
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Invalid credentials or backend is offline.');
    } finally {
      setLoading(false);
    }
  };

  const loginAsDemo = (demoUser) => {
    setUsername(demoUser);
    setPassword('demo_password_123!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-400/20 blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-violet-400/20 blur-[120px]"></div>

      <div className="w-full max-w-[440px] px-6 relative z-10">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-600 text-white mb-6 shadow-xl shadow-brand-500/20">
            <Sparkles size={28} strokeWidth={2} />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">
            SkillSync AI
          </h2>
          <p className="text-slate-500 font-medium">
            Learn what you want. Teach what you know.
          </p>
        </div>

        <div className="glass-panel p-8 rounded-3xl">
          <form className="space-y-5" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50/80 backdrop-blur border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Username</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium"
                placeholder="e.g. arun_demo"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-white font-semibold bg-brand-600 hover:bg-brand-700 focus:ring-4 focus:ring-brand-500/20 transition-all disabled:opacity-70 mt-2 shadow-lg shadow-brand-500/25"
            >
              {loading ? 'Signing in...' : 'Sign In'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-200/60">
            <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase text-center mb-4">
              Quick Demo Access
            </p>
            <div className="grid grid-cols-2 gap-3">
              {['arun_demo', 'priya_demo', 'rahul_demo', 'meena_demo', 'akshitha'].map((demo) => (
                <button
                  key={demo}
                  type="button"
                  onClick={() => loginAsDemo(demo)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-sm font-medium rounded-xl text-slate-700 transition-all"
                >
                  <User size={14} className="text-slate-400" />
                  <span className="capitalize">{demo.split('_')[0]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
