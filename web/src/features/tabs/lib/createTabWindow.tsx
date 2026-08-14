import { v4 as uuidv4 } from "uuid";
import { getMdtNavigationItem } from "../config/mdtNavigation";
import type { TabWindow } from "../model/tabTypes";
import { TabContent } from "../ui/TabContent";

export function createTabWindow(initialPath = "/"): TabWindow {
    const id = uuidv4();
    const { label, icon } = getMdtNavigationItem(initialPath);

    return {
        id,
        label,
        icon,
        component: <TabContent initialPath={initialPath} tabId={id} />,
    };
}
