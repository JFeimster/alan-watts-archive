import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, ExternalLink, Bot, User, Loader2 } from 'lucide-react';
import Markdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  citations?: { uri: string; title: string }[];
}

interface AICompanionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AICompanionDrawer: React.FC<AICompanionDrawerProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Welcome, seeker. I am the Alan Watts AI Philosophical Companion, here to discuss the eternal now, the illusion of the separate ego, and the wondrous art of living without trying to master life like a machine. What shall we explore today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    const newMessages: Message[] = [...messages, { role: 'user', content: userMsg }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to get AI response');

      setMessages([...newMessages, { role: 'assistant', content: data.text, citations: data.citations }]);
    } catch (err: any) {
      setMessages([...newMessages, { role: 'assistant', content: `[Connection notice]: ${err.message || 'Unable to connect to AI companion.'}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-[#F9F7F2] border-l border-[#D1CECA] shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-5 border-b border-[#D1CECA] flex items-center justify-between bg-[#F4F1EA]">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-[#B48B40]/10 flex items-center justify-center text-[#B48B40] border border-[#B48B40]/30">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-[#1A1A1A]">Alan Watts AI Companion</h3>
            <p className="text-xs text-[#5C574F] tracking-wide">Powered by Gemini 3.5 Flash & Search Grounding</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-[#5C574F] hover:text-[#1A1A1A] hover:bg-[#EAE6DF] rounded-full transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>
      </div>

      {/* Suggested Prompts */}
      <div className="px-5 py-3 bg-[#EAE6DF]/55 border-b border-[#D1CECA] flex gap-2 overflow-x-auto no-scrollbar">
        {[
          "What is the illusion of the ego?",
          "Explain the philosophy of Alan Watts",
          "What does it mean to wake up?",
          "Music as a metaphor for life"
        ].map((prompt, i) => (
          <button
            key={i}
            onClick={() => setInput(prompt)}
            className="text-xs bg-[#F9F7F2] text-[#5C574F] hover:text-[#1A1A1A] px-3 py-1.5 rounded-full border border-[#D1CECA] whitespace-nowrap transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex items-start gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              m.role === 'user' ? 'bg-[#1A1A1A] text-[#F9F7F2]' : 'bg-[#B48B40]/20 text-[#B48B40] border border-[#B48B40]/40'
            }`}>
              {m.role === 'user' ? <User size={15} /> : <Bot size={15} />}
            </div>
            <div className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
              m.role === 'user' 
                ? 'bg-[#1A1A1A] text-[#F9F7F2] rounded-tr-none' 
                : 'bg-[#F4F1EA] text-[#1A1A1A] border border-[#D1CECA] rounded-tl-none'
            }`}>
              <div className="markdown-body">
                <Markdown>{m.content}</Markdown>
              </div>

              {m.citations && m.citations.length > 0 && (
                <div className="mt-3 pt-3 border-t border-[#D1CECA]/60 text-xs">
                  <span className="font-semibold text-[#B48B40] block mb-1">Grounded References:</span>
                  <div className="space-y-1">
                    {m.citations.map((c, ci) => (
                      <a
                        key={ci}
                        href={c.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-[#5C574F] hover:text-[#B48B40] truncate"
                      >
                        <ExternalLink size={12} className="shrink-0" />
                        <span className="truncate">{c.title || c.uri}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#B48B40]/20 text-[#B48B40] border border-[#B48B40]/40 flex items-center justify-center">
              <Bot size={15} />
            </div>
            <div className="bg-[#F4F1EA] border border-[#D1CECA] p-4 rounded-2xl rounded-tl-none flex items-center gap-2 text-sm text-[#5C574F]">
              <Loader2 size={16} className="animate-spin text-[#B48B40]" />
              <span>Contemplating your inquiry...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t border-[#D1CECA] bg-[#F4F1EA]">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Alan Watts AI a philosophical question..."
            className="flex-1 bg-[#F9F7F2] border border-[#D1CECA] rounded-xl px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#B48B40]"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-[#1A1A1A] text-[#F9F7F2] hover:bg-[#B48B40] disabled:opacity-50 p-3 rounded-xl transition-colors cursor-pointer flex items-center justify-center"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};
