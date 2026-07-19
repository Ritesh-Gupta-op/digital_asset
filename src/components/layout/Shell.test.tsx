import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { Shell } from './Shell';
import { ThemeProvider } from '../ThemeProvider';

vi.mock('next/navigation', () => ({
  usePathname: () => '/dashboard',
}));

describe('Shell', () => {
  it('renders navigation links', () => {
    render(
      <ThemeProvider>
        <Shell>
          <div>Child</div>
        </Shell>
      </ThemeProvider>
    );
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Transactions')).toBeInTheDocument();
  });
});
