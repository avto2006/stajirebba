import React from 'react';
import {
  GraduationCap,
  Users,
  Megaphone,
  History,
  RotateCcw,
  Sun,
  Moon,
  Globe,
} from 'lucide-react';
import { Language, translations } from '../translations';

interface HeaderProps {
  totalStudents: number;
  selectedCount: number;
  historyCount: number;
  onResetData: () => void;
  onScrollTo: (sectionId: string) => void;
  lang: Language;
  onToggleLang: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalStudents,
  selectedCount,
  historyCount,
  onResetData,
  onScrollTo,
  lang,
  onToggleLang,
  theme,
  onToggleTheme,
}) => {
  const t = translations[lang];

  return (
    <header className="bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-xs backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-3">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 flex-shrink-0">
              <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {t.appTitle}
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  {t.version}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium line-clamp-1">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Controls: Nav Pills, Theme Switcher, Lang Switcher & Reset */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Section Navigation Pills (desktop) */}
            <div className="hidden lg:flex items-center bg-slate-100 dark:bg-slate-800/90 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold">
              <button
                onClick={() => onScrollTo('students-section')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 hover:bg-white/80 dark:hover:bg-slate-700 transition-all"
              >
                <Users className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>
                  {t.navStudents} ({selectedCount}/{totalStudents})
                </span>
              </button>
              <button
                onClick={() => onScrollTo('announcement-section')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 hover:bg-white/80 dark:hover:bg-slate-700 transition-all"
              >
                <Megaphone className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>{t.navAnnouncement}</span>
              </button>
              <button
                onClick={() => onScrollTo('history-section')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 hover:bg-white/80 dark:hover:bg-slate-700 transition-all"
              >
                <History className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{t.navHistory}</span>
                {historyCount > 0 && (
                  <span className="px-1.5 py-0.2 bg-blue-600 dark:bg-blue-500 text-white rounded-full text-[10px] font-bold">
                    {historyCount}
                  </span>
                )}
              </button>
            </div>

            {/* Language Switcher Button */}
            <button
              onClick={onToggleLang}
              title={lang === 'ka' ? 'Switch to English' : 'გადართვა ქართულზე'}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 transition-all shadow-2xs active:scale-95"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>{lang === 'ka' ? 'GEO' : 'ENG'}</span>
            </button>

            {/* Dark / Light Theme Toggle */}
            <button
              onClick={onToggleTheme}
              title={theme === 'dark' ? t.themeLight : t.themeDark}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-amber-400 transition-all shadow-2xs active:scale-95"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Reset Data Button */}
            <button
              onClick={onResetData}
              title={t.navReset}
              className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 bg-slate-50 dark:bg-slate-800/80 hover:bg-red-50 dark:hover:bg-red-950/30 border border-slate-200 dark:border-slate-700 hover:border-red-200 dark:hover:border-red-900/50 px-3 py-2 rounded-xl transition-all font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.navReset}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
