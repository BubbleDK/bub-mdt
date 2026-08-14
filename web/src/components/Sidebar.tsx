import { NavLink } from "react-router-dom";
import clsx from "clsx";
import {
    House,
    User,
    ScrollText,
    FolderClosed,
    CarFront,
    Radio,
    Users,
    Scale,
    type LucideProps,
} from "lucide-react";
import { useTabStore } from "../stores/tabStore";
import { BaseComponent } from "./BaseComponent";
import { v4 as uuidv4 } from "uuid";

const links = [
    { label: "Home", path: "/", icon: House },
    { label: "Profiles", path: "/profiles", icon: User },
    { label: "Incidents", path: "/incidents", icon: ScrollText },
    { label: "Reports", path: "/reports", icon: FolderClosed },
    { label: "Vehicles", path: "/vehicles", icon: CarFront },
    { label: "Dispatch", path: "/dispatch", icon: Radio },
    { label: "Roster", path: "/roster", icon: Users },
    { label: "Charges", path: "/charges", icon: Scale },
] as const;

export const Sidebar = () => {
    const addTab = useTabStore((state) => state.addTab);

    const handleClick = (
        e: React.MouseEvent,
        label: string,
        path: string,
        Icon: React.ForwardRefExoticComponent<
            Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
        >
    ) => {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();

            const id = uuidv4();

            addTab({
                id,
                label,
                icon: Icon,
                component: <BaseComponent initialPath={path} tabId={id} />,
            });
        }
    };

    return (
        <div className="w-52 p-5 border-r border-gray-700 flex flex-col gap-2.5">
            {links.map(({ label, path, icon: Icon }) => (
                <NavLink
                    key={path}
                    to={path}
                    onClick={(e) => handleClick(e, label, path, Icon)}
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
};
