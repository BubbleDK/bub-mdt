import { NavLink } from "react-router-dom";
import clsx from "clsx";
import { MDT_NAVIGATION } from "../config/mdtNavigation";
import { createTabWindow } from "../lib/createTabWindow";
import { useTabStore } from "../model/useTabStore";

export function TabSidebar() {
    const addTab = useTabStore((state) => state.addTab);

    const handleClick = (event: React.MouseEvent, path: string) => {
        if (!event.ctrlKey && !event.metaKey) return;

        event.preventDefault();
        addTab(createTabWindow(path));
    };

    return (
        <div className="w-52 p-5 border-r border-gray-700 flex flex-col gap-2.5">
            {MDT_NAVIGATION.map(({ label, path, icon: Icon }) => (
                <NavLink
                    key={path}
                    to={path}
                    onClick={(event) => handleClick(event, path)}
                    className={({ isActive }) =>
                        clsx(
                            "w-full flex items-center justify-start pl-3 py-1.5 rounded-lg transition hover:bg-gray-300/20",
                            isActive
                                ? "bg-gray-300/20 text-white font-semibold"
                                : "text-gray-300"
                        )
                    }
                >
                    <Icon className="w-5 h-5 mr-3" />
                    {label}
                </NavLink>
            ))}
        </div>
    );
}
