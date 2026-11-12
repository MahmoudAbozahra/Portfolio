import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import { expect, test } from 'vitest';
import { LanguageProvider } from '../../contexts/LanguageContext';
import Header from './Header';

test('floating navbar visibly compacts after the scroll threshold', async () => {
  render(<LanguageProvider><Header showAdmin={false} setShowAdmin={() => {}} /></LanguageProvider>);
  const header = screen.getByRole('banner');
  expect(header).toHaveClass('is-top');
  Object.defineProperty(window, 'scrollY', { value: 120, configurable: true });
  await act(async () => window.dispatchEvent(new Event('scroll')));
  await waitFor(() => expect(header).toHaveClass('is-scrolled'));
});

test('navigation updates the URL hash while preserving anchor behavior', async () => {
  const target = document.createElement('section');
  target.id = 'projects';
  document.body.appendChild(target);
  render(<LanguageProvider><Header showAdmin={false} setShowAdmin={() => {}} /></LanguageProvider>);
  screen.getByRole('link', { name: 'Projects' }).click();
  expect(window.location.hash).toBe('#projects');
  target.remove();
});

test('does not expose an admin link in the public navigation', () => {
  render(<LanguageProvider><Header showAdmin={false} setShowAdmin={() => {}} /></LanguageProvider>);
  expect(screen.queryByRole('button', { name: /admin/i })).not.toBeInTheDocument();
  expect(screen.queryByRole('link', { name: /admin/i })).not.toBeInTheDocument();
});
