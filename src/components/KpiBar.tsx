import React from 'react';
import { Users, UserCheck, Send } from 'lucide-react';
import { Language, translations } from '../translations';

interface KpiBarProps {
  totalStudents: number;
  selectedRecipients: number;
  sentCampaigns: number;
  lang: Language;
  onScrollTo?: (sectionId: string) => void;
}

export const KpiBar: React.FC<KpiBarProps> = ({
  totalStudents,
  selectedRecipients,
  sentCampaigns,
  lang,
  onScrollTo,
}) => {
  const t = translations[lang];

  const selectionPercent =
    totalStudents > 0 ? Math.round((selectedRecipients / totalStudents) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
      {/* KPI 1: Total Students */}
      <div
        onClick={() => onScrollTo?.('students-section')}
        className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-blue-300 dark:hover:border-blue-700/60 transition-all cursor-pointer flex items-center justify-between gap-3 group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
              {t.kpiTotalStudents}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {totalStudents}
              </span>
              <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                {t.kpiTotalDesc}
              </span>
            </div>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700">
          100%
        </span>
      </div>

      {/* KPI 2: Selected Recipients */}
      <div
        onClick={() => onScrollTo?.('students-section')}
        className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-indigo-300 dark:hover:border-indigo-700/60 transition-all cursor-pointer flex items-center justify-between gap-3 group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
              {t.kpiSelectedRecipients}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight">
                {selectedRecipients}
              </span>
              <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                {t.kpiSelectedDesc}
              </span>
            </div>
          </div>
        </div>
        <span
          className={`px-2 py-0.5 rounded-full text-[11px] font-bold border transition-colors ${
            selectedRecipients > 0
              ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700'
          }`}
        >
          {selectionPercent}%
        </span>
      </div>

      {/* KPI 3: Sent Campaigns */}
      <div
        onClick={() => onScrollTo?.('history-section')}
        className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-emerald-300 dark:hover:border-emerald-700/60 transition-all cursor-pointer flex items-center justify-between gap-3 group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
              {t.kpiSentCampaigns}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                {sentCampaigns}
              </span>
              <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                {t.kpiHistoryDesc}
              </span>
            </div>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          ✓ {sentCampaigns}
        </span>
      </div>
    </div>
  );
};
