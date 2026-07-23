import React from 'react';
import { ViewState, Lecture } from '../types';
import { COLLECTIONS, LECTURES } from '../data/mockData';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { VerificationBadge } from '../components/common/VerificationBadge';
import { LectureCard } from '../components/cards/LectureCard';
import { Headphones, Layers, Calendar } from 'lucide-react';

interface CollectionDetailPageProps {
  id: string;
  onNavigate: (view: ViewState) => void;
  onPlayLecture: (lecture: Lecture) => void;
}

export const CollectionDetailPage: React.FC<CollectionDetailPageProps> = ({ id, onNavigate, onPlayLecture }) => {
  const collection = COLLECTIONS.find((c) => c.id === id) || COLLECTIONS[0];
  const collectionLectures = LECTURES.slice(0, collection.lectureCount);

  return (
    <div className="space-y-12 pb-16">
      <Breadcrumbs 
        items={[
          { label: 'Collections', view: { type: 'collections' } },
          { label: collection.title }
        ]} 
        onNavigate={onNavigate} 
      />

      <section className="bg-[#F4F0E8] border-b border-[#E6E1D6] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8C6D1F]">
              Archival Seminar Series • Recorded {collection.yearRecorded}
            </span>
            <VerificationBadge status={collection.verificationStatus} size="md" />
          </div>

          <h1 className="text-3xl sm:text-5xl font-editorial font-normal text-[#1E1C18]">
            {collection.title}
          </h1>

          <p className="text-lg font-editorial text-[#8C6D1F]">
            {collection.subtitle}
          </p>

          <p className="text-sm sm:text-base text-[#6E6454] leading-relaxed">
            {collection.description}
          </p>

          <div className="flex items-center space-x-6 text-xs text-[#736B5E] pt-2">
            <span className="flex items-center">
              <Headphones size={15} className="mr-1.5 text-[#8C6D1F]" />
              {collection.lectureCount} Master Lectures
            </span>
            <span className="flex items-center">
              <Layers size={15} className="mr-1.5 text-[#8C6D1F]" />
              {collection.totalDuration} Total Duration
            </span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <h2 className="text-2xl font-editorial font-normal text-[#1E1C18]">
          Lectures in this Series
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {collectionLectures.map((lecture) => (
            <LectureCard
              key={lecture.id}
              lecture={lecture}
              onClick={() => onNavigate({ type: 'lecture-detail', id: lecture.id })}
              onPlayClick={() => onPlayLecture(lecture)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
