import React from 'react';
import { ViewState } from '../types';
import { BOOKS } from '../data/mockData';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { BookCard } from '../components/cards/BookCard';

interface BooksDirectoryPageProps {
  onNavigate: (view: ViewState) => void;
}

export const BooksDirectoryPage: React.FC<BooksDirectoryPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-12 pb-16">
      <Breadcrumbs items={[{ label: 'Published Books' }]} onNavigate={onNavigate} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 pb-6 border-b border-[#E6E1D6]">
          <h1 className="text-3xl sm:text-5xl font-editorial font-normal text-[#1E1C18] mb-3">
            Published Books
          </h1>
          <p className="text-sm sm:text-base text-[#6E6454] max-w-2xl leading-relaxed">
            Seminal philosophical works written by Alan Watts between 1951 and 1973.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BOOKS.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onClick={() => onNavigate({ type: 'book-detail', id: book.id })}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
