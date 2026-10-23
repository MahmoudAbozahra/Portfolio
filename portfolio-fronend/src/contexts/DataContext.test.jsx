import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, expect, test, vi } from 'vitest';
import { DataProvider, useData } from './DataContext';
import apiClient from '../lib/apiClient';

vi.mock('../lib/apiClient', () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
  setCsrfToken: vi.fn()
}));

const Probe = () => {
  const { data, loading, usingFallback, fetchData } = useData();
  return (
    <div>
      <span>{loading ? 'loading' : data?.personal?.name}</span>
      <span>{usingFallback ? 'fallback' : 'api'}</span>
      <button type="button" onClick={() => fetchData().catch(() => {})}>Retry</button>
    </div>
  );
};

const renderProvider = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={queryClient}><DataProvider><Probe /></DataProvider></QueryClientProvider>);
};

beforeEach(() => {
  apiClient.get.mockReset();
});

test('uses fallback only after API failure and recovers with newer CMS data', async () => {
  let portfolioAvailable = false;
  apiClient.get.mockImplementation((url) => {
    if (url === '/auth/me') return Promise.reject(Object.assign(new Error('Authentication required'), { response: { status: 401 } }));
    if (url === '/portfolio' && !portfolioAvailable) return Promise.reject(new Error('API unavailable'));
    if (url === '/portfolio') return Promise.resolve({ data: { personal: { name: 'Current CMS profile' } } });
    return Promise.reject(new Error(`Unexpected request: ${url}`));
  });

  renderProvider();

  expect(screen.getByText('loading')).toBeInTheDocument();
  expect(screen.queryByText('Mahmoud Mostafa Abozahra')).not.toBeInTheDocument();
  expect(await screen.findByText('Mahmoud Mostafa Abozahra')).toBeInTheDocument();
  expect(screen.getByText('fallback')).toBeInTheDocument();

  portfolioAvailable = true;
  fireEvent.click(screen.getByRole('button', { name: 'Retry' }));

  await waitFor(() => expect(screen.getByText('Current CMS profile')).toBeInTheDocument());
  expect(screen.getByText('api')).toBeInTheDocument();
});
