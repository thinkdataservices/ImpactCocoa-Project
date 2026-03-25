import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateMenu } from '../CreateMenu';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
}));

// Mock SVG imports
vi.mock('~/public/icons/close.svg?react', () => ({
  default: () => <svg data-testid="close-icon" />,
}));

vi.mock('~/public/icons/card-create.svg?react', () => ({
  default: () => <svg data-testid="card-create-icon" />,
}));

vi.mock('~/public/icons/stack-create.svg?react', () => ({
  default: () => <svg data-testid="stack-create-icon" />,
}));

describe('CreateMenu', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onCreateCard: vi.fn(),
    onCreateStack: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders when isOpen is true', () => {
    render(<CreateMenu {...defaultProps} />);
    
    expect(screen.getByText('Create New')).toBeInTheDocument();
    expect(screen.getByText('Create Card')).toBeInTheDocument();
    expect(screen.getByText('Create Stack')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(<CreateMenu {...defaultProps} isOpen={false} />);
    
    expect(screen.queryByText('Create New')).not.toBeInTheDocument();
  });

  it('calls onClose and onCreateCard when create card button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onCreateCard = vi.fn();
    
    render(
      <CreateMenu
        {...defaultProps}
        onClose={onClose}
        onCreateCard={onCreateCard}
      />
    );
    
    await user.click(
      screen.getByRole('button', { name: /create a new card/i })
    );
    
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onCreateCard).toHaveBeenCalledTimes(1);
  });

  it('calls onClose and onCreateStack when create stack button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onCreateStack = vi.fn();
    
    render(
      <CreateMenu
        {...defaultProps}
        onClose={onClose}
        onCreateStack={onCreateStack}
      />
    );
    
    await user.click(
      screen.getByRole('button', { name: /create a new stack/i })
    );
    
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onCreateStack).toHaveBeenCalledTimes(1);
  });

  it('displays descriptions for create options', () => {
    render(<CreateMenu {...defaultProps} />);
    
    expect(screen.getByText('Add a new item to your collection')).toBeInTheDocument();
    expect(screen.getByText('Organize cards into a new collection')).toBeInTheDocument();
  });

  it('has accessible button labels', () => {
    render(<CreateMenu {...defaultProps} />);
    
    expect(
      screen.getByRole('button', { name: /create a new card/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /create a new stack/i })
    ).toBeInTheDocument();
  });
});

