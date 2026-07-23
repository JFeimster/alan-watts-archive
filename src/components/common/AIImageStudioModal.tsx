import React, { useState } from 'react';
import { X, Image as ImageIcon, Sparkles, Download, Loader2 } from 'lucide-react';

interface AIImageStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIImageStudioModal: React.FC<AIImageStudioModalProps> = ({ isOpen, onClose }) => {
  const [prompt, setPrompt] = useState('Zen garden landscape with ancient pine trees and mist');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const aspectRatios = [
    { label: '1:1 Square', value: '1:1' },
    { label: '16:9 Landscape', value: '16:9' },
    { label: '4:3 Standard', value: '4:3' },
    { label: '3:2 Photo', value: '3:2' },
    { label: '2:3 Portrait', value: '2:3' },
    { label: '3:4 Portrait', value: '3:4' },
    { label: '9:16 Story', value: '9:16' },
    { label: '21:9 Cinematic', value: '21:9' },
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, aspectRatio })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate image');

      setImageUrl(data.imageUrl);
    } catch (err: any) {
      setError(err.message || 'Image generation failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#F9F7F2] border border-[#D1CECA] rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-[#D1CECA] flex items-center justify-between bg-[#F4F1EA]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#B48B40]/10 flex items-center justify-center text-[#B48B40] border border-[#B48B40]/30">
              <ImageIcon size={22} />
            </div>
            <div>
              <h3 className="font-serif font-bold text-xl text-[#1A1A1A]">AI Philosophical Image Studio</h3>
              <p className="text-xs text-[#5C574F]">Create archival illustrations and banners with Gemini 3.1 Flash Image</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#5C574F] hover:text-[#1A1A1A] hover:bg-[#EAE6DF] rounded-full transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C574F] mb-2">
                Illustration Prompt
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                placeholder="Describe the philosophical artwork or archival banner..."
                className="w-full bg-[#F4F1EA] border border-[#D1CECA] rounded-xl p-3 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#B48B40]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C574F] mb-2">
                Aspect Ratio Control
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {aspectRatios.map((ar) => (
                  <button
                    key={ar.value}
                    type="button"
                    onClick={() => setAspectRatio(ar.value)}
                    className={`px-3 py-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      aspectRatio === ar.value
                        ? 'border-[#B48B40] bg-[#B48B40]/10 text-[#1A1A1A]'
                        : 'border-[#D1CECA] bg-[#F4F1EA] text-[#5C574F] hover:border-[#1A1A1A]'
                    }`}
                  >
                    <span>{ar.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1A1A1A] text-[#F9F7F2] hover:bg-[#B48B40] py-3.5 rounded-xl font-medium tracking-wide transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
              <span>{loading ? 'Generating Archival Masterpiece...' : 'Generate AI Illustration'}</span>
            </button>
          </form>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
              {error}
            </div>
          )}

          {imageUrl && (
            <div className="space-y-3 pt-4 border-t border-[#D1CECA]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#5C574F]">Generated Artwork</span>
                <a
                  href={imageUrl}
                  download="alan-watts-archive-art.jpg"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B48B40] hover:underline"
                >
                  <Download size={14} />
                  <span>Download Image</span>
                </a>
              </div>
              <div className="rounded-xl overflow-hidden border border-[#D1CECA] bg-[#1A1A1A] flex items-center justify-center p-2">
                <img src={imageUrl} alt={prompt} className="max-h-[400px] object-contain rounded-lg" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
