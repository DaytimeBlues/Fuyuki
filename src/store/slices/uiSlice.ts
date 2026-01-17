import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
    viewMode: 'COMBAT' | 'ROLEPLAY';
    isMenuOpen: boolean;
}

const initialState: UIState = {
    viewMode: 'ROLEPLAY', // Default to Roleplay ("Roleplay First")
    isMenuOpen: false,
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setViewMode: (state, action: PayloadAction<'COMBAT' | 'ROLEPLAY'>) => {
            state.viewMode = action.payload;
        },
        toggleViewMode: (state) => {
            state.viewMode = state.viewMode === 'COMBAT' ? 'ROLEPLAY' : 'COMBAT';
        },
        openMenu: (state) => {
            state.isMenuOpen = true;
        },
        closeMenu: (state) => {
            state.isMenuOpen = false;
        },
        toggleMenu: (state) => {
            state.isMenuOpen = !state.isMenuOpen;
        },
    },
});

export const { setViewMode, toggleViewMode, openMenu, closeMenu, toggleMenu } = uiSlice.actions;
export default uiSlice.reducer;
