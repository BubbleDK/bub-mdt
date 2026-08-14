import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export interface TabWindow {
    id: string;
    label: string;
    icon: LucideIcon;
    component: ReactNode;
}
