
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Story } from '../types';
import { generateSpeech } from '../services/geminiService';
import { decode, decodeAudioData } from '../utils/audio';
import { BackArrowIcon, PlayIcon, PauseIcon, LoadingSpinnerIcon } from './icons';

interface StoryScreenProps {
  story: Story;
  onBack: () => void;
}

const StoryScreen: React.FC<StoryScreenProps> = ({ story, onBack }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);

  useEffect(() => {
    // Initialize AudioContext
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }

    // Cleanup on unmount
    return () => {
      stopAudio();
      audioContextRef.current?.close();
    };
  }, []);

  const stopAudio = () => {
    if (audioSourceRef.current) {
      audioSourceRef.current.onended = null;
      audioSourceRef.current.stop();
      audioSourceRef.current = null;
    }
    setIsPlaying(false);
  };

  const playAudio = useCallback(() => {
    if (!audioContextRef.current || !audioBufferRef.current) return;
    stopAudio(); // Stop any previous playback

    const source = audioContextRef.current.createBufferSource();
    source.buffer = audioBufferRef.current;
    source.connect(audioContextRef.current.destination);
    source.onended = () => {
      setIsPlaying(false);
      audioSourceRef.current = null;
    };
    source.start(0);
    audioSourceRef.current = source;
    setIsPlaying(true);
  }, []);

  const handleReadAloud = useCallback(async () => {
    if (isPlaying) {
      stopAudio();
      return;
    }

    if (audioBufferRef.current) {
      playAudio();
      return;
    }

    setIsLoading(true);
    try {
      const fullStoryText = `${story.title}. By a storyteller from ${story.country}. ${story.content.join(' ')}`;
      const base64Audio = await generateSpeech(fullStoryText);
      if (base64Audio && audioContextRef.current) {
        const audioData = decode(base64Audio);
        const buffer = await decodeAudioData(audioData, audioContextRef.current, 24000, 1);
        audioBufferRef.current = buffer;
        playAudio();
      }
    } catch (error) {
      console.error("Failed to generate or play speech:", error);
      alert("Sorry, could not play the story. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [isPlaying, playAudio, story]);

  return (
    <div className="bg-white sm:rounded-2xl shadow-xl overflow-hidden animate-fade-in">
      <div className="relative">
        <img src={story.image} alt={story.title} className="w-full h-48 sm:h-64 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <button
          onClick={onBack}
          className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm rounded-full p-2 text-[#4E342E] hover:bg-white transition-all shadow-md"
          aria-label="Back to stories"
        >
          <BackArrowIcon />
        </button>
        <div className="absolute bottom-0 left-0 p-6">
          <h1 className="text-white text-3xl font-bold">{story.title}</h1>
          <h2 className="text-white/90 text-lg font-semibold">{story.country}</h2>
        </div>
      </div>
      <div className="p-6 sm:p-8 space-y-4 text-lg text-justify leading-relaxed text-[#5D4037]">
        {story.content.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      <div className="p-6 sm:p-8 border-t-2 border-dashed border-orange-200 bg-orange-50">
        <p className="font-bold text-[#D32F2F] text-center">
          <span className="mr-2">✨</span>Moral of the story: <span className="italic">{story.moral}</span>
        </p>
      </div>
      <div className="sticky bottom-0 bg-white/80 backdrop-blur-sm p-4 border-t border-gray-200">
        <button
          onClick={handleReadAloud}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 bg-[#FF7043] text-white font-bold text-xl py-4 px-6 rounded-xl shadow-lg hover:bg-[#F4511E] transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-[#FFAB91] transform hover:scale-105"
        >
          {isLoading ? (
            <>
              <LoadingSpinnerIcon />
              <span>Loading Audio...</span>
            </>
          ) : isPlaying ? (
            <>
              <PauseIcon />
              <span>Pause</span>
            </>
          ) : (
            <>
              <PlayIcon />
              <span>Read Aloud</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default StoryScreen;
