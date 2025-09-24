export default (TabsClient) => (_, action) => {
    const { tabId, url } = action;

    if (!tabId) return;

    TabsClient.updateTabUrl(tabId, url);
}