import React, { useState, useRef, useEffect } from 'react';
import { ViewState } from '../../types';
import { ChevronDown, Search, Menu, Palette, Compass, BookOpen, Radio, Users, Wrench, Info } from 'lucide-react';

interface SiteHeaderProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  onOpenMobileNav: () => void;
  theme: 'editorial' | 'neobrutalist';
  onToggleTheme: () => void;
}

export const SiteHeader: React.FC<SiteHeaderProps> = ({ currentView, onNavigate, onOpenMobileNav, theme, onToggleTheme }) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navMenus = [
    {
      id: 'explore',
      label: 'Explore',
      icon: Compass,
      items: [
        { label: 'Start Here', view: { type: 'start-here' as const }, desc: 'Core philosophical introduction' },
        { label: 'Topics Directory', view: { type: 'topics' as const }, desc: 'Core concepts across traditions' },
        { label: 'Listening Paths', view: { type: 'listening-paths' as const }, desc: 'Curated audio journeys' },
        { label: 'Chronological Timeline', view: { type: 'timeline' as const }, desc: '1915–1973 biographical milestones' },
        { label: 'Comparisons', view: { type: 'comparisons' as const }, desc: 'Eastern and Western thought' },
        { label: 'Interactive Experiences', view: { type: 'interactive-experiences' as const }, desc: 'Koans & contemplative modules' },
      ]
    },
    {
      id: 'library',
      label: 'Library',
      icon: BookOpen,
      items: [
        { label: 'Master Lectures', view: { type: 'lectures' as const }, desc: 'Authentic 1960–1973 audio' },
        { label: 'Published Books', view: { type: 'books' as const }, desc: 'Definitive philosophical works' },
        { label: 'Verified Quotes', view: { type: 'quotes' as const }, desc: 'Attributed excerpts & context' },
        { label: 'Seminar Collections', view: { type: 'collections' as const }, desc: 'Multi-part audio courses' },
        { label: 'Verbatim Transcripts', view: { type: 'transcripts' as const }, desc: 'Searchable text repository' },
        { label: 'Resources Hub (/resources/)', view: { type: 'resources' as const }, desc: 'Root resource directory' },
      ]
    },
    {
      id: 'media',
      label: 'Media',
      icon: Radio,
      items: [
        { label: 'Archival Essays', view: { type: 'essays' as const }, desc: 'Papers and articles' },
        { label: 'Newsletter Dispatches', view: { type: 'newsletter' as const }, desc: 'Monthly tape discoveries' },
        { label: 'Podcasts', view: { type: 'podcasts' as const }, desc: 'Syndicated audio feeds' },
        { label: 'Video & Film Archives', view: { type: 'videos' as const }, desc: 'Historical recordings' },
        { label: 'Video Shorts', view: { type: 'shorts' as const }, desc: 'Bite-sized reflections' },
      ]
    },
    {
      id: 'community',
      label: 'Community',
      icon: Users,
      items: [
        { label: 'Discussions', view: { type: 'discussions' as const }, desc: 'Scholarly dialogue' },
        { label: 'Listening Club', view: { type: 'listening-club' as const }, desc: 'Weekly synchronized playback' },
        { label: 'Study Groups', view: { type: 'groups' as const }, desc: 'Reading circles' },
        { label: 'Symposia & Events', view: { type: 'events' as const }, desc: 'Equinox gatherings' },
        { label: 'Member Essays', view: { type: 'member-essays' as const }, desc: 'Scholarly contributions' },
      ]
    },
    {
      id: 'tools',
      label: 'Tools',
      icon: Wrench,
      items: [
        { label: 'Ask the Archive (AI RAG)', view: { type: 'ask-archive' as const }, desc: 'Query 428 lectures' },
        { label: 'Verified GPT Directory', view: { type: 'gpt-directory' as const }, desc: 'Specialized AI models' },
        { label: 'Prompt Library', view: { type: 'prompt-library' as const }, desc: 'Existential inquiry prompts' },
        { label: 'Quote Verifier', view: { type: 'quote-verifier' as const }, desc: 'Attribution checker' },
        { label: 'Advanced Lecture Finder', view: { type: 'lecture-finder' as const }, desc: 'Multi-criteria filter' },
        { label: 'Creator Studio & Licensing', view: { type: 'creator-studio' as const }, desc: 'Educational use & quotes' },
      ]
    },
    {
      id: 'about',
      label: 'About',
      icon: Info,
      items: [
        { label: 'About the Archive', view: { type: 'about' as const }, desc: 'Mission and background' },
        { label: 'Editorial Standards', view: { type: 'about' as const }, desc: 'Strict authenticity rules' },
        { label: 'Contact Board', view: { type: 'contact' as const }, desc: 'Reach out to editors' },
      ]
    }
  ];

  return (
    <header ref={headerRef} className="sticky top-0 z-40 bg-[#F9F7F2]/95 backdrop-blur-md border-b border-[#D1CECA]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 h-20 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => { setActiveDropdown(null); onNavigate({ type: 'home' }); }}
            className="text-left group cursor-pointer flex items-center gap-4"
          >
            <span className="text-xl sm:text-2xl font-serif font-bold tracking-tight uppercase border-b-2 border-[#B48B40] text-[#1A1A1A]">
              Alan Watts Wisdom
            </span>
            <span className="text-[10px] tracking-[0.2em] font-bold text-[#B48B40] uppercase px-2 py-0.5 border border-[#B48B40] hidden sm:inline-block">
              Authentic Archive
            </span>
          </button>
        </div>

        {/* Desktop Navigation with Dropdowns */}
        <nav className="hidden lg:flex items-center space-x-6 text-xs font-semibold tracking-widest uppercase">
          <button
            onClick={() => { setActiveDropdown(null); onNavigate({ type: 'home' }); }}
            className={`transition-colors py-2 ${currentView.type === 'home' ? 'text-[#B48B40]' : 'text-[#1A1A1A] hover:text-[#B48B40]'}`}
          >
            Home
          </button>

          {navMenus.map((menu) => {
            const isDropdownOpen = activeDropdown === menu.id;
            return (
              <div key={menu.id} className="relative">
                <button
                  onClick={() => setActiveDropdown(isDropdownOpen ? null : menu.id)}
                  className={`flex items-center space-x-1 py-2 transition-colors ${
                    isDropdownOpen ? 'text-[#B48B40]' : 'text-[#1A1A1A] hover:text-[#B48B40]'
                  }`}
                >
                  <span>{menu.label}</span>
                  <ChevronDown size={13} className={`transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-72 bg-[#F9F7F2] border border-[#D1CECA] rounded-xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2 border-b border-[#D1CECA] mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#B48B40]">
                        {menu.label} Section
                      </span>
                    </div>
                    {menu.items.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          onNavigate(item.view);
                          setActiveDropdown(null);
                        }}
                        className="w-full px-4 py-2.5 text-left flex flex-col hover:bg-[#F2EEE9] transition-colors group"
                      >
                        <span className="text-xs font-bold text-[#1A1A1A] group-hover:text-[#B48B40] transition-colors">
                          {item.label}
                        </span>
                        <span className="text-[10px] text-[#6B6B6B] font-normal normal-case tracking-normal">
                          {item.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          <div className="ml-2 pl-4 border-l border-[#D1CECA] flex items-center space-x-4">
            <button
              onClick={() => { setActiveDropdown(null); onNavigate({ type: 'search' }); }}
              className="flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase hover:text-[#B48B40] transition-colors"
            >
              <Search size={14} />
              <span>Search</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase rounded border transition-all ${
                theme === 'neobrutalist' 
                  ? 'bg-[#FFE500] text-black border-black shadow-[2px_2px_0px_0px_#000]' 
                  : 'bg-[#F2EEE9] text-[#1A1A1A] border-[#D1CECA] hover:border-[#B48B40]'
              }`}
              title="Toggle theme variation"
            >
              <Palette size={13} />
              <span>{theme === 'editorial' ? 'Editorial' : 'Neo-Brutalist'}</span>
            </button>
          </div>
        </nav>

        {/* Mobile buttons */}
        <div className="flex items-center space-x-2 lg:hidden">
          <button
            onClick={onToggleTheme}
            className={`p-2 rounded text-xs font-bold uppercase tracking-wider ${
              theme === 'neobrutalist' ? 'bg-[#FFE500] text-black border border-black' : 'text-[#1A1A1A] bg-[#F2EEE9]'
            }`}
            title="Toggle theme"
          >
            <Palette size={16} />
          </button>

          <button
            onClick={() => onNavigate({ type: 'search' })}
            className="p-2 text-[#1A1A1A] hover:text-[#B48B40] transition-colors"
            title="Search"
          >
            <Search size={18} />
          </button>

          <button
            onClick={onOpenMobileNav}
            className="p-2 text-[#1A1A1A] hover:text-[#B48B40] transition-colors"
            title="Menu"
          >
            <Menu size={22} />
          </button>
        </div>
      </div>
    </header>
  );
};
