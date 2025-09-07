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
    <div className="w-[260px] bg-card-bg/50 border-r border-white/10 flex flex-col backdrop-blur-sm">
      {/* Create New App Button */}
      <div className="p-4">
        <Button 
          asChild
          className="w-full h-12 bg-accent-neon hover:bg-accent-neon/90 text-black font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
        >
          <Link to="/">
            <Plus className="h-5 w-5 mr-2" />
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
              "flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
              isActive(item.path)
                ? "bg-white/10 text-white shadow-sm"
                : "text-muted-text hover:text-white hover:bg-white/5"
            )}
          >
            <item.icon className={cn(
              "h-5 w-5 mr-3 transition-transform duration-200",
              "group-hover:scale-110"
            )} />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Recent Apps */}
      <div className="p-4 border-t border-white/10">
        <h3 className="text-xs font-semibold text-muted-text uppercase tracking-wider mb-3 flex items-center">
          <Zap className="h-3 w-3 mr-1" />
          Recent Apps
        </h3>
        <div className="space-y-1">
          {projects?.slice(0, 5).map((project) => (
            <Link
              key={project.id}
              to={`/app/${project.id}`}
              className="flex items-center px-3 py-2 rounded-lg text-sm text-muted-text hover:text-white hover:bg-white/5 transition-all duration-200 group"
            >
              <FileText className="h-4 w-4 mr-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
              <span className="truncate">{project.title}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* User Avatar */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-neon to-purple-500 flex items-center justify-center shadow-lg">
            <span className="text-sm font-bold text-black">U</span>
          </div>
          <div>
            <p className="text-sm font-medium text-white">User</p>
            <p className="text-xs text-muted-text">Free Plan</p>
          </div>
        </div>
      </div>
    </div>
  );
}
