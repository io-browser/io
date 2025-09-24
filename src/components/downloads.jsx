import { useState, useRef, useEffect } from "react";
import { XMarkIcon, ArrowTopRightOnSquareIcon, ClipboardIcon, ClipboardDocumentCheckIcon } from "@heroicons/react/16/solid";

export default function Downloads() {
    const [downloads, setDownloads] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [isCopied, setIsCopied] = useState(false);
    const containerReference = useRef();

    useEffect(() => {
        loadDownloads();
    }, [])

    async function loadDownloads() {
        const Downloads = await window.electron?.getDownloads({ page: pageNumber, limit: 50 });

        if (!Downloads?.length) return;

        setDownloads(prev => prev.concat(Downloads));
        setPageNumber(prev => prev + 1);
    }

    function handleScroll() {
        const container = containerReference.current;
        if (!container) return;

        if ((container.scrollTop + container.clientHeight) >= container.scrollHeight) loadDownloads();
    }

    async function handleCopy(value) {
        try {
            await navigator.clipboard.writeText(value);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 500);
        } catch (err) {
            console.error("Failed to copy: ", err);
        }
    }

    function handleOpenInFileManager(filePath) {
        if (!filePath) return;
        window.electron.openInFileManager({ filePath });
    }

    function handleRemoveDownloadFromHistory(id) {
        if (!id) return;

        setDownloads(downloads.filter(item => item[0] !== id));
        window.electron.deleteDownloadItem({ id });
    }

    return (
        <div className="bg-shark-950 text-shark-50 h-screen flex flex-col gap-1 p-1 overflow-auto w-9xl" ref={containerReference} onScroll={handleScroll}>
            {downloads && downloads.map(h =>
                h && (<div className="hover:bg-shark-800 p-4 rounded max-w-ms w-xl mx-auto flex items-center justify-stretch gap-2 group" key={h[0]}>
                    <img src={h[4]} alt={h[1]} className="rounded size-8" />
                    <a className="text-sm truncate max-w-sm grow-1" href={h[2]}>{h[1]}</a>
                    <button className="text-xs truncate max-w-sm ml-4 opacity-0 group-hover:opacity-100 cursor-pointer" title="copy download link" onClick={() => handleCopy(h[2])}>{isCopied ? <ClipboardDocumentCheckIcon className="size-4" /> : <ClipboardIcon className="size-4" />}</button>
                    <button className="text-xs truncate max-w-sm ml-4 opacity-0 group-hover:opacity-100 cursor-pointer" title='open in file manager' onClick={() => handleOpenInFileManager(h[3])}><ArrowTopRightOnSquareIcon className="size-4" /></button>
                    <button className="text-xs truncate max-w-sm ml-4 opacity-0 group-hover:opacity-100 cursor-pointer" title="remove from history" onClick={() => handleRemoveDownloadFromHistory(h[0])}><XMarkIcon className="size-4" /></button>
                </div>)
            )}
        </div>
    )
}