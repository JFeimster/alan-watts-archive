import React, { useState, useEffect, useRef } from 'react';
import { ViewState, Lecture, Book, Quote } from '../types';
import { LectureCard } from '../components/cards/LectureCard';
import { BookCard } from '../components/cards/BookCard';
import { QuoteCard } from '../components/cards/QuoteCard';
import { 
  Wrench, 
  Search, 
  Plus, 
  FileCode, 
  Trash2, 
  Image as ImageIcon, 
  Sparkles, 
  Globe, 
  CheckCircle, 
  AlertCircle, 
  Copy, 
  ExternalLink,
  BookOpen,
  ArrowRight,
  Music,
  Upload,
  Play,
  Settings,
  HelpCircle
} from 'lucide-react';

interface DeveloperDeskPageProps {
  onNavigate: (view: ViewState) => void;
  onPlayLecture?: (lecture: Lecture) => void;
}

// Simple IndexedDB store helpers for storing actual custom audio files (mp3 files)
const saveAudioToDB = (id: string, file: File): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const request = indexedDB.open('AlanWattsArchiveDB', 1);
      request.onupgradeneeded = (e: any) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('audio_files')) {
          db.createObjectStore('audio_files');
        }
      };
      request.onsuccess = (e: any) => {
        const db = e.target.result;
        // In case upgradeneeded didn't run but database doesn't have the store:
        if (!db.objectStoreNames.contains('audio_files')) {
          // Close and retry with upgrade
          db.close();
          const reqUpgrade = indexedDB.open('AlanWattsArchiveDB', 2);
          reqUpgrade.onupgradeneeded = (evt: any) => {
            const dbUp = evt.target.result;
            dbUp.createObjectStore('audio_files');
          };
          reqUpgrade.onsuccess = (evt: any) => {
            const dbUp = evt.target.result;
            const transaction = dbUp.transaction('audio_files', 'readwrite');
            const store = transaction.objectStore('audio_files');
            const putReq = store.put(file, id);
            putReq.onsuccess = () => resolve();
            putReq.onerror = () => reject(putReq.error);
          };
          return;
        }

        const transaction = db.transaction('audio_files', 'readwrite');
        const store = transaction.objectStore('audio_files');
        const putReq = store.put(file, id);
        putReq.onsuccess = () => resolve();
        putReq.onerror = () => reject(putReq.error);
      };
      request.onerror = () => reject(request.error);
    } catch (e) {
      reject(e);
    }
  });
};

const deleteAudioFromDB = (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const request = indexedDB.open('AlanWattsArchiveDB', 1);
      request.onsuccess = (e: any) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('audio_files')) {
          resolve();
          return;
        }
        const transaction = db.transaction('audio_files', 'readwrite');
        const store = transaction.objectStore('audio_files');
        const delReq = store.delete(id);
        delReq.onsuccess = () => resolve();
        delReq.onerror = () => reject(delReq.error);
      };
      request.onerror = () => reject(request.error);
    } catch (e) {
      reject(e);
    }
  });
};

