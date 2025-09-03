import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
    tabs: [{ tabId: nanoid(), tabUrl: ``, tabFavIcon: ``, tabTitle: `New Tab`, isTabActive: true }]
}



export const tabSlice = createSlice({
    name: 'Tabs',
    initialState,
    reducers: {
        createTab: (state, action) => {

            const { tabUrl = '', tabFavIcon = ``, tabTitle = `New Tab`, isTabActive = true } = action.payload;
            const newTab = {
                tabId: nanoid(),
                tabUrl,
                tabTitle,
                tabFavIcon,
                tabFavIcon,
                isTabActive,
            }

            state.tabs.map(tab => tab.isTabActive = false);
            state.tabs.push(newTab);
        },

        deleteTab: (state, actions) => {

            const { tabId } = actions.payload
            state.tabs = state.tabs.filter(t => t.tabId != tabId);
        },
    }
});

export const { createTab, deleteTab } = tabSlice.actions;

export default tabSlice.reducer;