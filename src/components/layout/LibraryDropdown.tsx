import React, { useState, useRef, useEffect } from 'react';
import { ViewState } from '../../types';
import { ChevronDown, Headphones, Layers, BookOpen, Quote, Volume2, Image as ImageIcon } from 'lucide-react';

interface LibraryDropdownProps {
  onNavigate: (view: ViewState) => void;
}

export const LibraryDropdown: React.FC<LibraryDropdownProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const items = [
    { label: 'Lectures', view: { type: 'lectures' as const }, icon: Headphones, desc: 'Master audio recordings & transcripts' },
    { label: 'Collections', view: { type: 'collections' as const }, icon: Layers, desc: 'Curated seminar series' },
    { label: 'Books', view: { type: 'books' as const }, icon: BookOpen, desc: 'Published philosophical works' },
    { label: 'Quotes', view: { type: 'quotes' as const }, icon: Quote, desc: 'Verified archival quotations' },
    { label: 'Audio', view: { type: 'lectures' as const }, icon: Volume2, desc: 'Spoken word archives' },
    { label: 'Images', view: { type: 'videos' as const }, icon: ImageIcon, desc: 'Archival photographs & video' },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 text-sm font-medium text-[#4A433B] hover:text-[#1E1C18] transition-colors py-2"
      >
        <span>Library</span>
        <ChevronDown size={14} className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-[#F9F6F0] border border-[#E6E1D6] rounded-xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={() => {
                  onNavigate(item.view);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2.5 text-left flex items-start space-x-3 hover:bg-[#F4F0E8] transition-colors group"
              >
                <div className="mt-0.5 text-[#8C6D1F] group-hover:scale-110 transition-transform">
                  <Icon size={16} />
                </div>
                <div>
                  <span className="block text-sm font-medium text-[#1E1C18] group-hover:text-[#8C6D1F] transition-colors">
                    {item.label}
                  </span>
                  <span className="block text-xs text-[#736B5E]">
                    {item.desc}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
