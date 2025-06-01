import React from 'react';

const HeroIllustration = () => {
  return (
    <div className="relative w-full max-w-lg">
      {/* Background glow effects */}
      <div className="absolute -z-10 top-0 -left-4 w-72 h-72 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute -z-10 top-0 -right-4 w-72 h-72 bg-yellow-300 dark:bg-yellow-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -z-10 -bottom-8 left-20 w-72 h-72 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      
      {/* Main illustration container */}
      <div className="relative">
        {/* Code window mockup */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-2 transform rotate-2 transition-transform hover:rotate-0 duration-300 mb-4">
          <div className="bg-slate-100 dark:bg-slate-900 rounded-lg p-4 font-mono text-xs sm:text-sm overflow-hidden">
            <div className="flex items-center mb-3">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div className="ml-auto text-slate-400 dark:text-slate-500">model.py</div>
            </div>
            <div className="space-y-1">
              <div className="text-blue-600 dark:text-blue-400">import <span className="text-green-600 dark:text-green-400">tensorflow as tf</span></div>
              <div className="text-purple-600 dark:text-purple-400">from <span className="text-green-600 dark:text-green-400">tensorflow.keras.models</span> import Sequential</div>
              <div className="text-purple-600 dark:text-purple-400">from <span className="text-green-600 dark:text-green-400">tensorflow.keras.layers</span> import Dense, LSTM</div>
              <div className="text-slate-600 dark:text-slate-400"># AskNova generated model</div>
              <div className="mt-2 text-slate-800 dark:text-slate-200">model = Sequential([</div>
              <div className="pl-4 text-slate-800 dark:text-slate-200">LSTM(64, return_sequences=True),</div>
              <div className="pl-4 text-slate-800 dark:text-slate-200">LSTM(32),</div>
              <div className="pl-4 text-slate-800 dark:text-slate-200">Dense(1, activation='sigmoid')</div>
              <div className="text-slate-800 dark:text-slate-200">])</div>
            </div>
          </div>
        </div>
        
        {/* Dataset card mockup */}
        <div className="absolute right-0 top-1/2 bg-white dark:bg-slate-800 rounded-xl shadow-xl p-4 transform -rotate-3 transition-transform hover:rotate-0 duration-300 w-48 sm:w-64 -mt-16">
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <div className="text-blue-600 dark:text-blue-400 font-bold">D</div>
            </div>
            <div className="ml-2">
              <div className="text-sm font-semibold text-slate-800 dark:text-white">Dataset</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Recommended</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full w-full"></div>
            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full w-3/4"></div>
            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full w-5/6"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroIllustration;
