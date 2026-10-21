import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import TiltCard from './TiltCard';

test('pointer-driven tilt remains disabled when reduced motion is requested', () => {
  window.matchMedia = (query) => ({ matches: query.includes('prefers-reduced-motion'), media: query, addEventListener: () => {}, removeEventListener: () => {}, addListener: () => {}, removeListener: () => {} });
  render(<TiltCard><span>Quiet card</span></TiltCard>);
  const card = screen.getByText('Quiet card').parentElement;
  fireEvent.pointerMove(card, { clientX: 100, clientY: 40 });
  expect(card.style.transform).toBe('');
});
