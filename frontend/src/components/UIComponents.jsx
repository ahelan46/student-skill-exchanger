import React from 'react';
import { AlertCircle, FileX } from 'lucide-react';

export const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-12">
    <div className="animate-spin rounded-full h-12 w-12 border-[3px] border-slate-100 border-t-brand-600"></div>
  </div>
);

export const ErrorMessage = ({ message }) => (
  <div className="bg-red-50/50 backdrop-blur text-red-600 p-5 rounded-2xl flex items-start shadow-sm border border-red-100">
    <AlertCircle className="mr-3 mt-0.5 shrink-0" size={20} />
    <div>
      <h3 className="font-bold">System Error</h3>
      <p className="text-sm mt-1 font-medium text-red-600/80">{message || 'Something went wrong.'}</p>
    </div>
  </div>
);

export const EmptyState = ({ title, message, icon }) => (
  <div className="flex flex-col items-center justify-center p-16 bg-white rounded-3xl border border-dashed border-slate-300 shadow-sm text-center relative overflow-hidden">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-slate-50 rounded-full blur-[40px] -z-10"></div>
    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mb-6 shadow-sm border border-slate-100">
      {icon || <FileX size={28} strokeWidth={2} />}
    </div>
    <h3 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h3>
    <p className="text-slate-500 mt-2 max-w-sm font-medium leading-relaxed">{message}</p>
  </div>
);

export const SkillTag = ({ name, type = 'default' }) => {
  const styles = {
    teach: 'bg-emerald-50 text-emerald-700 border-emerald-200/60 shadow-sm shadow-emerald-100/50',
    learn: 'bg-brand-50 text-brand-700 border-brand-200/60 shadow-sm shadow-brand-100/50',
    default: 'bg-slate-50 text-slate-700 border-slate-200/60 shadow-sm'
  };
  
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold tracking-wide border ${styles[type]}`}>
      {name}
    </span>
  );
};

export const MatchScoreBadge = ({ score }) => {
  let colorClass = 'bg-slate-100 text-slate-800 border-slate-200';
  if (score >= 80) colorClass = 'bg-emerald-500 text-white border-emerald-600 shadow-emerald-500/30';
  else if (score >= 50) colorClass = 'bg-amber-500 text-white border-amber-600 shadow-amber-500/30';
  else colorClass = 'bg-orange-500 text-white border-orange-600 shadow-orange-500/30';

  return (
    <div className={`inline-flex flex-col items-center justify-center h-16 w-16 rounded-2xl border-b-2 shadow-lg ${colorClass}`}>
      <span className="text-2xl font-black leading-none">{score}</span>
      <span className="text-[10px] font-bold uppercase tracking-wider opacity-80 mt-0.5">Score</span>
    </div>
  );
};
