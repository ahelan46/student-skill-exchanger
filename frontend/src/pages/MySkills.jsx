import { useEffect, useState } from 'react';
import { getMyProfile, getStudentSkills, addStudentSkill, removeStudentSkill, getSkills } from '../services/skillSyncApi';
import { LoadingSpinner, ErrorMessage } from '../components/UIComponents';
import { Lightbulb, BookOpen, GraduationCap, Plus, Trash2, Edit2, Code, Palette, BarChart, Terminal, Tag } from 'lucide-react';

export default function MySkills() {
  const [profile, setProfile] = useState(null);
  const [mySkills, setMySkills] = useState([]);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [activeTab, setActiveTab] = useState('TEACH');
  const [listTab, setListTab] = useState('TEACH');
  
  const [newSkill, setNewSkill] = useState({
    skill_id: '',
    proficiency: 'BEGINNER',
    description: '',
    tags: ''
  });

  const fetchData = async () => {
    try {
      const username = localStorage.getItem('demo_username');
      const profileRes = await getMyProfile();
      const me = profileRes.data.find(p => p.user.username === username);
      setProfile(me);

      const [mySkillsRes, allSkillsRes] = await Promise.all([
        getStudentSkills(),
        getSkills()
      ]);
      setMySkills(mySkillsRes.data.filter(s => s.student === me.id));
      setAvailableSkills(allSkillsRes.data);
    } catch (err) {
      setError('Failed to load skills data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkill.skill_id) return alert('Please select a skill');
    
    try {
      await addStudentSkill({
        student: profile.id,
        skill: newSkill.skill_id,
        skill_type: activeTab,
        proficiency: newSkill.proficiency,
        description: newSkill.description
      });
      setNewSkill({ skill_id: '', proficiency: 'BEGINNER', description: '', tags: '' });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.non_field_errors?.[0] || 'Failed to add skill. Maybe it already exists?');
    }
  };

  const handleDeleteSkill = async (id) => {
    try {
      await removeStudentSkill(id);
      fetchData();
    } catch (err) {
      alert('Failed to remove skill.');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  const teachSkills = mySkills.filter(s => s.skill_type === 'TEACH');
  const learnSkills = mySkills.filter(s => s.skill_type === 'LEARN');
  const displayedSkills = listTab === 'TEACH' ? teachSkills : learnSkills;

  const getProficiencyIcon = (prof) => {
    if (prof === 'BEGINNER') return <div className="flex gap-0.5"><div className="w-1 h-3 bg-green-500 rounded-sm"></div><div className="w-1 h-3 bg-gray-200 rounded-sm"></div><div className="w-1 h-3 bg-gray-200 rounded-sm"></div></div>;
    if (prof === 'INTERMEDIATE') return <div className="flex gap-0.5"><div className="w-1 h-3 bg-blue-500 rounded-sm"></div><div className="w-1 h-3 bg-blue-500 rounded-sm"></div><div className="w-1 h-3 bg-gray-200 rounded-sm"></div></div>;
    return <div className="flex gap-0.5"><div className="w-1 h-3 bg-black rounded-sm"></div><div className="w-1 h-3 bg-black rounded-sm"></div><div className="w-1 h-3 bg-black rounded-sm"></div></div>;
  };

  const getProficiencyColor = (prof) => {
    if (prof === 'BEGINNER') return 'text-green-600 bg-green-50';
    if (prof === 'INTERMEDIATE') return 'text-blue-600 bg-blue-50';
    return 'text-black bg-gray-100';
  };

  const getSkillIcon = (name) => {
    const n = name.toLowerCase();
    if (n.includes('python') || n.includes('java') || n.includes('code')) return <Terminal size={24} className="text-yellow-600" />;
    if (n.includes('design') || n.includes('ui')) return <Palette size={24} className="text-pink-500" />;
    if (n.includes('data')) return <BarChart size={24} className="text-blue-600" />;
    return <Code size={24} className="text-indigo-500" />;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div>
          <p className="text-xs font-bold text-slate-500 tracking-widest uppercase mb-1">My Skills</p>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Add Your Skills</h2>
          <p className="text-slate-500 font-medium mt-1">Tell others what you can teach and what you want to learn.</p>
        </div>
        
        <div className="bg-blue-50/80 rounded-2xl p-4 flex gap-4 max-w-md items-start">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            <Lightbulb size={20} className="text-blue-600" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-0.5">Your skills help us find the right learning partners for you.</h4>
            <p className="text-xs text-slate-600 font-medium">Add skills you can teach and skills you want to learn to get better matches.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column - Add Skill Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-6 sm:p-8">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Add a New Skill</h3>
            
            {/* Tabs */}
            <div className="flex border-b border-slate-200 mb-6">
              <button 
                onClick={() => setActiveTab('TEACH')}
                className={`pb-3 px-4 text-sm font-bold transition-colors border-b-2 ${activeTab === 'TEACH' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
              >
                I Can Teach
              </button>
              <button 
                onClick={() => setActiveTab('LEARN')}
                className={`pb-3 px-4 text-sm font-bold transition-colors border-b-2 ${activeTab === 'LEARN' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
              >
                I Want to Learn
              </button>
            </div>

            <form onSubmit={handleAddSkill} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Skill Name</label>
                <select 
                  required 
                  value={newSkill.skill_id} 
                  onChange={e => setNewSkill({...newSkill, skill_id: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all appearance-none"
                >
                  <option value="">Select a skill (e.g., Python, UI/UX Design)</option>
                  {availableSkills.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.category})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Proficiency Level</label>
                <div className="grid grid-cols-3 gap-2">
                  <button 
                    type="button"
                    onClick={() => setNewSkill({...newSkill, proficiency: 'BEGINNER'})}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-bold transition-all ${newSkill.proficiency === 'BEGINNER' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                  >
                    <div className="flex gap-0.5"><div className="w-1 h-3 bg-green-500 rounded-sm"></div><div className="w-1 h-3 bg-gray-300 rounded-sm"></div><div className="w-1 h-3 bg-gray-300 rounded-sm"></div></div>
                    Beginner
                  </button>
                  <button 
                    type="button"
                    onClick={() => setNewSkill({...newSkill, proficiency: 'INTERMEDIATE'})}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-bold transition-all ${newSkill.proficiency === 'INTERMEDIATE' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                  >
                    <div className="flex gap-0.5"><div className="w-1 h-3 bg-blue-500 rounded-sm"></div><div className="w-1 h-3 bg-blue-500 rounded-sm"></div><div className="w-1 h-3 bg-gray-300 rounded-sm"></div></div>
                    Intermediate
                  </button>
                  <button 
                    type="button"
                    onClick={() => setNewSkill({...newSkill, proficiency: 'ADVANCED'})}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-bold transition-all ${newSkill.proficiency === 'ADVANCED' ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                  >
                    <div className="flex gap-0.5"><div className="w-1 h-3 bg-current rounded-sm"></div><div className="w-1 h-3 bg-current rounded-sm"></div><div className="w-1 h-3 bg-current rounded-sm"></div></div>
                    Advanced
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Short Description</label>
                <textarea 
                  value={newSkill.description} 
                  onChange={e => setNewSkill({...newSkill, description: e.target.value})}
                  placeholder="Tell others about your skill, experience, and how you can help..."
                  rows="3" 
                  maxLength={200}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all resize-none placeholder-slate-400"
                ></textarea>
                <div className="text-right text-xs font-semibold text-slate-400 mt-1">{newSkill.description.length}/200</div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Tags (Optional)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tag size={16} className="text-slate-400" />
                  </div>
                  <input 
                    type="text" 
                    value={newSkill.tags} 
                    onChange={e => setNewSkill({...newSkill, tags: e.target.value})}
                    placeholder="Add tags (e.g., machine learning, pandas, figma)"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all placeholder-slate-400"
                  />
                </div>
                <p className="text-xs text-slate-400 font-medium mt-2">Press Enter to add a tag</p>
              </div>

              <button type="submit" className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-white font-bold bg-slate-900 hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 mt-2">
                Add Skill &rarr;
              </button>
            </form>
          </div>
        </div>

        {/* Right Column - Skills List */}
        <div className="lg:col-span-7 space-y-6">
          
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Your Skills Overview</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50/50 border border-green-100 rounded-2xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <BookOpen size={24} className="text-green-600" />
                </div>
                <div>
                  <h4 className="text-2xl font-black text-slate-900">{teachSkills.length}</h4>
                  <p className="text-sm font-semibold text-slate-600">Skills I Can Teach</p>
                </div>
              </div>
              
              <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <GraduationCap size={24} className="text-blue-600" />
                </div>
                <div>
                  <h4 className="text-2xl font-black text-slate-900">{learnSkills.length}</h4>
                  <p className="text-sm font-semibold text-slate-600">Skills I Want to Learn</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col h-full min-h-[400px]">
            <div className="p-6 sm:px-8 sm:pt-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="text-xl font-extrabold text-slate-900">Your Skills</h3>
              <button className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors">
                <Plus size={16} strokeWidth={3} /> Add Skill
              </button>
            </div>
            
            <div className="px-6 sm:px-8 flex border-b border-slate-100 mt-2">
              <button 
                onClick={() => setListTab('TEACH')}
                className={`pb-3 px-4 text-sm font-bold transition-colors border-b-2 ${listTab === 'TEACH' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
              >
                Can Teach ({teachSkills.length})
              </button>
              <button 
                onClick={() => setListTab('LEARN')}
                className={`pb-3 px-4 text-sm font-bold transition-colors border-b-2 ${listTab === 'LEARN' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
              >
                Want to Learn ({learnSkills.length})
              </button>
            </div>

            <div className="p-0">
              {displayedSkills.length === 0 ? (
                <div className="p-12 text-center text-slate-500 font-medium">
                  No skills added in this category yet.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {displayedSkills.map(ms => (
                    <div key={ms.id} className="p-6 sm:px-8 hover:bg-slate-50/50 transition-colors flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center shrink-0">
                        {getSkillIcon(ms.skill_detail.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-extrabold text-slate-900 text-base">{ms.skill_detail.name}</h4>
                          <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase flex items-center gap-1.5 ${getProficiencyColor(ms.proficiency)}`}>
                            {getProficiencyIcon(ms.proficiency)}
                            {ms.proficiency}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-slate-600 mb-3">{ms.description || `I ${ms.skill_type === 'TEACH' ? 'can teach' : 'want to learn'} ${ms.skill_detail.name}.`}</p>
                        
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-md">
                            {ms.skill_detail.category}
                          </span>
                          {ms.skill_detail.name.toLowerCase().includes('python') && <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-md">Data Analysis</span>}
                          {ms.skill_detail.name.toLowerCase().includes('ui') && <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-md">Figma</span>}
                        </div>
                      </div>
                      
                      <div className="flex gap-1 shrink-0 ml-4">
                        <button className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDeleteSkill(ms.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
