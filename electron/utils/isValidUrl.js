export function isValidUrl(string) {
    try {
        const url = new URL(string);
        return url;
    } catch (error) {
        console.error(error);
        return false;
    }
}
