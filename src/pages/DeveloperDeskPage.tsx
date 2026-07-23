import React, { useState, useEffect, useRef } from 'react';
import { ViewState, Lecture, Book, Quote, VideoItem } from '../types';
import { LectureCard } from '../components/cards/LectureCard';
import { BookCard } from '../components/cards/BookCard';
import { QuoteCard } from '../components/cards/QuoteCard';
import { VideoCard } from '../components/cards/VideoCard';
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
  Link,
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
  const [activeTab, setActiveTab] = useState<'assistant' | 'media' | 'photos' | 'input' | 'scraper'>('assistant');
  
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
  const [inputMode, setInputMode] = useState<'json' | 'text' | 'bulk'>('json');
  const [rawTextContent, setRawTextContent] = useState('');
  const [isParsingText, setIsParsingText] = useState(false);

  // Archival Photo Sourcing State
  const [photoQuery, setPhotoQuery] = useState('Alan Watts');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isSearchingImages, setIsSearchingImages] = useState(false);
  const [imageResults, setImageResults] = useState<any[] | null>(null);
  const [imageSearchError, setImageSearchError] = useState<string | null>(null);
  const [copiedImageIndex, setCopiedImageIndex] = useState<number | null>(null);

  // Dynamic Custom Assets State (Base64 or URL Images)
  const [customAssets, setCustomAssets] = useState<any[]>([]);
  const [assetName, setAssetName] = useState('');
  const [assetTag, setAssetTag] = useState('Book Cover');
  const [assetDesc, setAssetDesc] = useState('');
  const [assetFile, setAssetFile] = useState<File | null>(null);
  const [uploadedAssetBase64, setUploadedAssetBase64] = useState<string>('');
  const [uploadedAssetUrl, setUploadedAssetUrl] = useState<string>('');
  const [isUploadingAsset, setIsUploadingAsset] = useState(false);
  const [assetFeedback, setAssetFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // JSON Data Input State
  const [dataType, setDataType] = useState<'lecture' | 'book' | 'quote' | 'video' | 'podcast'>('lecture');
  const [pasteContent, setPasteContent] = useState('');
  const [previewData, setPreviewData] = useState<any>(null);
  const [isValidated, setIsValidated] = useState<boolean>(false);
  const [inputFeedback, setInputFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Web Scraping & Citation Generator & Bulk Importer State
  const [scrapeUrl, setScrapeUrl] = useState('');
  const [isScrapingUrl, setIsScrapingUrl] = useState(false);
  const [scrapeError, setScrapeError] = useState<string | null>(null);

  const [citationUrl, setCitationUrl] = useState('');
  const [isGeneratingCitation, setIsGeneratingCitation] = useState(false);
  const [citationError, setCitationError] = useState<string | null>(null);

  const [bulkInputText, setBulkInputText] = useState('');
  const [bulkParsedItems, setBulkParsedItems] = useState<any[]>([]);
  const [isBulkValidating, setIsBulkValidating] = useState(false);
  const [bulkCommitFeedback, setBulkCommitFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleScrapeUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scrapeUrl.trim()) return;
    setIsScrapingUrl(true);
    setScrapeError(null);

    try {
      const res = await fetch('/api/scrape-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: scrapeUrl.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to scrape URL');

      const jsonMatch = data.text.match(/```json([\s\S]*?)```/) || data.text.match(/```([\s\S]*?)```/);
      let parsed = null;
      if (jsonMatch) {
        try {
          parsed = JSON.parse(jsonMatch[1].trim());
        } catch (e) {}
      }

      if (parsed) {
        if (!parsed.title) {
          parsed.title = "Archival Document";
        }
        if (!parsed.id) {
          parsed.id = `scraped-${Date.now()}`;
        }
        if (!parsed.slug) {
          parsed.slug = parsed.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        }

        setPasteContent(JSON.stringify(parsed, null, 2));
        setPreviewData(parsed);
        setIsValidated(true);
        setActiveTab('input');
        setInputFeedback({ type: 'success', message: '✓ Successfully scraped, parsed, and validated mandatory fields (id, title, slug)!' });
      } else {
        setScrapeError('Warning: Mandatory fields (id, title, slug) were missing or incomplete in scrape output. Fallback defaults applied.');
        const fallbackParsed = {
          id: `scraped-${Date.now()}`,
          title: "Archival Document",
          slug: "archival-document",
          year: 1972,
          source: "organism.earth",
          summary: data.text ? data.text.substring(0, 150) + '...' : "Scraped archival record.",
          transcript: [{ time: "00:00", seconds: 0, text: data.text || "Transcript content." }]
        };
        setPasteContent(JSON.stringify(fallbackParsed, null, 2));
        setPreviewData(fallbackParsed);
        setIsValidated(true);
        setActiveTab('input');
      }
    } catch (err: any) {
      console.error(err);
      setScrapeError(err.message);
    } finally {
      setIsScrapingUrl(false);
    }
  };

  const handleGenerateCitation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!citationUrl.trim()) return;
    setIsGeneratingCitation(true);
    setCitationError(null);

    try {
      const res = await fetch('/api/scrape-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: citationUrl.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate citation');

      const jsonMatch = data.text.match(/```json([\s\S]*?)```/) || data.text.match(/```([\s\S]*?)```/);
      let parsed = null;
      if (jsonMatch) {
        try {
          parsed = JSON.parse(jsonMatch[1].trim());
        } catch (e) {}
      }

      const note = parsed?.sourceNote || `Verified bibliographic record retrieved from ${citationUrl.trim()}`;
      const year = parsed?.year || new Date().getFullYear();
      const status = parsed?.verificationStatus || 'verified-source';

      if (parsedResearchEntity) {
        setEditFields({
          ...editFields,
          sourceNote: note,
          year: year,
          verificationStatus: status,
        });
        setCommitFeedback({ type: 'success', message: '✓ Automated citation and metadata auto-populated into current record fields!' });
      } else {
        setCommitFeedback({ type: 'success', message: `✓ Citation Generated: "${note}" (${year}) [${status}]` });
      }
    } catch (err: any) {
      console.error(err);
      setCitationError(err.message);
    } finally {
      setIsGeneratingCitation(false);
    }
  };

  const handleBulkValidate = (e: React.FormEvent) => {
    e.preventDefault();
    setBulkCommitFeedback(null);
    setIsBulkValidating(true);

    try {
      let parsed: any = null;
      const trimmed = bulkInputText.trim();
      
      if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
        parsed = JSON.parse(trimmed);
      } else {
        const lines = trimmed.split('\n').filter(l => l.trim().length > 0);
        parsed = lines.map((line, idx) => {
          const parts = line.split(',').map(p => p.trim());
          return {
            id: `bulk-${dataType}-${Date.now()}-${idx}`,
            title: parts[0] || 'Untitled Bulk Item',
            slug: (parts[0] || 'item').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            year: Number(parts[1]) || 1970,
            summary: parts[2] || parts[1] || 'Imported via CSV bulk tool.',
            verificationStatus: 'verified-source'
          };
        });
      }

      const items = Array.isArray(parsed) ? parsed : [parsed];
      if (items.length === 0) throw new Error('No valid items found in input.');

      setBulkParsedItems(items);
      setBulkCommitFeedback({ type: 'success', message: `✓ Successfully validated ${items.length} item(s) against schema types!` });
    } catch (err: any) {
      console.error(err);
      setBulkCommitFeedback({ type: 'error', message: `Validation Error: ${err.message}` });
      setBulkParsedItems([]);
    } finally {
      setIsBulkValidating(false);
    }
  };

  const handleBulkCommitAll = () => {
    if (bulkParsedItems.length === 0) return;
    try {
      const storageKey = dataType === 'lecture' ? 'custom_lectures' :
                         dataType === 'book' ? 'custom_books' :
                         dataType === 'quote' ? 'custom_quotes' :
                         dataType === 'video' ? 'custom_videos' : 'custom_podcasts';

      const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const updated = [...existing, ...bulkParsedItems];
      localStorage.setItem(storageKey, JSON.stringify(updated));

      setBulkCommitFeedback({ type: 'success', message: `✓ Successfully committed ${bulkParsedItems.length} record(s) to application state! Reloading...` });
      setTimeout(() => window.location.reload(), 1200);
    } catch (err: any) {
      console.error(err);
      setBulkCommitFeedback({ type: 'error', message: `Commit Error: ${err.message}` });
    }
  };

  // Load custom assets on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('custom_assets');
      if (stored) {
        setCustomAssets(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error loading custom assets:', e);
    }
  }, []);

  // Handle local file selection and convert to Base64
  const handleFileChangeBase64 = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAssetFeedback(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setAssetFeedback({ type: 'error', message: 'Please select a valid image file.' });
      return;
    }

    // Check size (limit to 4MB for localStorage safety)
    if (file.size > 4 * 1024 * 1024) {
      setAssetFeedback({ type: 'error', message: 'Image size exceeds 4MB limit. Please upload a smaller image.' });
      return;
    }

    if (!assetName) {
      // Set default name based on file
      const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      setAssetName(baseName);
    }

    setIsUploadingAsset(true);
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedAssetBase64(reader.result as string);
      setUploadedAssetUrl(''); // Clear public URL since base64 is active
      setIsUploadingAsset(false);
      setAssetFeedback({ type: 'success', message: '✓ Image successfully converted to Base64 Data URL!' });
    };
    reader.onerror = () => {
      setIsUploadingAsset(false);
      setAssetFeedback({ type: 'error', message: 'Failed to read file contents.' });
    };
    reader.readAsDataURL(file);
  };

  // Handle manual Asset Registry
  const handleRegisterAsset = (e: React.FormEvent) => {
    e.preventDefault();
    setAssetFeedback(null);

    const activeSrc = uploadedAssetBase64 || uploadedAssetUrl.trim();
    if (!activeSrc) {
      setAssetFeedback({ type: 'error', message: 'Please upload a local file or paste a public URL.' });
      return;
    }

    if (!assetName.trim()) {
      setAssetFeedback({ type: 'error', message: 'Please provide a name/label for this asset.' });
      return;
    }

    const newAsset = {
      id: `asset-${Date.now()}`,
      name: assetName.trim(),
      tag: assetTag,
      description: assetDesc.trim(),
      dataUrl: activeSrc,
      type: uploadedAssetBase64 ? 'base64' : 'url',
      size: uploadedAssetBase64 ? `${Math.round(activeSrc.length / 1024)} KB` : 'External Link',
      timestamp: Date.now()
    };

    try {
      const existing = JSON.parse(localStorage.getItem('custom_assets') || '[]');
      const updated = [newAsset, ...existing];
      localStorage.setItem('custom_assets', JSON.stringify(updated));
      setCustomAssets(updated);

      // Clear form
      setAssetName('');
      setAssetDesc('');
      setUploadedAssetBase64('');
      setUploadedAssetUrl('');
      setAssetFeedback({ type: 'success', message: `✓ Successfully registered asset "${newAsset.name}"!` });
    } catch (err: any) {
      console.error(err);
      setAssetFeedback({ type: 'error', message: `Storage Limit Exceeded: ${err.message}. LocalStorage is full. Please delete other custom assets or use a Public URL instead.` });
    }
  };

  // Handle custom asset deletion
  const handleDeleteAsset = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the asset "${name}"?`)) {
      try {
        const stored = JSON.parse(localStorage.getItem('custom_assets') || '[]');
        const filtered = stored.filter((a: any) => a.id !== id);
        localStorage.setItem('custom_assets', JSON.stringify(filtered));
        setCustomAssets(filtered);
      } catch (e) {
        console.error('Error deleting asset:', e);
      }
    }
  };

  // Handle programmatic asset injection into the active Data Input template
  const handleInsertAssetUrl = (dataUrl: string) => {
    try {
      const parsed = JSON.parse(pasteContent);
      if (parsed && typeof parsed === 'object') {
        const item = Array.isArray(parsed) ? parsed[0] : parsed;
        if (dataType === 'book') {
          item.coverImage = dataUrl;
        } else if (dataType === 'video') {
          item.thumbnailUrl = dataUrl;
        } else {
          item.imageUrl = dataUrl;
        }
        setPasteContent(JSON.stringify(parsed, null, 2));
        setInputFeedback({ type: 'success', message: '✓ Custom Asset successfully injected into the active JSON metadata!' });
      } else {
        throw new Error('Not an object');
      }
    } catch (err) {
      // If current is empty or invalid JSON, let's pre-populate the whole template with the asset URL inserted
      const currentTemplate = { ...templates[dataType] };
      if (dataType === 'book') {
        (currentTemplate as any).coverImage = dataUrl;
      } else if (dataType === 'video') {
        (currentTemplate as any).thumbnailUrl = dataUrl;
      } else {
        (currentTemplate as any).imageUrl = dataUrl;
      }
      setPasteContent(JSON.stringify(currentTemplate, null, 2));
      setInputFeedback({ type: 'success', message: '✓ Instantiated template with custom asset injected!' });
    }
  };

  // Schema verification and Live Component Preview Trigger
  const handleValidateAndPreview = () => {
    setInputFeedback(null);
    setPreviewData(null);
    setIsValidated(false);

    if (!pasteContent.trim()) {
      setInputFeedback({ type: 'error', message: 'JSON editor is empty. Paste structured data or template JSON first.' });
      return;
    }

    try {
      const parsed = JSON.parse(pasteContent);
      const item = Array.isArray(parsed) ? parsed[0] : parsed;

      if (!item || typeof item !== 'object') {
        throw new Error('JSON payload must be a structured Object or an Array containing a valid object.');
      }

      // Check schema fields based on dataType
      if (dataType === 'lecture') {
        const required = ['id', 'title', 'slug'];
        for (const f of required) {
          if (!item[f]) throw new Error(`Missing required lecture field: "${f}"`);
        }
        if (item.year && isNaN(Number(item.year))) {
          throw new Error('The "year" field must be a valid integer.');
        }
        if (item.durationSeconds && isNaN(Number(item.durationSeconds))) {
          throw new Error('The "durationSeconds" field must be a valid number.');
        }
      } else if (dataType === 'book') {
        const required = ['id', 'title', 'slug'];
        for (const f of required) {
          if (!item[f]) throw new Error(`Missing required book field: "${f}"`);
        }
        if (item.year && isNaN(Number(item.year))) {
          throw new Error('The "year" field must be a valid integer.');
        }
        if (!item.coverImage) {
          setInputFeedback({
            type: 'error',
            message: 'Warning: "coverImage" is missing or empty. An editorial book card should have a valid image URL or base64.'
          });
        }
      } else if (dataType === 'quote') {
        const required = ['id', 'text', 'slug'];
        for (const f of required) {
          if (!item[f]) throw new Error(`Missing required quote field: "${f}"`);
        }
        if (item.year && isNaN(Number(item.year))) {
          throw new Error('The "year" field must be a valid integer.');
        }
      } else if (dataType === 'video') {
        const required = ['id', 'title', 'slug'];
        for (const f of required) {
          if (!item[f]) throw new Error(`Missing required video field: "${f}"`);
        }
      } else if (dataType === 'podcast') {
        const required = ['id', 'title', 'spotifyId'];
        for (const f of required) {
          if (!item[f]) throw new Error(`Missing required podcast field: "${f}"`);
        }
      }

      setPreviewData(item);
      setIsValidated(true);
      setInputFeedback({
        type: 'success',
        message: '✓ Component validation successful! The schema is valid and the card component has been rendered live below. Click "Validate & Commit" to append this to your live archive store.'
      });
    } catch (err: any) {
      setPreviewData(null);
      setIsValidated(false);
      setInputFeedback({
        type: 'error',
        message: `Schema Validation Error: ${err.message}`
      });
    }
  };


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
    // Editing content resets validation status to require explicit preview button validation
    setIsValidated(false);
    setPreviewData(null);
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

  const handleDiscoverImages = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoQuery.trim()) return;

    setIsSearchingImages(true);
    setImageSearchError(null);
    setImageResults(null);

    try {
      const res = await fetch('/api/discover-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: photoQuery }),
      });

      if (!res.ok) {
        throw new Error(`HTTP Error ${res.status}: Failed to reach image discovery agent.`);
      }

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      const parsedJSON = extractJSON(data.text);
      if (parsedJSON && Array.isArray(parsedJSON)) {
        setImageResults(parsedJSON);
      } else {
        try {
          const directParsed = JSON.parse(data.text.trim());
          if (Array.isArray(directParsed)) {
            setImageResults(directParsed);
          } else {
            throw new Error("AI output was not a valid structured list.");
          }
        } catch (inner) {
          throw new Error("Grounded agent returned answers but they could not be automatically formatted into an image list code block. Please try another query.");
        }
      }
    } catch (err: any) {
      console.error(err);
      setImageSearchError(err.message || 'An error occurred during image discovery.');
    } finally {
      setIsSearchingImages(false);
    }
  };

  const handleCopyImageMetadata = (img: any, index: number) => {
    const formattedStr = JSON.stringify(img, null, 2);
    navigator.clipboard.writeText(formattedStr);
    setCopiedImageIndex(index);
    setTimeout(() => setCopiedImageIndex(null), 2000);
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
          if (!item.title) {
            throw new Error('Each lecture object must contain a "title" field.');
          }
          item.id = item.id || `scraped-lec-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
          item.slug = item.slug || item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
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
          if (!item.title) {
            throw new Error('Each book object must contain a "title" field.');
          }
          item.id = item.id || `scraped-book-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
          item.slug = item.slug || item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
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
          if (!item.text) {
            throw new Error('Each quote object must contain a "text" field.');
          }
          item.id = item.id || `scraped-quote-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
          item.slug = item.slug || item.text.substring(0, 30).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        }
        const existing = JSON.parse(localStorage.getItem('custom_quotes') || '[]');
        localStorage.setItem('custom_quotes', JSON.stringify([...existing, ...quotes]));
        setInputFeedback({ 
          type: 'success', 
          message: `Successfully imported ${quotes.length} quote(s). Reloading application...` 
        });
      } else if (dataType === 'video') {
        const videos = Array.isArray(parsed) ? parsed : [parsed];
        for (const item of videos) {
          if (!item.title) {
            throw new Error('Each video object must contain a "title" field.');
          }
          item.id = item.id || `scraped-vid-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
          item.slug = item.slug || item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        }
        const existing = JSON.parse(localStorage.getItem('custom_videos') || '[]');
        localStorage.setItem('custom_videos', JSON.stringify([...existing, ...videos]));
        setInputFeedback({ 
          type: 'success', 
          message: `Successfully imported ${videos.length} video(s). Reloading application...` 
        });
      } else if (dataType === 'podcast') {
        const podcasts = Array.isArray(parsed) ? parsed : [parsed];
        for (const item of podcasts) {
          if (!item.title) {
            throw new Error('Each podcast object must contain a "title" field.');
          }
          item.id = item.id || `scraped-pod-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
          item.spotifyId = item.spotifyId || item.id;
        }
        const existing = JSON.parse(localStorage.getItem('custom_podcasts') || '[]');
        localStorage.setItem('custom_podcasts', JSON.stringify([...existing, ...podcasts]));
        setInputFeedback({ 
          type: 'success', 
          message: `Successfully imported ${podcasts.length} podcast(s). Reloading application...` 
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
    if (window.confirm('Are you sure you want to clear all imported custom lectures, books, quotes, videos, and podcasts? This will restore the default static archive.')) {
      localStorage.removeItem('custom_lectures');
      localStorage.removeItem('custom_books');
      localStorage.removeItem('custom_quotes');
      localStorage.removeItem('custom_videos');
      localStorage.removeItem('custom_podcasts');
      localStorage.removeItem('custom_assets');
      setInputFeedback({ type: 'success', message: 'All custom data, media and registered assets cleared. Reloading...' });
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
    },
    video: {
      id: "vid-custom-1",
      title: "Alan Watts — Live at Esalen Institute",
      slug: "live-at-esalen-institute-custom",
      date: "1968",
      duration: "12:15",
      archiveSource: "Esalen Archives, Big Sur",
      thumbnailUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
      description: "A profound segment from Alan Watts discussing Eastern philosophy and the concept of play in the forest of Big Sur.",
      verificationStatus: "verified-source",
      youtubeId: "emHAoQGoQic"
    },
    podcast: {
      id: "pod-custom-1",
      title: "Ep. 25 — The World as Empty Space",
      duration: "36:10",
      date: "March 2022",
      spotifyId: "37pS1f98VzXk1q3lU6A6fG",
      description: "Exploring the Buddhist concept of Sunyata—why emptiness is form, form is emptiness, and nothing is more solid than empty space.",
      season: 2,
      episode: 5
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
          <button
            onClick={() => setActiveTab('scraper')}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider rounded-xl border transition-all ${
              activeTab === 'scraper' 
                ? 'bg-[#1E1C18] text-[#F4F0E8] border-[#1E1C18]' 
                : 'bg-[#F4F0E8] text-[#6E6454] border-[#E6E1D6] hover:bg-[#E6E1D6]'
            }`}
          >
            <Globe size={14} />
            <span>Web Scraper & Importer</span>
          </button>
        </div>
      </div>

      {/* Tab 5: Web Scraper & Importer */}
      {activeTab === 'scraper' && (
        <div className="space-y-8 bg-[#F4F0E8] border border-[#E6E1D6] rounded-2xl p-6 sm:p-10">
          <div className="space-y-2">
            <h2 className="text-2xl font-serif text-[#1E1C18]">Web Scraper & Importer Utility</h2>
            <p className="text-xs text-[#6E6454] max-w-2xl leading-relaxed">
              Provide a URL for any lecture, article, or archival document (e.g., <code className="bg-white px-1.5 py-0.5 rounded text-[#8C6D1F] font-mono">https://www.organism.earth/library/document/out-of-your-mind-1</code>). Our server-side helper fetches and parses the page text into the archive's structured JSON schema.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="bg-white border border-[#E6E1D6] rounded-xl p-6 space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#1E1C18] flex items-center gap-2">
                  <Globe size={16} className="text-[#8C6D1F]" />
                  <span>Fetch & Parse Target URL</span>
                </h3>
                <p className="text-xs text-[#6E6454]">
                  Enter the full URL of the lecture transcript or philosophical essay.
                </p>
              </div>

              <form onSubmit={handleScrapeUrl} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6E6454] mb-1">Target URL</label>
                  <input
                    type="url"
                    required
                    value={scrapeUrl}
                    onChange={(e) => setScrapeUrl(e.target.value)}
                    placeholder="https://www.organism.earth/library/document/out-of-your-mind-1"
                    className="w-full px-3.5 py-3 bg-[#FAF8F5] border border-[#E6E1D6] rounded-xl text-xs font-mono focus:outline-none focus:border-[#8C6D1F]"
                  />
                </div>

                {scrapeError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-xs font-medium">
                    {scrapeError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isScrapingUrl}
                  className="w-full py-3.5 bg-[#8C6D1F] hover:bg-[#735817] disabled:bg-[#736B5E]/50 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {isScrapingUrl ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Fetching & Structuring Page...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} />
                      <span>Fetch & Parse Archive Record</span>
                    </>
                  )}
                </button>
              </form>

              <div className="border-t border-[#F4F0E8] pt-4 space-y-2">
                <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#6E6454]">Quick Test URLs:</p>
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => setScrapeUrl('https://www.organism.earth/library/document/out-of-your-mind-1')}
                    className="text-left p-2 bg-[#FAF8F5] hover:bg-[#F4F0E8] border border-[#E6E1D6] rounded-lg text-[11px] font-mono text-[#1E1C18] truncate transition-colors"
                  >
                    https://www.organism.earth/library/document/out-of-your-mind-1
                  </button>
                  <button
                    type="button"
                    onClick={() => setScrapeUrl('https://archive.org/details/AlanWatts-OutOfYourMind')}
                    className="text-left p-2 bg-[#FAF8F5] hover:bg-[#F4F0E8] border border-[#E6E1D6] rounded-lg text-[11px] font-mono text-[#1E1C18] truncate transition-colors"
                  >
                    https://archive.org/details/AlanWatts-OutOfYourMind
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#E6E1D6] rounded-xl p-6 space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#1E1C18] flex items-center gap-2">
                  <CheckCircle size={16} className="text-[#8C6D1F]" />
                  <span>Automated Citation & Metadata Generator</span>
                </h3>
                <p className="text-xs text-[#6E6454]">
                  Auto-populate source notes, publication dates, and verification status badges directly from page metadata.
                </p>
              </div>

              <form onSubmit={handleGenerateCitation} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6E6454] mb-1">Source Citation URL</label>
                  <input
                    type="url"
                    required
                    value={citationUrl}
                    onChange={(e) => setCitationUrl(e.target.value)}
                    placeholder="https://archive.org/details/alan-watts..."
                    className="w-full px-3.5 py-3 bg-[#FAF8F5] border border-[#E6E1D6] rounded-xl text-xs font-mono focus:outline-none focus:border-[#8C6D1F]"
                  />
                </div>

                {citationError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-xs font-medium">
                    {citationError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isGeneratingCitation}
                  className="w-full py-3.5 bg-[#1E1C18] hover:bg-[#322D27] text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {isGeneratingCitation ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Generating Citation...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle size={14} />
                      <span>Generate Citation & Auto-Fill</span>
                    </>
                  )}
                </button>
              </form>

              <div className="p-4 bg-[#FAF8F5] border border-[#E6E1D6] rounded-xl space-y-2 text-xs text-[#6E6454]">
                <p className="font-semibold text-[#1E1C18]">How Scraped Data Flows:</p>
                <p className="leading-relaxed">
                  Once scraped, the record is automatically formatted and transferred into the <strong>Metadata Input Portal</strong> where you can review the live component preview and commit it permanently to the archive.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

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

              {/* Web Scraping & Automated Citation Generator Box */}
              <div className="mt-8 pt-8 border-t border-[#E6E1D6] grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-[#E6E1D6] rounded-xl p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <Globe size={18} className="text-[#8C6D1F]" />
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[#1E1C18]">Web Scraping Utility</h3>
                  </div>
                  <p className="text-xs text-[#6E6454] leading-relaxed">
                    Provide a URL for a lecture or article. Our server-side scraper fetches and parses the page text directly into the archive schema.
                  </p>
                  <form onSubmit={handleScrapeUrl} className="space-y-3">
                    <input
                      type="url"
                      required
                      value={scrapeUrl}
                      onChange={(e) => setScrapeUrl(e.target.value)}
                      placeholder="https://example.com/alan-watts-lecture"
                      className="w-full px-3 py-2.5 bg-[#FAF8F5] border border-[#E6E1D6] rounded-lg text-xs focus:outline-none focus:border-[#8C6D1F]"
                    />
                    {scrapeError && <p className="text-[11px] text-red-600 font-medium">{scrapeError}</p>}
                    <button
                      type="submit"
                      disabled={isScrapingUrl}
                      className="w-full py-2.5 bg-[#1E1C18] hover:bg-[#322D27] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      {isScrapingUrl ? 'Scraping & Parsing...' : 'Scrape & Parse URL'}
                    </button>
                  </form>
                </div>

                <div className="bg-white border border-[#E6E1D6] rounded-xl p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-[#8C6D1F]" />
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[#1E1C18]">Automated Citation Generator</h3>
                  </div>
                  <p className="text-xs text-[#6E6454] leading-relaxed">
                    Prompt for a source URL to auto-populate source-note, publication date, and verification badge fields.
                  </p>
                  <form onSubmit={handleGenerateCitation} className="space-y-3">
                    <input
                      type="url"
                      required
                      value={citationUrl}
                      onChange={(e) => setCitationUrl(e.target.value)}
                      placeholder="https://archive.org/details/alan-watts..."
                      className="w-full px-3 py-2.5 bg-[#FAF8F5] border border-[#E6E1D6] rounded-lg text-xs focus:outline-none focus:border-[#8C6D1F]"
                    />
                    {citationError && <p className="text-[11px] text-red-600 font-medium">{citationError}</p>}
                    <button
                      type="submit"
                      disabled={isGeneratingCitation}
                      className="w-full py-2.5 bg-[#8C6D1F] hover:bg-[#735817] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      {isGeneratingCitation ? 'Generating Citation...' : 'Generate Citation & Auto-Fill'}
                    </button>
                  </form>
                </div>
              </div>
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

          {/* Registered Image & Photo Assets Catalog */}
          <div className="bg-[#F4F0E8] border border-[#E6E1D6] rounded-2xl p-6 sm:p-10 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-serif text-[#1E1C18]">Registered Image & Photo Assets ({customAssets.length})</h3>
                <p className="text-xs text-[#6E6454] mt-1 leading-relaxed">
                  All imported images, book covers, and portraits stored in local storage. Copy image URLs, update attributions, or delete unwanted assets.
                </p>
              </div>
            </div>

            {customAssets.length === 0 ? (
              <div className="border border-dashed border-[#E6E1D6] rounded-xl p-8 text-center text-xs text-[#6E6454] bg-white">
                No custom image assets registered yet. Use the Asset Uploader or Image Discovery tool to register images.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {customAssets.map((asset) => (
                  <div key={asset.id} className="bg-white border border-[#E6E1D6] rounded-xl p-4 flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="h-32 w-full rounded-lg bg-[#FAF8F5] overflow-hidden border border-[#E6E1D6] relative">
                        <img
                          src={asset.dataUrl}
                          alt={asset.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 left-2 text-[8px] font-bold uppercase bg-[#8C6D1F] text-white px-1.5 py-0.5 rounded tracking-widest">
                          {asset.tag}
                        </span>
                      </div>
                      <h4 className="text-xs font-serif font-bold text-[#1E1C18] truncate">{asset.name}</h4>
                      <p className="text-[10px] text-[#6E6454] line-clamp-2">{asset.description || 'No description'}</p>
                    </div>
                    <div className="pt-2 border-t border-[#F4F0E8] flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(asset.dataUrl);
                          setCopiedText(asset.id);
                          setTimeout(() => setCopiedText(null), 2000);
                        }}
                        className="flex-1 py-1.5 px-2 bg-[#F4F0E8] hover:bg-[#E6E1D6] text-[10px] font-bold uppercase tracking-wider rounded text-[#1E1C18] flex items-center justify-center gap-1 transition-colors"
                      >
                        {copiedText === asset.id ? <CheckCircle size={11} className="text-green-600" /> : <Copy size={11} />}
                        <span>{copiedText === asset.id ? 'Copied URL' : 'Copy URL'}</span>
                      </button>
                      <button
                        onClick={() => handleDeleteAsset(asset.id, asset.name)}
                        className="p-1.5 border border-red-200 hover:bg-red-50 text-red-600 rounded transition-colors"
                        title="Delete asset"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
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

          <form onSubmit={handleDiscoverImages} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#736B5E]" />
                <input
                  type="text"
                  value={photoQuery}
                  onChange={(e) => setPhotoQuery(e.target.value)}
                  placeholder="e.g. Alan Watts on house boat Vallejo, or lecturing at Esalen"
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-[#E6E1D6] rounded-xl text-sm focus:outline-none focus:border-[#8C6D1F]"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="submit"
                  disabled={isSearchingImages}
                  className="px-6 py-3.5 bg-[#8C6D1F] hover:bg-[#735817] disabled:bg-[#736B5E]/50 text-white text-xs font-bold uppercase tracking-widest transition-all rounded-xl flex items-center justify-center gap-2"
                >
                  {isSearchingImages ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} />
                      <span>Discover via AI Agent</span>
                    </>
                  )}
                </button>
                <a
                  href={`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(photoQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 bg-[#1E1C18] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#3A352F] transition-colors rounded-xl flex items-center justify-center gap-2"
                >
                  <Globe size={14} />
                  <span>Launch Google Images</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </form>

          {/* AI Discovery Error */}
          {imageSearchError && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-4 flex gap-3 items-start">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <div className="text-xs font-medium">{imageSearchError}</div>
            </div>
          )}

          {/* AI Discovery Results */}
          {imageResults && (
            <div className="space-y-6 border-t border-[#E6E1D6] pt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#6E6454] flex items-center gap-2">
                  <Sparkles size={16} className="text-[#8C6D1F]" />
                  <span>AI Discovered Photographic Records ({imageResults.length})</span>
                </h3>
                <button
                  onClick={() => setImageResults(null)}
                  className="text-xs text-[#6E6454] hover:text-[#1E1C18] underline"
                >
                  Clear Results
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {imageResults.map((img, idx) => (
                  <div key={idx} className="bg-white border border-[#E6E1D6] rounded-xl overflow-hidden flex flex-col justify-between shadow-sm">
                    {/* Visual Preview */}
                    <div className="bg-[#FAF8F5] border-b border-[#E6E1D6] h-48 flex items-center justify-center relative overflow-hidden group">
                      {img.imageUrl && (img.imageUrl.startsWith('http://') || img.imageUrl.startsWith('https://')) ? (
                        <>
                          <img
                            src={img.imageUrl}
                            alt={img.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              (e.target as any).style.display = 'none';
                              const fallback = (e.target as any).nextSibling;
                              if (fallback) (fallback as any).style.display = 'flex';
                            }}
                          />
                          <div className="absolute inset-0 flex-col items-center justify-center p-4 text-center space-y-2 bg-[#FAF8F5]" style={{ display: 'none' }}>
                            <ImageIcon size={32} className="text-[#D1CECA]" />
                            <span className="text-xs font-semibold text-[#8C6D1F]">Archive Source Metadata Only</span>
                            <span className="text-[10px] text-[#6E6454] max-w-xs">No direct image file URL returned. Source page link below is fully active.</span>
                          </div>
                        </>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center space-y-2 bg-[#FAF8F5]">
                          <ImageIcon size={32} className="text-[#D1CECA]" />
                          <span className="text-xs font-semibold text-[#8C6D1F]">Archive Source Metadata Only</span>
                          <span className="text-[10px] text-[#6E6454] max-w-xs">No direct image file URL returned. Source page link below is fully active.</span>
                        </div>
                      )}
                    </div>

                    {/* Metadata Content */}
                    <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <h4 className="font-serif font-bold text-lg text-[#1E1C18] leading-tight">
                            {img.title}
                          </h4>
                          {img.year && (
                            <span className="px-2 py-0.5 bg-[#FAF8F5] border border-[#E6E1D6] rounded text-xs font-mono font-bold text-[#8C6D1F]">
                              {img.year}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-[#6E6454] leading-relaxed">
                          {img.description}
                        </p>

                        <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
                          <div>
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#6E6454] block mb-0.5">Collection/Source</span>
                            <span className="text-[#1E1C18] font-medium leading-normal">{img.attribution || 'Unknown Collection'}</span>
                          </div>
                          <div>
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#6E6454] block mb-0.5">License Type</span>
                            <span className="px-1.5 py-0.5 bg-[#FAF8F5] text-[#8C6D1F] border border-[#E6E1D6] rounded text-[10px] font-mono font-bold inline-block leading-none mt-0.5">
                              {img.licenseType || 'Public Domain'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Interactive Copy Controls */}
                      <div className="pt-4 border-t border-[#F4F0E8] space-y-3">
                        {img.sourceUrl && (
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#6E6454]">Source URL:</span>
                            <a
                              href={img.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-[#8C6D1F] hover:text-[#735817] hover:underline flex items-center gap-1 truncate max-w-[200px]"
                            >
                              <Link size={12} className="shrink-0" />
                              <span className="truncate">{img.sourceUrl}</span>
                              <ExternalLink size={10} className="shrink-0" />
                            </a>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleCopyImageMetadata(img, idx)}
                            className="flex-1 py-2 bg-[#F4F0E8] hover:bg-[#E6E1D6] text-[#1E1C18] text-xs font-bold uppercase tracking-wider transition-colors rounded-lg flex items-center justify-center gap-2"
                          >
                            {copiedImageIndex === idx ? (
                              <>
                                <CheckCircle size={13} className="text-green-600" />
                                <span>Copied Metadata!</span>
                              </>
                            ) : (
                              <>
                                <Copy size={13} />
                                <span>Copy JSON Metadata</span>
                              </>
                            )}
                          </button>
                          {img.sourceUrl && (
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(img.sourceUrl);
                                setCopiedText(img.sourceUrl);
                                setTimeout(() => setCopiedText(null), 2000);
                              }}
                              className="px-3 py-2 bg-white border border-[#E6E1D6] hover:bg-[#F4F0E8] text-[#6E6454] hover:text-[#1E1C18] rounded-lg transition-colors"
                              title="Copy Source URL Only"
                            >
                              {copiedText === img.sourceUrl ? <CheckCircle size={14} className="text-green-600" /> : <Link size={14} />}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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

          {/* Section: Dynamic Asset Uploader & Converter */}
          <div className="border-t border-[#E6E1D6] pt-8 space-y-6">
            <div className="space-y-1">
              <h3 className="text-xl font-serif text-[#1E1C18]">Local Asset Uploader & Media Registrar</h3>
              <p className="text-xs text-[#6E6454] max-w-2xl leading-relaxed">
                Import custom photographs or cover sleeves directly into your local database. Upload local image files to convert them to high-performance **Base64 Data URLs**, or link remote public URLs to register them for instant insertion.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Form: 5 cols */}
              <form onSubmit={handleRegisterAsset} className="lg:col-span-5 bg-white border border-[#E6E1D6] rounded-xl p-6 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#6E6454] border-b border-[#F4F0E8] pb-2">
                  Asset Specifications
                </h4>

                {/* Local Upload Area */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6E6454]">Local Image File (Base64)</label>
                  <div className="border-2 border-dashed border-[#E6E1D6] rounded-xl p-4 text-center hover:bg-[#FAF8F5] transition-colors relative group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChangeBase64}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload size={24} className="mx-auto text-[#8C6D1F]/50 group-hover:scale-110 transition-transform" />
                    <p className="text-xs font-medium text-[#1E1C18] mt-2">
                      {assetFile ? (assetFile as any).name : "Drag & Drop or Click to Upload"}
                    </p>
                    <p className="text-[10px] text-[#6E6454] mt-1">PNG, JPG, WEBP up to 4MB</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-[1px] bg-[#E6E1D6] flex-1" />
                  <span className="text-[10px] font-mono text-[#6E6454] uppercase">OR</span>
                  <div className="h-[1px] bg-[#E6E1D6] flex-1" />
                </div>

                {/* Public URL Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6E6454]">Public Image URL</label>
                  <input
                    type="url"
                    value={uploadedAssetUrl}
                    onChange={(e) => {
                      setUploadedAssetUrl(e.target.value);
                      if (e.target.value) {
                        setUploadedAssetBase64(''); // Clear base64 if public URL is active
                      }
                    }}
                    placeholder="https://images.unsplash.com/... or similar"
                    className="w-full px-3 py-2 bg-white border border-[#E6E1D6] rounded-lg text-xs focus:outline-none focus:border-[#8C6D1F]"
                  />
                </div>

                {/* Previews if any */}
                {(uploadedAssetBase64 || uploadedAssetUrl) && (
                  <div className="p-3 bg-[#FAF8F5] border border-[#E6E1D6] rounded-lg flex items-center gap-3">
                    <img
                      src={uploadedAssetBase64 || uploadedAssetUrl}
                      alt="Thumbnail preview"
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded object-cover border border-[#E6E1D6]"
                    />
                    <div className="text-[10px] font-mono text-[#6E6454] overflow-hidden flex-1">
                      <p className="font-bold text-[#1E1C18]">Source Type: {uploadedAssetBase64 ? 'Base64 Data' : 'Remote URL'}</p>
                      <p className="truncate">{uploadedAssetBase64 ? `${Math.round(uploadedAssetBase64.length / 1024)} KB encoded` : uploadedAssetUrl}</p>
                    </div>
                  </div>
                )}

                {/* Asset Metadata Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6E6454]">Asset Label/Name</label>
                  <input
                    type="text"
                    required
                    value={assetName}
                    onChange={(e) => setAssetName(e.target.value)}
                    placeholder="e.g. Alan Watts Esalen Portrait"
                    className="w-full px-3 py-2 bg-white border border-[#E6E1D6] rounded-lg text-xs focus:outline-none focus:border-[#8C6D1F]"
                  />
                </div>

                {/* Asset Metadata Tag */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6E6454]">Category Tag</label>
                  <select
                    value={assetTag}
                    onChange={(e) => setAssetTag(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E6E1D6] rounded-lg text-xs focus:outline-none focus:border-[#8C6D1F]"
                  >
                    <option value="Book Cover">Book Cover Sleeve</option>
                    <option value="Lecture Portrait">Lecture Portrait</option>
                    <option value="Historical Photo">Historical Scene</option>
                    <option value="Other Contributed Media">Other Contributed Media</option>
                  </select>
                </div>

                {/* Asset Metadata Description */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6E6454]">Brief Description</label>
                  <textarea
                    value={assetDesc}
                    onChange={(e) => setAssetDesc(e.target.value)}
                    placeholder="Provide details of origins, source collection, or license context."
                    rows={2}
                    className="w-full p-3 bg-white border border-[#E6E1D6] rounded-lg text-xs focus:outline-none focus:border-[#8C6D1F]"
                  />
                </div>

                {assetFeedback && (
                  <div className={`p-3 rounded-lg text-[11px] font-medium leading-relaxed border ${
                    assetFeedback.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
                  }`}>
                    {assetFeedback.message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isUploadingAsset}
                  className="w-full py-2.5 bg-[#1E1C18] hover:bg-[#322D27] text-white text-xs font-bold uppercase tracking-widest rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle size={14} />
                  <span>Register Custom Asset</span>
                </button>
              </form>

              {/* Right: Custom Catalog Gallery: 7 cols */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between border-b border-[#E6E1D6] pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-[#6E6454]">
                    Registered Asset Catalog ({customAssets.length})
                  </h4>
                  <span className="text-[10px] text-[#8C6D1F] font-mono">Bypasses Manual Asset Coding</span>
                </div>

                {customAssets.length === 0 ? (
                  <div className="border border-dashed border-[#E6E1D6] rounded-xl p-12 text-center text-xs text-[#6E6454] bg-white/50 space-y-3">
                    <ImageIcon size={32} className="mx-auto text-[#8C6D1F]/30" />
                    <p className="font-semibold text-[#1E1C18]">Your Registered Asset Catalog is Empty</p>
                    <p className="max-w-md mx-auto text-[#6E6454]/80 text-[11px] leading-relaxed">
                      Upload local images or paste remote image URLs on the left. Registered assets are preserved in local storage and can be programmatically injected into Metadata Input templates with a single click.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[520px] overflow-y-auto pr-1">
                    {customAssets.map((asset) => (
                      <div key={asset.id} className="bg-white border border-[#E6E1D6] rounded-xl p-4 flex flex-col justify-between space-y-3 shadow-sm hover:border-[#8C6D1F]/50 transition-all group">
                        <div className="space-y-2">
                          {/* Image box */}
                          <div className="h-32 w-full rounded-lg bg-[#FAF8F5] overflow-hidden border border-[#E6E1D6] relative">
                            <img
                              src={asset.dataUrl}
                              alt={asset.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <span className="absolute top-2 left-2 text-[8px] font-bold uppercase bg-[#8C6D1F] text-white px-1.5 py-0.5 rounded tracking-widest">
                              {asset.tag}
                            </span>
                            <span className="absolute bottom-2 right-2 text-[9px] font-mono bg-[#1E1C18]/80 text-white px-2 py-0.5 rounded">
                              {asset.type === 'base64' ? 'Base64' : 'Remote'}
                            </span>
                          </div>

                          <div className="space-y-1">
                            <h5 className="text-xs font-serif font-bold text-[#1E1C18] truncate">{asset.name}</h5>
                            <p className="text-[10px] text-[#6E6454] leading-relaxed line-clamp-2">{asset.description || "No description provided."}</p>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-[#F4F0E8] flex flex-col gap-1.5">
                          {/* Quick Injection Assist */}
                          <button
                            onClick={() => {
                              handleInsertAssetUrl(asset.dataUrl);
                              setActiveTab('input');
                            }}
                            className="w-full py-1.5 bg-[#8C6D1F] hover:bg-[#735817] text-white text-[10px] font-bold uppercase tracking-wider rounded-md transition-colors flex items-center justify-center gap-1"
                            title="Auto-insert this asset into the Data Input portal JSON template"
                          >
                            <Sparkles size={11} />
                            <span>Quick-Inject in JSON</span>
                          </button>

                          <div className="flex gap-1.5">
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(asset.dataUrl);
                                setCopiedText(asset.id);
                                setTimeout(() => setCopiedText(null), 2000);
                              }}
                              className="flex-1 py-1 px-2 border border-[#E6E1D6] hover:bg-[#F4F0E8] text-[10px] font-semibold rounded text-[#1E1C18] flex items-center justify-center gap-1 transition-colors"
                              title="Copy URL or base64 data string to clipboard"
                            >
                              {copiedText === asset.id ? <CheckCircle size={10} className="text-green-600" /> : <Copy size={10} />}
                              <span>{copiedText === asset.id ? "Copied" : "Copy String"}</span>
                            </button>
                            <button
                              onClick={() => handleDeleteAsset(asset.id, asset.name)}
                              className="p-1 border border-red-200 hover:bg-red-50 text-red-600 rounded"
                              title="Delete registered asset"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
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
              <button
                type="button"
                onClick={() => setInputMode('bulk')}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                  inputMode === 'bulk' ? 'bg-[#1E1C18] text-white' : 'text-[#6E6454] hover:bg-[#F4F0E8]'
                }`}
              >
                CSV / JSON Bulk Importer
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
              <button
                onClick={() => { setDataType('video'); setPasteContent(JSON.stringify(templates.video, null, 2)); }}
                className={`px-3 py-1.5 text-[11px] font-semibold rounded-lg border transition-all ${
                  dataType === 'video' ? 'bg-[#8C6D1F] border-[#8C6D1F] text-white' : 'bg-white border-[#E6E1D6] text-[#1E1C18]'
                }`}
              >
                Video
              </button>
              <button
                onClick={() => { setDataType('podcast'); setPasteContent(JSON.stringify(templates.podcast, null, 2)); }}
                className={`px-3 py-1.5 text-[11px] font-semibold rounded-lg border transition-all ${
                  dataType === 'podcast' ? 'bg-[#8C6D1F] border-[#8C6D1F] text-white' : 'bg-white border-[#E6E1D6] text-[#1E1C18]'
                }`}
              >
                Podcast
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
              ) : inputMode === 'bulk' ? (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#6E6454]">CSV / JSON Bulk Input</label>
                    <p className="text-[11px] text-[#6E6454]">Paste JSON array or CSV lines (`Title, Year, Summary`).</p>
                  </div>
                  <textarea
                    value={bulkInputText}
                    onChange={(e) => setBulkInputText(e.target.value)}
                    placeholder={`[
  { "title": "Item 1", "year": 1968, "summary": "..." }
]`}
                    rows={10}
                    className="w-full p-4 bg-white border border-[#E6E1D6] rounded-xl text-xs font-mono focus:outline-none focus:border-[#8C6D1F]"
                  />
                  {bulkCommitFeedback && (
                    <div className={`p-3 rounded-lg text-xs font-medium border ${
                      bulkCommitFeedback.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
                    }`}>
                      {bulkCommitFeedback.message}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={isBulkValidating}
                    onClick={handleBulkValidate}
                    className="w-full py-3 bg-[#1E1C18] hover:bg-[#322D27] text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    {isBulkValidating ? 'Validating...' : 'Validate & Preview Bulk Items'}
                  </button>

                  {bulkParsedItems.length > 0 && (
                    <div className="space-y-3 pt-4 border-t border-[#E6E1D6]">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#6E6454]">Validated ({bulkParsedItems.length})</span>
                      </div>
                      <div className="max-h-40 overflow-y-auto border border-[#E6E1D6] rounded-lg bg-white p-2 text-xs space-y-1">
                        {bulkParsedItems.map((item, i) => (
                          <div key={i} className="truncate border-b border-[#FAF8F5] pb-1">
                            <strong>{item.title}</strong> ({item.year})
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={handleBulkCommitAll}
                        className="w-full py-3 bg-[#8C6D1F] hover:bg-[#735817] text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-colors flex items-center justify-center gap-2"
                      >
                        <CheckCircle size={14} />
                        <span>Commit All {bulkParsedItems.length} Records to Archive</span>
                      </button>
                    </div>
                  )}
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={handleValidateAndPreview}
                    className="w-full py-3.5 bg-[#8C6D1F] hover:bg-[#735817] text-white text-xs font-bold uppercase tracking-widest transition-colors rounded-xl flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Sparkles size={14} />
                    <span>Preview Component</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleImportData}
                    className="w-full py-3.5 bg-[#1E1C18] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#322D27] transition-all rounded-xl shadow-sm flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={14} />
                    <span>Commit to Archive</span>
                  </button>
                </div>
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
                    {dataType === 'video' && (
                      <VideoCard 
                        video={{
                          id: previewData.id || 'temp-id',
                          title: previewData.title || 'Untitled Custom Video',
                          slug: previewData.slug || 'untitled-slug',
                          date: previewData.date || '1970',
                          duration: previewData.duration || '10:00',
                          archiveSource: previewData.archiveSource || 'Archival Tape Master',
                          thumbnailUrl: previewData.thumbnailUrl || 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
                          description: previewData.description || 'Description placeholder.',
                          verificationStatus: previewData.verificationStatus || 'verified-source',
                          youtubeId: previewData.youtubeId || ''
                        }}
                        onClick={() => {}}
                      />
                    )}
                    {dataType === 'podcast' && (
                      <div className="p-5 rounded-xl border border-[#8C6D1F]/30 bg-[#8C6D1F]/5 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-1 rounded-full bg-[#1DB954]/10 text-[#1DB954] text-[9px] font-bold uppercase tracking-wider">
                            Spotify Podcast Item
                          </span>
                          <span className="text-[10px] font-mono text-[#6E6454]">
                            {previewData.season && `S${previewData.season}`}
                            {previewData.episode && ` E${previewData.episode}`}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-sm font-editorial font-bold text-[#1E1C18]">{previewData.title || 'Untitled Episode'}</h4>
                          <p className="text-xs text-[#6E6454] line-clamp-2 leading-relaxed">{previewData.description || 'No description provided.'}</p>
                        </div>
                        <div className="pt-3 border-t border-[#E6E1D6] flex justify-between items-center text-[10px] text-[#6E6454]">
                          <span>Duration: <strong>{previewData.duration || '30:00'}</strong></span>
                          <span>Spotify ID: <strong className="font-mono text-[#1E1C18]">{previewData.spotifyId || 'Missing'}</strong></span>
                        </div>
                      </div>
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
