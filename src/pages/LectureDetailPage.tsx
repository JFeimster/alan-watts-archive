import React from 'react';
import { ViewState, Lecture } from '../types';
import { LECTURES, TOPICS, QUOTES, BOOKS } from '../data/mockData';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { VerificationBadge } from '../components/common/VerificationBadge';
import { SectionHeading } from '../components/common/SectionHeading';
import { QuoteCard } from '../components/cards/QuoteCard';
import { BookCard } from '../components/cards/BookCard';
import { Play, Clock, Calendar, ShieldCheck, FileText, Share2, ArrowLeft, ArrowRight } from 'lucide-react';

interface LectureDetailPageProps {
  id: string;
  onNavigate: (view: ViewState) => void;
  onPlayLecture: (lecture: Lecture) => void;
  onOpenTranscript: () => void;
}

export const LectureDetailPage: React.FC<LectureDetailPageProps> = ({
  id,
  onNavigate,
  onPlayLecture,
  onOpenTranscript
}) => {
  const lecture = LECTURES.find((l) => l.id === id) || LECTURES[0];

  const currentIndex = LECTURES.findIndex((l) => l.id === lecture.id);
  const prevLecture = currentIndex > 0 ? LECTURES[currentIndex - 1] : null;
  const nextLecture = currentIndex < LECTURES.length - 1 ? LECTURES[currentIndex + 1] : null;

  return (
    <div className="space-y-12 pb-24">
      <Breadcrumbs 
        items={[
          { label: 'Lectures', view: { type: 'lectures' } },
          { label: lecture.title }
        ]} 
        onNavigate={onNavigate} 
      />

      {/* Hero Header */}
      <section className="bg-[#F4F0E8] border-b border-[#E6E1D6] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8C6D1F]">
              {lecture.series} • {lecture.year}
            </span>
            <VerificationBadge status={lecture.verificationStatus} size="md" />
          </div>

          <h1 className="text-3xl sm:text-5xl font-editorial font-normal text-[#1E1C18] leading-tight">
            {lecture.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm text-[#736B5E] pt-2">
            <span className="flex items-center">
              <Calendar size={15} className="mr-1.5 text-[#8C6D1F]" />
              Recorded {lecture.year}
            </span>
            <span className="flex items-center">
              <Clock size={15} className="mr-1.5 text-[#8C6D1F]" />
              {lecture.duration} duration
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={() => onPlayLecture(lecture)}
              className="inline-flex items-center space-x-2 bg-[#2C3E35] text-white hover:bg-[#1E2B37] px-6 py-3.5 rounded-xl font-medium text-sm transition-all shadow"
            >
              <Play size={16} className="fill-current" />
              <span>Play Audio Recording</span>
            </button>
            <button
              onClick={onOpenTranscript}
              className="inline-flex items-center space-x-2 bg-white text-[#1E1C18] border border-[#D4CEBF] hover:bg-[#EFEADB] px-6 py-3.5 rounded-xl font-medium text-sm transition-all"
            >
              <FileText size={16} className="text-[#8C6D1F]" />
              <span>Open Interactive Transcript</span>
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Authenticity Notice */}
        <div className="bg-[#1E2B37] text-white rounded-xl p-6 border border-[#3A4E5E] flex items-start space-x-4">
          <ShieldCheck size={24} className="text-[#C9A227] shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-[#B5AD9C] leading-relaxed">
            <strong className="text-white font-medium block mb-1">Authentic Archival Record</strong>
            “This is a genuine recording of Alan Watts from historical lectures—not an AI-generated voice or synthetic recreation.”
            <div className="mt-2 text-xs text-[#C9A227] font-medium">
              Source Note: {lecture.sourceNote}
            </div>
          </div>
        </div>

        {/* Summary & Key Ideas */}
        <div className="bg-[#F4F0E8] border border-[#E6E1D6] rounded-2xl p-8 space-y-6">
          <h2 className="text-2xl font-editorial font-normal text-[#1E1C18]">Summary & Core Insights</h2>
          <p className="text-sm sm:text-base text-[#6E6454] leading-relaxed">
            {lecture.summary}
          </p>

          <div className="pt-4 border-t border-[#E6E1D6]">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8C6D1F] mb-3">
              Key Ideas Explored
            </h3>
            <ul className="space-y-2.5">
              {lecture.keyIdeas.map((idea, idx) => (
                <li key={idx} className="flex items-start text-xs sm:text-sm text-[#38332C]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8C6D1F] mt-2 mr-2.5 shrink-0" />
                  <span>{idea}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Transcript Preview */}
        <div className="bg-[#F4F0E8] border border-[#E6E1D6] rounded-2xl p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-editorial font-normal text-[#1E1C18]">Transcript Highlights</h2>
            <button
              onClick={onOpenTranscript}
              className="text-xs font-medium text-[#8C6D1F] hover:underline"
            >
              View Full Transcript →
            </button>
          </div>

          <div className="space-y-4">
            {lecture.transcript.slice(0, 3).map((t, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-white border border-[#E6E1D6]">
                <span className="inline-block text-xs font-semibold text-[#8C6D1F] bg-[#8C6D1F]/10 px-2 py-0.5 rounded mb-2">
                  {t.time}
                </span>
                <p className="text-xs sm:text-sm text-[#38332C] leading-relaxed">
                  {t.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Prev / Next Lecture Navigation */}
        <div className="pt-8 border-t border-[#E6E1D6] flex flex-col sm:flex-row items-center justify-between gap-4">
          {prevLecture ? (
            <button
              onClick={() => onNavigate({ type: 'lecture-detail', id: prevLecture.id })}
              className="w-full sm:w-auto flex items-center space-x-3 text-left p-4 rounded-xl bg-[#F4F0E8] border border-[#E6E1D6] hover:border-[#8C6D1F] transition-colors"
            >
              <ArrowLeft size={18} className="text-[#8C6D1F] shrink-0" />
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#736B5E] block">Previous Lecture</span>
                <span className="text-xs sm:text-sm font-medium text-[#1E1C18] line-clamp-1">{prevLecture.title}</span>
              </div>
            </button>
          ) : <div />}

          {nextLecture && (
            <button
              onClick={() => onNavigate({ type: 'lecture-detail', id: nextLecture.id })}
              className="w-full sm:w-auto flex items-center justify-end space-x-3 text-right p-4 rounded-xl bg-[#F4F0E8] border border-[#E6E1D6] hover:border-[#8C6D1F] transition-colors ml-auto"
            >
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#736B5E] block">Next Lecture</span>
                <span className="text-xs sm:text-sm font-medium text-[#1E1C18] line-clamp-1">{nextLecture.title}</span>
              </div>
              <ArrowRight size={18} className="text-[#8C6D1F] shrink-0" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
