import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MinionDrawer } from '../components/minions/MinionDrawer';
import type { Minion } from '../types';

describe('MinionDrawer', () => {
  const mockMinions: Minion[] = [
    {
      id: '1',
      type: 'Skeleton',
      name: 'Skeleton 1',
      hp: { current: 10, max: 13 },
      ac: 13,
      notes: 'Test notes',
    },
    {
      id: '2',
      type: 'Zombie',
      name: 'Zombie 1',
      hp: { current: 22, max: 22 },
      ac: 8,
      notes: 'Test notes',
    },
  ];

  it('renders minion list when open', () => {
    render(
      <MinionDrawer
        isOpen={true}
        onClose={() => {}}
        minions={mockMinions}
        onAddMinion={() => {}}
        onUpdateMinion={() => {}}
        onRemoveMinion={() => {}}
        onClearMinions={() => {}}
      />
    );

    expect(screen.getByText('Skeleton 1')).toBeInTheDocument();
    expect(screen.getByText('Zombie 1')).toBeInTheDocument();
  });

  it('calls onAddMinion when add button clicked', async () => {
    const user = userEvent.setup();
    const handleAdd = vi.fn();

    render(
      <MinionDrawer
        isOpen={true}
        onClose={() => {}}
        minions={[]}
        onAddMinion={handleAdd}
        onUpdateMinion={() => {}}
        onRemoveMinion={() => {}}
        onClearMinions={() => {}}
      />
    );

    const skeletonButton = screen.getByText('Raise Skeleton');
    await user.click(skeletonButton);

    expect(handleAdd).toHaveBeenCalledWith('Skeleton');
  });

  it('calls onClearMinions when release all clicked', async () => {
    const user = userEvent.setup();
    const handleClear = vi.fn();

    render(
      <MinionDrawer
        isOpen={true}
        onClose={() => {}}
        minions={mockMinions}
        onAddMinion={() => {}}
        onUpdateMinion={() => {}}
        onRemoveMinion={() => {}}
        onClearMinions={handleClear}
      />
    );

    const clearButton = screen.getByText('Release All');
    await user.click(clearButton);

    expect(handleClear).toHaveBeenCalled();
  });

  it('displays minion count', () => {
    render(
      <MinionDrawer
        isOpen={true}
        onClose={() => {}}
        minions={mockMinions}
        onAddMinion={() => {}}
        onUpdateMinion={() => {}}
        onRemoveMinion={() => {}}
        onClearMinions={() => {}}
      />
    );

    expect(screen.getByText(/2 Active/i)).toBeInTheDocument();
  });
});
