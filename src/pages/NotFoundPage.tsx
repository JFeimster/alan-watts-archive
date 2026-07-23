import React from 'react';
import { ViewState } from '../types';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Compass, ArrowRight } from 'lucide-react';

interface NotFoundPageProps {
  onNavigate: (view: ViewState) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-12 pb-16">
      <Breadcrumbs items={[{ label: '404 Page Not Found' }]} onNavigate={onNavigate} />

      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#E8E3D8] text-[#8C6D1F] flex items-center justify-center mx-auto">
          <Compass size={32} />
        </div>
        <h1 className="text-4xl font-editorial font-normal text-[#1E1C18]">
          Page Not Found in Archive
        </h1>
        <p className="text-sm text-[#6E6454] leading-relaxed">
          The requested archival record or page could not be located. It may have been moved or indexed under a different philosophical topic.
        </p>
        <div className="pt-4">
          <button
            onClick={() => onNavigate({ type: 'home' })}
            className="inline-flex items-center space-x-2 bg-[#2C3E35] text-white hover:bg-[#1E2B37] px-8 py-3.5 rounded-xl font-medium text-sm transition-colors shadow"
          >
            <span>Return to Archive Home</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
