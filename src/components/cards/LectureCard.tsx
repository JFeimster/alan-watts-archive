import React from 'react';
import { Lecture } from '../../types';
import { VerificationBadge } from '../common/VerificationBadge';
import { Play, Clock, Calendar } from 'lucide-react';

interface LectureCardProps {
  lecture: Lecture;
  onClick: () => void;
  onPlayClick?: (e: React.MouseEvent) => void;
}

export const LectureCard: React.FC<LectureCardProps> = ({ lecture, onClick, onPlayClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-[#F4F0E8] border border-[#E6E1D6] rounded-xl p-6 hover:bg-[#EFEADB] hover:border-[#D4CEBF] transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-xs hover:shadow-md group"
    >
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <span className="text-xs font-semibold tracking-wider uppercase text-[#8C6D1F]">
            {lecture.series}
          </span>
          <VerificationBadge status={lecture.verificationStatus} size="sm" />
        </div>

        <h3 className="text-xl font-editorial font-normal text-[#1E1C18] group-hover:text-[#8C6D1F] transition-colors mb-2">
          {lecture.title}
        </h3>

        <p className="text-xs sm:text-sm text-[#6E6454] line-clamp-2 leading-relaxed mb-4">
          {lecture.summary}
        </p>
      </div>

      <div className="pt-4 border-t border-[#E6E1D6] flex items-center justify-between text-xs text-[#736B5E]">
        <div className="flex items-center space-x-3">
          <span className="flex items-center">
            <Calendar size={13} className="mr-1 text-[#8C6D1F]" />
            {lecture.year}
          </span>
          <span className="flex items-center">
            <Clock size={13} className="mr-1 text-[#8C6D1F]" />
            {lecture.duration}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onPlayClick) onPlayClick(e);
            else onClick();
          }}
          className="w-8 h-8 rounded-full bg-[#2C3E35] text-white flex items-center justify-center hover:bg-[#8C6D1F] transition-colors"
          title="Play Lecture"
        >
          <Play size={14} className="ml-0.5" />
        </button>
      </div>
    </div>
  );
};
