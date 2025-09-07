import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Projects } from './pages/Projects';
import { ProjectDetail } from './pages/ProjectDetail';
import { AdminPanel } from './pages/AdminPanel';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <div className="dark">
      <QueryClientProvider client={queryClient}>
        <Router>
          <AppInner />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </div>
  );
}

function AppInner() {
  return (
    <div className="flex h-screen bg-gray-950 text-gray-100">
      <Sidebar />
      
      <main className="flex-1 overflow-hidden">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
