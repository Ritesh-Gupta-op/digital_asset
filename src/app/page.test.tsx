import React from 'react';
import { render, screen } from '@testing-library/react';
import HomePage from './page';

describe('HomePage', () => {
  it('renders the product hero copy', () => {
    render(<HomePage />);
    // Match the new Red Noir hero copy
    expect(screen.getByText(/digital license/i)).toBeInTheDocument();
    expect(screen.getByText(/start building/i)).toBeInTheDocument();
  });
});
