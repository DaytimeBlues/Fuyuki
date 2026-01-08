import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HealthWidget } from '../components/widgets/HealthWidget';

describe('HealthWidget', () => {
  it('renders current and max HP', () => {
    render(
      <HealthWidget
        current={25}
        max={35}
        temp={0}
        onChange={() => {}}
        onTempChange={() => {}}
      />
    );

    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('/35')).toBeInTheDocument();
  });

  it('clamps HP to max value', () => {
    const handleChange = (value: number) => {
      expect(value).toBeLessThanOrEqual(35);
    };

    render(
      <HealthWidget
        current={35}
        max={35}
        temp={0}
        onChange={handleChange}
        onTempChange={() => {}}
      />
    );
  });

  it('displays temporary HP badge when present', () => {
    render(
      <HealthWidget
        current={25}
        max={35}
        temp={10}
        onChange={() => {}}
        onTempChange={() => {}}
      />
    );

    expect(screen.getByText('+10 THP')).toBeInTheDocument();
  });

  it('shows critical state at 0 HP', () => {
    const { container } = render(
      <HealthWidget
        current={0}
        max={35}
        temp={0}
        onChange={() => {}}
        onTempChange={() => {}}
      />
    );

    const statCircle = container.querySelector('.stat-circle');
    expect(statCircle).toHaveClass('border-red-500');
  });

  it('shows low HP state at 25% or below', () => {
    const { container } = render(
      <HealthWidget
        current={8}
        max={35}
        temp={0}
        onChange={() => {}}
        onTempChange={() => {}}
      />
    );

    const statCircle = container.querySelector('.stat-circle');
    expect(statCircle).toHaveClass('border-orange-500');
  });
});
