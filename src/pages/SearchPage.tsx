import React, { useState } from 'react';
import { ViewState, Lecture, Topic, Quote, Book } from '../types';
import { LECTURES, TOPICS, QUOTES, BOOKS, ESSAYS } from '../data/mockData';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { LectureCard } from '../components/cards/LectureCard';
import { TopicCard } from '../components/cards/TopicCard';
import { QuoteCard } from '../components/cards/QuoteCard';
import { BookCard } from '../components/cards/BookCard';
import { Search, Filter, Loader2, AlertCircle } from 'lucide-react';

interface SearchPageProps {
  initialQuery?: string;
  onNavigate: (view: ViewState) => void;
  onPlayLecture: (lecture: Lecture) => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({ initialQuery = '', onNavigate, onPlayLecture }) => {
  const [query, setQuery] = useState(initialQuery);
  const [contentType, setContentType] = useState<string>('all');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchChange = (val: string) => {
    setQuery(val);
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 200);
  };

  const matchingLectures = LECTURES.filter((l) =>
    l.title.toLowerCase().includes(query.toLowerCase()) ||
    l.summary.toLowerCase().includes(query.toLowerCase()) ||
    l.series.toLowerCase().includes(query.toLowerCase())
  );

  const matchingTopics = TOPICS.filter((t) =>
    t.title.toLowerCase().includes(query.toLowerCase()) ||
    t.description.toLowerCase().includes(query.toLowerCase())
  );

  const matchingQuotes = QUOTES.filter((q) =>
    q.text.toLowerCase().includes(query.toLowerCase()) ||
    q.sourceLectureOrBook.toLowerCase().includes(query.toLowerCase())
  );

  const matchingBooks = BOOKS.filter((b) =>
    b.title.toLowerCase().includes(query.toLowerCase()) ||
    b.description.toLowerCase().includes(query.toLowerCase())
  );

  const totalResults = matchingLectures.length + matchingTopics.length + matchingQuotes.length + matchingBooks.length;

  return (
    <div className="space-y-12 pb-16">
      <Breadcrumbs items={[{ label: 'Archive Search & Filters' }]} onNavigate={onNavigate} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Search Bar & Filters */}
        <div className="bg-[#F4F0E8] border border-[#E6E1D6] rounded-2xl p-6 sm:p-8 space-y-6">
          <h1 className="text-3xl font-editorial font-normal text-[#1E1C18]">
            Search Archive & Filters
          </h1>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#736B5E]" />
              <input
                type="text"
                placeholder="Search lectures, topics, quotes, and books..."
                value={query}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-[#E6E1D6] rounded-xl focus:outline-none focus:border-[#8C6D1F] text-[#1E1C18] text-sm"
              />
            </div>

            <div className="flex items-center space-x-3">
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className="px-4 py-3 bg-white border border-[#E6E1D6] rounded-xl text-sm text-[#1E1C18] focus:outline-none focus:border-[#8C6D1F]"
              >
                <option value="all">All Content Types</option>
                <option value="lectures">Lectures</option>
                <option value="topics">Topics</option>
                <option value="quotes">Quotes</option>
                <option value="books">Books</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Area */}
        {isSearching ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-[#8C6D1F]" />
          </div>
        ) : totalResults === 0 ? (
          <div className="text-center py-20 bg-[#F4F0E8] border border-[#E6E1D6] rounded-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#E8E3D8] text-[#736B5E] flex items-center justify-center mx-auto">
              <AlertCircle size={24} />
            </div>
            <h3 className="text-xl font-editorial text-[#1E1C18]">No results found for "{query}"</h3>
            <p className="text-xs text-[#736B5E] max-w-md mx-auto">
              Try searching for broader philosophical concepts such as "ego", "zen", "time", or "anxiety".
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            <div className="text-xs text-[#736B5E] font-medium">
              Found {totalResults} matching archive records.
            </div>

            {/* Lectures */}
            {(contentType === 'all' || contentType === 'lectures') && matchingLectures.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-editorial text-[#1E1C18]">Lectures ({matchingLectures.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {matchingLectures.map((lecture) => (
                    <LectureCard
                      key={lecture.id}
                      lecture={lecture}
                      onClick={() => onNavigate({ type: 'lecture-detail', id: lecture.id })}
                      onPlayClick={() => onPlayLecture(lecture)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Topics */}
            {(contentType === 'all' || contentType === 'topics') && matchingTopics.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-editorial text-[#1E1C18]">Topics ({matchingTopics.length})</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {matchingTopics.map((topic) => (
                    <TopicCard
                      key={topic.id}
                      topic={topic}
                      onClick={() => onNavigate({ type: 'topic-detail', slug: topic.slug })}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quotes */}
            {(contentType === 'all' || contentType === 'quotes') && matchingQuotes.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-editorial text-[#1E1C18]">Quotations ({matchingQuotes.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {matchingQuotes.map((quote) => (
                    <QuoteCard
                      key={quote.id}
                      quote={quote}
                      onClick={() => onNavigate({ type: 'quote-detail', id: quote.id })}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Books */}
            {(contentType === 'all' || contentType === 'books') && matchingBooks.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-editorial text-[#1E1C18]">Books ({matchingBooks.length})</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {matchingBooks.map((book) => (
                    <BookCard
                      key={book.id}
                      book={book}
                      onClick={() => onNavigate({ type: 'book-detail', id: book.id })}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
