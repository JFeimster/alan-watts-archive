import React from 'react';
import { ViewState } from '../types';
import { VIDEOS } from '../data/mockData';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { VerificationBadge } from '../components/common/VerificationBadge';
import { Play, Calendar, ShieldCheck, Film } from 'lucide-react';

interface VideoDetailPageProps {
  id: string;
  onNavigate: (view: ViewState) => void;
}

export const VideoDetailPage: React.FC<VideoDetailPageProps> = ({ id, onNavigate }) => {
  const video = VIDEOS.find((v) => v.id === id) || VIDEOS[0];

  return (
    <div className="space-y-12 pb-16">
      <Breadcrumbs 
        items={[
          { label: 'Videos', view: { type: 'videos' } },
          { label: video.title }
        ]} 
        onNavigate={onNavigate} 
      />

      <section className="bg-[#F4F0E8] border-b border-[#E6E1D6] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8C6D1F]">
              {video.archiveSource} • {video.date}
            </span>
            <VerificationBadge status={video.verificationStatus} size="md" />
          </div>

          <h1 className="text-3xl sm:text-5xl font-editorial font-normal text-[#1E1C18]">
            {video.title}
          </h1>

          {/* Video Player or Interactive YouTube Embed */}
          {video.youtubeId ? (
            <div className="relative rounded-2xl overflow-hidden aspect-video bg-black shadow-2xl border border-[#E6E1D6]">
              <iframe
                src={`https://www.youtube.com/embed/${video.youtubeId}?rel=0&modestbranding=1`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-none"
              />
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden aspect-video bg-[#1E1C18] flex items-center justify-center shadow-2xl group cursor-pointer">
              <img 
                src={video.thumbnailUrl} 
                alt={video.title}
                className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/30" />
              <div className="relative z-10 w-20 h-20 rounded-full bg-[#C9A227] text-[#1E1C18] flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                <Play size={32} className="ml-1 fill-current" />
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-white flex items-center justify-between z-10 text-xs font-medium">
                <span>Duration: {video.duration}</span>
                <span>Archival Master Stream</span>
              </div>
            </div>
          )}

          <p className="text-sm sm:text-base text-[#6E6454] leading-relaxed pt-4">
            {video.description}
          </p>
        </div>
      </section>
    </div>
  );
};
