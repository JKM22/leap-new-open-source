import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PromptBox } from '../components/PromptBox';
import { Sparkles, Zap, Code, Database, Globe, Rocket } from 'lucide-react';

export function Home() {
  const [generatedCode, setGeneratedCode] = useState<any>(null);
  const navigate = useNavigate();

  const suggestions = [
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Real-time Chat",
      description: "WebSocket-powered messaging app",
      prompt: "Build a real-time chat application using web-sockets with user authentication and message history"
    },
    {
      icon: <Code className="h-5 w-5" />,
      title: "API Dashboard",
      description: "Monitor and manage APIs",
      prompt: "Create an API monitoring dashboard with real-time metrics, uptime tracking, and alert notifications"
    },
    {
      icon: <Database className="h-5 w-5" />,
      title: "Data Explorer",
      description: "Interactive data visualization",
      prompt: "Build a data exploration tool with interactive charts, filtering, and export capabilities"
    },
    {
      icon: <Globe className="h-5 w-5" />,
      title: "Social Platform",
      description: "Community-driven content",
      prompt: "Create a social platform with user profiles, posts, comments, and real-time interactions"
    }
  ];

  const handleCodeGenerated = (code: any) => {
    setGeneratedCode(code);
    // Navigate to app editor
    setTimeout(() => {
      navigate(`/app/${code.id}`);
    }, 1000);
  };

  return (
    <div className="min-h-full">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <h1 className="text-5xl lg:text-7xl font-bold mb-6">
              AI that helps you build
              <br />
              <span className="text-yellow-400">scalable backends</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              Leap is <span className="text-yellow-400">not another prototyping tool</span>. 
              It builds functional apps with real backend services, APIs, and deploys to your cloud.
            </p>
          </div>

          {/* Prompt Box */}
          <div className="max-w-4xl mx-auto mb-12">
            <PromptBox onCodeGenerated={handleCodeGenerated} />
          </div>

          {/* Powered by Encore */}
          <div className="text-center">
            <p className="text-sm text-slate-400">
              Powered by Encore 🎯 10k+ developers
            </p>
          </div>
        </div>
      </div>

      {/* Suggestions Section */}
      <div className="bg-slate-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-white">Get started with these ideas</h2>
            <p className="text-slate-300">Or try one of our popular templates</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {suggestions.map((suggestion, index) => (
              <Card key={index} className="p-6 bg-slate-800/90 border-slate-600 hover:border-yellow-400/50 transition-all duration-200 cursor-pointer group">
                <div className="flex flex-col h-full">
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-yellow-400/10 rounded-lg text-yellow-400 group-hover:bg-yellow-400/20 transition-colors">
                      {suggestion.icon}
                    </div>
                    <h3 className="ml-3 font-semibold text-white">{suggestion.title}</h3>
                  </div>
                  
                  <p className="text-slate-300 text-sm flex-1 mb-4">{suggestion.description}</p>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-slate-500 text-slate-200 hover:border-yellow-400/50 hover:bg-yellow-400/10"
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
      <div className="bg-slate-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-white">Production-ready from day one</h2>
            <p className="text-slate-300">Built with enterprise-grade tools and best practices</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Rocket className="h-8 w-8 text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Auto-deploy</h3>
              <p className="text-slate-300">Deploy to AWS or GCP with a single click</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Database className="h-8 w-8 text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Real databases</h3>
              <p className="text-slate-300">PostgreSQL with migrations and type safety</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code className="h-8 w-8 text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Type-safe APIs</h3>
              <p className="text-slate-300">End-to-end TypeScript with Encore.ts</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
