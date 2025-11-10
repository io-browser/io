import Tabs from "./tabs";
import Omnibox from "./omnibox";
import Bookmarks from "./bookmarks";
import MenuBar from "./menuBar";
import { useEffect, useState } from "react";

export default function Layout() {
  const [showBookmarks, setShowBookmarks] = useState(false);

  useEffect(() => {
    const onShowBookmarks = (_, data) => {
      setShowBookmarks(true);
    };

    const onHideBookmarks = (_, data) => {
      setShowBookmarks(false);
    };

    window.electron?.onShowBookmarks(onShowBookmarks);
    window.electron?.onHideBookmarks(onHideBookmarks);

    return () => {
      window.electron?.offShowBookmarks(onShowBookmarks);
      window.electron?.offHideBookmarks(onHideBookmarks);
    };
  }, []);
  return (
    <div className="w-screen h-screen bg-shark-500 flex flex-col justify-start items-end">
      <Tabs />
      <Omnibox />
      {showBookmarks && <Bookmarks />}
      <MenuBar />
    </div>
  );
}
