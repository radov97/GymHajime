import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import DropdownMenu from './DropdownMenu';

describe('DropdownMenu', () => {
  it('renders nothing when closed', () => {
    const { container } = render(<DropdownMenu isOpen={false} options={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders each option and invokes its action', () => {
    const onProfile = vi.fn();
    const onLogout = vi.fn();
    render(
      <DropdownMenu
        isOpen
        options={[
          { id: 'profile', label: 'Profile', onClick: onProfile },
          { id: 'logout', label: 'Logout', onClick: onLogout },
        ]}
      />
    );

    expect(screen.getAllByRole('menuitem')).toHaveLength(2);
    fireEvent.click(screen.getByRole('menuitem', { name: 'Profile' }));
    expect(onProfile).toHaveBeenCalledOnce();
    expect(onLogout).not.toHaveBeenCalled();
  });

  it('prevents disabled options from running', () => {
    const onClick = vi.fn();
    render(
      <DropdownMenu
        isOpen
        options={[{ id: 'disabled', label: 'Unavailable', onClick, disabled: true }]}
      />
    );

    const option = screen.getByRole('menuitem', { name: 'Unavailable' });
    expect(option).toBeDisabled();
    fireEvent.click(option);
    expect(onClick).not.toHaveBeenCalled();
  });
});
