import React from 'react';
import { Quote } from '../../types';
import { VerificationBadge } from '../common/VerificationBadge';
import { Quote as QuoteIcon, ArrowRight } from 'lucide-react';

interface QuoteCardProps {
  quote: Quote;
  onClick: () => void;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({ quote, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="group bg-[#F4F0E8] border border-[#E6E1D6] rounded-xl p-6 hover:bg-[#EFEADB] hover:border-[#D4CEBF] transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-xs hover:shadow-md"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="text-[#8C6D1F]">
            <QuoteIcon size={24} />
          </div>
          <VerificationBadge status={quote.verificationStatus} size="sm" />
        </div>

        <blockquote className="text-lg sm:text-xl font-editorial font-normal text-[#1E1C18] leading-relaxed mb-4 italic">
          “{quote.text}”
        </blockquote>
      </div>

      <div className="pt-4 border-t border-[#E6E1D6] flex items-center justify-between text-xs text-[#736B5E]">
        <div>
          <span className="font-semibold text-[#1E1C18] block">{quote.sourceLectureOrBook}</span>
          {quote.year && <span className="text-[#8C6D1F]">{quote.year}</span>}
        </div>
        <div className="flex items-center text-[#8C6D1F] group-hover:translate-x-1 transition-transform">
          <span>Read context</span>
          <ArrowRight size={14} className="ml-1" />
        </div>
      </div>
    </div>
  );
};
