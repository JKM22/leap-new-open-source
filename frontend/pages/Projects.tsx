import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, Code, ExternalLink } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';

export function Projects() {
  const { data: projects, isLoading } = useProjects();

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-6 bg-gray-900 border-gray-700 animate-pulse">
              <div className="h-4 bg-gray-700 rounded mb-4"></div>
              <div className="h-3 bg-gray-700 rounded mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-2/3"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Projects</h1>
          <p className="text-gray-400 mt-1">
            Manage your generated applications
          </p>
        </div>
        
        <Button asChild className="bg-yellow-500 hover:bg-yellow-600 text-black">
          <Link to="/">
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Link>
        </Button>
      </div>

      {projects && projects.length === 0 ? (
        <Card className="p-12 bg-gray-900 border-gray-700 text-center">
          <div className="text-gray-400">
            <Code className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
            <p className="mb-6">Create your first AI-generated application</p>
            <Button asChild className="bg-yellow-500 hover:bg-yellow-600 text-black">
              <Link to="/">
                <Plus className="h-4 w-4 mr-2" />
                Create Project
              </Link>
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects?.map((project) => (
            <Card key={project.id} className="p-6 bg-gray-900 border-gray-700 hover:border-gray-600 transition-colors">
              <div className="flex flex-col h-full">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-semibold text-white truncate">
                    {project.title}
                  </h3>
                  <Badge variant="secondary" className="ml-2 flex-shrink-0">
                    {project.type}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-400 mb-4 flex-grow line-clamp-3">
                  {project.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(project.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center space-x-1">
                    {project.tags?.map((tag) => (
                      <span
                        key={tag.id}
                        className="px-2 py-1 rounded text-xs"
                        style={{ backgroundColor: tag.color + '20', color: tag.color }}
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button asChild size="sm" variant="outline" className="flex-1 border-gray-600">
                    <Link to={`/projects/${project.id}`}>
                      View Details
                    </Link>
                  </Button>
                  <Button size="sm" variant="ghost" className="px-2">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
