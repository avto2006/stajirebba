import React, { useState, useMemo } from 'react';
import { Student, TrackType } from '../types';
import { Language, translations } from '../translations';
import { getStudentDisplayName } from '../utils';
import {
  Search,
  Filter,
  UserPlus,
  RotateCcw,
  CheckSquare,
  Square,
  Trash2,
  Phone,
  Mail,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

interface StudentListProps {
  students: Student[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onSelectAll: (ids: string[]) => void;
  onDeselectAll: () => void;
  onDeleteStudent: (id: string) => void;
  onOpenAddModal: () => void;
  onResetData: () => void;
  lang: Language;
}

export const StudentList: React.FC<StudentListProps> = ({
  students,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onDeselectAll,
  onDeleteStudent,
  onOpenAddModal,
  onResetData,
  lang,
}) => {
  const t = translations[lang];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedTrack, setSelectedTrack] = useState<string>('all');

  // Filter students based on search query, grade, and track
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const names = getStudentDisplayName(student, lang);
      const fullNameGeo = `${student.firstName} ${student.lastName}`.toLowerCase();
      const fullNameEn = (student.firstNameEn && student.lastNameEn)
        ? `${student.firstNameEn} ${student.lastNameEn}`.toLowerCase()
        : names.fullName.toLowerCase();
      const contactLower = student.contact.toLowerCase();
      const q = searchQuery.toLowerCase().trim();

      const matchesSearch =
        !q ||
        fullNameGeo.includes(q) ||
        fullNameEn.includes(q) ||
        contactLower.includes(q);

      // Grade
      const matchesGrade =
        selectedGrade === 'all' || student.grade.toString() === selectedGrade;

      // Track
      const matchesTrack =
        selectedTrack === 'all' || student.track === selectedTrack;

      return matchesSearch && matchesGrade && matchesTrack;
    });
  }, [students, searchQuery, selectedGrade, selectedTrack, lang]);

  const filteredIds = useMemo(
    () => filteredStudents.map((s) => s.id),
    [filteredStudents]
  );

  const areAllFilteredSelected =
    filteredStudents.length > 0 &&
    filteredStudents.every((s) => selectedIds.includes(s.id));

  const handleToggleSelectAll = () => {
    if (areAllFilteredSelected) {
      // Deselect filtered
      const newSelected = selectedIds.filter((id) => !filteredIds.includes(id));
      if (newSelected.length === 0) {
        onDeselectAll();
      } else {
        onSelectAll(newSelected);
      }
    } else {
      // Add all filtered to selection
      const merged = Array.from(new Set([...selectedIds, ...filteredIds]));
      onSelectAll(merged);
    }
  };

  const getTrackBadge = (track: TrackType) => {
    if (track === 'გაცვლითი პროგრამები') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
          <Sparkles className="w-2.5 h-2.5 mr-1 text-blue-500" />
          {t.badgeExchange}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
        <GraduationCap className="w-2.5 h-2.5 mr-1 text-amber-500" />
        {t.badgeOlympiad}
      </span>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col h-full overflow-hidden transition-colors duration-200">
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800/80 space-y-3.5">
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {t.studentsListTitle}
              </h2>
              <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md text-xs font-semibold">
                {filteredStudents.length} / {students.length}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t.studentsListSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-xs font-semibold shadow-xs transition-all"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{t.addButton}</span>
            </button>
            <button
              onClick={onResetData}
              title={t.navReset}
              className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 gap-2">
          {/* Grade filter */}
          <div className="relative">
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full text-xs py-1.5 px-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 font-medium outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">{t.allGrades}</option>
              <option value="8">{t.gradeN(8)}</option>
              <option value="9">{t.gradeN(9)}</option>
              <option value="10">{t.gradeN(10)}</option>
              <option value="11">{t.gradeN(11)}</option>
              <option value="12">{t.gradeN(12)}</option>
            </select>
          </div>

          {/* Track filter */}
          <div className="relative">
            <select
              value={selectedTrack}
              onChange={(e) => setSelectedTrack(e.target.value)}
              className="w-full text-xs py-1.5 px-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 font-medium outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">{t.allTracks}</option>
              <option value="გაცვლითი პროგრამები">{t.trackExchange}</option>
              <option value="კინგსის ტიპის ოლიმპიადა">{t.trackOlympiad}</option>
            </select>
          </div>
        </div>

        {/* Selection Bar: Select All + Selected Count */}
        <div className="flex items-center justify-between pt-1 text-xs">
          <button
            onClick={handleToggleSelectAll}
            className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {areAllFilteredSelected ? (
              <CheckSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            ) : (
              <Square className="w-4 h-4 text-slate-400 dark:text-slate-600" />
            )}
            <span>{t.selectAll(filteredStudents.length)}</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              {t.selectedIndicator}{' '}
              <strong className="text-blue-700 dark:text-blue-400">{selectedIds.length}</strong>
            </span>
            {selectedIds.length > 0 && (
              <button
                onClick={onDeselectAll}
                className="text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400 font-semibold underline underline-offset-2"
              >
                {t.clearSelection}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Student List Items */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80 max-h-[580px] p-2 space-y-1">
        {filteredStudents.length === 0 ? (
          <div className="py-12 text-center text-slate-400 dark:text-slate-500">
            <Filter className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {t.noStudentsFound}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              {t.noStudentsSubtext}
            </p>
          </div>
        ) : (
          filteredStudents.map((student) => {
            const isSelected = selectedIds.includes(student.id);
            const names = getStudentDisplayName(student, lang);
            const isPhone =
              student.contact.startsWith('+') || /^\d+$/.test(student.contact.replace(/\s+/g, ''));

            return (
              <div
                key={student.id}
                onClick={() => onToggleSelect(student.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/60 shadow-2xs'
                    : 'bg-white dark:bg-slate-900 border-transparent hover:bg-slate-50/80 dark:hover:bg-slate-800/60 hover:border-slate-200 dark:hover:border-slate-750'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Checkbox */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSelect(student.id);
                    }}
                    className="flex-shrink-0 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    {isSelected ? (
                      <CheckSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                    )}
                  </div>

                  {/* Avatar / Initials */}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 tracking-wide ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {names.initials}
                  </div>

                  {/* Info */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {names.fullName}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                        {t.gradeN(student.grade)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {getTrackBadge(student.track)}
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        {isPhone ? (
                          <Phone className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                        ) : (
                          <Mail className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                        )}
                        <span className="truncate max-w-[150px]">{student.contact}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteStudent(student.id);
                    }}
                    title={t.deleteStudentTooltip}
                    className="p-1.5 text-slate-300 dark:text-slate-600 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer count indicator */}
      <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
        <span>
          {t.totalStudentsFooter}{' '}
          <strong className="text-slate-800 dark:text-slate-200">{students.length}</strong> {t.studentsCount}
        </span>
        <span className="font-semibold text-blue-600 dark:text-blue-400">
          {t.selectedIndicator} {selectedIds.length}
        </span>
      </div>
    </div>
  );
};
