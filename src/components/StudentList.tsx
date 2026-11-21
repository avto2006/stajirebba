import React, { useState, useMemo } from 'react';
import { Student, TrackType } from '../types';
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
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedTrack, setSelectedTrack] = useState<string>('all');

  // Filter students based on search query, grade, and track
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      // Search
      const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
      const contactLower = student.contact.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        fullName.includes(searchQuery.toLowerCase().trim()) ||
        contactLower.includes(searchQuery.toLowerCase().trim());

      // Grade
      const matchesGrade =
        selectedGrade === 'all' || student.grade.toString() === selectedGrade;

      // Track
      const matchesTrack =
        selectedTrack === 'all' || student.track === selectedTrack;

      return matchesSearch && matchesGrade && matchesTrack;
    });
  }, [students, searchQuery, selectedGrade, selectedTrack]);

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
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          <Sparkles className="w-2.5 h-2.5 mr-1" />
          გაცვლითი
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
        <GraduationCap className="w-2.5 h-2.5 mr-1" />
        ოლიმპიადა
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden">
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 space-y-3.5">
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">მოსწავლეების სია</h2>
              <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-xs font-semibold">
                {filteredStudents.length} / {students.length}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              მონიშნეთ ადრესატები შეტყობინების გასაგზავნად
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all active:scale-95"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>დამატება</span>
            </button>
            <button
              onClick={onResetData}
              title="საცდელი მონაცემების აღდგენა (10 საცდელი მოსწავლე)"
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ძიება: სახელი, გვარი, კონტაქტი..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
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
              className="w-full text-xs py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">ყველა კლასი (8-12)</option>
              <option value="8">8-ე კლასი</option>
              <option value="9">9-ე კლასი</option>
              <option value="10">10-ე კლასი</option>
              <option value="11">11-ე კლასი</option>
              <option value="12">12-ე კლასი</option>
            </select>
          </div>

          {/* Track filter */}
          <div className="relative">
            <select
              value={selectedTrack}
              onChange={(e) => setSelectedTrack(e.target.value)}
              className="w-full text-xs py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">ყველა მიმართულება</option>
              <option value="გაცვლითი პროგრამები">გაცვლითი პროგრამები</option>
              <option value="კინგსის ტიპის ოლიმპიადა">კინგსის ტიპის ოლიმპიადა</option>
            </select>
          </div>
        </div>

        {/* Selection Bar: Select All + Selected Count */}
        <div className="flex items-center justify-between pt-1 text-xs">
          <button
            onClick={handleToggleSelectAll}
            className="flex items-center gap-1.5 font-semibold text-slate-700 hover:text-blue-600 transition-colors"
          >
            {areAllFilteredSelected ? (
              <CheckSquare className="w-4 h-4 text-blue-600" />
            ) : (
              <Square className="w-4 h-4 text-slate-400" />
            )}
            <span>ყველას მონიშვნა ({filteredStudents.length})</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">
              მონიშნულია:{' '}
              <strong className="text-blue-700">{selectedIds.length}</strong>
            </span>
            {selectedIds.length > 0 && (
              <button
                onClick={onDeselectAll}
                className="text-xs text-red-500 hover:text-red-700 font-semibold underline underline-offset-2"
              >
                გასუფთავება
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Student List Items */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 max-h-[580px] p-2 space-y-1">
        {filteredStudents.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <Filter className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">მოსწავლეები ვერ მოიძებნა</p>
            <p className="text-xs text-slate-400 mt-1">
              შეცვალეთ ფილტრის პარამეტრები ან დაამატეთ ახალი მოსწავლე
            </p>
          </div>
        ) : (
          filteredStudents.map((student) => {
            const isSelected = selectedIds.includes(student.id);
            const isPhone = student.contact.startsWith('+') || /^\d+$/.test(student.contact.replace(/\s+/g, ''));

            return (
              <div
                key={student.id}
                onClick={() => onToggleSelect(student.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-blue-50/70 border-blue-200 shadow-sm'
                    : 'bg-white border-transparent hover:bg-slate-50/80 hover:border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Checkbox */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSelect(student.id);
                    }}
                    className="flex-shrink-0 text-slate-400 hover:text-blue-600"
                  >
                    {isSelected ? (
                      <CheckSquare className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-300" />
                    )}
                  </div>

                  {/* Avatar / Initials */}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {student.firstName[0]}
                    {student.lastName[0]}
                  </div>

                  {/* Info */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-slate-900 truncate">
                        {student.firstName} {student.lastName}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        {student.grade}-ე კლასი
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {getTrackBadge(student.track)}
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        {isPhone ? (
                          <Phone className="w-3 h-3 text-slate-400" />
                        ) : (
                          <Mail className="w-3 h-3 text-slate-400" />
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
                    title="მოსწავლის წაშლა"
                    className="p-1.5 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 hover:opacity-100"
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
      <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
        <span>
          სულ: <strong>{students.length}</strong> მოსწავლე
        </span>
        <span className="font-semibold text-blue-600">
          მონიშნულია: {selectedIds.length}
        </span>
      </div>
    </div>
  );
};
