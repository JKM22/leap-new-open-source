import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Sparkles, Wand2, Database, Shuffle, Eye, EyeOff } from 'lucide-react';
import { useGenerateCode } from '../hooks/useGenerateCode';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

interface PromptBoxProps {
  onCodeGenerated?: (code: any) => void;
  className?: string;
  showPreview?: boolean;
  onTogglePreview?: () => void;
}

export function PromptBox({ onCodeGenerated, className, showPreview, onTogglePreview }: PromptBoxProps) {
  const [prompt, setPrompt] = useState('');
  const { mutate: generateCode, isPending } = useGenerateCode();
  const { toast } = useToast();

  useEffect(() => {
    const handleFillPrompt = (event: CustomEvent) => {
      setPrompt(event.detail);
    };
    window.addEventListener('fillPrompt', handleFillPrompt as EventListener);
    return () => {
      window.removeEventListener('fillPrompt', handleFillPrompt as EventListener);
    };
  }, []);

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
          description: "App generated successfully!"
        });
        onCodeGenerated?.(data);
        if (showPreview === false && onTogglePreview) {
          onTogglePreview();
        }
      },
      onError: (error) => {
        console.error('Code generation failed:', error);
        toast({
          title: "Error",
          description: "Failed to generate app. Please try again.",
          variant: "destructive"
        });
      }
    });
  };

  const handleSurpriseMe = () => {
    const surprisePrompts = [
      "Build a real-time chat application using web-sockets, with an 80s retro theme",
      "Create a habit tracker with streak counting and beautiful animations",
      "Make a recipe sharing app with ingredient shopping lists",
      "Build a collaborative note-taking app with markdown support",
      "Create a budget tracker with expense categorization and charts",
      "Make a fitness app with workout tracking and progress visualization"
    ];
    
    const randomPrompt = surprisePrompts[Math.floor(Math.random() * surprisePrompts.length)];
    setPrompt(randomPrompt);
  };

  return (
    <Card className={cn("p-6 bg-gray-900/50 border-gray-700 backdrop-blur-sm shadow-xl", className)}>
      <div className="space-y-4">
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Build a real-time chat application using web-sockets, with an 80s retro theme..."
          className="min-h-[120px] bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 resize-none focus:border-leap-accent focus:ring-leap-accent/20"
          disabled={isPending}
          aria-label="App description prompt"
        />
        
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSurpriseMe}
              disabled={isPending}
              className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-leap-accent/50"
            >
              <Shuffle className="h-4 w-4 mr-1" />
              Surprise me
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              disabled={isPending}
              className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-leap-accent/50"
            >
              <Database className="h-4 w-4 mr-1" />
              Connect Database
            </Button>

            {onTogglePreview && (
              <Button
                variant="outline"
                size="sm"
                onClick={onTogglePreview}
                className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-leap-accent/50"
              >
                {showPreview ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-1" />
                    Hide Preview
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-1" />
                    Show Preview
                  </>
                )}
              </Button>
            )}
          </div>
          
          <Button
            onClick={handleSubmit}
            disabled={isPending || !prompt.trim()}
            className="bg-leap-accent hover:bg-leap-accent/90 text-black font-medium px-6 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {isPending ? (
              <>
                <Wand2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate App
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
