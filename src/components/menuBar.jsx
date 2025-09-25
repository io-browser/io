import { ArchiveBoxIcon, ArchiveBoxXMarkIcon, ArrowPathIcon, ArrowDownTrayIcon, BookmarkIcon, CommandLineIcon, Cog8ToothIcon, XMarkIcon, BookOpenIcon, ArrowPathRoundedSquareIcon } from "@heroicons/react/16/solid"
import { useSelector, useDispatch } from "react-redux";
import { createTab, deleteTab } from "../slices/tabs/tabSlice";
import { nanoid } from "@reduxjs/toolkit";

export default function MenuBar() {

    const { activeTabId } = useSelector(state => state.tabs);
    const dispatch = useDispatch();

    function handleCreateNewTab() {
        const newTabId = nanoid();

        dispatch(createTab({ tabId: newTabId }));
        window.electron.createNewTab({ tabId: newTabId });
    }

    function handleCloseTab() {
        if (!activeTabId) return;
        dispatch(deleteTab({ tabId: activeTabId }))
        window.electron.closeTab({ tabId: activeTabId })
    }

    function handleRefreshTab() {
        if (!activeTabId) return;

        window.electron.reloadTab({ tabId: activeTabId });
    }

    function handleBookmarkThisTab() {

        window.electron.bookmarkActiveTab();
    }
    function handleHistory() {
        if (!activeTabId) return

        window.electron.updateTabUrl({ tabId: activeTabId, url: `io://history` });
    }

    function handleDownloads() {
        if (!activeTabId) return

        window.electron.updateTabUrl({ tabId: activeTabId, url: `io://downloads` });
    }
    function handleBookmarks() {
        if (!activeTabId) return

        window.electron.updateTabUrl({ tabId: activeTabId, url: `io://bookmarks` });
    }

    function handleDevTools() {
        window.electron.openDevTools();
    }

    // TODO: handle settings
    // function handleSettings() {

    // }

    function handleExist() {

        window.electron.windowClose();
    }

    return (
        <div className="bg-shark-950 w-[260px] flex-1 p-2 text-shark-200 text-sm">
            <ul className="flex flex-col gap-2">
                <li><button className="hover:bg-shark-900 cursor-pointer rounded w-full text-left p-2 flex items-center justify-between" onClick={handleCreateNewTab}><span className="flex items-center gap-1"><ArchiveBoxIcon className="size-4 mx-1" /> New Tab</span><span className="bg-shark-700 p-1 rounded text-[8px]">Ctr + N</span></button></li>
                <li><button className="hover:bg-shark-900 cursor-pointer rounded w-full text-left p-2 flex items-center justify-between" onClick={handleCloseTab}><span className="flex items-center gap-1"><ArchiveBoxXMarkIcon className="size-4 mx-1" />Close Tab</span><span className="bg-shark-700 p-1 rounded text-[8px]">Ctr + W</span></button></li>
                <hr className="text-shark-800" />
                <li><button className="hover:bg-shark-900 cursor-pointer rounded w-full text-left p-2 flex items-center justify-between" onClick={handleRefreshTab}><span className="flex items-center gap-1"><ArrowPathRoundedSquareIcon className="size-4 mx-1" />Regresh Page</span><span className="bg-shark-700 p-1 rounded text-[8px]">Ctr + R</span></button></li>
                <li><button className="hover:bg-shark-900 cursor-pointer rounded w-full text-left p-2 flex items-center justify-between" onClick={handleBookmarkThisTab}><span className="flex items-center gap-1"><BookmarkIcon className="size-4 mx-1" />Bookmark This Tab</span><span className="bg-shark-700 p-1 rounded text-[8px]">Ctr + D</span></button></li>
                <hr className="text-shark-800" />
                <li><button className="hover:bg-shark-900 cursor-pointer rounded w-full text-left p-2 flex items-center justify-between" onClick={handleHistory}><span className="flex items-center gap-1"><ArrowPathIcon className="size-4 mx-1" />History</span><span className="bg-shark-700 p-1 rounded text-[8px]">Ctr + H</span></button></li>
                <li><button className="hover:bg-shark-900 cursor-pointer rounded w-full text-left p-2 flex items-center justify-between" onClick={handleDownloads}><span className="flex items-center gap-1"><ArrowDownTrayIcon className="size-4 mx-1" />Downloads</span><span className="bg-shark-700 p-1 rounded text-[8px]">Ctr + J</span></button></li>
                <li><button className="hover:bg-shark-900 cursor-pointer rounded w-full text-left p-2 flex items-center justify-between" onClick={handleBookmarks}><span className="flex items-center gap-1"><BookOpenIcon className="size-4 mx-1" />Bookmarks</span><span className="bg-shark-700 p-1 rounded text-[8px]">Ctr + Shift + O</span></button></li>
                <hr className="text-shark-800" />
                <li><button className="hover:bg-shark-900 cursor-pointer rounded w-full text-left p-2 flex items-center justify-between" onClick={handleDevTools}><span className="flex items-center gap-1"><CommandLineIcon className="size-4 mx-1" />Dev Tools</span><span className="bg-shark-700 p-1 rounded text-[8px]">Ctr + Shift + I</span></button></li>
                <li><button className="hover:bg-shark-900 cursor-pointer rounded w-full text-left p-2 flex items-center justify-between" /**TODO: call handleSettings */><span className="flex items-center gap-1"><Cog8ToothIcon className="size-4 mx-1" />Settings</span></button></li>
                <li><button className="hover:bg-shark-900 cursor-pointer rounded w-full text-left p-2 flex items-center justify-between" onClick={handleExist}><span className="flex items-center gap-1"><XMarkIcon className="size-4 mx-1" />Exist</span></button></li>
            </ul>
        </div>
    )
}