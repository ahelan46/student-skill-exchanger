import { useState, useEffect } from 'react';
import { getRequests, getSessions, getMyProfile } from '../services/skillSyncApi';
import { LoadingSpinner, ErrorMessage } from '../components/UIComponents';
import { Plus, Send, Clock, Users, CheckCircle2, MoreVertical, XCircle, Lightbulb, MessageSquare, Video, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // ADDED: active tab state
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const username = localStorage.getItem('demo_username');
        const profileRes = await getMyProfile();
        const myProfile = profileRes.data.find(p => p.user.username === username);
        setProfile(myProfile);

        const [reqsRes, sessRes] = await Promise.all([
          getRequests(),
          getSessions()
        ]);
        
        setRequests(reqsRes.data);
        setSessions(sessRes.data);
      } catch (err) {
        setError('Failed to load exchanges.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  // Map real backend requests to UI format, fallback to mock data if empty (for demo)
  const formattedRequests = requests.length > 0 ? requests.map(req => {
    // Determine if I am the sender or receiver
    const isSender = req.sender_detail?.user?.username === profile?.user?.username;
    const partner = isSender ? req.receiver_detail : req.sender_detail;
    
    // Status formatting
    const statusMap = {
        'PENDING': 'Pending',
        'ACCEPTED': 'Accepted',
        'REJECTED': 'Declined',
        'COMPLETED': 'Completed'
    };

    return {
        id: req.id,
        partner: {
            name: partner?.full_name || 'Unknown',
            dept: partner?.department || 'CSE',
            year: partner?.year || '3rd',
            rating: 4.8,
            reviews: 12,
            online: true
        },
        offered: [req.offered_skill_detail?.name || 'Skill'],
        wanted: [req.requested_skill_detail?.name || 'Skill'],
        status: statusMap[req.status] || 'Pending',
        msg: req.message || "Hi, I'd like to connect!",
        dateStr: new Date(req.created_at).toLocaleDateString()
    };
  }) : [
    {
        id: 1,
        partner: { name: 'Anitha S', dept: 'CSE', year: '3rd', rating: 4.8, reviews: 32, online: true },
        offered: ['UI/UX Design', 'Figma'],
        wanted: ['Python', 'Data Analysis'],
        status: 'Pending',
        msg: "Hi! I'd love to exchange my UI/UX skills for Python and Data Analysis...",
        dateStr: '2 days ago'
    },
    {
        id: 2,
        partner: { name: 'Harsha', dept: 'CSE', year: '3rd', rating: 4.6, reviews: 25, online: false },
        offered: ['React', 'CSS', 'JavaScript'],
        wanted: ['Java', 'Spring Boot'],
        status: 'Accepted',
        msg: "Let's learn and grow together! I can help you with React...",
        dateStr: '5 days ago'
    },
    {
        id: 3,
        partner: { name: 'Priya M', dept: 'ECE', year: '3rd', rating: 4.5, reviews: 20, online: true },
        offered: ['Python', 'Machine Learning'],
        wanted: ['UI/UX Design', 'Figma'],
        status: 'Ongoing',
        msg: "I can teach you Python and ML. Looking forward to learning...",
        dateStr: 'Started 3 days ago'
    }
  ];

  // FILTER LOGIC
  const filteredRequests = formattedRequests.filter(req => 
    activeTab === 'All' || req.status === activeTab
  );

  return (
    <div className="max-w-[1400px] mx-auto w-full pb-10 text-gray-900">
      
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">My Exchanges</h1>
          <p className="text-gray-500 text-sm">Track your skill exchange requests, ongoing collaborations, and completed sessions.</p>
        </div>
        <Link to="/matches" className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-colors flex items-center shadow-lg">
            <Plus size={16} className="mr-2" strokeWidth={3} /> New Exchange Request
        </Link>
      </div>

      <div className="flex gap-8 border-b border-gray-200 mb-8 overflow-x-auto custom-scrollbar">
        {['All', 'Pending', 'Accepted', 'Ongoing', 'Completed', 'Declined'].map((tab) => (
            <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={`pb-4 whitespace-nowrap text-sm font-bold border-b-2 transition-colors ${activeTab === tab ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                {tab}
            </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Column: List */}
        <div className="lg:col-span-3 space-y-6">
            
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
                <div className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-900">
                        <Send size={20} />
                    </div>
                    <div>
                        <p className="text-2xl font-black text-gray-900">{formattedRequests.length}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Requests</p>
                    </div>
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-900">
                        <Clock size={20} />
                    </div>
                    <div>
                        <p className="text-2xl font-black text-gray-900">{formattedRequests.filter(r => r.status === 'Pending').length}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pending</p>
                    </div>
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-900">
                        <Users size={20} />
                    </div>
                    <div>
                        <p className="text-2xl font-black text-gray-900">{formattedRequests.filter(r => r.status === 'Ongoing' || r.status === 'Accepted').length}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ongoing</p>
                    </div>
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <CheckCircle2 size={20} />
                    </div>
                    <div>
                        <p className="text-2xl font-black text-gray-900">{formattedRequests.filter(r => r.status === 'Completed').length}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Completed</p>
                    </div>
                </div>
            </div>

            {/* List */}
            {filteredRequests.length === 0 ? (
                <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center shadow-sm">
                    <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 mb-2">No {activeTab.toLowerCase()} requests</h3>
                    <p className="text-sm text-gray-500">You don't have any requests in this category right now.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredRequests.map(req => {
                        let statusColor = "text-gray-600 bg-gray-100 border-gray-200";
                        let statusIcon = <Clock size={12} className="mr-1.5" />;
                        if (req.status === 'Accepted') { statusColor = "text-emerald-700 bg-emerald-50 border-emerald-200"; statusIcon = <CheckCircle2 size={12} className="mr-1.5" />; }
                        if (req.status === 'Ongoing') { statusColor = "text-blue-700 bg-blue-50 border-blue-200"; statusIcon = <Clock size={12} className="mr-1.5" />; }
                        if (req.status === 'Completed') { statusColor = "text-emerald-700 bg-emerald-50 border-emerald-200"; statusIcon = <CheckCircle2 size={12} className="mr-1.5" />; }
                        if (req.status === 'Declined') { statusColor = "text-red-700 bg-red-50 border-red-200"; statusIcon = <XCircle size={12} className="mr-1.5" />; }

                        return (
                            <div key={req.id} className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col xl:flex-row gap-6 hover:border-gray-300 transition-colors shadow-sm hover:shadow-md">
                                {/* Profile Col */}
                                <div className="w-48 shrink-0">
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-bold text-lg text-gray-600">
                                                {req.partner.name.charAt(0)}
                                            </div>
                                            {req.partner.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                                                {req.partner.name}
                                                {req.partner.online && <span className="bg-emerald-100 text-emerald-700 border border-emerald-200 text-[9px] px-1.5 py-0.5 rounded-full font-bold">Online</span>}
                                                {!req.partner.online && <span className="text-[10px] text-gray-400">Offline</span>}
                                            </h3>
                                            <p className="text-[10px] text-gray-500 font-medium">{req.partner.dept} • {req.partner.year} Year</p>
                                            <div className="flex items-center gap-1 text-[10px] text-yellow-500 font-bold mt-1">
                                                <span className="text-lg leading-none">★</span>
                                                <span>{req.partner.rating}</span>
                                                <span className="text-gray-400 font-medium">({req.partner.reviews} reviews)</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Skills Col */}
                                <div className="flex-1 space-y-4">
                                    <div className="flex flex-col sm:flex-row gap-6">
                                        <div className="flex-1">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Skills Offered</p>
                                            <div className="flex flex-wrap gap-2">
                                                {req.offered.map(s => <span key={s} className="text-xs font-semibold px-2.5 py-1 rounded bg-gray-50 text-gray-600 border border-gray-100">{s}</span>)}
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Skills Wanted</p>
                                            <div className="flex flex-wrap gap-2">
                                                {req.wanted.map(s => <span key={s} className="text-xs font-semibold px-2.5 py-1 rounded bg-gray-50 text-gray-600 border border-gray-100">{s}</span>)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2 bg-gray-50 border border-gray-100 rounded-lg p-3">
                                        <MessageSquare size={14} className="text-gray-400 mt-0.5 shrink-0" />
                                        <p className="text-xs text-gray-600 font-medium italic">"{req.msg}"</p>
                                    </div>
                                </div>

                                {/* Actions Col */}
                                <div className="w-full xl:w-40 flex flex-row xl:flex-col items-center xl:items-end justify-between xl:justify-start gap-4 shrink-0">
                                    <div className="flex items-center justify-between w-full">
                                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border flex items-center ${statusColor}`}>
                                            {statusIcon} {req.status}
                                        </span>
                                        <button className="text-gray-400 hover:text-gray-900"><MoreVertical size={16} /></button>
                                    </div>
                                    
                                    <p className="text-[10px] text-gray-400 font-semibold">{req.dateStr}</p>
                                    
                                    <div className="flex gap-2 w-full mt-auto">
                                        <button className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg text-xs font-bold transition-colors">
                                            View
                                        </button>
                                        {req.status === 'Pending' && <button className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg text-xs font-bold transition-colors">Cancel</button>}
                                        {req.status === 'Accepted' && <button className="flex-1 py-2 bg-gray-900 hover:bg-black text-white rounded-lg text-xs font-bold transition-colors">Message</button>}
                                        {req.status === 'Ongoing' && <button className="flex-1 py-2 bg-gray-900 hover:bg-black text-white rounded-lg text-xs font-bold transition-colors">Schedule</button>}
                                        {req.status === 'Completed' && <button className="flex-1 py-2 bg-gray-900 hover:bg-black text-white rounded-lg text-xs font-bold transition-colors">Feedback</button>}
                                        {req.status === 'Declined' && <button className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg text-xs font-bold transition-colors">Retry</button>}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>

        {/* Right Column: Sidebar */}
        <div className="space-y-6">
            
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-gray-900">Upcoming Sessions</h3>
                    <Link to="/sessions" className="text-[10px] font-bold text-gray-400 flex items-center hover:text-gray-900 transition-colors uppercase tracking-widest">View all <ArrowRight size={12} className="ml-1" /></Link>
                </div>
                
                <div className="space-y-6">
                    {[
                        { title: 'Python Basics', partner: 'Anitha S', time: 'SEP 25 • 11:00 AM' },
                        { title: 'UI/UX Design Review', partner: 'Priya M', time: 'SEP 27 • 2:00 PM' },
                        { title: 'Project Discussion', partner: 'Harsha', time: 'SEP 29 • 10:00 AM' }
                    ].map(s => (
                        <div key={s.title} className="flex gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex flex-col items-center justify-center shrink-0">
                                <span className="text-[9px] font-bold text-gray-500">{s.time.split(' ')[0]}</span>
                                <span className="text-sm font-black text-gray-900">{s.time.split(' ')[1]}</span>
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-bold text-gray-900">{s.title}</h4>
                                <p className="text-[10px] font-medium text-gray-500 mt-0.5">with {s.partner}</p>
                                <p className="text-[9px] text-gray-400 font-bold mt-1 uppercase">{s.time.split('•')[1]}</p>
                            </div>
                            <button className="text-gray-400 hover:text-gray-900"><Video size={16} /></button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-gray-900">Exchange Activity</h3>
                    <Link to="#" className="text-[10px] font-bold text-gray-400 flex items-center hover:text-gray-900 transition-colors uppercase tracking-widest">View all <ArrowRight size={12} className="ml-1" /></Link>
                </div>
                
                <div className="relative">
                    <div className="absolute left-2.5 top-2 bottom-2 w-px bg-gray-100"></div>
                    <div className="space-y-6 relative z-10">
                        <div className="flex gap-4">
                            <div className="w-5 h-5 rounded-full bg-emerald-500 border-[4px] border-white shrink-0 mt-0.5 shadow-sm"></div>
                            <div>
                                <p className="text-xs font-bold text-gray-900">Anitha S accepted your request</p>
                                <p className="text-[10px] font-medium text-gray-500 mt-1">2 hours ago</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-5 h-5 rounded-full bg-blue-500 border-[4px] border-white shrink-0 mt-0.5 shadow-sm"></div>
                            <div>
                                <p className="text-xs font-bold text-gray-900">You sent a request to Priya M</p>
                                <p className="text-[10px] font-medium text-gray-500 mt-1">5 hours ago</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-5 h-5 rounded-full bg-emerald-500 border-[4px] border-white shrink-0 mt-0.5 shadow-sm"></div>
                            <div>
                                <p className="text-xs font-bold text-gray-900">Session completed with Karthik</p>
                                <p className="text-[10px] font-medium text-gray-500 mt-1">2 days ago</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-5 h-5 rounded-full bg-gray-400 border-[4px] border-white shrink-0 mt-0.5 shadow-sm"></div>
                            <div>
                                <p className="text-xs font-bold text-gray-500">Harsha declined your request</p>
                                <p className="text-[10px] font-medium text-gray-400 mt-1">3 days ago</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gray-50 border border-gray-100 rounded-3xl p-6 relative overflow-hidden group hover:border-gray-200 transition-colors shadow-sm">
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-yellow-500/20 transition-colors"></div>
                <div className="flex items-start gap-4 relative z-10">
                    <div className="w-10 h-10 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center text-yellow-500 shrink-0">
                        <Lightbulb size={20} />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-gray-900 mb-2">Keep Learning!</h4>
                        <p className="text-xs text-gray-500 leading-relaxed font-medium mb-4">
                            Send more exchange requests to build new connections and enhance your skills.
                        </p>
                        <button className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white hover:bg-black transition-colors">
                            <ArrowRight size={14} />
                        </button>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}
