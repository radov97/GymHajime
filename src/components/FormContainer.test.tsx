import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import FormContainer from './FormContainer';

describe('FormContainer', () => {
  it('renders children on the default translucent surface', () => {
    render(<FormContainer>Workout form</FormContainer>);
    expect(screen.getByText('Workout form')).toHaveClass('bg-white/60');
  });

  it('supports transparent and custom surfaces', () => {
    render(
      <FormContainer noBg className="custom-surface">
        Content
      </FormContainer>
    );
    const container = screen.getByText('Content');
    expect(container).not.toHaveClass('bg-white/60');
    expect(container).toHaveClass('custom-surface');
  });
});
