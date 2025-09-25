export default (TabsClient) => (_, action) => {
    TabsClient.removeBookmarkForActiveTab();
}