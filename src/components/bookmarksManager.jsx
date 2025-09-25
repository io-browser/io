import { useState, useRef, useEffect } from "react";
import { EllipsisVerticalIcon, ArrowTopRightOnSquareIcon } from "@heroicons/react/16/solid";

export default function BookmarksManager() {
    const [bookmarks, setBookmarks] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [openMoreOptions, setOpenMoreOptions] = useState(null);
    const [openEditName, setOpenEditName] = useState(null);
    const [editedName, setEditedName] = useState(null);
    const [loading, setLoading] = useState(false);
    const containerReference = useRef();

    useEffect(() => {
        loadBookmarks();
    }, []);

    async function loadBookmarks() {
        if (loading) return;
        setLoading(true);

        const newBookmarks = await window.electron.getBookmarks({
            page: pageNumber,
            limit: 50,
        });

        if (newBookmarks?.length) {
            setBookmarks((prev) => [...prev, ...newBookmarks]);
            setPageNumber((prev) => prev + 1);
        }

        setLoading(false);
    }

    function handleScroll() {
        const container = containerReference.current;
        if (!container) return;

        if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
            loadBookmarks();
        }
    }

    function toggleMoreOptions(index) {
        setOpenMoreOptions((prev) => (prev === index ? null : index));
    }

    function toggleOpenEditName(index) {
        if (openEditName === index) {
            setOpenEditName(null);
            setEditedName(null);
        } else {
            setOpenEditName(index);
            setEditedName(bookmarks[index][2]);
        }

        setOpenMoreOptions(null)
    }

    function handleRemoveBookmarkFromHistory(id) {
        if (!id) return;

        setBookmarks((prev) => prev.filter((item) => item[0] !== id));
        window.electron.deleteBookmark({ id });
        setOpenMoreOptions(null)
    }

    function handleKeyDown(e, index, id) {
        if (e.key === "Enter" && editedName !== null) {
            const updated = [...bookmarks];
            updated[index][2] = editedName;
            setBookmarks(updated);
            setOpenEditName(null);

            window.electron.updateBookmarkName({ id, name: editedName });
        }
    }

    function handleEditNameChange(e) {
        setEditedName(e.target.value);
    }

    return (
        <div
            className="bg-shark-950 text-shark-50 h-screen flex flex-col gap-1 p-1 overflow-auto w-9xl"
            ref={containerReference}
            onScroll={handleScroll}
        >
            {bookmarks &&
                bookmarks.map((h, index) =>
                    h ? (
                        <div
                            className="hover:bg-shark-800 rounded max-w-ms w-xl mx-auto flex items-center justify-stretch gap-2 group"
                            key={h[0]}
                        >
                            <img
                                src={h[1]}
                                alt="favicon"
                                className="rounded size-4 mx-2"
                            />

                            {openEditName === index ? (
                                <input
                                    type="text"
                                    className="text-xs flex-grow p-2 bg-shark-600 border"
                                    value={editedName ?? h[2]}
                                    onChange={handleEditNameChange}
                                    onKeyDown={(e) => handleKeyDown(e, index, h[0])}
                                />
                            ) : (
                                <div className="text-xs truncate flex-grow p-2">
                                    {h[2]}
                                </div>
                            )}

                            <a
                                href={h[3]}
                                className="p-2 cursor-pointer hover:bg-shark-500"
                                title={h[3]}
                                target="_blank"
                            >
                                <ArrowTopRightOnSquareIcon className="size-4 text-shark-100" />
                            </a>

                            {/* More Options Button */}
                            <div className="relative">
                                <button
                                    onClick={() => toggleMoreOptions(index)}
                                    className="p-2 rounded-tr rounded-br cursor-pointer hover:bg-shark-500"
                                >
                                    <EllipsisVerticalIcon className="size-4 text-shark-100" />
                                </button>

                                {/* Dropdown Menu */}
                                {openMoreOptions === index && (
                                    <div className="absolute right-0 mt-2 w-40 bg-shark-800 text-shark-100 shadow-lg rounded z-10">
                                        <ul className="py-1 text-sm">
                                            <li>
                                                <button
                                                    className="w-full text-left p-2 hover:bg-shark-900"
                                                    onClick={() => toggleOpenEditName(index)}
                                                >
                                                    Edit
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    className="w-full text-left p-2 hover:bg-shark-900"
                                                    onClick={() =>
                                                        handleRemoveBookmarkFromHistory(h[0])
                                                    }
                                                >
                                                    Delete
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : null
                )}
        </div>
    );
}
