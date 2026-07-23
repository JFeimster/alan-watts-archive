import React from 'react';
import { ViewState } from '../types';
import { VIDEOS } from '../data/mockData';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { VideoCard } from '../components/cards/VideoCard';

interface VideosDirectoryPageProps {
  onNavigate: (view: ViewState) => void;
}

export const VideosDirectoryPage: React.FC<VideosDirectoryPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-12 pb-16">
      <Breadcrumbs items={[{ label: 'Videos & Film Archives' }]} onNavigate={onNavigate} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 pb-6 border-b border-[#E6E1D6]">
          <h1 className="text-3xl sm:text-5xl font-editorial font-normal text-[#1E1C18] mb-3">
            Videos & Film Archives
          </h1>
          <p className="text-sm sm:text-base text-[#6E6454] max-w-2xl leading-relaxed">
            Historical television interviews, documentary footage, and archival film recordings from PBS, BBC, and KQED.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {VIDEOS.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onClick={() => onNavigate({ type: 'video-detail', id: video.id })}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
