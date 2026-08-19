import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import GoogleButton from './GoogleButton';

describe('GoogleButton', () => {
  it('renders Google branding and handles clicks', () => {
    const onClick = vi.fn();
    render(<GoogleButton text="Continue with Google" onClick={onClick} width={24} height={24} />);

    fireEvent.click(screen.getByRole('button', { name: /continue with google/i }));
    expect(onClick).toHaveBeenCalledOnce();
    expect(screen.getByRole('img', { name: 'Google' })).toHaveAttribute('width', '24');
  });

  it('cannot be clicked when disabled', () => {
    const onClick = vi.fn();
    render(<GoogleButton disabled onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });
});
