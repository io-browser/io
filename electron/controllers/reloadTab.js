export default (TabsClient) => (_, action) => {
    const tabId = action;

    if (!tabId) return;

    TabsClient.reloadTab(tabId);
}