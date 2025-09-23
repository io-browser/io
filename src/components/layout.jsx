import Tabs from "./tabs";
import Omnibox from "./omnibox";

export default function Layout() {

    return (
        <div className='w-screen h-screen bg-shark-500 flex flex-col justify-start items-end'>
            <Tabs />
            <Omnibox />
        </div>
    )
}