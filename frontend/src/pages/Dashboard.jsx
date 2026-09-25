import { useState, useEffect } from 'react';
import { getRequests, getMatches, getSessions, getStudentSkills, getMyProfile } from '../services/skillSyncApi';
import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle, Users, BarChart2, ArrowRight, Video, Clock, CheckCircle2, Bookmark } from 'lucide-react';
import { LoadingSpinner, ErrorMessage } from '../components/UIComponents';

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ learning: 0, completed: 5, active: 0, progress: 68 });
  const [recommendations, setRecommendations] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const username = localStorage.getItem('demo_username');
        const [requestsRes, matchesRes, sessionsRes, skillsRes, profileRes] = await Promise.all([
          getRequests(),
          getMatches({ limit: 3 }),
          getSessions(),
          getStudentSkills(),
          getMyProfile()
        ]);

        const myProfile = profileRes.data.find(p => p.user.username === username);
        setProfile(myProfile);

        const myId = myProfile ? myProfile.user.id : 1;
        const mySkills = skillsRes.data.filter(s => s.student === myId);
        
        setStats({
          learning: mySkills.filter(s => s.skill_type === 'LEARN').length || 12,
          completed: 5,
          active: requestsRes.data.filter(r => r.status?.toLowerCase() === 'accepted' || r.status?.toLowerCase() === 'ongoing').length || 8,
          progress: 68
        });

        // Use top 3 matches
        setRecommendations(matchesRes.data.results?.slice(0,3) || matchesRes.data.slice(0,3));

        // Format Sessions
        const formattedSessions = sessionsRes.data.slice(0, 3).map((sess, i) => ({
          id: sess.id,
          title: sess.notes || 'Skill Exchange Session',
          partner: sess.request_details?.sender?.username === username ? sess.request_details?.receiver?.username : sess.request_details?.sender?.username,
          time: new Date(sess.scheduled_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
        }));
        
        // Fallback fake sessions if empty
        setUpcomingSessions(formattedSessions.length > 0 ? formattedSessions : [
          { id: 1, title: 'Python Basics', partner: 'Priya Sharma', time: 'Sep 25, 11:00 AM' },
          { id: 2, title: 'UI/UX Design', partner: 'Anitha S', time: 'Sep 27, 2:00 PM' },
          { id: 3, title: 'Data Analysis', partner: 'Harsha', time: 'Sep 29, 10:00 AM' }
        ]);

        // Format Activity
        const activity = [
          { id: 1, type: 'completed', text: 'You completed Python Basics', time: '2 hours ago' },
          { id: 2, type: 'request', text: 'You sent an exchange request to Anitha S', time: '5 hours ago' },
          { id: 3, type: 'session', text: 'Session with Harsha completed', time: '1 day ago' },
          { id: 4, type: 'goal', text: 'Added UI/UX Design to your learning goals', time: '2 days ago' }
        ];
        setRecentActivity(activity);

      } catch (err) {
        console.error(err);
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="max-w-[1400px] mx-auto w-full pb-10">
      
      {/* Header Row */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-8">
        <div>
          <p className="text-xs font-bold text-yellow-600 tracking-widest uppercase mb-2">
            Good Morning, {profile?.full_name?.split(' ')[0]?.toUpperCase() || 'JOHN'} 👋
          </p>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Let's learn, connect, and grow together.</h1>
          <p className="text-gray-500 font-medium">Track your progress, discover new skills, and find the right people to learn with.</p>
        </div>
        
        {/* Banner */}
        <div className="hidden lg:block relative bg-gradient-to-r from-blue-50 to-pink-50 rounded-3xl p-6 w-[340px] shrink-0 border border-white shadow-sm overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full blur-3xl -mr-10 -mt-10 opacity-60"></div>
           <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-100 rounded-full blur-3xl -ml-10 -mb-10 opacity-60"></div>
           <div className="relative z-10 flex justify-between items-center h-full">
              <div className="text-sm font-black text-gray-800 leading-tight">
                  <p className="text-blue-600">New skills</p>
                  <p className="text-purple-600">New people</p>
                  <p className="text-gray-900">A brighter you</p>
              </div>
              <img src="https://ui-avatars.com/api/?name=Student&background=random&size=100" alt="Student" className="w-16 h-16 rounded-full border-4 border-white shadow-md object-cover object-right" />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        
        {/* Main Left Content */}
        <div className="xl:col-span-3 space-y-8">
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50/50 border border-blue-100 rounded-3xl p-5 hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden group">
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-200 group-hover:translate-x-1 transition-transform"><ArrowRight size={16} /></div>
                    <div className="flex items-center gap-4 mb-3 relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center text-white shadow-sm shadow-blue-200">
                            <BookOpen size={20} />
                        </div>
                        <div>
                            <p className="text-3xl font-black text-gray-900">{stats.learning}</p>
                            <p className="text-[10px] font-bold text-gray-600 mt-0.5">Skills Learning</p>
                        </div>
                    </div>
                    <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-1"><ArrowRight size={10} className="-rotate-45" /> 2 this month</p>
                </div>
                
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-5 hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden group">
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-200 group-hover:translate-x-1 transition-transform"><ArrowRight size={16} /></div>
                    <div className="flex items-center gap-4 mb-3 relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-sm shadow-emerald-200">
                            <CheckCircle size={20} />
                        </div>
                        <div>
                            <p className="text-3xl font-black text-gray-900">{stats.completed}</p>
                            <p className="text-[10px] font-bold text-gray-600 mt-0.5">Completed Skills</p>
                        </div>
                    </div>
                    <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-1"><ArrowRight size={10} className="-rotate-45" /> 2 this month</p>
                </div>

                <div className="bg-orange-50/50 border border-orange-100 rounded-3xl p-5 hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden group">
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-200 group-hover:translate-x-1 transition-transform"><ArrowRight size={16} /></div>
                    <div className="flex items-center gap-4 mb-3 relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-orange-400 flex items-center justify-center text-white shadow-sm shadow-orange-200">
                            <Users size={20} />
                        </div>
                        <div>
                            <p className="text-3xl font-black text-gray-900">{stats.active}</p>
                            <p className="text-[10px] font-bold text-gray-600 mt-0.5">Active Exchanges</p>
                        </div>
                    </div>
                    <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-1"><ArrowRight size={10} className="-rotate-45" /> 3 this month</p>
                </div>

                <div className="bg-pink-50/50 border border-pink-100 rounded-3xl p-5 hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden group">
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-200 group-hover:translate-x-1 transition-transform"><ArrowRight size={16} /></div>
                    <div className="flex items-center gap-4 mb-3 relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-pink-500 flex items-center justify-center text-white shadow-sm shadow-pink-200">
                            <BarChart2 size={20} />
                        </div>
                        <div>
                            <p className="text-3xl font-black text-gray-900">{stats.progress}%</p>
                            <p className="text-[10px] font-bold text-gray-600 mt-0.5">Overall Progress</p>
                        </div>
                    </div>
                    <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-1"><ArrowRight size={10} className="-rotate-45" /> 12% this month</p>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                
                {/* Circular Progress */}
                <div className="md:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-900">Learning Progress</h3>
                        <select className="text-xs font-bold text-gray-500 bg-gray-50 border border-gray-100 rounded-lg px-2 py-1 outline-none">
                            <option>This Month</option>
                        </select>
                    </div>
                    <div className="flex items-center justify-between mt-8">
                        <div className="relative w-32 h-32 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                <path strokeDasharray="100, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f3f4f6" strokeWidth="3" />
                                <path strokeDasharray="68, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
                                <path strokeDasharray="20, 100" strokeDashoffset="-68" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
                            </svg>
                            <div className="absolute text-center flex flex-col items-center mt-1">
                                <span className="text-2xl font-black text-gray-900 leading-none">68%</span>
                                <span className="text-[8px] font-bold text-gray-400 uppercase mt-1">Overall Progress</span>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between gap-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                                    <span className="text-xs font-semibold text-gray-600">Completed</span>
                                </div>
                                <span className="text-xs font-black text-gray-900">5</span>
                            </div>
                            <div className="flex items-center justify-between gap-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                                    <span className="text-xs font-semibold text-gray-600">In Progress</span>
                                </div>
                                <span className="text-xs font-black text-gray-900">8</span>
                            </div>
                            <div className="flex items-center justify-between gap-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
                                    <span className="text-xs font-semibold text-gray-600">Not Started</span>
                                </div>
                                <span className="text-xs font-black text-gray-900">3</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Line Chart */}
                <div className="md:col-span-3 bg-white rounded-3xl border border-gray-100 shadow-sm p-6 relative overflow-hidden">
                    <div className="flex justify-between items-center mb-6 relative z-10">
                        <h3 className="font-bold text-gray-900">Skill Exchange Activity</h3>
                        <select className="text-xs font-bold text-gray-500 bg-gray-50 border border-gray-100 rounded-lg px-2 py-1 outline-none">
                            <option>Last 6 Months</option>
                        </select>
                    </div>
                    
                    <div className="flex gap-4 mb-4 relative z-10">
                        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500"></span><span className="text-[10px] font-semibold text-gray-500">Requests Sent</span></div>
                        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-500"></span><span className="text-[10px] font-semibold text-gray-500">Requests Received</span></div>
                    </div>

                    {/* CSS Mock Chart */}
                    <div className="h-40 w-full relative mt-4 border-b border-l border-gray-100 flex items-end">
                        <div className="absolute left-0 bottom-0 w-full h-full bg-gradient-to-t from-blue-50/50 to-transparent"></div>
                        
                        {/* Grid lines */}
                        <div className="absolute left-0 w-full bottom-1/4 border-b border-gray-50 border-dashed"></div>
                        <div className="absolute left-0 w-full bottom-2/4 border-b border-gray-50 border-dashed"></div>
                        <div className="absolute left-0 w-full bottom-3/4 border-b border-gray-50 border-dashed"></div>

                        {/* Line 1 SVG */}
                        <svg className="absolute w-full h-full overflow-visible" preserveAspectRatio="none">
                            <path d="M0,130 L100,100 L200,90 L300,70 L400,60 L500,20" fill="none" stroke="#3b82f6" strokeWidth="3" vectorEffect="non-scaling-stroke" />
                            <circle cx="500" cy="20" r="4" fill="#3b82f6" stroke="white" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                        </svg>
                        
                        {/* Line 2 SVG */}
                        <svg className="absolute w-full h-full overflow-visible" preserveAspectRatio="none">
                            <path d="M0,140 L100,120 L200,110 L300,100 L400,90 L500,50" fill="none" stroke="#a855f7" strokeWidth="3" vectorEffect="non-scaling-stroke" />
                            <circle cx="500" cy="50" r="4" fill="#a855f7" stroke="white" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                        </svg>

                        {/* Data points labels */}
                        <div className="absolute right-0 top-[10px] bg-blue-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">18</div>
                        <div className="absolute right-0 top-[40px] bg-purple-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">12</div>
                    </div>
                    <div className="flex justify-between w-full mt-2 text-[9px] font-semibold text-gray-400">
                        <span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span>
                    </div>
                </div>
            </div>

            {/* Recommendations Grid */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-900 text-lg">Recommended for you</h3>
                    <Link to="/matches" className="text-xs font-bold text-gray-500 flex items-center hover:text-gray-900 transition-colors">View all <ArrowRight size={14} className="ml-1" /></Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {recommendations.map(rec => (
                        <div key={rec.student_id} className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm hover:shadow-md hover:border-gray-200 transition-all flex flex-col">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 shrink-0">
                                    {rec.name.charAt(0)}
                                </div>
                                <div className="flex-1 truncate">
                                    <p className="text-sm font-bold text-gray-900 truncate">{rec.name}</p>
                                    <p className="text-[10px] font-medium text-gray-500 truncate">{rec.department} • {rec.year} Year</p>
                                </div>
                                <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
                                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                        <path strokeDasharray="100, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f3f4f6" strokeWidth="3" />
                                        <path strokeDasharray={`${rec.match_score}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
                                    </svg>
                                    <div className="absolute text-center flex flex-col items-center">
                                        <span className="text-[10px] font-black text-gray-900 leading-none">{rec.match_score}%</span>
                                        <span className="text-[5px] font-bold text-gray-400 uppercase">Match</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex justify-between items-start gap-4 mb-4">
                                <div className="flex-1">
                                    <p className="text-[10px] font-bold text-gray-900 mb-2">Teaches</p>
                                    <div className="flex flex-col gap-1">
                                        {rec.teaches.slice(0,3).map(s => <span key={s.id} className="bg-gray-50 text-gray-600 text-[10px] px-2 py-1 rounded-md font-medium border border-gray-100">{s.name}</span>)}
                                    </div>
                                </div>
                                <div className="flex items-center justify-center mt-6 text-gray-300">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 16V4M7 4L3 8M7 4L11 8M17 8v12M17 20l4-4M17 20l-4-4"/></svg>
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-bold text-gray-900 mb-2">Wants to Learn</p>
                                    <div className="flex flex-col gap-1">
                                        {rec.wants_to_learn.slice(0,3).map(s => <span key={s.id} className="bg-gray-50 text-gray-600 text-[10px] px-2 py-1 rounded-md font-medium border border-gray-100">{s.name}</span>)}
                                    </div>
                                </div>
                            </div>

                            <p className="text-[10px] text-gray-500 font-medium italic mb-5 leading-relaxed">
                                "{rec.explanation[0] || 'Great match for both of us!'}"
                            </p>

                            <div className="flex items-center gap-2 mt-auto">
                                <Link to="/matches" className="flex-1 text-center py-2 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-colors">
                                    View Profile →
                                </Link>
                                <button className="p-2 border border-gray-200 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-colors">
                                    <Bookmark size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>

        {/* Right Sidebar Content */}
        <div className="space-y-8">
            
            {/* Upcoming Sessions */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-gray-900">Upcoming Sessions</h3>
                    <Link to="/sessions" className="text-[10px] font-bold text-gray-400 flex items-center hover:text-gray-900 transition-colors uppercase tracking-widest">View all <ArrowRight size={12} className="ml-1" /></Link>
                </div>
                
                <div className="space-y-6">
                    {upcomingSessions.map(s => {
                        const dateObj = new Date(s.time);
                        const month = dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
                        const day = dateObj.toLocaleDateString('en-US', { day: 'numeric' });
                        const timeStr = dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

                        return (
                            <div key={s.id} className="flex gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex flex-col items-center justify-center shrink-0">
                                    <span className="text-[9px] font-bold text-gray-500">{month}</span>
                                    <span className="text-sm font-black text-gray-900">{day}</span>
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-gray-900">{s.title}</h4>
                                    <p className="text-[10px] font-medium text-gray-500 mt-0.5">with {s.partner}</p>
                                    <p className="text-[9px] text-gray-400 font-bold mt-1 uppercase">{timeStr}</p>
                                </div>
                                <button className="text-gray-400 hover:text-gray-900"><Video size={16} /></button>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-gray-900">Recent Activity</h3>
                    <Link to="#" className="text-[10px] font-bold text-gray-400 flex items-center hover:text-gray-900 transition-colors uppercase tracking-widest">View all <ArrowRight size={12} className="ml-1" /></Link>
                </div>
                
                <div className="relative">
                    <div className="absolute left-2.5 top-2 bottom-2 w-px bg-gray-100"></div>
                    <div className="space-y-6 relative z-10">
                        {recentActivity.map(act => {
                            let icon, bgClass;
                            if (act.type === 'completed') { icon = <CheckCircle2 size={12} className="text-emerald-600" />; bgClass = 'bg-emerald-50 border-white'; }
                            else if (act.type === 'request') { icon = <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600"><path d="M7 16V4M7 4L3 8M7 4L11 8M17 8v12M17 20l4-4M17 20l-4-4"/></svg>; bgClass = 'bg-blue-50 border-white'; }
                            else if (act.type === 'session') { icon = <Users size={12} className="text-purple-600" />; bgClass = 'bg-purple-50 border-white'; }
                            else if (act.type === 'goal') { icon = <Bookmark size={12} className="text-gray-900" />; bgClass = 'bg-gray-100 border-white'; }

                            return (
                                <div key={act.id} className="flex gap-4">
                                    <div className={`w-6 h-6 rounded-full ${bgClass} border-4 flex items-center justify-center shrink-0 mt-0.5 shadow-sm`}>
                                        {icon}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-900">{act.text}</p>
                                        <p className="text-[10px] font-medium text-gray-500 mt-1">{act.time}</p>
                                    </div>
                                </div>
                            )
                        })}
                        <div className="flex gap-4">
                            <div className="w-6 h-6 rounded-full bg-orange-50 border-4 border-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                                <span className="text-orange-500 text-xs">★</span>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-900">New match found</p>
                                <p className="text-[10px] font-medium text-gray-500 mt-1">Meena Nair is a great match for you<br/>2 days ago</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

      </div>
    </div>
  );
}
