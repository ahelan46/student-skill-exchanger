import { useState, useEffect } from 'react';
import { getMatches, sendExchangeRequest, getStudentSkills } from '../services/skillSyncApi';
import { LoadingSpinner, ErrorMessage } from '../components/UIComponents';
import { Search, Filter, ShieldCheck, MessageSquare, Sparkles, ChevronDown, Bookmark, CheckCircle2, Star, Check } from 'lucide-react';

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [myTeachSkills, setMyTeachSkills] = useState([]);
  const [myLearnSkills, setMyLearnSkills] = useState([]);
  const [sendingState, setSendingState] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const username = localStorage.getItem('demo_username');
        const [matchesRes, skillsRes] = await Promise.all([
          getMatches({}),
          getStudentSkills()
        ]);
        
        setMatches(matchesRes.data.results || matchesRes.data);
        if (matchesRes.data.results?.length > 0) {
            setSelectedMatch(matchesRes.data.results[0]);
        } else if (matchesRes.data?.length > 0) {
            setSelectedMatch(matchesRes.data[0]);
        }

        const myId = parseInt(localStorage.getItem('demo_userid') || '1'); // Fallback to 1 if not set
        const mySkills = skillsRes.data.filter(s => s.student === myId);
        setMyTeachSkills(mySkills.filter(s => s.skill_type === 'TEACH'));
        setMyLearnSkills(mySkills.filter(s => s.skill_type === 'LEARN'));

      } catch (err) {
        setError('Failed to load matches.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSendRequest = async (match) => {
    setSendingState({ ...sendingState, [match.student_id]: 'loading' });
    try {
        // Find a skill we can offer (must be in our teach list)
        const myTeachSkillIds = myTeachSkills.map(s => s.skill_detail.id);
        const offeredSkill = match.wants_to_learn.find(s => myTeachSkillIds.includes(s.id)) || { id: myTeachSkillIds[0] };
        
        // Find a skill we can request (must be in their teach list)
        const myLearnSkillIds = myLearnSkills.map(s => s.skill_detail.id);
        const requestedSkill = match.teaches.find(s => myLearnSkillIds.includes(s.id)) || match.teaches[0];

        if (!offeredSkill?.id || !requestedSkill?.id) {
            alert('Cannot find valid skills to exchange. Please add more skills to your profile.');
            setSendingState({ ...sendingState, [match.student_id]: 'error' });
            return;
        }

        await sendExchangeRequest({
            receiver: match.student_id,
            offered_skill: offeredSkill.id,
            requested_skill: requestedSkill.id
        });
        setSendingState({ ...sendingState, [match.student_id]: 'success' });
    } catch (err) {
        alert(err.response?.data?.non_field_errors?.[0] || err.response?.data?.message || 'Failed to send request.');
        setSendingState({ ...sendingState, [match.student_id]: 'error' });
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="max-w-[1400px] mx-auto w-full pb-10">
      
      <div className="mb-8">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">AI MATCHES</p>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">AI-Powered Skill Matches</h1>
        <p className="text-gray-500">We find the most compatible students who can help you learn while you teach.</p>
      </div>

      <div className="flex items-center justify-between border-b border-gray-200 mb-6">
        <div className="flex gap-8">
            <button className="pb-3 border-b-2 border-gray-900 text-sm font-bold text-gray-900">Best Matches</button>
            <button className="pb-3 border-b-2 border-transparent text-sm font-semibold text-gray-400 hover:text-gray-600">Mutual Exchange</button>
            <button className="pb-3 border-b-2 border-transparent text-sm font-semibold text-gray-400 hover:text-gray-600">High Rating</button>
        </div>
        <button className="flex items-center text-sm font-bold text-gray-600 pb-3 hover:text-gray-900">
            Filter <Filter size={14} className="ml-2" />
        </button>
      </div>

      <div className="flex gap-4 mb-8 overflow-x-auto pb-2 custom-scrollbar">
        {['All Departments', 'Skill', 'Level', 'Year', 'Availability', 'Rating'].map(f => (
            <button key={f} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-xs font-semibold text-gray-600 hover:bg-gray-50 whitespace-nowrap shadow-sm">
                {f} <ChevronDown size={14} className="text-gray-400" />
            </button>
        ))}
        <button className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-gray-600 ml-2">Reset</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Match List */}
        <div className="lg:col-span-2 space-y-4">
          {matches.map((match) => {
            const isSelected = selectedMatch?.student_id === match.student_id;
            return (
              <div 
                key={match.student_id} 
                onClick={() => setSelectedMatch(match)}
                className={`flex flex-col sm:flex-row items-center justify-between p-5 rounded-2xl border cursor-pointer transition-all ${isSelected ? 'border-gray-900 shadow-md bg-white' : 'border-gray-100 bg-white hover:border-gray-300 hover:shadow-sm'}`}
              >
                <div className="flex items-center gap-5 w-full sm:w-auto">
                    <div className="relative">
                        <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-600">
                            {match.name.charAt(0)}
                        </div>
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-base">{match.name}</h3>
                        <p className="text-[10px] text-gray-500 font-medium mb-1">{match.department} • {match.year} Year</p>
                        <div className="flex items-center gap-1 text-[10px] text-yellow-500 font-bold">
                            <Star size={10} fill="currentColor" />
                            <span>4.8</span>
                            <span className="text-gray-400 font-medium ml-1">(32 reviews)</span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between w-full sm:w-auto sm:flex-1 sm:px-8 mt-4 sm:mt-0 text-xs">
                    <div className="w-[45%] sm:w-auto">
                        <p className="font-bold text-gray-900 mb-2">Teaches</p>
                        <div className="flex flex-wrap gap-1.5">
                            {match.teaches.slice(0,2).map(s => <span key={s.id} className="bg-gray-100 text-gray-600 px-2 py-1 rounded font-medium">{s.name}</span>)}
                        </div>
                    </div>
                    <div className="w-[45%] sm:w-auto">
                        <p className="font-bold text-gray-900 mb-2">Wants to learn</p>
                        <div className="flex flex-wrap gap-1.5">
                            {match.wants_to_learn.slice(0,2).map(s => <span key={s.id} className="bg-gray-100 text-gray-600 px-2 py-1 rounded font-medium">{s.name}</span>)}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6 mt-4 sm:mt-0 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="relative w-14 h-14 flex items-center justify-center">
                      <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 36 36">
                        <path strokeDasharray="100, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f3f4f6" strokeWidth="2.5" />
                        <path strokeDasharray={`${match.match_score}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#111827" strokeWidth="2.5" />
                      </svg>
                      <div className="absolute text-center flex flex-col items-center justify-center mt-1">
                          <span className="text-[12px] font-black text-gray-900 leading-none">{match.match_score}%</span>
                          <span className="text-[8px] font-bold text-gray-500 uppercase mt-0.5">Match</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <button className="px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-colors">
                            View Profile
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-900 border border-gray-200 rounded-xl hover:bg-gray-50">
                            <Bookmark size={16} />
                        </button>
                    </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Right Column: Profile Detail */}
        {selectedMatch && (
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/40 p-8 h-max sticky top-8">
             <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-600">
                        {selectedMatch.name.charAt(0)}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            {selectedMatch.name}
                            <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 border border-emerald-200">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Online
                            </span>
                        </h2>
                        <p className="text-xs text-gray-500 font-medium mb-1">{selectedMatch.department} • {selectedMatch.year} Year</p>
                        <div className="flex items-center gap-1 text-xs text-yellow-500 font-bold">
                            <Star size={12} fill="currentColor" />
                            <span>4.8</span>
                            <span className="text-gray-400 font-medium ml-1">(32 reviews)</span>
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="flex items-center justify-end gap-1 text-gray-900 font-bold mb-1">
                        <ShieldCheck size={16} /> Trust Score
                    </div>
                    <p className="text-2xl font-black text-gray-900">94<span className="text-sm text-gray-400">/100</span></p>
                </div>
             </div>

             <div className="flex gap-3 mb-8">
                {sendingState[selectedMatch.student_id] === 'success' ? (
                   <button className="flex-1 py-3 bg-emerald-100 text-emerald-700 rounded-xl text-sm font-bold flex items-center justify-center border border-emerald-200">
                     <Check size={16} className="mr-2" strokeWidth={3} /> Request Sent
                   </button>
                ) : (
                   <button 
                     onClick={() => handleSendRequest(selectedMatch)}
                     disabled={sendingState[selectedMatch.student_id] === 'loading'}
                     className="flex-1 py-3 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-colors"
                   >
                     {sendingState[selectedMatch.student_id] === 'loading' ? 'Sending...' : 'Request Skill Exchange'}
                   </button>
                )}
                <button className="px-5 py-3 border border-gray-200 text-gray-900 rounded-xl text-sm font-bold hover:bg-gray-50 flex items-center justify-center gap-2">
                    <MessageSquare size={16} /> Message
                </button>
             </div>

             <div className="flex gap-6 border-b border-gray-200 mb-6">
                 <button className="pb-3 border-b-2 border-gray-900 text-xs font-bold text-gray-900">Overview</button>
                 <button className="pb-3 border-b-2 border-transparent text-xs font-bold text-gray-400 hover:text-gray-600">Skills</button>
                 <button className="pb-3 border-b-2 border-transparent text-xs font-bold text-gray-400 hover:text-gray-600">Availability</button>
                 <button className="pb-3 border-b-2 border-transparent text-xs font-bold text-gray-400 hover:text-gray-600">Reviews</button>
             </div>

             <div className="space-y-8">
                <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-2">About Me</h4>
                    <p className="text-xs text-gray-500 leading-relaxed font-medium">
                        I love UI/UX design and enjoy teaching Figma, prototyping, and user research. I am also interested in learning Java and backend development to become a full-stack designer.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Department</p>
                        <p className="text-xs font-bold text-gray-900">{selectedMatch.department}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Year</p>
                        <p className="text-xs font-bold text-gray-900">{selectedMatch.year} Year</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                    <div>
                        <h4 className="text-xs font-bold text-gray-900 mb-4">Skills I Can Teach</h4>
                        <div className="space-y-3">
                            {selectedMatch.teaches.map(s => (
                                <div key={s.id} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                                    <span className="text-xs font-semibold text-gray-700">{s.name}</span>
                                    <span className="text-[9px] font-bold text-gray-400 uppercase">Advanced</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-gray-900 mb-4">Skills I Want to Learn</h4>
                        <div className="space-y-3">
                            {selectedMatch.wants_to_learn.map(s => (
                                <div key={s.id} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                                    <span className="text-xs font-semibold text-gray-700">{s.name}</span>
                                    <span className="text-[9px] font-bold text-gray-400 uppercase">Beginner</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 flex gap-4 items-start">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Sparkles size={16} className="text-gray-900" />
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-gray-900 mb-1">Why This Match?</h4>
                        <p className="text-xs text-gray-500 font-medium leading-relaxed">
                            {selectedMatch.explanation[1] || "You have highly complementary skills and aligned availability."}
                        </p>
                    </div>
                </div>
             </div>
          </div>
        )}

      </div>
    </div>
  );
}
