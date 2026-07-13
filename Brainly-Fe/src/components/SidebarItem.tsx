import { ReactElement } from "react";

export function SidebarItem({text, icon}: {
    text: string;
    icon: ReactElement;
}) {
    return <div className="flex items-center text-sm font-medium text-slate-600 py-2.5 cursor-pointer hover:bg-violet-50 hover:text-violet-700 rounded-lg px-3 transition-colors">
        <div className="pr-3 text-slate-500">
            {icon}
        </div>
        <div>
         {text}
        </div>
    </div>
}
