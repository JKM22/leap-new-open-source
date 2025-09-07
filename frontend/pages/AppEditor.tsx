import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileBrowser } from '../components/FileBrowser';
import { CodePreview } from '../components/CodePreview';
import { useProject } from '../hooks/useProject';
import { useToast } from '@/components/ui/use-toast';
import { Rocket, Play, Settings, Share } from 'lucide-react';

export function AppEditor() {
  const { id } = useParams<{ id: string }>();
  const { data: project, isLoading } = useProject(parseInt(id || '0'));
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const { toast } = useToast();

  const handleDeploy = async () => {
    try {
      // Call deployment API
      toast({
        title: "Deploying...",
        description: "Your app is being deployed to the cloud"
      });
      
      // Simulate deployment
      setTimeout(() => {
        toast({
          title: "Deployed!",
          description: "Your app is now live at https://your-app.leap.dev"
        });
      }, 3000);
    } catch (error) {
      toast({
        title: "Deployment failed",
        description: "Please try again or check the logs",
        variant: "destructive"
      });
    }
  };

  // Mock file structure
  const mockFiles = [
    {
      name: 'src',
      type: 'folder' as const,
      path: '/src',
      children: [
        {
          name: 'App.tsx',
          type: 'file' as const,
          path: '/src/App.tsx',
          content: project?.content || '',
          language: 'tsx'
        },
        {
          name: 'components',
          type: 'folder' as const,
          path: '/src/components',
          children: [
            {
              name: 'Header.tsx',
              type: 'file' as const,
              path: '/src/components/Header.tsx',
              content: 'export function Header() { return <header>App Header</header>; }',
              language: 'tsx'
            }
          ]
        }
      ]
    },
    {
      name: 'backend',
      type: 'folder' as const,
      path: '/backend',
      children: [
        {
          name: 'api.ts',
          type: 'file' as const,
          path: '/backend/api.ts',
          content: 'import { api } from "encore.dev/api";\n\nexport const hello = api(...);',
          language: 'typescript'
        }
      ]
    }
  ];

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-8">
        <Card className="p-12 bg-gray-900 border-gray-700 text-center">
          <h2 className="text-xl font-semibold mb-2">App not found</h2>
          <p className="text-gray-400">The requested app could not be found.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{project.title}</h1>
            <p className="text-gray-400 text-sm">Last modified {new Date(project.updatedAt).toLocaleDateString()}</p>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="border-gray-600">
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm" className="border-gray-600">
              <Play className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button variant="outline" size="sm" className="border-gray-600">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button 
              size="sm" 
              onClick={handleDeploy}
              className="bg-leap-accent hover:bg-leap-accent/90 text-black"
            >
              <Rocket className="h-4 w-4 mr-2" />
              Deploy
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* File Browser */}
        <div className="w-80 border-r border-gray-800 p-4">
          <FileBrowser
            files={mockFiles}
            onFileSelect={setSelectedFile}
            selectedFile={selectedFile?.path}
          />
        </div>

        {/* Code Editor/Preview */}
        <div className="flex-1 p-4">
          {selectedFile ? (
            <Card className="h-full bg-gray-900/50 border-gray-700">
              <div className="p-4 border-b border-gray-700">
                <h3 className="font-semibold">{selectedFile.name}</h3>
              </div>
              <div className="p-4 h-full overflow-auto">
                <pre className="bg-leap-dark p-4 rounded text-sm text-gray-300 overflow-x-auto">
                  <code>{selectedFile.content}</code>
                </pre>
              </div>
            </Card>
          ) : (
            <CodePreview
              generatedCode={{
                frontend: project.content,
                backend: 'Generated backend code...',
                documentation: `# ${project.title}\n\nGenerated app`
              }}
              metadata={{
                type: project.type,
                framework: 'react',
                estimatedLines: 150,
                generatedAt: project.createdAt
              }}
              onDeploy={handleDeploy}
              className="h-full"
            />
          )}
        </div>
      </div>
    </div>
  );
}
