
import React from 'react';
import { Story } from '../types';

interface StoryCardProps {
  story: Story;
  onSelect: (story: Story) => void;
}

const StoryCard: React.FC<StoryCardProps> = ({ story, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(story)}
      className="cursor-pointer group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 bg-white"
    >
      <div className="relative">
        <img className="w-full h-32 sm:h-48 object-cover" src={story.image} alt={story.title} />
        <div className={`absolute inset-0 ${story.patternColor} mix-blend-multiply opacity-50`}></div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-sm sm:text-lg text-[#5D4037] truncate group-hover:text-[#D32F2F] transition-colors">{story.title}</h3>
        <p className="text-xs sm:text-sm text-gray-500">{story.country}</p>
      </div>
    </div>
  );
};

export default StoryCard;
