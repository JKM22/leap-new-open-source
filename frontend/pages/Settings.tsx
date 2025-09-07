import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Github, Cloud, Database, Key, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export function Settings() {
  const [githubRepo, setGithubRepo] = useState('');
  const [deployTarget, setDeployTarget] = useState('aws');
  const [apiKey, setApiKey] = useState('');
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your configuration has been updated successfully"
    });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-400 mt-2">Configure your development and deployment preferences</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="github">GitHub</TabsTrigger>
          <TabsTrigger value="deployment">Deployment</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="p-6 bg-gray-900/50 border-gray-700">
            <h3 className="text-lg font-semibold mb-4">General Preferences</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="theme">Theme</Label>
                <Select defaultValue="dark">
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="language">Default Language</Label>
                <Select defaultValue="typescript">
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="typescript">TypeScript</SelectItem>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="github" className="space-y-6">
          <Card className="p-6 bg-gray-900/50 border-gray-700">
            <div className="flex items-center mb-4">
              <Github className="h-5 w-5 mr-2" />
              <h3 className="text-lg font-semibold">GitHub Integration</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="github-token">Personal Access Token</Label>
                <Input
                  id="github-token"
                  type="password"
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                  className="bg-gray-800 border-gray-600"
                />
                <p className="text-sm text-gray-400 mt-1">
                  Used for creating repositories and pushing generated code
                </p>
              </div>
              
              <div>
                <Label htmlFor="default-repo">Default Repository Template</Label>
                <Input
                  id="default-repo"
                  value={githubRepo}
                  onChange={(e) => setGithubRepo(e.target.value)}
                  placeholder="username/repo-template"
                  className="bg-gray-800 border-gray-600"
                />
              </div>
              
              <Button className="bg-leap-accent hover:bg-leap-accent/90 text-black">
                <Github className="h-4 w-4 mr-2" />
                Connect GitHub
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="deployment" className="space-y-6">
          <Card className="p-6 bg-gray-900/50 border-gray-700">
            <div className="flex items-center mb-4">
              <Cloud className="h-5 w-5 mr-2" />
              <h3 className="text-lg font-semibold">Deployment Configuration</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="deploy-target">Default Deploy Target</Label>
                <Select value={deployTarget} onValueChange={setDeployTarget}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aws">AWS (Encore Managed)</SelectItem>
                    <SelectItem value="gcp">Google Cloud Platform</SelectItem>
                    <SelectItem value="custom">Custom Infrastructure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {deployTarget === 'aws' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="aws-region">AWS Region</Label>
                    <Select defaultValue="us-east-1">
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
                        <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
                        <SelectItem value="eu-west-1">Europe (Ireland)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              
              {deployTarget === 'gcp' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="gcp-project">GCP Project ID</Label>
                    <Input
                      id="gcp-project"
                      placeholder="my-project-id"
                      className="bg-gray-800 border-gray-600"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="gcp-region">GCP Region</Label>
                    <Select defaultValue="us-central1">
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us-central1">us-central1</SelectItem>
                        <SelectItem value="us-east1">us-east1</SelectItem>
                        <SelectItem value="europe-west1">europe-west1</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card className="p-6 bg-gray-900/50 border-gray-700">
            <div className="flex items-center mb-4">
              <Key className="h-5 w-5 mr-2" />
              <h3 className="text-lg font-semibold">API Keys</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="openai-key">OpenAI API Key</Label>
                <Input
                  id="openai-key"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="bg-gray-800 border-gray-600"
                />
                <p className="text-sm text-gray-400 mt-1">
                  Required for AI-powered code generation
                </p>
              </div>
              
              <div>
                <Label htmlFor="database-url">Database URL</Label>
                <Input
                  id="database-url"
                  type="password"
                  placeholder="postgresql://user:pass@host:port/db"
                  className="bg-gray-800 border-gray-600"
                />
                <p className="text-sm text-gray-400 mt-1">
                  Optional: Connect your own database
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end mt-8">
        <Button onClick={handleSave} className="bg-leap-accent hover:bg-leap-accent/90 text-black">
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}
