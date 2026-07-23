import React from 'react';
import { Book } from '../../types';
import { BookOpen, Calendar, ArrowRight } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onClick: () => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="group bg-[#F4F0E8] border border-[#E6E1D6] rounded-xl overflow-hidden hover:border-[#D4CEBF] transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-xs hover:shadow-md"
    >
      <div className="relative h-56 overflow-hidden bg-[#E2DCD0] flex items-center justify-center p-4">
        <img 
          src={book.coverImage} 
          alt={book.title}
          className="h-full w-32 object-cover shadow-md rounded group-hover:scale-105 transition-transform duration-300"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="p-6 flex flex-col justify-between flex-grow">
        <div>
          <div className="flex items-center justify-between text-xs text-[#736B5E] mb-2">
            <span className="font-semibold text-[#8C6D1F]">{book.publisher}</span>
            <span className="flex items-center"><Calendar size={12} className="mr-1" />{book.year}</span>
          </div>
          <h3 className="text-xl font-editorial font-medium text-[#1E1C18] group-hover:text-[#8C6D1F] transition-colors mb-2">
            {book.title}
          </h3>
          <p className="text-xs sm:text-sm text-[#6E6454] line-clamp-2 leading-relaxed mb-4">
            {book.description}
          </p>
        </div>

        <div className="pt-4 border-t border-[#E6E1D6] flex items-center justify-between text-xs text-[#736B5E]">
          <span className="flex items-center text-[#2C3E35] font-medium">
            <BookOpen size={13} className="mr-1 text-[#8C6D1F]" />
            {book.keyThemes.length} Key Themes
          </span>
          <ArrowRight size={15} className="text-[#8C6D1F] transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
};
