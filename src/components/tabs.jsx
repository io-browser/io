import { useSelector, useDispatch } from "react-redux";
import { createTab, deleteTab } from "../slices/tabs/tabSlice";
import { XMarkIcon, PlusIcon, MinusIcon } from "@heroicons/react/24/solid"
import { Square2StackIcon } from "@heroicons/react/24/outline";

function Tabs() {
    const tabs = useSelector(state => state.tabs);
    const dispatch = useDispatch();

    return (
        <div className="bg-shark-950 text-shark-50 flex items-center justify-between w-full h-10">
            <div className="flex flex-1 h-full overflow-x-auto p-1 scrollbar-none">
                {tabs.map(tab => (
                    <div
                        key={tab.tabId}
                        className={`flex items-center justify-between pl-2 mr-1 cursor-pointer rounded transition-colors group
                        ${tab.isTabActive ? 'bg-shark-800' : 'bg-shark-900'}`}
                        style={{ minWidth: "160px", maxWidth: "200px" }}
                    >
                        <div className="flex items-center gap-1 overflow-hidden">
                            <img
                                src="https://addons.mozilla.org/user-media/addon_icons/2939/2939846-64.png?modified=40e2e836"
                                alt="favicon"
                                className="w-4 h-4"
                            />
                            <p className="truncate text-sm">{tab.tabTitle}</p>
                        </div>
                        <button
                            className="h-full px-1 opacity-0 group-hover:opacity-100 hover:bg-shark-600 rounded-tr rounded-br"
                            onClick={() => dispatch(deleteTab({ tabId: tab.tabId }))}
                        >
                            <XMarkIcon className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
            <button
                className="flex items-center justify-center w-10 h-full text-shark-300 hover:bg-shark-800"
                onClick={() => dispatch(createTab({}))}
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
