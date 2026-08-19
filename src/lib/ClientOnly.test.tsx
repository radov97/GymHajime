import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ClientOnly from './ClientOnly';

describe('ClientOnly', () => {
  it('renders its children after mounting in the browser', async () => {
    render(<ClientOnly>Client content</ClientOnly>);
    expect(await screen.findByText('Client content')).toBeInTheDocument();
  });
});
