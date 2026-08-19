import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import HeaderMobile from './HeaderMobile';

vi.mock('./AuthNavigation', () => ({ default: () => <nav>Account navigation</nav> }));
vi.mock('./BrandLogo', () => ({
  default: () => <span role="img" aria-label="GymHajime logo" />,
}));

describe('HeaderMobile', () => {
  it('renders compact GymHajime branding', () => {
    render(<HeaderMobile />);
    expect(screen.getByRole('img', { name: 'GymHajime logo' })).toBeInTheDocument();
    expect(screen.getByText('Account navigation')).toBeInTheDocument();
    expect(screen.getByText('GymHajime')).toBeInTheDocument();
  });
});
