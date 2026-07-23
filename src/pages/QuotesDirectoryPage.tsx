import React, { useState } from 'react';
import { ViewState } from '../types';
import { QUOTES } from '../data/mockData';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { QuoteCard } from '../components/cards/QuoteCard';
import { Search } from 'lucide-react';

interface QuotesDirectoryPageProps {
  onNavigate: (view: ViewState) => void;
}

export const QuotesDirectoryPage: React.FC<QuotesDirectoryPageProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredQuotes = QUOTES.filter((q) =>
    q.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.sourceLectureOrBook.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-12 pb-16">
      <Breadcrumbs items={[{ label: 'Verified Quotations' }]} onNavigate={onNavigate} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-[#E6E1D6]">
          <div>
            <h1 className="text-3xl sm:text-5xl font-editorial font-normal text-[#1E1C18] mb-3">
              Verified Quotations
            </h1>
            <p className="text-sm sm:text-base text-[#6E6454] max-w-2xl leading-relaxed">
              Carefully attributed excerpts with primary source context, dates, and scholarly interpretations.
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search size={16} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[#736B5E]" />
            <input
              type="text"
              placeholder="Search quotations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#F4F0E8] border border-[#E6E1D6] rounded-xl focus:outline-none focus:border-[#8C6D1F] text-[#1E1C18]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuotes.map((quote) => (
            <QuoteCard
              key={quote.id}
              quote={quote}
              onClick={() => onNavigate({ type: 'quote-detail', id: quote.id })}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
