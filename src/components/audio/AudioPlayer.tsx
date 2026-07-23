import React, { useState, useEffect, useRef } from 'react';
import { Lecture } from '../../types';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, FileText, X, Disc } from 'lucide-react';

interface AudioPlayerProps {
  lecture: Lecture | null;
  onClose: () => void;
  onToggleTranscript: () => void;
  showTranscript: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  lecture,
  onClose,
  onToggleTranscript,
  showTranscript
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(lecture?.durationSeconds || 300);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (lecture) {
      setIsPlaying(true);
      setCurrentTime(0);
      setDuration(lecture.durationSeconds || 300);
    }
  }, [lecture]);

  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, duration]);

  if (!lecture) return null;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainSecs = Math.floor(secs % 60);
    return `${mins}:${remainSecs < 10 ? '0' : ''}${remainSecs}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setCurrentTime(val);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#26352C] text-[#F3EFE6] border-t border-[#3D5244] shadow-2xl py-3 px-4 sm:px-8 transition-transform duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Lecture Info */}
        <div className="flex items-center space-x-3 w-full md:w-1/4">
          <div className="w-10 h-10 rounded bg-[#3D5244] flex items-center justify-center shrink-0 text-[#C9A227] animate-spin-slow">
            <Disc size={20} className={isPlaying ? 'animate-spin' : ''} />
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
              onClick={() => setCurrentTime((t) => Math.max(0, t - 15))}
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
              onClick={() => setCurrentTime((t) => Math.min(duration, t + 15))}
              className="text-[#B5AD9C] hover:text-white transition-colors"
              title="Forward 15s"
            >
              <SkipForward size={18} />
            </button>
          </div>

          <div className="flex items-center space-x-3 w-full text-xs text-[#B5AD9C]">
            <span>{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 bg-[#3D5244] rounded-lg appearance-none cursor-pointer accent-[#C9A227]"
            />
            <span>{lecture.duration}</span>
          </div>
        </div>

        {/* Extra Tools: Transcript & Close */}
        <div className="flex items-center space-x-4 w-full md:w-1/4 justify-end">
          <button
            onClick={onToggleTranscript}
            className={`flex items-center space-x-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors ${
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
