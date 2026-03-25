import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Button, highlightColors } from '../Buttons';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>Click me</Button>);
    await user.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Button</Button>);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('applies highlight color class when highlight prop is provided', () => {
    const { rerender } = render(<Button highlight="1">Button</Button>);
    expect(screen.getByRole('button')).toHaveClass(highlightColors['1']);

    rerender(<Button highlight="2">Button</Button>);
    expect(screen.getByRole('button')).toHaveClass(highlightColors['2']);

    rerender(<Button highlight="3">Button</Button>);
    expect(screen.getByRole('button')).toHaveClass(highlightColors['3']);
  });

  it('renders without highlight class when highlight is empty', () => {
    render(<Button highlight="">Button</Button>);
    const button = screen.getByRole('button');
    expect(button).not.toHaveClass(highlightColors['1']);
  });

  it('can be disabled', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('passes through additional HTML attributes', () => {
    render(<Button type="submit" data-testid="submit-btn">Submit</Button>);
    const button = screen.getByTestId('submit-btn');
    expect(button).toHaveAttribute('type', 'submit');
  });
});

