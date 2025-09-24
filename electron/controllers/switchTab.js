export default (TabsClient) => (_, action) => {
    const tabId = action;

    if (!tabId) return;

    TabsClient.switchToTab(tabId);

    TabsClient.updateActiveTabBounds();
}