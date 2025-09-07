import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import { PromptInput } from '../PromptInput';

// Mock the backend client
vi.mock('~backend/client', () => ({
  default: {
    codegen: {
      generate: vi.fn()
    }
  }
}));

// Mock the toast hook
vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('PromptInput', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders prompt input correctly', () => {
    render(<PromptInput />, { wrapper: createWrapper() });
    
    expect(screen.getByText('AI that helps you build')).toBeInTheDocument();
    expect(screen.getByText('scalable backends')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Build a real-time chat application/)).toBeInTheDocument();
  });

  it('shows surprise me button', () => {
    render(<PromptInput />, { wrapper: createWrapper() });
    
    expect(screen.getByText('Surprise me')).toBeInTheDocument();
  });

  it('shows generate button', () => {
    render(<PromptInput />, { wrapper: createWrapper() });
    
    expect(screen.getByText('Generate App')).toBeInTheDocument();
  });

  it('updates prompt when typing', () => {
    render(<PromptInput />, { wrapper: createWrapper() });
    
    const textarea = screen.getByPlaceholderText(/Build a real-time chat application/);
    fireEvent.change(textarea, { target: { value: 'Test prompt' } });
    
    expect(textarea).toHaveValue('Test prompt');
  });

  it('sets random prompt when surprise me is clicked', () => {
    render(<PromptInput />, { wrapper: createWrapper() });
    
    const surpriseButton = screen.getByText('Surprise me');
    const textarea = screen.getByPlaceholderText(/Build a real-time chat application/);
    
    fireEvent.click(surpriseButton);
    
    expect(textarea).toHaveValue(expect.any(String));
    expect((textarea as HTMLTextAreaElement).value.length).toBeGreaterThan(0);
  });
});
