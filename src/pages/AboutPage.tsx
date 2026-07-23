import React from 'react';
import { ViewState } from '../types';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { ShieldCheck, BookOpen, Heart, CheckCircle2 } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (view: ViewState) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-12 pb-16">
      <Breadcrumbs items={[{ label: 'About & Authenticity' }]} onNavigate={onNavigate} />

      <section className="bg-[#F4F0E8] border-b border-[#E6E1D6] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6 text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8C6D1F]">
            Editorial Standards & Mission
          </span>
          <h1 className="text-3xl sm:text-5xl font-editorial font-normal text-[#1E1C18]">
            About the Alan Watts Wisdom Archive
          </h1>
          <p className="text-base sm:text-lg text-[#6E6454] max-w-2xl mx-auto leading-relaxed">
            An independent research library dedicated to preserving and illuminating the authentic historical lectures, seminars, and writings of Alan Watts.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Mission */}
        <div className="bg-[#F4F0E8] border border-[#E6E1D6] rounded-2xl p-8 space-y-4">
          <div className="flex items-center space-x-3 text-[#8C6D1F]">
            <BookOpen size={24} />
            <h2 className="text-2xl font-editorial font-normal text-[#1E1C18]">Our Mission</h2>
          </div>
          <p className="text-sm sm:text-base text-[#6E6454] leading-relaxed">
            Alan Watts was one of the 20th century’s most brilliant interpreters of Eastern philosophy to the West. In an era saturated with internet misattributions, synthetic AI voice clones, and diluted spiritual clichés, this archive provides an uncompromised scholarly repository.
          </p>
        </div>

        {/* Authenticity Policy */}
        <div className="bg-[#26352C] text-[#F3EFE6] rounded-2xl p-8 space-y-6 border border-[#3D5244]">
          <div className="flex items-center space-x-3 text-[#C9A227]">
            <ShieldCheck size={26} />
            <h2 className="text-2xl font-editorial font-normal text-white">Strict Authenticity Guarantee</h2>
          </div>
          <p className="text-sm text-[#B5AD9C] leading-relaxed">
            We adhere to rigorous verification standards:
          </p>
          <ul className="space-y-3 text-xs sm:text-sm text-[#B5AD9C]">
            <li className="flex items-start">
              <CheckCircle2 size={16} className="text-[#C9A227] mt-0.5 mr-2.5 shrink-0" />
              <span>All audio recordings are sourced directly from KPFA, Pacifica Radio master tapes, and the Alan Watts Electronic University archives.</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 size={16} className="text-[#C9A227] mt-0.5 mr-2.5 shrink-0" />
              <span>No AI voice generation or synthetic speech recreation is ever used.</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 size={16} className="text-[#C9A227] mt-0.5 mr-2.5 shrink-0" />
              <span>Quotations are meticulously verified against published books and master lecture transcripts with documented citations.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
