import {
    CarFront,
    FolderClosed,
    House,
    Radio,
    Scale,
    ScrollText,
    User,
    Users,
    type LucideIcon,
} from "lucide-react";

export interface MdtNavigationItem {
    label: string;
    path: string;
    icon: LucideIcon;
}

export const MDT_NAVIGATION: readonly MdtNavigationItem[] = [
    { label: "Home", path: "/", icon: House },
    { label: "Profiles", path: "/profiles", icon: User },
    { label: "Incidents", path: "/incidents", icon: ScrollText },
    { label: "Reports", path: "/reports", icon: FolderClosed },
    { label: "Vehicles", path: "/vehicles", icon: CarFront },
    { label: "Dispatch", path: "/dispatch", icon: Radio },
    { label: "Roster", path: "/roster", icon: Users },
    { label: "Charges", path: "/charges", icon: Scale },
];

const navigationByPath = new Map(
    MDT_NAVIGATION.map((item) => [item.path, item])
);

export function getMdtNavigationItem(path: string): MdtNavigationItem {
    const exactMatch = navigationByPath.get(path);
    if (exactMatch) return exactMatch;

    const parentRoute = MDT_NAVIGATION.find(
        (item) => item.path !== "/" && path.startsWith(`${item.path}/`)
    );

    return parentRoute ?? {
        label: "MDT",
        path,
        icon: House,
    };
}
