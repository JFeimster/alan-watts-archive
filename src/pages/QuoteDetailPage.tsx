import React from 'react';
import { ViewState } from '../types';
import { QUOTES } from '../data/mockData';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { VerificationBadge } from '../components/common/VerificationBadge';
import { Quote as QuoteIcon, Calendar, BookOpen, Share2 } from 'lucide-react';

interface QuoteDetailPageProps {
  id: string;
  onNavigate: (view: ViewState) => void;
}

export const QuoteDetailPage: React.FC<QuoteDetailPageProps> = ({ id, onNavigate }) => {
  const quote = QUOTES.find((q) => q.id === id) || QUOTES[0];

  return (
    <div className="space-y-12 pb-16">
      <Breadcrumbs 
        items={[
          { label: 'Quotes', view: { type: 'quotes' } },
          { label: 'Quotation Detail' }
        ]} 
        onNavigate={onNavigate} 
      />

      <section className="bg-[#F4F0E8] border-b border-[#E6E1D6] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-8 text-center">
          <div className="flex justify-center">
            <VerificationBadge status={quote.verificationStatus} size="lg" />
          </div>

          <blockquote className="text-2xl sm:text-4xl font-editorial font-normal text-[#1E1C18] leading-relaxed italic">
            “{quote.text}”
          </blockquote>

          <div className="text-sm font-semibold text-[#8C6D1F]">
            — Alan Watts, {quote.sourceLectureOrBook} {quote.year ? `(${quote.year})` : ''}
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="bg-[#F4F0E8] border border-[#E6E1D6] rounded-2xl p-8 space-y-6">
          <h3 className="text-xl font-editorial font-normal text-[#1E1C18]">Historical Context</h3>
          <p className="text-sm sm:text-base text-[#6E6454] leading-relaxed">
            {quote.context}
          </p>
        </div>

        <div className="bg-[#F4F0E8] border border-[#E6E1D6] rounded-2xl p-8 space-y-6">
          <h3 className="text-xl font-editorial font-normal text-[#1E1C18]">Scholarly Interpretation</h3>
          <p className="text-sm sm:text-base text-[#6E6454] leading-relaxed">
            {quote.interpretation}
          </p>
        </div>
      </div>
    </div>
  );
};
