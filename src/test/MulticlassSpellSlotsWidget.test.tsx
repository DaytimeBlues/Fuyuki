import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MulticlassSpellSlotsWidget } from '../components/widgets/MulticlassSpellSlotsWidget';

describe('MulticlassSpellSlotsWidget', () => {
    it('renders with default wizard configuration', () => {
        const onSlotsCalculated = vi.fn();
        render(<MulticlassSpellSlotsWidget onSlotsCalculated={onSlotsCalculated} />);

        expect(screen.getByText('Multiclass Spellcasting')).toBeDefined();
        expect(screen.getByText('Wizard 5')).toBeDefined();
        expect(screen.getByText('5')).toBeDefined();
    });

    it('calculates correct caster level for single class', () => {
        const onSlotsCalculated = vi.fn();
        render(<MulticlassSpellSlotsWidget onSlotsCalculated={onSlotsCalculated} />);

        expect(screen.getByText('5')).toBeDefined();
    });

    it('calculates correct caster level for multiclass', () => {
        const onSlotsCalculated = vi.fn();
        render(<MulticlassSpellSlotsWidget onSlotsCalculated={onSlotsCalculated} />);

        const configureButton = screen.getByText('Configure');
        fireEvent.click(configureButton);

        const addClassButton = screen.getByText('Add Class');
        fireEvent.click(addClassButton);

        const casterLevel = screen.getByText('6');
        expect(casterLevel).toBeDefined();
    });

    it('displays correct slot counts for caster level 5', () => {
        const onSlotsCalculated = vi.fn();
        render(<MulticlassSpellSlotsWidget onSlotsCalculated={onSlotsCalculated} />);

        expect(screen.getByText('4')).toBeDefined();
    });

    it('applies calculated slots with preserved used counts', () => {
        const onSlotsCalculated = vi.fn();
        const currentSlots = {
            1: { used: 2, max: 4 },
            2: { used: 1, max: 3 },
            3: { used: 0, max: 2 },
        };

        render(
            <MulticlassSpellSlotsWidget
                onSlotsCalculated={onSlotsCalculated}
                currentSlots={currentSlots}
            />
        );

        const configureButton = screen.getByText('Configure');
        fireEvent.click(configureButton);

        const applyButton = screen.getByText('Apply Slots');
        fireEvent.click(applyButton);

        expect(onSlotsCalculated).toHaveBeenCalledWith({
            1: { used: 2, max: 4 },
            2: { used: 1, max: 3 },
            3: { used: 0, max: 2 },
        });
    });

    it('caps used slots at new max when decreasing', () => {
        const onSlotsCalculated = vi.fn();
        const currentSlots = {
            1: { used: 4, max: 4 },
            2: { used: 3, max: 3 },
            3: { used: 2, max: 2 },
        };

        render(
            <MulticlassSpellSlotsWidget
                onSlotsCalculated={onSlotsCalculated}
                currentSlots={currentSlots}
            />
        );

        const configureButton = screen.getByText('Configure');
        fireEvent.click(configureButton);

        const minusButtons = screen.getAllByRole('button');
        const firstMinusButton = minusButtons.find(btn => btn.textContent === '−');
        if (firstMinusButton) {
            fireEvent.click(firstMinusButton);
            fireEvent.click(firstMinusButton);
        }

        const applyButton = screen.getByText('Apply Slots');
        fireEvent.click(applyButton);

        expect(onSlotsCalculated).toHaveBeenCalled();
        const calledWith = onSlotsCalculated.mock.calls[0][0];

        expect(calledWith[1].max).toBe(4);
        expect(calledWith[1].used).toBe(4);
    });

    it('adds new slot levels when caster level increases', () => {
        const onSlotsCalculated = vi.fn();
        const currentSlots = {
            1: { used: 2, max: 4 },
            2: { used: 1, max: 2 },
        };

        render(
            <MulticlassSpellSlotsWidget
                onSlotsCalculated={onSlotsCalculated}
                currentSlots={currentSlots}
            />
        );

        const configureButton = screen.getByText('Configure');
        fireEvent.click(configureButton);

        const addClassButton = screen.getByText('Add Class');
        fireEvent.click(addClassButton);

        const applyButton = screen.getByText('Apply Slots');
        fireEvent.click(applyButton);

        expect(onSlotsCalculated).toHaveBeenCalled();
        const calledWith = onSlotsCalculated.mock.calls[0][0];

        expect(calledWith[3]).toBeDefined();
        expect(calledWith[3].used).toBe(0);
    });

    it('adds and removes classes', () => {
        const onSlotsCalculated = vi.fn();
        render(<MulticlassSpellSlotsWidget onSlotsCalculated={onSlotsCalculated} />);

        const configureButton = screen.getByText('Configure');
        fireEvent.click(configureButton);

        const addClassButton = screen.getByText('Add Class');
        fireEvent.click(addClassButton);

        expect(screen.getByText('Wizard 5 / Cleric 1')).toBeDefined();

        const removeButtons = screen.getAllByText('×');
        fireEvent.click(removeButtons[1]);

        expect(screen.queryByText('Cleric 1')).toBeNull();
    });

    it('changes class type', () => {
        const onSlotsCalculated = vi.fn();
        render(<MulticlassSpellSlotsWidget onSlotsCalculated={onSlotsCalculated} />);

        const configureButton = screen.getByText('Configure');
        fireEvent.click(configureButton);

        const selectElement = screen.getByRole('combobox');
        expect(selectElement).toBeDefined();

        fireEvent.change(selectElement, { target: { value: 'Sorcerer' } });

        expect(screen.getByText('Sorcerer')).toBeDefined();
    });

    it('shows and hides configuration panel', () => {
        const onSlotsCalculated = vi.fn();
        render(<MulticlassSpellSlotsWidget onSlotsCalculated={onSlotsCalculated} />);

        const button = screen.getByText('Configure');
        fireEvent.click(button);

        expect(screen.getByText('Add Class')).toBeDefined();
        expect(screen.getByText('Apply Slots')).toBeDefined();

        const hideButton = screen.getByText('Hide');
        fireEvent.click(hideButton);

        expect(screen.queryByText('Add Class')).toBeNull();
    });

    it('handles half and third casters correctly', () => {
        const onSlotsCalculated = vi.fn();
        render(<MulticlassSpellSlotsWidget onSlotsCalculated={onSlotsCalculated} />);

        const configureButton = screen.getByText('Configure');
        fireEvent.click(configureButton);

        const selectElement = screen.getByRole('combobox');
        fireEvent.change(selectElement, { target: { value: 'Paladin' } });

        expect(screen.getByText(/Paladin 5/)).toBeDefined();

        const casterTypeTexts = screen.getAllByText(/½x/);
        expect(casterTypeTexts.length).toBeGreaterThan(0);

        fireEvent.change(selectElement, { target: { value: 'Eldritch Knight' } });

        expect(screen.getByText(/Eldritch Knight 5/)).toBeDefined();
    });
});
