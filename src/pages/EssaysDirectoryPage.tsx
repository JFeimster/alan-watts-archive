import React from 'react';
import { ViewState } from '../types';
import { ESSAYS } from '../data/mockData';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { EssayCard } from '../components/cards/EssayCard';

interface EssaysDirectoryPageProps {
  onNavigate: (view: ViewState) => void;
}

export const EssaysDirectoryPage: React.FC<EssaysDirectoryPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-12 pb-16">
      <Breadcrumbs items={[{ label: 'Archival Essays' }]} onNavigate={onNavigate} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 pb-6 border-b border-[#E6E1D6]">
          <h1 className="text-3xl sm:text-5xl font-editorial font-normal text-[#1E1C18] mb-3">
            Archival Essays & Articles
          </h1>
          <p className="text-sm sm:text-base text-[#6E6454] max-w-2xl leading-relaxed">
            Written papers and essays authored by Alan Watts on philosophy, Zen, and ecological consciousness.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ESSAYS.map((essay) => (
            <EssayCard
              key={essay.id}
              essay={essay}
              onClick={() => onNavigate({ type: 'essay-detail', id: essay.id })}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
