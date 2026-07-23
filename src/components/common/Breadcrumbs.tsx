import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { ViewState } from '../../types';

interface BreadcrumbItem {
  label: string;
  view?: ViewState;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate: (view: ViewState) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, onNavigate }) => {
  return (
    <nav aria-label="Breadcrumb" className="py-3 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <ol className="flex items-center space-x-2 text-xs sm:text-sm text-[#736B5E]">
        <li>
          <button 
            onClick={() => onNavigate({ type: 'home' })}
            className="flex items-center hover:text-[#1E1C18] transition-colors"
          >
            <Home size={14} className="mr-1" />
            <span>Archive</span>
          </button>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center space-x-2">
            <ChevronRight size={14} className="text-[#B5AD9C] shrink-0" />
            {item.view ? (
              <button
                onClick={() => onNavigate(item.view!)}
                className="hover:text-[#1E1C18] transition-colors truncate max-w-[200px] sm:max-w-xs"
              >
                {item.label}
              </button>
            ) : (
              <span className="text-[#1E1C18] font-medium truncate max-w-[200px] sm:max-w-xs">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
