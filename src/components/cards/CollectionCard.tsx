import React from 'react';
import { Collection } from '../../types';
import { VerificationBadge } from '../common/VerificationBadge';
import { Headphones, Layers, ArrowRight } from 'lucide-react';

interface CollectionCardProps {
  collection: Collection;
  onClick: () => void;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({ collection, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="group bg-[#F4F0E8] border border-[#E6E1D6] rounded-xl overflow-hidden hover:border-[#D4CEBF] transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-xs hover:shadow-md"
    >
      <div className="relative h-48 overflow-hidden bg-[#E2DCD0]">
        <img 
          src={collection.coverImage} 
          alt={collection.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E1C18]/60 via-transparent to-transparent" />
        <div className="absolute top-3 right-3">
          <VerificationBadge status={collection.verificationStatus} size="sm" />
        </div>
        <div className="absolute bottom-3 left-4 right-4 text-white">
          <span className="text-xs font-semibold tracking-wider uppercase text-[#F3EFE6]/80">
            Series • {collection.yearRecorded}
          </span>
          <h3 className="text-xl font-editorial font-medium text-white">
            {collection.title}
          </h3>
        </div>
      </div>

      <div className="p-6 flex flex-col justify-between flex-grow">
        <div>
          <p className="text-xs font-medium text-[#8C6D1F] mb-1">
            {collection.subtitle}
          </p>
          <p className="text-xs sm:text-sm text-[#6E6454] line-clamp-2 leading-relaxed mb-4">
            {collection.description}
          </p>
        </div>

        <div className="pt-4 border-t border-[#E6E1D6] flex items-center justify-between text-xs text-[#736B5E]">
          <div className="flex items-center space-x-3">
            <span className="flex items-center">
              <Headphones size={13} className="mr-1 text-[#8C6D1F]" />
              {collection.lectureCount} Lectures
            </span>
            <span className="flex items-center">
              <Layers size={13} className="mr-1 text-[#8C6D1F]" />
              {collection.totalDuration}
            </span>
          </div>
          <ArrowRight size={15} className="text-[#8C6D1F] transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
};
