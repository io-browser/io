import { useSelector, useDispatch } from "react-redux";
import { createTab, deleteTab, switchTab, updateTabTitle, updateTabUrl, updateTabLoadingState, updateTabFavicon } from "../slices/tabs/tabSlice";
import { XMarkIcon, PlusIcon, MinusIcon } from "@heroicons/react/24/solid"
import { Square2StackIcon } from "@heroicons/react/24/outline";
import { useEffect } from "react";
import { nanoid } from "@reduxjs/toolkit";

function Tabs() {
    const { tabs, activeTabId } = useSelector(state => state.tabs);

    const dispatch = useDispatch();

    useEffect(() => {

        window.electron.createNewTab({ tabId: tabs[tabs.length - 1].tabId });

        window.electron.onTabCreated((_, { tabId, isActive, favicon, title, url }) => {
            dispatch(createTab({ tabId, tabFavicon: favicon, tabTitle: title, tabUrl: url }));
            window.electron.createNewTab({ tabId, url });
            dispatch(switchTab({ tabId }))
        })

        window.electron.onTabTitleUpdated((_, { tabId, title }) => {
            dispatch(updateTabTitle({ tabId, tabTitle: title }))
        });

        window.electron.onTabFaviconUpdated((_, { tabId, favicon }) => {
            dispatch(updateTabFavicon({ tabId, tabFavicon: favicon }))
        });

        window.electron.onTabUrlUpdated((_, { tabId, url }) => {
            dispatch(updateTabUrl({ tabId, tabUrl: url }))
        });

        window.electron.onTabLoadingStart((_, { tabId }) => {

            dispatch(updateTabLoadingState({ tabId, isLoading: true }))
        });

        window.electron.onTabLoadingStop((_, { tabId }) => {

            dispatch(updateTabLoadingState({ tabId, isLoading: false }))
        });
    }, [])

    useEffect(() => {
        console.log(`Current active tab: ${activeTabId}`)
    }, [activeTabId])

    const handleCreateTab = () => {
        const tabId = nanoid();
        dispatch(createTab({ tabId }));
        window.electron.createNewTab({ tabId });
    };

    const handleSwitch = (tabId) => {
        dispatch(switchTab({ tabId }));
        window.electron.switchTab({ tabId });
    };

    const handleTabClose = (tabId) => {
        dispatch(deleteTab({ tabId }));
        window.electron.closeTab({ tabId });
    };

    function favicon({ src, alt = "favicon", fallback = "/default-favicon.png" }) {
        let finalSrc = fallback;

        if (src?.startsWith("http")) {
            finalSrc = src;
        } else if (src?.startsWith("data:")) {
            finalSrc = `${encodeURIComponent(src)}`;
        }

        console.log(src);

        return <img src={finalSrc} alt={alt} className="w-4 h-4" />;
    }


    return (
        <div className="bg-shark-950 text-shark-50 flex items-center justify-between w-full h-10">
            <div className="flex flex-1 h-full overflow-x-auto p-1 scrollbar-none">
                {tabs.map(tab => (
                    <div
                        key={tab.tabId}
                        className={`flex items-center justify-between pl-2 mr-1 cursor-pointer rounded transition-colors group
                        ${activeTabId == tab.tabId ? 'bg-shark-800' : 'bg-shark-950'}`}
                        onClick={() => handleSwitch(tab.tabId)}
                        style={{ minWidth: "160px", maxWidth: "200px" }}
                    >
                        <div className="flex items-center gap-1 overflow-hidden">
                            {tab.isLoading ?
                                <div
                                    className="inline-block w-4 aspect-square animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                    role="status">
                                </div>
                                : favicon({ src: tab.tabFavicon, alt: 'favicon' })}
                            <p className="truncate text-sm mx-1">{tab.tabTitle?.trim()}</p>
                        </div>
                        <button
                            className="h-full px-1 opacity-0 group-hover:opacity-100 hover:bg-shark-600 rounded-tr rounded-br"
                            onClick={() => handleTabClose(tab.tabId)}
                        >
                            <XMarkIcon className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
            <button
                className="flex items-center justify-center w-10 h-full text-shark-300 hover:bg-shark-800"
                onClick={handleCreateTab}
            >
                <PlusIcon className="w-5 h-5" />
            </button>
            <div className="w-24 h-full flex items-center justify-between">
                <button className="flex justify-center items-center h-full w-full text-shark-50 hover:bg-shark-800" onClick={() => window.electron.windowMinimize()}>
                    <MinusIcon className="w-4 h-4" />
                </button>
                <button className="flex justify-center items-center h-full w-full text-shark-50 hover:bg-shark-800" onClick={() => window.electron.windowMaximize()}>
                    <Square2StackIcon className="w-4 h-4" />
                </button>
                <button className="flex justify-center items-center h-full w-full text-shark-50 hover:bg-red-700" onClick={() => window.electron.windowClose()}>
                    < XMarkIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

export default Tabs;
