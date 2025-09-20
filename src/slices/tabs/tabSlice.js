import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialStateTabId = nanoid();

const initialState = {
    tabs: [{
        tabId: initialStateTabId,
        tabUrl: '',
        tabTitle: 'New Tab',
        tabFavicon: null,
        isLoading: false
    }],
    activeTabId: initialStateTabId
};

// Helper function to find tab index
const findTabIndex = (tabs, tabId) => tabs.findIndex(tab => tab.tabId === tabId);

// Helper function to validate tab exists
const validateTabExists = (tabs, tabId) => findTabIndex(tabs, tabId) !== -1;

export const tabSlice = createSlice({
    name: 'tabs',
    initialState,
    reducers: {
        createTab: (state, action) => {
            const {
                tabId = nanoid(),
                tabUrl = '',
                tabFavicon = null,
                tabTitle = 'New Tab',
                isLoading = false
            } = action.payload || {};

            const newTab = {
                tabId,
                tabUrl,
                tabTitle,
                tabFavicon,
                isLoading,
            };

            state.tabs.push(newTab);
            state.activeTabId = tabId;
        },

        deleteTab: (state, action) => {

            if (state.tabs.length <= 1) {
                console.warn('Cannot delete the last remaining tab');
                return;
            }

            const { tabId } = action.payload || {};

            if (!tabId) {
                console.error('No tabId provided for deleteTab action');
                return;
            }

            const tabIndex = findTabIndex(state.tabs, tabId);

            if (tabIndex === -1) {
                console.warn(`Tab with id ${tabId} not found`);
                return;
            }

            const wasActive = state.activeTabId === tabId;

            // Remove the tab
            state.tabs.splice(tabIndex, 1);

            // Handle active tab switching if we deleted the active tab
            if (wasActive && state.tabs.length > 0) {

                const newActiveIndex = tabIndex >= state.tabs.length ? tabIndex - 1 : tabIndex;
                state.activeTabId = state.tabs[newActiveIndex]?.tabId;
            }
        },

        switchTab: (state, action) => {
            if (!state.tabs.length) {
                console.warn('No tabs available to switch to');
                return;
            }

            const { tabId } = action.payload || {};

            if (!tabId) {
                console.error('No tabId provided for switchTab action');
                return;
            }

            if (!validateTabExists(state.tabs, tabId)) {
                console.warn(`Cannot switch to tab ${tabId} - tab not found`);
                return;
            }

            // Don't switch if it's already the active tab
            if (state.activeTabId === tabId) {
                return;
            }

            state.activeTabId = tabId;
        },

        updateTabTitle: (state, action) => {
            const { tabId, tabTitle = 'New Tab' } = action.payload || {};

            if (!tabId) {
                console.error('No tabId provided for updateTabTitle action');
                return;
            }

            const tabIndex = findTabIndex(state.tabs, tabId);

            if (tabIndex === -1) {
                console.warn(`Cannot update title for tab ${tabId} - tab not found`);
                return;
            }

            state.tabs[tabIndex].tabTitle = tabTitle;
        },

        updateTabUrl: (state, action) => {
            const { tabId, tabUrl = '' } = action.payload || {};

            if (!tabId) {
                console.error('No tabId provided for updateTabUrl action');
                return;
            }

            const tabIndex = findTabIndex(state.tabs, tabId);

            if (tabIndex === -1) {
                console.warn(`Cannot update URL for tab ${tabId} - tab not found`);
                return;
            }

            state.tabs[tabIndex].tabUrl = tabUrl;
        },

        updateTabLoadingState: (state, action) => {
            const { tabId, isLoading = false } = action.payload || {};

            if (!tabId) {
                console.error('No tabId provided for updateTabLoadingState action');
                return;
            }

            const tabIndex = findTabIndex(state.tabs, tabId);

            if (tabIndex === -1) {
                console.warn(`Cannot update loading state for tab ${tabId} - tab not found`);
                return;
            }

            state.tabs[tabIndex].isLoading = Boolean(isLoading);
        },

        updateTabFavicon: (state, action) => {
            const { tabId, tabFavicon = null } = action.payload || {};

            if (!tabId) {
                console.error('No tabId provided for updateTabFavicon action');
                return;
            }

            const tabIndex = findTabIndex(state.tabs, tabId);

            if (tabIndex === -1) {
                console.warn(`Cannot update favicon for tab ${tabId} - tab not found`);
                return;
            }

            state.tabs[tabIndex].tabFavicon = tabFavicon;
        },

        // Additional utility actions
        closeAllTabs: (state) => {
            const firstTabId = nanoid();
            state.tabs = [{
                tabId: firstTabId,
                tabUrl: '',
                tabTitle: 'New Tab',
                tabFavicon: null,
                isLoading: false
            }];
            state.activeTabId = firstTabId;
        },

        duplicateTab: (state, action) => {
            const { tabId } = action.payload || {};

            if (!tabId) {
                console.error('No tabId provided for duplicateTab action');
                return;
            }

            const tabIndex = findTabIndex(state.tabs, tabId);

            if (tabIndex === -1) {
                console.warn(`Cannot duplicate tab ${tabId} - tab not found`);
                return;
            }

            const originalTab = state.tabs[tabIndex];
            const newTabId = nanoid();
            const duplicatedTab = {
                ...originalTab,
                tabId: newTabId,
                tabTitle: `${originalTab.tabTitle} - Copy`,
                isLoading: false // Don't copy loading state
            };

            // Insert the duplicated tab right after the original
            state.tabs.splice(tabIndex + 1, 0, duplicatedTab);
            state.activeTabId = newTabId;
        },

        reorderTabs: (state, action) => {
            const { fromIndex, toIndex } = action.payload || {};

            if (typeof fromIndex !== 'number' || typeof toIndex !== 'number') {
                console.error('Invalid indices provided for reorderTabs action');
                return;
            }

            if (fromIndex < 0 || fromIndex >= state.tabs.length ||
                toIndex < 0 || toIndex >= state.tabs.length) {
                console.warn('Tab reorder indices out of bounds');
                return;
            }

            if (fromIndex === toIndex) {
                return; // No change needed
            }

            // Remove the tab from its original position
            const [movedTab] = state.tabs.splice(fromIndex, 1);
            state.tabs.splice(toIndex, 0, movedTab);
        }
    }
});

export const {
    createTab,
    deleteTab,
    switchTab,
    updateTabTitle,
    updateTabUrl,
    updateTabLoadingState,
    updateTabFavicon,
    closeAllTabs,
    duplicateTab,
    reorderTabs
} = tabSlice.actions;

export default tabSlice.reducer;