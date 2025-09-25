import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function Bookmarks() {
    const [bookmarks, setBookmarks] = useState([])
    const [pageNumber, setPageNumber] = useState(1)
    const { activeTabId } = useSelector(state => state.tabs);

    useEffect(() => {

        loadBookmarks();

        const handleOnTabBookmarked = (_, { id, favicon, name, url }) => {
            setBookmarks(prev => [...prev, [id, favicon, name, url, Date.now()]])
        }

        const handleOnRemoveBookmarked = (_, { id }) => {
            setBookmarks(prev => prev.filter(bookmark => bookmark[0] !== id))
        }

        window.electron.onTabBookmarked(handleOnTabBookmarked)
        window.electron.onRemoveBookmarked(handleOnRemoveBookmarked)

        return () => {
            window.electron.offTabBookmarked(handleOnTabBookmarked)
            window.electron.offRemoveBookmarked(handleOnRemoveBookmarked)
        }
    }, [])

    async function loadBookmarks() {
        const bookmarks = await window.electron?.getBookmarks({ page: pageNumber });

        if (!bookmarks?.length) return;

        setBookmarks(prev => prev.concat(bookmarks));
        setPageNumber(prev => prev + 1);
    }

    function favicon({ src, alt = "favicon", fallback = "/default-favicon.png" }) {
        let finalSrc = fallback;

        if (src?.startsWith("http")) {
            finalSrc = src;
        } else if (src?.startsWith("data:")) {
            finalSrc = `${encodeURIComponent(src)}`;
        }

        return <img src={finalSrc} alt={alt} className="w-4 h-4" />;
    }

    function handleBookmarkOnClick(url) {

        if (!activeTabId) return;

        window.electron.updateTabUrl({ tabId: activeTabId, url });
    }

    return (
        <div className="bg-shark-800 text-shark-50 flex items-center justify-between w-full h-8">
            <div className="flex flex-1 h-full gap-4 overflow-x-auto p-2 scrollbar-none">
                {bookmarks && bookmarks.map(bookmark => (
                    <div
                        key={bookmark[0]}
                        className={`flex items-center justify-evenly cursor-pointer rounded transition-colors`}
                        onClick={() => handleBookmarkOnClick(bookmark[3])}
                    >
                        <div className="flex p-2 justify-center rounded gap-1 items-center overflow-hidden">
                            {favicon({ src: bookmark[1], alt: "favicon" })}
                            <div className="text-sm text-center">
                                {bookmark[2]?.trim()?.substr(0, 10)}
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
}

export default Bookmarks;
