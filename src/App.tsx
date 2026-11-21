import React, { useState, useEffect } from 'react';
import { Student, AnnouncementData, BroadcastHistoryItem, SentMessage } from './types';
import { INITIAL_STUDENTS, DEFAULT_ANNOUNCEMENT } from './mockData';
import { renderTemplate } from './utils';
import { Header } from './components/Header';
import { StudentList } from './components/StudentList';
import { StudentModal } from './components/StudentModal';
import { AnnouncementForm } from './components/AnnouncementForm';
import { HistoryExport } from './components/HistoryExport';
import { CheckCircle2 } from 'lucide-react';

const STORAGE_KEY_STUDENTS = 'ala_students_v1';
const STORAGE_KEY_ANNOUNCEMENT = 'ala_announcement_v1';
const STORAGE_KEY_HISTORY = 'ala_history_v1';

export const App: React.FC = () => {
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

  // Selected student IDs (default to all initially so preview & ready state are immediate)
  const [selectedIds, setSelectedIds] = useState<string[]>(() =>
    INITIAL_STUDENTS.map((s) => s.id)
  );

  // Announcement state with localStorage persistence
  const [announcement, setAnnouncement] = useState<AnnouncementData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ANNOUNCEMENT);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_ANNOUNCEMENT;
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
  const [toastNotification, setToastNotification] = useState<string | null>(null);

  // Sync Students to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(students));
    } catch (e) {
      console.error('Failed to save students to localStorage', e);
    }
  }, [students]);

  // Sync Announcement to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ANNOUNCEMENT, JSON.stringify(announcement));
    } catch (e) {
      console.error('Failed to save announcement to localStorage', e);
    }
  }, [announcement]);

  // Sync History to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save history to localStorage', e);
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
    const newStudent: Student = {
      ...newStudentData,
      id: `std-${Date.now()}`,
    };
    setStudents((prev) => [newStudent, ...prev]);
    setSelectedIds((prev) => [newStudent.id, ...prev]);
    setToastNotification(`მოსწავლე "${newStudent.firstName} ${newStudent.lastName}" წარმატებით დაემატა!`);
  };

  const handleDeleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    setSelectedIds((prev) => prev.filter((i) => i !== id));
    setToastNotification('მოსწავლე წაიშალა სიიდან');
  };

  const handleResetData = () => {
    if (window.confirm('დარწმუნებული ხართ, რომ გსურთ საცდელი 10 მოსწავლის მონაცემების აღდგენა?')) {
      setStudents(INITIAL_STUDENTS);
      setSelectedIds(INITIAL_STUDENTS.map((s) => s.id));
      setAnnouncement(DEFAULT_ANNOUNCEMENT);
      setToastNotification('საცდელი მონაცემები წარმატებით აღდგა!');
    }
  };

  // Selected Student Objects
  const selectedStudents = students.filter((s) => selectedIds.includes(s.id));

  // Handler for Sending Broadcast
  const handleSend = () => {
    if (selectedStudents.length === 0) {
      setWarningMessage('გაფრთხილება: შეტყობინების გასაგზავნად მონიშნეთ მინიმუმ ერთი მოსწავლე!');
      return;
    }

    const now = new Date();
    const formattedSentAt = now.toLocaleString('ka-GE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

    const renderedMessages: SentMessage[] = selectedStudents.map((student) => ({
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      grade: student.grade,
      track: student.track,
      contact: student.contact,
      renderedText: renderTemplate(announcement.template, student, announcement),
    }));

    const newHistoryItem: BroadcastHistoryItem = {
      id: `bc-${Date.now()}`,
      eventName: announcement.eventName || 'ახალგაზრდული ღონისძიება',
      sentAt: formattedSentAt,
      recipientCount: selectedStudents.length,
      status: 'წარმატებით გაიგზავნა',
      messages: renderedMessages,
      announcementData: { ...announcement },
    };

    setHistory((prev) => [newHistoryItem, ...prev]);
    setToastNotification(
      `შეტყობინება წარმატებით გაიგზავნა ${selectedStudents.length} მოსწავლესთან!`
    );

    // Smoothly scroll down to History and Export
    setTimeout(() => {
      handleScrollTo('history-section');
    }, 150);
  };

  const handleClearHistory = () => {
    if (window.confirm('ნამდვილად გსურთ შეტყობინებების ისტორიის გასუფთავება?')) {
      setHistory([]);
      setToastNotification('შეტყობინებების ისტორია გასუფთავდა');
    }
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((h) => h.id !== id));
    setToastNotification('ჩანაწერი წაიშალა ისტორიიდან');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/70 text-slate-900 font-sans">
      {/* Toast Notification Alert */}
      {toastNotification && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-800 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{toastNotification}</span>
        </div>
      )}

      {/* Global Header */}
      <Header
        totalStudents={students.length}
        selectedCount={selectedIds.length}
        historyCount={history.length}
        onResetData={handleResetData}
        onScrollTo={handleScrollTo}
      />

      {/* Main Single Screen Workspace Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
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
            />
          </section>

          {/* Section 2: Announcement & Live Preview (7 cols) */}
          <section id="announcement-section" className="lg:col-span-7 scroll-mt-24">
            <AnnouncementForm
              announcement={announcement}
              onChange={setAnnouncement}
              selectedStudents={selectedStudents}
              onSend={handleSend}
              warningMessage={warningMessage}
              setWarningMessage={setWarningMessage}
            />
          </section>
        </div>

        {/* Section 3: History & Export */}
        <section id="history-section" className="scroll-mt-24 pt-2">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            <h2 className="text-lg font-bold text-slate-900">
              3. გაგზავნილი შეტყობინებების ჟურნალი და ექსპორტი
            </h2>
          </div>
          <HistoryExport
            history={history}
            onClearHistory={handleClearHistory}
            onDeleteHistoryItem={handleDeleteHistoryItem}
          />
        </section>
      </main>

      {/* Modal for adding a new student */}
      <StudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddStudent={handleAddStudent}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-5 px-6 text-center text-xs text-slate-500">
        <p>
          © 2026 ახალგაზრდა ლიდერთა აკადემია • ღონისძიებების ანონსებისა და შეტყობინებების მოდული
        </p>
      </footer>
    </div>
  );
};

export default App;
