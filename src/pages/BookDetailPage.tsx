import React from 'react';
import { ViewState } from '../types';
import { BOOKS } from '../data/mockData';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { BookOpen, Calendar, ExternalLink, Headphones } from 'lucide-react';

interface BookDetailPageProps {
  id: string;
  onNavigate: (view: ViewState) => void;
}

export const BookDetailPage: React.FC<BookDetailPageProps> = ({ id, onNavigate }) => {
  const book = BOOKS.find((b) => b.id === id) || BOOKS[0];

  return (
    <div className="space-y-12 pb-16">
      <Breadcrumbs 
        items={[
          { label: 'Books', view: { type: 'books' } },
          { label: book.title }
        ]} 
        onNavigate={onNavigate} 
      />

      <section className="bg-[#F4F0E8] border-b border-[#E6E1D6] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-4 flex justify-center">
            <img 
              src={book.coverImage} 
              alt={book.title}
              className="w-56 h-80 object-cover rounded-xl shadow-xl border border-[#D4CEBF]"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="md:col-span-8 space-y-6">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8C6D1F]">
                {book.publisher} • {book.year}
              </span>
              {book.audiobookAvailable && (
                <span className="inline-flex items-center text-xs bg-[#2E4033]/10 text-[#2E4033] px-2.5 py-1 rounded-full">
                  <Headphones size={12} className="mr-1" /> Audiobook Available
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-editorial font-normal text-[#1E1C18]">
              {book.title}
            </h1>

            <p className="text-sm sm:text-base text-[#6E6454] leading-relaxed">
              {book.description}
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {book.keyThemes.map((theme, idx) => (
                <span key={idx} className="text-xs bg-[#E8E3D8] text-[#5C5244] px-3 py-1 rounded-full font-medium">
                  {theme}
                </span>
              ))}
            </div>

            {book.purchaseUrl && (
              <div className="pt-4">
                <a
                  href={book.purchaseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-[#2C3E35] text-white hover:bg-[#1E2B37] px-6 py-3 rounded-xl font-medium text-sm transition-colors shadow"
                >
                  <span>Publisher Edition Details</span>
                  <ExternalLink size={15} />
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      {book.tableOfContents && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-2xl font-editorial font-normal text-[#1E1C18]">
            Table of Contents
          </h2>
          <div className="bg-[#F4F0E8] border border-[#E6E1D6] rounded-2xl p-8 space-y-4">
            {book.tableOfContents.map((chapter, idx) => (
              <div key={idx} className="flex items-center justify-between py-3 border-b border-[#E6E1D6] last:border-none">
                <span className="text-sm font-medium text-[#1E1C18]">
                  {idx + 1}. {chapter}
                </span>
                <span className="text-xs text-[#736B5E]">Chapter</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
