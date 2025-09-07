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
      target: "frontend"
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
    <Card className={cn(
      "relative p-8 bg-card-bg/80 backdrop-blur-sm border border-white/20 rounded-3xl shadow-2xl",
      "before:absolute before:inset-0 before:rounded-3xl before:p-[1px] before:bg-gradient-to-r before:from-accent-neon/30 before:via-purple-500/30 before:to-accent-neon/30",
      "before:mask-[linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:mask-composite-[xor] before:[mask-composite:exclude]",
      "animate-fade-in",
      className
    )}>
      <div className="relative z-10 space-y-6">
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Build a real-time chat application using web-sockets, with an 80s retro theme..."
          className="min-h-[140px] bg-bg-dark/50 border-white/20 text-white placeholder-muted-text resize-none focus:border-accent-neon/50 focus:ring-accent-neon/20 rounded-2xl text-lg leading-relaxed"
          disabled={isPending}
          aria-label="App description prompt"
        />
        
        <div className="flex items-center justify-between">
          <div className="flex space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSurpriseMe}
              disabled={isPending}
              className="border-white/20 text-muted-text hover:text-white hover:bg-white/10 hover:border-white/30 transition-all duration-200 hover:scale-105 rounded-full"
            >
              <Shuffle className="h-4 w-4 mr-2" />
              Surprise me
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              disabled={isPending}
              className="border-white/20 text-muted-text hover:text-white hover:bg-white/10 hover:border-white/30 transition-all duration-200 hover:scale-105 rounded-full"
            >
              <Database className="h-4 w-4 mr-2" />
              Connect Database
            </Button>

            {onTogglePreview && (
              <Button
                variant="outline"
                size="sm"
                onClick={onTogglePreview}
                className="border-white/20 text-muted-text hover:text-white hover:bg-white/10 hover:border-white/30 transition-all duration-200 hover:scale-105 rounded-full"
              >
                {showPreview ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    Hide Preview
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Show Preview
                  </>
                )}
              </Button>
            )}
          </div>
          
          <Button
            onClick={handleSubmit}
            disabled={isPending || !prompt.trim()}
            className="bg-accent-neon hover:bg-accent-neon/90 text-black font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{
              filter: isPending ? 'none' : 'drop-shadow(0 0 20px rgba(255, 255, 0, 0.3))'
            }}
          >
            {isPending ? (
              <>
                <Wand2 className="h-5 w-5 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-2" />
                Generate App
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
