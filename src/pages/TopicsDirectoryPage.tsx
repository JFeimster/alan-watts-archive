import React, { useState } from 'react';
import { ViewState } from '../types';
import { TOPICS } from '../data/mockData';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { TopicCard } from '../components/cards/TopicCard';
import { Search } from 'lucide-react';

interface TopicsDirectoryPageProps {
  onNavigate: (view: ViewState) => void;
}

export const TopicsDirectoryPage: React.FC<TopicsDirectoryPageProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTopics = TOPICS.filter((topic) =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-12 pb-16">
      <Breadcrumbs items={[{ label: 'Topics Directory' }]} onNavigate={onNavigate} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-[#E6E1D6]">
          <div>
            <h1 className="text-3xl sm:text-5xl font-editorial font-normal text-[#1E1C18] mb-3">
              Philosophical Topics
            </h1>
            <p className="text-sm sm:text-base text-[#6E6454] max-w-2xl leading-relaxed">
              Explore cataloged lectures, books, and verified quotations categorized by core themes in Alan Watts’ philosophy.
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search size={16} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[#736B5E]" />
            <input
              type="text"
              placeholder="Search topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#F4F0E8] border border-[#E6E1D6] rounded-xl focus:outline-none focus:border-[#8C6D1F] text-[#1E1C18]"
            />
          </div>
        </div>

        {filteredTopics.length === 0 ? (
          <div className="text-center py-20 bg-[#F4F0E8] border border-[#E6E1D6] rounded-2xl">
            <h3 className="text-lg font-editorial text-[#1E1C18] mb-2">No topics found</h3>
            <p className="text-xs text-[#736B5E]">Try adjusting your search query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTopics.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                onClick={() => onNavigate({ type: 'topic-detail', slug: topic.slug })}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
