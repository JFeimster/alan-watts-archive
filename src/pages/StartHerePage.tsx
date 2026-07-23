import React from 'react';
import { ViewState, Lecture } from '../types';
import { LECTURES, BOOKS, TOPICS } from '../data/mockData';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { SectionHeading } from '../components/common/SectionHeading';
import { LectureCard } from '../components/cards/LectureCard';
import { BookCard } from '../components/cards/BookCard';
import { Compass, BookOpen, Headphones, ArrowRight, ShieldCheck } from 'lucide-react';

interface StartHerePageProps {
  onNavigate: (view: ViewState) => void;
  onPlayLecture: (lecture: Lecture) => void;
}

export const StartHerePage: React.FC<StartHerePageProps> = ({ onNavigate, onPlayLecture }) => {
  return (
    <div className="space-y-12 pb-16">
      <Breadcrumbs items={[{ label: 'Start Here' }]} onNavigate={onNavigate} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#8C6D1F]">
          Newcomer’s Orientation
        </span>
        <h1 className="text-3xl sm:text-5xl font-editorial font-normal text-[#1E1C18]">
          Where to Begin with Alan Watts
        </h1>
        <p className="text-sm sm:text-base text-[#6E6454] leading-relaxed max-w-2xl mx-auto">
          If you are new to Alan Watts, exploring decades of recorded lectures and books can feel overwhelming. Here is a curated pathway into his core philosophical insights.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Step 1 */}
        <div className="bg-[#F4F0E8] border border-[#E6E1D6] rounded-2xl p-8 sm:p-12">
          <div className="flex items-center space-x-3 mb-4">
            <span className="w-8 h-8 rounded-full bg-[#8C6D1F] text-white flex items-center justify-center text-xs font-bold">
              1
            </span>
            <h2 className="text-2xl font-editorial font-normal text-[#1E1C18]">
              Understand the Illusion of the Separate Self
            </h2>
          </div>
          <p className="text-sm text-[#6E6454] leading-relaxed mb-8 max-w-3xl">
            Watts’ foundational thesis is that Western culture cultivates a dangerous optical illusion: that you are an isolated ego trapped inside a bag of skin. Once you recognize your continuity with the total universe, existential anxiety begins to dissolve.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LectureCard
              lecture={LECTURES[0]}
              onClick={() => onNavigate({ type: 'lecture-detail', id: LECTURES[0].id })}
              onPlayClick={() => onPlayLecture(LECTURES[0])}
            />
            <BookCard
              book={BOOKS[0]}
              onClick={() => onNavigate({ type: 'book-detail', id: BOOKS[0].id })}
            />
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-[#F4F0E8] border border-[#E6E1D6] rounded-2xl p-8 sm:p-12">
          <div className="flex items-center space-x-3 mb-4">
            <span className="w-8 h-8 rounded-full bg-[#8C6D1F] text-white flex items-center justify-center text-xs font-bold">
              2
            </span>
            <h2 className="text-2xl font-editorial font-normal text-[#1E1C18]">
              Master the Backwards Law of Life
            </h2>
          </div>
          <p className="text-sm text-[#6E6454] leading-relaxed mb-8 max-w-3xl">
            Why trying to force happiness, peace of mind, or security guarantees anxiety. Learn how letting go and trusting the spontaneous flow of life unlocks genuine psychological freedom.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LectureCard
              lecture={LECTURES[1]}
              onClick={() => onNavigate({ type: 'lecture-detail', id: LECTURES[1].id })}
              onPlayClick={() => onPlayLecture(LECTURES[1])}
            />
            <BookCard
              book={BOOKS[1]}
              onClick={() => onNavigate({ type: 'book-detail', id: BOOKS[1].id })}
            />
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-[#26352C] text-[#F3EFE6] rounded-2xl p-8 sm:p-12 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-editorial font-normal">
            Ready to Dive Deeper into Specific Topics?
          </h2>
          <p className="text-sm text-[#B5AD9C] max-w-xl mx-auto leading-relaxed">
            Browse our complete directory of philosophical topics ranging from Zen and Taoism to overthinking, time, and modern technology.
          </p>
          <div>
            <button
              onClick={() => onNavigate({ type: 'topics' })}
              className="inline-flex items-center space-x-2 bg-[#C9A227] text-[#1E1C18] hover:bg-[#E5BE3B] px-8 py-4 rounded-xl font-medium text-sm transition-colors shadow"
            >
              <span>Explore All Topics</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
