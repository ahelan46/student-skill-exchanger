import { Link } from 'react-router-dom';
import { Settings, ArrowRight, PlayCircle, BookOpen, Code, Users, Trophy, ExternalLink, Target, CheckCircle2, Video, FileText, Database } from 'lucide-react';

export default function Roadmap() {
  return (
    <div className="max-w-[1400px] mx-auto w-full pb-10 text-gray-900">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">AI LEARNING ROADMAP</p>
          <h1 className="text-4xl font-black tracking-tight mb-2">Your Personalized AI Learning Path</h1>
          <p className="text-gray-500 font-medium">Step by step guidance to build your skills, complete courses and achieve your goals.</p>
        </div>
        <button className="px-4 py-2 bg-white border border-gray-200 text-gray-900 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors flex items-center shadow-sm">
            <Settings size={16} className="mr-2" /> Customize Roadmap
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        
        {/* Main Content */}
        <div className="xl:col-span-3 space-y-8">
            
            {/* Hero Section */}
            <div className="bg-white border border-gray-100 rounded-3xl p-8 relative overflow-hidden shadow-sm flex items-center">
                <div className="absolute right-0 top-0 h-full w-2/3 bg-gradient-to-l from-blue-50 to-transparent"></div>
                <div className="relative z-10 w-full max-w-sm">
                    <h2 className="text-2xl font-black mb-3 text-gray-900">Become an<br/>AI-Ready Learner</h2>
                    <p className="text-sm text-gray-500 font-medium mb-6 leading-relaxed">
                        Follow a structured path, learn at your pace, and gain hands-on skills with real projects.
                    </p>
                    <button className="px-6 py-3 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-colors flex items-center">
                        Start Learning <ArrowRight size={16} className="ml-2" />
                    </button>
                </div>

                {/* Illustrated Path Mockup */}
                <div className="hidden md:flex relative z-10 flex-1 justify-end pr-8">
                    <svg className="w-full h-32 text-gray-200" preserveAspectRatio="none">
                       <path d="M0,80 Q 50,20 100,80 T 200,80 T 300,80 T 400,20" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="8 8" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-between px-8 pt-4">
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-2 shadow-sm border border-white"><BookOpen size={20} /></div>
                            <span className="text-[10px] font-bold text-gray-600 text-center w-20">Build Foundations</span>
                        </div>
                        <div className="flex flex-col items-center mt-[-60px]">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mb-2 shadow-sm border border-white"><Code size={20} /></div>
                            <span className="text-[10px] font-bold text-gray-600 text-center w-20">Learn Concepts</span>
                        </div>
                        <div className="flex flex-col items-center mt-10">
                            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-2 shadow-sm border border-white"><Target size={20} /></div>
                            <span className="text-[10px] font-bold text-gray-600 text-center w-20">Practice with Projects</span>
                        </div>
                        <div className="flex flex-col items-center mt-[-40px]">
                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mb-2 shadow-sm border border-white"><Users size={20} /></div>
                            <span className="text-[10px] font-bold text-gray-600 text-center w-20">Get Matched</span>
                        </div>
                        <div className="flex flex-col items-center mt-[-80px]">
                            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 mb-2 shadow-sm border border-white"><Trophy size={20} /></div>
                            <span className="text-[10px] font-bold text-gray-600 text-center w-20">Achieve Goals</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Roadmap Overview */}
            <div>
                <h3 className="font-bold text-gray-900 text-lg mb-4">Roadmap Overview</h3>
                <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                    {[
                        { num: 1, title: 'Foundations', duration: '2-4 weeks', active: true },
                        { num: 2, title: 'Core AI/ML', duration: '4-8 weeks', active: false },
                        { num: 3, title: 'Advanced Topics', duration: '8-12 weeks', active: false },
                        { num: 4, title: 'Projects & Practice', duration: '12-16 weeks', active: false },
                        { num: 5, title: 'Career Preparation', duration: 'Ongoing', active: false }
                    ].map(stage => (
                        <div key={stage.num} className={`flex items-center gap-4 px-5 py-3 rounded-2xl border shrink-0 ${stage.active ? 'bg-white border-gray-900 shadow-sm' : 'bg-gray-50 border-gray-100 opacity-60'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${stage.active ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                {stage.num}
                            </div>
                            <div>
                                <p className={`text-sm font-bold ${stage.active ? 'text-gray-900' : 'text-gray-600'}`}>{stage.title}</p>
                                <p className="text-[10px] font-semibold text-gray-500 mt-0.5">{stage.duration}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Learning Modules */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-900 text-lg">Learning Modules</h3>
                    <Link to="#" className="text-xs font-bold text-gray-500 flex items-center hover:text-gray-900 transition-colors">View all <ArrowRight size={14} className="ml-1" /></Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { title: 'Introduction to AI', color: 'blue', icon: <BookOpen size={16}/>, curr: 5, tot: 5, pct: 100 },
                        { title: 'Python for AI', color: 'yellow', icon: <Code size={16}/>, curr: 8, tot: 10, pct: 80 },
                        { title: 'Data Analysis', color: 'emerald', icon: <Database size={16}/>, curr: 6, tot: 10, pct: 60 },
                        { title: 'Machine Learning Basics', color: 'purple', icon: <Target size={16}/>, curr: 4, tot: 10, pct: 40 },
                        { title: 'Deep Learning', color: 'pink', icon: <BrainCircuit size={16}/>, curr: 0, tot: 12, pct: 0 },
                        { title: 'Natural Language', color: 'orange', icon: <FileText size={16}/>, curr: 0, tot: 10, pct: 0 },
                        { title: 'Computer Vision', color: 'blue', icon: <Eye size={16}/>, curr: 0, tot: 10, pct: 0 },
                        { title: 'Generative AI', color: 'emerald', icon: <Sparkles size={16}/>, curr: 0, tot: 8, pct: 0 }
                    ].map(mod => (
                        <div key={mod.title} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:border-gray-300 transition-colors cursor-pointer group flex flex-col justify-between h-32">
                            <div className="flex items-start gap-3">
                                <div className={`w-8 h-8 rounded-lg bg-${mod.color}-50 text-${mod.color}-500 flex items-center justify-center shrink-0`}>
                                    {mod.icon}
                                </div>
                                <h4 className="text-xs font-bold text-gray-900 leading-tight">{mod.title}</h4>
                            </div>
                            <div>
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-[10px] font-bold text-gray-400">{mod.curr}/{mod.tot} lessons</span>
                                    {mod.pct > 0 && <span className={`text-[10px] font-bold text-${mod.color}-500`}>{mod.pct}%</span>}
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-1.5">
                                    <div className={`bg-${mod.color}-500 h-1.5 rounded-full`} style={{ width: `${mod.pct}%` }}></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Recommended Learning Path */}
                <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-6">Recommended Learning Path</h3>
                    <div className="relative">
                        <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-gray-100"></div>
                        <div className="space-y-6 relative z-10">
                            {[
                                { num: 1, title: 'Learn Python Basics', desc: 'Understand the fundamentals and practice coding.', time: '2 weeks', color: 'blue' },
                                { num: 2, title: 'Explore Data Analysis', desc: 'Work with real datasets and learn data preprocessing.', time: '3 weeks', color: 'emerald' },
                                { num: 3, title: 'Learn Machine Learning', desc: 'Understand core ML algorithms with hands-on examples.', time: '4 weeks', color: 'purple' },
                                { num: 4, title: 'Build Real Projects', desc: 'Apply your knowledge with guided projects.', time: '4 weeks', color: 'pink' }
                            ].map(step => (
                                <div key={step.num} className="flex gap-4">
                                    <div className={`w-8 h-8 rounded-full bg-${step.color}-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm border-2 border-white`}>
                                        {step.num}
                                    </div>
                                    <div className="flex-1 mt-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <h4 className="text-xs font-bold text-gray-900">{step.title}</h4>
                                            <span className="text-[9px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded uppercase">{step.time}</span>
                                        </div>
                                        <p className="text-[10px] font-medium text-gray-500">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Skills You Will Gain */}
                <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-6">Skills You Will Gain</h3>
                    <div className="flex flex-wrap gap-3">
                        {[
                            { name: 'Python', color: 'blue', icon: <Code size={12}/> },
                            { name: 'Data Analysis', color: 'emerald', icon: <Database size={12}/> },
                            { name: 'Machine Learning', color: 'purple', icon: <Target size={12}/> },
                            { name: 'Deep Learning', color: 'pink', icon: <BrainCircuit size={12}/> },
                            { name: 'NLP', color: 'orange', icon: <FileText size={12}/> },
                            { name: 'Computer Vision', color: 'blue', icon: <Eye size={12}/> },
                            { name: 'Generative AI', color: 'emerald', icon: <Sparkles size={12}/> },
                            { name: 'Model Deployment', color: 'blue', icon: <Cloud size={12}/> }
                        ].map(skill => (
                            <div key={skill.name} className={`flex items-center gap-2 px-3 py-2 rounded-xl bg-${skill.color}-50 border border-${skill.color}-100`}>
                                <span className={`text-${skill.color}-600`}>{skill.icon}</span>
                                <span className={`text-xs font-bold text-${skill.color}-700`}>{skill.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>

        {/* Right Sidebar Content */}
        <div className="space-y-8">
            
            {/* Your Progress */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-gray-900">Your Progress</h3>
                    <Link to="#" className="text-[10px] font-bold text-gray-400 flex items-center hover:text-gray-900 transition-colors uppercase tracking-widest">View Details <ArrowRight size={12} className="ml-1" /></Link>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                    <div className="relative w-24 h-24 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            <path strokeDasharray="100, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f3f4f6" strokeWidth="3" />
                            <path strokeDasharray="45, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                        <div className="absolute text-center flex flex-col items-center">
                            <span className="text-xl font-black text-gray-900 leading-none">45%</span>
                            <span className="text-[7px] font-bold text-gray-400 uppercase mt-1">Overall</span>
                        </div>
                    </div>
                    <div className="flex-1 ml-6 space-y-3">
                        {[
                            { name: 'Foundations', pct: 100, color: 'emerald' },
                            { name: 'Core AI/ML', pct: 60, color: 'blue' },
                            { name: 'Advanced Topics', pct: 20, color: 'purple' },
                            { name: 'Projects', pct: 0, color: 'gray' },
                            { name: 'Career Prep', pct: 0, color: 'gray' }
                        ].map(s => (
                            <div key={s.name}>
                                <div className="flex justify-between items-end mb-1">
                                    <span className="text-[9px] font-bold text-gray-600">{s.name}</span>
                                    <span className="text-[9px] font-bold text-gray-900">{s.pct}%</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-1">
                                    <div className={`bg-${s.color}-500 h-1 rounded-full`} style={{ width: `${s.pct}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Upcoming Milestones */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-gray-900">Upcoming Milestones</h3>
                    <Link to="#" className="text-[10px] font-bold text-gray-400 flex items-center hover:text-gray-900 transition-colors uppercase tracking-widest">View all <ArrowRight size={12} className="ml-1" /></Link>
                </div>
                
                <div className="space-y-6">
                    {[
                        { title: 'Complete Python Basics', date: 'Sep 30, 2024', icon: <CheckCircle2 size={16}/>, color: 'blue' },
                        { title: 'Finish Data Analysis Module', date: 'Oct 15, 2024', icon: <Target size={16}/>, color: 'purple' },
                        { title: 'Start ML Project', date: 'Nov 1, 2024', icon: <Code size={16}/>, color: 'emerald' },
                        { title: 'Get AI Matching', date: 'Nov 15, 2024', icon: <Trophy size={16}/>, color: 'orange' }
                    ].map((m, i) => (
                        <div key={i} className="flex gap-4">
                            <div className={`w-10 h-10 rounded-full bg-${m.color}-50 flex items-center justify-center text-${m.color}-500 shrink-0`}>
                                {m.icon}
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-gray-900">{m.title}</h4>
                                <p className="text-[10px] font-medium text-gray-500 mt-1">{m.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recommended Resources */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-gray-900">Recommended Resources</h3>
                    <Link to="#" className="text-[10px] font-bold text-gray-400 flex items-center hover:text-gray-900 transition-colors uppercase tracking-widest">View all <ArrowRight size={12} className="ml-1" /></Link>
                </div>
                
                <div className="space-y-4">
                    {[
                        { title: 'Python for Beginners', type: 'Video', time: '2 hrs', icon: <Video size={16} className="text-red-500"/> },
                        { title: 'Machine Learning Playlist', type: 'Video', time: '4 hrs', icon: <Video size={16} className="text-red-500"/> },
                        { title: 'Hands-on AI Projects', type: 'Article', time: '10 min', icon: <FileText size={16} className="text-blue-500"/> },
                        { title: 'Kaggle Datasets', type: 'Dataset', time: 'Practice', icon: <Database size={16} className="text-emerald-500"/> }
                    ].map((r, i) => (
                        <div key={i} className="flex items-center gap-4 bg-gray-50 rounded-xl p-3 border border-gray-100 hover:border-gray-200 transition-colors cursor-pointer group">
                            {r.icon}
                            <div className="flex-1">
                                <h4 className="text-xs font-bold text-gray-900">{r.title}</h4>
                                <p className="text-[9px] font-medium text-gray-500 mt-0.5">{r.type} • {r.time}</p>
                            </div>
                            <ExternalLink size={14} className="text-gray-400 group-hover:text-gray-900 transition-colors" />
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Stay Consistent */}
            <div className="bg-blue-50 rounded-3xl p-6 border border-blue-100">
                <div className="flex gap-4">
                    <div className="text-blue-600 mt-1"><BookOpen size={24} /></div>
                    <div>
                        <h4 className="font-bold text-gray-900 text-sm mb-1">Stay Consistent!</h4>
                        <p className="text-[10px] text-gray-600 font-medium mb-4 leading-relaxed">
                            Complete your next module and move closer to becoming AI-ready.
                        </p>
                        <button className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-colors w-full">
                            Continue Learning →
                        </button>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}

// Add Missing Icons missing in imports at the top
function Eye(props) { return <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg> }
function Sparkles(props) { return <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg> }
function Cloud(props) { return <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg> }
function BrainCircuit(props) { return <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M19.938 10.5a4 4 0 0 1 .585.396"/><path d="M6 18a4 4 0 0 1-1.967-.516"/><path d="M19.967 17.484A4 4 0 0 1 18 18"/></svg> }
