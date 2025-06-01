import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Github, Moon, Sun, Code, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, login, logout } = useAuth();
   
  return (
    <nav className="sticky top-0 z-10 backdrop-blur-md bg-white/70 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center">
            <div className="flex-shrink-0 text-purple-600 dark:text-purple-400">
              <Code size={28} className="inline-block" />
            </div>
            <div className="ml-2 font-bold text-xl text-slate-900 dark:text-white">
              AskNova
            </div>
          </Link>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-600 hover:text-purple-600 dark:text-slate-300 dark:hover:text-purple-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors duration-200"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <img
                    src={user?.avatarUrl}
                    alt="User avatar"
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {user?.username}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 rounded-full text-slate-600 hover:text-red-600 dark:text-slate-300 dark:hover:text-red-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors duration-200"
                  aria-label="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <button
                onClick={login}
                className="flex items-center px-4 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors duration-200 text-sm font-medium"
              >
                <Github size={18} className="mr-2" />
                <span>Login with GitHub</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
