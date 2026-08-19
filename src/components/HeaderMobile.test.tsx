import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import HeaderMobile from './HeaderMobile';

vi.mock('./AuthNavigation', () => ({ default: () => <nav>Account navigation</nav> }));

describe('HeaderMobile', () => {
  it('renders compact GymHajime branding', () => {
    render(<HeaderMobile />);
    expect(screen.getByText('GymHajime')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'GymHajime logo' })).toBeInTheDocument();
  });
});
