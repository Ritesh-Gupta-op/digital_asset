import React from 'react';
import { render, screen } from '@testing-library/react';
import HomePage from './page';
import { ThemeProvider } from '../components/ThemeProvider';

describe('HomePage', () => {
  it('renders the product hero copy', () => {
    render(
      <ThemeProvider>
        <HomePage />
      </ThemeProvider>
    );
    expect(screen.getByText(/digital license generator/i)).toBeInTheDocument();
  });
});
