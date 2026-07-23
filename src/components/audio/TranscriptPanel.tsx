import React, { useState } from 'react';
import { Lecture } from '../../types';
import { X, Search, Clock, FileText } from 'lucide-react';

interface TranscriptPanelProps {
  lecture: Lecture;
  onClose: () => void;
}

export const TranscriptPanel: React.FC<TranscriptPanelProps> = ({ lecture, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTranscript = lecture.transcript.filter((item) =>
    item.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-[#F9F6F0] border-l border-[#E6E1D6] shadow-2xl flex flex-col">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-[#E6E1D6] flex items-center justify-between bg-[#F4F0E8]">
        <div className="flex items-center space-x-2">
          <FileText size={18} className="text-[#8C6D1F]" />
          <h3 className="text-lg font-editorial font-medium text-[#1E1C18]">
            Interactive Transcript
          </h3>
        </div>
        <button
          onClick={onClose}
          className="text-[#736B5E] hover:text-[#1E1C18] p-1.5 rounded-lg transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Search Filter */}
      <div className="p-4 border-b border-[#E6E1D6] bg-[#F9F6F0]">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#736B5E]" />
          <input
            type="text"
            placeholder="Search transcript text..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-[#F4F0E8] border border-[#E6E1D6] rounded-lg focus:outline-none focus:border-[#8C6D1F] text-[#1E1C18]"
          />
        </div>
      </div>

      {/* Transcript List */}
      <div className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-4">
        <div className="text-xs text-[#736B5E] mb-2">
          {lecture.series} • {lecture.year} ({lecture.transcript.length} archived segments)
        </div>

        {filteredTranscript.length === 0 ? (
          <div className="text-center py-12 text-[#736B5E] text-sm">
            No transcript segments match "{searchQuery}"
          </div>
        ) : (
          filteredTranscript.map((item, idx) => (
            <div 
              key={idx}
              className="p-3.5 rounded-lg bg-[#F4F0E8] border border-[#E6E1D6] hover:border-[#8C6D1F]/50 transition-colors group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="inline-flex items-center text-xs font-semibold text-[#8C6D1F] bg-[#8C6D1F]/10 px-2 py-0.5 rounded">
                  <Clock size={11} className="mr-1" />
                  {item.time}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#38332C] leading-relaxed">
                {item.text}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Footer Note */}
      <div className="p-4 border-t border-[#E6E1D6] bg-[#F4F0E8] text-[11px] text-[#736B5E] text-center">
        Archival transcript verified against master audio tapes.
      </div>
    </div>
  );
};
