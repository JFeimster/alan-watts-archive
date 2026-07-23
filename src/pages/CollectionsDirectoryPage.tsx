import React from 'react';
import { ViewState } from '../types';
import { COLLECTIONS } from '../data/mockData';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { CollectionCard } from '../components/cards/CollectionCard';

interface CollectionsDirectoryPageProps {
  onNavigate: (view: ViewState) => void;
}

export const CollectionsDirectoryPage: React.FC<CollectionsDirectoryPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-12 pb-16">
      <Breadcrumbs items={[{ label: 'Seminar Series Collections' }]} onNavigate={onNavigate} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 pb-6 border-b border-[#E6E1D6]">
          <h1 className="text-3xl sm:text-5xl font-editorial font-normal text-[#1E1C18] mb-3">
            Seminar Series Collections
          </h1>
          <p className="text-sm sm:text-base text-[#6E6454] max-w-2xl leading-relaxed">
            Curated multi-part audio courses recorded live by Alan Watts across academic institutions and institutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COLLECTIONS.map((col) => (
            <CollectionCard
              key={col.id}
              collection={col}
              onClick={() => onNavigate({ type: 'collection-detail', id: col.id })}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
