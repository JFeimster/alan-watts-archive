import React from 'react';
import { ViewState, Lecture } from '../types';
import { TOPICS, LECTURES, COLLECTIONS, BOOKS, QUOTES, ESSAYS } from '../data/mockData';
import { TopicCard } from '../components/cards/TopicCard';
import { LectureCard } from '../components/cards/LectureCard';
import { CollectionCard } from '../components/cards/CollectionCard';
import { BookCard } from '../components/cards/BookCard';
import { QuoteCard } from '../components/cards/QuoteCard';
import { EssayCard } from '../components/cards/EssayCard';
import { SectionHeading } from '../components/common/SectionHeading';
import { Play, ArrowRight } from 'lucide-react';

interface HomePageProps {
  onNavigate: (view: ViewState) => void;
  onPlayLecture: (lecture: Lecture) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onPlayLecture }) => {
  const featuredLecture = LECTURES[0];

  return (
    <div className="flex flex-col min-h-screen bg-[#F9F7F2] text-[#1A1A1A]">
      {/* Editorial Main Hero & Aside Layout */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden border-b border-[#D1CECA]">
        {/* Left 60% Hero Section */}
        <section className="w-full lg:w-[60%] p-6 sm:p-12 lg:border-r border-[#D1CECA] flex flex-col justify-center gap-8 bg-[#F9F7F2]">
          <div className="space-y-4">
            <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#B48B40]">
              Foundations of Philosophy
            </p>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif leading-[0.95] text-[#1A1A1A] font-light">
              Explore the nature of reality through authentic archival lectures.
            </h1>
            <p className="max-w-md text-base sm:text-lg leading-relaxed text-[#4A4A4A] font-serif italic">
              “The only way to make sense out of change is to plunge into it, move with it, and join the dance.”
            </p>
          </div>

          <div className="flex flex-wrap gap-4 mt-2">
            <button
              onClick={() => onNavigate({ type: 'start-here' })}
              className="bg-[#1A1A1A] text-[#F9F7F2] hover:bg-[#333333] px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase transition-colors cursor-pointer"
            >
              Start With Alan Watts
            </button>
            <button
              onClick={() => onNavigate({ type: 'topics' })}
              className="border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#F2EEE9] px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase transition-colors cursor-pointer"
            >
              Explore Topics
            </button>
          </div>

          <div className="mt-8 pt-8 border-t border-[#D1CECA]">
            <div className="flex items-center gap-4 mb-3">
              <span className="px-2 py-1 bg-[#2D3A30] text-[#F9F7F2] text-[10px] font-bold tracking-tighter uppercase">
                Verified Source
              </span>
              <span className="text-xs font-mono text-[#6B6B6B]">
                {featuredLecture.series} — Recorded {featuredLecture.year}
              </span>
            </div>
            <h3 className="text-2xl font-serif text-[#1A1A1A] cursor-pointer hover:text-[#B48B40] transition-colors" onClick={() => onNavigate({ type: 'lecture-detail', id: featuredLecture.id })}>
              {featuredLecture.title}
            </h3>
            <p className="text-sm text-[#4A4A4A] mt-2 max-w-lg leading-relaxed">
              {featuredLecture.summary}
            </p>
            <div className="mt-4 flex items-center gap-4">
              <button
                onClick={() => onPlayLecture(featuredLecture)}
                className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-[#B48B40] hover:underline cursor-pointer"
              >
                <Play size={14} className="fill-current" />
                <span>Listen to Recording</span>
              </button>
              <button
                onClick={() => onNavigate({ type: 'lecture-detail', id: featuredLecture.id })}
                className="inline-flex items-center space-x-1 text-xs font-bold uppercase tracking-widest text-[#1A1A1A] hover:text-[#B48B40] cursor-pointer"
              >
                <span>Read Transcript</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </section>

        {/* Right 40% Aside Section */}
        <aside className="w-full lg:w-[40%] bg-[#F2EEE9] p-6 sm:p-10 flex flex-col justify-between gap-10">
          <div className="flex flex-col gap-8">
            <div>
              <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-[#1A1A1A] mb-6">
                Primary Topics
              </h2>
              <div className="grid grid-cols-1 gap-3">
                {TOPICS.slice(0, 4).map((topic, idx) => (
                  <div
                    key={topic.id}
                    onClick={() => onNavigate({ type: 'topic-detail', slug: topic.slug })}
                    className="group p-4 bg-[#F9F7F2] border border-[#D1CECA] flex justify-between items-center cursor-pointer hover:border-[#B48B40] transition-colors"
                  >
                    <span className="text-sm font-semibold text-[#1A1A1A] group-hover:text-[#B48B40] transition-colors">
                      {topic.title}
                    </span>
                    <span className="text-[10px] font-mono opacity-40">0{idx + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-[#1A1A1A] mb-4">
                Archive Stats
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="border-l-2 border-[#B48B40] pl-3 py-1">
                  <div className="text-2xl font-serif text-[#1A1A1A]">428</div>
                  <div className="text-[10px] uppercase tracking-widest text-[#6B6B6B]">Lectures</div>
                </div>
                <div className="border-l-2 border-[#B48B40] pl-3 py-1">
                  <div className="text-2xl font-serif text-[#1A1A1A]">1,250</div>
                  <div className="text-[10px] uppercase tracking-widest text-[#6B6B6B]">Verified Quotes</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-auto p-6 border border-[#B48B40] border-dashed text-center space-y-3 bg-[#F9F7F2]/50">
            <p className="text-xs italic leading-relaxed text-[#2D3A30]">
              “This is a genuine recording of Alan Watts from historical lectures—not an AI-generated voice or synthetic recreation.”
            </p>
            <div className="text-[10px] font-bold tracking-widest uppercase text-[#B48B40]">
              Authenticity Notice
            </div>
          </div>
        </aside>
      </main>

      {/* Extended Archive Sections */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-16 space-y-20 w-full">
        {/* Topic Explorer */}
        <section>
          <SectionHeading
            title="Philosophical Topics"
            subtitle="Explore core concepts across metaphysics, Eastern traditions, psychology, and modern life."
            actionText="View all topics"
            onAction={() => onNavigate({ type: 'topics' })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TOPICS.slice(0, 6).map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                onClick={() => onNavigate({ type: 'topic-detail', slug: topic.slug })}
              />
            ))}
          </div>
        </section>

        {/* Verified Quotations */}
        <section className="bg-[#F2EEE9] border border-[#D1CECA] p-8 sm:p-12 rounded-2xl">
          <SectionHeading
            title="Verified Quotations"
            subtitle="Carefully attributed excerpts with primary source context and textual interpretation."
            actionText="View all quotations"
            onAction={() => onNavigate({ type: 'quotes' })}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {QUOTES.slice(0, 3).map((quote) => (
              <QuoteCard
                key={quote.id}
                quote={quote}
                onClick={() => onNavigate({ type: 'quote-detail', id: quote.id })}
              />
            ))}
          </div>
        </section>

        {/* Seminar Series & Lectures */}
        <section>
          <SectionHeading
            title="Seminar Series & Lectures"
            subtitle="Immersive multi-part audio courses recorded between 1960 and 1973."
            actionText="Browse all lectures"
            onAction={() => onNavigate({ type: 'lectures' })}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {COLLECTIONS.map((col) => (
              <CollectionCard
                key={col.id}
                collection={col}
                onClick={() => onNavigate({ type: 'collection-detail', id: col.id })}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {LECTURES.slice(1, 3).map((lecture) => (
              <LectureCard
                key={lecture.id}
                lecture={lecture}
                onClick={() => onNavigate({ type: 'lecture-detail', id: lecture.id })}
                onPlayClick={() => onPlayLecture(lecture)}
              />
            ))}
          </div>
        </section>

        {/* Published Books & Essays */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <SectionHeading
              title="Published Books"
              subtitle="Seminal philosophical works authored by Alan Watts."
              actionText="View all books"
              onAction={() => onNavigate({ type: 'books' })}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {BOOKS.slice(0, 2).map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onClick={() => onNavigate({ type: 'book-detail', id: book.id })}
                />
              ))}
            </div>
          </div>

          <div>
            <SectionHeading
              title="Archival Essays"
              subtitle="Expository papers and articles on philosophy and ecology."
              actionText="View all essays"
              onAction={() => onNavigate({ type: 'essays' })}
            />
            <div className="space-y-6">
              {ESSAYS.map((essay) => (
                <EssayCard
                  key={essay.id}
                  essay={essay}
                  onClick={() => onNavigate({ type: 'essay-detail', id: essay.id })}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
