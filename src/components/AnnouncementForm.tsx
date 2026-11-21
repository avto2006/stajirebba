import React, { useRef } from 'react';
import { AnnouncementData, Student } from '../types';
import { renderTemplate } from '../utils';
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
} from 'lucide-react';

interface AnnouncementFormProps {
  announcement: AnnouncementData;
  onChange: (data: AnnouncementData) => void;
  selectedStudents: Student[];
  onSend: () => void;
  warningMessage: string | null;
  setWarningMessage: (msg: string | null) => void;
}

export const AnnouncementForm: React.FC<AnnouncementFormProps> = ({
  announcement,
  onChange,
  selectedStudents,
  onSend,
  warningMessage,
  setWarningMessage,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (field: keyof AnnouncementData, value: string) => {
    onChange({
      ...announcement,
      [field]: value,
    });
    if (warningMessage) {
      setWarningMessage(null);
    }
  };

  // Insert variable tag into textarea at cursor position
  const insertTag = (tag: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = announcement.template;
    const newText = text.substring(0, start) + tag + text.substring(end);

    onChange({
      ...announcement,
      template: newText,
    });

    // Restore focus and cursor position after the inserted tag
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tag.length, start + tag.length);
    }, 0);
  };

  const firstSelectedStudent = selectedStudents.length > 0 ? selectedStudents[0] : null;
  const previewText = firstSelectedStudent
    ? renderTemplate(announcement.template, firstSelectedStudent, announcement)
    : '';

  const handleSendClick = () => {
    if (selectedStudents.length === 0) {
      setWarningMessage('გაფრთხილება: შეტყობინების გასაგზავნად გთხოვთ მონიშნოთ მინიმუმ 1 მოსწავლე!');
      return;
    }
    if (!announcement.eventName.trim()) {
      setWarningMessage('გთხოვთ შეიყვანოთ ღონისძიების სახელი!');
      return;
    }
    if (!announcement.template.trim()) {
      setWarningMessage('გთხოვთ შეიყვანოთ შეტყობინების შაბლონის ტექსტი!');
      return;
    }

    setWarningMessage(null);
    onSend();
  };

  const variableTags = [
    { label: '{სახელი}', desc: 'მოსწავლის სახელი' },
    { label: '{გვარი}', desc: 'მოსწავლის გვარი' },
    { label: '{კლასი}', desc: 'კლასი' },
    { label: '{მიმართულება}', desc: 'მიმართულება' },
    { label: '{ღონისძიება}', desc: 'ღონისძიების სახელი' },
    { label: '{თარიღი}', desc: 'თარიღი' },
    { label: '{დრო}', desc: 'დრო' },
    { label: '{ადგილი}', desc: 'ადგილი/ფორმატი' },
  ];

  return (
    <div className="space-y-5">
      {/* Warning Notification Banner */}
      {warningMessage && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl flex items-center justify-between gap-3 text-amber-900 shadow-sm animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <p className="text-xs sm:text-sm font-semibold">{warningMessage}</p>
          </div>
          <button
            onClick={() => setWarningMessage(null)}
            className="text-amber-700 hover:text-amber-950 text-xs font-bold px-2 py-1 rounded-lg hover:bg-amber-100"
          >
            დახურვა
          </button>
        </div>
      )}

      {/* Main Announcement Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Megaphone className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">ანონსის პარამეტრები და შაბლონი</h2>
              <p className="text-xs text-slate-500">
                შეავსეთ ღონისძიების დეტალები და მოარგეთ ტექსტის შაბლონი
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Event Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Megaphone className="w-3.5 h-3.5 text-blue-600" />
              ღონისძიების სახელი <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={announcement.eventName}
              onChange={(e) => handleChange('eventName', e.target.value)}
              placeholder="მაგ. ახალგაზრდული ლიდერობის ფორუმი 2026"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium"
            />
          </div>

          {/* Date, Time, Location Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                თარიღი <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={announcement.date}
                onChange={(e) => handleChange('date', e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                დრო <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={announcement.time}
                onChange={(e) => handleChange('time', e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                ადგილი / ფორმატი <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={announcement.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="მაგ. დარბაზი №3 / Zoom"
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium"
              />
            </div>
          </div>

          {/* Template Text with Tag Buttons */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                შაბლონის ტექსტი (დინამიკური ცვლადებით)
              </label>
              <span className="text-[11px] text-slate-400">
                {announcement.template.length} სიმბოლო
              </span>
            </div>

            {/* Variable Tags */}
            <div className="mb-2 p-2 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 mb-1.5">
                <Sparkles className="w-3 h-3 text-indigo-500" />
                <span>დააჭირეთ ცვლადის ტექსტში ჩასასმელად:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {variableTags.map((v) => (
                  <button
                    key={v.label}
                    type="button"
                    onClick={() => insertTag(v.label)}
                    title={v.desc}
                    className="px-2 py-0.5 text-xs font-medium bg-white hover:bg-blue-50 text-blue-700 hover:text-blue-900 border border-slate-200 hover:border-blue-300 rounded-lg shadow-2xs transition-all active:scale-95"
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
              onChange={(e) => handleChange('template', e.target.value)}
              placeholder="შეიყვანეთ შეტყობინების შაბლონი..."
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-normal leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* Real-time Live Preview Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">რეალურ დროში გადახედვა (Live Preview)</h3>
              <p className="text-[11px] text-slate-500">
                პირველი მონიშნული მოსწავლისთვის გენერირებული ტექსტი
              </p>
            </div>
          </div>

          {firstSelectedStudent && (
            <span className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg font-semibold flex items-center gap-1">
              ✓ {firstSelectedStudent.firstName} {firstSelectedStudent.lastName} ({firstSelectedStudent.grade}-ე კლ.)
            </span>
          )}
        </div>

        <div className="p-5">
          {firstSelectedStudent ? (
            <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-xl p-4 border border-blue-100 relative">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/60 text-xs text-slate-500">
                <span className="font-semibold text-slate-700">
                  ადრესატი: {firstSelectedStudent.firstName} {firstSelectedStudent.lastName}
                </span>
                <span className="text-blue-600 font-medium">
                  {firstSelectedStudent.contact}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap font-medium">
                {previewText || <span className="text-slate-400 italic">შაბლონი ცარიელია...</span>}
              </p>
            </div>
          ) : (
            <div className="p-6 text-center rounded-xl border border-dashed border-slate-300 bg-slate-50/50">
              <Info className="w-6 h-6 mx-auto mb-2 text-slate-400" />
              <p className="text-xs sm:text-sm font-semibold text-slate-700">
                მოსწავლე არ არის მონიშნული
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                მარცხენა სიიდან მონიშნეთ მინიმუმ ერთი მოსწავლე, რომ იხილოთ პერსონალიზებული შეტყობინების წინასწარი ვერსია
              </p>
            </div>
          )}
        </div>

        {/* Action Send Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-600">
            {selectedStudents.length > 0 ? (
              <span>
                გაეგზავნება: <strong className="text-blue-700">{selectedStudents.length}</strong> მოსწავლეს
              </span>
            ) : (
              <span className="text-amber-700 font-medium">
                ⚠️ მონიშნეთ მოსწავლეები გასაგზავნად
              </span>
            )}
          </div>

          <button
            onClick={handleSendClick}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md ${
              selectedStudents.length > 0
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/25 active:scale-95'
                : 'bg-slate-200 text-slate-500 cursor-pointer hover:bg-slate-300'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>
              გაგზავნა {selectedStudents.length > 0 ? `(${selectedStudents.length})` : ''}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
