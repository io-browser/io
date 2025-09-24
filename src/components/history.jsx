import { useState, useRef, useEffect } from "react";

export default function History() {
    const [history, setHistory] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const containerReference = useRef();

    useEffect(() => {
        loadHistory();
    }, [])

    async function loadHistory() {

        const history = await window.electron?.getHistory({ page: pageNumber, limit: 50 });

        if (!history?.length) return;

        setHistory(prev => prev.concat(history));
        setPageNumber(prev => prev + 1);
    }

    function handleScroll() {
        const container = containerReference.current;

        if (!container) return;

        if ((container.scrollTop + container.clientHeight) >= container.scrollHeight) loadHistory();
    }

    return (
        <div className="bg-shark-950 text-shark-50 h-screen flex flex-col gap-1 p-1 overflow-auto w-9xl" ref={containerReference} onScroll={handleScroll}>
            {history && history.map(h =>
                h && (<a className="hover:bg-shark-700 p-1 rounded max-w-ms flex items-center justify-stretch gap-2" key={h[0]} href={h[1]}>
                    <span className="text-shark-300 text-sm mx-2">{new Date(h[4]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <div className="flex flex-nowrap items-center gap-2">
                        <img src={h[3]} alt={h[2]} className="rounded size-[14px]" />
                        <span className="text-sm truncate max-w-sm">{h[2]}</span>
                    </div>
                    <span className="text-xs truncate max-w-sm ml-4">{h[1]}</span>
                </a>)
            )}
        </div>
    )
}