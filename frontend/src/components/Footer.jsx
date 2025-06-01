import React from 'react';
import { Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="text-sm text-slate-500 dark:text-slate-400">
              © {new Date().getFullYear()} AskNova. All rights reserved.
            </div>
          </div>

          
        </div>
      </div>
    </footer>
  );
};

export default Footer;
