export default (TabsClient) => (_, action) => {
    const { tabId, url } = action;

    if (!tabId) return;

    TabsClient.createTab(tabId, url);
}