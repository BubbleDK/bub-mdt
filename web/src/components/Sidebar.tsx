import { NavLink } from "react-router-dom";
import clsx from "clsx";

export const Sidebar = () => {
    const links = [
        { label: "Dashboard", path: "/" },
        { label: "Profiles", path: "/profiles" },
        { label: "Incidents", path: "/incidents" },
        { label: "Reports", path: "/reports" },
        { label: "Vehicles", path: "/vehicles" },
        { label: "Dispatch", path: "/dispatch" },
        { label: "Roster", path: "/roster" },
        { label: "Charges", path: "/charges" },
    ];

    return (
        <div className="w-48 bg-gray-800 p-2 border-r border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-4">
                Navigation
            </h2>
            <ul className="space-y-1">
                {links.map(({ label, path }) => (
                    <li key={path}>
                        <NavLink
                            to={path}
                            className={({ isActive }) =>
                                clsx(
                                    "w-full text-left px-3 py-2 rounded hover:bg-gray-700 transition",
                                    isActive
                                        ? "bg-gray-700 text-blue-400"
                                        : "text-gray-300"
                                )
                            }
                        >
                            {label}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </div>
    );
};
