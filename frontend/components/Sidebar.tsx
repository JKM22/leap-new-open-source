import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home, 
  FolderOpen, 
  Plus,
  Settings,
  FileText,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProjects } from '../hooks/useProjects';

export function Sidebar() {
  const location = useLocation();
  const { data: projects } = useProjects();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/projects', icon: FolderOpen, label: 'Projects' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="w-64 bg-leap-dark border-r border-gray-800 flex flex-col">
      {/* Create New App Button */}
      <div className="p-4">
        <Button 
          asChild
          className="w-full bg-leap-accent hover:bg-leap-accent/90 text-black font-medium shadow-lg hover:shadow-xl transition-all duration-200"
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

      {/* Recent Apps */}
      <div className="p-4 border-t border-gray-800">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center">
          <Zap className="h-3 w-3 mr-1" />
          Recent Apps
        </h3>
        <div className="space-y-1">
          {projects?.slice(0, 5).map((project) => (
            <Link
              key={project.id}
              to={`/app/${project.id}`}
              className="flex items-center px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors group"
            >
              <FileText className="h-4 w-4 mr-3 flex-shrink-0" />
              <span className="truncate">{project.title}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* User Avatar */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-leap-accent to-green-400 flex items-center justify-center">
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
