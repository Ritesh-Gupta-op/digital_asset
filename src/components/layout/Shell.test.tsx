import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { Shell } from './Shell';

vi.mock('next/navigation', () => ({
  usePathname: () => '/dashboard',
}));

describe('Shell', () => {
  it('renders navigation links', () => {
    render(<Shell><div>Child</div></Shell>);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Transactions')).toBeInTheDocument();
  });
});
