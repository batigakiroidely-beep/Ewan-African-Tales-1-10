import React, { useState, useEffect } from 'react';
import { Story } from '../types';
import { generateImage } from '../services/geminiService';

interface StoryCardProps {
  story: Story;
  onSelect: (story: Story) => void;
}

const ImageSpinner: React.FC = () => (
    <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
        <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    </div>
);


const StoryCard: React.FC<StoryCardProps> = ({ story, onSelect }) => {
  const [imageUrl, setImageUrl] = useState<string>(story.image);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  useEffect(() => {
    const loadOrGenerateImage = async () => {
      try {
        const cachedImage = localStorage.getItem(`story_image_${story.id}`);
        if (cachedImage) {
          setImageUrl(cachedImage);
        } else {
          setIsGenerating(true);
          const prompt = `A vibrant and colorful children's book illustration for the story "${story.title}", an African tale from ${story.country}. Feature the main animal characters in their natural environment. The style should be joyful, simple, and inspired by African folklore art.`;
          const base64Data = await generateImage(prompt);
          if (base64Data) {
            const newImageUrl = `data:image/png;base64,${base64Data}`;
            setImageUrl(newImageUrl);
            localStorage.setItem(`story_image_${story.id}`, newImageUrl);
          }
        }
      } catch (error) {
        console.error(`Failed to generate image for story ${story.id}:`, error);
      } finally {
        setIsGenerating(false);
      }
    };

    loadOrGenerateImage();
  }, [story.id, story.title, story.country]);

  return (
    <div
      onClick={() => onSelect({ ...story, image: imageUrl })}
      className="cursor-pointer group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 bg-white"
    >
      <div className="relative">
        <img className="w-full h-32 sm:h-48 object-cover transition-opacity duration-300" src={imageUrl} alt={story.title} style={{ opacity: isGenerating ? 0.7 : 1 }} />
        {isGenerating && <ImageSpinner />}
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
