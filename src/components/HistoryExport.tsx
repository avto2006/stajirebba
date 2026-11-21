import React, { useState } from 'react';
import { BroadcastHistoryItem, SentMessage } from '../types';
import { exportToTxt, exportToCsv } from '../utils';
import {
  History,
  FileDown,
  Copy,
  Check,
  CheckCircle2,
  Calendar,
  Users,
  Search,
  Trash2,
  ChevronRight,
  Sparkles,
  GraduationCap,
} from 'lucide-react';

interface HistoryExportProps {
  history: BroadcastHistoryItem[];
  onClearHistory: () => void;
  onDeleteHistoryItem: (id: string) => void;
}

export const HistoryExport: React.FC<HistoryExportProps> = ({
  history,
  onClearHistory,
  onDeleteHistoryItem,
}) => {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(
    history.length > 0 ? history[0].id : null
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [messageSearch, setMessageSearch] = useState('');

  // Keep selected campaign valid if history changes
  const activeCampaign =
    history.find((h) => h.id === selectedCampaignId) || (history.length > 0 ? history[0] : null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const filteredMessages = activeCampaign
    ? activeCampaign.messages.filter((m: SentMessage) => {
        if (!messageSearch) return true;
        const q = messageSearch.toLowerCase();
        return (
          m.studentName.toLowerCase().includes(q) ||
          m.contact.toLowerCase().includes(q) ||
          m.renderedText.toLowerCase().includes(q)
        );
      })
    : [];

  if (history.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
          <History className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-slate-900 mb-1">
          გაგზავნილი შეტყობინებების ისტორია ცარიელია
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          როდესაც მონიშნავთ მოსწავლეებს და გააგზავნით შეტყობინებას, ჟურნალის ჩანაწერი და პერსონალიზებული ტექსტები გამოჩნდება აქ.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner & Global History Actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shadow-xs">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              შეტყობინებების ისტორია და ექსპორტი
            </h2>
            <p className="text-xs text-slate-500">
              სულ გაგზავნილი კამპანია: <strong>{history.length}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeCampaign && (
            <>
              <button
                onClick={() => exportToTxt(activeCampaign.eventName, activeCampaign.messages)}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all shadow-xs"
              >
                <FileDown className="w-4 h-4 text-blue-600" />
                <span>TXT ექსპორტი</span>
              </button>
              <button
                onClick={() => exportToCsv(activeCampaign.eventName, activeCampaign.messages)}
                className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-xl border border-blue-200 transition-all shadow-xs"
              >
                <FileDown className="w-4 h-4 text-emerald-600" />
                <span>CSV ექსპორტი</span>
              </button>
            </>
          )}

          <button
            onClick={onClearHistory}
            title="ისტორიის გასუფთავება"
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: Campaigns list on left, details on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Campaign List (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              გაგზავნილი ღონისძიებები
            </h3>
          </div>

          <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
            {history.map((item) => {
              const isSelected = activeCampaign?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedCampaignId(item.id)}
                  className={`p-4 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-50/80 border-l-4 border-blue-600'
                      : 'hover:bg-slate-50/80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
                      {item.eventName}
                    </h4>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteHistoryItem(item.id);
                      }}
                      className="text-slate-300 hover:text-red-500 p-1 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {item.sentAt}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-semibold text-blue-600">
                      <Users className="w-3 h-3" />
                      {item.recipientCount}
                    </span>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {item.status}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Campaign Detailed Messages (8 cols) */}
        {activeCampaign && (
          <div className="lg:col-span-8 space-y-4">
            {/* Active Header Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">
                      {activeCampaign.eventName}
                    </h3>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3" /> გაგზავნილია
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    გაგზავნის დრო: {activeCampaign.sentAt} | ადრესატები: {activeCampaign.recipientCount} მოსწავლე
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => exportToTxt(activeCampaign.eventName, activeCampaign.messages)}
                    className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors flex items-center gap-1"
                  >
                    <FileDown className="w-3.5 h-3.5" />
                    TXT
                  </button>
                  <button
                    onClick={() => exportToCsv(activeCampaign.eventName, activeCampaign.messages)}
                    className="px-3 py-1.5 text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl transition-colors flex items-center gap-1"
                  >
                    <FileDown className="w-3.5 h-3.5" />
                    CSV
                  </button>
                </div>
              </div>

              {/* Search in sent messages */}
              <div className="mt-4 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={messageSearch}
                  onChange={(e) => setMessageSearch(e.target.value)}
                  placeholder="ძიება მიმღებთა შეტყობინებებში (სახელი, ნომერი, ტექსტი)..."
                  className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            {/* List of Personalized Messages */}
            <div className="space-y-3">
              {filteredMessages.map((msg, index) => {
                const isCopied = copiedId === `${activeCampaign.id}-${msg.studentId}-${index}`;
                return (
                  <div
                    key={`${msg.studentId}-${index}`}
                    className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4.5 hover:border-blue-200 transition-all space-y-3"
                  >
                    {/* Student Info Bar */}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center">
                          {index + 1}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">
                          {msg.studentName}
                        </h4>
                        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-medium">
                          {msg.grade}-ე კლასი
                        </span>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            msg.track === 'გაცვლითი პროგრამები'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {msg.track === 'გაცვლითი პროგრამები' ? (
                            <Sparkles className="w-2.5 h-2.5 mr-1" />
                          ) : (
                            <GraduationCap className="w-2.5 h-2.5 mr-1" />
                          )}
                          {msg.track}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                          {msg.contact}
                        </span>

                        <button
                          onClick={() =>
                            handleCopy(
                              `${activeCampaign.id}-${msg.studentId}-${index}`,
                              msg.renderedText
                            )
                          }
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all shadow-2xs ${
                            isCopied
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-200'
                          }`}
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>დაკოპირდა!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>კოპირება</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Rendered Text */}
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap font-normal">
                      {msg.renderedText}
                    </div>
                  </div>
                );
              })}

              {filteredMessages.length === 0 && (
                <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
                  მითითებული პარამეტრებით შეტყობინება ვერ მოიძებნა
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
