import React from 'react';
import { GraduationCap, Users, Megaphone, History, RotateCcw } from 'lucide-react';

interface HeaderProps {
  totalStudents: number;
  selectedCount: number;
  historyCount: number;
  onResetData: () => void;
  onScrollTo: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalStudents,
  selectedCount,
  historyCount,
  onResetData,
  onScrollTo,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm backdrop-blur-md bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 flex-shrink-0">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                  ახალგაზრდა ლიდერთა აკადემია
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  v2.0
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                ღონისძიებების ანონსებისა და მასობრივი შეტყობინებების მოდული
              </p>
            </div>
          </div>

          {/* Quick Section Navigation and Stats */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Navigation Pills */}
            <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
              <button
                onClick={() => onScrollTo('students-section')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-700 hover:text-blue-700 hover:bg-white/80 transition-all"
              >
                <Users className="w-3.5 h-3.5 text-blue-600" />
                <span>მოსწავლეები ({selectedCount}/{totalStudents})</span>
              </button>
              <button
                onClick={() => onScrollTo('announcement-section')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-700 hover:text-blue-700 hover:bg-white/80 transition-all"
              >
                <Megaphone className="w-3.5 h-3.5 text-indigo-600" />
                <span>ანონსი & Preview</span>
              </button>
              <button
                onClick={() => onScrollTo('history-section')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-700 hover:text-blue-700 hover:bg-white/80 transition-all"
              >
                <History className="w-3.5 h-3.5 text-emerald-600" />
                <span>ისტორია</span>
                {historyCount > 0 && (
                  <span className="px-1.5 py-0.2 bg-blue-600 text-white rounded-full text-[10px] font-bold">
                    {historyCount}
                  </span>
                )}
              </button>
            </div>

            {/* Reset data */}
            <button
              onClick={onResetData}
              title="საცდელი მონაცემების აღდგენა"
              className="flex items-center gap-1.5 text-xs text-slate-700 hover:text-red-600 bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-200 px-3 py-2 rounded-xl transition-all font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">მონაცემების აღდგენა</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
