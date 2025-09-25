import { useSelector, useDispatch } from "react-redux";
import { updateTabUrl } from "../slices/tabs/tabSlice";
import { ArrowLeftIcon, ArrowRightIcon, ArrowPathRoundedSquareIcon, Bars3Icon, StarIcon, ChevronDownIcon, BookmarkIcon, XMarkIcon } from "@heroicons/react/24/solid"
import { BookmarkIcon as UnbookmarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

function Omnibox() {

    const { tabs, activeTabId } = useSelector(state => state.tabs);
    const dispatch = useDispatch();
    const [omniboxUrl, setOmniboxUrl] = useState('');
    const [isBookmarked, setIsBookmarked] = useState(false);

    useEffect(() => {
        const fetchBookmarkStatus = async () => {
            const activeTabIndex = tabs.findIndex(tab => tab.tabId === activeTabId);
            const activeTab = tabs[activeTabIndex];

            if (!activeTab) return;

            const isBookmarked = await window.electron.bookmarkUrlExist({ url: activeTab.tabUrl });
            setIsBookmarked(isBookmarked);

            if (!omniboxUrl.startsWith('io://')) setOmniboxUrl(activeTab.tabUrl);
        };

        fetchBookmarkStatus();
    }, [activeTabId, tabs]);


    function handleOmniboxSearchKeyDown(e) {
        const value = e.target.value?.trim();

        if (e.key == 'Enter') return window.electron.updateTabUrl({ tabId: activeTabId, url: value });
    }

    function handleOmniboxSearch(e) {
        const value = e.target.value;

        dispatch(updateTabUrl({ tabId: activeTabId, tabUrl: value }));
        setOmniboxUrl(value)
    }

    function handleToggleBookmark() {
        if (isBookmarked) {
            setIsBookmarked(false);
            window.electron.deleteBookmarkActiveTab()
        } else {
            setIsBookmarked(true);
            window.electron.bookmarkActiveTab()
        }
    }

    function handleMenuBarClick() {
        window.electron.toggleMenuBar();
    }

    return (
        <>
            <div className="bg-shark-800 text-shark-50 flex items-center px-1 justify-between w-full h-10">
                <div className="flex items-center justify-baseline h-full flex-1 gap-10 max-w-[90%]">
                    <div>
                        <button className="h-full p-2 rounded hover:bg-shark-600" onClick={() => window.electron.goBack()}>
                            <ArrowLeftIcon className="w-4 h-4" />
                        </button>
                        <button className="h-full p-2 rounded hover:bg-shark-600" onClick={() => window.electron.goForward()}>
                            <ArrowRightIcon className="w-4 h-4" />
                        </button>
                        <button className="h-full p-2 rounded hover:bg-shark-600" onClick={() => window.electron.reloadTab({ tabId: activeTabId })}>
                            <ArrowPathRoundedSquareIcon className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="h-full py-1 flex-1">
                        <div className="h-full p-1 bg-shark-950 rounded flex items-center gap-2">
                            <div className="bg-shark-800 rounded h-full w-fit flex items-center justify-baseline px-1 gap-4 cursor-pointer">
                                <StarIcon className="w-4 h-4" />
                                <ChevronDownIcon className="w-3 h-3" />
                            </div>
                            <div className="h-full flex-1 text-[14px] flex items-center">
                                <input type="text" value={omniboxUrl} onChange={handleOmniboxSearch} onKeyDown={handleOmniboxSearchKeyDown} placeholder="Search..." className="border-none focus:outline-none w-full" />
                            </div>
                            <div className="cursor-pointer flex items-center justify-baseline px-1 gap-4" onClick={handleToggleBookmark}>
                                {isBookmarked ? <BookmarkIcon className="w-4 h-4" /> : <UnbookmarkIcon className="w-4 h-4" />}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center px-2">
                    <button className="h-full rounded cursor-pointer" onClick={handleMenuBarClick}>
                        <Bars3Icon className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </>
    );
}

export default Omnibox;