export const DeveloperDeskPage: React.FC<DeveloperDeskPageProps> = ({ onNavigate, onPlayLecture }) => {
  const [activeTab, setActiveTab] = useState<'assistant' | 'media' | 'photos' | 'input'>('assistant');
  
  // Research Assistant State
  const [researchQuery, setResearchQuery] = useState('');
  const [researchResult, setResearchResult] = useState<string | null>(null);
  const [researchCitations, setResearchCitations] = useState<{ uri: string; title: string }[]>([]);
  const [isResearching, setIsResearching] = useState(false);
  const [researchError, setResearchError] = useState<string | null>(null);

  // Grounded Research Assistant Parsed Entity State
  const [parsedResearchEntity, setParsedResearchEntity] = useState<{
    type: 'lecture' | 'book' | 'quote';
    data: any;
  } | null>(null);
  const [isEditingParsed, setIsEditingParsed] = useState(false);
  const [editFields, setEditFields] = useState<any>({});
  const [commitFeedback, setCommitFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Input Portal Mode
  const [inputMode, setInputMode] = useState<'json' | 'text'>('json');
  const [rawTextContent, setRawTextContent] = useState('');
  const [isParsingText, setIsParsingText] = useState(false);

  // Archival Photo Sourcing State
  const [photoQuery, setPhotoQuery] = useState('Alan Watts');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // JSON Data Input State
  const [dataType, setDataType] = useState<'lecture' | 'book' | 'quote'>('lecture');
  const [pasteContent, setPasteContent] = useState('');
  const [previewData, setPreviewData] = useState<any>(null);
  const [inputFeedback, setInputFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Custom Audio & Lecture Registrar State
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [analyzedDuration, setAnalyzedDuration] = useState<number>(300);
  const [analyzedDurationStr, setAnalyzedDurationStr] = useState<string>('05:00');
  const [lectureTitle, setLectureTitle] = useState('');
  const [lectureSeries, setLectureSeries] = useState('Essential Lectures');
  const [lectureYear, setLectureYear] = useState<number>(1970);
  const [lectureSummary, setLectureSummary] = useState('');
  const [lectureKeyIdeas, setLectureKeyIdeas] = useState('');
  const [lectureTranscriptText, setLectureTranscriptText] = useState('');
  const [mediaFeedback, setMediaFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSavingMedia, setIsSavingMedia] = useState(false);

  // List of currently registered custom lectures to display in the Dev Desk
  const [customLecturesList, setCustomLecturesList] = useState<Lecture[]>([]);

  // Hidden Audio Element Ref to calculate exact file duration on upload
  const hiddenAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Load custom registered lectures from localStorage
    try {
      const customLectures = localStorage.getItem('custom_lectures');
      if (customLectures) {
        const parsed = JSON.parse(customLectures);
        if (Array.isArray(parsed)) {
          setCustomLecturesList(parsed);
        }
      }
    } catch (e) {
      console.error('Error loading custom lectures list:', e);
    }
  }, []);

  const extractJSON = (text: string) => {
    if (!text) return null;
    const match = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (match) {
      try {
        return JSON.parse(match[1]);
      } catch (e) {
        console.warn('Failed to parse regex-matched JSON:', e);
      }
    }
    const genericMatch = text.match(/```\s*([\s\S]*?)\s*```/);
    if (genericMatch) {
      try {
        const cleaned = genericMatch[1].trim();
        if (cleaned.startsWith('{')) {
          return JSON.parse(cleaned);
        }
      } catch (e) {}
    }
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      try {
        return JSON.parse(text.substring(firstBrace, lastBrace + 1));
      } catch (e) {
        console.warn('Failed to parse substring-matched JSON:', e);
      }
    }
    return null;
  };

  useEffect(() => {
    if (researchResult) {
      const json = extractJSON(researchResult);
      if (json && json.type && json.data) {
        setParsedResearchEntity({
          type: json.type,
          data: json.data
        });
        setEditFields(json.data);
        setIsEditingParsed(false);
        setCommitFeedback(null);
      } else {
        setParsedResearchEntity(null);
      }
    } else {
      setParsedResearchEntity(null);
    }
  }, [researchResult]);

  useEffect(() => {
    if (!pasteContent.trim()) {
      setPreviewData(null);
      return;
    }
    try {
      const parsed = JSON.parse(pasteContent);
      const item = Array.isArray(parsed) ? parsed[0] : parsed;
      if (item && typeof item === 'object') {
        setPreviewData(item);
      } else {
        setPreviewData(null);
      }
    } catch (e) {
      setPreviewData(null);
    }
  }, [pasteContent]);

  const handleAIParseText = async () => {
    if (!rawTextContent.trim()) {
      setInputFeedback({ type: 'error', message: 'Please enter some raw, unstructured text first.' });
      return;
    }

    setIsParsingText(true);
    setInputFeedback(null);

    try {
      const res = await fetch('/api/parse-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: rawTextContent,
          type: dataType
        })
      });

      if (!res.ok) {
        throw new Error(`HTTP Error ${res.status}: Failed to reach parser agent.`);
      }

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      const parsedJSON = extractJSON(data.text);
      if (parsedJSON) {
        const finalObj = parsedJSON.data ? parsedJSON.data : parsedJSON;
        setPasteContent(JSON.stringify(finalObj, null, 2));
        setInputMode('json');
        setInputFeedback({ type: 'success', message: 'Successfully parsed raw unstructured text using AI search! Check the preview in the JSON editor.' });
      } else {
        // Fallback: try to see if the whole text is valid JSON
        try {
          const rawParsed = JSON.parse(data.text);
          setPasteContent(JSON.stringify(rawParsed, null, 2));
          setInputMode('json');
          setInputFeedback({ type: 'success', message: 'Successfully parsed text using AI!' });
        } catch (innerErr) {
          throw new Error("AI completed parsing but did not format a valid JSON code block.");
        }
      }
    } catch (err: any) {
      console.error(err);
      setInputFeedback({ type: 'error', message: `AI Parsing failed: ${err.message}` });
    } finally {
      setIsParsingText(false);
    }
  };

  const handleCommitResearchEntity = () => {
    if (!parsedResearchEntity) return;
    const type = parsedResearchEntity.type;
    const finalData = { ...editFields };

    if (!finalData.id) {
      finalData.id = `${type}-custom-${Date.now()}`;
    }
    if (!finalData.slug) {
      finalData.slug = (finalData.title || finalData.text || 'custom-item')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    try {
      if (type === 'lecture') {
        const existing = JSON.parse(localStorage.getItem('custom_lectures') || '[]');
        const filtered = existing.filter((item: any) => item.id !== finalData.id);
        localStorage.setItem('custom_lectures', JSON.stringify([...filtered, finalData]));
      } else if (type === 'book') {
        const existing = JSON.parse(localStorage.getItem('custom_books') || '[]');
        const filtered = existing.filter((item: any) => item.id !== finalData.id);
        localStorage.setItem('custom_books', JSON.stringify([...filtered, finalData]));
      } else if (type === 'quote') {
        const existing = JSON.parse(localStorage.getItem('custom_quotes') || '[]');
        const filtered = existing.filter((item: any) => item.id !== finalData.id);
        localStorage.setItem('custom_quotes', JSON.stringify([...filtered, finalData]));
      }

      setCommitFeedback({
        type: 'success',
        message: `Successfully committed "${finalData.title || finalData.text || 'item'}" directly to your Editorial Archive local state!`
      });

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      setCommitFeedback({
        type: 'error',
        message: `Error committing data: ${err.message}`
      });
    }
  };

  // Calculate audio file duration when a local MP3 file is selected
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('audio/')) {
        setMediaFeedback({ type: 'error', message: 'Please select a valid audio (.mp3) file.' });
        return;
      }
      setUploadFile(file);
      setMediaFeedback(null);

      // Create a temporary URL to read file metadata
      const objectUrl = URL.createObjectURL(file);
      if (hiddenAudioRef.current) {
        hiddenAudioRef.current.src = objectUrl;
        hiddenAudioRef.current.onloadedmetadata = () => {
          const durationSecs = Math.floor(hiddenAudioRef.current?.duration || 300);
          const mins = Math.floor(durationSecs / 60);
          const secs = durationSecs % 60;
          const durationFormatted = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
          
          setAnalyzedDuration(durationSecs);
          setAnalyzedDurationStr(durationFormatted);
          URL.revokeObjectURL(objectUrl);
        };
      }

      // Auto-fill Title from file name as fallback if empty
      if (!lectureTitle) {
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setLectureTitle(cleanName);
      }
    }
  };

  // Test-Play the uploaded MP3 directly in the app player
  const handleTestPlay = () => {
    if (!uploadFile || !onPlayLecture) return;

    const testObjectUrl = URL.createObjectURL(uploadFile);
    
    // Create a temporary mock Lecture object for immediate testing
    const testLecture: Lecture = {
      id: 'custom-preview-active',
      title: lectureTitle || uploadFile.name,
      slug: 'custom-preview',
      series: lectureSeries || 'Sandbox Preview',
      year: lectureYear,
      duration: analyzedDurationStr,
      durationSeconds: analyzedDuration,
      verificationStatus: 'verified-source',
      sourceNote: 'Direct live sandbox playback.',
      summary: lectureSummary || 'Previewing local MP3 audio.',
      keyIdeas: lectureKeyIdeas ? lectureKeyIdeas.split('\n').filter(Boolean) : ['Custom Audio Testing'],
      topics: ['life-as-play-work-and-purpose'],
      transcript: parseTranscriptText(lectureTranscriptText, analyzedDuration),
      audioUrl: testObjectUrl // The real local file object URL
    };

    onPlayLecture(testLecture);
  };

  // Helper to parse transcript paragraphs & timestamp strings
  const parseTranscriptText = (rawText: string, fileDuration: number): { time: string; seconds: number; text: string }[] => {
    if (!rawText.trim()) {
      return [
        { time: '00:00', seconds: 0, text: 'Click Play to listen to this authentic master recording.' }
      ];
    }

    const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
    const parsed: { time: string; seconds: number; text: string }[] = [];
    const timestampRegex = /(?:\[)?((\d{1,2}:)?\d{1,2}:\d{2})(?:\])?/;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const match = line.match(timestampRegex);
      if (match) {
        const timestampStr = match[1];
        const textOnly = line.replace(timestampRegex, '').trim();
        
        const parts = timestampStr.split(':').map(Number);
        let seconds = 0;
        if (parts.length === 3) {
          seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
        } else if (parts.length === 2) {
          seconds = parts[0] * 60 + parts[1];
        }
        
        parsed.push({
          time: timestampStr,
          seconds,
          text: textOnly || '...'
        });
      } else {
        parsed.push({
          time: '',
          seconds: -1,
          text: line
        });
      }
    }

    // Evenly distribute non-timestamped lines across the duration
    const untimestampedCount = parsed.filter(p => p.seconds === -1).length;
    if (untimestampedCount > 0) {
      let currentIdx = 0;
      const totalDurationSecs = fileDuration || 300;
      for (let i = 0; i < parsed.length; i++) {
        if (parsed[i].seconds === -1) {
          const fraction = currentIdx / Math.max(1, untimestampedCount - 1);
          const secs = Math.floor(fraction * totalDurationSecs);
          const mins = Math.floor(secs / 60);
          const remainSecs = secs % 60;
          parsed[i].seconds = secs;
          parsed[i].time = `${mins}:${remainSecs < 10 ? '0' : ''}${remainSecs}`;
          currentIdx++;
        }
      }
    }

    return parsed.sort((a, b) => a.seconds - b.seconds);
  };

  // Register Custom Lecture metadata to LocalStorage and save MP3 File to IndexedDB
  const handleRegisterLecture = async (e: React.FormEvent) => {
    e.preventDefault();
    setMediaFeedback(null);

    if (!uploadFile) {
      setMediaFeedback({ type: 'error', message: 'An MP3 audio file must be selected to register.' });
      return;
    }

    if (!lectureTitle.trim()) {
      setMediaFeedback({ type: 'error', message: 'A lecture title is required.' });
      return;
    }

    setIsSavingMedia(true);

    try {
      const generatedId = `lec-custom-${Date.now()}`;
      const slug = lectureTitle.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      // 1. Save MP3 file in IndexedDB
      await saveAudioToDB(generatedId, uploadFile);

      // 2. Format parsed transcript
      const formattedTranscript = parseTranscriptText(lectureTranscriptText, analyzedDuration);

      // 3. Construct new Lecture object
      const newLecture: Lecture = {
        id: generatedId,
        title: lectureTitle,
        slug: slug,
        series: lectureSeries || 'Custom Uploads',
        year: Number(lectureYear) || 1970,
        duration: analyzedDurationStr,
        durationSeconds: analyzedDuration,
        verificationStatus: 'verified-source',
        sourceNote: 'Locally archived MP3 record in IndexedDB browser database.',
        summary: lectureSummary || `Authentic lecture on ${lectureTitle}.`,
        keyIdeas: lectureKeyIdeas 
          ? lectureKeyIdeas.split('\n').map(i => i.trim()).filter(Boolean)
          : [lectureTitle],
        topics: ['life-as-play-work-and-purpose'], // Assigned default topic
        transcript: formattedTranscript
      };

      // 4. Save metadata to LocalStorage
      const existing = JSON.parse(localStorage.getItem('custom_lectures') || '[]');
      const updated = [...existing, newLecture];
      localStorage.setItem('custom_lectures', JSON.stringify(updated));

      setMediaFeedback({ 
        type: 'success', 
        message: `Success! "${lectureTitle}" registered to live archive. IndexedDB initialized. Reloading...` 
      });

      // Clear input fields
      setUploadFile(null);
      setLectureTitle('');
      setLectureSummary('');
      setLectureTranscriptText('');
      setLectureKeyIdeas('');

      // Reload so directories pick up the newly merged index
      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (err: any) {
      console.error(err);
      setMediaFeedback({ type: 'error', message: `Failed to write files: ${err.message || err}` });
    } finally {
      setIsSavingMedia(false);
    }
  };

  // Delete a registered custom lecture (metadata & IndexedDB audio)
  const handleDeleteCustomLecture = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete the custom lecture "${title}" and its associated MP3 from IndexedDB?`)) {
      try {
        // Delete audio blob
        await deleteAudioFromDB(id);

        // Delete metadata
        const existing = JSON.parse(localStorage.getItem('custom_lectures') || '[]');
        const updated = existing.filter((l: Lecture) => l.id !== id);
        localStorage.setItem('custom_lectures', JSON.stringify(updated));

        setCustomLecturesList(updated);
        alert('Lecture and local audio file deleted successfully.');
        window.location.reload();
      } catch (err) {
        console.error(err);
        alert('Failed to delete custom files from IndexedDB database.');
      }
    }
  };

  // Run Research Grounded Search
  const handleResearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!researchQuery.trim()) return;

    setIsResearching(true);
    setResearchError(null);
    setResearchResult(null);
    setResearchCitations([]);

    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: researchQuery }),
      });

      if (!res.ok) {
        throw new Error(`HTTP Error ${res.status}: Failed to execute grounding query.`);
      }

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setResearchResult(data.text);
      setResearchCitations(data.citations || []);
    } catch (err: any) {
      console.error(err);
      setResearchError(err.message || 'An error occurred while calling the search assistant endpoint.');
    } finally {
      setIsResearching(false);
    }
  };

  // Predefined Photo Sourcing Lists
  const photoResources = [
    {
      title: 'Esalen Institute Archives',
      query: 'Alan Watts Esalen 1968',
      desc: ' Watts lecturing at the hot springs or the main lodge in Big Sur.',
      attribution: 'Courtesy of Esalen Institute Archival Photographic Collection (1968).'
    },
    {
      title: 'Ferryboat Vallejo Study',
      query: 'Alan Watts Ferryboat Vallejo Sausalito',
      desc: 'Images of Alan in his houseboat study with rugs, pillows, and audio recorders.',
      attribution: 'Sausalito Historical Society / Vallejo Floating Archive.'
    },
    {
      title: 'Zen Mountain Center',
      query: 'Alan Watts Zen Mountain Center Tassajara',
      desc: 'Watts in rustic Zen robes sitting in meditation or walking the grounds.',
      attribution: 'San Francisco Zen Center Archival Photography.'
    },
    {
      title: 'KPFA Berkeley Broadcasts',
      query: 'Alan Watts KPFA Radio Studio',
      desc: 'Historic press or archival photos inside the KPFA radio broadcasting booths.',
      attribution: 'Pacifica Radio Archives (1960-1973).'
    }
  ];

  const handleCopyAttribution = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Parse and Save JSON Metadata
  const handleImportData = (e: React.FormEvent) => {
    e.preventDefault();
    setInputFeedback(null);

    if (!pasteContent.trim()) {
      setInputFeedback({ type: 'error', message: 'Please paste JSON content to import.' });
      return;
    }

    try {
      const parsed = JSON.parse(pasteContent);
      
      if (dataType === 'lecture') {
        const lectures = Array.isArray(parsed) ? parsed : [parsed];
        for (const item of lectures) {
          if (!item.id || !item.title || !item.slug) {
            throw new Error('Each lecture object must contain "id", "title", and "slug" fields.');
          }
        }
        const existing = JSON.parse(localStorage.getItem('custom_lectures') || '[]');
        localStorage.setItem('custom_lectures', JSON.stringify([...existing, ...lectures]));
        setInputFeedback({ 
          type: 'success', 
          message: `Successfully imported ${lectures.length} lecture(s). Reloading application...` 
        });
      } else if (dataType === 'book') {
        const books = Array.isArray(parsed) ? parsed : [parsed];
        for (const item of books) {
          if (!item.id || !item.title || !item.slug) {
            throw new Error('Each book object must contain "id", "title", and "slug" fields.');
          }
        }
        const existing = JSON.parse(localStorage.getItem('custom_books') || '[]');
        localStorage.setItem('custom_books', JSON.stringify([...existing, ...books]));
        setInputFeedback({ 
          type: 'success', 
          message: `Successfully imported ${books.length} book(s). Reloading application...` 
        });
      } else if (dataType === 'quote') {
        const quotes = Array.isArray(parsed) ? parsed : [parsed];
        for (const item of quotes) {
          if (!item.id || !item.text || !item.slug) {
            throw new Error('Each quote object must contain "id", "text", and "slug" fields.');
          }
        }
        const existing = JSON.parse(localStorage.getItem('custom_quotes') || '[]');
        localStorage.setItem('custom_quotes', JSON.stringify([...existing, ...quotes]));
        setInputFeedback({ 
          type: 'success', 
          message: `Successfully imported ${quotes.length} quote(s). Reloading application...` 
        });
      }

      setPasteContent('');
      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (err: any) {
      setInputFeedback({ 
        type: 'error', 
        message: `JSON Validation Error: ${err.message}` 
      });
    }
  };

  const handleClearCustomData = () => {
    if (window.confirm('Are you sure you want to clear all imported custom lectures, books, and quotes? This will restore the default static archive.')) {
      localStorage.removeItem('custom_lectures');
      localStorage.removeItem('custom_books');
      localStorage.removeItem('custom_quotes');
      setInputFeedback({ type: 'success', message: 'All custom data cleared. Reloading...' });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  // Default Template JSONs for Developer Ease
  const templates = {
    lecture: {
      id: "lec-custom-1",
      title: "The Nature of Play and Purpose",
      slug: "nature-of-play-and-purpose-custom",
      series: "Private Seminars",
      year: 1971,
      duration: "42:15",
      durationSeconds: 2535,
      verificationStatus: "verified-source",
      sourceNote: "Imported via developer console.",
      summary: "In this seminar, Alan Watts outlines why living with high-pressure anxiety defeats our ecological role.",
      keyIdeas: [
        "The universe is musical, not purposeful",
        "Anxiety as an over-active survival mechanism"
      ],
      topics: ["life-as-play-work-and-purpose", "overthinking-anxiety-and-mental-noise"],
      transcript: [
        { time: "00:01", seconds: 1, text: "Let us consider what it means to be alive and playing this game." },
        { time: "02:30", seconds: 150, text: "We do not play a song to reach the final chord." }
      ],
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    },
    book: {
      id: "book-custom-1",
      title: "Nature, Man and Woman",
      slug: "nature-man-and-woman-custom",
      year: 1958,
      publisher: "Pantheon Books",
      description: "An authentic look at the separation between human sentiment and natural ecology.",
      coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
      keyThemes: ["Ecology", "Non-duality", "Intimacy"],
      audiobookAvailable: true
    },
    quote: {
      id: "q-custom-1",
      text: "Trying to define yourself is like trying to bite your own teeth.",
      slug: "trying-to-define-yourself-custom",
      sourceLectureOrBook: "Out of Your Mind",
      year: 1970,
      verificationStatus: "verified-source",
      context: "UC Santa Cruz lectures.",
      interpretation: "The self is subject, it can never become its own object.",
      topics: ["ego-identity-and-the-separate-self"]
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-10 py-12 space-y-10">
      {/* Hidden audio tag to extract metadata (duration) of selected files */}
      <audio ref={hiddenAudioRef} style={{ display: 'none' }} />

      {/* Editorial Header */}
      <div className="border-b border-[#D1CECA] pb-8 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase px-2.5 py-1 bg-[#8C6D1F] text-white">
            ADMINISTRATOR DESK
          </span>
          <span className="text-xs font-mono text-[#8C6D1F]">/dev/editorial-studio/</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif text-[#1E1C18] font-light">
          Editorial & Sourcing Desk
        </h1>
        <p className="text-base text-[#6E6454] max-w-3xl leading-relaxed">
          Welcome to the developer portal. Here you can perform search-grounded queries to source lecture records, upload local `.mp3` master files to play/register, search archival photos, or paste raw JSON metadata templates.
        </p>

        {/* Tab Selection */}
        <div className="flex flex-wrap gap-2 pt-6">
          <button
            onClick={() => setActiveTab('assistant')}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider rounded-xl border transition-all ${
              activeTab === 'assistant' 
                ? 'bg-[#1E1C18] text-[#F4F0E8] border-[#1E1C18]' 
                : 'bg-[#F4F0E8] text-[#6E6454] border-[#E6E1D6] hover:bg-[#E6E1D6]'
            }`}
          >
            <Sparkles size={14} />
            <span>Research Assistant</span>
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider rounded-xl border transition-all ${
              activeTab === 'media' 
                ? 'bg-[#1E1C18] text-[#F4F0E8] border-[#1E1C18]' 
                : 'bg-[#F4F0E8] text-[#6E6454] border-[#E6E1D6] hover:bg-[#E6E1D6]'
            }`}
          >
            <Music size={14} />
            <span>Media & MP3 Uploader</span>
          </button>
          <button
            onClick={() => setActiveTab('photos')}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider rounded-xl border transition-all ${
              activeTab === 'photos' 
                ? 'bg-[#1E1C18] text-[#F4F0E8] border-[#1E1C18]' 
                : 'bg-[#F4F0E8] text-[#6E6454] border-[#E6E1D6] hover:bg-[#E6E1D6]'
            }`}
          >
            <ImageIcon size={14} />
            <span>Photo Sourcing Guide</span>
          </button>
          <button
            onClick={() => setActiveTab('input')}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider rounded-xl border transition-all ${
              activeTab === 'input' 
                ? 'bg-[#1E1C18] text-[#F4F0E8] border-[#1E1C18]' 
                : 'bg-[#F4F0E8] text-[#6E6454] border-[#E6E1D6] hover:bg-[#E6E1D6]'
            }`}
          >
            <Plus size={14} />
            <span>Metadata Input Portal</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Grounded Research Assistant */}
      {activeTab === 'assistant' && (
        <div className="space-y-8 bg-[#F4F0E8] border border-[#E6E1D6] rounded-2xl p-6 sm:p-10">
          <div className="space-y-2">
            <h2 className="text-2xl font-serif text-[#1E1C18]">Search-Grounded Lecture Scriptor</h2>
            <p className="text-xs text-[#6E6454] max-w-2xl leading-relaxed">
              Submit a topic or query. Gemini will perform a live Google Search to gather authentic bibliographic citations, recommended titles, years, and summaries for your editorial review.
            </p>
          </div>

          <form onSubmit={handleResearchSubmit} className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#736B5E]" />
              <input
                type="text"
                value={researchQuery}
                onChange={(e) => setResearchQuery(e.target.value)}
                placeholder="e.g. Alan Watts lecture on Zen and ecology, or Out of Your Mind recordings"
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-[#E6E1D6] rounded-xl text-sm focus:outline-none focus:border-[#8C6D1F]"
              />
            </div>
            <button
              type="submit"
              disabled={isResearching}
              className="px-8 py-3.5 bg-[#8C6D1F] hover:bg-[#735817] disabled:bg-[#736B5E]/50 text-white text-xs font-bold uppercase tracking-widest transition-colors rounded-xl flex items-center justify-center gap-2"
            >
              {isResearching ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Searching Google...</span>
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  <span>Query Grounded Agent</span>
                </>
              )}
            </button>
          </form>

          {researchError && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-4 flex gap-3 items-start">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <div className="text-xs font-medium">{researchError}</div>
            </div>
          )}

          {researchResult && (
            <div className="space-y-8">
              <div className="border-t border-[#E6E1D6] pt-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#6E6454] mb-3">
                  Grounded Search Report
                </h3>
                <div className="bg-white border border-[#E6E1D6] rounded-xl p-6 overflow-auto text-sm text-[#1E1C18] leading-relaxed max-h-[400px] whitespace-pre-wrap font-sans">
                  {researchResult}
                </div>
              </div>

              {/* Grounded Sourced Entry Extracted Committer Panel */}
              {parsedResearchEntity && (
                <div className="border-t border-[#E6E1D6] pt-8 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-serif text-[#1E1C18] flex items-center gap-2">
                        <Sparkles size={16} className="text-[#8C6D1F]" />
                        <span>Research Sourced Entry Detected</span>
                      </h3>
                      <p className="text-xs text-[#6E6454] mt-1">
                        Our parser automatically extracted a structured <strong className="uppercase">{parsedResearchEntity.type}</strong> from the search report. You can review, edit, and directly save this record into the archive.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsEditingParsed(!isEditingParsed)}
                        className="px-4 py-2 bg-white border border-[#E6E1D6] hover:bg-[#F4F0E8] text-[#1E1C18] text-xs font-semibold rounded-lg transition-colors"
                      >
                        {isEditingParsed ? 'Show Live Preview' : 'Edit Metadata Fields'}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* Live Component Preview */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-[#6E6454]">
                        Archival Component Live Preview
                      </h4>
                      <div className="p-6 bg-white border border-[#E6E1D6] rounded-xl flex flex-col justify-center min-h-[220px]">
                        {parsedResearchEntity.type === 'lecture' && (
                          <LectureCard 
                            lecture={{
                              id: editFields.id || 'temp-id',
                              title: editFields.title || 'Untitled Sourced Lecture',
                              slug: editFields.slug || 'untitled-slug',
                              series: editFields.series || 'Master Lectures',
                              year: Number(editFields.year) || 1970,
                              duration: editFields.duration || '30:00',
                              durationSeconds: Number(editFields.durationSeconds) || 1800,
                              verificationStatus: editFields.verificationStatus || 'verified-source',
                              sourceNote: editFields.sourceNote || 'Grounded search result.',
                              summary: editFields.summary || 'Summary placeholder.',
                              keyIdeas: editFields.keyIdeas || [],
                              topics: editFields.topics || ['life-as-play-work-and-purpose'],
                              transcript: editFields.transcript || []
                            }}
                            onClick={() => {}}
                          />
                        )}
                        {parsedResearchEntity.type === 'book' && (
                          <BookCard 
                            book={{
                              id: editFields.id || 'temp-id',
                              title: editFields.title || 'Untitled Sourced Book',
                              slug: editFields.slug || 'untitled-slug',
                              year: Number(editFields.year) || 1970,
                              publisher: editFields.publisher || 'Unknown Publisher',
                              description: editFields.description || 'Description placeholder.',
                              coverImage: editFields.coverImage || 'https://covers.openlibrary.org/b/isbn/0679723005-L.jpg',
                              keyThemes: editFields.keyThemes || [],
                              audiobookAvailable: !!editFields.audiobookAvailable,
                              purchaseUrl: editFields.purchaseUrl || ''
                            }}
                            onClick={() => {}}
                          />
                        )}
                        {parsedResearchEntity.type === 'quote' && (
                          <QuoteCard 
                            quote={{
                              id: editFields.id || 'temp-id',
                              text: editFields.text || 'Quote text placeholder.',
                              slug: editFields.slug || 'untitled-slug',
                              sourceLectureOrBook: editFields.sourceLectureOrBook || 'Unknown Source',
                              year: Number(editFields.year) || 1970,
                              verificationStatus: editFields.verificationStatus || 'verified-source',
                              context: editFields.context || 'Context placeholder.',
                              interpretation: editFields.interpretation || 'Interpretation placeholder.',
                              topics: editFields.topics || ['ego-identity-and-the-separate-self']
                            }}
                            onClick={() => {}}
                          />
                        )}
                      </div>
                    </div>

                    {/* Editor Form */}
                    <div className="bg-white border border-[#E6E1D6] rounded-xl p-6 space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-[#6E6454]">
                        {isEditingParsed ? 'Editing Metadata Fields' : 'Extracted Attributes Summary'}
                      </h4>

                      {isEditingParsed ? (
                        <div className="space-y-3 text-xs">
                          {parsedResearchEntity.type !== 'quote' && (
                            <div>
                              <label className="font-semibold text-[#6E6454] block mb-1">Title</label>
                              <input 
                                type="text"
                                value={editFields.title || ''}
                                onChange={(e) => setEditFields({ ...editFields, title: e.target.value })}
                                className="w-full px-3 py-2 border border-[#E6E1D6] rounded focus:outline-none focus:border-[#8C6D1F]"
                              />
                            </div>
                          )}

                          {parsedResearchEntity.type === 'quote' && (
                            <div>
                              <label className="font-semibold text-[#6E6454] block mb-1">Quote Text</label>
                              <textarea 
                                value={editFields.text || ''}
                                onChange={(e) => setEditFields({ ...editFields, text: e.target.value })}
                                rows={3}
                                className="w-full p-2 border border-[#E6E1D6] rounded focus:outline-none focus:border-[#8C6D1F]"
                              />
                            </div>
                          )}

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="font-semibold text-[#6E6454] block mb-1">Year</label>
                              <input 
                                type="number"
                                value={editFields.year || ''}
                                onChange={(e) => setEditFields({ ...editFields, year: Number(e.target.value) })}
                                className="w-full px-3 py-2 border border-[#E6E1D6] rounded focus:outline-none focus:border-[#8C6D1F]"
                              />
                            </div>
                            {parsedResearchEntity.type === 'lecture' && (
                              <div>
                                <label className="font-semibold text-[#6E6454] block mb-1">Duration</label>
                                <input 
                                  type="text"
                                  value={editFields.duration || ''}
                                  onChange={(e) => setEditFields({ ...editFields, duration: e.target.value })}
                                  className="w-full px-3 py-2 border border-[#E6E1D6] rounded focus:outline-none focus:border-[#8C6D1F]"
                                />
                              </div>
                            )}
                          </div>

                          {parsedResearchEntity.type === 'lecture' && (
                            <div>
                              <label className="font-semibold text-[#6E6454] block mb-1">Series / Subtitle</label>
                              <input 
                                type="text"
                                value={editFields.series || ''}
                                onChange={(e) => setEditFields({ ...editFields, series: e.target.value })}
                                className="w-full px-3 py-2 border border-[#E6E1D6] rounded focus:outline-none focus:border-[#8C6D1F]"
                              />
                            </div>
                          )}

                          {parsedResearchEntity.type === 'book' && (
                            <div>
                              <label className="font-semibold text-[#6E6454] block mb-1">Publisher</label>
                              <input 
                                type="text"
                                value={editFields.publisher || ''}
                                onChange={(e) => setEditFields({ ...editFields, publisher: e.target.value })}
                                className="w-full px-3 py-2 border border-[#E6E1D6] rounded focus:outline-none focus:border-[#8C6D1F]"
                              />
                            </div>
                          )}

                          {parsedResearchEntity.type === 'quote' && (
                            <div>
                              <label className="font-semibold text-[#6E6454] block mb-1">Source Lecture or Book</label>
                              <input 
                                type="text"
                                value={editFields.sourceLectureOrBook || ''}
                                onChange={(e) => setEditFields({ ...editFields, sourceLectureOrBook: e.target.value })}
                                className="w-full px-3 py-2 border border-[#E6E1D6] rounded focus:outline-none focus:border-[#8C6D1F]"
                              />
                            </div>
                          )}

                          <div>
                            <label className="font-semibold text-[#6E6454] block mb-1">Summary / Description</label>
                            <textarea 
                              value={editFields.summary || editFields.description || editFields.context || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (parsedResearchEntity.type === 'lecture') setEditFields({ ...editFields, summary: val });
                                else if (parsedResearchEntity.type === 'book') setEditFields({ ...editFields, description: val });
                                else if (parsedResearchEntity.type === 'quote') setEditFields({ ...editFields, context: val });
                              }}
                              rows={3}
                              className="w-full p-2 border border-[#E6E1D6] rounded focus:outline-none focus:border-[#8C6D1F]"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3 text-xs">
                          <div className="flex justify-between border-b border-[#F4F0E8] pb-2">
                            <span className="font-semibold text-[#6E6454]">Type</span>
                            <span className="font-bold uppercase text-[#8C6D1F]">{parsedResearchEntity.type}</span>
                          </div>
                          {parsedResearchEntity.type !== 'quote' && (
                            <div className="flex justify-between border-b border-[#F4F0E8] pb-2">
                              <span className="font-semibold text-[#6E6454]">Title</span>
                              <span className="text-[#1E1C18] text-right truncate max-w-[180px]">{editFields.title || 'Untitled'}</span>
                            </div>
                          )}
                          <div className="flex justify-between border-b border-[#F4F0E8] pb-2">
                            <span className="font-semibold text-[#6E6454]">Year</span>
                            <span className="text-[#1E1C18]">{editFields.year || '1970'}</span>
                          </div>
                          {parsedResearchEntity.type === 'lecture' && (
                            <div className="flex justify-between border-b border-[#F4F0E8] pb-2">
                              <span className="font-semibold text-[#6E6454]">Series</span>
                              <span className="text-[#1E1C18] text-right truncate max-w-[180px]">{editFields.series || 'Master Lectures'}</span>
                            </div>
                          )}
                          {parsedResearchEntity.type === 'book' && (
                            <div className="flex justify-between border-b border-[#F4F0E8] pb-2">
                              <span className="font-semibold text-[#6E6454]">Publisher</span>
                              <span className="text-[#1E1C18] text-right truncate max-w-[180px]">{editFields.publisher || 'Vintage Books'}</span>
                            </div>
                          )}
                          {parsedResearchEntity.type === 'quote' && (
                            <div className="flex justify-between border-b border-[#F4F0E8] pb-2">
                              <span className="font-semibold text-[#6E6454]">Source</span>
                              <span className="text-[#1E1C18] text-right truncate max-w-[180px]">{editFields.sourceLectureOrBook || 'Unknown'}</span>
                            </div>
                          )}
                          <p className="text-[#6E6454] leading-relaxed italic line-clamp-3">
                            "{editFields.summary || editFields.description || editFields.text || 'No description extracted.'}"
                          </p>
                        </div>
                      )}

                      {commitFeedback && (
                        <div className={`p-3.5 rounded-lg flex gap-2 items-start border text-xs ${
                          commitFeedback.type === 'success' 
                            ? 'bg-green-50 border-green-200 text-green-800' 
                            : 'bg-red-50 border-red-200 text-red-800'
                        }`}>
                          <CheckCircle size={14} className="mt-0.5 shrink-0" />
                          <p className="font-medium leading-normal">{commitFeedback.message}</p>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={handleCommitResearchEntity}
                        className="w-full py-3 bg-[#8C6D1F] hover:bg-[#735817] text-white text-xs font-bold uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
                      >
                        <CheckCircle size={14} />
                        <span>Commit Sourced Entry to App State</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {researchCitations.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-[#E6E1D6]">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-[#6E6454]">
                    Source Grounding Links (Google Search)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {researchCitations.map((citation, idx) => (
                      <a
                        key={idx}
                        href={citation.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 bg-white border border-[#E6E1D6] hover:border-[#8C6D1F] rounded-xl text-xs font-semibold text-[#1E1C18] transition-colors group"
                      >
                        <div className="truncate pr-2">
                          <p className="font-serif font-bold text-sm truncate">{citation.title || 'Source Citation'}</p>
                          <p className="text-[10px] text-[#6E6454] truncate mt-0.5">{citation.uri}</p>
                        </div>
                        <ExternalLink size={13} className="text-[#6E6454] group-hover:text-[#8C6D1F] shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Media & MP3 Uploader */}
      {activeTab === 'media' && (
        <div className="space-y-8">
          {/* Main registrar form */}
          <div className="bg-[#F4F0E8] border border-[#E6E1D6] rounded-2xl p-6 sm:p-10 space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-serif text-[#1E1C18]">Master Audio & Transcript Registrar</h2>
              <p className="text-xs text-[#6E6454] max-w-2xl leading-relaxed">
                Connect your physical or downloaded Alan Watts audio lectures. Drag-and-drop or select an `.mp3` file to save it securely into the browser's persistent IndexedDB database. You can instantly test-play the audio or write associated verbatim transcript segments.
              </p>
            </div>

            <form onSubmit={handleRegisterLecture} className="space-y-6">
              {/* File Upload Box */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-[#6E6454] block">
                  Select Audio Recording File (.mp3)
                </label>
                <div className="border-2 border-dashed border-[#C9A227]/40 hover:border-[#8C6D1F] rounded-xl p-8 bg-white transition-all text-center flex flex-col items-center justify-center space-y-3 relative group">
                  <input
                    type="file"
                    accept="audio/mp3,audio/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="w-12 h-12 rounded-full bg-[#8C6D1F]/10 flex items-center justify-center text-[#8C6D1F] group-hover:scale-110 transition-transform">
                    <Upload size={22} />
                  </div>
                  {uploadFile ? (
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-[#1E1C18] truncate max-w-md">{uploadFile.name}</p>
                      <p className="text-xs font-mono text-[#8C6D1F]">
                        Size: {(uploadFile.size / (1024 * 1024)).toFixed(2)} MB • Detected Duration: {analyzedDurationStr}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-medium text-[#1E1C18]">Drag and drop your MP3 file here, or click to browse</p>
                      <p className="text-xs text-[#6E6454] mt-1 font-mono">Compatible with any standard raw MPEG-3 media stream</p>
                    </div>
                  )}
                </div>
              </div>

              {uploadFile && (
                <div className="p-4 bg-[#8C6D1F]/10 border border-[#8C6D1F]/20 rounded-xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#8C6D1F] animate-pulse" />
                    <span className="text-xs font-semibold text-[#1E1C18]">
                      Local audio session loaded. Ready to play or register.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleTestPlay}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#1E1C18] hover:bg-[#322D27] text-white text-[11px] font-bold uppercase tracking-wider rounded-lg transition-colors"
                  >
                    <Play size={12} className="fill-current" />
                    <span>Test Play in Player</span>
                  </button>
                </div>
              )}

              {/* Lecture Attributes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#6E6454]">Lecture Title</label>
                  <input
                    type="text"
                    required
                    value={lectureTitle}
                    onChange={(e) => setLectureTitle(e.target.value)}
                    placeholder="e.g. The Nature of Anxiety"
                    className="w-full px-4 py-3 bg-white border border-[#E6E1D6] rounded-xl text-xs focus:outline-none focus:border-[#8C6D1F]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#6E6454]">Series / Category</label>
                  <input
                    type="text"
                    value={lectureSeries}
                    onChange={(e) => setLectureSeries(e.target.value)}
                    placeholder="e.g. Out of Your Mind, Private Seminars"
                    className="w-full px-4 py-3 bg-white border border-[#E6E1D6] rounded-xl text-xs focus:outline-none focus:border-[#8C6D1F]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#6E6454]">Estimated Year</label>
                  <input
                    type="number"
                    value={lectureYear}
                    onChange={(e) => setLectureYear(Number(e.target.value))}
                    placeholder="e.g. 1968"
                    className="w-full px-4 py-3 bg-white border border-[#E6E1D6] rounded-xl text-xs focus:outline-none focus:border-[#8C6D1F]"
                  />
                </div>
              </div>

              {/* Editorial Summary */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-[#6E6454]">Editorial Summary</label>
                <textarea
                  value={lectureSummary}
                  onChange={(e) => setLectureSummary(e.target.value)}
                  placeholder="Provide an editorial summary of the topics discussed..."
                  rows={3}
                  className="w-full p-4 bg-white border border-[#E6E1D6] rounded-xl text-xs focus:outline-none focus:border-[#8C6D1F]"
                />
              </div>

              {/* Key Ideas */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#6E6454]">Key Insights / Bullet Points</label>
                  <span className="text-[10px] text-[#6E6454] font-mono">One point per line</span>
                </div>
                <textarea
                  value={lectureKeyIdeas}
                  onChange={(e) => setLectureKeyIdeas(e.target.value)}
                  placeholder="The separate ego is a social illusion&#10;Playing the game of life versus work&#10;The ecology of human relations"
                  rows={3}
                  className="w-full p-4 bg-white border border-[#E6E1D6] rounded-xl text-xs focus:outline-none focus:border-[#8C6D1F]"
                />
              </div>

              {/* Transcript Text */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#6E6454]">Verbatim Transcript</label>
                  <span className="text-[10px] text-[#6E6454] font-mono">Supports [mm:ss] timestamp format or raw text lines</span>
                </div>
                <textarea
                  value={lectureTranscriptText}
                  onChange={(e) => setLectureTranscriptText(e.target.value)}
                  placeholder="e.g.:&#10;[00:00] Let us consider what it means to look at a cloud.&#10;[01:15] A cloud has no destination; it doesn't move toward some goal.&#10;[02:40] And that is exactly what the music of life does."
                  rows={6}
                  className="w-full p-4 bg-white border border-[#E6E1D6] rounded-xl text-xs font-mono focus:outline-none focus:border-[#8C6D1F]"
                />
                <p className="text-[10px] text-[#6E6454] leading-relaxed">
                  <strong>Smart Timestamps Tip</strong>: If you do not include timestamps, our compiler will automatically distribute your lines evenly across the MP3 duration.
                </p>
              </div>

              {mediaFeedback && (
                <div className={`p-4 rounded-xl flex gap-3 items-start border ${
                  mediaFeedback.type === 'success' 
                    ? 'bg-green-50 border-green-200 text-green-800' 
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}>
                  {mediaFeedback.type === 'success' ? <CheckCircle size={16} className="mt-0.5" /> : <AlertCircle size={16} className="mt-0.5" />}
                  <p className="text-xs font-medium leading-relaxed">{mediaFeedback.message}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSavingMedia}
                className="w-full py-4 bg-[#8C6D1F] hover:bg-[#735817] disabled:bg-[#736B5E]/50 text-white text-xs font-bold uppercase tracking-widest transition-all rounded-xl flex items-center justify-center gap-2"
              >
                {isSavingMedia ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Writing Audio to IndexedDB & Indexing Records...</span>
                  </>
                ) : (
                  <>
                    <Wrench size={14} />
                    <span>Publish & Sync to Local Archive</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Manage Registered Audio Files */}
          <div className="bg-[#F4F0E8] border border-[#E6E1D6] rounded-2xl p-6 sm:p-10 space-y-6">
            <div>
              <h3 className="text-lg font-serif text-[#1E1C18]">Registered Custom Audio Records</h3>
              <p className="text-xs text-[#6E6454] mt-1 leading-relaxed">
                The following custom audio entries are stored in your browser's LocalStorage and IndexedDB database. They will persist between sessions in this browser.
              </p>
            </div>

            {customLecturesList.length === 0 ? (
              <div className="border border-dashed border-[#E6E1D6] rounded-xl p-8 text-center text-xs text-[#6E6454] bg-white">
                No custom audio recordings registered yet. Select an `.mp3` file above to get started.
              </div>
            ) : (
              <div className="bg-white border border-[#E6E1D6] rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#F4F0E8] border-b border-[#E6E1D6] font-bold text-[#6E6454]">
                        <th className="p-4">Title</th>
                        <th className="p-4">Series / Category</th>
                        <th className="p-4">Year</th>
                        <th className="p-4">Duration</th>
                        <th className="p-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E6E1D6]">
                      {customLecturesList.map((lec) => (
                        <tr key={lec.id} className="hover:bg-[#F4F0E8]/40 transition-colors">
                          <td className="p-4 font-medium text-[#1E1C18]">
                            <div className="flex items-center gap-2">
                              <Music size={13} className="text-[#8C6D1F]" />
                              <span>{lec.title}</span>
                            </div>
                          </td>
                          <td className="p-4 text-[#6E6454]">{lec.series}</td>
                          <td className="p-4 text-[#6E6454]">{lec.year}</td>
                          <td className="p-4 text-[#6E6454] font-mono">{lec.duration}</td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleDeleteCustomLecture(lec.id, lec.title)}
                              className="text-red-600 hover:text-red-800 p-1.5 rounded hover:bg-red-50 transition-all"
                              title="Delete Archive Entry"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Archival Photo Sourcing */}
      {activeTab === 'photos' && (
        <div className="space-y-8 bg-[#F4F0E8] border border-[#E6E1D6] rounded-2xl p-6 sm:p-10">
          <div className="space-y-2">
            <h2 className="text-2xl font-serif text-[#1E1C18]">Archival Asset Sourcing & Attribution Guide</h2>
            <p className="text-xs text-[#6E6454] max-w-2xl leading-relaxed">
              Locate high-resolution public domain or properly licensed images of Alan Watts. Click a source button below to open Google Images directly pre-configured with precise filters, or search manually.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#736B5E]" />
              <input
                type="text"
                value={photoQuery}
                onChange={(e) => setPhotoQuery(e.target.value)}
                placeholder="Alan Watts photograph query"
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-[#E6E1D6] rounded-xl text-sm focus:outline-none focus:border-[#8C6D1F]"
              />
            </div>
            <a
              href={`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(photoQuery)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 bg-[#1E1C18] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#3A352F] transition-colors rounded-xl flex items-center justify-center gap-2"
            >
              <Globe size={14} />
              <span>Launch Google Images</span>
              <ExternalLink size={12} />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {photoResources.map((res, idx) => (
              <div key={idx} className="bg-white border border-[#E6E1D6] rounded-xl p-6 space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-serif font-bold text-[#8C6D1F]">{res.title}</span>
                    <button
                      onClick={() => setPhotoQuery(res.query)}
                      className="text-[10px] font-mono font-bold bg-[#F4F0E8] text-[#1E1C18] px-2 py-0.5 rounded hover:bg-[#E6E1D6] transition-colors"
                    >
                      Use query
                    </button>
                  </div>
                  <p className="text-xs text-[#1E1C18] italic">"{res.query}"</p>
                  <p className="text-xs text-[#6E6454] leading-relaxed">{res.desc}</p>
                </div>

                <div className="pt-4 border-t border-[#F4F0E8] space-y-2">
                  <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#6E6454]">Required Attribution:</p>
                  <div className="flex items-center justify-between gap-4 p-2 bg-[#F4F0E8] rounded-lg text-xs font-medium text-[#1E1C18]">
                    <span className="truncate">{res.attribution}</span>
                    <button
                      onClick={() => handleCopyAttribution(res.attribution)}
                      className="shrink-0 text-[#8C6D1F] hover:text-[#735817]"
                      title="Copy Attribution"
                    >
                      {copiedText === res.attribution ? <CheckCircle size={15} /> : <Copy size={15} />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Code Sourcing Tip */}
          <div className="bg-[#E6E1D6]/40 rounded-xl p-4 flex gap-3 items-start border border-[#E6E1D6]">
            <CheckCircle size={16} className="text-[#8C6D1F] mt-0.5" />
            <div className="text-xs text-[#6E6454] leading-relaxed">
              <strong>Editorial Policy Tip</strong>: When adding images inside metadata, remember to add `referrerPolicy="no-referrer"` to standard image components on client views, ensuring Google-indexed images load perfectly.
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Data Input Portal */}
      {activeTab === 'input' && (
        <div className="space-y-8 bg-[#F4F0E8] border border-[#E6E1D6] rounded-2xl p-6 sm:p-10">
          <div className="space-y-2">
            <h2 className="text-2xl font-serif text-[#1E1C18]">Metadata Input & AI Parsing Portal</h2>
            <p className="text-xs text-[#6E6454] max-w-2xl leading-relaxed">
              Import new entries directly to the archive's state. You can either paste structured JSON directly, or paste unstructured plain text/citations to have our AI-grounded agent parse and convert them. Review the real-time card preview instantly before committing.
            </p>
          </div>

          {/* Mode Switcher & Templates */}
          <div className="flex flex-col md:flex-row gap-4 justify-between border-b border-[#E6E1D6] pb-5">
            <div className="flex gap-2 bg-white p-1 rounded-xl border border-[#E6E1D6] self-start">
              <button
                type="button"
                onClick={() => setInputMode('json')}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                  inputMode === 'json' ? 'bg-[#1E1C18] text-white' : 'text-[#6E6454] hover:bg-[#F4F0E8]'
                }`}
              >
                Structured JSON
              </button>
              <button
                type="button"
                onClick={() => setInputMode('text')}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                  inputMode === 'text' ? 'bg-[#1E1C18] text-white' : 'text-[#6E6454] hover:bg-[#F4F0E8]'
                }`}
              >
                AI-Driven Parser (Plain Text)
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#6E6454] mr-1">Target Schema:</span>
              <button
                onClick={() => { setDataType('lecture'); setPasteContent(JSON.stringify(templates.lecture, null, 2)); }}
                className={`px-3 py-1.5 text-[11px] font-semibold rounded-lg border transition-all ${
                  dataType === 'lecture' ? 'bg-[#8C6D1F] border-[#8C6D1F] text-white' : 'bg-white border-[#E6E1D6] text-[#1E1C18]'
                }`}
              >
                Lecture
              </button>
              <button
                onClick={() => { setDataType('book'); setPasteContent(JSON.stringify(templates.book, null, 2)); }}
                className={`px-3 py-1.5 text-[11px] font-semibold rounded-lg border transition-all ${
                  dataType === 'book' ? 'bg-[#8C6D1F] border-[#8C6D1F] text-white' : 'bg-white border-[#E6E1D6] text-[#1E1C18]'
                }`}
              >
                Book
              </button>
              <button
                onClick={() => { setDataType('quote'); setPasteContent(JSON.stringify(templates.quote, null, 2)); }}
                className={`px-3 py-1.5 text-[11px] font-semibold rounded-lg border transition-all ${
                  dataType === 'quote' ? 'bg-[#8C6D1F] border-[#8C6D1F] text-white' : 'bg-white border-[#E6E1D6] text-[#1E1C18]'
                }`}
              >
                Quote
              </button>

              <div className="h-6 w-[1px] bg-[#E6E1D6] mx-2 hidden sm:block" />

              <button
                onClick={handleClearCustomData}
                className="flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-800 transition-colors bg-white px-3 py-1.5 rounded-lg border border-[#E6E1D6]"
              >
                <Trash2 size={13} />
                <span>Reset Store</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Input Side */}
            <div className="space-y-4">
              {inputMode === 'json' ? (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#6E6454]">Paste JSON Payload</label>
                    <button
                      type="button"
                      onClick={() => setPasteContent(JSON.stringify(templates[dataType], null, 2))}
                      className="text-xs text-[#8C6D1F] hover:underline"
                    >
                      Reset to Template
                    </button>
                  </div>
                  <textarea
                    value={pasteContent}
                    onChange={(e) => setPasteContent(e.target.value)}
                    placeholder="Paste valid JSON array or object..."
                    rows={12}
                    className="w-full p-4 bg-white border border-[#E6E1D6] rounded-xl text-xs font-mono focus:outline-none focus:border-[#8C6D1F] shadow-inner"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#6E6454]">Paste Raw Text or Messy Citations</label>
                    <textarea
                      value={rawTextContent}
                      onChange={(e) => setRawTextContent(e.target.value)}
                      placeholder="Paste unstructured notes, amazon listings, citations, transcripts, or bibliographies here..."
                      rows={10}
                      className="w-full p-4 bg-white border border-[#E6E1D6] rounded-xl text-xs focus:outline-none focus:border-[#8C6D1F] shadow-inner"
                    />
                  </div>

                  <button
                    type="button"
                    disabled={isParsingText}
                    onClick={handleAIParseText}
                    className="w-full py-3.5 bg-[#8C6D1F] hover:bg-[#735817] disabled:bg-[#736B5E]/50 text-white text-xs font-bold uppercase tracking-widest transition-colors rounded-xl flex items-center justify-center gap-2"
                  >
                    {isParsingText ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>AI Parsing unstructured text...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={14} />
                        <span>Parse Text with AI Grounding</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {inputFeedback && (
                <div className={`p-4 rounded-xl flex gap-3 items-start border ${
                  inputFeedback.type === 'success' 
                    ? 'bg-green-50 border-green-200 text-green-800' 
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}>
                  {inputFeedback.type === 'success' ? <CheckCircle size={16} className="mt-0.5" /> : <AlertCircle size={16} className="mt-0.5" />}
                  <p className="text-xs font-medium leading-relaxed">{inputFeedback.message}</p>
                </div>
              )}

              {inputMode === 'json' && (
                <button
                  type="button"
                  onClick={handleImportData}
                  className="w-full py-4 bg-[#1E1C18] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#3A352F] transition-all rounded-xl shadow-sm"
                >
                  Validate & Commit to Archive Store
                </button>
              )}
            </div>

            {/* Live Component Preview Panel */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#6E6454]">
                  Archival Component Live Preview
                </h3>
                {previewData ? (
                  <span className="text-[10px] bg-green-100 text-green-800 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Valid Schema
                  </span>
                ) : (
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider animate-pulse">
                    Awaiting Valid JSON
                  </span>
                )}
              </div>

              <div className="p-6 bg-white border border-[#E6E1D6] rounded-xl flex flex-col justify-center min-h-[260px] transition-all">
                {previewData ? (
                  <div className="space-y-4">
                    {dataType === 'lecture' && (
                      <LectureCard 
                        lecture={{
                          id: previewData.id || 'temp-id',
                          title: previewData.title || 'Untitled Custom Lecture',
                          slug: previewData.slug || 'untitled-slug',
                          series: previewData.series || 'Master Lectures',
                          year: Number(previewData.year) || 1970,
                          duration: previewData.duration || '30:00',
                          durationSeconds: Number(previewData.durationSeconds) || 1800,
                          verificationStatus: previewData.verificationStatus || 'verified-source',
                          sourceNote: previewData.sourceNote || 'Custom imported metadata.',
                          summary: previewData.summary || 'Summary placeholder.',
                          keyIdeas: previewData.keyIdeas || [],
                          topics: previewData.topics || ['life-as-play-work-and-purpose'],
                          transcript: previewData.transcript || []
                        }}
                        onClick={() => {}}
                      />
                    )}
                    {dataType === 'book' && (
                      <BookCard 
                        book={{
                          id: previewData.id || 'temp-id',
                          title: previewData.title || 'Untitled Custom Book',
                          slug: previewData.slug || 'untitled-slug',
                          year: Number(previewData.year) || 1970,
                          publisher: previewData.publisher || 'Unknown Publisher',
                          description: previewData.description || 'Description placeholder.',
                          coverImage: previewData.coverImage || 'https://covers.openlibrary.org/b/isbn/0679723005-L.jpg',
                          keyThemes: previewData.keyThemes || [],
                          audiobookAvailable: !!previewData.audiobookAvailable,
                          purchaseUrl: previewData.purchaseUrl || ''
                        }}
                        onClick={() => {}}
                      />
                    )}
                    {dataType === 'quote' && (
                      <QuoteCard 
                        quote={{
                          id: previewData.id || 'temp-id',
                          text: previewData.text || 'Quote text placeholder.',
                          slug: previewData.slug || 'untitled-slug',
                          sourceLectureOrBook: previewData.sourceLectureOrBook || 'Unknown Source',
                          year: Number(previewData.year) || 1970,
                          verificationStatus: previewData.verificationStatus || 'verified-source',
                          context: previewData.context || 'Context placeholder.',
                          interpretation: previewData.interpretation || 'Interpretation placeholder.',
                          topics: previewData.topics || ['ego-identity-and-the-separate-self']
                        }}
                        onClick={() => {}}
                      />
                    )}

                    <div className="pt-4 border-t border-[#F4F0E8] text-[10px] font-mono text-[#6E6454] space-y-1">
                      <p><strong>Database ID:</strong> {previewData.id || 'N/A (will auto-generate)'}</p>
                      <p><strong>Route Slug:</strong> {previewData.slug || 'N/A (will auto-generate)'}</p>
                      <p><strong>Attribution Year:</strong> {previewData.year || 'N/A'}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-3 py-12">
                    <FileCode size={36} className="mx-auto text-[#8C6D1F]/30" />
                    <p className="text-xs text-[#6E6454] font-semibold">No Preview Available</p>
                    <p className="text-[10px] text-[#6E6454]/80 max-w-xs mx-auto leading-relaxed">
                      Paste structured JSON or use the AI-Driven Plain Text Parser to see the card component rendered live.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="pt-8 border-t border-[#D1CECA] flex justify-between items-center">
        <button
          onClick={() => onNavigate({ type: 'home' })}
          className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-[#1A1A1A] hover:text-[#8C6D1F]"
        >
          <span>← Back to Archive Home</span>
        </button>
        <button
          onClick={() => onNavigate({ type: 'resources' })}
          className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest bg-[#1A1A1A] text-[#F9F7F2] px-6 py-3 hover:bg-[#333333] transition-colors rounded-xl"
        >
          <span>Root Resource Hub</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};
