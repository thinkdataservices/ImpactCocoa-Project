import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { RoundButton } from '../RoundButton';
import { highlightColors } from '../Buttons';

describe('RoundButton', () => {
  it('renders children correctly', () => {
    render(<RoundButton>X</RoundButton>);
    expect(screen.getByRole('button', { name: 'X' })).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<RoundButton onClick={handleClick}>X</RoundButton>);
    await user.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    render(<RoundButton className="custom-class">X</RoundButton>);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('has rounded-full class for circular shape', () => {
    render(<RoundButton>X</RoundButton>);
    expect(screen.getByRole('button')).toHaveClass('rounded-full');
  });

  it('applies highlight color class when highlight prop is provided', () => {
    render(<RoundButton highlight="1">X</RoundButton>);
    expect(screen.getByRole('button')).toHaveClass(highlightColors['1']);
  });

  it('can be disabled', () => {
    render(<RoundButton disabled>X</RoundButton>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('passes through aria-label attribute', () => {
    render(<RoundButton aria-label="Close modal">X</RoundButton>);
    expect(screen.getByRole('button', { name: 'Close modal' })).toBeInTheDocument();
  });
});

