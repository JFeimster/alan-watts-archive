import React, { useState, useEffect } from 'react';
import { ViewState } from '../types';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Play, Search, Radio, Headphones, ExternalLink, Compass, Volume2, Bookmark, CheckCircle, Sparkles } from 'lucide-react';

interface PodcastsPageProps {
  onNavigate: (view: ViewState) => void;
}

interface PodcastEpisode {
  id: string;
  title: string;
  duration: string;
  date: string;
  spotifyId: string;
  description: string;
  season?: number;
  episode?: number;
}

const DEFAULT_EPISODES: PodcastEpisode[] = [
  {
    id: 'pod-1',
    title: 'Ep. 1 — Introduction to Being in the Way',
    duration: '45:12',
    date: 'June 2021',
    spotifyId: '7vD3YfV7hA6WcZ4Y9tXJxs',
    description: 'Host Mark Watts introduces the podcast series and discusses the preservation of his father’s work, starting with a classic lecture on the nature of identity and the separate self.',
    season: 1,
    episode: 1
  },
  {
    id: 'pod-2',
    title: 'Ep. 2 — Cooperative Greatness',
    duration: '38:40',
    date: 'June 2021',
    spotifyId: '1zK9g7vW9s8dY6uXb3r1pZ',
    description: 'Alan Watts explores how human beings cooperate with the organic structure of the universe, moving past the illusion of the hostile environment.',
    season: 1,
    episode: 2
  },
  {
    id: 'pod-3',
    title: 'Ep. 5 — Co-Incidence of Opposites',
    duration: '41:15',
    date: 'July 2021',
    spotifyId: '3n9Xp8Yq6s4mK2n9pZ5wRt',
    description: 'Exploring the non-dualistic core of Eastern philosophy: how light and dark, life and death, self and other are inseparably bound.',
    season: 1,
    episode: 5
  },
  {
    id: 'pod-4',
    title: 'Ep. 12 — The Game of Yes and No',
    duration: '44:30',
    date: 'September 2021',
    spotifyId: '5k8r2yXp6wO8h1wT4pB2zS',
    description: 'A stellar seminar on the cosmic game of existence: how the divine plays hide-and-seek with itself in human form.',
    season: 1,
    episode: 12
  },
  {
    id: 'pod-5',
    title: 'Ep. 24 — Zen in the Kitchen',
    duration: '34:20',
    date: 'February 2022',
    spotifyId: '2q9P7wO4h2wG8aT6yS2xZc',
    description: 'A lighthearted but profound look at Zen as everyday activity, where doing dishes or preparing meals becomes the ultimate meditation.',
    season: 2,
    episode: 4
  }
];

