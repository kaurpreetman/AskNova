import React, { useState } from 'react';
import { Send } from 'lucide-react';

const PromptInput = ({ onSubmit }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    onSubmit(prompt);
    setPrompt('');
  };

  return (
    <div className="relative z-10 w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className="overflow-hidden rounded-xl shadow-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:shadow-xl">
          <div className="p-1">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your ML model needs... (e.g., 'Create a sentiment analysis model for Twitter data')"
              className="w-full p-3 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 bg-transparent border-0 focus:ring-0 focus:outline-none resize-none"
              rows={3}
            />
            <div className="flex justify-between items-center px-3 py-2 border-t border-slate-200 dark:border-slate-700">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Powered by advanced AI
              </div>
              <button
                type="submit"
                className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
              >
                <span>Generate</span>
                <Send size={16} className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Decorative elements */}
      <div className="absolute -z-10 -bottom-6 -left-6 w-24 h-24 bg-purple-200 dark:bg-purple-900/30 rounded-full blur-xl opacity-70"></div>
      <div className="absolute -z-10 -top-6 -right-6 w-32 h-32 bg-blue-200 dark:bg-blue-900/30 rounded-full blur-xl opacity-70"></div>
    </div>
  );
};

export default PromptInput;
