import React from 'react';
import { ArrowRight } from 'lucide-react';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  subtitle,
  actionText,
  onAction,
  className = ''
}) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 border-b border-[#E6E1D6] pb-4 ${className}`}>
      <div>
        <h2 className="text-2xl sm:text-3xl font-editorial font-normal text-[#1E1C18] tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-[#6E6454] mt-1 font-normal">
            {subtitle}
          </p>
        )}
      </div>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center text-xs sm:text-sm font-medium text-[#8C6D1F] hover:text-[#5E4711] transition-colors group shrink-0"
        >
          <span>{actionText}</span>
          <ArrowRight size={15} className="ml-1.5 transition-transform group-hover:translate-x-1" />
        </button>
      )}
    </div>
  );
};
