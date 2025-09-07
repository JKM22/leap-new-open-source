import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PromptBox } from '../components/PromptBox';
import { CodePreview } from '../components/CodePreview';
import { Sparkles, Zap, Code, Database, Globe, Rocket } from 'lucide-react';

export function Home() {
  const [generatedCode, setGeneratedCode] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();

  const suggestions = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Real-time Chat",
      description: "WebSocket-powered messaging app",
      prompt: "Build a real-time chat application using web-sockets with user authentication and message history"
    },
    {
      icon: <Code className="h-6 w-6" />,
      title: "API Dashboard",
      description: "Monitor and manage APIs",
      prompt: "Create an API monitoring dashboard with real-time metrics, uptime tracking, and alert notifications"
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: "Data Explorer",
      description: "Interactive data visualization",
      prompt: "Build a data exploration tool with interactive charts, filtering, and export capabilities"
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Social Platform",
      description: "Community-driven content",
      prompt: "Create a social platform with user profiles, posts, comments, and real-time interactions"
    }
  ];

  const handleCodeGenerated = (code: any) => {
    setGeneratedCode(code);
    setShowPreview(true);
    // Navigate to app editor
    setTimeout(() => {
      navigate(`/app/${code.id}`);
    }, 1000);
  };

  const handleTogglePreview = () => {
    setShowPreview(!showPreview);
  };

  return (
    <div className="min-h-full">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-bg-dark via-slate-900 to-bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h1 className="text-6xl lg:text-8xl font-bold mb-8 leading-tight animate-fade-in">
              AI that helps you build
              <br />
              <span className="bg-gradient-to-r from-accent-neon via-yellow-300 to-accent-neon bg-clip-text text-transparent">
                scalable backends
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-muted-text max-w-4xl mx-auto mb-12 leading-relaxed animate-fade-in">
              Leap is <span className="text-accent-neon font-semibold">not another prototyping tool</span>. 
              It builds functional apps with real backend services, APIs, and deploys to your cloud.
            </p>
          </div>

          {/* Main Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Left Column - Prompt Input */}
            <div className="flex flex-col justify-center">
              <PromptBox 
                onCodeGenerated={handleCodeGenerated}
                showPreview={showPreview}
                onTogglePreview={handleTogglePreview}
              />
            </div>

            {/* Right Column - Code Preview */}
            <div className="flex flex-col">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-white mb-2">Preview</h2>
                <p className="text-muted-text">
                  {showPreview ? "Generated code and preview" : "Preview hidden until generation"}
                </p>
              </div>
              
              <div className="flex-1">
                {generatedCode ? (
                  <CodePreview 
                    generatedCode={generatedCode.generatedCode}
                    metadata={generatedCode.metadata}
                    showPreview={showPreview}
                    onTogglePreview={handleTogglePreview}
                  />
                ) : (
                  <CodePreview 
                    generatedCode={{}}
                    metadata={{ type: '', estimatedLines: 0, generatedAt: new Date() }}
                    showPreview={showPreview}
                    onTogglePreview={handleTogglePreview}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Powered by Encore */}
          <div className="text-center">
            <p className="text-sm text-muted-text">
              Powered by Encore 🎯 10k+ developers
            </p>
          </div>
        </div>
      </div>

      {/* Suggestions Section */}
      <div className="bg-bg-dark py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-white">Get started with these ideas</h2>
            <p className="text-xl text-muted-text">Or try one of our popular templates</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {suggestions.map((suggestion, index) => (
              <Card 
                key={index} 
                className="p-8 bg-card-bg/50 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-accent-neon/30 transition-all duration-300 cursor-pointer group hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center mb-6">
                    <div className="p-3 bg-accent-neon/10 rounded-xl text-accent-neon group-hover:bg-accent-neon/20 transition-all duration-300 group-hover:scale-110">
                      {suggestion.icon}
                    </div>
                    <h3 className="ml-4 font-semibold text-white text-lg">{suggestion.title}</h3>
                  </div>
                  
                  <p className="text-muted-text mb-6 flex-1 leading-relaxed">{suggestion.description}</p>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-white/20 text-muted-text hover:text-white hover:border-accent-neon/50 hover:bg-accent-neon/10 transition-all duration-200 hover:scale-105 rounded-full"
                    onClick={() => {
                      // Auto-fill prompt and trigger generation
                      const event = new CustomEvent('fillPrompt', { detail: suggestion.prompt });
                      window.dispatchEvent(event);
                    }}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Try this
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gradient-to-br from-slate-900 to-bg-dark py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-white">Production-ready from day one</h2>
            <p className="text-xl text-muted-text">Built with enterprise-grade tools and best practices</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-20 h-20 bg-accent-neon/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-accent-neon/20 transition-all duration-300 group-hover:scale-110">
                <Rocket className="h-10 w-10 text-accent-neon" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Auto-deploy</h3>
              <p className="text-muted-text text-lg leading-relaxed">Deploy to AWS or GCP with a single click</p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-accent-neon/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-accent-neon/20 transition-all duration-300 group-hover:scale-110">
                <Database className="h-10 w-10 text-accent-neon" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Real databases</h3>
              <p className="text-muted-text text-lg leading-relaxed">PostgreSQL with migrations and type safety</p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-accent-neon/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-accent-neon/20 transition-all duration-300 group-hover:scale-110">
                <Code className="h-10 w-10 text-accent-neon" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Type-safe APIs</h3>
              <p className="text-muted-text text-lg leading-relaxed">End-to-end TypeScript with Encore.ts</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
