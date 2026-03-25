import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Delimiter } from '../Delimiter';

describe('Delimiter', () => {
  it('renders a vertical line element', () => {
    const { container } = render(<Delimiter />);
    const delimiter = container.firstChild as HTMLElement;
    
    expect(delimiter).toBeInTheDocument();
    expect(delimiter).toHaveClass('bg-white/20');
    expect(delimiter).toHaveClass('w-[1px]');
    expect(delimiter).toHaveClass('h-full');
  });

  it('applies custom className', () => {
    const { container } = render(<Delimiter className="mx-4" />);
    const delimiter = container.firstChild as HTMLElement;
    
    expect(delimiter).toHaveClass('mx-4');
  });

  it('always has flex-shrink-0 class', () => {
    const { container } = render(<Delimiter />);
    const delimiter = container.firstChild as HTMLElement;
    
    expect(delimiter).toHaveClass('flex-shrink-0');
  });
});

