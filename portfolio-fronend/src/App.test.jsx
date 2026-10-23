import React from 'react';
import { render, screen } from '@testing-library/react';
import { beforeEach, expect, test, vi } from 'vitest';
import App from './App';

const dataState = vi.hoisted(() => ({ value: {} }));

vi.mock('./contexts/DataContext', () => ({
  DataProvider: ({ children }) => children,
  useData: () => dataState.value
}));

vi.mock('./contexts/LanguageContext', () => ({
  LanguageProvider: ({ children }) => children,
  useLanguage: () => ({ t: (key) => key })
}));

vi.mock('./components/Layout/Header', () => ({ default: () => <header>Header</header> }));
vi.mock('./components/Layout/Footer', () => ({ default: () => <footer>Footer</footer> }));
vi.mock('./components/motion/AuroraBackground', () => ({ default: () => null }));
vi.mock('./components/Pages/Home', () => ({ default: () => <section>Portfolio home</section> }));
vi.mock('./components/Pages/About', () => ({ default: () => null }));
vi.mock('./components/Pages/Experience', () => ({ default: () => null }));
vi.mock('./components/Pages/Projects', () => ({ default: () => null }));
vi.mock('./components/Pages/Skills', () => ({ default: () => null }));
vi.mock('./components/Pages/Education', () => ({ default: () => null }));
vi.mock('./components/Pages/Contact', () => ({ default: () => null }));
vi.mock('./components/Admin/AdminLogin', () => ({ default: () => <section>Admin login</section> }));
vi.mock('./components/Admin/AdminPanel', () => ({ default: () => <section>Admin dashboard</section> }));

beforeEach(() => {
  dataState.value = {
    loading: false,
    data: {},
    error: null,
    usingFallback: false,
    isAuthenticated: false,
    authLoading: false,
    fetchData: vi.fn()
  };
  window.history.replaceState({}, '', '/');
  document.head.innerHTML = `
    <meta name="robots" content="index,follow,max-image-preview:large">
    <link rel="canonical" href="https://mahmoudabozahra.vercel.app/">
  `;
});

test('renders the homepage without treating the router location as the browser URL', () => {
  render(<App />);

  expect(screen.getByText('Portfolio home')).toBeInTheDocument();
  expect(document.querySelector('meta[name="robots"]')).toHaveAttribute('content', 'index,follow,max-image-preview:large');
  expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute('href', 'https://mahmoudabozahra.vercel.app/');
});

test('renders the unauthenticated admin login with noindex and no homepage canonical', async () => {
  window.history.replaceState({}, '', '/admin');
  render(<App />);

  expect(await screen.findByText('Admin login')).toBeInTheDocument();
  expect(document.querySelector('meta[name="robots"]')).toHaveAttribute('content', 'noindex,nofollow');
  expect(document.querySelector('link[rel="canonical"]')).not.toHaveAttribute('href');
});

test('does not expose CMS editing when only fallback data is available', async () => {
  dataState.value = { ...dataState.value, isAuthenticated: true, usingFallback: true };
  window.history.replaceState({}, '', '/admin');
  render(<App />);

  expect(await screen.findByRole('heading', { name: 'Admin data unavailable' })).toBeInTheDocument();
  expect(screen.queryByText('Admin dashboard')).not.toBeInTheDocument();
});

test('renders unknown routes as noindex without the homepage canonical', () => {
  window.history.replaceState({}, '', '/missing-page');
  render(<App />);

  expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
  expect(document.querySelector('meta[name="robots"]')).toHaveAttribute('content', 'noindex,nofollow');
  expect(document.querySelector('link[rel="canonical"]')).not.toHaveAttribute('href');
});
