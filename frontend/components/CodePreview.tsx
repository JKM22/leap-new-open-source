import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Download, ExternalLink, Eye, EyeOff, Code2, Rocket } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

interface CodePreviewProps {
  generatedCode: {
    frontend?: string;
    backend?: string;
    tests?: string;
    documentation?: string;
  };
  metadata: {
    type: string;
    framework?: string;
    estimatedLines: number;
    generatedAt: Date;
  };
  showPreview?: boolean;
  onTogglePreview?: () => void;
  onDeploy?: () => void;
  className?: string;
}

export function CodePreview({ 
  generatedCode, 
  metadata, 
  showPreview = true, 
  onTogglePreview, 
  onDeploy,
  className 
}: CodePreviewProps) {
  const [activeTab, setActiveTab] = useState('frontend');
  const [viewMode, setViewMode] = useState<'code' | 'preview'>('code');
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

  const handleDownload = (code: string, filename: string) => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { key: 'frontend', label: 'Frontend', code: generatedCode.frontend, filename: 'App.tsx' },
    { key: 'backend', label: 'Backend', code: generatedCode.backend, filename: 'service.ts' },
    { key: 'tests', label: 'Tests', code: generatedCode.tests, filename: 'test.ts' },
    { key: 'documentation', label: 'Docs', code: generatedCode.documentation, filename: 'README.md' }
  ].filter(tab => tab.code);

  if (!showPreview) {
    return (
      <Card className={cn("p-8 bg-gray-900/50 border-gray-700 text-center", className)}>
        <div className="text-gray-400">
          <EyeOff className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">Preview Hidden</h3>
          <p className="mb-4">Code preview is hidden until you generate an application</p>
          {onTogglePreview && (
            <Button onClick={onTogglePreview} variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Show Preview
            </Button>
          )}
        </div>
      </Card>
    );
  }

  if (tabs.length === 0) {
    return (
      <Card className={cn("p-8 bg-gray-900/50 border-gray-700 text-center", className)}>
        <div className="text-gray-400">
          <div className="text-4xl mb-4">🚀</div>
          <p>Generate an app to see the preview</p>
        </div>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Metadata & Actions */}
      <Card className="p-4 bg-gray-900/50 border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <span>Type: {metadata.type}</span>
            {metadata.framework && <span>Framework: {metadata.framework}</span>}
            <span>Lines: {metadata.estimatedLines}</span>
            <span>Generated: {new Date(metadata.generatedAt).toLocaleTimeString()}</span>
          </div>
          
          <div className="flex space-x-2">
            <div className="flex rounded-lg border border-gray-600 overflow-hidden">
              <Button
                size="sm"
                variant={viewMode === 'code' ? 'default' : 'ghost'}
                onClick={() => setViewMode('code')}
                className="rounded-none border-0"
              >
                <Code2 className="h-4 w-4 mr-1" />
                Code
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'preview' ? 'default' : 'ghost'}
                onClick={() => setViewMode('preview')}
                className="rounded-none border-0"
              >
                <Eye className="h-4 w-4 mr-1" />
                Preview
              </Button>
            </div>
            
            {onTogglePreview && (
              <Button size="sm" variant="outline" onClick={onTogglePreview} className="border-gray-600">
                <EyeOff className="h-4 w-4 mr-1" />
                Hide
              </Button>
            )}
            
            {onDeploy && (
              <Button 
                size="sm" 
                onClick={onDeploy}
                className="bg-leap-accent hover:bg-leap-accent/90 text-black"
              >
                <Rocket className="h-4 w-4 mr-1" />
                Deploy
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Content */}
      <Card className="bg-gray-900/50 border-gray-700 overflow-hidden">
        {viewMode === 'code' ? (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="border-b border-gray-700 px-4">
              <TabsList className="bg-transparent h-12">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.key}
                    value={tab.key}
                    className="data-[state=active]:bg-gray-800 data-[state=active]:text-white"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {tabs.map((tab) => (
              <TabsContent key={tab.key} value={tab.key} className="mt-0">
                <div className="relative">
                  {/* Code Actions */}
                  <div className="absolute top-4 right-4 flex space-x-2 z-10">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopy(tab.code || '')}
                      className="bg-gray-800 hover:bg-gray-700"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDownload(tab.code || '', tab.filename)}
                      className="bg-gray-800 hover:bg-gray-700"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Code Content */}
                  <pre className="p-6 bg-leap-dark text-sm text-gray-300 overflow-x-auto max-h-96">
                    <code>{tab.code}</code>
                  </pre>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          /* Preview Mode */
          <div className="p-6">
            <div className="bg-white rounded-lg border shadow-lg min-h-96">
              <div className="bg-gray-100 px-4 py-2 border-b flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="text-sm text-gray-600 ml-4">localhost:3000</div>
              </div>
              
              <div className="p-8 text-center text-gray-600">
                <div className="text-4xl mb-4">🖼️</div>
                <h3 className="text-lg font-semibold mb-2">Live Preview</h3>
                <p className="text-sm">Interactive preview will be available once the application is generated</p>
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Preview shows your generated {metadata.framework || 'React'} application running in real-time</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
