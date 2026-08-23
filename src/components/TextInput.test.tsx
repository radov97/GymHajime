import { Search } from 'lucide-react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import TextInput from './TextInput';

describe('TextInput', () => {
  it('renders a visible label, placeholder, and controlled value', () => {
    render(
      <TextInput
        value="Chest"
        onChange={vi.fn()}
        ariaLabel="Workout name"
        label="Workout name"
        placeholder="e.g. Chest"
      />
    );

    expect(screen.getByText('Workout name')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Workout name' })).toHaveValue('Chest');
    expect(screen.getByPlaceholderText('e.g. Chest')).toBeInTheDocument();
  });

  it('reports changed text', () => {
    const onChange = vi.fn();
    render(<TextInput value="" onChange={onChange} ariaLabel="Workout name" />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Legs' } });
    expect(onChange).toHaveBeenCalledWith('Legs');
  });

  it('renders an icon and invokes the accessible clear action', () => {
    const onClear = vi.fn();
    const { container } = render(
      <TextInput
        type="search"
        value="bench"
        onChange={vi.fn()}
        onClear={onClear}
        clearLabel="Clear search"
        ariaLabel="Search exercises"
        leadingIcon={<Search data-testid="search-icon" />}
      />
    );

    expect(screen.getByTestId('search-icon')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(onClear).toHaveBeenCalledOnce();
    expect(container.querySelector('input')).toHaveClass('pl-10', 'pr-10');
  });

  it('does not accept user input while disabled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TextInput value="Chest" onChange={onChange} ariaLabel="Workout name" disabled />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
    await user.type(input, ' day');
    expect(onChange).not.toHaveBeenCalled();
  });
});
