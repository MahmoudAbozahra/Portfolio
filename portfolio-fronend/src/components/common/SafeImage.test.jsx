import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import SafeImage from './SafeImage';

describe('SafeImage', () => {
  it('replaces a failed media request with an accessible fallback', () => {
    render(<SafeImage src="/uploads/missing.png" alt="Project preview" fallbackLabel="Project image unavailable" />);
    fireEvent.error(screen.getByRole('img', { name: 'Project preview' }));
    expect(screen.getByRole('img', { name: 'Project preview' })).toHaveTextContent('Project image unavailable');
  });
});
