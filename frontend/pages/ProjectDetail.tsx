import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, ExternalLink, Copy, Download, Play, Settings } from 'lucide-react';
import { useProject } from '../hooks/useProject';
import { useToast } from '@/components/ui/use-toast';

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: project, isLoading } = useProject(parseInt(id || '0'));
  const { toast } = useToast();

  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast({
        title: "Copied!",
        description: "Code copied to clipboard"
      });
    } catch (error) {
      console.error('Copy failed:', error);
      toast({
        title: "Error",
        description: "Failed to copy code",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-2/3 mb-8"></div>
          <div className="h-64 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-8">
        <Card className="p-12 bg-gray-900 border-gray-700 text-center">
          <h2 className="text-xl font-semibold mb-2">Project not found</h2>
          <p className="text-gray-400 mb-4">The requested project could not be found.</p>
          <Button asChild variant="outline">
            <Link to="/projects">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button asChild variant="ghost" size="sm">
            <Link to="/projects">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Link>
          </Button>
          
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl font-bold text-white">{project.title}</h1>
              <Badge variant="secondary">{project.type}</Badge>
            </div>
            <p className="text-gray-400">{project.description}</p>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="border-gray-600">
            <Settings className="h-4 w-4 mr-1" />
            Settings
          </Button>
          <Button size="sm" className="bg-green-600 hover:bg-green-700">
            <Play className="h-4 w-4 mr-1" />
            Deploy
          </Button>
          <Button variant="outline" size="sm" className="border-gray-600">
            <ExternalLink className="h-4 w-4 mr-1" />
            Preview
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card className="bg-gray-900 border-gray-700">
            <Tabs defaultValue="code" className="w-full">
              <div className="border-b border-gray-700 px-6">
                <TabsList className="bg-transparent h-12">
                  <TabsTrigger value="code" className="data-[state=active]:bg-gray-800">
                    Code
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="data-[state=active]:bg-gray-800">
                    Preview
                  </TabsTrigger>
                  <TabsTrigger value="logs" className="data-[state=active]:bg-gray-800">
                    Logs
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="code" className="mt-0">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Generated Code</h3>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopy(project.content)}
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                  
                  <pre className="bg-gray-950 p-4 rounded-lg text-sm text-gray-300 overflow-x-auto max-h-96">
                    <code>{project.content}</code>
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="preview" className="mt-0">
                <div className="p-6">
                  <div className="bg-gray-950 rounded-lg p-8 text-center">
                    <div className="text-gray-400">
                      <div className="text-4xl mb-4">🖼️</div>
                      <h3 className="text-lg font-semibold mb-2">Live Preview</h3>
                      <p>Preview functionality coming soon</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="logs" className="mt-0">
                <div className="p-6">
                  <div className="bg-gray-950 rounded-lg p-4 font-mono text-sm text-gray-300 max-h-96 overflow-y-auto">
                    <div className="space-y-1">
                      <div className="text-green-400">[INFO] Project created successfully</div>
                      <div className="text-blue-400">[INFO] Code generation completed</div>
                      <div className="text-yellow-400">[WARN] No deployment configuration found</div>
                      <div className="text-gray-500">[DEBUG] Ready for deployment</div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Project Info */}
          <Card className="p-6 bg-gray-900 border-gray-700">
            <h3 className="font-semibold mb-4">Project Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Created</span>
                <span>{new Date(project.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Updated</span>
                <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Type</span>
                <span>{project.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status</span>
                <Badge variant="secondary" className="text-xs">
                  Generated
                </Badge>
              </div>
            </div>
          </Card>

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <Card className="p-6 bg-gray-900 border-gray-700">
              <h3 className="font-semibold mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{ backgroundColor: tag.color + '20', color: tag.color }}
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </Card>
          )}

          {/* Actions */}
          <Card className="p-6 bg-gray-900 border-gray-700">
            <h3 className="font-semibold mb-4">Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full border-gray-600">
                Edit Project
              </Button>
              <Button variant="outline" size="sm" className="w-full border-gray-600">
                Duplicate
              </Button>
              <Button variant="outline" size="sm" className="w-full border-red-600 text-red-400 hover:bg-red-600 hover:text-white">
                Delete Project
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
