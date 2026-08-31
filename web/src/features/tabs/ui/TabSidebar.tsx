import { NavLink } from "react-router-dom";
import clsx from "clsx";
import { MDT_NAVIGATION } from "../config/mdtNavigation";
import { createTabWindow } from "../lib/createTabWindow";
import { useTabStore } from "../model/useTabStore";
import useConfigStore from "../../../stores/configStore";
import { useLocaleStore } from "../../../stores/localeStore";

export function TabSidebar() {
    const addTab = useTabStore((state) => state.addTab);
    const dispatchEnabled = useConfigStore((state) => state.config.isDispatchEnabled);
    const strings = useLocaleStore((state) => state.strings);

    const handleClick = (event: React.MouseEvent, path: string) => {
        if (!event.ctrlKey && !event.metaKey) return;

        event.preventDefault();
        addTab(createTabWindow(path));
    };

    return (
        <nav
            aria-label="MDT sections"
            className="mdt-sidebar w-52 shrink-0 p-5 border-r border-gray-700 flex flex-col gap-2.5"
        >
            {MDT_NAVIGATION.filter((item) => dispatchEnabled || item.path !== "/dispatch").map(
                ({ label, path, icon: Icon }) => (
                    <NavLink
                        key={path}
                        to={path}
                        end={path === "/"}
                        title={label}
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
                        <span>{strings[path === "/" ? "dashboard" : path.slice(1)] || label}</span>
                    </NavLink>
                )
            )}
        </nav>
    );
}
