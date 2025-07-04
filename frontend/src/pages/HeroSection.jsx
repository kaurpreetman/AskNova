import React from 'react';
import HeroIllustration from '../components/HeroIllustration';
import { Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const HeroSection = () => {
    const navigate = useNavigate();
     const handleStartGenerating = () => {
    navigate('/generate'); 
  };
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
          {/* Left column with text and input */}
          <div className="mb-12 lg:mb-0 lg:pr-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              Build ML Models <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
                with a Prompt
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl">
              AskNova helps you generate machine learning code and find the right datasets — instantly.
            </p>

            <button
              type="button"
              onClick={handleStartGenerating}
              className="flex items-center px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
            >
              <span>Start Generating</span>
              <Send size={20} className="ml-2" />
            </button>

            <div className="mt-8 flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                <span>ML Model Generation</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                <span>Dataset Recommendations</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
                <span>Code Explanation</span>
              </div>
            </div>
          </div>

          {/* Right column with illustration */}
          <div className="lg:relative lg:h-full flex justify-center items-center">
            <HeroIllustration />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
