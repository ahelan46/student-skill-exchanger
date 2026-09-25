import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, User as UserIcon, Search, BookOpen, MessageSquare, LogOut, Menu, Share2, Layers, Network, Activity, Settings, Bell, LayoutDashboard, BrainCircuit, Target, CheckCircle, Circle, ChevronDown, Bookmark } from 'lucide-react';
import { logoutDemo, getMyProfile } from '../services/skillSyncApi';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    getMyProfile().then(res => {
      const username = localStorage.getItem('demo_username');
      setProfile(res.data.find(p => p.user.username === username));
    }).catch(e => console.error(e));
  }, []);

  const navItems = [
    { name: 'Home', path: '/', icon: <Home size={18} /> },
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'AI Matches', path: '/matches', icon: <BrainCircuit size={18} /> },
    { name: 'Find Partners', path: '/find-partners', icon: <Search size={18} /> },
    { name: 'My Exchanges', path: '/requests', icon: <MessageSquare size={18} /> },
    { name: 'Learning Progress', path: '/sessions', icon: <Activity size={18} /> },
    { name: 'My Skills', path: '/skills', icon: <Bookmark size={18} /> },
    { name: 'AI Learning Roadmap', path: '/roadmap', icon: <Target size={18} /> },
    { name: 'Notifications', path: '#', icon: <Bell size={18} />, badge: 3 },
    { name: 'Admin Dashboard', path: '#', icon: <Settings size={18} /> },
  ];

  const handleLogout = () => {
    logoutDemo();
    navigate('/login');
  };

  const isDark = location.pathname === '/requests';

  return (
    <div className="flex h-screen bg-[#F8F9FA] font-sans">
      
      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Topbar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 z-30 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Share2 size={24} className="text-gray-900" />
          <span className="font-extrabold text-xl tracking-tight text-gray-900">SkillSync AI</span>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-gray-600">
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-[260px] bg-[#F8F9FA] border-r border-gray-100 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full py-8 px-6">
          <div className="flex items-center gap-2 mb-8 pl-2">
            <Share2 size={28} className="text-gray-900 stroke-[2.5]" />
            <div>
              <h1 className="text-xl font-black text-gray-900 tracking-tight leading-tight">SkillSync AI</h1>
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Learn together. Grow together.</p>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <div className="space-y-1 mb-8">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path || (location.pathname === '/' && item.name === 'Home');
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-xl transition-all font-semibold text-xs ${
                      isActive 
                        ? 'bg-gray-900 text-white shadow-md' 
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="flex items-center">
                      <span className={`mr-4 ${isActive ? 'text-white' : 'text-gray-400'}`}>
                        {item.icon}
                      </span>
                      {item.name}
                    </div>
                    {item.badge && (
                      <span className="bg-gray-900 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="mb-6 pl-4">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Get Started</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle size={16} className="text-gray-900" />
                  <span className="text-xs font-semibold text-gray-900">Login / Signup</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle size={16} className="text-gray-900" />
                  <span className="text-xs font-semibold text-gray-900">Profile Setup</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border-4 border-gray-900 bg-white"></div>
                  <span className="text-xs font-bold text-gray-900">Student Profile</span>
                </div>
                <div className="flex items-center gap-3">
                  <Circle size={16} className="text-gray-300" />
                  <span className="text-xs font-semibold text-gray-400">Skill Exchange Request</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-3 px-2 mb-4 cursor-pointer group">
               <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 shrink-0 border border-gray-300">
                 {profile?.full_name?.charAt(0) || 'U'}
               </div>
               <div className="flex-1 truncate">
                 <p className="text-sm font-bold text-gray-900 truncate">{profile?.full_name || 'User'}</p>
                 <p className="text-xs font-medium text-gray-500 truncate">{profile?.department} • {profile?.year} Year</p>
               </div>
               <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600" />
            </div>
            
            <button className="flex items-center w-full px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors">
              <Settings size={16} className="mr-4 text-gray-400" />
              Settings
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors"
            >
              <LogOut size={16} className="mr-4 text-gray-400" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-[#F8F9FA]">
        <main className="flex-1 overflow-y-auto relative z-10 px-4 py-6 sm:px-8 lg:px-10 lg:py-8 pt-24 lg:pt-8 custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Sidebar;
