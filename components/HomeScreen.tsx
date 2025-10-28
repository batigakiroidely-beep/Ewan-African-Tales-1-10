
import React from 'react';
import { Story } from '../types';
import StoryCard from './StoryCard';

interface HomeScreenProps {
  stories: Story[];
  onSelectStory: (story: Story) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ stories, onSelectStory }) => {
  return (
    <div className="p-4 sm:p-0">
      <header className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#D32F2F] tracking-tight">African Tales for Kids</h1>
        <p className="text-lg text-[#6D4C41] mt-2">Tap a story to read and listen!</p>
      </header>
      <main className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {stories.map((story) => (
          <StoryCard key={story.id} story={story} onSelect={onSelectStory} />
        ))}
      </main>
    </div>
  );
};

export default HomeScreen;
