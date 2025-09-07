import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home, 
  FolderOpen, 
  Plus,
  Settings,
  Sparkles,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProjects } from '../hooks/useProjects';

export function Sidebar() {
  const location = useLocation();
  const { data: projects } = useProjects();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/projects', icon: FolderOpen, label: 'Projects' },
    { path: '/admin', icon: Settings, label: 'Admin' },
  ];

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-8 w-8 text-yellow-400" />
          <span className="text-xl font-bold">Leap.new</span>
        </div>
      </div>

      {/* Create New App Button */}
      <div className="p-4">
        <Button 
          asChild
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
        >
          <Link to="/">
            <Plus className="h-4 w-4 mr-2" />
            Create new app
          </Link>
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              isActive(item.path)
                ? "bg-gray-800 text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            )}
          >
            <item.icon className="h-4 w-4 mr-3" />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Recent Projects */}
      <div className="p-4 border-t border-gray-800">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Recent Projects
        </h3>
        <div className="space-y-1">
          {projects?.slice(0, 3).map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="flex items-center px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            >
              <FileText className="h-4 w-4 mr-3 flex-shrink-0" />
              <span className="truncate">{project.title}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold text-black">U</span>
          </div>
          <div>
            <p className="text-sm font-medium">User</p>
            <p className="text-xs text-gray-400">Free Plan</p>
          </div>
        </div>
      </div>
    </div>
  );
}
