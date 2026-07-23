import React from 'react';
import { ViewState, Lecture } from '../types';
import { TOPICS, LECTURES, QUOTES, BOOKS } from '../data/mockData';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { SectionHeading } from '../components/common/SectionHeading';
import { LectureCard } from '../components/cards/LectureCard';
import { QuoteCard } from '../components/cards/QuoteCard';
import { BookCard } from '../components/cards/BookCard';
import { BookOpen, Headphones, Quote as QuoteIcon } from 'lucide-react';

interface TopicDetailPageProps {
  slug: string;
  onNavigate: (view: ViewState) => void;
  onPlayLecture: (lecture: Lecture) => void;
}

export const TopicDetailPage: React.FC<TopicDetailPageProps> = ({ slug, onNavigate, onPlayLecture }) => {
  const topic = TOPICS.find((t) => t.slug === slug) || TOPICS[0];

  const relatedLectures = LECTURES.filter((l) => l.topics.includes(topic.slug));
  const relatedQuotes = QUOTES.filter((q) => q.topics.includes(topic.slug));
  const relatedBooks = BOOKS.slice(0, 2);

  return (
    <div className="space-y-12 pb-16">
      <Breadcrumbs 
        items={[
          { label: 'Topics', view: { type: 'topics' } },
          { label: topic.title }
        ]} 
        onNavigate={onNavigate} 
      />

      {/* Header */}
      <section className="bg-[#F4F0E8] border-b border-[#E6E1D6] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8C6D1F] bg-[#8C6D1F]/10 px-3 py-1 rounded-full">
              Philosophical Topic
            </span>
            <span className="text-xs text-[#736B5E]">
              {topic.lectureCount} Lectures • {topic.quoteCount} Quotes
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-editorial font-normal text-[#1E1C18]">
            {topic.title}
          </h1>

          <p className="text-base sm:text-lg text-[#6E6454] leading-relaxed">
            {topic.longDescription}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Associated Lectures */}
        <div>
          <SectionHeading 
            title="Associated Lectures & Seminars" 
            subtitle={`Genuine audio recordings discussing ${topic.title}.`} 
          />
          {relatedLectures.length === 0 ? (
            <p className="text-xs text-[#736B5E]">Lectures for this topic are currently indexed in our expansion queue.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedLectures.map((lecture) => (
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

        {/* Associated Quotations */}
        {relatedQuotes.length > 0 && (
          <div>
            <SectionHeading 
              title="Verified Quotations" 
              subtitle="Key excerpts and interpretations." 
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedQuotes.map((quote) => (
                <QuoteCard
                  key={quote.id}
                  quote={quote}
                  onClick={() => onNavigate({ type: 'quote-detail', id: quote.id })}
                />
              ))}
            </div>
          </div>
        )}

        {/* Recommended Books */}
        <div>
          <SectionHeading 
            title="Recommended Reading" 
            subtitle="Published works expanding on this subject." 
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {relatedBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onClick={() => onNavigate({ type: 'book-detail', id: book.id })}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
