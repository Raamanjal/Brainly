import { Logo } from "../icons/Logo";
import { TwitterIcon } from "../icons/TwitterIcon";
import { YoutubeIcon } from "../icons/YoutubeIcon";
import { SidebarItem } from "./SidebarItem";
import { ImageIcon } from "../icons/ImageIcon";

export function Sidebar() {
    return <aside className="h-screen bg-white border-r border-slate-200 w-56 fixed left-0 top-0 px-4 py-6">
        <div className="flex text-lg font-semibold text-slate-900 items-center px-1">
            <div className="pr-2 text-violet-600">
                <Logo />
            </div>
            Second Brain
        </div>
        <nav className="pt-9 space-y-1">
            <SidebarItem text="Tweets" icon={<TwitterIcon />} />
            <SidebarItem text="Videos" icon={<YoutubeIcon />} />
            <SidebarItem text="Images" icon={<ImageIcon />} />
        </nav>
    </aside>
}
