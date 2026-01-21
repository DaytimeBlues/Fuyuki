import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Position stored as percentages (0-100) for responsiveness
export interface WidgetPosition {
    x: number; // percentage from left
    y: number; // percentage from top
}

interface WidgetState {
    positions: Record<string, WidgetPosition>;
}

// Default positions (percentage-based, bottom-right area)
const DEFAULT_POSITIONS: Record<string, WidgetPosition> = {
    combat: { x: 90, y: 75 },
    concentration: { x: 90, y: 65 },
    voice: { x: 90, y: 55 },
    minion: { x: 90, y: 45 },
};

// Load from localStorage
const loadPositions = (): Record<string, WidgetPosition> => {
    try {
        const saved = localStorage.getItem('fuyuki:widget-positions');
        if (saved) {
            return { ...DEFAULT_POSITIONS, ...JSON.parse(saved) };
        }
    } catch {
        // Ignore parse errors
    }
    return DEFAULT_POSITIONS;
};

const initialState: WidgetState = {
    positions: loadPositions(),
};

const widgetSlice = createSlice({
    name: 'widget',
    initialState,
    reducers: {
        setWidgetPosition: (
            state,
            action: PayloadAction<{ id: string; position: WidgetPosition }>
        ) => {
            state.positions[action.payload.id] = action.payload.position;
            // Persist to localStorage
            try {
                localStorage.setItem(
                    'fuyuki:widget-positions',
                    JSON.stringify(state.positions)
                );
            } catch {
                // Ignore storage errors
            }
        },
        resetWidgetPositions: (state) => {
            state.positions = DEFAULT_POSITIONS;
            try {
                localStorage.removeItem('fuyuki:widget-positions');
            } catch {
                // Ignore storage errors
            }
        },
    },
});

export const { setWidgetPosition, resetWidgetPositions } = widgetSlice.actions;
export default widgetSlice.reducer;
