import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, ExternalLink, Github, Book, Users } from 'lucide-react';

export function TopBar() {
  return (
    <header className="h-16 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Sparkles className="h-8 w-8 text-yellow-400" />
            <span className="text-xl font-bold text-white">Leap.new</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a
              href="https://docs.leap.new"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-slate-300 hover:text-white transition-colors"
            >
              <Book className="h-4 w-4" />
              <span>Docs</span>
              <ExternalLink className="h-3 w-3" />
            </a>
            
            <a
              href="https://blog.leap.new"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-slate-300 hover:text-white transition-colors"
            >
              <span>Blog</span>
              <ExternalLink className="h-3 w-3" />
            </a>
            
            <a
              href="https://discord.gg/leap"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-slate-300 hover:text-white transition-colors"
            >
              <Users className="h-4 w-4" />
              <span>Community</span>
              <ExternalLink className="h-3 w-3" />
            </a>
            
            <a
              href="https://github.com/leap-new/open-source"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-slate-300 hover:text-white transition-colors"
            >
              <Github className="h-4 w-4" />
              <span>GitHub</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </nav>

          {/* User Avatar */}
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
              <span className="text-sm font-bold text-black">U</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
