export type VerificationStatus = 
  | 'verified-source' 
  | 'probable-attribution' 
  | 'source-unconfirmed' 
  | 'commonly-misattributed';

export interface Topic {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription: string;
  lectureCount: number;
  bookCount: number;
  quoteCount: number;
  iconName: string;
  featuredQuoteId?: string;
}

export interface Lecture {
  id: string;
  title: string;
  slug: string;
  series: string;
  year: number;
  duration: string;
  durationSeconds: number;
  verificationStatus: VerificationStatus;
  sourceNote: string;
  summary: string;
  keyIdeas: string[];
  topics: string[]; // topic slugs
  transcript: { time: string; seconds: number; text: string }[];
  audioUrl?: string;
  relatedBookIds?: string[];
  relatedQuoteIds?: string[];
}

export interface Collection {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  yearRecorded: string;
  lectureCount: number;
  totalDuration: string;
  description: string;
  coverImage: string;
  lectureIds: string[];
  verificationStatus: VerificationStatus;
}

export interface Book {
  id: string;
  title: string;
  slug: string;
  year: number;
  publisher: string;
  description: string;
  coverImage: string;
  keyThemes: string[];
  audiobookAvailable: boolean;
  purchaseUrl?: string;
  tableOfContents?: string[];
}

export interface Quote {
  id: string;
  text: string;
  slug: string;
  sourceLectureOrBook: string;
  year?: number;
  verificationStatus: VerificationStatus;
  context: string;
  interpretation: string;
  topics: string[];
  relatedLectureId?: string;
}

export interface Essay {
  id: string;
  title: string;
  slug: string;
  date: string;
  readTime: string;
  author: string;
  excerpt: string;
  content: string[];
  topics: string[];
  verificationStatus: VerificationStatus;
}

export interface VideoItem {
  id: string;
  title: string;
  slug: string;
  date: string;
  duration: string;
  archiveSource: string;
  thumbnailUrl: string;
  description: string;
  verificationStatus: VerificationStatus;
}

export type ViewState = 
  | { type: 'home' }
  | { type: 'start-here' }
  | { type: 'topics' }
  | { type: 'topic-detail'; slug: string }
  | { type: 'lectures' }
  | { type: 'lecture-detail'; id: string }
  | { type: 'collections' }
  | { type: 'collection-detail'; id: string }
  | { type: 'books' }
  | { type: 'book-detail'; id: string }
  | { type: 'quotes' }
  | { type: 'quote-detail'; id: string }
  | { type: 'essays' }
  | { type: 'essay-detail'; id: string }
  | { type: 'videos' }
  | { type: 'video-detail'; id: string }
  | { type: 'search'; query?: string }
  | { type: 'about' }
  | { type: 'resources' }
  | { type: 'listening-paths' }
  | { type: 'timeline' }
  | { type: 'comparisons' }
  | { type: 'interactive-experiences' }
  | { type: 'transcripts' }
  | { type: 'newsletter' }
  | { type: 'podcasts' }
  | { type: 'shorts' }
  | { type: 'discussions' }
  | { type: 'listening-club' }
  | { type: 'groups' }
  | { type: 'events' }
  | { type: 'member-essays' }
  | { type: 'ask-archive' }
  | { type: 'gpt-directory' }
  | { type: 'prompt-library' }
  | { type: 'quote-verifier' }
  | { type: 'lecture-finder' }
  | { type: 'creator-studio' }
  | { type: 'speaking' }
  | { type: 'services' }
  | { type: 'partners' }
  | { type: 'accelerator' }
  | { type: 'sponsor' }
  | { type: 'licensing' }
  | { type: 'contact' }
  | { type: 'not-found' };
