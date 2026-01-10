import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConcentrationWidget } from '../components/widgets/ConcentrationWidget';

describe('ConcentrationWidget', () => {
  it('renders without active concentration', () => {
    render(
      <ConcentrationWidget
        spell={null}
        onClear={() => {}}
        onSet={() => {}}
      />
    );

    expect(screen.getByText('Concentration')).toBeInTheDocument();
    expect(screen.getByText('Not concentrating on any spell')).toBeInTheDocument();
  });

  it('displays active concentration spell', () => {
    render(
      <ConcentrationWidget
        spell="Mage Armor"
        onClear={() => {}}
        onSet={() => {}}
      />
    );

    expect(screen.getByText('Mage Armor')).toBeInTheDocument();
  });

  it('calls onClear when end button is clicked', async () => {
    const user = userEvent.setup();
    const handleClear = vi.fn();

    render(
      <ConcentrationWidget
        spell="Shield"
        onClear={handleClear}
        onSet={() => {}}
      />
    );

    const endButton = screen.getByText('End');
    await user.click(endButton);

    expect(handleClear).toHaveBeenCalled();
  });

  it('allows setting concentration via quick buttons', async () => {
    const user = userEvent.setup();
    const handleSet = vi.fn();

    render(
      <ConcentrationWidget
        spell={null}
        onClear={() => {}}
        onSet={handleSet}
      />
    );

    const blessButton = screen.getByText('Bless');
    await user.click(blessButton);

    expect(handleSet).toHaveBeenCalledWith('Bless');
  });
});
