import React from 'react';
import { ViewState } from '../../types';

interface SiteFooterProps {
  onNavigate: (view: ViewState) => void;
}

export const SiteFooter: React.FC<SiteFooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#1A1A1A] text-[#F9F7F2] border-t border-[#D1CECA] px-6 sm:px-10 py-12 mt-20 space-y-8">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 pb-8 border-b border-[#333333]">
        <div className="space-y-3">
          <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-[#B48B40]">Archive Hub</h4>
          <ul className="space-y-2 text-xs font-medium text-[#B3B3B3]">
            <li><button onClick={() => onNavigate({ type: 'home' })} className="hover:text-white transition-colors">Home Repository</button></li>
            <li><button onClick={() => onNavigate({ type: 'start-here' })} className="hover:text-white transition-colors">Start Here</button></li>
            <li><button onClick={() => onNavigate({ type: 'resources' })} className="hover:text-white transition-colors">Root Resources Hub</button></li>
            <li><button onClick={() => onNavigate({ type: 'lectures' })} className="hover:text-white transition-colors">Master Lectures</button></li>
          </ul>
        </div>
        <div className="space-y-3">
          <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-[#B48B40]">Business Layer</h4>
          <ul className="space-y-2 text-xs font-medium text-[#B3B3B3]">
            <li><button onClick={() => onNavigate({ type: 'speaking' })} className="hover:text-white transition-colors">Speaking</button></li>
            <li><button onClick={() => onNavigate({ type: 'services' })} className="hover:text-white transition-colors">Services</button></li>
            <li><button onClick={() => onNavigate({ type: 'partners' })} className="hover:text-white transition-colors">Partners</button></li>
            <li><button onClick={() => onNavigate({ type: 'accelerator' })} className="hover:text-white transition-colors">Accelerator</button></li>
          </ul>
        </div>
        <div className="space-y-3">
          <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-[#B48B40]">Support & Legal</h4>
          <ul className="space-y-2 text-xs font-medium text-[#B3B3B3]">
            <li><button onClick={() => onNavigate({ type: 'sponsor' })} className="hover:text-white transition-colors">Sponsor</button></li>
            <li><button onClick={() => onNavigate({ type: 'licensing' })} className="hover:text-white transition-colors">Licensing Information</button></li>
            <li><button onClick={() => onNavigate({ type: 'contact' })} className="hover:text-white transition-colors">Contact</button></li>
            <li><button onClick={() => onNavigate({ type: 'about' })} className="hover:text-white transition-colors">Editorial Standards</button></li>
            <li><button onClick={() => onNavigate({ type: 'developer-desk' })} className="hover:text-[#B48B40] transition-colors font-mono opacity-80 text-[10px]">Staff Portal (Developer Desk)</button></li>
          </ul>
        </div>
        <div className="space-y-3">
          <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-[#B48B40]">Mission</h4>
          <p className="text-xs text-[#B3B3B3] leading-relaxed">
            Preserving authentic uncorrupted historical lectures and philosophical writings of Alan Watts.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-wrap gap-6 text-[10px] tracking-widest uppercase font-medium">
          <button onClick={() => onNavigate({ type: 'about' })} className="hover:text-[#B48B40] transition-colors">Editorial Standards</button>
          <button onClick={() => onNavigate({ type: 'about' })} className="hover:text-[#B48B40] transition-colors">Sources & Attribution</button>
          <button onClick={() => onNavigate({ type: 'start-here' })} className="hover:text-[#B48B40] transition-colors">The Electronic University</button>
        </div>

        <div className="text-[10px] tracking-widest uppercase font-medium opacity-70">
          © {new Date().getFullYear()} Alan Watts Archive — All Rights Reserved
        </div>

        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#B48B40]" />
          <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-[#B48B40]">Official Partner</span>
        </div>
      </div>
    </footer>
  );
};
