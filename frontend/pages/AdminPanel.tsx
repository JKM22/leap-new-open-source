import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Server, 
  Database, 
  Settings, 
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';

export function AdminPanel() {
  const stats = {
    totalUsers: 1247,
    activeProjects: 89,
    totalProjects: 234,
    systemHealth: 98.5
  };

  const services = [
    { name: 'API Gateway', status: 'healthy', uptime: '99.9%' },
    { name: 'Notes Service', status: 'healthy', uptime: '99.8%' },
    { name: 'CodeGen Service', status: 'warning', uptime: '97.2%' },
    { name: 'Database', status: 'healthy', uptime: '99.9%' },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-400" />;
      default:
        return <CheckCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
          <p className="text-gray-400 mt-1">
            System monitoring and management
          </p>
        </div>
        
        <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
          <Settings className="h-4 w-4 mr-2" />
          System Settings
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 bg-gray-900 border-gray-700">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-400" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-white">{stats.totalUsers.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gray-900 border-gray-700">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-green-400" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Active Projects</p>
              <p className="text-2xl font-bold text-white">{stats.activeProjects}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gray-900 border-gray-700">
          <div className="flex items-center">
            <Database className="h-8 w-8 text-purple-400" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Total Projects</p>
              <p className="text-2xl font-bold text-white">{stats.totalProjects}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gray-900 border-gray-700">
          <div className="flex items-center">
            <Server className="h-8 w-8 text-yellow-400" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">System Health</p>
              <p className="text-2xl font-bold text-white">{stats.systemHealth}%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Admin Tabs */}
      <Card className="bg-gray-900 border-gray-700">
        <Tabs defaultValue="services" className="w-full">
          <div className="border-b border-gray-700 px-6">
            <TabsList className="bg-transparent h-12">
              <TabsTrigger value="services" className="data-[state=active]:bg-gray-800">
                Services
              </TabsTrigger>
              <TabsTrigger value="users" className="data-[state=active]:bg-gray-800">
                Users
              </TabsTrigger>
              <TabsTrigger value="logs" className="data-[state=active]:bg-gray-800">
                System Logs
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-gray-800">
                Settings
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="services" className="mt-0">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Service Status</h3>
              <div className="space-y-4">
                {services.map((service) => (
                  <div key={service.name} className="flex items-center justify-between p-4 bg-gray-950 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(service.status)}
                      <div>
                        <p className="font-medium text-white">{service.name}</p>
                        <p className="text-sm text-gray-400">Uptime: {service.uptime}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Badge 
                        variant="secondary" 
                        className={`${getStatusColor(service.status)} text-white`}
                      >
                        {service.status}
                      </Badge>
                      <Button size="sm" variant="outline" className="border-gray-600">
                        View Logs
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="users" className="mt-0">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">User Management</h3>
              <div className="bg-gray-950 rounded-lg p-8 text-center">
                <Users className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                <p className="text-gray-400">User management interface coming soon</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="logs" className="mt-0">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">System Logs</h3>
              <div className="bg-gray-950 rounded-lg p-4 font-mono text-sm text-gray-300 max-h-96 overflow-y-auto">
                <div className="space-y-1">
                  <div className="text-green-400">[2024-01-15 10:30:25] INFO: All services healthy</div>
                  <div className="text-blue-400">[2024-01-15 10:29:45] INFO: User authentication successful</div>
                  <div className="text-yellow-400">[2024-01-15 10:28:12] WARN: CodeGen service response time elevated</div>
                  <div className="text-green-400">[2024-01-15 10:27:33] INFO: Database backup completed</div>
                  <div className="text-blue-400">[2024-01-15 10:26:58] INFO: New project created</div>
                  <div className="text-gray-500">[2024-01-15 10:25:15] DEBUG: Cache refresh scheduled</div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="mt-0">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">System Configuration</h3>
              <div className="bg-gray-950 rounded-lg p-8 text-center">
                <Settings className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                <p className="text-gray-400">System configuration interface coming soon</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
