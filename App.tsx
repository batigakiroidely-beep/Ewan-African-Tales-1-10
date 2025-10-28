
import React, { useState } from 'react';
import HomeScreen from './components/HomeScreen';
import StoryScreen from './components/StoryScreen';
import { Story } from './types';
import { stories } from './constants/stories';

const App: React.FC = () => {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  const handleSelectStory = (story: Story) => {
    setSelectedStory(story);
  };

  const handleBack = () => {
    setSelectedStory(null);
  };

  const svgPattern = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a0522d' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`;

  return (
    <div style={{ backgroundImage: svgPattern }} className="min-h-screen bg-[#FFF8E1] text-[#4E342E]">
      <div className="container mx-auto max-w-4xl p-0 sm:p-4">
        {selectedStory ? (
          <StoryScreen story={selectedStory} onBack={handleBack} />
        ) : (
          <HomeScreen stories={stories} onSelectStory={handleSelectStory} />
        )}
      </div>
    </div>
  );
};

export default App;
