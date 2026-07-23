import React from 'react';
import { VideoItem } from '../../types';
import { VerificationBadge } from '../common/VerificationBadge';
import { Play, Video as VideoIcon, Clock } from 'lucide-react';

interface VideoCardProps {
  video: VideoItem;
  onClick: () => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="group bg-[#F4F0E8] border border-[#E6E1D6] rounded-xl overflow-hidden hover:border-[#D4CEBF] transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-xs hover:shadow-md"
    >
      <div className="relative h-48 overflow-hidden bg-[#E2DCD0]">
        <img 
          src={video.thumbnailUrl} 
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E1C18]/60 via-transparent to-transparent" />
        <div className="absolute top-3 right-3">
          <VerificationBadge status={video.verificationStatus} size="sm" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-[#1E1C18]/80 text-white flex items-center justify-center group-hover:bg-[#8C6D1F] transition-colors shadow-lg">
            <Play size={20} className="ml-0.5" />
          </div>
        </div>
        <div className="absolute bottom-3 left-4 right-4 text-white flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wider uppercase text-[#F3EFE6]/80">
            {video.archiveSource}
          </span>
          <span className="text-xs bg-black/60 px-2 py-0.5 rounded flex items-center">
            <Clock size={12} className="mr-1" /> {video.duration}
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col justify-between flex-grow">
        <div>
          <h3 className="text-lg font-editorial font-medium text-[#1E1C18] group-hover:text-[#8C6D1F] transition-colors mb-2">
            {video.title}
          </h3>
          <p className="text-xs sm:text-sm text-[#6E6454] line-clamp-2 leading-relaxed">
            {video.description}
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-[#E6E1D6] flex items-center justify-between text-xs text-[#736B5E]">
          <span>Recorded {video.date}</span>
          <span className="text-[#8C6D1F] font-medium group-hover:underline">Watch archive</span>
        </div>
      </div>
    </div>
  );
};
