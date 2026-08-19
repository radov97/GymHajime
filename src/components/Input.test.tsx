import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Input from './Input';
import { InputType } from '../lib/enums';

describe('Input', () => {
  afterEach(() => vi.useRealTimers());

  it('updates immediately and emits its debounced value', () => {
    vi.useFakeTimers();
    const onChange = vi.fn();
    const onDebouncedChange = vi.fn();
    const setIsTyping = vi.fn();
    render(
      <Input
        placeholder="Exercise"
        onChange={onChange}
        onDebouncedChange={onDebouncedChange}
        debounceDelay={300}
        setIsTyping={setIsTyping}
      />
    );

    fireEvent.change(screen.getByPlaceholderText('Exercise'), { target: { value: 'Squat' } });
    expect(onChange).toHaveBeenCalledOnce();
    expect(setIsTyping).toHaveBeenCalledWith(true);

    act(() => vi.advanceTimersByTime(300));
    expect(onDebouncedChange).toHaveBeenCalledWith('Squat');
    expect(setIsTyping).toHaveBeenLastCalledWith(false);
  });

  it('toggles password visibility', () => {
    render(<Input type={InputType.Password} value="Secret123!" showToggle />);
    const input = screen.getByDisplayValue('Secret123!');
    expect(input).toHaveAttribute('type', 'password');

    fireEvent.click(screen.getByRole('button'));
    expect(input).toHaveAttribute('type', 'text');
  });

  it('shows validation feedback but hides it for disabled inputs', () => {
    const { rerender } = render(<Input error errorText="Required" />);
    expect(screen.getByText('Required')).toBeInTheDocument();

    rerender(<Input error errorText="Required" disabled />);
    expect(screen.queryByText('Required')).not.toBeInTheDocument();
  });
});
