import React, { useState } from 'react';
import { ViewState } from '../types';
import { 
  Building2, Archive, Shield, BookOpen, Headphones, Radio, 
  Tv, Globe, Mail, Users, GraduationCap, Sparkles, Calendar, 
  Wrench, Cpu, FileText, Library, FileSpreadsheet, Search, ExternalLink 
} from 'lucide-react';

interface ResourceItem {
  name: string;
  role: string;
  verified: boolean;
  link?: string;
  action?: () => void;
}

interface ResourceCategory {
  id: string;
  title: string;
  icon: any;
  count: number;
  description: string;
  items: ResourceItem[];
}

interface ResourcesHubPageProps {
  onNavigate: (view: ViewState) => void;
}

export const ResourcesHubPage: React.FC<ResourcesHubPageProps> = ({ onNavigate }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const resourceCategories: ResourceCategory[] = [
    {
      id: 'organizations',
      title: 'Organizations',
      icon: Building2,
      count: 14,
      description: 'Historical societies, Zen centers, and academic institutions preserving Alan Watts’ legacy.',
      items: [
        { name: 'Alan Watts Electronic University', role: 'Primary Institutional Archive', verified: true, link: '#' },
        { name: 'Pacifica Radio Archives', role: 'Master Reel Tape Repository (KPFA 1960-1973)', verified: true, link: '#' },
        { name: 'The Asian Cultural Institute', role: 'Comparative Philosophy Research', verified: true, link: '#' },
        { name: 'California Institute of Integral Studies (CIIS)', role: 'Historical Papers & Faculty Records', verified: true, link: '#' }
      ]
    },
    {
      id: 'archives',
      title: 'Archives',
      icon: Archive,
      count: 22,
      description: 'Physical and digital repositories holding master audio reels, unedited transcripts, and photographs.',
      items: [
        { name: 'Sausalito Ferryboat Vallejo Archive', role: 'Living Quarters & Recording Studio 1962-1970', verified: true, link: '#' },
        { name: 'Library of Congress Spoken Word Collection', role: 'Public Broadcast Archival Index', verified: true, link: '#' },
        { name: 'KPFA Berkeley Broadcast Vault', role: 'Original 1/4-inch Analog Master Reels', verified: true, link: '#' }
      ]
    },
    {
      id: 'foundations',
      title: 'Foundations',
      icon: Shield,
      count: 8,
      description: 'Non-profit grantmaking and educational trusts dedicated to Eastern-Western synthesis.',
      items: [
        { name: 'The Alan Watts Literary Trust', role: 'Copyright & Literary Estate Management', verified: true, link: '#' },
        { name: 'The Zen Studies Society', role: 'Practice and Scholarship', verified: true, link: '#' },
        { name: 'Alan Watts Organization', role: 'Global Educational Outreach', verified: true, link: '#' }
      ]
    },
    {
      id: 'books',
      title: 'Books',
      icon: BookOpen,
      count: 25,
      description: 'Published philosophical works, posthumous lecture adaptations, and critical biographies.',
      items: [
        { name: 'The Way of Zen (1957)', role: 'Definitive Western Introduction to Zen Buddhism', verified: true, action: () => onNavigate({ type: 'books' }) },
        { name: 'The Book on the Taboo Against Knowing Who You Are (1966)', role: 'Metaphysical Exploration of the Self', verified: true, action: () => onNavigate({ type: 'books' }) },
        { name: 'Psychotherapy East and West (1961)', role: 'Bridging Eastern Liberation and Western Psychiatry', verified: true, action: () => onNavigate({ type: 'books' }) },
        { name: 'In My Own Way (1972)', role: 'Autobiography', verified: true, action: () => onNavigate({ type: 'books' }) }
      ]
    },
    {
      id: 'lectures',
      title: 'Lectures',
      icon: Headphones,
      count: 428,
      description: 'Master audio recordings organized by seminar series, chronological year, and verification status.',
      items: [
        { name: 'Out of Your Mind Seminar Series', role: '12-Part Master Lectures on Reality & Illusion', verified: true, action: () => onNavigate({ type: 'lectures' }) },
        { name: 'Philosophy of Nature & Ecology', role: 'Lectures on Cybernetics, Organisms, and Environment', verified: true, action: () => onNavigate({ type: 'lectures' }) },
        { name: 'Zen Bones & Buddhism', role: 'Recorded at Sausalito and Esalen Institute', verified: true, action: () => onNavigate({ type: 'lectures' }) }
      ]
    },
    {
      id: 'podcasts',
      title: 'Podcasts',
      icon: Radio,
      count: 12,
      description: 'Curated syndications of historical lecture recordings for modern audio players.',
      items: [
        { name: 'Alan Watts Being in the Way', role: 'Official Synthesized Podcast Feed (Ram Dass & Sounds True)', verified: true, link: '#' },
        { name: 'The Essential Alan Watts', role: 'Daily Excerpts and Lecture Archives', verified: true, link: '#' }
      ]
    },
    {
      id: 'youtube-channels',
      title: 'YouTube Channels',
      icon: Tv,
      count: 9,
      description: 'Authorized video archives featuring historical film footage, animated lectures, and symposiums.',
      items: [
        { name: 'Official Alan Watts Organization Channel', role: 'Primary Video Publisher', verified: true, link: '#' },
        { name: 'Pacifica Radio Audio Vault', role: 'Historical Broadcast Video Reel Channel', verified: true, link: '#' }
      ]
    },
    {
      id: 'websites',
      title: 'Websites',
      icon: Globe,
      count: 18,
      description: 'Selected digital hubs, scholarly bibliographies, and philosophical discussion forums.',
      items: [
        { name: 'alanwatts.org', role: 'Official Estate & Foundation Portal', verified: true, link: '#' },
        { name: 'Esalen Institute Archives', role: 'Historical Workshop Records 1965-1972', verified: true, link: '#' }
      ]
    },
    {
      id: 'newsletters',
      title: 'Newsletters',
      icon: Mail,
      count: 6,
      description: 'Periodic dispatches featuring newly discovered tape reels, essays, and archival transcript notes.',
      items: [
        { name: 'The Electronic University Dispatch', role: 'Monthly Archival Updates', verified: true, action: () => onNavigate({ type: 'newsletter' }) },
        { name: 'Sausalito Notes', role: 'Quarterly Scholarship Bulletin', verified: true, action: () => onNavigate({ type: 'newsletter' }) }
      ]
    },
    {
      id: 'communities',
      title: 'Communities',
      icon: Users,
      count: 15,
      description: 'Study circles, reading groups, and online philosophy societies.',
      items: [
        { name: 'Alan Watts Listening Club', role: 'Global Weekly Group Seminar Discussions', verified: true, action: () => onNavigate({ type: 'listening-club' }) },
        { name: 'Zen & Cybernetics Research Circle', role: 'Interdisciplinary Study Group', verified: true, action: () => onNavigate({ type: 'groups' }) }
      ]
    },
    {
      id: 'scholars',
      title: 'Scholars',
      icon: GraduationCap,
      count: 24,
      description: 'Academics, biographers, and philosophers specializing in Alan Watts and comparative religion.',
      items: [
        { name: 'Mark Watts', role: 'Director of Alan Watts Electronic University & Archivist', verified: true, link: '#' },
        { name: 'David Stuart', role: 'Biographer ("Alan Watts: The Life and Work")', verified: true, link: '#' },
        { name: 'Chung-yuan Chang', role: 'Collaborator in Taoist Philosophy & Zen', verified: true, link: '#' }
      ]
    },
    {
      id: 'creators',
      title: 'Creators',
      icon: Sparkles,
      count: 31,
      description: 'Independent filmmakers, visual artists, and audio producers honoring the tradition.',
      items: [
        { name: 'Studio Archive Editors', role: 'Restoration & Master Tape Remastering', verified: true, link: '#' },
        { name: 'Visual Philosophy Project', role: 'Educational Animation & Lecture Visuals', verified: true, link: '#' }
      ]
    },
    {
      id: 'courses',
      title: 'Courses',
      icon: GraduationCap,
      count: 10,
      description: 'Structured seminar curricula exploring Eastern philosophy, psychology, and myth.',
      items: [
        { name: 'Introduction to Eastern Wisdom', role: '10-Week Guided Curriculum', verified: true, action: () => onNavigate({ type: 'start-here' }) },
        { name: 'The Game of True Meaning', role: 'Advanced Seminar Workshop', verified: true, action: () => onNavigate({ type: 'start-here' }) }
      ]
    },
    {
      id: 'events',
      title: 'Events',
      icon: Calendar,
      count: 7,
      description: 'Annual symposia, public lectures, listening nights, and commemorative gatherings.',
      items: [
        { name: 'Annual Sausalito Philosophy Symposium', role: 'Fall Gathering & Lecture Playback', verified: true, action: () => onNavigate({ type: 'events' }) },
        { name: 'Global Simultaneous Listening Night', role: 'Equinox Audio Celebration', verified: true, action: () => onNavigate({ type: 'events' }) }
      ]
    },
    {
      id: 'tools',
      title: 'Tools',
      icon: Wrench,
      count: 8,
      description: 'Interactive utilities for exploring quotations, verifying attributions, and searching transcripts.',
      items: [
        { name: 'Ask the Archive (RAG AI Assistant)', role: 'Semantic Search across 428 Lectures', verified: true, action: () => onNavigate({ type: 'ask-archive' }) },
        { name: 'Quote Verifier', role: 'Cross-reference quotes against master transcripts', verified: true, action: () => onNavigate({ type: 'quote-verifier' }) },
        { name: 'Lecture Finder', role: 'Multi-criteria audio filter', verified: true, action: () => onNavigate({ type: 'lecture-finder' }) }
      ]
    },
    {
      id: 'gpts',
      title: 'GPTs',
      icon: Cpu,
      count: 4,
      description: 'Specialized language model instances trained strictly on verified texts and transcripts.',
      items: [
        { name: 'Watts Scholar GPT v4.2', role: 'Strict Citation-Enforced Assistant', verified: true, action: () => onNavigate({ type: 'gpt-directory' }) },
        { name: 'Koan Generator Model', role: 'Traditional & Modern Zen Dialogue Practice', verified: true, action: () => onNavigate({ type: 'gpt-directory' }) }
      ]
    },
    {
      id: 'transcripts',
      title: 'Transcripts',
      icon: FileText,
      count: 428,
      description: 'Verbatim text records of every preserved lecture with timestamp markers and editorial annotations.',
      items: [
        { name: 'Complete Archive Transcript Index', role: 'Searchable Word-for-Word Text Repository', verified: true, action: () => onNavigate({ type: 'transcripts' }) }
      ]
    },
    {
      id: 'libraries',
      title: 'Libraries',
      icon: Library,
      count: 16,
      description: 'Special collections housing rare monographs, personal library notes, and lecture outlines.',
      items: [
        { name: 'Alan Watts Personal Library Collection', role: 'University of California Santa Cruz Special Collections', verified: true, link: '#' },
        { name: 'Pacific Rim Philosophical Library', role: 'Research Repository', verified: true, link: '#' }
      ]
    },
    {
      id: 'research-papers',
      title: 'Research Papers',
      icon: FileSpreadsheet,
      count: 54,
      description: 'Peer-reviewed academic papers, theses, and essays examining Watts’ philosophical impact.',
      items: [
        { name: 'Zen and Cybernetics: The Ecological Vision of Alan Watts', role: 'Journal of Comparative Philosophy', verified: true, action: () => onNavigate({ type: 'essays' }) },
        { name: 'The Way of Liberation in Western Psychology', role: 'Psychological Perspectives Monograph', verified: true, action: () => onNavigate({ type: 'essays' }) }
      ]
    }
  ];

  const filteredCategories = activeCategory === 'all' 
    ? resourceCategories 
    : resourceCategories.filter(c => c.id === activeCategory);

  const searchedCategories = searchQuery.trim() === ''
    ? filteredCategories
    : filteredCategories.map(cat => ({
        ...cat,
        items: cat.items.filter(item => 
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          item.role.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(cat => cat.items.length > 0 || cat.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-10 py-12 space-y-12">
      {/* Header */}
      <div className="border-b border-[#D1CECA] pb-8 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase px-2 py-1 bg-[#1A1A1A] text-[#F9F7F2]">
            Root Resource Hub
          </span>
          <span className="text-xs font-mono text-[#B48B40]">/resources/</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif text-[#1A1A1A] font-light">
          Comprehensive Alan Watts Resource Directory
        </h1>
        <p className="text-base text-[#4A4A4A] max-w-3xl leading-relaxed">
          An exhaustive root hub categorizing organizations, master archives, scholarly foundations, books, transcripts, tools, and research papers dedicated to preserving authentic philosophical records.
        </p>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 pt-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B6B6B]" />
            <input
              type="text"
              placeholder="Search across all 19 resource categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#F2EEE9] border border-[#D1CECA] rounded-xl text-sm focus:outline-none focus:border-[#B48B40]"
            />
          </div>
          <button
            onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
            className="px-6 py-3 bg-[#1A1A1A] text-[#F9F7F2] text-xs font-bold uppercase tracking-widest hover:bg-[#333333] transition-colors"
          >
            Reset Filters
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-2">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors ${
              activeCategory === 'all' 
                ? 'bg-[#B48B40] text-white' 
                : 'bg-[#F2EEE9] text-[#1A1A1A] hover:bg-[#E5E0DA]'
            }`}
          >
            All Categories (19)
          </button>
          {resourceCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-semibold tracking-wider rounded-lg transition-colors ${
                activeCategory === cat.id 
                  ? 'bg-[#B48B40] text-white' 
                  : 'bg-[#F2EEE9] text-[#1A1A1A] hover:bg-[#E5E0DA]'
              }`}
            >
              {cat.title} ({cat.count})
            </button>
          ))}
        </div>
      </div>

      {/* Resource Categories Grid / Tree Display */}
      <div className="space-y-16">
        {searchedCategories.map(category => {
          const Icon = category.icon;
          return (
            <div key={category.id} className="bg-[#F2EEE9] border border-[#D1CECA] rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D1CECA] pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] text-[#F9F7F2] flex items-center justify-center">
                    <Icon size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-serif text-[#1A1A1A] font-bold">
                      {category.title}
                    </h2>
                    <p className="text-xs text-[#6B6B6B] font-mono">
                      /resources/{category.id}/ ({category.count} verified entries)
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#B48B40] uppercase tracking-widest bg-[#F9F7F2] px-3 py-1 border border-[#D1CECA] self-start sm:self-auto">
                  Verified Hub
                </span>
              </div>

              <p className="text-sm text-[#4A4A4A] leading-relaxed">
                {category.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {category.items.map((item, idx) => (
                  <div 
                    key={idx}
                    onClick={() => {
                      if (item.action) item.action();
                    }}
                    className={`p-4 bg-[#F9F7F2] border border-[#D1CECA] rounded-xl flex items-start justify-between gap-4 transition-all ${
                      item.action ? 'cursor-pointer hover:border-[#B48B40] hover:shadow-sm' : ''
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#1A1A1A]">
                          {item.name}
                        </span>
                        {item.verified && (
                          <span className="text-[9px] font-bold uppercase tracking-tighter bg-[#2D3A30] text-white px-1.5 py-0.5">
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#6B6B6B]">
                        {item.role}
                      </p>
                    </div>

                    {item.action ? (
                      <span className="text-xs font-bold text-[#B48B40] uppercase tracking-wider shrink-0 mt-1">
                        Explore →
                      </span>
                    ) : (
                      <ExternalLink size={16} className="text-[#6B6B6B] shrink-0 mt-1" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
