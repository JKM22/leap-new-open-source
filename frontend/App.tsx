import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TopBar } from './components/TopBar';
import { Sidebar } from './components/Sidebar';
import { Home } from './pages/Home';
import { AppEditor } from './pages/AppEditor';
import { Settings } from './pages/Settings';
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
    <div className="min-h-screen bg-leap-dark text-white">
      <TopBar />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 min-h-[calc(100vh-4rem)]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/app/:id" element={<AppEditor />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
