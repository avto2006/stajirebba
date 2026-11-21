import React, { useState } from 'react';
import { Student, TrackType, GradeType } from '../types';
import { Language, translations } from '../translations';
import { X, UserPlus, AlertCircle } from 'lucide-react';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStudent: (student: Omit<Student, 'id'>) => void;
  lang: Language;
}

export const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  onClose,
  onAddStudent,
  lang,
}) => {
  const t = translations[lang];
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [grade, setGrade] = useState<GradeType>(10);
  const [track, setTrack] = useState<TrackType>('გაცვლითი პროგრამები');
  const [contact, setContact] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!firstName.trim()) {
      newErrors.firstName = t.firstNameReq;
    } else if (firstName.trim().length < 2) {
      newErrors.firstName = t.firstNameMin;
    }

    if (!lastName.trim()) {
      newErrors.lastName = t.lastNameReq;
    } else if (lastName.trim().length < 2) {
      newErrors.lastName = t.lastNameMin;
    }

    if (!contact.trim()) {
      newErrors.contact = t.contactReq;
    } else if (contact.trim().length < 5) {
      newErrors.contact = t.contactMin;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onAddStudent({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      grade,
      track,
      contact: contact.trim(),
    });

    // Reset form
    setFirstName('');
    setLastName('');
    setGrade(10);
    setTrack('გაცვლითი პროგრამები');
    setContact('');
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-lg">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base">{t.modalAddTitle}</h3>
              <p className="text-xs text-blue-100">{t.modalAddSubtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.firstNameLabel} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder={t.firstNamePlaceholder}
                className={`w-full px-3 py-2 text-sm rounded-xl border ${
                  errors.firstName
                    ? 'border-red-400 bg-red-50/50 dark:bg-red-950/30 focus:ring-red-400 text-red-900 dark:text-red-200'
                    : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-blue-500 focus:border-blue-500'
                } outline-none focus:ring-2 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500`}
              />
              {errors.firstName && (
                <p className="mt-1 text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 flex-shrink-0" />
                  {errors.firstName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.lastNameLabel} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder={t.lastNamePlaceholder}
                className={`w-full px-3 py-2 text-sm rounded-xl border ${
                  errors.lastName
                    ? 'border-red-400 bg-red-50/50 dark:bg-red-950/30 focus:ring-red-400 text-red-900 dark:text-red-200'
                    : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-blue-500 focus:border-blue-500'
                } outline-none focus:ring-2 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500`}
              />
              {errors.lastName && (
                <p className="mt-1 text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 flex-shrink-0" />
                  {errors.lastName}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.gradeLabel} <span className="text-red-500">*</span>
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(Number(e.target.value) as GradeType)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
              >
                <option value={8}>{t.gradeN(8)}</option>
                <option value={9}>{t.gradeN(9)}</option>
                <option value={10}>{t.gradeN(10)}</option>
                <option value={11}>{t.gradeN(11)}</option>
                <option value={12}>{t.gradeN(12)}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.trackLabel} <span className="text-red-500">*</span>
              </label>
              <select
                value={track}
                onChange={(e) => setTrack(e.target.value as TrackType)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
              >
                <option value="გაცვლითი პროგრამები">{t.trackExchange}</option>
                <option value="კინგსის ტიპის ოლიმპიადა">{t.trackOlympiad}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {t.contactLabel} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder={t.contactPlaceholder}
              className={`w-full px-3 py-2 text-sm rounded-xl border ${
                errors.contact
                  ? 'border-red-400 bg-red-50/50 dark:bg-red-950/30 focus:ring-red-400 text-red-900 dark:text-red-200'
                  : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-blue-500 focus:border-blue-500'
              } outline-none focus:ring-2 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500`}
            />
            {errors.contact && (
              <p className="mt-1 text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                {errors.contact}
              </p>
            )}
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-xl shadow-md shadow-blue-500/20 transition-all"
            >
              {t.addSubmit}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
