import { useState, useEffect } from 'react';
import { getMatches } from '../services/skillSyncApi';
import { Link } from 'react-router-dom';
import { Search, SlidersHorizontal, ChevronDown, Star } from 'lucide-react';
import { LoadingSpinner, ErrorMessage } from '../components/UIComponents';

export default function FindPartners() {
  const [allPartners, setAllPartners] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepts, setSelectedDepts] = useState(['CSE']);
  const [selectedYears, setSelectedYears] = useState(['3rd Year']);
  const [selectedAvails, setSelectedAvails] = useState(['Flexible']);
  
  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const matchesRes = await getMatches();
        const data = matchesRes.data.results || matchesRes.data;
        setAllPartners(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load partners.');
      } finally {
        setLoading(false);
      }
    };
    fetchPartners();
  }, []);

  // Filtering Logic
  useEffect(() => {
    let filtered = allPartners;

    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(lower) || 
        (p.department || '').toLowerCase().includes(lower) ||
        p.teaches?.some(s => s.name.toLowerCase().includes(lower)) ||
        p.wants_to_learn?.some(s => s.name.toLowerCase().includes(lower))
      );
    }

    if (selectedDepts.length > 0) {
      filtered = filtered.filter(p => {
        const dept = p.department || 'CSE';
        // 'Other' handles anything not in the main list
        if (selectedDepts.includes('Other') && !['CSE', 'IT', 'ECE', 'Mechanical'].includes(dept)) return true;
        return selectedDepts.includes(dept);
      });
    }

    if (selectedYears.length > 0) {
      filtered = filtered.filter(p => {
        const yr = (p.year || '3rd') + ' Year';
        return selectedYears.includes(yr);
      });
    }

    setPartners(filtered);
  }, [searchTerm, selectedDepts, selectedYears, selectedAvails, allPartners]);

  const toggleFilter = (setter, state, value) => {
    if (state.includes(value)) {
      setter(state.filter(v => v !== value));
    } else {
      setter([...state, value]);
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedDepts([]);
    setSelectedYears([]);
    setSelectedAvails([]);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="max-w-[1600px] mx-auto w-full pb-10 text-gray-900">
      
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">FIND PARTNERS</p>
        <h1 className="text-4xl font-black tracking-tight mb-2">Find the Right Learning Partner</h1>
        <p className="text-gray-500 font-medium">Connect with students who complement your skills and learning goals.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Left Filter Sidebar */}
        <div className="w-full lg:w-72 shrink-0 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900">Filter Partners</h3>
                <button onClick={resetFilters} className="text-xs font-bold text-gray-500 hover:text-gray-900">Reset</button>
            </div>

            <div className="space-y-6">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name, skill, or department..." 
                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-gray-900 transition-colors" 
                    />
                </div>

                {/* Skills I Want to Learn */}
                <div>
                    <label className="block text-xs font-bold text-gray-900 mb-2">Skills I Want to Learn</label>
                    <div className="relative">
                        <div className="w-full min-h-[42px] px-3 py-2 bg-white border border-gray-200 rounded-xl flex flex-wrap gap-2 items-center">
                            <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">UI/UX Design <button className="hover:text-blue-900">×</button></span>
                        </div>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                </div>

                {/* Skills I Can Teach */}
                <div>
                    <label className="block text-xs font-bold text-gray-900 mb-2">Skills I Can Teach</label>
                    <div className="relative">
                        <div className="w-full min-h-[42px] px-3 py-2 bg-white border border-gray-200 rounded-xl flex flex-wrap gap-2 items-center">
                            <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">Python <button className="hover:text-blue-900">×</button></span>
                        </div>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                </div>

                {/* Department */}
                <div>
                    <label className="block text-xs font-bold text-gray-900 mb-3">Department</label>
                    <div className="space-y-2.5">
                        {['CSE', 'IT', 'ECE', 'Mechanical', 'Other'].map((dept) => {
                            const isChecked = selectedDepts.includes(dept);
                            return (
                                <label key={dept} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleFilter(setSelectedDepts, selectedDepts, dept)}>
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isChecked ? 'bg-gray-900 border-gray-900 text-white' : 'border-gray-300 group-hover:border-gray-900'}`}>
                                        {isChecked && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>}
                                    </div>
                                    <span className="text-xs font-medium text-gray-600 select-none">{dept}</span>
                                </label>
                            )
                        })}
                    </div>
                </div>

                {/* Year */}
                <div>
                    <label className="block text-xs font-bold text-gray-900 mb-3">Year</label>
                    <div className="space-y-2.5">
                        {['1st Year', '2nd Year', '3rd Year', '4th Year'].map((year) => {
                            const isChecked = selectedYears.includes(year);
                            return (
                                <label key={year} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleFilter(setSelectedYears, selectedYears, year)}>
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isChecked ? 'bg-gray-900 border-gray-900 text-white' : 'border-gray-300 group-hover:border-gray-900'}`}>
                                        {isChecked && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>}
                                    </div>
                                    <span className="text-xs font-medium text-gray-600 select-none">{year}</span>
                                </label>
                            )
                        })}
                    </div>
                </div>

                {/* Availability */}
                <div>
                    <label className="block text-xs font-bold text-gray-900 mb-3">Availability</label>
                    <div className="space-y-2.5">
                        {['Weekdays', 'Weekends', 'Flexible'].map((avail) => {
                            const isChecked = selectedAvails.includes(avail);
                            return (
                                <label key={avail} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleFilter(setSelectedAvails, selectedAvails, avail)}>
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isChecked ? 'bg-gray-900 border-gray-900 text-white' : 'border-gray-300 group-hover:border-gray-900'}`}>
                                        {isChecked && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>}
                                    </div>
                                    <span className="text-xs font-medium text-gray-600 select-none">{avail}</span>
                                </label>
                            )
                        })}
                    </div>
                </div>

                <button className="w-full py-3.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-colors flex items-center justify-center gap-2">
                    Apply Filters <SlidersHorizontal size={16} />
                </button>
            </div>
        </div>

        {/* Right Main Content */}
        <div className="flex-1 w-full">
            
            <div className="flex justify-between items-center mb-6">
                <p className="text-sm font-bold text-gray-600">Showing {partners.length} students</p>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-500">Sort by</span>
                    <button className="flex items-center gap-6 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-900 hover:bg-gray-50 transition-colors">
                        Best Match <ChevronDown size={14} />
                    </button>
                </div>
            </div>

            {/* Grid of Partners */}
            {partners.length === 0 ? (
                <div className="bg-white border border-gray-100 rounded-3xl p-10 text-center shadow-sm">
                    <Search className="w-10 h-10 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 mb-2">No partners found</h3>
                    <p className="text-sm text-gray-500">Try adjusting your filters or search term to find more students.</p>
                    <button onClick={resetFilters} className="mt-6 px-6 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-colors">
                        Clear all filters
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {partners.map((p, index) => {
                        // Generate pseudo-random data to match the mockup variety
                        const ringColors = ['stroke-emerald-500', 'stroke-blue-500', 'stroke-purple-500', 'stroke-orange-500', 'stroke-pink-500'];
                        const ringColor = ringColors[index % ringColors.length];
                        const matchScore = p.match_score || (95 - index * 2);
                        
                        return (
                        <div key={`${p.student_id}-${index}`} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-gray-300 transition-all flex flex-col">
                            
                            {/* Header */}
                            <div className="flex items-start gap-4 mb-5">
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 text-lg shrink-0">
                                        {p.name.charAt(0)}
                                    </div>
                                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-bold text-gray-900 truncate">{p.name}</h3>
                                    <p className="text-[10px] font-medium text-gray-500 truncate mt-0.5">{p.department || 'CSE'} • {p.year || '3rd'} Year</p>
                                    <div className="flex items-center gap-1 mt-1 text-[10px] font-bold text-gray-600">
                                        <Star size={10} className="text-yellow-500 fill-yellow-500" />
                                        <span>{4.5 + (index%5)*0.1}</span>
                                        <span className="text-gray-400 font-medium">({20 + index*5} reviews)</span>
                                    </div>
                                </div>
                                
                                {/* Match Score Ring */}
                                <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                        <path strokeDasharray="100, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f3f4f6" strokeWidth="3" />
                                        <path strokeDasharray={`${matchScore}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" className={ringColor} strokeWidth="3" strokeLinecap="round" />
                                    </svg>
                                    <div className="absolute text-center flex flex-col items-center">
                                        <span className="text-[10px] font-black text-gray-900 leading-none mt-1">{matchScore}%</span>
                                        <span className="text-[6px] font-bold text-gray-400 uppercase">Match</span>
                                    </div>
                                </div>
                            </div>

                            {/* Can Teach */}
                            <div className="mb-4">
                                <p className="text-[10px] font-bold text-gray-900 mb-2">Can Teach</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {p.teaches?.slice(0,3).map(skill => (
                                        <span key={skill.id} className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold px-2 py-1 rounded-md">
                                            {skill.name}
                                        </span>
                                    )) || <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold px-2 py-1 rounded-md">Python</span>}
                                </div>
                            </div>

                            {/* Wants to Learn */}
                            <div className="mb-5">
                                <p className="text-[10px] font-bold text-gray-900 mb-2">Wants to Learn</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {p.wants_to_learn?.slice(0,3).map(skill => (
                                        <span key={skill.id} className="bg-blue-50 text-blue-700 border border-blue-100 text-[10px] font-bold px-2 py-1 rounded-md">
                                            {skill.name}
                                        </span>
                                    )) || <span className="bg-blue-50 text-blue-700 border border-blue-100 text-[10px] font-bold px-2 py-1 rounded-md">UI/UX Design</span>}
                                </div>
                            </div>

                            {/* Quote */}
                            <p className="text-xs text-gray-600 font-medium italic mb-6 flex-1">
                                "{p.explanation?.[0] || 'I love teaching Python and excited to learn UI/UX Design together!'}"
                            </p>

                            {/* Actions */}
                            <div className="flex gap-2 mt-auto">
                                <button className="flex-1 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-colors flex items-center justify-center gap-1.5">
                                    Send Request <span>→</span>
                                </button>
                                <button className="flex-1 py-2.5 bg-white border border-gray-200 text-gray-900 rounded-xl text-xs font-bold hover:bg-gray-50 transition-colors">
                                    View Profile
                                </button>
                            </div>
                            
                        </div>
                    )})}
                </div>
            )}

        </div>
      </div>
    </div>
  );
}
