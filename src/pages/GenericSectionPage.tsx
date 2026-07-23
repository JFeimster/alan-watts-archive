import React from 'react';
import { ViewState } from '../types';
import { ShieldCheck, ArrowRight, Compass, Sparkles, BookOpen } from 'lucide-react';

interface GenericSectionPageProps {
  viewType: string;
  onNavigate: (view: ViewState) => void;
}

export const GenericSectionPage: React.FC<GenericSectionPageProps> = ({ viewType, onNavigate }) => {
  const getSectionDetails = () => {
    switch (viewType) {
      case 'listening-paths':
        return {
          title: 'Curated Listening Paths',
          subtitle: 'Guided audio journeys through Alan Watts’ philosophical evolution from Zen Buddhism to cybernetics.',
          badge: 'Explore Path',
          items: [
            { name: 'Path 1: The Foundations of Zen', desc: '4-lecture sequence on meditation, letting go, and uncalculated action.', action: () => onNavigate({ type: 'lectures' }) },
            { name: 'Path 2: Eastern Wisdom & Western Psychology', desc: 'Bridging psychotherapy with Taoist non-dualism.', action: () => onNavigate({ type: 'lectures' }) },
            { name: 'Path 3: The Universe as Play (Lila)', desc: 'Understanding reality as cosmic drama and divine game.', action: () => onNavigate({ type: 'lectures' }) }
          ]
        };
      case 'timeline':
        return {
          title: 'Chronological Timeline (1915–1973)',
          subtitle: 'Key milestones in Alan Watts’ life, major book publications, and historic Pacifica Radio broadcasts.',
          badge: 'Historical Chronology',
          items: [
            { name: '1915', desc: 'Born in Chislehurst, Kent, England on January 6.' },
            { name: '1936', desc: 'Published first book, "The Spirit of Zen", at age 21.' },
            { name: '1951', desc: 'Moved to California; joined American Academy of Asian Studies.' },
            { name: '1957', desc: 'Published "The Way of Zen", becoming a seminal bestseller.' },
            { name: '1960–1973', desc: 'Prolific KPFA broadcast era and Electronic University seminars.' }
          ]
        };
      case 'comparisons':
        return {
          title: 'Philosophical Comparisons',
          subtitle: 'Contrasting Alan Watts’ synthesis with Western philosophy, Taoism, Vedanta, and Zen masters.',
          badge: 'Comparative Study',
          items: [
            { name: 'Watts vs. Traditional Scholasticism', desc: 'Experiential realization versus dogma and intellectual abstraction.' },
            { name: 'Taoism & Cybernetics', desc: 'Feedback loops in organic systems compared with the Wu Wei (effortless action).' },
            { name: 'Zen and Western Existentialism', desc: 'Meeting the void without despair.' }
          ]
        };
      case 'interactive-experiences':
        return {
          title: 'Interactive Philosophical Experiences',
          subtitle: 'Engage directly with koans, paradoxes, and contemplative audio modules.',
          badge: 'Interactive Lab',
          items: [
            { name: 'The Koan Generator', desc: 'Contemplate traditional and modern paradoxes with guided prompts.', action: () => onNavigate({ type: 'gpt-directory' }) },
            { name: 'Ambient Soundscape Generator', desc: 'Listen to archival lecture snippets layered with natural rain and forest soundscapes.', action: () => onNavigate({ type: 'lectures' }) }
          ]
        };
      case 'transcripts':
        return {
          title: 'Verbatim Lecture Transcripts',
          subtitle: 'Searchable word-for-word text repository of all 428 cataloged recordings.',
          badge: 'Archive Index',
          items: [
            { name: 'Out of Your Mind (Full 12-Part Transcript)', desc: 'Complete unedited text of the legendary Pacifica Radio seminar.', action: () => onNavigate({ type: 'lectures' }) },
            { name: 'The Tao of Philosophy', desc: 'Transcript collection covering natural rhythm and effortless living.', action: () => onNavigate({ type: 'lectures' }) }
          ]
        };
      case 'newsletter':
        return {
          title: 'The Electronic University Dispatch',
          subtitle: 'Monthly dispatches on newly discovered master tape reels, essays, and scholarly notes.',
          badge: 'Publication',
          items: [
            { name: 'Issue #42: The Sausalito Reel Discovery', desc: 'Unveiling previously unreleased 1968 seminar recordings.' },
            { name: 'Issue #41: Ethics of the Non-Self', desc: 'Essay and commentary by the editorial board.' }
          ]
        };
      case 'podcasts':
        return {
          title: 'Syndicated Podcast Feeds',
          subtitle: 'Official podcast feeds preserving broadcast quality audio for all podcast apps.',
          badge: 'Audio Feed',
          items: [
            { name: 'Alan Watts Being in the Way', desc: 'Weekly restored lectures distributed via Sounds True & Ram Dass networks.' },
            { name: 'Archive Excerpts Daily', desc: 'Short 5-minute philosophical reflections.' }
          ]
        };
      case 'shorts':
        return {
          title: 'Archival Video Shorts',
          subtitle: 'Bite-sized visual snippets and animated philosophical reflections.',
          badge: 'Video Feed',
          items: [
            { name: 'What Do You Desire?', desc: 'Classic animated lecture excerpt on money, passion, and life purpose.' },
            { name: 'The Illusion of Time', desc: 'Reflections on living fully in the eternal now.' }
          ]
        };
      case 'discussions':
        return {
          title: 'Community Discussions',
          subtitle: 'Engage in thoughtful dialogue with scholars and practitioners worldwide.',
          badge: 'Community',
          items: [
            { name: 'Topic: Experiencing the Eternal Now in Daily Work', desc: '142 replies • Active discussion' },
            { name: 'Topic: Comparing Wu Wei and Modern Flow States', desc: '89 replies • Active discussion' }
          ]
        };
      case 'listening-club':
        return {
          title: 'Global Listening Club',
          subtitle: 'Weekly synchronized listening sessions of master seminar recordings.',
          badge: 'Live Event',
          items: [
            { name: 'This Thursday: Out of Your Mind Part 3', desc: 'Synchronized playback followed by community reflection.' }
          ]
        };
      case 'groups':
        return {
          title: 'Study Groups & Circles',
          subtitle: 'Local and virtual reading circles exploring Watts’ published books and transcripts.',
          badge: 'Network',
          items: [
            { name: 'Bay Area Zen & Cybernetics Circle', desc: 'Meeting bi-weekly in San Francisco and online.' },
            { name: 'London Alan Watts Reading Society', desc: 'Monthly seminar review.' }
          ]
        };
      case 'events':
        return {
          title: 'Symposia & Events',
          subtitle: 'Upcoming gatherings, lectures, and equinox celebrations.',
          badge: 'Events Calendar',
          items: [
            { name: 'Annual Autumn Symposium 2026', desc: 'Keynote lectures and archival tape playback in Sausalito, CA.' }
          ]
        };
      case 'member-essays':
        return {
          title: 'Member Essays & Reflections',
          subtitle: 'Contributions from scholars, poets, and archive members.',
          badge: 'Member Publication',
          items: [
            { name: 'Dancing with the Void: An Essay on Acceptance', desc: 'By Dr. Elizabeth Vance' }
          ]
        };
      case 'ask-archive':
        return {
          title: 'Ask the Archive (RAG AI Assistant)',
          subtitle: 'Query across all 428 lectures and verified texts with strict citation enforcement.',
          badge: 'AI Tool',
          items: [
            { name: 'Query the Knowledge Base', desc: 'Ask any philosophical question and receive direct quotes with verified timestamps.', action: () => onNavigate({ type: 'search' }) }
          ]
        };
      case 'gpt-directory':
        return {
          title: 'Verified GPT Directory',
          subtitle: 'Specialized language model configurations trained on authentic Alan Watts texts.',
          badge: 'AI Models',
          items: [
            { name: 'Watts Scholar v4.2', desc: 'Strict citation-enforced academic assistant.' },
            { name: 'Koan Companion', desc: 'Interactive Zen dialogue partner.' }
          ]
        };
      case 'prompt-library':
        return {
          title: 'Prompt Library for Philosophy',
          subtitle: 'Curated prompts for exploring existential inquiry, meditation, and comparative religion.',
          badge: 'Resource',
          items: [
            { name: 'Prompt: "Unpacking the Illusion of the Ego"', desc: 'Optimized prompt for deep self-inquiry.' }
          ]
        };
      case 'quote-verifier':
        return {
          title: 'Quote Verifier Tool',
          subtitle: 'Verify whether a social media quote is authentic or misattributed.',
          badge: 'Verification Utility',
          items: [
            { name: 'Verify a Quotation', desc: 'Cross-reference any text against our master archive database of 1,250 verified quotations.', action: () => onNavigate({ type: 'quotes' }) }
          ]
        };
      case 'lecture-finder':
        return {
          title: 'Advanced Lecture Finder',
          subtitle: 'Filter master recordings by year, verification status, series, and themes.',
          badge: 'Search Tool',
          items: [
            { name: 'Filter by KPFA Master Reels', desc: 'Browse pristine analog recordings.' }
          ]
        };
      case 'creator-studio':
        return {
          title: 'Creator Studio & Licensing',
          subtitle: 'Resources for educators, filmmakers, and podcasters requesting lawful archive access.',
          badge: 'Licensing',
          items: [
            { name: 'Request Educational Clip License', desc: 'Guidelines for quoting master lectures in academic and artistic works.' }
          ]
        };
      case 'speaking':
        return {
          title: 'Speaking & Memorial Lectures',
          subtitle: 'Information regarding historical lectures and estate representation.',
          badge: 'Business',
          items: [
            { name: 'Estate Inquiries', desc: 'Contact the Alan Watts Literary Trust for speaking and archival licensing.' }
          ]
        };
      case 'services':
        return {
          title: 'Archival Services & Restoration',
          subtitle: 'Analog tape restoration, mastering, and transcription services for historical repositories.',
          badge: 'Services',
          items: [
            { name: '1/4-Inch Reel Restoration', desc: 'Preserving deteriorating mid-century magnetic tapes.' }
          ]
        };
      case 'partners':
        return {
          title: 'Institutional Partners',
          subtitle: 'Collaborating archives, universities, and public broadcasters.',
          badge: 'Partnership',
          items: [
            { name: 'Pacifica Radio Network', desc: 'Primary broadcast partner.' },
            { name: 'Sounds True Publishing', desc: 'Audiobook and seminar publisher.' }
          ]
        };
      case 'accelerator':
        return {
          title: 'Philosophy & Wisdom Accelerator',
          subtitle: 'Supporting independent scholars and digital preservation projects.',
          badge: 'Initiative',
          items: [
            { name: 'Grant Program for Digital Humanities', desc: 'Funding transcription and indexing projects.' }
          ]
        };
      case 'sponsor':
        return {
          title: 'Sponsor the Archive',
          subtitle: 'Support the ongoing preservation, digitization, and open access of Alan Watts master tapes.',
          badge: 'Support',
          items: [
            { name: 'Become a Sustaining Patron', desc: 'Ensure future generations have access to uncorrupted philosophical recordings.' }
          ]
        };
      case 'licensing':
        return {
          title: 'Licensing Information & Copyright',
          subtitle: 'Strict copyright guidelines and permissions for Alan Watts materials.',
          badge: 'Legal',
          items: [
            { name: 'Copyright Guidelines', desc: 'All recordings protected under Alan Watts Literary Trust.' }
          ]
        };
      case 'contact':
        return {
          title: 'Contact the Editorial Archive',
          subtitle: 'Reach out to the scholarly editorial board with inquiries or corrections.',
          badge: 'Contact',
          items: [
            { name: 'Editorial Board Email', desc: 'editors@alanwattsarchive.org' }
          ]
        };
      default:
        return {
          title: 'Archive Section',
          subtitle: 'Part of the Alan Watts scholarly repository and digital library.',
          badge: 'Official Archive',
          items: [
            { name: 'Return to Home', desc: 'Browse the main archive repository.', action: () => onNavigate({ type: 'home' }) }
          ]
        };
    }
  };

  const details = getSectionDetails();

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-10 py-16 space-y-12">
      <div className="border-b border-[#D1CECA] pb-8 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase px-2.5 py-1 bg-[#1A1A1A] text-[#F9F7F2]">
            {details.badge}
          </span>
          <span className="text-xs font-mono text-[#B48B40]">/{viewType}/</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif text-[#1A1A1A] font-light">
          {details.title}
        </h1>
        <p className="text-base text-[#4A4A4A] max-w-2xl leading-relaxed font-serif italic">
          {details.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {details.items.map((item, idx) => (
          <div
            key={idx}
            onClick={() => {
              if (item.action) item.action();
            }}
            className={`p-6 bg-[#F2EEE9] border border-[#D1CECA] rounded-2xl space-y-3 transition-all ${
              item.action ? 'cursor-pointer hover:border-[#B48B40] hover:shadow-md' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-serif font-bold text-[#1A1A1A]">
                {item.name}
              </h3>
              {item.action && (
                <span className="text-xs font-bold text-[#B48B40] uppercase tracking-wider">
                  Access →
                </span>
              )}
            </div>
            <p className="text-sm text-[#4A4A4A] leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="pt-8 flex justify-between items-center border-t border-[#D1CECA]">
        <button
          onClick={() => onNavigate({ type: 'home' })}
          className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-[#1A1A1A] hover:text-[#B48B40]"
        >
          <span>← Back to Archive Home</span>
        </button>
        <button
          onClick={() => onNavigate({ type: 'resources' })}
          className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest bg-[#1A1A1A] text-[#F9F7F2] px-6 py-3 hover:bg-[#333333] transition-colors"
        >
          <span>View Root Resource Hub</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};
