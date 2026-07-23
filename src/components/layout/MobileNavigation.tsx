import React from 'react';
import { ViewState } from '../../types';
import { 
  X, Home, Compass, BookOpen, Headphones, Layers, 
  Quote, FileText, Video, Info, Search, Library, Radio, Users, Wrench 
} from 'lucide-react';

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: ViewState) => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({ isOpen, onClose, onNavigate }) => {
  if (!isOpen) return null;

  const navItems = [
    { label: 'Home', view: { type: 'home' as const }, icon: Home },
    { label: 'Start Here', view: { type: 'start-here' as const }, icon: Compass },
    { label: 'Topics Directory', view: { type: 'topics' as const }, icon: BookOpen },
    { label: 'Root Resources Hub (/resources/)', view: { type: 'resources' as const }, icon: Library },
    { label: 'Master Lectures', view: { type: 'lectures' as const }, icon: Headphones },
    { label: 'Listening Paths', view: { type: 'listening-paths' as const }, icon: Compass },
    { label: 'Chronological Timeline', view: { type: 'timeline' as const }, icon: Info },
    { label: 'Collections', view: { type: 'collections' as const }, icon: Layers },
    { label: 'Books', view: { type: 'books' as const }, icon: BookOpen },
    { label: 'Quotes', view: { type: 'quotes' as const }, icon: Quote },
    { label: 'Archival Essays', view: { type: 'essays' as const }, icon: FileText },
    { label: 'Podcasts & Media', view: { type: 'podcasts' as const }, icon: Radio },
    { label: 'Video & Film Archives', view: { type: 'videos' as const }, icon: Video },
    { label: 'Community & Discussions', view: { type: 'discussions' as const }, icon: Users },
    { label: 'Ask the Archive (AI RAG)', view: { type: 'ask-archive' as const }, icon: Wrench },
    { label: 'Search Archive', view: { type: 'search' as const }, icon: Search },
    { label: 'Editorial Standards & About', view: { type: 'about' as const }, icon: Info },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#1E1C18]/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-xs bg-[#F9F7F2] h-full shadow-2xl flex flex-col p-6 animate-in slide-in-from-right duration-200">
        <div className="flex items-center justify-between pb-6 border-b border-[#D1CECA]">
          <div>
            <h2 className="text-lg font-serif font-bold text-[#1A1A1A]">Alan Watts Wisdom</h2>
            <p className="text-xs text-[#6B6B6B]">Authentic Archive</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#1A1A1A] hover:text-[#B48B40] rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-grow overflow-y-auto py-6 space-y-2">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={() => {
                  onNavigate(item.view);
                  onClose();
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-[#1A1A1A] hover:text-[#B48B40] hover:bg-[#F2EEE9] transition-colors"
              >
                <Icon size={16} className="text-[#B48B40]" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="pt-6 border-t border-[#D1CECA] text-xs text-[#6B6B6B] text-center">
          <p>Preserving genuine historical lectures and philosophical writings.</p>
        </div>
      </div>
    </div>
  );
};
