import React from 'react';
import { ViewState } from '../types';
import { ESSAYS } from '../data/mockData';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { VerificationBadge } from '../components/common/VerificationBadge';
import { Calendar, Clock, User } from 'lucide-react';

interface EssayDetailPageProps {
  id: string;
  onNavigate: (view: ViewState) => void;
}

export const EssayDetailPage: React.FC<EssayDetailPageProps> = ({ id, onNavigate }) => {
  const essay = ESSAYS.find((e) => e.id === id) || ESSAYS[0];

  return (
    <div className="space-y-12 pb-16">
      <Breadcrumbs 
        items={[
          { label: 'Essays', view: { type: 'essays' } },
          { label: essay.title }
        ]} 
        onNavigate={onNavigate} 
      />

      <section className="bg-[#F4F0E8] border-b border-[#E6E1D6] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8C6D1F]">
              Archival Essay
            </span>
            <VerificationBadge status={essay.verificationStatus} size="md" />
          </div>

          <h1 className="text-3xl sm:text-5xl font-editorial font-normal text-[#1E1C18]">
            {essay.title}
          </h1>

          <div className="flex items-center space-x-6 text-xs text-[#736B5E] pt-2">
            <span className="flex items-center">
              <User size={14} className="mr-1.5 text-[#8C6D1F]" />
              {essay.author}
            </span>
            <span className="flex items-center">
              <Calendar size={14} className="mr-1.5 text-[#8C6D1F]" />
              {essay.date}
            </span>
            <span className="flex items-center">
              <Clock size={14} className="mr-1.5 text-[#8C6D1F]" />
              {essay.readTime}
            </span>
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="prose prose-stone max-w-none space-y-6 text-[#38332C] text-base sm:text-lg leading-relaxed font-editorial">
          {essay.content.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
  );
};
