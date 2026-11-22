import React, { useState, useEffect } from 'react';
import { Student, AnnouncementData, BroadcastHistoryItem, SentMessage } from './types';
import {
  INITIAL_STUDENTS,
  DEFAULT_ANNOUNCEMENT_KA,
  DEFAULT_ANNOUNCEMENT_EN,
} from './mockData';
import { Language, translations } from './translations';
import { renderTemplate, getStudentDisplayName, georgianToLatin, formatSentAt } from './utils';
import { Header } from './components/Header';
import { KpiBar } from './components/KpiBar';
import { StudentList } from './components/StudentList';
import { StudentModal } from './components/StudentModal';
import { AnnouncementForm } from './components/AnnouncementForm';
import { HistoryExport } from './components/HistoryExport';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

const STORAGE_KEY_STUDENTS = 'ala_students_v2';
const STORAGE_KEY_ANNOUNCEMENTS = 'ala_announcements_v2';
const STORAGE_KEY_HISTORY = 'ala_history_v2';
const STORAGE_KEY_THEME = 'ala_theme_v1';
const STORAGE_KEY_LANG = 'ala_lang_v1';

export const App: React.FC = () => {
  // Theme state: 'light' | 'dark'
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const savedTheme = localStorage.getItem(STORAGE_KEY_THEME);
      if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    } catch {
      // fallback
    }
    return 'light';
  });

  // Language state: 'ka' | 'en'
  const [lang, setLang] = useState<Language>(() => {
    try {
      const savedLang = localStorage.getItem(STORAGE_KEY_LANG);
      if (savedLang === 'ka' || savedLang === 'en') return savedLang;
    } catch {
      // fallback
    }
    return 'ka';
  });

  const t = translations[lang];

  // Apply dark mode class to html element
  useEffect(() => {
    try {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem(STORAGE_KEY_THEME, theme);
    } catch (e) {
      console.error(e);
    }
  }, [theme]);

  // Sync Language and document.title
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LANG, lang);
      document.documentElement.lang = lang;
      document.title = t.pageTitle;
    } catch (e) {
      console.error(e);
    }
  }, [lang, t.pageTitle]);

  // Students state with localStorage persistence
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STUDENTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_STUDENTS;
  });

  // Selected student IDs (default to all initially)
  const [selectedIds, setSelectedIds] = useState<string[]>(() =>
    INITIAL_STUDENTS.map((s) => s.id)
  );

  // Language-specific Announcement state with localStorage persistence
  const [announcements, setAnnouncements] = useState<{
    ka: AnnouncementData;
    en: AnnouncementData;
  }>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ANNOUNCEMENTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.ka && (parsed.ka.location.includes('რუსთაველის') || parsed.ka.location.includes('Rustaveli'))) {
          parsed.ka.location = 'სამრეკლოს ქუჩა 26, Tbilisi, Georgia';
        }
        if (parsed.en && (parsed.en.location.includes('Rustaveli') || parsed.en.location.includes('რუსთაველის'))) {
          parsed.en.location = 'სამრეკლოს ქუჩა 26, Tbilisi, Georgia';
        }
        return parsed;
      }
    } catch {
      // fallback
    }
    return {
      ka: DEFAULT_ANNOUNCEMENT_KA,
      en: DEFAULT_ANNOUNCEMENT_EN,
    };
  });

  // Broadcast History state with localStorage persistence
  const [history, setHistory] = useState<BroadcastHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  // UI States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [toastNotification, setToastNotification] = useState<{
    type: 'success' | 'warning';
    message: string;
  } | null>(null);

  // Sync Students to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(students));
    } catch (e) {
      console.error(e);
    }
  }, [students]);

  // Sync Announcements to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ANNOUNCEMENTS, JSON.stringify(announcements));
    } catch (e) {
      console.error(e);
    }
  }, [announcements]);

  // Sync History to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
    } catch (e) {
      console.error(e);
    }
  }, [history]);

  // Toast auto-clear
  useEffect(() => {
    if (toastNotification) {
      const timer = setTimeout(() => {
        setToastNotification(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toastNotification]);

  // Scroll helper
  const handleScrollTo = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleToggleLang = () => {
    setLang((prev) => (prev === 'ka' ? 'en' : 'ka'));
  };

  // Active announcement according to selected language
  const currentAnnouncement = announcements[lang];

  const handleAnnouncementChange = (updated: AnnouncementData) => {
    setAnnouncements((prev) => ({
      ...prev,
      [lang]: updated,
    }));
  };

  // Handlers for Students
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
    if (warningMessage) setWarningMessage(null);
  };

  const handleSelectAll = (ids: string[]) => {
    setSelectedIds(ids);
    if (warningMessage) setWarningMessage(null);
  };

  const handleDeselectAll = () => {
    setSelectedIds([]);
  };

  const handleAddStudent = (newStudentData: Omit<Student, 'id'>) => {
    const fnEn = newStudentData.firstNameEn || georgianToLatin(newStudentData.firstName);
    const lnEn = newStudentData.lastNameEn || georgianToLatin(newStudentData.lastName);

    const newStudent: Student = {
      ...newStudentData,
      firstNameEn: fnEn,
      lastNameEn: lnEn,
      id: `std-${Date.now()}`,
    };
    setStudents((prev) => [newStudent, ...prev]);
    setSelectedIds((prev) => [newStudent.id, ...prev]);
    const names = getStudentDisplayName(newStudent, lang);
    setToastNotification({ type: 'success', message: t.studentAdded(names.fullName) });
  };

  const handleDeleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    setSelectedIds((prev) => prev.filter((i) => i !== id));
    setToastNotification({ type: 'success', message: t.studentDeleted });
  };

  const handleResetData = () => {
    if (window.confirm(t.resetConfirm)) {
      setStudents(INITIAL_STUDENTS);
      setSelectedIds(INITIAL_STUDENTS.map((s) => s.id));
      setAnnouncements({
        ka: DEFAULT_ANNOUNCEMENT_KA,
        en: DEFAULT_ANNOUNCEMENT_EN,
      });
      setToastNotification({ type: 'success', message: t.demoDataRestored });
    }
  };

  // Selected Student Objects
  const selectedStudents = students.filter((s) => selectedIds.includes(s.id));

  // Handler for Sending Broadcast
  const handleSend = () => {
    if (selectedStudents.length === 0) {
      setWarningMessage(t.sendWarningZero);
      setToastNotification({ type: 'warning', message: t.sendWarningZero });
      return;
    }
    if (!currentAnnouncement.eventName.trim()) {
      setWarningMessage(t.sendWarningName);
      setToastNotification({ type: 'warning', message: t.sendWarningName });
      return;
    }
    if (!currentAnnouncement.template.trim()) {
      setWarningMessage(t.sendWarningTemplate);
      setToastNotification({ type: 'warning', message: t.sendWarningTemplate });
      return;
    }

    const formattedSentAt = formatSentAt(new Date());

    const renderedMessages: SentMessage[] = selectedStudents.map((student) => {
      const namesGeo = getStudentDisplayName(student, 'ka');
      const namesEn = getStudentDisplayName(student, 'en');

      return {
        studentId: student.id,
        studentName: namesGeo.fullName,
        studentNameEn: namesEn.fullName,
        grade: student.grade,
        track: student.track,
        contact: student.contact,
        renderedText: renderTemplate(currentAnnouncement.template, student, currentAnnouncement, lang),
      };
    });

    const newHistoryItem: BroadcastHistoryItem = {
      id: `bc-${Date.now()}`,
      eventName:
        currentAnnouncement.eventName ||
        (lang === 'ka' ? 'ახალგაზრდული ღონისძიება' : 'Youth Event'),
      sentAt: formattedSentAt,
      recipientCount: selectedStudents.length,
      status: 'წარმატებით გაიგზავნა',
      messages: renderedMessages,
      announcementData: { ...currentAnnouncement },
    };

    setHistory((prev) => [newHistoryItem, ...prev]);
    setWarningMessage(null);
    setToastNotification({
      type: 'success',
      message: t.broadcastSuccess(selectedStudents.length),
    });

    // Smoothly scroll down to History and Export
    setTimeout(() => {
      handleScrollTo('history-section');
    }, 150);
  };

  const handleClearHistory = () => {
    if (window.confirm(t.clearHistoryConfirm)) {
      setHistory([]);
      setToastNotification({ type: 'success', message: t.historyCleared });
    }
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((h) => h.id !== id));
    setToastNotification({ type: 'success', message: t.historyItemDeleted });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Toast Notification Alert (Success & Warning) */}
      {toastNotification && (
        <div
          className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border animate-in fade-in slide-in-from-bottom-4 duration-300 ${
            toastNotification.type === 'warning'
              ? 'bg-amber-950/90 text-amber-100 border-amber-600/80 backdrop-blur-md'
              : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-800 dark:border-slate-100'
          }`}
        >
          {toastNotification.type === 'warning' ? (
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 dark:text-emerald-600 flex-shrink-0" />
          )}
          <span className="text-xs sm:text-sm font-semibold">{toastNotification.message}</span>
          <button
            onClick={() => setToastNotification(null)}
            className="ml-2 text-xs font-bold opacity-70 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      )}

      {/* Global Header */}
      <Header
        totalStudents={students.length}
        selectedCount={selectedIds.length}
        historyCount={history.length}
        onResetData={handleResetData}
        onScrollTo={handleScrollTo}
        lang={lang}
        onToggleLang={handleToggleLang}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Single Screen Workspace Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
        {/* Compact Real-Time KPI Stats Bar */}
        <KpiBar
          totalStudents={students.length}
          selectedRecipients={selectedIds.length}
          sentCampaigns={history.length}
          lang={lang}
          onScrollTo={handleScrollTo}
        />

        {/* Row 1: Students & Announcement/LivePreview (side by side) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Section 1: Students (5 cols) */}
          <section id="students-section" className="lg:col-span-5 scroll-mt-24">
            <StudentList
              students={students}
              selectedIds={selectedIds}
              onToggleSelect={handleToggleSelect}
              onSelectAll={handleSelectAll}
              onDeselectAll={handleDeselectAll}
              onDeleteStudent={handleDeleteStudent}
              onOpenAddModal={() => setIsModalOpen(true)}
              onResetData={handleResetData}
              lang={lang}
            />
          </section>

          {/* Section 2: Announcement & Live Preview (7 cols) */}
          <section id="announcement-section" className="lg:col-span-7 scroll-mt-24">
            <AnnouncementForm
              announcement={currentAnnouncement}
              onChange={handleAnnouncementChange}
              selectedStudents={selectedStudents}
              onSend={handleSend}
              warningMessage={warningMessage}
              setWarningMessage={setWarningMessage}
              lang={lang}
            />
          </section>
        </div>

        {/* Section 3: History & Export */}
        <section id="history-section" className="scroll-mt-24 pt-2">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 dark:bg-blue-400"></span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {t.historyHeading}
            </h2>
          </div>
          <HistoryExport
            history={history}
            onClearHistory={handleClearHistory}
            onDeleteHistoryItem={handleDeleteHistoryItem}
            lang={lang}
          />
        </section>
      </main>

      {/* Modal for adding a new student */}
      <StudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddStudent={handleAddStudent}
        lang={lang}
      />

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-5 px-6 text-center text-xs text-slate-500 dark:text-slate-400 transition-colors duration-200">
        <p>{t.footerCopyright}</p>
      </footer>
    </div>
  );
};

export default App;