export const PodcastsPage: React.FC<PodcastsPageProps> = ({ onNavigate }) => {
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>(DEFAULT_EPISODES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEpisode, setSelectedEpisode] = useState<PodcastEpisode>(DEFAULT_EPISODES[0]);
  const [bookmarked, setBookmarked] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('custom_podcasts');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setEpisodes([...DEFAULT_EPISODES, ...parsed]);
        }
      }
    } catch (e) {
      console.error('Error loading custom podcasts:', e);
    }
  }, []);

  const handleBookmark = (id: string) => {
    if (bookmarked.includes(id)) {
      setBookmarked(bookmarked.filter((b) => b !== id));
      showFeedback('Removed episode from listening queue');
    } else {
      setBookmarked([...bookmarked, id]);
      showFeedback('Added episode to listening queue');
    }
  };

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 2500);
  };

  const filteredEpisodes = episodes.filter((ep) =>
    ep.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ep.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-12 pb-16">
      <Breadcrumbs items={[{ label: 'Spotify Podcasts' }]} onNavigate={onNavigate} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-12 pb-6 border-b border-[#E6E1D6] flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#8C6D1F]">
              <Radio size={14} className="animate-pulse" />
              <span>Broadcast Syndications</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-editorial font-normal text-[#1E1C18]">
              Being in the Way: Official Podcasts
            </h1>
            <p className="text-sm sm:text-base text-[#6E6454] max-w-2xl leading-relaxed">
              Stream the official remastered Alan Watts podcast series distributed by the Be Here Now Network. Restored from the original 1/4-inch tape reels.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search episodes..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-[#E6E1D6] rounded-xl text-xs focus:outline-none focus:border-[#8C6D1F]"
            />
            <Search className="absolute left-3 top-2.5 text-[#6E6454]/60" size={14} />
          </div>
        </div>

        {/* Primary Interactive Split Screen */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Active Player & Details (7 Columns) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#FAF8F5] border border-[#E6E1D6] rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1DB954]/10 text-[#1DB954] text-[10px] font-bold uppercase tracking-wider">
                  <Headphones size={12} />
                  <span>Now Streaming on Spotify</span>
                </span>
                <span className="text-xs text-[#6E6454] font-mono">
                  {selectedEpisode.season && `S${selectedEpisode.season} `}
                  {selectedEpisode.episode && `Ep ${selectedEpisode.episode}`}
                </span>
              </div>

              {/* Dynamic Interactive Spotify Embed Frame */}
              <div className="relative rounded-xl overflow-hidden aspect-video bg-[#1E1C18] flex flex-col justify-between shadow-lg">
                <iframe
                  style={{ borderRadius: '12px' }}
                  src={`https://open.spotify.com/embed/episode/${selectedEpisode.spotifyId}?utm_source=generator&theme=0`}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allowFullScreen={true}
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="w-full h-full min-h-[152px] md:min-h-[232px]"
                />
              </div>

              {/* Title & Metadata */}
              <div className="space-y-3">
                <h2 className="text-2xl font-editorial font-bold text-[#1E1C18]">
                  {selectedEpisode.title}
                </h2>
                <div className="flex flex-wrap items-center gap-4 text-xs text-[#6E6454]">
                  <span>Released: <strong className="text-[#1E1C18]">{selectedEpisode.date}</strong></span>
                  <span>•</span>
                  <span>Duration: <strong className="text-[#1E1C18]">{selectedEpisode.duration}</strong></span>
                  <span>•</span>
                  <button 
                    onClick={() => handleBookmark(selectedEpisode.id)}
                    className="flex items-center gap-1 hover:text-[#8C6D1F] transition-colors"
                  >
                    <Bookmark size={12} className={bookmarked.includes(selectedEpisode.id) ? "fill-[#8C6D1F]" : ""} />
                    <span>{bookmarked.includes(selectedEpisode.id) ? "In Listening Queue" : "Add to Queue"}</span>
                  </button>
                </div>
                <p className="text-sm text-[#6E6454] leading-relaxed pt-2">
                  {selectedEpisode.description}
                </p>
              </div>

              {/* External Access CTA */}
              <div className="border-t border-[#E6E1D6] pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-[#6E6454]">
                  <Volume2 size={14} className="text-[#8C6D1F]" />
                  <span>Requires Spotify Free or Premium account to stream full episodes.</span>
                </div>
                <a
                  href="https://open.spotify.com/show/1OCK6Y66mO0Bq891H6S76e"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-white bg-[#1DB954] hover:bg-[#1ed760] px-4 py-2 rounded-lg transition-colors"
                >
                  <span>Open Spotify Show</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>

            {/* Quick Context Tip */}
            <div className="bg-[#8C6D1F]/5 border border-[#8C6D1F]/20 rounded-xl p-4 flex gap-3 items-start">
              <Compass size={18} className="text-[#8C6D1F] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E1C18]">Scholarly Curation Note</h4>
                <p className="text-[11px] text-[#6E6454] leading-relaxed">
                  The episodes presented here correspond directly with standard entries in the Electronic University index files. You can discover corresponding lectures, verbatim transcripts, and purchase links in the **Libraries** and **Resource Hub** sections.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Episode Playlist Selector (5 Columns) */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#6E6454] border-b border-[#E6E1D6] pb-2">
              Remastered Series Playlist ({filteredEpisodes.length})
            </h3>

            {feedback && (
              <div className="bg-green-50 border border-green-200 text-green-800 p-2 text-xs font-medium rounded-lg text-center">
                {feedback}
              </div>
            )}

            <div className="space-y-3 max-h-[640px] overflow-y-auto pr-2">
              {filteredEpisodes.length === 0 ? (
                <div className="text-center p-8 border border-dashed border-[#E6E1D6] rounded-xl text-xs text-[#6E6454] bg-white">
                  No episodes match your search query. Try typing another keyword.
                </div>
              ) : (
                filteredEpisodes.map((ep) => {
                  const isActive = selectedEpisode.id === ep.id;
                  return (
                    <div
                      key={ep.id}
                      onClick={() => setSelectedEpisode(ep)}
                      className={`p-4 rounded-xl border transition-all text-left cursor-pointer group flex gap-3 ${
                        isActive
                          ? 'bg-[#8C6D1F]/10 border-[#8C6D1F] shadow-sm'
                          : 'bg-white border-[#E6E1D6] hover:border-[#8C6D1F]/40'
                      }`}
                    >
                      {/* Left side Status Icon */}
                      <div className="shrink-0 flex flex-col items-center justify-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                          isActive ? 'bg-[#8C6D1F] text-white' : 'bg-[#FAF8F5] text-[#6E6454] group-hover:bg-[#8C6D1F]/20 group-hover:text-[#8C6D1F]'
                        }`}>
                          <Play size={12} className={isActive ? "fill-current" : ""} />
                        </div>
                      </div>

                      {/* Episode Content details */}
                      <div className="flex-1 space-y-1 overflow-hidden">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[9px] font-mono uppercase tracking-wider text-[#8C6D1F] font-bold">
                            {ep.season && `Season ${ep.season} `}
                            {ep.episode && `• Episode ${ep.episode}`}
                          </span>
                          <span className="text-[10px] text-[#6E6454]">{ep.duration}</span>
                        </div>
                        <h4 className={`text-sm font-editorial font-bold leading-snug group-hover:text-[#8C6D1F] transition-colors ${
                          isActive ? 'text-[#8C6D1F]' : 'text-[#1E1C18]'
                        }`}>
                          {ep.title}
                        </h4>
                        <p className="text-[11px] text-[#6E6454] line-clamp-2 leading-relaxed">
                          {ep.description}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Subscribe Options */}
            <div className="bg-white border border-[#E6E1D6] rounded-xl p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E1C18]">Subscribe on Other Platforms</h4>
              <p className="text-[11px] text-[#6E6454] leading-relaxed">
                Stream "Being in the Way" on any popular podcast platform to listen to the entire catalog on the go.
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1 text-[10px] font-bold text-center uppercase tracking-wider">
                <a
                  href="https://podcasts.apple.com/us/podcast/alan-watts-being-in-the-way/id1569852331"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 border border-[#E6E1D6] hover:bg-[#FAF8F5] rounded-lg transition-colors text-[#1E1C18] flex items-center justify-center gap-1.5"
                >
                  <span>Apple Podcasts</span>
                  <ExternalLink size={10} />
                </a>
                <a
                  href="https://www.youtube.com/playlist?list=PL_XvS46Z2gM0mZtB_hG9I_qE09YstR_56"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 border border-[#E6E1D6] hover:bg-[#FAF8F5] rounded-lg transition-colors text-[#1E1C18] flex items-center justify-center gap-1.5"
                >
                  <span>YouTube Music</span>
                  <ExternalLink size={10} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
