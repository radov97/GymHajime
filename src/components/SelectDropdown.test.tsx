import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import SelectDropdown from './SelectDropdown';

const options = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday', disabled: true },
];

describe('SelectDropdown', () => {
  it('renders its accessible label, options, and selected value', () => {
    render(
      <SelectDropdown
        value="tuesday"
        onChange={vi.fn()}
        options={options}
        ariaLabel="Workout day"
        label="Day"
      />
    );

    const select = screen.getByRole('combobox', { name: 'Workout day' });
    expect(select).toHaveValue('tuesday');
    expect(screen.getByText('Day')).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(3);
    expect(screen.getByRole('option', { name: 'Wednesday' })).toBeDisabled();
  });

  it('reports the selected option value', () => {
    const onChange = vi.fn();
    render(
      <SelectDropdown
        value="monday"
        onChange={onChange}
        options={options}
        ariaLabel="Workout day"
      />
    );

    fireEvent.change(screen.getByRole('combobox', { name: 'Workout day' }), {
      target: { value: 'tuesday' },
    });
    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange).toHaveBeenCalledWith('tuesday');
  });

  it('prevents changes when the dropdown is disabled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <SelectDropdown
        value="monday"
        onChange={onChange}
        options={options}
        ariaLabel="Workout day"
        disabled
      />
    );

    const select = screen.getByRole('combobox', { name: 'Workout day' });
    expect(select).toBeDisabled();
    await user.selectOptions(select, 'tuesday');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('applies wrapper classes and hides the decorative chevron', () => {
    const { container } = render(
      <SelectDropdown
        value="monday"
        onChange={vi.fn()}
        options={options}
        ariaLabel="Workout day"
        className="min-w-56"
      />
    );

    expect(container.firstChild).toHaveClass('min-w-0', 'min-w-56');
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });
});
