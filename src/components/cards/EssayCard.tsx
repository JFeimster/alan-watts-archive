import React from 'react';
import { Essay } from '../../types';
import { VerificationBadge } from '../common/VerificationBadge';
import { FileText, Clock, Calendar, ArrowRight } from 'lucide-react';

interface EssayCardProps {
  essay: Essay;
  onClick: () => void;
}

export const EssayCard: React.FC<EssayCardProps> = ({ essay, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="group bg-[#F4F0E8] border border-[#E6E1D6] rounded-xl p-6 hover:bg-[#EFEADB] hover:border-[#D4CEBF] transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-xs hover:shadow-md"
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold tracking-wider uppercase text-[#8C6D1F]">
            Archival Essay
          </span>
          <VerificationBadge status={essay.verificationStatus} size="sm" />
        </div>

        <h3 className="text-xl font-editorial font-normal text-[#1E1C18] group-hover:text-[#8C6D1F] transition-colors mb-2">
          {essay.title}
        </h3>

        <p className="text-xs sm:text-sm text-[#6E6454] line-clamp-2 leading-relaxed mb-4">
          {essay.excerpt}
        </p>
      </div>

      <div className="pt-4 border-t border-[#E6E1D6] flex items-center justify-between text-xs text-[#736B5E]">
        <div className="flex items-center space-x-3">
          <span className="flex items-center">
            <Calendar size={13} className="mr-1 text-[#8C6D1F]" />
            {essay.date}
          </span>
          <span className="flex items-center">
            <Clock size={13} className="mr-1 text-[#8C6D1F]" />
            {essay.readTime}
          </span>
        </div>
        <ArrowRight size={15} className="text-[#8C6D1F] transform group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};
