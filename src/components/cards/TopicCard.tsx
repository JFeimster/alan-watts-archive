import React from 'react';
import { Topic } from '../../types';
import { 
  UserX, Brain, RotateCcw, Clock, Sunset, Music, 
  Compass, Heart, Sun, Trees, Sparkles, Cpu, ArrowRight 
} from 'lucide-react';

interface TopicCardProps {
  topic: Topic;
  onClick: () => void;
}

export const TopicCard: React.FC<TopicCardProps> = ({ topic, onClick }) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'UserX': return UserX;
      case 'Brain': return Brain;
      case 'RotateCcw': return RotateCcw;
      case 'Clock': return Clock;
      case 'Sunset': return Sunset;
      case 'Music': return Music;
      case 'Compass': return Compass;
      case 'Heart': return Heart;
      case 'Sun': return Sun;
      case 'Trees': return Trees;
      case 'Mask': return Sparkles;
      case 'Cpu': return Cpu;
      default: return Compass;
    }
  };

  const IconComponent = getIcon(topic.iconName);

  return (
    <div 
      onClick={onClick}
      className="group bg-[#F4F0E8] border border-[#E6E1D6] rounded-xl p-6 hover:bg-[#EFEADB] hover:border-[#D4CEBF] transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-xs hover:shadow-md"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-lg bg-[#E2DCD0] flex items-center justify-center text-[#2C3E35] group-hover:bg-[#8C6D1F] group-hover:text-white transition-colors duration-300">
            <IconComponent size={20} />
          </div>
          <span className="text-xs font-medium text-[#736B5E] bg-[#E8E3D8] px-2.5 py-1 rounded-full">
            {topic.lectureCount} Lectures
          </span>
        </div>
        <h3 className="text-lg font-editorial font-medium text-[#1E1C18] group-hover:text-[#8C6D1F] transition-colors mb-2">
          {topic.title}
        </h3>
        <p className="text-xs sm:text-sm text-[#6E6454] line-clamp-2 leading-relaxed">
          {topic.description}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-[#E6E1D6] flex items-center justify-between text-xs text-[#736B5E]">
        <span className="group-hover:text-[#1E1C18] font-medium transition-colors">Explore topic</span>
        <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform text-[#8C6D1F]" />
      </div>
    </div>
  );
};
