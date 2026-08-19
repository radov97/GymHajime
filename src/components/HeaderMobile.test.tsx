import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithIntl } from '@/test/render';
import HeaderMobile from './HeaderMobile';

vi.mock('./AuthNavigation', () => ({ default: () => <nav>Account navigation</nav> }));
vi.mock('./BrandLogo', () => ({
  default: () => <span role="img" aria-label="GymHajime logo" />,
}));

describe('HeaderMobile', () => {
  it('renders compact GymHajime branding', () => {
    renderWithIntl(<HeaderMobile />);
    expect(screen.getByRole('img', { name: 'GymHajime logo' })).toBeInTheDocument();
    expect(screen.getByText('Account navigation')).toBeInTheDocument();
    expect(screen.getByText('GymHajime')).toBeInTheDocument();
  });

  it('opens the Hajime information modal from the question-mark control', () => {
    renderWithIntl(<HeaderMobile />);

    fireEvent.click(screen.getByRole('button', { name: 'What is Hajime?' }));
    expect(screen.getByRole('heading', { name: '始め' })).toBeInTheDocument();
    expect(screen.getByText('HAJIME — BEGIN')).toBeInTheDocument();
  });
});
