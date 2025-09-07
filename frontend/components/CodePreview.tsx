import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Download, ExternalLink } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

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
}

export function CodePreview({ generatedCode, metadata }: CodePreviewProps) {
  const [activeTab, setActiveTab] = useState('frontend');
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

  if (tabs.length === 0) {
    return (
      <Card className="p-8 bg-gray-900 border-gray-700 text-center">
        <p className="text-gray-400">No code generated yet. Enter a prompt to get started!</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Metadata */}
      <Card className="p-4 bg-gray-900 border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <span>Type: {metadata.type}</span>
            {metadata.framework && <span>Framework: {metadata.framework}</span>}
            <span>Lines: {metadata.estimatedLines}</span>
            <span>Generated: {new Date(metadata.generatedAt).toLocaleTimeString()}</span>
          </div>
          
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" className="border-gray-600">
              <ExternalLink className="h-4 w-4 mr-1" />
              Deploy
            </Button>
          </div>
        </div>
      </Card>

      {/* Code Tabs */}
      <Card className="bg-gray-900 border-gray-700 overflow-hidden">
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
                <pre className="p-6 bg-gray-950 text-sm text-gray-300 overflow-x-auto max-h-96">
                  <code>{tab.code}</code>
                </pre>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </Card>
    </div>
  );
}
