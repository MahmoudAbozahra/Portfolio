import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import Projects from './Projects';

vi.mock('../../contexts/DataContext', () => ({ useData: () => ({ data: { projects: [{ _id: 'p1', title: 'ERP Platform', type: 'Work Project', summary: 'Production ERP.', details: ['Built secure workflows.'], tags: ['Django'], images: [] }] } }) }));
vi.mock('../../contexts/LanguageContext', () => ({ useLanguage: () => ({ t: (key) => ({ projects: 'Projects', closeModal: 'Close modal', previousImage: 'Previous image', nextImage: 'Next image' }[key] || key) }) }));

test('project dialog opens, closes with Escape, and restores focus', async () => {
  render(<Projects />);
  const opener = screen.getByRole('button', { name: /explore case study/i });
  opener.focus();
  fireEvent.click(opener);
  expect(screen.getByRole('dialog')).toBeInTheDocument();
  fireEvent.keyDown(document, { key: 'Escape' });
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  await waitFor(() => expect(opener).toHaveFocus());
});
