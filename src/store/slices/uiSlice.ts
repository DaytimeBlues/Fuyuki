import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
    viewMode: 'COMBAT' | 'ROLEPLAY';
    isMenuOpen: boolean;
    toast: string | null;
    isInitialized: boolean;
}

const initialState: UIState = {
    viewMode: 'ROLEPLAY',
    isMenuOpen: false,
    toast: null,
    isInitialized: false,
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
        showToast: (state, action: PayloadAction<string>) => {
            state.toast = action.payload;
        },
        clearToast: (state) => {
            state.toast = null;
        },
        setInitialized: (state, action: PayloadAction<boolean>) => {
            state.isInitialized = action.payload;
        },
    },
});

export const {
    setViewMode,
    toggleViewMode,
    openMenu,
    closeMenu,
    toggleMenu,
    showToast,
    clearToast,
    setInitialized,
} = uiSlice.actions;
export default uiSlice.reducer;
