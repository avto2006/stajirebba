import React, { useRef, useState } from 'react';
import { AnnouncementData, Student } from '../types';
import { Language, translations } from '../translations';
import { renderTemplate, getStudentDisplayName, formatDisplayDateTime } from '../utils';
import { QUICK_TEMPLATES_KA, QUICK_TEMPLATES_EN } from '../mockData';
import {
  Megaphone,
  Calendar,
  Clock,
  MapPin,
  FileText,
  Send,
  Eye,
  AlertTriangle,
  Sparkles,
  Info,
  MessageSquare,
  Phone,
  BookmarkCheck,
} from 'lucide-react';

interface AnnouncementFormProps {
  announcement: AnnouncementData;
  onChange: (data: AnnouncementData) => void;
  selectedStudents: Student[];
  onSend: () => void;
  warningMessage: string | null;
  setWarningMessage: (msg: string | null) => void;
  lang: Language;
}

export const AnnouncementForm: React.FC<AnnouncementFormProps> = ({
  announcement,
  onChange,
  selectedStudents,
  onSend,
  warningMessage,
  setWarningMessage,
  lang,
}) => {
  const t = translations[lang];
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [cursorPosition, setCursorPosition] = useState<{ start: number; end: number } | null>(null);

  const quickTemplates = lang === 'ka' ? QUICK_TEMPLATES_KA : QUICK_TEMPLATES_EN;

  const handleChange = (field: keyof AnnouncementData, value: string) => {
    onChange({
      ...announcement,
      [field]: value,
    });
    if (warningMessage) {
      setWarningMessage(null);
    }
  };

  const handleUpdateCursor = () => {
    if (textareaRef.current) {
      setCursorPosition({
        start: textareaRef.current.selectionStart,
        end: textareaRef.current.selectionEnd,
      });
    }
  };

  // Insert variable tag into textarea at cursor position (or append to end if not marked)
  const insertTag = (tag: string) => {
    const textarea = textareaRef.current;
    const text = announcement.template;

    let start = text.length;
    let end = text.length;

    if (
      cursorPosition !== null &&
      typeof cursorPosition.start === 'number' &&
      typeof cursorPosition.end === 'number'
    ) {
      start = cursorPosition.start;
      end = cursorPosition.end;
    } else if (textarea && document.activeElement === textarea) {
      start = textarea.selectionStart;
      end = textarea.selectionEnd;
    }

    const newText = text.substring(0, start) + tag + text.substring(end);
    const newPos = start + tag.length;

    onChange({
      ...announcement,
      template: newText,
    });

    setCursorPosition({ start: newPos, end: newPos });

    // Restore focus and cursor position after the inserted tag
    setTimeout(() => {
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(newPos, newPos);
      }
    }, 0);
  };

  const firstSelectedStudent = selectedStudents.length > 0 ? selectedStudents[0] : null;
  const firstStudentNames = firstSelectedStudent
    ? getStudentDisplayName(firstSelectedStudent, lang)
    : null;

  const previewText = firstSelectedStudent
    ? renderTemplate(announcement.template, firstSelectedStudent, announcement, lang)
    : '';

  const handleSendClick = () => {
    if (selectedStudents.length === 0) {
      setWarningMessage(t.sendWarningZero);
      return;
    }
    if (!announcement.eventName.trim()) {
      setWarningMessage(t.sendWarningName);
      return;
    }
    if (!announcement.template.trim()) {
      setWarningMessage(t.sendWarningTemplate);
      return;
    }

    setWarningMessage(null);
    onSend();
  };

  const variableTags =
    lang === 'ka'
      ? [
          { label: '{სახელი}', desc: 'მოსწავლის სახელი' },
          { label: '{გვარი}', desc: 'მოსწავლის გვარი' },
          { label: '{სრული სახელი}', desc: 'სრული სახელი და გვარი' },
          { label: '{კლასი}', desc: 'კლასი' },
          { label: '{მიმართულება}', desc: 'მიმართულება' },
          { label: '{ღონისძიება}', desc: 'ღონისძიების სახელი' },
          { label: '{თარიღი}', desc: 'თარიღი' },
          { label: '{დრო}', desc: 'დრო' },
          { label: '{ადგილი}', desc: 'ადგილი/ფორმატი' },
        ]
      : [
          { label: '{firstName}', desc: 'Student First Name' },
          { label: '{lastName}', desc: 'Student Last Name' },
          { label: '{fullName}', desc: 'Full Name' },
          { label: '{grade}', desc: 'Grade Level' },
          { label: '{track}', desc: 'Academic Track' },
          { label: '{event}', desc: 'Event Name' },
          { label: '{date}', desc: 'Date' },
          { label: '{time}', desc: 'Time' },
          { label: '{location}', desc: 'Location / Format' },
        ];

  return (
    <div className="space-y-5">
      {/* Warning Notification Banner */}
      {warningMessage && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-2xl flex items-center justify-between gap-3 text-amber-900 dark:text-amber-200 shadow-sm animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <p className="text-xs sm:text-sm font-semibold">{warningMessage}</p>
          </div>
          <button
            onClick={() => setWarningMessage(null)}
            className="text-amber-700 dark:text-amber-300 hover:text-amber-950 dark:hover:text-amber-100 text-xs font-bold px-2 py-1 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/50"
          >
            {t.dismiss}
          </button>
        </div>
      )}

      {/* Main Announcement Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors duration-200">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 flex items-center justify-center">
              <Megaphone className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {t.announcementTitle}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.announcementSubtitle}
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Event Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Megaphone className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              {t.eventNameLabel} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={announcement.eventName}
              onChange={(e) => handleChange('eventName', e.target.value)}
              placeholder={t.eventNamePlaceholder}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>

          {/* Date, Time, Location Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                {t.dateLabel} <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={announcement.date}
                onChange={(e) => handleChange('date', e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                {t.timeLabel} <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={announcement.time}
                onChange={(e) => handleChange('time', e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                {t.locationLabel} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={announcement.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder={t.locationPlaceholder}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Uniform Date & Time Display Badge */}
          {announcement.date && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 text-xs text-slate-600 dark:text-slate-300">
              <span className="font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                {t.dateTimePreviewLabel}
              </span>
              <span className="font-mono font-bold text-blue-700 dark:text-blue-300 px-2 py-0.5 bg-white dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-700">
                {formatDisplayDateTime(announcement.date, announcement.time)}
              </span>
            </div>
          )}

          {/* Quick Ready Templates (მზა შაბლონები) */}
          <div className="p-3 bg-gradient-to-r from-blue-50/80 to-indigo-50/60 dark:from-slate-800/90 dark:to-indigo-950/30 rounded-xl border border-blue-100 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900 dark:text-blue-200">
                <BookmarkCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>{t.quickTemplatesLabel}</span>
              </div>
              <span className="text-[11px] text-blue-600/90 dark:text-blue-400 font-medium">
                {t.quickTemplatesSub}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {quickTemplates.map((qt) => {
                const isActive = announcement.template === qt.template;
                return (
                  <button
                    key={qt.id}
                    type="button"
                    onClick={() => {
                      onChange({ ...announcement, template: qt.template });
                      setCursorPosition(null);
                      if (warningMessage) setWarningMessage(null);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-2xs active:scale-95 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-blue-500/25 ring-2 ring-blue-400/50'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-700 dark:hover:text-blue-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <span>{qt.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Template Text with Tag Buttons */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                {t.templateLabel}
              </label>
              <span className="text-[11px] text-slate-400 dark:text-slate-500">
                {announcement.template.length} {t.characters}
              </span>
            </div>

            {/* Variable Tags */}
            <div className="mb-2 p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                <Sparkles className="w-3 h-3 text-indigo-500 dark:text-indigo-400" />
                <span>{t.clickToInsert}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {variableTags.map((v) => (
                  <button
                    key={v.label}
                    type="button"
                    onClick={() => insertTag(v.label)}
                    title={v.desc}
                    className="px-2 py-0.5 text-xs font-medium bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-100 border border-slate-200 dark:border-slate-700 hover:border-blue-300 rounded-lg shadow-2xs transition-all active:scale-95"
                  >
                    + {v.label}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              ref={textareaRef}
              rows={4}
              value={announcement.template}
              onChange={(e) => {
                handleChange('template', e.target.value);
                handleUpdateCursor();
              }}
              onSelect={handleUpdateCursor}
              onClick={handleUpdateCursor}
              onKeyUp={handleUpdateCursor}
              placeholder="Template text..."
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-normal leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* Redesigned Premium Real-time Live Preview Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors duration-200">
        {/* Card Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {t.livePreviewTitle}
                </h3>
                <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                  Live
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {t.livePreviewSubtitle}
              </p>
            </div>
          </div>

          {firstSelectedStudent && firstStudentNames && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 rounded-xl text-xs font-semibold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{firstStudentNames.fullName}</span>
              <span className="text-emerald-600 dark:text-emerald-400">
                ({t.gradeN(firstSelectedStudent.grade)})
              </span>
            </div>
          )}
        </div>

        {/* Card Body with Clear, High-Contrast Message Box */}
        <div className="p-5">
          {firstSelectedStudent && firstStudentNames ? (
            <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 space-y-3.5">
              {/* Recipient Status Header */}
              <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800/80 flex-wrap">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                    {firstStudentNames.initials}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        {firstStudentNames.fullName}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        • {t.gradeN(firstSelectedStudent.grade)}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {firstSelectedStudent.track === 'გაცვლითი პროგრამები' ? t.trackExchange : t.trackOlympiad}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-blue-600 dark:text-blue-400 text-xs font-mono font-medium shadow-2xs">
                  <Phone className="w-3 h-3" />
                  <span>{firstSelectedStudent.contact}</span>
                </div>
              </div>

              {/* Message Bubble with Crisp Readability */}
              <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800/90 shadow-xs">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                  <MessageSquare className="w-3 h-3 text-blue-500" />
                  <span>SMS / Notification Text</span>
                </div>
                <div className="text-sm sm:text-[15px] leading-relaxed text-slate-900 dark:text-slate-100 font-normal whitespace-pre-wrap select-text">
                  {previewText || (
                    <span className="text-slate-400 dark:text-slate-500 italic">
                      {lang === 'ka' ? 'შაბლონი ცარიელია...' : 'Template is empty...'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/40">
              <Info className="w-7 h-7 mx-auto mb-2 text-slate-400 dark:text-slate-500" />
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {t.noStudentSelectedPreviewTitle}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                {t.noStudentSelectedPreviewSub}
              </p>
            </div>
          )}
        </div>

        {/* Action Send Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-600 dark:text-slate-400">
            {selectedStudents.length > 0 ? (
              <span>{t.willSendTo(selectedStudents.length)}</span>
            ) : (
              <span className="text-amber-700 dark:text-amber-400 font-medium">
                {t.pleaseSelectNotice}
              </span>
            )}
          </div>

          <button
            onClick={handleSendClick}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md ${
              selectedStudents.length > 0
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/25 active:scale-95'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-600'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>{t.sendButton(selectedStudents.length)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
