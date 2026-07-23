import React, { useState } from 'react';
import { ViewState, Lecture, VerificationStatus } from '../types';
import { LECTURES } from '../data/mockData';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { LectureCard } from '../components/cards/LectureCard';
import { Search, Filter } from 'lucide-react';

interface LecturesDirectoryPageProps {
  onNavigate: (view: ViewState) => void;
  onPlayLecture: (lecture: Lecture) => void;
}

export const LecturesDirectoryPage: React.FC<LecturesDirectoryPageProps> = ({ onNavigate, onPlayLecture }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredLectures = LECTURES.filter((lecture) => {
    const matchesSearch = lecture.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lecture.series.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lecture.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || lecture.verificationStatus === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-12 pb-16">
      <Breadcrumbs items={[{ label: 'Lectures Directory' }]} onNavigate={onNavigate} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-[#E6E1D6]">
          <div>
            <h1 className="text-3xl sm:text-5xl font-editorial font-normal text-[#1E1C18] mb-3">
              Master Lectures & Audio
            </h1>
            <p className="text-sm sm:text-base text-[#6E6454] max-w-2xl leading-relaxed">
              Authentic historical recordings indexed with full interactive transcripts, key ideas, and source verification.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search size={16} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[#736B5E]" />
              <input
                type="text"
                placeholder="Search lectures..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#F4F0E8] border border-[#E6E1D6] rounded-xl focus:outline-none focus:border-[#8C6D1F] text-[#1E1C18]"
              />
            </div>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full sm:w-auto px-4 py-2.5 text-xs sm:text-sm bg-[#F4F0E8] border border-[#E6E1D6] rounded-xl focus:outline-none focus:border-[#8C6D1F] text-[#1E1C18]"
            >
              <option value="all">All Verification Statuses</option>
              <option value="verified-source">Verified Source</option>
              <option value="probable-attribution">Probable Attribution</option>
            </select>
          </div>
        </div>

        {filteredLectures.length === 0 ? (
          <div className="text-center py-20 bg-[#F4F0E8] border border-[#E6E1D6] rounded-2xl">
            <h3 className="text-lg font-editorial text-[#1E1C18] mb-2">No lectures found</h3>
            <p className="text-xs text-[#736B5E]">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLectures.map((lecture) => (
              <LectureCard
                key={lecture.id}
                lecture={lecture}
                onClick={() => onNavigate({ type: 'lecture-detail', id: lecture.id })}
                onPlayClick={() => onPlayLecture(lecture)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
