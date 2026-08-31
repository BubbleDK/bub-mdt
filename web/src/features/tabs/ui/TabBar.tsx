import { useTabStore } from "../model/useTabStore";
import type { TabWindow } from "../model/tabTypes";
import { createTabWindow } from "../lib/createTabWindow";
import { IconPlus, IconX } from "@tabler/icons-react";
import type { LucideProps } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
    DragOverlay,
    type DragStartEvent,
} from "@dnd-kit/core";
import { SortableContext, useSortable, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
    memo,
    useCallback,
    useMemo,
    useState,
    type ForwardRefExoticComponent,
    type RefAttributes,
} from "react";
import clsx from "clsx";

interface SortableTabProps {
    id: string;
    label: string;
    icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
    isActive: boolean;
}

const SortableTab: React.FC<SortableTabProps> = memo(({ id, label, icon: Icon, isActive }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id,
    });

    const removeTab = useTabStore((s) => s.removeTab);
    const setActiveTab = useTabStore((s) => s.setActiveTab);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : isActive ? 10 : 1,
    };

    const draggingClasses = isDragging
        ? "scale-105 opacity-90 shadow-lg cursor-grabbing"
        : "cursor-grab hover:shadow-md transition-shadow duration-150";

    return (
        <motion.div
            ref={setNodeRef}
            layout
            layoutId={id}
            style={style}
            {...attributes}
            role="group"
            tabIndex={-1}
            aria-label={`${label} tab`}
            {...listeners}
            transition={{
                layout: {
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                },
                duration: 0.2,
            }}
            className={clsx(
                "flex flex-row gap-2 px-2 border border-gray-700 rounded-lg",
                draggingClasses,
                isActive ? "bg-white/20 text-white" : "text-gray-400 hover:text-white"
            )}
        >
            <button
                aria-pressed={isActive}
                onClick={() => setActiveTab(id)}
                className="flex items-center text-sm font-medium transition rounded-t-md"
            >
                <motion.div
                    key={Icon?.displayName || Icon?.name}
                    layout
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 10, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <Icon className="w-5 h-5 mr-3" />
                </motion.div>
                {label}
            </button>
            <div className="flex items-center">
                <motion.button
                    aria-label={`Close ${label} tab`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="cursor-pointer hover:bg-white/10 hover:rounded-md"
                    onClick={() => removeTab(id)}
                >
                    <IconX color="white" size={18} />
                </motion.button>
            </div>
        </motion.div>
    );
});

const DraggedTabPreview: React.FC<SortableTabProps> = ({ id, label, icon: Icon, isActive }) => {
    return (
        <motion.div
            layoutId={id}
            className={clsx(
                "flex flex-row gap-2 px-2 py-1 border border-gray-700 rounded-lg shadow-2xl scale-105 cursor-grabbing",
                isActive ? "bg-white/20 text-white" : "text-gray-400"
            )}
        >
            <div className="flex items-center text-sm font-medium">
                <Icon className="w-5 h-5 mr-3" />
                {label}
            </div>
        </motion.div>
    );
};

export const TabBar = () => {
    const tabs = useTabStore((s) => s.tabs);
    const activeTabId = useTabStore((s) => s.activeTabId);
    const addTab = useTabStore((s) => s.addTab);
    const moveTab = useTabStore((s) => s.moveTab);
    const [activeTab, setActiveTab] = useState<TabWindow | null>(null);
    const tabIds = useMemo(() => tabs.map((tab) => tab.id), [tabs]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                delay: 150,
                tolerance: 4,
                axis: "x",
            },
        })
    );

    const handleAdd = useCallback(() => {
        addTab(createTabWindow());
    }, [addTab]);

    const handleDragEnd = useCallback(
        (event: DragEndEvent) => {
            const { active, over } = event;

            if (over && active.id !== over.id) {
                const oldIndex = tabs.findIndex((tab) => tab.id === active.id);
                const newIndex = tabs.findIndex((tab) => tab.id === over.id);

                if (oldIndex !== -1 && newIndex !== -1) {
                    moveTab(oldIndex, newIndex);
                }
            }

            setActiveTab(null);
        },
        [moveTab, tabs]
    );

    const handleDragStart = useCallback(
        (event: DragStartEvent) => {
            const dragged = tabs.find((t) => t.id === event.active.id);
            if (dragged) {
                setActiveTab(dragged);
            }
        },
        [tabs]
    );

    return (
        <div className="flex gap-2 py-1 px-4 border-b border-gray-700 w-full overflow-x-auto">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                onDragStart={handleDragStart}
            >
                <SortableContext items={tabIds} strategy={horizontalListSortingStrategy}>
                    <AnimatePresence initial={false}>
                        {tabs.map(({ id, label, icon }) => (
                            <SortableTab
                                key={id}
                                id={id}
                                label={label}
                                icon={icon}
                                isActive={id === activeTabId}
                            />
                        ))}
                    </AnimatePresence>
                </SortableContext>

                <DragOverlay dropAnimation={null}>
                    {activeTab ? (
                        <DraggedTabPreview
                            id={activeTab.id}
                            label={activeTab.label}
                            icon={activeTab.icon}
                            isActive={activeTab.id === activeTabId}
                        />
                    ) : null}
                </DragOverlay>
            </DndContext>

            <motion.button
                onClick={handleAdd}
                aria-label="Open new tab"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-sm border border-gray-700 rounded-lg"
            >
                <IconPlus color="white" size={18} />
            </motion.button>
        </div>
    );
};
