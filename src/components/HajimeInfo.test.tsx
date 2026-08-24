import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HajimeInfoSection } from '@/lib/enums';
import { renderWithIntl } from '@/test/render';
import HajimeInfo from './HajimeInfo';

describe('HajimeInfo', () => {
  it('opens the product story and closes it from the primary action', () => {
    renderWithIntl(<HajimeInfo />);

    fireEvent.click(screen.getByRole('button', { name: 'What is Hajime?' }));
    expect(screen.getByRole('heading', { name: '始め' })).toBeInTheDocument();
    expect(screen.getByText('HAJIME — BEGIN')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'DAILY TRAINING' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'DISCOVER' })).toBeInTheDocument();
    expect(screen.getByText('Your routine. Your progress. Your Hajime.')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Let’s begin →' }));
    expect(screen.queryByRole('heading', { name: '始め' })).not.toBeInTheDocument();
  });

  it('closes from the top-right X', () => {
    renderWithIntl(<HajimeInfo />);
    fireEvent.click(screen.getByRole('button', { name: 'What is Hajime?' }));
    fireEvent.click(screen.getByRole('button', { name: 'Close modal' }));
    expect(screen.queryByRole('heading', { name: '始め' })).not.toBeInTheDocument();
  });

  it('closes when the backdrop is clicked', () => {
    renderWithIntl(<HajimeInfo />);
    fireEvent.click(screen.getByRole('button', { name: 'What is Hajime?' }));
    fireEvent.click(screen.getByTestId('modal-backdrop'));
    expect(screen.queryByRole('heading', { name: '始め' })).not.toBeInTheDocument();
  });

  it('uses the shared section identifiers for translated content', () => {
    expect(HajimeInfoSection.Plan).toBe('plan');
  });

  it('supports an accessible icon-only trigger for compact headers', () => {
    renderWithIntl(<HajimeInfo iconOnly />);

    const trigger = screen.getByRole('button', { name: 'What is Hajime?' });
    expect(trigger).not.toHaveTextContent('What is Hajime?');
    fireEvent.click(trigger);
    expect(screen.getByRole('heading', { name: '始め' })).toBeInTheDocument();
  });
});
