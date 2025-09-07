import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Download, ExternalLink, Eye, EyeOff, Code2, Rocket, Plus } from 'lucide-react';
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
      <Card className={cn(
        "p-12 bg-card-bg/50 backdrop-blur-sm border border-white/10 rounded-3xl text-center animate-fade-in",
        className
      )}>
        <div className="text-muted-text">
          <EyeOff className="h-16 w-16 mx-auto mb-6 opacity-30" />
          <h3 className="text-xl font-semibold mb-3 text-white">Preview Hidden</h3>
          <p className="mb-6 text-lg">Code preview is hidden until you generate an application</p>
          {onTogglePreview && (
            <Button 
              onClick={onTogglePreview} 
              variant="outline" 
              size="sm" 
              className="border-white/20 text-muted-text hover:text-white hover:bg-white/10 hover:border-white/30 transition-all duration-200 hover:scale-105 rounded-full"
            >
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
      <Card className={cn(
        "p-12 bg-card-bg/50 backdrop-blur-sm border border-white/10 rounded-3xl text-center animate-fade-in",
        className
      )}>
        <div className="text-muted-text">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
            <Plus className="h-12 w-12 opacity-30" />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-white">No note selected</h3>
          <p className="text-lg">Generate an app to see the preview</p>
        </div>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-6 animate-fade-in", className)}>
      {/* Metadata & Actions */}
      <Card className="p-4 bg-card-bg/50 backdrop-blur-sm border border-white/10 rounded-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6 text-sm text-muted-text">
            <span>Type: <span className="text-white">{metadata.type}</span></span>
            {metadata.framework && <span>Framework: <span className="text-white">{metadata.framework}</span></span>}
            <span>Lines: <span className="text-white">{metadata.estimatedLines}</span></span>
            <span>Generated: <span className="text-white">{new Date(metadata.generatedAt).toLocaleTimeString()}</span></span>
          </div>
          
          <div className="flex space-x-3">
            <div className="flex rounded-full border border-white/20 overflow-hidden bg-bg-dark/50">
              <Button
                size="sm"
                variant={viewMode === 'code' ? 'default' : 'ghost'}
                onClick={() => setViewMode('code')}
                className="rounded-none border-0 bg-transparent text-white hover:bg-white/10"
              >
                <Code2 className="h-4 w-4 mr-1" />
                Code
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'preview' ? 'default' : 'ghost'}
                onClick={() => setViewMode('preview')}
                className="rounded-none border-0 bg-transparent text-white hover:bg-white/10"
              >
                <Eye className="h-4 w-4 mr-1" />
                Preview
              </Button>
            </div>
            
            {onTogglePreview && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={onTogglePreview} 
                className="border-white/20 text-muted-text hover:text-white hover:bg-white/10 hover:border-white/30 transition-all duration-200 hover:scale-105 rounded-full"
              >
                <EyeOff className="h-4 w-4 mr-1" />
                Hide
              </Button>
            )}
            
            {onDeploy && (
              <Button 
                size="sm" 
                onClick={onDeploy}
                className="bg-accent-neon hover:bg-accent-neon/90 text-black font-semibold rounded-full transition-all duration-200 hover:scale-105"
                style={{
                  filter: 'drop-shadow(0 0 10px rgba(255, 255, 0, 0.3))'
                }}
              >
                <Rocket className="h-4 w-4 mr-1" />
                Deploy
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Content */}
      <Card className="bg-card-bg/50 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden">
        {viewMode === 'code' ? (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="border-b border-white/10 px-6">
              <TabsList className="bg-transparent h-12">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.key}
                    value={tab.key}
                    className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-muted-text hover:text-white transition-all duration-200 rounded-xl"
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
                      className="bg-bg-dark/80 hover:bg-bg-dark text-white rounded-full transition-all duration-200 hover:scale-105"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDownload(tab.code || '', tab.filename)}
                      className="bg-bg-dark/80 hover:bg-bg-dark text-white rounded-full transition-all duration-200 hover:scale-105"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Code Content */}
                  <pre className="p-8 bg-bg-dark/50 text-sm text-gray-200 overflow-x-auto max-h-96 font-mono">
                    <code>{tab.code}</code>
                  </pre>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          /* Preview Mode */
          <div className="p-8">
            <div className="bg-white rounded-2xl border shadow-2xl min-h-96 overflow-hidden">
              <div className="bg-gray-100 px-4 py-3 border-b flex items-center space-x-2">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="text-sm text-gray-600 ml-4 font-mono">localhost:3000</div>
              </div>
              
              <div className="p-12 text-center text-gray-600">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                  <div className="text-4xl">🖼️</div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Live Preview</h3>
                <p className="text-sm mb-6">Interactive preview will be available once the application is generated</p>
                <div className="mt-8 p-6 bg-gray-50 rounded-xl">
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
