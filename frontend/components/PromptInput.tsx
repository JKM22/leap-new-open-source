import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Sparkles, Wand2, Database } from 'lucide-react';
import { useGenerateCode } from '../hooks/useGenerateCode';
import { useToast } from '@/components/ui/use-toast';

interface PromptInputProps {
  onCodeGenerated?: (code: any) => void;
}

export function PromptInput({ onCodeGenerated }: PromptInputProps) {
  const [prompt, setPrompt] = useState('');
  const { mutate: generateCode, isPending } = useGenerateCode();
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt",
        variant: "destructive"
      });
      return;
    }

    generateCode({
      prompt: prompt.trim(),
      type: "full-app",
      framework: "react",
      includeTests: true
    }, {
      onSuccess: (data) => {
        toast({
          title: "Success",
          description: "Code generated successfully!"
        });
        onCodeGenerated?.(data);
      },
      onError: (error) => {
        console.error('Code generation failed:', error);
        toast({
          title: "Error",
          description: "Failed to generate code. Please try again.",
          variant: "destructive"
        });
      }
    });
  };

  const handleSurpriseMe = () => {
    const surprisePrompts = [
      "Build a todo app with drag and drop functionality",
      "Create a weather dashboard with beautiful charts",
      "Make a note-taking app with markdown support and tags",
      "Build a habit tracker with streak counting",
      "Create a recipe manager with search and categories",
      "Make a personal finance tracker with expense categorization"
    ];
    
    const randomPrompt = surprisePrompts[Math.floor(Math.random() * surprisePrompts.length)];
    setPrompt(randomPrompt);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl lg:text-6xl font-bold mb-4">
          AI that helps you build
          <br />
          <span className="text-yellow-400">scalable backends</span>
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Leap is <span className="text-yellow-400">not another prototyping tool</span>. 
          It builds functional apps with real backend services, APIs, and deploys to your cloud.
        </p>
      </div>

      {/* Prompt Input Card */}
      <Card className="p-6 bg-gray-900 border-gray-700">
        <div className="space-y-4">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Build a real-time chat application using web-sockets, with an 80s retro theme..."
            className="min-h-[120px] bg-gray-800 border-gray-600 text-white placeholder-gray-400 resize-none focus:border-yellow-400"
            disabled={isPending}
          />
          
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSurpriseMe}
                disabled={isPending}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <Sparkles className="h-4 w-4 mr-1" />
                Surprise me
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                disabled={isPending}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <Database className="h-4 w-4 mr-1" />
                Connect Database
              </Button>
            </div>
            
            <Button
              onClick={handleSubmit}
              disabled={isPending || !prompt.trim()}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-6"
            >
              {isPending ? (
                <>
                  <Wand2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Generate App
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Powered by Encore */}
      <div className="text-center mt-6">
        <p className="text-sm text-gray-500">
          Powered by Encore 🎯 10k+
        </p>
      </div>
    </div>
  );
}
