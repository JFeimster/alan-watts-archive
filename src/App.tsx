import React, { useState, useEffect } from 'react';
import { ViewState, Lecture } from './types';
import { SiteHeader } from './components/layout/SiteHeader';
import { SiteFooter } from './components/layout/SiteFooter';
import { MobileNavigation } from './components/layout/MobileNavigation';
import { AudioPlayer } from './components/audio/AudioPlayer';
import { TranscriptPanel } from './components/audio/TranscriptPanel';

import { HomePage } from './pages/HomePage';
import { StartHerePage } from './pages/StartHerePage';
import { TopicsDirectoryPage } from './pages/TopicsDirectoryPage';
import { TopicDetailPage } from './pages/TopicDetailPage';
import { LecturesDirectoryPage } from './pages/LecturesDirectoryPage';
import { LectureDetailPage } from './pages/LectureDetailPage';
import { CollectionsDirectoryPage } from './pages/CollectionsDirectoryPage';
import { CollectionDetailPage } from './pages/CollectionDetailPage';
import { BooksDirectoryPage } from './pages/BooksDirectoryPage';
import { BookDetailPage } from './pages/BookDetailPage';
import { QuotesDirectoryPage } from './pages/QuotesDirectoryPage';
import { QuoteDetailPage } from './pages/QuoteDetailPage';
import { EssaysDirectoryPage } from './pages/EssaysDirectoryPage';
import { EssayDetailPage } from './pages/EssayDetailPage';
import { VideosDirectoryPage } from './pages/VideosDirectoryPage';
import { VideoDetailPage } from './pages/VideoDetailPage';
import { SearchPage } from './pages/SearchPage';
import { AboutPage } from './pages/AboutPage';
import { ResourcesHubPage } from './pages/ResourcesHubPage';
import { GenericSectionPage } from './pages/GenericSectionPage';
import { DeveloperDeskPage } from './pages/DeveloperDeskPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>({ type: 'home' });
  const [activeLecture, setActiveLecture] = useState<Lecture | null>(null);
  const [showTranscript, setShowTranscript] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [theme, setTheme] = useState<'editorial' | 'neobrutalist'>('editorial');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  const handleNavigate = (view: ViewState) => {
    setCurrentView(view);
    setShowTranscript(false);
  };

  const handlePlayLecture = (lecture: Lecture) => {
    setActiveLecture(lecture);
  };

  const toggleTheme = () => {
    setTheme(theme === 'editorial' ? 'neobrutalist' : 'editorial');
  };

  const renderView = () => {
    switch (currentView.type) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} onPlayLecture={handlePlayLecture} />;
      case 'start-here':
        return <StartHerePage onNavigate={handleNavigate} onPlayLecture={handlePlayLecture} />;
      case 'topics':
        return <TopicsDirectoryPage onNavigate={handleNavigate} />;
      case 'topic-detail':
        return <TopicDetailPage slug={currentView.slug} onNavigate={handleNavigate} onPlayLecture={handlePlayLecture} />;
      case 'lectures':
        return <LecturesDirectoryPage onNavigate={handleNavigate} onPlayLecture={handlePlayLecture} />;
      case 'lecture-detail':
        return (
          <LectureDetailPage 
            id={currentView.id} 
            onNavigate={handleNavigate} 
            onPlayLecture={handlePlayLecture} 
            onOpenTranscript={() => setShowTranscript(true)} 
          />
        );
      case 'collections':
        return <CollectionsDirectoryPage onNavigate={handleNavigate} />;
      case 'collection-detail':
        return <CollectionDetailPage id={currentView.id} onNavigate={handleNavigate} onPlayLecture={handlePlayLecture} />;
      case 'books':
        return <BooksDirectoryPage onNavigate={handleNavigate} />;
      case 'book-detail':
        return <BookDetailPage id={currentView.id} onNavigate={handleNavigate} />;
      case 'quotes':
        return <QuotesDirectoryPage onNavigate={handleNavigate} />;
      case 'quote-detail':
        return <QuoteDetailPage id={currentView.id} onNavigate={handleNavigate} />;
      case 'essays':
        return <EssaysDirectoryPage onNavigate={handleNavigate} />;
      case 'essay-detail':
        return <EssayDetailPage id={currentView.id} onNavigate={handleNavigate} />;
      case 'videos':
        return <VideosDirectoryPage onNavigate={handleNavigate} />;
      case 'video-detail':
        return <VideoDetailPage id={currentView.id} onNavigate={handleNavigate} />;
      case 'search':
        return <SearchPage initialQuery={currentView.query} onNavigate={handleNavigate} onPlayLecture={handlePlayLecture} />;
      case 'about':
        return <AboutPage onNavigate={handleNavigate} />;
      case 'developer-desk':
        return <DeveloperDeskPage onNavigate={handleNavigate} onPlayLecture={handlePlayLecture} />;
      case 'resources':
        return <ResourcesHubPage onNavigate={handleNavigate} />;
      case 'listening-paths':
      case 'timeline':
      case 'comparisons':
      case 'interactive-experiences':
      case 'transcripts':
      case 'newsletter':
      case 'podcasts':
      case 'shorts':
      case 'discussions':
      case 'listening-club':
      case 'groups':
      case 'events':
      case 'member-essays':
      case 'ask-archive':
      case 'gpt-directory':
      case 'prompt-library':
      case 'quote-verifier':
      case 'lecture-finder':
      case 'creator-studio':
      case 'speaking':
      case 'services':
      case 'partners':
      case 'accelerator':
      case 'sponsor':
      case 'licensing':
      case 'contact':
        return <GenericSectionPage viewType={currentView.type} onNavigate={handleNavigate} />;
      case 'not-found':
      default:
        return <NotFoundPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div data-theme={theme} className="min-h-screen flex flex-col font-sans antialiased selection:bg-[#C9A227]/20">
      <SiteHeader 
        currentView={currentView} 
        onNavigate={handleNavigate} 
        onOpenMobileNav={() => setIsMobileNavOpen(true)} 
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main className="flex-grow">
        {renderView()}
      </main>

      <SiteFooter onNavigate={handleNavigate} />

      <MobileNavigation 
        isOpen={isMobileNavOpen} 
        onClose={() => setIsMobileNavOpen(false)} 
        onNavigate={handleNavigate} 
      />

      <AudioPlayer 
        lecture={activeLecture} 
        onClose={() => setActiveLecture(null)} 
        onToggleTranscript={() => setShowTranscript(!showTranscript)}
        showTranscript={showTranscript}
      />

      {showTranscript && activeLecture && (
        <TranscriptPanel 
          lecture={activeLecture} 
          onClose={() => setShowTranscript(false)} 
        />
      )}
    </div>
  );
}
