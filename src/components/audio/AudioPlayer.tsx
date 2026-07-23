import React, { useState, useEffect, useRef } from 'react';
import { Lecture } from '../../types';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, FileText, X, Disc, Gauge } from 'lucide-react';

interface AudioPlayerProps {
  lecture: Lecture | null;
  onClose: () => void;
  onToggleTranscript: () => void;
  showTranscript: boolean;
}

// Simple IndexedDB lookup for custom local audio blobs
const getAudioFromDB = (id: string): Promise<Blob | null> => {
  return new Promise((resolve) => {
    try {
      const request = indexedDB.open('AlanWattsArchiveDB', 1);
      request.onsuccess = (e: any) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('audio_files')) {
          resolve(null);
          return;
        }
        const transaction = db.transaction('audio_files', 'readonly');
        const store = transaction.objectStore('audio_files');
        const getReq = store.get(id);
        getReq.onsuccess = () => resolve(getReq.result || null);
        getReq.onerror = () => resolve(null);
      };
      request.onerror = () => resolve(null);
    } catch (e) {
      resolve(null);
    }
  });
};

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  lecture,
  onClose,
  onToggleTranscript,
  showTranscript
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(300);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [resolvedAudioUrl, setResolvedAudioUrl] = useState<string | null>(null);
  const [useSimulation, setUseSimulation] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const simulationTimerRef = useRef<any>(null);

  // Load audio URL (handling IndexedDB blobs for custom uploads, or direct URLs)
  useEffect(() => {
    if (!lecture) {
      setResolvedAudioUrl(null);
      return;
    }

    let active = true;
    let objectUrlToRevoke: string | null = null;

    const loadAudioSource = async () => {
      // 1. Check IndexedDB first for a local audio file associated with this lecture
      const dbBlob = await getAudioFromDB(lecture.id);
      
      if (!active) return;

      if (dbBlob) {
        const localUrl = URL.createObjectURL(dbBlob);
        objectUrlToRevoke = localUrl;
        setResolvedAudioUrl(localUrl);
        setUseSimulation(false);
      } else if (lecture.audioUrl && lecture.audioUrl.trim() !== '') {
        setResolvedAudioUrl(lecture.audioUrl);
        setUseSimulation(false);
      } else {
        // No audio URL or blob, use simulation fallback
        setResolvedAudioUrl(null);
        setUseSimulation(true);
      }

      setIsPlaying(true);
      setCurrentTime(0);
      setDuration(lecture.durationSeconds || 300);
    };

    loadAudioSource();

    return () => {
      active = false;
      if (objectUrlToRevoke) {
        URL.revokeObjectURL(objectUrlToRevoke);
      }
    };
  }, [lecture]);

  // Sync state with HTML5 audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
      audioRef.current.playbackRate = playbackRate;
    }
  }, [volume, isMuted, playbackRate, resolvedAudioUrl]);

  // Sync play/pause with audio element
  useEffect(() => {
    if (useSimulation) return;

    if (audioRef.current && resolvedAudioUrl) {
      if (isPlaying) {
        audioRef.current.play().catch((err) => {
          console.warn('HTML5 Audio playback interrupted or pending user click:', err);
          // If we fail because it is not playable, fall back to simulation
          if (!audioRef.current?.duration) {
            setUseSimulation(true);
          }
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, resolvedAudioUrl, useSimulation]);

  // Simulation fallback timer logic
  useEffect(() => {
    if (simulationTimerRef.current) {
      clearInterval(simulationTimerRef.current);
    }

    if (useSimulation && isPlaying) {
      simulationTimerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return prev + 1;
        });
      }, 1000 / playbackRate);
    }

    return () => {
      if (simulationTimerRef.current) {
        clearInterval(simulationTimerRef.current);
      }
    };
  }, [isPlaying, useSimulation, duration, playbackRate]);

  if (!lecture) return null;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainSecs = Math.floor(secs % 60);
    return `${mins}:${remainSecs < 10 ? '0' : ''}${remainSecs}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setCurrentTime(val);
    if (audioRef.current && !useSimulation) {
      audioRef.current.currentTime = val;
    }
  };

  // HTML5 audio event handlers
  const handleTimeUpdate = () => {
    if (audioRef.current && !useSimulation) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current && !useSimulation) {
      const audioDuration = audioRef.current.duration;
      if (audioDuration && isFinite(audioDuration)) {
        setDuration(audioDuration);
      }
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleAudioError = () => {
    console.warn('Audio URL failed to load. Switching to simulated visual timeline.');
    setUseSimulation(true);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const cyclePlaybackRate = () => {
    const rates = [1, 1.25, 1.5, 0.8];
    const currentIndex = rates.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % rates.length;
    setPlaybackRate(rates[nextIndex]);
  };

  const friendlyDuration = formatTime(duration);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#26352C] text-[#F3EFE6] border-t border-[#3D5244] shadow-2xl py-3.5 px-4 sm:px-8 transition-transform duration-300">
      {/* Hidden audio tag for real playback */}
      {resolvedAudioUrl && !useSimulation && (
        <audio
          ref={audioRef}
          src={resolvedAudioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
          onError={handleAudioError}
        />
      )}

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Lecture Info */}
        <div className="flex items-center space-x-3 w-full md:w-1/4">
          <div className="w-10 h-10 rounded bg-[#3D5244] flex items-center justify-center shrink-0 text-[#C9A227]">
            <Disc size={20} className={isPlaying ? 'animate-spin' : ''} style={{ animationDuration: '6s' }} />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-editorial font-medium truncate text-[#F3EFE6]">
              {lecture.title}
            </h4>
            <p className="text-xs text-[#B5AD9C] truncate">
              {lecture.series} • {lecture.year}
            </p>
          </div>
        </div>

        {/* Player Controls & Progress */}
        <div className="flex flex-col items-center w-full md:w-2/4 space-y-1.5">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => {
                const targetTime = Math.max(0, currentTime - 15);
                setCurrentTime(targetTime);
                if (audioRef.current && !useSimulation) audioRef.current.currentTime = targetTime;
              }}
              className="text-[#B5AD9C] hover:text-white transition-colors"
              title="Rewind 15s"
            >
              <SkipBack size={18} />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 rounded-full bg-[#C9A227] text-[#1E1C18] flex items-center justify-center hover:bg-[#E5BE3B] transition-colors shadow"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
            </button>
            <button 
              onClick={() => {
                const targetTime = Math.min(duration, currentTime + 15);
                setCurrentTime(targetTime);
                if (audioRef.current && !useSimulation) audioRef.current.currentTime = targetTime;
              }}
              className="text-[#B5AD9C] hover:text-white transition-colors"
              title="Forward 15s"
            >
              <SkipForward size={18} />
            </button>
          </div>

          <div className="flex items-center space-x-3 w-full text-xs text-[#B5AD9C]">
            <span className="w-10 text-right font-mono">{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 bg-[#3D5244] rounded-lg appearance-none cursor-pointer accent-[#C9A227]"
            />
            <span className="w-10 text-left font-mono">{friendlyDuration}</span>
          </div>
        </div>

        {/* Extra Tools: Volume, Speed, Transcript & Close */}
        <div className="flex items-center space-x-3 w-full md:w-1/4 justify-end">
          {/* Mute toggle */}
          <button
            onClick={toggleMute}
            className="p-1.5 rounded-lg text-[#B5AD9C] hover:text-white transition-colors hover:bg-[#3D5244]/50"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          {/* Speed cycle */}
          <button
            onClick={cyclePlaybackRate}
            className="flex items-center gap-1 text-xs px-2 py-1.5 rounded-lg border border-[#3D5244] text-[#B5AD9C] hover:text-white hover:border-[#526E5D]"
            title="Change Playback Speed"
          >
            <Gauge size={13} />
            <span className="font-mono text-[10px]">{playbackRate}x</span>
          </button>

          <button
            onClick={onToggleTranscript}
            className={`flex items-center space-x-1.5 text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${
              showTranscript 
                ? 'bg-[#C9A227] text-[#1E1C18] border-[#C9A227]' 
                : 'border-[#3D5244] text-[#B5AD9C] hover:text-white hover:border-[#526E5D]'
            }`}
          >
            <FileText size={14} />
            <span>Transcript</span>
          </button>

          <button
            onClick={onClose}
            className="text-[#B5AD9C] hover:text-white p-1 rounded-lg transition-colors"
            title="Close Player"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
