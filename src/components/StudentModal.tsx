import React, { useState } from 'react';
import { Student, TrackType, GradeType } from '../types';
import { X, UserPlus, AlertCircle } from 'lucide-react';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStudent: (student: Omit<Student, 'id'>) => void;
}

export const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  onClose,
  onAddStudent,
}) => {
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
      newErrors.firstName = 'გთხოვთ მიუთითოთ მოსწავლის სახელი';
    } else if (firstName.trim().length < 2) {
      newErrors.firstName = 'სახელი უნდა შეიცავდეს მინიმუმ 2 სიმბოლოს';
    }

    if (!lastName.trim()) {
      newErrors.lastName = 'გთხოვთ მიუთითოთ მოსწავლის გვარი';
    } else if (lastName.trim().length < 2) {
      newErrors.lastName = 'გვარი უნდა შეიცავდეს მინიმუმ 2 სიმბოლოს';
    }

    if (!contact.trim()) {
      newErrors.contact = 'გთხოვთ მიუთითოთ საკონტაქტო ნომერი ან ელ-ფოსტა';
    } else if (contact.trim().length < 5) {
      newErrors.contact = 'საკონტაქტო ინფორმაცია ძალიან მოკლეა';
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-lg">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base">ახალი მოსწავლის დამატება</h3>
              <p className="text-xs text-blue-100">შეიყვანეთ მოსწავლის მონაცემები სიაში დასამატებლად</p>
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
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                სახელი <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="მაგ. ნიკოლოზ"
                className={`w-full px-3 py-2 text-sm rounded-xl border ${
                  errors.firstName
                    ? 'border-red-400 bg-red-50/50 focus:ring-red-400'
                    : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                } outline-none focus:ring-2 transition-all`}
              />
              {errors.firstName && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 flex-shrink-0" />
                  {errors.firstName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                გვარი <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="მაგ. ბერიძე"
                className={`w-full px-3 py-2 text-sm rounded-xl border ${
                  errors.lastName
                    ? 'border-red-400 bg-red-50/50 focus:ring-red-400'
                    : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                } outline-none focus:ring-2 transition-all`}
              />
              {errors.lastName && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 flex-shrink-0" />
                  {errors.lastName}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                კლასი (8-12) <span className="text-red-500">*</span>
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(Number(e.target.value) as GradeType)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
              >
                <option value={8}>8-ე კლასი</option>
                <option value={9}>9-ე კლასი</option>
                <option value={10}>10-ე კლასი</option>
                <option value={11}>11-ე კლასი</option>
                <option value={12}>12-ე კლასი</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                მიმართულება <span className="text-red-500">*</span>
              </label>
              <select
                value={track}
                onChange={(e) => setTrack(e.target.value as TrackType)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
              >
                <option value="გაცვლითი პროგრამები">გაცვლითი პროგრამები</option>
                <option value="კინგსის ტიპის ოლიმპიადა">კინგსის ტიპის ოლიმპიადა</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              არხი / კონტაქტი <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="მაგ. +995 599 00 11 22 ან student@gmail.com"
              className={`w-full px-3 py-2 text-sm rounded-xl border ${
                errors.contact
                  ? 'border-red-400 bg-red-50/50 focus:ring-red-400'
                  : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
              } outline-none focus:ring-2 transition-all`}
            />
            {errors.contact && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                {errors.contact}
              </p>
            )}
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              გაუქმება
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-xl shadow-md shadow-blue-500/20 transition-all"
            >
              დამატება
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
