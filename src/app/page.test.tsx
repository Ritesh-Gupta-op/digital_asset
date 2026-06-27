import React from 'react';
import { render, screen } from '@testing-library/react';
import HomePage from './page';

describe('HomePage', () => {
  it('renders the product hero copy', () => {
    render(<HomePage />);
    expect(screen.getByText(/Monetize and govern digital IP/i)).toBeInTheDocument();
  });
});
