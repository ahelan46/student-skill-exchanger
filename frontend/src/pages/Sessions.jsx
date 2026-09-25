import { useEffect, useState } from 'react';
import { getSessions, updateSession, getMyProfile, getRequests, createSession } from '../services/skillSyncApi';
import { LoadingSpinner, ErrorMessage, EmptyState } from '../components/UIComponents';
import { BookOpen, CheckCircle, CalendarPlus } from 'lucide-react';

export default function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [myProfile, setMyProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [scheduleData, setScheduleData] = useState({ request_id: '', topic: '', date: '' });
  const [acceptedRequests, setAcceptedRequests] = useState([]);

  const fetchAll = async () => {
    try {
      const username = localStorage.getItem('demo_username');
      const profileRes = await getMyProfile();
      const me = profileRes.data.find(p => p.user.username === username);
      setMyProfile(me);

      const [sessRes, reqRes] = await Promise.all([getSessions(), getRequests()]);
      setSessions(sessRes.data);

      // Requests that are ACCEPTED and don't have a session yet
      const existingReqIds = sessRes.data.map(s => s.exchange_request_detail.id);
      setAcceptedRequests(reqRes.data.filter(r => r.status === 'ACCEPTED' && !existingReqIds.includes(r.id)));

    } catch (err) {
      setError('Failed to load sessions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleComplete = async (id) => {
    try {
      await updateSession(id, { status: 'COMPLETED' });
      fetchAll();
    } catch (err) {
      alert('Failed to complete session.');
    }
  };

  const handleSchedule = async (e) => {
    e.preventDefault();
    try {
      await createSession({
        exchange_request: scheduleData.request_id,
        topic: scheduleData.topic,
        scheduled_datetime: new Date(scheduleData.date).toISOString()
      });
      setScheduleData({ request_id: '', topic: '', date: '' });
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.[0] || 'Failed to schedule session.');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Learning Sessions</h2>
        <p className="text-slate-500 font-medium mt-2">Track your upcoming and past skill sessions.</p>
      </div>

      {acceptedRequests.length > 0 && (
        <div className="solid-panel p-8 bg-gradient-to-br from-white to-brand-50/30">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
            <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center text-brand-600 mr-4">
              <CalendarPlus size={20} strokeWidth={2.5} />
            </div>
            Schedule a New Session
          </h3>
          <form onSubmit={handleSchedule} className="grid grid-cols-1 md:grid-cols-4 gap-5 items-end">
            <div className="md:col-span-1">
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Exchange Partner</label>
              <select required value={scheduleData.request_id} onChange={e => setScheduleData({...scheduleData, request_id: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all">
                <option value="">Select partner...</option>
                {acceptedRequests.map(r => {
                  const partner = r.receiver === myProfile?.id ? r.sender_detail : r.receiver_detail;
                  return <option key={r.id} value={r.id}>{partner.full_name}</option>;
                })}
              </select>
            </div>
            <div className="md:col-span-1">
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Topic</label>
              <input required type="text" value={scheduleData.topic} onChange={e => setScheduleData({...scheduleData, topic: e.target.value})} placeholder="e.g. Python Basics" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all" />
            </div>
            <div className="md:col-span-1">
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Date & Time</label>
              <input required type="datetime-local" value={scheduleData.date} onChange={e => setScheduleData({...scheduleData, date: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all" />
            </div>
            <div className="md:col-span-1">
              <button type="submit" className="w-full px-6 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/25">
                Schedule Session
              </button>
            </div>
          </form>
        </div>
      )}

      {sessions.length === 0 ? (
        <EmptyState 
          title="No active sessions" 
          message="Accept an exchange request to schedule a learning session."
          icon={<BookOpen size={32} />}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sessions.map(s => {
             const req = s.exchange_request_detail;
             const partner = req.receiver === myProfile?.id ? req.sender_detail : req.receiver_detail;
             return (
              <div key={s.id} className="solid-panel flex flex-col justify-between overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-slate-900">{s.topic}</h3>
                    <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${s.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' : 'bg-brand-100 text-brand-700'}`}>
                      {s.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 mb-4">
                     <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 font-bold shadow-sm">
                       {partner.full_name.charAt(0)}
                     </div>
                     <div>
                       <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Partner</p>
                       <p className="text-sm font-bold text-slate-900">{partner.full_name}</p>
                     </div>
                  </div>
                  
                  <div className="flex items-center text-sm font-medium text-slate-600">
                    <div className="w-2 h-2 rounded-full bg-brand-500 mr-2"></div>
                    {new Date(s.scheduled_datetime).toLocaleString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                
                {s.status === 'SCHEDULED' && (
                  <div className="p-4 bg-slate-50/50 border-t border-slate-100">
                    <button onClick={() => handleComplete(s.id)} className="w-full inline-flex justify-center items-center px-4 py-3 border border-slate-300 text-sm font-bold rounded-xl text-slate-700 bg-white hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-all shadow-sm">
                      <CheckCircle size={18} className="mr-2 text-emerald-500" strokeWidth={2.5} /> Mark as Completed
                    </button>
                  </div>
                )}
                {s.status === 'COMPLETED' && (
                  <div className="p-5 bg-slate-50/50 border-t border-slate-100">
                    <FeedbackForm session={s.id} reviewee={partner.id} />
                  </div>
                )}
              </div>
             )
          })}
        </div>
      )}
    </div>
  );
}

function FeedbackForm({ session, reviewee }) {
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) return alert('Rating must be 1-5');
    setStatus('submitting');
    try {
      await createFeedback({ session, reviewee, rating: Number(rating), comment });
      setStatus('success');
    } catch (err) {
      alert(err.response?.data?.[0] || 'Error submitting feedback.');
      setStatus('idle');
    }
  };

  if (status === 'success') {
    return <p className="text-sm text-emerald-600 text-center font-medium">Feedback submitted!</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex gap-2">
        <input required type="number" min="1" max="5" value={rating} onChange={e => setRating(e.target.value)} placeholder="1-5" className="w-20 px-2 py-1 text-sm border border-gray-300 rounded" />
        <input required type="text" value={comment} onChange={e => setComment(e.target.value)} placeholder="Comment" className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded" />
      </div>
      <button type="submit" disabled={status === 'submitting'} className="w-full bg-indigo-50 text-indigo-700 text-xs font-semibold py-1.5 rounded hover:bg-indigo-100 transition-colors">
        {status === 'submitting' ? 'Submitting...' : 'Submit Feedback'}
      </button>
    </form>
  );
}
